const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const wait = require('util').promisify(setTimeout);

module.exports={
    name:'seer_turn',
    execute: async function(client, msg){
        const playersID = await DB.get('playersID');
        const roleGame = await DB.get('prRole');
        const fields = await DB.getObjectData('fields');
        const indexOut = roleGame.indexOf('👀');

        
        const callBack =  async (i)=>{
            let username = await DB.get('playersID');
            let index = username.indexOf(i.values[0]);
            let mess = await i.channel.send(`next_turn ${roles['👀'].toLowerCase()}`);
           
            i.channel.send(roleGame[index]);
            return mess.delete();
        };

        sendReactCollector(client, msg.channel, `${roles['👀']} turn`);

        if(indexOut===-1){
            await wait(5000);
            let mess = await msg.channel.send(`next_turn ${roles['👀'].toLowerCase()}`);
            return mess.delete();
        }else{
            let member = client.users.cache.get(playersID[indexOut]);

            sendSelectMenu(client, member, `Who does ${roles['👀']} want to reveal tonight?`, fields, playersID[indexOut], callBack, false);
        }
    }
}