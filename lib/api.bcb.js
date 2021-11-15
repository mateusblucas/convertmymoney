const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`

const getCotacaoAPI = url => axios.get(url)
const extractPrice = (res) => res.data.value[0].cotacaoVenda
const getToday = () => {
  const today = new Date()
  return today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear()
}

const getCotacao = ({ getToday, getUrl, getCotacaoAPI, extractPrice }) => async () => {                // aqui colocamos o deps e uma arrow function para que seja possível realizar um ainjeção de dependências, dessa forma podemos passar as dependêncisa para realizar testes
  try {                                         // colocamos o try aqui pq caso algo vá quebrar a execução do código, certamente será no getCotacaoAPI
    const today = getToday()                    // aqui nós pegamos a data atual
    const url = getUrl(today)                   // aqui nós geramos a url com a data atual
    const res = await getCotacaoAPI(url)        // aqui pegamos a resposta do get utilizando a URL
    const cotacao = extractPrice(res)           // aqui nós vamos estrair o valor da cotação de dentro do objeto que recebemos no get
    return cotacao
  } catch (err) {
    return ''                                   // aqui retornamos vazio para garantir que não teremos nada no input da cotação caso haja algum erro
  }
}

module.exports = {
  getCotacaoAPI,
  getCotacao: getCotacao({ getToday, getUrl, getCotacaoAPI, extractPrice }),          //precisamos fazer dessa forma para que ao ser exportado, possa ser utilizado com as dependências que serão injetadas
  extractPrice,
  getToday,
  getUrl,
  pure: {
    getCotacao                                                //aqui nós estamos exportando o getCotacao pure, sem as denpendências, dessa forma temos acesso a esse módulo das duas formas
  }
}