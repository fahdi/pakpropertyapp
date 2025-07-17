const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Email templates
const emailTemplates = {
  emailVerification: (data) => ({
    subject: 'Verify Your Email - PakProperty',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to PakProperty!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>Thank you for registering with PakProperty. To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
              <a href="${data.verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${data.verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with PakProperty, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 PakProperty. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset - PakProperty',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <p style="text-align: center;">
              <a href="${data.resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p>${data.resetUrl}</p>
            <p>This link will expire in 10 minutes.</p>
            <p>If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 PakProperty. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  inquiryNotification: (data) => ({
    subject: 'New Property Inquiry - PakProperty',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Inquiry</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .property-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .inquiry-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Property Inquiry</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.ownerName},</h2>
            <p>You have received a new inquiry for your property listing.</p>
            
            <div class="property-info">
              <h3>Property Details:</h3>
              <p><strong>Title:</strong> ${data.propertyTitle}</p>
              <p><strong>Location:</strong> ${data.propertyLocation}</p>
              <p><strong>Rent:</strong> ${data.propertyRent}</p>
            </div>
            
            <div class="inquiry-info">
              <h3>Inquiry Details:</h3>
              <p><strong>From:</strong> ${data.tenantName}</p>
              <p><strong>Phone:</strong> ${data.tenantPhone}</p>
              <p><strong>Email:</strong> ${data.tenantEmail}</p>
              <p><strong>Message:</strong> ${data.message}</p>
            </div>
            
            <p>Please respond to this inquiry within 24 hours to maintain good response rates.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 PakProperty. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  welcomeEmail: (data) => ({
    subject: 'Welcome to PakProperty!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to PakProperty</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .feature { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to PakProperty!</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>Welcome to Pakistan's leading property rental platform! We're excited to have you on board.</p>
            
            <div class="feature">
              <h3>🎯 What you can do:</h3>
              <ul>
                <li>Search and filter properties by location, price, and amenities</li>
                <li>Save your favorite properties for later</li>
                <li>Contact property owners directly</li>
                <li>Get notifications about new properties</li>
              </ul>
            </div>
            
            <div class="feature">
              <h3>🏠 Ready to list your property?</h3>
              <p>If you're a property owner or agent, you can start listing your properties right away!</p>
            </div>
            
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 PakProperty. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  propertyUpdate: (data) => ({
    subject: 'Property Update - PakProperty',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Property Update</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .update-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Property Update</h1>
          </div>
          <div class="content">
            <h2>Hello ${data.name},</h2>
            <p>Your property listing has been updated successfully.</p>
            
            <div class="update-info">
              <h3>Property Details:</h3>
              <p><strong>Title:</strong> ${data.propertyTitle}</p>
              <p><strong>Location:</strong> ${data.propertyLocation}</p>
              <p><strong>Status:</strong> ${data.status}</p>
              <p><strong>Updated:</strong> ${data.updatedAt}</p>
            </div>
            
            <p>Your property is now visible to potential tenants.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 PakProperty. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async ({ email, subject, html, template, data }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html };
    }

    const mailOptions = {
      from: `"PakProperty" <${process.env.SMTP_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send bulk emails
const sendBulkEmail = async (emails, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data);
    
    const promises = emails.map(email => {
      const mailOptions = {
        from: `"PakProperty" <${process.env.SMTP_USER}>`,
        to: email,
        subject: emailContent.subject,
        html: emailContent.html
      };
      return transporter.sendMail(mailOptions);
    });

    const results = await Promise.allSettled(promises);
    const successful = results.filter(result => result.status === 'fulfilled');
    const failed = results.filter(result => result.status === 'rejected');

    console.log(`Bulk email sent: ${successful.length} successful, ${failed.length} failed`);
    return { 
      success: true, 
      successful: successful.length, 
      failed: failed.length 
    };
  } catch (error) {
    console.error('Bulk email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Send inquiry notification
const sendInquiryNotification = async (inquiry, property, tenant) => {
  const data = {
    ownerName: property.owner.firstName,
    propertyTitle: property.title,
    propertyLocation: property.fullAddress,
    propertyRent: `${property.currency} ${property.rent.toLocaleString()}`,
    tenantName: tenant.fullName,
    tenantPhone: tenant.phone,
    tenantEmail: tenant.email,
    message: inquiry.message
  };

  return await sendEmail({
    email: property.owner.email,
    template: 'inquiryNotification',
    data
  });
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
  const data = {
    name: user.firstName
  };

  return await sendEmail({
    email: user.email,
    template: 'welcomeEmail',
    data
  });
};

// Send property update notification
const sendPropertyUpdateEmail = async (user, property) => {
  const data = {
    name: user.firstName,
    propertyTitle: property.title,
    propertyLocation: property.fullAddress,
    status: property.status,
    updatedAt: new Date().toLocaleDateString()
  };

  return await sendEmail({
    email: user.email,
    template: 'propertyUpdate',
    data
  });
};

module.exports = {
  sendEmail,
  sendBulkEmail,
  sendInquiryNotification,
  sendWelcomeEmail,
  sendPropertyUpdateEmail
}; 