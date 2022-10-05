const Client = require('../models/Client');
function clientAdd(data, cb) {
    let newClient = new Client(data);
    newClient.save(function (err, clients) {
        if (err) {
            cb(err)
        } else {
            cb(null, clients);
        }
    });
};

module.exports = {
    add: clientAdd
}