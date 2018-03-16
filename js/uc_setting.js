
    //修改登陆密码
	$(document).on("pageInit", "#save_reset_pwd", function(e, pageId, $page) {

		var regsiter_vy_time = null;  	//定义时间
		var is_lock_send_vy = false;	//解除锁定
		var left_rg_time = 0;			//开始时间
		//修改登录密码
		$("#save_reset_pwd #dl-submit").click(function () {
			var sname=$.trim($("#save_reset_pwd #dl_user_pwd").val());
			var reg=/^[a-zA-z0-9]{6,}$/;
			var regs=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
			if(reg.test(sname)){
				if(!regs.test(sname)){
					$.toast("安全等级低，请用数字+字母");
					return false;
				}
			}
			else{
				$.toast("密码长度在6~16之间，只能包含字符、数字和下划线。");
				return false;
			}
			var ajaxurl = WAP_PATH + '/index.php?ctl=save_reset_pwd';
			var query = newObject();
			query.mobile = $.trim($("#save_reset_pwd #dl_mobile").val());
			query.mobile_code = $.trim($("#save_reset_pwd #dl_mobile_code").val());
			query.user_pwd = $.trim($("#save_reset_pwd #dl_user_pwd").val());
			query.user_pwd_confirm = $.trim($("#save_reset_pwd #dl_user_pwd_confirm").val());
			query.post_type = "json";
			$.showIndicator();
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					$.toast(data.show_err);
					if(data.response_code==1){
						loginquit();
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});
		$("#save_reset_pwd #dl_getcode").click(function(){
			if(localStorage.sendtime !="undefined" &&  parseInt(new Date().getTime()/1000) - localStorage.sendtime < 60){
				$.toast("发送中，请稍后");
				return false;
			}
			if(is_lock_send_vy || $(this).hasClass(".btn_disable")){
				return false;
			}
			var mobile = $.trim($("#save_reset_pwd #dl_mobile").val());
			var ajaxurl = WAP_PATH +'/index.php?ctl=send_reset_pwd_code';
			var query = newObject();
			query.mobile = mobile;
			query.post_type = "json";
			$.showIndicator();
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					if(data.response_code == 1){
						localStorage.sendtime = parseInt(new Date().getTime()/1000);
						left_rg_time = 60;
						$("#save_reset_pwd .count_down").show();
						left_time_to_send_regvy_dl();
					}
					$.toast(data.show_err);
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
			//验证码
			function left_time_to_send_regvy_dl(){
				clearTimeout(regsiter_vy_time);
				if(left_rg_time > 0){
					regsiter_vy_time = setTimeout(left_time_to_send_regvy_dl,1000);
					$("#save_reset_pwd .count_down").html(left_rg_time+"s");
					left_rg_time -- ;
				}
				else{
					is_lock_send_vy = false;
					$("#save_reset_pwd #dl_getcode").val("验证码");

					left_rg_time = 0;
					$("#save_reset_pwd .count_down").hide();
				}
			}


		});
		btn();
		clearContent();
		displayButton();
	});
	$(document).on("pageInit", "#uc_setting", function(e, id, page) {
		var response_code = $.trim($("#uc_setting #response_code").val());
		if(response_code==0){
			RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
		}
	 });
	//修改支付密码
	$(document).on("pageInit", "#reset_pay_pwd", function(e, pageId, $page) {
		$("#reset_pay_pwd #pay-submit").click(function(){

			var pay_pwd = $.trim($("#reset_pay_pwd #pay-user_pwd").val());
			var pay_pwd_confirm = $.trim($("#reset_pay_pwd #pay-user_pwd_confirm").val());
			if(pay_pwd!=pay_pwd_confirm){
				$.toast("新密码与确认密码不一致！");
				return false;
			}
			var ajaxurl = WAP_PATH +'/index.php?ctl=save_pay_pwd';
			var query = newObject();
			query.mobile_code= $.trim($("#reset_pay_pwd #pay-mobile_code").val());
			query.pay_pwd= $.trim($("#reset_pay_pwd #pay-user_pwd").val());
			query.pay_pwd_confirm= $.trim($("#reset_pay_pwd #pay-user_pwd_confirm").val());
			query.post_type='json';
			$.showIndicator();
			$.ajax({
				url: ajaxurl,
				data:query,
				type: "POST",
				dataType: "json",
				success: function(result){
					$.hideIndicator();
					if(result.response_code)
					{
						$.toast(result.show_err);
						RouterURL(WAP_PATH +'/index.php?ctl=uc_center','#uc_center');
					}
					else
					{
						$.toast(result.show_err);
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});

			btn();
			clearContent();
			displayButton();
		});
		$("#reset_pay_pwd #pay-getcode").click(function(){
			if(localStorage.sendtime !="undefined" &&  parseInt(new Date().getTime()/1000) - localStorage.sendtime < 60){
				$.toast("发送中，请稍后");
				return false;
			}
			var ajaxurl = WAP_PATH +'/index.php?ctl=send_reset_pay_code';
			var query = newObject();
			query.post_type='json';
			$.showIndicator();
			$.ajax({
				url: ajaxurl,
				data:query,
				type: "POST",
				dataType: "json",
				success: function(result){
					$.hideIndicator();
					if(result.response_code)
					{
						localStorage.sendtime = parseInt(new Date().getTime()/1000);
						left_rg_time = 60;
						left_time_to_send_regvy_pay();
						$("#reset_pay_pwd .count_down").show();
					}
					$.toast(result.show_err);
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
			function left_time_to_send_regvy_pay(){
				clearTimeout(regsiter_vy_time);
				if(left_rg_time > 0){
					regsiter_vy_time = setTimeout(left_time_to_send_regvy_pay,1000);
					$("#reset_pay_pwd .count_down").html(left_rg_time+"s");
					left_rg_time -- ;
				}
				else{
					is_lock_send_vy = false;
					$("#reset_pay_pwd #pay-getcode").val("验证码");
					left_rg_time = 0;
					$("#reset_pay_pwd .count_down").hide();
				}
			}
		});
		clearContent();
		displayButton();
	});

function btn(){
	//登陆框
	$('.ui-button_login').bind("touchstart", function () {
		$(this).css({background: "#42acc2", color: "#fff"})
	});
	$('.ui-button_login').on("touchend", function () {
		$(this).css({background: "#ffffff", color: "#5ac3d8"});
	});
	//按钮点击变色
	$('.register,.changed,.press').on("touchstart", function () {
		$(this).css({background: "#1d9ab3"});
	});
	$('.register,.changed,.press').on("touchend", function () {
		$(this).css({background: "linear-gradient(to right,#3db4cc,#6fd6ea)"});
	});
	//按钮点击变色
	$('.pay-changed,.view_ex,.green').on("touchstart", function () {
		$(this).css({background: "#20b885"});
	});
	$('.pay-changed,.view_ex,.green').on("touchend", function () {
		$(this).css({background: "linear-gradient(to right,#41d1a1,#6de3a4)"});
	});
};
function shadow(){
		$('.navigation li .nav-a').bind("touchstart", function () {
			$(this).addClass("shadow");
		},1000);
		$('.navigation li .nav-a').on("touchend", function () {
			$(this).removeClass("shadow");
		});
};
//登陆页输入框效果
function display(){
	//隐藏底部图片
	var h=$(window).height();
	$(window).resize(function() {
		if($(window).height()<h){
			$('.grassland').hide();

		}
		if($(window).height()>=h){
			$('.grassland').show();
		}
	});
	//用户名输入框点×清空
	$('.delect').click(function(){
		$('#email').val("");
		$('#email').focus();//不失焦
	});
	$('.form_group .display').click(function(){
		$('#pwd').focus();//不失焦
	});
};
	//输入框弹出隐藏底部按钮
function displayButton(){
		var h=$(window).height();
		$(window).resize(function() {
			if($(window).height()<h){
				$('.big-button,.changed,.pay-chaneged,.rule,.forget,.sure_ex').hide();
			}
			if($(window).height()>=h){
				$('.big-button,.changed,.pay-chaneged,.rule,.forget,.sure_ex').css({display:"block"});
			}
		});
};
//输入框清空
function clearContent(){
	//清空隐藏×
	$('.form_modify .delect,#uc_address .delect').click(function(){
		$(this).parent().find("input").val("").focus();
		$(this).hide();
	});
	//输入内容出现×
	var val01=$('.form_modify input').val();
	var val02=$('#uc_address  input').val();
	var val03=$('.applica_top  input').val();
	$('.form_modify input,#uc_address input').bind('input propertychange', function() {
		if(val01!=""||val02!=""||val03!=""){
			$(this).parent().find('.delect').show();
		}
	});
};

//弹出框
function code(){
	//弹出框
	$('.found').click(function() {
		$('#goodcover,#code,#applica_code').show();
	});
	//关闭按钮
	$('#closebt,#closebtn').click(function() {
		$('#goodcover,#code,#added_bank_list,#exchange_appli').hide();
	});
};
//显示隐藏密码
$('.display').on('click',function(){
	if($("#pwd").prop('type')=='password'){
		$("#pwd").prop('type','text');
		$('.display').css({backgroundPosition:"center 78.7%"});
	}
	else{
		$("#pwd").prop('type','password');
		$('.display').css({backgroundPosition:"center 19%"});
	}
});

	
