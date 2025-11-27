package com.proceduralnexus.apiservice.security;

import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.entities.Role;
import com.proceduralnexus.apiservice.data.entities.RoleName;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import com.proceduralnexus.apiservice.data.repositories.RoleRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String firstName = oAuth2User.getAttribute("given_name");
        String lastName = oAuth2User.getAttribute("family_name");

        Optional<Profile> profileOptional = profileRepository.findByEmail(email);
        Profile profile;

        if (profileOptional.isPresent()) {
            profile = profileOptional.get();
        } else {
            profile = new Profile();
            profile.setEmail(email);
            profile.setFirstname(firstName != null ? firstName : "Google");
            profile.setLastname(lastName != null ? lastName : "User");
            profile.setEmailVerified(true);
            profile.setPassword(UUID.randomUUID().toString());

            Set<Role> roles = new HashSet<>();
            Role userRole = roleRepository.findByName(RoleName.USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
            profile.setRoles(roles);

            profileRepository.save(profile);
        }

        String jwt = jwtUtils.generateTokenFromUsername(email);

        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:80/oauth2/redirect")
                .queryParam("token", jwt)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
