const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.set('view engine', 'ejs')


app.listen(port, () => console.log('iRango Server Running...'))