/* eslint-disable max-len */
export function getVerifyUserTemplate(pinCode: string) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>You're Verification</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px; color: #333;">
      <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #0056b3; text-align: center;">You're Invited!</h2>
          <p>Hi there,</p>
          <p>We’re excited to invite you to join us. Use the PIN code below to verify your account:</p>
          <p style="text-align: center; font-size: 24px; font-weight: bold; color: #0056b3;">${pinCode}</p>
          <p>If you didn’t expect this invitation, please ignore this email.</p>
          <p style="margin-top: 30px;">Best regards,<br>The Team</p>
      </div>
  </body>
  </html>
    `;
}
