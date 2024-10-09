import 'dotenv/config'
import fastifySession from '@fastify/session'
import ConnectMongoDBSession from 'connect-mongodb-session'


//a session will be created for every user who logs in
// Creating a MongoDB session store
const MongoDBStore = ConnectMongoDBSession(fastifySession)

// Configuring the MongoDB session store
export const sessionStore = new MongoDBStore({
    uri:process.env.MONGO_URI,
    collection:'sessions'
})
sessionStore.on('error',(error)=>{
    console.log(error)
})


// Authenticating the admin user
export const authenticate = async(email,password)=>{    
    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        return Promise.resolve({email:email ,password:password})
    }
    return Promise.resolve(false)
}

// Setting the port for the server
export const PORT = process.env.PORT || 3000;
// Setting the cookie password
export const COOKIE_PASSWORD = process.env.COOKIE_PASSWORD;
