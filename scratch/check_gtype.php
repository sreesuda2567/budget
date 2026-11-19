<?php
include_once 'C:/xampp/htdocs/api_v2/connpdo_mssql.php';
include_once 'C:/xampp/htdocs/api_v2/acc3d/lib.php';
$hname = condb();
$conn = new pdo_mssql($hname[0], $hname[1], $hname[2], $hname[3]);
$stmt = $conn->db->query("SELECT * FROM PLPROJECTGTYPE ORDER BY PLPROJECTGTYPE_CODE");
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo $row['PLPROJECTGTYPE_CODE'] . ' : ' . $row['PLPROJECTGTYPE_NAME'] . PHP_EOL;
}
