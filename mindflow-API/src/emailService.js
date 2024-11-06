const nodemailer = require('nodemailer');

// Função para enviar e-mails
function enviarEmail(destinatario, assunto, mensagem) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mindflow.noreply@gmail.com',
      pass: 'ejkk owel ychy mdan'
    }
  });

  const mailOptions = {
    from: 'mindflow.noreply@gmail.com',
    to: destinatario,
    subject: assunto,
    text: mensagem
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Erro ao enviar e-mail:', error);
    } else {
      console.log('Email enviado:', info.response);
    }
  });
}

module.exports = { enviarEmail };
