const multer = require('multer');
const Automacao = require('../models/Automacao');
const connection = require('../database');
const ParametroAutomacao = require('../models/ParametroAutomacao');
const TipoParametro = require('../models/TipoParametro');

class AutomacaoController {
  async criar(req, res) {
    try {
      let nomeArquivo = '';
      const storage = multer.diskStorage({
        destination: function (req, file, callback) {
          callback(null, `./src/public`);
        },
        filename: function (req, file, callback) {
          nomeArquivo =
            file.fieldname +
            '-' +
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

          callback(null, nomeArquivo);
        },
      });

      const upload = multer({ storage }).single('arquivo');

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
            !nomeArquivo ||
            (parametros && !Array.isArray(parametros))
          )
            return res
              .status(400)
              .json({ success: false, message: 'Campos inválidos' });

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

          const automacao = await Automacao.create(
            {
              nome,
              arquivo: nomeArquivo,
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
            data: { ...automacao.dataValues, parametros: parametrosSalvos },
          });

          await transaction.commit();
        } catch (error) {
          await transaction.rollback();

          res.status(500).json({ success: false, message: error.message });
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async listar(req, res) {
    try {
      const automacoes = await Automacao.findAll({
        where: {
          excluido: false,
        },
      });

      res.status(200).json({ success: true, data: automacoes });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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
      res.status(500).json({ success: false, message: error.message });
    }
  }

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

      res
        .status(200)
        .json({ success: true, message: 'Automação deletada com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async listarTiposParametro(req, res) {
    try {
      const tipos = await TipoParametro.findAll();

      res.status(200).json({ success: true, data: tipos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AutomacaoController();
