"""
Normalization: map each adapter record into the canonical SOURCE product model.
  - price tiers -> EUR, sorted; price_from_eur = cheapest tier
  - weight -> kg
  - category -> SOURCE taxonomy (with per-supplier hint as fallback)
  - SOURCE internal SKU minted from supplier id + supplier article id
"""
WEIGHT_TO_KG = {"kg": 1.0, "g": 0.001, "lb": 0.45359237}


def _clean_str(v):
    return v.strip() if isinstance(v, str) else v


def normalize_record(raw, cfg, model):
    fx = model["fx_to_eur"]
    tiers = []
    for t in raw.get("price_tiers", []):
        amt = t.get("amount")
        rate = fx.get(str(t.get("currency", "EUR")).upper())
        if amt is not None and rate:
            tiers.append({"qty": t["qty"], "eur": round(amt * rate, 2)})
    tiers.sort(key=lambda x: x["qty"])
    price_from = min((t["eur"] for t in tiers), default=None)

    raw_cat = (raw.get("category") or "").strip().lower()
    category = model["category_map"].get(raw_cat, "")
    if not category and cfg.get("category_hint"):
        category = ""  # leave empty so QA flags it; hint is only used downstream, not to hide gaps

    w = raw.get("weight")
    weight_kg = round(w * WEIGHT_TO_KG.get(raw.get("weight_unit", "kg"), 1.0), 3) if w is not None else None

    ssku = _clean_str(raw.get("supplier_sku"))
    return {
        "sku": f"SRC-{cfg['supplier_id'].upper()}-{ssku}" if ssku else None,
        "supplier_sku": ssku,
        "_supplier": cfg["supplier_id"],
        "_supplier_name": cfg["supplier_name"],
        "ean": _clean_str(raw.get("ean")),
        "name": _clean_str(raw.get("name")),
        "manufacturer": _clean_str(raw.get("manufacturer")),
        "category": category,
        "_raw_category": raw_cat,
        "material": _clean_str(raw.get("material")),
        "colors": [c for c in (raw.get("colors") or []) if c],
        "price_from_eur": price_from,
        "price_tiers": tiers,
        "min_order_qty": int(raw["min_order_qty"]) if raw.get("min_order_qty") else None,
        "print_methods": [p for p in (raw.get("print_methods") or []) if p],
        "print_area": _clean_str(raw.get("print_area")),
        "weight_kg": weight_kg,
        "eco": bool(raw.get("eco")),
        "image_url": _clean_str(raw.get("image_url")),
        "stock_qty": int(raw["stock_qty"]) if raw.get("stock_qty") is not None else None,
        "lead_time_days": int(raw["lead_time_days"]) if raw.get("lead_time_days") else None,
        "description": _clean_str(raw.get("description")),
    }


def normalize_all(raws, cfg, model):
    return [normalize_record(r, cfg, model) for r in raws]
