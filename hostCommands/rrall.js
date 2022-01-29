const DB = require('../features/interactWithDB.js');
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name:'rrall',
    execute: async function(client, msg){
        var isGameStartedO = await DB.getObjectData('isGameStarted');

        if(isGameStartedO[0].isGameStarted) return sendReactCollector(client, msg.channel, `Please finish the game!`);
        
        await DB.update('role', []);
        return sendReactCollector(client, msg.channel, 'Roles have been reset!');
        
    }
}