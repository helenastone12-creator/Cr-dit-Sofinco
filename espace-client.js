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
    FidDB.getTx(user.id).then(function(txList){
      var mapped = txList.map(function(r){ return {type:r.type,label:r.label,amt:parseFloat(r.amt)||0,iban:r.iban,motif:r.motif,date:r.date}; });
      localStorage.setItem('ec_tx', JSON.stringify(mapped));
      var s = ecCalcSoldeFromTx(mapped);
      localStorage.setItem('ec_solde', s.toFixed(2));
      FidDB.setSolde(user.id, s).catch(function(){});
    }).catch(function(){});
  }
  var _dov = user.doc_overrides||{};
  var norm = {id:user.id,prenom:user.prenom,nom:user.nom,email:user.email,tel:user.tel,ref:user.ref,pwd:user.pwd,civilite:user.civilite||'M',loan:user.loan,blocked:user.blocked,status:user.status||'en_etude',createdAt:user.created_at||user.createdAt,totp_secret:user.totp_secret||null,docs_autorises:user.docs_autorises||[],doc_overrides:_dov,fonds_geles:user.fonds_geles||false,force_logout:user.force_logout||false,virement_limit:user.virement_limit||0,iban:user.iban||'',banque_nom:user.banque_nom||user.bank_name||'',solde_securise:!!(_dov._solde_securise||user.solde_securise||false)};
  localStorage.setItem('ec_user', JSON.stringify(norm));
  if(typeof FidEmail !== 'undefined' && user.email){
    var _connLang = (typeof EC_LANG !== 'undefined' ? EC_LANG : null) || user.lang || 'fr';
    FidEmail.connexion(user.prenom||user.nom, user.email, _connLang);
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

function ecParseAmt(v){ return parseFloat(String(v||'0').replace(/\s/g,'').replace(',','.')) || 0; }

// ── Solde ──
function ecCalcSoldeFromTx(txList){
  var CREDIT_TYPES = ['credit','depot'];
  return (txList||[]).reduce(function(sum, tx){
    var amt = Math.abs(parseFloat(tx.amt)||0);
    return sum + (CREDIT_TYPES.indexOf(tx.type) !== -1 ? amt : -amt);
  }, 0);
}
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
  var mask = '* * * * * *';
  var soldeFmt = solde.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €';
  if(el) el.textContent = hidden ? mask : soldeFmt;
  if(el2) el2.textContent = hidden ? mask : ecFormatAmt(solde);
  var fdEl = document.getElementById('fd-disponible-amt');
  if(fdEl) fdEl.textContent = hidden ? mask : soldeFmt;
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
  ecOpenAllTx();
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

var EC_FIDEXICO_AVATAR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="36" height="36" style="border-radius:8px;display:block"><defs><linearGradient id="ecfbg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1A7BAF"/><stop offset="100%" stop-color="#0B5E8A"/></linearGradient></defs><rect width="32" height="32" rx="7" fill="url(#ecfbg)"/><text x="16" y="24" font-family="Georgia,serif" font-size="22" font-weight="700" text-anchor="middle" fill="#ffffff" letter-spacing="-1">F</text></svg>';

function ecIsFidexicoTx(tx){
  var lbl = (tx.label||'').toLowerCase();
  return tx.type==='credit' || tx.type==='depot' || lbl.indexOf('fidexico')!==-1 || lbl.indexOf('déblocage')!==-1 || lbl.indexOf('deblocage')!==-1 || lbl.indexOf('sofinco')!==-1;
}

function ecTxCategoryIcon(tx){
  var type = typeof tx === 'string' ? tx : (tx.type||'');
  if(typeof tx === 'object' && ecIsFidexicoTx(tx)) return EC_FIDEXICO_AVATAR;
  if(type==='virement') return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>';
  if(type==='depot') return EC_FIDEXICO_AVATAR;
  return '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>';
}

function ecFmtTxDateFull(dateStr){
  var s = String(dateStr||'').trim();
  var today = new Date();
  var d = null;
  var iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(iso) d = new Date(parseInt(iso[1]), parseInt(iso[2])-1, parseInt(iso[3]));
  var dmy = !d && s.match(/^(\d{1,2})\/(\d{2})\/(\d{4})/);
  if(dmy) d = new Date(parseInt(dmy[3]), parseInt(dmy[2])-1, parseInt(dmy[1]));
  if(!d){
    var months={'janvier':0,'février':1,'mars':2,'avril':3,'mai':4,'juin':5,'juillet':6,'août':7,'septembre':8,'octobre':9,'novembre':10,'décembre':11};
    var parts = s.split(/\s+/);
    if(parts.length===3 && months[parts[1].toLowerCase()]!==undefined)
      d = new Date(parseInt(parts[2]), months[parts[1].toLowerCase()], parseInt(parts[0]));
  }
  if(!d || isNaN(d.getTime())) d = today;
  return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
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
  // Format français "29 juin 2026"
  if(!d){
    var months={'janvier':0,'février':1,'mars':2,'avril':3,'mai':4,'juin':5,'juillet':6,'août':7,'septembre':8,'octobre':9,'novembre':10,'décembre':11};
    var parts = s.split(/\s+/);
    if(parts.length===3 && months[parts[1].toLowerCase()]!==undefined)
      d = new Date(parseInt(parts[2]), months[parts[1].toLowerCase()], parseInt(parts[0]));
  }
  if(d && !isNaN(d.getTime())){
    d.setHours(0,0,0,0);
    if(d.getTime()===today.getTime()) return "Aujourd'hui";
    if(d.getTime()===yesterday.getTime()) return 'Hier';
    return d.toLocaleDateString('fr-FR',{day:'numeric',month:'long'});
  }
  return "Aujourd'hui";
}

function ecNormDateKey(dateStr){
  var todayKey = new Date().toISOString().slice(0,10);
  var s = String(dateStr||'').trim();
  var iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if(iso) return iso[1]+'-'+iso[2]+'-'+iso[3];
  var dmy = s.match(/^(\d{1,2})\/(\d{2})\/(\d{4})/);
  if(dmy) return dmy[3]+'-'+dmy[2]+'-'+String(dmy[1]).padStart(2,'0');
  var months={'janvier':'01','février':'02','mars':'03','avril':'04','mai':'05','juin':'06','juillet':'07','août':'08','septembre':'09','octobre':'10','novembre':'11','décembre':'12'};
  var parts = s.split(/\s+/);
  if(parts.length===3 && months[parts[1].toLowerCase()])
    return parts[2]+'-'+months[parts[1].toLowerCase()]+'-'+String(parts[0]).padStart(2,'0');
  return todayKey;
}

function ecRenderTx(){
  var list = ecGetTx();
  var container = document.getElementById('ec-tx-list');
  var empty = document.getElementById('ec-tx-empty');
  if(!container) return;
  if(!list.length){ if(empty) empty.style.display=''; return; }
  if(empty) empty.style.display='none';
  var hidden = ecSoldeHidden();
  var displayed = EC_TX_SHOW_ALL ? list : list.slice(0,5);

  /* Group by date */
  var groups = [];
  var groupMap = {};
  displayed.forEach(function(tx){
    var key = ecNormDateKey(tx.date);
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
      var dateDisp = ecFmtTxDateFull(tx.date);
      var icon = ecTxCategoryIcon(tx);
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

  // Bouton "Voir plus" si transactions restantes
  var hasMore = !EC_TX_SHOW_ALL && list.length > 5;
  var moreBtn = hasMore
    ? '<button id="ec-tx-voir-tout" onclick="ecToggleTxAll(event)" style="display:block;width:calc(100% - 2.6rem);margin:0 1.3rem 1rem;background:none;border:1px solid #E5E7EB;border-radius:12px;padding:.7rem 1rem;font-size:.83rem;font-weight:600;color:#3FBFA0;font-family:inherit;cursor:pointer;">Voir toutes les opérations ('+(list.length-5)+' de plus)</button>'
    : (EC_TX_SHOW_ALL && list.length > 5 ? '<button id="ec-tx-voir-tout" onclick="ecToggleTxAll(event)" style="display:block;width:calc(100% - 2.6rem);margin:0 1.3rem 1rem;background:none;border:1px solid #E5E7EB;border-radius:12px;padding:.7rem 1rem;font-size:.83rem;font-weight:600;color:#999;font-family:inherit;cursor:pointer;">Réduire</button>' : '');
  container.innerHTML = html + moreBtn;
}

// ── Toutes les transactions (modal scrollable) ──
var atxPage = 0;
var atxPageSize = 10;

function atxGetFiltered(){
  var isPC = window.innerWidth >= 701;
  var q = ((document.getElementById(isPC ? 'atx-search-input' : 'atx-search-input-mobile') || {}).value || '').toLowerCase().trim();
  var typeFilter = (document.getElementById('atx-filter-type') || {}).value || '';
  var list = ecGetTx();
  if(q) list = list.filter(function(tx){ return (tx.label||'').toLowerCase().indexOf(q) !== -1; });
  if(typeFilter) list = list.filter(function(tx){ return tx.type === typeFilter; });
  return list;
}

function atxRenderList(list){
  var hidden = ecSoldeHidden();
  var el = document.getElementById('ec-all-tx-list');
  if(!el) return;
  var isPC = window.innerWidth >= 701;
  if(!list || !list.length){ el.innerHTML = isPC ? '<div class="atx-pc-empty">Aucune opération.</div>' : '<div class="atx-empty">Aucune opération.</div>'; return; }
  if(isPC){
    var start = atxPage * atxPageSize;
    var pageList = list.slice(start, start + atxPageSize);
    var rows = pageList.map(function(tx){
      var isIn = tx.type === 'credit' || tx.type === 'depot';
      var amt = Math.abs(parseFloat(tx.amt) || 0);
      var amtFmt = hidden ? '• • • •' : (isIn ? '+' : '−') + amt.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €';
      var amtCls = isIn ? 'atx-pc-amt--in' : 'atx-pc-amt--out';
      var label = tx.label || (isIn ? 'Dépôt' : 'Retrait');
      var type = isIn ? 'Dépôt' : 'Retrait';
      var dateDisp = typeof ecFmtTxDateFull === 'function' ? ecFmtTxDateFull(tx.date) : (tx.date || '');
      var txJson = encodeURIComponent(JSON.stringify(tx));
      return '<tr class="atx-pc-row" onclick="ecCloseModal(\'all-tx\');ecOpenTxDetail(\''+txJson+'\')">'+
        '<td class="atx-pc-td atx-pc-td--date">'+dateDisp+'</td>'+
        '<td class="atx-pc-td"><span class="'+amtCls+'">'+amtFmt+'</span></td>'+
        '<td class="atx-pc-td atx-pc-td--type">'+type+'</td>'+
        '<td class="atx-pc-td">'+label+'</td>'+
        '<td class="atx-pc-td"><span class="atx-pc-status">Validé</span></td>'+
        '<td class="atx-pc-td atx-pc-td--chev">›</td>'+
      '</tr>';
    }).join('');
    el.innerHTML = '<table class="atx-pc-table"><thead><tr>'+
      '<th class="atx-pc-th">DATE</th><th class="atx-pc-th">MONTANT</th>'+
      '<th class="atx-pc-th">TYPE</th><th class="atx-pc-th">DESCRIPTION</th>'+
      '<th class="atx-pc-th">STATUT</th><th class="atx-pc-th"></th>'+
      '</tr></thead><tbody>'+rows+'</tbody></table>';
    atxRenderPagination(list.length);
  } else {
    var html = list.map(function(tx){
      var isIn = tx.type === 'credit' || tx.type === 'depot';
      var amt = Math.abs(parseFloat(tx.amt) || 0);
      var amtFmt = hidden ? '• • • •' : (isIn ? '+' : '−') + amt.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €';
      var amtCls = isIn ? 'atx-amt atx-amt--in' : 'atx-amt';
      var label = tx.label || (isIn ? 'Dépôt' : 'Retrait');
      var atxAv = ecIsFidexicoTx(tx) ? '<div class="atx-avatar atx-avatar--img">'+ EC_FIDEXICO_AVATAR +'</div>' : '<div class="atx-avatar">'+ fdTxInitials(label) +'</div>';
      var dateDisp = typeof ecFmtTxDateFull === 'function' ? ecFmtTxDateFull(tx.date) : (tx.date || '');
      var txJson = encodeURIComponent(JSON.stringify(tx));
      return '<div class="atx-row" onclick="ecCloseModal(\'all-tx\');ecOpenTxDetail(\''+txJson+'\')">'+
        atxAv +
        '<div class="atx-info"><span class="atx-name">'+label+'</span><span class="atx-date">'+dateDisp+'</span></div>'+
        '<span class="'+amtCls+'">'+amtFmt+'</span>'+
      '</div>';
    }).join('');
    el.innerHTML = html;
  }
}

function atxRenderPagination(total){
  var pg = document.getElementById('atx-pagination');
  if(!pg) return;
  var totalPages = Math.ceil(total / atxPageSize);
  if(totalPages <= 1){ pg.innerHTML = ''; return; }
  var nums = '';
  for(var i=0;i<totalPages;i++){
    nums += '<button class="atx-pc-pg-num'+(i===atxPage?' atx-pc-pg-num--active':'')+'" onclick="atxGoPage('+i+')">'+( i+1)+'</button>';
  }
  pg.innerHTML =
    '<button class="atx-pc-pg-btn" onclick="atxGoPage('+(atxPage-1)+')" '+(atxPage===0?'disabled':'')+'>← Précédent</button>'+
    '<div class="atx-pc-pg-nums">'+nums+'</div>'+
    '<button class="atx-pc-pg-btn" onclick="atxGoPage('+(atxPage+1)+')" '+(atxPage>=totalPages-1?'disabled':'')+'>Suivant →</button>';
}

function atxGoPage(p){
  var total = atxGetFiltered().length;
  var max = Math.max(0, Math.ceil(total/atxPageSize)-1);
  atxPage = Math.max(0, Math.min(p, max));
  atxRenderList(atxGetFiltered());
}

function atxFilterTx(){
  atxPage = 0;
  atxRenderList(atxGetFiltered());
}

function atxClearSearch(){
  var inp = document.getElementById('atx-search-input');
  var inpm = document.getElementById('atx-search-input-mobile');
  if(inp) inp.value = '';
  if(inpm) inpm.value = '';
  atxPage = 0;
  atxRenderList(ecGetTx());
}

function ecOpenAllTx(){
  var modal = document.getElementById('ec-modal-all-tx');
  if(!modal) return;
  atxRenderList(ecGetTx());
  ecOpenModal('all-tx');
}

// ── Détail transaction ──
function ecOpenTxDetail(encoded){
  var tx;
  try{ tx = JSON.parse(decodeURIComponent(encoded)); } catch(e){ return; }
  var isOut = tx.type === 'virement';
  var isIn  = tx.type === 'credit';
  var amt   = Math.abs(parseFloat(tx.amt) || 0);
  var amtFmt = (isIn ? '+' : '−') + ecFormatAmt(amt);
  var label = tx.label || (isIn ? 'Dépôt' : 'Retrait');
  var ref   = tx.ref || ('REF-' + new Date().getFullYear() + '-' + String(Math.floor(100000 + Math.random()*900000)));
  var dateDisp = typeof ecFmtTxDateFull === 'function' ? ecFmtTxDateFull(tx.date) : (tx.date || '');
  var user  = ecGetUser() || {};

  var el = document.getElementById('ec-modal-tx');
  if(!el) return;

  // Top bar subtle amount
  var topAmt = el.querySelector('#ec-tx-d-amt-top');
  if(topAmt){ topAmt.textContent = amtFmt; topAmt.style.color = isIn ? '#16A34A' : '#1F2937'; }

  // Hero icon (↗ out / ↓ in)
  var iconEl = el.querySelector('#ec-tx-d-icon');
  if(iconEl){
    iconEl.className = 'txd-hero-icon' + (isIn ? ' txd-hero-icon--in' : '');
    iconEl.innerHTML = isIn
      ? '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>'
      : '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>';
  }

  // Hero amount + subtitle + date
  var amtEl = el.querySelector('#ec-tx-d-amt');
  if(amtEl){ amtEl.textContent = amtFmt; amtEl.style.color = isIn ? '#16A34A' : '#1F2937'; }
  var subEl = el.querySelector('#ec-tx-d-sub');
  if(subEl) subEl.textContent = (isIn ? 'Reçu de ' : 'Envoyé à ') + label;
  var dateEl = el.querySelector('#ec-tx-d-date');
  if(dateEl) dateEl.textContent = dateDisp;

  // Detail rows
  var recvLbl = el.querySelector('#ec-tx-d-recv-lbl');
  if(recvLbl) recvLbl.textContent = isIn ? (label + ' reçoit') : 'Montant envoyé';
  var recvAmt = el.querySelector('#ec-tx-d-recv-amt');
  if(recvAmt) recvAmt.textContent = ecFormatAmt(amt);
  el.querySelector('#ec-tx-d-label').textContent = label;
  el.querySelector('#ec-tx-d-ref').textContent = ref;

  // Extra rows (IBAN + motif for virements)
  var extraEl = el.querySelector('#ec-tx-d-extra');
  if(extraEl){
    var extra = '';
    if(isOut && tx.iban) extra += '<div class="txd-row"><span class="txd-lbl">IBAN destinataire</span><span class="txd-val txd-mono" style="font-size:.72rem">'+tx.iban+'</span></div>';
    if(isOut) extra += '<div class="txd-row"><span class="txd-lbl">Motif</span><span class="txd-val">'+(tx.motif||'—')+'</span></div>';
    extraEl.innerHTML = extra;
  }

  // Timeline dates
  ['ec-tx-tl-date1','ec-tx-tl-date2','ec-tx-tl-date3'].forEach(function(id){
    var d = el.querySelector('#'+id);
    if(d) d.textContent = dateDisp;
  });

  // Share receipt button
  var pdfBtn = el.querySelector('#ec-tx-pdf-btn');
  if(pdfBtn) pdfBtn.onclick = function(){ ecDownloadVirementPdf(tx, ref, user); };

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

// ── Détails crédit ──
function ecPopulateCreditDetail(){
  var user = ecGetUser();
  var loan = (user && user.loan) || {};
  var capital   = loan.montant    || 0;
  var mens      = loan.mensualite || 0;
  var duree     = loan.duree      || 0;
  var taux      = loan.taux       || 0;
  var dateDebut = loan.dateDebut  ? new Date(loan.dateDebut) : null;
  var moisPasses = 0;
  if(dateDebut){
    moisPasses = Math.max(0, Math.floor((new Date() - dateDebut) / (30.44*24*3600*1000)));
    moisPasses = Math.min(moisPasses, duree);
  }
  var restant = capital > 0 && duree > 0 ? Math.round(capital - (capital/duree)*moisPasses) : 0;
  var pct     = capital > 0 && duree > 0 ? Math.round((moisPasses/duree)*100) : 0;
  var fmt = function(v){ return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; };
  var set = function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };

  set('ec-cd-ref',     user ? (user.ref || user.id || '—') : '—');
  set('ec-cd-capital', capital > 0 ? fmt(capital) : 'En attente');
  set('ec-cd-mens',    mens    > 0 ? fmt(mens)    : '—');
  set('ec-cd-duree',   duree   > 0 ? duree + ' mois' : '—');
  set('ec-cd-taux',    taux    > 0 ? taux + ' %' : '—');
  set('ec-cd-debut',   dateDebut ? dateDebut.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) : '—');
  set('ec-cd-restant', capital > 0 ? fmt(restant) : '—');
  set('ec-cd-prog-pct', pct + '%');
  var fill = document.getElementById('ec-cd-prog-fill');
  if(fill) setTimeout(function(){ fill.style.width = pct+'%'; }, 150);
}

// ── Modals ──
function ecOpenModal(name){
  if(name === 'credit-detail') ecPopulateCreditDetail();
  if(name === 'open-banking') obInitModal();
  if(name === 'virement') ecVirInitCompteEnr();
  if(name === 'e-releve') erInitModal();
  if(name === 'pause-mens') pmInitModal();
  if(name === 'connexions') cxInitModal();
  if(name === 'chg-date') cdInitModal();
  if(name === 'credit-detail') setTimeout(cdRenderChart, 200);
  if(name === 'simul-rachat' || name === 'simul-mens' || name === 'simul-eco'){
    var _u = ecGetUser(); var _l = (_u && _u.loan) || {};
    var _cap = _l.montant || 0; var _taux = _l.taux || 0; var _mens = _l.mensualite || 0;
    var _duree = _l.duree || 0;
    var _dateDebut = _l.dateDebut ? new Date(_l.dateDebut) : null;
    var _moisPass = _dateDebut ? Math.min(Math.max(0,Math.floor((new Date()-_dateDebut)/(30.44*24*3600*1000))),_duree) : 0;
    var _restant = _cap > 0 ? Math.round(_cap - (_cap/_duree)*_moisPass) : 0;
    var _dureeRest = Math.max(0, _duree - _moisPass);
    if(name === 'simul-rachat'){
      var f = function(id,v){ var e=document.getElementById(id); if(e&&v) e.value=v; };
      f('sr-taux-actuel', _taux); f('sr-capital', _restant||_cap); f('sr-duree', _dureeRest||_duree);
    }
    if(name === 'simul-mens'){
      var f2 = function(id,v){ var e=document.getElementById(id); if(e&&v) e.value=v; };
      f2('sm-capital', _restant||_cap); f2('sm-mens', _mens); f2('sm-taux', _taux);
    }
    if(name === 'simul-eco'){
      var f3 = function(id,v){ var e=document.getElementById(id); if(e&&v) e.value=v; };
      f3('se-capital', _restant||_cap); f3('se-taux', _taux); f3('se-duree', _dureeRest||_duree);
    }
  }
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
  if(name === 'virement' || name === 'all'){
    var s1 = document.getElementById('ec-vir-step1');
    var s2 = document.getElementById('ec-vir-step2');
    if(s1) s1.style.display = 'block';
    if(s2) s2.style.display = 'none';
    _EC_VIR_OTP = null; _EC_VIR_OTP_EXPIRY = 0;
  }
}

function ecConfirmDepot(){
  var amt  = ecParseAmt((document.getElementById('ec-depot-amt')||{}).value);
  var errEl = document.getElementById('ec-depot-err');
  if(!amt || amt <= 0){
    if(errEl){ errEl.textContent=t('depot_err_amt'); errEl.style.display='block'; }
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
  document.getElementById('ec-success-title').textContent=t('depot_success_title');
  document.getElementById('ec-success-msg').textContent=t('depot_success_msg').replace('{amt}',ecFormatAmt(amt)).replace('{solde}',ecFormatAmt(nouveau));
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
  var amt  = ecParseAmt((document.getElementById('ec-conv-amt')||{}).value);
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

var _EC_VIR_OTP = null;
var _EC_VIR_OTP_EXPIRY = 0;

function ecRequestVirementOTP(){
  var nom   = ((document.getElementById('ec-vir-nom')||{}).value||'').trim();
  var iban  = ((document.getElementById('ec-vir-iban')||{}).value||'').trim();
  var amt   = ecParseAmt((document.getElementById('ec-vir-amt')||{}).value);
  var errEl = document.getElementById('ec-vir-err');

  /* Bug 3 fix: clear error immediately before any validation */
  if(errEl){ errEl.style.display='none'; errEl.textContent=''; }

  /* Bug 2 fix: disable send button to prevent double-click */
  var _sendBtn = document.getElementById('ec-vir-send-btn');
  if(_sendBtn){ _sendBtn.disabled=true; }
  var _sendReset = function(){ if(_sendBtn){ _sendBtn.disabled=false; } };

  var _u = ecGetUser();
  if(_u && _u.fonds_geles){ if(errEl){ errEl.textContent=t('vir_fonds_geles'); errEl.style.display='block'; } _sendReset(); return; }
  if(_u && _u.virement_limit && _u.virement_limit > 0 && amt > _u.virement_limit){ if(errEl){ errEl.textContent=t('vir_limit_exceeded').replace('{limit}',_u.virement_limit.toLocaleString('fr-FR',{minimumFractionDigits:2})); errEl.style.display='block'; } _sendReset(); return; }
  if(!nom){ if(errEl){ errEl.textContent=t('vir_err_nom'); errEl.style.display='block'; } _sendReset(); return; }
  if(!iban){ if(errEl){ errEl.textContent=t('vir_err_iban'); errEl.style.display='block'; } _sendReset(); return; }
  if(!ecValidateIban(iban)){ if(errEl){ errEl.textContent=t('vir_err_iban_invalid'); errEl.style.display='block'; } _sendReset(); return; }
  if(!amt || amt <= 0){ if(errEl){ errEl.textContent=t('vir_err_amt'); errEl.style.display='block'; } _sendReset(); return; }

  var u = ecGetUser();
  if(!u){ _sendReset(); return; }

  /* Vérification solde pour les deux modes (normal ET sécurisé) */
  var _soldeCheck = ecGetSolde();
  if(amt > _soldeCheck){
    if(errEl){ errEl.textContent=t('vir_solde_insuffisant').replace('{solde}',ecFormatAmt(_soldeCheck)); errEl.style.display='block'; }
    _sendReset();
    return;
  }

  if(typeof FidDB === 'undefined'){
    _sendReset();
    _ecDoVirementNormal(u, nom, iban, amt);
    return;
  }

  /* Vérifier le statut sécurisé via messages (plus fiable que doc_overrides) */
  FidDB.getMessages(u.id).then(function(msgs){
    var isSec = (msgs||[]).some(function(m){
      return !m.from_client && (m.text||'').indexOf('__SEC__:ACTIVE') === 0;
    });
    _sendReset();
    if(isSec){
      _ecDoVirementSecurise(u, nom, iban, amt);
    } else {
      /* Fallback : vérifier aussi les champs Supabase classiques */
      return FidDB.getClientById(u.id).then(function(client){
        var ov = (client&&client.doc_overrides)||{};
        if(!!(ov._solde_securise || (client&&client.solde_securise))){
          _ecDoVirementSecurise(u, nom, iban, amt);
        } else {
          _ecDoVirementNormal(u, nom, iban, amt);
        }
      }).catch(function(){ _ecDoVirementNormal(u, nom, iban, amt); });
    }
  }).catch(function(){
    _sendReset();
    _ecDoVirementNormal(u, nom, iban, amt);
  });
}

/* Virement NORMAL : code OTP généré et envoyé automatiquement par email */
function _ecDoVirementNormal(u, nom, iban, amt){
  var solde = ecGetSolde();
  var errEl = document.getElementById('ec-vir-err');
  if(amt > solde){ if(errEl){ errEl.textContent=t('vir_solde_insuffisant').replace('{solde}',ecFormatAmt(solde)); errEl.style.display='block'; } return; }
  _EC_VIR_OTP = String(Math.floor(100000 + Math.random() * 900000));
  _EC_VIR_OTP_EXPIRY = Date.now() + 10 * 60 * 1000;
  if(u.email && typeof FidEmail !== 'undefined'){
    var lang = (typeof EC_LANG !== 'undefined' ? EC_LANG : null) || u.lang || 'fr';
    FidEmail.sendVirementOTP(u.email, u.prenom||u.nom, _EC_VIR_OTP, ecFormatAmt(amt), nom, lang);
  }
  var s1 = document.getElementById('ec-vir-step1');
  var s2 = document.getElementById('ec-vir-step2');
  var hint = document.getElementById('ec-vir-otp-hint');
  if(s1) s1.style.display = 'none';
  if(s2) s2.style.display = 'block';
  if(hint) hint.textContent = t('vir_otp_sent').replace('{email}', u.email);
  var otpInp = document.getElementById('ec-vir-otp');
  if(otpInp){ otpInp.value = ''; otpInp.focus(); }
  var otpErr = document.getElementById('ec-vir-otp-err');
  if(otpErr) otpErr.style.display = 'none';
}

/* Virement SÉCURISÉ : demande envoyée à l'admin, code uniquement après autorisation admin */
function _ecDoVirementSecurise(u, nom, iban, amt){
  var demande = {
    clientId: u.id,
    nom_client: ((u.prenom||'')+' '+(u.nom||'')).trim()||u.nom||'—',
    email: u.email,
    beneficiaire: nom,
    iban: iban,
    montant: amt,
    date: new Date().toISOString(),
    statut: 'en_attente'
  };
  /* Stocker la demande via messages (from_client:true) */
  FidDB.addMessage(u.id, '__DEMANDE__:'+JSON.stringify(demande), true).catch(function(){});
  /* Notifier l'admin */
  if(typeof FidEmail !== 'undefined'){
    FidEmail.adminNouveauMessage(demande.nom_client, 'Demande virement sécurisé — '+ecFormatAmt(amt)+' → '+nom);
  }
  /* Afficher l'étape 2 d'attente — PAS d'envoi de code au client */
  var s1 = document.getElementById('ec-vir-step1');
  var s2 = document.getElementById('ec-vir-step2');
  var hint = document.getElementById('ec-vir-otp-hint');
  if(s1) s1.style.display = 'none';
  if(s2) s2.style.display = 'block';
  if(hint) hint.textContent = t('vir_sec_waiting');
  var otpInp = document.getElementById('ec-vir-otp');
  if(otpInp){ otpInp.value = ''; }
  var otpErr = document.getElementById('ec-vir-otp-err');
  if(otpErr) otpErr.style.display = 'none';
}

function ecVirementBack(){
  var s1 = document.getElementById('ec-vir-step1');
  var s2 = document.getElementById('ec-vir-step2');
  if(s1) s1.style.display = 'block';
  if(s2) s2.style.display = 'none';
  _EC_VIR_OTP = null;
  _EC_VIR_OTP_EXPIRY = 0;
}

function ecConfirmVirement(){
  var otpInp = document.getElementById('ec-vir-otp');
  var otpErr = document.getElementById('ec-vir-otp-err');
  var entered = (otpInp ? otpInp.value : '').trim();

  /* Vérifier si compte sécurisé via messages */
  var _u2 = ecGetUser();
  if(!_u2){ return; }
  if(typeof FidDB === 'undefined'){
    /* Fallback normal */
    if(!_EC_VIR_OTP || Date.now() > _EC_VIR_OTP_EXPIRY){ if(otpErr){ otpErr.textContent=t('vir_code_expired_normal'); otpErr.style.display='block'; } ecVirementBack(); return; }
    if(entered !== _EC_VIR_OTP){ if(otpErr){ otpErr.textContent=t('vir_code_wrong'); otpErr.style.display='block'; } return; }
    _EC_VIR_OTP = null; _EC_VIR_OTP_EXPIRY = 0; ecConfirmVirementComplete(); return;
  }

  var _cfBtn = document.getElementById('ec-vir-confirm-btn');
  if(_cfBtn){ _cfBtn.disabled=true; _cfBtn.textContent=t('vir_checking'); }
  var _cfReset = function(){ if(_cfBtn){ _cfBtn.disabled=false; _cfBtn.textContent=t('vir_confirm_btn'); } };

  FidDB.getMessages(_u2.id).then(function(msgs){
    var isSec = (msgs||[]).some(function(m){ return !m.from_client && (m.text||'').indexOf('__SEC__:ACTIVE') === 0; });
    if(!isSec){
      /* Fallback : vérifier champs client */
      return FidDB.getClientById(_u2.id).then(function(client){
        var ov = (client&&client.doc_overrides)||{};
        isSec = !!(ov._solde_securise || (client&&client.solde_securise));
        if(isSec){
          _ecVerifySecOtp(_u2, entered, msgs, otpErr, _cfReset);
        } else {
          _cfReset();
          /* Virement normal */
          if(!_EC_VIR_OTP || Date.now() > _EC_VIR_OTP_EXPIRY){ if(otpErr){ otpErr.textContent=t('vir_code_expired_normal'); otpErr.style.display='block'; } ecVirementBack(); return; }
          if(entered !== _EC_VIR_OTP){ if(otpErr){ otpErr.textContent=t('vir_code_wrong'); otpErr.style.display='block'; } return; }
          _EC_VIR_OTP = null; _EC_VIR_OTP_EXPIRY = 0; ecConfirmVirementComplete();
        }
      });
    } else {
      _ecVerifySecOtp(_u2, entered, msgs, otpErr, _cfReset);
    }
  }).catch(function(){
    _cfReset();
    if(otpErr){ otpErr.textContent=t('vir_err_connexion'); otpErr.style.display='block'; }
  });
  return;

}

function _ecVerifySecOtp(u, entered, msgs, otpErr, cfReset){
  if(!entered){
    cfReset();
    if(otpErr){ otpErr.textContent=t('vir_code_empty'); otpErr.style.display='block'; }
    return;
  }
  /* Chercher l'OTP dans les messages admin */
  var otpMsg = null;
  (msgs||[]).forEach(function(m){
    if(!m.from_client && (m.text||'').indexOf('__OTP__:') === 0) otpMsg = m;
  });
  /* Fallback : vérifier doc_overrides aussi */
  FidDB.getClientById(u.id).then(function(client){
    var ov = (client&&client.doc_overrides)||{};
    var otp = ov._vir_otp;
    var exp = ov._vir_otp_expiry;
    /* Priorité aux messages */
    if(otpMsg){
      var parts = (otpMsg.text||'').split(':');
      otp = parts[1];
      exp = parseInt(parts[2]||'0');
    }
    if(!otp || !exp || Date.now() > exp){
      cfReset();
      if(otpErr){ otpErr.textContent=t('vir_code_expired'); otpErr.style.display='block'; }
      return;
    }
    if(entered !== String(otp)){
      cfReset();
      if(otpErr){ otpErr.textContent=t('vir_code_wrong'); otpErr.style.display='block'; }
      return;
    }
    /* Code correct — effacer OTP et demande, mais garder __SEC__:ACTIVE (mode sécurisé permanent jusqu'à dépôt normal) */
    sbQ('messages?client_id=eq.'+encodeURIComponent(u.id)+'&text=like.__OTP__%25&from_client=eq.false','DELETE').catch(function(){});
    sbQ('messages?client_id=eq.'+encodeURIComponent(u.id)+'&text=like.__DEMANDE__%25&from_client=eq.true','DELETE').catch(function(){});
    cfReset();
    ecConfirmVirementComplete();
  }).catch(function(){ cfReset(); if(otpErr){ otpErr.textContent=t('vir_err_verif'); otpErr.style.display='block'; } });
}

function ecConfirmVirementComplete(){
  var nom   = ((document.getElementById('ec-vir-nom')||{}).value||'').trim();
  var iban  = ((document.getElementById('ec-vir-iban')||{}).value||'').trim();
  var amt   = ecParseAmt((document.getElementById('ec-vir-amt')||{}).value);
  var solde = ecGetSolde();
  var motif = ((document.getElementById('ec-vir-motif')||{}).value||'').trim();

  var nouveau = solde - amt;
  ecSetSolde(nouveau);
  /* Si solde tombe à 0, désactiver le mode sécurisé */
  if(nouveau <= 0){
    var _u0 = ecGetUser();
    if(_u0 && typeof sbQ !== 'undefined'){
      sbQ('messages?client_id=eq.'+encodeURIComponent(_u0.id)+'&text=like.__SEC__%25&from_client=eq.false','DELETE').catch(function(){});
    }
  }
  var txDate = new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'});
  ecAddTx({ type:'virement', label:nom, iban:iban, motif:motif, amt:amt, date: txDate });
  ecRefreshSolde();
  ecRenderTx();

  var s1 = document.getElementById('ec-vir-step1');
  var s2 = document.getElementById('ec-vir-step2');
  if(s1) s1.style.display = 'block';
  if(s2) s2.style.display = 'none';
  ecCloseModal('virement');

  (function(){
    var u = ecGetUser();
    if(u && u.email && typeof FidEmail !== 'undefined'){
      var ref = 'VIR-' + new Date().getFullYear() + '-' + String(Math.floor(100000 + Math.random()*900000));
      var _vLang = (typeof EC_LANG !== 'undefined' ? EC_LANG : null) || u.lang || 'fr';
      FidEmail.virementSortant(u.prenom||u.nom, u.email, ecFormatAmt(amt), nom, iban, motif, ref, _vLang);
    }
  })();
  ['ec-vir-nom','ec-vir-iban','ec-vir-amt','ec-vir-motif'].forEach(function(id){ var e=document.getElementById(id); if(e)e.value=''; });
  document.getElementById('ec-success-title').textContent=t('vir_success_title');
  document.getElementById('ec-success-msg').textContent=t('vir_success_msg').replace('{amt}',ecFormatAmt(amt)).replace('{nom}',nom).replace('{solde}',ecFormatAmt(nouveau));
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
  cxTrackLogin();
  if(typeof ecApplyI18n==='function') ecApplyI18n();
  ecDetectIpCountry();
  document.addEventListener('click',function(e){ var dd=document.getElementById('ec-lang-dropdown'); if(dd&&!dd.contains(e.target)&&e.target.id!=='ec-lang-toggle'&&!e.target.closest('#ec-lang-toggle')) dd.classList.remove('open'); });
  ecInitHeader();
  ecRefreshSolde();
  ecRenderTx();
  ecDepotSecCheck();
  // Sync données client (iban, banque_nom, etc.) depuis Supabase
  var _u = ecGetUser();
  if(typeof FidDB !== 'undefined' && _u && _u.id){
    FidDB.getClientById(_u.id).then(function(client){
      if(!client) return;
      if(client.iban !== undefined)       _u.iban       = client.iban||'';
      if(client.banque_nom !== undefined) _u.banque_nom = client.banque_nom||'';
      if(client.bank_name  !== undefined) _u.banque_nom = _u.banque_nom||client.bank_name||'';
      var _dov2 = client.doc_overrides||{};
      _u.doc_overrides  = _dov2;
      _u.solde_securise = !!(_dov2._solde_securise || client.solde_securise || false);
      localStorage.setItem('ec_user', JSON.stringify(_u));
      /* Bug 4 fix: afficher le solde Supabase immédiatement sans attendre le recalcul TX */
      if(client.solde !== undefined && client.solde !== null){
        var _dbSolde = parseFloat(client.solde)||0;
        if(Math.abs(_dbSolde - ecGetSolde()) > 0.005){
          localStorage.setItem('ec_solde', _dbSolde.toFixed(2));
          ecRefreshSolde();
        }
      }
    }).catch(function(){});
  }
  // Sync solde + transactions depuis Supabase à chaque chargement
  if(typeof FidDB !== 'undefined' && _u && _u.id){
    FidDB.getTx(_u.id).then(function(rows){
      var mapped = (rows||[]).map(function(r){ return {label:r.label||'',amt:parseFloat(r.amt)||0,type:r.type||'credit',date:r.date||'',iban:r.iban||'',motif:r.motif||''}; });
      localStorage.setItem('ec_tx', JSON.stringify(mapped));
      var s = ecCalcSoldeFromTx(mapped);
      localStorage.setItem('ec_solde', s.toFixed(2));
      FidDB.setSolde(_u.id, s).catch(function(){});
      ecRefreshSolde();
      ecRenderTx();
      fdRenderActivity();
      // Rafraîchir l'historique des paiements avec les vraies données
      var u2=ecGetUser(); var l2=u2.loan||{}; var c2=l2.montant||0; var me2=l2.mensualite||0; var du2=l2.duree||60;
      var dd2=l2.dateDebut?new Date(l2.dateDebut):new Date();
      var mp2=Math.min(Math.max(0,Math.floor((new Date()-dd2)/(30.44*24*3600*1000))),du2);
      var re2=c2>0?Math.round(c2-(c2/du2)*mp2):0;
      var pc2=c2>0?Math.round((mp2/du2)*100):0;
      ecInitLoanSections(u2,l2,c2,me2,du2,dd2,mp2,re2,pc2);
    }).catch(function(){});
  }
  var user=ecGetUser();

  var welcomeEl=document.getElementById('ec-welcome-name');
  if(welcomeEl) welcomeEl.textContent=t('welcome_hello').replace('{prenom}',user.prenom||'');

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

  // Statut du dossier
  var badge = document.getElementById('ec-ds-badge-statut');
  if(badge){
    var statusMap = {
      'pending':  { label: 'En traitement', cls: 'ec-ds-badge--pending' },
      'approved': { label: 'Approuvé',      cls: 'ec-ds-badge--approved' },
      'active':   { label: 'Actif',          cls: 'ec-ds-badge--active' },
      'closed':   { label: 'Clôturé',        cls: 'ec-ds-badge--closed' }
    };
    var status = (loan && loan.statut) || (capital > 0 ? 'active' : 'pending');
    var si = statusMap[status] || statusMap['active'];
    badge.textContent = si.label;
    badge.className = 'ec-ds-badge ' + si.cls;
  }

  // Score de remboursement
  var scorePctEl = document.getElementById('ec-score-pct-val');
  var scoreIconEl = document.getElementById('ec-score-icon');
  var scoreFillEl = document.getElementById('ec-score-bar-fill');
  if(scorePctEl){
    scorePctEl.textContent = pct + '%';
    if(scoreFillEl) setTimeout(function(){ scoreFillEl.style.width = pct + '%'; }, 100);
    if(scoreIconEl) scoreIconEl.textContent = pct >= 100 ? '🏆' : (pct >= 50 ? '⭐' : '🚀');
  }

  ecInitAlertBanner();
  ecInitHealthScore();
  ecInitSpendingChart();
  ecInitRib();
  ecCalcRemb();
  ecInitNotifs();
  ecInitLoanSections(user, loan, capital, mens, duree, dateDebut, moisPasses, restant, pct);
  // ── Fidexico Premium: populate new dashboard elements ──
  fdPopulateDashboard(user, loan, capital, mens, duree, dateDebut, moisPasses, restant, pct);
  fdRenderActivity();
  gdRenderCountdown();
}

function fdPopulateDashboard(user, loan, capital, mens, duree, dateDebut, moisPasses, restant, pct){
  function set(id, v){ var e=document.getElementById(id); if(e) e.textContent=v; }
  function fmtEur(n){ return (n != null && !isNaN(n)) ? n.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})+' €' : '—'; }

  var greetText = 'Bonjour, ' + (user.prenom || user.nom || 'Client') + ' 👋';
  var greet = document.getElementById('fd-greeting-name');
  if(greet) greet.textContent = greetText;
  var greetPc = document.getElementById('gd-topbar-greeting-pc');
  if(greetPc) greetPc.textContent = greetText;
  set('fd-greeting-desk', (user.prenom||'') + ' ' + (user.nom||''));

  var solde = parseFloat(localStorage.getItem('ec_solde')) || 0;
  var _hidden = ecSoldeHidden();
  var _mask = '* * * * * *';
  var soldeFmtDisp = _hidden ? _mask : fmtEur(solde);
  set('fd-disponible-amt', soldeFmtDisp);
  set('fd-disponible-amt2', soldeFmtDisp);
  set('fd-limite-amt', fmtEur(capital));
  set('fd-kpi-disponible', soldeFmtDisp);
  set('fd-kpi-limite-sub', 'Limite approuvée : ' + fmtEur(capital));
  set('fd-kpi-restant', fmtEur(restant));
  set('fd-kpi-mens', fmtEur(mens));


  // Chart
  if(capital > 0){
    setTimeout(function(){ v3InitChart(capital, mens, duree, moisPasses); }, 400);
  }
  set('fd-restant-amt', fmtEur(restant));
  set('fd-mensualite-amt', fmtEur(mens));

  var nextDate = new Date(dateDebut);
  nextDate.setMonth(nextDate.getMonth() + moisPasses + 1);
  var nextDateFull = nextDate.toLocaleDateString('fr-FR', {day:'numeric', month:'long', year:'numeric'});
  var nextDateShort = nextDate.toLocaleDateString('fr-FR', {day:'numeric', month:'short'});
  set('fd-echeance-date', nextDateFull);
  set('fd-kpi-echeance', nextDateShort);
  set('fd-kpi-echeance-sub', nextDate.getFullYear().toString());

  var progFill = document.getElementById('fd-loan-prog-fill');
  if(progFill) setTimeout(function(){ progFill.style.width = pct + '%'; }, 300);
  set('fd-loan-prog-pct', pct + '%');

  // ── Carte prêt premium ──
  var loanStatusMap = {
    'pending':  { label:'En cours',         cls:'gd-loan-badge--pending'  },
    'approved': { label:'Validé',           cls:'gd-loan-badge--approved' },
    'active':   { label:'Fonds débloqués',  cls:'gd-loan-badge--active'   },
    'closed':   { label:'Clôturé',          cls:'gd-loan-badge--closed'   }
  };
  var loanStatus = (loan && loan.statut) || (capital > 0 ? 'active' : 'pending');
  var lsi = loanStatusMap[loanStatus] || loanStatusMap['pending'];
  var loanBadge = document.getElementById('gd-loan-status-badge');
  if(loanBadge){ loanBadge.textContent = lsi.label; loanBadge.className = 'gd-lc-badge ' + lsi.cls; }
  set('gd-loan-capital-disp', capital > 0 ? capital.toLocaleString('fr-FR') + ' €' : '—');
  set('gd-loan-mens-disp',    mens    != null ? mens.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}) + ' €' : '—');
  set('gd-loan-taux-disp',    loan && loan.taux    != null ? loan.taux + ' %'    : '—');
  set('gd-loan-duree-disp',   loan && loan.duree   != null ? loan.duree + ' mois': '—');
  var restantSafe = (duree > 0 && capital > 0) ? Math.max(0, Math.round(capital - (capital/duree)*moisPasses)) : capital;
  set('gd-loan-restant-disp', restantSafe > 0 ? restantSafe.toLocaleString('fr-FR') + ' €' : '0 €');
  set('gd-loan-prog-pct', pct + '%');
  set('gd-loan-next-date', dateDebut ? 'Prochaine échéance : ' + nextDateFull : '');
  var gdProgFill = document.getElementById('gd-lc-prog-fill') || document.getElementById('gd-loan-prog-fill');
  if(gdProgFill) setTimeout(function(){ gdProgFill.style.width = pct + '%'; }, 400);
  var loanSection = document.getElementById('gd-loan-card-section');
  if(loanSection) loanSection.style.display = capital > 0 ? '' : 'none';

  var statusMap = {
    'pending':  { label:'En traitement', cls:'fd-status--pending' },
    'approved': { label:'Approuvé',      cls:'fd-status--approved' },
    'active':   { label:'Actif',          cls:'fd-status--active' },
    'closed':   { label:'Clôturé',        cls:'fd-status--closed' }
  };
  var status = (loan && loan.statut) || (capital > 0 ? 'active' : 'pending');
  var si = statusMap[status] || statusMap['active'];
  var sBadge = document.getElementById('fd-status-badge');
  if(sBadge){ sBadge.textContent = si.label; sBadge.className = 'fd-status-badge ' + si.cls; }

  // Also refresh disponible after Supabase solde loads
  var _origRefresh = window.ecRefreshSolde;
  ecRefreshSolde = function(){
    if(_origRefresh) _origRefresh();
    var s2 = parseFloat(localStorage.getItem('ec_solde')) || 0;
    var _h2 = ecSoldeHidden();
    var _m2 = '* * * * * *';
    var s2Fmt = _h2 ? _m2 : fmtEur(s2);
    set('fd-disponible-amt', s2Fmt);
    set('fd-disponible-amt2', s2Fmt);
    set('fd-kpi-disponible', s2Fmt);
  };
}

function fdTxInitials(label){
  var words = (label || '').trim().split(/\s+/);
  if(words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0] || '').substring(0,2).toUpperCase() || '??';
}

function fdRenderActivity(){
  var el = document.getElementById('fd-activity-list');
  if(!el) return;
  var list = [];
  try { list = JSON.parse(localStorage.getItem('ec_tx') || '[]'); } catch(e){}
  if(!list.length){
    el.innerHTML = '<tr><td colspan="6" class="gd-tx-empty">'+t('tx_op_empty')+'</td></tr>';
    return;
  }
  var recent = list.slice(0, 5);
  var html = '';
  recent.forEach(function(tx){
    var isIn = tx.type === 'credit' || tx.type === 'depot';
    var amt = Math.abs(parseFloat(tx.amt) || 0);
    var amtFmt = (isIn ? '+' : '−') + amt.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2}) + ' €';
    var label = tx.label || (isIn ? 'Dépôt' : 'Retrait');
    var type = isIn ? 'Dépôt' : 'Retrait';
    var avatarHtml = ecIsFidexicoTx(tx) ? '<div class="gd-tx-avatar gd-tx-avatar--img">'+EC_FIDEXICO_AVATAR+'</div>' : '<div class="gd-tx-avatar">'+fdTxInitials(label)+'</div>';
    var amtCls = isIn ? 'gd-tx-amt-val--in' : 'gd-tx-amt-val--out';
    var dateFmt = typeof ecFmtTxDateFull === 'function' ? ecFmtTxDateFull(tx.date) : (tx.date || '');
    var txJson = encodeURIComponent(JSON.stringify(tx));
    html += '<tr style="cursor:pointer" onclick="ecOpenTxDetail(\''+txJson+'\')">';
    html += '<td><span class="gd-tx-date-val">' + dateFmt + '</span></td>';
    html += '<td><span class="gd-tx-amt-val ' + amtCls + '">' + amtFmt + '</span></td>';
    html += '<td><span class="gd-tx-type-val">' + type + '</span></td>';
    html += '<td><div class="gd-tx-desc-cell">'+avatarHtml+'<div class="gd-tx-desc-info"><span class="gd-tx-desc-text">' + label + '</span><span class="gd-tx-desc-sub">' + dateFmt + '</span></div></div></td>';
    html += '<td><span class="gd-tx-status-val"><span class="gd-tx-dot"></span> Validé</span></td>';
    html += '<td><span class="gd-tx-chevron-val">›</span></td>';
    html += '</tr>';
  });
  el.innerHTML = html;
}

// ── V4: Counter animation ──
var _v3CountUpTimers = {};
function v3CountUp(id, finalVal){
  var el = document.getElementById(id);
  if(!el || !finalVal || finalVal <= 0) return;
  // Cancel any running animation for this element
  if(_v3CountUpTimers[id]) clearInterval(_v3CountUpTimers[id]);
  var duration = 900;
  var steps = 40;
  var interval = duration / steps;
  var step = 0;
  _v3CountUpTimers[id] = setInterval(function(){
    step++;
    var progress = step / steps;
    var ease = 1 - Math.pow(1 - progress, 3);
    var current = Math.round(finalVal * ease);
    el.textContent = current.toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}) + ' €';
    if(step >= steps){
      clearInterval(_v3CountUpTimers[id]);
      delete _v3CountUpTimers[id];
      el.textContent = finalVal.toLocaleString('fr-FR', {minimumFractionDigits:0, maximumFractionDigits:0}) + ' €';
    }
  }, interval);
}

// ── V4: Chart.js loan amortization ──
function v3InitChart(capital, mens, duree, moisPasses){
  var section = document.getElementById('v4-chart-section');
  var canvas = document.getElementById('v4-loan-chart');
  if(!section || !canvas || typeof Chart === 'undefined') return;

  // Build monthly amortization data
  var tx = parseFloat(localStorage.getItem('ec_tx_rate')) || 0.05;
  var monthlyRate = tx / 12;
  var labels = [];
  var dataRestant = [];
  var dataRembourse = [];

  var restantCalc = capital;
  for(var i = 0; i <= duree; i++){
    var label = i === 0 ? 'Début' : (i === duree ? 'Fin' : (i % Math.ceil(duree/6) === 0 ? 'Mois ' + i : null));
    labels.push(label !== null ? label : '');
    dataRestant.push(Math.max(0, Math.round(restantCalc)));
    dataRembourse.push(Math.round(capital - Math.max(0, restantCalc)));
    if(monthlyRate > 0){
      var interest = restantCalc * monthlyRate;
      var principal = mens - interest;
      restantCalc -= principal;
    } else {
      restantCalc -= (capital / duree);
    }
  }

  // Mark current month
  var now = moisPasses;

  // Chart hidden in new gd-* layout

  if(window._v4Chart) { try { window._v4Chart.destroy(); } catch(e){} }

  var ctx = canvas.getContext('2d');
  var gradRestant = ctx.createLinearGradient(0, 0, 0, 240);
  gradRestant.addColorStop(0, 'rgba(11,170,110,.25)');
  gradRestant.addColorStop(1, 'rgba(11,170,110,.02)');
  var gradRemb = ctx.createLinearGradient(0, 0, 0, 240);
  gradRemb.addColorStop(0, 'rgba(37,99,235,.18)');
  gradRemb.addColorStop(1, 'rgba(37,99,235,.02)');

  window._v4Chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Capital restant',
          data: dataRestant,
          borderColor: '#0BAA6E',
          backgroundColor: gradRestant,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
          tension: .4
        },
        {
          label: 'Remboursé',
          data: dataRembourse,
          borderColor: '#2563EB',
          backgroundColor: gradRemb,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
          fill: true,
          tension: .4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0B1526',
          titleColor: 'rgba(255,255,255,.6)',
          bodyColor: '#fff',
          borderColor: 'rgba(255,255,255,.1)',
          borderWidth: 1,
          cornerRadius: 10,
          padding: 10,
          callbacks: {
            label: function(ctx){
              return ctx.dataset.label + ' : ' + ctx.parsed.y.toLocaleString('fr-FR') + ' €';
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(11,21,38,.05)', drawBorder: false },
          ticks: {
            font: { size: 10, family: 'Inter, sans-serif' },
            color: '#9BAAB8',
            maxRotation: 0
          }
        },
        y: {
          grid: { color: 'rgba(11,21,38,.05)', drawBorder: false },
          ticks: {
            font: { size: 10, family: 'Inter, sans-serif' },
            color: '#9BAAB8',
            callback: function(v){ return (v/1000).toFixed(0) + 'k €'; }
          }
        }
      }
    }
  });
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
  if(refEl2) refEl2.textContent = t('ref_lbl').replace('{ref}', user.ref || user.id || '—');

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
  if(countEl && mens > 0) countEl.textContent = t('echeance_dans').replace('{n}',daysLeft).replace('{s}',daysLeft>1?'s':'');

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
    (document.querySelectorAll('.ec-doc-item[data-cat="contrat"] .ec-doc-meta')[0].textContent = t('doc_signe').replace('{date}',signDate));
  document.querySelectorAll('.ec-doc-item[data-cat="contrat"] .ec-doc-meta')[1] &&
    (document.querySelectorAll('.ec-doc-item[data-cat="contrat"] .ec-doc-meta')[1].textContent = t('doc_genere').replace('{date}',signDate));
  // Relevés
  var releveMetas = document.querySelectorAll('.ec-doc-item[data-cat="releve"] .ec-doc-meta');
  if(releveMetas[0]) releveMetas[0].textContent = t('doc_dispo').replace('{date}',fmtDate(releve1Dispo)).replace('{size}','32');
  if(releveMetas[1]) releveMetas[1].textContent = t('doc_dispo').replace('{date}',fmtDate(releve2Dispo)).replace('{size}','30');
  // Noms relevés
  var releveNoms = document.querySelectorAll('.ec-doc-item[data-cat="releve"] .ec-doc-name');
  if(releveNoms[0]) releveNoms[0].textContent = t('doc_releve_name').replace('{mois}',releve1Lbl.charAt(0).toUpperCase()+releve1Lbl.slice(1));
  if(releveNoms[1]) releveNoms[1].textContent = t('doc_releve_name').replace('{mois}',releve2Lbl.charAt(0).toUpperCase()+releve2Lbl.slice(1));
  // Attestation
  var attMeta = document.querySelector('.ec-doc-item[data-cat="attestation"] .ec-doc-meta');
  if(attMeta) attMeta.textContent = t('doc_att_valid').replace('{date}',fmtDate(assuranceExp));
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
function ecRequestDoc(btn){ btn.textContent=t('doc_sent'); btn.disabled=true; }

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
    if(badgeEl){ badgeEl.textContent=t('dossier_suspendu'); badgeEl.style.background='#fee2e2'; badgeEl.style.color='#b91c1c'; }
  } else if(status==='valide' || (loan && loan.montant>0)){
    markDone('ec-tl-1'); markDone('ec-tl-2'); markDone('ec-tl-3'); markDone('ec-tl-4'); markDone('ec-tl-5');
    if(badgeEl){ badgeEl.textContent=t('dossier_valide_badge'); badgeEl.style.background='#dcfce7'; badgeEl.style.color='#15803d'; }
  } else if(status==='en_etude'){
    markDone('ec-tl-1'); markActive('ec-tl-2');
    if(badgeEl){ badgeEl.textContent=t('dossier_analyse'); badgeEl.style.background=''; badgeEl.style.color=''; }
  } else {
    markDone('ec-tl-1'); markActive('ec-tl-2');
    if(badgeEl){ badgeEl.textContent=t('dossier_analyse'); badgeEl.style.background=''; badgeEl.style.color=''; }
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
  if(detail) detail.textContent=t('ratio_lbl').replace('{pct}',Math.round(ratio*100));
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
    list.innerHTML='<div class="ec-tx-empty">'+t('tx_cat_empty')+'</div>';
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
    item.innerHTML='<div class="ec-msg-bubble"><div class="ec-msg-meta"><span class="ec-msg-sender">'+(m.fromClient?t('msg_sender_you'):t('msg_sender_bank'))+'</span><span class="ec-msg-time">'+dateStr+'</span></div><div class="ec-msg-body">'+m.text+'</div></div>';
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

// ── Historique Connexions ──
function cxTrackLogin(){
  var history = JSON.parse(localStorage.getItem('cx_history')||'[]');
  var ua = navigator.userAgent;
  var device = /iPhone|iPad|iPod/.test(ua) ? 'iPhone / iPad' : /Android/.test(ua) ? 'Android' : /Mac/.test(ua) ? 'Mac' : /Win/.test(ua) ? 'Windows' : 'Navigateur web';
  var browser = /Chrome/.test(ua) && !/Edg/.test(ua) ? 'Chrome' : /Safari/.test(ua) && !/Chrome/.test(ua) ? 'Safari' : /Firefox/.test(ua) ? 'Firefox' : /Edg/.test(ua) ? 'Edge' : 'Navigateur';
  history.unshift({ date: new Date().toISOString(), device: device, browser: browser });
  if(history.length > 10) history = history.slice(0, 10);
  localStorage.setItem('cx_history', JSON.stringify(history));
}
function cxInitModal(){
  var history = JSON.parse(localStorage.getItem('cx_history')||'[]');
  var list = document.getElementById('cx-list');
  if(!list) return;
  if(!history.length){ list.innerHTML = '<div class="cx-empty">'+t('hist_empty')+'</div>'; return; }
  list.innerHTML = history.map(function(h, i){
    var d = new Date(h.date);
    var dateStr = d.toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}) + ' à ' + d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    var iconCls = i === 0 ? 'cx-item-icon cx-item-icon--current' : 'cx-item-icon';
    var deviceIcon = /iPhone|iPad|Android/.test(h.device)
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>';
    var badge = i === 0 ? ' <span class="cx-item-badge">Session actuelle</span>' : '';
    return '<div class="cx-item"><div class="'+iconCls+'">'+deviceIcon+'</div><div class="cx-item-body"><div class="cx-item-title">'+h.device+' — '+h.browser+badge+'</div><div class="cx-item-sub">'+dateStr+'</div></div></div>';
  }).join('');
}

// ── Compte à rebours échéance ──
function gdRenderCountdown(){
  var user = ecGetUser();
  var loan = (user && user.loan) || {};
  var dateDebut = loan.dateDebut ? new Date(loan.dateDebut) : null;
  if(!dateDebut || !loan.duree) return;
  var today = new Date(); today.setHours(0,0,0,0);
  var next = new Date(dateDebut);
  while(next <= today) next.setMonth(next.getMonth()+1);
  var diff = Math.round((next - today) / (1000*60*60*24));
  if(diff <= 3){
    var banner = document.getElementById('ec-alert-banner');
    var bannerTxt = document.getElementById('ec-alert-banner-text');
    if(banner && bannerTxt && banner.style.display === 'none'){
      bannerTxt.textContent = t('banner_echeance').replace('{n}',diff).replace('{s}',diff>1?'s':'');
      banner.style.display = 'flex';
    }
  }
}

// ── Graphique capital restant (credit-detail) ──
var _cdChart = null;
function cdRenderChart(){
  var user = ecGetUser();
  var loan = (user && user.loan) || {};
  var wrap = document.getElementById('ec-cd-chart-wrap');
  var canvas = document.getElementById('ec-cd-chart');
  if(!wrap || !canvas) return;
  var capital = loan.montant || 0;
  var duree = loan.duree || 0;
  var taux = loan.taux || 0;
  if(!capital || !duree || !taux || typeof Chart === 'undefined'){ wrap.style.display = 'none'; return; }
  wrap.style.display = 'block';
  var tauxM = taux / 100 / 12;
  var mens = capital * tauxM / (1 - Math.pow(1+tauxM, -duree));
  var labels = [], data = [];
  var restant = capital;
  for(var i = 0; i <= duree; i++){
    labels.push(i === 0 ? 'Départ' : 'M'+i);
    data.push(Math.max(0, Math.round(restant)));
    restant = restant - (mens - restant * tauxM);
  }
  if(_cdChart){ _cdChart.destroy(); _cdChart = null; }
  _cdChart = new Chart(canvas, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{ data: data, borderColor: '#0B5E8A', backgroundColor: 'rgba(11,94,138,.08)', borderWidth: 2, pointRadius: 0, fill: true, tension: 0.3 }]
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { ticks: { callback: function(v){ return v.toLocaleString('fr-FR')+'€'; }, font:{size:10}, color:'#6B7A8D', maxTicksLimit:4 }, grid: { color:'rgba(0,0,0,.05)' } }
      }
    }
  });
}

// ── Changement date prélèvement ──
function cdInitModal(){
  var user = ecGetUser();
  var loan = (user && user.loan) || {};
  var dateDebut = loan.dateDebut ? new Date(loan.dateDebut) : null;
  var currentDay = dateDebut ? dateDebut.getDate() : null;
  var el = document.getElementById('cd-current-date');
  if(el) el.textContent = currentDay ? 'Le ' + currentDay + ' de chaque mois' : '—';
  var grid = document.getElementById('cd-day-grid');
  if(!grid) return;
  var days = [1,5,8,10,12,15,18,20,22,25,28];
  grid.innerHTML = days.map(function(d){
    var sel = currentDay === d ? ' cd-day-btn--selected' : '';
    return '<button class="cd-day-btn'+sel+'" onclick="cdSelectDay(this,'+d+')">' + d + '</button>';
  }).join('');
}
function cdSelectDay(btn){
  document.querySelectorAll('.cd-day-btn').forEach(function(b){ b.classList.remove('cd-day-btn--selected'); });
  btn.classList.add('cd-day-btn--selected');
}

// ── Simulateur Rachat de Crédit ──
function srCalc(){
  var tauxA = parseFloat((document.getElementById('sr-taux-actuel')||{}).value);
  var capital = parseFloat((document.getElementById('sr-capital')||{}).value);
  var duree = parseFloat((document.getElementById('sr-duree')||{}).value);
  var tauxN = parseFloat((document.getElementById('sr-taux-nouveau')||{}).value);
  var res = document.getElementById('sr-result');
  if(!res) return;
  if([tauxA,capital,duree,tauxN].some(isNaN)||capital<=0||duree<=0){ res.style.display='none'; return; }
  var fmt = function(v){ return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; };
  var mensCalc = function(c,t,d){ var tm=t/100/12; return c*tm/(1-Math.pow(1+tm,-d)); };
  var mensA = mensCalc(capital, tauxA, duree);
  var mensN = mensCalc(capital, tauxN, duree);
  var eco = (mensA - mensN) * duree;
  res.style.display = 'block';
  document.getElementById('sr-mens-actuelle').textContent = fmt(mensA);
  document.getElementById('sr-mens-nouvelle').textContent = fmt(mensN);
  document.getElementById('sr-economie').textContent = fmt(eco);
}

// ── Simulateur Augmentation Mensualité ──
function smCalc(){
  var capital = parseFloat((document.getElementById('sm-capital')||{}).value);
  var mens = parseFloat((document.getElementById('sm-mens')||{}).value);
  var taux = parseFloat((document.getElementById('sm-taux')||{}).value);
  var supp = parseFloat((document.getElementById('sm-supp')||{}).value);
  var res = document.getElementById('sm-result');
  if(!res) return;
  if([capital,mens,taux,supp].some(isNaN)||capital<=0||mens<=0||supp<=0){ res.style.display='none'; return; }
  var tauxM = taux/100/12;
  var dureeCalc = function(c,m){ return tauxM===0 ? Math.ceil(c/m) : Math.ceil(-Math.log(1-(c*tauxM/m))/Math.log(1+tauxM)); };
  var dureeA = dureeCalc(capital, mens);
  var dureeN = dureeCalc(capital, mens+supp);
  var intA = mens*dureeA - capital;
  var intN = (mens+supp)*dureeN - capital;
  var fmt = function(v){ return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; };
  res.style.display = 'block';
  document.getElementById('sm-duree-actuelle').textContent = dureeA + ' mois';
  document.getElementById('sm-duree-nouvelle').textContent = dureeN + ' mois';
  document.getElementById('sm-economie').textContent = fmt(Math.max(0, intA - intN));
}

// ── Calculateur Économies Remboursement Anticipé ──
function seCalc(){
  var capital = parseFloat((document.getElementById('se-capital')||{}).value);
  var taux = ecParseAmt((document.getElementById('se-taux')||{}).value);
  var duree = ecParseAmt((document.getElementById('se-duree')||{}).value);
  var montant = ecParseAmt((document.getElementById('se-montant')||{}).value);
  var res = document.getElementById('se-result');
  if(!res) return;
  if([capital,taux,duree,montant].some(isNaN)||capital<=0||duree<=0||montant<=0){ res.style.display='none'; return; }
  var tauxM = taux/100/12;
  var mensCalc = function(c,d){ return tauxM===0 ? c/d : c*tauxM/(1-Math.pow(1+tauxM,-d)); };
  var intSans = mensCalc(capital,duree)*duree - capital;
  var capitalApres = Math.max(0, capital - montant);
  var dureeApres = capitalApres <= 0 ? 0 : Math.ceil(-Math.log(1-(capitalApres*tauxM/mensCalc(capital,duree)))/Math.log(1+tauxM));
  var intAvec = capitalApres <= 0 ? 0 : mensCalc(capitalApres, dureeApres)*dureeApres - capitalApres;
  var fmt = function(v){ return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; };
  res.style.display = 'block';
  document.getElementById('se-int-sans').textContent = fmt(Math.max(0,intSans));
  document.getElementById('se-int-avec').textContent = fmt(Math.max(0,intAvec));
  document.getElementById('se-economie').textContent = fmt(Math.max(0,intSans-intAvec));
  document.getElementById('se-mois').textContent = Math.max(0, duree - dureeApres) + ' mois';
}

// ── Chat Conseiller ──
function chatSend(){
  var inp = document.getElementById('chat-input');
  var msgs = document.getElementById('chat-messages');
  if(!inp || !msgs || !inp.value.trim()) return;
  var text = inp.value.trim();
  inp.value = '';
  var now = new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  msgs.innerHTML += '<div class="chat-msg chat-msg--out"><div class="chat-bubble">'+text.replace(/</g,'&lt;')+'</div><div class="chat-time">'+now+'</div></div>';
  msgs.scrollTop = msgs.scrollHeight;
  setTimeout(function(){
    var replies = ['Merci pour votre message. Un conseiller va vous répondre dans les plus brefs délais.','Bien reçu ! Je transmets votre demande à votre conseiller attitré.','Votre demande a été enregistrée. Nous vous recontactons sous 24h.'];
    var reply = replies[Math.floor(Math.random()*replies.length)];
    var nowR = new Date().toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    msgs.innerHTML += '<div class="chat-msg chat-msg--in"><div class="chat-bubble">'+reply+'</div><div class="chat-time">'+nowR+'</div></div>';
    msgs.scrollTop = msgs.scrollHeight;
  }, 900 + Math.random()*600);
}

// ── Open Banking ──
function obSimConnect(){
  var s1 = document.getElementById('ob-state-connect');
  var s2 = document.getElementById('ob-state-connected');
  if(s1) s1.style.display = 'none';
  if(s2) s2.style.display = 'block';
  var bal = (Math.random() * 3500 + 400).toFixed(2).replace('.', ',');
  var amtEl = document.getElementById('ob-balance-amt');
  if(amtEl) amtEl.textContent = bal + ' €';
  var now = new Date();
  var timeEl = document.getElementById('ob-balance-time');
  if(timeEl) timeEl.textContent = now.getHours() + 'h' + String(now.getMinutes()).padStart(2,'0');
  localStorage.setItem('ob_connected', '1');
}
function obSaveAlert(){
  var th = (document.getElementById('ob-alert-threshold')||{}).value || '200';
  localStorage.setItem('ob_alert_threshold', th);
  ecCloseModal('open-banking');
  var titleEl = document.getElementById('ec-success-title');
  var msgEl   = document.getElementById('ec-success-msg');
  if(titleEl) titleEl.textContent = t('alerte_cfg_title');
  if(msgEl)   msgEl.textContent   = t('alerte_cfg_msg').replace('{th}',th);
  ecOpenModal('success');
}
function obDisconnect(){
  localStorage.removeItem('ob_connected');
  var s1 = document.getElementById('ob-state-connect');
  var s2 = document.getElementById('ob-state-connected');
  if(s1) s1.style.display = 'block';
  if(s2) s2.style.display = 'none';
}
function obInitModal(){
  if(localStorage.getItem('ob_connected') === '1') obSimConnect();
}

// ── E-relevé ──
function erToggle(cb){
  var row = document.getElementById('er-email-row');
  if(row) row.style.display = cb.checked ? 'block' : 'none';
  if(cb.checked){
    var u = ecGetUser();
    var inp = document.getElementById('er-email');
    if(inp && u && u.email) inp.value = u.email;
  }
}
function erSave(){
  var email = (document.getElementById('er-email')||{}).value || '';
  if(!email){ return; }
  localStorage.setItem('er_subscribed', '1');
  localStorage.setItem('er_email', email);
  ecCloseModal('e-releve');
  var titleEl2 = document.getElementById('ec-success-title');
  var msgEl2   = document.getElementById('ec-success-msg');
  if(titleEl2) titleEl2.textContent = t('releve_act_title');
  if(msgEl2)   msgEl2.textContent   = t('releve_act_msg').replace('{email}',email);
  ecOpenModal('success');
}
function erInitModal(){
  var cb = document.getElementById('er-toggle-cb');
  var subscribed = localStorage.getItem('er_subscribed') === '1';
  if(cb) cb.checked = subscribed;
  var row = document.getElementById('er-email-row');
  if(row) row.style.display = subscribed ? 'block' : 'none';
  if(subscribed){
    var inp = document.getElementById('er-email');
    if(inp) inp.value = localStorage.getItem('er_email') || '';
  }
}

// ── Dépôt sécurisé (validation côté client) ──
function ecDepotSecCheck(){
  var u = ecGetUser()||{};
  if(!u.id) return;
  var key = 'dps_pending_'+u.id;
  var raw = localStorage.getItem(key);
  if(!raw) return;
  try {
    var p = JSON.parse(raw);
    var banner = document.getElementById('ec-depot-sec-banner');
    var desc   = document.getElementById('ec-depot-sec-desc');
    if(!banner) return;
    if(desc) desc.textContent = t('depot_pending_desc').replace('{amt}',p.montant.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}));
    banner.style.display = 'block';
  } catch(e){}
}

function ecDepotSecValider(){
  var u = ecGetUser()||{};
  if(!u.id) return;
  var key   = 'dps_pending_'+u.id;
  var raw   = localStorage.getItem(key);
  var errEl = document.getElementById('ec-depot-sec-err');
  if(!raw){ if(errEl){ errEl.textContent=t('depot_none'); errEl.style.display='block'; } return; }
  var p;
  try { p = JSON.parse(raw); } catch(e){ return; }
  var saisi = ((document.getElementById('ec-depot-sec-code')||{}).value||'').trim();
  if(saisi !== String(p.code)){ if(errEl){ errEl.textContent=t('depot_code_wrong'); errEl.style.display='block'; } return; }
  var newSolde = ecGetSolde() + p.montant;
  ecSetSolde(newSolde);
  if(typeof FidDB!=='undefined' && u.id) FidDB.setSolde(u.id, newSolde).catch(function(){});
  ecAddTx({type:'credit',label:p.label||'Dépôt sécurisé Fidexico',amt:p.montant,date:new Date().toLocaleDateString('fr-FR')});
  localStorage.removeItem(key);
  document.getElementById('ec-depot-sec-banner').style.display='none';
  ecRefreshSolde();
  ecRenderTx();
  if(typeof fdRenderActivity==='function') fdRenderActivity();
}

// ── Compte bancaire enregistré (virement) ──
function ecVirInitCompteEnr(){
  var u = ecGetUser()||{};
  var iban = u.iban||'';
  var banque = u.banque_nom||u.bank_name||'';
  var nom = ((u.prenom||'')+' '+(u.nom||'')).trim();
  var bloc = document.getElementById('ec-vir-compte-enr');
  if(!bloc) return;
  if(iban && nom){
    document.getElementById('ec-vir-enr-nom').textContent    = nom;
    document.getElementById('ec-vir-enr-banque').textContent = banque||'Banque enregistrée';
    document.getElementById('ec-vir-enr-iban').textContent   = iban;
    bloc.style.display = 'block';
  } else {
    bloc.style.display = 'none';
  }
}

function ecVirUseMaBanque(){
  var u = ecGetUser()||{};
  var nomEl  = document.getElementById('ec-vir-nom');
  var ibanEl = document.getElementById('ec-vir-iban');
  if(nomEl)  nomEl.value  = ((u.prenom||'')+' '+(u.nom||'')).trim();
  if(ibanEl) ibanEl.value = u.iban||'';
}

// ── Nouvelle demande ──
function ecSoumettreDemande(){
  var projet  = (document.getElementById('nd-projet')||{}).value||'';
  var montant = (document.getElementById('nd-montant')||{}).value||'';
  var duree   = (document.getElementById('nd-duree')||{}).value||'';
  var err     = document.getElementById('nd-err');
  var suc     = document.getElementById('nd-success');
  if(err) err.style.display='none';
  if(suc) suc.style.display='none';
  if(!projet||!montant||!duree){
    if(err){ err.textContent=t('contact_required'); err.style.display='block'; }
    return;
  }
  var u = ecGetUser()||{};
  var nom = ((u.prenom||'')+' '+(u.nom||'')).trim()||'Client';
  var dossier = u.dossier||u.loan_id||'';
  var msg = 'Nouvelle demande de prêt\n'
    +'Client : '+nom+(dossier?' ('+dossier+')':'')+'\n'
    +'Projet : '+projet+'\n'
    +'Montant souhaité : '+Number(montant).toLocaleString('fr-FR')+' €\n'
    +'Durée souhaitée : '+duree+' mois';
  var btn = document.querySelector('#ec-modal-nouvelle-demande .ec-btn-primary');
  if(btn){ btn.disabled=true; btn.textContent=t('contact_sending'); }
  var done = function(ok){
    if(btn){ btn.disabled=false; btn.textContent=t('contact_submit'); }
    if(ok){
      if(suc){ suc.style.display='block'; }
      document.getElementById('nd-projet').value='';
      document.getElementById('nd-montant').value='';
      document.getElementById('nd-duree').value='';
    } else {
      if(err){ err.textContent=t('contact_err'); err.style.display='block'; }
    }
  };
  if(typeof FidEmail!=='undefined'){
    FidEmail.adminNouveauMessage(nom, msg).then(function(){ done(true); }).catch(function(){ done(false); });
  } else {
    done(true);
  }
}

// ── Pause mensualités ──
function pmInitModal(){
  var u = ecGetUser();
  var loan = (u && u.loan) || {};
  var mens = loan.mensualite || 0;
  var el = document.getElementById('pm-mens-amt');
  if(el) el.textContent = mens > 0 ? mens.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €' : '—';
}

// ── Auto-init selon la page ──
(function(){
  var p=window.location.pathname;
  if(p.indexOf('espace-client.html')!==-1) ecInitDashboard();
  else if(p.indexOf('mes-documents.html')!==-1) ecInitDocuments();
  else if(p.indexOf('suivi-dossier.html')!==-1) ecInitSuivi();
  else if(p.indexOf('messagerie.html')!==-1) ecInitMessagerie();
})();

