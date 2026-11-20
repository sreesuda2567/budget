<?php
include_once 'C:/xampp/htdocs/api_v2/connpdo_mssql.php';
include_once 'C:/xampp/htdocs/api_v2/protected.php';
include_once 'C:/xampp/htdocs/api_v2/acc3d/lib.php';
$hname = condb();
$conn = new pdo_mssql($hname[0], $hname[1], $hname[2], $hname[3]);
echo "=== PLINCOME ===\n";
echo json_encode($conn->return_sql("SELECT PLINCOME_CODE, PLINCOME_NAME FROM PLINCOME"), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
echo "\n=== PLGPRODUCT ===\n";
echo json_encode($conn->return_sql("SELECT PLGPRODUCT_CODE, PLGPRODUCT_NAME FROM PLGPRODUCT"), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
