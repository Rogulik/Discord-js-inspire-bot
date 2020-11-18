require("dotenv").config()
const cron = require('cron');
const fetch = require('node-fetch');
const { Client } = require('discord.js')
const client = new Client()

const PREFIX = '$'
let randomQuotes = []


    client.on('ready', () => {
        fetch("https://type.fit/api/quotes")
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
           randomQuotes = [...data]
        });
         
        let scheduledMessage = new cron.CronJob('00 46 14 * * *', () => {
            let randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
            client.channels.fetch(process.env.CHANNEL_ID).then((channel) => {
                channel.send(`Your inspirational quote for today is: "${randomQuote.text}", Hope that makes Your day better!`);
            });
        });
        
        scheduledMessage.start()
    })
    
    client.on('message',(message) => {
        let randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        if(message.author.bot) return
        if(message.content.startsWith(PREFIX)) {
            const [ CMD_NAME, ...args ] = message.content
            .trim()
            .substring(PREFIX.length)
            .split(/\s+/)
    
            if(CMD_NAME === 'inspire'){
                message.reply(`${randomQuote.text}`)
            }
        }
    
        if(message.content.toLowerCase() === 'hello bot'){
            message.reply('Hello there!')
        }
        
    })
    
    client.login(process.env.DISCORDJS_BOT_TOKEN)
