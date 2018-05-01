const mongoose = require('mongoose');

// Only reconnect if needed. State is saved and outlives a handler invocation
let isConnected;

const connectToDatabase = () => {
  if (isConnected) {
    console.log('Re-using existing database connection');
    return Promise.resolve();
  }

  console.log('Creating new database connection');
  return mongoose.connect(process.env.MONGODB_URL).then(db => {
    isConnected = db.connections[0].readyState;
  });
};

module.exports = connectToDatabase;
