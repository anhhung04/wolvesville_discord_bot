const DB = require('../features/interactWithDB.js');

module.exports = async function(client, msg){
    const wolfChannel = client.channels.cache.get(process.env.Wolves_ID);
    const playersID = await DB.get('playersID');
    const roleGame = await DB.get('prRole');

    for(let i=0; i< playersID.length;i++){
        if(roleGame[i]==='🐺'){
            let member = await  msg.guild.members.cache.get(playersID[i]);
            wolfChannel.permissionOverwrites.create(member, { VIEW_CHANNEL: true, SEND_MESSAGES:true});
        }
    }
};