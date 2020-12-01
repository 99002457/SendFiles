const functions = require('firebase-functions');
const express= require('express');
const { response } = require('express');

const app=express(); //allows to the listen to the reuest and response
const firebase=require('firebase-admin')
const firebaseApp= firebase.initializeApp(
    functions.config().firebase
)
function getFacts()
{
    const ref= firebaseApp.database().ref('facts'); //geting the refernce
    console.log(ref.once('value').then(snap => snap.val()));
    return ref.once('value').then(snap => snap.val()); 
    //once for the getting data once since it returns the promise get the snapshot and unwrap the value
}
const engines=require('consolidate'); //import consolidate
app.engine('hbs',engines.handlebars);//creating the engine
app.set('views','./views');//setting the views folder
app.set('view engine','hbs');//using the engine created


// app.get('/timestamp',(request,response)=>{
// response.send(`${Date.now()}`)
// }); //get rest api to send the date and the response

// app.get('/timestamp-cached',(request,response)=>{
//     response.set('Cache-control','public, max-age=300, smax-age=60');
//  //seting cahche contal has 3 parts to it 1st part is public is to cahce the content on the server 
//  //if it is private it can only be cached on the user browser
//  //max-age how long can we store this value in the user browser , its in ms
//  //smax-age is how long can we store this in the CDN (content delivery networks)
//      response.send(`${Date.now()}`);
//     }); //cache the conent by setting the cached control header

app.get('/',(request,response)=>{
    response.set('Cache-control','public, max-age=300, smax-age=60');
 //seting cahche contal has 3 parts to it 1st part is public is to cahce the content on the server 
 //if it is private it can only be cached on the user browser
 //max-age how long can we store this value in the user browser , its in ms
 //smax-age is how long can we store this in the CDN (content delivery networks)
     getFacts().then(facts=>{
        response.render('index',{ facts });
        return Promise.resolve(facts); //rendering the index page with some facts data that is retrived 
     }).catch(e=>{
         console.log(e);
         response.sendStatus(500);
     })
    
    }); //cache the conent by setting the cached control header

    app.get('/facts.json',(request,response)=>{
        response.set('Cache-control','public, max-age=300, smax-age=60');
     //seting cahche contal has 3 parts to it 1st part is public is to cahce the content on the server 
     //if it is private it can only be cached on the user browser
     //max-age how long can we store this value in the user browser , its in ms
     //smax-age is how long can we store this in the CDN (content delivery networks)
         getFacts().then(facts=>{
            response.json(facts);
            return Promise.resolve(facts); //rendering the index page with some facts data that is retrived 
         }).catch(e=>{
             console.log(e);
             response.sendStatus(500);
         })

        }); //cache the conent by setting the cached control header
        

exports.app = functions.https.onRequest(app); //on request call the function in the parameter list

