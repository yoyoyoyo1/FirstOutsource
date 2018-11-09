const ipc = require('electron').ipcMain
const db = require('../db')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('addRoom', function (e, data) {
        db.room.insert(data);

    })
    ipc.on('fixRoom', function (e, data) {
        db.room.update({ _id: data['_id'] }, data, {}, function () {
        });
    })
    ipc.on('getRoom', function (e, data) {
        db.room.find({ floorId: data['floorId'] }, function (err, docs) {
            e.sender.send("postRoom", docs)
        });
    })
    ipc.on('deleteRoom', function (e, data) {
        for (let d of data) {
            db.room.remove({ _id: d['_id'] }, {}, function (err, numRemoved) {
                db.use.find({ roomId: d['_id'] }, function (erru, docsu) {
                    for (let use of data) {
                        db.use.remove({ _id: use['_id'] }, {}, function (err, numRemoved) {
                        });

                    }
                })
            });

        }

    })
}