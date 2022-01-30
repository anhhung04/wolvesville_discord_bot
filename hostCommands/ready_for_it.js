const {MessageEmbed} = require('discord.js');
const DB = require('../features/interactWithDB.js');
require('dotenv').config();

module.exports={
    name: 'ready_for_it',
    execute: async function(client, msg){
        var numReady = 0;
        const playersID = await DB.get('playersID');
        const embed = new MessageEmbed();
        embed.setTitle('Everyone react 👍 to ready');
        embed.setImage('attachment://Its_getting_darker.png');
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp();    
        
        let message = await msg.channel.send({ embeds: [embed], files: ['./data/Its_getting_darker.png'] });

        await message.react('👍');

        const filter = (reaction, user) => {
            return playersID.includes(user.id) && !user.bot;
        };
        
        const collector = message.createReactionCollector({filter, time: 99999});
        
        collector.on('collect',async (react, user) => {
            numReady++;
            if (react.count > playersID.length) { 
                let mess = await msg.channel.send('next');
                collector.stop();
                message.delete();
                return mess.delete();
            }
        });
        
    }
};