window.SOURCE_DATA = {
  "generated_at": "29 Jun 2026, 23:12 UTC",
  "run_id": "run_20260629_231219",
  "kpis": {
    "suppliers": 4,
    "incoming": 20,
    "published": 17,
    "avg_score": 71.0,
    "errors": 3,
    "warnings": 10,
    "eco": 4,
    "categories": 5
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
          "missing_image": 1,
          "missing_print_method": 1,
          "short_description": 1
        }
      },
      "products": [
        {
          "sku": "SRC-HALFAR-1816",
          "supplier_sku": "1816",
          "_supplier": "halfar",
          "_supplier_name": "Halfar System (Bags)",
          "ean": "4040375018169",
          "name": "Rucksack EVENT",
          "manufacturer": "Halfar",
          "category": "Bags & Travel",
          "_raw_category": "rucksack",
          "material": "Polyester 600D",
          "colors": [
            "schwarz",
            "navy",
            "rot"
          ],
          "price_from_eur": 7.2,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 8.9
            },
            {
              "qty": 250,
              "eur": 7.95
            },
            {
              "qty": 500,
              "eur": 7.2
            }
          ],
          "min_order_qty": 25,
          "print_methods": [
            "Siebdruck",
            "Transferdruck"
          ],
          "print_area": "200 x 200 mm",
          "weight_kg": 0.42,
          "eco": false,
          "image_url": "https://img.halfar.com/1816.jpg",
          "stock_qty": 3200,
          "lead_time_days": 14,
          "description": "Geräumiger Eventrucksack mit gepolstertem Rückenteil und Fronttasche.",
          "_issues": []
        },
        {
          "sku": "SRC-HALFAR-1820",
          "supplier_sku": "1820",
          "_supplier": "halfar",
          "_supplier_name": "Halfar System (Bags)",
          "ean": "4040375018206",
          "name": "Citybag GROOVE",
          "manufacturer": "Halfar",
          "category": "Bags & Travel",
          "_raw_category": "taschen",
          "material": "rPET",
          "colors": [
            "schwarz",
            "grau"
          ],
          "price_from_eur": 5.3,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 6.4
            },
            {
              "qty": 250,
              "eur": 5.8
            },
            {
              "qty": 500,
              "eur": 5.3
            }
          ],
          "min_order_qty": 25,
          "print_methods": [
            "Siebdruck"
          ],
          "print_area": "150 x 150 mm",
          "weight_kg": 0.3,
          "eco": false,
          "image_url": "https://img.halfar.com/1820.jpg",
          "stock_qty": 1800,
          "lead_time_days": 14,
          "description": "Nachhaltige Umhängetasche aus recyceltem Polyester.",
          "_issues": []
        },
        {
          "sku": "SRC-HALFAR-1822",
          "supplier_sku": "1822",
          "_supplier": "halfar",
          "_supplier_name": "Halfar System (Bags)",
          "ean": "4040375018220",
          "name": "Sportsbag MOVE",
          "manufacturer": "Halfar",
          "category": "Bags & Travel",
          "_raw_category": "taschen",
          "material": "Polyester",
          "colors": [
            "blau",
            "schwarz"
          ],
          "price_from_eur": 8.1,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 9.5
            },
            {
              "qty": 250,
              "eur": 8.7
            },
            {
              "qty": 500,
              "eur": 8.1
            }
          ],
          "min_order_qty": 25,
          "print_methods": [
            "Transferdruck"
          ],
          "print_area": "180 x 120 mm",
          "weight_kg": 0.55,
          "eco": false,
          "image_url": "",
          "stock_qty": 950,
          "lead_time_days": 21,
          "description": "Robuste Sporttasche mit separatem Schuhfach und Tragegurt.",
          "_issues": [
            {
              "field": "image_url",
              "code": "missing_image",
              "severity": "warning",
              "message": "Product image missing"
            }
          ]
        },
        {
          "sku": "SRC-HALFAR-1825",
          "supplier_sku": "1825",
          "_supplier": "halfar",
          "_supplier_name": "Halfar System (Bags)",
          "ean": "4040375018251",
          "name": "Shopper BASIC",
          "manufacturer": "Halfar",
          "category": "Bags & Travel",
          "_raw_category": "taschen",
          "material": "Baumwolle",
          "colors": [
            "natur",
            "schwarz"
          ],
          "price_from_eur": 1.45,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 1.95
            },
            {
              "qty": 250,
              "eur": 1.7
            },
            {
              "qty": 500,
              "eur": 1.45
            }
          ],
          "min_order_qty": 50,
          "print_methods": [],
          "print_area": "250 x 250 mm",
          "weight_kg": 0.12,
          "eco": false,
          "image_url": "https://img.halfar.com/1825.jpg",
          "stock_qty": 12000,
          "lead_time_days": 10,
          "description": "Baumwolltasche.",
          "_issues": [
            {
              "field": "print_methods",
              "code": "missing_print_method",
              "severity": "warning",
              "message": "No decoration / print method — core attribute for promo products"
            },
            {
              "field": "description",
              "code": "short_description",
              "severity": "warning",
              "message": "Description shorter than 30 chars"
            }
          ]
        },
        {
          "sku": "SRC-HALFAR-1830",
          "supplier_sku": "1830",
          "_supplier": "halfar",
          "_supplier_name": "Halfar System (Bags)",
          "ean": "4040375018305",
          "name": "Laptop-Rucksack PRO",
          "manufacturer": "Halfar",
          "category": "Bags & Travel",
          "_raw_category": "rucksack",
          "material": "Polyester 900D",
          "colors": [
            "schwarz"
          ],
          "price_from_eur": 22.5,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 24.9
            },
            {
              "qty": 250,
              "eur": 22.5
            }
          ],
          "min_order_qty": 10,
          "print_methods": [
            "Siebdruck",
            "Lasergravur"
          ],
          "print_area": "160 x 160 mm",
          "weight_kg": 0.78,
          "eco": false,
          "image_url": "https://img.halfar.com/1830.jpg",
          "stock_qty": 0,
          "lead_time_days": 21,
          "description": "Business-Rucksack mit gepolstertem 15\" Laptopfach und USB-Durchführung.",
          "_issues": []
        }
      ]
    },
    {
      "id": "mbw",
      "name": "mbw (Giveaways & Plush)",
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
          "invalid_price": 1,
          "missing_required": 1,
          "invalid_gtin": 1
        }
      },
      "products": [
        {
          "sku": "SRC-MBW-MB-75",
          "supplier_sku": "MB-75",
          "_supplier": "mbw",
          "_supplier_name": "mbw (Giveaways & Plush)",
          "ean": "4055835007508",
          "name": "Schmoozies® Bär",
          "manufacturer": "mbw",
          "category": "Giveaways",
          "_raw_category": "plush",
          "material": "Mikrofaser",
          "colors": [
            "braun",
            "beige"
          ],
          "price_from_eur": 1.4,
          "price_tiers": [
            {
              "qty": 250,
              "eur": 1.95
            },
            {
              "qty": 1000,
              "eur": 1.65
            },
            {
              "qty": 5000,
              "eur": 1.4
            }
          ],
          "min_order_qty": 250,
          "print_methods": [
            "Digitaldruck"
          ],
          "print_area": "30 x 20 mm",
          "weight_kg": 0.045,
          "eco": false,
          "image_url": "https://img.mbw.de/MB-75.jpg",
          "stock_qty": 60000,
          "lead_time_days": 18,
          "description": "Plüsch-Bär als Displayreiniger, ideal als sympathisches Werbegeschenk.",
          "_issues": []
        },
        {
          "sku": "SRC-MBW-MB-76",
          "supplier_sku": "MB-76",
          "_supplier": "mbw",
          "_supplier_name": "mbw (Giveaways & Plush)",
          "ean": "4055835007607",
          "name": "MiniFeet® Schlüsselanhänger",
          "manufacturer": "mbw",
          "category": "Giveaways",
          "_raw_category": "giveaway",
          "material": "Plüsch",
          "colors": [
            "bunt"
          ],
          "price_from_eur": 0.79,
          "price_tiers": [
            {
              "qty": 250,
              "eur": 1.2
            },
            {
              "qty": 1000,
              "eur": 0.98
            },
            {
              "qty": 5000,
              "eur": 0.79
            }
          ],
          "min_order_qty": 500,
          "print_methods": [
            "Doming"
          ],
          "print_area": "25 x 15 mm",
          "weight_kg": 0.022,
          "eco": false,
          "image_url": "https://img.mbw.de/MB-76.jpg",
          "stock_qty": 90000,
          "lead_time_days": 15,
          "description": "Kleiner Plüsch-Schlüsselanhänger, vielseitig als Streuartikel einsetzbar.",
          "_issues": []
        },
        {
          "sku": "SRC-MBW-MB-77",
          "supplier_sku": "MB-77",
          "_supplier": "mbw",
          "_supplier_name": "mbw (Giveaways & Plush)",
          "ean": "4055835007706",
          "name": "Squeezies® Stressball",
          "manufacturer": "mbw",
          "category": "Giveaways",
          "_raw_category": "giveaway",
          "material": "PU-Schaum",
          "colors": [
            "rot",
            "blau",
            "grün"
          ],
          "price_from_eur": -0.5,
          "price_tiers": [
            {
              "qty": 250,
              "eur": -0.5
            },
            {
              "qty": 1000,
              "eur": 0.42
            },
            {
              "qty": 5000,
              "eur": 0.35
            }
          ],
          "min_order_qty": 500,
          "print_methods": [
            "Tampondruck"
          ],
          "print_area": "Ø 30 mm",
          "weight_kg": 0.028,
          "eco": false,
          "image_url": "https://img.mbw.de/MB-77.jpg",
          "stock_qty": 120000,
          "lead_time_days": 12,
          "description": "Anti-Stressball zum Kneten, klassischer Messe-Giveaway.",
          "_issues": [
            {
              "field": "price_tiers",
              "code": "invalid_price",
              "severity": "error",
              "message": "A price scale has a value ≤ 0"
            }
          ]
        },
        {
          "sku": "SRC-MBW-MB-78",
          "supplier_sku": "MB-78",
          "_supplier": "mbw",
          "_supplier_name": "mbw (Giveaways & Plush)",
          "ean": "4055835007805",
          "name": "Schmoozies® Smiley",
          "manufacturer": "mbw",
          "category": "Giveaways",
          "_raw_category": "plush",
          "material": "Mikrofaser",
          "colors": [
            "gelb"
          ],
          "price_from_eur": 1.55,
          "price_tiers": [
            {
              "qty": 250,
              "eur": 2.1
            },
            {
              "qty": 1000,
              "eur": 1.8
            },
            {
              "qty": 5000,
              "eur": 1.55
            }
          ],
          "min_order_qty": null,
          "print_methods": [
            "Digitaldruck"
          ],
          "print_area": "30 x 20 mm",
          "weight_kg": 0.04,
          "eco": false,
          "image_url": "https://img.mbw.de/MB-78.jpg",
          "stock_qty": 35000,
          "lead_time_days": 18,
          "description": "Lächelnder Schmoozie als Bildschirmreiniger und Glücksbringer.",
          "_issues": [
            {
              "field": "min_order_qty",
              "code": "missing_required",
              "severity": "error",
              "message": "Required field 'min_order_qty' is empty"
            }
          ]
        },
        {
          "sku": "SRC-MBW-MB-80",
          "supplier_sku": "MB-80",
          "_supplier": "mbw",
          "_supplier_name": "mbw (Giveaways & Plush)",
          "ean": "405583500",
          "name": "Plüsch-Elefant MAXI",
          "manufacturer": "mbw",
          "category": "Giveaways",
          "_raw_category": "plueschtiere",
          "material": "Plüsch",
          "colors": [
            "grau"
          ],
          "price_from_eur": 5.6,
          "price_tiers": [
            {
              "qty": 250,
              "eur": 6.9
            },
            {
              "qty": 1000,
              "eur": 6.2
            },
            {
              "qty": 5000,
              "eur": 5.6
            }
          ],
          "min_order_qty": 100,
          "print_methods": [
            "Stickerei"
          ],
          "print_area": "40 x 30 mm",
          "weight_kg": 0.18,
          "eco": false,
          "image_url": "https://img.mbw.de/MB-80.jpg",
          "stock_qty": 4000,
          "lead_time_days": 25,
          "description": "Großes Plüschtier mit individuell besticktem Halstuch.",
          "_issues": [
            {
              "field": "ean",
              "code": "invalid_gtin",
              "severity": "warning",
              "message": "EAN '405583500' is not a valid EAN-13"
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
        "rows_clean": 2,
        "rows_warn_only": 2,
        "rows_with_errors": 1,
        "error_count": 1,
        "warning_count": 3,
        "score": 64.0,
        "code_tally": {
          "invalid_price": 1,
          "missing_image": 1,
          "unmapped_category": 1,
          "single_price_scale": 1
        }
      },
      "products": [
        {
          "sku": "SRC-REFLECTS-RF-10",
          "supplier_sku": "RF-10",
          "_supplier": "reflects",
          "_supplier_name": "REFLECTS (Promidata feed)",
          "ean": "4034127001004",
          "name": "REEVES drinking bottle",
          "manufacturer": "REFLECTS",
          "category": "Drinkware",
          "_raw_category": "drinkware",
          "material": "Tritan",
          "colors": [
            "transparent",
            "blau",
            "rot"
          ],
          "price_from_eur": 2.55,
          "price_tiers": [
            {
              "qty": 72,
              "eur": 3.4
            },
            {
              "qty": 288,
              "eur": 2.95
            },
            {
              "qty": 1008,
              "eur": 2.55
            }
          ],
          "min_order_qty": 72,
          "print_methods": [
            "Tampondruck",
            "Lasergravur",
            "Digitaldruck"
          ],
          "print_area": "50 x 80 mm",
          "weight_kg": 0.095,
          "eco": true,
          "image_url": "https://img.reflects.com/RF-10.jpg",
          "stock_qty": 22000,
          "lead_time_days": 14,
          "description": "BPA-freie Trinkflasche aus Tritan mit auslaufsicherem Schraubverschluss.",
          "_issues": []
        },
        {
          "sku": "SRC-REFLECTS-RF-11",
          "supplier_sku": "RF-11",
          "_supplier": "reflects",
          "_supplier_name": "REFLECTS (Promidata feed)",
          "ean": "4034127001103",
          "name": "ABERDEEN thermo mug",
          "manufacturer": "REFLECTS",
          "category": "Drinkware",
          "_raw_category": "drinkware",
          "material": "Edelstahl",
          "colors": [
            "silber",
            "schwarz",
            "weiss"
          ],
          "price_from_eur": 5.4,
          "price_tiers": [
            {
              "qty": 48,
              "eur": 6.9
            },
            {
              "qty": 144,
              "eur": 6.1
            },
            {
              "qty": 504,
              "eur": 5.4
            }
          ],
          "min_order_qty": 48,
          "print_methods": [
            "Lasergravur",
            "Digitaldruck"
          ],
          "print_area": "40 x 60 mm",
          "weight_kg": 0.28,
          "eco": false,
          "image_url": "https://img.reflects.com/RF-11.jpg",
          "stock_qty": 9000,
          "lead_time_days": 16,
          "description": "Doppelwandiger Edelstahl-Thermobecher, hält Getränke bis zu 6 Stunden warm.",
          "_issues": []
        },
        {
          "sku": "SRC-REFLECTS-RF-12",
          "supplier_sku": "RF-12",
          "_supplier": "reflects",
          "_supplier_name": "REFLECTS (Promidata feed)",
          "ean": "4034127001202",
          "name": "DAKAR power bank 5000",
          "manufacturer": "REFLECTS",
          "category": "Technology",
          "_raw_category": "tech",
          "material": "ABS / Aluminium",
          "colors": [
            "schwarz",
            "weiss"
          ],
          "price_from_eur": 0.0,
          "price_tiers": [
            {
              "qty": 50,
              "eur": 0.0
            },
            {
              "qty": 200,
              "eur": 8.2
            },
            {
              "qty": 500,
              "eur": 7.4
            }
          ],
          "min_order_qty": 50,
          "print_methods": [
            "Lasergravur",
            "Digitaldruck"
          ],
          "print_area": "40 x 40 mm",
          "weight_kg": 0.12,
          "eco": false,
          "image_url": "https://img.reflects.com/RF-12.jpg",
          "stock_qty": 5000,
          "lead_time_days": 20,
          "description": "Kompakte 5000 mAh Powerbank mit USB-C Eingang und LED-Statusanzeige.",
          "_issues": [
            {
              "field": "price_tiers",
              "code": "invalid_price",
              "severity": "error",
              "message": "A price scale has a value ≤ 0"
            }
          ]
        },
        {
          "sku": "SRC-REFLECTS-RF-13",
          "supplier_sku": "RF-13",
          "_supplier": "reflects",
          "_supplier_name": "REFLECTS (Promidata feed)",
          "ean": "4034127001301",
          "name": "MONTERREY USB-C cable",
          "manufacturer": "REFLECTS",
          "category": "",
          "_raw_category": "accessories",
          "material": "Nylon",
          "colors": [
            "schwarz"
          ],
          "price_from_eur": 1.3,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 1.9
            },
            {
              "qty": 500,
              "eur": 1.55
            },
            {
              "qty": 1000,
              "eur": 1.3
            }
          ],
          "min_order_qty": 100,
          "print_methods": [
            "Doming"
          ],
          "print_area": "20 x 10 mm",
          "weight_kg": 0.035,
          "eco": false,
          "image_url": "",
          "stock_qty": 30000,
          "lead_time_days": 12,
          "description": "3-in-1 Ladekabel mit Nylonummantelung und individuellem Doming-Label.",
          "_issues": [
            {
              "field": "image_url",
              "code": "missing_image",
              "severity": "warning",
              "message": "Product image missing"
            },
            {
              "field": "category",
              "code": "unmapped_category",
              "severity": "warning",
              "message": "Category 'accessories' not mapped to SOURCE taxonomy"
            }
          ]
        },
        {
          "sku": "SRC-REFLECTS-RF-14",
          "supplier_sku": "RF-14",
          "_supplier": "reflects",
          "_supplier_name": "REFLECTS (Promidata feed)",
          "ean": "4034127001400",
          "name": "SANTOS coffee-to-go cup",
          "manufacturer": "REFLECTS",
          "category": "Drinkware",
          "_raw_category": "drinkware",
          "material": "Bambusfaser",
          "colors": [
            "natur",
            "grün"
          ],
          "price_from_eur": 2.8,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 2.8
            }
          ],
          "min_order_qty": 100,
          "print_methods": [
            "Tampondruck"
          ],
          "print_area": "45 x 60 mm",
          "weight_kg": 0.11,
          "eco": true,
          "image_url": "https://img.reflects.com/RF-14.jpg",
          "stock_qty": 14000,
          "lead_time_days": 14,
          "description": "Nachhaltiger Coffee-to-go Becher aus Bambusfaser mit Silikondeckel und -manschette.",
          "_issues": [
            {
              "field": "price_tiers",
              "code": "single_price_scale",
              "severity": "warning",
              "message": "Only one price scale — promotional pricing needs quantity tiers"
            }
          ]
        }
      ]
    },
    {
      "id": "uma",
      "name": "uma Schreibgeräte",
      "format": "BMEcat 1.2 XML",
      "summary": {
        "records": 5,
        "rows_clean": 3,
        "rows_warn_only": 2,
        "rows_with_errors": 0,
        "error_count": 0,
        "warning_count": 3,
        "score": 84.0,
        "code_tally": {
          "single_price_scale": 1,
          "missing_gtin": 1,
          "unmapped_category": 1
        }
      },
      "products": [
        {
          "sku": "SRC-UMA-0-9800",
          "supplier_sku": "0-9800",
          "_supplier": "uma",
          "_supplier_name": "uma Schreibgeräte",
          "ean": "4250369812349",
          "name": "uma RECYCLED PET Pen",
          "manufacturer": "uma",
          "category": "Writing",
          "_raw_category": "pens",
          "material": "rPET",
          "colors": [
            "blau",
            "schwarz",
            "rot"
          ],
          "price_from_eur": 0.42,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 0.59
            },
            {
              "qty": 500,
              "eur": 0.49
            },
            {
              "qty": 1000,
              "eur": 0.42
            }
          ],
          "min_order_qty": 100,
          "print_methods": [
            "Tampondruck",
            "Lasergravur"
          ],
          "print_area": "40 x 6 mm",
          "weight_kg": 0.011,
          "eco": true,
          "image_url": "https://img.uma-pen.com/0-9800.jpg",
          "stock_qty": 84000,
          "lead_time_days": 10,
          "description": "Druckkugelschreiber aus recyceltem PET mit blauschreibender Großraummine.",
          "_issues": []
        },
        {
          "sku": "SRC-UMA-0-9801",
          "supplier_sku": "0-9801",
          "_supplier": "uma",
          "_supplier_name": "uma Schreibgeräte",
          "ean": "4250369812356",
          "name": "uma STRAIGHT SI",
          "manufacturer": "uma",
          "category": "Writing",
          "_raw_category": "pens",
          "material": "ABS",
          "colors": [
            "weiss",
            "blau",
            "grün",
            "rot"
          ],
          "price_from_eur": 0.31,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 0.45
            },
            {
              "qty": 500,
              "eur": 0.37
            },
            {
              "qty": 1000,
              "eur": 0.31
            }
          ],
          "min_order_qty": 100,
          "print_methods": [
            "Tampondruck"
          ],
          "print_area": "45 x 6 mm",
          "weight_kg": 0.009,
          "eco": false,
          "image_url": "https://img.uma-pen.com/0-9801.jpg",
          "stock_qty": 152000,
          "lead_time_days": 8,
          "description": "Klassischer Werbekugelschreiber mit großer Werbefläche und mattem Finish.",
          "_issues": []
        },
        {
          "sku": "SRC-UMA-0-9803",
          "supplier_sku": "0-9803",
          "_supplier": "uma",
          "_supplier_name": "uma Schreibgeräte",
          "ean": "",
          "name": "uma FLEXI soft",
          "manufacturer": "uma",
          "category": "Writing",
          "_raw_category": "pens",
          "material": "ABS",
          "colors": [
            "schwarz"
          ],
          "price_from_eur": 0.69,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 0.69
            }
          ],
          "min_order_qty": 100,
          "print_methods": [
            "Tampondruck"
          ],
          "print_area": "40 x 5 mm",
          "weight_kg": 0.01,
          "eco": false,
          "image_url": "https://img.uma-pen.com/0-9803.jpg",
          "stock_qty": 12000,
          "lead_time_days": 12,
          "description": "Soft-Touch Kugelschreiber mit angenehmer Griffzone.",
          "_issues": [
            {
              "field": "price_tiers",
              "code": "single_price_scale",
              "severity": "warning",
              "message": "Only one price scale — promotional pricing needs quantity tiers"
            },
            {
              "field": "ean",
              "code": "missing_gtin",
              "severity": "warning",
              "message": "EAN/GTIN missing"
            }
          ]
        },
        {
          "sku": "SRC-UMA-0-9804",
          "supplier_sku": "0-9804",
          "_supplier": "uma",
          "_supplier_name": "uma Schreibgeräte",
          "ean": "4250369812370",
          "name": "uma SLIM cosmo",
          "manufacturer": "uma",
          "category": "Writing",
          "_raw_category": "pens",
          "material": "Aluminium",
          "colors": [
            "silber",
            "blau",
            "anthrazit"
          ],
          "price_from_eur": 0.74,
          "price_tiers": [
            {
              "qty": 100,
              "eur": 0.95
            },
            {
              "qty": 500,
              "eur": 0.82
            },
            {
              "qty": 1000,
              "eur": 0.74
            }
          ],
          "min_order_qty": 100,
          "print_methods": [
            "Lasergravur"
          ],
          "print_area": "50 x 6 mm",
          "weight_kg": 0.014,
          "eco": false,
          "image_url": "https://img.uma-pen.com/0-9804.jpg",
          "stock_qty": 47000,
          "lead_time_days": 10,
          "description": "Eleganter Aluminium-Drehkugelschreiber, ideal für Lasergravur.",
          "_issues": []
        },
        {
          "sku": "SRC-UMA-0-9806",
          "supplier_sku": "0-9806",
          "_supplier": "uma",
          "_supplier_name": "uma Schreibgeräte",
          "ean": "4250369812394",
          "name": "uma Pencil Set Holzbox",
          "manufacturer": "uma",
          "category": "",
          "_raw_category": "stationery",
          "material": "Holz",
          "colors": [
            "natur"
          ],
          "price_from_eur": 2.6,
          "price_tiers": [
            {
              "qty": 50,
              "eur": 3.2
            },
            {
              "qty": 200,
              "eur": 2.85
            },
            {
              "qty": 500,
              "eur": 2.6
            }
          ],
          "min_order_qty": 50,
          "print_methods": [
            "Lasergravur"
          ],
          "print_area": "60 x 20 mm",
          "weight_kg": 0.12,
          "eco": true,
          "image_url": "https://img.uma-pen.com/0-9806.jpg",
          "stock_qty": 6000,
          "lead_time_days": 15,
          "description": "Bleistift-Set in nachhaltiger Holzbox mit Schiebedeckel.",
          "_issues": [
            {
              "field": "category",
              "code": "unmapped_category",
              "severity": "warning",
              "message": "Category 'stationery' not mapped to SOURCE taxonomy"
            }
          ]
        }
      ]
    }
  ],
  "catalog": [
    {
      "sku": "SRC-HALFAR-1816",
      "supplier_sku": "1816",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375018169",
      "name": "Rucksack EVENT",
      "manufacturer": "Halfar",
      "category": "Bags & Travel",
      "material": "Polyester 600D",
      "colors": [
        "schwarz",
        "navy",
        "rot"
      ],
      "price_from_eur": 7.2,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 8.9
        },
        {
          "qty": 250,
          "eur": 7.95
        },
        {
          "qty": 500,
          "eur": 7.2
        }
      ],
      "min_order_qty": 25,
      "print_methods": [
        "Siebdruck",
        "Transferdruck"
      ],
      "print_area": "200 x 200 mm",
      "weight_kg": 0.42,
      "eco": false,
      "image_url": "https://img.halfar.com/1816.jpg",
      "stock_qty": 3200,
      "lead_time_days": 14,
      "description": "Geräumiger Eventrucksack mit gepolstertem Rückenteil und Fronttasche."
    },
    {
      "sku": "SRC-HALFAR-1820",
      "supplier_sku": "1820",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375018206",
      "name": "Citybag GROOVE",
      "manufacturer": "Halfar",
      "category": "Bags & Travel",
      "material": "rPET",
      "colors": [
        "schwarz",
        "grau"
      ],
      "price_from_eur": 5.3,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 6.4
        },
        {
          "qty": 250,
          "eur": 5.8
        },
        {
          "qty": 500,
          "eur": 5.3
        }
      ],
      "min_order_qty": 25,
      "print_methods": [
        "Siebdruck"
      ],
      "print_area": "150 x 150 mm",
      "weight_kg": 0.3,
      "eco": false,
      "image_url": "https://img.halfar.com/1820.jpg",
      "stock_qty": 1800,
      "lead_time_days": 14,
      "description": "Nachhaltige Umhängetasche aus recyceltem Polyester."
    },
    {
      "sku": "SRC-HALFAR-1822",
      "supplier_sku": "1822",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375018220",
      "name": "Sportsbag MOVE",
      "manufacturer": "Halfar",
      "category": "Bags & Travel",
      "material": "Polyester",
      "colors": [
        "blau",
        "schwarz"
      ],
      "price_from_eur": 8.1,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 9.5
        },
        {
          "qty": 250,
          "eur": 8.7
        },
        {
          "qty": 500,
          "eur": 8.1
        }
      ],
      "min_order_qty": 25,
      "print_methods": [
        "Transferdruck"
      ],
      "print_area": "180 x 120 mm",
      "weight_kg": 0.55,
      "eco": false,
      "image_url": "",
      "stock_qty": 950,
      "lead_time_days": 21,
      "description": "Robuste Sporttasche mit separatem Schuhfach und Tragegurt."
    },
    {
      "sku": "SRC-HALFAR-1825",
      "supplier_sku": "1825",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375018251",
      "name": "Shopper BASIC",
      "manufacturer": "Halfar",
      "category": "Bags & Travel",
      "material": "Baumwolle",
      "colors": [
        "natur",
        "schwarz"
      ],
      "price_from_eur": 1.45,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 1.95
        },
        {
          "qty": 250,
          "eur": 1.7
        },
        {
          "qty": 500,
          "eur": 1.45
        }
      ],
      "min_order_qty": 50,
      "print_methods": [],
      "print_area": "250 x 250 mm",
      "weight_kg": 0.12,
      "eco": false,
      "image_url": "https://img.halfar.com/1825.jpg",
      "stock_qty": 12000,
      "lead_time_days": 10,
      "description": "Baumwolltasche."
    },
    {
      "sku": "SRC-HALFAR-1830",
      "supplier_sku": "1830",
      "_supplier": "halfar",
      "_supplier_name": "Halfar System (Bags)",
      "ean": "4040375018305",
      "name": "Laptop-Rucksack PRO",
      "manufacturer": "Halfar",
      "category": "Bags & Travel",
      "material": "Polyester 900D",
      "colors": [
        "schwarz"
      ],
      "price_from_eur": 22.5,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 24.9
        },
        {
          "qty": 250,
          "eur": 22.5
        }
      ],
      "min_order_qty": 10,
      "print_methods": [
        "Siebdruck",
        "Lasergravur"
      ],
      "print_area": "160 x 160 mm",
      "weight_kg": 0.78,
      "eco": false,
      "image_url": "https://img.halfar.com/1830.jpg",
      "stock_qty": 0,
      "lead_time_days": 21,
      "description": "Business-Rucksack mit gepolstertem 15\" Laptopfach und USB-Durchführung."
    },
    {
      "sku": "SRC-MBW-MB-75",
      "supplier_sku": "MB-75",
      "_supplier": "mbw",
      "_supplier_name": "mbw (Giveaways & Plush)",
      "ean": "4055835007508",
      "name": "Schmoozies® Bär",
      "manufacturer": "mbw",
      "category": "Giveaways",
      "material": "Mikrofaser",
      "colors": [
        "braun",
        "beige"
      ],
      "price_from_eur": 1.4,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 1.95
        },
        {
          "qty": 1000,
          "eur": 1.65
        },
        {
          "qty": 5000,
          "eur": 1.4
        }
      ],
      "min_order_qty": 250,
      "print_methods": [
        "Digitaldruck"
      ],
      "print_area": "30 x 20 mm",
      "weight_kg": 0.045,
      "eco": false,
      "image_url": "https://img.mbw.de/MB-75.jpg",
      "stock_qty": 60000,
      "lead_time_days": 18,
      "description": "Plüsch-Bär als Displayreiniger, ideal als sympathisches Werbegeschenk."
    },
    {
      "sku": "SRC-MBW-MB-76",
      "supplier_sku": "MB-76",
      "_supplier": "mbw",
      "_supplier_name": "mbw (Giveaways & Plush)",
      "ean": "4055835007607",
      "name": "MiniFeet® Schlüsselanhänger",
      "manufacturer": "mbw",
      "category": "Giveaways",
      "material": "Plüsch",
      "colors": [
        "bunt"
      ],
      "price_from_eur": 0.79,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 1.2
        },
        {
          "qty": 1000,
          "eur": 0.98
        },
        {
          "qty": 5000,
          "eur": 0.79
        }
      ],
      "min_order_qty": 500,
      "print_methods": [
        "Doming"
      ],
      "print_area": "25 x 15 mm",
      "weight_kg": 0.022,
      "eco": false,
      "image_url": "https://img.mbw.de/MB-76.jpg",
      "stock_qty": 90000,
      "lead_time_days": 15,
      "description": "Kleiner Plüsch-Schlüsselanhänger, vielseitig als Streuartikel einsetzbar."
    },
    {
      "sku": "SRC-MBW-MB-80",
      "supplier_sku": "MB-80",
      "_supplier": "mbw",
      "_supplier_name": "mbw (Giveaways & Plush)",
      "ean": "405583500",
      "name": "Plüsch-Elefant MAXI",
      "manufacturer": "mbw",
      "category": "Giveaways",
      "material": "Plüsch",
      "colors": [
        "grau"
      ],
      "price_from_eur": 5.6,
      "price_tiers": [
        {
          "qty": 250,
          "eur": 6.9
        },
        {
          "qty": 1000,
          "eur": 6.2
        },
        {
          "qty": 5000,
          "eur": 5.6
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Stickerei"
      ],
      "print_area": "40 x 30 mm",
      "weight_kg": 0.18,
      "eco": false,
      "image_url": "https://img.mbw.de/MB-80.jpg",
      "stock_qty": 4000,
      "lead_time_days": 25,
      "description": "Großes Plüschtier mit individuell besticktem Halstuch."
    },
    {
      "sku": "SRC-REFLECTS-RF-10",
      "supplier_sku": "RF-10",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127001004",
      "name": "REEVES drinking bottle",
      "manufacturer": "REFLECTS",
      "category": "Drinkware",
      "material": "Tritan",
      "colors": [
        "transparent",
        "blau",
        "rot"
      ],
      "price_from_eur": 2.55,
      "price_tiers": [
        {
          "qty": 72,
          "eur": 3.4
        },
        {
          "qty": 288,
          "eur": 2.95
        },
        {
          "qty": 1008,
          "eur": 2.55
        }
      ],
      "min_order_qty": 72,
      "print_methods": [
        "Tampondruck",
        "Lasergravur",
        "Digitaldruck"
      ],
      "print_area": "50 x 80 mm",
      "weight_kg": 0.095,
      "eco": true,
      "image_url": "https://img.reflects.com/RF-10.jpg",
      "stock_qty": 22000,
      "lead_time_days": 14,
      "description": "BPA-freie Trinkflasche aus Tritan mit auslaufsicherem Schraubverschluss."
    },
    {
      "sku": "SRC-REFLECTS-RF-11",
      "supplier_sku": "RF-11",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127001103",
      "name": "ABERDEEN thermo mug",
      "manufacturer": "REFLECTS",
      "category": "Drinkware",
      "material": "Edelstahl",
      "colors": [
        "silber",
        "schwarz",
        "weiss"
      ],
      "price_from_eur": 5.4,
      "price_tiers": [
        {
          "qty": 48,
          "eur": 6.9
        },
        {
          "qty": 144,
          "eur": 6.1
        },
        {
          "qty": 504,
          "eur": 5.4
        }
      ],
      "min_order_qty": 48,
      "print_methods": [
        "Lasergravur",
        "Digitaldruck"
      ],
      "print_area": "40 x 60 mm",
      "weight_kg": 0.28,
      "eco": false,
      "image_url": "https://img.reflects.com/RF-11.jpg",
      "stock_qty": 9000,
      "lead_time_days": 16,
      "description": "Doppelwandiger Edelstahl-Thermobecher, hält Getränke bis zu 6 Stunden warm."
    },
    {
      "sku": "SRC-REFLECTS-RF-13",
      "supplier_sku": "RF-13",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127001301",
      "name": "MONTERREY USB-C cable",
      "manufacturer": "REFLECTS",
      "category": "",
      "material": "Nylon",
      "colors": [
        "schwarz"
      ],
      "price_from_eur": 1.3,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 1.9
        },
        {
          "qty": 500,
          "eur": 1.55
        },
        {
          "qty": 1000,
          "eur": 1.3
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Doming"
      ],
      "print_area": "20 x 10 mm",
      "weight_kg": 0.035,
      "eco": false,
      "image_url": "",
      "stock_qty": 30000,
      "lead_time_days": 12,
      "description": "3-in-1 Ladekabel mit Nylonummantelung und individuellem Doming-Label."
    },
    {
      "sku": "SRC-REFLECTS-RF-14",
      "supplier_sku": "RF-14",
      "_supplier": "reflects",
      "_supplier_name": "REFLECTS (Promidata feed)",
      "ean": "4034127001400",
      "name": "SANTOS coffee-to-go cup",
      "manufacturer": "REFLECTS",
      "category": "Drinkware",
      "material": "Bambusfaser",
      "colors": [
        "natur",
        "grün"
      ],
      "price_from_eur": 2.8,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 2.8
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Tampondruck"
      ],
      "print_area": "45 x 60 mm",
      "weight_kg": 0.11,
      "eco": true,
      "image_url": "https://img.reflects.com/RF-14.jpg",
      "stock_qty": 14000,
      "lead_time_days": 14,
      "description": "Nachhaltiger Coffee-to-go Becher aus Bambusfaser mit Silikondeckel und -manschette."
    },
    {
      "sku": "SRC-UMA-0-9800",
      "supplier_sku": "0-9800",
      "_supplier": "uma",
      "_supplier_name": "uma Schreibgeräte",
      "ean": "4250369812349",
      "name": "uma RECYCLED PET Pen",
      "manufacturer": "uma",
      "category": "Writing",
      "material": "rPET",
      "colors": [
        "blau",
        "schwarz",
        "rot"
      ],
      "price_from_eur": 0.42,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 0.59
        },
        {
          "qty": 500,
          "eur": 0.49
        },
        {
          "qty": 1000,
          "eur": 0.42
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Tampondruck",
        "Lasergravur"
      ],
      "print_area": "40 x 6 mm",
      "weight_kg": 0.011,
      "eco": true,
      "image_url": "https://img.uma-pen.com/0-9800.jpg",
      "stock_qty": 84000,
      "lead_time_days": 10,
      "description": "Druckkugelschreiber aus recyceltem PET mit blauschreibender Großraummine."
    },
    {
      "sku": "SRC-UMA-0-9801",
      "supplier_sku": "0-9801",
      "_supplier": "uma",
      "_supplier_name": "uma Schreibgeräte",
      "ean": "4250369812356",
      "name": "uma STRAIGHT SI",
      "manufacturer": "uma",
      "category": "Writing",
      "material": "ABS",
      "colors": [
        "weiss",
        "blau",
        "grün",
        "rot"
      ],
      "price_from_eur": 0.31,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 0.45
        },
        {
          "qty": 500,
          "eur": 0.37
        },
        {
          "qty": 1000,
          "eur": 0.31
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Tampondruck"
      ],
      "print_area": "45 x 6 mm",
      "weight_kg": 0.009,
      "eco": false,
      "image_url": "https://img.uma-pen.com/0-9801.jpg",
      "stock_qty": 152000,
      "lead_time_days": 8,
      "description": "Klassischer Werbekugelschreiber mit großer Werbefläche und mattem Finish."
    },
    {
      "sku": "SRC-UMA-0-9803",
      "supplier_sku": "0-9803",
      "_supplier": "uma",
      "_supplier_name": "uma Schreibgeräte",
      "ean": "",
      "name": "uma FLEXI soft",
      "manufacturer": "uma",
      "category": "Writing",
      "material": "ABS",
      "colors": [
        "schwarz"
      ],
      "price_from_eur": 0.69,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 0.69
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Tampondruck"
      ],
      "print_area": "40 x 5 mm",
      "weight_kg": 0.01,
      "eco": false,
      "image_url": "https://img.uma-pen.com/0-9803.jpg",
      "stock_qty": 12000,
      "lead_time_days": 12,
      "description": "Soft-Touch Kugelschreiber mit angenehmer Griffzone."
    },
    {
      "sku": "SRC-UMA-0-9804",
      "supplier_sku": "0-9804",
      "_supplier": "uma",
      "_supplier_name": "uma Schreibgeräte",
      "ean": "4250369812370",
      "name": "uma SLIM cosmo",
      "manufacturer": "uma",
      "category": "Writing",
      "material": "Aluminium",
      "colors": [
        "silber",
        "blau",
        "anthrazit"
      ],
      "price_from_eur": 0.74,
      "price_tiers": [
        {
          "qty": 100,
          "eur": 0.95
        },
        {
          "qty": 500,
          "eur": 0.82
        },
        {
          "qty": 1000,
          "eur": 0.74
        }
      ],
      "min_order_qty": 100,
      "print_methods": [
        "Lasergravur"
      ],
      "print_area": "50 x 6 mm",
      "weight_kg": 0.014,
      "eco": false,
      "image_url": "https://img.uma-pen.com/0-9804.jpg",
      "stock_qty": 47000,
      "lead_time_days": 10,
      "description": "Eleganter Aluminium-Drehkugelschreiber, ideal für Lasergravur."
    },
    {
      "sku": "SRC-UMA-0-9806",
      "supplier_sku": "0-9806",
      "_supplier": "uma",
      "_supplier_name": "uma Schreibgeräte",
      "ean": "4250369812394",
      "name": "uma Pencil Set Holzbox",
      "manufacturer": "uma",
      "category": "",
      "material": "Holz",
      "colors": [
        "natur"
      ],
      "price_from_eur": 2.6,
      "price_tiers": [
        {
          "qty": 50,
          "eur": 3.2
        },
        {
          "qty": 200,
          "eur": 2.85
        },
        {
          "qty": 500,
          "eur": 2.6
        }
      ],
      "min_order_qty": 50,
      "print_methods": [
        "Lasergravur"
      ],
      "print_area": "60 x 20 mm",
      "weight_kg": 0.12,
      "eco": true,
      "image_url": "https://img.uma-pen.com/0-9806.jpg",
      "stock_qty": 6000,
      "lead_time_days": 15,
      "description": "Bleistift-Set in nachhaltiger Holzbox mit Schiebedeckel."
    }
  ],
  "category_breakdown": {
    "Bags & Travel": 5,
    "Writing": 4,
    "Giveaways": 3,
    "Drinkware": 3,
    "Uncategorized": 2
  },
  "issue_totals": {
    "missing_image": 2,
    "invalid_price": 2,
    "unmapped_category": 2,
    "single_price_scale": 2,
    "missing_print_method": 1,
    "short_description": 1,
    "missing_required": 1,
    "invalid_gtin": 1,
    "missing_gtin": 1
  },
  "diff": {
    "added": 17,
    "changed": 0,
    "removed": 0,
    "total": 17
  }
};
