const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');
const sendSelectMenu = require('../features/sendSelectMenu.js');

function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;  
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

module.exports={
    name:'werewolf_turn',
    execute: async function(client, msg){
        const fields = await DB.getObjectData('fields');
        const playersID = await DB.get('playersID');
        const roleGameOut = await DB.get('prRole');
        var usersId = [];

        for(let i = 0; i < playersID.length; i++){
            if(roleGameOut[i]==='🐺'){
                usersId.push(playersID[i]);
            }
        }
        
        
        const callBack =  async (i, collector, mess)=>{
            let numsWolf = 0;
            let roleGame = await DB.get('prRole');
            let box = await DB.get('die');
            let shield = await DB.get('shield');
            let diePerson = i.values[0];

            for(let i=0; i< roleGame.length;i++){
                if(roleGame[i]==='🐺') numsWolf++;
            }
            
           
            box.push(diePerson);
            if(box.length >= numsWolf){
                let diePer = mode(box);
                
                if(diePer===shield[0]){
                    await DB.update('die',[]);
                }else{
                    await DB.update('die', diePer);
                }
                
                collector.stop(`next_turn ${roles['🐺'].toLowerCase()}`);
                return mess.delete();
            }else{
                await DB.update('die', box);
            }
        };

        sendReactCollector(client, msg.channel, `${roles['🐺']} turn`);
         
        sendSelectMenu(client, msg.channel, `Who do ${roles['🐺']} want to kill tonight?`, fields, usersId, callBack, false);     
    }
}