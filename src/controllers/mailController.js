const nodemailer = require('nodemailer');



async function sendMessage(req, res) {
    let testaccount = await nodemailer.createTestAccount();
    const email = req.body.email;
    const name = req.body.name;
    const message = req.body.message;

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'andreane.bailey@ethereal.email',
            pass: 'BptxTPKT7JT2pK92ue'
        }
    });

    let info = await transporter.sendMail({
        from: "andreane.bailey@ethereal.email", // sender address
        to: "mariano.14th@gmail.com", // list of receivers
        subject: "Soporte ✔", // Subject line
        text: message, // plain text body
        html: `
            <h3>Usuario: <small>${name}</small></h3>
            <h3>Email: <small>${email}</small></h3>
            <b>${message}</b>`, // html body
    });

    res.send({result: info.messageId});
}

module.exports = {sendMessage}