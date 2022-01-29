const DB = require('../features/interactWithDB.js');
const {MessageEmbed} = require('discord.js');

module.exports={
    name: 'end',
    execute: async function(client, msg){
        const playersID = await DB.get('playersID');
        const wolfChannel = await client.channels.cache.get(process.env.Wolves_ID);
        
        for(let i=0; i< playersID.length; i++){
            let member = await client.users.cache.get(playersID[i]);
            if(!member){
                continue;
            }
            wolfChannel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false, SEND_MESSAGES:false});
        }
        
        
        await DB.updateObjectData('isGameStarted',[{isGameStarted:false}]);
        await DB.updateObjectData('day',[{index:1, dayNight:0}]);
        await DB.update('players',[]);
        await DB.update('playersID',[]);
        await DB.update('prRole',[]);
        await DB.update('die', []);
        await DB.update('mustDie', []);
        await DB.update('vote',[]);
        await DB.update('shield',[]);
        await DB.updateObjectData('witchHealPotions', true);
        await DB.updateObjectData('witchKillPotions', true);

        const embed = new MessageEmbed();
        embed.setTitle("-------------------------------End------------------------------- ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
   
        return msg.channel.send({embeds:[embed]});
    }
}