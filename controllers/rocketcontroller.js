const RocketRepository =  require('../services/rocketrepository');
const { body } = require('express-validator')



function rocketController() {
    async function get(req){
        try{
            rocket =  await UserRepository.getUsersByUserName(fundingAgreementDetails.Users);
        }catch (e){
            console.log(e);
        }    
        return rocket;
    }

    async function post(req,res){
        let rocketDetails = req.body;
        let rocket = await RocketRepository.getByName(rocketDetails.name);
        let rocketDetailsValid = rocket == [];
        if(rocketDetailsValid){
            let newRocket = await RocketRepository.create(rocketDetails);
            return res.status(201).send(newRocket);
        }else{
            return res.status(400).send('Rocket details are not valid');
        }
    }

    return{
        post,
        get
    }
}

module.exports = rocketController;