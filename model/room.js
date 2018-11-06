const ipc = require('electron').ipcMain
const db = require('../db')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('addRoom', function (e, data) {
        db.room.insert(data);

    })
    ipc.on('fixRoom', function (e, data) {
        db.room.update({_id: data['_id']}, data, {}, function () {
        });
    })
    ipc.on('getRoom', function (e, data) {
        db.room.find(data, function (e, docs) {
            e.sender.send("postRoom", docs)
        });
    })
}