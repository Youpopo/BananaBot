const Discord = require('discord.js');

const client = new Discord.Client();

const Prefix = '!';

const fs = require('fs');

const Lq = [];//league group queue
const Lp = [];//league ping
const RLp = [];//rocket league ping
const RLq = [];//rocket league queue


client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name,command)
}


client.once('ready', ()=>{
    console.log('bot is online');

})

client.on('message' , message =>{
    if(!message.content.startsWith(Prefix)|| message.author.bot) return;

    const [CMD_NAME,...args] = message.content.trim().substring(Prefix.length).split(/\s+/); 
    switch (CMD_NAME) {
        case 'league':
            for (let index = 0; index < Lp.length; index++) {
                message.channel.send(`${Lp[index]}`);           
            }
        case 'imun':
            for (let index = 0; index < RLp.length; index++) {
                message.channel.send(`${RLp[index]}`);           
            }
            break;

        case 'pin':
            message.pin();
            break;
            
        case 'join':
            if(!args[0]) return message.channel.send("No group given!")
            switch (args[0]) { //different groups
                case 'help':
                    message.channel.send("Groups supported: league , rl");
                    break;
                case 'league'://league group
                    if(Lp.includes(message.author)) return;
                    message.channel.send("Joined League group");
                    Lp.push(message.author);
                    break;
                case 'rl'://rocket league group
                    if(RLp.includes(message.author)) return;
                    message.channel.send("Joined Rocket league group");
                    RLp.push(message.author);
                    break;
            
                default:
                    message.channel.send("No such group exists");
                    break;
            }
            break;

        case 'leave':
            if(!args[0]) return message.channel.send("No group given!")
            switch (args[0]) { //different queues
                case 'help':
                    message.channel.send("Groups supported: league");
                    break;
                case 'league'://league queue
                    
                    var index = Lp.indexOf(message.author);
                    if (index > -1) {
                        Lp.splice(index, 1);
                    }
                    break;
                case 'rl'://league queue
                    
                    var index = RLp.indexOf(message.author);
                    if (index > -1) {
                        RLp.splice(index, 1);
                    }
                    break;
            
                default:
                    message.channel.send("No such group exists");
                    break;
            }
            break;
        
        case 'q':
            
            if(!args[0]) return message.channel.send("No queue type given!")
            switch (args[0]) { //different queues
                case 'help':
                    message.channel.send("Queues supported: league , rl\n"+
                                        "!q [name] ping - ping current queue");
                    break;
                case 'league'://league queue
                    if(args[1]&&args[1]==='ping'){
                        message.channel.send(message.author.tag+" has pinged the queue")
                        for (let index = 0; index < Lq.length; index++) {
                            message.channel.send(`${Lq[index]}`);
                            
                        }
                        return;
                    }


                    if(Lq.includes(message.author)) return;
                    Lq.push(message.author);
                    message.channel.send("Current League group size is "+Lq.length);
                    if (Lq.length === 5) {//final group found
                        message.channel.send("5 man group found!");
                        for (let index = 0; index < Lq.length; index++) {
                            message.channel.send(`${Lq[index]}`);
                            
                        }
                        Lq.length = 0; //queue reset
                    }
                    break;


                case 'rl'://league queue
                    if(args[1]&&args[1]==='ping'){
                        message.channel.send(message.author.tag+" has pinged the queue")
                        for (let index = 0; index < RLq.length; index++) {
                            message.channel.send(`${RLq[index]}`);
                            
                        }
                        return;
                    }


                    if(RLq.includes(message.author)) return;
                    RLq.push(message.author);
                    message.channel.send("Current Rocket league group size is "+RLq.length);
                    if (RLq.length === 3) {//final group found
                        message.channel.send("3 man group found!");
                        for (let index = 0; index < RLq.length; index++) {
                            message.channel.send(`${RLq[index]}`);
                            
                        }
                        RLq.length = 0; //queue reset
                    }
                    break;
            
                default:
                    message.channel.send("No such queue exists");
                    break;
            }
            
            break;
        case '-q':

            if(!args[0]) return message.channel.send("No queue type given!")
            switch (args[0]) { //different queues
                case 'help':
                    message.channel.send("Queues supported: league , rl\n"+
                                        "!-q all - quit from all queues");
                    break;
                case 'league'://league queue
                    var index = Lq.indexOf(message.author);
                    if (index > -1) {
                        Lq.splice(index, 1);
                    }
                    break;
                case 'rl'://league queue
                    var index = RLq.indexOf(message.author);
                    if (index > -1) {
                        RLq.splice(index, 1);
                    }
                    break;

                case 'all'://all queues
                    var index = RLq.indexOf(message.author);
                    if (index > -1) {
                        RLq.splice(index, 1);
                    }
                    index = Lq.indexOf(message.author);
                    if (index > -1) {
                        Lq.splice(index, 1);
                    }
                    break
            
                default:
                    message.channel.send("No such queue exists");
                    break;
            }
            break;

        case 'help':
            message.channel.send("Banana bot commands: \n"+
                                "!pin - pin current message. \n"+
                                "!q [name]- adding yourself to a group queue, parameter should queue name. see !q help for queue names\n"+
                                "!-q [name] - remove yourself from queue, parameter should queue name. see !q help for queue names\n"+
                                "!join [name] - join mass ping group such as league\n"+
                                "!leave [name] - leave mass ping group'n"+
                                "!league - ping league group\n"+
                                "!imun - ping Rocket league group");
            break;
    
        default:
            message.channel.send("Command "+CMD_NAME +" is not supported")
            break;
    }
    
})

//add token here
client.login('[meh]');