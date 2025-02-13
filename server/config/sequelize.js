const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Crear una instancia de Sequelize
const sequelize = new Sequelize(
  process.env.SQL_DB, // Nombre de la base de datos
  process.env.SQL_USER, // Usuario de la base de datos
  process.env.SQL_PASSWORD, // Contraseña de la base de datos
  {
    host: process.env.SQL_HOST, // Host de la base de datos
    port: process.env.SQL_PORT, // Puerto de la base de datos
    dialect: 'mariadb', // Dialecto de la base de datos (puede ser 'mysql', 'sqlite', 'mariadb', etc.)
    logging: false, // Desactiva los logs de Sequelize (opcional)
    pool: {
      max: 10, // Número máximo de conexiones en el pool
      min: 0, // Número mínimo de conexiones en el pool
      acquire: 30000, // Tiempo máximo (en ms) para adquirir una conexión
      idle: 10000, // Tiempo máximo (en ms) que una conexión puede estar inactiva
    },
  }
);

// Probar la conexión a la base de datos
sequelize
  .authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

// Sincronizar los modelos con la base de datos (opcional)
sequelize
  .sync({ force: false }) // `force: true` elimina y recrea las tablas (¡cuidado!)
  .then(() => {
    console.log('Modelos sincronizados con la base de datos.');
  })
  .catch(err => {
    console.error(err.message);
    console.error('Error al sincronizar los modelos:', err);
  });

module.exports = sequelize;
