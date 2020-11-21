require("dotenv").config()
const cron = require('cron');
const fetch = require('node-fetch');
const { Client, MessageEmbed } = require('discord.js')
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
        })
        .catch(err => {
            console.err(err)
        });
        // const channel = client.channels.cache.get(process.env.CHANNEL_ID);
        // channel.messages.fetch({ limit: 58 }).then(messages => {
        //     //Iterate through the messages here with the variable "messages".
        //     messages.forEach(message => {
        //         if(message.author.id === '778567076272406528'){
        //             message.reactions.cache.map(i => {
        //                 console.log(i._emoji.name === '❤️')
        //             })
        //         }
        //     })
        // })
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
                const embed = new MessageEmbed()
                .setTitle(`"${randomQuote.text}"`)
                .setAuthor(randomQuote.author)
                message.reply(embed)
            }else if(CMD_NAME === 'meme'){
                fetch("https://www.reddit.com/r/memes/comments.json?limit=1")
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                    let memeLink = data.data.children[0].data.link_url
                    const embed = new MessageEmbed()
                    .setTitle('Your random meme')
                    .setImage(memeLink)
                    message.channel.send(embed)
                })
                .catch(err => {
                    console.err(err)
                });
            }else if(CMD_NAME === 'aww'){
                fetch("https://www.reddit.com/r/aww/random.json")
                .then(function(response) {
                  return response.json();
                })
                .then(function(data) {
                    let catsLink = (data[0].data.children[0].data.url)
                    const embed = new MessageEmbed()
                    .setTitle('Your random aww pic')
                    .setImage(catsLink)
                    .setURL(catsLink)

                    message.channel.send(embed)
                })
                .catch(err => {
                    console.err(err)
                });
            }else if(CMD_NAME === 'motivate'){
                fetch("https://www.reddit.com/r/MotivationalPics/random.json")
                .then(function(response) {
                  message.channel.startTyping()
                  return response.json();
                })
                .then(function(data) {
                    const motivateLink = (data[0].data.children[0].data.url)
                    const embed = new MessageEmbed()
                    .setTitle('Your random motivational pic')
                    .setImage(motivateLink)
                    .setURL(motivateLink)

                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
                .catch(err => {
                    console.err(err)
                });
            }else if(CMD_NAME === 'flower'){
                fetch("https://www.reddit.com/r/flowers/random.json")
                .then(function(response) {
                  message.channel.startTyping()
                  return response.json();
                })
                .then(function(data) {
                    const flowerLink = (data[0].data.children[0].data.url)
                    const embed = new MessageEmbed()
                    .setTitle('Your random flower')
                    .setImage(flowerLink)
                    .setURL(flowerLink)

                    message.channel.send(embed)
                    message.channel.stopTyping()
                })
                .catch(err => {
                    console.err(err)
                });
            }else if(CMD_NAME === 'weather'){
                fetch(`http://api.weatherapi.com/v1/current.json?key=93f46ad1d54041c9b7c150429201911&q=${args}`)
                .then(function(response) {
                return response.json();
                })
                .then(function(data) {
                let icon = data.current.condition.icon.substring(2)
                const embed = new MessageEmbed()
                .setTitle('Weather for today')
                .addFields(
                    {
                        name:' Temperature',
                        value: data.current.temp_c
                    },
                    {
                        name: 'Conditions',
                        value: data.current.condition.text
                    }
                )
                    .setImage(`https://${icon}`)
                    message.channel.send(embed)
                })
                .catch(err => {
                    console.err(err)
                });
            }else if(CMD_NAME === 'fact'){
                fetch(`https://uselessfacts.jsph.pl/random.json?language=en`)
                .then(function(response) {
                return response.json();
                })
                .then(function(data) {
                const embed = new MessageEmbed()
                .setAuthor(data.source)
                .setTitle(data.text)
                    message.channel.send(embed)
                })
                .catch(err => {
                    console.err(err)
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

    let scheduledMessageQuote = new cron.CronJob('00 00 8 * * *', () => {
        
        let randomQuote = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        client.channels.fetch(process.env.CHANNEL_ID).then((channel) => {
            const embed = new MessageEmbed()
            .setTitle(`"${randomQuote.text}"`)
            .setDescription(randomQuote.author)
            .setAuthor('Your inspirational quote for today')
            .setFooter('Hope that makes Your day better!')

            channel.send(embed);
        });
    });

    let scheduledMessageWeather = new cron.CronJob('00 00 8 * * *', () => {
        fetch(`http://api.weatherapi.com/v1/forecast.json?key=93f46ad1d54041c9b7c150429201911&q=Lisbon&days=1`)
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        const forecastDay = data.forecast.forecastday[0]
        client.channels.fetch(process.env.CHANNEL_ID).then((channel) => {
                const embed = new MessageEmbed()
                .setTitle('Daily forecast for Lisbon')
                .setAuthor(forecastDay.date)
                .addFields(
                    {
                        name:'Max Temperature',
                        value: forecastDay.day.maxtemp_c,
                        inline: true
                    },
                    {
                        name: 'Min Temperature',
                        value: forecastDay.day.mintemp_c,
                        inline: true
                    },
                    {
                        name: 'Average Temperature',
                        value: forecastDay.day.avgtemp_c,
                        inline: true
                    },
                    {
                        name: 'Condition',
                        value: forecastDay.day.condition.text
                    }
                )
                .setImage(`https:${forecastDay.day.condition.icon}`)
                .setFooter('Have a wonderful day Mariana!')

                channel.send(embed);
            })
            .catch(err => {
                console.err(err)
            });
           
        })

        fetch(`http://api.weatherapi.com/v1/forecast.json?key=93f46ad1d54041c9b7c150429201911&q=Warsaw&days=1`)
        .then(function(response) {
        return response.json();
        })
        .then(function(data) {
        const forecastDay = data.forecast.forecastday[0]
        client.channels.fetch(process.env.CHANNEL_ID).then((channel) => {
                const embed = new MessageEmbed()
                .setTitle('Daily forecast for Warsaw')
                .setAuthor(forecastDay.date)
                .addFields(
                    {
                        name:'Max Temperature',
                        value: forecastDay.day.maxtemp_c,
                        inline: true
                    },
                    {
                        name: 'Min Temperature',
                        value: forecastDay.day.mintemp_c,
                        inline: true
                    },
                    {
                        name: 'Average Temperature',
                        value: forecastDay.day.avgtemp_c,
                        inline: true
                    },
                    {
                        name: 'Condition',
                        value: forecastDay.day.condition.text
                    }
                )
                .setImage(`https:${forecastDay.day.condition.icon}`)
                .setFooter('Have a wonderful day Marcin!')

                channel.send(embed);
            })
            .catch(err => {
                console.err(err)
            });
           
        })
        
    });


   
    
    scheduledMessageQuote.start()
    scheduledMessageWeather.start()
    
    client.login(process.env.DISCORDJS_BOT_TOKEN)
