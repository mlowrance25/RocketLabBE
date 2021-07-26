const rocketrepository = require('../services/rocketrepository');
const stagerepository = require('../services/stagerepository');
const enginereadingrepository = require('../services/enginereadingrepository');
const enginerepository = require('../services/enginerepository');


exports.getRocketInput = function(numRockets){
    let listOfRockets = [];
    for(let index=1;index<=numRockets;index++){
        listOfRockets.push({
        Name: `testRocket${index}`,
      });
    }
    return listOfRockets;
}

exports.seedDbFull = async function(){
  let testRocket = await rocketrepository.create({Name : 'TestRocket',"Mass": 21.0005,"Height":11.23});
  let engineOne = await enginerepository.create({"RocketId": testRocket._id});
  let stageOne = await stagerepository.create({"RocketId": testRocket._id});
  let stageTwo = await stagerepository.create({"RocketId": testRocket._id});
  let engineTwo = await enginerepository.create({"RocketId": testRocket._id});

  let engineOneData =  {
      "Engine" : engineOne,
      "Stage": stageOne,
      "Thrust" :1.622,
      "ISP" : 15.110
  } 
  let engineTwoData =  {
      "Engine" : engineTwo,
      "Stage": stageTwo,
      "Thrust" :4.622,
      "ISP" : 9.110
  } 
  let engineReadingOne = await enginereadingrepository.create(engineOneData);
  await stagerepository.addEngineReading(engineReadingOne);
  let engineReadingTwo = await enginereadingrepository.create(engineTwoData);
  await stagerepository.addEngineReading(engineReadingTwo);
}