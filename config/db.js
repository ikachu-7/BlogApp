const mongoose = require('mongoose');

exports.connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database Connected at ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}