// Test MongoDB connection with detailed error messages
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
    try {
        console.log('🔍 Testing MongoDB Connection...\n');

        const mongoURI = process.env.MONGO_URI;
        console.log('📋 Connection String (masked password):');
        const maskedURI = mongoURI.replace(/:[^@]*@/, ':****@');
        console.log(maskedURI);

        console.log('\n⏳ Attempting connection...\n');

        const conn = await mongoose.connect(mongoURI, {
            maxPoolSize: 10,
            minPoolSize: 5,
            socketTimeoutMS: 45000,
            serverSelectionTimeoutMS: 10000,
        });

        console.log('✅ SUCCESS! MongoDB Connected!');
        console.log(`📦 Database: ${conn.connection.db.databaseName}`);
        console.log(`🖥️  Host: ${conn.connection.host}`);
        const collections = await conn.connection.db.listCollections().toArray();
        console.log(`📊 Collections: ${collections.length}`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ CONNECTION FAILED!\n');
        console.error(`Error: ${error.message}\n`);

        // Detailed troubleshooting
        if (error.message.includes('authentication failed')) {
            console.error('🔴 Authentication Error - This means:');
            console.error('   1. The username is wrong');
            console.error('   2. The password is wrong');
            console.error('   3. The user account is disabled\n');
            console.error('✅ Solution:');
            console.error('   1. Open MongoDB Compass');
            console.error('   2. Connect to mongodb://localhost:27017');
            console.error('   3. Update your .env file with MONGO_URI=mongodb://localhost:27017/smartstore\n');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.error('🔴 Local MongoDB Not Running:');
            console.error('   Start MongoDB locally, then connect in Compass to mongodb://localhost:27017\n');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('🔴 Host Not Found Error:');
            console.error('   The MongoDB hostname is incorrect\n');
        }

        process.exit(1);
    }
};

testConnection();
