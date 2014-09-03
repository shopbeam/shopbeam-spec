var inbox = require("inbox");
var MimeParser = require('mimeparser');
var htmlToText = require('html-to-text');

function EmailClient(options) {
  if (!/\@gmail\.com$/.test(options.email)) {
    throw new Error('only gmail.com is supported: ' + options.email);
  }
  this.email = options.email;
  this.password = options.password;

  this.client = inbox.createConnection(false, "imap.gmail.com", {
    secureConnection: true,
    auth:{
      user: this.email,
      pass: this.password
    }
  });
  this.connected = false;
}

EmailClient.prototype.connect = function(callback) {
  if (this.connected) {
    callback();
    return;
  }
  this.client.on("connect", function(){
    this.connected = true;
    this.connecting = false;
    callback();
  }.bind(this));
  if (this.connecting) {
    return;
  }
  this.client.connect();
  this.connecting = true;
};

EmailClient.prototype.close = function() {
  if (this.connected) {
    this.client.close();
    this.client = null;
    this.connected = false;
  }
};

EmailClient.prototype.getMessageBody = function(message, callback) {
  var self = this;
  var client = this.client;
  this.connect(function(err){
    if (err) {
      callback(err);
      return;
    }
    var stream = client.createMessageStream(message.UID);
    var bufs = [];
    var complete = false;
    var body;
    var parser = new MimeParser();
    parser.onbody = function(node, chunk){
      body = '';
      for(var i = 0; i < chunk.length; i++) {
        body = body + String.fromCharCode(chunk[i]);
      }
    };
    stream.on('data', function(data){
      parser.write(data);
      bufs.push(data);
    });
    stream.on('error', function(err){
      if (complete) {
        return;
      }
      complete = true;
      callback(err);
    });
    stream.on('end', function(){
      if (complete) {
        return;
      }
      parser.end();
      complete = true;
      callback(null, {
        html: body,
        text: htmlToText.fromString(body)
      });
      //callback(null, Buffer.concat(bufs).toString());
    });
  });
};

EmailClient.prototype.pop = function(options, callback) {
  var self = this;
  var client = this.client;
  this.connect(function(err){
    if (err) {
      callback(err);
      return;
    }
    client.openMailbox("INBOX", function(err, info){
      if (err) {
        callback(err);
        return;
      }
      // list newest 20 messages
      client.listMessages(-20, function(err, messages){
        if (err) {
          callback(err);
          return;
        }
        messages.sort(function(msg1, msg2) {
          return msg1.date.getTime() - msg2.date.getTime();
        });
        if (options.filter) {
          messages = messages.filter(options.filter);
        }
        if (!messages.length) {
          callback(new Error('message not found in inbox'));
          return;
        }
        callback(null, messages[0]);
      });
    });
  });
};

module.exports = EmailClient;
