 const nodemailer=require('nodemailer');
 const nodemailerSendgrid = require('nodemailer-sendgrid');

const sendEmail=async(options)=>{
    // 1- create transporter : {service taht will send email like gmail,mailgun,mailtrap,sendgrid}
    const transport = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
        })
    );
    
    // 2- define email options : (like from,to,subject,content)
    transport.sendMail({
        from: 'sender@example.com',
        to: 'Receiver Name <receiver@example.com>, someother@example.com',
        subject: 'hello world',
        html: '<h1>Hello world!</h1>'
    });

    // 3- send eamil : 
    await transporter.sendMail(mailopts);

}; 

module.exports=sendEmail;
