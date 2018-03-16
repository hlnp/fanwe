$(document).ready(function(){
	
	/*我的好友*/
	$(document).on("pageInit", "#my_goodfriends", function(e, id, page) {
		var now_page = 1;
		var all_page = 0;
		var loading = false;
		$("#my_goodfriends .infinite-scroll-preloader").hide();
		$(page).on('infinite', function() {
			all_page=$("#my_goodfriends .infinite-scroll").attr("all_page");
		   	if (loading || now_page >= all_page) return;
			$("#my_goodfriends .infinite-scroll-preloader").show();
		    loading = true;
			var query = newObject();
			query.page  =  now_page + 1;
			query.is_ajax = 1;
			
			var parms = get_search_parms();
			var ajaxurl = $("#my_goodfriends .infinite-scroll").attr("ajaxurl");
		    $.ajax({				
		      	url:ajaxurl + parms,
		        data:query,
		        success:function(result){
		        	now_page ++;
		        	loading = false;
		        	$("#my_goodfriends .infinite-scroll .invest").append(result);
		        	$("#my_goodfriends .infinite-scroll .pull-to-refresh-layer").last().remove();
		        	$("#my_goodfriends .infinite-scroll-preloader").hide();
		        	$.refreshScroller();
		        }
		      });
	       
	    });
	    });
	   });