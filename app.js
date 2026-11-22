(function () {
  const L = window.LISTAS;
  const $ = (id) => document.getElementById(id);
  const opts = (arr) => arr.map((o) => `<option value="${o}">${o}</option>`).join("");
  const sel = (id, arr, def) =>
    `<select id="${id}">${arr.map((o) => `<option${o === def ? " selected" : ""}>${o}</option>`).join("")}</select>`;
  const dash = '<span class="dash">—</span>';

  // Listas de los desplegables: solo se puede elegir lo que esté aquí (ver listas.js)
  const dl = { materia: L.materias, nivel: L.niveles, tipo: L.tipos, formato: L.formatos, idioma: L.idiomas, pais: L.paises, fuente: L.fuentes };
  const pick = (k) => `<select id="${k}"><option value="">— Cualquiera —</option>${opts(dl[k])}</select>`;

  // 1 · Palabras clave
  let h = `<div class="hd">Campo</div><div class="hd">Valor</div><div class="hd">Unir con la anterior</div><div class="hd">¿Frase exacta?</div>`;
  for (let i = 0; i < 4; i++) {
    h += `<label for="kw${i}">Palabra clave ${i + 1}</label>
      <input id="kw${i}" type="text" placeholder="${i === 0 ? "Ej.: ecuaciones cuadráticas" : "Opcional"}">
      ${i === 0 ? dash : sel("kwop" + i, ["AND", "OR", "NOT"])}
      ${sel("kwex" + i, ["No", "Si"])}`;
  }
  $("kw").innerHTML = h;

  // 2 · Filtros
  const f3 = [["materia", "Materia"], ["nivel", "Nivel educativo"], ["tipo", "Tipo de documento"]];
  let g = `<div class="hd">Filtro</div><div class="hd">Valor</div><div class="hd">¿Solo en el título?</div><div class="hd">Unir con lo anterior</div>`;
  f3.forEach(([k, n]) => {
    g += `<label for="${k}">${n}</label>${pick(k)}${sel(k + "T", ["No", "Si"])}${sel(k + "O", ["AND", "OR", "NOT"])}`;
  });
  [["formato", "Formato de archivo"], ["idioma", "Idioma"], ["pais", "País"], ["fuente", "Fuente"]].forEach(([k, n]) => {
    g += `<label for="${k}">${n}</label>${pick(k)}${dash}${dash}`;
  });
  g += `<label for="autor">Autor</label><input id="autor" type="text" placeholder="Nombre exacto">${dash}${sel("autorO", ["AND", "OR", "NOT"])}`;
  g += `<label for="desde">Año desde</label><input id="desde" type="number" min="1900" step="1" placeholder="Ej.: 2018">${dash}${dash}`;
  g += `<label for="hasta">Año hasta</label><input id="hasta" type="number" min="1900" step="1">${dash}${dash}`;
  $("flt").innerHTML = g;

  const v = (id) => $(id).value;
  const yr = (id) => { const n = parseInt(v(id), 10); return n >= 1900 ? String(n) : ""; };

  function update() {
    const state = {
      kw: [0, 1, 2, 3].map((i) => ({ v: v("kw" + i), op: i ? v("kwop" + i) : "", exact: v("kwex" + i) })),
      materia: { v: v("materia"), op: v("materiaO"), title: v("materiaT") },
      nivel: { v: v("nivel"), op: v("nivelO"), title: v("nivelT") },
      tipo: { v: v("tipo"), op: v("tipoO"), title: v("tipoT") },
      formato: v("formato"), idioma: v("idioma"), pais: v("pais"), fuente: v("fuente"),
      autor: { v: v("autor"), op: v("autorO") },
      desde: yr("desde"), hasta: yr("hasta"),
    };
    const r = Search.build(state);
    const out = $("query");
    out.textContent = r.consulta || "Llena al menos una casilla para generar la búsqueda.";
    out.classList.toggle("empty", !r.consulta);
    $("warn").textContent = r.avisos || "";
    $("warn").hidden = !r.avisos;
    [["go-google", r.google], ["go-scholar", r.scholar]].forEach(([id, url]) => {
      const a = $(id);
      if (url) { a.href = url; a.classList.remove("off"); } else { a.removeAttribute("href"); a.classList.add("off"); }
    });
    $("copy").disabled = !r.consulta;
  }

  document.addEventListener("input", update);
  document.addEventListener("change", update);
  $("copy").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText($("query").textContent); $("copy").textContent = "¡Copiado!"; }
    catch { const r = document.createRange(); r.selectNodeContents($("query")); getSelection().removeAllRanges(); getSelection().addRange(r); $("copy").textContent = "Selecciona y copia"; }
    setTimeout(() => ($("copy").textContent = "Copiar"), 1500);
  });
  update();
})();
