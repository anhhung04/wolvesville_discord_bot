const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name:'bodyguard_turn',
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
                await DB.updateObjectData('shield', [{shield:fields[i].value}]);
                collector.stop(`next_turn ${roles['🛡️'].toLowerCase()}`);
                
                return message.delete();
            };

            if(roleGame[i]==='🛡️'){
                userIds.push(playersID[i]);
            }
        }

        if(userIds.length===0){
            return sendReactCollector(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, reactContent, [msg.author.id],{'🛡️':()=>setTimeout((message, react, user, collector)=>{return message.delete();},3000)}, true);
        }
        
        await sendReactCollector(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, reactContent, userIds,callBack, false);    
    }
}