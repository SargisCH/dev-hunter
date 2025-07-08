export default () => ({
  database: {
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    databaseURI: process.env.DATABASE_URI,
    authSource: 'admin',
  },
});
