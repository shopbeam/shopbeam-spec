

var EmailClient = require('./email-client');

var client = new EmailClient({
  email: 'shopbeamtest@gmail.com',
  password: 'qweqweasdasd'
});

var message = client.pop({
}, function(err, message){
  if (err) {
    console.log(err);
    return;
  }
  console.log(message);
  client.getMessageBody(message, function(err, body){
    console.log('*********************************************');
    console.log(body);
    console.log('*********************************************');
    client.close();
  });
});
