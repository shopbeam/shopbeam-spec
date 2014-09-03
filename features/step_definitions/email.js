var expect = require('expect.js');
var EmailClient = require('../../util/email-client');
module.exports = function() {

  this.Then(/^I receive a purchase confirmation email$/, function (callback) {
    var lastError = null;
    var world = this;
    var client = new EmailClient({
      email: this.user.email.replace(/\+[^\@]*\@/g, '@'),
      password: this.config.users.gmailPassword
    });
    var now = new Date().getTime();
    var interval, attempt = 0;

    function findMessage(){
      attempt++;
      if (attempt > 15) {
        client.close();
        clearInterval(interval);
        callback(lastError || new Error('confirmation email not found'));
        return;
      }
      var message = client.pop({
        filter: function(message) {
          return (
            /order is being processed/.test(message.title) &&
            message.to[0].address === world.user.email &&
            (now - message.date.getTime()) < 30000
          );
        }
      }, function(err, message){
        if (err) {
          lastError = err;
        }
        if (err || !message){
          return;
        }
        expect(message.title).to.eql('Your Shopbeam order is being processed');
        clearInterval(interval);
        client.getMessageBody(message, function(err, body) {
          expect(body.text).to.contain('Thank you for shopping');
          client.close();
          callback();
        });
      });
    }
    interval = setInterval(function(){
      findMessage();
    }, 5000);
    findMessage();
  });

};
