const DB = require('../features/interactWithDB.js');
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

function shuffledCards(array) {
    let [...result] = array;

    for (let i = result.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
  
    return result;
}

module.exports={
    name: 'result',
    execute: async function(client, msg){
        const oldVote = await DB.get('vote');
        var players = await DB.get('players');
        var role = await DB.get('prRole');
        var dayO = await DB.getObjectData('day');
        var day = dayO[0];
        var indexDay = day.index;
        var dayNightDay = day.dayNight;
        
        [...vote] = shuffledCards(oldVote);

        let personDie = mode(vote);

        if(personDie==='skip'){
            let newIndex = indexDay + dayNightDay;
            let newDayNight = (dayNightDay+1)%2;

            await DB.updateObjectData('day', [{index: newIndex, dayNight: newDayNight}]);
            await DB.update('vote', []);
            
            let mess1 = await msg.channel.send(`next`);
            
            return mess1.delete();
        }

        let index = players.indexOf(personDie);
        
        let roleDie = role[index];

        if(roleDie === '🔫') {
            let messGun = await msg.channel.send('gunner_turn');
            return messGun.delete();
        }else if(roleDie==='🤡'){
            sendReactCollector(client, msg.channel, `${personDie} is fool! He wins!`);

            let messFool = await msg.channel.send('end');
            return messFool.delete();
        }
        else{
            killPerson(personDie);

            let roleGame = await DB.get('prRole');

            let numsWolf = 0;
             
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
        
            sendReactCollector(client, msg.channel, `${personDie} was dead`);
        }
        let newIndex = indexDay + dayNightDay;
        let newDayNight = (dayNightDay+1)%2;

        await DB.updateObjectData('day', [{index: newIndex, dayNight: newDayNight}]);
        await DB.update('vote', []);
        
        let mess = await msg.channel.send(`next`);
            
        return mess.delete();
    }
};