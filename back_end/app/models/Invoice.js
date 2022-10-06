const mongoose = require('mongoose');
const Client = require('../models/Client').schema
const moment = require('moment')
mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true });

const schema = mongoose.Schema({
    dataClient: {
        type: [Client]
    },
    dataCompany: {
        firstName: {
            type: String,
            default: 'Paweł'
        },
        lastName: {
            type: String,
            default: 'Nowak'
        },
        nameCompany: {
            type: String,
            default: 'Akademia'
        },
        numberId: {
            type: String,
            default: '76252421551'
        },
        BankAccountNumber:{
            type: String,
            default: 'PL 2576352735253257352753725372573527537'
        },
        address: {
            city: {
                type: String,
                default: 'Kraków'
            },
            street: {
                type: String,
                default: 'Jagielonska'
            },
            zipCode: {
                type: String,
                default: '33-315'
            },
        }
    },
    vat: {
        type: String,
        default: ''
    },
    nameCourse: {
        type: String,
        default: ''
    },
    priceCourse: {
        type: String,
        default: ''
    },
    sumPriceCourse: {
        type: String,
        default: ''
    },
    dataIssue:{
        type: String,
        default: moment(new Date).format('DD-MM-YYYY')
    }
});
module.exports = mongoose.model("Invoice", schema)