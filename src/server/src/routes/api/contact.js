const router = require('express').Router();
const {
  sequelize,
  Sequelize,
  Contact,
  ContactChannel,
} = require('../../database');

// ? Obtener contact
router.get('/', async (req, res) => {
  try {
    const { search, limit, offset, sortBy, sortDesc } = req.query;

    let query = `SELECT ct.id, CONCAT(ct.name, ' ', ct.lastname) fullName,
      ct.position position, ct.email email, ct.interest interest, cp.name company, 
      rgn.id regionId, rgn.name region, cnt.id countryId, cnt.name country
      FROM contacts ct
      JOIN companies cp ON cp.id = ct.companyId
      JOIN cities cty ON cty.id = ct.cityId
      JOIN countries cnt ON cnt.id = cty.countryId
      JOIN regions rgn ON rgn.id = cnt.regionId
      WHERE ct.active = 1 AND (ct.name LIKE :_search OR ct.lastname LIKE :_search 
        OR ct.position LIKE :_search OR cp.name LIKE :_search OR rgn.name LIKE :_search
        OR cnt.name LIKE :_search OR ct.email LIKE :_search)
      GROUP BY ct.id, fullName, position, email, interest, company, regionId, region,
        countryId, country `;

    // Ajustar orden de la tabla para consultar
    const sorts = !!sortBy ? sortBy.split(',') : [];
    const sortDescs = !!sortDesc ? sortDesc.split(',') : [];

    sorts.forEach((item, index) => {
      if (item != '') {
        let concat = ',';
        if (index == 0) concat = 'ORDER BY';

        query += `${concat} ${item} ${
          sortDescs[index] == true ? 'DESC' : 'ASC'
        } `;
      }
    });

    query += 'LIMIT :_limit OFFSET :_offset';

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

// ? Obtener contact por ID
router.get('/contactById', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id && id != 0) {
      res.status(404).json({
        error: true,
        message: 'id no definido',
      });
    }

    const contact = await Contact.findByPk(id);
    let channels = [];
    // obtener channels del contact
    if (contact) {
      const query = `SELECT ch.id channelId, ch.name, cc.account, cc.preference
        FROM contact_channels cc
        JOIN contacts ct ON ct.id = cc.contactId
        JOIN channels ch ON ch.id = cc.channelId
        WHERE ct.id = :_id
        GROUP BY cc.id`;

      const findChannels = await sequelize.query(query, {
        replacements: {
          _id: Number(id),
        },
        type: Sequelize.QueryTypes.SELECT,
      });

      channels = findChannels;
    }

    res.json({
      error: false,
      contact: {
        ...contact.dataValues,
        channels: channels.map((ch, index) => ({ ...ch, index })),
      },
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

// ? Actualizar contact
router.put('/', async (req, res) => {
  try {
    const {
      id,
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
    };

    // editar contact
    const contactUpdate = await Contact.update(objContact, { where: { id } });

    if (contactUpdate[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo actualizar el contacto',
      });
    }

    // Ajustar los Channels del Contact
    const contactChannelsDelete = await ContactChannel.destroy({
      where: { contactId: id },
    });
    channels.forEach(async (ch) => {
      const objChannel = {
        contactId: id,
        channelId: ch.channelId,
        account: ch.account.trim(),
        preference: ch.preference,
      };

      const contactChannels = await ContactChannel.create(objChannel);
    });

    const contact = await Contact.findByPk(id);

    res.json({
      error: false,
      message: 'Contacto actualizado correctamente',
    });
  } catch (error) {
    console.log(error);
  }
});

// ? Eliminar contact
router.delete('/', async (req, res) => {
  try {
    const { items } = req.body;

    // Eliminar contacts
    const contactChannelsDelete = await ContactChannel.destroy({
      where: { contactId: items },
    });
    const contactDelete = await Contact.destroy({ where: { id: items } });

    // Enviar respuesta
    res.json({
      error: false,
      message: 'Contactos eliminados correctamente',
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
