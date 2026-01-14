package com.proceduralnexus.apiservice.controller.controllers;

import com.proceduralnexus.apiservice.business.services.EmailVerificationService;
import com.proceduralnexus.apiservice.business.services.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
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
    @PostMapping("/oauth-token")
    public ResponseEntity<?> generateOAuthToken(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Email missing"));
        }
        try {
            Profile user = userRepository.findByEmail(email).orElse(null);
            if (user == null) {
                user = new Profile();
                user.setEmail(email);
                user.setEmailVerified(true);
                user.setFirstname("");
                user.setLastname("");
                user.setPassword(""); 
                Set<Role> roles = new HashSet<>();
                Role userRole = roleRepository.findByName(RoleName.USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
                user.setRoles(roles);
                user = userRepository.save(user);
            }
            List<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .toList();
            String token = jwtUtils.generateTokenFromUsername(email);
            java.util.Map<String, Object> result = new java.util.HashMap<>();
            result.put("token", token);
            result.put("email", email);
            result.put("roles", roles);
            result.put("id", user.getId().toString());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Could not generate token"));
        }
    }
        @PostMapping("/me")
        public ResponseEntity<?> getUserInfo(@RequestBody java.util.Map<String, String> body) {
            String token = body.get("token");
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Token missing"));
            }
            try {
                String email = jwtUtils.getUserNameFromJwtToken(token);
                Profile user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
                List<String> roles = user.getRoles().stream()
                    .map(role -> role.getName().name())
                    .toList();
                java.util.Map<String, Object> result = new java.util.HashMap<>();
                result.put("email", user.getEmail());
                result.put("roles", roles);
                return ResponseEntity.ok(result);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse("Invalid token"));
            }
        }
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

    @Autowired
    com.proceduralnexus.apiservice.business.interfaces.IUserActivityService activityService;

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

            // Log login action for USER și HR (nu ADMIN)
            boolean isAdmin = false;
            Role adminRole = roleRepository.findByName(RoleName.ADMIN).orElse(null);
            if (adminRole != null) {
                isAdmin = user.getRoles().stream().anyMatch(r -> r.getId().equals(adminRole.getId()));
            }
            if (!isAdmin) {
                activityService.logActivity(userDetails.getId(), userDetails.getEmail(), "LOGIN", "User logged in");
            }

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

        // Log account creation for USER and HR (not ADMIN)
        boolean isAdmin = savedUser.getRoles().stream().anyMatch(r -> r.getName().name().equals("ADMIN"));
        if (!isAdmin) {
            activityService.logActivity(savedUser.getId(), savedUser.getEmail(), "REGISTER", "User account created");
        }

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
      // Log logout for USER and HR (not ADMIN)
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if (auth != null && auth.getPrincipal() instanceof UserDetailsImpl userDetails) {
          List<String> roles = userDetails.getAuthorities().stream().map(a -> a.getAuthority()).toList();
          boolean isAdmin = roles.contains("ADMIN");
          if (!isAdmin) {
              activityService.logActivity(userDetails.getId(), userDetails.getEmail(), "LOGOUT", "User logged out");
          }
      }
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
        @Autowired
        PasswordResetService passwordResetService;
    // Request password reset (send email)
    @PostMapping("/request-password-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        try {
            passwordResetService.createPasswordResetToken(email);
            return ResponseEntity.ok(new MessageResponse("Password reset link sent!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponse(e.getMessage()));
        }
    }

    // Confirm password reset (set new password)
    @PostMapping("/confirm-password-reset")
    public ResponseEntity<?> confirmPasswordReset(@RequestBody java.util.Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        try {
            passwordResetService.resetPassword(token, newPassword);
            return ResponseEntity.ok(new MessageResponse("Password reset successful!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse(e.getMessage()));
        }
    }
    // @GetMapping("/google")
    // public ResponseEntity<?> googleAuth() {
    //     return ResponseEntity.status(302).header("Location", "/oauth2/authorization/google").build();
    // }
}
