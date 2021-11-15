const convert = (cotacao, quantidade) => {
  return cotacao * quantidade
}

const toMoney = valor => {                    // assim vamos ter o retorno do número com apenas duas casas decimais
  return parseFloat(valor).toFixed(2)         //temos que utilizar o parsefloat para que não ocorra nenhum erro. pois o valor pode não ser um número, fazendo isso garantimos que será um número
}

module.exports = {
  convert,
  toMoney
}