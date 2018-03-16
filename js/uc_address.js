$(document).ready(function(){
	$(document).on("pageInit", "#goods_address", function(e, id, page) {
		/* var response_code = $.trim($("#goods_address #response_code").val());
		if(response_code==0){
			RouterURL(WAP_PATH+"/index.php?ctl=login","#login");
		} */
		//	长按删除
		var addressBoxId=$("#goods_address .adress_list li");
		$.fn.longPress = function(fn) {
			var timeout = undefined;
			var $this = this;
			for(var i = 0;i<$this.length;i++){
				$this[i].addEventListener('touchstart', function(event) {
					timeout = setTimeout(function(e){
						$.confirm("确认删除？",function(){
							var ajaxurl = WAP_PATH+'/index.php?ctl=uc_del_address';
							var id =  $.trim($this.find("input").val());
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
										$("#goods_address .address-box-"+id).remove();
										RouterURL(WAP_PATH+'/index.php?ctl=uc_center',"#uc_center",2);
									}
								}
							});
						});
					}, 500);  //长按时间超过500ms，则执行传入的方法
				}, false);
				$this[i].addEventListener('touchend', function(event) {
					clearTimeout(timeout);  //长按时间少于500ms，不会执行传入的方法
				}, false);
			}
		},
		addressBoxId.longPress(function(e){
		});
		btn();
		var size=$("#goods_address .adress_list li").size();
		$("#goods_address .big-button").click(function(){
			if(size>=3){
				$.toast("最多可添加3个收货地址");
			}else{
				RouterURL(WAP_PATH+'/index.php?ctl=uc_address',"#uc_address",2);
			}
		});
	});
	$(document).on("pageInit", "#uc_address", function(e, id, page) {
		clearContent();
		btn();
		displayButton();
		/*
		$.ajax({
			url:APP_ROOT+"/system/region.js",
			cache:true,
			success:function(result){
				eval(result);
				load_bk_select("1",regionConf);
				$("#uc_address select[name='region_lv2']").live("change",function(){
					load_bk_select("2",regionConf);
				});
				$("#uc_address select[name='region_lv3']").live("change",function(){
					load_bk_select("3",regionConf);
				});
			}
		});
		 */
		$("#uc_address #submitt").click(function(){
			var ajaxurl = WAP_PATH+'/index.php?ctl=uc_do_address';
			var id =  $.trim($("#id_val").val());
			var user_name = $.trim($("#name").val());
			var user_phone = $.trim($("#phone").val());
			
			var province = $.trim($("#ProvSelect").val());
			var city = $.trim($("#CitySelect").val());
			var areas = $.trim($("#DistSelect").val());
			
			var user_provinces_cities = $.trim($("#provinces_cities").val());
			var user_address = $.trim($("#address").val());
			var user_zip_code = $.trim($("#zip_code").val());
			var is_default = $.trim($("#is_default:checked").val());
			if(!user_name)
			{
				$.toast("请填写姓名");
				return false;
			}
			if(!user_phone)
			{
				$.toast("请填写手机号");
				return false;
			}
			if(!user_address)
			{
				$.toast("请填写详细地址");
				return false;
			}
			if(!user_zip_code)
			{
				$.toast("请填写邮编");
				return false;
			}
	
			var query = new Object();
			query.user_name = user_name;
			query.user_phone = user_phone;
			
			query.province = province;	
			query.city = city;	
			query.areas = areas;				
			
			query.user_provinces_cities = user_provinces_cities;
			query.user_address = user_address;
			query.id = id;
			query.user_zip_code = user_zip_code;
			query.is_default = $.trim($("#is_default:checked").val());
			query.post_type = "json";
			$.ajax({
				url:ajaxurl,
				data:query,
				type:"Post",
				dataType:"json",
				success:function(data){
					reloadpage(WAP_PATH+'/index.php?ctl=goods_address','#goods_address','.content');
					RouterURL(WAP_PATH+'/index.php?ctl=goods_address',"#goods_address",2);
				}
			});
		});
		//地区选择变成黑色
		$(".region_select select").change(function(){
			$(".region_select select").removeClass("a9");
		});
		var ProvValue=$("#ProvSelect option").first().html();
		var CityValue=$("#CitySelect option").first().html();
		var DistSelect=$("#DistSelect option").first().html();
		$("#ProvSelect option").first().val(ProvValue);
		$("#CitySelect option").first().val(CityValue);
		$("#DistSelect option").first().val(DistSelect);
		$("#ProvSelect").change(function(){
			var val1= $("#ProvSelect").val();
			var val2= $("#CitySelect").val();
			var val3= $("#DistSelect").val();
			$("#ProvSelect option").first().val(val1);
			$("#CitySelect option").first().val(val2);
			$("#DistSelect option").first().val(val3);
		});
		$("#CitySelect").change(function(){
			var val4= $("#CitySelect").val();
			var val5= $("#DistSelect").val();
			$("#CitySelect option").first().val(val4);
			$("#DistSelect option").first().val(val5);
		});
		$("#DistSelect").change(function(){
			var val6= $("#DistSelect").val();
			$("#DistSelect option").first().val(val6);
		});
		var UC_Setting={
			ProvSelect:$("#ProvSelect"),
			CitySelect:$("#CitySelect"),
			DistSelect:$("#DistSelect"),
			Init: function () {
				UC_Setting.GetProvFun();
				UC_Setting.ProvSelectChange();
				UC_Setting.CitySelectChange();
			},
			GetProvFun: function () {
				$.each(CFMCAreaJsonData, function (index ,item) {
					UC_Setting.ProvSelect.append("<option data-index='"+index+"' value='"+item.name+"'>"+item.name+"</option>");
				});
			},
			GetCityFun: function () {
				UC_Setting.CitySelect.empty();
				var ProvVal=UC_Setting.ProvSelect.find("option:checked").data("index");
				if(ProvVal==undefined)
				{
					UC_Setting.CitySelect.append("<option  data-index='' >城市</option>");
					UC_Setting.DistSelect.append("<option  data-index='' >城区</option>");
					return false;
				}
				var CityJson=CFMCAreaJsonData[ProvVal].city;
				$.each(CityJson, function (index ,item) {
					UC_Setting.CitySelect.append("<option  data-index='"+index+"'  value='"+item.name+"'>"+item.name+"</option>");
				});
			},
			GetDistFun: function () {
				UC_Setting.DistSelect.empty();
				var ProvVal=UC_Setting.ProvSelect.find("option:checked").data("index");
				var CityVal=UC_Setting.CitySelect.find("option:checked").data("index");
				if(CityVal==undefined)
				{
					UC_Setting.DistSelect.append("<option  data-index='' >城区</option>");
					return false;
				}
				var DisJson=CFMCAreaJsonData[ProvVal].city[CityVal].area;
				$.each(DisJson, function (index ,item) {
					UC_Setting.DistSelect.append("<option  data-index='"+index+"'  value='"+item+"'>"+item+"</option>");
				});

			},
			ProvSelectChange: function () {
				UC_Setting.ProvSelect.change(function () {
					UC_Setting.GetCityFun();
					UC_Setting.GetDistFun();
				});
			},
			CitySelectChange: function () {
				UC_Setting.CitySelect.change(function () {
					UC_Setting.GetDistFun();
				});
			}

		};
		UC_Setting.Init();
	});

});
