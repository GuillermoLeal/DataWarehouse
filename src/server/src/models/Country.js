module.exports = (sequelize, DataTypes, Region) => {
  return sequelize.define('country', {
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
    regionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Region,
        key: 'id',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Region es un campo requerido',
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
