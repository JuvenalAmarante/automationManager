require('./database');

const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const Connection = require('./database');

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(function (err, req, res, next) {
  console.error(err.stack);

  res.status(500).send({ success: false, message: 'Ocorreu um erro interno!' });
});

const interval = setInterval(async function () {
  if ( Connection.isConnected) {
    app.listen(3100, () => console.log('Servidor rodando na porta 3100'));

    clearInterval(interval);
  }
}, 10 * 1000);