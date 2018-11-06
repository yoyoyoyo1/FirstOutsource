const nedb  = require('nedb')

let db = {
}

//建筑
db.architecture = new nedb({
    filename:"./data/architecture.db",
    autoload:true
})
//楼层
db.floor = new nedb({
    filename:"./data/floor.db",
    autoload:true
})
//房间
db.room = new nedb({
    filename:"./data/room.db",
    autoload:true
})
//物品
db.use = new nedb({
    filename:"./data/use.db",
    autoload:true
})
module.exports = db