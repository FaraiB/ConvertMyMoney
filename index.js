const express = require('express')//imports express
const app = express()// creates new express application
const path = require('path')

const convert = require('./lib/convert')

app.set('view engine', 'ejs')//in order to use ejs
app.set('views', path.join(__dirname, 'views'))//create a dir using current + views
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/rate', (req, res) => {
    const{ rate, qty} = req.query
    if(rate && qty){
        const conversion = convert.convert(rate, qty)
        res.render('rate', {
        error: false,
        rate: convert.toMoney(rate),
        qty: convert.toMoney(qty),
        conversion: convert.toMoney(conversion)
    })
    }else{
        res.render('rate', {
            error: 'Invalid values'
        })
    }
    
})

app.listen(3000, err =>{
    if(err){
        console.log('The server could not be started')
    }else{
        console.log('The ConvertMyMoney server has started...')
    }
})
