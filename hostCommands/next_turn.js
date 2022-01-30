const { roles } = require('../config.js');
const DB = require('../features/interactWithDB.js');
require('dotenv').config();

module.exports={
    name: 'next_turn',
    execute:async function (client, msg){
        const indexV = Object.values(roles);
        const indexK = Object.keys(roles);
        const villagerIndex = indexV.indexOf('villager');
        const role = await DB.get('role');
        var dayO = await DB.getObjectData('day');
        var day = dayO[0];

        var preIndex = indexV.indexOf(msg.content.split(/ +/)[1]);
        var nextIndex = preIndex+1;
        for(let i=0; i<indexK.length; i++){
            if(role.includes(indexK[nextIndex])||nextIndex >= villagerIndex) break;
            nextIndex++;
        }
        
        if(nextIndex >= villagerIndex){

            await DB.updateObjectData('day', [{index: day.index+=day.dayNight, dayNight: (day.dayNight+1)%2}]);
            
            let mess = await msg.channel.send(`next`);
            
            return mess.delete();
        }else{
            let messOut = await msg.channel.send(`${indexV[nextIndex].toLowerCase()}_turn`);
        
            return messOut.delete();
        }
    }
};