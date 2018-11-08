const ipc = require('electron').ipcMain
const fs = require('fs')
var path = require('path')


module.exports = (mainWindow) => {
    ipc.on('login', function (e, login) {
        
        fs.readFile(path.resolve(__dirname, '../public/json/login.json'), "utf8", function (err, data) {
            data = JSON.parse(data)
            if (login.name != data.name) {
                e.sender.send("loginError", "用户名不存在")
                return
            }
            if (login.password != data.password) {
                e.sender.send("loginError", "密码错误")
                return
            }
            mainWindow.loadFile('public/html/index.html')
        })
    })
    ipc.on('floor',function(e){
        console.log(1)
        mainWindow.loadFile('public/html/floor.html')
    })
    ipc.on('architecture',function(e){
        console.log(1)
        mainWindow.loadFile('public/html/index.html')
    })
    ipc.on('room',function(e){
        console.log(1)
        mainWindow.loadFile('public/html/room.html')
    })
    ipc.on('goods',function(e){
        console.log(1)
        mainWindow.loadFile('public/html/goods.html')
    })
}