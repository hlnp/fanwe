$(document).ready(function(){
	$(document).on("pageInit", "#uc_incharge", function(e, id, page) {

		displayButton();
//		var response_code = $.trim($("#uc_incharge #response_code").val());
//		if(response_code==0){
//			RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
//		}
		$("#uc_incharge #money1").keyup(function(){
			if($("#uc_incharge input[name='paypath1']:checked").length ==0){
				$("#Fee_t").html("充值金额：￥0.00");
			}
			else{
				var cfee =$("#uc_incharge input[name='paypath1']:checked").val();
				InchargeRes(cfee);
			}
		});
	$("#uc_incharge #on_incharge_done").click(function(){
		if(!$.trim($("#uc_incharge #money1").val())  )
		{
			$.toast("请输入充值金额");
		}else{
			if($("#uc_incharge input[name='paypath1']:checked").attr("iclass")=="Bfrzapp")
			{
				var iclass = $("#uc_incharge input[name='paypath1']:checked").attr("iclass");
				RouterURL(WAP_PATH+'/index.php?ctl=pay_display&class_name='+iclass,'#pay_display',2);
				return false;
			}
			$.showIndicator();
			var ajaxurl = WAP_PATH+'/index.php?ctl=uc_save_incharge';
			var query = newObject();
			query.payment_id = $.trim($("#uc_incharge input[name='paypath1']:checked").val());
			query.money = $.trim($("#uc_incharge #money1").val());
			query.post_type = "json";
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(result){
					$.hideIndicator();
 					if(result['is_sdk']==1){
						try{
							App.pay_sdk(jsonToString(result));
						}
						catch(e){
							$.toast("支付出错,请联系管理员");
						}
					}
					else{
						RouterURL(result.pay_wap,'#pay_wap_box',1);
					}
					/*
					var pay_id = $.trim($("#uc_incharge input[name='paypath1']:checked").val());
					if(pay_id==25){
						//$.alert("是微信支付");
						window.location.href='/callback/weixin/callback.php?&money_encrypt='+result.pay_money+"&notice_sn="+result.pay_sn;
					}else{
						RouterURL(result.pay_wap,'#pay_wap_box',1);
					}
					*/
				}
			});

		}
	});
	$("#other_incharge_done").click(function(){
		var ajaxurl = WAP_PATH+'/index.php?ctl=uc_incharge';
		var query = newObject();
		query.pTrdAmt = $.trim($("#money3").val());
		$.showIndicator();
		query.post_type = "json";
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					if(data.response_code == 1){
						RouterURL(data.dp_url,'#pay_wap_box',1);
					}

				}
			});
		});
		$('#uc_incharge #money1').bind("input onporpertychange",function() {
			var numberChange=$('#uc_incharge #money1').val();
			var sheepNumner=parseInt(numberChange/780);
			$('#uc_incharge #num-sheep').html(sheepNumner);
		});
		$('#uc_incharge .Menubox ul li.payment_method').click(function() {
			$(this).addClass("online").siblings().removeClass("online");
		});
		
	});
	$(document).on("pageInit", "#pay_display", function(e, id, page) {

		displayButton();
		
		$(page).find("#pay_order").click(function(){
			if($("#uc_incharge #money1").length == 0  || parseFloat($("#uc_incharge #money1").val())==0){
				$.toast("请返回上一级，重新发起请求");
				return false;
			}
			if($(page).find("#old_bank_id")=="0" && $(page).find("#bankcard").val()==""){
				$.toast("请选择银行卡，或者绑定银行卡");
				return false;
			}

			var query = newObject();
			query.money = $(page).find("#old_bank_id").val();
			query.old_bank_id = $(page).find("#old_bank_id").val();
			query.mobile = $(page).find("#mobile").val();
			query.bankcode  = $(page).find("#bankcode").val();
			query.bankcard = $(page).find("#bankcard").val();
			query.money = $(page).find("#money").val();

			query.payment_id = $.trim($("#uc_incharge input[name='paypath1']:checked").val());
			query.money = $.trim($("#uc_incharge #money1").val());
			query.post_type = "json";

			var ajaxurl = WAP_PATH+'/index.php?ctl=uc_save_incharge';
			$.showIndicator();
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(result){
					$.hideIndicator();
					if(result['is_sdk']==1){
						try{
							App.pay_sdk(jsonToString(result));
						}
						catch(e){
							$.toast("支付出错,请联系管理员");
						}
					}
					else{
						RouterURL(result.pay_wap,'#pay_wap_box',1);
					}
				}
			});
		});
	});

});

function setOldBankId(k){
	if(k==0){
		$("#pay_display .mt").attr("checked","");
		$("#pay_display .mt").removeAttr("checked");
	}
	$("#pay_display #old_bank_id").val(k);
}
function setInChrgTab(name,cursel,n){
	 for(i=1;i<=n;i++){
		  var menu=$("#"+name+i);
		  var con=$("#con_"+name+"_"+i);
		  //menu.attr("class",(i==cursel?"hover":""));
		   if(i==cursel){
		  	con.show();
		  }
		  else{
		  	con.hide();
		  }
	 }
}



function InchargeRes(cs) 
{   
	var cs;
	var money = $.trim($("#uc_incharge #money1").val());
	var ajaxurl = WAP_PATH+'/index.php?ctl=incharge_bid';
	var id =  cs;
	var query = newObject();
	query.id =  cs;
	query.post_type = "json";
	$.ajax({
		url:ajaxurl,
		data:query,
		type:"post",
		dataType:"json",
		success:function(result){
			fee_type = result.fee_type;
			fee_amount = result.fee_amount; 
			var Fee_t= 0;
			if(fee_type==0){
				Fee_t = fee_amount;
			}
			else{
				Fee_t = money*fee_amount;
			}
			
		   $("#Fee_t").html("充值费用 :￥"+Fee_t+" 元");
		}
	});
  	
}
function callphone(){    
    window.location.href = "tel:400-800-8344";
}