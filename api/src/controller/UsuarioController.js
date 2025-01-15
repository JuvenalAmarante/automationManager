const { Op } = require('sequelize');
const Usuario = require('../models/Usuario');
const { connection } = require('../database');
const UsuarioTemAutomacao = require('../models/UsuarioTemAutomacao');
const LogErro = require('../models/LogErro');

class UsuarioController {
  async buscarUsuarioPorUsuario(usuario) {
    const data = await Usuario.findOne({
      where: {
        usuario,
        ativo: true,
      },
    });

    return data;
  }

  async buscarUsuarioPorId(id) {
    const data = await Usuario.findByPk(id);

    return data;
  }

  async criar(req, res) {
    const { nome, usuario, senha, ativo, admin } = req.body;

    if (!nome || !usuario || !senha || ativo == null || admin == null)
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      const usuarioRepetido = await Usuario.findOne({
        where: {
          usuario,
        },
      });

      if (usuarioRepetido)
        return res.status(400).json({
          success: false,
          message: 'Usuário inválido, utilize outro usuário',
        });

      await Usuario.create(
        {
          nome,
          usuario,
          senha,
          ativo,
          admin,
        },
        {
          transaction,
        }
      );

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Usuário salvo com sucesso!',
      });
    } catch (error) {
      await transaction.rollback();

      if (error instanceof Sequelize.ConnectionError)
        return res
          .status(500)
          .json({
            success: false,
            message: 'Ocorreu ao se conectar com o banco de dados',
          });
      else
        await LogErro.create({
          modulo: 'Usuario',
          funcao: 'criar',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listar(req, res) {
    const { busca } = req.query;

    try {
      const usuarios = await Usuario.findAll({
        attributes: ['id', 'nome', 'usuario', 'ativo', 'admin'],
        where: busca
          ? {
              [Op.or]: [
                {
                  nome: {
                    [Op.iLike]: `%${busca}%`,
                  },
                },
                {
                  usuario: {
                    [Op.iLike]: `%${busca}%`,
                  },
                },
              ],
            }
          : undefined,
      });

      res.status(200).json({
        success: true,
        data: usuarios,
      });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res
          .status(500)
          .json({
            success: false,
            message: 'Ocorreu ao se conectar com o banco de dados',
          });
      else
        await LogErro.create({
          modulo: 'Usuario',
          funcao: 'listar',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listarDetalhes(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Usuário não encontrado' });

    try {
      const usuario = await Usuario.findByPk(id, {
        attributes: ['id', 'nome', 'usuario', 'ativo', 'admin'],
      });

      if (!usuario)
        return res
          .status(400)
          .json({ success: false, message: 'Usuário não encontrado' });

      res.status(200).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res
          .status(500)
          .json({
            success: false,
            message: 'Ocorreu ao se conectar com o banco de dados',
          });
      else
        await LogErro.create({
          modulo: 'Usuario',
          funcao: 'listarDetalhes',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listarDetalhesUsuarioLogado(req, res) {
    const { usuario } = req;

    delete usuario.id;

    return res.status(200).json({
      success: true,
      data: usuario,
    });
  }

  async atualizar(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Usuário não encontrado' });

    const { nome, usuario, senha, ativo, admin } = req.body;

    if (!nome || !usuario || ativo == null || admin == null)
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      const usuarioSalvo = await Usuario.findByPk(id, {
        attributes: ['id', 'nome', 'usuario', 'ativo', 'admin'],
      });

      if (!usuarioSalvo)
        return res
          .status(400)
          .json({ success: false, message: 'Usuário não encontrado' });

      const usuarioRepetido = await Usuario.findOne({
        where: {
          usuario,
          id: {
            [Op.not]: id,
          },
        },
      });

      if (usuarioRepetido)
        return res.status(400).json({
          success: false,
          message: 'Usuário inválido, utilize outro usuário',
        });

      await Usuario.update(
        {
          nome,
          usuario,
          senha: senha != null ? senha : undefined,
          ativo,
          admin,
        },
        {
          where: {
            id,
          },
          transaction,
        }
      );

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      await transaction.rollback();

      if (error instanceof Sequelize.ConnectionError)
        return res
          .status(500)
          .json({
            success: false,
            message: 'Ocorreu ao se conectar com o banco de dados',
          });
      else
        await LogErro.create({
          modulo: 'Usuario',
          funcao: 'atualizar',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listarAutomacoesVinculadas(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Usuário não encontrado' });

    try {
      const usuarioSalvo = await Usuario.findByPk(id, {
        include: 'Automacoes',
      });

      if (!usuarioSalvo)
        return res
          .status(400)
          .json({ success: false, message: 'Usuário não encontrado' });

      res.status(200).json({
        success: true,
        data:
          usuarioSalvo.dataValues.Automacoes.map((automacao) => automacao.id) ||
          [],
      });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res
          .status(500)
          .json({
            success: false,
            message: 'Ocorreu ao se conectar com o banco de dados',
          });
      else
        await LogErro.create({
          modulo: 'Usuario',
          funcao: 'listarAutomacoesVinculadas',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async atualizarAutomacoesVinculadas(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Usuário não encontrado' });

    const { automacoes_ids } = req.body;

    if (!automacoes_ids)
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      const usuarioSalvo = await Usuario.findByPk(id);

      if (!usuarioSalvo)
        return res
          .status(400)
          .json({ success: false, message: 'Usuário não encontrado' });

      await UsuarioTemAutomacao.destroy({
        where: {
          usuario_id: id,
        },
        transaction,
      });

      for await (const automacao_id of automacoes_ids) {
        await UsuarioTemAutomacao.create(
          {
            usuario_id: id,
            automacao_id: automacao_id,
          },
          {
            fields: ['usuario_id', 'automacao_id'],

            transaction,
          }
        );
      }

      await transaction.commit();

      res.status(200).json({
        success: true,
        message: 'Usuário atualizado com sucesso!',
      });
    } catch (error) {
      await transaction.rollback();

      if (error instanceof Sequelize.ConnectionError)
        return res
          .status(500)
          .json({
            success: false,
            message: 'Ocorreu ao se conectar com o banco de dados',
          });
      else
        await LogErro.create({
          modulo: 'Usuario',
          funcao: 'atualizarAutomacoesVinculadas',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }
}

module.exports = new UsuarioController();
