let express = require('express'),
  mongoose = require('mongoose'),
  cors = require('cors')
// bodyParser = require('body-parser');
const api = require('../backend/routes/user.routes');
require('dotenv').config();

mongoose
  .connect(process.env.DATABASE_URL_ATLAS)
  .then((x) => {
    console.log(`connected to Mongo DB name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error(`Error connection to mongo: ${err.reason}`)
  })

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use('/api', api);
const PORT = process.env.port || 4000;
const server = app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
app.use((req, res, next) => {
  setImmediate(() => {
    next(new Error('Something has gone amiss.'));
  })
});
app.use(function(err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
})
