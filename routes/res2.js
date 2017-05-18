const express = require('express');
const router = express.Router();

/* GET Users page */
router.get('/', function (req, res, next) {
        res.render('pages/res2');
});

module.exports = router;