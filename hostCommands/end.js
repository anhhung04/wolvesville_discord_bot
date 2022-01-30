const DB = require('../features/interactWithDB.js');
const {MessageEmbed} = require('discord.js');

module.exports={
    name: 'end',
    execute: async function(client, msg){
        const playersID = await DB.get('playersID');
        const wolfChannel = await client.channels.cache.get(process.env.Wolves_ID);
        
        for(let i=0; i< playersID.length; i++){
            let guild = await client.guilds.cache.get(process.env.GUILD_ID);
            let member = await guild.members.cache.get(playersID[i]);
            if(!member){
                continue;
            }
            if(member.voice.channel){
                member.voice.setDeaf(false);
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