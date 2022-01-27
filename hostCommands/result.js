const DB = require('../features/interactWithDB.js');
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
        var playersID = await DB.get('playersID');
        var players = await DB.get('players');
        var Fields =  [];
        var role = await DB.get('prRole');
        
        shuffledCards(vote);

        let personDie = mode(vote);

        let index = players.indexOf(personDie);

        playersID.splice(index,1);
        players.splice(index,1);
        role.splice(index,1);
        
        for(let i = 0; i < players.length; i){
            Fields.push({
                name: `\[.${i+1}.\]`,
                value: players[i],
                inline: true
            });
        }
        
        var dayO = await DB.getObjectData('day');
        var day = dayO[0];
        
        await DB.update('day', {index: day.index+=day.dayNight, dayNight: (day.dayNight+1)%2});
        await DB.update('die', []);
        await DB.updateObjectData('shield', [{}]);
        await DB.updateObjectData('die', [{}]);
        await DB.update('playersID', playersID);
        await DB.update('players', players);
        await DB.update('prRole', role);
        await DB.updateObjectData('fields', Fields);
        
        sendReactCollector(client, msg.channel, `${personDie} was dead`);

        let mess = await msg.channel.send(`next`);
            
        return mess.delete();
    }
};