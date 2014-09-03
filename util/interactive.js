var chalk = require('chalk');
var repl = require("repl");

function interactive(world, callback){
  console.log(chalk.cyan('************************'));
  console.log(chalk.cyan('  starting REPL'));
  console.log(chalk.cyan('************************'));
  function customEval(cmd, context, filename, callback) {
    var async = /done\s*[\(\)]/.test(cmd);
    try {
      var done = async ? function(err) {
        if (err) {
          console.log('ERROR:', err);
          callback();
          return;
        }
        callback.apply(this, arguments);
      } : null;
      var src = 'var done=arguments[0];with(this){return (' + cmd + ');}';
      /*jshint evil:true */
      var result = (new Function(src)).call(context, done);
      /*jshint evil:false */
      if (async) {
        return;
      }
      callback(null, result);
    } catch (err) {
      console.log('ERROR:', err);
      callback(null, err);
    }
  }
  var replSession = repl.start({
    eval: customEval
  });
  var ctx = replSession.context;
  ctx.this = world;
  ctx.world = world;
  ctx.browser = world.browser;
  replSession.on('exit', function() {
    callback();
  });
}

module.exports = interactive;
