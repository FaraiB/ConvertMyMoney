const api = require('./api.bcb')
const axios = require('axios')

jest.mock('axios')

test('getRateAPI', () =>{
    const res = {
        data: {
            value: [
                {cotacaoVenda: 4.12}
            ]
        }
    }
    axios.get.mockResolvedValue(res)
    api.getRateAPI('url').then( resp =>{
        expect(resp).toEqual(res)
        expect(axios.get.mock.calls[0][0]).toBe('url')
    })
})
test('extractRate', () =>{
    const rate = api.extractRate({
        data: {
            value: [
                {cotacaoVenda: 4.12}
            ]
        }
    })
    expect(rate).toBe(4.12)
})
describe('getToday', () =>{
    const RealDate = Date

    function mockDate(date){
        global.Date = class extends RealDate{
            constructor(){
                return new RealDate(date)
            }
        }
    }
    afterEach(() => {
        global.Date = RealDate
    })

    test('getToday', () => {
        mockDate('2019-01-01T12:00:00z')
        const today = api.getToday()
        expect(today).toBe('1-1-2019')
    })
})

test('getUrl', () => {
    const url = api.getUrl('MINHA-DATA')
    expect(url).toBe('https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27MINHA-DATA%27&$top=100&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao')
})

test('getRate', () => {
    const res = {
        data: {
            value: [
                {cotacaoVenda: 4.12}
            ]
        }
    }
    const getToday = jest.fn()
    getToday.mockReturnValue('01-01-2019')
    
    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')

    const getRateAPI = jest.fn()
    getRateAPI.mockResolvedValue(res)

    const extractRate = jest.fn()
    extractRate.mockReturnValue(4.12)

    api.pure
        .getRate({ getToday, getUrl, getRateAPI, extractRate })()
        .then( res => {
            expect(res).toBe(4.12)
        })
})
//test for error
test('getRate', () => {
    const res = {
    }
    const getToday = jest.fn()
    getToday.mockReturnValue('01-01-2019')
    
    const getUrl = jest.fn()
    getUrl.mockReturnValue('url')

    const getRateAPI = jest.fn()
    getRateAPI.mockReturnValue(Promise.reject('err'))

    const extractRate = jest.fn()
    extractRate.mockReturnValue(4.12)

    api.pure
        .getRate({ getToday, getUrl, getRateAPI, extractRate })()
        .then( res => {
            expect(res).toBe('')
        })
})
