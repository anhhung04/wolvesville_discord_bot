const DB = require('../features/interactWithDB.js');
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name: 'vote_time',
    execute: async function(client, msg){
        var playersID = await DB.get('playersID');
        var Fields =  await DB.getObjectData('fields');
        var reactContent = [];
        var callBack={};

        for(let i=0; i< playersID.length;i++){
            let emoji = await client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);

            reactContent.push(emoji);

            callBack[emoji.name] =  async (message, react, user, collector)=>{
                let boxVote1 = await DB.get('vote');

                boxVote1.push(Fields[i].value);

                if(boxVote1.length>=playersID.length){
                    collector.stop('result');
                    return message.delete();
                }

                await DB.update('vote', boxVote1);
            };
        }

        reactContent.push('⏭️');

        callBack['⏭️'] =  async (message, react, user, collector)=>{
            let boxVote2 = await DB.get('vote');
            boxVote2.push('pass');

            if(boxVote2.length===playersID.length){
                collector.stop('result');
                return message.delete();
            }
            
            await DB.update('vote', boxVote2);
        };
         
        sendReactCollector(client, msg.channel, `Vote:`, Fields, reactContent, playersID,callBack, false);

    }
}