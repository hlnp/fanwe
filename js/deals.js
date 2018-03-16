$.alert(1);
$(document).ready(function(){
	/*购买羊只列表页*/
	$(document).on("pageInit", "#deals", function(e, id, page) {
		var now_page = 1;
		var all_page = 0;
		var loading = false;
		$("#deals .infinite-scroll-preloader").hide();
		$(page).on('infinite', function() {
			all_page=$("#deals .infinite-scroll").attr("all_page");
			now_page = $("#deals .content").attr("now_page");
			now_page = parseInt(now_page);
		   	//if (loading || now_page >= all_page) return;
			$("#deals .infinite-scroll-preloader").show();
		    loading = true;
			var query = newObject();
			query.page  =  now_page + 1;
			query.is_ajax = 1;
			
			var parms = get_search_parms();
			var ajaxurl = $("#deals .infinite-scroll").attr("ajaxurl");
		    $.ajax({
		      	url:ajaxurl + parms,
		        data:query,
		        success:function(result){
		        	now_page ++;
					$("#deals .content").attr("now_page",now_page);
		        	loading = false;
		        	//$("#deals .infinite-scroll .recommended_nav_2").append(result);
		        	$("#deals .infinite-scroll .pull-to-refresh-layer").last().remove();
		        	$("#deals .infinite-scroll-preloader").hide();
		        	$.refreshScroller();
					$("#deals .no_more").show();
		        }
		      });
	    });
	    var $content = $(page).find(".content").on('refresh', function(e) {
	      	if (loading) return;
	      	loading =true;
	      	var query = newObject();
			query.page  =  1;
			query.is_ajax = 1;
			var parms = get_search_parms();
			var ajaxurl = $("#deals .infinite-scroll").attr("ajaxurl");
		    $.ajax({
		    	url:ajaxurl + parms,
		        data:query,
		        success:function(result){
		        	now_page=1;
					 $("#deals .content").attr("now_page",now_page);
		        	loading =false;
		       	 	$content.find('.invest').html(result);
		       	 	$("#deals .infinite-scroll").attr("all_page",$("#deals .pull-to-refresh-layer").attr("all_page"));
	       			$.pullToRefreshDone($content);
		       	}
		     });
	    });
		//羊群类型切换背景色
		$("#type a").click(function(){
			e.preventDefault();
			var cur=$(this).index();
			switch (cur){
				case 0:$(this).addClass("active1").siblings().removeClass();
					break;
				case 1:$(this).addClass("active2").siblings().removeClass();
					break;
				case 2:$(this).addClass("active3").siblings().removeClass();
					break;
			}
		});
	});
	/*购买羊只  项目详情页*/
	$(document).on("pageInit", "#deal", function(e, pageId, $page) {
		btn();
		code();
		displayButton();
		moneyTotle();
		var response_code = $.trim($("#deal #response_code").val());
//		if(response_code==0){
//			RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
//		}
		
		$("#red_select_list li.close-popup").click(function(){
			var red_name=$(this).find(".red_name").html();
			var hotValue=$(this).find(".red_xz").val();
			$("#deal .hotValue").val(hotValue);
			$("#deal .hotName").html(red_name).removeClass("a9").addClass("a1");
		});
		var is_submit_lock = false;
		var bid_paypassword = "";
		var bid_calculate = null;
		$("#deal #pay_deal").click(function(){
			if(is_submit_lock==true) return ;
			is_submit_lock = true;
			var ajaxurl = WAP_PATH+'/index.php?ctl=deal_dobid';
			var query = newObject();
			
			query.id = $.trim($("#deal #deal_id").val());
			query.bid_money = $.trim($("#deal #pay_inmoney").val());
			query.buy_number = $.trim($("#deal #buy_number").val());
			query.bid_paypassword = $.trim($("#deal #pay_inmoney_password").val());
			query.ecv_id = $.trim($("#deal #ecvs_id").val());
			query.use_interestrate = $.trim($("#deal #use_interestrate").val());
			query.interestrate_id = $.trim($("#deal #interestrate_id").val());
			query.min_loan_money = $.trim($("#deal #min_loan_money").val());
			query.risk_rank = $.trim($("#deal #risk_rank").val());
			query.post_type = "json";
			$.showIndicator();
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					is_submit_lock = false;
					if(data.status == 2){
						window.location.href = data.app_url;
					}else{
						$.alert(data.show_err,function(){
							if(data.response_code == 1){
								//RouterURL(WAP_PATH+'/index.php?ctl=uc_invest','#uc_invest',2);
								//购买成功
								$("#goodcover").show();
								$("#exchange_appli").show();
								code();
							}
						});
					}
				}
				,error:function(){
					$.hideIndicator();
					$.toast("通信失败");
				}
			});

		});

		var loading = false;
		var post_act = null;
		var max_pos = 0;
		//TODO  下拉刷新
		var $content = $(page).find(".content").on('refresh', function(e) {
			if (loading) return;
			loading =true;
			var query = newObject();
			query.is_ajax = 1;
			$.ajax({
				url:$("#deal .infinite-scroll").attr("ajaxurl"),
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
        //是否同意协议
		$('#deal .isAgree').click(function(){
			if($('#deal .isAgree').attr("checked")){
				$(".sure button").removeAttr("disabled").removeClass("disabled");
				$('#deal .isAgree').removeAttr("checked");
			}else{
				$(".sure button").addClass("disabled").attr('disabled','disabled');;
			}
		});
		$("#Routine a.c_number").click(function(){
			$.alert(1);
			var rel=$(this).attr("rel");
			var obj = $(this);
			var number = parseInt($("#Routine #pay_inmoney").val());
			switch(rel){
				case "-":
					if(number-1 > 1){
						$("#Routine #pay_inmoney").val(number-1);
					}
					else{
						$("#Routine #pay_inmoney").val(1);
					}
					break;
				case "+":
					var max_portion = $("#Routine .c_number-box").attr("max");
					if(number+1 <= max_portion){
						$("#Routine #pay_inmoney").val(number+1);
					}
					else{
						if(!number){
							$("#Routine #pay_inmoney").val(1);
						}else{
							$("#Routine #pay_inmoney").val(max_portion);
						}
					}
		
				break;
			}
			loadDealSy();
			moneyTotle();
		});
		$('#deal #pay_inmoney').bind("input onporpertychange",function() {
			var max_portion = parseInt($("#deal .c_number-box").attr("max"));
			if(max_portion < $(this).val()){
				$("#Routine #pay_inmoney").val(max_portion);
				$.toast("超出剩余数量");
			};
			loadDealSy();
			moneyTotle();
		});

		loadDealSy();
		
		var changeProcess_act = null;
		var process_num = 0;
		changeProcess();
		function changeProcess(){
			clearTimeout(changeProcess_act);
			var ns = parseFloat($("#deal #detail_process").attr("data"));
			if(process_num ==ns){
				return;
			}
			if(process_num < ns){
				process_num = parseFloat(process_num) + 0.8;
			}
			if(process_num > ns){
				process_num =ns;
			}
			
			process_num =process_num.toFixed(2);
			if(process_num <= ns){
				$("#deal #detail_process .tip em").html(process_num+"%");
				$("#deal #detail_process .tip_bar").css({"padding-left":process_num+"%"});
				$("#deal #detail_process .pros").css({"width":process_num+"%"});
				changeProcess_act = setTimeout(changeProcess,1);
			}
		}
		function moneyTotle(){
			var pay_inmoney=$("#deal #pay_inmoney").val();
			var buy_number=$("#deal #buy_number").val();
			var Money=pay_inmoney*buy_number;
			$("#deal .sheepNumber").html(pay_inmoney);
			$("#deal .Money").html("￥"+Money.toFixed(2));
		};
		
	});
	 /*投资搜索页*/
	$(document).on("pageInit", "#deals_search", function(e, id, page) {
		$("#deals_search .sideToggle_parent dl dd").click(function(){
			var index_value=$(this).parents("aside").attr("index-value");
			var data_type_name=$(this).attr("data-type-name");
			var data_type_value=$(this).attr("data-type-value");
			
			$(this).addClass("active").siblings().removeClass("active");
			$(this).find("i").html("&#xe61b;");
			$(this).siblings().find("i").html("&#xe63d;");
			$("#deals_search .deals_search_list li").eq(index_value).attr("data-type-name",data_type_name).attr("data-type-value",data_type_value);
			$("#deals_search .deals_search_list li").eq(index_value).find(".conditions").addClass("active").html(data_type_name);
			
			$("#deals_search .d_search_box .reset").css("display","block");
			
		});
		$("#deals_search .d_search_box .reset").click(function(){
			$("#deals_search .deals_search_list li").attr("data-type-name","不限").attr("data-type-value","0").find(".conditions").removeClass("active").html("不限");
			$("#deals_search .sideToggle_parent dl").each(function(){
				$(this).find("dd").eq(0).addClass("active").siblings().removeClass("active");
				$(this).find("dd").eq(0).find("i").html("&#xe61b;");
				$(this).find("dd").eq(0).siblings().find("i").html("&#xe63d;");
				$("#deals_search .d_search_box .reset").css("display","none");
			});
			
		});
		
		$("#deals_search .click_search").click(function(){
			
			var parms = get_search_parms();
			var url = WAP_PATH+"/index.php?ctl=deals"+parms;
			if($("#deals").length > 0){
				$.router.loadPage("#deals");
				reloadpage(url,"#deals",'.invest');
			}
			else{
				$.router.loadPage(url);
			}
		});
	});

	//发表留言需更改
	$(document).on("pageInit", "#uc_publish_message", function(e, id, page) {
		$("#uc_publish_message #add_msg").click(function(){
			var ajaxurl = WAP_PATH+"/index.php?ctl=msg";
			var query = newObject();
			query.rel_table = $.trim($("#uc_publish_message #rel_table").val());
			query.rel_id = $.trim($("#uc_publish_message #rel_id").val());
			query.title = $.trim($("#uc_publish_message #title").val());
			query.content = $.trim($("#uc_publish_message #content").val());
			query.post_type = "json";
			$.showIndicator();
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					$.hideIndicator();
					if(data.user_login_status==0){
						RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
					}
					else if(data.response_code == 0){
						$.toast(data.show_err);
					}
					else{
						$.toast(data.show_err);
						//此处需更改
						var html = '<li class="fillet clearfix">';
			          		html += '<div class="portrait fl"><img src="'+data.avatar+'"/></div>';
							html += '<div class="cont fl">';
							html += '		<p >'+data.user_name+'</p>';
							html += '		<p class="a9">'+data.create_time+'</p>';
							html += '		<p class="message_content">'+data.content+'</p>';
							html += '</div>';
			          		html += '</li>';
						var userEntity=html;
						// 存储值：将对象转换为Json字符串
						localStorage.setItem('user', JSON.stringify(userEntity));
						RouterURL(WAP_PATH+'/index.php?ctl=uc_message_board','#uc_message_board',2);
					}
				}
				,error:function(){
					$.toast("通信失败");
					$.hideIndicator();
				}
			});
		});
	});
	$(document).on("pageInit", "#uc_message_board", function(e, id, page) {
		// 取值时：把获取到的Json字符串转换回对象
		var userJsonStr = localStorage .getItem('user');
		$("#uc_message_board .message_list ul").append(JSON.parse(userJsonStr));
		//localStorage.removeItem("user");
	});
	$(document).on("pageInit", "#transfer_mobile", function(e, id, page) {
		
		$("#transfer_mobile .leave_word").click(function(){
			$("#transfer_mobile .Leave_Word").toggle();
			$("#transfer_mobile .btn_leave_word").hide();
		});
		$("#transfer_mobile .abolish").click(function(){
			$("#transfer_mobile .Leave_Word").hide();
			$("#transfer_mobile .btn_leave_word").show();
		});
		
		$("#transfer_mobile #add_msg").click(function(){
			var ajaxurl = WAP_PATH+"/index.php?ctl=msg";
			var query = newObject();
			query.rel_table = $.trim($("#transfer_mobile #rel_table").val());
			query.rel_id = $.trim($("#transfer_mobile #rel_id").val());
			query.title = $.trim($("#transfer_mobile #title").val());
			query.content = $.trim($("#transfer_mobile #content").val());
			
			query.post_type = "json";
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					if(data.user_login_status==0){
						RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
					}
					else if(data.response_code == 0){
						$.alert(data.show_err);
					}
					else{
						$.alert(data.show_err);
						var html = '<li class="w_b bb1">';
			          		html += '<div class="img_block"><img src="'+data.avatar+'" style="width:100%; height:100%;"/></div>';
							html += '<div class="d_block w_b_f_1">';
							html += '	<div class="top clearfix">';
							html += '		<span class="name">'+data.user_name+'</span>';
							html += '		<span class="time">'+data.create_time+'</span>';
							html += '	</div>';
							html += '	<p class="middle">'+data.content+'</p>';
							html += '</div>';
			          		html += '</li>';
						$("#transfer_mobile .contentblock ul").append(html);
						$("#transfer_mobile .Leave_Word").hide();
						$("#transfer_mobile .Leave_Word #content").val("");
						$("#transfer_mobile .btn_leave_word").show();
					}
				}
			});
		});
	});
	$.init();
});	



function get_search_parms()
{
	var parms = "";
	if($("#deals_search").length > 0){
		$("#deals_search .deals_search_list li").each(function(){
			parms +="&"+$(this).attr("data-type")+"="+$(this).attr("data-type-value");
		});
	}
	return parms;
}

