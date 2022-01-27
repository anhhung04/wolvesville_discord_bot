const DB = require('../features/interactWithDB.js');
const {roles, timer} = require('../config.js');
const dayNight = require('../config.js').dayNight;
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
    name: 'next',
    execute: async function (client, msg){
        const dayDataArr = await DB.getObjectData('day');
        const dayData = dayDataArr[0];
        var roleGame = await DB.get('prRole');
        var day = dayData.index;
        var dayOrNight = dayData.dayNight;
        var indexRole = Object.keys(roles);

        sendReactCollector(client, msg.channel, `${dayNight[dayOrNight]} ${day}`);

        switch(dayOrNight){
            case 0: {
                for(let i=0; i< indexRole.length;i++){
                    if(roleGame.includes(indexRole[i])){
                        let message = await msg.channel.send(`${roles[indexRole[i]].toLowerCase()}_turn`);
                        message.delete();
                        break;
                    }
                }
                break;
            }case 1:{
                let players = await DB.get('players');
                let playersID = await DB.get('playersID');
                
                let die = await DB.get('die');
                
                let shieldArr = await DB.get('shield');
                let shield = shieldArr[0];

                let Fields = [];
                let numsWolf = 0;
    
                for(let i=0; i< roleGame.length;i++){
                    if(roleGame[i]==='🐺') numsWolf++;
                }

                for(let i=0; i< die.length;i++){
                    if(die[i]!==shield){
                        let index = players.indexOf(die[i]);
                        roleGame.splice(index,1);
                        playersID.splice(index, 1);
                        players.splice(index,1);
                        sendReactCollector(client, msg.channel, `${die[i]}  was dead`);
                    }
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

                for(let i = 0; i < players.length; i++){
                    Fields.push({
                        name: `\[.${i+1}.\]`,
                        value: players[i],
                        inline: true
                    });
                }

                sendReactCollector(client, msg.channel, `Time to argue!`);

                await DB.update('prRole',roleGame);
                await DB.updateObjectData('fields', Fields);
                await DB.update('players', players);
                await DB.update('playersID', playersID);
                await DB.update('die', []);
                 
                setTimeout(()=>{
                    sendReactCollector(client, msg.channel, `10 seconds left`);
                    setTimeout(()=>{
                        msg.channel.send('vote_time');
                    },10000);
                },timer*1000-10000);
                break;
            }
        }
    }
};