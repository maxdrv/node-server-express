const express = require('express');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const cors = require("cors");
const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger)

// Cross Origin Resource Sharing
const whitelist = ['https://www.google.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

// build in middleware to handle urlencoded data
// in other words, form data: content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// build in middleware for json
app.use(express.json());

// middleware to serve static files
// so express will search files to server
app.use(express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));


app.use('/', require('./routes/root'));

// this will route any request for subdir into router/subdir
app.use('/subdir', require('./routes/subdir'));
app.use('/employees', require('./routes/api/employees'));


// everything that get in here should be 404
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({error: '404 Not Found'});
    } else {
        res.type('txt').send('404 Not Found');
    }
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
