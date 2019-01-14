var tabs = $('#tabwrap>a');
var contents = $('#contentwarp>div');

var edaParam='';
if(eadLink&&eadLink=='1'){
    edaParam='&eadLink=1'
}
$('.tab-stencil').click(function(){
    javascript:location.href=baseRoot()+'/quote?orderType=3'+edaParam;
})
$('.tab-pcb').click(function(){
    javascript:location.href=baseRoot()+'/quote?orderType=1'+edaParam;
})
//tabs.click(function () {
//    var cur = $(this);
//    var index = tabs.index(cur);
//    var selectedCls = 'cur';
//
//    if (!cur.hasClass(selectedCls)) {
//        // tab选中样式
//        tabs.removeClass(selectedCls);
//        cur.addClass(selectedCls);
//        // 显示content块
//        contents.hide();
//        contents.eq(index).show();
//
//        if(index==0){
//            javascript:location.href=baseRoot()+'/quote?orderType=1';
//
//            $("#right-pcb-div").show();
//
//            $("#right-steelmesh-div").hide();
//
//            $("input[name='isShowSteelmesh']").removeAttr("checked");
//
//            $("#achieveDateUl").show();
//            $("#achieveDateUl li").eq(0).find("input").prop("checked","checked");
//
//            //单独pcb
//            $("#calculationCostsType").val(1);
//            $("#errorMsg").hide();
//
//            onShowSteelmesh();
//        }else{
//
//
//            $("#right-pcb-div").hide();
//
//            $("#right-steelmesh-div").show();
//
//            $("#achieveDateUl").hide();
//
//            //单独钢网计价
//            $("#calculationCostsType").val(3);
//
//            $("#showUploadResultId").hide();
//            $("#errorMsg").show();
//        }
//        //初始化计算价格
//        encapsulationForm();
//    }
//});

$(function(){

    var tabType = $("#calculationCostsType").val();

    if(tabType=="3"){

        $('.tab-stencil').addClass('cur');

        //板层
        //$("#tabSmtStencil").click();
        $("[divname='stencil-layer-pcb-div'] button").eq(1).addClass("cur");


                $("#right-pcb-div").hide();

                $("#right-steelmesh-div").show();

                $("#achieveDateUl").hide();

                //单独钢网计价
                $("#calculationCostsType").val(3);

                $("#showUploadResultId").hide();
                $("#errorMsg").show();
                 $('.home-orderadd-pcb').hide();
                $('.home-orderadd-stencil').show();


    }else{
    $('.tab-pcb').addClass('cur');
        $("#right-pcb-div").show();

                    $("#right-steelmesh-div").hide();

                    $("input[name='isShowSteelmesh']").removeAttr("checked");

                    $("#achieveDateUl").show();
//                    $("#achieveDateUl li").eq(0).find("input").prop("checked","checked");

                    //单独pcb
                    $("#calculationCostsType").val(1);
                    $("#errorMsg").hide();

                    onShowSteelmesh();
    }

    onClick();

    //初始化计算价格
    encapsulationForm();

});