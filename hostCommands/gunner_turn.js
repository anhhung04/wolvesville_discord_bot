const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const killPerson = require('../features/killPerson.js');
const sendSelectMenu = require('../features/sendSelectMenu.js');
require('dotenv').config();


module.exports={
    name:'gunner_turn',
    execute: async function(client, msg){
        const fields = await DB.getObjectData('fields');
        const playersID = await DB.get('playersID');
        const players = await DB.get('players');
        const roleGame = await DB.get('prRole');
        const indexOut = roleGame.indexOf('🔫');

        const callBack =  async (i, collector, mess)=>{
            let roleGame = await DB.get('prRole');
            let numsWolf = 0;
            
            await killPerson(i.values[0]);
            
            await sendReactCollector(client, msg.channel, `${i.values[0]} was shot`);

            await sendReactCollector(client, msg.channel, `${i.user.username} died`);
            
            for(let i=0; i< roleGame.length;i++){
                if(roleGame[i]==='🐺') numsWolf++;
            }

            if(numsWolf>= players.length/2){
                let mess1 = await msg.channel.send('end');
                mess1.delete();
                
                return sendReactCollector(client, msg.channel, 'The werewolves win!');
            }else if(numsWolf===0){
                let mess2 = await msg.channel.send('end');
                mess2.delete();
                
                return sendReactCollector(client, msg.channel, 'The villagers win!');
            }

            return collector.stop('next');
        };

        sendReactCollector(client, msg.channel, `${roles['🔫']} turn`);
         
        killPerson(playersID[indexOut]);

        sendSelectMenu(client, msg.channel, `Who does ${roles['🔫']} want to shoot?`, fields, playersID[indexOut], callBack); 
    }
};