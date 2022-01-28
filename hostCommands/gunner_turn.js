const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const killPerson = require('../features/killPerson.js');


module.exports={
    name:'gunner_turn',
    execute: async function(client, msg){
        let reactContent =[];
        let userIds = [];
        let callBack = {};
        let fields = await DB.getObjectData('fields');
        let playersID = await DB.get('playersID');
        let players = await DB.get('players');
        let roleGame = await DB.get('prRole');
        
        for(let i=0; i< playersID.length;i++){
            let emoji = client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);

            reactContent.push(emoji);

            callBack[emoji.name] =  async (message, react, user, collector)=>{
                killPerson(players[i]);
                
                sendReactCollector(client, msg.channel, `${players[i]} was shot`);

                sendReactCollector(client, msg.channel, `${user.username} was dead`);

                collector.stop('next');

                return message.delete();
            };

            if(roleGame[i]==='🔫'){
                userIds.push(playersID[i]);
            }
        }
         
        killPerson(userIds[0]);

        sendReactCollector(client, msg.channel, `Who does ${roles['🔫']} want to shoot?`, fields, reactContent, userIds,callBack, false); 
        
        
    }
}