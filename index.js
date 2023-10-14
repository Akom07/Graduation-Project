const express = require('express');
const app = express();
const path = require('path');



app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

const homeRoute = require('./routes/homeRoute')
app.use('/', homeRoute)

const aiRoute = require('./routes/aiRoute')
app.use('/formsub', aiRoute)

const maniualRoute = require('./routes/maniualRoute')
app.use('/maniual', maniualRoute)

// const aboutUsRoute = require('./routes/aboutUsRoute')
// app.use('/', aboutUsRoute)






app.listen(3000, () => {

    console.log("we are on port 3000")
})