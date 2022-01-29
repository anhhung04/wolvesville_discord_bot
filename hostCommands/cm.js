const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const DB = require('../features/interactWithDB.js');

module.exports ={
    name:'cm',
    execute: async function(client, msg){
        const fields = await DB.getObjectData('fields');
        const isGameStarted = await DB.getObjectData('isGameStarted');

        if(!isGameStarted[0].isGameStarted) return msg.channel.send('Please start game!');

        sendReactCollector(client, msg.channel, 'Villagers: ', fields);
    }
};