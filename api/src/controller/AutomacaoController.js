const utf8 = require('utf8');
const fs = require('fs');
const multer = require('multer');
const Automacao = require('../models/Automacao');
const { connection } = require('../database');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const TipoParametro = require('../models/TipoParametro');
const Parametro = require('../models/Parametro');
const UsuarioTemAutomacao = require('../models/UsuarioTemAutomacao');
const { Op, Sequelize } = require('sequelize');
const AgendamentoController = require('./AgendamentoController');
const LogErro = require('../models/LogErro');

class AutomacaoController {
  async criar(req, res) {
    try {
      let nomeArquivo = 'index.py';
      let nomePasta = '';
      const storage = multer.diskStorage({
        destination: function (req, file, callback) {
          if (file.fieldname !== 'complementos')
            nomePasta = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

          if (!fs.existsSync(`./src/public/${nomePasta}`)) {
            fs.mkdirSync(`./src/public/${nomePasta}`);
          }

          callback(null, `./src/public/${nomePasta}`);
        },
        filename: function (req, file, callback) {
          if (file.fieldname !== 'complementos') callback(null, nomeArquivo);
          else callback(null, utf8.decode(file.originalname));
        },
      });

      const upload = multer({ storage }).fields([
        { name: 'arquivo', maxCount: 1 },
        { name: 'complementos' },
      ]);

      upload(req, res, async function (err) {
        const transaction = await connection.transaction();

        try {
          if (err)
            return res
              .status(500)
              .json({ success: false, message: err.message });

          const { nome, parametros } = req.body;

          if (
            !nome ||
            !nomePasta ||
            !nomeArquivo ||
            (parametros && !Array.isArray(parametros))
          )
            return res
              .status(400)
              .json({ success: false, message: 'Campos inválidos' });

          let automacao = await Automacao.findOne({
            where: {
              nome: nome.trim(),
              excluido: false,
            },
            transaction,
          });

          if (automacao)
            return res.status(400).json({
              success: false,
              message: 'Nome inválido',
            });

          if (parametros) {
            let contador = 0;

            for await (const data of parametros) {
              const parametro = JSON.parse(data);

              if (
                !parametro.nome ||
                !parametro.tipo_parametro_id ||
                (parametro.tipo_parametro_id == 2 && !parametro.qtd_digitos)
              )
                break;

              const tipo = await TipoParametro.findByPk(
                parametro.tipo_parametro_id
              );

              if (!tipo) break;

              contador++;
            }

            if (contador != parametros.length)
              return res
                .status(400)
                .json({ success: false, message: 'Campos inválidos' });
          }

          automacao = await Automacao.create(
            {
              nome: nome.trim(),
              arquivo: `${nomePasta}/${nomeArquivo}`,
            },
            {
              transaction,
            }
          );

          let parametrosSalvos = [];
          if (parametros) {
            for await (const data of parametros) {
              const parametro = JSON.parse(data);

              const parametroSalvo = await ParametroAutomacao.create(
                {
                  nome: parametro.nome,
                  automacao_id: automacao.id,
                  tipo_parametro_id: parametro.tipo_parametro_id,
                  qtd_digitos: parametro.qtd_digitos || null,
                },
                {
                  transaction,
                }
              );

              parametrosSalvos.push(parametroSalvo);
            }
          }

          res.status(201).json({
            success: true,
            message: 'Automação salva com sucesso!',
          });

          await transaction.commit();
        } catch (error) {
          await transaction.rollback();

          res
            .status(500)
            .json({ success: false, message: 'Ocorreu um erro interno' });
        }
      });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'criar',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listar(req, res) {
    const { usuario } = req;

    try {
      let automacoes_ids = [];
      if (!usuario.admin) {
        automacoes_ids = (
          await UsuarioTemAutomacao.findAll({
            where: {
              usuario_id: usuario.id,
            },
          })
        ).map((relacao) => relacao.dataValues.automacao_id);
      }

      let where = {
        excluido: false,
      };

      if (!usuario.admin)
        where.id = {
          [Op.in]: automacoes_ids,
        };

      const automacoes = await Automacao.findAll({
        where,
      });

      res.status(200).json({ success: true, data: automacoes });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
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
        .json({ success: false, message: 'Automação não encontrada' });

    try {
      const automacao = await Automacao.findByPk(id);

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      const parametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: id,
        },
      });

      res
        .status(200)
        .json({ success: true, data: { ...automacao.dataValues, parametros } });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'listarDetalhes',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async atualizar(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Automação não encontrada' });

    const transaction = await connection.transaction();

    try {
      let automacao = await Automacao.findByPk(id, {
        transaction,
      });

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      const { nome, parametros } = req.body;

      if (!nome || (parametros && !Array.isArray(parametros)))
        return res
          .status(400)
          .json({ success: false, message: 'Campos inválidos' });

      automacao = await Automacao.findOne({
        where: {
          id: {
            [Op.not]: id,
          },
          nome: nome.trim(),
          excluido: false,
        },
        transaction,
      });

      if (automacao)
        return res.status(400).json({
          success: false,
          message: 'Nome inválido',
        });

      if (parametros) {
        let contador = 0;

        for await (const parametro of parametros) {
          if (
            !parametro.nome ||
            !parametro.tipo_parametro_id ||
            (parametro.tipo_parametro_id == 2 && !parametro.qtd_digitos)
          )
            break;

          const tipo = await TipoParametro.findByPk(
            parametro.tipo_parametro_id
          );

          if (!tipo) break;

          contador++;
        }

        if (contador != parametros.length)
          return res
            .status(400)
            .json({ success: false, message: 'Campos inválidos' });
      }

      await Automacao.update(
        {
          nome: nome.trim(),
        },
        {
          where: {
            id,
          },
          transaction,
        }
      );

      await ParametroAutomacao.destroy({
        where: {
          automacao_id: id,
        },
      });

      let parametrosSalvos = [];
      if (parametros) {
        for await (const parametro of parametros) {
          const parametroSalvo = await ParametroAutomacao.create(
            {
              nome: parametro.nome,
              automacao_id: id,
              tipo_parametro_id: parametro.tipo_parametro_id,
              qtd_digitos: parametro.qtd_digitos || null,
            },
            {
              transaction,
            }
          );

          parametrosSalvos.push(parametroSalvo);
        }
      }

      res.status(201).json({
        success: true,
        message: 'Automação salva com sucesso!',
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'atualizar',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  atualizarParametros = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Automação não encontrada' });

    const { parametros } = req.body;

    if (parametros && !Array.isArray(parametros))
      return res
        .status(400)
        .json({ success: false, message: 'Campos inválidos' });

    const transaction = await connection.transaction();

    try {
      const automacao = await Automacao.findByPk(id, {
        transaction,
      });

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      const listaParametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: automacao.id,
        },
        transaction,
      });

      if (listaParametros.length && !parametros?.length)
        return res.status(400).json({
          success: false,
          message: 'Os parâmetros são obrigatórios',
        });

      if (parametros) {
        let contador = 0;

        for await (const parametro of parametros) {
          let validacao = true;

          for await (const parametroSalvo of listaParametros) {
            if (parametro[parametroSalvo.dataValues.nome] == null) {
              validacao = false;
              break;
            }

            if (parametroSalvo.dataValues.tipo_parametro_id == 2) {
              parametro[parametroSalvo.dataValues.nome] = (
                '0'.repeat(parametroSalvo.dataValues.qtd_digitos) +
                parametro[parametroSalvo.dataValues.nome]
              ).slice(-parametroSalvo.dataValues.qtd_digitos);
            }

            if (
              [3, 4, 5, 6, 7].includes(
                parametroSalvo.dataValues.tipo_parametro_id
              )
            ) {
              const date = new Date(parametro[parametroSalvo.dataValues.nome]);

              const dia = ('0'.repeat(2) + date.getDate()).slice(-2);
              const mes = ('0'.repeat(2) + (date.getMonth() + 1)).slice(-2);
              const ano = date.getFullYear();

              switch (parametroSalvo.dataValues.tipo_parametro_id) {
                case 3:
                  parametro[parametroSalvo.dataValues.nome] = `${dia}`;
                  break;

                case 4:
                  parametro[parametroSalvo.dataValues.nome] = `${mes}`;
                  break;

                case 5:
                  parametro[parametroSalvo.dataValues.nome] = `${ano}`;
                  break;

                case 6:
                  parametro[
                    parametroSalvo.dataValues.nome
                  ] = `${dia}/${mes}/${ano}`;
                  break;

                case 7:
                  parametro[parametroSalvo.dataValues.nome] = `${mes}/${ano}`;
                  break;
              }
            }
          }

          if (!validacao) break;

          contador++;
        }

        if (contador != parametros.length)
          return res
            .status(400)
            .json({ success: false, message: 'Parâmetros inválidos' });
      }

      await Parametro.destroy({
        where: {
          automacao_id: id,
        },
        transaction,
      });

      let parametrosSalvos = [];

      if (parametros) {
        for await (const parametro of parametros) {
          const parametroSalvo = await Parametro.create(
            {
              valor: JSON.stringify(parametro),
              automacao_id: id,
            },
            {
              transaction,
            }
          );

          parametrosSalvos.push(parametroSalvo);
        }
      }

      await transaction.commit();

      res.status(201).json({
        success: true,
        message: 'Parâmetros atualizados com sucesso!',
      });
    } catch (error) {
      await transaction.rollback();

      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'atualizarParametros',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  };

  async deletar(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Automação não encontrada' });

    try {
      const automacao = await Automacao.findByPk(id);

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      await Automacao.update({ excluido: true }, { where: { id } });

      await AgendamentoController.deletarPorAutomacao(id);

      res
        .status(200)
        .json({ success: true, message: 'Automação deletada com sucesso' });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'deletar',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listarTiposParametros(req, res) {
    try {
      const tipos = await TipoParametro.findAll();

      res.status(200).json({ success: true, data: tipos });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'listarTiposParametros',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listarParametros(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Automação não encontrada' });

    try {
      const automacao = await Automacao.findByPk(id);

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      const listaParametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: id,
        },
      });

      const parametrosSalvos = await Parametro.findAll({
        where: {
          automacao_id: id,
        },
      });

      const parametros = parametrosSalvos.map((parametro) => {
        const dados = JSON.parse(parametro.dataValues.valor);

        for (const parametroCadastrado of listaParametros) {
          if (parametroCadastrado.dataValues.tipo_parametro_id == 2) {
            dados[parametroCadastrado.dataValues.nome] = parseInt(
              dados[parametroCadastrado.dataValues.nome]
            );
          }

          if (
            [3, 4, 5, 6, 7].includes(
              parametroCadastrado.dataValues.tipo_parametro_id
            )
          ) {
            const date = dados[parametroCadastrado.dataValues.nome].split('/');

            switch (parametroCadastrado.dataValues.tipo_parametro_id) {
              case 3:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  2024,
                  7,
                  date[0]
                );
                break;

              case 4:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  2024,
                  date[0] - 1,
                  13
                );
                break;

              case 5:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  date[0],
                  7,
                  13
                );
                break;

              case 6:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  date[2],
                  date[1] - 1,
                  date[0]
                );
                break;

              case 7:
                dados[parametroCadastrado.dataValues.nome] = new Date(
                  date[1],
                  date[0] - 1,
                  13
                );
                break;
            }
          }
        }

        return dados;
      });

      res.status(200).json({ success: true, data: parametros });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'listarParametros',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }

  async listarParametrosFormatados(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res
        .status(400)
        .json({ success: false, message: 'Automação não encontrada' });

    try {
      const automacao = await Automacao.findByPk(id);

      if (!automacao)
        return res
          .status(400)
          .json({ success: false, message: 'Automação não encontrada' });

      const parametrosSalvos = await Parametro.findAll({
        where: {
          automacao_id: id,
        },
      });

      const parametros = parametrosSalvos.map((parametro) => {
        return JSON.parse(parametro.dataValues.valor);
      });

      res.status(200).json({ success: true, data: parametros });
    } catch (error) {
      if (error instanceof Sequelize.ConnectionError)
        return res.status(500).json({
          success: false,
          message: 'Ocorreu ao se conectar com o banco de dados',
        });
      else
        await LogErro.create({
          modulo: 'Automacao',
          funcao: 'listarParametrosFormatados',
          retorno: error.message,
        });

      res
        .status(500)
        .json({ success: false, message: 'Ocorreu um erro interno' });
    }
  }
}

module.exports = new AutomacaoController();
