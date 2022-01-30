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
        const playersID = await DB.get('playersID');
        const guild = await client.guilds.cache.get(msg.guildId);

        sendReactCollector(client, msg.channel, `${dayNight[dayOrNight]} ${day}`);

        switch(dayOrNight){
            case 0: {
                playersID.forEach(async function(id){
                    let member = await guild.members.cache.get(id);
                    member.voice.setDeaf(true);
                });
                
                for(let i=0; i< checkRole.length;i++){
                    if(checkRole.includes(indexRole[i])){
                        let message = await msg.channel.send(`${roles[indexRole[i]].toLowerCase()}_turn`);
                        message.delete();
                        break;
                    }
                }
                // let messageNext = await msg.channel.send(`next_turn`);
                // messageNext.delete();

                break;
            }case 1:{
                playersID.forEach(async function(id){
                    let member = await guild.members.cache.get(id);
                    member.voice.setDeaf(false);
                });

                let players = await DB.get('players');

                const mustDie = await DB.get('mustDie');
                
                const die = await DB.get('die');
                
                let shield = await DB.get('shield');

                const heal = await DB.getObjectData('witchHealPotions');

                if(die.length===0&&roleGame.includes('🛡️')){
                    await sendReactCollector(client, msg.channel, `${shield[0]} was protected by bodyguard last night!`);
                }else if(die.length===0&&!roleGame.includes('🛡️')){
                    await sendReactCollector(client, msg.channel, `Everybody are safe...`);
                }
                else if(die.length===0&&!heal){
                    await sendReactCollector(client, msg.channel, `The witch used heal potion`);
                }
                else{
                    let index = players.indexOf(die[0]);
                    let roleDie = roleGame[index];
                    
                    if(roleDie==='🔫'){
                        let messGun = await msg.channel.send(`gunner_turn`);
                        return messGun.delete();
                    }

                    await sendReactCollector(client, msg.channel, `${die[0]?die[0]:'No one'} was killed by wolves!`);

                    await killPerson(die[0]);
                }
                if(mustDie.length>0){
                    await killPerson(mustDie[0]);

                    await sendReactCollector(client, msg.channel, `${mustDie[0]} was killed by witch!`);
                }

                const newPlayers = await DB.get('players');
                const newRoleGame = await DB.get('prRole');

                let numsWolf = 0;
    
                for(let i=0; i< newRoleGame.length;i++){
                    if(newRoleGame[i]==='🐺') numsWolf++;
                }

                if(numsWolf >= newPlayers.length/2){
                    let mess1 = await msg.channel.send('end');
                    mess1.delete();
                    
                    return sendReactCollector(client, msg.channel, 'The werewolves win!');
                }else if(numsWolf===0){
                    let mess2 = await msg.channel.send('end');
                    mess2.delete();
                    
                    return sendReactCollector(client, msg.channel, 'The villagers win!');
                }

                await DB.update('mustDie',[]);
                await DB.update('die', []);
                await DB.update('shield', []); 

                const fields = await DB.getObjectData('fields');

                await sendReactCollector(client, msg.channel, `Time to argue!`);

                await sendReactCollector(client, msg.channel, `Villagers: `, fields);
                
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