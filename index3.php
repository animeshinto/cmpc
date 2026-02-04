<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Dashboard CMPC</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">

    <!-- ✅ RUTA DEL CSS -->
    <link rel="stylesheet" href="styles.css">
</head>

<body>

<div class="header-nav">

  <!-- FILA 1: Dashboard + Buscador -->
  <div class="header-top">
    <h1>Dashboard CMPC</h1>

    <div class="search-container">
      <i class="bi bi-search"></i>
      <input type="text" id="mainInput"
             placeholder="Buscar por Nombre del Servicio, Código o IP..."
             autofocus>
    </div>
  </div>

  <!-- FILA 2: Botones Opción 1-3 (debajo) -->
  <div class="header-menu">
    <div class="menu-bar">
      <button class="menu-btn" type="button">Opción 1</button>
      <button class="menu-btn" type="button">Opción 2</button>
      <button class="menu-btn" type="button">Opción 3</button>
    </div>
  </div>

</div>

<div class="main-layout">
    <div class="panel-izquierdo">

        <div id="placeholderMsg" class="text-center py-5 bg-white rounded-3 shadow-sm border">
            <i class="bi bi-hdd-network text-primary" style="font-size: 3rem;"></i>
            <p class="text-muted mt-3">Sistema listo. Ingrese un dato en el buscador superior.</p>
        </div>

        <?php
        $csv = "DATOS.csv";
        if (file_exists($csv)) {
            $f = fopen($csv, "r");
            $headers = fgetcsv($f, 0, ";");
            if ($headers) {
                $headers[0] = preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $headers[0]);
            }

            while (($row = fgetcsv($f, 0, ";")) !== false) {
                if (!$headers || count($headers) != count($row)) continue;

                $data = array_combine($headers, $row);

                $get = function($key) use ($data) {
                    return htmlspecialchars(
                        mb_convert_encoding($data[$key] ?? 'N/A', 'UTF-8', 'ISO-8859-1')
                    );
                };

                $cs_id = $get('CODIGO DE SERVICIO');
                $info  = strtoupper($get('INFO'));

                // ✅ Mejora opcional: incluir IPs en el buscador (ya que tu placeholder lo dice)
                $search = strtolower($get('NOMBRE') . " " . $cs_id . " " . $get('IP WAN') . " " . $get('IP LAN'));

                echo "<div class='ficha-full hidden' id='cs-{$cs_id}' data-info='{$info}' data-search='{$search}'>";


                // ✅ BOTONERA (EMAIL / ATT TERRENO / SSH)
                echo "<div class='email-bar'>
                        <button class='btn btn-sm btn-primary email-btn' type='button' onclick=\"copyEmail('{$cs_id}')\">
                            <i class='bi bi-envelope-fill me-1'></i> EMAIL
                        </button>

                        <button class='btn btn-sm btn-primary att-btn' type='button' onclick=\"copyAttTerreno('{$cs_id}')\">
                            <i class='bi bi-person-walking me-1'></i> ATT Terreno
                        </button>

                        <button class='btn btn-sm btn-primary ssh-btn' type='button' onclick=\"copySSH('{$cs_id}')\">
                            <i class='bi bi-terminal-fill me-1'></i> SSH
                        </button>
                      </div>";

                // ===== UBICACIÓN Y CONTACTO =====
                echo "<div class='ficha-card'>
                        <div class='ficha-section-title'>UBICACIÓN Y CONTACTO</div>
                        <table class='table-data'>
                            <tr>
                                <td class='label-cell'>Servicio</td>
                                <td class='value-cell' id='nombre-{$cs_id}'>".$get('NOMBRE')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>C/S</td>
                                <td class='value-cell' id='csvalor-{$cs_id}'>".$cs_id."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Comuna / Región</td>
                                <td class='value-cell' id='comreg-{$cs_id}'>".$get('Comuna')." // ".$get('Region')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Dirección</td>
                                <td class='value-cell' id='direccion-{$cs_id}'>".$get('Direccion')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Sucursal / Sitio</td>
                                <td class='value-cell' id='sucsit-{$cs_id}'>".$get('Sucursal')." // ".$get('Sitio')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Responsable</td>
                                <td class='value-cell' id='responsable-{$cs_id}'>".$get('Encargado')." (".$get('Telefono').")</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Email</td>
                                <td class='value-cell' id='email-{$cs_id}'>".$get('Email')."</td>
                            </tr>
                        </table>
                      </div>";

                // ===== ESPECIFICACIONES DE RED =====
                echo "<div class='ficha-card'>
                        <div class='ficha-section-title'>ESPECIFICACIONES DE RED</div>
                        <table class='table-data'>

                            <tr>
                                <td class='label-cell'>TIPO</td>
                                <td class='value-cell' id='tipo-{$cs_id}'>".$get('TIPO')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Medio / Velocidad</td>
                                <td class='value-cell' id='mediovel-{$cs_id}'>".$get('Medio Acceso')." // ".$get('Velocidad')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Respaldo</td>
                                <td class='value-cell' id='respaldo-{$cs_id}'>".$get('RESPALDO')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>IP WAN</td>
                                <td class='value-cell' id='ipwan-{$cs_id}'>".$get('IP WAN')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>IP LAN</td>
                                <td class='value-cell' id='iplan-{$cs_id}'>".$get('IP LAN')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Nodo / Interfaz</td>
                                <td class='value-cell' id='nodoint-{$cs_id}'>".$get('NODO')." // ".$get('INT')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>PE / Interfaz PE</td>
                                <td class='value-cell' id='peint-{$cs_id}'>".$get('PE')." // ".$get('INT PE')."</td>
                            </tr>

                            <tr>
                                <td class='label-cell'>Modelo / Serial</td>
                                <td class='value-cell' id='modser-{$cs_id}'>".$get('Modelo')." // ".$get('serial Number')."</td>
                            </tr>

                        </table>
                      </div>";

                echo "</div>"; // cierre ficha-full
            }
            fclose($f);
        }
        ?>
    </div>

    <div class="panel-derecho">
        <div class="p-3 border-bottom bg-light fw-bold text-dark" style="font-size: 0.85rem;">RESULTADOS ENCONTRADOS</div>
        <div style="flex-grow:1; overflow-y:auto;">
            <table class="table table-hover m-0" style="font-size: 0.88rem;">
                <tbody id="resultBody"></tbody>
            </table>
        </div>
    </div>
</div>

<footer class="main-footer">
    <div><b>Dashboard CMPC</b> | Mantenimiento de Redes 2026</div>
    <div>Desarrollado por: <span class="footer-author">Alvaro Jimenez</span></div>
</footer>

<!-- ✅ JS externo -->
<script src="app.js"></script>

</body>
</html>