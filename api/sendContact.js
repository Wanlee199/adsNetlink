import nodemailer from 'nodemailer';
import { google } from 'googleapis';

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

    // --- Google Sheets: append submission row (timestamp, name, phone, categories) ---
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const sheetRange = process.env.GOOGLE_SHEET_RANGE || 'Sheet1!A:D';
    const clientEmail = process.env.GSA_CLIENT_EMAIL;
    const privateKey = process.env.GSA_PRIVATE_KEY;
    console.log('sheetID:', sheetId);
    console.log('clientEmail:', clientEmail);
    console.log('privateKey set:', privateKey);
    if (sheetId && clientEmail && privateKey) {
      console.log('chạy vào đây');
      try {
        const jwtClient = new google.auth.JWT(
          clientEmail,
          undefined,
          privateKey.replace(/\\n/g, '\n'),
          ['https://www.googleapis.com/auth/spreadsheets']
        );
        await jwtClient.authorize();
        console.log('✅ AUTHORIZE OK');
        const sheets = google.sheets({ version: 'v4', auth: jwtClient });
        console.log('CLIENT EMAIL:', process.env.GSA_CLIENT_EMAIL);
        console.log(
          'PRIVATE KEY OK:',
          privateKey.startsWith('-----BEGIN PRIVATE KEY-----'),
          privateKey.endsWith('-----END PRIVATE KEY-----')
        );
        console.log('PRIVATE KEY LENGTH:', privateKey.length);
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: sheetRange,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[new Date().toISOString(), name || '', phone || '', categories || '']]
          }
        });
        console.log('Appended row to Google Sheet');
      } catch (sheetErr) {
        console.error('Google Sheets append failed:', sheetErr);
        console.error(sheetErr?.response?.data || sheetErr);
        // do not block email/send response; continue
      }
    } else {
      console.log('Google Sheets env vars not set, skipping append');
    }
    // --- end Google Sheets logic ---


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