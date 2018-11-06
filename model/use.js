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
        db.use.find(data, function (e, docs) {
            e.sender.send("postUse", docs)
        });
    })
    ipc.on("exportTable",function(e,data){

    })
}