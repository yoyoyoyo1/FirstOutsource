const ipc = require('electron').ipcMain
const db = require('../db')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('addFloor', function (e, data) {
        db.floor.insert(data);

    })
    ipc.on('fixFloor', function (e, data) {
        db.floor.update({_id: data['_id']}, data, {}, function () {
        });
    })
    ipc.on('getFloor', function (e, data) {
        db.floor.find(data, function (e, docs) {
            e.sender.send("postFloor", docs)
        });
    })
}