---
name: Garino Hnos. S.A.
description: A century-old Montevideo print house, set as a press sheet; navy ground, crop marks, tint wedge.
colors:
  navy: "#002b5c"
  blue: "#0065a4"
  slate: "#536283"
  mist: "#c6cbd6"
  ink: "#555555"
  white: "#ffffff"
  paper: "#f4f5f8"
  on-navy: "#e0e6ee"
typography:
  display:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(2.3rem, 5vw, 4.5rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.9rem, 4.6vw, 3.9rem)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 2vw, 1.6rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  statement:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "clamp(1.55rem, 3.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.22
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Arial, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  none: "0px"
  sharp: "2px"
spacing:
  gutter: "clamp(20px, 5vw, 88px)"
  section: "clamp(96px, 13vw, 190px)"
  header: "84px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.sharp}"
    padding: "14px 22px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.navy}"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    rounded: "{rounded.sharp}"
    padding: "14px 22px"
  button-light-hover:
    backgroundColor: "{colors.mist}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    rounded: "{rounded.sharp}"
    padding: "14px 22px"
  button-ghost-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
  division-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.navy}"
  division-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
---

# Design System: Garino Hnos. S.A.

## Overview

**Creative North Star: "The Press Sheet"**

The site is a printed sheet on the proofing table. A print house proves its precision with the marks printers use to prove alignment, so crop marks, a registration target and a tint-step wedge carry the identity instead of imagery, gradients or feature cards. Navy fields own whole regions; white and pale paper sheets alternate with them. The result is calm, exact and institutional, with scale supplied by very large, tightly set Montserrat.

Density is generous: sections breathe at 96-190px, content sits in a 1480px column, and structure comes from hairline rules and typographic lists rather than boxes. Motion follows print logic (words lift into place, a sheet slides sideways, a target turns with scroll) and is entirely removable.

**Key Characteristics:**
- Five-colour palette on white, nothing else; tints come from opacity or `color-mix`.
- Crop marks at section corners and the tint wedge are the signature; the page is recognisable with content removed.
- Montserrat 800 display set tight, 400-500 body.
- Flat: no shadows, no radii beyond 2px.
- Hairline rules and lists replace cards.

## Colors

A restrained press palette: one deep ground, one working blue, two cool greys, one text grey, on white.

### Primary
- **Press Navy** (#002b5c): ground field of hero, hscroll panels and closing; heading colour on white; button hover.
- **Proof Blue** (#0065a4): the single action colour: primary button, links in body rows, focus ring, progress bar, nav underline, text selection.

### Secondary
- **Slate Ink** (#536283): tint-wedge step; hairline rules on white sheets at 30-35% opacity.

### Neutral
- **Mist** (#c6cbd6): wedge step, hover fill for light surfaces, header rule (mixed 70% with white), unrevealed statement words.
- **Body Grey** (#555555): body text on white; sixth wedge step.
- **Paper** (#f4f5f8, Mist 22% over white): pale sheet and the graphic-division panel.
- **On-Navy Tint** (#e0e6ee, white 88% over navy): paragraph text on navy.
- **White** (#ffffff): page ground, text on navy.

### Named Rules
**The Five-Ink Rule.** Only the five palette inks plus white. Any other tone must be a mix or opacity of those, never a new hue.

**The One Action Rule.** Proof Blue marks what can be acted on or what is progress. It is not used as decoration.

## Typography

**Display Font:** Montserrat variable, self-hosted, weights 100-900 (fallback system-ui, Segoe UI, Arial, sans-serif)
**Body Font:** Montserrat, same file.

**Character:** One geometric family does everything. Authority comes from weight and tight tracking at size, not from a second face.

### Hierarchy
- **Display** (800, clamp 2.3-4.5rem, 1.04, -0.03em): h1, hero, max 12ch.
- **Headline** (800, clamp 1.9-3.9rem, 1.04, -0.03em): h2 and closing; panel and division h2 step down to 1.8-3.6rem.
- **Statement** (700, clamp 1.55-3rem, 1.22): the single large paragraph; words shift from Mist to Navy with scroll.
- **Title** (700, clamp 1.25-1.6rem, 1.2): h3, list-row headings, spec headings.
- **Body** (400, 17px, 1.65, max 66ch): paragraphs; lead paragraph is 500 at clamp 1.1-1.4rem, max 44ch.
- **Label** (700, 0.78-0.85rem, 0.06-0.08em, uppercase): nav, buttons, CTAs, footer headings. Used for controls, never as a lead-in above headings.

### Named Rules
**The Tight Heavy Rule.** Display sizes are 800 with negative tracking; body never goes below 400.

## Layout

A single wrap of max 1480px with a fluid gutter (20-88px). Vertical rhythm is the section token (96-190px). Pages are stacked full-width sheets alternating navy, white and paper. Intro uses a 5/7 two-column grid; list rows use 4/7; specs and footer use equal columns. Below 960px grids collapse to one column (footer to two, then one at 600px); below 860px the nav becomes a full-screen navy drawer and the horizontal scroll collapses to stacked panels. The header is sticky, 84px (68px on mobile), white with a Mist hairline.

The hero is full-height (100svh minus header) with content anchored to the bottom. The hscroll section pins and moves a track of panels sideways on desktop only, with a 3px progress bar; reduced-motion users get the stacked version.

## Elevation & Depth

Flat. Depth is conveyed by tonal sheet changes (navy against white against paper), 1px hairline rules, and corner marks. There are no drop shadows. The only inset shadow is a hairline around the navy wedge step so it stays visible on navy.

### Named Rules
**The Flat Sheet Rule.** A printed sheet has no elevation. Separate with ground colour or a 1px rule, never a shadow.

## Shapes

Rectilinear. Buttons carry a 2px corner; everything else is square. Panels are outlined in 1px at 28% of current colour. The recurring geometry is: four L-shaped crop marks (26px arms, 1px) inset 14-30px from a sheet edge, a six-step wedge (12px tall, max 420px wide: white, mist, slate, blue, navy, ink), and the registration target (circle, inner circle, four ticks, 1.5px stroke, 56px; it rotates with scroll). Icons are a single square-capped 2px arrow drawn as inline SVG.

## Components

### Buttons
- **Shape:** 2px corner, 2px border in the fill colour.
- **Primary:** Proof Blue fill, white uppercase label 700 0.82rem, padding 14px 22px (10px 16px in header); arrow icon after text.
- **Hover / Focus:** fill and border go Press Navy in 0.3s; arrow shifts 4px right. Focus is a 3px Proof Blue outline with 3px offset (white on navy).
- **Light:** white fill, navy text; hover Mist. For use on navy.
- **Ghost:** transparent, white text, white 55% border; hover inverts to white fill.

### Navigation
Uppercase 700 0.78rem label in navy, 0.07em tracking. Hover and current page draw a 2px Proof Blue underline scaling from the left (0.4s). Consultar CFE is a primary button inside the nav. Mobile: hamburger of three 2px bars becoming a cross, opening a navy drawer with large white links separated by hairlines.

### Doors and Divisions
Large plain links with an arrow: hero doors are 800 type at clamp 1.1-1.75rem between hairlines (white 40%), arrow moves 8px on hover. Divisions are two half-width blocks, paper and navy, with a h2, intro, a hairline list of real service names, and a CTA; hover shifts ground to Mist or Proof Blue.

### Rows and Lists
Typographic lists in place of cards: top hairline per item (Slate 35%, white 28% on navy), 4/7 grid of title and text, links in Proof Blue bold.

### Hscroll Panels
Outlined, unfilled panels (1px, 28% current colour), 28-56px padding, alternating widths (78vw, 70vw, 86vw; max 860/720/940px), a registration target at the section's corner.

### Crop-mark Frame and Wedge
Applied to every sheet via a `marks` overlay (white-ish on navy, navy 42% on white). A wedge appears under the hero lead and above the statement as a section divider.

## Do's and Don'ts

### Do:
- **Do** open each major region with a full sheet: navy, white or paper, with crop marks at its corners.
- **Do** keep colour to Press Navy, Proof Blue, Slate Ink, Mist, Body Grey on white.
- **Do** build structure with 1px hairlines and typographic lists.
- **Do** set headlines in Montserrat 800 with negative tracking; keep body at 17px, 1.65, max 66ch.
- **Do** keep every animation optional: content is fully visible with no JS or with reduced motion.
- **Do** use Proof Blue only for actionable or progress elements.

### Don't:
- **Don't** add gradients, drop shadows, or rounded cards.
- **Don't** introduce a second typeface or a sixth hue.
- **Don't** replace the arrow SVG with glyph characters or an icon font.
- **Don't** add decorative lead-in labels above headings; labels are for controls and footer headings.
- **Don't** apply crop marks and the registration target to small components; they belong to sheet scale.
