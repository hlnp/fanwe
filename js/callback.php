<?php 
	if(isset($_SESSION['user'])){ 
		print_r($_SESSION['user']);
		exit;
	}
	$APPID='wx91f96a657018c309';
	$money_encrypt = $_GET['money_encrypt'];
	$notice_sn = $_GET['notice_sn'];
	$REDIRECT_URI="http://www.caifumuchang.com/callback/weixin/index.php?&money_encrypt=$money_encrypt&notice_sn=$notice_sn";
	$scope='snsapi_base';
	//$scope='snsapi_userinfo';//需要授权
	$url='https://open.weixin.qq.com/connect/oauth2/authorize?appid='.$APPID.'&redirect_uri='.urlencode($REDIRECT_URI).'&response_type=code&scope='.$scope.'&state='.$state.'#wechat_redirect';
	header("Location:".$url);
?>
