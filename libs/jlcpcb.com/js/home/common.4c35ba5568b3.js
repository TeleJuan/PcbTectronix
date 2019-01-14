var windowheight = $(window).height() - 60;
var checkTest=true;//是否检查飞针测试
$(".sidebar").css({"height": windowheight});
$("body").click(function () {
    $("#form-selectqty").hide();
});
$("#sel-btn").click(function (event) {
    event.stopPropagation();
    $('#form-selectqty').slideToggle(200);
})
$(function () {
    var stencilNumber = $("#stencilNumberOne").val();
    if (stencilNumber > 6) {
        $("#stencilNumberLast").val(stencilNumber);
    }
    //framework切换select内容
 /*   var isNoFrameSteelPiece=$("#form-select option:selected").attr("isNoFrameSteelPiece");
    if(isNoFrameSteelPiece==1){
        $("[divname='Framework-div'] button").eq(0).addClass("cur");
    }*/
    var framework=$("[divname='Framework-div'] button.cur").attr("value");
    $("#form-select option").each(function(){
        if($(this).attr("isNoFrameSteelPiece")==1&&framework=='No'||($(this).attr("isNoFrameSteelPiece")!=1&&framework=='Yes')){
            $(this).show();
        }else{
            $(this).hide();
        }
    });
    if(framework=='Yes'){
        $("#customizedSize").hide();
    }else{
        $("#customizedSize").show();
    }
    /*飞针测试初始化*/
    if($("[divname='testProduct-pcb-div'] .cur").length<=0){
        if($("[divname='stencil-layer-pcb-div'] .cur").val()==4||$("[divname='stencil-layer-pcb-div'] .cur").val()==6){
            $("#fullyTest").addClass('cur').siblings("button").removeClass('cur');
            $("#randomTest").hide();
            $("#noTest").hide();
        }
    }
    if($("[divname='stencil-layer-pcb-div'] .cur").val()==4||$("[divname='stencil-layer-pcb-div'] .cur").val()==6){
        $("#randomTest").hide();
        $("#noTest").hide();
    }
    /*飞针测试初始化---end*/
    /*处理阻焊初始化*/
    if($("[divname='stencil-layer-pcb-div'] .cur").val()==4||$("[divname='stencil-layer-pcb-div'] .cur").val()==6){
        $("#Impedance").show();
    }else{
        $("#Impedance").hide();
    }
    if($("[divname='stencil-layer-pcb-div'] .cur").val()==4){
        $("#impedanceVal").append('<option value="JLC7628">JLC7628</option>');
        if(parseFloat($("[divname='thickness-pcb-div'] button.cur").val())>=0.8&&parseFloat($("[divname='thickness-pcb-div'] button.cur").val())<2){
            $("#impedanceVal").append('<option value="JLC2313">JLC2313</option>');
        }
    }
    if($("[divname='stencil-layer-pcb-div'] .cur").val()==6){
        if(parseFloat($("[divname='thickness-pcb-div'] button.cur").val())>=1.2){
            $("#impedanceVal").append('<option value="JLC2313">JLC2313</option>');
        }
    }
    /*处理阻焊---end*/
})
//默认值
function onCleanInput() {

    $("input[name='stencilLength']").val(100);

    $("input[name='stencilWidth']").val(100);

    $("#right-stencilLength").html(100);

    $("#right-stencilWidth").html(100);

    $("input[name='stencilNumber']").val(1);

    $("input[name='sestencilCountX']").val("");

    $("input[name='sestencilCountY']").val("");

    $("input[name='isShowSteelmesh']").removeAttr("checked");
}

//元素添加点击事件
function onClick() {

    //板层
    $("[divname='stencil-layer-pcb-div'] button").click(function () {
        /*处理飞针测试*/
        if($(this).val()==4||$(this).val()==6){
            $("#fullyTest").addClass('cur').siblings("button").removeClass('cur');
            $("#randomTest").hide();
            $("#noTest").hide();
        }else{
            checkTest=true;//是否检查飞针测试
        }
        /*处理阻焊*/
        $("[divname='impedance-pcb-div'] button:first-child").addClass("cur").siblings("button").removeClass("cur");
        $("#impedanceVal").hide();
        $("#impedanceVal").empty();
        if($(this).val()==4||$(this).val()==6){
            $("#Impedance").show();
        }else{
            $("#Impedance").hide();
        }
        if($(this).val()==4){
            $("#impedanceVal").append('<option value="JLC7628">JLC7628</option>');
            if(parseFloat($("[divname='thickness-pcb-div'] button.cur").val())>=0.8&&parseFloat($("[divname='thickness-pcb-div'] button.cur").val())<2){
                $("#impedanceVal").append('<option value="JLC2313">JLC2313</option>');
            }
        }
        if($(this).val()==6){
            if(parseFloat($("[divname='thickness-pcb-div'] button.cur").val())>=1.2){
                $("#impedanceVal").append('<option value="JLC2313">JLC2313</option>');
            }
        }

        onCheck(this,"changeAchieveDate");
    });

    //板厚
    $("[divname='thickness-pcb-div'] button").click(function () {
        /*处理阻焊*/
        $("[divname='impedance-pcb-div'] button:first-child").addClass("cur").siblings("button").removeClass("cur");
        $("#impedanceVal").hide();
        $("#impedanceVal").empty();
        if($("[divname='stencil-layer-pcb-div'] .cur").val()==4){
            $("#impedanceVal").append('<option value="JLC7628">JLC7628</option>');
            if(parseFloat($(this).val())>=0.8&&parseFloat($(this).val())<2){
                $("#impedanceVal").append('<option value="JLC2313">JLC2313</option>');
            }
        }
        if($("[divname='stencil-layer-pcb-div'] .cur").val()==6){
            if(parseFloat($(this).val())>=1.2){
                $("#impedanceVal").append('<option value="JLC2313">JLC2313</option>');
            }
        }
        onCheck(this);
    });
    //4，6层板阻焊方式
    $("[divname='impedance-pcb-div'] button").click(function () {
        if($(this).val()=="Yes"){
            $("#impedanceVal").show();
            if($("[divname='stencil-layer-pcb-div'] .cur").val()==4){
                $("#impedanceVal").val("JLC7628");
            }
            if($("[divname='stencil-layer-pcb-div'] .cur").val()==6){
                $("#impedanceVal").val("JLC2313");
                $("[divname='adorn-color-pcb-div'] button:first-child").siblings("button").attr("disabled","disabled");
            }
        }else{
            $("#impedanceVal").hide();
            $("#impedanceVal").val("");
        }
        onCheck(this,"changeAchieveDate");
    });
    /*值改变*/
    $("#impedanceVal").on("change",function () {
        if($(this).val()=="JLC2313"){
            $("[divname='adorn-color-pcb-div'] button:first-child").siblings("button").attr("disabled","disabled");
        }else{
            $("[divname='adorn-color-pcb-div'] button").removeAttr("disabled");
        }
        encapsulationForm();//计算价格
        console.log(222)
    });
    //阻焊颜色
    $("[divname='adorn-color-pcb-div'] button").click(function () {
        showUrgent(this);
    });

    //焊盘喷镀
    //HASL(with lead)LeadFree:有铅喷锡, HASL-RoHS:无铅喷锡,ENIG-RoHS:沉金
    $("[divname='adorn-put-pcb-div'] button").click(function () {
        onCheck(this);
    });

    //铜厚
    $("[divname='cuprum-thickness-pcb-div'] button").click(function () {
        onCheck(this);
    });

    //金手指斜边
    $("[divname='gold-finger-bevel-pcb-div'] button").click(function () {
        onCheckGoldFingers(this);
        // onCheckGoldFingers(this)
    });

    //是否绑定发货
    $("[divname='bind-delivery-pcb-div'] button").click(function () {
        onCheck(this);
    });
    //工艺边
    $("[divname='needTechnics-pcb-div'] button").click(function () {
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
        if (sestencilCountX == null || sestencilCountX == undefined || sestencilCountX == "") {
            sestencilCountX = 1;
        }
        if (sestencilCountY == null || sestencilCountY == undefined || sestencilCountY == "") {
            sestencilCountY = 1;
        }
        //debugger;
        $(".sestencilCountX").html(sestencilCountX);
        $(".sestencilCountY").html(sestencilCountY);
        /*工艺边*/
        if($(this).val()=='0'){
            /*不需要工艺边*/
            $(".hasEdgeRailsX,.hasEdgeRailsY").hide();
            $(".sestencilCountXshow,.sestencilCountYshow").show();
            $(".pcbFaqsSestencilCountX").html(parseInt(sestencilCountX * xCount));
            $(".pcbFaqsSestencilCountY").html(parseInt(sestencilCountY * yCount));
        }else{
            /*需要工艺边*/
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
        }
        onCheck(this);
    });
    //测试
    $("[divname='testProduct-pcb-div'] button").click(function () {
        onCheck(this);
    });
    //半孔
    $("[divname='halfHole-pcb-div'] button").click(function () {
        if ($(this).val() == 'no') {
            $("[divname='halfHoleNumber-pcb-div'] button.cur").removeClass('cur');
            $("#halfHoleNumber").css({"display": "none"});
        } else {
            $("#halfHoleNumber").css({"display": "inline-block"});
        }
        onCheck(this);
    });
    //半孔数
    $("[divname='halfHoleNumber-pcb-div'] button").click(function () {
        onCheck(this);
    });
    //不同拼版款数
    $("[divname='panelized-pcbs-pcb-div'] button").click(function () {

        isInpurStencilNumber(this);

        onCheck(this);
    });

    //由嘉立创拼版
    $("[divname='panel-by-jlcpcb-pcb-div'] button").click(function () {

            //获取PCB 长和宽
            var stencilWidth = $("input[name='stencilWidth']").val() + 'mm';
            var stencilLength = $("input[name='stencilLength']").val() + 'mm';
            $("span[name='stencilWidthShowOne']").html(stencilWidth);
            $("span[name='stencilLengthShowOne']").html(stencilLength);

        isInpurStencilCount(this);

        onCheck(this);
    });

    //钢网
    //选择有无边框
    $("[divname='Framework-div'] button").click(function () {
        //切换select内容
        var framework=$(this).attr("value");
        var firstVal=true;//选中第一个值
        $(".form-select option").each(function(){
            if($(this).attr("isNoFrameSteelPiece")==1&&framework=='No'||($(this).attr("isNoFrameSteelPiece")!=1&&framework=='Yes')){
                $(this).show();
                if(firstVal){
                    firstVal=false;
                    $(".form-select").val($(this).val());
                    getLengthAndWidth(document.getElementsByName("steelmeshSellingPriceRecordNum"));
                }
            }else{
                $(this).hide();
            }
        });
        if(framework=='Yes'){
            $("#customizedSize").hide();
        }else{
            $("#customizedSize").show();
        }
        onCheck(this);
    });

    //抛光工艺 No不收费 yes收费
    $("[divname='polishing-process-pcb-div'] button").click(function () {
        onCheck(this);
    });

    //钢网MARK
    $("[divname='steel-choose-mark-pcb-div'] button").click(function () {
        onCheck(this);
    });

    //开钢网
    $("[divname='steel-choose-side-pcb-div'] button").click(function () {
        //获取选择之前的值，再获取选择之后的值，比较是否一样，不一样才乘以2
        var beforeValue = $("[divname='steel-choose-side-pcb-div']").find(".cur").val();
        onCheck(this);
        var afterValue = $("[divname='steel-choose-side-pcb-div']").find(".cur").val();
        if(beforeValue != afterValue){
            changeStencilQty(this);
        }
    });

    //pinkuan
    $("[divname='stencilNumber-pcb-div'] button").click(function () {
        onCheck(this);
    });


    //选择板子数量
    $("#form-selectqty ul li").click(onChangePcbNumber);

    // 比较PCB长宽和钢网长宽
    function getPCBAndGWByLendthAndWidth() {
        //一个PCB长和宽
        var xCount = $("input[name='stencilWidth']").val();
        var yCount = $("input[name='stencilLength']").val();
        //拼版长和宽个数
        var sestencilCountX = $("input[name='sestencilCountX']").val();
        var sestencilCountY = $("input[name='sestencilCountY']").val();
        // 初始化 拼版长和宽个数
        if (sestencilCountX == null || sestencilCountX == undefined || sestencilCountX == "") {
            sestencilCountX = 1;
        }
        if (sestencilCountY == null || sestencilCountY == undefined || sestencilCountY == "") {
            sestencilCountY = 1;
        }
        if (parseInt(sestencilCountX * xCount) <= parseInt(sestencilCountY * yCount)) {
            $("#pcbFaqsSestencilCountX").html('X : ' + parseInt(parseInt(sestencilCountX * xCount) + 10) + "mm");
            $("#pcbFaqsSestencilCountY").html('Y : ' + parseInt(sestencilCountY * yCount) + "mm" + "&nbsp;&nbsp;&nbsp;&nbsp;<font color='red'>The size contains 10mm board edge </font>");
        } else {
            $("#pcbFaqsSestencilCountY").html('Y : ' + parseInt(sestencilCountY * yCount + 10) + "mm" + "&nbsp;&nbsp;&nbsp;&nbsp;<font color='red'>The size contains 10mm board edge </font>");
            $("#pcbFaqsSestencilCountX").html('X : ' + parseInt(sestencilCountX * xCount) + "mm");
        }
    }

    // 联动
    $("input[name='stencilWidth']").blur(function () {
        $(".stencilWidthShow").html($(this).val() + 'mm');
        getPCBAndGWByLendthAndWidth();
        encapsulationForm();
    });

    $("input[name='stencilLength']").blur(function () {
        $(".stencilLengthShow").html($(this).val() + 'mm');
        getPCBAndGWByLendthAndWidth();
        encapsulationForm();
    });

    $("[divname='customized-size-pcb-div'] button").click(function () {
        onCheck(this);
        var val = $(this).val();
        if (val == '0') {
            var specification=$('[name="steelmeshSellingPriceRecordNum"]').find("option:selected").attr("specification").split("*");
            $(".specificationLength").html(specification[0]+"mm");
            $(".specificationWidth").html(specification[1]+"mm");
            $("#showModal").modal("show");
        }

    });

}
//选择top & bottom(separate) ” 这项时，将stencil Qty 乘以2
function changeStencilQty(obj) {
    var value = $(obj).val();
    if (value == 'Top & Bottom(On Separate Stencil)'){
        var num = $("input[name='purchaseNumber']").val() * 2;
        $("input[name='purchaseNumber']").val(num);
        $("input[name='purchaseNumber']").keyup();
    }
}
//是否由嘉立创拼版
function isInpurStencilCount(obj) {

    var val = $(obj).val();

    var parent = $(obj).parent();

    var hideSpan = parent.find("span");

    //增加输入框
    if (val == "Yes") {

        hideSpan.show();
        $(".pcbFaqsShow,.needTechnics").show();
        $(".sestencilCountXshow,.sestencilCountYshow,.hasEdgeRailsX,.hasEdgeRailsY").hide();//隐藏拼版值
        //当input框从隐藏恢复的时候，会将 显示的值清空，这个时候需要重新取下value标签的值
        $("input[name='sestencilCountX']").val($("input[name='sestencilCountX']").attr("value"));
        $("input[name='sestencilCountY']").val($("input[name='sestencilCountY']").attr("value"));
        var stencilWidth = $("input[name='stencilWidth']").val();
        var stencilLength = $("input[name='stencilLength']").val() ;
        $(".pcbFaqsSestencilCountX,.stencilWidth").html(stencilWidth);
        $(".pcbFaqsSestencilCountY,.stencilLength").html(stencilLength);
    } else {

        hideSpan.find("input").val("");

        hideSpan.hide();
        $(".pcbFaqsShow,.needTechnics").hide();
    }

    $("#forExamplePic").hide();
}


//是否输入不同拼版款数
function isInpurStencilNumber(obj) {

    var val = $(obj).val();

    var parent = $(obj).parent();

    var hideInput = parent.find("input");

    //增加输入框
    if (val == "Yes") {

        hideInput.show();

        $("#right-stencil-number-li").show();

        $("#right-stencilNumber").html(hideInput.val());

    } else {

        hideInput.hide();

        $(hideInput).val("1");

        $("#right-stencil-number-li").hide();
    }

}


//只能输入整数
function inputNumber(obj) {

    obj.value = obj.value.replace(/[^\d]/g, "");

    var name = $(obj).attr("name");

    $("#right-" + name).html(obj.value);

    exchange.getMoneyHtml($("#right-" + name));
    encapsulationForm();

}
//只能输入整数且不为0
function inputNumberAndNotZero(obj) {
    var parnt = /^[1-9]\d*$/;
    if (!parnt.exec(obj.value)) {
        obj.value = "";
    }
    var name = $(obj).attr("name");
    $("#right-" + name).html(obj.value);
    exchange.getMoneyHtml($("#right-" + name));
}
//只能输入小数
function inputFloat(obj) {

    obj.value = obj.value.replace(/[^\d\.]/g, "");

    var name = $(obj).attr("name");

    $("#right-" + name).html(obj.value);

    exchange.getMoneyHtml($("#right-" + name));


}
//只能输入小数且不为0
function inputFloatAndNotZero(obj) {
    var parnt = /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[0-9])$/;
    if (!parnt.exec(obj.value)) {
        obj.value = "";
    }
    var name = $(obj).attr("name");
    $("#right-" + name).html(obj.value);
    exchange.getMoneyHtml($("#right-" + name));

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
    if (sestencilCountX == null || sestencilCountX == undefined || sestencilCountX == "") {
        sestencilCountX = 1;
    }
    if (sestencilCountY == null || sestencilCountY == undefined || sestencilCountY == "") {
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
}
//判断焊盘喷镀
function onCheckSurfaceFinish(obj) {
    var adornPutValue = $(obj).val();

    if (adornPutValue != 'ENIG-RoHS') {
        var goldFingerBevel = $("input[name='goldFingerBevel']").first();
        goldFingerBevel = goldFingerBevel.parent().children().first();
        goldFingerBevel.nextAll().removeClass("cur");
        goldFingerBevel.addClass("cur");
        goldFingerBevel.nextAll().css('background','url()');
        goldFingerBevel.css('background', ' right bottom no-repeat #fff url(../images/home-icon-cur.a1425b7e.png)');
    }
    $(obj).nextAll().removeClass("cur");
    $(obj).prevAll().removeClass("cur");
    $(obj).addClass("cur");
    encapsulationForm();
}

//判断金手指是否可选
function onCheckGoldFingers(obj) {
    var goldFingersValue = $(obj).val();
    if (goldFingersValue != 0) {
        var adornPut = $("input[name='adornPut']");
        var adornPutValue = adornPut.val();
        if (adornPutValue != 'ENIG-RoHS') {
            alert('Note:\n' +
                'Fingers will be with gold only when  ENIG is chosen. Or they will be covered with tin if HASL is chosen.\n' +
                'Please check the "ENIG-RoHS"option when choose Gold  Fingers.');
        }
    }
    onCheck(obj);
}
//封装表单
function encapsulationForm(changeAchieveDate) {

    //下拉列表
    $("[selectname$='pcb-select']").each(function () {

        var text = $(this).find("option:checked").text();

        //writeRigth($(this).attr("name"),text);
    });

    //button
    $("[divname$='pcb-div']").each(function () {

        //默认选中的值
        var val = $(this).find(".cur").val();

        //隐藏域inputName
        var name = $(this).attr("inputname");

        if (name == null || name.length == 0) {
            return;
        }

        //input元素
        var hideObj = $(this).find("[name='" + name + "']");

        //input元素存在
        if (hideObj.length > 0) {
            //要保证不为空
            if (val) {
                hideObj.val(val);
            } else {
                hideObj.val('');
            }
        } else {
            //自动创建
            if(!val){
                val='';
            }
            var hideInput = "<input type='hidden' name='" + name + "' value='" + val + "' />";

            $(this).append(hideInput);

        }

        //writeRigth(name,$(this).find(".cur").text());

    });
    /*是否是修改板层和数量，否则去掉交期*/
    if(changeAchieveDate&&changeAchieveDate=="changeAchieveDate"){
        $("input[name='achieveDate']:checked").removeAttr("checked");
    }
    window.setTimeout(function(){
        calculationCosts();
    },100)
}


//左右联动
function writeRigth(name, value) {

    $("#right-" + name).html(value);
}

//计算费用
function calculationCosts() {
    $(".order-position").addClass("home-orderadd-loading");//蒙板
    $.ajax({

        url: baseRoot() + "/quote/calculationCosts",

        dataType: "json",

        type: "post",

        data: $("#pcbValuationForm").serialize(),

        async: true,

        success: function (response) {
            $(".order-position").removeClass("home-orderadd-loading");//蒙板
            if(checkTest){
                checkTest=false;
                //var jsonData = JSON.stringify(response.customerOrderDetail);
                if ($("[divname='stencil-layer-pcb-div'] .cur").val() == 1 || $("[divname='stencil-layer-pcb-div'] .cur").val() == 2) {
                    if (response.orderType == 'example') {
                        $("#randomTest").hide();
                        $("#noTest").show();
                    }
                    if (!$("#fullyTest").hasClass('cur') && response.orderType == 'example') {
                        $("#randomTest").removeClass('cur').hide();
                        $("#noTest").show();
                        $("#fullyTest").addClass('cur').siblings("button").removeClass('cur');
                        $("[divname='testProduct-pcb-div']").prepend($("#fullyTest"));
                        encapsulationForm();//封装表单，重新计价
                    }
                    if (response.orderType == 'batch') {
                        $("#noTest").hide();
                        $("#randomTest").show();
                    }
                    if (!$("#randomTest").hasClass('cur')&&response.orderType == 'batch') {
                        $("#noTest").removeClass('cur').hide();
                        $("#randomTest").show();
                        $("#randomTest").addClass('cur').siblings("button").removeClass('cur');
                        $("[divname='testProduct-pcb-div']").prepend($("#randomTest"));
                        encapsulationForm();//封装表单，重新计价
                    }
                }
            }
            //PCB特价
            var isSpecial=response.isSpecial;
            if (isSpecial){
                //特价版
                $("#spanidone").html("Special Offer:");
            }else{
                //普通版
                $("#spanidone").html("Engineering Fee:");
            }


            $("#right-currentTime").html(response.GMT8 + " GMT +8");

            $("#orderTotalWeight").html(response.orderTotalWeight + "g");
            var noFullSizeX=$('input[name="noFullSizeX"]').val();
            var noFullSizeY=$('input[name="noFullSizeY"]').val();
            /*判断长宽是否超出*/
            if(noFullSizeX<noFullSizeY){
                var mid=noFullSizeX;
                noFullSizeX=noFullSizeY;
                noFullSizeY=mid;
            }
            //计价类型
            var type = response.calculationCostsType;

            //pcb
            if ("1" == type) {

                pcbBack(response);
            } else if ("2" == type) {

                pcbgwBack(response);
                $("#right-steelmesh-div li").show();
                if(noFullSizeX<140&&noFullSizeY<130&& $("[divname='customized-size-pcb-div'] button.cur").val()=='0'){
                    $("#orderTotalWeight").html(response.steelWeight*response.steelmeshOrderRecord.purchaseNumber*1000+response.pcbWeigth*1000 + "g");
                }
            } else {
                /*钢网*/
                gwBack(response);
                $("#right-steelmesh-div li").show();
                if(noFullSizeX<140&&noFullSizeY<130&& $("[divname='customized-size-pcb-div'] button.cur").val()=='0'){
                    $("#orderTotalWeight").html(response.steelWeight*response.steelmeshOrderRecord.purchaseNumber*1000 + "g");
                }
            }


            if (response.orderShippingVoList) {
                eachExpressFlag(response.orderShippingVoList);
            }
        }
    });
}
//拼接快递项
function eachExpressFlag(orderShippingVoList){
    var orderShippingVo ={};
    $(".buildList").html('');
    for(var i=0;i<orderShippingVoList.length;i++){
        //console.log(orderShippingVoList);
        if(orderShippingVoList[i].cost){
            $(".buildList").append('<li class="clearfix ng-scope">'+
                '<label class="normal">'+
                '<input ' + (orderShippingVoList[i].select ? 'checked' : '') + ' class="mt0 ver " type="radio" name="type-expedited"    data-days="' + orderShippingVoList[i] + '" data-fare="Standard Shipping" value="' + orderShippingVoList[i].options + '">' +
                '&nbsp<strong class="ng-binding font16 shipping">' + orderShippingVoList[i].showOptions + '</strong>&nbsp&nbsp' +
                '<strong class="ng-binding font16 orange money changeMoneyShipping">' + orderShippingVoList[i].cost + '</strong></label>' +
                '<p class="color9 font14 ml15">'+orderShippingVoList[i].day+'</p>'+
                '</li>');
        }
       if(orderShippingVoList[i].select){
        orderShippingVo=orderShippingVoList[i];
       }
    }
    /*转化金额单位*/
    if (orderShippingVoList.length > 0) {
        $(".changeMoneyShipping").each(function () {
            exchange.getMoneyHtml($(this));
        });
    }
    if (orderShippingVo.cost) {
        /*有选中国家*/
        $(".Shipping_fare").html('$' + orderShippingVo.cost);
       $(".shipping_express").html(orderShippingVo.showOptions);
       $(".Shipping-time").html(orderShippingVo.day);
        exchange.getMoneyHtml($("#right-shipping"));
    }



}


    $(".downOpenIcon").on('click',function(){
        $(".mask").fadeIn(1000);
        $(".openDiv1").fadeIn(1000);
        // 获取单选框选中的项展示页面
        //获取金钱和时间的参数
        var shippingTime=$(".Shipping-time");
        console.log(shippingTime);
        var shippingMoney=$(".Shipping_fare");
        console.log(shippingMoney);
        var radioMoney,radioDay;
//        获取选中的值
        $('.buildList input[type="radio"]').on("click",function(){
            if($('.buildList input[type="radio"]:checked')){
                var $this=$(this);
                radioMoney=$this.attr("data-fare");
                radioDay=$this.attr("data-days");
                console.log(radioMoney+"--"+radioDay);
            }
        });

        $(".closeOpenDiv1").off().on('click',function(){
            $(".mask").fadeOut(1000);
            $(".openDiv1").fadeOut(1000);
            shippingTime.text(radioDay);
            shippingMoney.text(radioMoney);
        });
    });

//pcb
function pcbBack(response) {
    //总费用
    var dummyMoney = response.orderCountTolls.dummyMoney;
    /*不是数值*/
    if (isNaN(dummyMoney)||!dummyMoney) {
        dummyMoney = 0
    }
    //var count = response.customerOrderDetail.stencilCounts;

    $("#dummyMoney").html("$" + dummyMoney.toFixed(2));
    exchange.getMoneyHtml($("#dummyMoney"));

    //$("#totalPrice").html("$"+dummyMoney.toFixed(2));

    //$("#unitPrice").html("$"+(dummyMoney/count).toFixed(2));

    /* $("input[name='achieveDate']").each(function(){

     var ad = $(this).val();

     for(var i=0;i<response.achieveDateList.length;i++){

     var tempAd = response.achieveDateList[i];

     if(ad == tempAd.value){

     $(this).parent().parent().find("b").html("$"+tempAd.price.toFixed(2));

     $(this).prop("checked",tempAd.checked);

     break;
     }
     }

     /!* if(response.orderType=="batch"&&ad=="24"){
     $(this).parent().parent().hide();
     var checkVal = $("input[name='achieveDate']:checked").val();
     if(checkVal=="24"){
     $("input[name='achieveDate']").first().prop("checked","checked");
     }
     }else if(response.orderType=="example"&&ad=="24"&&$("input[name='adornColor']").val()=="Green"){
     $(this).parent().parent().show();
     }*!/
     });*/

    //费用展示
    initOrderMoney(response.orderCountTolls);

    onInitAchieveDate(response.achieveDateList);
}

//钢网
function gwBack(response) {

    var dummyMoney = response.steelmeshOrderMoney;
    /*不是数值*/
    if (isNaN(dummyMoney)||!dummyMoney) {
        dummyMoney = 0
    }
//    var count = response.steelmeshOrderRecord.purchaseNumber;

    $("#dummyMoney").html("$" + dummyMoney.toFixed(2));
    exchange.getMoneyHtml($("#dummyMoney"));
    $("#stenciltotalPrice").html("$" + dummyMoney.toFixed(2));

    exchange.getMoneyHtml($("#stenciltotalPrice"));

    //$("#stencilunitPrice").html("$"+(dummyMoney/count).toFixed(2));
}

//pcb+钢网
function pcbgwBack(response) {

    //pcb总费用
    var pcbMoney = response.orderCountTolls.dummyMoney;
    //var count = response.customerOrderDetail.stencilCounts;

    //钢网
    var stMoney = response.steelmeshOrderMoney;
    var stCount = response.steelmeshOrderRecord.purchaseNumber;
    /*不是数值*/
    if (isNaN(pcbMoney)||!pcbMoney) {
        pcbMoney = 0
    }
    if (isNaN(stMoney)||!stMoney) {
        stMoney = 0
    }
    if (isNaN(stCount)||!stCount) {
        stCount = 0
    }
    $("#dummyMoney").html("$" + (pcbMoney + stMoney).toFixed(2));
    exchange.getMoneyHtml($("#dummyMoney"));
    $("#stenciltotalPrice").html("" + stMoney.toFixed(2));

    exchange.getMoneyHtml($("#stenciltotalPrice"));

    //$("#stencilunitPrice").html("$"+(stMoney/stCount).toFixed(2));

    //$("#totalPrice").html("$"+pcbMoney.toFixed(2));

    //$("#unitPrice").html("$"+(pcbMoney/count).toFixed(2));

    /* $("input[name='achieveDate']").each(function(){

     var ad = $(this).val();

     for(var i=0;i<response.achieveDateList.length;i++){

     var tempAd = response.achieveDateList[i];

     if(ad == tempAd.value){

     $(this).parent().parent().find("b").html("$"+tempAd.price);

     $(this).prop("checked",tempAd.checked);

     break;
     }
     }

     });*/
    initOrderMoney(response.orderCountTolls);
    onInitAchieveDate(response.achieveDateList);
}

//选中样式
function onCheck(obj,changeAchieveDate) {


    $(obj).nextAll().removeClass("cur");

    $(obj).prevAll().removeClass("cur");

    $(obj).addClass("cur");

    //板层
    /*  var val = $(obj).val();
     var stencilLayer = $(obj).parent().attr("inputname");
     if("stencilLayer"==stencilLayer){
     if(val==4||val==6){
     $("input[name='achieveDate']").val("96");
     $("#achieveDateID").html("4-5 days");
     }else{
     $("input[name='achieveDate']").val("72");
     $("#achieveDateID").html("3-4 days");
     }
     }*/
    encapsulationForm(changeAchieveDate);
}

//钢网是否展示
function onShowSteelmesh() {

    var check = $("input[name='isShowSteelmesh']").is(":checked");

    var type = $("#calculationCostsType").val();

    $("#right-purchaseNumber").html($("input[name='purchaseNumber']").val());

    if (type == 3) {
        $("#right-steelmesh-div").show();
    } else if (check) {

        $("#steelmesh-div").show();

        $("#pcb-help").hide();

        $("#right-steelmesh-div").show();

        //pcb和钢网
        $("#calculationCostsType").val(2);

    } else {

        $("#steelmesh-div").hide();

        $("#pcb-help").show();

        $("#right-steelmesh-div").hide();

        //pcb单独
        $("#calculationCostsType").val(1);
    }

    encapsulationForm();
}


//选择板子数量
function onChangePcbNumber() {

    var number = $(this).find("button").attr("value");

    oninputStencilCounts(number);

}

//输入其他：提交
function onOther() {

    var other = $("#exampleInputEmail1").val();

    if (other == null || other.length == 0) {
        other = 500;
    }

    oninputStencilCounts(other);

}

function oninputStencilCounts(number) {

    var html = "<span class=\"glyphicon glyphicon-triangle-bottom\" aria-hidden=\"true\"></span>";

    $("#sel-btn").html(number + html);

    $("#form-selectqty").slideToggle();

    $("#stencilCounts").val(number);

    checkAreaManyTooBig();//校验面积是否超过50平方米
    //writeRigth("stencilCounts",number);
    checkTest=true;//是否检查飞针测试
    encapsulationForm("changeAchieveDate");
}

//工艺说明
$(function () {
    $("a.pcbFaqs").each(function () {

        var key = $(this).attr("pcbFaqs");

        if (key == null || key.length == 0) {
            return;
        }

        if (key == "Half-cut/Castellated Holes") {
            key = "HalfCutCastellatedHoles";
        }

        $(this).attr("href", baseRoot() + "/quote/pcbOrderFaq/" + key);
    });
});

//加急限制
function showUrgent(obj) {

    /*    var color = $(obj).val();

     if("Green" == color){

     $("#achieveDateUl li").show();
     }else{

     $("#achieveDateUl li").each(function(index){
     if(index!=0){
     $(this).hide();
     }
     });
     var firstDate = $("input[name='achieveDate']:first");
     if(!firstDate.is(":checked")){
     $("input[name='achieveDate']").removeAttr("checked");
     $("input[name='achieveDate']:first").attr("checked","checked");
     }
     }*/

    onCheck(obj);
}

/*$(function(){
 $("#achieveDateUl li").each(function(index){
 if(index!=0){
 $(this).hide();
 }
 });
 });*/

function showForExample(type) {
    if ("over" == type) {
        $("#forExamplePic").show();
    } else {
        $("#forExamplePic").hide();
    }
}

function showForExampleStencilNumber(type) {
    if ("over" == type) {
        $("#forExampleStencilNumberPic").show();
    } else {
        $("#forExampleStencilNumberPic").hide();
    }
}

//动态添加交期
function onInitAchieveDate(achieveDateList) {
    var ul = $("#achieveDateUl");
    var achievePrice = 0;
    if (achieveDateList.length > 0) {
        ul.empty();
        ul.append("<h5>Build Time:</h5>");
        for (var i = 0; i < achieveDateList.length; i++) {
            var tempAd = achieveDateList[i];
            var price = tempAd.price;
            if (typeof(price) == "undefined") {
                price = "0.00";
            }
            var checked = tempAd.checked;
            if (typeof(checked) == "undefined") {
                checked = "";
            }
            var showVal = tempAd.value;
            var name = tempAd.name;
            var limitA = "limit_a_" + showVal;
            if (checked == "") {
                var temp = "<li class='clearfix' style='line-height: 22px;'><a name='" + limitA + "' href='javascript:void(0);'><label>";
                temp += "<input type='radio' name='achieveDate' value='" + showVal + "'> <span id='achieveDateID'>" + name + "</span>";
                temp += "</label><span><b class='changeMoneyLoad'>$" + price + "</b></span></a></li>";
                ul.append(temp);
            } else {
                var temp = "<li class='clearfix' style='line-height: 22px;'><a name='" + limitA + "' href='javascript:void(0);'><label>";
                temp += "<input type='radio' checked='" + checked + "' name='achieveDate' value='" + showVal + "'> <span id='achieveDateID'>" + name + "</span>";
                temp += "</label><span><b  class='changeMoneyLoad'>$" + price + "</b></span></a></li>";
                ul.append(temp);
                achievePrice = price;
            }
        }
        ul.append("<p id='orderLimitMsg' style='color:red;'></p>");
    }else{
        ul.empty();
        ul.append("<h5>Build Time:</h5>");
        ul.append("<p id='orderLimitMsg' style='color:red;'></p>");
    }
    //validatePcbOrderLimit(achievePrice);
    //交期
    $("input[name='achieveDate']").click(function () {
        encapsulationForm();
    });

    $('.changeMoneyLoad').each(function () {
        exchange.getMoneyHtml(this);
    });
}

//碟订单加急限制
function validatePcbOrderLimit(price) {
    var allAchieveDate = "";
    $("input[name='achieveDate']").each(function (index) {
        if (index + 1 == $("input[name='achieveDate']").length) {
            allAchieveDate += $(this).val();
        } else {
            allAchieveDate += $(this).val() + ",";
        }
    });
    var tempInput = $("input[name='allAchieveDate']");
    if (tempInput != "" && tempInput.length > 0) {
        tempInput.val(allAchieveDate);
    } else {
        $("#pcbValuationForm").append("<input type='hidden' name='allAchieveDate' value='" + allAchieveDate + "'/>");
    }

    $.ajax({
        url: baseRoot() + "/pcborder/limit/validatePcbOrderLimit",
        dataType: "json",
        type: "post",
        data: $("#pcbValuationForm").serialize(),
        success: function (result) {
            var ad = allAchieveDate.split(",");
            for (var i = 0; i < ad.length; i++) {
                var msg = result[ad[i]];
                var limitA = "limit_a_" + ad[i];
                if ("success" == msg) {
                    //$("#orderLimitMsg").html("");
                    $("a[name=" + limitA + "]").removeAttr("title");
                    $("a[name=" + limitA + "]").find("input").removeAttr("disabled");
                } else {
                    var checkedInput = $("input[name='achieveDate']:checked");
                    if (checkedInput.val() == ad[i]) {
                        checkedInput.removeAttr("checked");
                        var totalMoney = $("#totalPrice").text().substr(1, $("#totalPrice").text().length);
                        var calculationCostsType = $("#calculationCostsType").val();
                        if (calculationCostsType == 3) {
                            var steelMoney = $("#stenciltotalPrice").text().substr(1, $("#stenciltotalPrice").text().length);
                            $("#totalPrice").html("$" + (totalMoney - price + steelMoney));
                        } else {
                            $("#totalPrice").html("$" + (totalMoney - price));
                        }
                        $("#dummyMoney").html("$" + (totalMoney - price));
                        exchange.getMoneyHtml($("#dummyMoney"));
                        $("input[name='achieveDate']:first").prop("checked", "checked");
                    }
                    $("a[name=" + limitA + "]").attr("title", msg);
                    $("a[name=" + limitA + "]").find("input").attr("disabled", "disabled");
                    //$("#orderLimitMsg").html(msg);
                }
            }
        }
    });

    //交期
    $("input[name='achieveDate']").click(function () {
        encapsulationForm();
    });
}

//初始化订单费用
function initOrderMoney(orderCountTolls) {
    $("#right-pcb-div li").each(function (index) {
        var detail = $(this).attr("showOrderMoneyDetail");
        if (detail != null && detail.trim().length > 0) {
            var detailMoney = orderCountTolls[detail];
            if (detailMoney > 0) {
                $("#right-" + detail).html(detailMoney.toFixed(2));
                exchange.getMoneyHtml($("#right-" + detail));
                $(this).show();
            } else {
                $(this).hide();
            }
        } else {
            $(this).hide();
        }
    });
}
//输入长宽之后的校验（包括浮点数校验和面积校验）
function checkArea(obj) {
    inputFloat(obj);
    checkAreaManyTooBig();
}
//校验面积是否超过50平米
function checkAreaManyTooBig() {
    var flag = true;
    var stencilWidth = $("#stencilWidth").val();
    var stencilLength = $("#stencilLength").val();
    if(Number(stencilLength) && Number(stencilWidth)){
        var area = stencilLength * stencilWidth;
        var number = $("#stencilCounts").val();
        if(Number(number)){
            area = area * number;
        }
        if(area > 50*1000*1000 ){
            flag = false;
            //如果大于50平方米，提醒,并把数量设置最小的数字
            var minCount = $(".unitList li:first button").val();
            $("#sel-btn").html().replace(number,minCount)
            $("#sel-btn").html( $("#sel-btn").html().replace(number,minCount) );
            $("#stencilCounts").val(minCount);
            alert("The total area of one order cannot exceed 50 sq.m.,please place orders separately.");
        }
    }
    //如果选择数量超过200，提示小批量订单，请先打样验证再购买
    var num = $("#stencilCounts").val();
    if( Number(num) && num > 200 ){
        $("#numHint").html("We recommend you to prototype your PCBs before small batch PCB production.");
    }else{
        $("#numHint").html("");
    }
    return flag;
}
