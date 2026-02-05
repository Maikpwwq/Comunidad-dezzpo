/**
 * Organization Contact Configuration
 * Single source of truth for contact details.
 */
export const contactConfig = {
    phone: {
        display: '+57 320 484 2897',
        value: '573204842897',
        icon: 'TelefonoContactoIcono',
        link: 'https://wa.me/573204842897?text=Hola%20estoy%20interesado%20en%20saber%20acerca%20de%20como%20Dezzpo%20...',
        label: 'Office'
    },
    email: {
        display: 'comunidad.dezzpo@gmail.com',
        icon: 'EmailIcono', // Matches IcoMoon selection
        link: 'mailto:comunidad.dezzpo@gmail.com'
    },
    address: {
        display: 'Bogotá, Colombia', // Short display for footer
        fullAddress: ['Dirección Cll 159 No. 8c-45', 'Piso 5'], // Detailed for page
        icon: 'DireccionDomicilioIcono', // Matches IcoMoon selection
        link: 'https://maps.google.com/?q=Calle+159+No+8c-45+Bogota' // Placeholder/Approx
    }
}
