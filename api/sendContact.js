import nodemailer from 'nodemailer';

export default async function (req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    console.log('sendContact body:', req.body);
    const { name, phone, categories, recaptchaToken } = req.body || {};

    if (!recaptchaToken) {
      return res.status(400).json({ error: 'missing_recaptcha' });
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET;
    console.log('envs:', {
      recaptchaSecret: !!recaptchaSecret,
      gmailUser: !!process.env.GMAIL_USER,
      receiver: !!process.env.RECEIVER_EMAIL,
    });

    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET not set');
      return res.status(500).json({ error: 'recaptcha_secret_missing' });
    }

    // ensure fetch available (Node 18+ has global fetch)
    let nodeFetch = globalThis.fetch;
    if (typeof nodeFetch !== 'function') {
      const mod = await import('node-fetch');
      nodeFetch = mod.default;
    }

    const verifyResp = await nodeFetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(recaptchaToken)}`,
      { method: 'POST' }
    );
    const verifyJson = await verifyResp.json();

    if (!verifyJson.success) {
      console.error('reCAPTCHA failed', verifyJson);
      return res.status(400).json({ error: 'recaptcha_failed', detail: verifyJson });
    }

    if (typeof verifyJson.score === 'number' && verifyJson.score < 0.5) {
      console.error('reCAPTCHA low score', verifyJson.score);
      return res.status(400).json({ error: 'recaptcha_low_score', score: verifyJson.score });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    if (!gmailUser || !gmailPass) {
      console.error('Gmail credentials missing', { gmailUser: !!gmailUser, gmailPass: !!gmailPass });
      return res.status(500).json({ error: 'mail_credentials_missing' });
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: gmailPass }
    });

    const mailOptions = {
      from: gmailUser,
      to: process.env.RECEIVER_EMAIL || gmailUser,
      subject: `Đăng ký từ ${name || 'Khách'}`,
      text: `Tên: ${name || ''}\nPhone: ${phone || ''}\nNgành: ${categories || ''}`
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('sendContact error:', err);
    return res.status(500).json({ error: 'send_failed', detail: err?.message || String(err) });
  }
}