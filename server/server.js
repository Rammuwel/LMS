import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/conn.js'
import { clerkWebhooks } from './controllers/webHook.js'


//initialize express
const app = express()


//connect to database 
await connectDB()


//middleware 
app.use(cors())

//routes
app.get('/', (req, res)=>res.send("hellow jee kaise ho app"))
app.post('/clerk', express.json(), clerkWebhooks);

//Port 
const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})