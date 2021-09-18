const router = require('express').Router();
const { sequelize, Sequelize, Company, City } = require('../../database');
const Op = Sequelize.Op;

// ? Obtener companies
router.get('/', async (req, res) => {
  try {
    const { search, limit, offset, sortBy, sortDesc } = req.query;

    const query = `SELECT co.name, co.address, co.email, co.telephone, co.id, 
      ci.id AS city, ci.name AS cityName,
      ct.id AS country, ct.name AS countryName
      FROM companies co
      JOIN cities ci ON ci.id = co.cityId
      JOIN countries ct ON ct.id = ci.countryId
      WHERE co.active = 1 AND co.name LIKE :_search
      LIMIT :_limit OFFSET :_offset `;

    // Ajustar orden de la tabla para consultar
    const sorts = sortBy.split(',');
    const sortDescs = sortDesc.split(',');

    sorts.forEach((item, index) => {
      if (item != '') {
        query += ` ORDER BY ${item} ${
          sortDescs[index] == 'true' ? 'DESC' : 'ASC'
        } `;
      }
    });

    // obtener usuario
    const companies = await sequelize.query(query, {
      replacements: {
        _search: `%${search}%`,
        _limit: Number(limit) || 10,
        _offset: Number(offset) || 0,
      },
      type: Sequelize.QueryTypes.SELECT,
    });

    const companiesTotal = await Company.findAll();

    res.json({
      error: false,
      totalData: companiesTotal.length,
      data: companies,
    });
  } catch (error) {
    res.json(error);
  }
});

// ? Crear company
router.post('/', async (req, res) => {
  try {
    const { name, address, email, telephone, city } = req.body;

    const objCompany = {
      name: name.trim(),
      address: address.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
      cityId: city,
    };

    const query = {
      where: objCompany,
    };

    let company = await Company.findOne(query);
    // Validar si existe el company, si es asi lo activamos...
    if (company) {
      const companyUpdate = await Company.update(
        { active: true },
        {
          where: objCompany,
        }
      );
      company = await Company.findOne(query);
    }
    // Si NO existe la company, lo creamos...
    else {
      company = await Company.create(objCompany);
    }

    // Enviamos la respuesta
    res.json({
      error: false,
      data: company,
    });
  } catch (error) {
    console.log(error);
  }
});

// ? Actualizar city
router.put('/', async (req, res) => {
  try {
    const { id, name, address, email, telephone, city } = req.body;

    const objCompany = {
      name: name.trim(),
      address: address.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
      cityId: city,
    };

    // editar company
    const companyUpdate = await Company.update(objCompany, { where: { id } });

    if (companyUpdate[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo actualizar la compañía',
      });
    }

    const company = await Company.findByPk(id);

    res.json({
      error: false,
      data: company,
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
