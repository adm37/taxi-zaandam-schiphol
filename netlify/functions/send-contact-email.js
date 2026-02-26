exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_FORM_TO_EMAIL || 'ademsade@gmail.com';
  const fromEmail = process.env.CONTACT_FORM_FROM_EMAIL || 'onboarding@resend.dev';

  if (!resendApiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing RESEND_API_KEY' }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body || '{}');

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields are required' }),
      };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Contact] ${subject}`,
        text: `Naam: ${name}\nE-mail: ${email}\n\nBericht:\n${message}`,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Email provider error', details: errorText }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected server error' }),
    };
  }
};
