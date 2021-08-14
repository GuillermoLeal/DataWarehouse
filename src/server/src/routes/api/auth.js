const router = require('express').Router();
const { User } = require('../../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  validateRegister,
  validateLogin,
  authorizeRoleAdmin,
  validateToken,
} = require('../../controllers/auth.controller');

// ? Registro de usuario
router.post(
  '/register',
  validateToken,
  authorizeRoleAdmin,
  validateRegister,
  async (req, res) => {
    // hash contraseña
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    try {
      const saveUser = await User.create({
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        password,
        role: req.body.role,
      });

      res.json({
        error: false,
        message: 'Usuario creado correctamente',
      });
    } catch (error) {
      const errors = error.errors.map((err) => err.message);
      res.status(500).json({ error: errors });
    }
  }
);

// ? Login de Usuario
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { user } = req;
    // crear token
    const token = jwt.sign(
      {
        email: user.email,
        role: user.roleId,
        id: user.id,
      },
      process.env.TOKEN_SECRET
    );

    const { id, name, lastname, email, role } = user;

    res.json({
      error: false,
      message: 'Usuario logueado correctamente',
      user: { id, name, lastname, email, role },
      token,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: error || 'Error al devolver el usuario logueado' });
  }
});

module.exports = router;
