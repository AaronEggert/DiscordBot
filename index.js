
let Discord   = require("discord.js");
const fs      = require('fs');
const cron    = require('node-cron');

const client  = new Discord.Client();

client.curency = require("./curency.json");
client.homework = require("./homework.json");

const Embeds  = require('./embeds');
const config  = JSON.parse(fs.readFileSync('./config.json', 'utf8'));


  var cmdmap = {
    help: cmd_help,
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
    color: 0x2ECC71,
    
    title: "Hilfe ist unterwegs!",
    description: "Hier ist eine Liste aller Kategorien. \n Für eine detalirerte Befehlsliste gebe einfach nach dem \'Help\' Befehl noch die Kategorie an. \n !help <Kategorie> \n *Beispiel: *  !help homework",
    fields: [{
        name: "homework (Abkürzung: 'hw')",
        value: "Mit dem Befehl kannst du ganz einfach Hausaufgaben hinzufügen und Abrufen.",
      },
      {
        name: "say",
        value: "Sendet eine Nachricht in einen Bestimmten Channel."
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

    msg.reply("Zu wann soll die Hausaufgabe erledigt sein?")
    msg.channel.send("Die Zeit muss in folgendem Format gesendet werden:")
    msg.channel.send("<Jahr> <Monat> <Tag> <Stunde> <Minute>")
    

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
          msg.channel.send("< Mathe | Deutsch | Englisch>")
        
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
          
            if (fach == "mathe" || fach == "deutsch" || fach == "englisch") {

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

            
            var data  = fs.readFileSync('./homework.json'),
                json  = JSON.parse(data),
                hw    = json.HW;
            hw.push({
                "Fach": fach,
                "Abgabe": new Date(time[0], (time[1] - 1), time[2], time[3], time[4], ),
                "Aufgabe": Aufgabe,
                "Ersteller": msg.author.username
            });
            fs.writeFileSync('./homework.json', JSON.stringify(json, null, 4));
            msg.channel.send("Write!");

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
        red: 0xE74C3C,
        green: 0x2ECC71,
        orange: 0xE67E22,
        blue: 0x3498DB,
        dark_gray: 0x34495E
    }
    var color;
      switch (item.Fach) {
        case "mathe":
          color = COLORS.blue;
          break;
        case "deutsch":
          color = COLORS.red;
          break;
        case "englisch":
          color = COLORS.orange;
          break;
        
      }
    
    
      msg.channel.send({ embed: {
        color: color,
        
        title: `Aufgabe ${i}`,
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
            value: new Date(item.Abgabe),
          }
        ],
        timestamp: new Date(item.Abgabe),
        footer: {
          text: ""
        }
      }
    });
  

    // Embeds.hwList(client, color, msg.channel, `\`Fach:\` \n  ${item.Fach} \n` + '`Aufgabe:`' + `\n ${item.Aufgabe} \n \`Abgabe:\` ${item.Abgabe} \n \n \`Hinzugefügt von:\` ${item.Ersteller}`, `Hausaufgabe: ${i}`, "");
  }
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
          }});
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
    hw    = json.HW;
    
  var channel = client.channels.cache.get('859735266948677672');
    channel.bulkDelete(100, true);
  for (let i = 0; i < hw.length; i++) {
    var item =  hw[i];
    var aTime   = new Date(item.Abgabe),
    now     = new Date(),
    dif     = aTime.getTime() - now.getTime(),
    oneDay  = 1000 * 60 * 60 * 24,
    oneHour = 1000 * 60 * 60,
    hoursLeft;
    
        var daysLeft = 0;

        hoursLeft = dif / oneHour;

        hoursLeft = Math.round(hoursLeft);

        for (let i = 0; hoursLeft >= 24; daysLeft++) {
          hoursLeft -= 24;
        }

      // channel.send(`${daysLeft} : Days left \n ${hoursLeft} : Hours left`);
        
        if (daysLeft == 0 && hoursLeft <= 0) {
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
          
        }
        if (daysLeft == 0 ) {
          lastChance(channel, i);
        }

  }

}

function lastChance (channel, num) {  
  var data  = fs.readFileSync('./homework.json'),
    json	= JSON.parse(data),
    hw    = json.HW;
    
  var item =  hw[num];
 
  const COLORS = {
    red: 0xE74C3C,
    green: 0x2ECC71,
    orange: 0xE67E22,
    blue: 0x3498DB,
    dark_gray: 0x34495E
}
var color;
  switch (item.Fach) {
    case "mathe":
      color = COLORS.blue;
      break;
    case "deutsch":
      color = COLORS.red;
      break;
    case "englisch":
      color = COLORS.orange;
      break;
    
  }

  channel.bulkDelete(100, true);
  channel.send({ embed: {
    color: color,
    
    title: "Achtung!!!",
    description: "*Folgende Hausaufgabe Endet in weniger als 1 Tag.*",
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
        value: new Date(item.Abgabe),
      }
    ],
    timestamp: new Date(item.Abgabe),
    footer: {
      text: "Automatische Warnnachricht"
    }
  }
  });
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
  	if (args[0].toLowerCase() === "channel") {
      if (args[1].toLowerCase() === "add") {
        channel = parseInt(args[2]);

        if (msg.guild.channels.exists("id", channel)) {
          msg.reply(":white_check_mark:");
        }
        else {

          msg.reply(":x:");
        }



      }
    }
    else {
      msg.channel.send({embed: {
        color: 0xE74C3C,
        value: ":x: Error"
      }});
      return;
    }
}



client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!  ${Date()}`)

  var admin_channel = client.channels.cache.get('859782495361171466');
  admin_channel.send("Bot started succesfull! :white_check_mark:")

/*  
  client.user.setActivity("Debug mode", {
    type: "STREAMING"
  });
  */
  //var autoCheck = setInterval(checkInTime(), 15000);

  client.user.setActivity("auf !help", {type: "LISTENING"});

  /*
    var interval = setInterval (function () {
      checkInTime();
    }, 1000 * 60) * 60 * 4; 
*/


//
//  Checks if  Homework on next day
//

/// Every 4 hours
cron.schedule('00 0-23/4 * * *', function() {
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

client.on('message', msg => {
    var cont    = msg.content,
        author  = msg.member,
        chan    = msg.channel,
        guild   = msg.guild

    if (author.id != client.user.id && cont.startsWith(config.prefix)) {

      var invoke  = cont.split(' ')[0].substr(config.prefix.length),
          args    = cont.split(' ').slice(1)

      console.log(invoke, args);

      if (invoke in cmdmap) {
        cmdmap[invoke](msg, args, author)
      }      

    }
});

client.login(config.token);
