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

function shuffledCards(cards){
    for(let i=0; i< Math.floor(Math.random()*50);i++){
        cards.sort((a,b)=> 0.5- Math.random());
    }  
    return cards;
};

module.exports={
    name: 'result',
    execute: async function(client, msg){
        var vote = await DB.get('vote');
        var players = await DB.get('players');
        var role = await DB.get('prRole');
        var dayO = await DB.getObjectData('day');
        var day = dayO[0];
        var indexDay = day.index;
        var dayNightDay = day.dayNight;
        
        shuffledCards(vote);

        let personDie = mode(vote);

        if(personDie==='pass'){
            let mess1 = await msg.channel.send(`next`);
            
            return mess1.delete();
        }

        let index = players.indexOf(personDie);
        
        let roleDie = role[index];

        if(roleDie === '🔫') {
            let messGun = await msg.channel.send('gunner_turn');
            return messGun.delete();
        }else{
            killPerson(personDie);
        
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