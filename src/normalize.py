"""
Normalization layer: map a supplier's raw record into the canonical product
data model defined in config/common_model.json, applying:
  - field renaming (per supplier config)
  - currency conversion to EUR
  - weight unit conversion to kg
  - category mapping to our internal taxonomy

Output records all share one identical schema => single source of truth.
"""
from src.ingest import get_path

WEIGHT_TO_KG = {"kg": 1.0, "g": 0.001, "lb": 0.45359237}


def _to_float(v):
    if v is None or v == "":
        return None
    try:
        return float(str(v).replace(",", "."))
    except ValueError:
        return None


def _to_int(v):
    f = _to_float(v)
    return int(f) if f is not None else None


def normalize_record(raw, supplier_cfg, model):
    out = {"_supplier": supplier_cfg["supplier_id"]}

    # 1. simple field mapping
    for target, source in supplier_cfg["field_map"].items():
        val = get_path(raw, source)
        out[target] = val.strip() if isinstance(val, str) else val

    # 2. price -> EUR
    pcfg = supplier_cfg["price"]
    amount = _to_float(get_path(raw, pcfg["field"]))
    currency = get_path(raw, pcfg.get("currency_field", "")) or pcfg.get("currency_default", "EUR")
    fx = model["fx_to_eur"].get(str(currency).upper())
    out["price_eur"] = round(amount * fx, 2) if (amount is not None and fx) else None
    out["_source_currency"] = currency

    # 3. weight -> kg
    wcfg = supplier_cfg.get("weight")
    if wcfg:
        w = _to_float(get_path(raw, wcfg["field"]))
        factor = WEIGHT_TO_KG.get(wcfg.get("unit", "kg"), 1.0)
        out["weight_kg"] = round(w * factor, 3) if w is not None else None

    # 4. category -> internal taxonomy ('' if we don't recognise it -> flagged by QA)
    raw_cat = (out.get("category") or "").strip().lower()
    out["_raw_category"] = raw_cat
    out["category"] = model["category_map"].get(raw_cat, "")

    # 5. type coercion for stock
    out["stock_qty"] = _to_int(out.get("stock_qty"))

    return out


def normalize_all(raw_records, supplier_cfg, model):
    return [normalize_record(r, supplier_cfg, model) for r in raw_records]
