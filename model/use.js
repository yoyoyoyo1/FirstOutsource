const ipc = require('electron').ipcMain
const db = require('../db')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('addUse', function (e, data) {
        db.use.insert(data);

    })
    ipc.on('fixUse', function (e, data) {
        db.use.update({_id: data['_id']}, data, {}, function () {
        });
    })
    ipc.on('getUse', function (e, data) {
        db.use.find(data, function (err, docs) {
            e.sender.send("postUse", docs)
        });
    })
    ipc.on('deleteUse', function (e, data) {
        for(let d of data){
            db.use.remove({_id:d['_id']}, {}, function (err, numRemoved) {
          });

        }
       
    })
    ipc.on("exportTable",function(e,data){

    })
}