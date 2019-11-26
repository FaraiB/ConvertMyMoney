const  convert = (rate, qty) => {
    return rate * qty
}
const toMoney = value => {
    return parseFloat(value).toFixed(2)
}

module.exports = {
    convert, 
    toMoney
}