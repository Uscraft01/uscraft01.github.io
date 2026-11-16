// Lógica de armado de la consulta (equivale a la hoja "Calculo" del Excel).
(function (root) {
  const q = (s) => '"' + s + '"';
  const op = (o) => (o === "OR" ? " OR " : o === "NOT" ? " -" : " AND ");
  const firstWord = (s) => { s = (s || "").trim(); const i = s.indexOf(" "); return i > 0 ? s.slice(0, i) : s; };
  const clean = (s) => s.replace(/\s+/g, " ").trim();
  const stripOp = (s) => s.startsWith("OR ") ? s.slice(3) : s.startsWith("AND ") ? s.slice(4) : s;

  // s = {kw:[{v,op,exact}x4], materia,nivel,tipo:{v,op,title}, formato, idioma, pais, fuente, autor:{v,op}, desde, hasta}
  function build(s) {
    const t = s.kw.map((k, i) => {
      const v = (k.v || "").trim();
      if (!v) return "";
      const val = k.exact === "Si" ? q(v) : v;
      return i === 0 ? val : op(k.op) + val;
    });
    const palabras = stripOp(clean(t.join("")));

    const filtro = (f) => {
      const v = (f.v || "").trim();
      if (!v) return "";
      return op(f.op) + (f.title === "Si" ? "intitle:" : "") + q(v);
    };
    const autorV = (s.autor.v || "").trim();
    const autor = autorV ? op(s.autor.op) + q(autorV) : "";

    const texto = stripOp(clean(palabras + filtro(s.materia) + filtro(s.nivel) + filtro(s.tipo) + autor));

    const formato = (s.formato || "").trim() ? "filetype:" + s.formato.trim().toLowerCase() : "";
    const pais = firstWord(s.pais).toLowerCase();
    const fuente = (s.fuente || "").trim();
    let site = "";
    if (pais || fuente) {
      if (!fuente) site = "site:." + pais;
      else if (!pais) site = "site:" + fuente;
      else site = (fuente === "edu" || fuente === "gov") ? "site:" + fuente + "." + pais : "site:" + fuente;
    }
    const desde = (s.desde || "").toString().trim();
    const hasta = (s.hasta || "").toString().trim();
    const consulta = clean([texto, formato, site, desde ? "after:" + desde : "", hasta ? "before:" + hasta : ""].join(" "));
    const academico = texto.replace(/intitle:/g, "");
    const lang = firstWord(s.idioma);

    let avisos = "";
    if (pais && fuente && fuente !== "edu" && fuente !== "gov")
      avisos += "Se ignoró el país porque la fuente ya es un sitio específico. ";
    if (pais && (fuente === "edu" || fuente === "gov"))
      avisos += "País + edu/gov: algunos países usan gob en vez de gov (México, España, Argentina, Chile, Perú) y Reino Unido usa ac.uk. ";
    if (desde && hasta && Number(desde) > Number(hasta))
      avisos += "El año desde es mayor que el año hasta. ";

    const lr = lang ? "&lr=lang_" + lang : "";
    const google = consulta ? "https://www.google.com/search?q=" + encodeURIComponent(consulta) + lr : "";
    const scholar = academico
      ? "https://scholar.google.com/scholar?q=" + encodeURIComponent(academico) +
        (desde ? "&as_ylo=" + desde : "") + (hasta ? "&as_yhi=" + hasta : "") + lr
      : "";
    return { consulta, academico, avisos: avisos.trim(), google, scholar };
  }
  if (typeof module !== "undefined") module.exports = { build };
  root.Search = { build };
})(typeof window !== "undefined" ? window : globalThis);
