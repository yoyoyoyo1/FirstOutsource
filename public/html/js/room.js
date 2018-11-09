var data = [
];//表的内容数组

const ipc = require('electron').ipcRenderer
console.log(window.localStorage)
if (window.localStorage['room'] != null) {
    window.localStorage.removeItem('room')
}
let value = window.localStorage.getItem('floor')
var floorId = JSON.parse(value.toString())['_id']

window.onload = function () {
    reLoad()
}

function reLoad() {
    ipc.send('getRoom', { floorId })
    ipc.on("postRoom", function (e, docs) {
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
            ipc.send('deleteRoom',rows)
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
        var d = {

            index: $("#index").val(),
            type: $("#type").val(),
            mark: $("#mark").val(),
            floorId : floorId
        }
       ipc.send('addRoom',d)
        $("#index").val("")
        $("type").val("")
        $("#mark").val("")
        $("#plusProperty").modal('hide')
        reLoad()
    })
    $("#createNo").click(function () {

        $("#index").val("")
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
        $("#typeEdit").val(rows[0].type)
        $("#markEdit").val(rows[0].mark)
        $("#editProperty").modal('show')

    })
    $("#editSure").click(function () {

        var rows = $("#table").bootstrapTable('getSelections');
        var d = {
            index: $("#indexEdit").val(),
            type: $("#typeEdit").val(),
            mark: $("#markEdit").val(),
            _id : rows[0]._id,
            floorId:floorId
        }
       ipc.send('fixRoom',d)
        $("#indexEdit").val("")
        $("#typeEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
        reLoad()
    })
    $("#editNo").click(function () {

        $("#index").val("")
        $("#typeEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
    })
    //进入具体楼层

    $('#table').bootstrapTable({
        data: data
    });
});

function addEvent(value, row, index) {
    return [
        '<button type="button" class="RoleOfedit btn btn-primary" >进入</button>'
    ].join("")
}

window.operateEvents = {

    'click .RoleOfedit': function (e, value, row, index) {
        var v = {
            _id:row._id,
            index:row.index,
            type:row.type,
        }
        window.localStorage.setItem('room',JSON.stringify(v))
        ipc.send('goods', {})
    }
};