var mongoose = require('mongoose');
var RocketModel = require('./rocketmodel');

var Schema = mongoose.Schema;

var EngineModelSchema = Schema({
    Rocket : RocketModel.schema,
    Name : String,
});

module.exports = mongoose.model('EngineModel', EngineModelSchema );