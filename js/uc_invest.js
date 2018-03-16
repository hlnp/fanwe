$(document).ready(function(){
	
	/*我的牧场*/
	$(document).on("pageInit", "#uc_invest", function(e, id, page) {
		code();
//		var response_code = $.trim($("#uc_invest #response_code").val());
//		if(response_code==0){
//			RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
//		}
		var mode = $("#uc_invest #mode").val();
		var now_page = 1;
		var all_page = 0;
		var loading = false;
		$("#uc_invest .infinite-scroll-preloader").hide();
		$(page).on('infinite', function() {
			all_page=$("#uc_invest .uc_invest-box").attr("all_page");
			now_page = $("#uc_invest .content").attr("now_page");
			now_page = parseInt(now_page);
			if (loading || now_page >= all_page) return;
			$("#uc_invest .infinite-scroll-preloader").show();
			loading = true;
			var query = newObject();
			query.page  =  now_page + 1;
			query.is_ajax = 1;
			
			var parms = get_search_parms();
			var ajaxurl = $("#uc_invest .uc_invest-box").attr("ajaxurl");
		    $.ajax({
		      	url:ajaxurl + parms,
		        data:query,
		        success:function(result){
		        	now_page ++;
					$("#uc_invest .content").attr("now_page",now_page);
		        	loading = false;
					$("#uc_invest .infinite-scroll").append(result);
					$("#uc_invest .infinite-scroll .pull-to-refresh-layer").last().remove();
					$("#uc_invest .infinite-scroll-preloader").hide();
		        	$.refreshScroller();
		        }
		      });
		});
		$("#deal_static").click(function(){
			$("#goodcover,#exchange_appli").show();
		});
	 });
	 $(document).on("pageInit", "#uc_mature", function(e, id, page) {
		var response_code = $.trim($("#uc_mature #response_code").val());
		if(response_code==0){
			RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
		}
		var pid= localStorage.getItem('pid');
		var url = location.href;
		var times = url.split("status=");
		var status=times[1];
		if(status==pid){
			window.location.reload();
			localStorage.removeItem("pid");
		}
	 });
    //TODO 点击羊 文字变化
	$(document).on("pageInit", "#uc_invest_detail", function(e, id, page) {
		var i=1;
		function myInterval() {
			i++;
			if(i>=8){
				clearInterval(add);
				//TODO 8秒后消失
				$('#uc_invest_detail .declaration').hide();
			}
		};
		var add=setInterval(myInterval,1000);//1000为1秒钟
		//TODO 弹出框随机文字
		$("#uc_invest_detail .shine").click(function(){
			var a=1;
			function intervalA(){
				a++;
				if(a<8){
					//TODO 8秒内再次点击
					$("#uc_invest_detail .shine").click(function(){
						a=1;
					});
				};
				if(a>=8){
					clearInterval(even);
					$('#uc_invest_detail .declaration').hide();
				}
			};
			var even=setInterval(intervalA,1000);//1000为1秒钟
			$('#uc_invest_detail .declaration').show();
			suggestiveText();
		});
		function suggestiveText(){
			var arr = [
						"好长时间见不到主人ㄒoㄒ，忧伤到只能吃草~我会茁壮成长滴！", "欢迎主人来草原上找我哦，我们大草原上木有pm2.5呦！",
						"跟着我左手右手一个慢动作......“咳，主人，我不会告诉你我又忘词啦（无辜脸）。", "黄毯悄然换绿坪，古原无语释秋声。马蹄踏得夕阳碎，卧唱敖包待月明",
						"极目青天日渐高，玉龙盘曲自妖娆。无边绿翠凭羊牧，一马飞歌醉碧宵。", "斜阳无睹看斜阳，山包林荫俱染黄。莫道老牛归去饱，牧人炉下正生香。",
						"主人，我可是高贵的苏尼特“熊猫”羊，生来如此讲究，叫我如何将就（得意脸）！", "主人，隔壁懒羊羊一言不合就撩我，好烦躁啊啊啊（嫌弃脸），是我长的太美腻了吗？",
						"生活不止眼前的苟且，还有诗和远方，还有...我亲爱的帅羊羊...（相思脸）", "主人，你生活在帝都吗，听说那里雾霾严重哦，注意身体吖（给主人一个及时的拥抱）。",
						"那些战五渣的育肥羊们脑满肠肥，思维迟钝，怎么和我们驰骋草原的苏尼特羊比！哼！", "暗恋我的懒羊羊非要给我表演一字马，我有点方O.O，主人你说他是不是有蛇精病！",
						"不吹不黑，主人，像我们这种“熊猫”羊靠颜值就可以撑起整个大草原，哼哼！（自豪脸）", "没有什么坏情绪是吃顿青草消除不了的，如果有，那就吃两顿！我好像又吃撑了，额。",
						"今天在大草原上欢脱的跑了一天，感觉身体被掏空，求主人温暖的抱抱（娇羞脸）。", "八月份的草原，脆草青绿曲径湾，牛羊成群染山川，突出一个美啊！",
						"隔壁懒羊羊说我最近吃肥了，哼，友谊的小船说炸就炸！像我这样的女神应该叫丰满！", "主人，我决定先定一个小目标，比方说先变成草原第一美羊羊，哈哈哈哈哈！",
						"主人，我决定先定一个小目标，比方说先变成草原第一美羊羊，哈哈哈哈哈！", "我常常想，我的主人一定是位360度无死角，全方位，立体式的大帅哥/美女，哈哈哈！"
			];
			var index = Math.floor((Math.random()*arr.length));
			$("#uc_invest_detail .manifesto").html(arr[index]);
			$("#uc_invest_detail .look").css({display:"none"});
		}
	});
	//确认兑换
	$(document).on("pageInit", "#uc_sure_exchange", function(e, id, page) {

		btn();
		code();
		displayButton();	
		$("#uc_sure_exchange .Minus").click(function(){
			var x=$("#uc_sure_exchange .nun_choose #ex_number").val();
			if(x>1)
			{
				x-=1;
				$("#uc_sure_exchange .nun_choose #ex_number").val(x);
				moneyTotle();
			}
			else
			{
				$.toast("兑换数量不能少于1只");
				$("#uc_sure_exchange .nun_choose #ex_number").val(1);
				moneyTotle();
			}

		});
		$("#uc_sure_exchange .Plus").click(function(){
			var x=$("#uc_sure_exchange .nun_choose #ex_number").val();
			var y=$("#uc_sure_exchange .nun_choose #ex_number").attr("max");

			if(x>(y-1))
			{
				$.toast("本期最多可兑换白条羊"+y+"只");
				$("#uc_sure_exchange .nun_choose #ex_number").val(y);
				moneyTotle();
			}
			else
			{
				x=parseInt(x) + 1;
				$("#uc_sure_exchange .nun_choose #ex_number").val(x);
				moneyTotle();
			}
		});
		//点击选择邮寄到
		//选中
		/* $("#uc_sure_exchange #pay01").click(function() {
			$(this).css({display:"none"});
			$("#uc_sure_exchange #pay02").css({display:"block"});
			$("#uc_sure_exchange .large_area").attr("disabled",false).css({borderColor:"#a9a9a9"}).css({color:"#a9a9a9"}).removeClass("open-popup");
			$("#uc_sure_exchange .regionValue").val(0);
			$("#uc_sure_exchange .addressValue").val(0);
			moneyTotle();
		}); */
		//取消
		/* $("#uc_sure_exchange #pay02").click(function() {
			$(this).css({display:"none"});
			$("#uc_sure_exchange #pay01").css({display:"block"});
			$("#uc_sure_exchange .large_area").removeClass("a9").css({borderColor:"#3db4cc"}).css({color:"#3db4cc"}).removeAttr("disabled").addClass("open-popup");
			var valueAgain=$("#uc_sure_exchange .regionAgain").val();
			var addressAgain=$("#uc_sure_exchange .addressAgain").val();
			$("#uc_sure_exchange .regionValue").val(valueAgain);
			$("#uc_sure_exchange .addressValue").val(addressAgain);
			moneyTotle();
		}); */
		//选择邮寄地区
		/* $(".regionList li.close-popup").click(function() {
			var reginonName=$(this).find(".region_name").html();
			var regionValue=parseInt($(this).find(".franking").html());
			var addressName=$(this).find(".fl").html();
			$("#uc_sure_exchange .large_area").html(reginonName);
			$("#uc_sure_exchange .regionValue").val(regionValue);
			$("#uc_sure_exchange .regionAgain").val(regionValue);
			$("#uc_sure_exchange .addressValue").val(addressName);
			$("#uc_sure_exchange .addressAgain").val(addressName);
			$("#uc_sure_exchange .large_area").removeClass("a9").addClass("m_co");
			moneyTotle();
		}); */
		//小计
		var numberValue=$('#uc_sure_exchange #ex_number').val();
		$("#uc_sure_exchange .sheepNumber").html(numberValue);
		$('#uc_sure_exchange #ex_number').bind("input onporpertychange",function() {
			var max_portion = parseInt($("#uc_sure_exchange #ex_number").attr("max"));
			var numberChange=$('#uc_sure_exchange #ex_number').val();
			$("#uc_sure_exchange .sheepNumber").html(numberChange);
			if(max_portion<numberChange){
				$('#uc_sure_exchange #ex_number').val(max_portion);
				$.toast("本期最多可兑换白条羊"+max_portion+"件");	
			};
			moneyTotle();
		});	
		function moneyTotle(){
			var pay_inmoney=$("#uc_sure_exchange #min_loan_money").val();
			var buy_number=$("#uc_sure_exchange #ex_number").val();
			//var regionValue=$("#uc_sure_exchange #postage").val();
			var Money=parseInt(pay_inmoney*buy_number)/* +parseInt(regionValue) */;
			$("#uc_sure_exchange .sheepNumber").html(buy_number);
			$("#uc_sure_exchange .subtotal").html("￥"+Money.toFixed(2));
		};
		$("#uc_sure_exchange #sure_ex").click(function(){
			var number_sheep =  $.trim($("#uc_sure_exchange #number_sheep").val());
			var user_money =  $.trim($("#uc_sure_exchange #user_money").val());
			var min_loan_money =  $.trim($("#uc_sure_exchange #min_loan_money").val());
			var ex_number =  $.trim($("#uc_sure_exchange #ex_number").val());
			var postage =  $.trim($("#uc_sure_exchange #postage").val());
			var deal_id =  $.trim($("#uc_sure_exchange #deal_id").val());
			var user_id =  $.trim($("#uc_sure_exchange #user_id").val());
			var dl_id =  $.trim($("#uc_sure_exchange #dl_id").val());
 			if(user_id==0||user_id==""){
				RouterURL(WAP_PATH+'/index.php?ctl=login','#login');
				return false;
			}else if(user_money < (min_loan_money + postage ) * ex_number){
				//$.toast("余额不足");
				$.alert("余额不足",function(){
					RouterURL(WAP_PATH +'/index.php?ctl=uc_center','uc_center',1);
				});
				return false;
			}	

			var ajaxurl = WAP_PATH+'/index.php?ctl=exchange_pwd';
			var query = newObject();
				query.number_sheep = number_sheep;
				query.min_loan_money = min_loan_money;
				query.ex_number = ex_number;
				query.postage = postage;
				query.deal_id = deal_id;
				query.post_type = "json";
				$.ajax({
					url:ajaxurl,
					data:query,
					type:"Post",
					dataType:"json",
					success:function(data){
						if(data.response_code == 1){
							//$.alert(data.show_err);
							RouterURL(WAP_PATH+'/index.php?ctl=exchange_pwd&ex_number='+ex_number+'&id='+deal_id+'&postage='+postage+'&dl_id='+dl_id,'#exchange_pwd',2);
							return false;
						}else{
							RouterURL(WAP_PATH+'/index.php?ctl=login','#login');
							return false;
						}	
					}
				});
				
		});
	});
	//余额支付
	$(document).on("pageInit", "#exchange_pwd", function(e, id, page) {
		code();
		$("#exchange_pwd #submit_pwd").click(function(){
			var ajaxurl = WAP_PATH+'/index.php?ctl=exchange_pwd_confirm';
				
			var query = newObject();
			query.postage =  $.trim($("#exchange_pwd #postage").val());
			query.dl_id =  $.trim($("#exchange_pwd #load_id").val());
			query.ex_number =  $.trim($("#exchange_pwd #ex_number").val());
			query.deal_id = $.trim($("#exchange_pwd #deal_id").val());
			query.min_loan_money = $.trim($("#exchange_pwd #min_loan_money").val());
			query.trade_pwd = $.trim($("#exchange_pwd #trade_pwd").val());
			query.post_type = "json";
				
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					if(data.status == 1){
						$("#goodcover,#exchange_appli").show();
					}else{
						$.toast(data.show_err);
					}
				}
			});	
		});
		$("#exchange_pwd #closebtn").click(function(){
			var pid=3;
			localStorage.setItem('pid', JSON.stringify(pid));
		});
	});
	$("#deal_static").click(function(){
		$("#goodcover,#exchange_appli").show();
	});
});
 