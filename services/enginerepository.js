const EngineModel = require('../models/enginemodel');
const RocketModel= require('../models/rocketmodel');

function engineRepository(){

    async function create(rocketDetails){
        let rocket =  await RocketModel.findById(rocketDetails.RocketId);
        if(rocket.length == 0){
            return {'Error': 'Attempting to add engine for rocket that doesnt exist'};
        }
        let existingEngines =  await EngineModel.find({'Rocket._id':rocket});
        let engine = new EngineModel({
            Rocket : rocket,
            Name : `engine${existingEngines.length + 1}`
        });
        return await engine.save();
    }

    async function get(rocket,engineName){
        if(engineName){
            return await Engine.find({'Rocket':rocket,'Name':engineName});
        }
        return await Engine.find({'Rocket':rocket});
        
    }
    
    return{
        get : get,
        create : create
    }

}

module.exports = engineRepository();