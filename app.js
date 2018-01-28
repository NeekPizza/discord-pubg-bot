const firebase = require('firebase');
const Discord = require('discord.js');
const keys = require('./keys');
const client = new Discord.Client();

firebase.initializeApp(keys.google_config);
const db = firebase.database();

//global
let authorId;
let gameInProgress;

//Connection Made
client.on('ready', ()=> {
    console.log('I am Ready!');
});

//Messages Listener
client.on('message', message => {

    if (message.content === '!start') {

        if (gameInProgress) {

            message.channel.send(`Sorry, a game is already in progress.`);

        } else if (!gameInProgress) {

            authorId = message.author.id;
            gameInProgress = true;
            message.channel.send(`${message.author} has started a game. Only they can record the score.`);
        };

    };

    if (message.content === '!win') {

        if (!authorId) {

            message.channel.send(`You must first start a game. Type !start to begin.`);

        } else if (message.author.id === authorId) {

            db.ref(`/users/${authorId}/`).once('value',(snapshot) => {

                if(!snapshot.val()) {

                    db.ref(`/users/${authorId}/`).set({'games': 1, 'wins': 1, 'losses': 0}, onComplete => {
                        message.channel.send(`Thank you ${message.author}, your win has been recorded.`);
                        authorId = null;
                        gameInProgress = false;
                    });

                } else {
                    updateGames = snapshot.val().games;
                    updateWins = snapshot.val().wins;
                    updateLosses = snapshot.val().losses;
                    updateGames++;
                    updateWins++;

                    db.ref(`/users/${authorId}/`).set({'games': updateGames, 'wins': updateWins, 'losses': updateLosses }, onComplete => {
                        message.channel.send(`Thank you ${message.author}, your win has been recorded.`);
                        authorId = null;
                        gameInProgress = false;
                    });
                };

            });

        } else if (message.author.id !== authorId) {

            message.channel.send(`Only the creator of the game can record the score`);
        };
    };

    if (message.content === '!lose') {

        if (!authorId) {

            message.channel.send(`You must first start a game. Type !start to begin.`);

        } else if (message.author.id === authorId) {

            db.ref(`/users/${authorId}/`).once('value',(snapshot) => {

                if(!snapshot.val()) {

                    db.ref(`/users/${authorId}/`).set({'games': 1, 'wins': 0, 'losses': 1}, onComplete => {
                        message.channel.send(`Thank you ${message.author}, your loss has been recorded.`);
                        authorId = null;
                        gameInProgress = false;
                    });

                } else {

                    updateGames = snapshot.val().games;
                    updateWins = snapshot.val().wins;
                    updateLosses = snapshot.val().losses;
                    updateGames++;
                    updateLosses++;

                    db.ref(`/users/${authorId}/`).set({'games': updateGames, 'wins': updateWins, 'losses': updateLosses }, onComplete => {
                        message.channel.send(`Thank you ${message.author}, your win has been recorded.`);
                        authorId = null;
                        gameInProgress = false;
                    });
                };
            });

        } else if (message.author.id !== authorId) {

            message.channel.send(`Only the creator of the game can record the score`);
        }
    };

    if (message.content === '!record') {

        authorId = message.author.id;
        db.ref(`/users/${authorId}/`).once('value',(snapshot) => {

            if(!snapshot.val()) {

                message.channel.send(`${message.author}, you have no games on record. type !start to start a game, or !help for more options`);

            } else {

                let percent = (snapshot.val().wins/snapshot.val().games)*100;
                message.channel.send(
                    `${message.author}, you have played **${snapshot.val().games} games**. You have **won ${snapshot.val().wins}** and **lost ${snapshot.val().losses}**.
                    This gives you a win ratio of **${percent}%**`
                );
            };
        });
    };

    if (message.content === '!thanks') {
        message.channel.send(`${message.author}, you are very welcome `);
    };
});

//auto-purge comments from general
client.setInterval ( function(){

    let channel = client.channels.find('name', 'general');
    let channelMessages = channel.messages;

    channel.bulkDelete(100)
    .then(messages => channel.message(`Bulk deleted ${messages.size} messages`))
    .catch(err => console.log(`${err.name}, ${err.message}`))

}, 86400000);

//auto-reconnect
client.on('disconnect', (err, code) => {
    console.log(`Bot disconnected with code ${code}, for reason ${err}`);
    client.login(keys.bot_token);
});

//login
client.login(keys.bot_token);