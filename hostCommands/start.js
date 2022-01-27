const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const {MessageEmbed} = require('discord.js');
const sendReactCollector = require('../features/sendReactCollector.js');

function shuffledCards(cards){
    for(let i=0; i< Math.floor(Math.random()*50);i++){
        cards.sort((a,b)=> 0.5- Math.random());
    }  
    return cards;
};

module.exports={
    name: 'start',
    execute: async function(client, msg){
        const roleGame = await DB.get('role');
        var playersID = [];
        var players = [];
        var Fields =[];
        var isGameStartedO = await DB.getObjectData('isGameStarted');
        
        if(roleGame.length===0) return msg.channel.send('Roles haven\'t been set!');
        
        if(msg.mentions.users.size < roleGame.length){
            return msg.channel.send('Not enough players!');
        }else if(msg.mentions.users.size > roleGame.length){
            return msg.channel.send('Too much player!');
        }else if(isGameStartedO[0].isGameStarted){
            return msg.channel.send('Please finish the previous game!');
        }

        await DB.updateObjectData('isGameStarted',{isGameStarted: true});

        shuffledCards(roleGame);

        await DB.update('prRole', roleGame);

        [...playersID] = msg.mentions.users.keys();
            
        await DB.update('playersID', playersID);
        

        for(let i =0; i< playersID.length;i++){
            let member = await msg.mentions.members.get(playersID[i]);
            players.push(member.user.username);
            Fields.push({
                name: `\[.${i+1}.\]`,
                value: member.user.username,
                inline: true
            });
            await sendReactCollector(client, member, 'Your role (React 👌 to delete): ', {name: roles[roleGame[i]], value: roleGame[i], inline: true}, ['👌'], playersID[i]);
        }

        await DB.update('players', players);
        
        await DB.updateObjectData('fields', Fields);
         
        const embed = new MessageEmbed();
        embed.setTitle("Roles: ");
        embed.setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        embed.setTimestamp(); 
        roleGame.forEach((key) => {
            embed.addField(roles[key], key, inline = true);
        });
        
        await msg.channel.send({embeds:[embed], content: 'ready_for_it'});

    }
}