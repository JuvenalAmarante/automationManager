require('./database');

const express = require('express');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use(routes);

app.listen(3100, () => console.log('Servidor rodando na porta 3100'));
