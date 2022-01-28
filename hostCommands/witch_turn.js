const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const sendReactCollector = require('../features/sendReactCollector.js');

module.exports={
    name:'witch_turn',
    execute: async function(client, msg){
        let die = await DB.get('die');
        let fields = await DB.getObjectData('fields');
        let reactContent =[];
        let userIds = [];
        let callBack = {};
        let playersID = await DB.get('playersID');
        let players = await DB.get('players');
        let roleGame = await DB.get('prRole');

        for(let i=0; i< playersID.length;i++){
            let emoji = client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);

            reactContent.push(emoji);

            callBack[emoji.name] =  async (message, react, user, collector)=>{
                let index = react._emoji.name.slice(0,1)-1;
                let players = await DB.get('players');
                let dieIn = await DB.get('die');
                

                if(!players[index]===dieIn[0]){
                    dieIn.push(players[index]);
                    
                    await DB.update('die', dieIn);
                }
                
                collector.stop(`next_turn ${roles['🧙‍♀️'].toLowerCase()}`);
                return message.delete();

            };

            if(roleGame[i]==='🧙‍♀️'){
                userIds.push(playersID[i]);
            }
        }

        if(userIds.length===0){
            return sendReactCollector(client, msg.channel, `A person died! Would ${roles['🧙‍♀️']} like to heal?`, fields, reactContent, [{name: '[.1.]', value: 'anonymous', inline: true}], ['👍', '👎'], [msg.author.id], {
                '👍':  (message, react, user, collector)=>{
                    collector.stop(`next_turn ${roles['🧙‍♀️'].toLowerCase()}`);
                    return message.delete();
                },'👎': (message, react, user, collector)=>{
                    collector.stop(`next_turn ${roles['🧙‍♀️'].toLowerCase()}`);
                    return message.delete();
                }
            }, true);
        }

        reactContent.push('❎');

        callBack['❎']= async (message, react, user, collector)=>{
            collector.stop(`next_turn ${roles['🧙‍♀️'].toLowerCase()}`);
            return message.delete();
        };

        sendReactCollector(client, msg.channel, `${roles['🧙‍♀️']} turn`);

        if(die.length>0){
            sendReactCollector(client, msg.channel, `A person died! Would ${roles['🧙‍♀️']} like to heal?`, [{name: '[.1.]', value: 'anonymous', inline: true}], ['👍', '👎'], userIds, {
                '👍': async (message, react, user, collector)=>{
                    await DB.update('die',[]);
                    return message.delete();
                },'👎':async (message, react, user, collector)=>{
                    return message.delete();
                }
            }, false);
        }

        sendReactCollector(client, msg.channel, `Who does ${roles['🧙‍♀️']} want to kill tonight?`,fields, reactContent, userIds, callBack, false);
    }
}