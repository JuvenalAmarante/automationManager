require('./database');

const express = require('express');
const cors = require('cors')

const routes = require('./routes');

const app = express();

app.use(cors())
app.use(express.json());

app.use(routes);

app.use(function (err, req, res, next) {
  console.error(err.stack);

  res.status(500).send({ success: false, message: 'Ocorreu um erro interno!' });
});

app.listen(3100, () => console.log('Servidor rodando na porta 3100'));
