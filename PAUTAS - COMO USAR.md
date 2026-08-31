# Pautas diarias en la Bitácora

La app lee las pautas diarias (las planillas que llegan por WhatsApp y que el
lector de imágenes convierte a Excel) y responde tres cosas:

- **qué turnos hace una persona** ese día,
- **con quién los hace** (la pareja del turno),
- **qué servicios cargar** en la bitácora, ya minimizados.

Todo sigue siendo editable a mano: la carga automática solo rellena las
tarjetas, no reemplaza nada.

---

## 1. Publicar las pautas (esto lo haces tú, una vez por semana)

La pauta queda publicada en el repositorio y **todos** la ven al abrir la app,
sin tener que cargar nada desde el teléfono.

1. Deja los Excel de las pautas dentro de la carpeta **`pautas_excel`**.
   (Sirven tal como salen del lector de imágenes; el nombre del archivo puede
   ser cualquiera, la fecha se lee del encabezado de la planilla.)

2. Ejecuta el conversor:

```bash
python convertir_pautas.py
```

   Genera **`pautas/pautas.json`**.

3. Sube al repositorio: `pautas/pautas.json` (y, si quieres guardarlos,
   también los Excel de `pautas_excel`).

Al abrir la app, `index.html` descarga solo ese `pautas.json`. Si no hay señal,
usa la última copia guardada en el teléfono.

---

## 2. Lo que ve la gente

Nada de esto. Abren la app, entran a **👤 Mis Turnos**, escriben su apellido y
ahí están sus servicios. No hay ningún archivo que cargar ni ningún botón que
pueda confundirlos: la pauta ya viene dentro de la app.

---

## 3. Cómo se usa

**👤 Mis Turnos**

- Escribe tu **apellido** y el desplegable ofrece las opciones más probables
  ordenadas por apellido: escribir `HENRIQUEZ` propone *B. HENRIQUEZ,
  C. HENRIQUEZ, N. HENRIQUEZ, N. J. HENRIQUEZ, O. HENRIQUEZ*. Se elige con el dedo o con las flechas +
  Enter. El nombre elegido queda recordado para la próxima vez.
- Elige el día y aparecen tus turnos: número de turno, rol
  (maquinista / ayudante / práctica), presentación, inicio, término y la
  **pareja** con la que vas.
- Si ese día estás en descanso, licencia, feriado o permiso, lo dice.
- **➕ Cargar mis N servicios a la bitácora**: crea una tarjeta por servicio,
  **minimizada**, con el día, la ruta, los horarios de la memoria maestra y la
  tripulación ya escritos. Los servicios que no estén en la memoria maestra se
  crean en blanco para escribirlos a mano (quedan marcados en naranja).

**🧭 Planificar Viaje**

- Se agregó el selector **«Pauta del día»**. Con una pauta elegida, cada
  servicio del resultado muestra **quién lo va conduciendo**:
  `👥 Turno 2 · J. MELO maq. / I. BURGOS PILAR ayu.`
- Cambiar el día ajusta la pauta sola, y elegir una pauta ajusta el día.
  Con «Sin pauta» el planificador funciona como antes.

---

## Detalles que conviene saber

- **Números cortos.** `20202-20301-304-309-20220` se expande a 20202, 20301,
  20304, 20309 y 20220. Si un turno sigue en una segunda fila
  (`057-062-063-068`), el prefijo lo pone el último servicio del tramo anterior.
- **Los dos formatos de pauta.** Entre semana la planilla trae una columna en
  blanco entre MAQUINISTA y AYUDANTE; el fin de semana no. La app detecta cuál
  es y ubica las columnas sola.
- **Prácticas.** Las filas `PRACTICA` no son un turno aparte: el alumno se
  cuelga del turno anterior y aparece como parte de la tripulación.
- **La pauta no se corrige.** Si el OCR dejó una hora rara (`50:6`, `355`), se
  muestra tal cual está en la planilla. La corrección se hace en el Excel y se
  vuelve a cargar.
- **Al subir una versión nueva de la app**, sube también `sw.js` (va en la
  versión 8, que trae las pautas desde internet cada vez que hay señal).
