# Test de bout en bout du coffre chiffré (CLAUDE.md §3.1.1).
# Lancer : pnpm build && pnpm start -p 3100, puis : pip install playwright && python -m playwright install chromium && python tests/e2e/coffre.py
import base64, json, os, re, struct, sys, zlib
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get("BASE_URL", "http://localhost:3100")
OUT = os.environ.get("SORTIE", "/tmp/horizon-proche-e2e")
os.makedirs(OUT, exist_ok=True)
PHRASE = "quatre mots bien choisis ici"
PHRASE2 = "une autre phrase longue et solide"

def png(path):
    # petit PNG 40x30 uni
    w, h = 40, 30
    raw = b"".join(b"\x00" + bytes([31, 107, 107]) * w for _ in range(h))
    def chunk(t, d):
        c = struct.pack(">I", len(d)) + t + d
        return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    data = b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b"")
    open(path, "wb").write(data)

DUMP = """async () => {
  const db = await new Promise((r, j) => { const q = indexedDB.open('horizon-proche-coffre'); q.onsuccess = () => r(q.result); q.onerror = () => j(q.error) })
  const all = async (store) => new Promise((r) => { const tx = db.transaction(store); const s = tx.objectStore(store); const k = s.getAllKeys(); const v = s.getAll(); tx.oncomplete = () => r(k.result.map((key, i) => [key, v.result[i]])) })
  const meta = await all('meta'); const fichiers = await all('fichiers'); db.close()
  const ser = (x) => JSON.stringify(x, (k, v) => v instanceof ArrayBuffer ? '[buf ' + v.byteLength + ']' : (v instanceof Uint8Array ? '[u8]' : v))
  return { meta: ser(meta), fichiers: fichiers.map(([k, v]) => [k, v.contenu.byteLength]), ls: JSON.stringify(Object.keys(localStorage)) }
}"""

PARENT = {"/documents": "/dossier", "/echeances": "/agenda"}

def nav(page, path):
    # Navigation interne par les liens de l'application : un rechargement refermerait le coffre (voulu).
    lien = page.locator(f'a[href="{path}"]:visible')
    if lien.count() == 0 and path in PARENT:
        page.locator(f'a[href="{PARENT[path]}"]:visible').first.click()
        page.wait_for_url("**" + PARENT[path])
        lien = page.locator(f'a[href="{path}"]:visible')
    lien.first.click()
    page.wait_for_url("**" + path)
    page.wait_for_timeout(400)

def check(cond, msg):
    print(("OK   " if cond else "FAIL ") + msg)
    if not cond:
        check.fails += 1
check.fails = 0

with sync_playwright() as p:
    b = p.chromium.launch(**({"executable_path": os.environ["CHROME"]} if os.environ.get("CHROME") else {}))
    ctx = b.new_context(accept_downloads=True, viewport={"width": 1280, "height": 900})
    page = ctx.new_page()
    erreurs = []
    page.on("console", lambda m: m.type == "error" and erreurs.append(m.text))
    page.on("pageerror", lambda e: erreurs.append(str(e)))

    # 0. ancienne donnée en clair (maquette) pour tester la migration
    page.goto(BASE + "/confidentialite")
    r = page.request.get(BASE + "/accueil")
    check("content-security-policy" in r.headers and "frame-ancestors 'none'" in r.headers["content-security-policy"], "en-tête CSP présent")
    check(r.headers.get("referrer-policy") == "no-referrer", "Referrer-Policy no-referrer")
    check("x-powered-by" not in r.headers, "pas de X-Powered-By")

    # 1. création
    page.goto(BASE + "/accueil")
    page.get_by_role("heading", name=re.compile("Un coffre pour les démarches")).wait_for()
    page.screenshot(path=f"{OUT}/01-bienvenue.png", full_page=True)
    page.get_by_role("button", name="Commencer").click()
    page.get_by_role("checkbox").nth(0).check()
    page.get_by_role("checkbox").nth(1).check()
    page.screenshot(path=f"{OUT}/02-accord.png", full_page=True)
    page.get_by_role("button", name="Continuer").click()
    page.get_by_text("Découvrir avec un exemple").click()
    page.get_by_role("button", name="Continuer").click()
    page.locator("#c-phrase").fill("court")
    page.locator("#c-confirm").fill("court")
    page.get_by_role("button", name="Continuer").click()
    check(page.get_by_role("alert").count() > 0, "phrase trop courte refusée")
    page.locator("#c-phrase").fill(PHRASE)
    page.locator("#c-confirm").fill(PHRASE)
    page.screenshot(path=f"{OUT}/03-phrase.png", full_page=True)
    page.get_by_role("button", name="Continuer").click()
    code = page.locator("p.font-mono").inner_text().strip()
    check(re.fullmatch(r"[A-Z2-9]{4}(-[A-Z2-9]{4}){5}", code) is not None, f"code de secours au bon format ({code})")
    page.screenshot(path=f"{OUT}/04-code.png", full_page=True)
    page.get_by_role("checkbox").check()
    page.get_by_role("button", name="Ouvrir mon coffre").click()
    page.get_by_role("link", name="Mon dossier").first.wait_for(timeout=30000)
    page.wait_for_timeout(800)
    page.screenshot(path=f"{OUT}/05-accueil.png", full_page=True)
    check(page.get_by_text("Noah").count() > 0, "dossier de démonstration ouvert")

    d = page.evaluate(DUMP)
    check("Noah" not in d["meta"] and "Madeleine" not in d["meta"] and "Perret" not in d["meta"], "aucune donnée personnelle en clair dans IndexedDB")
    check('"enveloppe"' in d["meta"] and '"etat"' in d["meta"], "enveloppe et état chiffré présents")
    check(d["ls"] == "[]", f"localStorage vide ({d['ls']})")

    # 2. ajout d'un document avec photo
    png(f"{OUT}/courrier.png")
    nav(page, "/documents")
    page.get_by_role("button", name=re.compile("Ajouter|document", re.I)).first.click()
    page.locator("input[type=file][accept^='image/jpeg']").set_input_files(f"{OUT}/courrier.png")
    page.locator("#c-titre").fill("Décision AI test")
    page.get_by_role("button", name=re.compile("Enregistrer sans classer")).click()
    page.get_by_role("heading", name="Enregistré").wait_for(timeout=15000)
    page.get_by_role("button", name="Fermer").last.click()
    page.wait_for_timeout(800)
    d = page.evaluate(DUMP)
    check(len(d["fichiers"]) == 1, f"un fichier chiffré stocké ({d['fichiers']})")
    check("Décision AI test" not in d["meta"] and "courrier.png" not in d["meta"], "titre et nom de fichier non lisibles")
    page.get_by_text("Décision AI test").first.click()
    page.get_by_role("img", name=re.compile("Photo du document")).wait_for(timeout=15000)
    page.screenshot(path=f"{OUT}/06-document.png", full_page=True)
    check(True, "photo déchiffrée et affichée")

    # 3. verrouillage, mauvais essai, ouverture
    page.get_by_role("button", name="Verrouiller").first.click()
    page.get_by_role("heading", name=re.compile("verrouillé")).wait_for()
    check(page.get_by_text("Noah").count() == 0, "plus aucune donnée affichée une fois verrouillé")
    page.locator("#v-phrase").fill("mauvaise phrase secrète")
    page.get_by_role("button", name="Ouvrir mon coffre").click()
    page.get_by_role("alert").wait_for()
    page.screenshot(path=f"{OUT}/07-verrou-erreur.png", full_page=True)
    page.locator("#v-phrase").fill(PHRASE)
    page.get_by_role("button", name="Ouvrir mon coffre").click()
    page.get_by_text(re.compile("1 essai de phrase secrète manqué")).first.wait_for(timeout=30000)
    check(True, "alerte d'essai manqué affichée après ouverture")

    # 4. rechargement : le coffre reste fermé
    page.reload()
    page.get_by_role("heading", name=re.compile("verrouillé")).wait_for()
    check(True, "rechargement : coffre verrouillé")
    page.locator("#v-phrase").fill(PHRASE)
    page.get_by_role("button", name="Ouvrir mon coffre").click()
    page.get_by_role("link", name="Mon dossier").first.wait_for(timeout=30000)
    nav(page, "/documents")
    check(page.get_by_text("Décision AI test").count() > 0, "document conservé après réouverture")

    # 5. mode dégradé
    nav(page, "/reglages")
    page.get_by_role("button", name="Paiement en échec").click()
    page.get_by_text(re.compile("Les modifications, les ajouts et le partage sont en pause")).wait_for()
    page.screenshot(path=f"{OUT}/08-degrade.png", full_page=True)
    nav(page, "/echeances")
    page.wait_for_timeout(500)
    check(page.get_by_text(re.compile("Les modifications, les ajouts et le partage sont en pause")).count() > 0, "bandeau mode dégradé sur les autres pages")
    # essai : basculer une échéance (écriture) → refus
    cases = page.get_by_role("button", name="Marquer comme fait")
    if cases.count() > 0:
        cases.first.click()
        page.get_by_text(re.compile("Modification non enregistrée")).wait_for(timeout=5000)
        check(True, "écriture refusée avec message")
    nav(page, "/reglages")
    page.get_by_role("button", name="Abonnement actif").click()
    page.wait_for_timeout(300)
    check(page.get_by_text(re.compile("sont en pause")).count() == 0, "réactivation lève le mode dégradé")

    # 6. sauvegarde chiffrée
    with page.expect_download() as dl:
        page.get_by_role("button", name="Télécharger la sauvegarde").click()
    chemin = f"{OUT}/sauvegarde.hpcoffre"
    dl.value.save_as(chemin)
    contenu = open(chemin).read()
    check("Noah" not in contenu and json.loads(contenu)["format"] == "horizon-proche-sauvegarde", "sauvegarde valide et chiffrée")

    # 7. code de secours
    page.get_by_role("button", name="Verrouiller").first.click()
    page.get_by_role("button", name=re.compile("code de secours")).click()
    page.locator("#v-code").fill(code.lower().replace("-", " "))
    page.locator("#v-nouvelle").fill(PHRASE2)
    page.locator("#v-confirm").fill(PHRASE2)
    page.get_by_role("button", name=re.compile("Ouvrir et remplacer")).click()
    page.get_by_text(re.compile("Coffre ouvert avec le code de secours")).first.wait_for(timeout=30000)
    check(True, "ouverture par code de secours + nouvelle phrase")

    # 8. effacement puis restauration
    nav(page, "/reglages")
    page.get_by_role("button", name="Supprimer toutes mes données").click()
    page.locator("#d-effacer").fill("EFFACER")
    page.get_by_role("button", name="Tout effacer définitivement").click()
    page.get_by_role("heading", name=re.compile("Un coffre pour les démarches")).wait_for(timeout=10000)
    check(True, "effacement complet ramène à la création")
    page.locator("input[type=file][accept*='hpcoffre']").set_input_files(chemin)
    page.get_by_role("heading", name=re.compile("verrouillé")).wait_for(timeout=10000)
    # la sauvegarde date d'avant le changement de phrase : c'est l'ancienne phrase qui l'ouvre
    page.locator("#v-phrase").fill(PHRASE)
    page.get_by_role("button", name="Ouvrir mon coffre").click()
    page.get_by_role("link", name="Mon dossier").first.wait_for(timeout=30000)
    nav(page, "/documents")
    page.get_by_text("Décision AI test").first.click()
    page.get_by_role("img", name=re.compile("Photo du document")).wait_for(timeout=15000)
    check(True, "restauration : données et fichier retrouvés")

    nav(page, "/reglages")
    page.screenshot(path=f"{OUT}/09-reglages.png", full_page=True)
    page.goto(BASE + "/confidentialite")
    page.screenshot(path=f"{OUT}/10-confidentialite.png", full_page=True)

    # mobile
    m = b.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
    mp = m.new_page()
    mp.goto(BASE + "/accueil")
    mp.get_by_role("heading", name=re.compile("Un coffre pour les démarches")).wait_for()
    mp.screenshot(path=f"{OUT}/11-mobile.png", full_page=True)

    csp = [e for e in erreurs if "Content Security Policy" in e or "Refused" in e]
    check(not csp, f"aucune violation CSP ({csp[:3]})")
    autres = [e for e in erreurs if e not in csp and "Failed to load resource" not in e]
    check(not autres, f"aucune erreur console ({autres[:3]})")
    b.close()

print("ÉCHECS:", check.fails)
sys.exit(1 if check.fails else 0)
