var hidendetail=true;
var isSubmit=true;

var levelDetailStrRed="";//失败
var levelDetailStrYellow="";//大报警
var levelDetailStrBlue="";//小报警
var levelDetailStrGreen="";//正常

var havewaixing=0;

var levelFatherStr="";
function baseRoot(){
    return $("#baseRoot").val();
}

$(function(){
    $("input[name='gerberFile']").bind("change",function(){
        uploadGerberAjax($(this));
    });

    //保存
    $("#savetocart").click(saveOrder);

    postmessage();

    $(".stencilWidthShow").html($("input[name='stencilWidth']").val()+'mm');
    $(".stencilLengthShow").html($("input[name='stencilLength']").val()+'mm');
    encapsulationForm();

});

function uploadGerberAjax(gf){
    $("#fileId").val("-1");
    if(!checkFileSize(gf)){
        return;
    }

    isSubmit=false;

    $("#uploadDetails1").css("display","none");
    $("#uploadDetails2").css("display","none");
    var calculationCostsType=$('#calculationCostsType').val();

    if(calculationCostsType!='3'){
        var bar = $("#percent .progress-bar");
        bar.html("0%");
        bar.css({width:"0%"});
        bar.attr("aria-valuenow","0");
        addPercent(1,20,200);
        $("#percent").show();
    }

    var formData = new FormData();
    formData.append("gerberFile",gf[0].files[0]);
    formData.append("calculationCostsType",$('#calculationCostsType').val());

    $.ajax({
        url : baseRoot()+"/quote/uploadGerber",
        type : 'POST',
        data : formData,
        async: true,
        cache: false,
        // 告诉jQuery不要去处理发送的数据
        processData : false,
        // 告诉jQuery不要去设置Content-Type请求头
        contentType : false,
        success : function(data) {
            data = eval("("+data+")");
            if(data["result"]!="success"){
                if(data["resultStatus"]=="fileExtensionError"){
                    alert("Incorrect format. Please upload file in rar or zip format and use English filenames.");//文件后缀zip 或者 rar
                }else{
                    alert("The review has fail");//通讯失败
                }
                //$("#errorMsg").html("Your upload has failed processing，Only accept zip or rar");
                return;
            }else{

                var fileId = data["fileId"];

                var fileName = data["fileName"];

                var calculationCostsType = data["calculationCostsType"];
                if(calculationCostsType!='3')
                    addPercent(1,70,200);
                //上传成功
                analysisGerber(fileId,fileName,calculationCostsType);
            }
        },
        error : function(responseStr) {
            alert("error");
        }
    });
}



function checkFileSize(obj) {
    var allowSize = 10*1024*1024;// 10M
    var size = obj[0].files[0].size;
    if (size > allowSize) {
        alert("file size limit 10MB");
        return false;
    }
    return true;
}


//解析gerber文件
function analysisGerber(fileId,fileName,calculationCostsType){
    $.ajax({

        url:baseRoot()+"/quote/analysisGerber",
        dataType: "json",
        type:"post",
        data:{"fileId":fileId,"calculationCostsType":calculationCostsType},

        success:function(response){

            $("#percent").hide();

            var head = response.head;

            var message = response.message;

            var orderType = response.orderType;


            var stencilLength = $("input[name='stencilLength']");

            var stencilWidth = $("input[name='stencilWidth']");

            if(head == "ok"){//解析成功

                if(orderType=="3"){
                    isSubmit=true;
                    $("#errorMsg").css({color:"green"});
                    var fileName = $("input[name='gerberFile']").val().split("\\");
                    $("#errorMsg").html("Upload File : "+fileName[fileName.length-1]);
                    $("#fileName").val(fileName[fileName.length-1]);
                    confirm();
                    //隐藏按钮
                    $(".gerberdiv").css("position","absolute");
                    $(".gerberdiv").css("z-index",-1000);
                }else{
                    showUploadResult(response);
                }

                $("#fileId").val(fileId);

                encapsulationForm();

            }else if(head == "big"){//解析失败

                 alert("File size limit 10MM!");


             }else if(head == "error"){//解析失败

                stencilLength.removeAttr("readonly");

                stencilWidth.removeAttr("readonly");

                alert("Fail to process your Gerber, pls click required options");



            }else if(head == "error" && message == "Pending"){

                $("#errorMsg").html("Uploaded ");

                $("#fileErrorP").html("Fill the Size");

                $("#errorMsg").css("color","green");

                $("input[name='stencilLength']").focus();

                stencilLength.removeAttr("readonly");

                stencilWidth.removeAttr("readonly");

            }else if(head == "timout"){

                $("#fileId").val(fileId);

                if(!eadLink){
                    $("input[name='stencilLength']").val("");
                    $("input[name='stencilWidth']").val("");
                }

                timeOutSuccess();
            }
            postmessage();
            $("#stencilLength").trigger("keyup");
            $("#stencilWidth").trigger("keyup");
        }
    });
}

function timeOutSuccess(){
    $("#isTimeout").val('isTimeout');

    isSubmit=true;
    var edaStr='<a href="javascript:location.href=\'/quote?\'+parseInt(Math.random() * 10);" style="color: #0099FF;">&lt;&lt; Back to Upload File</a>';
    if(eadLink&&eadLink=='1'){
        edaStr='<a href="javascript:parent.location.href=\''+edaOrderUrl+'\';" style="color: #0099FF;">&lt;&lt; Back to Upload File</a>';
    }

    var failContent= '<p class="proce-p2" style="margin-top: -10px;">Your upload has finished processing. Enter the project details below and we\'ll move on to checking all the individual layers to make sure that they\'re correct.</p>'+
    '<div id="resultContentId"><p class="explanation-p"><span class="explanation-span explanation-sp2"></span><span class="explanation-span2">success</span></p></div>'+
    '<p style="font-family: \'Microsoft YaHei Bold\', \'Microsoft YaHei\';font-weight: 700;font-style: normal;font-size: 14px;margin-top: 60px;">'+
    edaStr+
    '</p>';

    $("#savetocart").css("background","#118ee7");
    $(".process-box-s").empty();
    $(".process-box-s").append(failContent);
    $("#showUploadResultId").show();
    //隐藏按钮
    $(".gerberdiv").css("position","absolute");
    $(".gerberdiv").css("z-index",-1000);
}

//进度条step递增量百分比，num递增总数百分比，time
function addPercent(step,num,time){

    var bar = $("#percent .progress-bar");

    var p = parseInt(bar.attr("aria-valuenow"));

    p=p+parseInt(step);

    bar.html(p+"%");
    bar.css({width:p+"%"});
    bar.attr("aria-valuenow",p);

    if(p>=100){
        bar.html("100%");
        bar.css({width:"100%"});
        bar.attr("aria-valuenow","100");
        return;
    }


    if(num>0){
        setTimeout("addPercent("+step+","+(parseInt(num)-parseInt(step))+","+time+")",time);
    }
}

var isSubmitReload=true;


function validatePcbOrderLimit(){
    $.ajax({
        url:baseRoot()+"/order/limit/validatePcbOrderLimit",
        type:"post",
        data:$("#pcbValuationForm").serialize(),
        success:function(response){
            alert(response);
        }
    });

}


function showUploadResult(response){
    var lengthMM=toDecimal(response.setLength==0?response.pcsLength:response.setLength);
    var widthMM=toDecimal(response.setWidth==0?response.pcsWidth:response.setWidth);
    var lengthFT=toDecimal(lengthMM*0.0393701);
    var widthFT=toDecimal(widthMM*0.0393701);
    widthMM=widthMM.toFixed(0);
    lengthMM=lengthMM.toFixed(0);

    var firstTextIdHtml="";
    if(response.stencilLayer!=0&&response.stencilLayer!=-1){
        firstTextIdHtml+="Detected "+response.stencilLayer+" layer";
        if(lengthMM!=0&&widthMM!=0&&lengthFT!=0&&widthFT!=0&&lengthMM>5&&widthMM>5){
            firstTextIdHtml+=" board of "+widthMM+"x"+lengthMM+"mm("+widthFT+"x"+lengthFT+" inches) .";
        }
    }

//                $("#firstTextId").html("Detected "+response.stencilLayer+" layer board of "+lengthMM+"x"+widthMM+"mm("+lengthFT+"x"+widthFT+" inches) .");

    $("#firstTextId").html(firstTextIdHtml);

//    if(response.topImageFilePath=="")
//        $("#topImageFilePath").attr("src",baseRoot()+"/images/loading.ff7b5c52.gif");
//    else
        $("#topImageFilePath").attr("src",baseRoot()+"/quote/downImg?uuid="+response.technologyDiscernRecordNum+"&small=1&type=top&t="+Math.random());
//    if(response.bottomImageFilePath=="")
//        $("#bottomImageFilePath").attr("src",baseRoot()+"/images/loading.ff7b5c52.gif");
//    else
        $("#bottomImageFilePath").attr("src",baseRoot()+"/quote/downImg?uuid="+response.technologyDiscernRecordNum+"&small=1&type=bottom&t="+Math.random());


    if(response.stencilLayer){
        $("input[name='stencilLayer']").val(response.stencilLayer);
        $("[divname='stencil-layer-pcb-div'] button").each(function(){
            if($(this).val()==response.stencilLayer.toString()){
                onCheck(this);
                //break;
                // $(this).addClass("cur");
            }
        });
        if(!hidendetail){
         $("input[name='stencilLayer']").parent().parent().hide();
        }

    }
    if(widthMM>0){
        $("input[name='stencilWidth']").val(widthMM);
        $("input[name='stencilWidth']").attr("readonly","readonly");
        $(".stencilWidthShow").html(widthMM+'mm');
    }else{
        $("input[name='stencilWidth']").val("");
    }
    if(lengthMM>0){
        $("input[name='stencilLength']").val(lengthMM);
        $("input[name='stencilLength']").attr("readonly","readonly");
        $(".stencilLengthShow").html(lengthMM+'mm');
    }else{
        $("input[name='stencilLength']").val("");
    }



    var isGoldFinger=response.isGoldFinger=="yes"?"1":"0";

    $("[divname='gold-finger-bevel-pcb-div'] button").each(function(){
        if($(this).val()==isGoldFinger){
            onCheck(this);
            //break;
            // $(this).addClass("cur");
        }
    });

    //$("input[name='stencilCounts']").val();

    var resultStr="Unknown Error. Please contact customer support";//未知原因
    var level=1;//4成功，3小报警，2打报警，1紧急
    if(response.gerberResult==1){
        resultStr=" An unexpected error occurred while processing";//审核异常
        level=3
    }else if(response.gerberResult==0){
        resultStr="success";//执行成功或审核无异常
        level=4
    }else if(response.gerberResult==-1){
         resultStr="Fail to upzip file and stop processing";//因解压客户资料失败，导致终止
         level=1
    }else if(response.gerberResult==-2){
        resultStr="Can't find PCB or GBR file and stop processing";//因未发现PCB或GBR文件，导致终止
        level=1
    }else if(response.gerberResult==-3){
        resultStr="The PCB file can't be converted to gerber file and stop processing";//因此类PCB文件暂不支持PCB转换GBR操作(例如: cam、brd等)，导致终止
        level=1
    }else if(response.gerberResult==-4){
        resultStr="Fail to convert PCB to gerber file";//因PCB转换GBR失败，导致终止
        level=3
    }else if(response.gerberResult==-5){
        resultStr="Detected unsupported gerber file(eg: rs274D、ODB++)and stop processing";//因此类GBR文件暂不支持审核操作(例如: rs274D、ODB++)，导致终止
        level=3
    }else if(response.gerberResult==-6){
        resultStr="Fail to review the gerber file and stop processing";//因审核GBR文件失败，导致终止     ----保留
        level=3
    }else if(response.gerberResult==-7){
        resultStr="The review wasn't completed within the given time and stop processing";//因审核在规定时间内未完成，导致终止
        level=3
    }else if(response.gerberResult==-8){
        resultStr="Fail to detect the file for an unknown reason";//未知失败原因
        level=3
    }else if(response.gerberResult==-9){
        resultStr="Parsing failed";//审核失败，因为文件解析失败。
        level=3
    }else if(response.gerberResult==-10){
        resultStr="File is in wrong format";//审核失败，因为gerber格式有问题。。
        level=3
    }else if(response.gerberResult==-11){
        resultStr="Gerber and Drill Layers do not align";//审核失败，钻孔和其他层层对位有问题。
        level=3
    }else if(response.gerberResult==-12){
        resultStr="Unable to identify the layers due to the non-standard filename";//审核失败，层命名不规法，导致层识别有问题。
        level=3
    }

    $("#resultContentId").empty();
    if(level==1){
        var level1='<p class="explanation-p">'+
                            '<span class="explanation-span"></span>'+
                            '<span class="explanation-span2">'+resultStr+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                        '</p>';
        levelFatherStr=level1;
//        $("#resultContentId").append(level1);
        isSubmit=false;
        showResultFail(response);return;
    }
//    if(level==2){
//        var level2='<p class="explanation-p">'+
//                                '<span class="explanation-span explanation-sp"></span>'+
//                                '<span class="explanation-span2">'+resultStr+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
//                            '</p>';
//        levelFatherStr=level2;
//        $("#resultContentId").append(level2);
//        isSubmit=false;
//    }
    if(!hidendetail){
        if(level==3){
            var level3='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp1"></span>'+
                                '<span class="explanation-span2">'+resultStr+'</span>'+
                            '</p>';
            levelDetailStrBlue=level3;

            //
            var level4='<p class="explanation-p">'+
                            '<span class="explanation-span explanation-sp2"></span>'+
                            '<span class="explanation-span2">success</span>'+
                        '</p>';
            levelFatherStr=level4;
            $("#resultContentId").append(level4);
            isSubmit=false;
        }
    }
    if(level==4){
        var level4='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp2"></span>'+
                                '<span class="explanation-span2">'+resultStr+'</span>'+
                            '</p>';
        levelFatherStr=level4;
        $("#resultContentId").append(level4);
        isSubmit=false;
    }



    var failCount=0;
    //循环二级警告
    if(response.fileResult){
        var fileResult=eval('('+response.fileResult+')');
        //var levelDetailStrGreen="";

        if(fileResult.file_list)
        for(var a=0;a<fileResult.file_list.length;a++){
            var detailerror="";
            if(fileResult.file_list[a].error==1){
                detailerror="Detected Gerber file, but can not identify the layers,The file is skipped";//Gerber文件，但不能识别出层类型
            }else if(fileResult.file_list[a].error==2){
                detailerror="Identified as board outline layer";//识别为外型层
                havewaixing=1;
            }else if(fileResult.file_list[a].error==3){
                detailerror="Detected the completed data files for production,we will ignore extra files in the Gerber（GM1、GD、GG）";//审核忽略的Gerber数据。
            }else if(fileResult.file_list[a].error==4){
                detailerror="File format can't be recognized(They're not Gerber 274x or excellon files),The file is skipped";//不能识别或者无意义的文件,直接忽略（不属于gerber274X或者excellon格式的文件）
            }else{
                detailerror="normal";//无问题
            }
            var detailgerbertype="";
            switch (fileResult.file_list[a].gerber_type){
                case 1:detailgerbertype="Top Silkscreen";break;//顶层丝印
                case 2:detailgerbertype="Top Soldermask";break;//顶层阻焊
                case 3:detailgerbertype="Top Layer";break;//顶层线路
                case 4:detailgerbertype="Bottom Layer";break;//底层线路
                case 5:detailgerbertype="Bottom Soldermask";break;//底层阻焊
                case 6:detailgerbertype="Bottom Silkscreen";break;//底层丝印
                case 7:detailgerbertype="Drill Layer";break;//NPTH钻孔
                case 8:detailgerbertype="Drill Layer";break;//PTH钻孔
                case 9:detailgerbertype="Drill Layer";break;//刀具层
                case 10:detailgerbertype="Slots";break;//槽孔
                case 11:detailgerbertype="Board Outline Layer ";break;//外形层
                case 12:detailgerbertype="Inner Layer 2";break;//线路内层2
                case 13:detailgerbertype="Inner Layer 3";break;
                case 14:detailgerbertype="Inner Layer 4";break;
                case 15:detailgerbertype="Inner Layer 5";break;
                case 16:detailgerbertype="Inner Layer 6";break;
                case 17:detailgerbertype="Inner Layer 7";break;
                //default: detailgerbertype="Unknown file";
            }


            var levelDetail=fileResult.file_list[a].file_name+(detailgerbertype==""?"":"("+detailgerbertype+")")+":"+detailerror;


            if(fileResult.file_list[a].error==4){
                levelDetailStrGreen+='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp1"></span>'+
                                '<span class="explanation-span2">'+levelDetail+'</span>'+
                            '</p>';
            }else if(fileResult.file_list[a].file_result==1){
                levelDetailStrGreen+='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp2"></span>'+
                                '<span class="explanation-span2">'+levelDetail+'</span>'+
                            '</p>';
            }else if(fileResult.file_list[a].file_result==-1||fileResult.file_list[a].file_result==-2){//文件层识别都为蓝色
                levelDetailStrBlue+='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp1"></span>'+
                                '<span class="explanation-span2">'+levelDetail+'</span>'+
                            '</p>';
            }
//            else if(fileResult.file_list[a].file_result==-2){
//                levelDetailStrYellow+='<p class="explanation-p">'+
//                                '<span class="explanation-span explanation-sp"></span>'+
//                                '<span class="explanation-span2">'+levelDetail+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
//                            '</p>';
//                failCount++;
//            }
        }
    }

    //循环处理不存在的文件
    if(response.gerberFileError){
        var errorArray =response.gerberFileError.split(',');
        var siyin=0;
        var zuhan=0;
        var xianlu=0;
        var zuankong=0;
        for(var a=0;a<errorArray.length;a++){
            switch (errorArray[a]){
                case '1':siyin++;break;//顶层丝印
                case '2':zuhan++;break;//顶层阻焊
                case '3':xianlu++;break;//顶层线路
                case '4':xianlu++;break;//底层线路
                case '5':zuhan++;break;//底层阻焊
                case '6':siyin++;break;//底层丝印
                case '7':zuankong++;break;//NPTH钻孔
                case '8':zuankong++;break;//PTH钻孔
            }
        }
        //橙色
        if(siyin==2){
            var errorDetail="";
            errorDetail="Could not find Silkscreen file";
            levelDetailStrYellow+='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp"></span>'+
                                '<span class="explanation-span2">'+errorDetail+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                            '</p>';
        }
        //橙色
        if(zuhan==2){
            var errorDetail="";
            errorDetail="Could not find Solder Mask layer";
            levelDetailStrYellow+='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp"></span>'+
                                '<span class="explanation-span2">'+errorDetail+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                            '</p>';
        }

        if(xianlu==2){
           showResultFail(response);return;
        }
        if(zuankong==2){
           showResultFail(response);return;
        }


        for(var a=0;a<errorArray.length;a++){

            var errorDetail="";
            var errorDetailLevel=4;
            switch (errorArray[a]){
//                case '1':errorDetailLevel=2;errorDetail="Could not find Silkscreen file";break;//顶层丝印
//                case '2':errorDetailLevel=2;errorDetail="Could not find Solder Mask layer";break;//顶层阻焊
//                case '3':errorDetailLevel=1;errorDetail="Could not find Copper layer";showResultFail(response);return;break;//顶层线路，复同层
//                case '4':errorDetailLevel=1;errorDetail="Could not find Copper layer";showResultFail(response);return;break;//底层线路，复同层
//                case '5':errorDetailLevel=2;errorDetail="Could not find Solder Mask layer";break;//底层阻焊
//                case '6':errorDetailLevel=2;errorDetail="Could not find Silkscreen file";break;//底层丝印
//                case '7':errorDetailLevel=1;errorDetail="Could not find Drill file";showResultFail(response);return;break;//NPTH钻孔
//                case '8':errorDetailLevel=1;errorDetail="Could not find Drill file";showResultFail(response);return;break;//PTH钻孔
//                case 9:detailgerbertype="Drill Layer";break;//刀具层
//                case 10:detailgerbertype="Slots";break;//槽孔
                case '11':if(havewaixing==0){showResultFail(response);return;}break;//外形层,边框
//                case 12:detailgerbertype="Inner Layer 2";break;//线路内层2
//                case 13:detailgerbertype="Inner Layer 3";break;
//                case 14:detailgerbertype="Inner Layer 4";break;
//                case 15:detailgerbertype="Inner Layer 5";break;
//                case 16:detailgerbertype="Inner Layer 6";break;
//                case 17:detailgerbertype="Inner Layer 7";break;
                //default: detailgerbertype="Unknown file";
            }
            if(errorDetailLevel==2){
                levelDetailStrYellow+='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp"></span>'+
                                '<span class="explanation-span2">'+errorDetail+'</span>'+
                            '</p>';
                failCount++;
            }
        }
    }
    //最小生产限度
    if(!response.minLineWidth||response.minLineWidth==-1){
        levelDetailStrBlue+='<p class="explanation-p">'+
                        '<span class="explanation-span explanation-sp1"></span>'+
                        '<span class="explanation-span2">Can not identify the minimum trace width </span>'+
                    '</p>';
    }else if(response.minLineWidth<3.5){
        levelDetailStrYellow+='<p class="explanation-p">'+
                        '<span class="explanation-span explanation-sp"></span>'+
                        '<span class="explanation-span2">Attention please, the minimum trace width is out of our capability, your order may be canceled</span>'+
                    '</p>';
        failCount++;
    }

    if(!response.minLineDist||response.minLineDist==-1){
        levelDetailStrBlue+='<p class="explanation-p">'+
                        '<span class="explanation-span explanation-sp1"></span>'+
                        '<span class="explanation-span2">Can not identify the minimum trace spacing </span>'+
                    '</p>';
    }else if(response.minLineDist<3.5){
        levelDetailStrYellow+='<p class="explanation-p">'+
                        '<span class="explanation-span explanation-sp"></span>'+
                        '<span class="explanation-span2">Attention please, the minimum trace spacing is out of our capability, your order may be canceled</span>'+
                    '</p>';
        failCount++;
    }


    if(!response.smallestHole||response.smallestHole==0){
        levelDetailStrBlue+='<p class="explanation-p">'+
                        '<span class="explanation-span explanation-sp1"></span>'+
                        '<span class="explanation-span2">Can not identify the minimum drill size </span>'+
                    '</p>';
    }else if(response.smallestHole<0.2){
        levelDetailStrYellow+='<p class="explanation-p">'+
                        '<span class="explanation-span explanation-sp"></span>'+
                        '<span class="explanation-span2">Attention please, the minimum drill size is out of our capability, your order may be canceled</span>'+
                    '</p>';
        failCount++;
    }
//    if(!response.totalHitsCount||response.totalHitsCount*0.025<0.15){
//        levelDetailStrBlue+='<p class="explanation-p">'+
//                        '<span class="explanation-span explanation-sp1"></span>'+
//                        '<span class="explanation-span2">Attention please, the minimum trace spacing is out of our capability, your order may be canceled</span>'+
//                    '</p>';
//        failCount++;
//    }

    if(!hidendetail){
        $("#resultContentId").append(levelDetailStrYellow);
        $("#resultContentId").append('<div class="shrink-btn" onclick="shrink(this);"  style="margin-top:80px;"><a href="javascript:;" type="up"></a></div>');
    }

    if(failCount==0||hidendetail){
        $(".process-tips").hide();
        confirm();
    }

    $("#showImgId").attr("href",baseRoot()+"/quote/gerberview/"+response.technologyDiscernRecordNum+"_1_0_1_0_0.html");

    $("#showUploadResultId").show();
    //隐藏按钮
    $(".gerberdiv").css("position","absolute");
    $(".gerberdiv").css("z-index",-1000);

//    var level="";
//    var levelStr="";
//
//    var fileResult=response.fileResult
//
//    for(var a=0;a<fileResult.file_list.length;a++){
//
//    }
}

function reuploadFile(){
    $('input[name="gerberFile"]').click();
}

function confirm(){
    isSubmit=true;
    $("#confirm").hide();
    $("#reUploadId").hide();
     //#118ee7
    $(".glyphicon-shopping-cart").css("background","#118ee7");
    $("#savetocart").css("background","#118ee7");
}

function toDecimal(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return;
    }
    f = Math.round(x*100)/100;
    return f;
}

function isHasImg(pathImg){
    var ImgObj=new Image();
    ImgObj.src= pathImg;
     if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))
     {
       return true;
     } else {
       return false;
    }
}


function shrink(thisOb){
    var thisdiv=$(thisOb);
    var aa=thisdiv.find("a");
    if(aa.attr("type")=="up"){
        $("#resultContentId").empty();

        $("#resultContentId").append(levelFatherStr+levelDetailStrYellow+levelDetailStrBlue+levelDetailStrGreen);
        $("#resultContentId").append('<div class="shrink-btn" onclick="shrink(this);"  style="margin-top:80px;"><a style="background-image:url(../images/icon014.b1b348f7.png);" href="javascript:;" ></a></div>')
    }else{
        $("#resultContentId").empty();
        $("#resultContentId").append(levelFatherStr+levelDetailStrYellow);
        $("#resultContentId").append('<div class="shrink-btn" onclick="shrink(this);"  style="margin-top:80px;"><a style="background-image:url(../images/icon015.6e2801eb.png);" href="javascript:;" type="up"></a></div>')
    }
    postmessage();
}


function showResultFail(response){
    if(hidendetail){timeOutSuccess();return;}
    levelFatherStr="";
    levelDetailStrGreen="";
    levelDetailStrBlue="";
    levelDetailStrYellow="";
    levelDetailStrRed="";
    var resultStr="Unknown Error. Please contact customer support";//未知原因
    var level=3;//4成功，3小报警，2打报警，1紧急
    if(response.gerberResult==1){
        resultStr=" An unexpected error occurred while processing";//审核异常
        level=3
    }else if(response.gerberResult==0){
        resultStr="success";//执行成功或审核无异常
        level=4
    }else if(response.gerberResult==-1){
         resultStr="Fail to upzip file and stop processing";//因解压客户资料失败，导致终止
         level=1
    }else if(response.gerberResult==-2){
        resultStr="Can't find PCB or GBR file and stop processing";//因未发现PCB或GBR文件，导致终止
        level=1
    }else if(response.gerberResult==-3){
        resultStr="The PCB file can't be converted to gerber file and stop processing";//因此类PCB文件暂不支持PCB转换GBR操作(例如: cam、brd等)，导致终止
        level=1
    }else if(response.gerberResult==-4){
        resultStr="Fail to convert PCB to gerber file";//因PCB转换GBR失败，导致终止
        level=3
    }else if(response.gerberResult==-5){
        resultStr="Detected unsupported gerber file(eg: rs274D、ODB++)and stop processing";//因此类GBR文件暂不支持审核操作(例如: rs274D、ODB++)，导致终止
        level=3
    }else if(response.gerberResult==-6){
        resultStr="Fail to review the gerber file and stop processing";//因审核GBR文件失败，导致终止     ----保留
        level=3
    }else if(response.gerberResult==-7){
        resultStr="The review wasn't completed within the given time and stop processing";//因审核在规定时间内未完成，导致终止
        level=3
    }else if(response.gerberResult==-8){
        resultStr="Fail to detect the file for an unknown reason";//未知失败原因
        level=3
    }else if(response.gerberResult==-9){
        resultStr="Parsing failed";//审核失败，因为文件解析失败。
        level=3
    }else if(response.gerberResult==-10){
        resultStr="File is in wrong format";//审核失败，因为gerber格式有问题。。
        level=3
    }else if(response.gerberResult==-11){
        resultStr="Gerber and Drill Layers do not align";//审核失败，钻孔和其他层层对位有问题。
        level=3
    }else if(response.gerberResult==-12){
        resultStr="Unable to identify the layers due to the non-standard filename";//审核失败，层命名不规法，导致层识别有问题。
        level=3
    }

    $("#resultContentId").empty();
    if(level==1){
        var level1='<p class="explanation-p">'+
                            '<span class="explanation-span"></span>'+
                            '<span class="explanation-span2">'+resultStr+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                        '</p>';
        levelDetailStrRed=level1;
        isSubmit=false;
        $(".process-tips").attr("class","process-tips2");
    }
    if(level==2){
        var level2='<p class="explanation-p">'+
                                '<span class="explanation-span explanation-sp"></span>'+
                                '<span class="explanation-span2">'+resultStr+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                            '</p>';
        levelDetailStrYellow=level2;
        isSubmit=false;
    }
    if(level==3){
        var level3='<p class="explanation-p">'+
                            '<span class="explanation-span explanation-sp1"></span>'+
                            '<span class="explanation-span2">'+resultStr+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                        '</p>';
        levelDetailStrBlue=level3;
        isSubmit=false;
    }

    //循环处理不存在的文件
    if(response.gerberFileError){
        var errorArray =response.gerberFileError.split(',');
        var xianlu=0;//红色
        var zuankong=0;//红色
        for(var a=0;a<errorArray.length;a++){
            switch (errorArray[a]){
                case '3':xianlu++;break;//顶层线路，复同层
                case '4':xianlu++;break;//底层线路，复同层
                case '7':zuankong++;break;//NPTH钻孔
                case '8':zuankong++;break;//PTH钻孔
            }
        }

        //红色
        if(xianlu==2){
            var errorDetail="";
            errorDetail="Could not find Copper layer";
            levelDetailStrRed+='<p class="explanation-p">'+
                                '<span class="explanation-span"></span>'+
                                '<span class="explanation-span2">'+errorDetail+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                            '</p>';
        }

        //红色
        if(zuankong==2){
            var errorDetail="";
            errorDetail="Could not find Drill layer";
            levelDetailStrRed+='<p class="explanation-p">'+
                                '<span class="explanation-span"></span>'+
                                '<span class="explanation-span2">'+errorDetail+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                            '</p>';
        }

        for(var a=0;a<errorArray.length;a++){

            var errorDetail="";
            var errorDetailLevel=4;
            switch (errorArray[a]){
//                case '7':errorDetailLevel=1;errorDetail="Could not find Drill file";break;//NPTH钻孔
//                case '8':errorDetailLevel=1;errorDetail="Could not find Drill file";break;//PTH钻孔
//                case 9:detailgerbertype="Drill Layer";break;//刀具层
//                case 10:detailgerbertype="Slots";break;//槽孔
                case '11': if(havewaixing==0){errorDetailLevel=1;errorDetail="Could not find Board Outline file";}break;//外形层,边框
//                case 12:detailgerbertype="Inner Layer 2";break;//线路内层2
//                case 13:detailgerbertype="Inner Layer 3";break;
//                case 14:detailgerbertype="Inner Layer 4";break;
//                case 15:detailgerbertype="Inner Layer 5";break;
//                case 16:detailgerbertype="Inner Layer 6";break;
//                case 17:detailgerbertype="Inner Layer 7";break;
                //default: detailgerbertype="Unknown file";
            }
            if(errorDetailLevel==1){
            //红色
                levelDetailStrRed+='<p class="explanation-p">'+
                                '<span class="explanation-span"></span>'+
                                '<span class="explanation-span2">'+errorDetail+',<a class="failed-a" href="https://support.jlcpcb.com/category/23-technical-support" target="_blank" >See help page</a>.</span>'+
                            '</p>';
            }
        }
    }


    var edaStr='<a href="javascript:location.href=\'/order/pcb?\'+parseInt(Math.random() * 10);" >&lt;&lt;Back to Upload File</a>';
    if(eadLink&&eadLink=='1'){
        edaStr='<a href="javascript:parent.location.href=\''+edaOrderUrl+'\';" >&lt;&lt;Back to Upload File</a>';
    }
     var failContent='<p class="failed-p1">Your upload has failed processing.</p>'+
                    '<p class="failed-p2">Design notes:</p>'+
                    '<div style="margin-left: 20px;">'+
                        levelDetailStrRed+
                    '<p class="failed-p3">If you\'d like some help figuring out what\'s going wrong then please email your design file to <a class="failed-a" href="mailto:support@jlcpcb.com">support@jlcpcb.com</a> and we\'ll take a look at it</p>'+
                    '<p class="failed-p4">' + edaStr + '</p>' +
                    '<p class="failed-p4"><a href="javascript:confirm()">Still have to order,Ignore</a></p>';

//    $("#resultContentId").empty();
//
//    $("#resultContentId").append(failContent);
//
//    $("#showUploadResultId").show();
//    //隐藏按钮
//    $(".gerberdiv").css("position","absolute");
//    $(".gerberdiv").css("z-index",-1000);
//
     $(".process-box-s").empty();


    $(".process-box-s").append(failContent);


    $("#showUploadResultId").show();
    //隐藏按钮
    $(".gerberdiv").css("position","absolute");
    $(".gerberdiv").css("z-index",-1000);
    $(".process-tips").attr("class","process-tips2");
    isSubmit=false;
}

var a=0;
function onerrorMethod(thisOb){
    a++;
    $(thisOb).parent().hide();
    if(a==2){
        $(".proce-image").hide();
    }
}


var isSubmitReload=true;

//获取钢网有效长和宽
function getLengthAndWidth(obj) {
    encapsulationForm();
    //获取钢网option中的 有效长和宽
    var selectObj=$(obj).find("option:selected");
    var  length = selectObj.attr("availabilityAreaLength")*10;
    var  width = selectObj.attr("availabilityAreaWidth")*10;
    //初始化钢网长宽
    if (length == null  || length ==undefined || length == '') {
        length = 290 ;
    }
    if (width == null  || width ==undefined || width == '') {
        width = 190 ;
    }

    // 赋值给隐藏标签
    $("input[name = 'setWidth']").val(width);
    $("input[name = 'setLength']").val(length);
}

function saveOrder(){

    var tabType = $("#calculationCostsType").val();

    var file = $("#fileId").val();

   if(file.length==0){

        alert("Please upload your gerber file");

        return;
    }

    var gerberName = $("#showGerberName").attr("showGerberName");

    if(gerberName!=null && gerberName.length>4){

        var fileType = gerberName.substr(gerberName.lastIndexOf(".")+1,3).toUpperCase();

        if(fileType!="ZIP" && fileType!="RAR"){

            return;
        }
    }
    //检查个数
    if (tabType == 3) {
        var count = $("input[name='purchaseNumber']").val();
        if (!count) {
            alert("Please Input Stencil Qty");
            return;
        }
    }
    if(tabType!="3"){
        //长
        var stencilLength = $("input[name='stencilLength']").val();
        //宽
        var stencilWidth = $("input[name='stencilWidth']").val();
        if(stencilLength==''||stencilWidth==''||stencilLength.length<=0 || stencilWidth.length<=0){
            alert("Please input size");
            return;
        }
        //半孔数
        console.log($("[divname='halfHoleNumber-pcb-div']").find('.cur'))
        if($("[divname='halfHole-pcb-div'] .cur").val()=='yes'&&$("[divname='halfHoleNumber-pcb-div'] .cur").length<=0){
            alert("Please chose the Castellated Holes Edge Qty");
            return;
        }
        //测试
        if($("[divname='testProduct-pcb-div'] .cur").length<=0){
            alert("Please chose the Flying Probe Test");
            return;
        }
        var flag = checkAreaManyTooBig();
        if(!flag){
            return ;
        }
    }

    //判断是否选中加钢网
    var check = $("input[name='isShowSteelmesh']").is(":checked");
    if (check == true) {
        //获取隐藏钢网有效长宽
        var setgwWidth = $("input[name = 'setWidth']").val();
        var setgwLength = $("input[name = 'setLength']").val();
        //初始化钢网长宽
        if (setgwLength == null  || setgwLength ==undefined || setgwLength == '') {
            setgwLength = 290 ;
        }
        if (setgwWidth == null  || setgwWidth ==undefined || setgwWidth == '') {
            setgwWidth = 190 ;
        }
        //获取客户输入的PCB长和宽
        var width = $("input[name = 'stencilWidth']").val();
        var length = $("input[name = 'stencilLength']").val();
        var flag = true;
        //拼版长和宽个数
        var sestencilCountX = $("input[name='sestencilCountX']").val();
        var sestencilCountY = $("input[name='sestencilCountY']").val();
        // 初始化 拼版长和宽个数
        if (sestencilCountX == null || sestencilCountX == undefined || sestencilCountX == "") {
            sestencilCountX = 1;
            flag=false;
        }
        if (sestencilCountY == null || sestencilCountY == undefined || sestencilCountY == "") {
            sestencilCountY = 1;
            flag=false;
        }
        //PCB板的总宽度和长度
        var totalPCBWidth = parseInt(sestencilCountX * parseInt(width) );
        var totalPCBLength = parseInt(sestencilCountY * parseInt(length));
        if(flag){
            if (totalPCBWidth >= totalPCBLength) {
                totalPCBWidth += 10;
            } else {
                totalPCBLength += 10;
            }
        }
        //如果长比宽小 ，则长和宽调换
        if(totalPCBLength < totalPCBWidth){
            var tmp = totalPCBLength;
            totalPCBLength = totalPCBWidth;
            totalPCBWidth = tmp;
        }
        //钢网有效长宽小于PCB长宽 弹框
        if (setgwWidth < totalPCBWidth || setgwLength < totalPCBLength) {
            alert("Please make sure the valid area should be larger than your PCB size.");
            return;
        }
    }
    //判断钢网片数对不对
    var flag = checkTopBottomNum();
    if (!flag) {
        return;
    }
   //获取选择值
    var layers = $("input[name='stencilLayer']").val();
    var stencilPly = $("input[name='stencilPly']").val();
    var adornColor = $("input[name='adornColor']").val();
    var adornPut = $("input[name='adornPut']").val();
    var copperWeight = $("input[name='cuprumThickness']").val();
    var goldFingerBevel = $("input[name='goldFingerBevel']").val();
    var materialDetails = "FR4-Standard Tg 140C";
    var stencilCounts = $("input[name='stencilCounts']").val();
    var stencilWidth = $("input[name='stencilWidth']").val();
    var stencilLength = $("input[name='stencilLength']").val();
    var halfHole = $("input[name='halfHole']").val();
    var achieveDate = $("input[name='achieveDate']:checked").val();

    //获取所有启用的下单限制
    // var commitFlag = true;

    var message = "";
    var coerceState = true;

    $.ajax({
        url: baseRoot() + "/pcborder/limit/validateOrderLimit",
        type: "post",
        async: false,
        dataType:"json",
        data: $("#pcbValuationForm").serialize(),
        success: function (response) {
            var list = eval(response);
            // console.log(list);
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    // console.log(list[i].layers + ";" + list[i].stencilPly + ";" + list[i].adornColor + ";" + list[i].adornPut + ";" + list[i].copperWeight + ";"
                    //     + list[i].goldFingerBevel + ";" + list[i].materialDetails + ";" + list[i].hint + ";" + list[i].coerceState);

            /*        if(list[i].layers == layers && list[i].stencilPly == stencilPly && list[i].adornColor == adornColor && list[i].adornPut == adornPut &&
                        list[i].copperWeight == copperWeight && list[i].goldFingerBevel == goldFingerBevel && list[i].materialDetails == materialDetails){
                        if (list[i].coerceState == "true") {
                            coerceState = false;
                            message = list[i].hint;
                            break;
                        }else{
                            alert(list[i].hint);
                            break;
                        }
                    }*/
                    // var isNull = true;
                    var isEquery = true;
                    if(list[i].layers != null && list[i].layers != layers){
                        isEquery = false;
                    }
                    if (list[i].stencilPly != null && list[i].stencilPly.length > 0 && list[i].stencilPly != stencilPly) {
                        isEquery = false;
                    }
                    if (list[i].adornColor != null && list[i].adornColor.length > 0 && list[i].adornColor != adornColor) {
                        isEquery = false;
                    }
                    if (list[i].adornPut != null && list[i].adornPut.length > 0 && list[i].adornPut != adornPut) {
                        isEquery = false;
                    }
                    if (list[i].copperWeight != null && list[i].copperWeight.length > 0 && list[i].copperWeight != copperWeight) {
                        isEquery = false;
                    }
                    if (list[i].goldFingerBevel != null && list[i].goldFingerBevel.length > 0 && list[i].goldFingerBevel != goldFingerBevel) {
                        isEquery = false;
                    }
                    if (list[i].materialDetails != null && list[i].materialDetails.length > 0 && list[i].materialDetails != materialDetails) {
                        isEquery = false;
                    }
                    if (list[i].achieveDate != null && list[i].achieveDate != achieveDate) {
                        isEquery = false;
                    }
                    if (list[i].halfHole != null &&  list[i].halfHole != (halfHole=='yes'?true:false)) {
                        isEquery = false;
                    }
                    if (list[i].maxStencilCounts != null&& list[i].maxStencilCounts <= stencilCounts ) {
                        isEquery = false;
                    }
                    if (list[i].minStencilCounts != null && list[i].minStencilCounts >= stencilCounts) {
                        isEquery = false;
                    }
                    if (list[i].maxLengthWidth != null && list[i].maxLengthWidth <= stencilWidth) {
                        isEquery = false;
                    }
                    if (list[i].minLengthWidth != null&& list[i].minLengthWidth >= stencilWidth) {
                        isEquery = false;
                    }
                    if (list[i].maxLengthWidth != null&& list[i].maxLengthWidth <= stencilLength) {
                        isEquery = false;
                    }
                    if (list[i].minLengthWidth != null&& list[i].minLengthWidth >= stencilLength) {
                        isEquery = false;
                    }
                    console.log(isEquery);
                    if(isEquery){
                        // console.log(list[i].coerceState);
                        if (list[i].coerceState == "true") {
                            coerceState = false;
                            message = list[i].hint;
                            break;
                        }else{
                            alert(list[i].hint);
                            break;
                        }

                    }

                    /*var flag = true;
                    var emptyFlag = true;
                    if (list[i].layers != null) {   //PCB板层
                        emptyFlag = false;
                        if (list[i].layers != layers) {
                            flag = false;
                        }
                    }
                    if (list[i].stencilPly != null && list[i].stencilPly.length > 0) {  //PCB板厚
                        emptyFlag = false;
                        if (list[i].stencilPly != stencilPly) {
                            flag = false;
                        }
                    }
                    if (list[i].adornColor != null && list[i].adornColor.length > 0) {     //阻焊颜色
                        emptyFlag = false;
                        if (list[i].adornColor != adornColor) {
                            flag = false;
                        }
                    }
                    if (list[i].adornPut != null && list[i].adornPut.length > 0) {  //焊盘喷镀
                        emptyFlag = false;
                        if (list[i].adornPut != adornPut) {
                            flag = false;
                        }
                    }
                    if (list[i].copperWeight != null && list[i].copperWeight.length > 0) {  //铜厚
                        emptyFlag = false;
                        if (list[i].copperWeight != copperWeight) {
                            flag = false;
                        }
                    }
                    if (list[i].goldFingerBevel != null && list[i].goldFingerBevel.length > 0) {    //金手指斜边(0:否,1:金手指不需要斜边,2:是、45°金手指斜边)
                        emptyFlag = false;
                        if (list[i].goldFingerBevel != goldFingerBevel) {
                            flag = false;
                        }
                    }
                    if (list[i].materialDetails != null && list[i].materialDetails.length > 0) {    //材料
                        emptyFlag = false;
                        if (list[i].materialDetails != materialDetails) {
                            flag = false;
                        }
                    }
                    console.log(emptyFlag + ":" + flag);
                    if (!emptyFlag && flag) {//该规则不为空并且没有条件是不相等的
                        if (list[i].coerceState == "true") {
                            //强制限制，不能下单
                            alert(list[i].hint);
                            commitFlag = false;
                            return;
                        } else {
                            alert(list[i].hint);
                            break;
                        }
                    }*/
                }
            }
        }
    });
    if(!coerceState){
        alert(message);
        return;
    }

    // if (!commitFlag) {
    //     return false;
    // }

    if(stencilPly == '0.4' && adornPut != 'ENIG-RoHS'){

        alert('Only "ENIG-RoHS" surface finish can be applied to the 0.4mm PCB thickness.');
        return;
    }

    var orderDetailsRemark = $("#orderDetailsRemark").val();

    if(getByteLen(orderDetailsRemark)>400){
        alert("400 bytes limit in Remark !");
        return;
    }

    //pcb隐藏则不需要验证stencilNumber
    if(!$('#pcb-div').is(':hidden')){　
        var stencilNumber = $("input[name='stencilNumber']").val();
        if (!stencilNumber) {
            var temp = $("#stencilNumberLast").val();
            if (!temp){
                document.getElementById("stencilShowNumberLast").innerHTML = "<font color='red'>Input here if more than 6 different designs in your panel</font>";
                return;
            }
            $("input[name='stencilNumber']").val(temp);
        }
    }
    if(!isSubmit){
        alert("Please Confirm!");
        return;
    }
    if(!isSubmitReload){
        return;
    }

    if(!checkCopperWeight()){
        alert("Your current process does not support 2oz copper weight , support 2oz copper weight , 2 layers, 4 layers, 6 layers. 1.6. 2. 0 pcb thickness and not black oil.");
        return;
    }



    var form = $("#pcbValuationForm");

    if(eadLink&&eadLink=='1'){
        edaShow();
//        var data={};
//        data.value='1';
//        data.type='jlcpcbNotice';
//        console.log("jlcpcbNotice"+data);
//        window.parent.postMessage(data,'*');
    }else{
        formSubmit();
    }
}

function checkCopperWeight(){

    var cuprumThickness = $("input[name='cuprumThickness']").val();

    var stencilLayer = $("input[name='stencilLayer']").val();

    var stencilPly = $("input[name='stencilPly']").val();

    var adornColor = $("input[name='adornColor']").val();

    if(cuprumThickness == "2"){
       if(stencilLayer == "1"){
           return false;
       }
       if(stencilPly != "1.6" && stencilPly != "2.0"){
           return false;
       }

       if(adornColor == "Black"){
          return false;
       }
    }

    return true;
}


function getByteLen(val) {
  var len = 0;
  for (var i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/ig) != null)
        len += 2;
    else
        len += 1;
  }
  return len;
}

function edaShow(){
    $('.pop-bg').show();
    $('.pop-box').show();
}

function edaHide(){
    $('.pop-bg').hide();
    $('.pop-box').hide();
}

function formSubmit(){
    isSubmitReload=false;
    var form = $("#pcbValuationForm");
    if(eadLink&&eadLink=='1'){
        form.attr("action",baseRoot()+"/quote/placeOrder?eadLink=1");
    }else{
        form.attr("action",baseRoot()+"/quote/placeOrder");
    }
    form.attr("enctype","multipart/form-data");
    form.attr("method","post");
    form.attr("target","_top");
    form.submit();
}

function postmessage(){
    if(eadLink&&eadLink=='1'){
        var height=document.body.clientHeight;
        var data={};
        data.height=height;
        data.type='jlcpcbHeight';
        window.parent.postMessage(data,'*');
    }
//
}
//edaupload
function edaUpload(fileId){
    $("#fileId").val("-1");

    isSubmit=false;

    $("#uploadDetails1").css("display","none");
    $("#uploadDetails2").css("display","none");
    var bar = $("#percent .progress-bar");
    bar.html("0%");
    bar.css({width:"0%"});
    bar.attr("aria-valuenow","0");
    addPercent(1,90,200);
    $("#percent").show();
    analysisGerber(fileId,"66","1");
}