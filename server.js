const express = require('express');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require('./middleware/verifyJWT')
const PORT = process.env.PORT || 3500;

//custom middleware logger
app.use(logger)

// cross-origin resource sharing
app.use(cors(corsOptions))

// build in middleware to handle urlencoded model
// in other words, form model: content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}));

// build in middleware for json
app.use(express.json());

// middleware to serve static files
// so express will search files to server
app.use(express.static(path.join(__dirname, '/public')));

// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
// everything under that line will use jwt verification
app.use(verifyJWT);
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
