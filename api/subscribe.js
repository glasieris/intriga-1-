// api/subscribe.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, whatsapp, email, business_area, business_special } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El correo es obligatorio.' });
  }

  try {
    const audienceId = '26265d73-7751-4229-8291-9430bfaa0a36'; // ID intriga 1

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY no está definida');
      return res.status(500).json({ error: 'Config de servidor incompleta.' });
    }

    const response = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        firstName: name,
        audienceId,
        // Por ahora NO enviamos properties extra
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error desde Resend:', data);
      return res.status(500).json({ error: 'No se pudo guardar el contacto.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creando contacto en Resend', error);
    return res
      .status(500)
      .json({ error: 'Hubo un problema guardando tus datos. Inténtalo más tarde.' });
  }
}
