const DB = require('./interactWithDB.js');

module.exports = async function(username){
        if(!username) return;
        var playersID = await DB.get('playersID');
        var players = await DB.get('players');
        var Fields =  [];
        var role = await DB.get('prRole');

        let index = players.indexOf(username);

        playersID.splice(index,1);
        players.splice(index,1);
        role.splice(index,1);
        
        for(let i = 0; i < players.length; i++){
            Fields.push({
                name: `\[.${i+1}.\]`,
                value: players[i],
                inline: true
            });
        }
        
        await DB.update('playersID', playersID);
        await DB.update('players', players);
        await DB.update('prRole', role);
        await DB.updateObjectData('fields', Fields);
        await DB.updateObjectData('die', [{}]);
        await DB.update('die', []);

}