const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const {MessageEmbed} = require('discord.js');
const sendReactCollector = require('../features/sendReactCollector.js');
require('dotenv').config();

module.exports={
    name: 'cr',
    execute: async function(client, msg){
        const roleGame = await DB.get('role');
        var isGameStartedO = await DB.getObjectData('isGameStarted');

        if(roleGame.length===0) return sendReactCollector(client, msg.channel, 'Roles haven\'t been set!');
        
        const embed = new MessageEmbed();
        embed.setTitle("Roles: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        roleGame.forEach((key) => {
            embed.addField(roles[key], key, inline = true);
        });
        msg.channel.send({ embeds: [embed]});
    }
}