/* ═══════════════════════════════════════════
   ESPACE CLIENT — logique (localStorage)
════════════════════════════════════════════ */

// ── Utilitaires session ──
function ecGetUser(){
  try{ return JSON.parse(localStorage.getItem('ec_user')||'null'); }
  catch(e){ return null; }
}
function ecSetUser(u){ localStorage.setItem('ec_user', JSON.stringify(u)); }

// Vraie session séparée des données utilisateur
function ecIsLoggedIn(){ return localStorage.getItem('ec_session')==='1'; }
function ecSetSession(){ localStorage.setItem('ec_session','1'); }
function ecClearSession(){ localStorage.removeItem('ec_session'); }

function ecGuard(){
  if(!ecIsLoggedIn()) window.location.href='connexion.html';
}

// ── Toggle mot de passe visible/caché ──
function ecTogglePwd(inputId, btn){
  var inp = document.getElementById(inputId);
  if(!inp) return;
  var show = inp.type==='password';
  inp.type = show ? 'text' : 'password';
  btn.style.opacity = show ? '1' : '.5';
}

// ── Connexion ──
function ecLogin(){
  var email = (document.getElementById('ec-email')||{}).value||'';
  var pwd   = (document.getElementById('ec-pwd')||{}).value||'';
  var errEl = document.getElementById('ec-login-err');
  var btn   = document.querySelector('.ec-btn-primary');

  // Validation basique
  if(!email.trim() || !pwd){
    if(errEl){ errEl.textContent='Veuillez remplir tous les champs.'; errEl.style.display='block'; }
    return;
  }

  var user = ecGetUser();

  // Aucun compte créé
  if(!user){
    if(errEl){ errEl.innerHTML='Aucun compte trouvé. <a href="inscription.html">Créez votre compte</a>.'; errEl.style.display='block'; }
    return;
  }

  // Vérification des identifiants
  if(user.email !== email.trim().toLowerCase() || user.pwd !== pwd){
    if(errEl){ errEl.textContent='Email ou mot de passe incorrect.'; errEl.style.display='block'; }
    // Shake animation
    var card = document.querySelector('.ec-auth-card');
    if(card){ card.style.animation='none'; setTimeout(function(){ card.style.animation='ecShake .4s ease'; },10); }
    return;
  }

  if(errEl) errEl.style.display='none';
  if(btn){ btn.textContent='Connexion…'; btn.disabled=true; }

  // Ouvre la session
  ecSetSession();
  setTimeout(function(){ window.location.href='espace-client.html'; }, 300);
}

// ── Inscription ──
function ecRegister(){
  var prenom = (document.getElementById('ec-prenom')||{}).value||'';
  var nom    = (document.getElementById('ec-nom')||{}).value||'';
  var email  = (document.getElementById('ec-email-reg')||{}).value||'';
  var tel    = (document.getElementById('ec-tel-reg')||{}).value||'';
  var ref    = (document.getElementById('ec-ref-dossier')||{}).value||'';
  var pwd    = (document.getElementById('ec-pwd-reg')||{}).value||'';
  var pwdC   = (document.getElementById('ec-pwd-confirm')||{}).value||'';
  var cgu    = document.getElementById('ec-cgu');
  var errEl  = document.getElementById('ec-reg-err');
  var btn    = document.querySelector('.ec-btn-primary');

  var errors=[];
  if(!prenom.trim()) errors.push('Le prénom est requis.');
  if(!nom.trim())    errors.push('Le nom est requis.');
  if(!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errors.push('Adresse email invalide.');
  if(!tel.trim())    errors.push('Le numéro de téléphone est requis.');
  if(pwd.length<8)   errors.push('Le mot de passe doit contenir au moins 8 caractères.');
  if(pwd!==pwdC)     errors.push('Les mots de passe ne correspondent pas.');
  if(!cgu||!cgu.checked) errors.push('Vous devez accepter les Conditions Générales.');

  if(errors.length){
    if(errEl){ errEl.innerHTML=errors.join('<br/>'); errEl.style.display='block'; }
    return;
  }
  if(errEl) errEl.style.display='none';
  if(btn){ btn.textContent='Création…'; btn.disabled=true; }

  var user={
    prenom:prenom.trim(), nom:nom.trim(),
    email:email.trim().toLowerCase(), tel:tel.trim(),
    ref:ref.trim().toUpperCase(), pwd:pwd,
    createdAt:new Date().toISOString()
  };
  ecSetUser(user);
  ecSetSession();
  setTimeout(function(){ window.location.href='espace-client.html'; }, 300);
}

// ── Déconnexion ──
function ecLogout(){
  ecClearSession();
  window.location.href='connexion.html';
}

// ── Init header dashboard ──
function ecInitHeader(){
  var user=ecGetUser();
  if(!user) return;
  var initials=(((user.prenom||'')[0]||'').toUpperCase()+(( user.nom||'')[0]||'').toUpperCase())||'U';
  var av=document.getElementById('ec-hd-avatar');
  var nm=document.getElementById('ec-hd-name');
  if(av) av.textContent=initials;
  if(nm) nm.textContent=user.prenom||'Mon compte';
}

// ── Solde ──
function ecGetSolde(){ return parseFloat(localStorage.getItem('ec_solde')||'0'); }
function ecSetSolde(v){ localStorage.setItem('ec_solde', v.toFixed(2)); }
function ecFormatAmt(v){ return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }

function ecRefreshSolde(){
  var el = document.getElementById('ec-solde-amt');
  if(el) el.textContent = ecFormatAmt(ecGetSolde());
}

// ── Modals ──
function ecOpenModal(name){
  var el = document.getElementById('ec-modal-'+name);
  if(el){ el.classList.add('open'); document.body.style.overflow='hidden'; }
}
function ecCloseModal(name){
  var el = document.getElementById('ec-modal-'+name);
  if(el){ el.classList.remove('open'); document.body.style.overflow=''; }
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
  ecRefreshSolde();
  ecCloseModal('depot');
  document.getElementById('ec-depot-amt').value='';
  document.getElementById('ec-success-title').textContent='Dépôt effectué';
  document.getElementById('ec-success-msg').textContent='+'+ ecFormatAmt(amt)+' ont été crédités sur votre compte. Nouveau solde : '+ecFormatAmt(nouveau);
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

function ecConfirmVirement(){
  var nom   = ((document.getElementById('ec-vir-nom')||{}).value||'').trim();
  var iban  = ((document.getElementById('ec-vir-iban')||{}).value||'').trim();
  var amt   = parseFloat((document.getElementById('ec-vir-amt')||{}).value||'0');
  var errEl = document.getElementById('ec-vir-err');
  var solde = ecGetSolde();

  if(!nom){ if(errEl){ errEl.textContent='Le nom du bénéficiaire est requis.'; errEl.style.display='block'; } return; }
  if(!iban){ if(errEl){ errEl.textContent='L\'IBAN destinataire est requis.'; errEl.style.display='block'; } return; }
  if(!amt || amt <= 0){ if(errEl){ errEl.textContent='Veuillez saisir un montant valide.'; errEl.style.display='block'; } return; }
  if(amt > solde){ if(errEl){ errEl.textContent='Solde insuffisant ('+ecFormatAmt(solde)+' disponible).'; errEl.style.display='block'; } return; }

  if(errEl) errEl.style.display='none';
  var nouveau = solde - amt;
  ecSetSolde(nouveau);
  ecRefreshSolde();
  ecCloseModal('virement');
  ['ec-vir-nom','ec-vir-iban','ec-vir-amt','ec-vir-motif'].forEach(function(id){ var e=document.getElementById(id); if(e)e.value=''; });
  document.getElementById('ec-success-title').textContent='Virement envoyé';
  document.getElementById('ec-success-msg').textContent=ecFormatAmt(amt)+' ont été virés à '+nom+'. Nouveau solde : '+ecFormatAmt(nouveau);
  ecOpenModal('success');
}

// ── Tableau de bord ──
function ecInitDashboard(){
  ecGuard();
  ecInitHeader();
  ecRefreshSolde();
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
  if(refEl) refEl.textContent=user.ref||'—';

  var set=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};

  if(capital > 0){
    set('ec-stat-capital', capital.toLocaleString('fr-FR')+'€');
    set('ec-stat-mens',    mens.toLocaleString('fr-FR')+'€ / mois');
    set('ec-stat-restant', restant.toLocaleString('fr-FR')+'€');
    set('ec-prog-pct',     pct+'%');
    set('ec-next-amt',     mens.toLocaleString('fr-FR')+'€');
  } else {
    set('ec-stat-capital', 'En attente');
    set('ec-stat-mens',    '—');
    set('ec-stat-restant', '—');
    set('ec-prog-pct',     '0%');
    set('ec-next-amt',     '—');
  }

  var fill=document.getElementById('ec-prog-fill');
  if(fill) setTimeout(function(){fill.style.width=pct+'%';},200);

  var next=new Date(); next.setDate(1); next.setMonth(next.getMonth()+1);
  set('ec-next-date','1er '+next.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}));
}

// ── Mes documents ──
function ecInitDocuments(){
  ecGuard();
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
  ecInitHeader();
  var user=ecGetUser();
  if(user&&user.ref){
    var inp=document.getElementById('ec-suivi-ref');
    if(inp) inp.value=user.ref;
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
  if(result) result.style.display='block';

  // Affiche le numéro saisi
  var refDisp=document.getElementById('ec-suivi-ref-disp');
  if(refDisp) refDisp.textContent=val.toUpperCase();

  // Date simulée : hier
  var d=new Date(); d.setDate(d.getDate()-1);
  var dateStr=d.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})+' à '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
  var dateEl=document.getElementById('ec-tl-date1');
  if(dateEl) dateEl.textContent=dateStr;

  if(result) result.scrollIntoView({behavior:'smooth',block:'start'});
}

// ── Indicateur force mot de passe ──
(function(){
  var inp=document.getElementById('ec-pwd-reg');
  var bar=document.getElementById('ec-pwd-strength');
  if(!inp||!bar) return;
  inp.addEventListener('input',function(){
    var v=this.value;
    bar.innerHTML='<span></span><span></span><span></span>';
    bar.className='ec-pwd-strength';
    if(!v) return;
    if(v.length>=10&&/[A-Z]/.test(v)&&/[0-9]/.test(v)) bar.classList.add('strong');
    else if(v.length>=8) bar.classList.add('medium');
    else bar.classList.add('weak');
  });
})();

// ── Touche Entrée sur les formulaires ──
(function(){
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter') return;
    var path=window.location.pathname;
    if(path.indexOf('connexion')!==-1) ecLogin();
    else if(path.indexOf('inscription')!==-1) ecRegister();
    else if(path.indexOf('suivi-dossier')!==-1) ecSuiviSearch();
  });
})();

// ── Animation shake ──
(function(){
  var style=document.createElement('style');
  style.textContent='@keyframes ecShake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}';
  document.head.appendChild(style);
})();

// ── Auto-init selon la page ──
(function(){
  var p=window.location.pathname;
  if(p.indexOf('espace-client.html')!==-1) ecInitDashboard();
  else if(p.indexOf('mes-documents.html')!==-1) ecInitDocuments();
  else if(p.indexOf('suivi-dossier.html')!==-1) ecInitSuivi();
})();
