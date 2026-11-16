# Buscador Avanzado

Armador de búsquedas avanzadas para Google y Google Académico (conversión del Excel `Buscador_Tuso.xlsx`).
Llenas palabras clave y filtros (materia, nivel, tipo, formato, idioma, país, fuente, autor, años) y se genera la consulta con operadores (`AND`, `OR`, `-`, `intitle:`, `filetype:`, `site:`, `after:`, `before:`).

## Usar
Abre `index.html` en el navegador (no necesita servidor ni instalación).

## Publicar en GitHub Pages
Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Estructura
| Archivo | Equivale en el Excel a |
|---|---|
| `index.html`, `style.css`, `app.js` | Hoja **Buscador** (formulario y resultado) |
| `search.js` | Hoja **Calculo** (fórmulas que arman la consulta) |
| `listas.js` | Hoja **Listas** (opciones de los desplegables; edítala para agregar materias, países, etc.) |

## Probar la lógica
`node test.js`
