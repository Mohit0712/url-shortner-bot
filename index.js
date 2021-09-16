const express = require("express");
const { Telegraf } = require('telegraf')
const axios = require('axios')
const regex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
require("dotenv").config();
const bot = new Telegraf(process.env.bot_api_key)

const app = express();

bot.start(async (ctx) => {
  ctx.replyWithHTML("<em>Hello There 👋, I am <b>URL Shortner Bot.</b> \nSend me any Big Url and I will give you it's <i>Shot Url.</i></em>\n\n <b>Press /help for more info.</b>\n\n<em>Owner @itsabdulkader</em>");
});

bot.command('help', (ctx) => {
  ctx.replyWithHTML("<em>📤 Send me any valid URL( with http:// or https:// ) and I will give you a <b>Short Url</b> that you can share with anyone. Example-\n\n<code>https://something.com/xyz/something</code></em>");
});

bot.on('message', async(ctx) => {
    var message = ctx.message.text
    if (message == undefined) {
        ctx.replyWithHTML("<em>❗You are sending file. Send a valid Link to Shorten it.</em>")
    } else if (!regex.test(message)) {
        ctx.replyWithHTML("<em>You are sending an ⚠️ invalid link kindly recheck and send again with http:// or https://</em>")
    } else {
        var config = {
            method: 'get',
            url: `${process.env.api_url}/create?api_key=${process.env.api_key}&u=${message}`
        };
        axios(config)
            .then(async function(response) {
                var data = response.data;
                if (!data.error) {
                    ctx.replyWithHTML(`<em>✔️ Url Shortened Successfully shortened Url (Tap to Copy):</em>\n\n <code>${data.shortUrl}</code>`)
                    
                } else if (data.error && data.error == "invalid link") {
                    ctx.replyWithHTML("<em>❗ You are sending an invalid link kindly recheck and send again with http:// or https://</em>")
                } else {
                    ctx.replyWithHTML("<em>Try again</em>")
                }
            })
            .catch(function(error) {
                ctx.replyWithHTML("<em>📮 Contact owner</em>")
                console.log(error)
            })
    }
})






bot.launch();

const PORT = process.env.PORT || 3000;

app.listen(PORT);
