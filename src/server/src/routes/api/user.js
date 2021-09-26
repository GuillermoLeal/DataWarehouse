const router = require('express').Router();
const bcrypt = require('bcrypt');
const { Sequelize, User } = require('../../database');
const {
  authorizeRoleAdmin,
  validateUpdateUser,
} = require('../../controllers/auth.controller');
const Op = Sequelize.Op;

// ? Obtener la lista de usuarios
router.get('/', authorizeRoleAdmin, async (req, res) => {
  try {
    const { search, limit, offset, sortBy, sortDesc } = req.query;

    const query = {
      where: {
        role: { [Op.notIn]: [3] },
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            lastname: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            email: {
              [Op.like]: `%${search}%`,
            },
          },
        ],
      },
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
    };

    // Ajustar orden de la tabla para consultar
    const sorts = sortBy.split(',');
    const sortDescs = sortDesc.split(',');
    const order = [];

    sorts.forEach((item, index) => {
      if (item != '') {
        order.push([item, sortDescs[index] == 'true' ? 'DESC' : 'ASC']);
      }
    });

    if (order.length > 0) {
      query.order = order;
    }

    // obtener usuario
    const users = await User.findAll(query);

    const usersTotal = await User.findAll();

    res.json({
      error: false,
      totalData: usersTotal.length,
      data: users.map((user) => {
        return {
          id: user.id,
          name: user.name,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        };
      }),
    });
  } catch (error) {
    res.json(error);
  }
});

// ? Eliminar usuarios
router.delete('/', authorizeRoleAdmin, async (req, res) => {
  try {
    const { users } = req.body;
    // eliminar usuarios
    const usersRemove = await User.destroy({ where: { id: users } });

    if (!usersRemove) {
      res
        .status(200)
        .json({ error: true, message: 'No se pudo eliminar los usuarios' });
    }

    res.json({
      error: false,
      message: 'Usuarios eliminados correctamente',
    });
  } catch (error) {
    const errors = error.errors.map((err) => err.message);
    res.status(200).json({
      error: true,
      message: 'Error al tratar de eliminar usuarios',
      errors,
    });
  }
});

// ? Editar usuarios
router.put('/', authorizeRoleAdmin, validateUpdateUser, async (req, res) => {
  try {
    const { id, name, lastname, email, role } = req.body;

    dataUpdateUser = {
      name: name.trim(),
      lastname: lastname.trim(),
      email: email.trim(),
      role,
    };

    // editar usuario
    const userUpdate = await User.update(dataUpdateUser, { where: { id } });

    if (userUpdate[0] < 1) {
      res.status(200).json({
        error: true,
        message: 'No se pudo actualizar el usuario',
      });
    }

    res.json({
      error: false,
      message: 'Usuario editado correctamente',
    });
  } catch (error) {
    const errors = error.errors.map((err) => err.message);
    res.status(200).json({
      error: true,
      message: 'Error al tratar de editar el usuario',
      errors,
    });
  }
});

module.exports = router;
