const DB = require('../features/interactWithDB.js');
const {MessageEmbed, MessageActionRow, MessageSelectMenu} = require('discord.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name: 'ar',
    execute: async function(client, msg){
        var rolesIns = await DB.get('role');
        var fields = [];
        var isGameStartedO = await DB.getObjectData('isGameStarted');

        if(isGameStartedO[0].isGameStarted) return sendReactCollector(client, msg.channel, `Please finish the game!`);
        
        Object.keys(roles).forEach( (key) => {
            fields.push({
                label:`${roles[key]} ${key}`,
                name: roles[key], 
                value: key,
                inline:true
            });
        });

        const embed = new MessageEmbed();

        embed.setTitle("Pick roles: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        embed.addFields(fields);

        const row = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId('select')
                    .setMinValues(2)
					.setPlaceholder('Nothing selected')
					.addOptions(fields)
			);
        let message = await msg.channel.send({embeds: [embed], components: [row]});
        
        const filter = (i) => {
            return !i.user.bot;
        };
        
        const collector = message.createMessageComponentCollector({filter, componentType: 'SELECT_MENU', time: 99999 });
        
        collector.on('collect',async (i) => {
            await DB.update('role', i.values);
            
            collector.stop();
            
            message.channel.send(`Added ${i.values}`);
        });
       
    }
}