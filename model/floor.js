const ipc = require('electron').ipcMain
const db = require('../db')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('addFloor', function (e, data) {
        db.floor.insert(data);

    })
    ipc.on('fixFloor', function (e, data) {
        db.floor.update({ _id: data['_id'] }, data, {}, function () {
        });
    })
    ipc.on('getFloor', function (e, data) {
        db.floor.find({ architectureId: data['architectureId'] }, function (err, docs) {
            e.sender.send("postFloor", docs)
        });
    })
    ipc.on('deleteFloor', function (e, data) {
        for (let d of data) {
            db.floor.remove({ _id: d['_id'] }, {}, function (err, numRemoved) {
                db.room.find({ floorId: d['_id'] }, function (errr, docsr) {
                    for (let room of docsr) {
                        db.room.remove({ _id: room['_id'] }, {}, function (err, numRemoved) {
                            db.use.find({ roomId: room['_id'] }, function (erru, docsu) {
                                for (let use of docsu) {
                                    db.use.remove({ _id: use['_id'] }, {}, function (err, numRemoved) {
                                    });

                                }
                            })
                        });

                    }

                })
            });

        }

    })
}