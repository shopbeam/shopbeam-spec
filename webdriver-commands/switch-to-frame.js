
module.exports = function switchToFrame(selector, callback) {
  var complete = false;
  var lastError = null;
  setTimeout(function(){
    if (complete) {
      return;
    }
    complete = true;
    callback(lastError || new Error('switch to frame timeout'));
  }, 10000);
  var self = this;
  function switchTry (){
    if (complete) {
      return;
    }
    self.element(selector, function(err, res){
      if (err) {
        return callback(err);
      }
      self.frame(res.value, function(err){
        if (complete) {
          return;
        }
        if (!err) {
          complete = true;
          callback();
          return;
        }
        lastError = err;
        if (!/no such frame/.test(err.message)){
          complete = true;
          callback(err);
          return;
        }
        setTimeout(switchTry, 100);
      });
    });
  }
  switchTry();
};
