const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const sendSelectMenu = require('../features/sendSelectMenu.js');
const wait = require('util').promisify(setTimeout);

module.exports={
    name:'seer_turn',
    execute: async function(client, msg){
        const playersID = await DB.get('playersID');
        const roleGame = await DB.get('prRole');
        const fields = await DB.getObjectData('fields');
        const indexOut = roleGame.indexOf('👀');

        
        const callBack =  async (i, collector, mess)=>{
            let username = await DB.get('players');
            let index = username.indexOf(i.values[0]);
            let roleGameIn = await DB.get('prRole');
            const hostChannel = await client.channels.cache.get(process.env.HOST_ID);
            let messHost = await hostChannel.send(`next_turn ${roles['👀'].toLowerCase()}`);
            
            mess.channel.send(roleGameIn[index]);
            return messHost.delete();
        };

        await sendReactCollector(client, msg.channel, `${roles['👀']} turn`);

        if(indexOut===-1){
            await wait(5000);
            let mess2 = await msg.channel.send(`next_turn ${roles['👀'].toLowerCase()}`);
            return mess2.delete();
        }else{
            let guild = await client.guilds.cache.get(process.env.GUILD_ID);
            let member = await guild.members.cache.get(playersID[indexOut]);
            if(!member) return;
            sendSelectMenu(client, member, `Who does ${roles['👀']} want to reveal tonight?`, fields, playersID[indexOut], callBack, false);
        }
    }
}