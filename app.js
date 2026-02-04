// app.js - Dashboard CMPC
// Búsqueda + ver ficha + copiar EMAIL / ATT Terreno / SSH (sin alerts)
document.addEventListener('DOMContentLoaded', () => {
  const mainInput = document.getElementById('mainInput');
  const resultBody = document.getElementById('resultBody');
  const allCards = document.querySelectorAll('.ficha-full');
  const placeholder = document.getElementById('placeholderMsg');

  // Si no estamos en home/editor, igual inicializamos lista
  if (!mainInput || !resultBody || !placeholder) {
    initListaExcel();
    return;
  }

  mainInput.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    resultBody.innerHTML = "";
    allCards.forEach(c => c.classList.add('hidden'));

    if (query.length < 2) {
      placeholder.classList.remove('hidden');
      return;
    }
    placeholder.classList.add('hidden');

    allCards.forEach(c => {
      if ((c.dataset.search || "").includes(query)) {
        const cs = c.id.replace('cs-', '');
        const info = c.dataset.info || '';

        const nombreEl = document.getElementById('nombre-' + cs);
        const nombre = nombreEl ? nombreEl.innerText.trim() : (c.querySelector('.value-cell')?.innerText || 'N/A');

        let colorClass = 'bg-secondary';
        if (info.includes('PPAL')) colorClass = 'color-ppal';
        else if (info.includes('RESP')) colorClass = 'color-resp';
        else if (info.includes('DEDI')) colorClass = 'color-dedi';
        else if (info.includes('TEL')) colorClass = 'color-tel';
        else if (info.includes('UPS')) colorClass = 'color-ups';
        else if (info.includes('SW')) colorClass = 'color-sw';
        else if (info.includes('UNIC')) colorClass = 'color-unic';
        else if (info.includes('Z-RET')) colorClass = 'color-zret';

        resultBody.insertAdjacentHTML('beforeend', `
          <tr style="cursor:pointer" onclick="viewFicha('${cs}')">
            <td><span class="badge-status ${colorClass}">${info}</span></td>
            <td><span class="cs-link">${cs}</span></td>
            <td><small>${nombre}</small></td>
          </tr>
        `);
      }
    });
  });
});

// =====================
// Copiado silencioso
// =====================
function copySilent(text) {
  return navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  });
}
function getByIdOrNA(id) {
  const el = document.getElementById(id);
  return el ? el.innerText.trim() : "N/A";
}
function splitPair(text) {
  if (!text || text === "N/A") return ["N/A", "N/A"];
  const clean = String(text).trim();
  let parts = clean.split(" // ");
  if (parts.length < 2) parts = clean.split("//");
  if (parts.length < 2) parts = clean.split(" / ");
  if (parts.length < 2) parts = clean.split("/");
  parts = parts.map(s => (s || "").trim()).filter(Boolean);
  return [parts[0] || "N/A", parts[1] || "N/A"];
}

// =====================
// Ver ficha (global)
// =====================
function viewFicha(id) {
  const allCards = document.querySelectorAll('.ficha-full');
  const placeholder = document.getElementById('placeholderMsg');
  allCards.forEach(c => c.classList.add('hidden'));
  if (placeholder) placeholder.classList.add('hidden');
  const ficha = document.getElementById('cs-' + id);
  if (ficha) ficha.classList.remove('hidden');
}

// =====================
// EMAIL (silencioso)
// =====================
function copyEmail(cs) {
  const servicio = getByIdOrNA('nombre-' + cs);
  const csvalor = getByIdOrNA('csvalor-' + cs);
  const comreg = getByIdOrNA('comreg-' + cs);
  const direccion = getByIdOrNA('direccion-' + cs);
  const sucsit = getByIdOrNA('sucsit-' + cs);
  const responsable = getByIdOrNA('responsable-' + cs);
  const email = getByIdOrNA('email-' + cs);
  const tipo = getByIdOrNA('tipo-' + cs);
  const mediovel = getByIdOrNA('mediovel-' + cs);
  const respaldo = getByIdOrNA('respaldo-' + cs);
  const ipwan = getByIdOrNA('ipwan-' + cs);
  const iplan = getByIdOrNA('iplan-' + cs);
  const nodoint = getByIdOrNA('nodoint-' + cs);
  const peint = getByIdOrNA('peint-' + cs);
  const modser = getByIdOrNA('modser-' + cs);

  const texto = `UBICACIÓN Y CONTACTO Servicio: ${servicio} C/S: ${csvalor} Comuna / Región: ${comreg} Dirección: ${direccion} Sucursal / Sitio: ${sucsit} Responsable: ${responsable} Email: ${email} ESPECIFICACIONES DE RED Tipo: ${tipo} Medio / Velocidad: ${mediovel} Respaldo: ${respaldo} IP WAN: ${ipwan} IP LAN: ${iplan} Nodo / Interfaz: ${nodoint} PE / Interfaz PE: ${peint} Modelo / Serial: ${modser}`;
  copySilent(texto);
}

// =====================
// ATT TERRENO (plantilla exacta)
// =====================
function copyAttTerreno(cs) {
  const servicio = getByIdOrNA('nombre-' + cs);
  const tipo = getByIdOrNA('tipo-' + cs);
  const mediovel = getByIdOrNA('mediovel-' + cs);
  const [medio, velocidad] = splitPair(mediovel);
  const respaldo = getByIdOrNA('respaldo-' + cs);
  const ipwan = getByIdOrNA('ipwan-' + cs);
  const iplan = getByIdOrNA('iplan-' + cs);
  const nodointRaw = getByIdOrNA('nodoint-' + cs);
  const [nodo, interfaz] = splitPair(nodointRaw);
  const peintRaw = getByIdOrNA('peint-' + cs);
  const [pe, peInterfaz] = splitPair(peintRaw);
  const contactoLocal = getByIdOrNA('responsable-' + cs);
  const direccion = getByIdOrNA('direccion-' + cs);

  const texto = `TERRENO GRUPO N2 ORIGEN...............: (PROVEEDOR 3) NOMBRE ESPECIALISTA N2........: ALVARO JIMENEZ (COLACION 14:00 a 15:00) CONTACTO SOPORTE TECNICO......: +56 9 5759 8255 (Si no hay respuesta escribir Whatsapp) EMAIL.........................: ajimenez@sclconsultores.com DIAGNOSTICO DE FALLA............: Servicio cortado PRUEBAS REALIZADAS...............: Servicio se encuentra DOWN, se revisa estado de la interfaz en el NODO y se encuentra UP, se reinicia pero servicio no levanta remotamente. ACCION RESOLUTIVA.............: Revisar servicio desde el NODO al CE, servicio se encuentra DOWN. Tipo: ${tipo} Velocidad: ${velocidad} Medio: ${medio} Respaldo: ${respaldo} Servicio: ${servicio} IP WAN: ${ipwan} IP LAN: ${iplan} NODO: ${nodo} Interfaz: ${interfaz} PE: ${pe} PE Interfaz: ${peInterfaz} REQUIRE VALIDACIÓN CON N2.....: [SI] HORARIO ATENCIÓN CLIENTE......: 8:00 - 18:00 Contacto local: ${contactoLocal} Direccion: ${direccion} Validar con Residente ALVARO JIMENEZ +56 9 5759 8255`;
  copySilent(texto);
}

// =====================
// SSH (silencioso)
// =====================
function copySSH(cs) {
  const ipwan = getByIdOrNA('ipwan-' + cs);
  const user = "admin";
  const cmd = (ipwan && ipwan !== "N/A") ? `ssh ${user}@${ipwan}` : `ssh ${user}@`;
  copySilent(cmd);
}

function menuAction(option, cs) {
  console.log("Menu:", option, "CS:", cs);
}
window.menuAction = menuAction;
window.viewFicha = viewFicha;
window.copyEmail = copyEmail;
window.copyAttTerreno = copyAttTerreno;
window.copySSH = copySSH;

/* =========================================================
   LISTA: DataTables + popup + colores pastel
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  initListaExcel();
});

function initListaExcel() {
  const tableEl = document.getElementById('tablaDatos');
  if (!tableEl) return;

  if (!window.jQuery || !window.jQuery.fn || !window.jQuery.fn.dataTable) {
    console.error("Lista: falta jQuery/DataTables.");
    return;
  }
  const $ = window.jQuery;
  if ($.fn.dataTable.isDataTable('#tablaDatos')) return;

  let COL_OPTIONS = {};
  const jsonTag = document.getElementById('listaColOptions');
  if (jsonTag && jsonTag.textContent.trim()) {
    try { COL_OPTIONS = JSON.parse(jsonTag.textContent.trim()); } catch {}
  }

  const infoColIndex = (() => {
    const ths = tableEl.querySelectorAll('thead tr:first-child th');
    for (let i = 0; i < ths.length; i++) {
      if ((ths[i].innerText || '').trim().toUpperCase() === 'INFO') return i;
    }
    return 0;
  })();

  const infoToClass = (info) => (info || '')
    .toString().trim().toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9\-]/g, '')
    .replace(/\-+/g, '-');

  const applyRowColor = (row, infoText) => {
    row.className = row.className.split(' ').filter(c => !c.startsWith('info-row-')).join(' ').trim();
    const cls = infoToClass(infoText);
    if (cls) row.classList.add('info-row-' + cls);
  };

  const escRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const dt = $('#tablaDatos').DataTable({
    paging: false,
    info: true,
    searching: true,
    ordering: true,
    orderCellsTop: true,
    scrollX: true,
    scrollY: Math.max(320, window.innerHeight - 260) + 'px',
    scrollCollapse: true,
    autoWidth: false,
    deferRender: true,
    createdRow: function(row, data) {
      const infoText = data && data[infoColIndex] ? data[infoColIndex] : '';
      applyRowColor(row, infoText);
    }
  });

  const $container = $(dt.table().container());
  const $head = $container.find('div.dataTables_scrollHead thead').length
    ? $container.find('div.dataTables_scrollHead thead')
    : $('#tablaDatos thead');

  const $filterRow = $head.find('tr:eq(1)');
  const $scrollBody = $container.find('div.dataTables_scrollBody');

// =========================================================
// ✅ Barra horizontal sticky (sincronizada)
// =========================================================
(function setupStickyXBar(){
  // Si no existe scrollBody, salir
  if (!$scrollBody.length) return;

  // Evitar duplicar barra
  if (document.querySelector('.dt-xbar')) return;

  // Crear barra
  const bar = document.createElement('div');
  bar.className = 'dt-xbar';
  const inner = document.createElement('div');
  inner.className = 'dt-xbar-inner';
  bar.appendChild(inner);

  // Insertar barra al final del wrap del DataTable (dentro del panel)
  const wrap = document.getElementById('dtWrap');
  if (wrap) wrap.appendChild(bar);

  const bodyEl = $scrollBody.get(0);

  function syncWidth(){
    const t = bodyEl.querySelector('table');
    if (!t) return;
    inner.style.width = t.scrollWidth + 'px';
    bar.scrollLeft = bodyEl.scrollLeft;
  }

  // Sync bidireccional
  $scrollBody.on('scroll', function(){
    bar.scrollLeft = bodyEl.scrollLeft;
  });

  bar.addEventListener('scroll', function(){
    bodyEl.scrollLeft = bar.scrollLeft;
  });

  // Cada redraw/resize ajusta ancho
  if (typeof dt !== 'undefined' && dt) {
    dt.on('draw', function(){ setTimeout(syncWidth, 0); });
  }

  window.addEventListener('resize', function(){
    setTimeout(syncWidth, 150);
  });

  // Inicial
  setTimeout(syncWidth, 150);
})();


document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".main-footer");
  const xfixed = document.querySelector(".dt-xfixed");
  if (!footer || !xfixed) return;

  function ajustarBarra() {
    const h = footer.getBoundingClientRect().height || 0;
    // Subimos la barra exactamente la altura del footer + 6px de margen
    xfixed.style.bottom = (h + 6) + "px";
  }

  ajustarBarra();
  window.addEventListener("resize", ajustarBarra);
});


  // filtros texto
  $filterRow.find('th').each(function(i){
    const $input = $(this).find('input.dt-filter-text');
    if ($input.length){
      $input.off('keyup change clear').on('keyup change clear', function(){
        dt.column(i).search(this.value || '').draw();
      });
    }
  });

  // popup checkbox
  const selectedByCol = {};
  let activePopup = null;

  const closePopup = () => {
    if (activePopup){ activePopup.remove(); activePopup = null; }
  };

  const updateBtn = (btn, colIndex) => {
    const set = selectedByCol[colIndex];
    const label = btn.querySelector('.xl-filter-text');
    if (!label) return;
    if (!set || set.size === 0) label.textContent = '(Todos)';
    else if (set.size === 1) label.textContent = Array.from(set)[0];
    else label.textContent = set.size + ' seleccionados';
  };

  const applyCheckboxFilter = (colIndex) => {
    const set = selectedByCol[colIndex];
    if (!set || set.size === 0){
      dt.column(colIndex).search('').draw();
      return;
    }
    const vals = Array.from(set).map(v => escRegex(v));
    dt.column(colIndex).search('^(' + vals.join('|') + ')$', true, false).draw();
  };

  const openPopup = (btn, colIndex) => {
    closePopup();
    const opts = (COL_OPTIONS && COL_OPTIONS[colIndex]) ? COL_OPTIONS[colIndex] : [];
    if (!selectedByCol[colIndex]) selectedByCol[colIndex] = new Set();
    const set = selectedByCol[colIndex];

    const popup = document.createElement('div');
    popup.className = 'xl-popup';

    // respaldo inline (aunque falle CSS, igual flotará)
    popup.style.position = 'fixed';
    popup.style.zIndex = '999999';
    popup.style.background = '#fff';
    popup.style.border = '1px solid #cfd8e3';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 10px 25px rgba(0,0,0,.15)';
    popup.style.maxHeight = '360px';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';

    popup.innerHTML = `
      <div class="xl-popup-head">
        <input type="text" class="xl-popup-search" placeholder="Buscar..." />
        <div class="xl-popup-actions">
          <button type="button" class="xl-mini" data-act="all">Todo</button>
          <button type="button" class="xl-mini" data-act="none">Nada</button>
        </div>
      </div>
      <div class="xl-popup-list"></div>
      <div class="xl-popup-foot">
        <button type="button" class="xl-btn xl-btn-ghost" data-act="clear">Limpiar</button>
        <button type="button" class="xl-btn xl-btn-primary" data-act="apply">Aplicar</button>
      </div>
    `;

    const list = popup.querySelector('.xl-popup-list');
    const search = popup.querySelector('.xl-popup-search');

    const render = (q) => {
      const query = (q || '').toLowerCase().trim();
      list.innerHTML = '';
      opts.forEach(v => {
        const s = String(v);
        if (query && !s.toLowerCase().includes(query)) return;
        const row = document.createElement('label');
        row.className = 'xl-item';
        row.innerHTML = `
          <input type="checkbox" data-val="${s.replaceAll('"','&quot;')}" ${set.has(s) ? 'checked' : ''}/>
          <span>${s}</span>
        `;
        list.appendChild(row);
      });
      list.querySelectorAll('input[type="checkbox"]').forEach(ch => {
        ch.addEventListener('change', function(){
          const val = this.getAttribute('data-val').replaceAll('&quot;','"');
          if (this.checked) set.add(val);
          else set.delete(val);
        });
      });
    };

    render('');
    search.addEventListener('input', () => render(search.value));

    popup.addEventListener('click', (ev) => {
      const t = ev.target;
      if (!(t instanceof HTMLElement)) return;
      const act = t.getAttribute('data-act');
      if (!act) return;

      if (act === 'all'){ opts.forEach(v => set.add(String(v))); render(search.value); }
      if (act === 'none'){ set.clear(); render(search.value); }
      if (act === 'clear'){ set.clear(); applyCheckboxFilter(colIndex); updateBtn(btn, colIndex); closePopup(); }
      if (act === 'apply'){ applyCheckboxFilter(colIndex); updateBtn(btn, colIndex); closePopup(); }
    });

    popup.addEventListener('mousedown', e => e.stopPropagation());
    document.body.appendChild(popup);
    activePopup = popup;

    // posicionamiento (clamp)
    const rect = btn.getBoundingClientRect();
    const pad = 8;
    const pr = popup.getBoundingClientRect();
    let left = rect.left;
    let top = rect.bottom + 6;

    if (left + pr.width > window.innerWidth - pad) left = window.innerWidth - pr.width - pad;
    if (left < pad) left = pad;
    if (top + pr.height > window.innerHeight - pad) top = rect.top - pr.height - 6;
    if (top < pad) top = pad;

    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    popup.style.minWidth = Math.max(220, rect.width) + 'px';
  };

  $head.on('click', '.xl-filter', function(){
    openPopup(this, parseInt(this.getAttribute('data-colindex'), 10));
  });

  document.addEventListener('mousedown', closePopup);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });
  $scrollBody.on('scroll', closePopup);

  $('#btnClearFilters').on('click', function(){
    closePopup();
    dt.search('');
    dt.columns().search('');
    dt.draw();
    Object.keys(selectedByCol).forEach(k => selectedByCol[k].clear());
    $head.find('.xl-filter').each(function(){
      updateBtn(this, parseInt(this.getAttribute('data-colindex'), 10));
    });
    $head.find('input.dt-filter-text').val('');
  });

  $('#btnExportCsv').on('click', function(){
    const data = dt.rows({ search: 'applied' }).data().toArray();
    const headers = [];
    $head.find('tr:eq(0) th').each(function(){ headers.push($(this).text().trim()); });
    let csv = '';
    csv += headers.map(h => `"${String(h).replaceAll('"','""')}"`).join(';') + '\n';
    data.forEach(row => {
      csv += row.map(cell => `"${String(cell).replaceAll('"','""')}"`).join(';') + '\n';
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listado_filtrado.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  dt.on('draw', function(){
    dt.rows({ page:'current' }).every(function(){
      const row = this.node();
      const data = this.data();
      const infoText = data && data[infoColIndex] ? data[infoColIndex] : '';
      applyRowColor(row, infoText);
    });
    closePopup();
  });

  window.addEventListener('resize', () => {
    dt.settings()[0].oScroll.sY = Math.max(320, window.innerHeight - 260) + 'px';
    dt.draw(false);
    dt.columns.adjust();
    closePopup();
  });
}

/* =========================================================
   APP.JS - COMPARTIDO (LISTA + CASOS)
   - Scroll horizontal fijo sincronizado (dt-xfixed)
   - Filtro multi-selección por columna (popup tipo Excel)
   - Exportar Excel/PDF SOLO filtrado (filas visibles)
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("tablaDatos");
  const wrap  = document.getElementById("tablaWrap");

  // Si no estamos en Listado/Casos (no hay tabla), no hacemos nada.
  if (!table || !wrap) return;

  // ---------------------------------------------------------
  // 1) Barra horizontal fija (dt-xfixed) sincronizada con wrap
  // ---------------------------------------------------------
  let xfixed = document.querySelector(".dt-xfixed");
  if (!xfixed) {
    xfixed = document.createElement("div");
    xfixed.className = "dt-xfixed";
    xfixed.innerHTML = '<div class="dt-xfixed-inner"></div>';
    document.body.appendChild(xfixed);
  }
  const xInner = xfixed.querySelector(".dt-xfixed-inner");

  function syncHorizontalBar() {
    xInner.style.width = wrap.scrollWidth + "px";
    const hasX = wrap.scrollWidth > wrap.clientWidth + 2;
    xfixed.style.display = hasX ? "block" : "none";
  }

  wrap.addEventListener("scroll", () => {
    xfixed.scrollLeft = wrap.scrollLeft;
  }, { passive: true });

  xfixed.addEventListener("scroll", () => {
    wrap.scrollLeft = xfixed.scrollLeft;
  }, { passive: true });

  syncHorizontalBar();
  window.addEventListener("resize", syncHorizontalBar);
  setTimeout(syncHorizontalBar, 300);

  // ---------------------------------------------------------
  // Helpers generales
  // ---------------------------------------------------------
  const getHeaders = () =>
    Array.from(table.querySelectorAll("thead th")).map(th => {
      const t = th.querySelector(".th-title");
      return (t ? t.textContent : th.textContent).trim();
    });

  const getVisibleRows = () =>
    Array.from(table.querySelectorAll("tbody tr"))
      .filter(tr => tr.style.display !== "none");

  const getRowCells = (tr) =>
    Array.from(tr.querySelectorAll("td"))
      .map(td => (td.innerText || "").trim());

  // ---------------------------------------------------------
  // 2) Exportar Excel / PDF (solo filtrado)
  // ---------------------------------------------------------
  function exportExcelFiltered(prefix = "Export") {
    if (typeof XLSX === "undefined") {
      alert("No está cargada la librería XLSX (SheetJS).");
      return;
    }

    const headers = getHeaders();
    const rows = getVisibleRows().map(getRowCells);

    const aoa = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    // anchos aproximados
    ws["!cols"] = headers.map((h, i) => {
      let maxLen = h.length;
      rows.forEach(r => { maxLen = Math.max(maxLen, (r[i] || "").length); });
      return { wch: Math.min(Math.max(maxLen + 2, 10), 45) };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Datos");

    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    XLSX.writeFile(wb, `${prefix}_filtrado_${stamp}.xlsx`);
  }

  function exportPDFFiltered(prefix = "Export") {
    const jsPDF = window.jspdf?.jsPDF;
    if (!jsPDF) {
      alert("No está cargada la librería jsPDF.");
      return;
    }
    if (typeof (new jsPDF()).autoTable !== "function") {
      alert("Falta jsPDF AutoTable (jspdf-autotable).");
      return;
    }

    const headers = getHeaders();
    const bodyAll = getVisibleRows().map(getRowCells);

    // Ajustes para tablas anchas
    const MAX_COLS_PER_PAGE = 8;
    const FONT_SIZE = 7;

    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });

    doc.setFontSize(12);
    doc.text(`${prefix} (filtrado)`, 40, 30);

    // dividir columnas en bloques
    const chunks = [];
    for (let start = 0; start < headers.length; start += MAX_COLS_PER_PAGE) {
      const end = Math.min(start + MAX_COLS_PER_PAGE, headers.length);
      chunks.push({ start, end });
    }

    chunks.forEach((chunk, idx) => {
      if (idx > 0) doc.addPage();

      const headChunk = headers.slice(chunk.start, chunk.end);
      const bodyChunk = bodyAll.map(r => r.slice(chunk.start, chunk.end));

      doc.setFontSize(10);
      doc.text(`Columnas ${chunk.start + 1}–${chunk.end} de ${headers.length}`, 40, 55);

      doc.autoTable({
        head: [headChunk],
        body: bodyChunk,
        startY: 70,
        theme: "grid",
        styles: { fontSize: FONT_SIZE, cellPadding: 3, overflow: "linebreak", valign: "middle" },
        headStyles: { fillColor: [0, 97, 255], textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        margin: { left: 40, right: 40 },
        showHead: "everyPage",
        rowPageBreak: "auto"
      });
    });

    const stamp = new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");
    doc.save(`${prefix}_filtrado_${stamp}.pdf`);
  }

  // Botones export (compartidos)
  document.querySelectorAll(".js-export-excel").forEach(btn => {
    btn.addEventListener("click", () => {
      const prefix = btn.dataset.prefix || "Export";
      exportExcelFiltered(prefix);
    });
  });

  document.querySelectorAll(".js-export-pdf").forEach(btn => {
    btn.addEventListener("click", () => {
      const prefix = btn.dataset.prefix || "Export";
      exportPDFFiltered(prefix);
    });
  });

  // ---------------------------------------------------------
  // 3) Filtro multi-selección por columna (popup tipo Excel)
  // ---------------------------------------------------------
  const tbody = table.querySelector("tbody");
  const allTr = Array.from(tbody.querySelectorAll("tr"));

  // Cache de todas las celdas para filtrar rápido
  const rowCache = allTr.map(tr => Array.from(tr.children).map(td => (td.innerText || "").trim()));

  // filters: colIndex => Set(valores permitidos)
  const filters = new Map();

  // Popup único reutilizable (usa estilos xl-popup del CSS) [1](https://sclconsultores-my.sharepoint.com/personal/ajimenez_sclconsultores_com/Documents/Archivos%20de%20Microsoft%C2%A0Copilot%20Chat/lista.php)
  const popup = document.createElement("div");
  popup.className = "xl-popup";
  popup.style.display = "none";
  popup.style.position = "fixed";
  popup.style.zIndex = "9000";
  popup.innerHTML = `
    <div class="xl-popup-head p-2">
      <div class="d-flex gap-2 align-items-center">
        <input class="xl-popup-search form-control" type="text" placeholder="Buscar...">
        <button type="button" class="btn btn-sm btn-light xl-mini xl-check-all">Todo</button>
        <button type="button" class="btn btn-sm btn-light xl-mini xl-check-none">Nada</button>
      </div>
    </div>
    <div class="xl-popup-list" style="max-height:240px; overflow:auto;"></div>
    <div class="xl-popup-foot p-2 d-flex justify-content-end gap-2">
      <button type="button" class="btn btn-sm btn-secondary xl-btn xl-cancel">Cancelar</button>
      <button type="button" class="btn btn-sm btn-outline-danger xl-btn xl-clear">Limpiar</button>
      <button type="button" class="btn btn-sm btn-primary xl-btn xl-apply">Aplicar</button>
    </div>
  `;
  document.body.appendChild(popup);

  const searchInput = popup.querySelector(".xl-popup-search");
  const listBox = popup.querySelector(".xl-popup-list");

  let activeCol = null;
  let currentValues = [];

  function uniqueValuesForColumn(col) {
    const set = new Set();
    for (const row of rowCache) set.add(row[col] || "");
    return Array.from(set).sort((a,b) => a.localeCompare(b, "es", { sensitivity:"base" }));
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderList(filterText = "") {
    const text = filterText.trim().toLowerCase();
    const selected = filters.get(activeCol) || new Set(currentValues);

    const html = currentValues
      .filter(v => (v || "").toLowerCase().includes(text))
      .map(v => {
        const label = (v === "" ? "(Vacío)" : v);
        const checked = selected.has(v) ? "checked" : "";
        return `
          <label class="xl-item d-flex align-items-center gap-2">
            <input type="checkbox" class="xl-opt" data-val="${escapeHtml(v)}" ${checked}>
            <span>${escapeHtml(label)}</span>
          </label>
        `;
      }).join("");

    listBox.innerHTML = html || `<div class="text-muted p-2">Sin resultados</div>`;
  }

  function openPopup(btn, col) {
    activeCol = col;
    currentValues = uniqueValuesForColumn(col);

    if (!filters.has(col)) filters.set(col, new Set(currentValues));

    searchInput.value = "";
    renderList("");

    const r = btn.getBoundingClientRect();
    popup.style.left = Math.min(r.left, window.innerWidth - 360) + "px";
    popup.style.top  = Math.min(r.bottom + 6, window.innerHeight - 380) + "px";
    popup.style.display = "block";
    searchInput.focus();
  }

  function closePopup() {
    popup.style.display = "none";
    activeCol = null;
  }

  function applyFilters() {
    allTr.forEach((tr, idx) => {
      const row = rowCache[idx];
      let visible = true;

      for (const [col, allowed] of filters.entries()) {
        if (!allowed || allowed.size === 0) { visible = false; break; }
        const val = row[col] || "";
        if (!allowed.has(val)) { visible = false; break; }
      }

      tr.style.display = visible ? "" : "none";
    });

    // marcar embudos activos
    document.querySelectorAll(".xl-filter-btn").forEach(b => b.classList.remove("is-filtered"));
    for (const [col, allowed] of filters.entries()) {
      const all = uniqueValuesForColumn(col);
      if (allowed.size !== all.length) {
        const b = document.querySelector(`.xl-filter-btn[data-col="${col}"]`);
        if (b) b.classList.add("is-filtered");
      }
    }

    // si cambia visibilidad, re-sincroniza el ancho
    syncHorizontalBar();
  }

  // Abrir popup al hacer click en embudo
  table.addEventListener("click", (e) => {
    const btn = e.target.closest(".xl-filter-btn");
    if (!btn) return;
    const col = parseInt(btn.dataset.col, 10);
    openPopup(btn, col);
  });

  // Buscar dentro del popup
  searchInput.addEventListener("input", () => renderList(searchInput.value));

  // Todo / Nada
  popup.querySelector(".xl-check-all").addEventListener("click", () => {
    filters.set(activeCol, new Set(currentValues));
    renderList(searchInput.value);
  });
  popup.querySelector(".xl-check-none").addEventListener("click", () => {
    filters.set(activeCol, new Set());
    renderList(searchInput.value);
  });

  // Aplicar
  popup.querySelector(".xl-apply").addEventListener("click", () => {
    const selected = new Set();
    popup.querySelectorAll(".xl-opt:checked").forEach(chk => {
      const label = chk.parentElement.querySelector("span").innerText;
      selected.add(label === "(Vacío)" ? "" : label);
    });
    filters.set(activeCol, selected);
    applyFilters();
    closePopup();
  });

  // Limpiar filtro de columna activa
  popup.querySelector(".xl-clear").addEventListener("click", () => {
    filters.delete(activeCol);
    applyFilters();
    closePopup();
  });

  // Cancelar
  popup.querySelector(".xl-cancel").addEventListener("click", closePopup);

  // Cerrar si clic fuera
  document.addEventListener("mousedown", (e) => {
    if (popup.style.display !== "block") return;
    if (popup.contains(e.target)) return;
    if (e.target.closest(".xl-filter-btn")) return;
    closePopup();
  });
});