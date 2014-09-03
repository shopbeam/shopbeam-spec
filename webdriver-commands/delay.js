
module.exports = function delay(ms, callback) {
  setTimeout(function(){
    callback();
  }, ms);
};
