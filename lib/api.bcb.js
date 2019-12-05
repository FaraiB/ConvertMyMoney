const axios = require('axios')

const getUrl = data => `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)?@dataCotacao=%27${data}%27&$top=100&$format=json`
const getRateAPI = url => axios.get(url)
const extractRate = res => res.data.value[0].cotacaoVenda
const getToday = () => {
    const today = new Date()
    return (today.getMonth()+1) + '-' + today.getDate() + '-' + today.getFullYear()//can only get today's rate after 13:09, use day-1 for yesterday's
}
const getRate = ({getToday, getUrl, getRateAPI, extractRate}) => async() => {
    try{
        const today = getToday()
        const url = getUrl(today)
        const res = await getRateAPI(today)//'11-27-2019'
        const rate = extractRate(res)
        return rate
    }catch(err){
        return ''
    }
    
}

module.exports = {
    getRateAPI,
    getRate: getRate({ getToday, getUrl, getRateAPI, extractRate}),
    extractRate,
    getUrl,
    getToday, 
    pure: {
        getRate
    }
}