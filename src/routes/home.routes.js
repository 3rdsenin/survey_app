const router = require('express').Router();

router.post('*', (req, res) => {
    res.status(404).send("Not found");
});

router.get('*', (req, res) => {
    //console.log(req.headers)
    res.status(404).send("Not found");
});

module.exports = router;