const DB = require('../features/interactWithDB.js');
const {MessageEmbed} = require('discord.js');
const roles = require('../config.js').roles;
require('dotenv').config();

module.exports={
    name: 'ars',
    execute: async function(client, msg){
        var rolesIns = await DB.get('role');
        const embed = new MessageEmbed();

        embed.setTitle("Pick roles: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        Object.keys(roles).forEach( (key) => {
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
            rolesIns.push(react._emoji.name);
            await DB.update('role',rolesIns);
            await react.users.remove(user.id)
	            .catch(error => console.error('Failed to clear reactions:', error));
            msg.channel.send(`Added ${roles[react._emoji.name]} ${react._emoji.name}`);    
        });
    }
} 