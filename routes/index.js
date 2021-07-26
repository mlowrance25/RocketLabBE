/* eslint-disable no-param-reassign */
const express = require('express');
const rocketrepository = require('../services/rocketrepository');
const stagerepository = require('../services/stagerepository');
const enginereadingrepository = require('../services/enginereadingrepository');
const enginerepository = require('../services/enginerepository');


const router = express.Router();
const url = require('url');

router.get('/rocket', async function (req, res) {
    let allRocketDetails = await rocketrepository.get({});
    return res.status(200).send(allRocketDetails);
    

});

router.get('/rocket/:name', async function (req, res) {
    let rocketName = req.params.name;
    let property = req.query.property;
    let propertyDetails = {};
    if(property != undefined){
        let lowerCasePropery = property.toLowerCase();
        propertyDetails = {[lowerCasePropery]:1,[lowerCasePropery.charAt(0).toUpperCase() +lowerCasePropery.slice(1)]:1}
    }
    let rocket = await rocketrepository.get({'Name': rocketName},propertyDetails);
    if(property == undefined){
        if(rocket.length > 0){
            rocket = rocket[0].toObject(); 
            let rocketStages = await stagerepository.getByRocket(rocket._id);
            rocket['Stages'] = rocketStages;
            return res.status(200).send(rocket);
        }
        return res.status(400).send('Rocket not found');
    }else{
        rocket = rocket[0].toObject(); 
        if(Object.keys(rocket).length > 1){
            return res.status(200).send(rocket);
        }
        return res.status(400).send({ErrorMessage :'Property not existent on rocket'});
    }
});

router.post('/rocket', async function (req, res) {
    let rocket = await rocketrepository.create(req.body);
    if(rocket.Error){
        return res.status(400).send(rocket.Error);
    }
    return res.status(201).send(rocket);
});

router.patch('/rocket/:name', async function (req, res) {
    let name = req.params.name;
    let rocket = await rocketrepository.patch(name,req.body);
    return res.status(200).send(rocket);
});

router.post('/stage', async function (req, res) {
    let stage = await stagerepository.create(req.body);
    if(stage.Error){
        return res.status(400).send(stage.Error);
    }
    return res.status(201).send(stage);
});

router.post('/engine', async function (req, res) {
    let engine = await enginerepository.create(req.body);
    if(engine.Error){
        return res.status(400).send(engine.Error);
    }
    return res.status(201).send(engine);
});

router.post('/enginereading', async function (req, res) {
    let enginereading = await enginereadingrepository.create(req.body);
    if(enginereading.Error){
        return res.status(400).send(enginereading.Error);
    }
    await stagerepository.addEngineReading(enginereading);
    return res.status(201).send(enginereading);
});

router.get('/rocket/:rocketName/stage/:stageName?',async function (req, res) {
    let rocketName = req.params.rocketName;
    let stageName = req.params.stageName ? req.params.stageName : undefined;
    let queryDict = {"Rocket.Name" : rocketName}
    if(stageName){
        queryDict['Name'] = stageName;
    }
    let stages = await stagerepository.get(queryDict);  
    return res.status(200).send({Stages: stages});
});

router.get('/rocket/:rocketName/stage/:stageName/engine/:engineName?',async function (req, res) {
    let rocketName = req.params.rocketName;
    let stageName = req.params.stageName;
    let engineName = req.params.engineName ? req.params.engineName : 'all';
    
    let property = req.query.property;
    let propertyDetails = {};
    if(property != undefined){
        let lowerCasePropery = property.toLowerCase();
        propertyDetails = {[lowerCasePropery]:1,[lowerCasePropery.charAt(0).toUpperCase() +lowerCasePropery.slice(1)]:1}
    }
    let rocketDetails = {'Engine.Rocket.Name': rocketName,"Stage.Name":stageName, "Engine.Name":engineName};
    let engineReadings = await enginereadingrepository.get(rocketDetails,propertyDetails);

    if(engineReadings.length > 0){
        engineReadings = engineReadings[0];
    }
    return res.status(200).send({Stages: [{EngineReadings :[engineReadings]}]});
});
module.exports = router;