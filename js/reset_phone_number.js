$(document).ready(function(){
	/*忘记密码*/
	$(document).on("pageInit", "#reset_phone_number", function(e, id, page) {
		$("#reset_phone_number #phone-submit").click(function(){
			//var mobile_code = $.trim($("#reset_phone_number #phone-mobile_code").val());
			var ajaxurl = WAP_PATH + '/index.php?ctl=save_phone_number';
			var query = newObject();
			query.mobile = $.trim($("#reset_phone_number #phone-mobile").val());
			query.mobile_code = $.trim($("#reset_phone_number #phone-mobile_code").val());
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
		$("#reset_phone_number #phone-getcode").click(function(){
			if(localStorage.sendtime !="undefined" &&  parseInt(new Date().getTime()/1000) - localStorage.sendtime < 60){
				$.toast("发送中，请稍后");
				return false;
			}
			var ajaxurl = WAP_PATH +'/index.php?ctl=send_reset_phone_number_code';
			var query = newObject();
			query.mobile = $.trim($("#reset_phone_number #phone-mobile").val());
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
						$("#reset_phone_number .count_down").show();
						left_time_to_send_login($("#reset_phone_number #phone-getcode"));

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
				$("#reset_phone_number .count_down").html(left_rg_time+"s");
				left_rg_time -- ;
			}
			else{
				is_lock_send_vy = false;
				$("#reset_phone_number #phone-getcode").val("验证码");

				left_rg_time = 0;
				$("#reset_phone_number .count_down").hide();
			}
		}

		clearContent();
		btn();
		displayButton();
	});
});