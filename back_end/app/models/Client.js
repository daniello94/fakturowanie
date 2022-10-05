const mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true });

const schema = mongoose.Schema({
        firstName: {
            type: String,
            default: ''
        },
        lastName: {
            type: String,
            default: ''
        },
        typePerson: {
            type: String,
            default: ''
        },
        nameCompany: {
            type: String,
            default: ''
        },
        numberId: {
            type: String,
            default: ''
        },
        numberIdCompany: {
            type: String,
            default: ''
        },
        address: {
            city: {
                type: String,
                default: ''
            },
            street: {
                type: String,
                default: ''
            },
            zipCode: {
                type: String,
                default: ''
            },
        },
});

module.exports = mongoose.model('Client', schema);
