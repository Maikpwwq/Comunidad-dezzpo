import type { Context } from 'hono'

export async function emailNotificationHandler(c: Context) {
    try {
        const body = await c.req.json()
        const { type, email, data } = body

        if (!type || !email) {
            return c.json({ error: 'type and email are required' }, 400)
        }

        const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_APP_RESEND_API_KEY
        if (!resendApiKey) {
            console.warn('[Notifications API] RESEND_API_KEY not configured. Mocking success.')
            return c.json({ success: true, mocked: true, message: 'Email mock sent successfully' })
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

        let subject = ''
        let html = ''

        if (type === 'matching_alert') {
            const { comercianteName = 'Comerciante', requirementTitle = 'Nuevo Requerimiento', requirementZone = 'Bogotá', requirementUrl = 'https://comunidad-dezzpo.vercel.app' } = data || {}
            subject = `¡Nuevo requerimiento disponible en ${requirementZone}! — Comunidad Dezzpo`
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://comunidad-dezzpo.vercel.app/assets/img/logo/Logo-Comunidad-Dezzpo.png" alt="Comunidad Dezzpo" style="width: 150px;" />
                    </div>
                    <h2 style="color: #2e7d32; text-align: center;">¡Hola, ${comercianteName}!</h2>
                    <p style="font-size: 16px; color: #333; line-height: 1.5;">
                        Se ha publicado un nuevo requerimiento que coincide con tu especialidad en tu zona de cobertura:
                    </p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2e7d32;">
                        <h3 style="margin-top: 0; color: #333;">${requirementTitle}</h3>
                        <p style="margin-bottom: 0; color: #666; font-size: 14px;"><strong>Zona:</strong> ${requirementZone}</p>
                    </div>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="${requirementUrl}" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Ver Requerimiento</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        Recibiste este correo porque estás registrado como comerciante verificado en Comunidad Dezzpo.<br />
                        Bogotá, Colombia.
                    </p>
                </div>
            `
        } else if (type === 'weekly_digest') {
            const { comercianteName = 'Comerciante', viewsCount = 0, micrositioUrl = 'https://comunidad-dezzpo.vercel.app' } = data || {}
            subject = `Tu resumen semanal de visitas — Comunidad Dezzpo`
            html = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://comunidad-dezzpo.vercel.app/assets/img/logo/Logo-Comunidad-Dezzpo.png" alt="Comunidad Dezzpo" style="width: 150px;" />
                    </div>
                    <h2 style="color: #2e7d32; text-align: center;">¡Hola, ${comercianteName}!</h2>
                    <p style="font-size: 16px; color: #333; line-height: 1.5;">
                        Tu micrositio profesional ha estado activo esta semana. Aquí tienes tus estadísticas de visibilidad:
                    </p>
                    <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                        <span style="font-size: 48px; font-weight: bold; color: #2e7d32; display: block;">${viewsCount}</span>
                        <span style="font-size: 16px; color: #555;">visitas a tu perfil esta semana</span>
                    </div>
                    <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
                        Mantener tu portafolio actualizado con tus últimos trabajos aumenta tus posibilidades de ser contratado.
                    </p>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="${micrositioUrl}" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">Ver mi Perfil Público</a>
                    </p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        Recibiste este correo porque eres miembro del gremio Comunidad Dezzpo.<br />
                        Bogotá, Colombia.
                    </p>
                </div>
            `
        } else {
            return c.json({ error: `Invalid notification type: ${type}` }, 400)
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${resendApiKey}`
            },
            body: JSON.stringify({
                from: fromEmail,
                to: email,
                subject: subject,
                html: html
            })
        })

        if (!response.ok) {
            const errText = await response.text()
            console.error('[Notifications API] Resend email sending failed:', errText)
            return c.json({ error: `Email sending failed: ${errText}` }, 500)
        }

        const resData = await response.json()
        return c.json({ success: true, data: resData })

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error('[Notifications API] Route handler error:', message)
        return c.json({ error: message || 'Notification route failed' }, 500)
    }
}
