module.exports = (sequelize, DataTypes, Country) => {
  return sequelize.define('city', {
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
          msg: 'Nombre tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    countryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Country,
        key: 'id',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Country es un campo requerido',
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
