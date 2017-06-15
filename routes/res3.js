const express = require('express');
const router = express.Router();

/* GET Users page */
router.get('/', function (req, res, next) {
    res.render('pages/res3');
});

module.exports = router;