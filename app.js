const Content = require('./lib/Content.js');
const Start = require('./lib/Start.js');
const users = require('./lib/User.js');

const firebase = require('firebase');
const Discord = require('discord.js');
const keys = require('./keys');
const client = new Discord.Client();

firebase.initializeApp(keys.google_config);
const db = firebase.database();

// Enums
const START = '!start';
const WIN = '!win';
const LOSS = '!loss';
const RECORD = '!record';
const THANKS = '!thanks';

//Connection Made
client.on('ready', ()=> {
    console.log('I am Ready!');
});

//Messages Listener
client.on('message', message => {
    Content.setContent(message);

    let channel = message.channel;
    let content = message.content;
    let author = message.author;
    let id = message.author.id;

    switch(content) {
        case START:
            Start.run();
            break;
        case WIN:
        case LOSS:
            if (!id in users || !users[id]) {
                channel.send(`You must first start a game. Type \`!start\` to begin.`);
            } else {
                db.ref(`/users/${id}/`).once('value',(snapshot) => {
                    if (!snapshot.val()) {
                        if (content === WIN) {
                            db.ref(`/users/${id}/`).set({'games': 1, 'wins': 1, 'losses': 0}, onComplete => {
                                channel.send(`Thank you ${author}, your win has been recorded.`);
                            });
                        } else if (content === LOSS) {
                            db.ref(`/users/${id}/`).set({'games': 1, 'wins': 0, 'losses': 1}, onComplete => {
                                channel.send(`Thank you ${author}, your loss has been recorded.`);
                            });
                        }
                    } else if (snapshot.val()) {
                        let updateGames = snapshot.val().games;
                        let updateWins = snapshot.val().wins;
                        let updateLosses = snapshot.val().losses;
                        if (content === WIN) {
                            updateGames++;
                            updateWins++
                            db.ref(`/users/${id}/`).set({'games': updateGames, 'wins': updateWins, 'losses': updateLosses }, onComplete => {
                                channel.send(`Thank you ${author}, your win has been recorded.`);
                            });
                        } else if (content === LOSS) {
                            updateGames++;
                            updateLosses++
                            db.ref(`/users/${id}/`).set({'games': updateGames, 'wins': updateWins, 'losses': updateLosses }, onComplete => {
                                channel.send(`Thank you ${author}, your loss has been recorded.`);
                            });
                        };
                    };
                });

                users[id] = false;
            }
            break;
        case RECORD:
            db.ref(`/users/${id}/`).once('value',(snapshot) => {
                if(!snapshot.val()) {
                    channel.send(`${author}, you have no games on record. type !start to start a game, or !help for more options`);
                } else {
                    let percent = (snapshot.val().wins/snapshot.val().games)*100;
                    channel.send(
                        `${author}, you have played **${snapshot.val().games} games**. You have **won ${snapshot.val().wins}** and **lost ${snapshot.val().losses}**.
                        This gives you a win ratio of **${percent}%**`
                    );
                };
            });
            break;
        case THANKS:
            channel.send(`${author}, you are very welcome `);
            break;
    }

    // if (content === `!start`) {
    //     Start.run();
    // };

    // if (content === '!win' || content === '!loss') {

    //     if (!id in users || !users[id]) {

    //         channel.send(`You must first start a game. Type \`!start\` to begin.`);

    //     } else {

    //         db.ref(`/users/${id}/`).once('value',(snapshot) => {

    //             if (!snapshot.val()) {

    //                 if (content === '!win') {

    //                     db.ref(`/users/${id}/`).set({'games': 1, 'wins': 1, 'losses': 0}, onComplete => {
    //                         channel.send(`Thank you ${author}, your win has been recorded.`);
    //                     });

    //                 } else if (content === '!loss') {

    //                     db.ref(`/users/${id}/`).set({'games': 1, 'wins': 0, 'losses': 1}, onComplete => {
    //                         channel.send(`Thank you ${author}, your loss has been recorded.`);
    //                     });
    //                 }

    //             } else if (snapshot.val()) {

    //                 let updateGames = snapshot.val().games;
    //                 let updateWins = snapshot.val().wins;
    //                 let updateLosses = snapshot.val().losses;

    //                 if (content === '!win') {

    //                     updateGames++;
    //                     updateWins++
    //                     db.ref(`/users/${id}/`).set({'games': updateGames, 'wins': updateWins, 'losses': updateLosses }, onComplete => {
    //                         channel.send(`Thank you ${author}, your win has been recorded.`);
    //                     });

    //                 } else if (content ==='!loss') {

    //                     updateGames++;
    //                     updateLosses++
    //                     db.ref(`/users/${id}/`).set({'games': updateGames, 'wins': updateWins, 'losses': updateLosses }, onComplete => {
    //                         channel.send(`Thank you ${author}, your loss has been recorded.`);
    //                     });
    //                 };
    //             };
    //         });

    //         users[id] = false;
    //     };
    // };

    // if (content === '!record') {

    //     db.ref(`/users/${id}/`).once('value',(snapshot) => {

    //         if(!snapshot.val()) {

    //             channel.send(`${author}, you have no games on record. type !start to start a game, or !help for more options`);

    //         } else {

    //             let percent = (snapshot.val().wins/snapshot.val().games)*100;
    //             channel.send(
    //                 `${author}, you have played **${snapshot.val().games} games**. You have **won ${snapshot.val().wins}** and **lost ${snapshot.val().losses}**.
    //                 This gives you a win ratio of **${percent}%**`
    //             );
    //         };
    //     });
    // };

    // if (content === '!thanks') {
    //     channel.send(`${author}, you are very welcome `);
    // };
});

//auto-purge comments from general
client.setInterval ( function(){

    let channel = client.channels.find('name', 'general');
    let channelMessages = channel.messages;

    channel.bulkDelete(100)
    .then(messages => channel.message(`Bulk deleted ${messages.size} messages`))
    .catch(err => console.log(`${err.name}, ${err.message}`))

}, 86400000);

//Detect if user is streaming, announce game they are playing
client.on('presenceUpdate', (oldMember, newMember) => {

    if (oldMember.presence.game !== newMember.presence.game) {

        let channel = client.channels.find('name', 'general');

        if (newMember.presence.game && newMember.presence.game.url) {

            channel.send(`**${newMember.user}** just started streaming. See them live at **${newMember.presence.game.url}**!`);

        } else if (newMember.presence.game) {

            channel.send(`**@${newMember.user.username}** just started playing **${newMember.presence.game.name}** !`);
        }
    }
});

//auto-reconnect
client.on('disconnect', (err, code) => {
    console.log(`Bot disconnected with code ${code}, for reason ${err}`);
    client.login(keys.bot_token);
});

//login
client.login(keys.bot_token);
