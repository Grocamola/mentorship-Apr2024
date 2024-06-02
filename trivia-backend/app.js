const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); 

const triviaRoutes = require('./routes/trivia-routes');
const tictactoeRoutes = require('./routes/tictactoe-routes')

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    methods: 'GET,POST,PUT,DELETE', // Specify allowed HTTP methods
    credentials: true // If you need to allow cookies to be sent with the requests
  }));

app.use('/auth', triviaRoutes);
app.use('/tic-tac-toe', tictactoeRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

