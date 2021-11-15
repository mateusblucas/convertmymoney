// primeiramente precisamos importar o convert que queremos testar

const { TestWatcher } = require('@jest/core')
const convert = require('./convert')

// agora vamos criar novamente o teste informando o que nós esperamos que aconteça

test('convert cotacao 4 and quantidade 5', () => {
  expect(convert.convert(4, 5)).toBe(20)      //aqui litoralmente nós informamos o que nós esperamos que seja o resultado do processamento da função seja, para que isso posso ser automaticmaent testado
})

test('convert cotacao 4 and quantidade 4', () => {
  expect(convert.convert(4, 4)).toBe(16)      //aqui litoralmente nós informamos o que nós esperamos que seja o resultado do processamento da função seja, para que isso posso ser automaticmaent testado
})

test('toMoney converts float', () => {
  expect(convert.toMoney(2)).toBe('2.00')
})

test('toMoney converts string', () => {       //como utilizamos um parse float para forçar que qualquer coisa que entre na função seja reconhcido como um float, esperamos que ao receber uma string, a função continue funcionando
  expect(convert.toMoney('2')).toBe('2.00')
})