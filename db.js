const MongoClient = require('mongodb').MongoClient
const Config = require('config')

const url = Config.get("dbConfig.url")
const db_name = Config.get("dbConfig.dbName")

async function connect() {
    return await MongoClient.connect(url, {useNewUrlParser: true})
}

let client = null
let db = null

module.exports = {
    getCollection: async name => {
        if(client == null) {
            client = await connect()
            db = client.db(db_name)
        }
        return db.collection(name)
    },
    close: async () => {
        return await client.close()
    }
}