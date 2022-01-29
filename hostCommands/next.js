const DB = require('../features/interactWithDB.js');
const {roles, timer} = require('../config.js');
const dayNight = require('../config.js').dayNight;
const sendReactCollector = require('../features/sendReactCollector.js');
const killPerson = require('../features/killPerson.js');

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
        var checkRole = await DB.get('role');
        var day = dayData.index;
        var dayOrNight = dayData.dayNight;
        var indexRole = Object.keys(roles);

        sendReactCollector(client, msg.channel, `${dayNight[dayOrNight]} ${day}`);

        switch(dayOrNight){
            case 0: {
                for(let i=0; i< checkRole.length;i++){
                    if(checkRole.includes(indexRole[i])){
                        let message = await msg.channel.send(`${roles[indexRole[i]].toLowerCase()}_turn`);
                        message.delete();
                        break;
                    }
                }
                break;
            }case 1:{
                let players = await DB.get('players');

                const mustDie = await DB.get('mustDie');
                
                const die = await DB.get('die');
                
                let shield = await DB.get('shield');
                
                let numsWolf = 0;
    
                for(let i=0; i< roleGame.length;i++){
                    if(roleGame[i]==='🐺') numsWolf++;
                }

                if(die.length===0&&roleGame.includes('🛡️')){
                    sendReactCollector(client, msg.channel, `${shield[0]} was protected by bodyguard last night!`);
                }else if(die.length===0&&!roleGame.includes('🛡️')){
                    sendReactCollector(client, msg.channel, `Everybody are safe...`);
                }
                else{
                    let index = players.indexOf(die[0]);
                    let roleDie = roleGame[index];
                    
                    if(roleDie==='🔫'){
                        let messGun = await msg.channel.send(`gunner_turn`);
                        return messGun.delete();
                    }

                    sendReactCollector(client, msg.channel, `${shield[0]?shield[0]:die[0]} was killed by wolves!`);

                    killPerson(die[0]);
                }

                if(mustDie.length>0){
                    killPerson(mustDie[0]);

                    sendReactCollector(client, msg.channel, `${mustDie[0]} was killed by witch!`);
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

                sendReactCollector(client, msg.channel, `Time to argue!`);

                const fields = await DB.getObjectData('fields');

                sendReactCollector(client, msg.channel, 'Villagers', fields);

                await DB.update('mustDie',[]);
                await DB.update('die', []);
                await DB.update('shield', []); 
                 
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