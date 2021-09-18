module.exports = (sequelize, DataTypes, City) => {
  return sequelize.define('company', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Nombre es un campo requerido',
        },
        len: {
          args: [3, 50],
          msg: 'Name tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Address es un campo requerido',
        },
        len: {
          args: [3, 50],
          msg: 'Address tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Email no válido',
        },
        notEmpty: {
          args: true,
          msg: 'Email es un campo requerido',
        },
        len: {
          args: [3, 50],
          msg: 'Email tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Telephone es un campo requerido',
        },
        len: {
          args: [5, 10],
          msg: 'Telephone tiene que tener entre 5 y 10 caracteres.',
        },
      },
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: City,
        key: 'id',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'City es un campo requerido',
        },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Active es un campo requerido',
        },
      },
    },
  });
};
