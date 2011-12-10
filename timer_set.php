<?php
require_once('lib/auth.php');
require_once('lib/DB.php');
/* require_once('lib/Format.php'); */

if($target_event && is_numeric($_POST['event']) && is_numeric($_POST['timer_set'])){
	$me = $facebook->api('/me');
	
	$db = new DB();
	$db->dbSelect();
	$result = $db->sqlQuery("SELECT id FROM event_timers WHERE user_id = '".$me['id']."' AND event_id ='".$_POST['event']."'");
	$result = mysql_fetch_assoc($result);
	
	/* $memo = mysql_real_escape_string($_POST['memo']); */
	
	$sql = " event_timers SET user_id = '".$me['id']."',
	event_id = '".$_POST['event']."',
	alert_time = '".$alert_time."',
	start_time = '".$target_event['start_time']."',
	mode = '".$mode."',
	memo = '".$memo."',
	updated = now(),
	deleted = null";
	
    $sql = "INSERT INTO".$sql.',created = now()';
	
	$result = $db->sqlQuery($sql);
	
	$db->dbClose();
}
else {
	echo 'false';
}
?>
