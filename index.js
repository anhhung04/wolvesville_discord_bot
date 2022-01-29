const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_BANS
    ],
    partials: [
    "CHANNEL"
    ]
});
const fs = require('fs');

require('dotenv').config();
const env = process.env;

const token = env.TOKEN;
const hostID = env.HOST_ID; 

const files1 = fs.readdirSync('./hostCommands').filter(file => file.endsWith('.js'));
const hostCommands = new Map();
for(let file of files1){
    let command = require(`./hostCommands/${file}`);
    hostCommands.set(command.name, command);
}

client.on('messageCreate', msg =>{
    let command = msg.content.trim().toLowerCase().split(/ +/).shift();
    let channelSendID = msg.channel.id;
    
    if(hostID!== channelSendID) return;
    
    if(hostCommands.has(command)){
        hostCommands.get(command).execute(client, msg);
    }
    return;
   
});

client.on('ready', () => {
    console.log(`${client.user.tag} is already`);
});

client.login(token);