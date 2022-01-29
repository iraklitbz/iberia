const nodemailer = require('nodemailer');

exports.handler = function(event, context, callback) {
    require('dotenv').config()
    let data = JSON.parse(event.body)

    let transporter = nodemailer.createTransport({
        host: process.env.hostname,
        port: 587,
        secure: false,
        authMethod: 'PLAIN',
        transportMethod: 'SMTP',
        tls:{
          rejectUnauthorized:false,
           ciphers:'SSLv3'
        },
        auth:{
          type: 'auth',
          user: process.env.email,
          pass: process.env.password,
        }
    });

    transporter.sendMail({
        from: data.email,
        to: process.env.toEmail,
        subject: `Email recibido de ${data.email} desde el formulario de la web`,
        html: `
                <table style="min-width:348px" width="100%;" height="100%" cellspacing="0" cellpadding="0" border="0">
                <tbody style="background-color: #f6f6f6;">
                  <tr style="height:32px" height="32"><td></td></tr> 
                  <tr align="center">
                      <td>
                        <table style="padding-bottom: 20px; width: 516px;min-width: 220px;" cellspacing="0" cellpadding="0" border="0"> 
                          <tr>
                            <td style="width:8px" width="8"></td>
                              <td>
                                  <div style="background-color: #fff; border-style: solid;border-width: thin;border-color: #f3f3f3;border-radius: 8px;padding: 40px 20px;">
                                  <div style="font-size:20px; padding-bottom: 20px; text-align: center; border-bottom: thin solid #f3f3f3;"> <b> ${data.email} </b> pregunta lo siguiente: <br/> </div>
                                  <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:16px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left">
                                    ${data.texto}
                                  </div>
                                </div>
                              
                              </td>
                            <td style="width:8px" width="8"></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr style="height:32px" height="32"><td></td></tr>
                  </tbody>
                </table>  
              `
    }, function(error, info) {
        if (error) {
            callback(error);
        } else {
            callback(null, {
            statusCode: 200,
            body: JSON.stringify({
                   'result': 'success'
                })
        });
        }
    });
}


