const router = require('express').Router();
const { Sequelize, Country, City } = require('../../database');
const Op = Sequelize.Op;

// ? Obtener countries
router.get('/', async (req, res) => {
  try {
    const query = {
      where: {
        active: true,
      },
    };

    const countries = await Country.findAll(query);

    res.json({
      error: false,
      totalData: countries.length,
      data: countries,
    });
  } catch (error) {
    res.json(error);
  }
});

// ? Obtener countrys por region
router.get('/countryForRegionId', async (req, res) => {
  try {
    const { id } = req.query;
    const query = {
      where: {
        regionId: id,
        active: true,
      },
    };

    const countrys = await Country.findAll(query);

    res.json({
      error: false,
      totalData: countrys.length,
      data: countrys,
    });
  } catch (error) {
    res.json(error);
  }
});

// ? Crear country
router.post('/', async (req, res) => {
  try {
    const { name, region } = req.body;

    const query = {
      where: {
        name: name.trim(),
        regionId: region,
      },
    };

    let country = await Country.findOne(query);
    // Validar si existe el country, si es asi lo activamos...
    if (country) {
      const countryUpdate = await Country.update(
        { active: true },
        {
          where: {
            name: name.trim(),
            regionId: region,
          },
        }
      );
      country = await Country.findOne(query);
    }
    // Si NO existe el country, lo creamos...
    else {
      country = await Country.create({
        name: name.trim(),
        regionId: region,
      });
    }

    // Enviamos la respuesta
    res.json({
      error: false,
      data: country,
    });
  } catch (error) {
    console.log(error);
  }
});

// ? Actualizar country
router.put('/', async (req, res) => {
  try {
    const { id, name } = req.body;
    // editar country
    const countryUpdate = await Country.update(
      { name: name.trim() },
      { where: { id } }
    );

    if (countryUpdate[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo actualizar el país',
      });
    }

    const country = await Country.findByPk(id);

    res.json({
      error: false,
      data: country,
    });
  } catch (error) {
    console.log(error);
  }
});

// ? Eliminar country
router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    // Eliminar country
    const countryRemove = await Country.update(
      { active: false },
      { where: { id: id } }
    );

    if (countryRemove[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo eliminar el país',
      });
    }

    // Eliminar las cities asociadas al country
    const query = {
      where: {
        countryId: id,
      },
    };
    const citiesRemove = await City.findAll(query);

    // Enviar respuesta
    res.json({
      error: false,
      message: 'País eliminado correctamente',
      citiesDelete: citiesRemove.length,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
