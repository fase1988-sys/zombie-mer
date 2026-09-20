# Visual V4 asset review

Source: user supplied `mappps.png` (1536 × 1024). Rebuild crops with
`python tools/extract_visual_v4.py` from the project checkout beside `upload/`.
Generated images are derived crops; original labels and transparent padding are
removed using the largest connected alpha region. No painted repairs are made.

## USABLE (extracted)

- Vegetation: tree_01–04, tree_dead, bush_01–02, fern_01, flowers, stump.
- Buildings: cabin_01 (integrated only for matching single-floor, south-facing
  houses near camp; the remaining house variants require matching artwork).
- Vehicles: car_wreck_01.
- Characters: player idle, two walk frames, shoot, melee, flashlight; zombie
  idle, walk, attack, death. These source images are clean but viewed from the
  side/front. Active sprites are limited to the camp test zone, where their
  perspective and scale can be evaluated without changing gameplay hitboxes.
- Props: campfire, woodpile, bench, crate, barrel, military_box, shelf,
  sign_river, sign_stop, street_lamp, logs, rock_01–02.
- Terrain samples: forest, grass, mud, asphalt, rocky. These are **samples**,
  not seamless tiles; the test zone mirrors forest/asphalt tiles to reduce seams.

## REGENERATION REQUIRED

- fern_02, stick_pile, fence, sign variants and an independent road edge:
  overlapping artwork or no distinct, clean sprite in the source.
- True top-down directional frames for player and zombies. The provided side
  and front views cannot represent all aiming angles accurately; the extracted
  death frame remains unused until corpse rendering has a compatible lifecycle.
- leaves: the lower row image is fog/effect artwork, not a clean leaf terrain tile.
- grass, mud, rocky terrain require edge blending before they can replace the
  corresponding ground types outside the test zone.

## Integration boundaries

The camp decorations are visual only; they add no new collision. Trees use the
existing trunk obstacles. Visible trees, roofs and actors are sorted by their
ground Y coordinate. Camp decorations remain a background layer. Lighting
remains the existing game lighting pass.
