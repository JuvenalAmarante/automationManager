import json
import requests

requisicao = requests.get('http://localhost:3100/tipos-parametros')

dados = json.loads(requisicao.text)

for dado in dados:
    print(dado['nome'])
