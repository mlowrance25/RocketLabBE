var mongoose = require('mongoose');

var EngineReadingModel = require('./enginereadingmodel');
var RocketModel = require('./rocketmodel');

var Schema = mongoose.Schema;

var StageModelSchema = Schema({
    Rocket : RocketModel.schema,
    Name : String,
    Number : Number,
    EngineReadings : [{type: mongoose.Schema.Types.ObjectId, ref: 'EngineReadingModel'}]
});

module.exports = mongoose.model('StageModel', StageModelSchema );
