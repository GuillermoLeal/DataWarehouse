// Conexión a Base de datos
const { Sequelize } = require('sequelize');
// Importar modelos
const UserModel = require('./models/User');
const RegionModel = require('./models/Region');
const CountryModel = require('./models/Country');
const CityModel = require('./models/City');
const CompanyModel = require('./models/Company');

// Configuración de la conexión a la base de datos
const { DB_USER, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_FORCE } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  port: 3306,
  logging: false,
});

// modelos de la base de datos
const User = UserModel(sequelize, Sequelize);
const Region = RegionModel(sequelize, Sequelize);
const Country = CountryModel(sequelize, Sequelize, Region);
const City = CityModel(sequelize, Sequelize, Country);
const Company = CompanyModel(sequelize, Sequelize, City);

// Sincronización de la base de datos
sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Base de datos cargada');
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Region,
  Country,
  City,
  Company,
};
