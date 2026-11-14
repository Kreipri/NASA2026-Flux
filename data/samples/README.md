# Data Samples (real NASA data, archived snapshots)

Fetched 2026-11-14 for development and as offline fallback. **These are archived snapshots. Never present them as live.**

| File | Source | Query |
|---|---|---|
| `donki_FLR_2024-05-08_to_12.json` | NASA CCMC DONKI (M2M-SWAO) | `/DONKI-API/get/FLR?startDate=2024-05-08&endDate=2024-05-12` |
| `donki_SEP_2024-05-08_to_14.json` | NASA CCMC DONKI | `/get/SEP?startDate=2024-05-08&endDate=2024-05-14` |
| `donki_GST_2024-05-08_to_14.json` | NASA CCMC DONKI | `/get/GST?startDate=2024-05-08&endDate=2024-05-14` |
| `donki_CME_2024-05-08_to_11.json` | NASA CCMC DONKI | `/get/CME?startDate=2024-05-08&endDate=2024-05-11` |
| `radlab_CRaTER_LRO_2024-05-08_to_14.json` | NASA OSDR RadLab, CRaTER instrument on LRO | `celestial_body=Moon`, timestamps 2024-05-08 to 2024-05-15, `absorbed_dose_rate` (uGy/hour) |

The event all of these cover is the **May 2024 solar storm**. DONKI base URL: `https://ccmc.gsfc.nasa.gov/DONKI-API`. RadLab base URL: `https://visualization.osdr.nasa.gov/radlab/api/`.

Attribution to show in-game: "Space weather data: NASA CCMC DONKI / Moon-to-Mars Space Weather Analysis Office" and "Radiation data: NASA OSDR RadLab (CRaTER, Lunar Reconnaissance Orbiter)".
DONKI says its data is "prototyping quality" and provided as is.
