const { Sequelize } = require("sequelize");
const path = require("path");

// Load .env in development
try {
  require("dotenv").config();
} catch (e) {
  // dotenv may not be installed in some environments; ignore if missing
}

// If DB_USE_SQLITE is set to 'true' or DB_HOST is not provided, use SQLite (no external DB needed)
const useSqlite = process.env.DB_USE_SQLITE === "true" || !process.env.DB_HOST;

if (useSqlite) {
  // storage path: prefer DB_STORAGE env var, fallback to ./data/database.sqlite
  const storagePath =
    process.env.DB_STORAGE ||
    path.join(process.cwd(), "data", "database.sqlite");
  // Ensure directory exists at runtime (the app will create file on first write)
  // Note: do not create folders here to avoid permission issues in some packaged contexts.
  const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: storagePath,
    logging: false,
  });

  module.exports = sequelize;
} else {
  const DB_NAME = process.env.DB_NAME || "ControlaSenhas";
  const DB_USER = process.env.DB_USER || "root";
  const DB_PASS = process.env.DB_PASS || "MenpalTet1@";
  const DB_HOST = process.env.DB_HOST || "localhost";

  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: "mysql",
  });

  module.exports = sequelize;
}
