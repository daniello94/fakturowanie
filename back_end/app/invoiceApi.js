const express = require('express');
const router = express.Router();
const invoice = require('../app/controler/invoice.controler');
const path = require('path');
let pdf = require("pdf-creator-node");
let fs = require("fs");
nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');

router.post('/add', function (req, res) {
    // console.log(req.body);
    invoice.add(req.body, function (err, invoice) {
        if (err) {
            res.status(404);
            res.json({
                error: "invoice is not created"
            })
        } else {
            res.json(invoice)
            console.log(invoice ,"api");
        }
    })
    let contentHtml =
        `<html>
    <head>  
    </head>
    <body>
    <p>Napis ${req.body.dataClient.map((asd) => {
            return (
                asd.firstName
            )

        })}</p>
    </body>
    </html`

    let options = {
        format: "A3",
        orientation: "portrait",
        border: "10mm",
        header: {
            height: "45mm",
            contents: '<div style="text-align: center;">Projekt wypożuczlnia</div>'
        },
        footer: {
            height: "25mm",
            contents: {
                first: 'Cover page',
                2: 'Second page',
                last: 'Last Page'
            }
        }
    };

    let document = {
        html: contentHtml,
        data: {
            users: contentHtml,
        },
        path: "messageEmail/output.pdf",
        type: "",
    };

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.ADDRESS_EMAIL,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        to: process.env.ADDRESS_EMAIL,
        from: "<wiad@op.pl>",
        subject: req.body.subject,
        html: contentHtml,
        attachments: [
            {
                filename: 'fileName.pdf',
                path: "messageEmail/output.pdf",
                contentType: 'application/pdf'
            }]
    };

    pdf
        .create(document, options)
        .then((res) => {
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                /*           console.log('Message %s sent: %s', info.messageId, info.response); */
                res.json("wysłano");
            });
        })
        .catch((error) => {
            console.error(error);
        });

});
module.exports = router;