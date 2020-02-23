//es5 way of importing: we are creating a new variable called eventRecommender that has a object with all of the exported items from eventonica.js 
// //thus to access the class must do new eventRecommender.EventRecommender
let eventRecommender = require('./eventonica.js')
er = new eventRecommender.EventRecommender();
// //Give data to the server
er.addUser({'name':'Tom','userId':'cf61b'});
er.addUser({'name':'Sally','userId':'996a0'});
er.addUser({'name':'Polly','userId':'569a1'});
er.addEvent({"name":'Factorials!', "eventId": 1, "category":'Math', "date": '2020-02-17'});
er.addEvent({"name":'War and Peace', "eventId": 2, "category":'reading', "date":'2020-03-23'});
er.addEvent({"name":'Beach Volley Ball', "eventId": 3, "category":'sport', "date":'2020-04-15'});
er.saveUserEvent({'name':'Tom','userId':'cf61b'}, {"name":'Factorials!', "eventId": 1, "category":'Math', "date": '2020-02-17'});
er.saveUserEvent({'name':'Sally','userId':'996a0'}, {"name":'War and Peace', "eventId": 2, "category":'reading', "date":'2020-03-23'});
er.saveUserEvent({'name':'Polly','userId':'569a1'}, {"name":'Beach Volley Ball', "eventId": 3, "category":'sport', "date":'2020-04-15'});
//es6 way of importing
// import {EventRecommender} from './eventonica.js';// to get er class let er = new EventRecommender();

// let mysql   = require('mysql'); //mysql is a database es5 way of importing mysql
//express is a web application framework for Node

const Joi = require('joi');
// import express from 'express'//es6 way of importing express
let express = require('express'); //es5 way of importing express
let app = express();

app.use(express.json()); // to use the json file
// import bodyParser from 'body-parser'; //body parser parses the json that is sent via request/post and allows it to be manipulated via javascript
let bodyParser = require('body-parser');//Es5 way of importing body Parser 
app.use(bodyParser.json()); //telling express to use body parser
app.use(bodyParser.urlencoded({extended: true})); //use when not using ajax i.e. purely html

/*application settings i.e. setting the views folder and static folders*/
//any request that comes from the document or ajax request we will look inside the directory
app.use(express.static('public'));
//get the file and send it to the server
app.get('/', function (req, res) {

  res.sendFile('/index.html', {root: __dirname});
})
//Display the list of Users when URL consist of eventRecommender users
//working
app.get('/api/users', function(req, res){
  res.send(er.users);// send user infomation
})
//working
app.post('/api/users', (req, res) =>{
  //validate 
  const schema = {
    name: Joi.string().min(3).required()
  }

  const {error} = validateUser(req.body);
  if (error){
    //400 bad request
    res.status(400).send('Name is required and should be minimum 3 characters');
    console.log(error.details[0].message);
    return;
  }
  const user = {
    name: req.body.name,
    userId: Math.random().toString(16).substr(2, 5),
  };
  er.addUser(user);
  res.json(user);
})

//Display the information of specific User when you mention the id.
// working
app.get('/api/users:id', function(req, res){
  const id = req.params.id.slice(1); 
  // console.log('id:', id)
  const user = er.findUser(id);//checks
  res.json(user);// send user infomation
})

//delete user
app.delete('/api/users:id', function(req, res){
  const id = req.params.id.slice(1); 
  // console.log('id:', id)
  const user = er.findUser(id)
  if(user){
    er.deleteUser(id);
    res.status(200).send(`${user.name} has been deleted from the users`)
  }else{
    res.status(400).send('error user has not been deleted')
  }
})

app.get('/api/events', function(req, res){
  res.send(er.events);// send user infomation
})
// working
app.post('/api/events', (req, res) =>{
  const event = {
    name: req.body.name,
    eventId: req.body.eventId || Math.random().toString(16).substr(2, 5),
    category: req.body.category, 
    date: req.body.date
  };

  if(er.findEvent(event.eventId) === "Invalid event"){
    er.addEvent(event);
  } else {
    res.status(400).send('event already exist!')
  }
  res.json(event);
})

//Display the information of specific event when you mention the id.
// working
app.get('/api/events:id', function(req, res){
  const id = parseInt(req.params.id.slice(1)); 
  const event = er.findEvent(id);//checks
 
  res.json(event);// send user infomation
})

//delete event
app.delete('/api/events:id', function(req, res){
  const id = parseInt(req.params.id.slice(1)); 
  // console.log('id:', id)
  const event = er.findEvent(id)
  if(event){
    er.deleteEvent(id);
    res.status(200).send(`${event.name} has been deleted from events`)
  }else{
    res.status(400).send('error event has not been deleted')
  }
})

// edit this for events working
app.put('/api/userEvents', (req, res) =>{
  const user = er.findUser(req.body.user['userId']);//checks
  const event = er.findUser(req.body.event['eventId']);//checks
  //if there is no valid user ID, then display an error with the following message
  if(user && event) {
    res.status(200).send('<h2 style="font-family: Malgun Gothic; color green;">Saved event!</h2>')
  }
  {
    res.status(404).send('<h2 style="font-family: Malgun Gothic; color darkred;">Oooops... Cant find what you are looking for</h2>');
  }
  er.saveUserEvent(user.userId, event.eventId);
})

function validateUser(user){
  const schema = {
    name: Joi.string().min(3).required()
  }
  return Joi.validate(user, schema);
}
//PORT environment variable
const port = process.env.PORT || 3000; //process environment
app.listen(port, () => console.log(`Listening on port ${port}`));
// let server = app.listen(3000, function () {
//   let host = server.address().address;
//   let port = server.address().port;
//   console.log('your app is running at http://%s:%s', host, port);
// });
