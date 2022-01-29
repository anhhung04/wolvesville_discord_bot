const DB = require('../features/interactWithDB.js');
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name: 'vote_time',
    execute: async function(client, msg){
        var playersID = await DB.get('playersID');
        var Fields =  await DB.getObjectData('fields');

        Fields.push({
            name:'⏭️', 
            value:'skip', 
            label:'⏭️'
        });

        const callBack =  async (i, collector, mess)=>{
            let vote = await DB.get('vote');
            let playersID = await DB.get('playersID');
            
            vote.push(i.values[0]);

            if(vote.length===playersID.length){
                collector.stop('result');
                return message.delete();
            }
            
            await DB.update('vote', vote);
        };
         
        sendSelectMenu(client, msg.channel, `Vote:`, Fields, playersID, callBack, false);

    }
}