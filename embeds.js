const  Discord = require('discord.js')
const COLORS = {
    red: 0xE74C3C,
    green: 0x2ECC71,
    orange: 0xE67E22,
    blue: 0x3498DB,
    dark_gray: 0x34495E
}

module.exports = {


/**
 * Send an error embed message to channel
 * @param {Discord.Channel} chan Channel where message is send to 
 * @param {string} cont 
 * @param {string} title 
 * @returns 
 */

    error(client1 ,type , chan, cont, title, bfText){
        var message
        channel = client1.channels.cache.get('858436736555810889');
        var emb = new Discord.MessageEmbed()


        switch (parseInt(type)) {
            case 0: 
                emb.setColor(COLORS.red)
                break;
            case 1: 
                emb.setColor(COLORS.green)
                break;
            case 2: 
                emb.setColor(COLORS.orange)
                break;
            case 3: 
                emb.setColor(COLORS.blue)
                break;
            case 4: 
                emb.setColor(COLORS.dark_gray)
                break;
            default: 
                emb.setColor(COLORS.blue)
                break;
        }
        
        emb.setDescription(cont)

            if (title) {
                emb.setTitle(title);    
            }

        channel.send(bfText , emb).then((m) => {
            message = m
        })
        
        return message
    },

    hwList(client1 ,type , chan, cont, title, bfText, title1, text1, title2, text2, title3, text3){
        var message
        channel = client1.channels.cache.get('858436736555810889');
        var emb = new Discord.MessageEmbed()


        switch (parseInt(type)) {
            case 0: 
                emb.setColor(COLORS.red)
                break;
            case 1: 
                emb.setColor(COLORS.green)
                break;
            case 2: 
                emb.setColor(COLORS.orange)
                break;
            case 3: 
                emb.setColor(COLORS.blue)
                break;
            case 4: 
                emb.setColor(COLORS.dark_gray)
                break;
            default: 
                emb.setColor(COLORS.blue)
                break;
        }
        
        emb.setDescription(cont)

            if (title) {
                emb.setTitle(title);    
            }

            emb.addFields({ name: title1, value: text1 , inline: true})  
            emb.addFields({ name: title2, value: text2 , inline: false})
            emb.addFields({ name: title3, value: text3 , inline: true})  


        channel.send(bfText , emb).then((m) => {
            message = m
        })
        
        return message
    }
}