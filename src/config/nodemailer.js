const nodemailer = require('nodemailer')
const settings = require('../config/command/commander')

const MAIL = settings.nodemailer_user
const PASSWORD = settings.nodemailer_password

const sendMail = async (subject, body) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: MAIL,
      pass: PASSWORD
    }
  })

  const mailOptions = {
    from: 'Servidor AS',
    to: toEmail || MAIL,
    subject: subject,
    html: body
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw error;
  }
}

const purchaseMailReject = (user) => ({
  from: `Shop Server AS <${MAIL}>`,
  to: user.email,
  subject: 'Purchase Reject Order',
  html: `<div>
           <h1>Lo sentimos ${user.email}</h1>
           <p>No se pudo procesar su compra</p>
         </div>`,
  attachments: [],
})

const purchaseMail = () => (user, result) ({
  from: `Shop Server AS <${MAIL}>`,
  to: user.email,
  subject: 'Purchase Order',
  html: `<div>
                 <h1>Gracias ${user.email} por su compra</h1>
                 <p>Total: ${result.amount}</p>
               </div>`,
  attachments: []
})

const registerMail = () => (user) ({
  from: `SWISH ${MAIL}`,
  to: user.email,
  subject: 'Bienvenido a la comunidad más grande',
  html: `<div>
          <h1>¿Querés equipar tu casa?</h1>
          <p> Los mejores precios a tan solo un click, que esperas?</p>
          <button><a href="http://localhost8080/products">¡VAMOS!</a></button>
                </div>`,
  attachments: []
})

const recoveryMail = () => (user) ({
  from: `SWISH ${MAIL}`,
  to: user.email,
  subject: 'Recuperación de Contraseña',
  html: `
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <a href="http://localhost:8080/reset-password/${resetToken}">Restablecer contraseña</a>
      `,
})

const inactiveMail = () => (user)({
  from: `SWISH ${MAIL}`,
  to: user.email,
  subject: 'Eliminacion por inactividad',
  html: `
        <h1>Lo sentimos, su cuenta ha sido eliminada</h1>
        <p> Su cuenta ha permaneció prolongadamente inactiva, por lo que ha sido eliminada.</p>
      `,
})

module.exports = {
  sendMail,
  purchaseMailReject,
  purchaseMail,
  registerMail,
  recoveryMail,
  inactiveMail
}
