//--- primeiramente precisamos importar o express
const express = require('express')

//--- agora aprecisamos criar uma aplicação com o express
const app = express()

//--- como esse projeto será publicado depois, já devemos fazer o tratamento do path
const path = require('path')

//---vamos agora importar os módulos do convert.js que usaremos para fazer a conversão dos valores
const convert = require('./lib/convert')

//---depois de testar separamdamente a API do banco central, vamos adicionar o módulo que contém a função que busca essa cotação
const apiBCB = require('./lib/api.bcb')

//--- devemos escolher o view engine, nesse caso estaremos utilizando o ejs
app.set('view engine', 'ejs')

//--- vamos passar o diretório que vai ter os views
app.set('views', path.join(__dirname, 'views'))

//---vamos definir um local para colocarmos nossos arquivos
app.use(express.static(path.join(__dirname, 'public')))

//---agora vamos fazer o render da página home
app.get('/', async (req, res) => {                            // tivemos que transformar essa operação em async pois apiBCB.getCotacao() é async
  const cotacao = await apiBCB.getCotacao()
  res.render('home.ejs', {
    cotacao
  })
})

//---vamos criar a página que vai aprentar a conversão do dinheiro
app.get('/cotacao', (req, res) => {
  //console.log(req.query)                              //fizemos isso apenas para ver se estávamos realmente passando os dois valores do formulário
  const { cotacao, quantidade } = req.query           //utilizando o destruction assingment, vamos retirar cotação e quantidade do req.query

  if (quantidade && cotacao) {
    const conversao = convert.convert(cotacao, quantidade)
    res.render('cotacao', {
      error: false,
      cotacao: convert.toMoney(cotacao),
      quantidade: convert.toMoney(quantidade),
      conversao: convert.toMoney(conversao)
    })
  } else {
    res.render("cotacao", {
      error: 'Valores inválidos'
    })
  }
})

//--- criar o listen da aplicação
app.listen(3000, err => {
  if (err) {
    console.log('a plicação não conseguiu iniciar')
  } else {
    console.log('ConvertMyMoney está online')
  }
})