module.exports = (sequelize, DataTypes, Contact, Channel) => {
  return sequelize.define('contact_channel', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contactId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Contact,
        key: 'id',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Contact es un campo requerido',
        },
      },
    },
    channelId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Channel,
        key: 'id',
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'Channel es un campo requerido',
        },
      },
    },
    account: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Account es un campo requerido',
        },
        len: {
          args: [1, 50],
          msg: 'Account tiene que tener entre 3 y 50 caracteres.',
        },
      },
    },
    preference: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Preference es requerido',
        },
        isInt: {
          args: true,
          msg: 'Preference debe ser un número entero',
        },
      },
    },
  });
};
