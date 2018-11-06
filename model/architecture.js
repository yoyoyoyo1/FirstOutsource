const ipc = require('electron').ipcMain
const db = require('../db')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('addArchitecture', function (e, data) {
        db.architecture.insert(data);

    })
    ipc.on('fixArchitecture', function (e, data) {
        db.architecture.update({
            _id: data['_id']
        }, data, {}, function () {});
    })

    ipc.on('getArchitecture', function (e, data) {
        db.architecture.find(data, function (e, docs) {
            e.sender.send("postArchitecture", docs)
        });
    })
}