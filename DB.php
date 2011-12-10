<?php
class DB {
	//connect info
	private $url = "mysql234.db.sakura.ne.jp";
	private $user = "atms";
	private $pass = "krr3zt7m4v";
	private $name = "atms";
	
	//db info
	private $db_connect;
	private $db_select;
	
	public function sqlExe($sql){
		$this->dbSelect();
		$result = $this->sqlQuery($sql);
		$this->dbClose();
		return $result;
	}
	
	public function sqlQuery($sql){
		return mysql_query($sql, $this->db_connect);
	}
	
	public function dbSelect(){
		$this->db_connect = mysql_connect($this->url,$this->user,$this->pass);
		mysql_set_charset("utf8");
		mysql_query("SET NAMES utf8");
		$this->sb_select = mysql_select_db($this->name,$this->db_connect);
	}
	public function dbClose(){
		mysql_close($this->db_connect);
	}
}
?>