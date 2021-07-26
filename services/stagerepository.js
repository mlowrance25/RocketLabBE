const StageModel= require('../models/stagemodel');
const RocketModel= require('../models/rocketmodel');
const enginerepository = require('./enginerepository');

function stageRepository(){

    async function create(rocketDetails){
        let rocket =  await RocketModel.findById(rocketDetails.RocketId);
        if(rocket.length == 0){
            return {'Error': 'Attempting to add stage for rocket that doesnt exist'};
        }
        let existingStages =  await StageModel.find({'Rocket._id':rocketDetails.RocketId});
        let stageToAdd = 1;
       
        let stage = new StageModel({
            Rocket : rocket,
            Name : `stage${existingStages.length +1}`,
            Number : stageToAdd
        });
        return await stage.save();
    }

    async function getByRocket(rocketId,stageName){
        if(stageName){
            return await StageModel.find({'Rocket':rocketId,'Name':stageName}).populate({path:'EngineReadings'}).populate({path:'Engine'});
        }
        return await StageModel.find({'Rocket._id':rocketId}).populate({path:'EngineReadings'}).populate({path:'Engine'});
    }

    async function get(stageDetails){
        return await StageModel.find(stageDetails).populate({path:'EngineReadings'}).populate({path:'Engine'});
    }

    async function addEngineReading(engineReading){
        let stage = await StageModel.findById(engineReading.Stage._id);
        stage.EngineReadings.push(engineReading._id);
        await stage.save();
    }
    
    return{
        get : get,
        create : create,
        addEngineReading : addEngineReading,
        getByRocket : getByRocket
    }

}

module.exports = stageRepository();