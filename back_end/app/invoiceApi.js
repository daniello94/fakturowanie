const express = require('express');
const router = express.Router();
const invoice = require('../app/controler/invoice.controler');
const path = require('path');
let pdf = require("pdf-creator-node");
let fs = require("fs");

nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');
var html = fs.readFileSync(path.join(__dirname, "invoice.html"), "utf8")

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

          
            let options = {
                format: "A4",
                orientation: "portrait",
                border: "10mm",
                header: {
                    height: "45mm",
                    contents: '<div style="text-align: center;">Faktura za kurs</div>'
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
                html: html,
                data: {
                    // Data Client
                    nameClient: invoice.dataClient[0].firstName,
                    lastNameClient: invoice.dataClient[0].lastName,
                    typeInvoice: invoice.dataClient[0].typePerson,
                    // Address
                    addressClientCity: invoice.dataClient[0].address.city,
                    addressClientStreet: invoice.dataClient[0].address.street,
                    addressClientZipCode: invoice.dataClient[0].address.zipCode,
                    // Company
                    nameCompanyClient: invoice.dataClient[0].nameCompany,
                    numberIdClient: invoice.dataClient[0].address.numberId,
                    numberCompanyIdClient: invoice.dataClient[0].numberIdCompany,
                    // Data Company Academia
                    nameCompany: invoice.dataCompany.nameCompany,
                    firstName: invoice.dataCompany.firstName,
                    lastName: invoice.dataCompany.lastName,
                    numberId: invoice.dataCompany.numberId,
                    BankAccountNumber: invoice.dataCompany.BankAccountNumber,
                    // Data Company Academia address
                    city: invoice.dataCompany.address.city,
                    street: invoice.dataCompany.address.street,
                    zipCode: invoice.dataCompany.address.zipCode,
                    // Data Invoice
                    vat: invoice.vat,
                    nameCourse: invoice.nameCourse,
                    priceCourse: invoice.priceCourse,
                    sumPriceCourse: invoice.sumPriceCourse,
                    dataIssue: invoice.dataIssue,
                    numberInvoice: invoice.serialInvoice
                },
                path: "messageEmail/invoice.pdf",
                type: "",
            };

            let messageHtml=
            `<h1>Cześć ${invoice.dataClient[0].firstName}</h1>
           <p>Zapisałeś się na kurs ${invoice.nameCourse} w załaczniku znajduje się faktura.<br/> Termin płatności to 14 dni od daty ${invoice.dataIssue}.</p>
           <p>Pozdrawiamy</p>
           <p>Zespoł <br/> ${invoice.dataCompany.nameCompany}</p>
            `

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
                subject: "Faktóra za kurs",
                html:messageHtml ,
                attachments: [
                    {
                        filename: 'fileName.pdf',
                        path: "messageEmail/invoice.pdf",
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
        }
    })
});
module.exports = router;