const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://ukonulucky22:CDVqIrKCKUAnFVTf@cluster0.4zp1quv.mongodb.net/';

const connectDb = async () => {
 try{
const res =  await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  return res
 }catch(err){
 console.log(err.message)
 }
      

      
}

module.exports = connectDb