
module.exports = function switchToDefault(callback) {
  this.frame(null, function(err){
    callback(err);
  });
};
