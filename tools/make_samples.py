"""
Generate promotional-product supplier feeds in the formats SOURCE actually receives.
Product names, brands and base prices are REAL items scraped from source-werbeartikel.com
(prices are "ab" / from-prices); supporting fields (scale tiers, MOQ, print methods,
stock, EANs) are synthesized to make a complete, realistic feed. Deliberate data-quality
issues are injected so the quality engine has real problems to find and report.

  senator   -> BMEcat 1.2 XML    (Büro & Schreibgeräte / pens)
  REFLECTS  -> Promidata JSON     (Küche & Zuhause / drinkware)
  Halfar    -> CSV (semicolon)    (Taschen & Gepäck / cotton bags)
  Stedman   -> Excel (.xlsx)      (Bekleidung / t-shirts)

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
    e = str(e or "")
    if len(e) == 13 and e.isdigit():
        ds = [int(c) for c in e[:12]]
        chk = (10 - sum(d * (3 if i % 2 else 1) for i, d in enumerate(ds)) % 10) % 10
        return e[:12] + str(chk)
    return e


def P(aid, ean, name, manu, cat, material, colors, tiers, moq, prints, area, weight_g, eco, img, stock, lead, desc):
    return dict(aid=aid, ean=ean, name=name, manu=manu, cat=cat, material=material, colors=colors,
                tiers=tiers, moq=moq, prints=prints, area=area, weight_g=weight_g, eco=eco,
                img=img, stock=stock, lead=lead, desc=desc)


# ============================================================ senator -> BMEcat XML  (pens)
# Real senator models & SOURCE pen items. Issue: SE-03 missing EAN; SE-05 only one price scale.
senator = [
    P("SE-Lib-01", "4045645010017", "senator® Liberty Soft Touch Kugelschreiber", "senator", "kugelschreiber",
      "ABS / Soft-Touch", ["blau", "schwarz", "rot", "weiss"], [(250, 0.95), (500, 0.84), (1000, 0.75)], 250,
      ["Tampondruck", "Lasergravur"], "45 x 6 mm", 11, False,
      "https://img.source-werbeartikel.com/senator/liberty.jpg", 184000, 10,
      "Soft-Touch Kunststoffkugelschreiber mit blauschreibender Großraummine und angenehmer Haptik."),
    P("SE-Hit-02", "4045645010024", "senator® Super Hit Kugelschreiber", "senator", "kugelschreiber",
      "ABS", ["blau", "schwarz", "gelb", "grün", "rot"], [(250, 0.49), (1000, 0.41), (5000, 0.34)], 250,
      ["Tampondruck"], "45 x 7 mm", 9, False,
      "https://img.source-werbeartikel.com/senator/superhit.jpg", 420000, 8,
      "Der Klassiker: meistverkaufter Werbekugelschreiber mit großer Werbefläche."),
    P("SE-Chl-03", "", "senator® Challenger Soft Touch", "senator", "kugelschreiber",
      "ABS / Soft-Touch", ["schwarz", "blau"], [(250, 0.62), (500, 0.55), (1000, 0.48)], 250,
      ["Tampondruck", "Lasergravur"], "45 x 6 mm", 10, False,
      "https://img.source-werbeartikel.com/senator/challenger.jpg", 96000, 10,
      "Eleganter Soft-Touch Kugelschreiber mit verchromten Applikationen."),  # MISSING EAN
    P("SE-Eco-04", "4045645010048", "Öko-Druckkugelschreiber recycelt", "senator", "kugelschreiber",
      "rABS (recycelt)", ["blau", "natur", "grün"], [(500, 0.21), (1000, 0.18), (5000, 0.17)], 500,
      ["Tampondruck"], "40 x 6 mm", 9, True,
      "https://img.source-werbeartikel.com/senator/oeko.jpg", 260000, 12,
      "Nachhaltiger Druckkugelschreiber aus recyceltem Kunststoff, klimafreundlich produziert."),
    P("SE-Mtl-05", "4045645010055", "Metallkugelschreiber Slim schwarz", "senator", "kugelschreiber",
      "Aluminium", ["schwarz", "silber", "blau"], [(100, 6.42)], 100,
      ["Lasergravur"], "50 x 6 mm", 18, False,
      "https://img.source-werbeartikel.com/senator/metal.jpg", 22000, 14,
      "Hochwertiger Metallkugelschreiber mit mattem Finish, ideal für gravierte Logos."),  # single scale
]

root = ET.Element("BMECAT", {"version": "1.2"})
cat = ET.SubElement(root, "T_NEW_CATALOG")
for p in senator:
    a = ET.SubElement(cat, "ARTICLE")
    ET.SubElement(a, "SUPPLIER_AID").text = p["aid"]
    d = ET.SubElement(a, "ARTICLE_DETAILS")
    ET.SubElement(d, "DESCRIPTION_SHORT").text = p["name"]
    ET.SubElement(d, "DESCRIPTION_LONG").text = p["desc"]
    ET.SubElement(d, "EAN").text = ean13(p["ean"])
    ET.SubElement(d, "MANUFACTURER_NAME").text = p["manu"]
    ET.SubElement(d, "DELIVERY_TIME").text = str(p["lead"])
    f = ET.SubElement(a, "ARTICLE_FEATURES")
    for fn, fv in [("Warengruppe", p["cat"]), ("Material", p["material"]), ("Farben", ", ".join(p["colors"])),
                   ("Veredelung", ", ".join(p["prints"])), ("Werbeflaeche", p["area"]),
                   ("Mindestmenge", p["moq"]), ("Nachhaltig", "ja" if p["eco"] else "nein"), ("GewichtG", p["weight_g"])]:
        fe = ET.SubElement(f, "FEATURE"); ET.SubElement(fe, "FNAME").text = fn; ET.SubElement(fe, "FVALUE").text = str(fv)
    pd = ET.SubElement(a, "ARTICLE_PRICE_DETAILS")
    for qty, price in p["tiers"]:
        pr = ET.SubElement(pd, "ARTICLE_PRICE", {"price_type": "net_list"})
        ET.SubElement(pr, "PRICE_AMOUNT").text = f"{price:.2f}"
        ET.SubElement(pr, "PRICE_CURRENCY").text = "EUR"
        ET.SubElement(pr, "LOWER_BOUND").text = str(qty)
    mi = ET.SubElement(a, "MIME_INFO"); m = ET.SubElement(mi, "MIME")
    ET.SubElement(m, "MIME_SOURCE").text = p["img"]; ET.SubElement(m, "MIME_PURPOSE").text = "normal"
    ET.SubElement(a, "STOCK").text = str(p["stock"])
with open(os.path.join(OUT, "senator_bmecat.xml"), "w", encoding="utf-8") as fh:
    fh.write(minidom.parseString(ET.tostring(root)).toprettyxml(indent="  "))


# ============================================================ REFLECTS -> Promidata JSON (drinkware)
# Issue: RF-03 price 0 first scale; RF-05 missing image + single scale.
reflects = [
    P("RF-RPET-01", "4034127020014", "RPET-Trinkflasche 500 ml", "REFLECTS", "trinkflaschen",
      "RPET", ["transparent", "blau", "grün"], [(100, 1.34), (500, 1.15), (1000, 1.04)], 100,
      ["Tampondruck", "Digitaldruck"], "50 x 80 mm", 60, True,
      "https://img.source-werbeartikel.com/reflects/rpet500.jpg", 41000, 12,
      "Nachhaltige Trinkflasche aus recyceltem PET, BPA-frei mit auslaufsicherem Verschluss."),
    P("RF-ISO-02", "4034127020021", "Isolierflasche Edelstahl 500 ml", "REFLECTS", "trinkflaschen",
      "Edelstahl", ["silber", "schwarz", "weiss"], [(48, 4.60), (144, 4.20), (504, 3.93)], 48,
      ["Lasergravur", "Digitaldruck"], "40 x 60 mm", 300, False,
      "https://img.source-werbeartikel.com/reflects/iso500.jpg", 18500, 14,
      "Doppelwandige vakuumisolierte Edelstahlflasche, hält Getränke bis zu 12 Stunden warm."),
    P("RF-TRI-03", "4034127020038", "Trinkflasche Tritan 650 ml", "REFLECTS", "trinkflaschen",
      "Tritan", ["transparent", "blau", "rot"], [(100, 0.0), (500, 2.85), (1000, 2.62)], 100,
      ["Tampondruck", "Lasergravur", "Digitaldruck"], "50 x 90 mm", 110, False,
      "https://img.source-werbeartikel.com/reflects/tritan650.jpg", 27000, 12,
      "Bruchfeste Tritan-Trinkflasche mit großer Öffnung, spülmaschinengeeignet."),  # price 0
    P("RF-DW-04", "4034127020045", "Doppelwandige Trinkflasche 400 ml", "REFLECTS", "trinkflaschen",
      "Edelstahl", ["weiss", "schwarz", "petrol"], [(48, 11.20), (144, 10.60), (504, 10.18)], 48,
      ["Lasergravur"], "35 x 55 mm", 260, False,
      "https://img.source-werbeartikel.com/reflects/dw400.jpg", 7400, 16,
      "Elegante doppelwandige Flasche mit pulverbeschichteter Oberfläche und Bambusdeckel."),
    P("RF-VAK-05", "4034127020052", "Vakuum-Isolierkanne 1 L", "REFLECTS", "trinkflaschen",
      "Edelstahl", ["silber", "schwarz"], [(50, 7.44)], 50,
      ["Lasergravur"], "60 x 80 mm", 520, False,
      "", 5200, 18,
      "Robuste Vakuum-Isolierkanne mit Einhand-Ausgießmechanik für Büro und Outdoor."),  # missing image + single scale
]


def promi(p):
    return {
        "ProductDetails": {"SupplierAID": p["aid"], "EAN": ean13(p["ean"]), "Name": {"de": p["name"]},
            "Category": p["cat"], "Material": {"de": p["material"]}, "Manufacturer": p["manu"],
            "MinimumOrderQuantity": p["moq"], "Weight": p["weight_g"], "WeightUnit": "g",
            "DeliveryTime": p["lead"], "Sustainable": p["eco"], "Description": {"de": p["desc"]},
            "PrintingDimensions": p["area"], "PrintingTechniques": p["prints"]},
        "ChildProducts": [{"Color": {"de": c}} for c in p["colors"]],
        "ImageList": ([{"Url": p["img"], "Type": "Main"}] if p["img"] else []),
        "PriceList": [{"Scale": q, "Price": pr, "Currency": "EUR"} for q, pr in p["tiers"]],
        "Stock": {"Quantity": p["stock"]},
    }

with open(os.path.join(OUT, "reflects_promidata.json"), "w", encoding="utf-8") as fh:
    json.dump({"Supplier": "REFLECTS", "Format": "Promidata-1.0", "Products": [promi(p) for p in reflects]},
              fh, indent=2, ensure_ascii=False)


# ============================================================ Halfar -> CSV (cotton bags)
# Issue: HF-03 missing image; HF-05 no print method + short description.
halfar_header = ["ArtNr", "EAN", "Bezeichnung", "Hersteller", "Warengruppe", "Material", "Farben",
                 "MindestMenge", "Veredelung", "Werbeflaeche", "GewichtKg", "Bild", "Bestand",
                 "Lieferzeit", "Beschreibung", "Preis100", "Preis250", "Preis500"]
halfar = [
    P("HF-COT-01", "4040375200017", "Baumwoll-Einkaufstasche 140 g/m²", "Halfar", "baumwolltaschen",
      "Baumwolle 140g", ["natur", "schwarz", "navy"], [(100, 0.96), (250, 0.84), (500, 0.76)], 100,
      ["Siebdruck", "Transferdruck"], "250 x 250 mm", 0.09, False,
      "https://img.source-werbeartikel.com/halfar/cotton140.jpg", 64000, 12,
      "Klassische Baumwolltasche mit langen Henkeln, vielseitig bedruckbar."),
    P("HF-GIO-02", "4040375200024", "Baumwolltasche GIOVANNI weiss", "Halfar", "baumwolltaschen",
      "Baumwolle 105g", ["weiss"], [(250, 0.62), (500, 0.54), (1000, 0.48)], 250,
      ["Siebdruck"], "220 x 220 mm", 0.07, False,
      "https://img.source-werbeartikel.com/halfar/giovanni.jpg", 120000, 10,
      "Leichte Baumwolltasche mit langen Henkeln, ideal als günstiger Streuartikel."),
    P("HF-IMP-03", "4040375200031", "Impact AWARE™ recycelte Baumwolltasche 145 g", "Halfar", "baumwolltaschen",
      "rec. Baumwolle 145g", ["natur", "grau"], [(100, 4.20), (250, 3.95), (500, 3.79)], 100,
      ["Siebdruck", "Transferdruck"], "240 x 240 mm", 0.12, True,
      "", 22000, 14,
      "Nachhaltige Tasche aus zertifiziert recycelter Baumwolle mit AWARE™ Tracer."),  # missing image
    P("HF-CAN-04", "4040375200048", "Canvas Shopper 270 g/m² beige", "Halfar", "baumwolltaschen",
      "Canvas 270g", ["beige", "schwarz"], [(100, 2.65), (250, 2.40), (500, 2.25)], 100,
      ["Siebdruck", "Stickerei"], "260 x 300 mm", 0.21, False,
      "https://img.source-werbeartikel.com/halfar/canvas.jpg", 14000, 16,
      "Robuster Canvas-Shopper mit Innentasche und verstärkten Henkeln."),
    P("HF-GYM-05", "4040375200055", "Gymbag ANTON Oeko-Tex Baumwolle", "Halfar", "baumwolltaschen",
      "Baumwolle", ["natur", "schwarz", "rot"], [(100, 0.95), (250, 0.85), (500, 0.77)], 100,
      [], "200 x 250 mm", 0.06, True,
      "https://img.source-werbeartikel.com/halfar/anton.jpg", 88000, 12,
      "Turnbeutel."),  # no print method + short desc
]
for r in halfar:
    pass
with open(os.path.join(OUT, "halfar_products.csv"), "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh, delimiter=";"); w.writerow(halfar_header)
    for p in halfar:
        t = {q: pr for q, pr in p["tiers"]}
        w.writerow([p["aid"], ean13(p["ean"]), p["name"], p["manu"], p["cat"], p["material"], ",".join(p["colors"]),
                    p["moq"], ",".join(p["prints"]), p["area"], p["weight_g"], p["img"], p["stock"], p["lead"], p["desc"],
                    p["tiers"][0][1], p["tiers"][1][1] if len(p["tiers"]) > 1 else "", p["tiers"][2][1] if len(p["tiers"]) > 2 else ""])


# ============================================================ Stedman -> Excel (t-shirts)
# Issue: ST-03 negative price; ST-04 missing MOQ; ST-05 invalid (short) GTIN.
mbw_header = ["Artikelnummer", "GTIN", "Artikelname", "Marke", "Kategorie", "Material", "Farbauswahl",
              "Mindestbestellmenge", "Druckart", "Druckbereich", "Gewicht_g", "Bild_URL", "Lagerbestand",
              "Lieferzeit_Tage", "Beschreibung", "Staffel_250", "Staffel_1000", "Staffel_5000"]
stedman = [
    P("ST-CRU-01", "4055835100017", "CRUSADER MEN T-Shirt 150g", "Stedman", "t-shirts",
      "100% Baumwolle", ["weiss/schwarz/navy/rot"], [(250, 4.20), (1000, 3.95), (5000, 3.76)], 250,
      ["Siebdruck", "Transferdruck", "Stickerei"], "250 x 350 mm", 165, False,
      "https://img.source-werbeartikel.com/stedman/crusader.jpg", 54000, 7,
      "Klassisches Rundhals-T-Shirt für Herren aus ringgesponnener Baumwolle, 150 g/m²."),
    P("ST-IQO-02", "4055835100024", "IQONIQ Bryce T-Shirt recycelte Baumwolle", "Stedman", "t-shirts",
      "rec. Baumwolle", ["schwarz/weiss/khaki"], [(250, 2.95), (1000, 2.78), (5000, 2.65)], 250,
      ["Siebdruck", "Transferdruck"], "240 x 320 mm", 150, True,
      "https://img.source-werbeartikel.com/stedman/iqoniq.jpg", 38000, 10,
      "Nachhaltiges T-Shirt aus recycelter Baumwolle, GRS-zertifiziert."),
    P("ST-MON-03", "4055835100031", "MONARCH DAMEN T-Shirt 150g", "Stedman", "t-shirts",
      "100% Baumwolle", ["weiss/rosa/navy"], [(250, -1.00), (1000, 4.90), (5000, 4.72)], 250,
      ["Siebdruck", "Stickerei"], "220 x 300 mm", 150, False,
      "https://img.source-werbeartikel.com/stedman/monarch.jpg", 41000, 7,
      "Tailliertes Damen-Rundhals-T-Shirt mit seitlichen Nähten, weicher Tragekomfort."),  # negative price
    P("ST-LEG-04", "4055835100048", "LEGEND Heavy T-Shirt", "Stedman", "t-shirts",
      "Baumwolle 180g", ["schwarz/weiss"], [(250, 5.80), (1000, 5.55), (5000, 5.41)], "",
      ["Siebdruck", "Transferdruck", "Stickerei"], "260 x 360 mm", 180, False,
      "https://img.source-werbeartikel.com/stedman/legend.jpg", 26000, 9,
      "Schweres Premium-T-Shirt, 180 g/m², formstabil und langlebig für hochwertige Veredelung."),  # missing MOQ
    P("ST-TUN-05", "405583510", "TUNER T-Shirt", "Stedman", "t-shirts",
      "Baumwolle 160g", ["navy/grau/rot"], [(250, 4.95), (1000, 4.80), (5000, 4.68)], 250,
      ["Siebdruck", "Transferdruck"], "250 x 350 mm", 160, False,
      "https://img.source-werbeartikel.com/stedman/tuner.jpg", 33000, 8,
      "Sportliches Rundhals-T-Shirt mit moderner Passform, vielseitig veredelbar."),  # invalid (short) GTIN
]
wb = Workbook(); ws = wb.active; ws.title = "Artikel"; ws.append(mbw_header)
for p in stedman:
    ws.append([p["aid"], ean13(p["ean"]), p["name"], p["manu"], p["cat"], p["material"], p["colors"][0],
               p["moq"], "/".join(p["prints"]), p["area"], p["weight_g"], p["img"], p["stock"], p["lead"], p["desc"],
               p["tiers"][0][1], p["tiers"][1][1] if len(p["tiers"]) > 1 else "", p["tiers"][2][1] if len(p["tiers"]) > 2 else ""])
wb.save(os.path.join(OUT, "stedman_products.xlsx"))


print("Real-data promotional feeds written to", OUT)
for fn in sorted(os.listdir(OUT)):
    print("  -", fn)
