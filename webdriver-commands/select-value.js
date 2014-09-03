
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
        .executeAsync(function(elementSelector, elementValue, done){

          // ensure the right value is selected
          var element = document.querySelector(elementSelector);
          options = element.children;
          var optionValue = elementValue;
          for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.value === elementValue) {
              break;
            }
            if (option.text === elementValue) {
              optionValue = option.value;
              break;
            }
          }
          if (element.value !== optionValue) {
            element.value = optionValue;
          }

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
          fireEvent(element, 'change');
          setTimeout(function(){
            fireEvent(element, 'change');
            setTimeout(done, 500);
          }, 500);
      }, selector, value, function(err, res) {
        if (err) {
          return callback(err);
        }
        callback();
      });
    });
  });
};
