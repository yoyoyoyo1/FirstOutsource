var data = [
];//表的内容数组
const ipc = require('electron').ipcRenderer
console.log(window.localStorage)
let value = window.localStorage.getItem('room')
var roomId = JSON.parse(value.toString())['_id']
let architecture = window.localStorage.getItem('architecture')
let floor = window.localStorage.getItem('floor')

let where = JSON.parse(architecture).type +" "+JSON.parse(architecture).index+"  "
            +JSON.parse(floor).index+"层  "
            +JSON.parse(value).type+" "+JSON.parse(value).index

window.onload = function () {
    $("#where").append(where)
    reLoad()
}

function reLoad() {
    ipc.send('getUse', { roomId })
    ipc.on("postUse", function (e, docs) {
        data = docs
        $("#table").bootstrapTable('destroy');
        $('#table').bootstrapTable({
            data: data
        });
    })
}//刷新
$(function () {
    //删除
    $("#delete").click(function () {

        var rows = $("#table").bootstrapTable('getSelections');
        if (rows.length == 0) {
            alert("请先选择要删除的记录!");
            return;
        }
        var truthBeTold = window.confirm("确定要删除该行记录吗?")
        if (truthBeTold) {
            ipc.send('deleteUse',rows)
            window.alert("删除成功");
        } else {
            return
        }

       
        reLoad();
    })
    //增加
    $("#plus").click(function () {
        $("#plusProperty").modal()
    })

    $("#createSure").click(function () {
        let sum = parseInt($("#price").val()) * parseInt($("#num").val())
        var d = {

            index: $("#index").val(),
            name: $("#name").val(),
            num: $("#num").val(),
            price: $("#price").val(),
            total: sum,
            createTime: $("#createTime").val(),
            deleteTime: $("#deleteTime").val(),
            admin: $("#admin").val(),
            mark: $("#mark").val(),
            roomId:roomId
        }
        ipc.send('addUse',d)
        $("#index").val("")
        $("#name").val("")
        $("#num").val("")
        $("#price").val("")
        $("#createTime").val("")
        $("#deleteTime").val("")
        $("#admin").val("")
        $("#mark").val("")
        $("#plusProperty").modal('hide')
        reLoad()
    })
    $("#createNo").click(function () {

        $("#index").val("")
        $("#name").val("")
        $("#num").val("")
        $("#price").val("")
        $("#createTime").val("")
        $("#deleteTime").val("")
        $("#admin").val("")
        $("#mark").val("")
        $("#plusProperty").modal('hide')
    })
    //修改
    $("#fix").click(function () {
        var rows = $("#table").bootstrapTable('getSelections')

        if (rows.length == 0) {
            alert("请先选择要修改的记录!")
            return;
        } else if (rows.length > 1) {
            alert("你选择了多行无法全部修改，请选择一行进行修改")
            return
        }


        console.log(rows[0].index)
        $("#indexEdit").val(rows[0].index)
        $("#nameEdit").val(rows[0].name)
        $("#numEdit").val(rows[0].num)
        $("#priceEdit").val(rows[0].price)
        $("#createTimeEdit").val(rows[0].createTime)
        $("#deleteTimeEdit").val(rows[0].deleteTime)
        $("#adminEdit").val(rows[0].admin)
        $("#markEdit").val(rows[0].mark)
        $("#editProperty").modal('show')

    })
    $("#editSure").click(function () {

        var rows = $("#table").bootstrapTable('getSelections');
        var d = {
            index: $("#indexEdit").val(),
            name: $("#nameEdit").val(),
            num: $("#numEdit").val(),
            price: $("#priceEdit").val(),
            total: num * price,
            createTime: $("#createTimeEdit").val(),
            deleteTime: $("#deleteTimeEdit").val(),
            admin: $("#adminEdit").val(),
            mark: $("#markEdit").val(),
            _id:rows[0]._id,
            roomId:roomId
        }
        ipc.send('fixUse',d)
        $("#indexEdit").val("")
        $("#nameEdit").val("")
        $("#numEdit").val("")
        $("#priceEdit").val("")
        $("#createTimeEdit").val("")
        $("#deleteTimeEdit").val("")
        $("#adminEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
        reLoad()
    })
    $("#editNo").click(function () {

        $("#indexEdit").val("")
        $("#nameEdit").val("")
        $("#sumEdit").val("")
        $("#priceEdiit").val("")
        $("#createTimeEdit").val("")
        $("#deleteTimeEdit").val("")
        $("#adminEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
    })

    $('#table').bootstrapTable({
        data: data
    });
});