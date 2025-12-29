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
    const rawKey = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6g5s9stETEkI8\nH6BUzHNHIqVdukbjWeSwb2i0x5j4NTyxVc6SST7o3PvA2+TRST7w3/trTp3uCuIG\nOgMJ9iqvS5/kZy7gzOv6E9bQHtVF/xLOTNnSPAzm8DUp3fV7SgEOEkksZZCmUbQL\n59NgYet0zaNbvbc5IPIAY5M5ymQQDdUA4dGkOmp4e1iZVT55dS8OdjzCffFh+KMS\nG+XA+YdWlBGY1uFFV7jMSE1tEf5YzymBqJZSrxosaYXyMmZTSkOPJOrkw9Uo+vvY\n8tRR0uKOyOaX5x317gZ/ZJiT+7sXjZ1E12wD+vYV2rUCm8QL/G94OSt9Deh5ig8a\nI7GQgRBxAgMBAAECggEADeFOaRczdPe2YygNXqd/wAr62HtM3Dgr4ITMpit2cv5E\nlS6Sur3lscmu7el6C/3R8nYQt/8imfzzA3icvPM2C6k/7cJPXEkTxJ67rUL7fIPg\n1TvQjVM3uJX8DDC+8d0OMAsPU/+o9fT9m6c1yqXu3QM9Ws3xt+LU76TOvOMWyD+b\nuHRLT/6m1KC9Kuuckc1dNcma4yfNyCWNXAgF0EMGG40RjFstd1NwG8YNaeYnZKIS\nRYDC4ZuHD5CX5Irp0XT8E3bMBp3uTJOXfA9uPoG0/046ryhgcqMz5o/PupfT2Auo\nDYxbPw9qzvWLSB70GR8nKLCe7hhhOSTDrOVP4EByuwKBgQD9mvpJRIXs3fUIqmip\n0ORd0wjTN8UCjfY6jUvr51A76jMmu87YfF2H/Afgfv2oKA/OibgI4qrUmOFRkLmg\nSTCkgH3goYxgDpKwh92NgdSYpi39/mPALUrnHyWDglTfxCPZIuEpEXwfezzj4QAP\n+/ssTZApKXxPAJy3/uNuPs3PXwKBgQC8RnQllQuExXCeWl09vYnqD3omOByEfK8x\n0gNc0l10Q9a1F4Thk0JktuiFoznTOQrtf25J1Ej/eMNYUfZqHGTu6fgRIC6ihg9x\nm8wvvyNUHf4WiK2mW8Qec8dkGM4NXR1se2Hv3pfmcd26TGarMlQg6HKP+/cLg2h9\nd8XuQa7CLwKBgQCw0uEWOufiOvRBoYeud87yuFUb6HO+DzuSobhA+JyR2f7mT+au\nPTB9wzW+yuyT1bMHwDCISXrxFtNrqqwy3TVETa7288zLoP2YhnLs2oxgDuZchYYJ\nlcr3EVl3s2T4TGruWAqENwPDc4sGHHiNrJT50+7jNGDPOM8M33S2BqY7owKBgCvb\n8cSrguJsKD8LZ/sxA0a+UkNDAQmwDhP6C4R9EP47q3HGR9NQvb++iE5RZvAYsr3+\n2I9kX5j75e3WMiQn9y9c28gJijOcLU7W72sUCMPYtM9FCcbeS8KYUBO2X5HnZipW\nV8tMPHCXiAKVN7mb4NNFsyJtnPBWrWnFFBvbuz1LAoGAY2A+/yHYCd0gz9NxgEE1\nOs3jhcnrzpzt5NQ5Zpn9vSuoazXxZA6cjl04ViwalUiSsG+wVUr7hxod0rmt+8oU\njaQTzjS7xv4pNMRYdeSEJbsC1+Oxeek3xjBIgCke4DbcJp0IraACpgjSpnQZpDYt\nUAyHpXUSBS+jeQ2dCK8YbiI=\n-----END PRIVATE KEY-----\n";
    if (!rawKey) throw new Error('GSA_PRIVATE_KEY is missing');

    if (sheetId && clientEmail && rawKey) {
      const formattedKey = rawKey
      .replace(/\\n/g, '\n')
      .replace(/"/g, '') 
      .trim();
      try {
        const jwtClient = new google.auth.JWT(
          clientEmail,
          undefined,
          formattedKey,
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