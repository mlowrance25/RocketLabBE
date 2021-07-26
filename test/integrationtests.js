require('should');

const request = require('supertest');

process.env.ENV = 'Test';

const app = require('../app.js');


const agent = request.agent(app);

const seedData = require('./seeddata.js')
const RocketModel = require('../models/rocketmodel');
const StageModel = require('../models/stagemodel');

const rocketRepository = require('../services/rocketrepository');
const engineRepository = require('../services/enginerepository');
const stageRepository = require('../services/stagerepository');

const engineReadingRepository = require('../services/enginereadingrepository');

const EngineReadingModel = require('../models/enginereadingmodel');
const enginereadingrepository = require('../services/enginereadingrepository');
const { query } = require('express-validator');

const querystring = require('querystring');
const debug = require('debug')('integrationtests');

describe('API Tests Pt0',  function(){
    describe('#Test Create Rocket',  async ()=>{
        it('should return the created rocket successfully' ,(done)=>{
            let testRocket = seedData.getRocketInput(1);
            agent.post('/rocket')
            .send(testRocket[0])
            .expect(201)
            .end((err,results) =>{
                if (err){
                    console.log('There was an error creating a rocket');
                    console.log(err);
                    done(err);
                }else{
                    console.log('Sucessful rocket creation');
                    done();
                }
            });
        });
    });
    describe('#Test Update Rocket',  async ()=>{
        it('should add height property to rocket successfully' ,(done)=>{
            let testRocket = new RocketModel({Name : 'TestRocket'});
            testRocket.save(()=>{
            agent.patch(`/rocket/${'TestRocket'}`)
            .send({'parent':'rocket','value': {"Height": 18.0005}})
            .expect(200)
            .end((err,results) =>{
                if (err){
                    console.log('There was an error creating a rocket');
                    console.log(err);
                    done(err);
                }else{
                    console.log('Sucessful rocket update');
                    done();
                }
            });
           });    
        });
    });

    describe('#Test Update Rocket',  async ()=>{
        it('should add height property to rocket successfully' ,(done)=>{
            let testRocket = new RocketModel({Name : 'TestMassRocket'});
            testRocket.save(()=>{
            agent.patch(`/rocket/${'TestMassRocket'}`)
            .send({'parent':'rocket','value': {"Mass": 28.0005}})
            .expect(200)
            .end((err,results) =>{
                if (err){
                    console.log('There was an error creating a rocket');
                    console.log(err);
                    done(err);
                }else{
                    console.log('Sucessful rocket update');
                    done();
                }
            });
           });    
        });
    });

    describe('#Test Engine Creation', ()=>{
        it('should create rocket engine successfully' , (done)=>{
            let testRocket = new RocketModel({Name : 'TestMassRocket25',"Mass": 28.0005,"Height":12.23});
            testRocket.save(()=>{
                agent.post('/engine')
                .send({"RocketId": testRocket._id})
                .expect(201)
                .end((err,results) =>{
                    if (err){
                        console.log('There was an error creating a rocket engine');
                        console.log(err);
                        done(err);
                    }else{
                        console.log('Sucessful rocket engine creation');
                        done();
                    }
                });
            });
        });
    });

    describe('#Test Stage Creation', ()=>{
        it('should create rocket stage successfully' , (done)=>{
            rocketRepository.create({Name : 'TestMassRocket2',"Mass": 21.0005,"Height":11.23}).then((testRocket)=>{
                agent.post('/stage')
                .send({"RocketId": testRocket._id})
                .expect(201)
                .end((err,results) =>{
                    if (err){
                        console.log('There was an error creating a rocket stage');
                        console.log(err);
                        done(err);
                    }else{
                        console.log('Sucessful rocket stage creation');
                        done();
                    }
                });
            });
           
        });
    });

    describe('#Test Engine reading Creation', ()=>{
        it('should create rocket stage successfully',async ()=>{
            let testRocket = await rocketRepository.create({Name : 'TestMassRocket3',"Mass": 21.0005,"Height":11.23});
            let testEngine = await engineRepository.create({"RocketId": testRocket._id});
            let testStage = await stageRepository.create({"RocketId": testRocket._id});
            
            let engineReadingData =  {
                "EngineId" : testEngine._id,
                "StageId": testStage._id,
                "Thrust" :1.622,
                "ISP" : 15.110
            }
            agent.post('/enginereading')
            .send(engineReadingData)
            .expect(201)
            .end(async (err,results) =>{
                if (err){
                    console.log('There was an error creating a engine reading');
                    console.log(err);
                }else{
                    console.log('Sucessful engine reading creation');
                    let engineReading = results.body;
                    let firstReading = await StageModel.findById(engineReading.Stage);
                    let newReading = await StageModel.findById(engineReading.Stage).populate({path:'EngineReadings',populate:{path:'Engine'}});
                }
            });
        });
    });

    describe('#Test Engine reading Get', ()=>{
        it('should get rocket stage successfully' ,async ()=>{
            let testRocket = await  rocketRepository.create({Name : 'TestMassRocket4',"Mass": 21.0005,"Height":11.23});
            let engineOne = await  engineRepository.create({"RocketId": testRocket._id});
            let stageOne = await  stageRepository.create({"RocketId": testRocket._id});
            let stageTwo = await stageRepository.create({"RocketId": testRocket._id});
            let engineTwo = await  engineRepository.create({"RocketId": testRocket._id});
            
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
            await stageRepository.addEngineReading(engineReadingOne);
            
            let engineReadingTwo = await enginereadingrepository.create(engineTwoData);
            await stageRepository.addEngineReading(engineReadingTwo);
            let queryString = `/rocket/${testRocket.Name}/stage/stage1`;
            agent.get(queryString)
            .send()
            .expect(200)
            .end(async (err,results) =>{
                if (err){
                    console.log('There was an error getting a engine reading');
                    console.log(err);
                }else{
                    console.log('Sucessful stage reading');
                    let stageDetails = results.body;
                }
            });
        });
    });

    describe('#Test Engine reading Get', ()=>{
        it('should get engine reading from specified rocket stage successfully' ,async ()=>{
            let testRocket = await  rocketRepository.create({Name : 'TestMassRocket5',"Mass": 21.0005,"Height":11.23});
            let engineOne = await  engineRepository.create({"RocketId": testRocket._id});
            let stageOne = await  stageRepository.create({"RocketId": testRocket._id});
            let stageTwo = await stageRepository.create({"RocketId": testRocket._id});
            let engineTwo = await  engineRepository.create({"RocketId": testRocket._id});

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
            await stageRepository.addEngineReading(engineReadingOne);
            let engineReadingTwo = await enginereadingrepository.create(engineTwoData);
            await stageRepository.addEngineReading(engineReadingTwo);
            let queryString = `/rocket/${testRocket.Name}/stage/stage1/engine/engine1`;
            agent.get(queryString)
            .send()
            .expect(200)
            .end(async (err,results) =>{
                if (err){
                    console.log('There was an error getting a engine reading');
                    console.log(err);
                }else{
                    console.log('Sucessful stage reading');
                    let stageDetails = results.body;
                }
            });
        });
    });

    describe('#Test Engine reading Get', ()=>{
        it('should get full rocket with stages successfully' ,async ()=>{
            let testRocket = await rocketRepository.create({Name : 'TestMassRocket6',"Mass": 21.0005,"Height":11.23});
            let engineOne = await engineRepository.create({"RocketId": testRocket._id});
            let stageOne = await stageRepository.create({"RocketId": testRocket._id});
            let stageTwo = await stageRepository.create({"RocketId": testRocket._id});
            let engineTwo = await engineRepository.create({"RocketId": testRocket._id});

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
            await stageRepository.addEngineReading(engineReadingOne);
            let engineReadingTwo = await enginereadingrepository.create(engineTwoData);
            await stageRepository.addEngineReading(engineReadingTwo);
            let queryString = `/rocket/${testRocket.Name}?view=summary`;
            agent.get(queryString)
            .send()
            .expect(200)
            .end(async (err,results) =>{
                if (err){
                    console.log('There was an error getting a rocket');
                    console.log(err);
                }else{
                    console.log('Sucessful rocket full reading');
                    let rocketDetails = results.body;
                }
            });
        });
    });
    after((done) =>{
        RocketModel.deleteMany({}).exec();
        done();
    });
});