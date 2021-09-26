const router = require('express').Router();
const { sequelize, Sequelize, Company, City } = require('../../database');
const Op = Sequelize.Op;

// ? Obtener companies
router.get('/', async (req, res) => {
  try {
    const { search, limit, offset, sortBy, sortDesc } = req.query;

    let query = `SELECT co.id, co.name name, co.address address, co.email email, co.telephone telephone,
      ci.id city, ci.name cityName, ct.id country, ct.name countryName
      FROM companies co
      JOIN cities ci ON ci.id = co.cityId
      JOIN countries ct ON ct.id = ci.countryId
      WHERE co.active = 1 AND co.name LIKE :_search
      GROUP BY co.id, name, address, email, telephone, city, cityName, country, countryName `;

    // Ajustar orden de la tabla para consultar
    const sorts = !!sortBy ? sortBy.split(',') : [];
    const sortDescs = !!sortDesc ? sortDesc.split(',') : [];

    sorts.forEach((item, index) => {
      if (item != '') {
        let concat = ',';
        if (index == 0) concat = 'ORDER BY';

        query += ` ${concat} ${item} ${
          sortDescs[index] == 'true' ? 'DESC' : 'ASC'
        } `;
      }
    });

    query += 'LIMIT :_limit OFFSET :_offset';

    // obtener companies
    const companies = await sequelize.query(query, {
      replacements: {
        _search: `%${search || ''}%`,
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

// ? Eliminar company
router.delete('/', async (req, res) => {
  try {
    const { items } = req.body;
    // Eliminar company
    const companyRemove = await Company.update(
      { active: false },
      { where: { id: items } }
    );
    if (companyRemove[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo eliminar las compañías',
      });
    }

    // Enviar respuesta
    res.json({
      error: false,
      message: 'Compañías eliminadas correctamente',
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
