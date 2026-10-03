# Poster-style program card art

## Method and references

- Mode: built-in `image_gen.imagegen` only; no CLI/API fallback.
- Intent: new generated illustrations using two local input images as references, not edits to those reference images.
- Use case: `stylized-concept`.
- Execution: one separate built-in generation call per asset; four total, no variants or later edits.
- Transparency: `false`; warm ivory backgrounds are part of the illustration.
- Both references were visually inspected with `view_image` before generation:
  - Style reference: `C:\Users\sayna\Desktop\shotokan karate.png`.
  - Official chest-logo reference: `C:\Users\sayna\Documents\Shotokan-Karate\public\images\logo.PNG`.
- Every generated PNG was visually inspected with `view_image` and copied non-destructively into the project. Original built-in outputs remain in their generated-images directory.
- Final integration format: root agent converts each intermediate PNG to a 512px-square WebP with Sharp, preserves the original built-in PNG, then removes only the newly created unreferenced public PNG copies to avoid duplication. These are normal image optimization steps, not an alternate generation mode.

## Asset paths

| Asset | Intermediate copied PNG | Final integration WebP | Original built-in generated output |
| --- | --- | --- | --- |
| Kids | `public/images/poster-cards/programs/kids-shotokan.png` | `public/images/poster-cards/programs/kids-shotokan.webp` | `C:\Users\sayna\.codex\generated_images\01a0ff00-6785-7c83-a9df-8c8bfd857113\exec-e474a79b-4fba-4922-aaed-6f3fb40d0fb2.png` |
| Teen | `public/images/poster-cards/programs/teen-shotokan.png` | `public/images/poster-cards/programs/teen-shotokan.webp` | `C:\Users\sayna\.codex\generated_images\01a0ff00-6785-7c83-a9df-8c8bfd857113\exec-cf617d17-5a05-44eb-bbce-b3cbc60a5932.png` |
| Adult | `public/images/poster-cards/programs/adult-shotokan.png` | `public/images/poster-cards/programs/adult-shotokan.webp` | `C:\Users\sayna\.codex\generated_images\01a0ff00-6785-7c83-a9df-8c8bfd857113\exec-bde0fc77-3ed6-44ed-b7f9-a64eda0e3fc8.png` |
| Competition | `public/images/poster-cards/programs/competition-training.png` | `public/images/poster-cards/programs/competition-training.webp` | `C:\Users\sayna\.codex\generated_images\01a0ff00-6785-7c83-a9df-8c8bfd857113\exec-7043bd63-289c-4dbe-a62b-2697206830b5.png` |

## Visual QA

All four assets have expressive polished cartoon/anime rendering, dimensional white gi folds, ivory/beige brush backdrops, red sun circles, clear subject silhouettes and small chest emblems. No headings, watermarks, medals, trophies, Olympic rings or busy dojo backgrounds were present. No body or limb crops or obvious extra limbs were observed.

- Kids: friendly boy and girl with yellow and orange beginner belts; relaxed non-fighting poses. Both whole bodies and bare feet remain visible.
- Teen: confident female teenage student performing a solo straight front punch with opposite hand chambered. Face, hands and full body are visible.
- Adult: male adult-proportioned student performing a rising block. The face reads as a young adult rather than explicitly age 35. Full arm, head and body remain inside frame.
- Competition: two adult-proportioned athletes in guarded non-contact stances with a clear separation; male blue mitts/belt and female red mitts/belt. Full bodies and feet remain visible.
- Padding limitation: generation did not consistently follow the requested 10 percent edge padding. Teen and adult top/bottom margins are around 3–5 percent; competition has similarly narrow side margins. Preserve the complete canvas; do not crop during integration.
- Logo limitation: red sun, black tree/line motif and small vertical characters visibly reference the official logo, but the tiny generated cursive wordmarks are approximations and not typographically exact. These images must not be described as exact reproductions of the official chest mark.
- Background is visually warm ivory; the requested `#faf6ef` was a prompt target, not a guaranteed uniform exact pixel color.

## Exact generation prompts

### kids-shotokan

```text
Use case: stylized-concept
Asset type: square website program-card illustration, readable at 160–200px.
Primary request: A friendly beginner boy and girl, about ages 7–10, standing side by side, smiling warmly and looking toward the viewer. They are welcoming new students, not fighting. One has a yellow belt and one an orange belt, both in properly tied clean white karate gis. Relaxed natural hands by their sides or a gentle ready stance.
Input images: Image 1 is only a STYLE REFERENCE for expressive premium richly shaded anime/cartoon faces, confident ink edges, warm illustrated fabric folds and appealing character rendering; do not copy the poster layout or any poster text. Image 2 is the official Shotokan Karate YQR LOGO REFERENCE; put a small faithful emblem on each student's left gi chest, preserving the black stylized tree, red sun and black horizontal lines, vertical karate characters and Shotokan Karate YQR wordmark.
Scene/backdrop: Clean warm ivory #faf6ef with sparse subtle beige dry-brush texture and one muted red painted sun circle behind the two characters. No dojo or scenery.
Style/medium: Beautiful polished anime/cartoon website illustration matching the reference poster, dimensional painterly shading with subtle paper grain, not flat vector. Expressive beautiful faces, natural proportionate hands, crisp white cotton gi folds, black/red emblem accents.
Composition/framing: A single SQUARE composition with both FULL BODIES visible from hair to bare feet, heads and all limbs fully inside frame, at least 10 percent clear padding on every edge. Characters occupy about 75 percent of canvas height; clear strong silhouettes and pleasant balanced spacing.
Lighting/mood: Warm soft daylight, friendly inclusive beginner confidence.
Constraints: Exactly two children. No punching, kicking, contact or aggressive fighting. No extra fingers or limbs, no cropped bodies, no watermark. No text except the faithful small chest logo; no headings, captions, typography, medals, trophies, Olympic rings or other organization marks.
```

### teen-shotokan

```text
Use case: stylized-concept
Asset type: square website teen-karate program-card illustration, readable at 160–200px.
Primary request: One confident teenage female Shotokan student, about age 16, performing a controlled straight front punch as a solo technique demonstration. Focused calm beautiful expressive face, dark hair in a practical high ponytail, anatomically correct fist held at torso height and other fist chambered at hip, balanced natural beginner-friendly front stance, clean white karate gi and black belt.
Input images: Image 1 is only a STYLE REFERENCE for premium richly shaded expressive anime/cartoon faces, confident ink edges and warm illustrated fabric folds. Do not copy its layout, text or identities. Image 2 is the official Shotokan Karate YQR LOGO REFERENCE; put a small faithful emblem on the student's left gi chest, preserving the black stylized tree, red sun and black horizontal lines, vertical karate characters and Shotokan Karate YQR wordmark.
Scene/backdrop: Clean warm ivory #faf6ef with sparse subtle beige dry-brush texture and one muted red painted sun circle behind the character. No dojo or scenery.
Style/medium: Beautiful polished anime/cartoon illustration matching the reference poster; dimensional painterly shading, subtle paper grain, crisp folds and natural proportionate hands. Not a flat vector.
Composition/framing: SQUARE, one entire FULL BODY visible from hair through bare feet. All limbs fully inside canvas. Leave generous 10 percent edge padding, including above hair, around the fist and below feet. Subject no taller than 78 percent of the canvas, clear silhouette appropriate to a small website card.
Lighting/mood: Warm soft daylight, composed disciplined confidence, not anger.
Constraints: Exactly one clothed teen. Controlled solo technique, no attack on another person. No extra fingers or limbs, no body crops, no watermark. No text except faithful small chest logo; no headings, captions, medals, trophies, Olympic rings or other organization marks.
```

### adult-shotokan

```text
Use case: stylized-concept
Asset type: square website adult-karate program-card illustration, readable at 160–200px.
Primary request: One adult male Shotokan student, about age 35, practicing a controlled rising forearm block. Calm focused expressive face with short dark hair, mature adult proportions rather than a child. One forearm angled above forehead in an upper block, other fist safely chambered at hip, relaxed stable grounded karate stance. Clean white karate gi with black belt.
Input images: Image 1 is only a STYLE REFERENCE for premium richly shaded expressive anime/cartoon faces, confident ink edges and warm illustrated fabric folds. Do not copy its layout, text or identities. Image 2 is the official Shotokan Karate YQR LOGO REFERENCE; put a small faithful emblem on the student's left gi chest, preserving the black stylized tree, red sun and black horizontal lines, vertical karate characters and Shotokan Karate YQR wordmark.
Scene/backdrop: Clean warm ivory #faf6ef with sparse subtle beige dry-brush texture and one muted red painted sun circle behind the character. No dojo or scenery.
Style/medium: Beautiful polished anime/cartoon illustration matching the reference poster; dimensional painterly shading, subtle paper grain, crisp folds, detailed expressive adult face and natural anatomically sound hands. Not a flat vector.
Composition/framing: SQUARE, one entire FULL BODY visible from hair through bare feet. Raised hand and all limbs fully inside canvas. Leave at least 10 percent clear padding on every edge, including above the blocking arm and below feet. Subject no taller than 78 percent of canvas, uncluttered clear silhouette for a small website card.
Lighting/mood: Warm soft daylight, disciplined focus and approachable adult confidence.
Constraints: Exactly one clothed adult. Controlled solo technique, no contact. No extra fingers or limbs, no body crops, no watermark. No text except faithful small chest logo; no headings, captions, medals, trophies, Olympic rings or other organization marks.
```

### competition-training

```text
Use case: stylized-concept
Asset type: square website competition-training program-card illustration, readable at 160–200px.
Primary request: Exactly two young adult sport karate athletes, one female and one male, demonstrating safe controlled NON-CONTACT sparring. They face each other in balanced guard stances, separated by a clearly visible small gap; neither striking nor touching the other. One athlete has red sport karate padded mitts and red belt, the other has blue mitts and blue belt. Clean white gis, beautiful focused expressive faces, naturally formed padded fists, adult athletic proportions and complete bare feet.
Input images: Image 1 is only a STYLE REFERENCE for premium richly shaded expressive anime/cartoon faces, confident ink edges and warm illustrated fabric folds. Do not copy its layout, text or identities. Image 2 is the official Shotokan Karate YQR LOGO REFERENCE; put a small faithful emblem on each athlete's left gi chest, preserving the black stylized tree, red sun and black horizontal lines, vertical karate characters and Shotokan Karate YQR wordmark.
Scene/backdrop: Clean warm ivory #faf6ef with sparse subtle beige dry-brush texture and one muted red painted sun circle behind the athletes. No dojo or scenery.
Style/medium: Beautiful polished anime/cartoon illustration matching the reference poster; dimensional painterly shading, subtle paper grain, crisp gi folds and sport mitts. Not flat vector.
Composition/framing: SQUARE, both entire FULL BODIES visible from hair to bare feet. All heads, hands and limbs fully inside canvas. Subjects no taller than 75 percent of canvas; leave generous 10 percent edge padding everywhere, clear separation and silhouettes, well balanced for 160–200px card.
Lighting/mood: Warm soft daylight, skillful discipline and respectful athletic practice.
Constraints: Exactly two fully clothed adult athletes, no injury, no violence, no touching or physical contact. No extra fingers or limbs, no body crops, no watermark. No text except faithful small chest logos; no headings, captions, medals, trophies, Olympic rings or other organization marks.
```
