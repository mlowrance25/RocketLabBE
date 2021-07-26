require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const seedData = require('./test/seeddata');

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

var mongoose = require('mongoose');

var mongoDBURL = process.env.MONGODB_URL

if(process.env.ENV === 'Test'){
   mongoDBURL = process.env.MONGOTESTDB_URL
}
mongoose.connect(mongoDBURL, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex:true });

app.use(cors());

const router = require('./routes/index.js');
const rocketrepository = require('./services/rocketrepository.js');
app.use('/',router);

app.listen(process.env.PORT, async ()=>{
    console.log(`Listening on port ${process.env.PORT}!`);
    let allRockets = await rocketrepository.get({});
    if(allRockets.length == 0){
        console.log('We should be seeding the db');
        await seedData.seedDbFull();
    }else{
        console.log('DB already seeded.No need to seed')
    }
}); 

module.exports = app;