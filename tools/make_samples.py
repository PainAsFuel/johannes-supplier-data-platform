"""
Generate realistic promotional-product supplier feeds in the formats SOURCE
actually receives:

  uma       -> BMEcat 1.2 XML   (the dominant promo-industry catalog standard)
  Halfar    -> CSV (semicolon)  (German export, EUR, comma colours)
  mbw       -> Excel .xlsx      (grams weight, slash-separated colours)
  REFLECTS  -> Promidata JSON   (normalized feed used by 150+ promo suppliers)

Each feed carries DELIBERATE data-quality issues (missing price scales, no print
method, invalid EAN, missing image, no min order qty, unmapped category, etc.)
so the quality engine has real problems to find and report back to suppliers.

NOTE: product/supplier names are illustrative sample data for a demo, not a real catalog.

Run:  python tools/make_samples.py
"""
import csv, json, os
import xml.etree.ElementTree as ET
from xml.dom import minidom
from openpyxl import Workbook

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "data", "incoming")
os.makedirs(OUT, exist_ok=True)


def ean13(e):
    """Return a valid EAN-13 by fixing the check digit of a 13-digit code.
    Leaves empty / non-13-digit values untouched (so deliberate bad ones stay bad)."""
    e = str(e or "")
    if len(e) == 13 and e.isdigit():
        ds = [int(c) for c in e[:12]]
        chk = (10 - sum(d * (3 if i % 2 else 1) for i, d in enumerate(ds)) % 10) % 10
        return e[:12] + str(chk)
    return e


# ============================================================ uma -> BMEcat XML
# Pens. Issues: P-1003 missing EAN + only one price scale; P-1005 unmapped category.
uma = [
    {"aid": "0-9800", "ean": "4250369812345", "name": "uma RECYCLED PET Pen",
     "manu": "uma", "cat": "pens", "material": "rPET", "colors": ["blau", "schwarz", "rot"],
     "tiers": [(100, 0.59), (500, 0.49), (1000, 0.42)], "moq": 100,
     "print": ["Tampondruck", "Lasergravur"], "area": "40 x 6 mm", "weight_g": 11, "eco": True,
     "img": "https://img.uma-pen.com/0-9800.jpg", "stock": 84000, "lead": 10,
     "desc": "Druckkugelschreiber aus recyceltem PET mit blauschreibender Großraummine."},
    {"aid": "0-9801", "ean": "4250369812352", "name": "uma STRAIGHT SI",
     "manu": "uma", "cat": "pens", "material": "ABS", "colors": ["weiss", "blau", "grün", "rot"],
     "tiers": [(100, 0.45), (500, 0.37), (1000, 0.31)], "moq": 100,
     "print": ["Tampondruck"], "area": "45 x 6 mm", "weight_g": 9, "eco": False,
     "img": "https://img.uma-pen.com/0-9801.jpg", "stock": 152000, "lead": 8,
     "desc": "Klassischer Werbekugelschreiber mit großer Werbefläche und mattem Finish."},
    {"aid": "0-9803", "ean": "", "name": "uma FLEXI soft",
     "manu": "uma", "cat": "pens", "material": "ABS", "colors": ["schwarz"],
     "tiers": [(100, 0.69)], "moq": 100,
     "print": ["Tampondruck"], "area": "40 x 5 mm", "weight_g": 10, "eco": False,
     "img": "https://img.uma-pen.com/0-9803.jpg", "stock": 12000, "lead": 12,
     "desc": "Soft-Touch Kugelschreiber mit angenehmer Griffzone."},  # MISSING EAN, single scale
    {"aid": "0-9804", "ean": "4250369812376", "name": "uma SLIM cosmo",
     "manu": "uma", "cat": "pens", "material": "Aluminium", "colors": ["silber", "blau", "anthrazit"],
     "tiers": [(100, 0.95), (500, 0.82), (1000, 0.74)], "moq": 100,
     "print": ["Lasergravur"], "area": "50 x 6 mm", "weight_g": 14, "eco": False,
     "img": "https://img.uma-pen.com/0-9804.jpg", "stock": 47000, "lead": 10,
     "desc": "Eleganter Aluminium-Drehkugelschreiber, ideal für Lasergravur."},
    {"aid": "0-9806", "ean": "4250369812390", "name": "uma Pencil Set Holzbox",
     "manu": "uma", "cat": "stationery", "material": "Holz", "colors": ["natur"],
     "tiers": [(50, 3.20), (200, 2.85), (500, 2.60)], "moq": 50,
     "print": ["Lasergravur"], "area": "60 x 20 mm", "weight_g": 120, "eco": True,
     "img": "https://img.uma-pen.com/0-9806.jpg", "stock": 6000, "lead": 15,
     "desc": "Bleistift-Set in nachhaltiger Holzbox mit Schiebedeckel."},  # unmapped cat 'stationery'
]

root = ET.Element("BMECAT", {"version": "1.2"})
cat = ET.SubElement(root, "T_NEW_CATALOG")
for p in uma:
    a = ET.SubElement(cat, "ARTICLE")
    ET.SubElement(a, "SUPPLIER_AID").text = p["aid"]
    d = ET.SubElement(a, "ARTICLE_DETAILS")
    ET.SubElement(d, "DESCRIPTION_SHORT").text = p["name"]
    ET.SubElement(d, "DESCRIPTION_LONG").text = p["desc"]
    ET.SubElement(d, "EAN").text = ean13(p["ean"])
    ET.SubElement(d, "MANUFACTURER_NAME").text = p["manu"]
    ET.SubElement(d, "DELIVERY_TIME").text = str(p["lead"])
    f = ET.SubElement(a, "ARTICLE_FEATURES")
    for fname, fval in [("Warengruppe", p["cat"]), ("Material", p["material"]),
                        ("Farben", ", ".join(p["colors"])), ("Veredelung", ", ".join(p["print"])),
                        ("Werbeflaeche", p["area"]), ("Mindestmenge", p["moq"]),
                        ("Nachhaltig", "ja" if p["eco"] else "nein"), ("GewichtG", p["weight_g"])]:
        fe = ET.SubElement(f, "FEATURE")
        ET.SubElement(fe, "FNAME").text = fname
        ET.SubElement(fe, "FVALUE").text = str(fval)
    pd = ET.SubElement(a, "ARTICLE_PRICE_DETAILS")
    for qty, price in p["tiers"]:
        pr = ET.SubElement(pd, "ARTICLE_PRICE", {"price_type": "net_list"})
        ET.SubElement(pr, "PRICE_AMOUNT").text = f"{price:.2f}"
        ET.SubElement(pr, "PRICE_CURRENCY").text = "EUR"
        ET.SubElement(pr, "LOWER_BOUND").text = str(qty)
    mi = ET.SubElement(a, "MIME_INFO")
    m = ET.SubElement(mi, "MIME")
    ET.SubElement(m, "MIME_SOURCE").text = p["img"]
    ET.SubElement(m, "MIME_PURPOSE").text = "normal"
    ET.SubElement(a, "STOCK").text = str(p["stock"])

with open(os.path.join(OUT, "uma_bmecat.xml"), "w", encoding="utf-8") as fh:
    fh.write(minidom.parseString(ET.tostring(root)).toprettyxml(indent="  "))


# ===================================================================== Halfar -> CSV
# Bags. Issues: HF-302 missing image; HF-303 no print method + short desc; HF-305 missing 500-scale.
halfar_header = ["ArtNr", "EAN", "Bezeichnung", "Hersteller", "Warengruppe", "Material", "Farben",
                 "MindestMenge", "Veredelung", "Werbeflaeche", "GewichtKg", "Bild", "Bestand",
                 "Lieferzeit", "Beschreibung", "Preis100", "Preis250", "Preis500"]
halfar = [
    ["1816", "4040375018161", "Rucksack EVENT", "Halfar", "rucksack", "Polyester 600D", "schwarz,navy,rot",
     "25", "Siebdruck,Transferdruck", "200 x 200 mm", "0.42", "https://img.halfar.com/1816.jpg", "3200",
     "14", "Geräumiger Eventrucksack mit gepolstertem Rückenteil und Fronttasche.", "8.90", "7.95", "7.20"],
    ["1820", "4040375018208", "Citybag GROOVE", "Halfar", "taschen", "rPET", "schwarz,grau",
     "25", "Siebdruck", "150 x 150 mm", "0.30", "https://img.halfar.com/1820.jpg", "1800",
     "14", "Nachhaltige Umhängetasche aus recyceltem Polyester.", "6.40", "5.80", "5.30"],
    ["1822", "4040375018222", "Sportsbag MOVE", "Halfar", "taschen", "Polyester", "blau,schwarz",
     "25", "Transferdruck", "180 x 120 mm", "0.55", "", "950",
     "21", "Robuste Sporttasche mit separatem Schuhfach und Tragegurt.", "9.50", "8.70", "8.10"],  # MISSING image
    ["1825", "4040375018253", "Shopper BASIC", "Halfar", "taschen", "Baumwolle", "natur,schwarz",
     "50", "", "250 x 250 mm", "0.12", "https://img.halfar.com/1825.jpg", "12000",
     "10", "Baumwolltasche.", "1.95", "1.70", "1.45"],  # NO print method + short desc
    ["1830", "4040375018307", "Laptop-Rucksack PRO", "Halfar", "rucksack", "Polyester 900D", "schwarz",
     "10", "Siebdruck,Lasergravur", "160 x 160 mm", "0.78", "https://img.halfar.com/1830.jpg", "0",
     "21", "Business-Rucksack mit gepolstertem 15\" Laptopfach und USB-Durchführung.", "24.90", "22.50", ""],  # 0 stock + missing 500-scale
]
for r in halfar:
    r[1] = ean13(r[1])
with open(os.path.join(OUT, "halfar_products.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh, delimiter=";")
    w.writerow(halfar_header)
    w.writerows(halfar)


# ====================================================================== mbw -> Excel
# Plush/giveaways. Issues: MB-77 negative price; MB-78 missing min order qty; MB-80 invalid GTIN.
mbw_header = ["Artikelnummer", "GTIN", "Artikelname", "Marke", "Kategorie", "Material", "Farbauswahl",
              "Mindestbestellmenge", "Druckart", "Druckbereich", "Gewicht_g", "Bild_URL", "Lagerbestand",
              "Lieferzeit_Tage", "Beschreibung", "Staffel_250", "Staffel_1000", "Staffel_5000"]
mbw = [
    ["MB-75", "4055835007501", "Schmoozies® Bär", "mbw", "plush", "Mikrofaser", "braun/beige",
     250, "Digitaldruck", "30 x 20 mm", 45, "https://img.mbw.de/MB-75.jpg", 60000,
     18, "Plüsch-Bär als Displayreiniger, ideal als sympathisches Werbegeschenk.", 1.95, 1.65, 1.40],
    ["MB-76", "4055835007600", "MiniFeet® Schlüsselanhänger", "mbw", "giveaway", "Plüsch", "bunt",
     500, "Doming", "25 x 15 mm", 22, "https://img.mbw.de/MB-76.jpg", 90000,
     15, "Kleiner Plüsch-Schlüsselanhänger, vielseitig als Streuartikel einsetzbar.", 1.20, 0.98, 0.79],
    ["MB-77", "4055835007709", "Squeezies® Stressball", "mbw", "giveaway", "PU-Schaum", "rot/blau/grün",
     500, "Tampondruck", "Ø 30 mm", 28, "https://img.mbw.de/MB-77.jpg", 120000,
     12, "Anti-Stressball zum Kneten, klassischer Messe-Giveaway.", -0.50, 0.42, 0.35],  # NEGATIVE price
    ["MB-78", "4055835007808", "Schmoozies® Smiley", "mbw", "plush", "Mikrofaser", "gelb",
     "", "Digitaldruck", "30 x 20 mm", 40, "https://img.mbw.de/MB-78.jpg", 35000,
     18, "Lächelnder Schmoozie als Bildschirmreiniger und Glücksbringer.", 2.10, 1.80, 1.55],  # MISSING moq
    ["MB-80", "405583500", "Plüsch-Elefant MAXI", "mbw", "plueschtiere", "Plüsch", "grau",
     100, "Stickerei", "40 x 30 mm", 180, "https://img.mbw.de/MB-80.jpg", 4000,
     25, "Großes Plüschtier mit individuell besticktem Halstuch.", 6.90, 6.20, 5.60],  # INVALID GTIN (too short)
]
for r in mbw:
    r[1] = ean13(r[1])
wb = Workbook(); ws = wb.active; ws.title = "Artikel"
ws.append(mbw_header)
for r in mbw:
    ws.append(r)
wb.save(os.path.join(OUT, "mbw_products.xlsx"))


# ============================================================= REFLECTS -> Promidata JSON
# Drinkware/tech. Promidata-style nested JSON with ChildProducts + PriceList scales.
# Issues: RF-12 price 0; RF-13 missing image + unmapped cat; RF-14 only one scale.
def promi(aid, ean, name, cat, material, colors, scales, moq, prints, area, weight_g,
          eco, img, stock, lead, desc):
    return {
        "ProductDetails": {
            "SupplierAID": aid, "EAN": ean13(ean), "Name": {"de": name}, "Category": cat,
            "Material": {"de": material}, "Manufacturer": "REFLECTS",
            "MinimumOrderQuantity": moq, "Weight": weight_g, "WeightUnit": "g",
            "DeliveryTime": lead, "Sustainable": eco, "Description": {"de": desc},
            "PrintingDimensions": area, "PrintingTechniques": prints,
        },
        "ChildProducts": [{"Color": {"de": c}} for c in colors],
        "ImageList": ([{"Url": img, "Type": "Main"}] if img else []),
        "PriceList": [{"Scale": q, "Price": pr, "Currency": "EUR"} for q, pr in scales],
        "Stock": {"Quantity": stock},
    }

reflects = {"Supplier": "REFLECTS", "Format": "Promidata-1.0", "Products": [
    promi("RF-10", "4034127001001", "REEVES drinking bottle", "drinkware", "Tritan",
          ["transparent", "blau", "rot"], [(72, 3.40), (288, 2.95), (1008, 2.55)], 72,
          ["Tampondruck", "Lasergravur", "Digitaldruck"], "50 x 80 mm", 95, True,
          "https://img.reflects.com/RF-10.jpg", 22000, 14,
          "BPA-freie Trinkflasche aus Tritan mit auslaufsicherem Schraubverschluss."),
    promi("RF-11", "4034127001102", "ABERDEEN thermo mug", "drinkware", "Edelstahl",
          ["silber", "schwarz", "weiss"], [(48, 6.90), (144, 6.10), (504, 5.40)], 48,
          ["Lasergravur", "Digitaldruck"], "40 x 60 mm", 280, False,
          "https://img.reflects.com/RF-11.jpg", 9000, 16,
          "Doppelwandiger Edelstahl-Thermobecher, hält Getränke bis zu 6 Stunden warm."),
    promi("RF-12", "4034127001203", "DAKAR power bank 5000", "tech", "ABS / Aluminium",
          ["schwarz", "weiss"], [(50, 0.0), (200, 8.20), (500, 7.40)], 50,
          ["Lasergravur", "Digitaldruck"], "40 x 40 mm", 120, False,
          "https://img.reflects.com/RF-12.jpg", 5000, 20,
          "Kompakte 5000 mAh Powerbank mit USB-C Eingang und LED-Statusanzeige."),  # price 0 in first scale
    promi("RF-13", "4034127001304", "MONTERREY USB-C cable", "accessories", "Nylon",
          ["schwarz"], [(100, 1.90), (500, 1.55), (1000, 1.30)], 100,
          ["Doming"], "20 x 10 mm", 35, False,
          "", 30000, 12,
          "3-in-1 Ladekabel mit Nylonummantelung und individuellem Doming-Label."),  # MISSING image + unmapped cat 'accessories'
    promi("RF-14", "4034127001405", "SANTOS coffee-to-go cup", "drinkware", "Bambusfaser",
          ["natur", "grün"], [(100, 2.80)], 100,
          ["Tampondruck"], "45 x 60 mm", 110, True,
          "https://img.reflects.com/RF-14.jpg", 14000, 14,
          "Nachhaltiger Coffee-to-go Becher aus Bambusfaser mit Silikondeckel und -manschette."),  # single scale only
]}
with open(os.path.join(OUT, "reflects_promidata.json"), "w", encoding="utf-8") as fh:
    json.dump(reflects, fh, indent=2, ensure_ascii=False)


print("Sample promotional-product feeds written to", OUT)
for fn in sorted(os.listdir(OUT)):
    print("  -", fn)
