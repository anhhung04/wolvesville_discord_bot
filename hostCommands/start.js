const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const {MessageEmbed} = require('discord.js');
const sendReactCollector = require('../features/sendReactCollector.js');
const addWereWolvesToChatChannel = require('../features/addWereWolvesToChatChannel.js');

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
        const guild = await client.guilds.cache.get(msg.guildId);
        const hostMember = await guild.members.cache.get(msg.author.id);

        if(!hostMember.voice.channel) return msg.channel.send('Please connect to a voice channel');

        hostMember.voice.channel.setName('MA SÓI');

        if(oldRoleGame.length===0) return msg.channel.send('Roles haven\'t been set!');

        var [...memberKeys] = hostMember.voice.channel.members.keys();

        const [...playersID] = shuffledCards(memberKeys);
        
        if(memberKeys.length < oldRoleGame.length){
            return msg.channel.send('Not enough players!');
        }else if(memberKeys.length > oldRoleGame.length){
            return msg.channel.send('Too much player!');
        }else if(isGameStartedO[0].isGameStarted){
            return msg.channel.send('Please finish the previous game!');
        }

        await DB.updateObjectData('isGameStarted',{isGameStarted: true});

        await DB.update('prRole', roleGame);

        await DB.update('playersID', playersID);

        for(let i =0; i< playersID.length;i++){
            let member = await guild.members.cache.get(playersID[i]);
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
            await sendReactCollector(client, member, 'Your role (React 👌 to delete): ', {name: roles[roleGame[i]], value: roleGame[i], inline: true}, ['👌'], playersID[i]);
        }

        await DB.update('players', players);
        
        await DB.updateObjectData('fields', Fields);
        
        for(let i=0; i< players.length;i++){
            if(roleGame[i]==='🐺'){
                let member = await guild.members.cache.get(playersID[i]);
                await sendReactCollector(client, member, 'Wolves (React 👌 to delete): ', wolfFields, ['👌'], playersID[i]);
            }
        }
         
        const embed = new MessageEmbed();
        embed.setTitle("Roles: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        oldRoleGame.forEach((key) => {
            embed.addField(roles[key], key, inline = true);
        });
        
        addWereWolvesToChatChannel(client, msg);

        await msg.channel.send({embeds:[embed], content: 'ready_for_it'});

    }
}