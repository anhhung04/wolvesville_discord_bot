const { roles } = require('../config.js');
const DB = require('../features/interactWithDB.js');

module.exports={
    name: 'next_turn',
    execute:async function (client, msg){
        const indexV = Object.values(roles);
        const indexK = Object.keys(roles);
        const role = await DB.get('role');
        var dayO = await DB.getObjectData('day');
        var day = dayO[0];

        var preIndex = indexV.indexOf(msg.content.split(/ +/)[1]);
        var nextIndex = (preIndex+1)%indexV.length;
        
        for(let i=0; i<indexK.length; i++){
            if(role.includes(indexK[nextIndex])||nextIndex === indexV.indexOf('villager')) break;
            nextIndex++;
        }
        
        if(nextIndex === indexV.indexOf('villager')){

            await DB.updateObjectData('day', [{index: day.index+=day.dayNight, dayNight: (day.dayNight+1)%2}]);
            // await DB.update('die', []);
            // await DB.updateObjectData('shield', [{}]);
            // await DB.updateObjectData('die', [{}]);
            
            let mess = await msg.channel.send(`next`);
            
            return mess.delete();
        }else{
            let messOut = await msg.channel.send(`${indexV[nextIndex].toLowerCase()}_turn`);
        
            return messOut.delete();
        }
    }
};