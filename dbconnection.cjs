const {MongoClient} = require('mongodb')

let dbConnection
function connectToDb(callBack){
    MongoClient.connect('mongodb+srv://mirudhun:12345MK@cluster0.badfswp.mongodb.net/ExpenseTracker?retryWrites=true&w=majority').then(function(client) {
        dbConnection = client.db()
        callBack()
    }).catch(function(error){
        callBack(error)
    })
}

function getdb(){
    return dbConnection
}

//Exporting the required functions
module.exports = {connectToDb, getdb}