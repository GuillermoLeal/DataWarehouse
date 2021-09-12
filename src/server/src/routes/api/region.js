const router = require('express').Router();
const { Sequelize, Region, Country } = require('../../database');
const Op = Sequelize.Op;

// ? Obtener la lista de regiones
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    const query = {
      where: {
        name: {
          [Op.like]: `%${search}%`,
        },
      },
    };

    const regions = await Region.findAll(query);
    res.json({
      error: false,
      totalData: regions.length,
      data: regions,
    });
  } catch (error) {
    res.json(error);
  }
});

// ? Crear region
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    const region = await Region.create({
      name: name.trim(),
    });

    res.json({
      error: false,
      data: region,
    });
  } catch (error) {
    const errors = error.errors.map((err) => err.message);
    res.status(500).json({ error: errors });
  }
});

module.exports = router;
