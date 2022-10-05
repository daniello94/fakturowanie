require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const apiClient = require('./app/clientApi');
const invoiceApi = require('./app/invoiceApi');

const config = {
    origin: 'http://' + process.env.DB_HOST
};

app.use(express.json());
app.use(cors());

app.use('/client', apiClient);
app.use('/invoice', invoiceApi);

app.get("/", cors(config), function (req, res) {
    res.status(219).json("Fakturowanie")
});

app.listen(process.env.PORT, function () {
    console.log(`Witrna zgłasznia do kursu na porcie ${process.env.PORT} działa poprawnie`);
});
