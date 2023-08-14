const router = require('express').Router();

router.post('*', (req, res) => {
    res.status(404).send("Not found");
});

router.get('*', (req, res) => {

    res.status(404).send("Not found");
});

module.exports = router;