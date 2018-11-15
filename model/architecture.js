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
        console.log(data)
    })

    ipc.on('getArchitecture', function (e, data) {
        let value = {}

        if (data["type"] != "") {
            value.type = data["type"]
        }

        db.architecture.find(value).sort({
            planet: 1
        }).skip(data.start).limit(data.size).exec(function (err, docs) {
            e.sender.send("postArchitecture", docs)
        });
        db.architecture.count(value, function (err, count) {
            e.sender.send("countArchitecture", count)
        })
    })

    function findP(db, obj) {
        return new Promise((resolve, rejeck) => {
            db.find(obj, function (err, data) {
                if (err) {
                    console.log(err)
                }
                resolve(data)
            })
        })
    }

    ipc.on('exportATable', async (e, data) => {

    })
    ipc.on('deleteArchitecture', function (e, data) {
        for (let d of data) {
            db.architecture.remove({
                _id: d['_id']
            }, {}, function (err, numRemoved) {
                db.floor.find({
                    architectureId: d['_id']
                }, function (errf, docsf) {
                    for (let floor of docsf) {
                        db.floor.remove({
                            _id: floor['_id']
                        }, {}, function (err, numRemoved) {
                            db.room.find({
                                floorId: floor['_id']
                            }, function (errr, docsr) {
                                for (let room of docsr) {
                                    db.room.remove({
                                        _id: room['_id']
                                    }, {}, function (err, numRemoved) {
                                        db.use.find({
                                            roomId: room['_id']
                                        }, function (erru, docsu) {
                                            for (let use of docsu) {
                                                db.use.remove({
                                                    _id: use['_id']
                                                }, {}, function (err, numRemoved) {});

                                            }
                                        })
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