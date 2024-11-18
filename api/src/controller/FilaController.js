const { exec } = require('child_process');

class FilaController {
  filaExecucao = [];
  executando = false;

  adicionarNaFila(script) {
    this.filaExecucao.push(script);
    console.log(`Script "${script.nome}" adicionado à fila.`);

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
      const script = this.filaExecucao.shift();

      console.log(`Executando script: ${script.nome}`);
      const comando = `python3 ./src/public/${script.arquivo}`;

      exec(comando, (error, stdout, stderr) => {
        if (error) {
          console.error(`Erro ao executar ${script.nome}:`, error.message);
        } else if (stderr) {
          console.error(`Erro no script ${script.nome}:`, stderr);
        } else {
          console.log(`Saída de ${script.nome}:`, stdout);
        }

        this.processarFila();
      });
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new FilaController();
