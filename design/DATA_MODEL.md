# Data Model — SOURCE Product Data Platform

---

## 1. Canonical product model (`mart.products`)

Every supplier feed is normalized into this one schema — the contract consuming systems rely on.

| Field | Type | Req | Notes |
|---|---|:--:|---|
| `sku` | string | ✓ | SOURCE internal key, `SRC-<SUPPLIER>-<aid>` |
| `supplier_sku` | string | ✓ | Supplier's own article id |
| `ean` | string | | EAN-13, checksum-validated |
| `name` | string | ✓ | Product name |
| `manufacturer` | string | | Brand (senator, REFLECTS, Halfar, Stedman …) |
| `category` | string | | SOURCE taxonomy; empty ⇒ flagged unmapped |
| `material` | string | | Primary material |
| `colors` | string[] | | Colour variants |
| `price_from_eur` | number | ✓ | Cheapest scale price in EUR |
| `price_tiers` | array | ✓ | `[{qty, eur}]` ascending — quantity scale pricing |
| `min_order_qty` | int | ✓ | Minimum order quantity |
| `print_methods` | string[] | | Decoration (Tampondruck, Lasergravur, Siebdruck …) |
| `print_area` | string | | Max print dimensions |
| `weight_kg` | number | | Normalized to kg |
| `eco` | bool | | Sustainable flag (RPET, Organic, recycelt …) |
| `image_url` | string | | https + image file |
| `stock_qty` | int | ✓ | Available stock |
| `lead_time_days` | int | | Production / delivery lead time |
| `description` | string | | Marketing copy |

Promotional-specific fields (`price_tiers`, `min_order_qty`, `print_methods`, `print_area`, `eco`)
are first-class — generic product schemas miss exactly what matters for SOURCE's business.

---

## 2. Medallion layers

| Layer | Table(s) | Grain | Retention |
|---|---|---|---|
| raw | `raw.<supplier>` | one row per source record, per run | append-only, TTL 90d |
| staging | `staging.products_<supplier>` | normalized record | rebuilt per run |
| quality | `quality.findings`, `quality.supplier_scores` | one row per finding / per supplier·run | kept (trend) |
| mart | `mart.products` | one row per published SKU | current |
| versions | `versions.products_<run_id>`, `versions.diff_<run_id>` | snapshot + diff | kept |

Partition by `run_id`/date; cluster by `supplier`, `category`.

---

## 3. Quality findings schema (`quality.findings`)

| Field | Type | Notes |
|---|---|---|
| `run_id` | string | which run |
| `supplier` | string | which feed |
| `sku` / `supplier_sku` | string | which article |
| `field` | string | offending field |
| `code` | string | rule id (see below) |
| `severity` | enum | `error` \| `warning` |
| `message` | string | human-readable, supplier-facing |

### Rule catalogue
| code | severity | meaning |
|---|---|---|
| `missing_required` | error | required field empty |
| `missing_price` / `invalid_price` | error | no scale / price ≤ 0 |
| `invalid_stock` | error | negative stock |
| `duplicate_sku` | error | SKU appears >1× in feed |
| `single_price_scale` | warning | only one tier (promo needs scales) |
| `missing_gtin` / `invalid_gtin` | warning | EAN missing / fails checksum |
| `missing_image` / `invalid_image` | warning | image missing / not https-image |
| `missing_print_method` | warning | no decoration method |
| `unmapped_category` | warning | category not in taxonomy |
| `short_description` | warning | description < 30 chars |
| `no_colors` | warning | no colour variants |

---

## 4. Supplier score (`quality.supplier_scores`)

Per supplier·run: `records, rows_clean, rows_warn_only, rows_with_errors, error_count,
warning_count, score (0–100), code_tally{}`. Drives the dashboard scorecards and the emailed report.
Score formula in [ALGORITHMS.md §4.3](ALGORITHMS.md).

---

## 5. Versioning

Each run writes an immutable snapshot of `mart.products` plus a diff
`{added[], removed[], changed[], total}` (SKU-level, via row-hash set ops). Guarantees:
reproducibility (any past catalog rebuildable), traceability (every value → source feed + run),
and change visibility (what moved between feeds, and why).

See also: [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) · [ALGORITHMS.md](ALGORITHMS.md)
