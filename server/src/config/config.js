module.exports = {
  port: process.env.PORT || 8081,
  db: {
    database: process.env.DB_NAME || 'allocation_matrix',
    user: process.env.DB_USER || 'allocation_matrix',
    password: process.env.DB_PASS || 'allocation_matrix',
    options: {
      dialect: process.env.DIALECT || 'postgres',
      host: process.env.HOST || 'localhost',
      storage: './allocation_matrix.postgres'

    }
  }
};
