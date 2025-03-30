const mongoose = require('mongoose');

// Connect to MongoDB
const dbConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI);
        console.log(`Connected to MongoDB successfully: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
    }
};

module.exports = dbConnection;
