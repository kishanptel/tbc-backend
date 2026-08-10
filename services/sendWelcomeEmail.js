const sendEmail = require("./sendMail");

async function sendWelcomeEmail(to, name) {
    const subject = `Welcome to theblissco, ${name}! 🌸✨`;

    // Plain text fallback for email clients that do not support HTML
    const text = `Hi ${name},\n\n` +
        `Welcome to theblissco! We are absolutely thrilled to welcome you to our floral family.\n\n` +
        `At theblissco, we craft everlasting happiness with handcrafted crochet flower bouquets, custom keychains, sweet goodies, and personalized floral arrangements.\n\n` +
        `Here is a summary of your account details:\n` +
        `- Registered Email: ${to}\n` +
        `- Studio Location: Surat, Gujarat, India\n` +
        `- Contact Support: patelshruti0728@gmail.com\n\n` +
        `Explore our Floral Collections to create your custom bouquet or find the perfect gift.\n\n` +
        `Crafted with love,\n` +
        `The Bliss Co Team`;

    // Elegant Website Palette Email Template (Dusty Rose Mauve #8b4453 & Blush Cream)
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to theblissco</title>
        <style>
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                height: 100% !important;
                width: 100% !important;
                background-color: #ffffff !important;
                color: #2c181c;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
            }
            body, table, td, a, p, span, h1, h2, h3 {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
                -webkit-text-size-adjust: 100%;
                -ms-text-size-adjust: 100%;
            }
            table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
            img { -ms-interpolation-mode: bicubic; border: 0; height: auto; outline: none; text-decoration: none; }
            
            .wrapper {
                width: 100%;
                margin: 0 !important;
                padding: 0 !important;
                background-color: #ffffff;
            }
            .container {
                max-width: 600px;
                margin: 0 auto !important;
                background-color: #ffffff;
                border: 1px solid rgba(139, 68, 83, 0.18);
                border-radius: 12px;
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #662f3c 0%, #8b4453 100%);
                color: #ffffff;
                padding: 26px 24px 22px !important;
                text-align: center;
            }
            .logo-text {
                font-size: 26px;
                font-weight: 800;
                letter-spacing: -0.02em;
                margin: 0;
                color: #ffffff;
            }
            .header-subtitle {
                font-size: 12.5px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.12em;
                color: #ffffff;
                margin: 4px 0 0;
                opacity: 0.92;
            }
            .body-content {
                padding: 24px 24px 16px !important;
                background-color: #ffffff;
            }
            .greeting {
                font-size: 20px;
                font-weight: 800;
                margin: 0 0 12px;
                color: #8b4453;
            }
            .paragraph {
                font-size: 14.5px;
                line-height: 1.6;
                color: #332226;
                margin: 0 0 18px;
            }
            .details-box {
                background-color: #fdf5f5;
                border: 1px solid rgba(139, 68, 83, 0.15);
                border-left: 4px solid #8b4453;
                border-radius: 8px;
                padding: 16px 18px;
                margin-bottom: 20px;
            }
            .details-title {
                font-size: 13px;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                margin: 0 0 10px;
                color: #662f3c;
            }
            .detail-row {
                font-size: 13.5px;
                margin: 6px 0;
                color: #332226;
            }
            .detail-label {
                font-weight: 700;
                color: #662f3c;
                margin-right: 6px;
            }
            .cta-area {
                text-align: center;
                margin: 24px 0 16px;
            }
            .cta-btn {
                display: inline-block;
                background: linear-gradient(135deg, #8b4453 0%, #9e4f61 100%);
                color: #ffffff !important;
                text-decoration: none;
                font-size: 14.5px;
                font-weight: 800;
                padding: 12px 30px;
                border-radius: 50px;
                box-shadow: 0 4px 16px rgba(139, 68, 83, 0.28);
            }
            .footer {
                text-align: center;
                padding: 16px 20px !important;
                background-color: #fdf5f5;
                border-top: 1px solid rgba(139, 68, 83, 0.1);
                font-size: 12px;
                line-height: 1.5;
                color: #662f3c;
            }
        </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div class="wrapper">
            <div class="container">
                <!-- Header -->
                <div class="header">
                    <img src="https://res.cloudinary.com/llzw1dmz/image/upload/v1786053620/theblissco_assets/theblissco_official_logo.jpg" alt="theblissco logo" width="68" height="68" style="width: 68px; height: 68px; border-radius: 50%; object-fit: cover; border: 2px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.18); margin-bottom: 8px; display: inline-block;" />
                    <h1 class="logo-text" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">theblissco 🌸</h1>
                    <p class="header-subtitle" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Crafting Everlasting Floral Moments</p>
                </div>
                
                <!-- Main Body -->
                <div class="body-content">
                    <h2 class="greeting" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Hi ${name},</h2>
                    <p class="paragraph" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                        Welcome to <strong>theblissco</strong> family! We are thrilled to have you here. From handcrafted crochet flower bouquets and cute keychains to custom sweet goodies, every creation is made with love and attention to detail.
                    </p>
                    
                    <!-- Details Info Box -->
                    <div class="details-box">
                        <h3 class="details-title" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Account Details</h3>
                        <div class="detail-row" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                            <span class="detail-label">Registered Email:</span>
                            <span>${to}</span>
                        </div>
                        <div class="detail-row" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                            <span class="detail-label">Studio Location:</span>
                            <span>Surat, Gujarat, India</span>
                        </div>
                        <div class="detail-row" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                            <span class="detail-label">Customer Support:</span>
                            <span>patelshruti0728@gmail.com</span>
                        </div>
                    </div>
                    
                    <p class="paragraph" style="margin-bottom: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                        Ready to find your favorite bouquet or build your custom flower arrangement? Explore our interactive studio today!
                    </p>
                    
                    <!-- CTA Button -->
                    <div class="cta-area">
                        <a href="http://localhost:5173/products" class="cta-btn" target="_blank" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Explore Products</a>
                    </div>
                </div>
                
                <!-- Footer -->
                <div class="footer" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                    <p style="margin: 0 0 4px;">Need help? Reach out at <a href="mailto:patelshruti0728@gmail.com" style="color: #8b4453; text-decoration: none; font-weight: 700;">patelshruti0728@gmail.com</a></p>
                    <p style="margin: 0;">&copy; 2026 theblissco. All rights reserved.</p>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    return await sendEmail(to, subject, text, html);
}

module.exports = sendWelcomeEmail;
