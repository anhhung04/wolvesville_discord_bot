const DB = require('../features/interactWithDB.js');
require('dotenv').config();

module.exports = async function(client, msg){
    const wolfChannel = await client.channels.cache.get(process.env.Wolves_ID);
    const playersID = await DB.get('playersID');
    const roleGame = await DB.get('prRole');
    const guild = await client.guilds.cache.get(process.env.GUILD_ID);

    for(let i=0; i< playersID.length;i++){
        if(roleGame[i]==='🐺'){
            let member = await  guild.members.cache.get(playersID[i]);
            wolfChannel.permissionOverwrites.create(member, { VIEW_CHANNEL: true, SEND_MESSAGES:true});
        }
    }
};