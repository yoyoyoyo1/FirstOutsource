const ipc = require('electron').ipcRenderer

var data = [
];//表的内容数组
var start = 0
var size = 5
var length = 0
var page = 1
var sum = 0
var type = ""
window.onload = function () {
    reLoad()
}
window.localStorage.clear()
console.log(window.sessionStorage)
function reLoad() {//
    ipc.send("getArchitecture", {start,size,type})
    ipc.on("postArchitecture", function (e, docs) {
        data = docs
        $("#table").bootstrapTable('destroy');
        $('#table').bootstrapTable({
            data: data
        });

    })
    ipc.on("countArchitecture",function (e,count){
        
        length = count
        var a = ""
        if(page==1){
         $("#previous").attr("class","disabled")
         
        }else{
            $("#previous").attr("class","")
        }
        if(length%size==0){
            sum = length/size
          if(page==length/size){
           $("#next").attr("class","disabled")
          }else{
            $("#next").attr("class","")    
          }
        }else{
            sum = (length-length%size)/size+1
            if(page==(length-length%size)/size+1){
                console.log(page)
           $("#next").attr("class","disabled")
          
            }else{
                $("#next").attr("class","")     
            }
        }
        $("#page").children().filter('button').remove()
        
        a = "<button type='button' class='btn btn-default' >当前第"+page+"/"+sum+"页</button>"
        $("#page").append(a)
    })

}//刷新
$(function () {
    
    //前一页
    $("#previous").click(function (){
        start-=size
        page--
        console.log("page:",page)
        reLoad()
    })
    //后一页
    $("#next").click(function (){
        start+=size
        page++
        reLoad()
    })
    //选择建筑类型
    $("#architectureType").click(function (){
        if($("#architectureType").val()=="全部建筑"){
            type = ""
        }else{
            type = $("#architectureType").val()
            console.log(type)
        }
        reLoad()
    })
    //删除
    $("#delete").click(function () {

        var rows = $("#table").bootstrapTable('getSelections');
        if (rows.length == 0) {
            alert("请先选择要删除的记录!");
            return;
        }
        var truthBeTold = window.confirm("确定要删除吗?")
        if (truthBeTold) {
            ipc.send("deleteArchitecture",rows)
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
        //console.log(22)
        var d = {
            type: $("#type").val(),
            index: $("#index").val(),
            mark: $("#mark").val(),
        }
        ipc.send("addArchitecture", d)
        $("#tpye").val("")
        $("#index").val("")
        $("#mark").val("")
        data.push(d)
        console.log(data)
        $("#plusProperty").modal('hide')
        reLoad()
    })
    $("#createNo").click(function () {
        $("#tpye").val("")
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
        console.log(rows[0].type)

        $("#typeEdit").val((rows[0].type))
        $("#indexEdit").val(rows[0].index)
        $("#markEdit").val(rows[0].mark)
        $("#editProperty").modal('show')

    })
    $("#editSure").click(function () {

        var rows = $("#table").bootstrapTable('getSelections');
        var d = {
            type: $("#typeEdit").val(),
            index: $("#indexEdit").val(),
            mark: $("#markEdit").val(),
            _id : rows[0]._id
        }
        ipc.send("fixArchitecture",d)
        $("#typeEdit").val("")
        $("#indexEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
        reLoad()
    })
    $("#editNo").click(function () {
        $("#typeEdit").val("")
        $("#indexEdit").val("")
        $("#markEdit").val("")
        $("#editProperty").modal('hide')
    })

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
        console.log(row._id)
        var v = {
            _id:row._id,
            type:row.type,
            index:row.index
        }
        window.localStorage.setItem('architecture',  JSON.stringify(v))
        ipc.send('floor', {})
    }
};
