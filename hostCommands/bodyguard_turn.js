const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const sendSelectMenu = require('../features/sendSelectMenu.js');
const sendSelectMenuDie = require('../features/sendSelectMenuDie.js');

module.exports={
    name:'bodyguard_turn',
    execute: async function(client, msg){
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
            }    
            else{
                await DB.update('shield', i.values);
                collector.stop(`next_turn ${roles['🛡️']}`);
            }
        };
        
        if(indexOut===-1){
            await sendSelectMenuDie(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, roles['🛡️']);
        }else{
            await sendSelectMenu(client, msg.channel, `Who does ${roles['🛡️']} want to protect tonight?`, fields, [playersID[indexOut]], callBack, true); 
        }

        return;
    }
};