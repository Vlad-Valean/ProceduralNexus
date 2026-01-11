package com.proceduralnexus.apiservice.business.services;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @Value("${app.base.url}")
    private String baseUrl;

    /**
     * Send email verification link to user
     */
    public void sendVerificationEmail(String toEmail, String token) {
        String subject = "[ProceduralNexus] Verify your account";
        String verificationUrl = baseUrl + "/verify-email?token=" + token;
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Welcome to ProceduralNexus!</h2>
                <p>Hello,</p>
                <p>Please verify your account by clicking the link below:</p>
                <p><a href="%s" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
                <p>Or copy and paste this link in your browser:</p>
                <p>%s</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you did not create an account, please ignore this email.</p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            verificationUrl, verificationUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send document request notification
     */
    public void sendDocumentRequestEmail(String toEmail, String userName, String organizationName, String documentType) {
        String subject = "[ProceduralNexus] Additional document required";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Document Request</h2>
                <p>Hello %s,</p>
                <p>The organization <strong>%s</strong> has requested an additional document from you:</p>
                <p><strong>Document Type:</strong> %s</p>
                <p>Please log in to your account to upload the requested document.</p>
                <p><a href="%s/login" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            userName, organizationName, documentType, baseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send application accepted notification
     */
    public void sendApplicationAcceptedEmail(String toEmail, String userName, String organizationName) {
        String subject = "[ProceduralNexus] Application accepted";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Congratulations!</h2>
                <p>Hello %s,</p>
                <p>Your application to <strong>%s</strong> has been <span style="color: green; font-weight: bold;">ACCEPTED</span>.</p>
                <p>You can now proceed with the next steps in the process.</p>
                <p><a href="%s/login" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">View Details</a></p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            userName, organizationName, baseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send application rejected notification
     */
    public void sendApplicationRejectedEmail(String toEmail, String userName, String organizationName, String reason) {
        String subject = "[ProceduralNexus] Application rejected";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Application Update</h2>
                <p>Hello %s,</p>
                <p>We regret to inform you that your application to <strong>%s</strong> has been <span style="color: red; font-weight: bold;">REJECTED</span>.</p>
                %s
                <p>You can reapply in the future if you meet the requirements.</p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            userName, organizationName, 
            reason != null && !reason.isEmpty() ? "<p><strong>Reason:</strong> " + reason + "</p>" : ""
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send document approved notification
     */
    public void sendDocumentApprovedEmail(String toEmail, String userName, String documentName) {
        String subject = "[ProceduralNexus] Document approved";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Document Approved</h2>
                <p>Hello %s,</p>
                <p>Your document <strong>%s</strong> has been <span style="color: green; font-weight: bold;">APPROVED</span>.</p>
                <p><a href="%s/login" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">View Document</a></p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            userName, documentName, baseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send document requires changes notification
     */
    public void sendDocumentRequiresChangesEmail(String toEmail, String userName, String documentName, String feedback) {
        String subject = "[ProceduralNexus] Document requires changes";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Document Review</h2>
                <p>Hello %s,</p>
                <p>Your document <strong>%s</strong> requires some changes before approval.</p>
                %s
                <p>Please review the feedback and upload a corrected version.</p>
                <p><a href="%s/login" style="display: inline-block; padding: 10px 20px; background-color: #ffc107; color: black; text-decoration: none; border-radius: 5px;">Upload Corrected Document</a></p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            userName, documentName,
            feedback != null && !feedback.isEmpty() ? "<p><strong>Feedback:</strong> " + feedback + "</p>" : "",
            baseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send organization addition notification
     */
    public void sendOrganizationAdditionEmail(String toEmail, String userName, String organizationName, String role) {
        String subject = "[ProceduralNexus] Added to organization";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Welcome to the Team!</h2>
                <p>Hello %s,</p>
                <p>You have been added to the organization <strong>%s</strong> as a <strong>%s</strong>.</p>
                <p>You can now access the organization's dashboard and manage applications.</p>
                <p><a href="%s/login" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            userName, organizationName, role, baseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send password changed notification
     */
    public void sendPasswordChangedEmail(String toEmail, String userName) {
        String subject = "[ProceduralNexus] Password changed";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Security Alert</h2>
                <p>Hello %s,</p>
                <p>Your password has been successfully changed.</p>
                <p>If you did not make this change, please contact our support team immediately.</p>
                <p><a href="%s/login" style="display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px;">Secure My Account</a></p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            userName, baseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Send organization creation notification to owner
     */
    public void sendOrganizationCreatedEmail(String toEmail, String ownerName, String organizationName) {
        String subject = "[ProceduralNexus] Organization created";
        
        String body = String.format(
            """
            <html>
            <body>
                <h2>Organization Successfully Created</h2>
                <p>Hello %s,</p>
                <p>Your organization <strong>%s</strong> has been successfully created!</p>
                <p>You are now the owner and can start managing your organization.</p>
                <p><a href="%s/login" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Manage Organization</a></p>
                <br>
                <p>Best regards,<br>ProceduralNexus Team</p>
            </body>
            </html>
            """,
            ownerName, organizationName, baseUrl
        );

        sendEmail(toEmail, subject, body);
    }

    /**
     * Core method to send HTML emails
     */
    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email to: " + to, e);
        }
    }
}
