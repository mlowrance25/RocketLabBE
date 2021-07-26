var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RocketModelSchema = Schema({
    Name : String,
    Height : String,
    Mass : String,
});

module.exports = mongoose.model('RocketModel', RocketModelSchema );
