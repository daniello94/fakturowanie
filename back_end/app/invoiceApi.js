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

            let contentHtml =
                `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Faktura</title>
    <style>
        .invoice {
            border: 2px solid black;
            width: 80%;
            padding: 10px 10px;
            text-align: center;
        }

        .invoice .dataInvoice {
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-end;
        }

        .invoice .dataInvoice table {
            width: 30%;
            padding: 10px 10px;
        }

        .invoice .dataInvoice table thead tr td {
            border: 2px solid black;
            padding: 10px;
        }

        .invoice .dataInvoice table thead tr .header {
            background-color: rgb(160, 150, 150);
        }

        .invoice .data {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }

        .invoice .data .invoiceData {
            width: 49%;
        }

        .invoice .data .invoiceData span h5 {
            background-color: rgb(160, 150, 150);
            border: 2px solid black;
            padding: 20px;
        }

        .invoice .data .invoiceData span p {
        text-align: left;
        font-size: 15px;
        margin-bottom: 0;
        margin-top: 0;
        }
        .invoice .data .invoiceData span .dataCompany{
            font-weight: bold;
        }
        .invoice .dataPrice{
            border: 2px solid black; 
            width: 100%; 
        }
        .invoice .dataPrice thead tr td,
        .invoice .dataSumPrice thead tr td,
        .invoice .dataSumPrice tbody .dataSumPrice{
            border: 2px solid black; 
            background-color: rgb(160, 150, 150);
            padding: 5px ;   
        }
        .invoice .dataPrice tbody tr td,
        .invoice .dataSumPrice tbody tr td{
            border: 2px solid black; 
            padding: 5px ;   
        }
        .invoice .dataSumPrice{
            border: 2px solid black; 
            width: 70%; 
            margin-right: 0;
            margin-left: auto;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <section class="invoice">
        <section class="dataInvoice">
            <table>
                <thead>
                    <tr>
                        <td class="header">Mmiejsce Wystawienia</td>
                        <td>Witryna internetowa</td>

                    </tr>
                    <tr>
                        <td class="header">Data usługi</td>
                        <td>${invoice.dataIssue}</td>
                    </tr>
                    <tr>
                        <td class="header">Data wystawienia</td>
                        <td>${invoice.dataIssue}</td>
                    </tr>
                </thead>
            </table>
        </section>
        <section class="data">
            <div class="invoiceData">
                <span>
                    <h5>Nabywca</h5>
                </span>
                <span>
                    <p>${invoice.dataClient[0].firstName} ${invoice.dataClient[0].lastName}</p>
                    <p>${invoice.dataClient[0].address.city}</p>
                    <p>${invoice.dataClient[0].address.street}</p>
                    <p>${invoice.dataClient[0].address.zipCode}</p>
                    <p>${invoice.dataClient[0].numberId}</p>
                    <p>${invoice.dataClient[0].nameCompany}</p>
                    <p>${invoice.dataClient[0].numberIdCompany}</p>
                </span>
            </div>
            <div class="invoiceData">
                <span>
                    <h5>Sprzedawca</h5>
                </span>
                <span>
                    <p>${invoice.dataCompany.firstName} ${invoice.dataCompany.lastName}</p>
                    <p class="dataCompany"> Dane Firmy</p>
                    <p> ${invoice.dataCompany.nameCompany}</p>
                    <p> ${invoice.dataCompany.numberId}</p>
                    <p class="dataCompany"> Adres</p>
                    <p>${invoice.dataCompany.address.city}</p>
                    <p>${invoice.dataCompany.address.street}</p>
                    <p>${invoice.dataCompany.address.zipCode}</p>
               
                </span>

            </div>
        </section>
        <h1>Faktura nr 001</h1>

        <table class="dataPrice">
            <thead>
                <tr>
                    <td>Nazwa</td>
                    <td>Cena Netto</td>
                    <td>Vat</td>
                    <td>Cena Brutto</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${invoice.nameCourse}</td>
                    <td>${invoice.priceCourse} zł</td>
                    <td>${invoice.vat} </td>
                    <td>${invoice.sumPriceCourse} zł </td>
                </tr>
            </tbody>
        </table>

        <table class="dataSumPrice">
            <thead>
                <tr>
                    <td>Razem do zapłaty</td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${invoice.sumPriceCourse} zł</td>
                </tr>
                <tr class="dataSumPrice">
                    <td>Numer konta wpłaty</td>
                </tr>
                <tr>
                    <td>${invoice.dataCompany.BankAccountNumber}</td>
                </tr>
            </tbody>
        </table>

    </section>
</body>
</html>`

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
                subject: "Faktóra za kurs",
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
        }
    })
});
module.exports = router;