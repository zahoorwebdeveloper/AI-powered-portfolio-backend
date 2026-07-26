// import { Pool } from 'pg'

// export const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: {
//     rejectUnauthorized: false 
//   }
// });
import mongoose from 'mongoose'

const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("mongodb connected successfully")
    } catch (error) {
        console.log("database error", error)
    }
}

export default connectDb