var data = [
];//表的内容数组
const ipc = require('electron').ipcRenderer
// serachx = {
//     "index":"物品编号",
//     "name":"物品名称"
// }
$(function () {
    $("#serach").click(function () {
        
        var d = {
            serachType: $("#serachType").val(),
            serachValue: $("#serachValue").val()
        }
        console.log(d)
        ipc.send('serachUse', d)
        ipc.on("postSerach", function (e, docs) {
            data = docs
            $("#table").bootstrapTable('destroy');
            $('#table').bootstrapTable({
                data: data
            });
        })
    })
    $("#serachType").click(function (){
        $("#serachValue").val("")
    })
    $('#table').bootstrapTable({
        data: data
    });
});