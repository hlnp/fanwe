$(document).ready(function(){
	//购物清单
  $(document).on("pageInit", "#merchandise_order", function(e, id, page) {
	var response_code = $.trim($("#merchandise_order #response_code").val());
		if(response_code==0){
			RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
		}
  });
  $(document).on("pageInit", "#commodity_details", function(e, id, page) {
		  moneyTotle();
		  displayButton();
		//商品详情
		$("#commodity_details .Minus").click(function(){
			var x=$("#commodity_details .nun_choose #number").val();
			if(x>1){
				x-=1;
				$("#commodity_details .nun_choose #number").val(x);
				moneyTotle();
			}else{
				$.toast("购买数量不能小于1");
				$("#commodity_details .nun_choose #number").val(1);
			}
					
		});
		$("#commodity_details .Plus").click(function(){
			var x=$("#commodity_details .nun_choose #number").val();
			var y=$("#commodity_details .nun_choose #number").attr("max");;//20暂代库存
			if(x>(y-1)){
				$.toast("购买数量不能大于"+y);
				$("#commodity_details .nun_choose #number").val(y);
				moneyTotle();
			}else{
				x=parseInt(x) + 1;
				$("#commodity_details .nun_choose #number").val(x);
				moneyTotle();
			}
		});	
		$("#commodity_details #submitt").click(function(){
			var id =  $.trim($("#commodity_details #goods_id").val());
			var number =  $.trim($("#commodity_details #number").val());
			var uscore =  $.trim($("#commodity_details #uscore").val());
			var score =  $.trim($("#commodity_details #score").val());
			var user_id =  $.trim($("#commodity_details #user_id").val());
			if(user_id==0||user_id==""){
				RouterURL(WAP_PATH+'/index.php?ctl=login','#login');
				return false;
			}else if(uscore<(number*score)){
				$.toast("余额不足");
				return false;
			}	
			var ajaxurl = WAP_PATH+'/index.php?ctl=shopping_exchange';
			var query = newObject();
				query.number = number;
				query.id = id;
				query.post_type = "json";
				$.ajax({
					url:ajaxurl,
					data:query,
					type:"Post",
					dataType:"json",
					success:function(data){
						if(data.response_code == 1){
							//$.alert(data.show_err);
							RouterURL(WAP_PATH+'/index.php?ctl=shopping_exchange&id='+id+'&number='+number,'#shopping_exchange',2);
							return false;
						}else{
							RouterURL(WAP_PATH+'/index.php?ctl=login','#login');
							return false;
						}	
					}
				});	
		});
		  $('#commodity_details #number').bind("input onporpertychange",function() {
			  var max_portion = parseInt($("#commodity_details #number").attr("max"));
			  var numberValue=$('#commodity_details #number').val();
			  if(max_portion<numberValue){
				  $('#commodity_details #number').val(max_portion);
				  $.toast("购买数量不能大于"+max_portion);
			  };
			  moneyTotle();
		  });
		  //计算
		  function moneyTotle(){
			  var pay_inmoney=parseInt($("#commodity_details #pay_inmoney").html());
			  var number=$("#commodity_details #number").val();
			  var Money=pay_inmoney*number;
			  $("#commodity_details .sheepNumber").html(number);
			  $("#commodity_details .Money").html(Money.toFixed(2));
		  };
		  $("#commodity_details #submitt").click(function(){
			var shopName=$("#commodity_details .shopname").html();
			var shopPrice=parseInt($("#commodity_details .Money").html());
			var shopNum=parseInt($("#commodity_details .sheepNumber").html());
			// 存储值：将对象转换为Json字符串
			localStorage.setItem('shopName', JSON.stringify(shopName));
			localStorage.setItem('shopPrice', JSON.stringify(shopPrice));
			localStorage.setItem('shopNum', JSON.stringify(shopNum));
		}); 
	});
	//余额支付
	$(document).on("pageInit", "#shopping_exchange", function(e, id, page) {
		code();
		$("#shopping_exchange #submit_pwd").click(function(){
			
			var ajaxurl = WAP_PATH+'/index.php?ctl=shopping_mall_exchange';
			var query = newObject();
			query.number =  $.trim($("#shopping_exchange #number").val());
			query.goods_id = $.trim($("#shopping_exchange #goods_id").val());
			query.address_id = $.trim($("#shopping_exchange #address_id").val());
			query.trade_pwd = $.trim($("#shopping_exchange #trade_pwd").val());
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
		// 取值时：把获取到的Json字符串转换回对象
		var shopNameStr = localStorage .getItem('shopName');
		var shopPriceStr = localStorage .getItem('shopPrice');
		var shopNumStr = localStorage .getItem('shopNum');
		$("#shopping_exchange .price").html("￥"+JSON.parse(shopPriceStr));
		$("#shopping_exchange .name").html(JSON.parse(shopNameStr));
		$("#shopping_exchange .number").html(JSON.parse(shopNumStr)+"件");
		localStorage.removeItem("shopNameStr");
		localStorage.removeItem("shopPriceStr");
		localStorage.removeItem("shopNumStr");
	});
	$.init();
});