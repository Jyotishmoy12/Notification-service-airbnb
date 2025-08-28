import Redis from "ioredis";
import { serverConfig } from ".";

function connectToRedis() {
  try {
    let connection:Redis;
    const redisConfig = {
      port: serverConfig.REDIS_PORT,
      host: serverConfig.REDIS_HOST,
      maxRetriesPerRequest: null, // to prevent the client from exiting after a certain number of retries
    }; 

    return () =>{
        if(!connection){
            connection = new Redis(redisConfig);
            return connection;
        }
        return connection;
    }

    
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw error;
  }
}
// Singleton pattern to ensure a single Redis connection instance
// throughout the application lifecycle
// when we call getRedisConnectionObject it will return the connectToRedis function
// then we call that function it will return the Redis connection instance
// if the connection instance is not created it will create one and return it
// if the connection instance is already created it will return the existing one
export const getRedisConnectionObject = connectToRedis();