const DB = require('../features/interactWithDB.js');
const roles = require('../config.js').roles;
const dayNight = require('../config.js').dayNight;
const {MessageEmbed} = require('discord.js');
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

module.exports={
    name: 'next',
    execute: async function (client, msg){
        const dayData = await DB.get('day');
        const roleGame = await DB.get('prRole');
        var role = await DB.get('role');
        var day = Number(dayData[0]);
        var dayOrNight = Number(dayData[1]);
        var playersID = await DB.get('playersID');
        var numsWolf = 0;

        for(let i=0; i< role.length;i++){
            if(role[i]==='🐺') numsWolf++;
        }

        sendReactCollector(client, msg.channel, `${dayNight[dayOrNight]} ${day}`);

        switch(dayOrNight){
            case 0: {
                if(await roleGame.includes('🛡️')){
                    let fields = [];
                    let reactContent =[];
                    let userId = playersID[roleGame.indexOf('🛡️')];
                    let callBack = {};
                    
                    for(let i=0; i< playersID.length;i++){
                        let emoji = client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);
                        let nickname = msg.guild.members.cache.get(playersID[i]).nickname;
                        fields.push({
                            name: `\[.${i+1}.\]`,
                            value: nickname,
                            inline: true
                        });

                        reactContent.push(emoji);

                        callBack[emoji.name] =  async (message, react, user)=>{
                            await DB.update('shield', [playersID[i]]);
                            
                            return message.delete();
                        };
                    }
                    
                    sendReactCollector(client, msg.channel, 'Who does bodyguard want to protect tonight?', fields, reactContent, userId,callBack, false);
                }
                if(await roleGame.includes('🐺')){
                    let fields = [];
                    let reactContent =[];
                    let userId = playersID[roleGame.indexOf('🐺')];
                    let callBack = {};
                    
                    for(let i=0; i< playersID.length;i++){
                        let emoji = client.emojis.cache.find(emoji => emoji.name === `${i+1}hearts`);
                        let nickname = msg.guild.members.cache.get(playersID[i]).nickname;
                        fields.push({
                            name: `\[.${i+1}.\]`,
                            value: nickname,
                            inline: true
                        });

                        reactContent.push(emoji);

                        callBack[emoji.name] =  async (message, react, user)=>{
                            let box = await DB.get('die');
                            box.push(playersID[i]);
                            if(box.length >= numsWolf){
                                await DB.update('die', [`${mode(box)}`]);
                                return message.delete();
                            }else{
                                await DB.update('die', box);
                            }
                        }
                    }
                    
                    sendReactCollector(client, msg.channel, 'Who do were wolves want to kill tonight?', fields, reactContent, userId,callBack, false);
                    

                }
            }
        }

        
        

    }
};