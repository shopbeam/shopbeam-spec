
module.exports = function clickHarder(selector, callback) {
  var complete = false;
  var lastError = null;
  setTimeout(function(){
    if (complete) {
      return;
    }
    complete = true;
    callback(lastError || new Error('click timeout'));
  }, 10000);
  var browser = this;
  function clickTry(){
    browser.click(selector, function(err){
      if (complete) {
        return;
      }
      if (!err) {
        complete = true;
        callback();
        return;
      }
      lastError = err;
      if (!/not (clickable|visible)/.test(err.message)){
        complete = true;
        callback(err);
        return;
      }
      setTimeout(clickTry, 100);
    });
  }
  clickTry();
};
