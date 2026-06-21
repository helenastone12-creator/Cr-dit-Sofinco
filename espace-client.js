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

// ── Tableau de bord ──
function ecInitDashboard(){
  ecGuard();
  ecInitHeader();
  var user=ecGetUser();

  var welcomeEl=document.getElementById('ec-welcome-name');
  if(welcomeEl) welcomeEl.textContent='Bonjour, '+(user.prenom||'')+' !';

  var dateEl=document.getElementById('ec-welcome-date');
  if(dateEl){
    var d=new Date();
    dateEl.textContent=d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }

  var capital=12000, mens=245, moisPasses=4, duree=60;
  var restant=Math.round(capital-(capital/duree)*moisPasses);
  var pct=Math.round((moisPasses/duree)*100);

  var refEl=document.getElementById('ec-credit-ref');
  if(refEl) refEl.textContent=user.ref||'SOF-2026-00000';

  var set=function(id,v){var e=document.getElementById(id);if(e)e.textContent=v;};
  set('ec-stat-capital', capital.toLocaleString('fr-FR')+'€');
  set('ec-stat-mens', mens+'€ / mois');
  set('ec-stat-restant', restant.toLocaleString('fr-FR')+'€');
  set('ec-prog-pct', pct+'%');
  set('ec-next-amt', mens+'€');

  var fill=document.getElementById('ec-prog-fill');
  if(fill) setTimeout(function(){fill.style.width=pct+'%';},200);

  var next=new Date(); next.setDate(1); next.setMonth(next.getMonth()+1);
  set('ec-next-date','1er '+next.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}));
}

// ── Mes documents ──
function ecInitDocuments(){ ecGuard(); ecInitHeader(); }

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
