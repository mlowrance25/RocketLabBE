var mongoose = require('mongoose');
var EngineModel = require('./enginemodel');
var StageModel = require('./stagemodel');

var Schema = mongoose.Schema;

var EngineReadingModelSchema = Schema({
    Engine : EngineModel.schema,
    Stage : StageModel.schema,
    Thrust : Number,
    ISP : Number,
});

module.exports = mongoose.model('EngineReadingModel', EngineReadingModelSchema );
