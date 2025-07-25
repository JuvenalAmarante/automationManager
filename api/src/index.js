require('./database');

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const routes = require('./routes');
const Connection = require('./database');

const app = express();

const throttle = rateLimit({
  windowMs: 30 * 1000,
  max: 100,
  keyGenerator: (req) => {
    return `${req.ip}:${req.originalUrl}`; // separa o controle por rota
  },
  message: {
    success: false,
    message: 'Espere alguns segundos antes de tentar novamente.',
  },
});

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(throttle);

app.use(routes);

app.use(function (err, req, res, next) {
  console.error(err.stack);

  res.status(500).send({ success: false, message: 'Ocorreu um erro interno!' });
});

const interval = setInterval(async function () {
  if (Connection.isConnected) {
    app.listen(3100, () => console.log('Servidor rodando na porta 3100'));

    clearInterval(interval);
  }
}, 10 * 1000);
