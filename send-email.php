<?php
header('Access-Control-Allow-Origin: https://fidexico.eu');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$RESEND_KEY = 're_a9PWcLj8_CH2jpwVeWTLL6ks3Vf4VYuFU';

$body = file_get_contents('php://input');
$data = json_decode($body, true);
if (!$data || empty($data['to']) || empty($data['subject']) || empty($data['html'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing fields']);
    exit;
}

$payload = [
    'from'    => $data['from'] ?? 'Fidexico <contact@fidexico.eu>',
    'to'      => is_array($data['to']) ? $data['to'] : [$data['to']],
    'subject' => $data['subject'],
    'html'    => $data['html']
];
if (!empty($data['attachments'])) {
    $payload['attachments'] = $data['attachments'];
}

$ch = curl_init('https://api.resend.com/emails');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $RESEND_KEY
]);
$result = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

http_response_code($status);
echo $result;
