<?php
$errorMSG = "";

if (empty($_POST["name"])) {
    $errorMSG = "Name is required ";
} else {
    $name = $_POST["name"];
}

if (empty($_POST["email"])) {
    $errorMSG = "Email is required ";
} else {
    $email = $_POST["email"];
}

if (empty($_POST["phone"])) {
    $errorMSG = "Phone is required ";
} else {
    $phone = $_POST["phone"];
}

if (empty($_POST["message"])) {
    $errorMSG = "Message is required ";
} else {
    $message = $_POST["message"];
}

$EmailTo = "hrskkmt@xs615223.xsrv.jp";
// $EmailTo = "cs8.cs8080.cscs8@gmail.com";
$Subject = "問い合わせがAUトラスト企業ページからきました";

// prepare email body text
$Body = "";
$Body .= "お名前: ";
$Body .= $name;
$Body .= "\n";
$Body .= "メールアドレス: ";
$Body .= $email;
$Body .= "\n";
$Body .= "電話番号: ";
$Body .= $phone;
$Body .= "\n";
$Body .= "メッセージ: ";
$Body .= $message;
$Body .= "\n";

// send email
$success = mb_send_mail($EmailTo, $Subject, $Body, "From:".$email);
// redirect to success page
if ($success && $errorMSG == ""){
   echo "success";
}else{
    if($errorMSG == ""){
        echo "問題が発生しました";
    } else {
        echo $errorMSG;
    }
}
?>