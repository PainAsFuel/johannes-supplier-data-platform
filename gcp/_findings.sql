WITH s AS (SELECT * FROM source-data-platform.staging.products),
dup AS (SELECT supplier, sku FROM s GROUP BY supplier, sku HAVING COUNT(*) > 1)

SELECT supplier, supplier_name, sku, supplier_sku, field, code, severity, message FROM (
  SELECT supplier, supplier_name, sku, supplier_sku, 'name' field, 'missing_required' code, 'error' severity, "Pflichtfeld 'name' fehlt" message FROM s WHERE name IS NULL OR name = ''
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'supplier_sku', 'missing_required', 'error', "Pflichtfeld 'supplier_sku' fehlt" FROM s WHERE supplier_sku IS NULL OR supplier_sku = ''
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'price_tiers', 'missing_price', 'error', 'Keine Preisstaffel' FROM s WHERE ARRAY_LENGTH(price_tiers) = 0
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'price_from_eur', 'invalid_price', 'error', 'Preis ≤ 0' FROM s WHERE price_from_eur IS NOT NULL AND price_from_eur <= 0
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'min_order_qty', 'missing_required', 'error', 'Mindestbestellmenge fehlt' FROM s WHERE min_order_qty IS NULL
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'stock_qty', 'invalid_stock', 'error', 'Negativer Bestand' FROM s WHERE stock_qty < 0
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'price_tiers', 'single_price_scale', 'warning', 'Nur eine Preisstaffel' FROM s WHERE ARRAY_LENGTH(price_tiers) = 1
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'ean', 'missing_gtin', 'warning', 'EAN/GTIN fehlt' FROM s WHERE ean IS NULL OR CAST(ean AS STRING) = ''
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'ean', 'invalid_gtin', 'warning', 'Ungültige EAN-13' FROM s WHERE ean IS NOT NULL AND CAST(ean AS STRING) != '' AND NOT REGEXP_CONTAINS(CAST(ean AS STRING), r'^[0-9]{13}$')
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'image_url', 'missing_image', 'warning', 'Produktbild fehlt' FROM s WHERE image_url IS NULL OR image_url = ''
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'image_url', 'invalid_image', 'warning', 'Ungültige Bild-URL' FROM s WHERE image_url IS NOT NULL AND image_url != '' AND NOT REGEXP_CONTAINS(image_url, r'(?i)^https://.+\.(jpg|jpeg|png|webp|gif)$')
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'print_methods', 'missing_print_method', 'warning', 'Keine Veredelungsart' FROM s WHERE ARRAY_LENGTH(print_methods) = 0
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'category', 'unmapped_category', 'warning', 'Kategorie nicht zugeordnet' FROM s WHERE category IS NULL OR category = ''
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'description', 'short_description', 'warning', 'Beschreibung zu kurz' FROM s WHERE LENGTH(TRIM(COALESCE(description, ''))) < 30
  UNION ALL SELECT supplier, supplier_name, sku, supplier_sku, 'colors', 'no_colors', 'warning', 'Keine Farbvarianten' FROM s WHERE ARRAY_LENGTH(colors) = 0
  UNION ALL SELECT s.supplier, s.supplier_name, s.sku, s.supplier_sku, 'sku', 'duplicate_sku', 'error', 'Doppelte SKU im Feed' FROM s JOIN dup USING (supplier, sku)
)