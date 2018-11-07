var data = [
];//表的内容数组
let index = 0
function clear_arr_trim(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == "" || typeof (array[i]) == "undefined") {
            array.splice(i, 1);
            i = i - 1;
        }
    }
    return array;
}

function reLoad() {
    $("#table").bootstrapTable('destroy');
    $('#table').bootstrapTable({
        data: data
    });
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
            window.alert("删除成功");
        } else {
            return
        }

        for (let j = 0; j < rows.length; j++) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] == rows[j]) {
                    data[i] = null
                    delete data[i]
                }
            }
        }

        clear_arr_trim(data)
        reLoad();
    })
    //增加
    $("#plus").click(function () {
        $("#plusProperty").modal()
    })

    $("#createSure").click(function () {
      console.log(22)
        var d = {
            type: $("#type").val(),
            id: $("#id").val(),
            mark: $("#mark").val(),
          
        }
        $("#tpye").val("")
        $("#id").val("")
        $("#mark").val("")
        data.push(d)
        console.log(data)
        $("#plusProperty").modal('hide')
        reLoad()
    })
    $("#createNo").click(function () {
        $("#tpye").val("")
        $("#id").val("")
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
        console.log(rows[0].type)
       
        $("#typeEdit").val((rows[0].type))
        $("#idEdit").val(rows[0].id)
        $("#markEdit").val(rows[0].mark)
        $("#editProperty").modal('show')

    })
    $("#editSure").click(function () {
       
        var rows = $("#table").bootstrapTable('getSelections');
        var d = {
            type: $("#typeEdit").val(),
            id: $("#idEdit").val(),
            mark: $("#markEdit").val()
        }
        for (let j = 0; j < rows.length; j++) {
            for (let i = 0; i < data.length; i++) {
                if (data[i] == rows[j]) {
                    data[i] = d
                    
                }
            }
        }
        $("#typeEdit").val("")
        $("#idEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
        reLoad()
    })
    $("#editNo").click(function () {
        $("#typeEdit").val("")
        $("#idEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
    })
    
    $('#table').bootstrapTable({
        data: data
    });
    
});
function addEvent(value,row,index){
  return [
    '<button type="button" class="RoleOfedit btn btn-primary" >进入</button>'
  ].join("")
}
const ipc = require('electron').ipcRenderer
window.operateEvents = {
  
  'click .RoleOfedit' : function (){
    //console.log("22222")
    //open('/public/html/modal.html')
    ipc.send('floor',{})
    ///window.location.href = '/public/html/modal.html'
   
}
};
