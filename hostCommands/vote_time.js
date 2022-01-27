const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');

function shuffledCards(cards){
    for(let i=0; i< Math.floor(Math.random()*50);i++){
        cards.sort((a,b)=> 0.5- Math.random());
    }  
    return cards;
};

module.exports={
    name: 'vote_time',
    execute: async function(client, msg){
        var roleGame = await DB.get('prRole');
        var role = await DB.get('role');
        var playersID = await DB.get('playersID');
        var players = await DB.get('players');
        var Fields =  await DB.getObjectData('fields');

        for(let i=0; i< playersID.length;i++){
            let emoji = client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);

            reactContent.push(emoji);

            callBack[emoji.name] =  async (message, react, user, collector)=>{
                let boxVote = await DB.get('vote');
                box.push(fields[i].value);
                if(box.length===players.length){
                    collector.stop('next');
                    message.delete();
                }
                await DB.update('vote', boxVote);
            };
        }

        reactContent.push('⏭️');

        callBack['⏭️'] =  async (message, react, user, collector)=>{
            let boxVote = await DB.get('vote');
            box.push('pass');
            if(box.length===players.length){
                collector.stop('result');
                message.delete();
            }
            await DB.update('vote', boxVote);
        };
        
        await sendReactCollector(client, msg.channel, `Vote:`, Fields, reactContent, userIds,callBack, false);

    }
}