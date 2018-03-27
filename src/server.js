const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('./config');
const routes = require('./routes');

// Load mongoose package
const mongoose = require('mongoose');

// to do: connect to mLab database
// Connect to MongoDB
mongoose.connection.openUri(`mongodb://${config.db.username}:${config.db.password}@${config.db.host}/${config.db.dbName}`);

// Import all models
require('./models/card.model.js')

const app = express();

// Set Pug as templating engine
app.set('view engine', 'pug');
app.set('views', 'src/views');

// Set up routes for static files
const publicPath = path.resolve(__dirname, '../public');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/static', express.static(publicPath));
// Set up router
app.use(routes);
// app.use('/cards', cardRoutes);

app.listen(config.port, () => {
  console.log(`App is listening on ${config.port}`);
});
