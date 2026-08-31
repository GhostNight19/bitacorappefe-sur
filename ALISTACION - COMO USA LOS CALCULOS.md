# Mi Alistación · cómo calcula

Botón **🕒 Mi Alistación**. Registro diario de horas trabajadas, comparado con
el turno que manda el gráfico, con el desglose de horas extra y descarga en PDF.

Todo se calcula en **minutos enteros**.

```
Jornada real  = cierre real − apertura real

Horas extra   = feriado trabajado
              + exceso sobre 7:30
              + tiempo fuera del turno  (solo si no hubo exceso)
              + descanso semanal afectado
```

**Los mismos minutos no se pagan dos veces.** Si la jornada ya pasó de 7:30, ese
exceso es la medida del sobretiempo y `Hrs Turno` queda en cero.

**Nocturnas, menor reposo y manejo van aparte**: son conceptos contractuales
distintos y no suman al total de horas extra.

---

## 1. Día operativo y cruce de medianoche

El turno queda registrado en el día en que se **abrió**, aunque cierre después
de las 00:00. La jornada no puede pasar de 24 horas.

> Apertura 8 de julio 16:45 · cierre 9 de julio 01:35
> → día operativo **8 de julio**, duración **8:50**

## 2. Tiempo fuera del turno · «Hrs Turno»

```
Tiempo fuera = duración real − traslape entre el turno real y el programado
```

| Caso | Situación | Resultado |
|---|---|---|
| A | Sale después | cierre real − cierre programado |
| B | Entra antes | apertura programada − apertura real |
| C | Entra antes y sale después | los dos extremos |
| D | Turno completamente separado | la duración completa |

La referencia es la **pauta del día** si está publicada; si no, el horario del
turno según el gráfico. Un cambio voluntario entre compañeros no genera
sobretiempo por sí solo: la referencia pasa a ser el turno nuevo.

## 3. Exceso sobre 7:30

```
Exceso = máximo(jornada real − 450 min, 0)
```

Cuando hay exceso, el exceso **manda**: cerrar 1:20 tarde en una jornada de 8:50
son **1:20**, no 2:40. Son los mismos minutos mirados de dos formas.

`Hrs Turno` entra cuando se trabajó fuera de la ventana programada **sin** pasar
de 7:30 — por ejemplo un turno completamente distinto al que mandaba el gráfico
(caso D): ahí la jornada completa es tiempo fuera de turno.

Comprobado contra la alistación real de agosto:

| Día | Jornada | Exceso | Fuera de turno | Hrs Extras | Hrs Turno | El Excel dice |
|---|---|---|---|---|---|---|
| 8  | 8:50  | 1:20 | 1:20 | 1:20 | 0:00 | 1,33 |
| 15 | 7:40  | 0:10 | 0:25 | 0:10 | 0:00 | 0,17 |
| 24 | 12:45 | 5:15 | 0:25 | 5:15 | 0:00 | 5,25 |
| 29 | 9:45  | 2:15 | 2:15 | 2:15 | 0:00 | 2,25 |
| 30 | 9:25  | 1:55 | 0:00 | 1:55 | 0:00 | 1,92 |

Total de la columna: **16,09**, y `Hrs Turno` del mes en **0,00**, igual que el
Excel.

## 4. Descanso semanal afectado

Se activa cuando el día siguiente es descanso y el turno cruza las 00:00:

```
Descanso afectado = cierre real − 00:00
```

## 5. Feriado

Si el día es feriado, **feriado trabajado = jornada real completa**, y absorbe
la apertura anticipada, el cierre tardío, el turno fuera de rango y el exceso
sobre 7:30, para no contar dos veces el mismo trabajo.

Siguen calculándose aparte: descanso semanal afectado, menor reposo, nocturnas
y manejo.

El feriado se detecta solo cuando el gráfico resuelve ese día con la tabla de
FERIADO (así pasa con el 18 de septiembre), y se puede marcar a mano.

## 6. Menor reposo

```
Reposo real  = apertura actual − cierre anterior
Menor reposo = máximo(mínimo − reposo real, 0)
```

El mínimo es **11:30** cuando el cierre anterior y la apertura siguiente son en
EZ o El Arenal, y **10:00** en los demás pares de residencias.

## 7. Horas nocturnas

Solo los minutos efectivos entre **23:00 y 07:00**, y sobre la ventana
**presentación → término efectivo del maestro**, no sobre la apertura y el
cierre administrativos. El traslado final queda fuera.

> Turno 36: presentación 18:05, término efectivo 00:05, cierre 01:35
> → nocturnas **1:05** (los 90 min entre 00:05 y 01:35 son cierre, no nocturnas)

Un cierre tardío **no** aumenta las nocturnas por sí solo.

## 8. Horas de manejo

Solo corresponden a maquinistas. La regla es: bloques separados por descansos
de más de 60 minutos, máximo 5 horas por bloque, y el exceso es hora extra de
manejo.

**Esto la app no lo calcula solo**, porque el gráfico no trae la hora de inicio
y término de cada servicio por separado, que es lo que se necesita para armar
los bloques. Queda como un campo en minutos que se escribe a mano, y en cero
para los ayudantes.

---

## La diferencia con el Excel anterior

El resumen mensual dejaba el feriado fuera de las columnas «H. Extra» y
«H. Turno», y aparecía solo en la justificación:

```
Total real guardado:                 22:25
Visible en H. Extra + H. Turno:      16:55
Feriado que faltaba como columna:     5:30
```

Aquí el feriado tiene **columna propia** (`Hrs Feriado`), y el total del mes es
`Hrs Extras + Hrs Turno + Hrs Feriado`. Así el desglose suma lo mismo que el
total.

Las dos columnas quedan repartidas como corresponde:

- **Hrs Extras** = exceso sobre 7:30 + descanso semanal afectado
- **Hrs Turno** = tiempo fuera de la ventana programada, solo cuando no hubo
  exceso sobre 7:30 (si lo hubo, esos minutos ya están en Hrs Extras)
- **Hrs Feriado** = jornada completa del feriado

---

## Cómo se usa

1. Escribe tu apellido y elige el mes.
2. **✨ Prellenar del gráfico** copia el horario programado a todos los días que
   estén en blanco. Lo ya escrito no se toca.
3. Toca cualquier día y corrige el **ingreso** y el **término** reales. Se guarda
   al momento. Vale para todos los días, también los de descanso: si un día se
   abrió o cerró distinto a la pauta por algo extraordinario, se escribe y listo.
4. **📄 Descargar PDF** entrega la planilla del mes en horizontal, con el
   desglose por día, la fila de totales y el turno del gráfico en cada línea.

---

## Todo cierre tardío lleva justificación

Si el término real es **posterior** al programado, ese día **exige una
explicación**. Mientras falte:

- la tarjeta queda con borde rojo y la marca **⚠ falta justificación**;
- el campo pasa a llamarse **Justificación (obligatoria)** y avisa cuánto fue el
  atraso y contra qué hora;
- arriba del mes sale la lista de los días pendientes;
- al descargar el PDF se pide confirmación.

En el PDF la justificación viaja siempre, con la magnitud del atraso al lado:

```
EXCEDE POR ATRASO, RIEL QUEBRADO (CIERRE +1:20)
```

Y si no se escribió nada, el día sale marcado en rojo:

```
SIN JUSTIFICAR (CIERRE +1:20)
```

La **apertura anticipada** también se muestra en la tarjeta (`Apertura −40 min`),
pero no obliga a justificar: la exigencia es solo para el cierre tardío.

La referencia de cada día sale de la **pauta diaria** cuando está publicada, y
del gráfico cuando no. Por eso conviene ir subiendo la pauta cada día: es lo que
permite comparar contra lo que realmente se programó.

---

## Dónde se guarda

En **este teléfono**, en el navegador con que abras el link. No viaja al
repositorio ni a ningún servidor.

- No aparece en otro teléfono ni en el computador.
- Se pierde si borras los datos del sitio o desinstalas la app.
- **Descarga el PDF con frecuencia**: es el único respaldo.
