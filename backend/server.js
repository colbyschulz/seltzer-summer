const express = require('express');
const cors = require('cors');
const raceRoutes = require('./routes/race.routes.js');
const userRoutes = require('./routes/user.routes.js');

const app = express();
const port = process.env.PORT || 3000;

// enable CORS for local dev
const corsOptions = {
  origin: 'http://localhost:8080',
};
app.use(cors(corsOptions));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/', raceRoutes);
app.use('/api/', userRoutes);

app.listen(port, () => {
  console.log('App is listening on port', port);
});
