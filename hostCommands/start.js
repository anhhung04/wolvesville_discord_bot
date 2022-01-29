const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const {MessageEmbed} = require('discord.js');
const sendReactCollector = require('../features/sendReactCollector.js');

function shuffledCards(array) {
    let [...result] = array;

    for (let i = result.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
  
    return result;
}

module.exports={
    name: 'start',
    execute: async function(client, msg){
        var oldRoleGame = await DB.get('role');
        var players = [];
        var Fields =[];
        var isGameStartedO = await DB.getObjectData('isGameStarted');
        let wolfFields = [];
        const roleGame = shuffledCards(oldRoleGame);
        const [...playersID] = shuffledCards(msg.mentions.users.keys());
        
        if(oldRoleGame.length===0) return msg.channel.send('Roles haven\'t been set!');
        
        if(msg.mentions.users.size < oldRoleGame.length){
            return msg.channel.send('Not enough players!');
        }else if(msg.mentions.users.size > oldRoleGame.length){
            return msg.channel.send('Too much player!');
        }else if(isGameStartedO[0].isGameStarted){
            return msg.channel.send('Please finish the previous game!');
        }

        await DB.updateObjectData('isGameStarted',{isGameStarted: true});

        await DB.update('prRole', roleGame);

        await DB.update('playersID', playersID);

        for(let i =0; i< playersID.length;i++){
            let member = await msg.mentions.members.get(playersID[i]);
            players.push(member.user.username);
            Fields.push({
                name: `\[.${i+1}.\]`,
                value: member.user.username,
                inline: true,
                label: member.user.username
            });
            if(roleGame[i]==='🐺'){
                wolfFields.push({
                    name: `\[.${i+1}.\]`,
                    value: players[i],
                    inline: true,
                    label: member.user.username
                });
            }
            sendReactCollector(client, member, 'Your role (React 👌 to delete): ', {name: roles[roleGame[i]], value: roleGame[i], inline: true}, ['👌'], playersID[i]);
        }

        await DB.update('players', players);
        
        await DB.updateObjectData('fields', Fields);
        
        for(let i=0; i< players.length;i++){
            if(roleGame[i]==='🐺'){
                let member = await msg.mentions.members.get(playersID[i]);
                sendReactCollector(client, member, 'Wolves (React 👌 to delete): ', wolfFields, ['👌'], playersID[i]);
            }
        }
         
        const embed = new MessageEmbed();
        embed.setTitle("Roles: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        oldRoleGame.forEach((key) => {
            embed.addField(roles[key], key, inline = true);
        });
        
        await msg.channel.send({embeds:[embed], content: 'ready_for_it'});

    }
}