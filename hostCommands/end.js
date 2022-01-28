const DB = require('../features/interactWithDB.js');
const {MessageEmbed} = require('discord.js');

module.exports={
    name: 'end',
    execute: async function(client, msg){
        await DB.updateObjectData('isGameStarted',[{isGameStarted:false}]);
        await DB.updateObjectData('day',[{index:1, dayNight:0}]);
        await DB.update('die', []);
        await DB.update('vote',[]);
        await DB.update('shield',[]);
        const embed = new MessageEmbed();
        embed.setTitle("-------------------------------End------------------------------- ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
   
        return msg.channel.send({embeds:[embed]});
    }
}