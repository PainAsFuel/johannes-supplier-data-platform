# Algorithms — SOURCE Product Data Platform

The concrete algorithms used in each stage, with rationale, pseudocode and complexity.
`n` = records in a feed, `t` = price tiers per record, `f` = fields per record.

---

## 1. Format detection & parsing

Adapters are selected by the supplier config (`format`), so detection is O(1) config lookup, not sniffing.
Each adapter is **streaming** where possible so memory stays O(1) in feed size.

- **BMEcat 1.2 (XML)** — iterate `ARTICLE` elements with a streaming parser (`iterparse`/SAX in prod).
  Map `ARTICLE_FEATURES/FEATURE{FNAME,FVALUE}` to a dict; collect `ARTICLE_PRICE{LOWER_BOUND, PRICE_AMOUNT}`
  into tiers. Complexity **O(n·f)**, memory O(1) per article.
- **Promidata (JSON)** — parse `Products[]`; resolve nested paths (`ProductDetails.Name.de`),
  flatten `ChildProducts[].Color`, `PriceList[].Scale/Price`. O(n·f).
- **CSV / Excel** — `DictReader` / row iterator + a declarative `field_map`. O(n·f).

> Production note: for very large feeds, parse as a stream and load to BigQuery in batches; never hold the whole feed in RAM.

---

## 2. Normalization

### 2.1 Currency → EUR
```
price_eur = round(amount * fx_rate[currency], 2)
```
FX rates from a daily-refreshed table. O(1) per tier.

### 2.2 Unit → kg
Lookup table `{kg:1, g:1e-3, lb:0.45359237}`; `weight_kg = value * factor`. O(1).

### 2.3 Price-scale handling
Tiers normalized to `[{qty, eur}]`, **sorted ascending by qty**; `price_from = min(eur)`.
Sorting per record is O(t log t), t tiny (≤ ~6) ⇒ effectively O(1).

### 2.4 Category mapping (taxonomy resolution)
Supplier category text → SOURCE taxonomy via a normalized dictionary lookup:
```
key = lower(strip(raw_category))
category = category_map.get(key, "")      # "" ⇒ flagged unmapped by QA
```
O(1) average (hash map). **Why this matters for SOURCE:** their category names drift over time
(the reason behind the earlier "synonyms" project). Unmapped values are never silently dropped —
they are flagged so the taxonomy can be extended.

> Production upgrade: when an exact key misses, fall back to **fuzzy/synonym matching** —
> token-set ratio or a small embedding nearest-neighbour against known categories — and queue
> low-confidence matches for human review. Keeps the map self-healing as suppliers change wording.

---

## 3. EAN-13 validation (checksum)

A real GS1 check-digit verification, not a length check:
```
valid(code):
  if not match(/^\d{13}$/): return false
  s = Σ d[i] * (3 if i odd else 1)  for i in 0..11
  check = (10 - s % 10) % 10
  return check == d[12]
```
O(1). Catches transposed/typo'd barcodes that a regex would pass.

---

## 4. Data-quality scoring

### 4.1 Per-record rules
Each record runs a fixed set of predicate rules (required fields, price > 0, EAN-13, image URL pattern,
print method present, category mapped, description length, colours present). Each yields findings tagged
**error** (blocks publish) or **warning**. O(f) per record.

### 4.2 Batch rule — duplicate SKU
Group indices by SKU in one pass (hash map), flag any group with size > 1. **O(n)** time, O(n) space —
beats the naive O(n²) pairwise compare.

### 4.3 Score (transparent & explainable)
Row-based so a single field never tanks a feed disproportionately:
```
clean      = rows with no findings
warn_only  = rows with only warnings
errored    = rows with ≥1 error
score = 100 * (clean*1.0 + warn_only*0.6) / n      # range 0–100
```
Weights are explicit (clean 1.0, warning 0.6, error 0.0). O(n).

### 4.4 Why row-based, not finding-based
A finding-count score punishes a record with five warnings the same as five bad records. Row-based maps to
the business reality "how many articles are publishable / need work", which is what a supplier scorecard should say.

---

## 5. Source-of-truth promotion & dedup

```
candidates = [clean(rec) for rec in all if no error in rec.findings]
by_sku = {}; for r in candidates: by_sku[r.sku] = r     # last-good wins, dedupe
mart = values(by_sku)
```
O(n) with a hash map. Dedup policy is pluggable (last-wins / highest-quality / preferred-supplier).

---

## 6. Versioning & change-data-capture (diff)

Each run snapshots the mart and diffs against the previous version as **set operations on SKUs**:
```
added   = keys(curr) - keys(prev)
removed = keys(prev) - keys(curr)
changed = { k in curr ∩ prev : hash(curr[k]) != hash(prev[k]) }
```
O(n) with hash sets. In BigQuery this is `EXCEPT DISTINCT` on a row hash — fully set-based, scales to millions.
Row hashing (e.g. FARM_FINGERPRINT of the canonical JSON) makes `changed` an O(1)-per-row comparison.

---

## 7. Orchestration

DAG = topological order of stages; per-supplier ingest/normalize/quality run in parallel, then a **barrier**
before the cross-supplier SoT build (it needs all suppliers' clean rows to dedupe globally). Retries with
exponential backoff; unparseable feeds dead-lettered, not failing the whole run.

---

## 8. Complexity summary

| Stage | Time | Space |
|---|---|---|
| Parse (any format) | O(n·f) | O(1) streaming |
| Normalize | O(n·t log t) ≈ O(n) | O(1) |
| Quality (per-record) | O(n·f) | O(1) |
| Duplicate SKU | O(n) | O(n) |
| SoT promote + dedupe | O(n) | O(n) |
| Version diff | O(n) | O(n) |

Whole pipeline is **linear in feed size** and parallel across suppliers.

See also: [SYSTEM_DESIGN.md](SYSTEM_DESIGN.md) · [DATA_MODEL.md](DATA_MODEL.md)
