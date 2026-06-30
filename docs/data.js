window.SOURCE_DATA = {
  "generated_at": "29 Jun 2026, 23:52 UTC (live from BigQuery)",
  "run_id": "bigquery_live",
  "kpis": {
    "suppliers": 4,
    "incoming": 20,
    "published": 17,
    "avg_score": 73.0,
    "errors": 3,
    "warnings": 8,
    "eco": 2,
    "categories": 4
  },
  "suppliers": [
    {
      "id": "halfar",
      "name": "Halfar System (Bags)",
      "format": "CSV",
      "summary": {
        "records": 5,
        "rows_clean": 3,
        "rows_warn_only": 2,
        "rows_with_errors": 0,
        "error_count": 0,
        "warning_count": 3,
        "score": 84.0,
        "code_tally": {
          "short_description": 1,
          "missing_print_method": 1,
          "missing_image": 1
        }
      },
      "products": [
        {
          "supplier_sku": "HF-CAN-04",
          "name": "Canvas Shopper 270 g/m² beige",
          "price_from_eur": 2.25,
          "stock_qty": 14000,
          "_issues": []
        },
        {
          "supplier_sku": "HF-COT-01",
          "name": "Baumwoll-Einkaufstasche 140 g/m²",
          "price_from_eur": 0.76,
          "stock_qty": 64000,
          "_issues": []
        },
        {
          "supplier_sku": "HF-GIO-02",
          "name": "Baumwolltasche GIOVANNI weiss",
          "price_from_eur": 0.48,
          "stock_qty": 120000,
          "_issues": []
        },
        {
          "supplier_sku": "HF-GYM-05",
          "name": "Gymbag ANTON Oeko-Tex Baumwolle",
          "price_from_eur": 0.77,
          "stock_qty": 88000,
          "_issues": [
            {
              "field": "description",
              "code": "short_description",
              "severity": "warning",
              "message": "Beschreibung zu kurz"
            },
            {
              "field": "print_methods",
              "code": "missing_print_method",
              "severity": "warning",
              "message": "Keine Veredelungsart"
            }
          ]
        },
        {
          "supplier_sku": "HF-IMP-03",
          "name": "Impact AWARE™ recycelte Baumwolltasche 145 g",
          "price_from_eur": 3.79,
          "stock_qty": 22000,
          "_issues": [
            {
              "field": "image_url",
              "code": "missing_image",
              "severity": "warning",
              "message": "Produktbild fehlt"
            }
          ]
        }
      ]
    },
    {
      "id": "reflects",
      "name": "REFLECTS (Promidata feed)",
      "format": "Promidata JSON",
      "summary": {
        "records": 5,
        "rows_clean": 3,
        "rows_warn_only": 1,
        "rows_with_errors": 1,
        "error_count": 1,
        "warning_count": 2,
        "score": 72.0,
        "code_tally": {
          "invalid_price": 1,
          "missing_image": 1,
          "single_price_scale": 1
        }
      },
      "products": [
        {
          "supplier_sku": "RF-DW-04",
          "name": "Doppelwandige Trinkflasche 400 ml",
          "price_from_eur": 10.18,
          "stock_qty": 7400,
          "_issues": []
        },
        {
          "supplier_sku": "RF-ISO-02",
          "name": "Isolierflasche Edelstahl 500 ml",
          "price_from_eur": 3.93,
          "stock_qty": 18500,
          "_issues": []
        },
        {
          "supplier_sku": "RF-RPET-01",
          "name": "RPET-Trinkflasche 500 ml",
          "price_from_eur": 1.04,
          "stock_qty": 41000,
          "_issues": []
        },
        {
          "supplier_sku": "RF-TRI-03",
          "name": "Trinkflasche Tritan 650 ml",
          "price_from_eur": 0.0,
          "stock_qty": 27000,
          "_issues": [
            {
              "field": "price_from_eur",
              "code": "invalid_price",
              "severity": "error",
              "message": "Preis ≤ 0"
            }
          ]
        },
        {
          "supplier_sku": "RF-VAK-05",
          "name": "Vakuum-Isolierkanne 1 L",
          "price_from_eur": 7.44,
          "stock_qty": 5200,
          "_issues": [
            {
              "field": "image_url",
              "code": "missing_image",
              "severity": "warning",
              "message": "Produktbild fehlt"
            },
            {
              "field": "price_tiers",
              "code": "single_price_scale",
              "severity": "warning",
              "message": "Nur eine Preisstaffel"
            }
          ]
        }
      ]
    },
    {
      "id": "senator",
      "name": "senator",
      "format": "BMEcat 1.2 XML",
      "summary": {
        "records": 5,
        "rows_clean": 3,
        "rows_warn_only": 2,
        "rows_with_errors": 0,
        "error_count": 0,
        "warning_count": 2,
        "score": 84.0,
        "code_tally": {
          "missing_gtin": 1,
          "single_price_scale": 1
        }
      },
      "products": [
        {
          "supplier_sku": "SE-Chl-03",
          "name": "senator® Challenger Soft Touch",
          "price_from_eur": 0.48,
          "stock_qty": 96000,
          "_issues": [
            {
              "field": "ean",
              "code": "missing_gtin",
              "severity": "warning",
              "message": "EAN/GTIN fehlt"
            }
          ]
        },
        {
          "supplier_sku": "SE-Eco-04",
          "name": "Öko-Druckkugelschreiber recycelt",
          "price_from_eur": 0.17,
          "stock_qty": 260000,
          "_issues": []
        },
        {
          "supplier_sku": "SE-Hit-02",
          "name": "senator® Super Hit Kugelschreiber",
          "price_from_eur": 0.34,
          "stock_qty": 420000,
          "_issues": []
        },
        {
          "supplier_sku": "SE-Lib-01",
          "name": "senator® Liberty Soft Touch Kugelschreiber",
          "price_from_eur": 0.75,
          "stock_qty": 184000,
          "_issues": []
        },
        {
          "supplier_sku": "SE-Mtl-05",
          "name": "Metallkugelschreiber Slim schwarz",
          "price_from_eur": 6.42,
          "stock_qty": 22000,
          "_issues": [
            {
              "field": "price_tiers",
              "code": "single_price_scale",
              "severity": "warning",
              "message": "Nur eine Preisstaffel"
            }
          ]
        }
      ]
    },
    {
      "id": "stedman",
      "name": "Stedman (Textiles)",
      "format": "Excel (.xlsx)",
      "summary": {
        "records": 5,
        "rows_clean": 2,
        "rows_warn_only": 1,
        "rows_with_errors": 2,
        "error_count": 2,
        "warning_count": 1,
        "score": 52.0,
        "code_tally": {
          "missing_required": 1,
          "invalid_price": 1,
          "invalid_gtin": 1
        }
      },
      "products": [
        {
          "supplier_sku": "ST-CRU-01",
          "name": "CRUSADER MEN T-Shirt 150g",
          "price_from_eur": 3.76,
          "stock_qty": 54000,
          "_issues": []
        },
        {
          "supplier_sku": "ST-IQO-02",
          "name": "IQONIQ Bryce T-Shirt recycelte Baumwolle",
          "price_from_eur": 2.65,
          "stock_qty": 38000,
          "_issues": []
        },
        {
          "supplier_sku": "ST-LEG-04",
          "name": "LEGEND Heavy T-Shirt",
          "price_from_eur": 5.41,
          "stock_qty": 26000,
          "_issues": [
            {
              "field": "min_order_qty",
              "code": "missing_required",
              "severity": "error",
              "message": "Mindestbestellmenge fehlt"
            }
          ]
        },
        {
          "supplier_sku": "ST-MON-03",
          "name": "MONARCH DAMEN T-Shirt 150g",
          "price_from_eur": -1.0,
          "stock_qty": 41000,
          "_issues": [
            {
              "field": "price_from_eur",
              "code": "invalid_price",
              "severity": "error",
              "message": "Preis ≤ 0"
            }
          ]
        },
        {
          "supplier_sku": "ST-TUN-05",
          "name": "TUNER T-Shirt",
          "price_from_eur": 4.68,
          "stock_qty": 33000,
          "_issues": [
            {
              "field": "ean",
              "code": "invalid_gtin",
              "severity": "warning",
              "message": "Ungültige EAN-13"
            }
          ]
        }
      ]
    }
  ],
  "catalog": [
    {
      "sku": "SRC-STEDMAN-ST-CRU-01",
      "supplier_sku": "ST-CRU-01",
      "_supplier": "stedman",
      "_supplier_name": "Stedman (Textiles)",
      "ean": "4055835100018",
      "name": "CRUSADER MEN T-Shirt 150g",
      "manufacturer": "Stedman",
      "category": "Bekleidung",
      "material": "100% Baumwolle",
      "colors": [
        "weiss",
        "schwarz",
        "navy",
        "rot"
      ],
      "price_from_eur": 3.76,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 4.2
        },
        {
          "qty": 1000,
          "eur": 3.95
        },
        {
          "qty": 5000,
          "eur": 3.76
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Siebdruck",
        "Transferdruck",
        "Stickerei"
      ],
      "print_area": "250 x 350 mm",
      "weight_kg": 0.165,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/1/9/19809f56186701db0dcc101cf5b1bab9673d1198bc417d2dfa0646c6e0848d55.jpeg",
      "stock_qty": 54000,
      "lead_time_days": 7,
      "description": "Klassisches Rundhals-T-Shirt für Herren aus ringgesponnener Baumwolle, 150 g/m²."
    },
    {
      "sku": "SRC-STEDMAN-ST-IQO-02",
      "supplier_sku": "ST-IQO-02",
      "_supplier": "stedman",
      "_supplier_name": "Stedman (Textiles)",
      "ean": "4055835100025",
      "name": "IQONIQ Bryce T-Shirt recycelte Baumwolle",
      "manufacturer": "Stedman",
      "category": "Bekleidung",
      "material": "rec. Baumwolle",
      "colors": [
        "schwarz",
        "weiss",
        "khaki"
      ],
      "price_from_eur": 2.65,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 2.95
        },
        {
          "qty": 1000,
          "eur": 2.78
        },
        {
          "qty": 5000,
          "eur": 2.65
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Siebdruck",
        "Transferdruck"
      ],
      "print_area": "240 x 320 mm",
      "weight_kg": 0.15,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/0/4/04ea1f841899185842ba3c4d2beaf5c16c5306feec5f3d647e1da33145a69422.jpeg",
      "stock_qty": 38000,
      "lead_time_days": 10,
      "description": "Nachhaltiges T-Shirt aus recycelter Baumwolle, GRS-zertifiziert."
    },
    {
      "sku": "SRC-STEDMAN-ST-TUN-05",
      "supplier_sku": "ST-TUN-05",
      "_supplier": "stedman",
      "_supplier_name": "Stedman (Textiles)",
      "ean": "405583510",
      "name": "TUNER T-Shirt",
      "manufacturer": "Stedman",
      "category": "Bekleidung",
      "material": "Baumwolle 160g",
      "colors": [
        "navy",
        "grau",
        "rot"
      ],
      "price_from_eur": 4.68,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 4.95
        },
        {
          "qty": 1000,
          "eur": 4.8
        },
        {
          "qty": 5000,
          "eur": 4.68
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Siebdruck",
        "Transferdruck"
      ],
      "print_area": "250 x 350 mm",
      "weight_kg": 0.16,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/7/4/74d96df8083402a20c33b63df40a24751f82c82a9cd3466aa6c4c6ba14c687d3.jpeg",
      "stock_qty": 33000,
      "lead_time_days": 8,
      "description": "Sportliches Rundhals-T-Shirt mit moderner Passform, vielseitig veredelbar."
    },
    {
      "sku": "SRC-SENATOR-SE-Chl-03",
      "supplier_sku": "SE-Chl-03",
      "_supplier": "senator",
      "_supplier_name": "senator",
      "ean": null,
      "name": "senator® Challenger Soft Touch",
      "manufacturer": "senator",
      "category": "Büro & Schreibgeräte",
      "material": "ABS / Soft-Touch",
      "colors": [
        "schwarz",
        "blau"
      ],
      "price_from_eur": 0.48,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 0.62
        },
        {
          "qty": 500,
          "eur": 0.55
        },
        {
          "qty": 1000,
          "eur": 0.48
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Tampondruck",
        "Lasergravur"
      ],
      "print_area": "45 x 6 mm",
      "weight_kg": 0.01,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/8/a/8a00cd82be35601c26b2cf8c537cde965c9098f48d75bf91bc8e6e9268112b83.jpeg",
      "stock_qty": 96000,
      "lead_time_days": 10,
      "description": "Eleganter Soft-Touch Kugelschreiber mit verchromten Applikationen."
    },
    {
      "sku": "SRC-SENATOR-SE-Eco-04",
      "supplier_sku": "SE-Eco-04",
      "_supplier": "senator",
      "_supplier_name": "senator",
      "ean": "4045645010041",
      "name": "Öko-Druckkugelschreiber recycelt",
      "manufacturer": "senator",
      "category": "Büro & Schreibgeräte",
      "material": "rABS (recycelt)",
      "colors": [
        "blau",
        "natur",
        "grün"
      ],
      "price_from_eur": 0.17,
      "price_tiers": [
        {
          "qty": 500,
          "eur": 0.21
        },
        {
          "qty": 1000,
          "eur": 0.18
        },
        {
          "qty": 5000,
          "eur": 0.17
        }
      ],
      "min_order_qty": 500,
      "print_methods": [
        "Tampondruck"
      ],
      "print_area": "40 x 6 mm",
      "weight_kg": 0.009,
      "eco": true,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/5/0/509d736f303e73a2cda542a4591e4fe7d999d95d4e8fcc316a5f23321dd8bb32.jpeg",
      "stock_qty": 260000,
      "lead_time_days": 12,
      "description": "Nachhaltiger Druckkugelschreiber aus recyceltem Kunststoff, klimafreundlich produziert."
    },
    {
      "sku": "SRC-SENATOR-SE-Hit-02",
      "supplier_sku": "SE-Hit-02",
      "_supplier": "senator",
      "_supplier_name": "senator",
      "ean": "4045645010027",
      "name": "senator® Super Hit Kugelschreiber",
      "manufacturer": "senator",
      "category": "Büro & Schreibgeräte",
      "material": "ABS",
      "colors": [
        "blau",
        "schwarz",
        "gelb",
        "grün",
        "rot"
      ],
      "price_from_eur": 0.34,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 0.49
        },
        {
          "qty": 1000,
          "eur": 0.41
        },
        {
          "qty": 5000,
          "eur": 0.34
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Tampondruck"
      ],
      "print_area": "45 x 7 mm",
      "weight_kg": 0.009,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/f/c/fcd702c22dcd81cea96df9521441ac37408fb6f7506ff1334458df0f5cbbf857.jpeg",
      "stock_qty": 420000,
      "lead_time_days": 8,
      "description": "Der Klassiker: meistverkaufter Werbekugelschreiber mit großer Werbefläche."
    },
    {
      "sku": "SRC-SENATOR-SE-Lib-01",
      "supplier_sku": "SE-Lib-01",
      "_supplier": "senator",
      "_supplier_name": "senator",
      "ean": "4045645010010",
      "name": "senator® Liberty Soft Touch Kugelschreiber",
      "manufacturer": "senator",
      "category": "Büro & Schreibgeräte",
      "material": "ABS / Soft-Touch",
      "colors": [
        "blau",
        "schwarz",
        "rot",
        "weiss"
      ],
      "price_from_eur": 0.75,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 0.95
        },
        {
          "qty": 500,
          "eur": 0.84
        },
        {
          "qty": 1000,
          "eur": 0.75
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Tampondruck",
        "Lasergravur"
      ],
      "print_area": "45 x 6 mm",
      "weight_kg": 0.011,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/0/e/0e5334f272f30b9225f9180e7152a8158c5a90550acb37a6a1f2ec24239ae3fc.jpeg",
      "stock_qty": 184000,
      "lead_time_days": 10,
      "description": "Soft-Touch Kunststoffkugelschreiber mit blauschreibender Großraummine und angenehmer Haptik."
    },
    {
      "sku": "SRC-SENATOR-SE-Mtl-05",
      "supplier_sku": "SE-Mtl-05",
      "_supplier": "senator",
      "_supplier_name": "senator",
      "ean": "4045645010058",
      "name": "Metallkugelschreiber Slim schwarz",
      "manufacturer": "senator",
      "category": "Büro & Schreibgeräte",
      "material": "Aluminium",
      "colors": [
        "schwarz",
        "silber",
        "blau"
      ],
      "price_from_eur": 6.42,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 6.42
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Lasergravur"
      ],
      "print_area": "50 x 6 mm",
      "weight_kg": 0.018,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/4/8/48a7203150f6b76a37b61526c6cb2a63da4b70027223aee42be7ed548d5e4d3e.jpeg",
      "stock_qty": 22000,
      "lead_time_days": 14,
      "description": "Hochwertiger Metallkugelschreiber mit mattem Finish, ideal für gravierte Logos."
    },
    {
      "sku": "SRC-REFLECTS-RF-VAK-05",
      "supplier_sku": "RF-VAK-05",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127020050",
      "name": "Vakuum-Isolierkanne 1 L",
      "manufacturer": "REFLECTS",
      "category": "Küche & Zuhause",
      "material": "Edelstahl",
      "colors": [
        "silber",
        "schwarz"
      ],
      "price_from_eur": 7.44,
      "price_tiers": [
        {
          "qty": 50,
          "eur": 7.44
        }
      ],
      "min_order_qty": 50,
      "print_methods": [
        "Lasergravur"
      ],
      "print_area": "60 x 80 mm",
      "weight_kg": 0.52,
      "eco": false,
      "image_url": "",
      "stock_qty": 5200,
      "lead_time_days": 18,
      "description": "Robuste Vakuum-Isolierkanne mit Einhand-Ausgießmechanik für Büro und Outdoor."
    },
    {
      "sku": "SRC-REFLECTS-RF-DW-04",
      "supplier_sku": "RF-DW-04",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127020043",
      "name": "Doppelwandige Trinkflasche 400 ml",
      "manufacturer": "REFLECTS",
      "category": "Küche & Zuhause",
      "material": "Edelstahl",
      "colors": [
        "weiss",
        "schwarz",
        "petrol"
      ],
      "price_from_eur": 10.18,
      "price_tiers": [
        {
          "qty": 48,
          "eur": 11.2
        },
        {
          "qty": 144,
          "eur": 10.6
        },
        {
          "qty": 504,
          "eur": 10.18
        }
      ],
      "min_order_qty": 48,
      "print_methods": [
        "Lasergravur"
      ],
      "print_area": "35 x 55 mm",
      "weight_kg": 0.26,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/c/9/c998ec84f119e9cf721d3c7dfa0c800aac3bc2e682d82d5f4ca4728301a5d785.jpeg",
      "stock_qty": 7400,
      "lead_time_days": 16,
      "description": "Elegante doppelwandige Flasche mit pulverbeschichteter Oberfläche und Bambusdeckel."
    },
    {
      "sku": "SRC-REFLECTS-RF-RPET-01",
      "supplier_sku": "RF-RPET-01",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127020012",
      "name": "RPET-Trinkflasche 500 ml",
      "manufacturer": "REFLECTS",
      "category": "Küche & Zuhause",
      "material": "RPET",
      "colors": [
        "transparent",
        "blau",
        "grün"
      ],
      "price_from_eur": 1.04,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 1.34
        },
        {
          "qty": 500,
          "eur": 1.15
        },
        {
          "qty": 1000,
          "eur": 1.04
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Tampondruck",
        "Digitaldruck"
      ],
      "print_area": "50 x 80 mm",
      "weight_kg": 0.06,
      "eco": true,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/f/5/f5120ab19cdc6c1a0952c190b1b6e2c8d02eae04033b5fa57159ba3bb0f69f04.jpeg",
      "stock_qty": 41000,
      "lead_time_days": 12,
      "description": "Nachhaltige Trinkflasche aus recyceltem PET, BPA-frei mit auslaufsicherem Verschluss."
    },
    {
      "sku": "SRC-REFLECTS-RF-ISO-02",
      "supplier_sku": "RF-ISO-02",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127020029",
      "name": "Isolierflasche Edelstahl 500 ml",
      "manufacturer": "REFLECTS",
      "category": "Küche & Zuhause",
      "material": "Edelstahl",
      "colors": [
        "silber",
        "schwarz",
        "weiss"
      ],
      "price_from_eur": 3.93,
      "price_tiers": [
        {
          "qty": 48,
          "eur": 4.6
        },
        {
          "qty": 144,
          "eur": 4.2
        },
        {
          "qty": 504,
          "eur": 3.93
        }
      ],
      "min_order_qty": 48,
      "print_methods": [
        "Lasergravur",
        "Digitaldruck"
      ],
      "print_area": "40 x 60 mm",
      "weight_kg": 0.3,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/f/d/fd8f98342306d0468233d95af85eafd2d0a3d58c86b0f3d04120a51d880daf84.jpeg",
      "stock_qty": 18500,
      "lead_time_days": 14,
      "description": "Doppelwandige vakuumisolierte Edelstahlflasche, hält Getränke bis zu 12 Stunden warm."
    },
    {
      "sku": "SRC-HALFAR-HF-IMP-03",
      "supplier_sku": "HF-IMP-03",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375200038",
      "name": "Impact AWARE™ recycelte Baumwolltasche 145 g",
      "manufacturer": "Halfar",
      "category": "Taschen & Gepäck",
      "material": "rec. Baumwolle 145g",
      "colors": [
        "natur",
        "grau"
      ],
      "price_from_eur": 3.79,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 4.2
        },
        {
          "qty": 250,
          "eur": 3.95
        },
        {
          "qty": 500,
          "eur": 3.79
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Siebdruck",
        "Transferdruck"
      ],
      "print_area": "240 x 240 mm",
      "weight_kg": 0.12,
      "eco": false,
      "image_url": "",
      "stock_qty": 22000,
      "lead_time_days": 14,
      "description": "Nachhaltige Tasche aus zertifiziert recycelter Baumwolle mit AWARE™ Tracer."
    },
    {
      "sku": "SRC-HALFAR-HF-CAN-04",
      "supplier_sku": "HF-CAN-04",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375200045",
      "name": "Canvas Shopper 270 g/m² beige",
      "manufacturer": "Halfar",
      "category": "Taschen & Gepäck",
      "material": "Canvas 270g",
      "colors": [
        "beige",
        "schwarz"
      ],
      "price_from_eur": 2.25,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 2.65
        },
        {
          "qty": 250,
          "eur": 2.4
        },
        {
          "qty": 500,
          "eur": 2.25
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Siebdruck",
        "Stickerei"
      ],
      "print_area": "260 x 300 mm",
      "weight_kg": 0.21,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/c/2/c21eda75aed119fb2bcc51da387abcb2b187d09c17556fc881529b5f985a5b26.jpeg",
      "stock_qty": 14000,
      "lead_time_days": 16,
      "description": "Robuster Canvas-Shopper mit Innentasche und verstärkten Henkeln."
    },
    {
      "sku": "SRC-HALFAR-HF-COT-01",
      "supplier_sku": "HF-COT-01",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375200014",
      "name": "Baumwoll-Einkaufstasche 140 g/m²",
      "manufacturer": "Halfar",
      "category": "Taschen & Gepäck",
      "material": "Baumwolle 140g",
      "colors": [
        "natur",
        "schwarz",
        "navy"
      ],
      "price_from_eur": 0.76,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 0.96
        },
        {
          "qty": 250,
          "eur": 0.84
        },
        {
          "qty": 500,
          "eur": 0.76
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Siebdruck",
        "Transferdruck"
      ],
      "print_area": "250 x 250 mm",
      "weight_kg": 0.09,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/e/7/e71cdb930cf3faf43b346c41b1d04e7bb1530cfc0e90bfc297783a2e763d9048.jpeg",
      "stock_qty": 64000,
      "lead_time_days": 12,
      "description": "Klassische Baumwolltasche mit langen Henkeln, vielseitig bedruckbar."
    },
    {
      "sku": "SRC-HALFAR-HF-GIO-02",
      "supplier_sku": "HF-GIO-02",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375200021",
      "name": "Baumwolltasche GIOVANNI weiss",
      "manufacturer": "Halfar",
      "category": "Taschen & Gepäck",
      "material": "Baumwolle 105g",
      "colors": [
        "weiss"
      ],
      "price_from_eur": 0.48,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 0.62
        },
        {
          "qty": 250,
          "eur": 0.54
        },
        {
          "qty": 500,
          "eur": 0.48
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Siebdruck"
      ],
      "print_area": "220 x 220 mm",
      "weight_kg": 0.07,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/e/d/ed2c2659d8212fd68724fe6fed6adcf24b47a56ee422802d231043767b4ac7b3.jpeg",
      "stock_qty": 120000,
      "lead_time_days": 10,
      "description": "Leichte Baumwolltasche mit langen Henkeln, ideal als günstiger Streuartikel."
    },
    {
      "sku": "SRC-HALFAR-HF-GYM-05",
      "supplier_sku": "HF-GYM-05",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375200052",
      "name": "Gymbag ANTON Oeko-Tex Baumwolle",
      "manufacturer": "Halfar",
      "category": "Taschen & Gepäck",
      "material": "Baumwolle",
      "colors": [
        "natur",
        "schwarz",
        "rot"
      ],
      "price_from_eur": 0.77,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 0.95
        },
        {
          "qty": 250,
          "eur": 0.85
        },
        {
          "qty": 500,
          "eur": 0.77
        }
      ],
      "min_order_qty": 100,
      "print_methods": [],
      "print_area": "200 x 250 mm",
      "weight_kg": 0.06,
      "eco": false,
      "image_url": "https://img.source-werbeartikel.com/media/catalog/product/cache/dc09e1c71e492175f875827bcbf6a37c/e/1/e1b7a580ac8bc2ceff9328fec918c4d674a98ac60fc60ac58b4d3532ff173bec.jpeg",
      "stock_qty": 88000,
      "lead_time_days": 12,
      "description": "Turnbeutel."
    }
  ],
  "category_breakdown": {
    "Büro & Schreibgeräte": 5,
    "Taschen & Gepäck": 5,
    "Küche & Zuhause": 4,
    "Bekleidung": 3
  },
  "issue_totals": {
    "invalid_price": 2,
    "missing_image": 2,
    "single_price_scale": 2,
    "missing_required": 1,
    "invalid_gtin": 1,
    "short_description": 1,
    "missing_print_method": 1,
    "missing_gtin": 1
  },
  "diff": {
    "added": 17,
    "changed": 0,
    "removed": 0,
    "total": 17
  },
  "engine": "Google BigQuery + Dataform (provisioned by Terraform)"
};
