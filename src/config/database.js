require("dotenv/config");

module.exports = {
  development: {
    username: process.env.DB_USER_DEV,
    password: process.env.DB_PSSWRD_DEV,
    database: process.env.DB_DBNAME_DEV,
    host: process.env.DB_HOST_DEV,
    port: 5433,
    dialect: "postgres",
    define: {
      timestamps: true,
    },
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "postgres",
    define: {
      timestamps: true,
    },
  },
  production: {
    use_env_variable: "DATABASE_URL",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: "postgres",
    operatorsAliases: false,
  },
};
