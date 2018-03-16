$(document).ready(function(){
	
	/*投资列表页*/
	$(document).on("pageInit", "#article_list", function(e, id, page) {
		var now_page = 1;
		var all_page = 0;
		var loading = false;
		$("#article_list .infinite-scroll-preloader").hide();
		$(page).on('infinite', function() {
			all_page=$("#article_list .infinite-scroll").attr("all_page");
		   	if (loading || now_page >= all_page) return;
			$("#article_list .infinite-scroll-preloader").show();
		    loading = true;
			var query = newObject();
			query.page  =  now_page + 1;
			query.is_ajax = 1;
			
			var parms = get_search_parms();
			var ajaxurl = $("#article_list .infinite-scroll").attr("ajaxurl");
		    $.ajax({				
		      	url:ajaxurl + parms,
		        data:query,
		        success:function(result){
		        	now_page ++;
		        	loading = false;
		        	$("#article_list .infinite-scroll .invest").append(result);
		        	$("#article_list .infinite-scroll .pull-to-refresh-layer").last().remove();
		        	$("#article_list .infinite-scroll-preloader").hide();
		        	$.refreshScroller();
		        }
		      });
	       
	    });
	});
});