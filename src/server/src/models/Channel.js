module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'channel',
    {
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
    },
    {
      sequelize,
      timestamps: false,
    }
  );
};
