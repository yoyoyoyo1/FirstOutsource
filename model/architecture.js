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
        var tableHead = ["楼层", "房间", "编号", "名称", "数量", "单价", "金额", "添置时间", "注销时间", "保管人", "备注"]
        let tableTotal = {}
        var map = {
            "编号": "index",
            "名称": "name",
            "数量": "num",
            "单价": "price",
            "金额": "total",
            "添置时间": "createTime",
            "注销时间": "deleteTime",
            "保管人": "admin",
            "备注": "mark"
        }
        let architectures = await findP(db.architecture, {});
        for (let architecture of architectures) {
            let total = 0
            let table = []
            table.push(tableHead)
            tableTotal[architecture.type + architecture.index] = table
            // console.log(architecture)
            let floors = await findP(db.floor, {
                architectureId: architecture._id
            })
            for (let floor of floors) {
                // console.log("floor",floor)
                let rooms = await findP(db.room, {
                    floorId: floor._id
                })
                for (let room of rooms) {
                    // console.log(1231)
                    // console.log("room",room)
                    // console.log(1231)
                    let uses = await findP(db.use, {
                        roomId: room._id
                    })
                    // console.log("dsafdasdasd",uses)
                    for (let use of uses) {
                        let json = []
                        total += isNaN(use.total) ? 0 : use.total;
                        for (let index of tableHead) {
                            if (index == "楼层" ) {
                                json.push(floor.index)
                                continue
                            }
                            if (index == "房间") {
                                json.push(room.index)
                                continue
                            }
                            json.push(use[map[index]])
                        }

                        table.push(json)
                    }
                }
            }
            table.push(['','','', '', '', '', '', '', '', "累计:", total + "元"])
        }
        // console.log(table)
        e.sender.send("aTable", tableTotal)
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