const Invoice = require('../models/Invoice');

function invoiceAdd(data, cb) {
    let newInvoice = new Invoice(data);
    newInvoice.save(function (err, invoice) {
        if (err) {
            cb(err)
        } else {
            cb(null, invoice);
            console.log(invoice);
        }
    });
   
};

function invoiceData(id,cb){
    Invoice.findById(id).exec(function(err,invoice){
        if(err){
            cb(err)
        }else {
            cb(null,invoice)
        }
    })
};
module.exports = {
    add: invoiceAdd,
    get:invoiceData
}
