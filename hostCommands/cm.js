const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const DB = require('../features/interactWithDB.js');

module.exports ={
    name:'cm',
    execute: async function(client, msg){
        const fields = await DB.getObjectData('fields');

        sendReactCollector(client, msg.channel, 'Villagers: ', fields);
    }
};