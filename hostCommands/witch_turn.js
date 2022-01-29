const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name:'witch_turn',
    execute: async function(client, msg){
        const die = await DB.get('die');
        const shield = await DB.get('shield');
        var fields = await DB.getObjectData('fields');
        const playersID = await DB.get('playersID');
        const roleGame = await DB.get('prRole');
        const indexOut =  roleGame.indexOf('🧙‍♀️');

        fields.push({
            name:'❎',
            value: 'cancel',
            label: '❎',
            inline: true
        });
        
        const callBack =  async (i, collector, mess)=>{
            if(i.values[0]==='❎'){
                collector.stop(`next_turn ${roles['🧙‍♀️'].toLowerCase()}`);
                return mess.delete();
            }

            let diePer = i.values[0];
            let dieWolf = await DB.get('die');

            if(diePer!==dieWolf[0]){
                await DB.update('mustDie', [diePer]);
            }
            
            collector.stop(`next_turn ${roles['🧙‍♀️'].toLowerCase()}`);
            return mess.delete();
        };
        const callBackHeal = async(i, collector, mess) =>{
            if(i.values[0]==='👍'){
                await DB.update('die', []);
                await DB.updateObjectData('witchHealPotions', false); 
            }

            collector.stop(`next_turn ${roles['🧙‍♀️'].toLowerCase()}`);
                
            mess.delete();
        };

        sendReactCollector(client, msg.channel, `${roles['🧙‍♀️']} turn`);

        const heal = await DB.getObjectData('witchHealPotions');
        const kill = await DB.getObjectData('witchKillPotions');
        
        if(indexOut!==-1){
            
            if(die[0]!==shield[0]&&heal){
                sendSelectMenu(client, msg.channel, `${die[0]} died! Would ${roles['🧙‍♀️']} like to revive him?`, [{label: '👍', value: '👍'}, {label: '👎', value: '👎'}],playersID[indexOut], callBackHeal);
            }
            if(kill){
                sendSelectMenu(client, msg.channel, `Who does ${roles['🧙‍♀️']} want to kill`, fields,playersID[indexOut], callBack);
            }
        }else{
            if(heal){
                sendSelectMenu(client, msg.channel, `${die[0]} died! Would ${roles['🧙‍♀️']} like to revive him?`, [{label: '👍', value: '👍'}, {label: '👎', value: '👎'}],playersID[indexOut], callBackHeal, true, 5000, roles['🧙‍♀️']);
            }
            if(kill){
                sendSelectMenu(client, msg.channel, `Who does ${roles['🧙‍♀️']} want to kill`, fields, playersID, callBackHeal, true, 5000, roles['🧙‍♀️']);
            }
        }
    }
};