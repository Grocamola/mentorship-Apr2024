const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); 

const triviaRoutes = require('./routes/trivia-routes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', triviaRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

