<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $to = "gbarakovics@gmail.com";
    $subject_type = htmlspecialchars($_POST['subject']);
    $name = htmlspecialchars($_POST['name']);

    $subject = "Webes megkeresés: " . $name . " - " . $subject_type;

    $product = htmlspecialchars($_POST['product']);
    $material = htmlspecialchars($_POST['material']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $zip = htmlspecialchars($_POST['zip']);
    $city = htmlspecialchars($_POST['city']);
    $message_content = htmlspecialchars($_POST['message']);

    $body = "Új üzenet érkezett a weboldalról:\n\n";
    $body .= "Név: " . $name . "\n";
    $body .= "Email: " . $email . "\n";
    $body .= "Lakhely: " . $zip . " " . $city . "\n";
    $body .= "Téma: " . $subject_type . "\n";
    $body .= "Termék: " . $product . "\n";
    $body .= "Anyag: " . $material . "\n";
    $body .= "-------------------------\n";
    $body .= "Üzenet:\n" . $message_content . "\n";

    $headers = "From: King Stone Weboldal <gergo.barakovics@kingstonedesign.hu>" . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8" . "\r\n";

    if (mail($to, $subject, $body, $headers)) {
        header("Location: kapcsolat.html?status=success");
    } else {
        header("Location: kapcsolat.html?status=error");
    }
} else {
    header("Location: kapcsolat.html");
}
?>