const ipc = require('electron').ipcMain
const db = require('../db')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('addUse', function (e, data) {
        db.use.insert(data);

    })
    ipc.on('fixUse', function (e, data) {
        db.use.update({
            _id: data['_id']
        }, data, {}, function () {});
    })
    ipc.on('getUse', function (e, data) {
        db.use.find(data, function (err, docs) {
            e.sender.send("postUse", docs)
        });
    })
    ipc.on('deleteUse', function (e, data) {
        for (let d of data) {
            db.use.remove({
                _id: d['_id']
            }, {}, function (err, numRemoved) {});

        }

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

    ipc.on("exportTable", async function (e, data) {
        var tableHead = ["编号", "名称", "数量", "单价", "金额", "添置时间", "注销时间", "保管人", "备注"]
        var table = [tableHead]
        var map = {
            "名称": "name",
            "数量": "num",
            "单价": "price",
            "金额": "total",
            "添置时间": "createTime",
            "注销时间": "deleteTime",
            "保管人": "admin",
            "备注": "mark"
        }
        let total = 0
        let architectures = await findP(db.architecture, {});
        for (let architecture of architectures) {
            // console.log(architecture)
            let floors = await findP(db.floor, {
                architectureId: architecture._id
            })
            for (let floor of floors) {
                // console.log("floor",floor)
                let rooms = await findP(db.room, {
                    floorId: floor._id
                })
                console.log()
                for (let room of rooms) {
                    // console.log(1231)
                    // console.log("room",room)
                    // console.log(1231)
                    let uses = await findP(db.use, {
                        roomId: room._id
                    })
                    // console.log("dsafdasdasd",uses)
                    for (let use of uses) {
                        // console.log("use",use)
                        let json = [architecture.index + floor.index + room.index + use.index]
                        total += use.total
                        for (let index of tableHead) {
                            if (index == "编号") continue
                            
                            json.push(use[map[index]])
                        }

                        table.push(json)
                    }
                }
            }
        }
        table.push(['','','','','','','',"累计:",total+"元"])
        // console.log(table)
        e.sender.send("usrTable", table)

    })

    
    ipc.on('serachUse', async function (e, data) {
        var serach = {}

        serach[data.serachType] = new RegExp(`.*?${data.serachValue}.*?`)

        let uses = await findP(db.use, serach)
        for (use of uses) {

            let room = await findP(db.room, {
                "_id": use.roomId
            })
            
            let floor = await findP(db.floor, {
                "_id": room[0].floorId
            })
            let architecture = await findP(db.architecture, {
                "_id": floor[0].architectureId
            });
            use.a = architecture[0].type + architecture[0].index
            use.f = floor[0].index
            use.r = room[0].index
        }
        e.sender.send("postSerach", uses)
    })
}