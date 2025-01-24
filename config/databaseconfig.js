const __mongoose = require("mongoose");

console.log(`${process.env.SERVER} SERVER`);


const _DB =
  process.env.SERVER === "prod"
    ? process.env.PROD_DATABASE.replace("<PASSWORD>",process.env.PROD_DATABASE_PASSWORD)
        .replace("<USERNAME>",process.env.PROD_DATABASE_USERNAME)
    : process.env.SERVER === "test"
    ? process.env.TEST_DATABASE.replace("<PASSWORD>", process.env.TEST_DATABASE_PASSWORD)
    .replace("<USERNAME>", process.env.TEST_DATABASE_USERNAME)
    : process.env.DEV_DATABASE.replace("<PASSWORD>",process.env.DEV_DATABASE_PASSWORD)
        .replace("<USERNAME>",process.env.DEV_DATABASE_USERNAME);


console.log(_DB);        
const __connectToDB = async () => {
    try{

        const _databaseConnect = await __mongoose.connect(_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        return _databaseConnect;
          
    }catch(error){
        console.error('Error connecting to the Tara Tutor V3 Usage Report MongoDB:', error.message);

    }
};

module.exports = __connectToDB;
