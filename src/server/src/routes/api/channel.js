const router = require('express').Router();
const { Channel } = require('../../database');

// ? Obtener channels
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.findAll();

    res.json({
      error: false,
      totalData: channels.length,
      data: channels,
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
