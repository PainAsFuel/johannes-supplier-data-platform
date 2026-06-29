"""
Ingestion layer: read a supplier feed (any supported format) into a list of
raw records. The format and source are declared in the supplier's config file,
so adding a new format/supplier never touches this module's callers.
"""
import csv
import json
import os
import xml.etree.ElementTree as ET


def get_path(record, path):
    """Resolve a dotted path like 'pricing.amount' against nested dicts.
    Falls back to a flat lookup for CSV/Excel/XML records."""
    if path in record:
        return record[path]
    cur = record
    for part in path.split("."):
        if isinstance(cur, dict) and part in cur:
            cur = cur[part]
        else:
            return None
    return cur


def _read_csv(path, options):
    delimiter = options.get("delimiter", ",")
    with open(path, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f, delimiter=delimiter))


def _read_excel(path, options):
    from openpyxl import load_workbook
    wb = load_workbook(path, read_only=True, data_only=True)
    ws = wb[options["sheet"]] if options.get("sheet") in wb.sheetnames else wb.active
    rows = list(ws.iter_rows(values_only=True))
    header, body = rows[0], rows[1:]
    return [{str(h): v for h, v in zip(header, r)} for r in body]


def _read_xml(path, options):
    record_path = options.get("record_path", "product")
    tree = ET.parse(path)
    out = []
    for el in tree.getroot().findall(record_path):
        out.append({child.tag: (child.text or "") for child in el})
    return out


def _read_api(path, options):
    """Simulates a REST API response read from a saved JSON payload.
    In production this is a requests/aiohttp call; the parsing is identical."""
    with open(path, encoding="utf-8") as f:
        payload = json.load(f)
    cur = payload
    for part in options.get("record_path", "data").split("."):
        cur = cur[part]
    return cur


READERS = {"csv": _read_csv, "excel": _read_excel, "xml": _read_xml, "api": _read_api}


def ingest(supplier_cfg, root):
    fmt = supplier_cfg["format"]
    if fmt not in READERS:
        raise ValueError(f"Unsupported format '{fmt}' for {supplier_cfg['supplier_id']}")
    path = os.path.join(root, supplier_cfg["source"])
    records = READERS[fmt](path, supplier_cfg.get("options", {}))
    return records
