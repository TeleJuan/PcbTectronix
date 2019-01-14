
$(function(){
    var loopTime_home=document.getElementById("loopTime_home");
    var loopTime=10000;
    //如果在数据库中没有查询到轮播图信息
    if(loopTime_home!=undefined&&loopTime_home!=null){
         loopTime=parseInt($(loopTime_home).val());
    }
    /*新轮播方式*/
    $(".bannerbox .hd li").on("mouseover",function(){
        $(this).addClass("on").siblings("li").removeClass("on");
        //$(".bannerbox .bd li").fadeOut(500);
        $(".bannerbox .bd li").eq($(this).index()).fadeIn(300).siblings("li").fadeOut(500);
    });
    window.setInterval(function(){
        var index=$(".bannerbox .hd li.on").index();
        if(index==2){
            index=0;
        }else{
            index++;
        }
        $(".bannerbox .hd li").eq(index).addClass("on").siblings("li").removeClass("on");
        $(".bannerbox .bd li").eq(index).fadeIn(300).siblings("li").fadeOut(500);
    },10000);
    /*旧轮播方式*/
    //jQuery(".bannerbox").slide({ mainCell: ".bd ul", autoPlay: true, effect:"fold",delayTime: 500,interTime:loopTime });
    jQuery(".homecont-scroll").slide({ titCell: ".hd1 ul", mainCell: ".bd1 ul", autoPage: true, effect: "left", autoPlay: false, vis: 2 });

    /*下拉框*/
    $(".selectNew").on("click",function(event){
        event.stopPropagation();
        $(".dropList").hide();
        $(this).siblings(".dropList").toggle();
    });
    $(".dropList li").on("click",function(event){
        event.stopPropagation();
        $(this).closest(".dropList").toggle();
        $(this).closest(".relative").find(".value").val($(this).attr("value"));
        $(this).closest(".relative").find(".form-control").val($(this).html());
    });
    $("body").on("click",function(){
        $(".dropList").hide();
    })
});


//隐藏form提交
function hideForm(url,method,target,param){

	var form = "<form action='"+url+"' method='"+method+"' target='"+target+"'>";

	if(param instanceof Array){

        for(var i=0;i<param.length;i++){

            var p = param[i];

            if(typeof(p) == "object"){

            	for(var k in p){

                    form +="<input type='hidden' name='"+k+"' value='"+p[k]+"' />";
				}

			}else{
                form +="<input type='hidden' name='"+p+"' value='"+p+"' />";
			}
        }

	}else if(typeof(param)=="object"){

		for(var k in param){

            form +="<input type='hidden' name='"+k+"' value='"+param[k]+"' />";

		}

	}else{

        form +="<input type='hidden' name='"+param+"' value='"+param+"' />";
	}

    form += "</form>";

	$("#hideFormContainerDiv").html(form);

    $("#hideFormContainerDiv form").submit();

}

//退出系统
function clientIndexClearLogin(logoutUrl) {

    //if (confirm("是否要退出系统.? ")) {

        window.top.location.href = logoutUrl;
    //}
}

//伸缩faq信息
function expand(obj,title){

    var nextDiv = $(obj).parent().parent().next();
    if(!$(nextDiv).is(":hidden")){
        $(nextDiv).hide();    //如果元素为隐藏,则将它显现
        obj.innerHTML = "+ expand";
    }else{
        $(nextDiv).show();     //如果元素为显现,则将其隐藏
        obj.innerHTML = "- hide";
    }
}

//伸缩所有faq信息
function expandAll(obj){

    if(obj.text=="Hide all"){
        obj.text="Expand all";
        $(".morefaq").each(function(i){
            this.style.display = "none";
        })
        $(".opena").each(function(i){
            this.innerHTML = "+ expand";
        })

    }else{

        obj.text="Hide all";
        $(".morefaq").each(function(i){
            this.style.display = "block";
        })
        $(".opena").each(function(i){
            this.innerHTML = "- hide";
        })
    }
}

//跳转在线计价
function toQuote(type,obj){

    if('1'==type){

        $("#toQuoteForm").submit();
    }else if('2'==type || '3'==type){//pcb or smt

        var param = [];

        var data = $(obj).prev().val().split(",");

        for(var i=0;i<data.length;i++){

            var o = {};

            var p = data[i].split(":");

            o[p[0]] = p[1];

            param.push(o);
        }

        hideForm(baseRoot()+"/quote","post","_blank",param);
    }
}

//跳转在线计价
function toSMTQuote(type){

    hideForm(baseRoot()+"/quote","post","_blank",{orderType:type});
}

//选择pcb or smt 面板
function onChangePCBorSMT(type){

    $("#pcb-smt-tab a").removeClass("cur");

    if(type=="3"){

        $("#SMTStencil").show();

        $("#PCBPrototype").hide();
    }else{
        $("#SMTStencil").hide();

        $("#PCBPrototype").show();
    }

    var aId = "a-tab-";
    if(type=="1"){
        aId = aId+"pcb";
    }else if(type=="3"){
        aId = aId+"smt";
    }

    $("#"+aId).addClass("cur");

    $("input[name='orderType']").val(type);
}

//获取pcb价格
function onAjaxPcbPrice(){
    $.ajax({
        url:baseRoot()+"/ajaxPcbPrice",
        dataType: "json",
        type:"post",
        async: false,
        success:function(response){
            $("#layer_1_2").html("$"+response["layer_1_2"].dummyMoney);
            $("#layer_0_2").html("$"+response["layer_0_2"].dummyMoney);
            $("#layer_1_2_t").html("Build Time:"+response["layer_1_2"].achieveDate.name);

            $("#layer_1_4").html("$"+response["layer_1_4"].dummyMoney);
            $("#layer_0_4").html("$"+response["layer_0_4"].dummyMoney);
            $("#layer_1_4_t").html("Build Time:"+response["layer_1_4"].achieveDate.name);

            $("#layer_1_6").html("$"+response["layer_1_6"].dummyMoney);
            $("#layer_0_6").html("$"+response["layer_0_6"].dummyMoney);
            $("#layer_1_6_t").html("Build Time:"+response["layer_1_6"].achieveDate.name);
        }
    });
}