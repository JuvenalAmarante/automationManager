const multer = require('multer');
const Automacao = require('../models/Automacao');
const connection = require('../database');
const ParametroAutomacao = require('../models/ParametroAutomacao');

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
          if (err) return res.status(500).json({ error: err.message });

          const { nome, parametros } = req.body;

          if (!nome || (parametros && !Array.isArray(parametros)))
            return res.status(400).json({ error: 'Campos inválidos' });

          if (parametros) {
            let contador = 0;

            for (const data of parametros) {
              const parametro = JSON.parse(data);

              if (!parametro.nome || !parametro.tipo_parametro_id) {
                break;
              }

              contador++;
            }

            if (contador != parametros.length)
              return res.status(400).json({ error: 'Campos inválidos' });
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

          if (parametros) {
            for await (const data of parametros) {
              const parametro = JSON.parse(data);

              await ParametroAutomacao.create(
                {
                  nome: parametro.nome,
                  automacao_id: automacao.id,
                  tipo_parametro_id: parametro.tipo_parametro_id,
                },
                {
                  transaction,
                }
              );
            }
          }

          res.status(201).json(automacao);

          await transaction.commit();
        } catch (error) {
          await transaction.rollback();

          res.status(500).json({ error: error.message });
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listar(req, res) {
    try {
      const automacoes = await Automacao.findAll();

      res.status(200).json(automacoes);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarDetalhes(req, res) {
    const { id } = req.params;

    if (!id || isNaN(+id))
      return res.status(400).json({ error: 'Automação não encontrada' });

    try {
      const automacao = await Automacao.findByPk(id);

      if (!automacao)
        return res.status(400).json({ error: 'Automação não encontrada' });

      const parametros = await ParametroAutomacao.findAll({
        where: {
          automacao_id: id,
        },
      });

      res.status(200).json({ ...automacao.dataValues, parametros });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AutomacaoController();
