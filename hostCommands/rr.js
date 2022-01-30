const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const {MessageEmbed} = require('discord.js');
const sendReactCollector = require('../features/sendReactCollector.js');
require('dotenv').config();

module.exports={
    name: 'rr',
    execute: async function(client, msg){
        var roleGame = await DB.get('role');
        var isGameStartedO = await DB.getObjectData('isGameStarted');

        if(isGameStartedO[0].isGameStarted) return sendReactCollector(client, msg.channel, `Please finish the game!`);
        else if(roleGame.length===0) return msg.channel.send('Roles haven\'t been set!');

        const embed = new MessageEmbed();
        embed.setTitle("Roles: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        roleGame.forEach((key) => {
            embed.addField(roles[key], key, inline = true);
        });
        
        let message = await msg.channel.send({ embeds: [embed]});
        
        Object.keys(roles).forEach( (key) => {
             message.react(key);
        });

        const filter = (reaction, user) => {
            return !user.bot;
        };
        
        const collector = message.createReactionCollector({filter, time: 99999});
        
        collector.on('collect',async (react, user) => {
            for(let i=0; i< roleGame.length;i++){
                if(react._emoji.name===roleGame[i]) roleGame.splice(i,1);
                continue;
            }
            await DB.update('role',roleGame);
            await react.users.remove(user.id)
	            .catch(error => console.error('Failed to clear reactions:', error));
            msg.channel.send(`Removed ${roles[react._emoji.name]} ${react._emoji.name}`);    
        });
    }
}