import * as redis from 'redis'

const client = redis.createClient()

/**
 * Retrieve an object from the redis cache storage.
 *
 * @param key Key string used to store the object
 */
export async function get<T>(key: string): Promise<T | null> {
    return new Promise<T>((resolve, reject) => {
        client.get(key, (error, response) => {
            if (error) {
                reject(error)
            } else {
                resolve(JSON.parse(response))
            }
        })
    })
}

/**
 * Store an object in redis cache in a key-value pair style.
 *
 * @param key Cache key to retrieve the object
 * @param value Data to store. Must be JSON stringyfiable
 * @param expirationTime Time in seconds before invalidating the stored data
 */
export async function set(key: string, value: any, expirationTime: number = 60): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        client.setex(key, expirationTime, JSON.stringify(value), (error, response) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}

/**
 * Delete a key-value pair from the redis cache.
 *
 * @param key Key string used to store the object
 */
export async function del<T>(key: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        client.del(key, (error, response: any) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
    })
}
