$(document).ready(function(){
	//提现
 	$(document).on("pageInit", "#uc_bank", function(e, id, page) {

		//TODO	长按删除
		var bankList=$("#uc_bank ul .checkin");
		$.fn.longPress = function(fn) {
			var timeout = undefined;
			var $this = this;
			for(var i = 0;i<$this.length;i++){
				$this[i].addEventListener('touchstart', function(event) {
					timeout = setTimeout(function(e){
						$.confirm("确认删除？",function(){
							var ajaxurl = WAP_PATH+'/member.php?ctl=uc_del_bank';
							var  id = $.trim($this.find("input").val());
							var query = new Object();
							query.id = id;
							query.post_type = "json";
							$.ajax({
								url:ajaxurl,
								data:query,
								type:"Post",
								dataType:"json",
								success:function(data){
									$.toast(data.show_err);
									if(data.response_code==1){
										$("#uc_bank .bank-box-"+id).remove();
										RouterURL(WAP_PATH+'/member.php?ctl=uc_bank',"#uc_bank","#uc_bank",2);
									};
								}
							});
						});
					}, 500);  //长按时间超过500ms，则执行传入的方法
				}, false);
				$this[i].addEventListener('touchend', function(event) {
					clearTimeout(timeout);  //长按时间少于1000ms，不会执行传入的方法
				}, false);
			}
		},
		bankList.longPress(function(e){
		});

		code();
		btn();
		displayButton();

		var size=$("#uc_bank .bank_queue li").size();
		$("#uc_bank #add").click(function(){
			if(size>=3){
				$.toast("您最多可添加3张银行卡");
			}else{
				RouterURL(WAP_PATH+'/member.php?ctl=uc_add_bank','#uc_add_bank',2);
			}
		});
    });

    //添加银行卡
    $(document).on("pageInit", "#uc_add_bank", function(e, id, page) {

		$.ajax({
			url:APP_ROOT+"/system/region.js",
			cache:true,
			success:function(result){
				eval(result);
				load_bk_select("1",regionConf);
				$("#uc_add_bank select[name='region_lv2']").live("change",function(){
					load_bk_select("2",regionConf);
				});
				$("#uc_add_bank select[name='region_lv3']").live("change",function(){
					load_bk_select("3",regionConf);
				});
			}
		});

	 	$("#uc_add_bank #add_bank").click(function(){
	 		var ajaxurl = WAP_PATH+'/member.php?ctl=uc_save_bank';
	 		var query = new Object();
	 		query.bank_id = $("#uc_add_bank #bank_id").val();
	 		query.bankzone = $.trim($("#uc_add_bank #bankzone").val());
	 		query.bankcard = $.trim($("#uc_add_bank #bankcard").val());
	 		query.region_lv1 = $.trim($("#uc_add_bank #region_lv1").val());
	 		query.region_lv2 = $.trim($("#uc_add_bank #region_lv2").val());
	 		query.region_lv3 = $.trim($("#uc_add_bank #region_lv3").val());
	 		query.region_lv4 = $.trim($("#uc_add_bank #region_lv4").val());
	 		query.post_type = "json";
	 		$.ajax({
	 			url:ajaxurl,
	 			data:query,
	 			type:"Post",
	 			dataType:"json",
	 			success:function(data){
					
	 				if(data.user_login_status==1){
		 				if(data.response_code==1){
							$.toast(data.show_err);
				 			reloadpage(WAP_PATH+'/member.php?ctl=uc_bank','#uc_bank','.content',function(){
				 				RouterBack(WAP_PATH+'/member.php?ctl=uc_bank','#uc_bank','#uc_bank');
				 			});
			 			}else{
							$.toast(data.show_err);
						}
	 				}
	 				else{
	 					RouterURL(WAP_PATH+'/member.php?ctl=login','#login');
	 				}
	 			}
	 		});
	 	});

		code();
		btn();
		displayButton();
		//地区选择变成黑色
		$(".region_select .info select").click(function(){
			$(this).removeClass("a9").addClass("a1");
		});
		$("#bank_select_list li.close-popup").click(function(){
			$(this).addClass("default_bank").siblings().removeClass("default_bank");
			var bankName=$(this).find(".bankName").html();
			var bankValue=$(this).find("input").val();
			$(".bank_list .this_bank").html(bankName).removeClass("a9").addClass("a1");
			$(".bank_list input").val(bankValue);
		});	
    });

    //选择提现银行卡
    $(document).on("pageInit", "#uc_carry_money", function(e, id, page) {
		$("#uc_carry_money .bank_seclets li.bank_select").click(function(){
			$("#goodcover,#added_bank_list").hide();
			$(this).addClass("default_bank").siblings().removeClass("default_bank");
		});

		code();
		btn();
		displayButton();
         //提现页判断
	 	$("#uc_carry_money .this_expressive").click(function(){
			var money=parseInt($("#uc_carry_money #Jcarry_amount").val());
			var moneyMax=parseInt($("#uc_carry_money #Jcarry_totalAmount").val());
			if(!money){
				$.toast("提现最低金额为1元");

			}
			if(money > moneyMax){
				$.toast("可提现余额不足");
			};
			if(money>=1 && money<=moneyMax){
				$(this).addClass("open-popup");
			}
	 	}); 
		$("#uc_carry_money #Jcarry_amount").change(function(){
			$("#uc_carry_money .this_expressive").removeClass("open-popup");
		});        
		//确认提现页面
	 	$("#submit_pwd").click(function(){
			var bid = $.trim($("#uc_carry_money #band_id").val());
			var amount = $.trim($("#uc_carry_money #Jcarry_amount").val());
			var paypassword = $.trim($("#trade_pwd").val());
	 		var ajaxurl = WAP_PATH+'/member.php?ctl=uc_save_carry';
	 		var query = newObject();
	 		query.bid = bid;
	 		query.amount = amount;
	 		query.paypassword = paypassword;
	 		query.post_type = "json";
	 		$.ajax({
	 			url:ajaxurl,
	 			data:query,
	 			type:"Post",
	 			dataType:"json",
	 			success:function(data){
	 				if(data.response_code==1){
						$.toast(data.show_err);
						RouterURL(WAP_PATH+'/member.php?ctl=uc_carry_money_log','#uc_carry_money_log',2);
						$("#shopping_exchange").css({display:"none"});
					}else{
						$.toast(data.show_err);
					}
	 			}
	 		});
	 	});
		var balance=$("#uc_carry_money #Jcarry_accountBalance").val();
		var balanceShop=parseInt(balance/760);
		$("#uc_carry_money .purchase_tip span.m_co").html(balanceShop);	
	});
});

function load_bk_select(lv,regionConf){
	var name = "region_lv"+lv;
	var next_name = "region_lv"+(parseInt(lv)+1);
	var id = $("#uc_add_bank select[name='"+name+"']").val();
	
	var x = "";
	if(lv==1){
		var evalStr="regionConf.r"+id+".c";
		x="省份";
	}
	if(lv==2){
		var evalStr="regionConf.r"+$("#uc_add_bank select[name='region_lv1']").val()+".c.r"+id+".c";
		x="城市";
	}
	if(lv==3){
		var evalStr="regionConf.r"+$("#uc_add_bank select[name='region_lv1']").val()+".c.r"+$("#uc_add_bank select[name='region_lv2']").val()+".c.r"+id+".c";
		x="城区";
	}
	
	if(id==0)
	{
		var html = "<option value='0'>"+x+"</option>";
	}
	else
	{
		var regionConfs=eval(evalStr);
		evalStr+=".";
		var html = "<option value='0'>"+x+"</option>";
		for(var key in regionConfs)
		{
			html+="<option value='"+eval(evalStr+key+".i")+"'>"+eval(evalStr+key+".n")+"</option>";
		}
	}
	$("#uc_add_bank select[name='"+next_name+"']").html(html);
	
	if(lv != 4)
	{
		load_bk_select(parseInt(lv)+1);
	}
}

 /*第一种形式 第二种形式 更换显示样式*/
function setBkTabS(sname,cursel,n){
	 for(i=1;i<=n;i++){
		  var menu=$("#uc_bank #"+sname+i);
		  var con=$("#uc_bank #con_"+sname+"_"+i);
		  if(i==cursel){
		  	con.show();
		  	menu.addClass("hover");
		  }
		  else{
		  	con.hide();
		  	menu.removeClass("hover");
		 }
	 }
}