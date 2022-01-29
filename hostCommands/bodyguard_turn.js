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
                let fields = await DB.getObjectData('fields');
                let index = react._emoji.name.slice(0,1)-1;
                let shieldArr = await DB.get('shield');
                if(shieldArr[0]===fields[index].value){
                    sendReactCollector(client, msg.channel, `${roles['🛡️']} cannot protect someone 2 nights in a row`);
                     
                    collector.stop(`next_turn`);
                    
                    return message.delete();
                }else{
                    await DB.update('shield', [fields[index].value]);
                    collector.stop(`next_turn ${roles['🛡️'].toLowerCase()}`);
                    
                    return message.delete();
                }
            };

            if(roleGame[i]==='🛡️'){
                userIds.push(playersID[i]);
            }
        }

        sendReactCollector(client, msg.channel, `${roles['🛡️']} turn`);

        if(userIds.length===0){
            return sendReactCollector(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, reactContent, [msg.author.id],{ 
                '1hearts' : (message, react, user, collector) => {
                collector.stop(`next_turn ${roles['🛡️'].toLowerCase()}`);
                return message.delete();
            }
        }, true);
        }else{
            return sendReactCollector(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, reactContent, userIds,callBack, false); 
        }
    }
}