const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const sendSelectMenu = require('../features/sendSelectMenu.js');

module.exports={
    name:'bodyguard_turn',
    execute: async function(client, msg){
        let reactContent =[];
        let userIds = [];
        let playersID = await DB.get('playersID');
        let roleGame = await DB.get('prRole');
        let fields = await DB.getObjectData('fields');
        const indexOut = roleGame.indexOf('🛡️');

        sendReactCollector(client, msg.channel, `${roles['🛡️']} turn`);

        const callBack = async (i, collector, mess) =>{
            let perShield = await DB.get('shield');
            if(perShield === i.values[0]){
                sendReactCollector(client, msg.channel, `${roles['🛡️']} cannot protect anyone two consecutive nights!`);
                collector.stop('next');

                return mess.delete();
            }    
            else{
                await DB.update('shield', i.values);
                collector.stop(`next_turn ${roles['🛡️']}`);
                
                return mess.delete();
            }
        };

        const callBackDie = async(i, collector, mess) =>{
            collector.stop(`next_turn ${roles['🛡️']}`);
                
            return mess.delete();
        };
        
        if(indexOut===-1){
            return sendSelectMenu(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, [playersID], callBackDie, true, 5000, roles['🛡️']);
        }else{
            return sendSelectMenu(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, [playersID[indexOut]], callBack, true); 
        }
    }
};