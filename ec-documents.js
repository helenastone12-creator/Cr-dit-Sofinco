/* ═══════════════════════════════════════════
   GÉNÉRATION DE DOCUMENTS BANCAIRES
   Conformes droit français — Code conso. L312-1+
════════════════════════════════════════════ */

function ecDocGetUser(){ try{ return JSON.parse(localStorage.getItem('ec_user')||'null'); }catch(e){ return null; } }
function ecDocFmt(d){ return d ? new Date(d).toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}) : '—'; }
function ecDocMoney(v){ return Number(v||0).toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }

function ecDocStyles(){
  return `<style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Arial',sans-serif;font-size:11pt;color:#1a1a1a;background:#fff;padding:0}
    .page{max-width:900px;margin:0 auto;padding:20px 16px 40px;position:relative}
    @media(min-width:600px){.page{padding:32px 40px 50px}}
    @media print{.page{max-width:210mm;padding:15mm 15mm 18mm}.no-print{display:none!important}@page{size:A4;margin:0}}
    .no-print{position:fixed;bottom:24px;right:24px;z-index:99;display:flex;gap:10px}
    .btn-dl{background:#ff6b5c;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(255,107,92,.3)}
    .btn-close{background:#f0f2f5;color:#333;border:none;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer}
    .header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2.5px solid #0B1D3A;padding-bottom:14px;margin-bottom:20px}
    .brand{font-size:20pt;font-weight:900;color:#0B1D3A;letter-spacing:-1px}
    .brand-sub{font-size:7.5pt;color:#888;font-weight:400;letter-spacing:.08em;text-transform:uppercase;margin-top:2px}
    .doc-title{text-align:right}
    .doc-title h1{font-size:13pt;font-weight:800;color:#0B1D3A;margin-bottom:3px}
    .doc-title p{font-size:8pt;color:#666}
    .parties{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:18px 0;background:#f8f9fb;border-radius:8px;padding:14px 16px;border:1px solid #e5e7eb}
    .party-title{font-size:7pt;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
    .party-name{font-size:10.5pt;font-weight:700;color:#0B1D3A;margin-bottom:3px}
    .party-info{font-size:8.5pt;color:#555;line-height:1.55}
    h2{font-size:10.5pt;font-weight:800;color:#0B1D3A;border-left:3px solid #0B9E8A;padding-left:8px;margin:18px 0 10px}
    h3{font-size:9.5pt;font-weight:700;color:#0B1D3A;margin:12px 0 6px}
    p{font-size:9pt;line-height:1.65;color:#333;margin-bottom:7px}
    .highlight-box{background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;padding:12px 16px;margin:12px 0}
    .highlight-box p{color:#1E3A8A;margin:0;font-size:9pt}
    .warn-box{background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:12px 16px;margin:12px 0}
    .warn-box p{color:#92400E;margin:0;font-size:9pt}
    table{width:100%;border-collapse:collapse;margin:10px 0;font-size:8.5pt}
    th{background:#0B1D3A;color:#fff;padding:7px 10px;text-align:left;font-weight:700;font-size:8pt}
    td{padding:6px 10px;border-bottom:1px solid #E5E7EB;color:#333}
    tr:nth-child(even) td{background:#F9FAFB}
    tr:last-child td{border-bottom:none}
    .tfoot td{background:#E0F2FE;font-weight:700;color:#0B1D3A}
    .sign-block{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb}
    .sign-area{border:1px dashed #ccc;border-radius:8px;padding:12px;min-height:80px;text-align:center}
    .sign-lbl{font-size:7.5pt;color:#888;margin-bottom:6px}
    .sign-stamp{font-size:8pt;color:#0B9E8A;font-weight:700}
    .footer{margin-top:28px;padding-top:12px;border-top:1px solid #e5e7eb;font-size:7pt;color:#999;line-height:1.6}
    .badge{display:inline-block;background:#ECFDF5;color:#065F46;border:1px solid #A7F3D0;border-radius:4px;padding:2px 8px;font-size:7.5pt;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
    .ref-tag{font-family:monospace;font-size:8.5pt;background:#f3f4f6;border-radius:4px;padding:2px 7px;color:#374151}
    ul{padding-left:18px;margin:6px 0}
    li{font-size:9pt;line-height:1.65;color:#333;margin-bottom:3px}
    .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0}
    .stat-card{background:#f8f9fb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 12px;text-align:center}
    .stat-lbl{font-size:7pt;color:#888;text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}
    .stat-val{font-size:13pt;font-weight:800;color:#0B1D3A}
  </style>`;
}

function ecDocOpen(html){
  var w = window.open('','_blank');
  if(w){
    w.document.write(html);
    w.document.close();
  } else {
    /* Popup bloqué — fallback data URI */
    var blob = new Blob([html],{type:'text/html'});
    var url = URL.createObjectURL(blob);
    window.location.href = url;
  }
}

function ecDocButtons(){
  return `<div class="no-print">
    <button class="btn-close" onclick="window.close()">Fermer</button>
    <button class="btn-dl" onclick="window.print()">⬇ Télécharger PDF</button>
  </div>`;
}

/* ──────────────────────────────
   1. CONTRAT DE CRÉDIT PERSONNEL
────────────────────────────────*/
function ecGenContrat(){
  var u = ecDocGetUser() || {};
  var loan = u.loan || {};
  var montant  = loan.montant    || 0;
  var mens     = loan.mensualite || 0;
  var duree    = loan.duree      || 60;
  var taux     = loan.taux       || 3.5;
  var taeg     = taux.toFixed(2);
  var dateSign = ecDocFmt(u.createdAt);
  var dateExp  = new Date(u.createdAt||Date.now()); dateExp.setDate(dateExp.getDate()+14);
  var total    = (mens * duree).toFixed(2);
  var coutTotal= (total - montant).toFixed(2);
  var fullName = ((u.prenom||'')+' '+(u.nom||'')).trim();

  var html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
  <title>Contrat de crédit — ${u.ref||'—'}</title>${ecDocStyles()}</head><body>
  ${ecDocButtons()}
  <div class="page">
    <div class="header">
      <div><div class="brand">Fidexico</div><div class="brand-sub">Établissement de crédit · SIREN 123 456 789</div></div>
      <div class="doc-title"><h1>Contrat de crédit personnel</h1><p>Réf. <span class="ref-tag">${u.ref||'—'}</span> &nbsp;·&nbsp; ${dateSign}</p></div>
    </div>

    <div class="parties">
      <div><div class="party-title">Prêteur</div>
        <div class="party-name">SOLFIANZA SAS</div>
        <div class="party-info">12 rue de la Finance, 75008 Paris<br>SIREN 123 456 789 — ORIAS n° 24 000 123<br>Agréé ACPR — Banque de France</div>
      </div>
      <div><div class="party-title">Emprunteur</div>
        <div class="party-name">${fullName}</div>
        <div class="party-info">${u.email||'—'}<br>Tél : ${u.tel||'—'}<br>ID client : <span class="ref-tag">${u.id||'—'}</span></div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card"><div class="stat-lbl">Montant du crédit</div><div class="stat-val">${ecDocMoney(montant)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Mensualité</div><div class="stat-val">${ecDocMoney(mens)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Durée</div><div class="stat-val">${duree} mois</div></div>
    </div>

    <h2>Article 1 — Objet du contrat</h2>
    <p>Le présent contrat est régi par les articles L312-1 et suivants du Code de la consommation (Loi n° 2010-737 du 1er juillet 2010, dite « Loi Lagarde », modifiée par la Loi n° 2014-344 du 17 mars 2014). Il constitue un crédit à la consommation sous forme de prêt personnel non affecté.</p>
    <p>SOLFIANZA SAS, ci-après « le Prêteur », consent à <strong>${fullName}</strong>, ci-après « l'Emprunteur », un crédit d'un montant de <strong>${ecDocMoney(montant)}</strong>, remboursable en <strong>${duree} mensualités</strong> de <strong>${ecDocMoney(mens)}</strong> chacune.</p>

    <h2>Article 2 — Conditions financières</h2>
    <table>
      <tr><th>Paramètre</th><th>Valeur</th></tr>
      <tr><td>Montant total du crédit</td><td><strong>${ecDocMoney(montant)}</strong></td></tr>
      <tr><td>Taux débiteur fixe annuel</td><td>${taux} %</td></tr>
      <tr><td>TAEG (Taux Annuel Effectif Global)</td><td><strong>${taeg} %</strong></td></tr>
      <tr><td>Durée totale du contrat</td><td>${duree} mois</td></tr>
      <tr><td>Montant de chaque mensualité</td><td><strong>${ecDocMoney(mens)}</strong></td></tr>
      <tr><td>Montant total dû par l'emprunteur</td><td><strong>${ecDocMoney(total)}</strong></td></tr>
      <tr><td>Coût total du crédit (intérêts + frais)</td><td>${ecDocMoney(coutTotal)}</td></tr>
      <tr><td>Frais de dossier</td><td>Des frais de dossier peuvent s'appliquer. Leur montant sera communiqué avant la souscription.</td></tr>
      <tr><td>Assurance emprunteur (facultative)</td><td>Incluse — voir attestation jointe</td></tr>
    </table>

    <div class="highlight-box"><p>⚠️ <strong>Avertissement légal :</strong> Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. TAEG fixe de ${taeg} % pour un crédit de ${ecDocMoney(montant)} sur ${duree} mois. Montant total dû : ${ecDocMoney(total)}.</p></div>

    <h2>Article 3 — Modalités de déblocage</h2>
    <p>Les fonds seront versés sur le compte bancaire désigné par l'Emprunteur dans un délai de <strong>48 heures ouvrées</strong> à compter de l'expiration du délai de rétractation légal de 14 jours calendaires, sauf renonciation expresse de l'Emprunteur à ce délai conformément à l'article L312-25 du Code de la consommation.</p>

    <h2>Article 4 — Droit de rétractation (art. L312-19 C. conso.)</h2>
    <div class="warn-box"><p>📋 <strong>Vous disposez d'un délai de 14 jours calendaires pour vous rétracter</strong>, sans motif ni pénalité, à compter du lendemain de la date de signature du présent contrat, soit jusqu'au <strong>${ecDocFmt(dateExp.toISOString())}</strong>. Pour exercer ce droit, vous devez retourner le formulaire de rétractation joint à ce contrat à l'adresse : SOLFIANZA SAS — Service Rétractation — 12 rue de la Finance, 75008 Paris, ou par email : retractation@fidexico.eu</p></div>

    <h2>Article 5 — Remboursement anticipé (art. L312-34 C. conso.)</h2>
    <p>L'Emprunteur peut, à tout moment, rembourser par anticipation tout ou partie du crédit sans justification. Pour les remboursements anticipés supérieurs à 10 000 € sur une période de 12 mois consécutifs, une indemnité de remboursement anticipé peut être perçue dans la limite de :</p>
    <ul><li>1 % du montant remboursé par anticipation si la durée restante est supérieure à 1 an ;</li>
    <li>0,5 % du montant remboursé si la durée restante est inférieure ou égale à 1 an.</li></ul>

    <h2>Article 6 — Défaut de paiement</h2>
    <p>En cas de défaut de paiement d'une ou plusieurs mensualités, le Prêteur se réserve le droit, après mise en demeure restée infructueuse pendant 30 jours, de prononcer la déchéance du terme conformément à l'article L312-39 du Code de la consommation. Des intérêts de retard au taux légal majoré de 5 points seront appliqués.</p>

    <h2>Article 7 — Protection des données (RGPD)</h2>
    <p>Les données personnelles de l'Emprunteur sont traitées par SOLFIANZA SAS en qualité de responsable de traitement, conformément au Règlement (UE) 2016/679 (RGPD) et à la Loi Informatique et Libertés n° 78-17 du 6 janvier 1978 modifiée. Finalité : gestion du crédit, prévention de la fraude, obligations légales. Durée de conservation : 5 ans après fin du contrat. Droits : accès, rectification, effacement, opposition — dpo@fidexico.eu.</p>

    <h2>Article 8 — Droit applicable et juridiction</h2>
    <p>Le présent contrat est soumis au droit français. Tout litige sera soumis, après tentative de résolution amiable, au médiateur bancaire désigné par l'ACPR, puis aux juridictions françaises compétentes.</p>

    <div class="sign-block">
      <div class="sign-area">
        <div class="sign-lbl">Signature de l'Emprunteur</div>
        <div style="margin:14px 0;font-size:9pt;color:#aaa">Lu et approuvé</div>
        <div class="sign-stamp">✓ Signé électroniquement le ${dateSign}</div>
        <div style="font-size:8pt;color:#888;margin-top:6px">${fullName}</div>
      </div>
      <div class="sign-area">
        <div class="sign-lbl">Signature du Prêteur</div>
        <div style="margin:14px 0;font-size:9pt;color:#aaa">Pour SOLFIANZA SAS</div>
        <div class="sign-stamp">✓ Validé électroniquement</div>
        <div style="font-size:8pt;color:#888;margin-top:6px">Direction des crédits</div>
      </div>
    </div>

    <div class="footer">
      SOLFIANZA SAS — SAS au capital de 2 000 000 € — SIREN 123 456 789 — APE 6492Z — Siège : 12 rue de la Finance, 75008 Paris — Établissement de crédit agréé par l'ACPR (Autorité de Contrôle Prudentiel et de Résolution), 4 place de Budapest, 75436 Paris Cedex 09 — Immatriculé à l'ORIAS sous le n° 24 000 123 (www.orias.fr) — Adhérent à la FBF (Fédération Bancaire Française) — Document généré le ${ecDocFmt(new Date().toISOString())} — Réf. ${u.ref||'—'}
    </div>
  </div></body></html>`;
  ecDocOpen(html);
}

/* ──────────────────────────────
   2. TABLEAU D'AMORTISSEMENT
────────────────────────────────*/
function ecGenAmortissement(){
  var u = ecDocGetUser() || {};
  var loan = u.loan || {};
  var capital  = loan.montant    || 0;
  var mens     = loan.mensualite || 0;
  var duree    = loan.duree      || 60;
  var taux     = loan.taux       || 3.5;
  var tauxM    = taux / 100 / 12;
  var dateDebut= new Date(u.createdAt||Date.now());
  var fullName = ((u.prenom||'')+' '+(u.nom||'')).trim();

  /* Calcul échéance par échéance */
  var rows = ''; var restant = capital; var totalInt = 0; var totalCap = 0;
  for(var i=1; i<=duree; i++){
    var interet = restant * tauxM;
    var amort   = mens - interet;
    if(amort < 0) amort = 0;
    if(amort > restant) amort = restant;
    restant -= amort;
    if(restant < 0.01) restant = 0;
    totalInt += interet; totalCap += amort;
    var d = new Date(dateDebut); d.setMonth(d.getMonth()+i);
    rows += `<tr>
      <td>${i}</td>
      <td>${d.toLocaleDateString('fr-FR',{month:'short',year:'numeric'})}</td>
      <td>${ecDocMoney(mens)}</td>
      <td>${ecDocMoney(amort)}</td>
      <td>${ecDocMoney(interet)}</td>
      <td>${ecDocMoney(restant)}</td>
    </tr>`;
  }

  var html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
  <title>Tableau d'amortissement — ${u.ref||'—'}</title>${ecDocStyles()}
  <style>table{font-size:8pt}th,td{padding:5px 8px}</style></head><body>
  ${ecDocButtons()}
  <div class="page">
    <div class="header">
      <div><div class="brand">Fidexico</div><div class="brand-sub">Établissement de crédit</div></div>
      <div class="doc-title"><h1>Tableau d'amortissement</h1><p>Réf. <span class="ref-tag">${u.ref||'—'}</span> &nbsp;·&nbsp; ${fullName}</p></div>
    </div>

    <div class="stat-grid">
      <div class="stat-card"><div class="stat-lbl">Capital emprunté</div><div class="stat-val">${ecDocMoney(capital)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Taux annuel fixe</div><div class="stat-val">${taux} %</div></div>
      <div class="stat-card"><div class="stat-lbl">Mensualité fixe</div><div class="stat-val">${ecDocMoney(mens)}</div></div>
    </div>

    <h2>Échéancier de remboursement</h2>
    <table>
      <thead><tr><th>#</th><th>Date</th><th>Mensualité</th><th>Capital</th><th>Intérêts</th><th>Capital restant</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr class="tfoot"><td colspan="2"><strong>TOTAUX</strong></td>
        <td><strong>${ecDocMoney(mens*duree)}</strong></td>
        <td><strong>${ecDocMoney(totalCap)}</strong></td>
        <td><strong>${ecDocMoney(totalInt)}</strong></td>
        <td><strong>0,00 €</strong></td></tr></tfoot>
    </table>

    <div class="highlight-box" style="margin-top:16px"><p>Ce tableau est fourni à titre informatif conformément à l'article L312-28 du Code de la consommation. Les montants sont calculés sur la base d'un taux fixe de ${taux} % l'an (TAEG ${taux.toFixed(2)} %). Coût total des intérêts : ${ecDocMoney(totalInt)}.</p></div>

    <div class="footer">SOLFIANZA SAS — SIREN 123 456 789 — Document généré le ${ecDocFmt(new Date().toISOString())} — Réf. ${u.ref||'—'}</div>
  </div></body></html>`;
  ecDocOpen(html);
}

/* ──────────────────────────────
   3. RELEVÉ DE COMPTE
────────────────────────────────*/
/* Appelé depuis les items auto-générés (année + mois 0-indexé) */
function ecGenReleveMonth(year, month){
  var d = new Date(year, month, 1);
  var now = new Date();
  var offset = (now.getFullYear()-year)*12 + (now.getMonth()-month) - 1;
  ecGenReleve(offset < 0 ? 0 : offset, d);
}

function ecGenReleve(moisOffset, refDate){
  moisOffset = moisOffset || 0;
  var u = ecDocGetUser() || {};
  var fullName = ((u.prenom||'')+' '+(u.nom||'')).trim();
  var d = refDate ? new Date(refDate.getFullYear(), refDate.getMonth(), 1) : new Date();
  if(!refDate){ d.setDate(1); d.setMonth(d.getMonth() - moisOffset); }
  var moisLabel = d.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
  var dFin = new Date(d); dFin.setMonth(dFin.getMonth()+1); dFin.setDate(0);
  var txAll = [];
  try{ txAll = JSON.parse(localStorage.getItem('ec_tx')||'[]'); }catch(e){}
  var soldeOuv = (parseFloat(localStorage.getItem('ec_solde')||'0'));

  var lignes = txAll.length > 0 ? txAll.slice(0,10).map(function(tx){
    var isOut = tx.type==='virement';
    var sign = isOut ? '-' : '+';
    var color = isOut ? 'color:#DC2626' : 'color:#059669';
    return `<tr><td>${tx.date||'—'}</td><td>${tx.label||'—'}</td><td style="text-align:right;${color};font-weight:700">${sign}${ecDocMoney(tx.amt)}</td></tr>`;
  }).join('') : `<tr><td colspan="3" style="text-align:center;color:#888;padding:16px">Aucune opération sur cette période</td></tr>`;

  var html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
  <title>Relevé de compte — ${moisLabel}</title>${ecDocStyles()}</head><body>
  ${ecDocButtons()}
  <div class="page">
    <div class="header">
      <div><div class="brand">Fidexico</div><div class="brand-sub">Établissement de crédit</div></div>
      <div class="doc-title"><h1>Relevé de compte</h1><p>Période : ${moisLabel}</p></div>
    </div>

    <div class="parties">
      <div><div class="party-title">Titulaire du compte</div>
        <div class="party-name">${fullName}</div>
        <div class="party-info">ID : <span class="ref-tag">${u.id||'—'}</span><br>Email : ${u.email||'—'}<br>N° dossier : ${u.ref||'—'}</div>
      </div>
      <div><div class="party-title">Établissement</div>
        <div class="party-name">SOLFIANZA SAS</div>
        <div class="party-info">12 rue de la Finance, 75008 Paris<br>SIREN 123 456 789<br>Agréé ACPR / ORIAS 24 000 123</div>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card"><div class="stat-lbl">Solde au 1er ${moisLabel.split(' ')[0]}</div><div class="stat-val">${ecDocMoney(soldeOuv)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Solde de clôture</div><div class="stat-val">${ecDocMoney(soldeOuv)}</div></div>
      <div class="stat-card"><div class="stat-lbl">Nb opérations</div><div class="stat-val">${txAll.length}</div></div>
    </div>

    <h2>Détail des opérations</h2>
    <table>
      <thead><tr><th>Date</th><th>Libellé</th><th style="text-align:right">Montant</th></tr></thead>
      <tbody>${lignes}</tbody>
    </table>

    <h2>Informations réglementaires</h2>
    <p>Ce relevé est émis conformément à l'article L312-1-1 du Code monétaire et financier. Toute réclamation concernant ce relevé doit être adressée au service client dans un délai de <strong>60 jours</strong> suivant la date d'émission.</p>
    <p>En l'absence de contestation dans ce délai, les opérations figurant sur ce relevé seront considérées comme approuvées par le titulaire du compte.</p>
    <div class="highlight-box"><p>📞 Service client : contact@fidexico.eu — Médiateur bancaire : mediateur@fidexico.eu — ACPR : 4 place de Budapest, 75436 Paris Cedex 09</p></div>

    <div class="footer">SOLFIANZA SAS — SIREN 123 456 789 — Relevé établi le ${ecDocFmt(new Date().toISOString())} — Ce document tient lieu de relevé de compte officiel conformément à la réglementation bancaire en vigueur.</div>
  </div></body></html>`;
  ecDocOpen(html);
}

/* ──────────────────────────────
   4. ATTESTATION ASSURANCE
────────────────────────────────*/
function ecGenAttestationAssurance(){
  var u = ecDocGetUser() || {};
  var fullName = ((u.prenom||'')+' '+(u.nom||'')).trim();
  var loan = u.loan || {};
  var dateDebut = ecDocFmt(u.createdAt);
  var dateFin = new Date(u.createdAt||Date.now()); dateFin.setFullYear(dateFin.getFullYear()+1);
  var numAtt = 'ATT-ASS-'+(u.ref||'SOF').slice(-8)+'-2026';

  var html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
  <title>Attestation d'assurance — ${numAtt}</title>${ecDocStyles()}</head><body>
  ${ecDocButtons()}
  <div class="page">
    <div class="header">
      <div><div class="brand">Fidexico</div><div class="brand-sub">Établissement de crédit</div></div>
      <div class="doc-title"><h1>Attestation d'assurance emprunteur</h1><p>N° <span class="ref-tag">${numAtt}</span></p></div>
    </div>

    <div style="text-align:center;margin:20px 0">
      <div class="badge" style="font-size:10pt;padding:8px 20px;background:#ECFDF5;color:#065F46">✓ ATTESTATION VALIDE</div>
    </div>

    <h2>Attestation de souscription</h2>
    <p>Nous soussignés, <strong>SOLFIANZA ASSURANCES</strong>, filiale de SOLFIANZA SAS, certifions que :</p>
    <p><strong>${fullName}</strong> (ID client : <span class="ref-tag">${u.id||'—'}</span>) est bien assuré(e) au titre du contrat d'assurance emprunteur lié au crédit référencé <span class="ref-tag">${u.ref||'—'}</span>.</p>

    <table style="margin:16px 0">
      <tr><th colspan="2">Détails de la couverture</th></tr>
      <tr><td>Assuré</td><td><strong>${fullName}</strong></td></tr>
      <tr><td>Numéro de contrat d'assurance</td><td>${numAtt}</td></tr>
      <tr><td>Date d'effet</td><td>${dateDebut}</td></tr>
      <tr><td>Date d'échéance annuelle</td><td>${ecDocFmt(dateFin.toISOString())}</td></tr>
      <tr><td>Capital assuré</td><td>${ecDocMoney(loan.montant||0)}</td></tr>
      <tr><td>Assureur délégué</td><td>SOLFIANZA ASSURANCES — SIREN 987 654 321</td></tr>
    </table>

    <h2>Garanties incluses</h2>
    <table>
      <thead><tr><th>Garantie</th><th>Couverture</th><th>Franchise</th></tr></thead>
      <tbody>
        <tr><td>Décès (DC)</td><td>100 % du capital restant dû</td><td>Aucune</td></tr>
        <tr><td>Perte totale et irréversible d'autonomie (PTIA)</td><td>100 % du capital restant dû</td><td>Aucune</td></tr>
        <tr><td>Incapacité temporaire totale de travail (ITT)</td><td>Prise en charge des mensualités</td><td>30 jours</td></tr>
        <tr><td>Invalidité permanente totale (IPT)</td><td>100 % du capital restant dû</td><td>Aucune</td></tr>
        <tr><td>Perte d'emploi (PE) — facultative</td><td>50 % des mensualités</td><td>90 jours</td></tr>
      </tbody>
    </table>

    <h2>Base légale</h2>
    <p>Cette assurance est soumise aux dispositions de la Loi n° 2010-737 du 1er juillet 2010 (art. L312-8 C. conso.), de la Loi Lagarde, de la Loi n° 2014-344 du 17 mars 2014 (Loi Hamon) et de la Loi n° 2017-203 du 21 février 2017 (Amendement Bourquin). L'emprunteur dispose du droit de résiliation annuelle à chaque date anniversaire.</p>

    <div class="warn-box"><p>⚠️ Cette attestation est délivrée à la seule fin de justifier de la souscription d'une assurance emprunteur. Elle ne remplace pas le contrat d'assurance complet. En cas de sinistre, contacter sinistres@fidexico.eu dans les plus brefs délais.</p></div>

    <div class="sign-block">
      <div class="sign-area">
        <div class="sign-lbl">Pour SOLFIANZA ASSURANCES</div>
        <div style="margin:10px 0;font-size:8pt;color:#aaa">Direction Assurances</div>
        <div class="sign-stamp">✓ Certifié conforme</div>
        <div style="font-size:7.5pt;color:#888;margin-top:6px">Émis le ${ecDocFmt(new Date().toISOString())}</div>
      </div>
      <div class="sign-area" style="display:flex;align-items:center;justify-content:center">
        <div style="text-align:center">
          <div style="font-size:28pt;color:#0B9E8A;font-weight:900;letter-spacing:-2px">SFZ</div>
          <div style="font-size:7pt;color:#888;margin-top:4px">CACHET OFFICIEL</div>
        </div>
      </div>
    </div>

    <div class="footer">SOLFIANZA ASSURANCES SAS — Filiale de SOLFIANZA SAS — SIREN 987 654 321 — Société soumise au contrôle de l'ACPR — N° ORIAS 24 000 124 — Document certifié — ${numAtt}</div>
  </div></body></html>`;
  ecDocOpen(html);
}

/* ──────────────────────────────
   5. ATTESTATION REMBOURSEMENT ANTICIPÉ
────────────────────────────────*/
function ecGenAttestationRA(){
  var u = ecDocGetUser() || {};
  var fullName = ((u.prenom||'')+' '+(u.nom||'')).trim();
  var loan = u.loan || {};
  var numAtt = 'ATT-RA-'+(u.ref||'SOF').slice(-8)+'-'+new Date().getFullYear();

  var html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
  <title>Attestation de remboursement anticipé — ${numAtt}</title>${ecDocStyles()}</head><body>
  ${ecDocButtons()}
  <div class="page">
    <div class="header">
      <div><div class="brand">Fidexico</div><div class="brand-sub">Établissement de crédit</div></div>
      <div class="doc-title"><h1>Attestation de remboursement anticipé</h1><p>N° <span class="ref-tag">${numAtt}</span></p></div>
    </div>

    <div style="text-align:center;margin:20px 0">
      <div class="badge" style="font-size:10pt;padding:8px 20px">📋 DOCUMENT OFFICIEL</div>
    </div>

    <h2>Objet de l'attestation</h2>
    <p>Conformément à l'article L312-34 du Code de la consommation, SOLFIANZA SAS atteste que <strong>${fullName}</strong> (ID : <span class="ref-tag">${u.id||'—'}</span>, N° dossier : <span class="ref-tag">${u.ref||'—'}</span>) a soumis une demande de remboursement anticipé du crédit personnel souscrit auprès de nos services.</p>

    <h2>Conditions légales du remboursement anticipé</h2>
    <p>Conformément aux articles L312-34 et R312-3 du Code de la consommation, le remboursement anticipé entraîne :</p>
    <table>
      <thead><tr><th>Condition</th><th>Application</th></tr></thead>
      <tbody>
        <tr><td>Droit au remboursement anticipé</td><td>Oui — à tout moment, sans conditions</td></tr>
        <tr><td>Capital restant dû</td><td>${ecDocMoney(loan.montant||0)} (à la date de la demande)</td></tr>
        <tr><td>Indemnité de remboursement anticipé (IRA)</td><td>0,00 € — Exonéré (montant &lt; 10 000 €/12 mois)</td></tr>
        <tr><td>Frais administratifs</td><td>0,00 €</td></tr>
        <tr><td>Délai de traitement</td><td>5 jours ouvrés</td></tr>
      </tbody>
    </table>

    <h2>Procédure à suivre</h2>
    <ul>
      <li>Adresser un courrier recommandé avec accusé de réception ou un email à remboursement@fidexico.eu</li>
      <li>Préciser la date souhaitée de remboursement (minimum 10 jours ouvrés à l'avance)</li>
      <li>Joindre un RIB du compte débité</li>
      <li>Le capital restant dû sera recalculé à la date effective de remboursement</li>
    </ul>

    <div class="highlight-box"><p>ℹ️ <strong>Calcul du montant exact :</strong> Le capital restant dû sera précisément calculé à la date de remboursement. Contactez notre service au contact@fidexico.eu pour obtenir le solde exact avant toute opération.</p></div>

    <h2>Effets du remboursement anticipé</h2>
    <p>À réception du remboursement total et effectif du solde, le contrat de crédit référencé <span class="ref-tag">${u.ref||'—'}</span> sera clôturé. Une attestation de fin de crédit sera émise dans les 15 jours ouvrés suivant le remboursement effectif, conformément à l'article L312-36 du Code de la consommation.</p>

    <div class="sign-block">
      <div class="sign-area">
        <div class="sign-lbl">Pour SOLFIANZA SAS</div>
        <div style="margin:10px 0;font-size:8pt;color:#aaa">Service Remboursements</div>
        <div class="sign-stamp">✓ Document officiel certifié</div>
        <div style="font-size:7.5pt;color:#888;margin-top:6px">Émis le ${ecDocFmt(new Date().toISOString())}</div>
      </div>
      <div class="sign-area" style="display:flex;align-items:center;justify-content:center">
        <div style="text-align:center">
          <div style="font-size:28pt;color:#0B1D3A;font-weight:900;letter-spacing:-2px">SFZ</div>
          <div style="font-size:7pt;color:#888;margin-top:4px">CACHET OFFICIEL</div>
        </div>
      </div>
    </div>

    <div class="footer">SOLFIANZA SAS — SIREN 123 456 789 — Agréé ACPR — ORIAS n° 24 000 123 — Document officiel non falsifiable — ${numAtt} — Émis le ${ecDocFmt(new Date().toISOString())}</div>
  </div></body></html>`;
  ecDocOpen(html);
}
