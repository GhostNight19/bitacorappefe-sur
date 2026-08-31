# Mi Gráfico

Botón **📅 Mi Gráfico**. Escribes tu apellido y aparece tu mes completo: el
número de turno de cada día. Al tocar el número se abre su horario.

---

## Cómo publicar el gráfico del mes

1. Deja el Excel del gráfico en la carpeta **`graficos_excel`**.
2. Ejecuta:

```bash
python convertir_grafico.py
```

3. Sube al repositorio **`grafico/grafico.json`**.

Es un archivo al mes, no uno al día. Se conservan las tres hojas del Excel: el
gráfico propiamente tal y los dos catálogos de horarios (`Lunes - Viernes` y
`S-D-F`).

---

## Qué muestra

Cada día del mes es una fila: el número del turno, la fecha y el día. Tocando
el número se despliega el horario completo tal como está en el catálogo —
servicios, apertura con su lugar, traslado, base de inicio, inicio de servicio,
base de término, traslado de vuelta y cierre con su lugar.

Arriba va tu pareja, tu rol y con quién andas: *"J. Mella · pareja 10 ·
Ayudante · con R. Mora"*, más el conteo del mes (turnos, descansos, y lo que
corresponda de vacaciones, cumpleaños, licencia, recibidor o práctica).

### Lo que puede decir una celda

| En el gráfico | Significa |
|---|---|
| `29` | turno 29 |
| *(vacía)* | descanso |
| `VAC` | vacaciones |
| `(41) VAC` | vacaciones, y el 41 es el turno que habría tocado |
| `(39) CUM` | cumpleaños |
| `LM` | licencia médica |
| `REC VALLE` | recibidor |
| `PRACTICA AM` / `PM` / `VALLE` | práctica |
| `83 (859-46)` | turno 83, con el detalle que trae el gráfico |

Los estados con número entre paréntesis igual dejan ver el horario de ese
turno, porque a veces interesa saber qué era lo que tocaba.

`PRACTICA AM`, `PRACTICA PM` y `PRACTICA VALLE` **no tienen horario** en el
catálogo del Excel (solo existe `PRACTICA SIMULADOR EZ`), así que esos días
avisan que no hay horario que mostrar. No es un error de lectura: no está en la
planilla.

---

## Turnos combinados

Un mismo número puede venir en dos filas del catálogo. En septiembre pasa con
el **68 del sábado**, que el propio Excel anota como *"combinado verticalmente
con la fila siguiente"*.

En esos casos la app toma la **apertura más temprana** y el **cierre más
tardío**, y muestra los dos tramos completos:

```
Turno combinado · 2 tramos      15:00 → 23:45      8:45 h

TRAMO 1 DE 2   20158-159-164            15:00 EZ → 20:30 EZ
TRAMO 2 DE 2   20165-170-171-CW V1/N    18:30 EZ → 23:45 EZ
```

Un cierre anterior a la apertura se entiende como del día siguiente: el turno
74 del sábado, 19:00 → 00:15, dura 5:15 y no queda en negativo.

---

## Qué catálogo usa cada día

Sábado usa el catálogo de sábado, domingo el de domingo y el resto el de lunes
a viernes. Si el número no está en el que corresponde, se busca en los otros
antes de rendirse — así el **viernes 18 de septiembre**, que es feriado y usa
turnos de la tabla de FERIADO, se resuelve solo.

---

## Detalles de lectura

- El gráfico viene en bloques de doce parejas y dos quincenas. El último bloque
  se titula **"PAREJA 49 · PRÁCTICAS"**, en singular, y agrupa a los
  practicantes y a quien está con licencia todo el mes; ahí no se muestra rol
  ni compañero, porque no son parejas de conducción.
- Un `59.` con punto sobrante se lee como el turno 59.
- En el gráfico los nombres van como `J. Mella` y en las pautas como
  `J. MELLA`. El buscador ignora mayúsculas, tildes y puntos, así que el mismo
  apellido sirve en los dos botones.
