const fsPromises = require('fs').promises;
require('dotenv').config();

module.exports={
    name : 'help',
    execute: async function(client, message, args) {
        try {
            let helpMess = await fsPromises.readFile('./data/help.txt',{
                encoding: 'utf8'
            });
            message.channel.send(helpMess);
        } catch (err) {
            console.log(err);
        }
    }
};