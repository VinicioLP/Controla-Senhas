const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Usuario = require("./Usuario");

const Senha = sequelize.define("Senha", {
  descricao: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Senha.belongsTo(Usuario, { foreignKey: "usuarioId" });

module.exports = Senha;
