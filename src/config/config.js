import 'dotenv/config'
import fastifySession from '@fastify/session'
import ConnectMongoDBSession from 'connect-mongodb-session'
import { Admin } from '../models'

const MongoDBStore = ConnectMongoDBSession(fastifySession)

const store = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:'sessions'
})
sessionStore.on('error',(error)=>{
    console.log(error)
})

export const authenticate = async(email,password)=>{    
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        return true
    }
    return false
}
