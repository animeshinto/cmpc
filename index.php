<?php
function to_utf8($v) {
  $v = preg_replace('/^\xEF\xBB\xBF/', '', $v); // quita BOM
  $v = trim($v);

  // Si NO es UTF-8 válido, conviértelo (Excel suele ser Windows-1252)
  if ($v !== '' && function_exists('mb_detect_encoding')) {
    $enc = mb_detect_encoding($v, ['UTF-8', 'Windows-1252', 'ISO-8859-1'], true);
    if ($enc && $enc !== 'UTF-8') {
      $v = mb_convert_encoding($v, 'UTF-8', $enc);
    }
  }
  return $v;
}
?>

<?php
// Determinar página
$page = $_GET['page'] ?? 'home';

// Archivo de contenido
$contentFile = "pages/$page.php";
?>

<!-- ✅ CABECERA -->
<?php include 'pages/cabecera.php'; ?>

<!-- ✅ CONTENIDO -->

<?php
if (is_file($contentFile)) {
    include $contentFile;
} else {
    include 'pages/home.php';
}
?>


<!-- ✅ PIE DE PAGINA -->
<?php include 'pages/footer.php'; ?>