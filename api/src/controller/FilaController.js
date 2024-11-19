const { exec } = require('child_process');

class FilaController {
  filaExecucao = [];
  executando = false;

  adicionarNaFila(dados, parametros) {
    this.filaExecucao.push({ dados, parametros });
    console.log(`Automacao "${dados.nome}" adicionado à fila.`);

    console.log(
      '🚀 ~ FilaController ~ adicionarNaFila ~ this.executando:',
      this.executando
    );
    if (!this.executando) {
      this.processarFila();
    }
  }

  processarFila() {
    try {
      if (this.filaExecucao.length === 0) {
        console.log('Fila vazia, aguardando novas tarefas.');
        this.executando = false;
        return;
      }

      this.executando = true;
      const automacao = this.filaExecucao.shift();

      console.log(`Executando automação: ${automacao.dados.nome}`);
      let comando = `python3 ./src/public/${automacao.dados.arquivo}`;

      automacao.parametros.forEach((parametro) => {
        comando += ` --${parametro.nome} "${parametro.valor}"`;
      });

      exec(comando, (error, stdout, stderr) => {
        if (error) {
          console.error(
            `Erro ao executar ${automacao.dados.nome}:`,
            error.message
          );
        } else if (stderr) {
          console.error(`Erro no automação ${automacao.dados.nome}:`, stderr);
        } else {
          console.log(`Saída de ${automacao.dados.nome}:`, stdout);
        }

        this.processarFila();
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new FilaController();
