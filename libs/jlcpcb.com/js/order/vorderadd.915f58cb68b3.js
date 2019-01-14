function sestencilCountXY(obj) {
    var name = $(obj).attr("name");
    if($(obj).val()==0){
        $(obj).val('');
    }
    var xCount = "";
    var yCount = "";
    //一个PCB长和宽
    $("input[name='stencilWidth']").each(function () {
        xCount = $(this).val();
    });
    $("input[name='stencilLength']").each(function () {
        yCount = $(this).val();
    });
    //拼版长和宽个数
    var sestencilCountX = $("input[name='sestencilCountX']").val();
    var sestencilCountY = $("input[name='sestencilCountY']").val();
    // 初始化 拼版长和宽个数
    if (sestencilCountX <=0) {
        sestencilCountX = 1;
    }
    if (sestencilCountY <=0) {
        sestencilCountY = 1;
    }
    //debugger;
    $(".sestencilCountX").html(sestencilCountX);
    $(".sestencilCountY").html(sestencilCountY);
    $(".stencilWidth").html($("input[name='stencilWidth']").val());
    $(".stencilLength").html($("input[name='stencilLength']").val());
    /*工艺边*/
    if(sestencilCountX==1&&sestencilCountY==1){
        /*不需要*/
        $("#needTechnicsNo").addClass("cur").siblings("button").removeClass("cur");
        $(".hasEdgeRailsX,.hasEdgeRailsY").hide();
        $(".sestencilCountXshow,.sestencilCountYshow").show();
        $(".pcbFaqsSestencilCountX").html($("input[name='stencilWidth']").val());
        $(".pcbFaqsSestencilCountY").html($("input[name='stencilLength']").val());
    }else if(sestencilCountX&&sestencilCountY){
        /*需要*/
        $("#needTechnicsYes").addClass("cur").siblings("button").removeClass("cur");
        $(".sestencilCountXshow,.sestencilCountYshow").show();
        /*工艺边计算*/
        if (parseInt(sestencilCountX * xCount) <= parseInt(sestencilCountY * yCount)) {
            $(".pcbFaqsSestencilCountX").html( parseInt(parseInt(sestencilCountX * xCount) + 10));
            $(".pcbFaqsSestencilCountY").html(parseInt(sestencilCountY * yCount));
            $(".hasEdgeRailsX").show();
            $(".hasEdgeRailsY").hide();
        } else {
            $(".pcbFaqsSestencilCountY").html(parseInt(sestencilCountY * yCount + 10));
            $(".pcbFaqsSestencilCountX").html( parseInt(sestencilCountX * xCount) );
            $(".hasEdgeRailsY").show();
            $(".hasEdgeRailsX").hide();
        }
    }else{
        $(".sestencilCountXshow,.sestencilCountYshow").hide();
    }
    inputNumber(obj);
}

function NumberLast() {
    document.getElementById("stencilShowNumberLast").innerHTML = "<font color='red'>Input here if more than 6 different designs in your panel</font>";

}
function outNumberLast() {
    document.getElementById("stencilShowNumberLast").innerHTML = "";
}
function clearBtn(obj) {
    $(obj).siblings(".btn").removeClass("cur");
}
function inputNumberTwo(obj) {
    obj.value = obj.value.replace(/[^\d]/g, "");
    if (obj == null || obj == undefined || obj.value == 0 || obj.value == "" || obj.value > 50 || obj.value < 0) {
        obj.value = "";
    }
    $("#stencilNumberOne").val(obj.value);
    calculationCosts();
    outNumberLast();
}
function btnNum(obj) {
    $(obj).siblings(".stencilNumberLast").val("");
}

//检查如果选择top & bottom(separate) 个数必须不能为1，是1不能下单
function checkTopBottomNum() {
    var num =  $("input[name='purchaseNumber']").val();
    var value = $("[divname='steel-choose-side-pcb-div']").find(".cur");
    value = value.val()
    if(value == "Top & Bottom(On Separate Stencil)" && num == 1){
        alert(" Note: When option\"top & bottom(separate)\" is chosen, the quantity needs be 2 at least, or top and bottom will be made on the same stencil, please check!");
        return false;
    }
    return true;
}