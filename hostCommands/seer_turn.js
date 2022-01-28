const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name:'seer_turn',
    execute: async function(client, msg){
        let reactContent =[];
        let userIds = [];
        let callBack = {};
        let playersID = await DB.get('playersID');
        let roleGame = await DB.get('prRole');
        let fields = await DB.getObjectData('fields');
        
        for(let i=0; i< playersID.length;i++){
            let emoji = client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);

            reactContent.push(emoji);

            callBack[emoji.name] =  async (message, react, user, collector)=>{
                prMess = await message.channel.send(roleGame[i]);
                mess = await msg.channel.send(`next_turn ${roles['👀'].toLowerCase()}`);
                
                return mess.delete();
            };

            if(roleGame[i]==='👀'){
                userIds.push(playersID[i]);
            }
        }

        reactContent.push('❎');

        callBack['❎']= async (message, react, user, collector)=>{
            let channel = await client.channels.cache.get(process.env.HOST_ID);
            let mess = await channel.send(`next_turn ${roles['👀'].toLowerCase()}`);
            message.delete();
            return mess.delete();
        };

        sendReactCollector(client, member, `${roles['👀']} turn`);

        if(userIds.length===0){
            setTimeout(function(){
                return;
            },8000);
        }else{
            let member = client.users.cache.get(userIds[0]);

            sendReactCollector(client, member, `Who does ${roles['👀']} want to reveal tonight?`, fields, reactContent, userIds,callBack, false);
        }
           
        
    }
}