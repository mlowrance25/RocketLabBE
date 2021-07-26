const EngineReading =  require('../services/enginereadingrepository');
const { body } = require('express-validator')



function engineReadingController() {
    async function get(req,engineReadingDetails){
        try{
            recipientUsers =  await UserRepository.getUsersByUserName(fundingAgreementDetails.Users);
        }catch (e){
            console.log(e);
        }
        fundingAgreementDetails.Users = [req.user.UserId].concat(recipientUsers.map(x => x._id));
    
        return recipientUsers;
    }

    async function post(req,res){
        let transactionDetails = req.body;
        let user = await UserRepository.getById(req.user.UserId);
        await EventLogRepository.logEvent(user,transactionDetails.EventType,'Initiation creation of funding agreement','Info');
        let recipientUsers = await UserRepository.getUsersByUserName(transactionDetails.AgreementDetails.Users);
        transactionDetails.AgreementDetails.Users = [req.user.UserId].concat(recipientUsers.map(x => x._id));
        let paymentRecord = await PaymentRecordRepository.createFundedPaymentRecord(transactionDetails,user);
        let paymentDetailsValid = paymentRecord.Status == StatusTypeString.Paid;
        if(paymentDetailsValid){
            let fundingAgreement = await FundingAgreementRepository.createFundingAgreement(req.user.UserId,transactionDetails.AgreementDetails);
            let createdTransaction = await TransactionRepository.createFundingAgreementTransaction(fundingAgreement,paymentRecord);
            await PaymentRecordRepository.addTransactionsToPaymentRecord(paymentRecord,[createdTransaction._id]);
            createPaymentRequestsForUsers(fundingAgreement,req.user.UserId);
            return res.status(201).send(fundingAgreement);
        }else{
            return res.status(400).send('Payment Details are not valid');
        }

        // Update users balance if a Pitchinpay payment method
        // Create FundingAgreement
        //Send payment request to other users for FundingAgreement
    }

    async function createPaymentRequestsForUsers(fundingAgreement,userId){
        let listOfUsers = fundingAgreement.Users;
        for(let index = 0;index < listOfUsers.length;index++){
            let targetUserId = listOfUsers[index];
            if(targetUserId != userId){
                await PaymentRequestRepository.createFundingAgreementPaymentRequest(fundingAgreement,userId,targetUserId);
            }
        }
    }

    return{
        post,
        get
    }
}

module.exports = engineReadingController;