const express = require("express");
const { Telegraf } = require('telegraf')
const axios = require('axios')
const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
require("dotenv").config();
const bot = new Telegraf(process.env.bot_api_key)

const app = express();

app.get("/", (req, res) => {
  res.send("Bot Running")
})

bot.start(async (ctx) => {
  ctx.replyWithHTML("<em>Hello There 👋, I am <b>URL Shortner Bot.</b> \nSend me any Big Url and I will give you it's <i>Shot Url.</i></em>\n\n <b>Press /help for more info.</b>\n\n<em>Owner @itsabdulkader</em>");
});

bot.command('help', (ctx) => {
  ctx.replyWithHTML("<em>📤 Send me any valid URL( with http:// or https:// ) and I will give you a <b>Short Url</b> that you can share with anyone. Example-\n\n<code>https://something.com/xyz/something</code></em>");
});


// api_key = Jb-IOE5Bye086pAY
bot.on('message', async(ctx) => {
    var message = ctx.message.text
    if (message == undefined) {
        ctx.replyWithHTML("<em>❗You are sending file. Send a valid Link to Shorten it.</em>")
    } else if (!regex.test(message)) {
        ctx.replyWithHTML("<em>Regex You are sending an ⚠️ invalid link kindly recheck and send again with http:// or https://</em>")
    } else {
      var encodedUrl = Buffer.from(message).toString('base64');
        var config = {
            method: 'get',
            url: `${process.env.api_url}/create?api_key=${process.env.api_key}&u=${encodedUrl}&encoded=true`
          // method: 'post',
          // url: "https://akurls.ml/url",
        //   data: {
       //      url: `${message}`
       //    }
        };
        axios(config)
            .then(async function(response) {
                var data = response.data;
                console.log(data)
                if (!data.error) {
                    ctx.replyWithHTML(`<em>✔️ Url Shortened Successfully shortened Url (Tap to Copy):</em>\n\n <code>${data.shortUrl}</code>`)
                    
                } else if (data.error && data.error == "invalid link") {
                    ctx.replyWithHTML("<em>❗ Data You are sending an invalid link kindly recheck and send again with http:// or https://</em>")
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

const PORT = process.env.PORT || 4000;

app.listen(PORT);
