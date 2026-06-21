/* ═══════════════════════════════════════════
   ESPACE CLIENT — logique (localStorage)
════════════════════════════════════════════ */

// ── Utilitaires ──
function ecGetUser(){ try{ return JSON.parse(localStorage.getItem('ec_user')||'null'); }catch(e){return null;} }
function ecSetUser(u){ localStorage.setItem('ec_user', JSON.stringify(u)); }
function ecIsLoggedIn(){ return !!ecGetUser(); }

function ecGuard(){
  if(!ecIsLoggedIn()){
    window.location.href = 'connexion.html';
  }
}

// ── Toggle mot de passe visible/caché ──
function ecTogglePwd(inputId, btn){
  var inp = document.getElementById(inputId);
  if(!inp) return;
  var show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.style.opacity = show ? '1' : '.5';
}

// ── Connexion ──
function ecLogin(){
  var email = (document.getElementById('ec-email')||{}).value||'';
  var pwd   = (document.getElementById('ec-pwd')||{}).value||'';
  var err   = document.getElementById('ec-login-err');

  var user = ecGetUser();
  if(!user || user.email !== email.trim().toLowerCase() || user.pwd !== pwd){
    if(err){ err.style.display='block'; }
    return;
  }
  if(err) err.style.display='none';
  window.location.href = 'espace-client.html';
}

// ── Inscription ──
function ecRegister(){
  var prenom  = (document.getElementById('ec-prenom')||{}).value||'';
  var nom     = (document.getElementById('ec-nom')||{}).value||'';
  var email   = (document.getElementById('ec-email-reg')||{}).value||'';
  var tel     = (document.getElementById('ec-tel-reg')||{}).value||'';
  var ref     = (document.getElementById('ec-ref-dossier')||{}).value||'';
  var pwd     = (document.getElementById('ec-pwd-reg')||{}).value||'';
  var pwdC    = (document.getElementById('ec-pwd-confirm')||{}).value||'';
  var cgu     = document.getElementById('ec-cgu');
  var errEl   = document.getElementById('ec-reg-err');

  var errors = [];
  if(!prenom.trim()) errors.push('Le prénom est requis.');
  if(!nom.trim())    errors.push('Le nom est requis.');
  if(!/^[^@]+@[^@]+\.[^@]+$/.test(email)) errors.push('Email invalide.');
  if(!tel.trim())    errors.push('Le téléphone est requis.');
  if(pwd.length < 8) errors.push('Le mot de passe doit faire au moins 8 caractères.');
  if(pwd !== pwdC)   errors.push('Les mots de passe ne correspondent pas.');
  if(!cgu || !cgu.checked) errors.push('Vous devez accepter les CGU.');

  if(errors.length){
    if(errEl){ errEl.innerHTML = errors.join('<br/>'); errEl.style.display='block'; }
    return;
  }
  if(errEl) errEl.style.display='none';

  var user = {
    prenom: prenom.trim(),
    nom: nom.trim(),
    email: email.trim().toLowerCase(),
    tel: tel.trim(),
    ref: ref.trim().toUpperCase(),
    pwd: pwd,
    createdAt: new Date().toISOString()
  };
  ecSetUser(user);
  window.location.href = 'espace-client.html';
}

// ── Déconnexion ──
function ecLogout(){
  window.location.href = 'connexion.html';
}

// ── Init header dashboard ──
function ecInitHeader(){
  var user = ecGetUser();
  if(!user) return;
  var initials = ((user.prenom||'')[0]||'').toUpperCase() + ((user.nom||'')[0]||'').toUpperCase() || 'U';
  var avatar = document.getElementById('ec-hd-avatar');
  var nameEl = document.getElementById('ec-hd-name');
  if(avatar) avatar.textContent = initials;
  if(nameEl) nameEl.textContent = user.prenom || 'Mon compte';
}

// ── Tableau de bord ──
function ecInitDashboard(){
  ecGuard();
  ecInitHeader();
  var user = ecGetUser();

  // Bonjour
  var welcomeEl = document.getElementById('ec-welcome-name');
  if(welcomeEl) welcomeEl.textContent = 'Bonjour, ' + (user.prenom||'') + ' !';

  // Date
  var dateEl = document.getElementById('ec-welcome-date');
  if(dateEl){
    var d = new Date();
    dateEl.textContent = d.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  }

  // Données simulées du crédit
  var capital = 12000, mens = 245, moisPasses = 4, duree = 60;
  var restant = Math.round(capital - (capital/duree)*moisPasses);
  var pct = Math.round((moisPasses/duree)*100);

  var refEl = document.getElementById('ec-credit-ref');
  if(refEl) refEl.textContent = user.ref || 'SOF-2026-00000';

  var setEl = function(id,v){ var e=document.getElementById(id); if(e) e.textContent=v; };
  setEl('ec-stat-capital', capital.toLocaleString('fr-FR')+'€');
  setEl('ec-stat-mens', mens+'€ / mois');
  setEl('ec-stat-restant', restant.toLocaleString('fr-FR')+'€');
  setEl('ec-prog-pct', pct+'%');
  setEl('ec-next-amt', mens+'€');

  var fill = document.getElementById('ec-prog-fill');
  if(fill) setTimeout(function(){ fill.style.width = pct+'%'; }, 150);

  // Prochaine échéance
  var next = new Date(); next.setDate(1); next.setMonth(next.getMonth()+1);
  setEl('ec-next-date', '1er ' + next.toLocaleDateString('fr-FR',{month:'long',year:'numeric'}));
}

// ── Mes documents ──
function ecInitDocuments(){
  ecGuard();
  ecInitHeader();
}
function ecDocFilter(cat, btn){
  document.querySelectorAll('.ec-doc-ftab').forEach(function(t){t.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('.ec-doc-item').forEach(function(item){
    item.classList.toggle('hidden', cat!=='tous' && item.dataset.cat !== cat);
  });
}
function ecFakeDownload(btn, filename){
  var orig = btn.innerHTML;
  btn.innerHTML = '✓';
  btn.style.background='var(--teal)';
  btn.style.color='#fff';
  setTimeout(function(){ btn.innerHTML=orig; btn.style.background=''; btn.style.color=''; }, 2000);
}
function ecRequestDoc(btn){
  btn.textContent = 'Envoyé !';
  btn.disabled = true;
}

// ── Suivi dossier ──
function ecInitSuivi(){
  ecGuard();
  ecInitHeader();
  // Pré-remplir avec le ref du compte
  var user = ecGetUser();
  if(user && user.ref){
    var refInp = document.getElementById('ec-suivi-ref');
    if(refInp) refInp.value = user.ref;
  }
}
function ecSuiviSearch(){
  var val = (document.getElementById('ec-suivi-ref')||{}).value||'';
  var errEl = document.getElementById('ec-suivi-err');
  var result = document.getElementById('ec-suivi-result');

  if(!val.trim() || val.trim().length < 8){
    if(errEl){ errEl.style.display='block'; }
    if(result) result.style.display='none';
    return;
  }
  if(errEl) errEl.style.display='none';

  var user = ecGetUser();
  var userRef = (user||{}).ref||'';
  // Accepte le ref du compte ou tout ref qui commence par SOF-
  var isValid = val.toUpperCase().startsWith('SOF-');
  if(!isValid){
    if(errEl) errEl.style.display='block';
    if(result) result.style.display='none';
    return;
  }

  if(result) result.style.display='block';
  var refDisp = document.getElementById('ec-suivi-ref-disp');
  if(refDisp) refDisp.textContent = val.toUpperCase();

  // Date de dépôt simulée
  var d = new Date(); d.setDate(d.getDate()-1);
  var dateEl = document.getElementById('ec-tl-date1');
  if(dateEl) dateEl.textContent = d.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'}) + ' à ' + d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

  result.scrollIntoView({behavior:'smooth',block:'start'});
}

// ── Password strength ──
(function(){
  var inp = document.getElementById('ec-pwd-reg');
  var bar = document.getElementById('ec-pwd-strength');
  if(!inp || !bar) return;
  inp.addEventListener('input', function(){
    var v = this.value;
    bar.innerHTML = '<span></span><span></span><span></span>';
    bar.className = 'ec-pwd-strength';
    if(!v) return;
    if(v.length >= 12 && /[A-Z]/.test(v) && /[0-9]/.test(v) && /[^a-zA-Z0-9]/.test(v))
      bar.classList.add('strong');
    else if(v.length >= 8 && (/[A-Z]/.test(v) || /[0-9]/.test(v)))
      bar.classList.add('medium');
    else
      bar.classList.add('weak');
  });
})();

// ── Auto-init selon la page ──
(function(){
  var path = window.location.pathname;
  if(path.includes('espace-client.html')) ecInitDashboard();
  else if(path.includes('mes-documents.html')) ecInitDocuments();
  else if(path.includes('suivi-dossier.html')) ecInitSuivi();
  else if(path.includes('inscription.html') || path.includes('connexion.html')){
    // Si déjà connecté, rediriger vers le dashboard
    // (commenté : laisser l'utilisateur se reconnecter)
  }
})();
