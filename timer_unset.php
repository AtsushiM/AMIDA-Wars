<?php
require_once('lib/auth.php');
require_once('lib/DB.php');

$me = $facebook->api('/me');
$events = $facebook->api('/me/events');
$events = $events['data'];
$target_event = false;

foreach($events as $key => $event){
	if($event['id'] == $_GET['event']){
		$target_event = $event;
		break;
	}
}

if($target_event && is_numeric($_GET['event'])){
	$db = new DB();
	$db->sqlExe("UPDATE event_timers SET deleted = now() WHERE user_id = '".$me['id']."' and event_id = '".$_GET['event']."'");
	/*$status = $me["name"].'さんがこのイベントに対してタイマーをアンセットしました！みんな忘れてください！';
	$attachment = array(
		'message'=>$status,
		'name'=>'イベントタイマー！',
		'privacy'=>array(
				'value'=>'SELF'
		),
		'link'=>'http://apps.facebook.com/eventtimer/',
		'description'=>'友達だのみのイベント用アラームアプリです。友人に出発時間を告知して優しく？教えてもらいましょう。'
	);
	$statusUpdate = $facebook->api("/me/feed", 'post', $attachment);*/
	echo $_GET['tail'];
}
else {
	echo 'イベントが存在しませんよ！';
}
?>