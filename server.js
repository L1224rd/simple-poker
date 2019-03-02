// ==================== EXTERNAL IMPORTS ==================== //

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// ==================== INTERNAL IMPORTS ==================== //

// ==================== GLOBAL VARIABLES ==================== //

const app = express();

let cardsTaken = [];

// ==================== MIDDLEWARE ==================== //

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// use ejs template tag engine
app.set('view engine', 'ejs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// serving static files
app.use('/views', express.static(path.join(__dirname, 'views')));

// ==================== FUNCTIONS ==================== //

// returns the full path of the passed view
const getViewPath = view => path.join(__dirname, `views/${view}.ejs`);

// ==================== FUNCTIONS ==================== //

const getCard = () => {
  const card = Math.floor(Math.random() * 52) + '';
  if (cardsTaken.indexOf(card) !== -1) {
    if (cardsTaken.length === 52) {
      return 'error';
    }
    return getCard();
  } else {
    cardsTaken.push(card);
    return card;
  }
};

// ==================== RENDER VIEWS ==================== //

app.get('/', (req, res) => {
  res.render(getViewPath('home'));
});

app.get('/reset', (req, res) => {
  cardsTaken = [];
  res.send('reset');
});

app.get('/card', (req, res) => {
  if(cardsTaken.length === 4){
    getCard();
    getCard();
  }
  const card = getCard();
  if (card === 'error') {
    res.send('error');
    return;
  }
  res.send(card);
});

app.get('/caraca', (req, res) => {
  res.send(cardsTaken);
});

app.get('/cards', (req, res) => {
  res.send({
    status: cardsTaken.length,
    cards: cardsTaken.slice(4)
  });
});

// ==================== START SERVER ==================== //

app.listen(process.env.PORT || 3000, () => {
  console.log('READY');
});

// ====================================================== //