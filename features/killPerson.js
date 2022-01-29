const DB = require('./interactWithDB.js');

module.exports = async function(username){
        if(!username) return;
        var playersID = await DB.get('playersID');
        var players = await DB.get('players');
        var Fields =  [];
        var role = await DB.get('prRole');
        const guild = await client.guilds.cache.get(process.env.GUILD_ID);

        const index = players.indexOf(username);

        if(role[index]==='🐺'){
            const wolfChannel = await client.channels.cache.get(process.env.Wolves_ID);
            let member = await guild.members.cache.get(playersID[index]);
            wolfChannel.permissionOverwrites.edit(member, { VIEW_CHANNEL: false, SEND_MESSAGES:false});
        }

        playersID.splice(index,1);
        players.splice(index,1);
        role.splice(index,1);
        
        for(let i = 0; i < players.length; i++){
            Fields.push({
                name: `\[.${i+1}.\]`,
                value: players[i],
                inline: true,
                label: players[i]
            });
        }
        
        await DB.update('playersID', playersID);
        await DB.update('players', players);
        await DB.update('prRole', role);
        await DB.updateObjectData('fields', Fields);

}