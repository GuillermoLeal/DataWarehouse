const router = require('express').Router();
const { Sequelize, City } = require('../../database');
const Op = Sequelize.Op;

// ? Obtener cities por country
router.get('/cityForCountryId', async (req, res) => {
  try {
    const { id } = req.query;
    const query = {
      where: {
        countryId: id,
        active: true,
      },
    };

    const cities = await City.findAll(query);

    res.json({
      error: false,
      totalData: cities.length,
      data: cities,
    });
  } catch (error) {
    res.json(error);
  }
});

// ? Crear cities
router.post('/', async (req, res) => {
  try {
    const { name, country } = req.body;

    const query = {
      where: {
        name: name.trim(),
        countryId: country,
      },
    };

    let city = await City.findOne(query);
    // Validar si existe el city, si es asi lo activamos...
    if (city) {
      const cityUpdate = await City.update(
        { active: true },
        {
          where: {
            name: name.trim(),
            countryId: country,
          },
        }
      );
      city = await City.findOne(query);
    }
    // Si NO existe el city, lo creamos...
    else {
      city = await City.create({
        name: name.trim(),
        countryId: country,
      });
    }

    // Enviamos la respuesta
    res.json({
      error: false,
      data: city,
    });
  } catch (error) {
    console.log(error);
  }
});

// ? Actualizar city
router.put('/', async (req, res) => {
  try {
    const { id, name } = req.body;
    // editar city
    const cityUpdate = await City.update(
      { name: name.trim() },
      { where: { id } }
    );

    if (cityUpdate[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo actualizar la ciudad',
      });
    }

    const city = await City.findByPk(id);

    res.json({
      error: false,
      data: city,
    });
  } catch (error) {
    console.log(error);
  }
});

// ? Eliminar city
router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    // Eliminar city
    const cityRemove = await City.update(
      { active: false },
      { where: { id: id } }
    );

    if (cityRemove[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo eliminar la ciudad',
      });
    }

    // Enviar respuesta
    res.json({
      error: false,
      message: 'Ciudad eliminada correctamente',
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
