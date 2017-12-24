const accountSid = 'ACe9c43c97dd11e97460968474bfc639be';
const authToken = '39922986234bc0398f63f2620c506cfd';
const client = require('twilio')(accountSid, authToken);

client.messages.create({
    body: 'Jenny please?! I love you <3',
    to: '+14237675038',
      from: '+14237675038',
    mediaUrl: 'http://www.example.com/hearts.png',
})
.then((message) => {
    console.log(message);
    
    process.stdout.write(message.sid)})
    .catch((err)=>console.log(err)
    )