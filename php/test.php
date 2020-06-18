<?php
    header("Content-type: application/json");

    define("ERROR", 400);
    define("SUCCESS", 400);

    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(SUCCESS);
        echo json_encode("error");
    }

    $request = json_decode($_POST['data'], true);

    $request .= ', opa 2ri put';

    echo json_encode($request);
?>