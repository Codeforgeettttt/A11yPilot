// Se importa ANTES que la app en las pruebas de integración:
// hace que el backend use SQLite en memoria en lugar de SQL Server.
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';
process.env.NODE_ENV = 'test';
