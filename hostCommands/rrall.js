const DB = require('../features/interactWithDB.js');

module.exports={
    name:'rrall',
    execute: async function(client, msg){
        await DB.update('role', []);
        return msg.channel.send('Roles have been reset!');
    }
}