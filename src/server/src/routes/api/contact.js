const router = require('express').Router();
const {
  sequelize,
  Sequelize,
  Contact,
  ContactChannel,
} = require('../../database');
const Op = Sequelize.Op;

// ? Obtener contact
router.get('/', async (req, res) => {
  try {
    const { search, limit, offset, sortBy, sortDesc } = req.query;

    const query = `SELECT ct.id, ct.name, ct.lastname, CONCAT(ct.name, ' ', ct.lastname) fullName,
      ct.position, ct.email, ct.address, ct.interest, cp.name company, rgn.name region, cnt.name country
      FROM contacts ct
      JOIN companies cp ON cp.id = ct.companyId
      JOIN cities cty ON cty.id = ct.cityId
      JOIN countries cnt ON cnt.id = cty.countryId
      JOIN regions rgn ON rgn.id = cnt.regionId
      WHERE ct.active = 1 AND (ct.name LIKE :_search OR ct.lastname LIKE :_search 
        OR ct.position LIKE :_search OR cp.name LIKE :_search)
      GROUP BY ct.id
      LIMIT :_limit OFFSET :_offset `;

    // Ajustar orden de la tabla para consultar
    const sorts = !!sortBy ? sortBy.split(',') : [];
    const sortDescs = !!sortDesc ? sortDesc.split(',') : [];

    sorts.forEach((item, index) => {
      if (item != '') {
        query += ` ORDER BY ${item} ${
          sortDescs[index] == 'true' ? 'DESC' : 'ASC'
        } `;
      }
    });

    // obtener contacts
    const contacts = await sequelize.query(query, {
      replacements: {
        _search: `%${search || ''}%`,
        _limit: Number(limit) || 10,
        _offset: Number(offset) || 0,
      },
      type: Sequelize.QueryTypes.SELECT,
    });

    const contactsTotal = await Contact.findAll();

    res.json({
      error: false,
      totalData: contactsTotal.length,
      data: contacts,
    });
  } catch (error) {
    res.json(error);
  }
});

//? Crear contact
router.post('/', async (req, res) => {
  try {
    const {
      name,
      lastname,
      position,
      email,
      company,
      city,
      address,
      interest,
      channels,
    } = req.body;

    const objContact = {
      name: name.trim(),
      lastName: lastname.trim(),
      position: position.trim(),
      email: email.trim(),
      companyId: company,
      cityId: city,
      address: address.trim(),
      interest,
      active: 1,
    };

    const query = {
      where: objContact,
    };

    let contact = await Contact.findOne(query);
    // Validar si existe el contact, si es asi lo activamos...
    if (contact) {
      const contactUpdate = await Contact.update(
        { active: true },
        {
          where: objContact,
        }
      );
      contact = await Contact.findOne(query);
    }
    // Si NO existe la contact, lo creamos...
    else {
      contact = await Contact.create(objContact);
    }

    channels.forEach(async (ch) => {
      const objChannel = {
        contactId: contact.id,
        channelId: ch.channelId,
        account: ch.account.trim(),
        preference: 1,
      };

      const contactChannels = await ContactChannel.create(objChannel);
    });

    // Enviamos la respuesta
    res.json({
      error: false,
      message: 'Contacto creado correctamente',
    });
  } catch (error) {
    console.log(error);
  }
});

// // ? Actualizar city
// router.put('/', async (req, res) => {
//   try {
//     const { id, name, address, email, telephone, city } = req.body;

//     const objCompany = {
//       name: name.trim(),
//       address: address.trim(),
//       email: email.trim(),
//       telephone: telephone.trim(),
//       cityId: city,
//     };

//     // editar company
//     const companyUpdate = await Company.update(objCompany, { where: { id } });

//     if (companyUpdate[0] < 1) {
//       res.status(200).json({
//         error: true,
//         message: 'No se pudo actualizar la compañía',
//       });
//     }

//     const company = await Company.findByPk(id);

//     res.json({
//       error: false,
//       data: company,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// // ? Eliminar city
// router.delete('/', async (req, res) => {
//   try {
//     const { id } = req.body;
//     // Eliminar city
//     const cityRemove = await City.update(
//       { active: false },
//       { where: { id: id } }
//     );

//     if (cityRemove[0] < 1) {
//       res.status(200).json({
//         error: true,
//         message: 'No se pudo eliminar la ciudad',
//       });
//     }

//     // Enviar respuesta
//     res.json({
//       error: false,
//       message: 'Ciudad eliminada correctamente',
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

module.exports = router;
