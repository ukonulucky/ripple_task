const yup = require('yup');
const emailSchema = yup.string().email('Invalid email format').required('Email is required');



const emailValidation =  async(email) => {
    try{
    const res =    await emailSchema.validate(email)
    if(res){
        return true
    }
    
}catch(err){
 return false
    }
}



  module.exports = emailValidation