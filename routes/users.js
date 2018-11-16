const express = require('express');
const router = express.Router();
const reCaptcha = require('../middlewares/reCaptcha')

router.post('/', reCaptcha, async (req, res, next) => {
  res.send('user created')
})

router.get("/:id", async (req, res) => {
  try {
    let User = await userModel()
    res.send(await User.getById(req.params.id))
  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
