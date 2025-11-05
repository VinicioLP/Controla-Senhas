const Senha = require("../models/Senha");

module.exports = {
  listar: async (req, res) => {
    const usuarioId = req.session.usuarioId;
    const senhas = await Senha.findAll({ where: { usuarioId } });
    res.render("senhas", { senhas });
  },
  criar: async (req, res) => {
    const { descricao, valor } = req.body;
    await Senha.create({ descricao, valor, usuarioId: req.session.usuarioId });
    res.redirect("/senhas");
  },
  editar: async (req, res) => {
    const { id } = req.params;
    const { descricao, valor } = req.body;
    await Senha.update({ descricao, valor }, { where: { id } });
    res.redirect("/senhas");
  },
  remover: async (req, res) => {
    const { id } = req.params;
    await Senha.destroy({ where: { id } });
    res.redirect("/senhas");
  },
};
