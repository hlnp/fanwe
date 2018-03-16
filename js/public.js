var bid_calculate = false;
$(function(){
	'use strict';
	$("#uc_collect_editor").click(function(){
		var this_value=$("#uc_collect_editor").html();
		if(this_value=="编辑")
		{
			$(".invest_tit .delete").show();
		   $(this).html("完成");
		}
		else
		{
			$(".invest_tit .delete").hide();
			$(this).html("编辑");
		}
	});
	/*公告切换*/
	$(document).on("pageInit", "#uc_historical_record", function(e, id, page){
		$("#uc_historical_record #type a").click(function(){
			e.preventDefault();
			$(this).addClass("active").siblings().removeClass();
		});
	});
	/*首页绑定*/
	$(document).on("pageInit", "#init", function(e, id, page) {
		var loading = false;
		var post_act = null;
		var max_pos = 0;
        if($("#category_slidebox .hd").find("li").length <=1){
            $("#category_slidebox .hd").hide();
        }

        var $content = $(page).find(".content").on('refresh', function(e) {
	      	if (loading) return;
	      	loading =true;
	      	var query = newObject();
			query.is_ajax = 1;
		    $.ajax({
		    	url:$("#init .infinite-scroll").attr("ajaxurl"),
		        data:query,
		        success:function(result){
		        	loading =false;
		       	 	$content.find('.content').html(result);
	       			$.pullToRefreshDone($content);
		       	}
		       	,error:function(){
					$.toast("通信失败");
				}
		     });
	    });
	    InitPostBar();
	    function InitPostBar(){
	    	clearTimeout(post_act);
	    	 $("#init .init-bar-statics .posbar .col").each(function(){
		    	var pos = $(this).attr("pos");
		    	var nowpos = $(this).attr("nowpos");
		    	nowpos = parseInt(nowpos)+1;
		    	if(nowpos <= pos){
		    		$(this).find(".point").css({height:nowpos+"%"});
		    		$(this).attr("nowpos",nowpos);
		    		if(nowpos >= max_pos)
		    			max_pos = nowpos;
		    	}
		    });

		    if(max_pos <100)
		    	post_act = setTimeout(InitPostBar,50);
	    };
	});
	 $(document).on("pageInit", "#learn_activity", function(e, id, page) {
		 $("#learn_activity .tz_link_btn").click(function(){
		 	var obj = $(this);
		    $.confirm("确定投资？",function(){
		        var ajaxurl = WAP_PATH + '/index.php?ctl=uc_learn_do_invest';
		        var query = newObject();
		        query.learn_id = obj.attr("data-id");
		        query.money = $.trim($("#learn_activity #money").val());
		        query.status = 0;
		        query.post_type = "json";
		        $.showIndicator();
		        $.ajax({
		            url:ajaxurl,
		            data:query,
		            type:"Post",
		            dataType:"json",
		            success:function(data){
		                $.alert(data.show_err,function(){
							RouterURL(WAP_PATH + '/index.php?ctl=learn_activity');
		                });
		            }
			        ,error:function(){
						$.hideIndicator();
						$.toast("通信失败");
					}
		        });
		    },function(){
		    	return false;
		    });

		});
	});
	  /*登录页面*/
	$(document).on("pageInit", "#login", function(e, id, page) {
		//是否显示密码，清空已经输入的内容函数
		display();
		clearContent();
		btn();
		displayButton();
		//登陆
		$("#login #email").blur(function(){
			if($.trim($(this).val())=="")
			{
				$.toast('用户名不能为空');
				return false;
			}
		});
		$("#login #pwd").blur(function(){
			if($.trim($(this).val())=="")
			{
				$.toast('密码不能为空');
				return false;
			}
		});
		$("#login .ui-button_login").click(function(){
			var email_val=$.trim($("#login #email").val());
			var pwd=$.trim($("#login #pwd").val());
			if(!email_val)
			{
				$.toast("请填写用户名");
				return false;
			}
			if(!pwd)
			{
				$.toast("请填写密码");
				return false;
			}
			var ajaxurl = WAP_PATH + '/index.php?ctl=login';
			var query = newObject();
			query.email = email_val;
			query.pwd = pwd;
			query.post_type = "json";

			$.showIndicator();
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"POST",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					$.toast(data.show_err);
					if(data.user_login_status == 1)
					{
						try{
							var json = '{"id":"'+data.id+'","user_name":"'+data.user_name+'"}';
							App.login_success(json);
						}
						catch(e){
						}
						if(document.referrer.indexOf("login_out") > 0 || document.referrer.indexOf("register") > 0 ){
							RouterURL(WAP_PATH+'/index.php?ctl=init','#init',2);
						}else{
							location.replace(document.referrer);
						}
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("连接失败,请检查您的网络连接");
				}
			});
		});

	});

	/*忘记密码*/
	$(document).on("pageInit", "#forget_pwd", function(e, id, page) {
		$("#forget_pwd #signup-submit").click(function(){
			var sname;
			sname=$.trim($("#forget_pwd #user_pwd").val());
			var reg=/^[a-zA-z0-9]{6,}$/;
			var regs=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
			if(reg.test(sname)){
				if(regs.test(sname)){
				}
				else{
					$.toast("安全等级低，请用数字+字母");
					return false;
				}
			}
			else{
				$.toast("密码长度在6~16之间，只能包含字符、数字和下划线。");
				return false;
			}
			var ajaxurl = WAP_PATH + '/index.php?ctl=save_reset_pwd2';
			var query = newObject();
			query.mobile = $.trim($("#forget_pwd #mobile").val());
			query.mobile_code = $.trim($("#forget_pwd #mobile_code").val());
			query.user_pwd = $.trim($("#forget_pwd #user_pwd").val());
			query.user_pwd_confirm = $.trim($("#forget_pwd #user_pwd_confirm").val());
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
					if(data.response_code){
						RouterURL(WAP_PATH + '/index.php?ctl=login',"#login");
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});
		$("#forget_pwd #getcode").click(function(){
			if(localStorage.sendtime !="undefined" &&  parseInt(new Date().getTime()/1000) - localStorage.sendtime < 60){
				$.toast("发送中，请稍后");
				return false;
			}
			var ajaxurl = WAP_PATH +'/index.php?ctl=send_reset_pwd2_code';
			var query = newObject();
			query.mobile = $.trim($("#forget_pwd #mobile").val());
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
						$("#forget_pwd .count_down").show();
						left_time_to_send_login($("#forget_pwd #getcode"));

					}
					$.toast(data.show_err);

				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});

		function left_time_to_send_login(){
			clearTimeout(regsiter_vy_time);
			if(left_rg_time > 0){
				regsiter_vy_time = setTimeout(left_time_to_send_login,1000);
				$("#forget_pwd .count_down").html(left_rg_time+"s");
				left_rg_time -- ;
			}
			else{
				is_lock_send_vy = false;
				$("#forget_pwd #getcode").val("验证码");

				left_rg_time = 0;
				$("#forget_pwd .count_down").hide();
			}
		}

		clearContent();
		btn();
		displayButton();
	});

	/*注册页面*/
	$(document).on("pageInit", "#register", function(e, id, page) {

		clearContent();
		btn();
		displayButton();

		$("#register #signup-submit").click(function(){
			var sname;
			sname=$.trim($("#register #user_pwd").val());
			var reg=/^[a-zA-z0-9]{6,}$/;
			var regs=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
			if(reg.test(sname)){
				if(regs.test(sname)){
				}
				else{
					$.toast("密码安全等级低，请用数字+字母");
					return false;
				}
			}
			else{
				$.toast("密码长度在6~16之间，只能包含字符、数字和下划线。");
				return false;
			}
			$.showIndicator();
			var ajaxurl = WAP_PATH +'/index.php?ctl=register';
			var query = new Object();
			query.user_name = $.trim($("#register #user_name").val());
			query.user_pwd = $.trim($("#register #user_pwd").val());
			query.user_pwd_confirm = $.trim($("#register #user_pwd_confirm").val());
			query.mobile = $.trim($("#register #phone").val());
			query.mobile_code = $.trim($("#register #mobile_code").val());
			query.referer = $.trim($("#register #referer").val());
			query.post_type = "json";
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					if(data.user_login_status){
						$.alert(data.show_err,function(){
							RouterURL(WAP_PATH +'/index.php?ctl=register_idno','register_idno',1);
						});
					}else{
						$.toast(data.show_err);
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});
		$("#register #getcode").click(function(){
			if(localStorage.sendtime !="undefined" &&  parseInt(new Date().getTime()/1000) - localStorage.sendtime < 60){
				$.toast("发送中，请稍后");
				return false;
			}
			var ajaxurl = WAP_PATH +'/index.php?ctl=send_register_code';
			var query = newObject();
			query.mobile = $.trim($("#register #phone").val());
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
						$("#register .count_down").show();
						left_time_to_send_regvy($("#register #getcode"));
					}
					$.toast(data.show_err);
				},error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});

		$("#register #user_name").bind("blur",function(){
			var obj = $(this);
			var ajaxurl = APP_ROOT+"/index.php?ctl=ajax&act=check_field";
			var query = new Object();
			query.field_name = "user_name";
			query.field_data = $.trim(obj.val());
			query.is_pc = 1;
			$.ajax({
				url: ajaxurl,
				data:query,
				type: "POST",
				dataType: "json",
				success: function(data){
					if(data.status!=1)
					{
						$.toast(data.info);
					}
				}
			});
		}); /*用户名验证*/

		//验证码倒计时
		var regsiter_vy_time = null;  	//定义时间
		var is_lock_send_vy = false;	//解除锁定
		var left_rg_time = 0;			//开始时间
		function left_time_to_send_regvy(){
			clearTimeout(regsiter_vy_time);
			if(left_rg_time > 0){
				regsiter_vy_time = setTimeout(left_time_to_send_regvy,1000);
				$("#register .count_down").html(left_rg_time+"s");
				left_rg_time -- ;
			}
			else{
				is_lock_send_vy = false;
				$("#register #getcode").val("验证码");

				left_rg_time = 0;
				$("#register .count_down").hide();
			}
		}
	});
	$(document).on("pageInit", "#uc_center", function(e, id, page){
	//	上传头像   未完成
		$.fn.localResizeIMG = function (obj) {
			var ViewHeight;
			var ViewWidth;
			var pLeft;
			var pTop;
			var base64;
			var scale;
			this.on('change', function () {
				var file = this.files[0];
				var URL = URL || webkitURL;
				var blob = URL.createObjectURL(file);
				// 执行前函数
				if($.isFunction(obj.before)) { obj.before(this, blob, file) };
				_create(blob, file);
				this.value = '';   // 清空临时数据
			});
			/**
			 * 生成base64
			 * @param blob 通过file获得的二进制
			 */
			function _create(blob) {
				var img = new Image();
				img.src = blob;
				img.onload = function () {
					var that = this;
					//生成比例
					var w = that.width,
						h = that.height,
						scale = Math.max(w/$(window).width(),h/$(window).height());
					if(scale>1){
						ViewWidth=parseInt(Math.floor(w/scale));
						ViewHeight=parseInt(Math.floor(h/scale));
					}
					else{
						ViewWidth=w;
						ViewHeight=h;
					}
					//生成canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					canvas.width = ViewWidth;
					canvas.height = ViewHeight;
					ctx.drawImage(that,0,0,ViewWidth,ViewHeight);
					/**
					 * 生成base64
					 * 兼容修复移动设备需要引入mobileBUGFix.js
					 */
					base64 = canvas.toDataURL('image/jpeg');

					// 修复IOS
					if( navigator.userAgent.match(/iphone/i) ) {
						var mpImg = new MegaPixImage(img);
						mpImg.render(canvas, { maxWidth: ViewWidth, maxHeight: ViewHeight, orientation: 6});
						base64 = canvas.toDataURL('image/jpeg');
					}
					// 修复android
					if( navigator.userAgent.match(/Android/i) ) {
						var encoder = new JPEGEncoder();
						base64 = encoder.encode(ctx.getImageData(0,0,ViewWidth,ViewHeight), obj.quality * 100 || 80 );
					}
					// 生成结果
					var result = {
						base64 : base64
						// clearBase64: base64.substr( base64.indexOf(',') + 1 )
					};
					// 执行后函数
					obj.success(result);
				};
			}
		};
		//后期改动
		//页面直接这样引用上面的方法：
        $('#imageFile').localResizeIMG({
			//width: 500,
			// quality: 0.8,
			success: function (result) {
				var img = new Image();
				img.src = result.base64;
				$('form').find('imgDisplay').val(img.src);
				//$("#picDisplay")[0].src=$("#imgDisplay").val();
				$('form').submit();
			}
		});
		//	签到
/* 		$(".sign_success").click(function(){
			user_sign();
		}); */
	});
	/*邀请注册页面*/
	$(document).on("pageInit", "#invitation_register", function(e, id, page) {
		clearContent();
		btn();
		displayButton();
		$("#invitation_register #share").click(function(){
			//window.location.reload();
			$("#invitation_register #mask,#invitation_register #click_share").show();
			$("#invitation_register #mask,#invitation_register #click_share").click(function(){
				$("#invitation_register #mask,#invitation_register #click_share").hide();
			});
		});

		$("#invitation_register #signup-submits").click(function(){
			var sname;
			sname=$.trim($("#invitation_register #user_pwd").val());
			var reg=/^[a-zA-z0-9]{6,}$/;
			var regs=/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
			if(reg.test(sname)){
				if(regs.test(sname)){
				}
				else{
					$.toast("密码安全等级低，请用数字+字母");
					return false;
				}
			}
			else{
				$.toast("密码长度在6~16之间，只能包含字符、数字和下划线。");
				return false;
			}
			$.showIndicator();
			var ajaxurl = WAP_PATH +'/index.php?ctl=invitation_register';
			var query = new Object();
			query.user_name = $.trim($("#invitation_register #user_name").val());
			query.user_pwd = $.trim($("#invitation_register #user_pwd").val());
			query.user_pwd_confirm = $.trim($("#invitation_register #user_pwd_confirm").val());
			query.mobile = $.trim($("#invitation_register #phone").val());
			query.mobile_code = $.trim($("#invitation_register #mobile_code").val());
			query.referer = $.trim($("#invitation_register #referer").val());
			query.post_type = "json";
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					if(data.user_login_status)
					{
						//$.toast("111");
						$.alert(data.show_err,function(){
							RouterURL(WAP_PATH +'/index.php?ctl=register_idno','register_idno',1);
						});
					}else{
						$.toast(data.show_err);
						//$.toast("222");
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});

		$("#invitation_register #getcode").click(function(){
			if(localStorage.sendtime !="undefined" &&  parseInt(new Date().getTime()/1000) - localStorage.sendtime < 60){
				$.toast("发送中，请稍后");
				return false;
			}
			var ajaxurl = WAP_PATH +'/index.php?ctl=send_register_code';
			var query = newObject();
			query.mobile = $.trim($("#invitation_register #phone").val());
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
						$("#invitation_register .count_down").show();
						left_time_to_send_invitation($("#invitation_register #getcode"));

					}
					$.toast(data.show_err);
				},error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});

		function left_time_to_send_invitation(){
			clearTimeout(regsiter_vy_time);
			if(left_rg_time > 0){
				regsiter_vy_time = setTimeout(left_time_to_send_invitation,1000);
				$("#invitation_register .count_down").html(left_rg_time+"s");
				left_rg_time -- ;
			}
			else{
				is_lock_send_vy = false;
				$("#invitation_register #getcode").val("验证码");

				left_rg_time = 0;
				$("#invitation_register .count_down").hide();
			}
		}

		/*用户名验证*/
		$("#invitation_register #user_name").bind("blur",function(){
			var obj = $(this);
			var ajaxurl = APP_ROOT+"/index.php?ctl=ajax&act=check_field";
			var query = new Object();
			query.field_name = "user_name";
			query.field_data = $.trim(obj.val());
			query.is_pc = 1;
			$.ajax({
				url: ajaxurl,
				data:query,
				type: "POST",
				dataType: "json",
				success: function(data){
					if(data.status!=1)
					{
						$.toast(data.info);
					}
				}
			});
		});
	});

	/**
	 *注册  STEP2身份认证
	 */
	$(document).on("pageInit", "#register_idno", function(e, id, page) {

		$("#register_idno #idno_submit").click(function(){
			var ajaxurl = WAP_PATH +'/index.php?ctl=register_idno';;
			var query = newObject();
			query.real_name = $.trim($("#register_idno #real_name").val());
			query.idno = $.trim($("#register_idno #idno").val());
			query.post_type = "json";
			$.showIndicator();
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					if(data.status==1)
					{
						$.toast(data.show_err);
						if(data.acct_url)
							RouterURL(data.acct_url,"none",1);
						else
							RouterURL(WAP_PATH + '/index.php?ctl=uc_center',"#uc_center",2);

					}
					else{
						$.toast(data.show_err);
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});
		});
	});
});
/*未开始项目倒计时*/
function project_leftTimeAct_f(left_time,project_leftTimeAct){
	clearTimeout(project_leftTimeAct);
	$(left_time).each(function(){
		var leftTime = parseInt($(this).attr("data"));
		if(leftTime > 0)
		{
			var day  =  parseInt(leftTime / 24 /3600);
			var hour = parseInt((leftTime % (24 *3600)) / 3600);
			var min = parseInt((leftTime % 3600) / 60);
			var sec = parseInt((leftTime % 3600) % 60);
			$(this).find(".day").html((day<10?"0"+day:day));
			$(this).find(".hour").html((hour<10?"0"+hour:hour));
			$(this).find(".min").html((min<10?"0"+min:min));
			$(this).find(".sec").html((sec<10?"0"+sec:sec));
			leftTime = leftTime-1;
			$(this).attr("data",leftTime);
		}
		else{
			$(this).parent(".div_dt").hide();
			$(this).parent().next().show();
			return false;
		}
	});
	project_leftTimeAct = setTimeout(function(){
		project_leftTimeAct_f(left_time,project_leftTimeAct);
	},1000);
};
function project_deals_bind_menu()
{
	/*筛选分类*/
	var hideList_height = $(document).height();
	$(".hide_list").css("height",hideList_height+"px");
	$(".mall-cate>li").each(function(index){
		var $this = $(this);
		$this.bind({
			click:function(e){
				e.stopPropagation();
				/*初始化*/
				$(".abbr").removeClass("webkit-box");
				$(".hide_list").hide();
				$("#second_list>ul").hide();
				if(!($this.hasClass("cur"))){
					$this.addClass("cur").siblings().removeClass("cur");
					$(".hide_list").show().find(".abbr").eq(index).addClass("webkit-box").find("#second_list>ul").eq(index).show();
					$("#first_list li").each(function(index){
						var $this = $(this);
						$this.click(function(e){
							e.stopPropagation();
							$(".second_list>ul").hide();
							$this.addClass("select").siblings().removeClass("select");
							$(".second_list>ul").eq(index).show();
						});
					});
					$("#second_list>ul").hide();
				}
				else{
					$this.removeClass("cur");
					$(".abbr").eq(index).removeClass("webkit-box");
				}
			} ,
			change:function(){

			}
		});
	});

	$(".abbr").bind("click",function(e){
		e.stopPropagation();
	});

	$(document).click(function(){
		$(".mall-cate>li").removeClass("cur");
		$(".abbr").removeClass("webkit-box");
		$(".hide_list").hide();
		$("#second_list>ul").hide();
	});
}

/*截取url参数*/
function get_url_params(query)
{
   var url = location.search; /*获取url中"?"符后的字串*/
   var theRequest = query;
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}
//TODO:截取邀请功能url
function GetQueryString(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]);
	return null;
}

/*登记借款*/
$(document).on("pageInit", "#deal_msgboard", function(e, id, page) {

	var regsiter_vy_time = null;  	//定义时间
	var is_lock_send_vy = false;	//解除锁定
	var left_rg_time = 0;			//开始时间
	function left_time_to_send_regvy(){
		clearTimeout(regsiter_vy_time);
		if(left_rg_time > 0){
			regsiter_vy_time = setTimeout(left_time_to_send_regvy,1000);
			$("#deal_msgboard #getcode").val(left_rg_time+"秒后重获验证码");
			left_rg_time -- ;
		}
		else{
			is_lock_send_vy = false;
			$("#deal_msgboard #getcode").val("重新获取验证码");

			left_rg_time = 0;
		}
	}


	$("#deal_msgboard #signup-submit").click(function(){
		var user_name = $.trim($("#deal_msgboard #user_name").val());
		var ID_NO = $.trim($("#deal_msgboard #ID_NO").val());
		var mobile = $.trim($("#deal_msgboard #mobile").val());
		var money = $.trim($("#deal_msgboard #money").val());
		var time_limit = $.trim($("#deal_msgboard #time_limit").val());
		var unit = $.trim($("#deal_msgboard #unit").val());
		var verify_code = $.trim($("#deal_msgboard #verify_code").val());
		var usefulness = $.trim($("#deal_msgboard #usefulness").val());

		var ajaxurl = WAP_PATH +'/index.php?ctl=save_deal_msgboard';
		var query = newObject();
		query.user_name = $.trim($("#deal_msgboard #user_name").val());
		query.ID_NO = $.trim($("#deal_msgboard #ID_NO").val());
		query.mobile = $.trim($("#deal_msgboard #mobile").val());
		query.money = $.trim($("#deal_msgboard #money").val());
		query.time_limit = $.trim($("#deal_msgboard #time_limit").val());
		query.unit = $.trim($("#deal_msgboard #unit").val());
		query.verify_code = $.trim($("#deal_msgboard #verify_code").val());
		query.usefulness = $.trim($("#deal_msgboard #usefulness").val());

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
					$.alert(result.show_err);
					RouterURL(WAP_PATH + '/index.php?ctl=uc_center',"#uc_center",2);

				}
				else
				{
					$.alert(result.show_err);
				}
			}
			,error:function(){
				$.hideIndicator();
				$.toast("通信失败");
			}
		});
	});

	$("#deal_msgboard #getcode").click(function(){

		if(localStorage.sendtime !="undefined" &&  parseInt(new Date().getTime()/1000) - localStorage.sendtime < 60){
			$.toast("发送中，请稍后");
			return false;
		}
		if(is_lock_send_vy || $(this).hasClass(".btn_disable")){
			return false;
		}
		var ajaxurl = WAP_PATH +'/index.php?ctl=send_msgboard_code';
		var query = newObject();
		query.user_mobile =  $.trim($("#mobile").val());
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
					left_time_to_send_regvy();
				}
				$.alert(result.show_err);
			}
			,error:function(){
				$.hideIndicator();
				$.toast("通信失败");
			}
		});
	});
});

//TODO:新手指导加载

$(document).on("pageInit", "#uc_novice_guide", function(e, id, page) {
	$("#uc_novice_guide .content").on('scroll',function(){
		var top=-$(".floor01").offset().top;
		if(top>=20){
			$(".floor02,.arrow_lower02").show();
		}
		if(top>=520){
			$(".floor03,.arrow_lower03").show();
		}
		if(top>=1000){
			$(".floor04,.arrow_lower04,.floor05").show();
		}
		if(top>=1200){
			$(".floor05").show();
		}
	});
});

//TODO:安全保障加载

$(document).on("pageInit", "#uc_safety_guarantee", function(e, id, page) {
	$("#uc_safety_guarantee .content").on('scroll',function(){
		var tops=-$(".safe01").offset().top;
		if(tops>=-160){
			$(".direct01,.safe04").show();
		}
		if(tops>=150){
			$(".direct02,.safe05").show();
		}
		if(tops>=510){
			$(".safe06").show();
		}

	});
});