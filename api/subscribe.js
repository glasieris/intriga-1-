// api/subscribe.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, whatsapp, email, business_area, business_special } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El correo es obligatorio.' });
  }

  try {
    const audienceId = '26265d73-7751-4229-8291-9430bfaa0a36'; // pega aquí el ID real de la audiencia intriga 1

    await resend.contacts.create({
      email,
      firstName: name,
      audienceId,
      properties: {
        whatsapp,
        business_area,
        business_special,
      },
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error creando contacto en Resend', error);
    return res
      .status(500)
      .json({ error: 'Hubo un problema guardando tus datos. Inténtalo más tarde.' });
  }
}
