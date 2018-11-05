const fs = require('fs');


let models = {};


module.exports = (mainWindow) => {
  let files = fs.readdirSync(__dirname);
  for (let f of files) {
    if (f[0] == '.' || f == 'index.js') continue;
    try {
      let fn = require('./' + f);
      if (typeof fn == 'function') {
        fn(mainWindow);
      }
    } catch (e) {
      console.log(e);
    }
  }
}