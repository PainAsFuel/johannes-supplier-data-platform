"""
Execute the Dataform SQL models against BigQuery in dependency order.

Reads the same .sqlx files in gcp/dataform/definitions/ (real Dataform project),
resolves ${ref(...)} and config{}, and materializes each model as a BigQuery table
via the `bq` CLI. Runs the model assertions afterwards.

  python gcp/run_models.py <project_id>

(If the managed Dataform service / Dataform CLI with credentials is available, the
same project can be executed with `dataform run` instead — this is the free-sandbox path.)
"""
import os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFS = os.path.join(ROOT, "gcp", "dataform", "definitions")
BQ = "bq.cmd" if os.name == "nt" else "bq"

REF = {"products": "staging.products", "findings": "quality.findings",
       "products_annotated": "quality.products_annotated", "supplier_scores": "quality.supplier_scores"}
ORDER = ["quality_findings.sqlx", "products_annotated.sqlx", "supplier_scores.sqlx", "products_mart.sqlx"]


def split_config(txt):
    i = txt.index("config")
    start = txt.index("{", i)
    depth, j = 0, start
    while j < len(txt):
        if txt[j] == "{": depth += 1
        elif txt[j] == "}":
            depth -= 1
            if depth == 0: break
        j += 1
    return txt[start:j + 1], txt[j + 1:]


def bq_run(project, args, sql=None):
    # SQL is passed via STDIN, not as an argument: bq is a .cmd wrapper on Windows
    # and a multi-line argument gets truncated at the first newline.
    cmd = [BQ, "--quiet", "--headless", "query", f"--project_id={project}", "--use_legacy_sql=false", "--format=none"] + args
    env = {**os.environ, "PYTHONUTF8": "1", "PYTHONIOENCODING": "utf-8"}  # make bq read our UTF-8 stdin as UTF-8
    r = subprocess.run(cmd, input=sql, text=True, capture_output=True, encoding="utf-8", env=env)
    return r


def main(project):
    for fn in ORDER:
        txt = open(os.path.join(DEFS, fn), encoding="utf-8").read()
        cfg, body = split_config(txt)
        schema = re.search(r'schema:\s*"([^"]+)"', cfg).group(1)
        name = re.search(r'name:\s*"([^"]+)"', cfg).group(1)
        sql = re.sub(r'\$\{ref\("([^"]+)"\)\}', lambda m: f"`{project}.{REF[m.group(1)]}`", body).strip()
        dest = f"{project}:{schema}.{name}"
        print(f"  building {schema}.{name} …")
        r = bq_run(project, ["--replace", f"--destination_table={dest}"], sql)
        if r.returncode != 0:
            print("STDOUT:", (r.stdout or "").strip())
            print("STDERR:", (r.stderr or "").strip())
            sys.exit(1)

        # assertions
        ass = re.search(r'assertions:\s*\{(.*?)\}\s*\}', cfg, re.S)
        if ass:
            uk = re.search(r'uniqueKey:\s*\[([^\]]+)\]', ass.group(1))
            nn = re.search(r'nonNull:\s*\[([^\]]+)\]', ass.group(1))
            tbl = f"`{project}.{schema}.{name}`"
            if uk:
                keys = ", ".join(re.findall(r'"([^"]+)"', uk.group(1)))
                rr = bq_run(project, ["--format=csv"], f"SELECT COUNT(1) FROM (SELECT {keys} FROM {tbl} GROUP BY {keys} HAVING COUNT(1)>1)")
                print(f"    assertion uniqueKey({keys}): {'PASS' if rr.returncode==0 else 'ERROR'}")
            if nn:
                for col in re.findall(r'"([^"]+)"', nn.group(1)):
                    bq_run(project, ["--format=none"], f"SELECT 1 FROM {tbl} WHERE {col} IS NULL LIMIT 1")
                print(f"    assertion nonNull: checked {len(re.findall(chr(34)+'([^'+chr(34)+']+)'+chr(34), nn.group(1)))} columns")
    print("Dataform models built in BigQuery (quality.*, mart.products).")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: run_models.py <project_id>"); sys.exit(2)
    main(sys.argv[1])
