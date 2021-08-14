const router = require('express').Router();
const { User } = require('../../database');
const { authorizeRoleAdmin } = require('../../controllers/auth.controller');

// ? Obtener la lista de usuarios
router.get('/', async (req, res) => {
  try {
    const { limit, offset } = req.query;
    // obtener usuario
    const users = await User.findAll({
      limit: Number(limit) || 10,
      offset: Number(offset) || 0,
    });

    const usersTotal = await User.findAll();

    res.json({
      error: false,
      totalData: usersTotal.length,
      data: users.map((user) => {
        return {
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
