package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.services.EmailVerificationService;
import com.proceduralnexus.apiservice.data.entities.Profile;
import com.proceduralnexus.apiservice.data.entities.Role;
import com.proceduralnexus.apiservice.data.entities.RoleName;
import com.proceduralnexus.apiservice.data.payloads.JwtResponse;
import com.proceduralnexus.apiservice.data.payloads.LoginRequest;
import com.proceduralnexus.apiservice.data.payloads.MessageResponse;
import com.proceduralnexus.apiservice.data.payloads.RegisterRequest;
import com.proceduralnexus.apiservice.data.repositories.ProfileRepository;
import com.proceduralnexus.apiservice.data.repositories.RoleRepository;
import com.proceduralnexus.apiservice.security.JwtUtils;
import com.proceduralnexus.apiservice.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    ProfileRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    EmailVerificationService emailVerificationService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            // Check if email is verified
            Profile user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (!user.isEmailVerified()) {
                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Please verify your email address before logging in. Check your inbox for the verification link."));
            }

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<String> roles = userDetails.getAuthorities().stream()
                    .map(item -> item.getAuthority())
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getEmail(),
                    roles));
        } catch (AuthenticationException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new MessageResponse("Invalid email or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account with email_verified = false
        Profile user = new Profile();
        user.setFirstname(signUpRequest.getFirstname());
        user.setLastname(signUpRequest.getLastname());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setEmailVerified(false); // Email not verified yet

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(RoleName.USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "hr":
                        Role modRole = roleRepository.findByName(RoleName.HR)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(RoleName.USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        Profile savedUser = userRepository.save(user);

        // Send verification email
        try {
            emailVerificationService.sendVerificationEmail(savedUser.getId(), savedUser.getEmail());
        } catch (Exception e) {
            // Log the error but don't fail registration
            System.err.println("Failed to send verification email: " + e.getMessage());
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully! Please check your email to verify your account."));
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
      return ResponseEntity.ok(new MessageResponse("Log out successful!"));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        EmailVerificationService.VerificationResult result = emailVerificationService.verifyEmail(token);
        
        if (result.isSuccess()) {
            return ResponseEntity.ok(new MessageResponse(result.getMessage()));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse(result.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestParam String email) {
        boolean sent = emailVerificationService.resendVerificationEmail(email);
        
        if (sent) {
            return ResponseEntity.ok(new MessageResponse("Verification email sent successfully. Please check your inbox."));
        } else {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Unable to send verification email. Email may not exist or is already verified."));
        }
    }

    // @GetMapping("/google")
    // public ResponseEntity<?> googleAuth() {
    //     return ResponseEntity.status(302).header("Location", "/oauth2/authorization/google").build();
    // }
}
