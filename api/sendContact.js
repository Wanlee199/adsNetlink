const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, phone, categories, recaptchaToken } = req.body || {};

    if (!recaptchaToken) {
      return res.status(400).json({ error: 'missing_recaptcha' });
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET not set');
      return res.status(500).json({ error: 'recaptcha_secret_missing' });
    }

    // Verify reCAPTCHA (v3 or v2 token)
    const verifyResp = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`,
      { method: 'POST' }
    );
    const verifyJson = await verifyResp.json();

    if (!verifyJson.success) {
      console.error('reCAPTCHA failed', verifyJson);
      return res.status(400).json({ error: 'recaptcha_failed', detail: verifyJson });
    }

    // For v3, optionally check score threshold
    if (typeof verifyJson.score === 'number' && verifyJson.score < 0.5) {
      console.error('reCAPTCHA low score', verifyJson.score);
      return res.status(400).json({ error: 'recaptcha_low_score', score: verifyJson.score });
    }

    // Prepare transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.RECEIVER_EMAIL || process.env.GMAIL_USER,
      subject: `Đăng ký từ ${name || 'Khách'}`,
      text: `Tên: ${name || ''}\nPhone: ${phone || ''}\nNgành: ${categories || ''}`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('sendContact error:', err);
    return res.status(500).json({ error: 'send_failed', detail: err.message });
  }
};
