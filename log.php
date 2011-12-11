<?php
ini_set( 'display_errors', 1 );
require_once('lib/auth.php');
require_once('lib/DB.php');
/* require_once('lib/Format.php'); */

if(!is_null($_POST['log'])){
	$me = $facebook->api('/me');
	
	$db = new DB();
	$db->dbSelect();
	/* $memo = mysql_real_escape_string($_POST['memo']); */
	
	$sql = " amidawars SET fbid = '".$me['id']."',
	log = '".mysql_real_escape_string($_POST['log'])."'";
	
    $sql = "INSERT INTO".$sql.',created = now()';
	$result = $db->sqlQuery($sql);
	$db->dbClose();
}
else {
	echo 'false';
}
?>
