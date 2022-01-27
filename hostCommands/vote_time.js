const DB = require('../features/interactWithDB.js');
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name: 'vote_time',
    execute: async function(client, msg){
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
                    collector.stop('result');
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