# mindcontact-cloud

La home di mindcontact.cloud, il dominio che ospita le applicazioni SaaS di
MindContact. La home è una sola pagina che rimanda a mindcontact.net.

## Lavorare in locale

```bash
python3 -m http.server 8160 -d docs   # http://localhost:8160/
```

## Pubblicazione

GitHub Pages dal ramo `main`, cartella `docs/`: ogni push su `main` va online
da solo. Il dominio è in `docs/CNAME` (`mindcontact.cloud`); `docs/.nojekyll`
fa servire i file così come sono.

DNS (Cloudflare, solo DNS): `mindcontact.cloud` con i record A di GitHub
Pages, `www` in CNAME verso `MindContact.github.io` (GitHub lo reindirizza al
dominio senza `www`).

Regola dei siti MindContact: nessun indirizzo email nelle pagine.
