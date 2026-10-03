# Poster feature-card illustration manifest

Created 2026-10-02 for the Shotokan Karate website.

## Execution

- Mode: built-in `image_gen.imagegen` only; new generation with two reference images, not an edit of either reference.
- Four separate built-in calls, one per requested feature asset; no CLI, external SDK, or API key.
- `transparent_background: false`.
- Referenced images, inspected with `view_image` before generation:
  1. `C:\Users\sayna\Desktop\shotokan karate.png` — poster style reference only.
  2. `C:\Users\sayna\Documents\Shotokan-Karate\public\images\logo.PNG` — official small chest emblem reference only.
- Selected outputs copied into the workspace with `Copy-Item`; original generated files retained.
- Integration owner converts workspace intermediates to 512px WebP and removes only the new intermediate PNG copies after verification. Final consuming paths are listed below.

## Deliverables and visual inspection

| Slug | PNG intermediate | Final website asset |
| --- | --- | --- |
| professional-shotokan | public/images/poster-cards/features/professional-shotokan.png | public/images/poster-cards/features/professional-shotokan.webp |
| olympic-style-karate | public/images/poster-cards/features/olympic-style-karate.png | public/images/poster-cards/features/olympic-style-karate.webp |
| kata | public/images/poster-cards/features/kata.png | public/images/poster-cards/features/kata.webp |
| kumite | public/images/poster-cards/features/kumite.png | public/images/poster-cards/features/kumite.webp |

Every returned image was visually inspected. All are square, detailed shaded anime/cartoon illustrations in warm ivory/red, closely matching the supplied poster. Full heads, hands, feet, belt ends and limbs are visible. The generator used tighter perimeter padding than requested, especially around the professional-shotokan hair and kumite outer edges; use uncropped square/contain rendering.

- Professional Shotokan: one male in grounded traditional punch/front stance, correct readable limb count and chambered opposite fist.
- Olympic-style karate: one female teenage athlete in red-mitt guard; no Olympic symbols or affiliation claim. Red padded foot protection also generated.
- Kata: one female in controlled low-block/front stance with chambered opposite fist.
- Kumite: two students in blue/red equipment, with a controlled punch stopped short of the partner. No glove contact, impact, pain, or violent detail.

Logo fidelity is approximate, not a pixel-exact reproduction: the black pine/vertical-character/horizontal-stroke/red-circle structure is recognizable on every gi. Professional-shotokan and olympic-style-karate have approximately readable tiny Latin wordmarks; kata's tiny Latin inscription is distorted/illegible; both kumite emblems have stylized approximate micro-lettering. No unrelated brands, trophies, watermark, or large text were observed. At 160–200px card sizes the emblems function as tiny brand accents, not readable brand copy.

## Exact prompts and generated sources

### professional-shotokan

Generated original: `C:\Users\sayna\.codex\generated_images\01a0ff00-8871-7b40-a9be-6539fb04e918\exec-c2eb4bdd-64fb-45a2-81fc-1aa95c09d32a.png`

```text
Use case: stylized-concept
Asset type: square website feature-card illustration, readable at 160–200 px.
Primary request: create ONE polished premium anime/cartoon illustration for Professional Shotokan Karate. Generate new art, not a poster layout or collage.
Input images: Image 1 is the supplied Shotokan Karate Regina poster, a STYLE REFERENCE ONLY: match expressive dark eyes, rich ink outlines, detailed shaded white karate gi, natural warm skin, energetic but welcoming anime drawing, subtle paper-brush finish. Image 2 is the official Shotokan Karate YQR emblem, a BRAND DETAIL reference ONLY: use its black stylized pine canopy, stacked Japanese characters, black horizontal strokes crossing a red circle, and tiny Shotokan Karate YQR inscription as one small emblem on the subject's left chest; do not reproduce its black surrounding bars.
Scene/backdrop: clean warm ivory #faf6ef paper with very subtle beige dry-brush texture at edges and one softly textured muted red sun disk behind the subject. No buildings or scene clutter.
Subject: one confident young-adult male karate student with dark spiky hair, warm focused expression, white gi and black belt, performing a traditional front stance and straight punch. His front knee is bent and tracks over the front foot; rear leg extended, feet grounded; punching fist aligned with wrist, other fist correctly chambered at hip. Three-quarter view makes both arms and legs clear.
Style/medium: beautifully finished expressive anime/cartoon illustration matching Image 1; warm cel shading plus restrained painted fabric highlights; not a flat vector, not chibi, not photorealistic.
Composition/framing: square 1:1 canvas; full body and complete head, hands, feet and belt ends all visible with generous 8–12% perimeter padding; strong readable silhouette, centered; simple grounded shadow. The character occupies about 75% canvas height.
Lighting/mood: bright soft warm light, disciplined and inviting.
Constraints: sound human anatomy; exactly two arms and two legs, natural hands; official referenced chest emblem only; no large typography or extra text; no watermark; no trophies; no unrelated brands; no Olympic symbols; no cropped limbs; no violence or impact.
```

### olympic-style-karate

Generated original: `C:\Users\sayna\.codex\generated_images\01a0ff00-8871-7b40-a9be-6539fb04e918\exec-ac9d00c6-f341-436f-af54-a5a388919674.png`

```text
Use case: stylized-concept
Asset type: square website feature-card illustration, readable at 160–200 px.
Primary request: create ONE polished premium anime/cartoon illustration for Olympic-style sport karate training (sport technique only, no Olympic affiliation or symbols). Generate new art, not a poster layout or collage.
Input images: Image 1 is the supplied Shotokan Karate Regina poster, a STYLE REFERENCE ONLY: match expressive dark eyes, rich ink outlines, detailed shaded white karate gi, natural warm skin, energetic but welcoming anime drawing, subtle paper-brush finish. Image 2 is the official Shotokan Karate YQR emblem, a BRAND DETAIL reference ONLY: use its black stylized pine canopy, stacked Japanese characters, black horizontal strokes crossing a red circle, and tiny Shotokan Karate YQR inscription as one small emblem on the subject's left chest; do not reproduce its black surrounding bars.
Scene/backdrop: clean warm ivory #faf6ef paper with very subtle beige dry-brush texture at edges and one softly textured muted red sun disk behind the subject. No buildings or scene clutter.
Subject: one teenage female sport-karate athlete with dark high ponytail, bright focused expression, white gi, red belt and proper red padded karate mitts on both hands. In a poised ready guard, knees slightly bent, feet separated and grounded, elbows naturally bent, front glove forward and back glove protecting the upper body. No punch or kick. Athletic but modest natural proportions. Three-quarter view makes both arms and legs clear.
Style/medium: beautifully finished expressive anime/cartoon illustration matching Image 1; warm cel shading plus restrained painted fabric highlights; not a flat vector, not chibi, not photorealistic.
Composition/framing: square 1:1 canvas; full body and complete head, hands, feet and belt ends all visible with generous 12–15% perimeter padding; strong readable silhouette, centered; simple grounded shadow. The character occupies about 72% canvas height.
Lighting/mood: bright soft warm light, disciplined and inviting.
Constraints: sound human anatomy; exactly two arms and two legs, natural hands; official referenced chest emblem only; no large typography or extra text; no watermark; no trophies; no unrelated brands; no Olympic symbols; no cropped limbs; no violence or impact.
```

### kata

Generated original: `C:\Users\sayna\.codex\generated_images\01a0ff00-8871-7b40-a9be-6539fb04e918\exec-e1c762fc-2d4d-477c-9314-5886f729756e.png`

```text
Use case: stylized-concept
Asset type: square website feature-card illustration, readable at 160–200 px.
Primary request: create ONE polished premium anime/cartoon illustration for Kata, the traditional karate forms. Generate new art, not a poster layout or collage.
Input images: Image 1 is the supplied Shotokan Karate Regina poster, a STYLE REFERENCE ONLY: match expressive dark eyes, rich ink outlines, detailed shaded white karate gi, natural warm skin, energetic but welcoming anime drawing, subtle paper-brush finish. Image 2 is the official Shotokan Karate YQR emblem, a BRAND DETAIL reference ONLY: use its black stylized pine canopy, stacked Japanese characters, black horizontal strokes crossing a red circle, and tiny Shotokan Karate YQR inscription as one small emblem on the subject's left chest; do not reproduce its black surrounding bars.
Scene/backdrop: clean warm ivory #faf6ef paper with very subtle beige dry-brush texture at edges and one softly textured muted red sun disk behind the subject. No buildings or scene clutter.
Subject: one female karate student with dark hair tied neatly in a low ponytail, composed focused expression, white gi and black belt, performing a controlled traditional low block (gedan barai) in a front stance. Front knee bent and aligned with front foot; back leg straight with rear foot grounded. Front arm extends downward across the front thigh with a natural fist and wrist, other fist is correctly chambered at the hip. Strong disciplined pose rather than an attack. Three-quarter view makes both arms and legs clear.
Style/medium: beautifully finished expressive anime/cartoon illustration matching Image 1; warm cel shading plus restrained painted fabric highlights; not a flat vector, not chibi, not photorealistic.
Composition/framing: square 1:1 canvas; full body and complete head, hands, feet and belt ends all visible with generous 12–15% perimeter padding; strong readable silhouette, centered; simple grounded shadow. The character occupies about 72% canvas height.
Lighting/mood: bright soft warm light, disciplined and inviting.
Constraints: sound human anatomy; exactly two arms and two legs, natural hands; official referenced chest emblem only; no large typography or extra text; no watermark; no trophies; no unrelated brands; no Olympic symbols; no cropped limbs; no violence or impact.
```

### kumite

Generated original: `C:\Users\sayna\.codex\generated_images\01a0ff00-8871-7b40-a9be-6539fb04e918\exec-d1419cb3-76e9-43c3-807f-1b015bd7f550.png`

```text
Use case: stylized-concept
Asset type: square website feature-card illustration, readable at 160–200 px.
Primary request: create ONE polished premium anime/cartoon illustration for Kumite, controlled sport-karate sparring. Generate new art, not a poster layout or collage.
Input images: Image 1 is the supplied Shotokan Karate Regina poster, a STYLE REFERENCE ONLY: match expressive dark eyes, rich ink outlines, detailed shaded white karate gi, natural warm skin, energetic but welcoming anime drawing, subtle paper-brush finish. Image 2 is the official Shotokan Karate YQR emblem, a BRAND DETAIL reference ONLY: use its black stylized pine canopy, stacked Japanese characters, black horizontal strokes crossing a red circle, and tiny Shotokan Karate YQR inscription as one small emblem on each subject's left chest; do not reproduce its black surrounding bars.
Scene/backdrop: clean warm ivory #faf6ef paper with very subtle beige dry-brush texture at edges and one softly textured muted red sun disk behind the subject. No buildings or scene clutter.
Subject: exactly two young-adult sport-karate students facing each other in controlled noncontact sparring, one male with short dark hair wearing blue belt and padded blue mitts, one female with a dark ponytail wearing red belt and padded red mitts. Both in white gi with small official left-chest emblems. One controlled straight punch is stopped safely short of the other student's guarded upper torso; leave visible air between glove and partner, no contact. Both students alert and respectful, no pain or angry expression. Both have balanced grounded sport stances, natural bent elbows and wrists, four total arms and four total legs clearly legible.
Style/medium: beautifully finished expressive anime/cartoon illustration matching Image 1; warm cel shading plus restrained painted fabric highlights; not a flat vector, not chibi, not photorealistic.
Composition/framing: square 1:1 canvas; both full bodies and complete heads, hands, feet and belt ends visible with generous 12–15% perimeter padding; two clear silhouettes, centered with space between them; no overlap hiding limbs; simple grounded shadows. Each character occupies about 65% canvas height.
Lighting/mood: bright soft warm light, disciplined and inviting.
Constraints: sound human anatomy; exactly two people, each with two arms and two legs, natural hands; official referenced chest emblem only; no large typography or extra text; no watermark; no trophies; no unrelated brands; no Olympic symbols; no cropped limbs; no violence or impact.
```
