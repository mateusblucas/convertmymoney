// teste para a api do banco central do brasil
const api = require('./api.bcb')

// como  a função testada utiliza o axios, não é mais um teste unitário, então precisamos mockar o axios 
const axios = require('axios')
jest.mock('axios')      //basicamente estamos informando ao jest que ao chamar o axios aqui, não estamos usando o axios de verdade, estamos passando uma versão

test('getCotacaoAPI', () => {
  const res = {                           // criamos isso para que seja possível comparar a resposta com esse objeto
    data: {
      value: [
        { cotacaoVenda: 3.90 }
      ]
    }
  }
  axios.get.mockResolvedValue(res)        // assim estamos dizendo que ao chamra o axios.get, ele não vai utilizar  o axios do arquivo origianl e sim o axios que criamos aqui. Basicamente nós escrevemos a resposta que esperamos do axios.get no arquivo da api. Assim isolamos o teste para que ele seja um teste unitário
  api.getCotacaoAPI('url').then(resp => {
    expect(resp).toEqual(res)                    // ao rodar o teste nós esperamos que o resp seja igual ao res
    expect(axios.get.mock.calls[0][0]).toBe('url')
  })
  // acima estamos testando se o getCotacaoAPI chama o axios.get passando a url certa que passamos como parâmetro
})

test('extractCotacao', () => {
  const res = {                           // utilizamos o mesmo res de cima para que possamos passar isso para o extractPrice e ver se será extraído o valor esperado
    data: {
      value: [
        { cotacaoVenda: 3.90 }
      ]
    }
  }
  expect(api.extractPrice(res)).toBe(3.9)
})

// para testar o getToday, teremos que fazer alguns tratamentos diferenciados pq estamos usando o Date que é um componenten do global
// para isso podemos fixar a data que o objeto vai retornar
describe('getToday', () => {                   // ao utilizar o describe, podemos agrupar testes, e como acabamos criando mais um módulo aqui, podemos criar variáveis e funções que serão utilizadas nos testes contidos aqui
  const realDate = Date                     // esse é o global date que tem no objeto, estamos fazendo uma cópia dele aqui para guardar

  function mockDate(date) {
    global.Date = class extends realDate {       //utilizando o global date, estamos sobreescrevendo o date de cima. utilizamos o class extends pois ele é uma classe e vai estender o date original com uma diferença
      constructor() {                            // a diferença anterior é que no construtor dela, ao invez de deixar que ocorra normalmente pegando a data, vamos fazer com que ele retorne o date que definimos como entrada na função mockDate
        return new realDate(date)
      }
    }
  }

  afterEach(() => {                                   // aqui usamos o afterEach para que depois de cada teste, o date retorne a ser o date de antes do mock
    global.Date = realDate
  })

  test('getToday', () => {
    mockDate("2019-04-04T12:00:00z")                  // para que ele entenda a data, ela deve ser passada no formato isso                                        
    const today = api.getToday()
    expect(today).toBe('4-4-2019')
  })

})

test('getURL', () => {
  const url = api.getUrl('minha-data')
  expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27minha-data%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})

// para que seja poossível testar o getCotacao, temos que mockar todas as funções que fizemos a injeção de dependência no código do arquivo original
test('getCotacao', () => {
  const res = {                           // criamos isso para que seja possível comparar a resposta com esse objeto
    data: {
      value: [
        { cotacaoVenda: 3.90 }
      ]
    }
  }

  //vamos criar funções falsas de todas as funções que serão passada como dependências
  const getToday = jest.fn()
  getToday.mockReturnValue('04-04-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockResolvedValue(res)                                //acho que aqui usamos o resolved pq a resposta da função é um objeto

  const extractPrice = jest.fn()
  extractPrice.mockReturnValue(3.9)

  api.pure.getCotacao({ getToday, getUrl, getCotacaoAPI, extractPrice })()
    .then(res => {
      expect(res).toBe(3.9)
    })
})

//agora vamos testar quando ocorre um erro na extração de preço ou quando o nosso res não vem no formato correto, não achamos o servidor da api ou qualquer coisa nesse sentido
test('getCotacaoerro', () => {
  const res1 = {                           // criamos isso para que seja possível comparar a resposta com esse objeto

  }

  //vamos criar funções falsas de todas as funções que serão passada como dependências
  const getToday = jest.fn()
  getToday.mockReturnValue('04-04-2019')

  const getUrl = jest.fn()
  getUrl.mockReturnValue('url')

  const getCotacaoAPI = jest.fn()
  getCotacaoAPI.mockReturnValue(Promise.reject('err'))                                //aqui nós passamos que a promessa foi rejeitada, assim vai entrar na excessão do try catch

  const extractPrice = jest.fn()
  extractPrice.mockReturnValue(3.9)

  api.pure.getCotacao({ getToday, getUrl, getCotacaoAPI, extractPrice })()
    .then(res => {
      console.log(res)
      expect(res).toBe('')
    })
})