
module.exports = function selectValue(selector, value, callback) {
  var self = this;
  this.element(selector, function(err, res){
    if (err) {
      return callback(err);
    }
    self.elementIdValue(res.value.ELEMENT, value, function(err,res) {
      if (err) {
        return callback(err);
      }

      self
        .timeoutsAsyncScript(3000)
        .executeAsync(function(elementSelector, done){
        function fireEvent(element, eventName){
          var evt;
          if (document.createEventObject){
            // dispatch for IE
            evt = document.createEventObject();
            return element.fireEvent('on'+eventName, evt);
          } else{
            // dispatch for firefox + others
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(eventName, true, true); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
          }
        }
        fireEvent(document.querySelector(elementSelector), 'change');
        setTimeout(function(){
          fireEvent(document.querySelector(elementSelector), 'change');
          setTimeout(done, 500);
        }, 500);
      }, selector, function(err, res) {
        if (err) {
          return callback(err);
        }
        callback();
      });
    });
  });
};
