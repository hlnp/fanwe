$(document).ready(function(){
	
	/*投资列表页*/
	$(document).on("pageInit", "#uc_mature", function(e, id, page) {
		
		var mode = $("#uc_mature #mode").val();
		var now_page = 1;
		var all_page = 0;
		var loading = false;
		$("#uc_mature .infinite-scroll-preloader").hide();
		$(page).on('infinite', function() {
			all_page=$("#uc_mature .uc_mature-box").attr("all_page");
			now_page = $("#uc_mature .content").attr("now_page");
			now_page = parseInt(now_page);
			if (loading || now_page >= all_page) return;
			$("#uc_mature .infinite-scroll-preloader").show();
			loading = true;
			var query = newObject();
			query.page  =  now_page + 1;
			query.is_ajax = 1;
			
			var parms = get_search_parms();
			var ajaxurl = $("#uc_mature .uc_mature-box").attr("ajaxurl");
		    $.ajax({
		      	url:ajaxurl + parms,
		        data:query,
		        success:function(result){
		        	now_page ++;
					$("#uc_mature .content").attr("now_page",now_page);
		        	loading = false;
					$("#uc_mature .infinite-scroll").append(result);
					$("#uc_mature .infinite-scroll .pull-to-refresh-layer").last().remove();
					$("#uc_mature .infinite-scroll-preloader").hide();
		        	$.refreshScroller();
		        }
		      });
		});
	 });
});
 