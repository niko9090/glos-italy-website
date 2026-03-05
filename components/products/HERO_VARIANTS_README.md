# Varianti Hero Pagina Prodotti

Tre proposte di sfondo per la pagina prodotti, ispirate all'effetto della homepage.

---

## Variante 1: Due Immagini Fuse (Stile Homepage)
**File:** `ProductsHeroVariant1.tsx`

**Descrizione:**
Replica lo stesso effetto della homepage con due immagini affiancate che si fondono al centro.

**Caratteristiche:**
- Immagine sinistra: `hero-blue-texture-left.jpg` (texture vernice scura)
- Immagine destra: `hero-blue-texture-right.jpg` (vernice fluida)
- Fusione centrale con gradiente trasparente
- Particelle circolari animate che fluttuano
- Linea decorativa animata in basso
- Overlay scuro per leggibilità

**Effetto:** Elegante, coerente con homepage, professionale.

---

## Variante 2: Pattern Geometrico con Mesh Gradient
**File:** `ProductsHeroVariant2.tsx`

**Descrizione:**
Look più tecnico/industriale con griglia geometrica e sfere di colore animate.

**Caratteristiche:**
- Sfondo gradiente blu scuro
- Immagine `hero-fluid-art.jpg` con mix-blend-overlay
- Pattern griglia SVG sovrapposto (stile blueprint tecnico)
- 3 sfere gradient (mesh gradient) che pulsano e si muovono
- Linee diagonali animate che attraversano lo schermo
- Glow cyan/blue sul titolo

**Effetto:** Moderno, tech, dinamico.

---

## Variante 3: Split Diagonale con Particelle Metalliche
**File:** `ProductsHeroVariant3.tsx`

**Descrizione:**
Due immagini divise da una linea diagonale con particelle metalliche fluttuanti.

**Caratteristiche:**
- Immagine sinistra: `hero-marble-gold.jpg` (texture marmo/oro)
- Immagine destra: `hero-fluid-art.jpg` (arte fluida)
- Divisione diagonale con linea luminosa pulsante
- 12 particelle metalliche (bianche, blu, dorate) che fluttuano
- Riflessi luminosi che si muovono lentamente
- Badge "Catalogo Completo" con effetto glassmorphism
- Indicatori decorativi sotto il sottotitolo
- Border animato multicolore in basso

**Effetto:** Premium, artistico, accattivante.

---

## Come Testare

Per provare una variante, sostituisci la sezione Hero in `ProductsPageClient.tsx` (righe 198-231) con l'import del componente desiderato:

```tsx
// In cima al file, aggiungi:
import ProductsHeroVariant1 from '@/components/products/ProductsHeroVariant1'

// Poi sostituisci la sezione Hero con:
<ProductsHeroVariant1 />
```

---

## Suggerimento

Le varianti usano le stesse immagini già presenti nel progetto:
- `/images/hero-blue-texture-left.jpg`
- `/images/hero-blue-texture-right.jpg`
- `/images/hero-fluid-art.jpg`
- `/images/hero-marble-gold.jpg`

Se vuoi immagini diverse (es. macchinari, prodotti), possiamo adattare facilmente le varianti.
