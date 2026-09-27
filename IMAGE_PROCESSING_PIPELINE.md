# CLUB ART DU DÉPLACEMENT PARKOUR ORAN — IMAGE ASSET & PROCESSING PIPELINE

## 1. Executive Summary & Inventory
This document establishes the architecture, inventory, and enhancement workflow for the real photography archives of **Club Art Du Déplacement Parkour Oran** (`public/images/lastseason`).

### Baseline Statistics
- **Total Files Scanned**: 37 photographs
- **Exact Duplicate Copies Identified**: 10 files (SHA-256 match)
- **Unique Authentic Club Photographs Retained**: 27 photographs
- **Duplicates Safe Archive**: `public/images/lastseason/archive_duplicates/` (no originals were deleted or destroyed).

---

## 2. Duplicate Detection & Safe Archive Protocol
Duplicates were identified using cryptographic **SHA-256 hashing** and binary SOF segment dimension extraction. 10 files bearing the pattern `* (1).jpg` were bit-for-bit identical copies of their base numbered files:
- `5893075819293249589 (1).jpg` → Copy of `...589.jpg`
- `5893075819293249590 (1).jpg` → Copy of `...590.jpg`
- `5893075819293249591 (1).jpg` → Copy of `...591.jpg`
- `5893075819293249592 (1).jpg` → Copy of `...592.jpg`
- `5893075819293249593 (1).jpg` → Copy of `...593.jpg`
- `5893075819293249594 (1).jpg` → Copy of `...594.jpg`
- `5893075819293249595 (1).jpg` → Copy of `...595.jpg`
- `5893075819293249596 (1).jpg` → Copy of `...596.jpg`
- `5893075819293249597 (1).jpg` → Copy of `...597.jpg`
- `5893075819293249598 (1).jpg` → Copy of `...598.jpg`

All 10 copies were safely moved to `public/images/lastseason/archive_duplicates/` to keep production assets clean without data loss.

---

## 3. Comprehensive Inventory of Unique Production Assets

| Filename | Resolution | Orientation | Subject Matter | Quality & Sharpness | Site Placement |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `5893075819293249614.jpg` | 1280x960 | Landscape | Full club team, coaches in official yellow ADD t-shirts & youth athletes holding medals | Sharp, balanced lighting | **Last Season Hero Featured Banner** |
| `5893075819293249613.jpg` | 1280x960 | Landscape | Coaches and youth gold medalist celebration selfie | High sharpness, authentic joy | **Last Season Editorial Highlight** |
| `5893075819293249615.jpg` | 1280x960 | Landscape | Alternate wide angle of team in gymnasium | Good exposure, wide view | **Last Season Gallery** |
| `5893075819293249589.jpg` | 960x1280 | Portrait | Vault on inclined mat by athlete in "Parkour Oran Academy" shirt | Good sharpness, dynamic motion | **Last Season Editorial Highlight** |
| `5893075819293249590.jpg` | 960x1280 | Portrait | Angled wall vaulting technique | Slight motion blur (authentic action) | **Gallery / Thumbnail** |
| `5893075819293249591.jpg` | 960x1280 | Portrait | Female youth athlete leaping over obstacle | Dynamic flight, slight motion blur | **Gallery / Thumbnail** |
| `5893075819293249592.jpg` | 960x1280 | Portrait | Hand placement & vault push-off | Sharp, athletic coordination | **Gallery** |
| `5893075819293249593.jpg` | 960x1280 | Portrait | Young child standing on wooden box coached by instructor | Sharp, tender mentorship | **Gallery** |
| `5893075819293249594.jpg` | 960x1280 | Portrait | Speed vault over vaulting horse with spectators in background | Sharp action moment | **Gallery** |
| `5893075819293249595.jpg` | 960x1280 | Portrait | Youth leap over gymnastic balance beam | Crisp flight, vibrant yellow shirts | **Last Season Editorial Highlight** |
| `5893075819293249596.jpg` | 960x1280 | Portrait | Hanging bar grip test | Sharp, high focus on face | **Gallery** |
| `5893075819293249597.jpg` | 960x1280 | Portrait | Low balance dismount | High action blur | **Gallery** |
| `5893075819293249598.jpg` | 960x1280 | Portrait | Springboard to high bar transition | High energy, coach spotted | **Gallery** |
| `5893075819293249599.jpg` | 960x1280 | Portrait | Textbook Cat Pass (Saut de chat) over wooden box | Excellent sharpness, clean form | **Last Season Editorial Highlight** |
| `5893075819293249600.jpg` | 960x1280 | Portrait | Vault initiation phase onto obstacle box | High sharpness | **Gallery** |
| `5893075819293249601.jpg` | 960x1280 | Portrait | Diving extension toward mat | Dynamic perspective | **Gallery** |
| `5893075819293249602.jpg` | 960x1280 | Portrait | Trajectory drill on safety matting | Sharp background, action focus | **Gallery** |
| `5893075819293249603.jpg` | 960x1280 | Portrait | Diver leap over red Gymnova block | High contrast, bright colors | **Gallery** |
| `5893075819293249604.jpg` | 960x1280 | Portrait | High horizontal bar jury performance assessment | Clear narrative, official sheets | **Last Season Editorial Highlight** |
| `5893075819293249605.jpg` | 960x1280 | Portrait | Cat pass execution on elevated apparatus | Sharp, athletic form | **Gallery** |
| `5893075819293249606.jpg` | 960x1280 | Portrait | Landing technique on shock matting | Safe progression | **Gallery** |
| `5893075819293249607.jpg` | 960x1280 | Portrait | Postural alignment check on balance beam | Pedagogy in action | **Gallery** |
| `5893075819293249608.jpg` | 960x1280 | Portrait | Leap to high bar with active coach spotting | Trust & safety in action | **Gallery** |
| `5893075819293249609.jpg` | 960x1280 | Portrait | Head coach instructing youth on vault with families watching | Expressive, community atmosphere | **Registration Background / Highlight** |
| `5893075819293249610.jpg` | 960x1280 | Portrait | Coach providing individual feedback with evaluation sheet | Professional pedagogy | **Gallery** |
| `5893075819293249611.jpg` | 960x1280 | Portrait | Two coaches coordinating grading criteria | Authentic staff interaction | **Gallery** |
| `5893075819293249612.jpg` | 960x1280 | Portrait | Training workshop setup & safety bar adjustment | Facility preparation | **Gallery** |

---

## 4. Enhancement Rules & Gemini AI Policy
Gemini API was verified during project audit (`GEMINI_API_KEY` is currently not set in local environment). In accordance with the prompt guidelines:
- **No artificial API keys or fabricated enhancements are introduced.**
- The application uses original authentic assets directly, with non-destructive CSS/Next.js optimizations (progressive blur placeholder, lazy loading, responsive srcset).

### Conservative Enhancement Parameters (For Gemini / Image Pipeline)
When credentials are configured:
1. **Allowed**: Denoising, mild exposure correction, chromatic aberration removal, sharpening of unblurred areas, slight contrast curve boost.
2. **Strictly Prohibited**:
   - Fabricating people's faces or identities.
   - Inventing limbs, clothing, or athletic equipment.
   - Adding fake spectators, sponsor logos, or artificial backgrounds.
   - Modifying authentic sporting maneuvers or medals.

---

## 5. Long-Term Architectural System (Replacing Next Season)
Next season (`2026 / 2027`) can be seamlessly configured in `src/lib/images.ts` by updating `SEASON_2025_2026` to `SEASON_2026_2027` without modifying any UI components or markup.
