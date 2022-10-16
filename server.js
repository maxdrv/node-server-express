const express = require('express');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvents')
const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger)

// build in middleware to handle urlencoded data
// in other words, form data: content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// build in middleware for json
app.use(express.json());

// middleware to serve static files
// so express will search files to server
app.use(express.static(path.join(__dirname, '/public')));


app.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})

app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})

app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html');  // 302 by default  // we put 301 explicitly so search engine know that link was moved permanently
})

app.get('/hello(.html)?', (req, res, next) => {
    console.log('attempted to load hello.html');
    next();
}, (req, res) => {
    res.send('Hello world!');
});

const one = (req, res, next) => {
    console.log('one');
    next();
}

const two = (req, res, next) => {
    console.log('two');
    next();
}

const three = (req, res) => {
    console.log('three');
    res.send('Finished');
}

app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
