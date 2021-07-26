const EngineReadingModel= require('../models/enginereadingmodel');

function engineReadingRepository(){

    async function create(readingData){
        let engineReading = new EngineReadingModel({
            Engine : readingData.Engine,
            Stage : readingData.Stage,
            Thrust :readingData.Thrust,
            ISP : readingData.ISP
        });
        return await engineReading.save();
    }

    async function patch(readingData){
        if(readingData.Thrust){
            engineReading.Thrust = readingData.Thrust;
        }
        if(readingData.ISP){
            engineReading.ISP = readingData.ISP;
        }
        return await engineReading.save();
    }

    async function get(engineReadingDetails,propertyDetails){
        return await EngineReadingModel.find(engineReadingDetails,propertyDetails);
    }
    
    return{
        get : get,
        create : create,
        patch : patch
    }

}

module.exports = engineReadingRepository();