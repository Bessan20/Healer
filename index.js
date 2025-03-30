console.log("Hello world");
//* dotenv 
require('dotenv').config({path : '.env'});//!must write the path

//* import express and  create app from express
const express = require('express');
const app = express();

//* import morgan - helmet - cors
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

//* import db connection
const dbConnection = require('./config/dbConnection.js');


//* import custom middlewares
const logging = require('./middlewares/logging.js');

//*import routes 
const authRouter = require('./routes/authRouter.js');
const profileRouter = require('./routes/profileRoute.js');
const doctorRouter = require('./routes/doctorRouter.js');
const appointmentRouter = require('./routes/appointmentRouter.js');

//*import global error
const globalError = require('./middlewares/globalError.js');

//dbConnection
dbConnection();



//* Builtin middlewares
app.use(helmet());
app.use(cors());
app.use(express.static('./public'));
app.use(bodyParser.json({extended:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(logging);



//* endpoints
app.use('/api/v1',authRouter);
app.use('/api/v1/userProfile',profileRouter);
app.use('/api/v1/doctor',doctorRouter);
app.use('/api/v1/appointment',appointmentRouter);

app.use(globalError);

//*listening to port
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT , ()=>{

    console.log(`Successfully listening to port ${PORT}`);
});

//*Unhandled rejection
process.on("unhandledRejection",(err)=>{
    console.error(`unhandledrejection Errors : ${err.name} | ${err.message}`);
    server.close(()=>{
        console.log(`Shutting down`);
        process.exit(1);
    })
    
});


module.exports = app;
