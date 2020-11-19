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
                message.reply(`"${randomQuote.text}" - ${randomQuote.author}`)
            }else if(CMD_NAME === 'meme'){
                fetch("https://www.reddit.com/r/memes/comments.json?limit=1")
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                    let memeLink = data.data.children[0].data.link_url
                    message.channel.send("Your random meme: ", {files: [`${memeLink}`]})
                });
            }else if(CMD_NAME === 'kitty'){
                fetch("https://www.reddit.com/r/cats/comments.json?limit=1")
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                    let catsLink = data.data.children[0].data.link_url
                    message.channel.send("Your random kitty: ", {files: [`${catsLink}`]})
                });
            }else if(CMD_NAME === 'motivate'){
                fetch("https://www.reddit.com/r/MotivationalPics/random.json")
                .then(function(response) {
                  message.channel.startTyping()
                  return response.json();
                })
                .then(function(data) {
                    const motivateLink = (data[0].data.children[0].data.url)
                    message.channel.send("Your random motivational pic: ", {files: [`${motivateLink}`]})
                    message.channel.stopTyping()
                });
            }else if(CMD_NAME === 'flower'){
                fetch("https://www.reddit.com/r/flowers/random.json")
                .then(function(response) {
                  message.channel.startTyping()
                  return response.json();
                })
                .then(function(data) {
                    const flowerLink = (data[0].data.children[0].data.url)
                    message.channel.send("Your random flower: ", {files: [`${flowerLink}`]})
                    message.channel.stopTyping()
                });
            }else if(CMD_NAME === 'weather'){
                fetch(`http://api.weatherapi.com/v1/current.json?key=93f46ad1d54041c9b7c150429201911&q=${args}`)
                .then(function(response) {
                return response.json();
                })
                .then(function(data) {
                let icon = data.current.condition.icon.substring(2)
                message.channel.send(`
                The weather in ${data.location.name} is: ${data.current.temp_c} degrees, ${data.current.condition.text}`, {files: [`https://${icon}`]})
                });
            }
        }
    
        if(message.content.toLowerCase() === 'hello bot'){
            message.reply('Hello there!')
        }else if(message.content.toLowerCase() === 'goodbye bot'){
            message.reply('Goodbye and see You again soon! :kissing_closed_eyes:')
        }else if(message.content.toLowerCase() === 'goodbye bot without kiss'){
            message.reply('Fuck You! I will give You kiss anyway :kissing_closed_eyes:')
        }
        
    })

    let scheduledMessage = new cron.CronJob('00 00 8 * * *', () => {
        let randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        client.channels.fetch(process.env.CHANNEL_ID).then((channel) => {
            channel.send(`Your inspirational quote for today is: "${randomQuote.text}" - ${randomQuote.author}, Hope that makes Your day better!`);
        });
    });
    
    scheduledMessage.start()
    
    client.login(process.env.DISCORDJS_BOT_TOKEN)
