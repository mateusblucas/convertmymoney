const axios = require('axios')

//--- sempre que formos utilizar o templateString (introdução de uma variável no meio de uma string) devemos utilizar a cráse ao invés das aspas simples
const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

axios
  .get(url)
  .then(res => console.log(res.data.value[0].cotacaoVenda))
  .catch(err => console.log(err))