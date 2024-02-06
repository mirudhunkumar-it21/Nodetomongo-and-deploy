const express = require('express')
const bodyParser = require('body-parser')
//Import the required functions for the connection in dbconnection.cjs
const {connectToDb, getdb} = require('./dbconnection.cjs')
const { ObjectId } = require('mongodb')

let db
const app = express()
app.use(bodyParser.json())

connectToDb(function(error){
    if(error){
        console.group('could not establish connection......')
        console.log(error)
    }else{
    app.listen(8000)
    db = getdb()
    console.log(' listening on port 8000...') 
    }
})
/**
 * Expense Tracker
 * Functionalities : adding entry, getting the summaries of previous entries, editing and deleting
 * Input fields : Category, Amount, Date
 * 
 * CRUD : Create, Read, Update and Delete
 * 
 * get-entries / get-data - GET
 * add-entry - POST
 * edit-entry - PATCH
 * delete-entry - DELETE
 */

app.post('/add-entry', function(request, response) {
    db.collection('trackexpense').insertOne(request.body).then(function() {
        response.status(201).json({
            "status" : "Entry added successfully"
        })
    }).catch(function () {
        response.status(500).json({
            "status" : "Entry not added"
        })
    })
})


app.get('/get-entry', function(request, response) {
    //Declaring an empty array
    const entries = []
    db.collection('trackexpense')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function(){
        response.status(500).json({
        "status" : "could not fetch documents"
    })
})
})
// status code starting with 5 denotes server side error
//status code starting with 4 denotes client side error


app.delete('/delete-entry', function(request, response){
    if( ObjectId.isValid(request.query.id)){
    db.collection('trackexpense').deleteOne({
        _id : new ObjectId(request.query.id)
    }).then(function(){
        response.status(200).json({
            "status" : "deleted succesfully"
        })
    }).catch(function(){
        response.status(500).json({
            "status" : "deleted unsuccesfully"
        })
    })
    }else{
    response.status(500).json({
        "status" : "ObjectId not valid"
    })
}
})

app.patch('/update-entry/:id', function(request, response) {
    if(ObjectId.isValid(request.params.id)) {
        db.collection('ExpensesData').updateOne(
            { _id : new ObjectId(request.params.id) }, // identifier : selecting the document which we are going to update
            { $set : request.body } // The data to be updated
        ).then(function() {
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function() {
            response.status(500).json({
                "status" : "Unsuccessful on updating the entry"
            })
        })
    } else {
        response.status(500).json({
            "status" : "ObjectId not valid"
        })
    }
})