require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://pratikpatil1311:g0nJjf1LgJSmyS7v@amsinstance.1lmc8.mongodb.net/?retryWrites=true&w=majority&appName=AMSInstance',
    JWT_SECRET: process.env.JWT_SECRET || 'hdkfjdfboidnfsjhfihdf758483457^$#$^&*%$er09hjggfgrfgs45645fdfs56?"{}f,dfhrfyhsd45645345$^@#@!%^*&*^%',
};
