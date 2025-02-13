const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();

// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string()
    .allow('development', 'production', 'test', 'provision')
    .default('development'),
  SERVER_PORT: Joi.number().default(4040),
  SQL_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false),
  }),
  JWT_SECRET: Joi.string()
    .required()
    .description('JWT Secret required to sign'),
  SQL_HOST: Joi.string().required().description(' DB host url'),
  SQL_PORT: Joi.number().default(27017),
  SQL_DB: Joi.string().required().description(' DB name'),
  SQL_USER: Joi.string().required().description(' DB user'),
  SQL_PASSWORD: Joi.string().required().description(' DB password'),
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  jwtSecret: envVars.JWT_SECRET,
  frontend: envVars.MEAN_FRONTEND || 'angular',
  sql: {
    host: envVars.SQL_HOST,
    port: envVars.SQL_PORT,
    db: envVars.SQL_DB,
    user: envVars.SQL_USER,
    password: envVars.SQL_PASSWORD,
  },
};

module.exports = config;
