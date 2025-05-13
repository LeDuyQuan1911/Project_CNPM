const mongoose = require('mongoose');

const connection = async () => {
  try {
    const uri = 'mongodb+srv://leduyquan2574:Quan19112003@quan.bqfgfhl.mongodb.net/CNPM?retryWrites=true&w=majority';

    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connection;
