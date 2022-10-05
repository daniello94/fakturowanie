const express = require('express');
const router = express.Router();
const client = require('../app/controler/cilent.controler');

router.post('/add', function (req, res) {
    client.add(req.body, function (err, clients) {
        if (err) {
            res.status(404);
            res.json({
                error: "client is not created"
            })
        } else {
            res.json(clients)
        }
    })
});
module.exports = router;