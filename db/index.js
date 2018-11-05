const nedb  = require('nedb')

let db = {
}

db.foor = new nedb({
    filename:"foor.db",
    autoload:true
})

module.exports = db