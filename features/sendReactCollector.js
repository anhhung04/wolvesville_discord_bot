const console = require('console');
const {MessageEmbed} = require('discord.js');

module.exports = async function (client, channel, title, fields, reactContent, userId, callBack,deleteMessage = true){
    const embed = new MessageEmbed();
        embed.setTitle(title);
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp();    
        
        if(fields){
            embed.addFields(fields);
        }
    let message = await channel.send({ embeds: [embed]});
    
    if(!reactContent) return;

    reactContent.forEach(async (react) => {
        await message.react(react);
    });

    const filter = (reaction, user) => {
        return user.id === userId && !user.bot;
    };
    
    const collector = message.createReactionCollector({filter, time: 99999});
    
    collector.on('collect',async (react, user) => {
        if(callBack&&callBack[react._emoji.name]){
            callBack[react._emoji.name](message, react, user);
        }
        if(deleteMessage){
            react.message.delete();
        }
    });
};