# Prevenciones (prueba)

Esta carpeta es la bitácora completa —con Mis Turnos y el planificador— más un
apartado nuevo: **⚠️ Prevenciones**, que lee el Boletín de Vía C y avisa la
prevención que se viene según dónde está el tren.

---

## Cómo publicar el boletín del día

Igual que las pautas, es un archivo y un comando:

1. Deja el Excel del boletín en la carpeta **`boletines_excel`**.
2. Ejecuta:

```bash
python convertir_boletin.py
```

3. Sube al repositorio **`prevenciones/boletin.json`**.

El script se queda solo con la parte útil: desde *NOTIFICACIÓN DE FAENAS EN EL
INICIO DEL RECORRIDO* hasta antes de *PROGRAMACIÓN DE CORTADAS*. Las cortadas
son trabajos con vía fuera de servicio, no prevenciones de circulación.

---

## Qué hace

**El aviso bajo el reloj.** Aparece solo cuando queda una prevención dentro de
**500 m** en el sentido de marcha. Muestra la distancia, la gravedad, la
restricción, la vía y el PK. Se pinta según la gravedad (rojo ≤15 km/h, naranjo
≤30, azul otras restricciones, gris los avisos de solo toque pito).

Va pegado al reloj: **al desplazar la pantalla los dos quedan a la vista**, la
franja siempre justo debajo. Su posición se calcula sola, porque el reloj no
mide lo mismo en el celular que en el computador.

El aviso pasa por tres momentos:

| Momento | Se ve | |
|---|---|---|
| Se acerca | `420 m` | cuenta hacia atrás desde los 500 m |
| Se está dentro | `EN ZONA` | la franja late |
| Ya se pasó | `◀ 170 m` | atenuada y con el borde punteado |

Después de **300 m** de haber salido de la zona, desaparece. Si en el intertanto
aparece otra prevención por delante, esa toma el lugar de inmediato: la que
quedó atrás nunca tapa a la que viene. El teléfono vibra al entrar una
prevención nueva, no al salir de una.

**El panel ⚠️ Prevenciones.** Dónde está el tren (línea, PK, sentido y vía), lo
que viene en los próximos 15 km, y el listado completo de lo vigente en L1 y L2.

---

## Cómo sabe dónde está y por qué vía va

El GPS entrega latitud y longitud. Esa coordenada se proyecta sobre el trazado
de la línea —una polilínea con su kilometraje, muestreada cada 500 m— y de ahí
sale el **PK**. Con dos posiciones seguidas se sabe si el PK sube o baja:

| Línea | Tramo y sentido | Vía |
|---|---|---|
| **L1** | Hualqui → El Arenal (PK creciente) | **VÍA 1** |
| **L1** | El Arenal → Hualqui (PK decreciente) | **VÍA 2** |
| **L1** | El Arenal → Mercado (PK 84 en adelante) | **VÍA 4** |
| **L2** | Concepción → Coronel (PK creciente) | **VÍA 1** |
| **L2** | Coronel → Concepción (PK decreciente) | **VÍA 2** |

Las prevenciones de *AMBAS VÍAS*, *TODAS*, *PRINCIPAL*, *PUENTE* y *CRUCE*
aplican siempre. Las de *VÍA 1* y *VÍA 2* se filtran por el sentido de marcha.
Las de *VÍA 4* aplican en los dos sentidos: es vía única entre El Arenal y
Mercado, y en Concepción es la de acceso al ramal a Coronel.

Mientras el tren está detenido y todavía no hay sentido definido, no se filtra
nada: se muestran todas.

---

## Qué se muestra y qué no

- **Solo lo vigente.** Tiene que estar dentro de su horario y de sus fechas. Las
  ventanas que cruzan medianoche (23:00 → 00:00) se entienden bien.
- **Lo más grave primero.** El orden es: ≤15 km/h → ≤30 km/h → otras
  restricciones (sin tráfico, bajada de pantógrafo, prohibición de maniobra) →
  solo toque pito. A igual gravedad, lo más cercano.
- **Patio, desvío, enlace y variante no tapan a la vía.** Se listan, pero bajan
  un escalón en el orden, para que un 10 km/h de patio no desplace un 30 km/h
  de la vía por la que se circula.
- **Siete prevenciones no se ubican en el mapa** y salen marcadas como *sin
  ubicación en el trazado*: las cuatro de **VARIANTE** (CC-LQ, BB-EZ, BB-LQ) y
  las tres de **INDUSTRIAS DERIVADAS**. Llevan su propio kilometraje: el km 3 de
  Industrias Derivadas no es el km 3 de L1. Se muestran en el listado, pero no
  generan aviso de proximidad.

---

## Modo prueba

Dentro del panel, **🧪 Modo prueba** permite fijar línea, PK y sentido a mano,
sin GPS y sin estar arriba del tren. Sirve para revisar que el boletín quedó
bien leído: pones L2, PK 15,90, sentido creciente, y tiene que salir el cruce
del PK 16 P. 15 a 15 km/h (pero solo entre 00:00 y 06:30, o después de 22:30,
que es su horario).

---

## Precisión, y qué no hay que esperar de esto

- El trazado está muestreado **cada 500 m**. El PK sale de interpolar entre esos
  puntos, así que tiene un margen del orden de la decena de metros en recta y
  algo más en curva. Para un aviso a 500 m sirve; no es un sistema de
  señalización.
- La **vía** se deduce del movimiento, no de la vía física: las dos vías van
  paralelas a pocos metros y el GPS no las distingue. Si el tren está detenido,
  se conserva el último sentido conocido.
- En **Concepción** L1 y L2 se tocan. Se mantiene la línea en la que se venía
  salvo que la otra quede claramente más cerca.
- El **poste** se lee como centésima de kilómetro: `27 P. 41` → PK 27,41. Es la
  convención del propio boletín (así, el 27 P. 41 de Coronel cae justo en la
  estación, PK 27,43).

**Esto es una ayuda de conducción. El Boletín de Vía C sigue siendo el documento
válido.**
