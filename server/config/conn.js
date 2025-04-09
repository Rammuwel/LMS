import mongoose from "mongoose";









//connect to mogodb database

const connectDB = async ()=>{
 
    mongoose.connection.on('connected', ()=>console.log('Database connected'))
    await mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
}

export default connectDB;