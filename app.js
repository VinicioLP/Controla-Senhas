const express = require("express");
const app = express();
const sequelize = require("./config/database");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const routes = require("./routes/routes");

app.set("view engine", "ejs");
// support packaging: when running as a packaged exe, use the executable's dir
const isPkg = typeof process.pkg !== "undefined";
const basePath = isPkg ? path.dirname(process.execPath) : __dirname;
app.set("views", path.join(basePath, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// disponibiliza a pasta public para acesso público (ajusta basePath quando empacotado)
app.use(express.static(path.join(basePath, "public")));

const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "segredo",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use HTTPS em produção
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 semana
    },
  })
);

// Cria a tabela de sessões se não existir
sessionStore.sync();

// Protege rotas de senhas
app.use("/senhas", (req, res, next) => {
  if (!req.session.usuarioId) return res.redirect("/login");
  next();
});

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login", { erro: null });
});

app.use(routes);

/**
 * Inicia o servidor (usa sequelize.sync e retorna uma Promise que resolve quando o server estiver ouvindo)
 * @param {number} port
 * @returns {Promise<http.Server>}
 */
function startServer(port = 3000) {
  return new Promise((resolve, reject) => {
    // If using SQLite, ensure the storage directory exists before syncing
    try {
      if (
        sequelize &&
        sequelize.options &&
        sequelize.options.dialect === "sqlite" &&
        sequelize.options.storage
      ) {
        const fs = require("fs");
        const storageDir = path.dirname(sequelize.options.storage);
        if (!fs.existsSync(storageDir)) {
          fs.mkdirSync(storageDir, { recursive: true });
        }
      }
    } catch (e) {
      // ignore directory creation errors; sync may still work
      console.warn("Warning creating sqlite storage dir:", e && e.message);
    }
    sequelize
      .sync()
      .then(() => {
        console.log("Banco de dados sincronizado!");
        const server = app.listen(port, () => {
          console.log(`Servidor rodando na porta ${port}`);
          resolve(server);
        });
      })
      .catch((err) => reject(err));
  });
}

// permitir execução direta com `node app.js`
if (require.main === module) {
  startServer().catch((err) => {
    console.error("Erro ao iniciar o servidor:", err);
    process.exit(1);
  });
}

module.exports = { app, startServer };
