package com.examly.springapp.service;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class UserService {

private final UserRepository userRepository;
private final JavaMailSender mailSender;

@Value("${EMAIL_USER}")
private String fromEmail;

public User registerUser(User user) throws MessagingException {
Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
if (existingUser.isPresent()) {
return existingUser.get(); 
}
String token = UUID.randomUUID().toString();
user.setVerificationToken(token);
user.setVerified(false);
User savedUser = userRepository.save(user);

sendVerificationEmail(savedUser);

return savedUser;
}

public void sendVerificationEmail(User user) throws MessagingException {
String to = user.getEmail();
String subject = "Verify your email";
String verificationLink = "https://8080-cbaacefbecfdaacedbdfdaffabfbdede.premiumproject.examly.io/api/verify?token=" + user.getVerificationToken();

String content = "<p>Hello,</p>"
+ "<p>Click the button below to verify your email:</p>"
+ "<a href=\"" + verificationLink + "\"><button>Click here to verify your email</button></a>";

MimeMessage message = mailSender.createMimeMessage();
MimeMessageHelper helper = new MimeMessageHelper(message, true);

helper.setFrom(fromEmail);
helper.setTo(to);
helper.setSubject(subject);
helper.setText(content, true);

mailSender.send(message);
}

public boolean verifyToken(String token) {
Optional<User> userOpt = userRepository.findByVerificationToken(token);
if (userOpt.isPresent()) {
User user = userOpt.get();
user.setVerified(true);
user.setVerificationToken(null); 
userRepository.save(user);
return true;
}
return false;
}

public boolean authenticateUser(String email, String password) {
    return userRepository.findByEmailAndPasswordAndVerifiedTrue(email, password).isPresent();
    }

}