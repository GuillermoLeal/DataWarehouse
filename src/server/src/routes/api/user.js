const router = require('express').Router();
const bcrypt = require('bcrypt');
const { User } = require('../../database');
const { authorizeRoleAdmin } = require('../../controllers/auth.controller');

// ? Obtener la lista de usuarios
router.get('/', authorizeRoleAdmin, async (req, res) => {
  try {
    const { limit, offset, sortBy, sortDesc } = req.query;

    const query = {
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
router.put('/', authorizeRoleAdmin, async (req, res) => {
  try {
    const { id, name, lastname, email } = req.body;

    // Validar email y usuario unico
    const isEmailExist = await User.findOne({
      where: { email: req.body.email },
    });

    if (isEmailExist) {
      return res
        .status(200)
        .json({ error: true, message: 'Email ya registrado' });
    }

    data = {
      name,
      lastname,
      email,
    };
    // hash contraseña
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(req.body.password, salt);
    }

    // editar usuario
    const userUpdate = await User.update(data, { where: { id } });

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

// ? Obtener informacion de usuario por el email
router.get('/:email', authorizeRoleAdmin, async (req, res) => {
  try {
    // obtener usuario
    const user = await User.findOne({ where: { email: req.params.email } });

    if (user == null) {
      res.status(404).json({
        error: 'Usuario no encontrado',
      });
    }

    const { username, fullname, address, phone, email } = user;

    res.json({
      error: null,
      data: { username, fullname, address, phone, email },
    });
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
