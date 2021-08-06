
let Discord   = require("discord.js");
const fs      = require('fs');
const cron    = require('node-cron');

const client  = new Discord.Client();

client.curency = require("./curency.json");
client.homework = require("./homework.json");

const Embeds  = require('./embeds');
const config  = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

var msgId;


  var cmdmap = {
    help: cmd_help,
    h: cmd_help,
    say: cmd_say,
    test: cmd_test,
    set: cmd_set,
    add: cmd_add,
    get: cmd_get,
    time: cmd_time,
    homework: cmd_homework, 
    hw: cmd_homework,
    clear: cmd_clear,
    ping: cmd_ping,
    ignore: cmd_ignore

  }

function cmd_help (msg, args, author) {
  msg.channel.send({ embed: {
    color: /*0x2ECC71*/0x34495E,
    
    title: "Hilfe ist unterwegs!",
    description: "",
    fields: [{
      name: "!ping",
      value: "pingt den Bot und gibt die Latenz zurück",
      inline: false
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: false,
      },
      {
        name: "clear",
        value: "```!clear (anzahl der Nachrichten die gelöscht werden sollen)``` \nLöscht die anzahl der Nachrichten",
        inline: false
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "homework / hw",
        value: "\u200b",
        inline: false,
      },
      {
        name: "add",
        value: "```!hw add```\nHausaufgabe hinzufügen",
        inline: true,
      },
      {
        name: "list",
        value: "```!hw list```\nListet alle Hausaufgaben auf",
        inline: true,
      },
      {
        name: "delete (Administrator only)",
        value: "```!hw delete [ all | (nummer der Hausaufgabe)]```\nLöscht alle oder die jeweilige Hausaufgabe",
        inline: true,
      },
      {
        name: "in-time",
        value: "Startet manuell die Überprüfung ob Hausaufgaben abgelaufen sind\nAutomatisch alle 5h",
        inline: true,
      },
      {
        name: "\u200b",
        value: "\u200b",
        inline: false,
      },
      {
        name: "ignore (Administrator only)",
        value: "\u200b",
        inline: false,
      },
      {
        name: "add",
        value: "```!hw add (channel)```\nFügt einen Kannal hinzu der von dem Bot ignoriert werden soll",
        inline: true,
      },
      {
        name: "list",
        value: "```!hw list```\nListet alle Kanäle auf die vom Bot ignoriert werden",
        inline: true,
      },
      {
        name: "remove",
        value: "```!hw remove (channel)```\nLöscht den Kanal von der Liste der Kanäle die vom Bot ignoriert werden",
        inline: true,
      }
    ],
    timestamp: new Date(),
    footer: {
      text: "@AaronBot"
    }
  }
  });
}  



  function cmd_say (msg, args){
    msg.channel.send(args.join(' '))
  }

  function cmd_test (msg, args) {
    console.log("TEst!");

    msg.reply("Nenne bitte den Inhalt der Nachricht: ")
    const filter = (newMessage) => {
      return newMessage.author.id === msg.author.id
    }
    const collector = new Discord.MessageCollector(msg.channel, filter, {
      max: 1,
      time: 1000 * 30
    })

    collector.on('end', async (collected) => {
      const collectedMessage = collected.first()

      if (!collectedMessage){
        msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
        return
      }

      msg.reply("Nenne bitte jetzt den Channel in der die Nachricht gesendet werden soll: ")
      const filter = (newMessage) => {
        return newMessage.author.id === msg.author.id
      }
      const collector = new Discord.MessageCollector(msg.channel, filter, {
        max: 1,
        time: 1000 * 30
      })
  
      collector.on('end', async (collected) => {
        const collectedChannel = collected.first()
  
        if (!collectedChannel){
          msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
          return
        }
  
        msg.reply("Nenne bitte jetzt den Titelder Nachricht die gesendet werden soll: ")
      const filter = (newMessage) => {
        return newMessage.author.id === msg.author.id
      }
      const collector = new Discord.MessageCollector(msg.channel, filter, {
        max: 1,
        time: 1000 * 30
      })
  
      collector.on('end', async (collected) => {
        const collectedTitle = collected.first()
  
        if (!collectedTitle){
          msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
          return
        }
  
        Embeds.error(client, args[0], collectedChannel, collectedMessage, collectedTitle)
        
      });
        
      });

    })


  }

  function cmd_set (msg, args, author) {  
    client.curency [author.id] = {
      konto: parseInt(args[0])
      }
      fs.writeFile("./curency.json", JSON.stringify(client.curency, null, 4), err => {
        if (err) throw err;
        msg.channel.send("Writen!");
      });
  }

  function cmd_get (msg, args, author) {
    var konto = parseInt(client.curency [author.id].konto)
    msg.channel.send(`You have ${konto}€ on your wallet!`);
  }

  function cmd_add (msg, args, author) {
    var konto = parseInt(client.curency [author.id].konto);
    var new_konto = konto + parseInt(args[0]);
    msg.channel.send(new_konto);

    client.curency [author.id] = {
      konto: new_konto
      }
      fs.writeFile("./curency.json", JSON.stringify(client.curency, null, 4), err => {
        if (err) throw err;
        msg.channel.send("Writen!");
      });

  }


  function cmd_time (msg, args, author) {
    var now       = new Date();
    var time1730  = new Date(2021, 6, 29, 17, 50, 0, 0);
    
    

    msg.channel.send(now.toString());
    msg.channel.send(time1730.toString());
    
  }


function cmd_homework (msg, args, author) {
  if (args[0] === "add") {

    msg.reply("Zu wann soll die Hausaufgabe erledigt sein?\nDie Zeit muss in folgendem Format gesendet werden:\n<Jahr> <Monat> <Tag> <Stunde> <Minute>")

    

    //
    //  Fragt das Abgabedatum ab
    //
    const filter = (newMessage) => {
      return newMessage.author.id === msg.author.id
    }
    const collector = new Discord.MessageCollector(msg.channel, filter, {
      max: 1,
      time: 1000 * 120
    })

    collector.on('end', async (collected) => {
      const collectedTime = collected.first()

      if (!collectedTime){
        msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
        return
      }

      msg.reply(collectedTime);

          var time    = collectedTime.toString().split(' ').slice(0);
          var currentTime = new Date();
          
          // Kontroliert ob das gennante datum schon war
          if (parseInt(time[0]) < currentTime.getFullYear()){
              msg.reply("Error ");
              return;
          }
          else if (parseInt(time[0]) == parseInt(currentTime.getFullYear())){
              if (parseInt(time[1]) <= 12 && parseInt(time[1]) >= 1) {
                if(parseInt(time[1]) >= parseInt(currentTime.getMonth())) {
                  if(parseInt(time[2]) <= 31 && parseInt(time[2]) >= 1) {
                    if (parseInt(time[3]) <= 24 && parseInt(time[3]) >= 0) {
                      if (parseInt(time[4]) <= 59 && parseInt(time[4]) >= 0) {
                        
                      }
                    }
                    else {
                      msg.reply("Error! Ungültige Stunde!");
                    }
                  }
                  else{
                    msg.reply("Kein Gültiger Tag");
                    return;
                  }

                }
                else{
                  msg.reply("Error! Kein Gültiger Monat!")
                  return;
                }
              }
              else {
                msg.reply("Error! Kein gültiger Monat!");
                return;
              }
          }
          else {
            msg.reply("Error!");
            return;
          }
          
          
          //
          //  Fragt das Fach ab
          //
          msg.reply("Welches Fach?");
          msg.channel.send("< Mathe | Deutsch | Englisch | Physik | Chenmie | Geschichte | Musik | LBAuB | Religion>")
        
          const filter = (newMessage) => {
            return newMessage.author.id === msg.author.id
          }
          const collector = new Discord.MessageCollector(msg.channel, filter, {
            max: 1,
            time: 1000 * 120
          })
      
          collector.on('end', async (collected) => {
            const collectedFach = collected.first()
      
            if (!collectedFach){
              msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
              return
            }
      
            fach = collectedFach.toString().toLowerCase();
          
            if (fach == "mathe" || fach == "deutsch" || fach == "englisch" || fach == "physik" || fach == "chemie" || fach == "geschichte" || fach == "musik" || fach == "lbaub" || fach == "religion") {

            }
            else {
              msg.reply("Error");
              return;
            }
            
           //
          //  Fragt die Aufgabe ab
          //
          msg.reply("Wie lautet die Aufgabe?");
        
          const filter = (newMessage) => {
            return newMessage.author.id === msg.author.id
          }
          const collector = new Discord.MessageCollector(msg.channel, filter, {
            max: 1,
            time: 1000 * 120
          })
      
          collector.on('end', async (collected) => {
            const collectedAufgabe = collected.first()
      
            if (!collectedAufgabe){
              msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
              return
            }
      
            Aufgabe = collectedAufgabe.toString();
            
            /*
            var data = fs.readFileSync('./test.json');
            var json = JSON.parse(data);
            var test = json.Test;
            test.push({"Name": "Aaron"});
            fs.writeFileSync('./test.json', JSON.stringify(json, null, 4));
            */
           var date =  new Date(time[0], time[1], time[2], time[3], time[4]),
               data  = fs.readFileSync('./homework.json'),
               json  = JSON.parse(data),
               hw    = json.HW;
            hw.push({
                "Fach": fach,
                "Abgabe": date,
                "Aufgabe": Aufgabe,
                "Ersteller": msg.author.username
            });
            fs.writeFileSync('./homework.json', JSON.stringify(json, null, 4));
            msg.channel.send("Write!");
            convertTZ("2012/04/20 10:10:30 +0000", "Asia/Jakarta")
            /*
            var hausaufgaben = client.homework ["Config"].Hausaufgaben;
            
            client.homework [`Hw ${hausaufgaben + 1}`] = {
              Fach: fach,
              Abgabe: new Date(time[0], (time[1] - 1), time[2], time[3], time[4]),
              Aufgabe:  Aufgabe,
              Ersteller: msg.author.username
            }
            fs.writeFile("./homework.json", JSON.stringify(client.homework, null, 4), err => {
              if (err) throw err;
              msg.channel.send("Writen!");
            });

              client.homework ["Config"] = {
                Hausaufgaben: (hausaufgaben + 1)
              }
              fs.writeFile("./homework.json", JSON.stringify(client.homework, null, 4), err => {
                if (err) throw err;
                msg.channel.send("Writen!");
              });

              msg.channel.send(hausaufgaben);
              });
              */
          });

          });

        }
    )};
  
  if (args[0] === "list") {
    
    var data  = fs.readFileSync('./homework.json'),
    json	= JSON.parse(data),
    hw    = json.HW;

    hw.sort();
    
    for (let i = 0; i < hw.length; i++) {
      var item =  hw[i];

      //Embeds.hwList(client, color, msg.channel, item.Aufgabe, `Aufgabe: ${i}`, "", "Fach: ", item.Fach, "Hinzugefügt von: ", item.Ersteller, "Abgabe: ", new Date(item.Abgabe));

      const COLORS = {
        deutsch: 0xE74C3C,
        englisch: 0xE67E22,
        mathe: 0x3498DB,
        physik: 0x32CD32,
        chemie: 0x008000,
        geschichte: 0x825A2C,
        musik: 0xAA00FF,
        lbaub: 0x34495E,
        religion: 0xF1C40F,
        green: 0x2ECC71,
        dark_gray: 0x34495E
    }
    var color;

     //  Mathe | Deutsch | Englisch | Physik | Chenmie | Geschichte | Musik | LBAuB | reli

      switch (item.Fach) {
        case "mathe":
          color = COLORS.mathe;
          break;
        case "deutsch":
          color = COLORS.deutsch;
          break;
        case "englisch":
          color = COLORS.englisch;
          break;
        case "physik":
          color = COLORS.physik;
          break;
        case "chemie":
          color = COLORS.chemie;
          break;
        case "geschichte":
          color = COLORS.geschichte;
          break;
        case "musik":
          color = COLORS.musik;
          break;
        case "lbaub":
          color = COLORS.lbaub;
          break;
        case "religion":
          color = COLORS.religion
        
      }




    var date = new Date(item.Abgabe),
    date     = new Date(date.getFullYear(), (date.getMonth()), date.getDate(), date.getHours(), date.getMinutes()),
    oneHour = 1000 * 60 * 60;
    
    var daysLeft = 0,
    now     = new Date(),
    dif     = date.getTime() - now.getTime()  - /*Ein monat */ 2628002880 - /* Ein Tag */ 86400000;

    hoursLeft = dif / oneHour;

    hoursLeft = Math.round(hoursLeft);

    for (let i = 0; hoursLeft >= 24; daysLeft++) {
      hoursLeft -= 24;
    }


    msg.channel.send({ embed: {
        color: color,
        
        title: ``,
        description: "",
        fields: [{
            name: "Aufgabe:",
            value: item.Aufgabe,
          },
          {
            name: "Fach:",
            value: item.Fach,
          },
          {
            name: "Abgabe:",
            value: `Am ${GetDayOfWeek(date.getDay())} den ${date.getDate()}.${date.getMonth()} ${date.getFullYear()} um ${date.getHours()}:${date.getMinutes()}.\nIn ${daysLeft} Tag/en und ${hoursLeft} Stunde/n.`,

          }
        ],
        timestamp: new Date(),
        footer: {
          text: "@AaronBot"
        }
      }
    });
    }

    // Embeds.hwList(client, color, msg.channel, `\`Fach:\` \n  ${item.Fach} \n` + '`Aufgabe:`' + `\n ${item.Aufgabe} \n \`Abgabe:\` ${item.Abgabe} \n \n \`Hinzugefügt von:\` ${item.Ersteller}`, `Hausaufgabe: ${i}`, "");
  }


  if (args[0] === "in-time") {
    checkInTime();
     }

     var data  = fs.readFileSync('./homework.json'),
     json	= JSON.parse(data),
     hw    = json.HW;

     if (args[0] === "delete") {
      if (msg.author.id == config.owner) {
        msg.channel.send({embed: {
          color: 0x2ECC71,

          description: `Autorisiert`,
      }
    });


         

          if (args[1] === "all") {
            console.log(hw.length);
            
            msg.channel.send( {embed: {
              color: 0xF1C40F,
    
              description: `Bist du dir sicher das du *alle* löchen willst? \n Wenn ja dann anrworte mit "ja"`,
              }});
        
            const filter = (newMessage) => {
              return newMessage.author.id === msg.author.id
            }
            const collector = new Discord.MessageCollector(msg.channel, filter, {
              max: 1,
              time: 1000 * 30
            });
        
            collector.on('end', async (collected) => {
              const isShure = collected.first()
        
              if (!isShure){
                msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
                return
              }
            
              shure = isShure.toString().toLowerCase();
              
              if (shure === "ja"){
                
                for (let i = 0; i < hw.length; i++) {
                  delete hw[i];
                }
                var filter = hw.filter(function (el) {
                  return el != null;
                });
                json.HW = filter;
                
                fs.writeFileSync('./homework.json', JSON.stringify(json, null, 4));

                msg.channel.send({embed: {
                    color: 0x2ECC71,
                    description: `Alle Hausaufgaben wurden erfolgreich gelöscht!`
                }});
              }
              })
          }

          
          
          else {

            var num = parseInt(args[1]);
            if (num <= hw.length && num >= 0) {
            msg.channel.send("Ok");

            msg.channel.send( {embed: {
              color: 0xF1C40F,
    
              description: `Bist du dir sicher das du Hausaufgabe ${num} löchen willst? \n Wenn ja dann anrworte mit "ja"`,
              }});
        
            const filter = (newMessage) => {
              return newMessage.author.id === msg.author.id
            }
            const collector = new Discord.MessageCollector(msg.channel, filter, {
              max: 1,
              time: 1000 * 30
            });
        
            collector.on('end', async (collected) => {
              const isShure = collected.first()
        
              if (!isShure){
                msg.reply("Du hast nicht inerhalb der Zeit geantwortet!")
                return
              }
        
              shure = isShure.toString().toLowerCase();
              
              if (shure === "ja") {
                delete hw[num]; 

                var filter = hw.filter(function (el) {
                  return el != null;
                });
                json.HW = filter;

                fs.writeFileSync('./homework.json', JSON.stringify(json, null, 4));
                msg.channel.send( {embed: {
                  color: 0x2ECC71,
        
                  description: `Aufgabe \`${num}\` wurde erfolgreich gelöscht.`,
                  }
                });
              } 
              else {
                msg.channel.send( {embed: {
                  color: 0xE74C3C,
        
                  description: "Keine gültige Eingabe!",
                  }
                });
                return;
              }

            });

            }
            else {
             msg.channel.send( {embed: {
            color: 0xE74C3C,
  
            description: "Error!",
            }});
        }
      }
    }
      else {
        msg.channel.send({embed: {
          color: 0xE74C3C,
          description: ':no_entry_sign:  Du hast keine Befugnis diesen Befehl zu nutzen!  :no_entry_sign:'
        }})
        return;
      }
    }
  
}


function checkInTime () {
  var data  = fs.readFileSync('./homework.json'),
    json	= JSON.parse(data),
    hw    = json.HW,
    channel = client.channels.cache.get('859735266948677672');
    channel.bulkDelete(100, true);

  channel.send("@everyone");
  channel.send({embed: {
    title: "*Folgende Hausaufgaben sind in den nächten Tagen fällig:*",
    description: "",
    color: 0x8E44AD
  }});

  var leftHomework = 0;

  for (let i = 0; i < hw.length; i++) {
    var item =  hw[i];
    var aTime   = new Date(item.Abgabe),
    now     = new Date(),
    dif     = aTime.getTime() - now.getTime() - /* Ein monat */ 2628002880 - /* Ein Tag */ 86400000,
    oneHour = 1000 * 60 * 60,
    hoursLeft;
    
            if (dif <= 0) {
              var data  = fs.readFileSync('./homework.json'),
              json	= JSON.parse(data),
              hw    = json.HW;
    
              delete hw[i];
    
              var filter = hw.filter(function (el) {
                return el != null;
              });
              json.HW = filter;
    
              console.log(`Delete Hw ${i}`);
    
              fs.writeFileSync('./homework.json', JSON.stringify(json, null, 2));

              break;
              
            }

        var daysLeft = 0;

        hoursLeft = dif / oneHour;

        hoursLeft = Math.round(hoursLeft);

        for (let i = 0; hoursLeft >= 24; daysLeft++) {
          hoursLeft -= 24;
        }

        //channel.send(hoursLeft);
        //channel.send(daysLeft);
      //channel.send(`${daysLeft} : Days left \n ${hoursLeft} : Hours left`);
        
        
        if ( daysLeft < 2) {
          leftHomework++;
          lastChance(channel, i, hoursLeft, daysLeft, aTime, item);
        }
        else if (daysLeft == 0 && hoursLeft < 24)
        {
          leftHomework++;
          lastChance(channel, i, hoursLeft, daysLeft, aTime, item);
          
        }

  }

    if (leftHomework == 0)
    {
      channel.send({embed: {
        title: "",
        description: "Es sind in den nächsten 2 Tagen keine Hausaufgeben zu erledigen!",
        color: 0x2ECC71
      }})
    }
}

function lastChance (channel, num, hoursLeft, daysLeft, aTime, item) {  
  var date = new Date(aTime.getFullYear(), (aTime.getMonth()), aTime.getDate(), aTime.getHours(), aTime.getMinutes());
  const COLORS = {
    deutsch: 0xE74C3C,
    englisch: 0xE67E22,
    mathe: 0x3498DB,
    physik: 0x32CD32,
    chemie: 0x008000,
    geschichte: 0x825A2C,
    musik: 0xAA00FF,
    lbaub: 0x34495E,
    religion: 0xF1C40F,
    green: 0x2ECC71,
    dark_gray: 0x34495E
}
var color;


  switch (item.Fach) {
    case "mathe":
      color = COLORS.mathe;
      break;
    case "deutsch":
      color = COLORS.deutsch;
      break;
    case "englisch":
      color = COLORS.englisch;
      break;
    case "physik":
      color = COLORS.physik;
      break;
    case "chemie":
      color = COLORS.chemie;
      break;
    case "geschichte":
      color = COLORS.geschichte;
      break;
    case "musik":
      color = COLORS.musik;
      break;
    case "lbaub":
      color = COLORS.lbaub;
      break;
    case "religion":
      color = COLORS.religion
    
  }



  channel.send({ embed: {
    color: color,
    
    title: "",
    description: "",
    fields: [{
        name: "Aufgabe:",
        value: item.Aufgabe,
      },
      {
        name: "Fach: ",
        value: item.Fach,
      },
      {
        name: "Abgabe:",
        value: `Am ${GetDayOfWeek(date.getDay())} den ${date.getDate()}.${date.getMonth()} ${date.getFullYear()} um ${date.getHours()}:${date.getMinutes()}. \n  Es sind noch ${daysLeft} Tag/e und ${hoursLeft} Stunde/n bis zur Abgabe!`,
      }
    ],
    timestamp: new Date(),
    footer: {
      text: "@AaronBot",

    }
  }
  });
}

function GetDayOfWeek(x)
{
  switch(x)
  {
    case 1:
      return "Montag";
    
    case 2:
      return "Dienstag";

    case 3: 
      return "Mittwoch";

    case 4:
      return "Donnerstag";

    case 5:
      return "Freitag";

    case 6:
      return "Samstag";

    case 7, 0:
      return "Sonntag";
  }
}


function cmd_clear (msg, args, author) {
  var amount = parseInt(args[0]);

  amount + 1;
  if (amount > 100) {
    amount = 100;
  }

    msg.channel.bulkDelete(amount, true).then((_messages) => {
      msg.channel.send(`Bot cleared \`${_messages.size}\` messages :broom:`).then((sent) => {
        setTimeout(function () {
          sent.delete();
        }, 2500);
      });
    });
}

function cmd_ping (msg, args, author) {
  msg.channel.send(`${Date.now() - msg.createdTimestamp}ms`)
}



function cmd_ignore (msg, args, author) {
  	if (args[0] === "channel") {
      if (args[1] === "add") {

        var channel = args[2].slice(2, -1);

        var data  = fs.readFileSync('./ignore.json'),
          json	= JSON.parse(data),
          channels = json.channels;

          msg.channel.send(channels);

        if (msg.guild.channels.cache.find(c => c.id === channel)) {
          if (channels.includes(channel) ) {
            msg.channel.send({embed: {
              color: 0xE74C3C,
              description: "Dieser Kanal wird bereits ignoriert"
            }});
            return;
          }
          else {
            channels.push(channel);
            
            fs.writeFileSync('./ignore.json', JSON.stringify(json, null, 2));

            msg.channel.send({embed: {
              color: 0x2ECC71,
              description: `Der Kanal wurde erfolgreich hinzugefügt. \n <#${channel}> wird ab sofort vom Bot ignoriert.`
            }});
            return;
          }
        }
      }
      
      if (args[1] === "remove") {
        var data      = fs.readFileSync('./ignore.json'),
            json	    = JSON.parse(data),
            channels  = json.channels,
            channel   = args [2].slice(2, -1);


        if (channels.includes(channel)) {
          
        var filter = channels.filter(function (el) {
          return el != channel;
        });
        json.channels = filter;
        fs.writeFileSync('./ignore.json', JSON.stringify(json, null, 2));
        msg.channel.send({embed: {
          color: 0x2ECC71,
          description: `Erfolgreich gelöscht. \n Der Bot verarbeitet jetzt wieder Befehle aus <#${channel}>.`
        }});
          return;
        }
        else {
          msg.channel.send({embed: {
            color: 0xE74C3C,
            description: "Der Kanal wird zurzeit nicht vom Bot ignoriert."
          }});
          return;
        }

      }

      if (args[1] === "list") {
        var data      = fs.readFileSync('./ignore.json'),
            json	    = JSON.parse(data),
            channels  = json.channels,
            channel_list = [];

        for (let i = 0; channels.length > i; i++) {
          channel_list.push(`<#${channels[i]}>`);
        }

        if (channel_list.length > 0) {
          msg.channel.send({embed: {
            color: 0xE67E22,
            title: "Folgende Kanäle werden vom Bot ignoriert:",
            description: `${channel_list}.`
          }})
        }
        else {
          msg.channel.send("Es werden zurzeit keine Kanäle ignoriert.");
          return;
        }

        return;
      }

      msg.channel.send({embed: {
        color: 0xE74C3C,
        description: `Ungültiger befehl: >${args[1]}< `
      }});

    }
    else {
      msg.channel.send({embed: {
        color: 0xE74C3C,
        description: ":x: Error"
      }});
      return;
    }
}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!  ${Date()}`)

  var admin_channel = client.channels.cache.get('859782495361171466');
  admin_channel.send("Bot started succesfull! :white_check_mark:")

  send_rules();
  send_botUpdates();



/*  
  client.user.setActivity("Debug mode", {
    type: "STREAMING"
  });
  */
  client.user.setActivity("auf !help", {type: "LISTENING"});

//
//  Checks if  Homework on next day
//

/// Every 4 hours
cron.schedule('00 */5 * * *', function() {
  checkInTime();
});

  //
  //Deletes all 'Null' values
var data  = fs.readFileSync('./homework.json'),
    json	= JSON.parse(data),
    hw    = json.HW;
    

    var filter = hw.filter(function (el) {
      return el != null;
    });
    json.HW = filter;
    fs.writeFileSync('./homework.json', JSON.stringify(json, null, 1));

})


client.on('guildMemberAdd', member => {
    var role = member.guild.roles.cache.find(role => role.name == "Klasse")
    member.roles.add(role);
});


client.on('message', msg => {
    var cont    = msg.content,
        author  = msg.member,
        chan    = msg.channel,
        guild   = msg.guild


    var data  = fs.readFileSync('./ignore.json'),
    json	    = JSON.parse(data),
    channels  = json.channels;
    


    if (author.id != client.user.id && cont.startsWith(config.prefix) && !channels.includes(msg.channel.id) ) {
      
      var invoke  = cont.split(' ')[0].substr(config.prefix.length),
          args    = cont.split(' ').slice(1)

      console.log(invoke, args);

      if (invoke in cmdmap) {
        cmdmap[invoke](msg, args, author)
      }      

    }
     if (msg.mentions.has(client.user)) {
      if (msg.content.includes("@here") || msg.content.includes("@everyone")) return false;
       msg.reply(`Der Bot prefix ist: \`${config.prefix}\`. `);
   }
});

client.on('messageReactionRemove', (reaction, user) => {
  var channel = client.channels.cache.get('859735266948677672');
   if(user.id !== client.user.id) {
        if (reaction.message.id === msgId) {
          if (reaction.emoji.name === "🇭") {
            let role = reaction.message.guild.roles.cache.get("859848403563577345");          
            let member = reaction.message.guild.members.cache.get(user.id);
            
            member.roles.remove(role);
            return;
          }
        }
    }
});


client.on('messageReactionAdd', (reaction, user) => {
 var channel = client.channels.cache.get('859735266948677672');
   if(user.id !== client.user.id) {
        if (reaction.message.id === msgId) {
          if (reaction.emoji.name === "🇭") {
            let role = reaction.message.guild.roles.cache.get("859848403563577345");          
            let member = reaction.message.guild.members.cache.get(user.id);
            
            member.roles.add(role);
            return;
          }
        }
    }
});

function send_rules() {
channel = client.channels.cache.get(config.regeln_channel);
channel.bulkDelete(100, true);

  
  channel.send({embed: {
    color: 0x550,
    title: "Regeln:",
    description: "Hier sind die Regeln:"
  }})

  channel.send({embed: {
    color: 0x3498DB,
    title: "Werde ein Helfer!",
    description: "<@&859848403563577345>",
    fields: [
      {
        name: "Was machen Helfer?",
        value: ` \`\`\`- Helfer können Hausaufgaben hinzufügen \n- Sie können bei Hausafgaben helfen  \`\`\``
      },
      {
        name: "Wie werde ich Helfer?",
        value: "Reagiere einfach auf dieser nachricht mit dem 🇭 emoji. \n Klicke dazu einfach unten auf das 🇭 unter dieser Nachricht."
      }
    ]
  }})
  .then(function (message) {
          message.react("🇭");
          msgId = message.id;
    		});


}

function send_botUpdates() {
  channel = client.channels.cache.get(config.bot_channel);
}


client.on('voiceStateUpdate', (oldMember, newMember) => {
  var data  = fs.readFileSync('./channels.json'),
  json	= JSON.parse(data),
  channels    = json.channels;
  
  var filter = channels.filter(function (el) {
    return el != null;
  });
  channels = filter;
      
  if(channels.length >= 0) for(let i = 0; i < channels.length; i++) {
    // Finding...
    var ch = client.channels.cache.get(channels[i]);
    if(ch.members.size <= 0){
      ch.delete()
      // Channel has been deleted!
      delete channels[i];
      var filter = channels.filter(function (el) {
        return el != null;
      });
      channels = filter;
      json.channels = channels;
      fs.writeFileSync('./channels.json', JSON.stringify(json, null, 2));
    
    }
  }


  const mainCatagory = '858436736555810888';
  const mainChannel = '860847697736892436';
 

     if(newMember.channelID == mainChannel){
        // Create channel...
        var server = client.guilds.cache.get('858436736555810886');
        var user = client.users.cache.find(user => user.id === newMember.member.id)
         server.channels.create(`${user.username}'s channel`, {type: 'voice', parent: mainCatagory})
             .then(async channel => {
                 channels.push(channel.id);
                 json.channels = channels;
                 fs.writeFileSync('./channels.json', JSON.stringify(json, null, 2));

                 newMember.member.voice.setChannel(channel);
                 
                });
                
              }             
                            
                
              })




client.login(config.token);
