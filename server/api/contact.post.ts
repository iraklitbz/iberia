import nodemailer from 'nodemailer'

interface ContactBody {
  name: string
  email: string
  texto: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<ContactBody>(event)

  // Validación básica
  if (!body?.name?.trim() || !body?.email?.trim() || !body?.texto?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Faltan campos obligatorios',
    })
  }

  // Validación de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(body.email)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email no válido',
    })
  }

  // Las credenciales vienen de .env → runtimeConfig (nunca expuestas al cliente)
  if (!config.emailUser || !config.emailPass || !config.contactTo) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuración de email incompleta',
    })
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: config.emailUser,
      pass: config.emailPass,
    },
  })

  await transporter.sendMail({
    from: `"Iberia Web" <${config.emailUser}>`,
    replyTo: body.email,
    to: config.contactTo,
    subject: `Mensaje de ${body.name} — iberiainfo.org`,
    html: `
      <table style="width:100%;max-width:600px;margin:0 auto;font-family:sans-serif;background:#f9f9f9;padding:32px;border-radius:12px;">
        <tr>
          <td style="background:#fff;border-radius:8px;padding:32px;border:1px solid #eee;">
            <h2 style="color:#c8102e;margin:0 0 24px;">Nuevo mensaje desde iberiainfo.org</h2>
            <p style="margin:0 0 8px;color:#666;font-size:14px;"><strong>Nombre:</strong> ${escapeHtml(body.name)}</p>
            <p style="margin:0 0 24px;color:#666;font-size:14px;"><strong>Email:</strong> ${escapeHtml(body.email)}</p>
            <div style="background:#f5f5f5;border-radius:8px;padding:20px;">
              <p style="margin:0;color:#333;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(body.texto)}</p>
            </div>
            <p style="margin:24px 0 0;color:#999;font-size:12px;">Enviado desde el formulario de contacto de iberiainfo.org</p>
          </td>
        </tr>
      </table>
    `,
  })

  return { success: true }
})

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
