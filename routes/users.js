var express = require('express');
var router = express.Router();

router.post('/users', async (req, res, next) => {
  console.log(req.body)
  res.send('user created')
})

router.get("/users/:id", async (req, res) => {
  try {
    let User = await userModel()
    res.send(await User.getById(req.params.id))
  } catch (e) {
    res.status(404).json({ error: "User not found" });
  }
});

module.exports = router;
