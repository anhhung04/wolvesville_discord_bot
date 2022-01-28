const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');

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
        let reactContent =[];
        let userIds = [];
        let callBack = {};
        var numsWolf = 0;
        let fields = await DB.getObjectData('fields');
        let playersID = await DB.get('playersID');
        let roleGame = await DB.get('prRole');

        for(let i=0; i< roleGame.length;i++){
            if(roleGame[i]==='🐺') numsWolf++;
        }
        
        for(let i=0; i< playersID.length;i++){
            let emoji = client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);

            reactContent.push(emoji);

            callBack[emoji.name] =  async (message, react, user, collector)=>{
                let box = await DB.get('die');
                box.push(fields[i].value);
                if(box.length >= numsWolf){
                    await DB.update('die', [mode(box)]);
                    collector.stop(`next_turn ${roles['🐺'].toLowerCase()}`);
                    return message.delete();
                }else{
                    await DB.update('die', box);
                }
            };

            if(roleGame[i]==='🐺'){
                userIds.push(playersID[i]);
            }
        }

        sendReactCollector(client, member, `${roles['🐺']} turn`);
         
        sendReactCollector(client, msg.channel, `Who do ${roles['🐺']} want to kill tonight?`, fields, reactContent, userIds,callBack, false);     
    }
}