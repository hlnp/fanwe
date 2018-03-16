$(document).ready(function(){
	/*购物清单*/
	$(document).on("pageInit", "#merchandise_order", function(e, id, page) {
		var now_page = 1;
		var all_page = 0;
		var loading = false;
		$("#merchandise_order .infinite-scroll-preloader").hide();
		$(page).on('infinite', function() {
			all_page=$("#merchandise_order .infinite-scroll").attr("all_page");
		   	if (loading || now_page >= all_page) return;
			$("#merchandise_order .infinite-scroll-preloader").show();
		    loading = true;
			var query = newObject();
			query.page  =  now_page + 1;
			query.is_ajax = 1;
			
			var parms = get_search_parms();
			var ajaxurl = $("#merchandise_order .infinite-scroll").attr("ajaxurl");
		    $.ajax({				
		      	url:ajaxurl + parms,
		        data:query,
		        success:function(result){
		        	now_page ++;
		        	loading = false;
		        	$("#merchandise_order .infinite-scroll .invest").append(result);
		        	$("#merchandise_order .infinite-scroll .pull-to-refresh-layer").last().remove();
		        	$("#merchandise_order .infinite-scroll-preloader").hide();
		        	$.refreshScroller();
		        }
		     });	       
	    });
	});
});