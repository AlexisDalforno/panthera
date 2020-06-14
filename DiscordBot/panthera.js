// [ V A R I A B L E S ]
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var request = require('request');
var config = require('./config.json');
var mcip = config.ip;
var mcport = config.port;

var mcapi = 'http://mcapi.us/server/status?ip=' + mcip + '&port=' + mcport;

var introMessage;

// [ L O G G E R   S E T T I N G S ]
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// [ I N I T I A L I Z E   B O T ]
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

// [ G E T   U S E R   O B J E C T ]
function get_user(memberID) {
    var user = bot.users[memberID];
    return user;
}

// [ W E L C O M E   P L A Y E R ]
bot.on('guildMemberAdd', function (member) {
    var joiner = get_user(member.id);
    var name =  joiner.username;
    var random = Math.floor((Math.random() * 5) + 1);

    if(random == 1){
        introMessage = 'Welcome to the clan ' + name + '!';
    } else if(random == 2){
        introMessage = name + ' is here ready to eat some eggplant.';
    } else if(random == 3){
        introMessage = 'WAZZZZZZZZZUUUUUUUUUUPPPPPPPPPPPPPPPP ' + name + '!';
    } else if(random == 4){
        introMessage = 'Touch my holdyflaps ' + name;
    } else if(random == 5){
        introMessage = 'A wild ' + name + ' has appeared.';
    }

    bot.sendMessage({
        to: '609978851778363404',
        message: introMessage
    });
});

// [ G E T   M C   S E R V E R   S T A T U S ]
function update(channelID) {
    request(mcapi, function(err, response, body) {
         body = JSON.parse(body);
         if(body.online) {
            bot.sendMessage({
                to: channelID,
                message: 'Server is online! \n' +
                body.players.now + ' playing currently.'
            });
         } else {
            bot.sendMessage({
                to: channelID,
                message: 'Server is down!'
            });
         }
    });
}

bot.on('message', function(user, userID, channelID, message, event) {
    if(message.match(/status/i))
    {
        update(channelID);
    }
});