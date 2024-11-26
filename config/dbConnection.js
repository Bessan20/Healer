const mongoose = require('mongoose');

// Connect to MongoDB

const dbConnection = ()=>{

    mongoose.connect(process.env.DB_URI)
    .then((conn)=>{
        console.log(`Connected to MongoDB successfully: ${conn.connection.host}`);
    })
    
};

module.exports = dbConnection;