"""
Generate realistic, DELIBERATELY MESSY supplier feeds in 4 formats.

This simulates what a drop-shipment dealer actually receives from suppliers:
the same kind of product data, but every supplier uses different column names,
different units, different currencies, and different quality problems.

Run once: `python tools/make_samples.py`  (outputs into data/incoming/)
"""
import csv
import json
import os
import xml.etree.ElementTree as ET
from xml.dom import minidom

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "incoming")
os.makedirs(OUT, exist_ok=True)


# ---------------------------------------------------------------- ACME (CSV)
# Issues: missing price, duplicate SKU, weight in pounds, http (insecure) image,
#         unmapped category, blank GTIN.
acme_rows = [
    ["Item No", "Name", "Maker", "Cat", "Price", "Curr", "Qty", "Weight(lb)", "Image", "Desc", "Barcode"],
    ["AC-1001", "Wireless Mouse Pro", "Logi", "elec", "19.99", "USD", "120", "0.25", "https://cdn.acme.com/1001.jpg", "Ergonomic 2.4GHz wireless mouse with silent click.", "4006381333931"],
    ["AC-1002", "Mechanical Keyboard", "Logi", "comp", "", "USD", "45", "2.1", "https://cdn.acme.com/1002.jpg", "RGB mechanical keyboard, blue switches.", "4006381333948"],  # missing price
    ["AC-1003", "USB-C Hub 7in1", "Anker", "comp", "34.50", "USD", "0", "0.3", "http://cdn.acme.com/1003.jpg", "7-in-1 USB-C hub.", ""],  # insecure image, blank gtin, 0 stock
    ["AC-1004", "Garden Hose 20m", "GreenLine", "yardstuff", "29.00", "USD", "60", "3.4", "https://cdn.acme.com/1004.jpg", "Flexible 20m garden hose.", "4006381333962"],  # unmapped category 'yardstuff'
    ["AC-1001", "Wireless Mouse Pro (dup)", "Logi", "elec", "18.50", "USD", "10", "0.25", "https://cdn.acme.com/1001.jpg", "Duplicate SKU row.", "4006381333931"],  # duplicate SKU
    ["AC-1006", "LED Desk Lamp", "Lumi", "home", "24.99", "USD", "200", "0.9", "https://cdn.acme.com/1006.jpg", "Dimmable LED desk lamp with USB port.", "4006381333986"],
    ["AC-1007", "Bluetooth Speaker", "JBL", "elec", "0", "USD", "75", "0.6", "https://cdn.acme.com/1007.jpg", "Portable speaker.", "4006381333993"],  # price 0
]

with open(os.path.join(OUT, "acme_products.csv"), "w", newline="", encoding="utf-8") as f:
    csv.writer(f).writerows(acme_rows)


# -------------------------------------------------------------- GLOBEX (Excel)
# Issues: weight in grams, missing image, short description, invalid EAN length.
from openpyxl import Workbook
globex_header = ["sku", "product_title", "brand", "category", "unit_price", "currency", "quantity", "weight_g", "image_link", "long_description", "ean"]
globex_rows = [
    ["GX-50", "Stainless Steel Pan 28cm", "Fissler", "kitchen", 49.90, "EUR", 80, 1200, "https://img.globex.de/50.jpg", "Induction-ready stainless steel frying pan, 28cm diameter.", "4011200296908"],
    ["GX-51", "Knife Block Set", "WMF", "kitchen", 89.00, "EUR", 35, 2500, "", "6-piece knife block set.", "4011200296915"],  # missing image
    ["GX-52", "Smart Thermostat E", "tado", "electronics", 129.00, "EUR", 50, 300, "https://img.globex.de/52.jpg", "Wifi smart thermostat with app control and scheduling.", "4011200296922"],
    ["GX-53", "Robot Vacuum X10", "Roborock", "electronics", 399.00, "EUR", 25, 3600, "https://img.globex.de/53.jpg", "Self-emptying robot vacuum with lidar navigation.", "4011200296939"],
    ["GX-54", "Cordless Drill 18V", "Bosch", "household", 79.95, "EUR", 12, 1500, "https://img.globex.de/54.jpg", "18V cordless drill with two batteries.", "4011200296946"],
    ["GX-55", "Air Fryer 5L", "Philips", "kitchen", 119.00, "EUR", 60, 4200, "https://img.globex.de/55.jpg", "Digital air fryer with 5L capacity.", "4011200296953"],
]
wb = Workbook(); ws = wb.active; ws.title = "products"
ws.append(globex_header)
for r in globex_rows:
    ws.append(r)
wb.save(os.path.join(OUT, "globex_products.xlsx"))


# -------------------------------------------------------------- INITECH (XML)
# Issues: GBP currency, weight already kg, missing stock, missing title.
root = ET.Element("catalog")
initech_products = [
    {"code": "IN-700", "ean13": "5012345678900", "name": "Cotton T-Shirt", "manufacturer": "Fruit", "type": "home", "price": "9.99", "currency": "GBP", "available": "500", "weight_kg": "0.2", "img": "https://cdn.initech.co.uk/700.jpg", "desc": "100% cotton crew-neck t-shirt, machine washable."},
    {"code": "IN-701", "ean13": "5012345678917", "name": "", "manufacturer": "Nike", "type": "home", "price": "59.99", "currency": "GBP", "available": "120", "weight_kg": "0.8", "img": "https://cdn.initech.co.uk/701.jpg", "desc": "Running shoes, lightweight mesh upper."},  # missing title
    {"code": "IN-702", "ean13": "5012345678924", "name": "Yoga Mat 6mm", "manufacturer": "Gaiam", "type": "outdoor", "price": "24.99", "currency": "GBP", "available": "", "img": "https://cdn.initech.co.uk/702.jpg", "weight_kg": "1.1", "desc": "Non-slip 6mm yoga mat."},  # missing stock
    {"code": "IN-703", "ean13": "5012345678931", "name": "Water Bottle 1L", "manufacturer": "Chilly", "type": "outdoor", "price": "29.99", "currency": "GBP", "available": "300", "weight_kg": "0.35", "img": "ftp://cdn.initech.co.uk/703", "desc": "Insulated stainless steel bottle keeps drinks cold 24h."},  # bad image url scheme
    {"code": "IN-704", "ean13": "5012345678948", "name": "Building Blocks 500pc", "manufacturer": "LEGO", "type": "toys", "price": "49.99", "currency": "GBP", "available": "90", "weight_kg": "1.4", "img": "https://cdn.initech.co.uk/704.jpg", "desc": "Creative building block set with 500 pieces."},
]
for p in initech_products:
    el = ET.SubElement(root, "product")
    for k, v in p.items():
        ET.SubElement(el, k).text = v
xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="  ")
with open(os.path.join(OUT, "initech_products.xml"), "w", encoding="utf-8") as f:
    f.write(xml_str)


# ------------------------------------------------------------- UMBRELLA (API)
# Nested JSON like a real REST response. Issues: CHF currency, weight grams,
# one item missing pricing block, duplicate barcode.
umbrella = {
    "meta": {"supplier": "umbrella", "page": 1, "per_page": 50},
    "data": {
        "items": [
            {"id": "UM-9", "barcode": "7612345678905", "pricing": {"amount": 12.50, "currency": "CHF"}, "inventory": {"qty": 400}, "media": {"thumbnail": "https://media.umbrella.ch/9.png"}, "attributes": {"name": "Notebook A5 Dotted", "vendor": "Leuchtturm", "group": "home", "weight_g": 250, "copy": "A5 dotted hardcover notebook, 240 pages."}},
            {"id": "UM-10", "barcode": "7612345678912", "pricing": {"amount": 0, "currency": "CHF"}, "inventory": {"qty": 150}, "media": {"thumbnail": "https://media.umbrella.ch/10.png"}, "attributes": {"name": "Fountain Pen", "vendor": "Lamy", "group": "home", "weight_g": 30, "copy": "Safari fountain pen, medium nib."}},  # price 0
            {"id": "UM-11", "barcode": "7612345678929", "inventory": {"qty": 60}, "media": {"thumbnail": "https://media.umbrella.ch/11.png"}, "attributes": {"name": "Desk Organizer", "vendor": "Bigso", "group": "office", "weight_g": 600, "copy": "Cardboard desk organizer with drawers."}},  # missing pricing block + unmapped category 'office'
            {"id": "UM-12", "barcode": "7612345678905", "pricing": {"amount": 199.00, "currency": "CHF"}, "inventory": {"qty": 20}, "media": {"thumbnail": ""}, "attributes": {"name": "Espresso Machine", "vendor": "DeLonghi", "group": "kitchen", "weight_g": 4500, "copy": "15-bar pump espresso machine with milk frother."}},  # dup barcode + missing image
        ]
    }
}
with open(os.path.join(OUT, "umbrella_api.json"), "w", encoding="utf-8") as f:
    json.dump(umbrella, f, indent=2)

print("Sample feeds written to", OUT)
for fn in sorted(os.listdir(OUT)):
    print("  -", fn)
