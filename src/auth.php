<?php 
require_once('facebook.php');
header("Content-type: text/html; charset=utf-8");
//ja
$facebook=new Facebook(array('appId'=>'119004968215526','secret'=>'46378a927805856913e5607097aadae1','cookie'=>true));

$permit='user_status,read_stream';
Facebook::$CURL_OPTS[CURLOPT_SSL_VERIFYPEER]=false;
Facebook::$CURL_OPTS[CURLOPT_SSL_VERIFYHOST]=2;
$session=$facebook->getUser();
if(!$session)setPermission($facebook,$permit);
else{
  try{
    $perms=$facebook->api(array("method"=>"fql.query","query"=>"SELECT ".$permit." FROM permissions WHERE uid=me()"));
    foreach($perms[0] as$k=>$v)if($v!="1"){setPermission($facebook,$permit);break;}
    
    $me=$facebook->api(array("method"=>"fql.query","query"=>"SELECT uid,name,profile_url,locale FROM user WHERE uid=me()"));
    $me=$me[0];
    if(preg_match('/iPhone|iPod|Android/i', $_SERVER['HTTP_USER_AGENT']) && $_GET['mb']!='1'){
      echo'<script type="text/javascript">top.location.href="http://atms.sakura.ne.jp/amidawars/amida.php"</script>';
      exit;
    }
  }catch(FacebookApiException$e){echo$e->getMessage();exit;}
}
function setPermission($facebook,$permit){echo'<script type="text/javascript">top.location.href="'.$facebook->getLoginUrl(array('canvas'=>1,'fbconnect'=>0,'scope'=>$permit)).'";</script>';exit;}
?>
