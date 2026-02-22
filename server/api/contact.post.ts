import { Resend } from 'resend'

export default defineEventHandler(async (event) => {
  const { name, email, mensaje } = await readBody(event)

  if (!name || !email || !mensaje) {
    throw createError({ statusCode: 400, message: 'Faltan campos obligatorios' })
  }

  const config = useRuntimeConfig()
  const resend = new Resend(config.resendApiKey)

  await resend.emails.send({
    from: 'Iberia Web <onboarding@resend.dev>',
    to: 'asociacioniberia@gmail.com',
    replyTo: email,
    subject: `Mensaje desde la web — ${name}`,
    html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <hr />
      <p>${mensaje.replace(/\n/g, '<br />')}</p>
    `,
  })

  return { ok: true }
})
