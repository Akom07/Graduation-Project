const express = require('express');
const router = express.Router()



router.get('/', (req, res) => {
    res.render('aboutUs.ejs')
})

module.exports = router