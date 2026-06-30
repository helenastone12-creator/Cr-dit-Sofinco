/* ═══════════════════════════════════════════
   ESPACE CLIENT — logique (Supabase + localStorage cache)
════════════════════════════════════════════ */

// ── Formatage affichage IDs ──
function _ecNumFromId(id){
  var hash = 0;
  for(var i=0;i<id.length;i++) hash = (hash*31 + id.charCodeAt(i)) & 0x7fffffff;
  return String(100000 + (hash % 900000));
}
function ecFmtId(id){
  if(!id) return '—';
  if(/^FDX-\d{4}-\d{6}$/.test(id)) return id;
  return 'FDX-' + new Date().getFullYear() + '-' + _ecNumFromId(id);
}
function ecFmtRef(ref, userId){
  // Toujours dériver du même identifiant client pour avoir le même numéro
  var base = userId || ref;
  if(!base) return '—';
  if(/^FDX-\d{4}-\d{6}$/.test(base)) return base;
  return 'FDX-' + new Date().getFullYear() + '-' + _ecNumFromId(base);
}

// ── Utilitaires session ──
function ecGetUser(){
  try{ return JSON.parse(localStorage.getItem('ec_user')||'null'); }
  catch(e){ return null; }
}
function ecSetUser(u){
  localStorage.setItem('ec_user', JSON.stringify(u));
  if(typeof FidDB !== 'undefined' && u && u.id){
    FidDB.updateClient(u.id, {
      prenom: u.prenom, nom: u.nom, email: u.email,
      tel: u.tel, ref: u.ref, civilite: u.civilite||'M',
      blocked: u.blocked||false, loan: u.loan||null
    }).catch(function(){});
  }
}

function ecIsLoggedIn(){ return localStorage.getItem('ec_session')==='1'; }
function ecSetSession(v){ localStorage.setItem('ec_session', v||'1'); }
function ecClearSession(){ localStorage.removeItem('ec_session'); localStorage.removeItem('ec_user'); }

function ecGuard(){
  if(!ecIsLoggedIn()){ window.location.href='/connexion.html'; return; }
  var _u=ecGetUser();
  if(_u && _u.force_logout){
    ecClearSession();
    window.location.href='/connexion.html';
  }
}

// ── Connexion ──
function ecCompleteLogin(user){
  if(typeof FidDB !== 'undefined'){
    FidDB.getSolde(user.id).then(function(s){ localStorage.setItem('ec_solde', s.toFixed(2)); }).catch(function(){});
    FidDB.getTx(user.id).then(function(txList){
      var mapped = txList.map(function(r){ return {type:r.type,label:r.label,amt:parseFloat(r.amt)||0,iban:r.iban,motif:r.motif,date:r.date}; });
      localStorage.setItem('ec_tx', JSON.stringify(mapped));
    }).catch(function(){});
  }
  var norm = {id:user.id,prenom:user.prenom,nom:user.nom,email:user.email,tel:user.tel,ref:user.ref,pwd:user.pwd,civilite:user.civilite||'M',loan:user.loan,blocked:user.blocked,createdAt:user.created_at||user.createdAt,totp_secret:user.totp_secret||null,docs_autorises:user.docs_autorises||[],doc_overrides:user.doc_overrides||{},fonds_geles:user.fonds_geles||false,force_logout:user.force_logout||false,virement_limit:user.virement_limit||0};
  localStorage.setItem('ec_user', JSON.stringify(norm));
  if(typeof FidEmail !== 'undefined' && user.email){
    FidEmail.connexion(user.prenom||user.nom, user.email);
  }
  ecSetSession('1');
  setTimeout(function(){ window.location.href='/espace-client.html'; }, 400);
}


// ── Déconnexion ──
function ecLogout(){
  ecClearSession();
  window.location.href='/connexion.html';
}

// ── Init header dashboard ──
function ecInitHeader(){
  var user=ecGetUser();
  if(!user) return;
  var av=document.getElementById('ec-hd-avatar');
  var nm=document.getElementById('ec-hd-name');
  var photo=localStorage.getItem('ec_photo');
  var initials=(((user.prenom||'')[0]||'').toUpperCase()+(( user.nom||'')[0]||'').toUpperCase())||'U';
  var personIcon='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>';
  if(av){
    if(photo){
      av.innerHTML='<img src="'+photo+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>';
    } else {
      av.innerHTML=personIcon;
    }
  }
  if(nm) nm.textContent=user.prenom||'Mon compte';
  // Sidebar desktop
  var sav=document.getElementById('ec-sidebar-avatar');
  var snm=document.getElementById('ec-sidebar-user-name');
  var sid=document.getElementById('ec-sidebar-user-id');
  if(sav){ if(photo) sav.innerHTML='<img src="'+photo+'" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%"/>'; else sav.innerHTML=personIcon; }
  if(snm) snm.textContent=(user.prenom||'')+' '+(user.nom||'');
  if(sid) sid.textContent=ecFmtId(user.id);
}

// ── Solde ──
function ecGetSolde(){ return parseFloat(localStorage.getItem('ec_solde')||'0'); }
function ecSetSolde(v){
  localStorage.setItem('ec_solde', v.toFixed(2));
  var u=ecGetUser();
  if(typeof FidDB !== 'undefined' && u && u.id){
    FidDB.setSolde(u.id, v).catch(function(){});
  }
}
function ecFormatAmt(v){ return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }

function ecSoldeHidden(){ return localStorage.getItem('ec_solde_hidden')==='1'; }

function ecRefreshSolde(){
  var el = document.getElementById('ec-solde-amt');
  var el2 = document.getElementById('ec-solde-comptable');
  var hidden = ecSoldeHidden();
  var solde = ecGetSolde();
  var mask = '• • • • • •';
  if(el) el.textContent = hidden ? mask : solde.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
  if(el2) el2.textContent = hidden ? mask : ecFormatAmt(solde);
  var lbl = document.getElementById('ec-hide-bal-lbl');
  var ico = document.getElementById('ec-eye-icon');
  if(lbl) lbl.textContent = ecT(hidden ? 'solde_afficher' : 'solde_masquer') || (hidden ? 'Afficher le solde' : 'Masquer le solde');
  if(ico){
    ico.outerHTML = hidden
      ? '<svg id="ec-eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
      : '<svg id="ec-eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  }
  var idEl = document.getElementById('ec-iban-val');
  if(idEl){
    var user=ecGetUser();
    if(user){ idEl.textContent = hidden ? '••••••••••••••' : ecFmtId(user.id); }
  }
}

function ecToggleSolde(){
  var hidden = ecSoldeHidden();
  localStorage.setItem('ec_solde_hidden', hidden ? '0' : '1');
  var el = document.getElementById('ec-solde-amt');
  if(el){
    el.style.transition = 'opacity .18s';
    el.style.opacity = '0';
    setTimeout(function(){
      ecRefreshSolde();
      ecRenderTx();
      el.style.opacity = '1';
    }, 180);
  } else {
    ecRefreshSolde();
    ecRenderTx();
  }
}

// ── Transactions ──
function ecGetTx(){ try{ return JSON.parse(localStorage.getItem('ec_tx')||'[]'); }catch(e){ return []; } }
function ecAddTx(tx){
  var list = ecGetTx();
  list.unshift(tx);
  if(list.length > 30) list = list.slice(0,30);
  localStorage.setItem('ec_tx', JSON.stringify(list));
  var u=ecGetUser();
  if(typeof FidDB !== 'undefined' && u && u.id){
    FidDB.addTx(u.id, tx).catch(function(){});
  }
}
function ecTxInitials(tx){
  if(tx.nom){
    var words = tx.nom.replace(/—/g,' ').trim().split(/\s+/).filter(Boolean);
    if(words.length >= 2) return (words[0][0]+(words[1][0]||'')).toUpperCase();
    if(words.length === 1) return words[0].substring(0,2).toUpperCase();
  }
  var lbl = (tx.label||'?').trim().toUpperCase();
  return lbl.substring(0,2);
}
var EC_AVATAR_COLORS = [
  ['#DBEAFE','#1D4ED8'],['#D1FAE5','#065F46'],
  ['#FEE2E2','#991B1B'],['#EDE9FE','#6D28D9'],
  ['#FEF3C7','#92400E'],['#E0F2FE','#0369A1']
];
function ecTxColor(label){
  var i = label.charCodeAt(0) % EC_AVATAR_COLORS.length;
  return EC_AVATAR_COLORS[i];
}
var EC_TX_SHOW_ALL = false;

function ecToggleTxAll(e){
  if(e) e.preventDefault();
  EC_TX_SHOW_ALL = !EC_TX_SHOW_ALL;
  ecRenderTx();
  var btn = document.getElementById('ec-tx-voir-tout');
  if(btn) btn.textContent = EC_TX_SHOW_ALL ? 'Réduire' : 'Tout afficher';
}

function ecTxSubLabel(type){
  if(type==='virement') return {lbl:'TRANSFERT SORTANT',cls:'ec-tx-type--out'};
  if(type==='convert')  return {lbl:'CONVERSION DE FONDS',cls:'ec-tx-type--conv'};
  return {lbl:'TRANSFERT ENTRANT',cls:'ec-tx-type--in'};
}

function ecFmtTxDate(dateStr){
  var s = String(dateStr||'').trim();
  /* ISO : 2026-06-29 */
  var iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(iso) return iso[3]+'/'+iso[2]+'/'+iso[1].slice(-2);
  /* dd/mm/yyyy */
  var dmy = s.match(/^(\d{1,2})\/(\d{2})\/(\d{4})/);
  if(dmy) return String(dmy[1]).padStart(2,'0')+'/'+dmy[2]+'/'+dmy[3].slice(-2);
  /* Français : "29 juin 2026" */
  var months={'janvier':'01','février':'02','mars':'03','avril':'04','mai':'05','juin':'06','juillet':'07','août':'08','septembre':'09','octobre':'10','novembre':'11','décembre':'12'};
  var parts = s.split(/\s+/);
  if(parts.length===3 && months[parts[1].toLowerCase()]){
    return String(parts[0]).padStart(2,'0')+'/'+months[parts[1].toLowerCase()]+'/'+String(parts[2]).slice(-2);
  }
  return s;
}

function ecTxDisplayName(tx){
  var label = tx.label||'';
  /* Pour les virements : retire le préfixe "Virement — " si présent (anciennes données) */
  if(tx.type==='virement') label = label.replace(/^virement\s*[-—]\s*/i,'');
  return label.trim()||'—';
}

function ecTxCategoryIcon(type){
  if(type==='virement') return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
  if(type==='depot') return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><polyline points="12 8 12 16"/><polyline points="8 12 12 16 16 12"/></svg>';
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>';
}

function ecTxDateLabel(dateStr){
  var s = String(dateStr||'').trim();
  var today = new Date(); today.setHours(0,0,0,0);
  var yesterday = new Date(today); yesterday.setDate(today.getDate()-1);
  var d = null;
  var iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(iso) d = new Date(parseInt(iso[1]), parseInt(iso[2])-1, parseInt(iso[3]));
  var dmy = !d && s.match(/^(\d{1,2})\/(\d{2})\/(\d{4})/);
  if(dmy) d = new Date(parseInt(dmy[3]), parseInt(dmy[2])-1, parseInt(dmy[1]));
  if(d){
    d.setHours(0,0,0,0);
    if(d.getTime()===today.getTime()) return "Aujourd'hui";
    if(d.getTime()===yesterday.getTime()) return 'Hier';
    return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'});
  }
  return s;
}

function ecRenderTx(){
  var list = ecGetTx();
  var container = document.getElementById('ec-tx-list');
  var empty = document.getElementById('ec-tx-empty');
  if(!container) return;
  if(!list.length){ if(empty) empty.style.display=''; return; }
  if(empty) empty.style.display='none';
  var hidden = ecSoldeHidden();
  var displayed = EC_TX_SHOW_ALL ? list : list.slice(0,10);

  /* Group by date */
  var groups = [];
  var groupMap = {};
  displayed.forEach(function(tx){
    var key = String(tx.date||'');
    if(!groupMap[key]){
      groupMap[key] = {date: key, items: []};
      groups.push(groupMap[key]);
    }
    groupMap[key].items.push(tx);
  });

  var html = groups.map(function(g){
    var label = ecTxDateLabel(g.date);
    var sepHtml = '<div class="ec-n26-date-label">'+label+'</div>';

    var itemsHtml = g.items.map(function(tx){
      var isOut = tx.type==='virement';
      var sign = isOut ? '-' : '';
      var fmtAmt = tx.amt.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
      var rawAmt = hidden ? '• • • •' : sign+fmtAmt;
      var amtCls = isOut ? 'ec-n26-tx-amt' : 'ec-n26-tx-amt ec-n26-tx-amt--in';
      var displayName = ecTxDisplayName(tx);
      var dateDisp = ecTxDateLabel(tx.date);
      var icon = ecTxCategoryIcon(tx.type);
      var txJson = encodeURIComponent(JSON.stringify(tx));
      return '<div class="ec-n26-tx-item" onclick="ecOpenTxDetail(\''+txJson+'\')">'
        +'<div class="ec-n26-tx-icon">'+icon+'</div>'
        +'<div class="ec-n26-tx-info">'
        +'<div class="ec-n26-tx-name">'+displayName+'</div>'
        +'<div class="ec-n26-tx-date">'+dateDisp+'</div>'
        +'</div>'
        +'<div class="'+amtCls+'">'+rawAmt+'</div>'
        +'</div>';
    }).join('');

    return sepHtml + itemsHtml;
  }).join('');

  container.innerHTML = html;
}

// ── Détail transaction ──
function ecOpenTxDetail(encoded){
  var tx;
  try{ tx = JSON.parse(decodeURIComponent(encoded)); } catch(e){ return; }
  var isOut = tx.type==='virement';
  var isConv = tx.type==='convert';
  var sign = isOut ? '−' : '+';
  var typeLabel = isOut ? 'Virement sortant' : (isConv ? 'Conversion de devises' : 'Dépôt entrant');
  var ref = tx.ref || ('VIR-' + new Date().getFullYear() + '-' + String(Math.floor(100000 + Math.random()*900000)));
  var user = ecGetUser()||{};

  var statusHtml = '<span style="display:inline-flex;align-items:center;gap:.35rem;background:var(--green-light);color:var(--green);border:1px solid rgba(5,150,105,.2);border-radius:6px;padding:.22rem .65rem;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em">'
    +'<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>Validée</span>';

  /* Lignes IBAN destinataire + Motif pour virements */
  var extraRows = '';
  if(isOut){
    if(tx.iban) extraRows += '<div class="ec-tx-d-row"><span class="ec-tx-d-lbl">IBAN destinataire</span><span class="ec-tx-d-val ec-tx-d-mono" style="font-size:.72rem">'+tx.iban+'</span></div>';
    extraRows += '<div class="ec-tx-d-row"><span class="ec-tx-d-lbl">Motif</span><span class="ec-tx-d-val">'+(tx.motif||'—')+'</span></div>';
  }

  var el = document.getElementById('ec-modal-tx');
  if(!el) return;
  el.querySelector('#ec-tx-d-label').textContent  = tx.label;
  el.querySelector('#ec-tx-d-type').textContent   = typeLabel;
  el.querySelector('#ec-tx-d-date').textContent   = tx.date;
  el.querySelector('#ec-tx-d-amt').textContent    = sign + ecFormatAmt(tx.amt);
  el.querySelector('#ec-tx-d-amt').style.color    = isOut ? 'var(--text)' : 'var(--green)';
  el.querySelector('#ec-tx-d-status').innerHTML   = statusHtml;
  el.querySelector('#ec-tx-d-ref').textContent    = ref;
  var extraEl = el.querySelector('#ec-tx-d-extra');
  if(extraEl) extraEl.innerHTML = extraRows;

  /* Bouton PDF */
  var pdfBtn = el.querySelector('#ec-tx-pdf-btn');
  if(pdfBtn){
    pdfBtn.style.display = isOut ? '' : 'none';
    pdfBtn.onclick = function(){ ecDownloadVirementPdf(tx, ref, user); };
  }

  ecOpenModal('tx');
}

function ecDownloadVirementPdf(tx, ref, user){
  var nom = (user.prenom||'')+' '+(user.nom||'');
  var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Confirmation de virement</title>'
    +'<style>body{font-family:Arial,sans-serif;max-width:680px;margin:40px auto;padding:0 20px;color:#222}'
    +'h1{font-size:1.3rem;margin-bottom:.3rem}p.sub{color:#666;font-size:.9rem;margin-bottom:2rem}'
    +'.section-lbl{font-size:.7rem;font-weight:700;letter-spacing:.1em;color:#888;text-transform:uppercase;margin:1.5rem 0 .5rem}'
    +'.table{width:100%;border-collapse:collapse;background:#f8f8f8;border-radius:8px;overflow:hidden}'
    +'.table td{padding:.7rem 1rem;font-size:.88rem;border-bottom:1px solid #eee}'
    +'.table td:first-child{color:#666}.table td:last-child{text-align:right;font-weight:600}'
    +'.table tr:last-child td{border-bottom:none}'
    +'.status{display:inline-block;background:#DCFCE7;color:#16A34A;border-radius:5px;padding:.2rem .7rem;font-size:.75rem;font-weight:700;text-transform:uppercase;margin-bottom:1.5rem}'
    +'footer{margin-top:3rem;font-size:.75rem;color:#aaa;text-align:center}'
    +'</style></head><body>'
    +'<h1>Virement exécuté</h1><p class="sub">Confirmation de votre opération de virement.</p>'
    +'<div class="section-lbl">Donneur d\'ordre</div>'
    +'<table class="table"><tr><td>Nom</td><td>'+nom.trim()+'</td></tr>'
    +'<tr><td>Identifiant</td><td>'+ecFmtId(user.id)+'</td></tr></table>'
    +'<div class="section-lbl">Bénéficiaire</div>'
    +'<table class="table"><tr><td>Nom</td><td>'+(tx.label||'—')+'</td></tr>'
    +'<tr><td>IBAN</td><td>'+(tx.iban||'—')+'</td></tr></table>'
    +'<div class="section-lbl">Détails de l\'opération</div>'
    +'<table class="table">'
    +'<tr><td>Montant</td><td>'+ecFormatAmt(tx.amt)+'</td></tr>'
    +'<tr><td>Motif</td><td>'+(tx.motif||'—')+'</td></tr>'
    +'<tr><td>Date</td><td>'+(tx.date||'—')+'</td></tr>'
    +'<tr><td>Référence</td><td>'+ref+'</td></tr>'
    +'<tr><td>Statut</td><td>EXÉCUTÉ</td></tr></table>'
    +'<footer>Fidexico — fidexico.eu</footer>'
    +'</body></html>';
  var blob = new Blob([html],{type:'text/html'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url; a.download = 'virement-'+ref+'.html'; a.click();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
}

// ── Modals ──
function ecOpenModal(name){
  var el = document.getElementById('ec-modal-'+name);
  if(!el) return;
  var scrollY = window.scrollY || window.pageYOffset;
  document.body.dataset.scrollY = scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + scrollY + 'px';
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
  el.classList.add('open');
}
function ecCloseModal(name){
  var el = document.getElementById('ec-modal-'+name);
  if(!el) return;
  el.classList.remove('open');
  var scrollY = parseInt(document.body.dataset.scrollY || '0');
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  document.body.style.overflow = '';
  window.scrollTo(0, scrollY);
}

function ecConfirmDepot(){
  var amt  = parseFloat((document.getElementById('ec-depot-amt')||{}).value||'0');
  var errEl = document.getElementById('ec-depot-err');
  if(!amt || amt <= 0){
    if(errEl){ errEl.textContent='Veuillez saisir un montant valide.'; errEl.style.display='block'; }
    return;
  }
  if(errEl) errEl.style.display='none';
  var nouveau = ecGetSolde() + amt;
  ecSetSolde(nouveau);
  ecAddTx({ type:'depot', label:'Dépôt', amt:amt, date: new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) });
  ecRefreshSolde();
  ecRenderTx();
  ecCloseModal('depot');
  document.getElementById('ec-depot-amt').value='';
  document.getElementById('ec-success-title').textContent='Dépôt effectué';
  document.getElementById('ec-success-msg').textContent='+'+ecFormatAmt(amt)+' crédités. Nouveau solde : '+ecFormatAmt(nouveau);
  ecOpenModal('success');
}

// ── Convertisseur ──
var EC_RATES = {
  GBP:0.8547, CHF:0.9623, SEK:11.42, NOK:11.73, DKK:7.461,
  PLN:4.258,  CZK:25.14,  HUF:393.2, RON:4.976, BGN:1.956,
  HRK:7.534,  TRY:36.12,  ISK:149.8
};
var EC_SYMBOLS = {
  GBP:'£', CHF:'Fr', SEK:'kr', NOK:'kr', DKK:'kr',
  PLN:'zł', CZK:'Kč', HUF:'Ft', RON:'lei', BGN:'лв',
  HRK:'kn', TRY:'₺', ISK:'kr'
};

function ecConvert(){
  var amt  = parseFloat((document.getElementById('ec-conv-amt')||{}).value||'0');
  var cur  = (document.getElementById('ec-conv-currency')||{}).value||'GBP';
  var rate = EC_RATES[cur] || 1;
  var sym  = EC_SYMBOLS[cur] || cur;
  var res  = amt * rate;
  var resEl  = document.getElementById('ec-conv-res-amt');
  var rateEl = document.getElementById('ec-conv-res-rate');
  if(resEl) resEl.textContent = amt > 0 ? res.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+sym : '—';
  if(rateEl) rateEl.textContent = amt > 0 ? '1 € = '+rate+' '+cur : '';
  // Refresh rates from API if available
  if(amt > 0 && !ecConvert._fetched){
    ecConvert._fetched = true;
    fetch('https://api.frankfurter.app/latest?from=EUR&to='+Object.keys(EC_RATES).join(','))
      .then(function(r){ return r.json(); })
      .then(function(d){
        if(d && d.rates) Object.assign(EC_RATES, d.rates);
        ecConvert();
      }).catch(function(){});
  }
}

function ecValidateIban(raw){
  var iban = raw.replace(/\s+/g,'').toUpperCase();
  if(!/^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(iban)) return false;
  /* Longueurs officielles par pays */
  var lengths={AD:24,AE:23,AL:28,AT:20,AZ:28,BA:20,BE:16,BG:22,BH:22,BR:29,BY:28,CH:21,CR:22,CY:28,CZ:24,DE:22,DJ:27,DK:18,DO:28,EE:20,EG:29,ES:24,FI:18,FK:18,FO:18,FR:27,GB:22,GE:22,GI:23,GL:18,GR:27,GT:28,HR:21,HU:28,IE:22,IL:23,IQ:23,IS:26,IT:27,JO:30,KW:30,KZ:20,LB:28,LC:32,LI:21,LT:20,LU:20,LV:21,LY:25,MC:27,MD:24,ME:22,MK:19,MR:27,MT:31,MU:30,MZ:25,NL:18,NO:15,PK:24,PL:28,PS:29,PT:25,QA:29,RO:24,RS:22,SA:24,SC:31,SD:18,SE:24,SI:19,SK:24,SM:27,SO:23,ST:25,SV:28,TL:23,TN:24,TR:26,UA:29,VA:22,VG:24,XK:20};
  if(lengths[iban.slice(0,2)] && iban.length !== lengths[iban.slice(0,2)]) return false;
  /* Algorithme mod 97 */
  var rearranged = iban.slice(4)+iban.slice(0,4);
  var numeric = rearranged.split('').map(function(c){ var n=c.charCodeAt(0); return n>=65?n-55:c; }).join('');
  var remainder = numeric.match(/.{1,9}/g).reduce(function(r,c){ return Number(r+c)%97; },'');
  return remainder===1;
}

function ecConfirmVirement(){
  var nom   = ((document.getElementById('ec-vir-nom')||{}).value||'').trim();
  var iban  = ((document.getElementById('ec-vir-iban')||{}).value||'').trim();
  var amt   = parseFloat((document.getElementById('ec-vir-amt')||{}).value||'0');
  var errEl = document.getElementById('ec-vir-err');
  var solde = ecGetSolde();

  var _u = ecGetUser();
  if(_u && _u.fonds_geles){ if(errEl){ errEl.textContent='Vos fonds sont temporairement gelés suite à un litige en cours. Veuillez contacter Fidexico pour plus d\'informations.'; errEl.style.display='block'; } return; }
  if(_u && _u.virement_limit && _u.virement_limit > 0 && amt > _u.virement_limit){ if(errEl){ errEl.textContent='Ce virement dépasse votre limite autorisée de '+_u.virement_limit.toLocaleString('fr-FR',{minimumFractionDigits:2})+' €. Veuillez contacter Fidexico.'; errEl.style.display='block'; } return; }
  if(!nom){ if(errEl){ errEl.textContent='Le nom du bénéficiaire est requis.'; errEl.style.display='block'; } return; }
  if(!iban){ if(errEl){ errEl.textContent='L\'IBAN destinataire est requis.'; errEl.style.display='block'; } return; }
  if(!ecValidateIban(iban)){ if(errEl){ errEl.textContent='IBAN invalide. Veuillez vérifier le numéro saisi.'; errEl.style.display='block'; } return; }
  if(!amt || amt <= 0){ if(errEl){ errEl.textContent='Veuillez saisir un montant valide.'; errEl.style.display='block'; } return; }
  if(amt > solde){ if(errEl){ errEl.textContent='Solde insuffisant ('+ecFormatAmt(solde)+' disponible).'; errEl.style.display='block'; } return; }

  if(errEl) errEl.style.display='none';
  var nouveau = solde - amt;
  ecSetSolde(nouveau);
  var motif = ((document.getElementById('ec-vir-motif')||{}).value||'').trim();
  var txDate = new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
  ecAddTx({ type:'virement', label:nom, iban:iban, motif:motif, amt:amt, date: txDate });
  ecRefreshSolde();
  ecRenderTx();
  ecCloseModal('virement');
  /* email confirmation virement */
  (function(){
    var u = ecGetUser();
    if(u && u.email && typeof FidEmail !== 'undefined'){
      var ref = 'VIR-' + new Date().getFullYear() + '-' + String(Math.floor(100000 + Math.random()*900000));
      FidEmail.virementSortant(u.prenom||u.nom, u.email, ecFormatAmt(amt), nom, iban, motif, ref);
    }
  })();
  ['ec-vir-nom','ec-vir-iban','ec-vir-amt','ec-vir-motif'].forEach(function(id){ var e=document.getElementById(id); if(e)e.value=''; });
  document.getElementById('ec-success-title').textContent='Virement envoyé';
  document.getElementById('ec-success-msg').textContent=ecFormatAmt(amt)+' virés à '+nom+'. Nouveau solde : '+ecFormatAmt(nouveau);
  ecOpenModal('success');
}

// ── Détection IP → pays européen → format IBAN ──
var EC_IBAN_FORMATS = {
  FR:'FR76 XXXX XXXX XXXX XXXX XXXX XXX',
  DE:'DE89 XXXX XXXX XXXX XXXX XX',
  IT:'IT60 X000 0000 0000 0000 000 00',
  ES:'ES91 XXXX XXXX XXXX XXXX XXXX',
  BE:'BE68 XXXX XXXX XXXX',
  NL:'NL91 XXXX XXXX XXXX XXXX XX',
  PT:'PT50 XXXX XXXX XXXX XXXX XXXX X',
  CH:'CH93 XXXX XXXX XXXX XXXX X',
  AT:'AT61 XXXX XXXX XXXX XXXX',
  PL:'PL61 XXXX XXXX XXXX XXXX XXXX XXXX',
  GB:'GB29 XXXX XXXX XXXX XXXX XX',
  SE:'SE45 XXXX XXXX XXXX XXXX XXXX',
  NO:'NO93 XXXX XXXX XXX',
  DK:'DK50 XXXX XXXX XXXX XX',
  FI:'FI21 XXXX XXXX XXXX XX',
  IE:'IE29 XXXX XXXX XXXX XXXX XX',
  LU:'LU28 XXXX XXXX XXXX XXXX',
  LT:'LT12 XXXX XXXX XXXX XXXX',
  LV:'LV80 XXXX XXXX XXXX XXXX X',
  EE:'EE38 XXXX XXXX XXXX XXXX',
  SK:'SK31 XXXX XXXX XXXX XXXX XXXX',
  CZ:'CZ65 XXXX XXXX XXXX XXXX XXXX',
  HU:'HU42 XXXX XXXX XXXX XXXX XXXX XXXX',
  RO:'RO49 XXXX XXXX XXXX XXXX XXXX',
  HR:'HR12 XXXX XXXX XXXX XXXX X',
  SI:'SI56 XXXX XXXX XXXX XXX',
  BG:'BG80 XXXX XXXX XXXX XXXX XX',
  GR:'GR16 XXXX XXXX XXXX XXXX XXXX XXX',
  CY:'CY17 XXXX XXXX XXXX XXXX XXXX XXXX',
  MT:'MT84 XXXX XXXX XXXX XXXX XXXX XXXX XXX',
  MC:'MC58 XXXX XXXX XXXX XXXX XXXX XXX',
  LI:'LI21 XXXX XXXX XXXX XXXX X',
  AD:'AD12 XXXX XXXX XXXX XXXX XXXX',
  SM:'SM86 UXXXX XXXX XXXX XXXX XXXX XXX',
  VA:'VA59 001 XXXX XXXX XXXX XX',
  IS:'IS14 XXXX XXXX XXXX XXXX XXXX XX',
  RS:'RS35 XXXX XXXX XXXX XXXX XX',
  ME:'ME25 XXXX XXXX XXXX XXXX XX',
  MK:'MK07 XXXX XXXX XXXX XXX',
  AL:'AL47 XXXX XXXX XXXX XXXX XXXX XXXX',
  BA:'BA39 XXXX XXXX XXXX XXXX',
  XK:'XK05 XXXX XXXX XXXX XXXX',
  UA:'UA21 XXXX XXXX XXXX XXXX XXXX XXXX X'
};

function ecDetectIpCountry(){
  fetch('https://ip-api.com/json/?fields=countryCode')
    .then(function(r){ return r.json(); })
    .then(function(d){
      var code = (d.countryCode||'').toUpperCase();
      var fmt = EC_IBAN_FORMATS[code];
      var inp = document.getElementById('ec-vir-iban');
      if(inp && fmt) inp.placeholder = fmt;
    }).catch(function(){
      /* Fallback silencieux si API indisponible */
    });
}

// ── Tableau de bord ──
function ecInitDashboard(){
  ecGuard();
  if(typeof ecApplyI18n==='function') ecApplyI18n();
  ecDetectIpCountry();
  document.addEventListener('click',function(e){ var dd=document.getElementById('ec-lang-dropdown'); if(dd&&!dd.contains(e.target)&&e.target.id!=='ec-lang-toggle'&&!e.target.closest('#ec-lang-toggle')) dd.classList.remove('open'); });
  ecInitHeader();
  ecRefreshSolde();
  ecRenderTx();
  // Sync solde + transactions depuis Supabase à chaque chargement
  var _u = ecGetUser();
  if(typeof FidDB !== 'undefined' && _u && _u.id){
    FidDB.getSolde(_u.id).then(function(s){
      localStorage.setItem('ec_solde', s.toFixed(2));
      ecRefreshSolde();
    }).catch(function(){});
    FidDB.getTx(_u.id).then(function(rows){
      if(rows && rows.length){
        var mapped = rows.map(function(r){ return {label:r.label||'',amt:parseFloat(r.amt)||0,type:r.type||'credit',date:r.date||'',iban:r.iban||'',motif:r.motif||''}; });
        localStorage.setItem('ec_tx', JSON.stringify(mapped));
        ecRenderTx();
        // Rafraîchir l'historique des paiements avec les vraies données
        var u2=ecGetUser(); var l2=u2.loan||{}; var c2=l2.montant||0; var me2=l2.mensualite||0; var du2=l2.duree||60;
        var dd2=l2.dateDebut?new Date(l2.dateDebut):new Date();
        var mp2=Math.min(Math.max(0,Math.floor((new Date()-dd2)/(30.44*24*3600*1000))),du2);
        var re2=c2>0?Math.round(c2-(c2/du2)*mp2):0;
        var pc2=c2>0?Math.round((mp2/du2)*100):0;
        ecInitLoanSections(u2,l2,c2,me2,du2,dd2,mp2,re2,pc2);
      }
    }).catch(function(){});
  }
  var user=ecGetUser();

  var welcomeEl=document.getElementById('ec-welcome-name');
  if(welcomeEl) welcomeEl.textContent='Bonjour, '+(user.prenom||'')+' !';

  var dateEl=document.getElementById('ec-welcome-date');
  if(dateEl){
    var d=new Date();
    dateEl.textContent=d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }

  var loan = user.loan || {};
  var capital    = loan.montant    || 0;
  var mens       = loan.mensualite || 0;
  var duree      = loan.duree      || 60;
  var dateDebut  = loan.dateDebut  ? new Date(loan.dateDebut) : new Date();
  var moisPasses = Math.max(0, Math.floor((new Date() - dateDebut) / (30.44 * 24 * 3600 * 1000)));
  moisPasses     = Math.min(moisPasses, duree);
  var restant    = capital > 0 ? Math.round(capital - (capital / duree) * moisPasses) : 0;
  var pct        = capital > 0 ? Math.round((moisPasses / duree) * 100) : 0;

  var refEl=document.getElementById('ec-credit-ref');
  if(refEl) refEl.textContent=ecFmtRef(user.ref, user.id);

  ecInitAlertBanner();
  ecInitHealthScore();
  ecInitSpendingChart();
  ecInitRib();
  ecCalcRemb();
  ecInitNotifs();
  ecInitLoanSections(user, loan, capital, mens, duree, dateDebut, moisPasses, restant, pct);
}

// ── Sections prêt dashboard ──
function ecInitLoanSections(user, loan, capital, mens, duree, dateDebut, moisPasses, restant, pct){
  var set = function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
  var fmt = function(v){ return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; };

  // ── Statut du dossier
  var badge = document.getElementById('ec-ds-badge-statut');
  var refEl2 = document.getElementById('ec-ds-ref');
  var status = (loan && loan.statut) || (capital > 0 ? 'active' : 'pending');
  var statusMap = {
    'pending':  { label: 'En traitement', cls: 'ec-ds-badge--pending' },
    'approved': { label: 'Approuvé',       cls: 'ec-ds-badge--approved' },
    'active':   { label: 'Actif',           cls: 'ec-ds-badge--active' },
    'closed':   { label: 'Clôturé',         cls: 'ec-ds-badge--closed' }
  };
  var statusInfo = statusMap[status] || statusMap['active'];
  if(badge){ badge.textContent = statusInfo.label; badge.className = 'ec-ds-badge ' + statusInfo.cls; }
  if(refEl2) refEl2.textContent = 'Réf. ' + (user.ref || user.id || '—');

  // ── Crédit en cours
  if(capital > 0){
    set('ec-stat-capital', fmt(capital));
    set('ec-stat-mens',    fmt(mens));
    set('ec-stat-restant', fmt(restant));
    set('ec-prog-pct',     pct + '%');
  } else {
    set('ec-stat-capital', 'En attente');
    set('ec-stat-mens',    '—');
    set('ec-stat-restant', '—');
    set('ec-prog-pct',     '0%');
  }
  var fill = document.getElementById('ec-prog-fill');
  if(fill) setTimeout(function(){ fill.style.width = pct + '%'; }, 200);

  // ── Prochaine échéance
  var next = new Date(); next.setDate(1); next.setMonth(next.getMonth()+1);
  var nextStr = '1er ' + next.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
  set('ec-next-date', nextStr);
  set('ec-next-amt', mens > 0 ? fmt(mens) : '—');
  var daysLeft = Math.ceil((next - new Date()) / (1000*60*60*24));
  var countEl = document.getElementById('ec-ds-countdown');
  if(countEl && mens > 0) countEl.textContent = 'Dans ' + daysLeft + ' jour' + (daysLeft > 1 ? 's' : '');

  // ── Score de remboursement
  set('ec-score-pct', pct + '%');
  var ringFill = document.getElementById('ec-score-ring-fill');
  if(ringFill){
    var circ = 175.9;
    setTimeout(function(){ ringFill.style.strokeDashoffset = circ * (1 - pct/100); }, 200);
  }

  // ── Historique paiements — toutes les transactions du compte (5 dernières)
  var histList = document.getElementById('ec-hist-list');
  if(histList){
    var txRaw = localStorage.getItem('ec_tx');
    var txArr = txRaw ? JSON.parse(txRaw) : [];
    // Trier par date décroissante, prendre les 5 dernières
    var sorted = txArr.slice().sort(function(a,b){ return new Date(b.date||0) - new Date(a.date||0); });
    var recent = sorted.slice(0, 5);
    if(recent.length > 0){
      histList.innerHTML = '';
      recent.forEach(function(p){
        var dStr = p.date ? new Date(p.date).toLocaleDateString('fr-FR',{day:'numeric',month:'short',year:'numeric'}) : '—';
        var isOut = p.type === 'debit' || p.type === 'virement' || p.type === 'mensualite' || p.amt < 0;
        var row = document.createElement('div');
        row.className = 'ec-ds-hist-item';
        var label = p.label || (isOut ? 'Débit' : 'Crédit');
        row.innerHTML = '<div><div class="ec-ds-hist-label">' + label + '</div><div class="ec-ds-hist-date">' + dStr + '</div></div>'
          + '<span class="ec-ds-hist-amt' + (isOut ? ' ec-ds-hist-amt--out' : '') + '">' + (isOut ? '-' : '') + fmt(Math.abs(p.amt)) + '</span>';
        histList.appendChild(row);
      });
    }
  }

  // ── Alertes
  var alertCard = document.getElementById('ec-ds-alert-card');
  var alertList = document.getElementById('ec-ds-alert-list');
  var alerts = [];
  if(mens > 0 && daysLeft <= 10){
    alerts.push({ type:'warn', text: 'Votre prochaine échéance est dans ' + daysLeft + ' jour' + (daysLeft>1?'s':'') + ' (' + fmt(mens) + ').' });
  }
  if(pct >= 80){
    alerts.push({ type:'info', text: 'Félicitations ! Vous avez remboursé ' + pct + '% de votre prêt.' });
  }
  if(alerts.length > 0 && alertCard && alertList){
    alertCard.style.display = '';
    alertList.innerHTML = '';
    alerts.forEach(function(a){
      var item = document.createElement('div');
      item.className = 'ec-ds-alert-item' + (a.type==='info' ? ' ec-ds-alert-item--info' : '');
      item.innerHTML = '<span class="ec-ds-alert-ico"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>'
        + '<span class="ec-ds-alert-txt">' + a.text + '</span>';
      alertList.appendChild(item);
    });
  }
}

// ── Mes documents ──
function ecInitDocuments(){
  ecGuard();
  if(typeof ecApplyI18n==='function') ecApplyI18n();
  ecInitHeader();
  var user = ecGetUser();
  if(!user) return;
  var createdAt = user.createdAt ? new Date(user.createdAt) : new Date();
  var fmtDate = function(d){ return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}); };
  // Date de signature = date de création du compte
  var signDate = fmtDate(createdAt);
  // Relevé mois précédent
  var releve1 = new Date(createdAt); releve1.setDate(1);
  var releve1Lbl = releve1.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
  var releve1Dispo = new Date(releve1); releve1Dispo.setMonth(releve1Dispo.getMonth()+1);
  var releve2 = new Date(releve1); releve2.setMonth(releve2.getMonth()-1);
  var releve2Lbl = releve2.toLocaleDateString('fr-FR',{month:'long',year:'numeric'});
  var releve2Dispo = new Date(releve2); releve2Dispo.setMonth(releve2Dispo.getMonth()+1);
  // Attestation valide 1 an
  var assuranceExp = new Date(createdAt); assuranceExp.setFullYear(assuranceExp.getFullYear()+1);

  var setDoc = function(sel, txt){ var el = document.querySelector(sel); if(el) el.textContent = txt; };
  // Contrat + tableau
  document.querySelectorAll('.ec-doc-item[data-cat="contrat"] .ec-doc-meta')[0] &&
    (document.querySelectorAll('.ec-doc-item[data-cat="contrat"] .ec-doc-meta')[0].textContent = 'Signé le '+signDate+' · 124 Ko');
  document.querySelectorAll('.ec-doc-item[data-cat="contrat"] .ec-doc-meta')[1] &&
    (document.querySelectorAll('.ec-doc-item[data-cat="contrat"] .ec-doc-meta')[1].textContent = 'Généré le '+signDate+' · 48 Ko');
  // Relevés
  var releveMetas = document.querySelectorAll('.ec-doc-item[data-cat="releve"] .ec-doc-meta');
  if(releveMetas[0]) releveMetas[0].textContent = 'Disponible le '+fmtDate(releve1Dispo)+' · 32 Ko';
  if(releveMetas[1]) releveMetas[1].textContent = 'Disponible le '+fmtDate(releve2Dispo)+' · 30 Ko';
  // Noms relevés
  var releveNoms = document.querySelectorAll('.ec-doc-item[data-cat="releve"] .ec-doc-name');
  if(releveNoms[0]) releveNoms[0].textContent = 'Relevé de compte — '+releve1Lbl.charAt(0).toUpperCase()+releve1Lbl.slice(1);
  if(releveNoms[1]) releveNoms[1].textContent = 'Relevé de compte — '+releve2Lbl.charAt(0).toUpperCase()+releve2Lbl.slice(1);
  // Attestation
  var attMeta = document.querySelector('.ec-doc-item[data-cat="attestation"] .ec-doc-meta');
  if(attMeta) attMeta.textContent = 'Valide jusqu\'au '+fmtDate(assuranceExp)+' · 56 Ko';
}

function ecDocFilter(cat, btn){
  document.querySelectorAll('.ec-doc-ftab').forEach(function(t){t.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('.ec-doc-item').forEach(function(item){
    item.classList.toggle('hidden', cat!=='tous' && item.dataset.cat!==cat);
  });
}
function ecFakeDownload(btn){
  var orig=btn.innerHTML;
  btn.innerHTML='✓'; btn.style.background='var(--teal)'; btn.style.color='#fff';
  setTimeout(function(){btn.innerHTML=orig; btn.style.background=''; btn.style.color='';},2200);
}
function ecRequestDoc(btn){ btn.textContent='Envoyé !'; btn.disabled=true; }

// ── Suivi dossier ──
function ecInitSuivi(){
  ecGuard();
  if(typeof ecApplyI18n==='function') ecApplyI18n();
  ecInitHeader();
  var user=ecGetUser();
  if(user&&user.ref){
    var inp=document.getElementById('ec-suivi-ref');
    if(inp) inp.value=user.ref;
  }
}

function ecSuiviApplyStatus(client){
  var status = client.status || 'active';
  var loan   = client.loan || {};
  var blocked= client.blocked || false;
  var badgeEl= document.getElementById('ec-suivi-badge');

  // Reset toutes les étapes en pending
  ['ec-tl-1','ec-tl-2','ec-tl-3','ec-tl-4','ec-tl-5'].forEach(function(id){
    var el=document.getElementById(id); if(!el) return;
    el.className='ec-tl-item pending';
    var dot=el.querySelector('.ec-tl-dot');
    if(dot){ dot.className='ec-tl-dot ec-tl-dot-pending'; dot.innerHTML=''; }
  });

  function markDone(id){
    var el=document.getElementById(id); if(!el) return;
    el.className='ec-tl-item done';
    var dot=el.querySelector('.ec-tl-dot');
    if(dot){ dot.className='ec-tl-dot'; dot.innerHTML='<svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }
  }
  function markActive(id){
    var el=document.getElementById(id); if(!el) return;
    el.className='ec-tl-item active';
    var dot=el.querySelector('.ec-tl-dot');
    if(dot){ dot.className='ec-tl-dot ec-tl-dot-active'; dot.innerHTML='<span class="ec-tl-pulse"></span>'; }
  }

  if(blocked){
    markDone('ec-tl-1');
    if(badgeEl){ badgeEl.textContent='Dossier suspendu'; badgeEl.style.background='#fee2e2'; badgeEl.style.color='#b91c1c'; }
  } else if(status==='valide' || (loan && loan.montant>0)){
    markDone('ec-tl-1'); markDone('ec-tl-2'); markDone('ec-tl-3'); markDone('ec-tl-4'); markDone('ec-tl-5');
    if(badgeEl){ badgeEl.textContent='Dossier validé'; badgeEl.style.background='#dcfce7'; badgeEl.style.color='#15803d'; }
  } else if(status==='en_etude'){
    markDone('ec-tl-1'); markActive('ec-tl-2');
    if(badgeEl){ badgeEl.textContent="En cours d'analyse"; badgeEl.style.background=''; badgeEl.style.color=''; }
  } else {
    markDone('ec-tl-1'); markActive('ec-tl-2');
    if(badgeEl){ badgeEl.textContent="En cours d'analyse"; badgeEl.style.background=''; badgeEl.style.color=''; }
  }
}

function ecSuiviSearch(){
  var val=((document.getElementById('ec-suivi-ref')||{}).value||'').trim();
  var errEl=document.getElementById('ec-suivi-err');
  var result=document.getElementById('ec-suivi-result');

  // Validation : au moins 5 caractères
  if(val.length<5){
    if(errEl){errEl.style.display='block';}
    if(result){result.style.display='none';}
    return;
  }
  if(errEl) errEl.style.display='none';

  // Affiche le numéro saisi
  var refDisp=document.getElementById('ec-suivi-ref-disp');
  if(refDisp) refDisp.textContent=val.toUpperCase();

  // Date depuis le compte ou hier par défaut
  var user=ecGetUser();
  var d=new Date();
  if(user && user.createdAt) d=new Date(user.createdAt);
  else d.setDate(d.getDate()-1);
  var dateStr=d.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})+' à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  var dateEl=document.getElementById('ec-tl-date1');
  if(dateEl) dateEl.textContent=dateStr;

  // Charger le vrai statut depuis Supabase
  if(typeof FidDB!=='undefined' && user && user.id){
    FidDB.getClientById(user.id).then(function(client){
      if(!client){ if(errEl) errEl.style.display='block'; return; }
      // Rafraîchir le cache local avec le statut Supabase
      user.status  = client.status  || user.status;
      user.loan    = client.loan    || user.loan;
      user.blocked = client.blocked !== undefined ? client.blocked : user.blocked;
      localStorage.setItem('ec_user', JSON.stringify(user));
      if(result) result.style.display='block';
      ecSuiviApplyStatus(client);
      if(result) result.scrollIntoView({behavior:'smooth',block:'start'});
    }).catch(function(){
      if(result) result.style.display='block';
      if(user) ecSuiviApplyStatus(user);
      if(result) result.scrollIntoView({behavior:'smooth',block:'start'});
    });
  } else {
    if(result) result.style.display='block';
    if(user) ecSuiviApplyStatus(user);
    if(result) result.scrollIntoView({behavior:'smooth',block:'start'});
  }
}

// ── Touche Entrée suivi dossier ──
(function(){
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter') return;
    var path=window.location.pathname;
    if(path.indexOf('suivi-dossier')!==-1) ecSuiviSearch();
  });
})();


// ── Bannière alerte ──
function ecInitAlertBanner(){
  var user=ecGetUser();
  if(!user) return;
  var loan=user.loan||{};
  var mens=loan.mensualite||0;
  var solde=parseFloat(localStorage.getItem('ec_solde')||'0');
  var msgs=[];

  // Solde faible ?
  if(mens>0 && solde < mens*2) msgs.push(ecT('alert_solde'));

  var banner=document.getElementById('ec-alert-banner');
  var txt=document.getElementById('ec-alert-banner-text');
  var dot=document.getElementById('ec-bell-dot');
  if(msgs.length>0){
    if(txt) txt.textContent=msgs[0];
    if(banner) banner.style.display='flex';
    if(dot) dot.style.display='block';
  }
}

// ── Santé financière ──
function ecInitHealthScore(){
  var user=ecGetUser();
  if(!user) return;
  var loan=user.loan||{};
  var mens=loan.mensualite||0;
  var solde=parseFloat(localStorage.getItem('ec_solde')||'0');
  var card=document.getElementById('ec-health-card');
  if(!card) return;
  if(!mens){ card.style.display='none'; return; }

  var ratio=solde>0 ? mens/solde : 1;
  var score,label,pct,cls;
  if(ratio<0.2){score=ecT('health_excellent');pct=95;cls='excellent';}
  else if(ratio<0.35){score=ecT('health_bon');pct=70;cls='bon';}
  else if(ratio<0.5){score=ecT('health_correct');pct=45;cls='correct';}
  else{score=ecT('health_surveiller');pct=20;cls='surveiller';}

  var scoreEl=document.getElementById('ec-health-score');
  var fill=document.getElementById('ec-health-fill');
  var detail=document.getElementById('ec-health-detail');
  if(scoreEl){scoreEl.textContent=score;scoreEl.className='ec-health-score '+cls;}
  if(fill) setTimeout(function(){fill.style.width=pct+'%';fill.style.background=cls==='excellent'?'var(--teal)':cls==='bon'?'#2563EB':cls==='correct'?'#F59E0B':'var(--coral)';},300);
  if(detail) detail.textContent='Ratio mensualité/solde : '+Math.round(ratio*100)+'%';
}

// ── Graphique dépenses (donut SVG) ──
function ecInitSpendingChart(){
  var txRaw=localStorage.getItem('ec_tx');
  var txList=[];
  try{txList=JSON.parse(txRaw)||[];}catch(e){}

  var cats={};
  var colors=['#0B5E8A','#0B9E8A','#ff6b5c','#F59E0B','#7C3AED','#059669'];
  txList.forEach(function(tx){
    if(tx.montant<0){
      var c=tx.categorie||tx.type||'Autre';
      cats[c]=(cats[c]||0)+Math.abs(tx.montant);
    }
  });

  var entries=Object.entries(cats).sort(function(a,b){return b[1]-a[1];}).slice(0,5);
  var total=entries.reduce(function(s,e){return s+e[1];},0);

  var svg=document.getElementById('ec-donut-svg');
  var legend=document.getElementById('ec-chart-legend');
  var totalEl=document.getElementById('ec-donut-total');
  var card=document.getElementById('ec-chart-card');
  if(!svg||!legend) return;

  if(!entries.length||total===0){if(card) card.style.display='none';return;}

  if(totalEl) totalEl.textContent=total.toLocaleString('fr-FR')+'€';

  var cx=55,cy=55,r=42,stroke=14;
  var circ=2*Math.PI*r;
  var offset=0;
  var paths='';
  entries.forEach(function(e,i){
    var pct=e[1]/total;
    var dash=pct*circ;
    var gap=circ-dash;
    paths+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+colors[i%colors.length]+'" stroke-width="'+stroke+'" stroke-dasharray="'+dash.toFixed(2)+' '+gap.toFixed(2)+'" stroke-dashoffset="'+(-offset*circ/1).toFixed(2)+'" transform="rotate(-90 '+cx+' '+cy+')" />';
    offset+=pct;

    var item=document.createElement('div');
    item.className='ec-chart-legend-item';
    item.innerHTML='<div class="ec-chart-legend-dot" style="background:'+colors[i%colors.length]+'"></div><span>'+e[0]+'</span><span class="ec-chart-legend-pct">'+Math.round(pct*100)+'%</span>';
    legend.appendChild(item);
  });
  svg.innerHTML='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="var(--border)" stroke-width="'+stroke+'"/>'+paths;
}

// ── Filtrer transactions ──
function ecFilterTx(type, btn){
  document.querySelectorAll('.ec-tx-ftab').forEach(function(t){t.classList.remove('active');});
  if(btn) btn.classList.add('active');

  var txRaw=localStorage.getItem('ec_tx');
  var txList=[];
  try{txList=JSON.parse(txRaw)||[];}catch(e){}

  var now=new Date();
  var filtered=txList.filter(function(tx){
    if(type==='tous') return true;
    if(type==='depot') return tx.montant>0;
    if(type==='virement') return tx.type==='virement'||tx.type==='prelevement';
    if(type==='mois'){
      var d=new Date(tx.date||tx.createdAt);
      return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
    }
    return true;
  });

  // Re-render avec la liste filtrée
  var list=document.getElementById('ec-tx-list');
  if(!list) return;
  if(!filtered.length){
    list.innerHTML='<div class="ec-tx-empty">Aucune transaction dans cette catégorie.</div>';
    return;
  }
  list.innerHTML='';
  filtered.slice().reverse().forEach(function(tx){
    var pos=tx.montant>0;
    var d=new Date(tx.date||tx.createdAt);
    var dateStr=d.toLocaleDateString('fr-FR',{day:'numeric',month:'short'});
    var item=document.createElement('div');
    item.className='ec-tx-item';
    item.innerHTML='<div class="ec-tx-ico '+(pos?'dep':'ret')+'"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="'+(pos?'19 12 12 5 5 12':'5 12 12 19 19 12')+'"/></svg></div>'
      +'<div class="ec-tx-info"><div class="ec-tx-label">'+(tx.label||tx.type||'Opération')+'</div><div class="ec-tx-date">'+dateStr+'</div></div>'
      +'<div class="ec-tx-amt '+(pos?'pos':'neg')+'">'+(pos?'+':'')+tx.montant.toLocaleString('fr-FR')+'€</div>';
    list.appendChild(item);
  });
}

// ── RIB / IBAN ──
function ecGenerateIban(userId){
  var s=userId||'SOF000';
  var hash=0;
  for(var i=0;i<s.length;i++) hash=(hash*31+s.charCodeAt(i))>>>0;
  var seed=String(hash).padStart(10,'0').slice(0,10);
  return 'FR76 3000 6000 '+seed.slice(0,4)+' '+seed.slice(4,8)+' '+seed.slice(8)+'00 00';
}
function ecInitRib(){
  var user=ecGetUser();
  if(!user) return;
  var iban=ecGenerateIban(user.id||'');
  var set=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  set('ec-rib-titulaire',(user.prenom||'')+' '+(user.nom||''));
  set('ec-rib-iban',iban);
  set('ec-rib-bic','SOFIFR2PXXX');
  set('ec-rib-banque','Sofinco');
}
function ecCopyIban(){
  var user=ecGetUser();
  if(!user) return;
  var val=user.id||'';
  navigator.clipboard.writeText(val).then(function(){
    var msg=document.getElementById('ec-rib-copied');
    if(msg){msg.textContent=ecT('rib_copied');setTimeout(function(){msg.textContent='';},2500);}
    var copyBtn=document.querySelector('.ec-iban-copy');
    if(copyBtn){
      var orig=copyBtn.innerHTML;
      copyBtn.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1A7F5A" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
      setTimeout(function(){copyBtn.innerHTML=orig;},1800);
    }
  });
}
function ecDownloadRib(){
  var user=ecGetUser();
  if(!user) return;
  var iban=ecGenerateIban(user.id||'');
  var content='RIB — Fidexico\n\nTitulaire : '+(user.prenom||'')+' '+(user.nom||'')+'\nIBAN      : '+iban+'\nBIC       : SOFIFR2PXXX\nBanque    : Sofinco\n\nDocument généré le '+new Date().toLocaleDateString('fr-FR');
  var blob=new Blob([content],{type:'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='RIB_Fidexico.txt';a.click();
}

// ── Remboursement anticipé ──
function ecCalcRemb(){
  var user=ecGetUser();
  if(!user) return;
  var loan=user.loan||{};
  var capital=loan.montant||0;
  var mens=loan.mensualite||0;
  var duree=loan.duree||60;
  var taux=(loan.taux||3)/100/12;
  var dateDebut=loan.dateDebut?new Date(loan.dateDebut):new Date();
  var moisPasses=Math.max(0,Math.floor((new Date()-dateDebut)/(30.44*24*3600*1000)));
  moisPasses=Math.min(moisPasses,duree);
  var restant=Math.max(0,Math.round(capital-(capital/duree)*moisPasses));

  var sixMoisInterets=Math.round(restant*taux*6);
  var troisPctCapital=Math.round(restant*0.03);
  var ira=Math.min(sixMoisInterets,troisPctCapital);
  var total=restant+ira;

  var set=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  set('ec-remb-capital',restant.toLocaleString('fr-FR')+'€');
  set('ec-remb-ira',ira.toLocaleString('fr-FR')+'€');
  set('ec-remb-total',total.toLocaleString('fr-FR')+'€');
}

// ── Notifications ──
function ecInitNotifs(){
  var user=ecGetUser();
  var loan=(user||{}).loan||{};
  var mens=loan.mensualite||0;
  var solde=parseFloat(localStorage.getItem('ec_solde')||'0');
  var list=document.getElementById('ec-notif-list');
  if(!list) return;
  list.innerHTML='';
  var notifs=[];

  if(mens>0&&solde<mens*2) notifs.push({type:'warn',txt:'<strong>'+ecT('notif_solde_title')+'</strong> — '+ecT('notif_solde_txt')});

  if(!notifs.length){
    list.innerHTML='<div class="ec-notif-empty">'+ecT('notif_empty')+'</div>';return;
  }
  notifs.push({type:'info',txt:'<strong>'+ecT('notif_welcome_title')+'</strong> — '+ecT('notif_welcome_txt')});
  notifs.forEach(function(n){
    var item=document.createElement('div');
    item.className='ec-notif-item ec-notif-item--'+n.type;
    item.innerHTML='<div class="ec-notif-dot ec-notif-dot--'+n.type+'"></div><div class="ec-notif-txt">'+n.txt+'</div>';
    list.appendChild(item);
  });
}

// ── Messagerie ──
function ecGetMessages(){
  try{return JSON.parse(localStorage.getItem('ec_messages')||'[]');}catch(e){return[];}
}
function ecSaveMessages(msgs){localStorage.setItem('ec_messages',JSON.stringify(msgs));}

function ecInitMessagerie(){
  ecGuard();
  if(typeof ecApplyI18n==='function') ecApplyI18n();
  ecInitHeader();
  var u=ecGetUser();
  if(typeof FidDB !== 'undefined' && u && u.id){
    FidDB.getMessages(u.id).then(function(rows){
      var msgs=rows.map(function(r){ return {text:r.text,date:r.created_at,fromClient:r.from_client}; });
      ecSaveMessages(msgs);
      ecRenderMessages();
    }).catch(function(){ ecRenderMessages(); });
  } else {
    ecRenderMessages();
  }
}
function ecRenderMessages(){
  var msgs=ecGetMessages();
  var list=document.getElementById('ec-msg-list');
  if(!list) return;
  if(!msgs.length){
    list.innerHTML='<div class="ec-msg-empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>Aucun message pour le moment.</p></div>';
    return;
  }
  list.innerHTML='';
  msgs.slice().reverse().forEach(function(m,i){
    var d=new Date(m.date);
    var dateStr=d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'})+' à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    var item=document.createElement('div');
    item.className='ec-msg-item'+(m.fromClient?' ec-msg-item--client':' ec-msg-item--bank');
    item.innerHTML='<div class="ec-msg-bubble"><div class="ec-msg-meta"><span class="ec-msg-sender">'+(m.fromClient?'Vous':'Sofinco')+'</span><span class="ec-msg-time">'+dateStr+'</span></div><div class="ec-msg-body">'+m.text+'</div></div>';
    list.appendChild(item);
  });
}
function ecSendMessage(){
  var inp=document.getElementById('ec-msg-input');
  if(!inp||!inp.value.trim()) return;
  var msgs=ecGetMessages();
  var msgText=inp.value.trim();
  var u=ecGetUser();
  msgs.push({text:msgText,date:new Date().toISOString(),fromClient:true});
  ecSaveMessages(msgs);
  if(typeof FidDB !== 'undefined' && u && u.id){
    FidDB.addMessage(u.id, msgText, true).catch(function(){});
  }
  // Notification email à l'admin
  if(u && typeof FidEmail!=='undefined'){
    FidEmail.adminNouveauMessage((u.prenom||'')+' '+(u.nom||''), msgText.slice(0,120));
  }
  inp.value='';
  ecRenderMessages();
}

// ── Auto-init selon la page ──
(function(){
  var p=window.location.pathname;
  if(p.indexOf('espace-client.html')!==-1) ecInitDashboard();
  else if(p.indexOf('mes-documents.html')!==-1) ecInitDocuments();
  else if(p.indexOf('suivi-dossier.html')!==-1) ecInitSuivi();
  else if(p.indexOf('messagerie.html')!==-1) ecInitMessagerie();
})();
