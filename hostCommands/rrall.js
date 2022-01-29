const DB = require('../features/interactWithDB.js');

module.exports={
    name:'rrall',
    execute: async function(client, msg){
        var isGameStartedO = await DB.getObjectData('isGameStarted');

        if(isGameStartedO[0].isGameStarted) return sendReactCollector(client, msg.channel, `Please finish the game!`);
        
        await DB.update('role', []);
        return msg.channel.send('Roles have been reset!');
    }
}