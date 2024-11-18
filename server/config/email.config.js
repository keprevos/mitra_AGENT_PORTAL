export const EMAIL_CONFIG = {
    host: 'smtp.example.com', // Replace with your SMTP server
    port: 587, // Use 465 for SSL or 587 for TLS
    secure: false, // true for SSL, false for TLS
    auth: {
        user: 'your-email@example.com', // Replace with your email
        pass: 'your-email-password', // Replace with your email password
    },
    from: 'no-reply@example.com', // Replace with your sender email
};
