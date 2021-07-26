const RocketModel= require('../models/rocketmodel');
const EngineReadingModel= require('../models/enginereadingmodel');

function rocketRepository(){

    async function create(rocketDetails){
        if(!rocketDetails.Name){
            return {Error : 'Name must be provided to create rocket'} 
        }
        let rocketExists = await get({Name : rocketDetails.Name});
        if(rocketExists.length > 0){
            return {Error : 'Rocket with name already exists'} 
        }
        let rocket = new RocketModel({ 
            Name : rocketDetails.Name
        });

        if(rocketDetails.Height){
            rocket.Height = rocketDetails.Height;
        }
        if(rocketDetails.Mass){
            rocket.Mass = rocketDetails.Mass;
        }
        return await rocket.save();
    }

    async function get(rocketDetails,propertyDetails){
        return await RocketModel.find(rocketDetails,propertyDetails)
    }

    async function getByName(rocketDetails){
        return await RocketModel.find({'Name':rocketDetails.Name});
    }

    async function patch(rocketName,rocketDetails){
        let rocket = await get({Name : rocketName});
        let createdRocket;
        let {parent,value} = rocketDetails;
        if(rocket.length == 0){
            return {Error : 'Rocket with name does not exist'} 
        }
        if(parent == 'rocket'){
            createdRocket = await RocketModel.findOneAndUpdate({"_id":rocket[0]._id},{"$set": value},{new: true, useFindAndModify: false});
        }
        return createdRocket;
    }
    return{
        patch : patch,
        get : get,
        getByName: getByName,
        create : create
    }
}

module.exports = rocketRepository();