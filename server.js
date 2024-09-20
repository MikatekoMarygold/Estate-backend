const express = require('express');
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const path = require('path')

const allowedOrigins = [
    'http://localhost:4200',
  ];

  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200
  };

  //Middleware
app.use(express.json())
app.use(cors(corsOptions))

// Routes
const routes = require('./Routes/routes');
app.use(routes);

app.listen(PORT, ()=> {
    console.log(`App running on port ${PORT}...`)
})