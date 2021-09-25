module.exports = (sequelize, DataTypes, Company, City) => {
  return sequelize.define('contact', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name es un campo requerido',
        },
        len: {
          args: [1, 50],
          msg: 'Name tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'LastName es un campo requerido',
        },
        len: {
          args: [1, 50],
          msg: 'LastName tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Position es un campo requerido',
        },
        len: {
          args: [1, 50],
          msg: 'Position tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          args: true,
          msg: 'El email no es válido',
        },
        notEmpty: {
          args: true,
          msg: 'Email es un campo requerido',
        },
        len: {
          args: [1, 50],
          msg: 'Email tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: 'id',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Company es un campo requerido',
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
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Adress es un campo requerido',
        },
        len: {
          args: [1, 50],
          msg: 'Adress tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    interest: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Interest es requerido',
        },
        isInt: {
          args: true,
          msg: 'Interest debe ser un número entero',
        },
      },
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });
};
