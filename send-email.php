<?php
header('Access-Control-Allow-Origin: https://fidexico.eu');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$SMTP_HOST = 'smtp.hostinger.com';
$SMTP_PORT = 465;
$SMTP_USER = 'contact@fidexico.eu';
$SMTP_PASS = 'Comptpay@xidse12';

$body = file_get_contents('php://input');
$data = json_decode($body, true);
if (!$data || empty($data['to']) || empty($data['subject']) || empty($data['html'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$to      = is_array($data['to']) ? $data['to'][0] : $data['to'];
$subject = $data['subject'];
$html    = $data['html'];
$from    = $data['from'] ?? 'Fidexico <contact@fidexico.eu>';

preg_match('/^(.*?)\s*<(.+?)>$/', $from, $m);
$from_name  = trim($m[1] ?? 'Fidexico');
$from_email = trim($m[2] ?? $SMTP_USER);

function smtp_send($host, $port, $user, $pass, $from_email, $from_name, $to, $subject, $html) {
    $socket = @stream_socket_client("ssl://{$host}:{$port}", $errno, $errstr, 30);
    if (!$socket) return ['ok' => false, 'error' => "Connexion impossible: $errstr"];

    $r = fgets($socket, 512);
    if (substr($r, 0, 3) != '220') return ['ok' => false, 'error' => "SMTP: $r"];

    fputs($socket, "EHLO fidexico.eu\r\n");
    while ($l = fgets($socket, 512)) { if (substr($l, 3, 1) == ' ') break; }

    fputs($socket, "AUTH LOGIN\r\n");
    fgets($socket, 512);
    fputs($socket, base64_encode($user) . "\r\n");
    fgets($socket, 512);
    fputs($socket, base64_encode($pass) . "\r\n");
    $auth = fgets($socket, 512);
    if (substr($auth, 0, 3) != '235') return ['ok' => false, 'error' => "Auth: $auth"];

    fputs($socket, "MAIL FROM:<{$from_email}>\r\n");
    fgets($socket, 512);
    fputs($socket, "RCPT TO:<{$to}>\r\n");
    fgets($socket, 512);
    fputs($socket, "DATA\r\n");
    fgets($socket, 512);

    $msg  = "From: {$from_name} <{$from_email}>\r\n";
    $msg .= "To: {$to}\r\n";
    $msg .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $msg .= "MIME-Version: 1.0\r\n";
    $msg .= "Content-Type: text/html; charset=UTF-8\r\n";
    $msg .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $msg .= chunk_split(base64_encode($html)) . "\r\n.\r\n";

    fputs($socket, $msg);
    $res = fgets($socket, 512);
    fputs($socket, "QUIT\r\n");
    fclose($socket);

    return substr($res, 0, 3) == '250'
        ? ['ok' => true]
        : ['ok' => false, 'error' => "Envoi: $res"];
}

$result = smtp_send($SMTP_HOST, $SMTP_PORT, $SMTP_USER, $SMTP_PASS, $from_email, $from_name, $to, $subject, $html);

if ($result['ok']) {
    http_response_code(200);
    echo json_encode(['id' => uniqid()]);
} else {
    http_response_code(500);
    echo json_encode(['error' => $result['error']]);
}
