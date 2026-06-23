// Menu mobile
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('mob-menu');
  var closeBtn = document.getElementById('mob-close');
  var simBar = document.getElementById('mob-sim-bar');
  function openMenu(){ menu.classList.add('open'); document.body.style.overflow='hidden'; if(simBar) simBar.style.display='none'; }
  function closeMenu(){ menu.classList.remove('open'); document.body.style.overflow=''; if(simBar) simBar.style.display=''; }
  if(btn) btn.addEventListener('click', function(){ if(menu.classList.contains('open')){ closeMenu(); } else { openMenu(); } });
  if(closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Footer accordion
  document.querySelectorAll('.footer-acc-btn').forEach(function(btn){
    btn.addEventListener('click',function(){
      var section=this.closest('.footer-acc-section');
      section.classList.toggle('open');
    });
  });

  // FAQ accordion — animation hauteur exacte (scrollHeight)
  function faqClose(el, answerSel, qSel) {
    var ans = el.querySelector(answerSel);
    if (!ans) return;
    el.classList.remove('open');
    if (qSel) { var q = el.querySelector(qSel); if (q) q.setAttribute('aria-expanded','false'); }
  }
  function faqOpen(item, ans, btn) {
    item.classList.add('open');
    if (btn) btn.setAttribute('aria-expanded','true');
  }

  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item');
      var answer=item.querySelector('.faq-answer');
      var isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el){ faqClose(el,'.faq-answer','.faq-question'); });
      if(!isOpen){ faqOpen(item,answer,this); }
    });
  });

  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item');
      var answer=item.querySelector('.faq-a');
      var isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el){ faqClose(el,'.faq-a',null); });
      if(!isOpen){ faqOpen(item,answer,null); }
    });
  });

  // ── Simulateur pleine page ──────────────────────────
  var simData = {step:1, projet:null, montant:null, choix:'mensualite', duree:null};
  var RATE = 3.5/100/12;
  var RATE_REG = 3.5/100/12;
  var PROG = {1:'10%', 2:'35%', 3:'60%', 4:'80%', 5:'100%'};

  function fmtEur(n){ return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+' €'; }
  function fmtAmt(n){ return parseInt(n).toLocaleString('fr-FR')+' €'; }

  function calcPMT(P,n,isReg){
    var r=isReg?RATE_REG:RATE;
    if(r===0) return P/n;
    return P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);
  }

  function showStep(n){
    simData.step=n;
    document.querySelectorAll('.sim-pane').forEach(function(p){p.classList.remove('s-show');});
    document.getElementById('sp'+n).classList.add('s-show');
    document.getElementById('sim-page').scrollTop=0;
    document.querySelector('.sim-body').classList.toggle('sp4-open', n===4);
    document.getElementById('sim-page').classList.toggle('sp4-open', n===4);
    document.getElementById('sim-bb-prog').textContent='Progression : '+(PROG[n]||'90%');
    var nxt=document.getElementById('sim-bb-next');
    if(n===3){ nxt.textContent='Découvrir les offres'; nxt.classList.add('bb-teal'); }
    else if(n===5){ nxt.textContent='Valider ma demande'; nxt.classList.add('bb-teal'); }
    else{ nxt.textContent='Suivant'; nxt.classList.remove('bb-teal'); }
    document.getElementById('sim-bb-back').disabled=(n<=1);
    if(n===3){
      var P=parseInt(simData.montant)||5000;
      document.getElementById('sim-step3-sub').innerHTML=
        'Indiquez vos préférences pour rembourser votre emprunt de <strong>'+fmtAmt(P)+'</strong>.';
      document.getElementById('sim-r-mens').checked=true;
      simData.choix='mensualite';
      refreshDropdown();
    }
    if(n===4) renderResults();
    // SP5: hide bottombar, reset to sub-step 1
    var bb = document.querySelector('.sim-bottombar');
    if(n===5){
      if(bb) bb.style.display='none';
      document.getElementById('sim-page').classList.add('sp5-active');
      sp5Current=1;
      sp5Files={};
      document.querySelectorAll('.sp5-sub').forEach(function(s){s.classList.remove('s5-show');});
      var sa = document.getElementById('sp5a');
      if(sa) sa.classList.add('s5-show');
      sp5UpdateProg(1);
      simData.civilite='M';
      var cm = document.getElementById('sp5-civ-m');
      var cf = document.getElementById('sp5-civ-f');
      if(cm) cm.classList.add('active');
      if(cf) cf.classList.remove('active');
    } else {
      if(bb) bb.style.display='';
      document.getElementById('sim-page').classList.remove('sp5-active');
    }
  }

  function closeDd(){
    document.getElementById('sim-options-trigger').classList.remove('open');
    document.getElementById('sim-dd-list').classList.remove('open');
    document.getElementById('sim-dd-chev').classList.remove('open');
  }
  function refreshDropdown(){
    var P=parseInt(simData.montant)||5000;
    var isReg=(simData.projet==='regroupement');
    var items=[];
    if(simData.choix==='mensualite'){
      document.getElementById('sim-dd-type-lbl').textContent='Mensualité';
      [180,144,120,96,84,72,60,48,36,24,12,6].forEach(function(m){
        var pmt=calcPMT(P,m,isReg);
        items.push({value:m,label:Math.round(pmt)+' € / mois'});
      });
    } else {
      document.getElementById('sim-dd-type-lbl').textContent='Nombre de mensualités';
      [6,12,24,36,48,60,72,84,96,120,144,180].forEach(function(m){
        items.push({value:m,label:m+' mensualités'});
      });
    }
    var list=document.getElementById('sim-dd-list');
    list.innerHTML='';
    closeDd();
    simData.duree=items[0].value;
    document.getElementById('sim-dd-label').textContent=items[0].label;
    items.forEach(function(item,i){
      var li=document.createElement('li');
      li.className='sim-dd-item'+(i===0?' selected':'');
      li.dataset.value=item.value;
      li.textContent=item.label;
      li.addEventListener('click',function(){
        simData.duree=parseInt(li.dataset.value);
        document.getElementById('sim-dd-label').textContent=item.label;
        list.querySelectorAll('.sim-dd-item').forEach(function(x){x.classList.remove('selected')});
        li.classList.add('selected');
        closeDd();
      });
      list.appendChild(li);
    });
  }

  function fmtNum(n){ return n.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2}); }

  function updateOfferCard(offer){
    document.getElementById('sim-r-monthly').textContent=fmtNum(offer.mensualite);
    document.getElementById('sim-r-duree').textContent=offer.duree+' mois';
    document.getElementById('sim-r-taeg').textContent='3,5 %';
    document.getElementById('sim-r-total').textContent=fmtEur(offer.mensualite*offer.duree);
  }

  function renderResults(){
    var P=parseInt(simData.montant)||5000;
    var n=simData.duree||36;
    var isReg=(simData.projet==='regroupement');
    var projetLabels={'famille-loisirs':'Prêt personnel','auto':'Crédit auto','travaux':'Crédit travaux','autre':'Prêt personnel','regroupement':'Regroupement de crédits'};
    var projetNames={'famille-loisirs':'Famille & loisirs','auto':'Auto','travaux':'Travaux','autre':'Autre','regroupement':'Regroupement'};
    var typeName=projetLabels[simData.projet]||'Prêt personnel';

    // 3 offres pour desktop, 2 onglets pour mobile
    var alt1=n>12?n-12:n+12; if(alt1<6)alt1=6;
    var alt2=n+12;
    var offers=[
      {duree:alt1, mensualite:calcPMT(P,alt1,isReg), lbl:'Une offre sur '+alt1+' mois'},
      {duree:n,    mensualite:calcPMT(P,n,isReg),    lbl:'Votre simulation personnalisée'},
      {duree:alt2, mensualite:calcPMT(P,alt2,isReg), lbl:'Une offre sur '+alt2+' mois'}
    ];

    // ── MOBILE : 2 onglets (offre 1 + offre centrale) ──
    document.getElementById('sim-otyp').textContent=typeName+' de '+fmtAmt(P);
    document.getElementById('sim-ocount-n').textContent='2';
    var tabs=document.getElementById('sim-otabs');
    tabs.innerHTML='';
    [offers[0],offers[1]].forEach(function(offer,i){
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='sim-otab'+(i===1?' active':'');
      btn.innerHTML='<span class="sim-otab-price">'+fmtEur(offer.mensualite)+'/mois</span><span class="sim-otab-dur">'+offer.duree+' mois</span>';
      btn.addEventListener('click',function(){
        tabs.querySelectorAll('.sim-otab').forEach(function(t){t.classList.remove('active')});
        btn.classList.add('active');
        updateOfferCard(offer);
      });
      tabs.appendChild(btn);
    });
    updateOfferCard(offers[1]);

    // ── DESKTOP : 3 cartes côte à côte ──
    document.getElementById('sp4-type-lbl').textContent=typeName+' de '+fmtAmt(P);
    // Sidebar — montant
    var sbMontant=document.getElementById('sp4-sb-montant-inp');
    if(sbMontant) sbMontant.value=P;
    // Sidebar — type de crédit
    var sbType=document.getElementById('sp4-sb-type-sel');
    if(sbType) sbType.value=(simData.projet==='regroupement'?'regroupement':'pret');
    // Sidebar — projet
    var sbProjet=document.getElementById('sp4-sb-projet-sel');
    if(sbProjet) sbProjet.value=simData.projet||'famille-loisirs';
    // Sidebar — mensualité select (valeurs calculées par durée)
    var sbMens=document.getElementById('sp4-sb-mens-sel');
    if(sbMens){
      sbMens.innerHTML='';
      [180,144,120,96,84,72,60,48,36,24,12,6].forEach(function(d){
        var pmt=calcPMT(P,d,isReg);
        var opt=document.createElement('option');
        opt.value=d;
        opt.textContent=Math.round(pmt)+' € / mois';
        if(d===n) opt.selected=true;
        sbMens.appendChild(opt);
      });
    }
    // Sidebar — durée select
    var sbDur=document.getElementById('sp4-sb-dur-sel');
    if(sbDur){
      sbDur.innerHTML='';
      [6,12,24,36,48,60,72,84,96,120,144,180].forEach(function(d){
        var opt=document.createElement('option');
        opt.value=d;
        opt.textContent=d+' mois ('+Math.round(d/12*10)/10+' ans)';
        if(d===n) opt.selected=true;
        sbDur.appendChild(opt);
      });
    }
    // Cards
    var cardsEl=document.getElementById('sp4-cards');
    cardsEl.innerHTML='';
    var selOffer=offers[1];
    offers.forEach(function(offer,i){
      var isSel=(i===1);
      var card=document.createElement('div');
      card.className='sp4-card'+(isSel?' sel':'');
      card.innerHTML=
        '<div class="sp4-card-radio"></div>'+
        '<div class="sp4-card-price">'+fmtNum(offer.mensualite)+' <sup>€</sup>/mois</div>'+
        '<div class="sp4-card-sublbl">'+offer.lbl+'</div>'+
        '<div class="sp4-card-row"><span class="sp4-card-row-lbl">Durée</span><span class="sp4-card-row-val">'+offer.duree+' mois</span></div>'+
        '<div class="sp4-card-row"><span class="sp4-card-row-lbl">TAEG fixe</span><span class="sp4-card-row-val">voir le détail</span></div>'+
        '<div class="sp4-card-total"><span>Montant total dû<sup>(1)</sup></span><b>'+fmtEur(offer.mensualite*offer.duree)+'</b></div>';
      card.addEventListener('click',function(){
        cardsEl.querySelectorAll('.sp4-card').forEach(function(c){c.classList.remove('sel')});
        card.classList.add('sel');
        selOffer=offer;
        updateDesktopDetail(offer, P);
      });
      cardsEl.appendChild(card);
    });
    updateDesktopDetail(offers[1], P);
  }

  function updateDesktopDetail(offer, P){
    var last=offer.mensualite; // simplifié
    document.getElementById('sp4-d-montant').textContent=fmtEur(P);
    document.getElementById('sp4-d-mens').textContent=fmtEur(offer.mensualite)+' par mois';
    document.getElementById('sp4-d-last').textContent=fmtEur(last);
    document.getElementById('sp4-d-n').textContent=offer.duree;
  }

  function openSim(projet, montant){
    simData={step:1,projet:projet||null,montant:montant||null,choix:'mensualite',duree:null};
    document.querySelectorAll('.sim-proj-card').forEach(function(b){
      b.classList.toggle('sp-sel', !!projet && b.dataset.val===projet);
    });
    if(montant){ document.getElementById('sim-amount-input').value=montant; }
    else { document.getElementById('sim-amount-input').value=''; }
    document.getElementById('sim-amount-err').classList.remove('show');
    document.getElementById('sim-amount-input').classList.remove('f-err');
    var startStep = (projet && !montant) ? 2 : 1;
    if(projet && montant){ startStep=3; }
    document.getElementById('sim-page').classList.add('open');
    document.body.style.overflow='hidden';
    if(document.getElementById('mob-sim-bar')) document.getElementById('mob-sim-bar').style.display='none';
    showStep(startStep);
  }

  function closeSim(){
    document.getElementById('sim-page').classList.remove('open');
    document.body.style.overflow='';
    if(document.getElementById('mob-sim-bar')) document.getElementById('mob-sim-bar').style.display='';
  }

  var simPhQuit=document.getElementById('sim-ph-quit');
  if(simPhQuit) simPhQuit.addEventListener('click',closeSim);
  var simPhLogo=document.getElementById('sim-ph-logo');
  if(simPhLogo) simPhLogo.addEventListener('click',closeSim);

  // Validation temps réel montant simulateur
  document.getElementById('sim-amount-input').addEventListener('input',function(){
    var v=parseInt(this.value)||0;
    var err=document.getElementById('sim-amount-err');
    var ok=!this.value||(v>=3000&&v<=200000);
    this.classList.toggle('f-err',!ok);
    err.classList.toggle('show',!ok);
  });

  document.querySelectorAll('.sim-proj-card').forEach(function(btn){
    btn.addEventListener('click',function(){
      simData.projet=this.dataset.val;
      document.querySelectorAll('.sim-proj-card').forEach(function(b){b.classList.remove('sp-sel');});
      this.classList.add('sp-sel');
    });
  });

  document.getElementById('sim-bb-next').addEventListener('click',function(){
    var s=simData.step;
    if(s===1){
      if(!simData.projet) return;
      showStep(2);
    } else if(s===2){
      var val=parseInt(document.getElementById('sim-amount-input').value);
      var err=document.getElementById('sim-amount-err');
      var inp=document.getElementById('sim-amount-input');
      if(!val||val<3000||val>200000){
        err.classList.add('show'); inp.classList.add('f-err'); return;
      }
      err.classList.remove('show'); inp.classList.remove('f-err');
      simData.montant=val;
      showStep(3);
    } else if(s===3){
      if(!simData.duree) simData.duree=36;
      showStep(4);
    } else if(s===4){
      showStep(5);
    }
  });

  document.getElementById('sim-bb-back').addEventListener('click',function(){
    if(simData.step>1) showStep(simData.step-1);
  });

  document.querySelectorAll('input[name="sim-choix"]').forEach(function(r){
    r.addEventListener('change',function(){
      simData.choix=this.value;
      refreshDropdown();
    });
  });

  document.getElementById('sim-options-trigger').addEventListener('click',function(){
    var isOpen=this.classList.contains('open');
    if(isOpen){ closeDd(); }
    else{
      this.classList.add('open');
      document.getElementById('sim-dd-list').classList.add('open');
      document.getElementById('sim-dd-chev').classList.add('open');
    }
  });
  document.addEventListener('click',function(e){
    var wrap=document.getElementById('sim-dd-wrap');
    if(wrap&&!wrap.contains(e.target)) closeDd();
  });

  var simRestart=document.getElementById('sim-restart');
  if(simRestart) simRestart.addEventListener('click',function(){ openSim(null,null); });

  var simCtaBig=document.querySelector('.sim-cta-big');
  if(simCtaBig) simCtaBig.addEventListener('click',function(){ showStep(5); });

  var sp4BackBtn=document.getElementById('sp4-back-btn');
  if(sp4BackBtn) sp4BackBtn.addEventListener('click',function(){ showStep(3); });

  var sp4CtaBtn=document.getElementById('sp4-cta-btn');
  if(sp4CtaBtn) sp4CtaBtn.addEventListener('click',function(){ showStep(5); });

  // Sidebar modifiable (desktop step 4)
  document.getElementById('sp4-sb-montant-inp').addEventListener('change',function(){
    var v=parseInt(this.value);
    if(v>=3000 && v<=200000){ simData.montant=v; renderResults(); }
    else { this.value=simData.montant||5000; }
  });
  document.getElementById('sp4-sb-montant-clr').addEventListener('click',function(){
    var inp=document.getElementById('sp4-sb-montant-inp');
    inp.value=''; inp.focus();
    simData.montant=5000;
    renderResults();
  });
  document.getElementById('sp4-sb-type-sel').addEventListener('change',function(){
    if(this.value==='regroupement'){
      simData.projet='regroupement';
      var ps=document.getElementById('sp4-sb-projet-sel');
      if(ps) ps.value='regroupement';
    } else {
      if(simData.projet==='regroupement') simData.projet='famille-loisirs';
    }
    renderResults();
  });
  document.getElementById('sp4-sb-projet-sel').addEventListener('change',function(){
    simData.projet=this.value;
    var ts=document.getElementById('sp4-sb-type-sel');
    if(ts) ts.value=(this.value==='regroupement'?'regroupement':'pret');
    renderResults();
  });
  document.getElementById('sp4-sb-mens-sel').addEventListener('change',function(){
    simData.duree=parseInt(this.value);
    simData.choix='mensualite';
    renderResults();
  });
  document.getElementById('sp4-sb-dur-sel').addEventListener('change',function(){
    simData.duree=parseInt(this.value);
    simData.choix='duree';
    renderResults();
  });

  var heroForm=document.querySelector('.sim-form');
  if(heroForm){
    heroForm.addEventListener('submit',function(e){
      e.preventDefault();
      var p=this.querySelector('[name=projet]').value||null;
      var m=parseInt(this.querySelector('[name=montant]').value)||null;
      openSim(p,m);
    });
  }

  document.querySelectorAll('[data-sim]').forEach(function(el){
    if(el.classList.contains('cof-proj-btn')) return;
    el.addEventListener('click',function(e){
      e.preventDefault();
      var proj=this.dataset.sim||null;
      var amt=this.dataset.simAmt?parseInt(this.dataset.simAmt):null;
      openSim(proj,amt);
    });
  });

  // Cofidis-style simulator: project card selection
  var cofSelected = null;
  document.querySelectorAll('.cof-proj-btn').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.preventDefault();
      document.querySelectorAll('.cof-proj-btn').forEach(function(b){b.classList.remove('sel')});
      this.classList.add('sel');
      cofSelected = this.dataset.sim || null;
    });
  });
  // Validation temps réel champ hero
  var cofMontantInp=document.getElementById('cof-montant');
  if(cofMontantInp){
    cofMontantInp.addEventListener('input',function(){
      var v=parseInt(this.value)||0;
      var errEl=document.getElementById('cof-montant-err');
      var ok=!this.value||(v>=3000&&v<=200000);
      this.classList.toggle('f-err',!ok);
      if(errEl) errEl.classList.toggle('show',!ok);
    });
  }

  var cofSimBtn = document.getElementById('cof-sim-btn');
  if(cofSimBtn){
    cofSimBtn.addEventListener('click',function(){
      var inp=document.getElementById('cof-montant');
      var errEl=document.getElementById('cof-montant-err');
      var montant=parseInt(inp.value)||0;
      if(!montant||montant<3000||montant>200000){
        inp.classList.add('f-err'); errEl.classList.add('show'); return;
      }
      inp.classList.remove('f-err'); errEl.classList.remove('show');
      openSim(cofSelected, montant);
    });
  }

  // ── Simulateur desktop (carte Sofinco) ──
  var hscBtn = document.getElementById('hsc-sim-btn');
  if(hscBtn){
    hscBtn.addEventListener('click',function(){
      var projet = document.getElementById('hsc-projet').value || null;
      var montant = parseInt(document.getElementById('hsc-montant').value)||0;
      openSim(projet, montant >= 3000 && montant <= 200000 ? montant : null);
    });
  }

  // ── Modale cookies ──
  (function(){
    var banner = document.getElementById('cookie-banner');
    var overlay = document.getElementById('cookie-overlay');
    if(!banner) return;
    function showBanner(){
      banner.classList.add('show');
      if(overlay) overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    function closeBanner(){
      banner.classList.remove('show');
      if(overlay) overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
    if(!localStorage.getItem('cookie_choice')){
      setTimeout(showBanner, 800);
    }
    document.getElementById('cookie-accept').addEventListener('click', function(){
      localStorage.setItem('cookie_choice','accepted'); closeBanner();
    });
    document.getElementById('cookie-skip').addEventListener('click', function(){
      localStorage.setItem('cookie_choice','refused'); closeBanner();
    });
    document.getElementById('cookie-settings').addEventListener('click', function(){
      closeBanner();
      window.location.href = 'cookies.html';
    });
    if(overlay) overlay.addEventListener('click', function(){
      localStorage.setItem('cookie_choice','refused'); closeBanner();
    });
  })();

  // Scroll shadow + bouton flottant scroll-up
  var _lastScrollY = 0;
  window.addEventListener('scroll', function() {
    var y = window.scrollY;
    document.querySelector('.header').style.boxShadow =
      y > 8 ? '0 4px 18px rgba(0,0,0,.15)' : '0 1px 8px rgba(0,0,0,.12)';
    var simBar = document.getElementById('mob-sim-bar');
    if(simBar){
      var scrollingUp   = y < _lastScrollY;
      var scrollingDown = y > _lastScrollY;
      var atBottom = (y + window.innerHeight) >= (document.documentElement.scrollHeight - 80);
      if(scrollingUp && y > 150 && !atBottom){
        simBar.classList.add('visible');
      } else if(scrollingDown || y <= 150 || atBottom){
        simBar.classList.remove('visible');
      }
    }
    _lastScrollY = y;
  });

  // ── Footer accordéon ──────────────────────────────────
  function ftToggle(btn){
    var item = btn.parentElement;
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.ft-nav-item').forEach(function(i){i.classList.remove('open');});
    if(!isOpen) item.classList.add('open');
  }

/* ══════════════════════════════════════════
   SP5 — Formulaire multi-étapes
══════════════════════════════════════════ */

// Auto-format date JJ/MM/AAAA while typing
document.addEventListener('DOMContentLoaded', function(){
  // Date de naissance — auto-slash + validation âge en direct
  var ddn = document.getElementById('s5-ddn');
  var ddnErr = document.getElementById('s5-ddn-err');
  if(ddn){
    ddn.addEventListener('input', function(){
      var v = this.value.replace(/\D/g,'');
      if(v.length >= 3 && v.length <= 4) v = v.slice(0,2)+'/'+v.slice(2);
      else if(v.length >= 5) v = v.slice(0,2)+'/'+v.slice(2,4)+'/'+v.slice(4,8);
      this.value = v;
      if(v.length === 10){
        var dateOk = sp5ValidDate(v);
        var ageOk  = dateOk && sp5ValidAge(v);
        var err = !dateOk ? 'Date invalide' : (!ageOk ? 'Vous devez avoir au moins 18 ans' : '');
        ddn.classList.toggle('err', !!err);
        if(ddnErr){ ddnErr.classList.toggle('show', !!err); if(err) ddnErr.textContent = err; }
      } else {
        ddn.classList.remove('err');
        if(ddnErr) ddnErr.classList.remove('show');
      }
    });
  }

  // IBAN — formatage automatique (groupes de 4)
  var iban = document.getElementById('s5-iban');
  var ibanErr = document.getElementById('s5-iban-err');
  if(iban){
    iban.addEventListener('input', function(){
      var raw = this.value.replace(/\s/g,'').toUpperCase();
      this.value = raw.replace(/(.{4})/g,'$1 ').trim();
    });
    iban.addEventListener('blur', function(){
      var valid = sp5ValidIban(this.value);
      iban.classList.toggle('err', !valid && this.value.trim().length > 0);
      if(ibanErr && this.value.trim().length > 0){
        ibanErr.classList.toggle('show', !valid);
        if(!valid) ibanErr.textContent = 'IBAN invalide — vérifiez les chiffres';
      }
    });
  }

  // Téléphone — feedback en direct
  var tel = document.getElementById('s5-tel');
  var telErr = document.getElementById('s5-tel-err');
  if(tel){
    tel.addEventListener('blur', function(){
      if(!this.value.trim()) return;
      var valid = sp5ValidTelFR(this.value);
      tel.classList.toggle('err', !valid);
      if(telErr){ telErr.classList.toggle('show', !valid); if(!valid) telErr.textContent='Numéro français invalide (ex : 06 12 34 56 78)'; }
    });
  }

  // Revenus/charges — nombres positifs uniquement
  ['s5-revenus','s5-charges'].forEach(function(id){
    var el = document.getElementById(id);
    if(!el) return;
    el.addEventListener('blur', function(){
      var n = parseFloat(this.value.replace(/\s/g,'').replace(',','.'));
      var invalid = isNaN(n) || n < 0;
      el.classList.toggle('err', invalid && this.value.trim().length>0);
    });
  });

  // Mot de passe — barre de force
  var pwdInp = document.getElementById('s5-pwd');
  var pwdBar = document.getElementById('s5-pwd-strength');
  if(pwdInp && pwdBar){
    pwdInp.addEventListener('input', function(){
      var v = this.value;
      pwdBar.className = 'sp5-pwd-strength';
      pwdBar.innerHTML = '<span></span><span></span><span></span>';
      if(!v) return;
      if(v.length >= 10 && /[A-Z]/.test(v) && /[0-9]/.test(v)) pwdBar.classList.add('strong');
      else if(v.length >= 8) pwdBar.classList.add('medium');
      else pwdBar.classList.add('weak');
    });
  }
});

function sp5TogglePwd(id, btn){
  var inp = document.getElementById(id);
  if(!inp) return;
  var show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  btn.style.opacity = show ? '1' : '.5';
}

var sp5Current = 1;
var sp5DocMode = 'cni';  // 'cni' | 'passport' | 'permis'
var sp5Files = {};        // keyed by slot name

function sp5Civ(val){
  simData.civilite = val;
  document.getElementById('sp5-civ-m').classList.toggle('active', val==='M');
  document.getElementById('sp5-civ-f').classList.toggle('active', val==='Mme');
}

function sp5UpdateProg(step){
  for(var i=1;i<=4;i++){
    var seg = document.getElementById('sp5p'+i);
    var lbl = document.getElementById('sp5l'+i);
    var isDone   = i < step;
    var isActive = i === step;
    if(seg){
      seg.classList.toggle('done',   isDone);
      seg.classList.toggle('active', isActive);
    }
    if(lbl){
      lbl.classList.toggle('done',   isDone);
      lbl.classList.toggle('active', isActive);
    }
  }
}

// ── Helpers de validation ──
function sp5ValidIban(raw){
  var v = raw.replace(/\s/g,'').toUpperCase();
  if(!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,}$/.test(v)) return false;
  // Reorder + convert letters to digits then mod-97
  var rearranged = v.slice(4) + v.slice(0,4);
  var digits = rearranged.split('').map(function(c){
    var n = c.charCodeAt(0);
    return n >= 65 ? (n - 55).toString() : c;
  }).join('');
  var remainder = digits.match(/.{1,9}/g).reduce(function(rem, chunk){
    return parseInt(String(rem) + chunk, 10) % 97;
  }, 0);
  return remainder === 1;
}
function sp5ValidDate(str){
  var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str);
  if(!m) return false;
  var d = +m[1], mo = +m[2], y = +m[3];
  var dt = new Date(y, mo-1, d);
  return dt.getFullYear()===y && dt.getMonth()===mo-1 && dt.getDate()===d;
}
function sp5ValidAge(str){
  if(!sp5ValidDate(str)) return false;
  var m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(str);
  var born = new Date(+m[3], +m[2]-1, +m[1]);
  var age = (new Date() - born) / (365.25*24*3600*1000);
  return age >= 18 && age <= 90;
}
function sp5ValidName(v){
  return v && v.trim().length >= 2 && /^[A-Za-zÀ-ÿ\s'\-]+$/.test(v.trim());
}
function sp5ValidTelFR(v){
  var d = v.replace(/[\s\.\-]/g,'');
  return /^(0[1-9][0-9]{8}|\+33[1-9][0-9]{8})$/.test(d);
}
var SP5_DISPOSABLE_DOMAINS = [
  'mailinator.com','guerrillamail.com','guerrillamail.net','guerrillamail.org',
  'guerrillamail.biz','guerrillamail.de','guerrillamail.info','guerrillamailblock.com',
  'grr.la','sharklasers.com','spam4.me','yopmail.com','yopmail.fr','cool.fr.nf',
  'jetable.fr.nf','nospam.ze.tc','nomail.xl.cx','speed.1s.fr','courriel.fr.nf',
  'moncourrier.fr.nf','monemail.fr.nf','monmail.fr.nf','trashmail.com','trashmail.me',
  'trashmail.net','trashmail.io','trashmail.at','trashmail.org','trash-mail.at',
  'dispostable.com','mailexpire.com','mailzilla.com','maileater.com','mailnull.com',
  'spamgourmet.com','spamgourmet.net','spamgourmet.org','spamspot.com','spam.la',
  'temp-mail.org','tempmail.com','tempmail.net','tempmail.org','tempr.email',
  'tempinbox.com','temporaryemail.net','tempail.com','mytemp.email','emailondeck.com',
  'maildrop.cc','throwaway.email','throwam.com','fakeinbox.com','mailnew.com',
  'mail7.io','discard.email','mailsac.com','burnermail.io','getairmail.com',
  'moakt.com','mohmal.com','10minutemail.com','10minutemail.net','filzmail.com',
  'inboxbear.com','foxja.com','spamgone.net','33mail.com','eyepaste.com',
  'mail-temporaire.com','mail-temporaire.fr','jetable.com','jetable.net','jetable.org',
  'bouncr.com','boun.cr','spaml.de','spamwc.de','discardmail.com','discardmail.de',
  'crap.kakadua.net','trashdevil.com','trashdevil.de','wegwerfmail.de',
  'wegwerfmail.net','wegwerfmail.org','e4ward.com','spamfree24.org',
  'mt2015.com','mt2016.com','spamthisplease.com','klassmaster.net',
  'klassmaster.com','mailforspam.com','notmailinator.com','tempinbox.com',
  'owlpic.com','spamherelots.com','spamhereplease.com','herp.in',
  'tafmail.com','vomoto.com','rcpt.at','amilegit.com','amiri.net',
  'armyspy.com','cuvox.de','dayrep.com','einrot.com','fleckens.hu',
  'gustr.com','inoutmail.de','inoutmail.eu','inoutmail.info','inoutmail.net',
  'jnxjn.com','jourrapide.com','objectmail.com','obobbo.com','rtrtr.com',
  'spamgrap.de','supergreatmail.com','suremail.info','teleworm.us',
  'thinkskyward.com','tipsy.technology','tradermail.info','veryrealemail.com',
  'webmasterseguro.com','wilemail.com','wronghead.com','xagloo.com',
  'yopmail.gq','zehnminutenmail.de','ichimail.net','disposeamail.com',
  'put2.net','tempsky.com','email-fake.com','tempomail.fr','spamfree.eu'
];

function sp5ValidEmail(v){
  var val = (v||'').trim().toLowerCase();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return false;
  var domain = val.split('@')[1];
  return SP5_DISPOSABLE_DOMAINS.indexOf(domain) === -1;
}
function sp5ValidCP(v){
  return /^(0[1-9]|[1-8][0-9]|9[0-5]|97[1-6])[0-9]{3}$/.test((v||'').trim());
}
function sp5Field(id, errId, testFn, errMsg){
  var el = document.getElementById(id);
  var er = document.getElementById(errId);
  if(!el) return true;
  var valid = testFn(el.value||'');
  el.classList.toggle('err', !valid);
  if(er){ er.classList.toggle('show', !valid); if(!valid && errMsg) er.textContent = errMsg; }
  return valid;
}

function sp5Validate(step){
  var ok = true;
  function check(id, errId, testFn, msg){
    if(!sp5Field(id, errId, testFn, msg)) ok = false;
  }
  function checkBox(id, errId, msg){
    var el = document.getElementById(id);
    var er = document.getElementById(errId);
    var valid = el && el.checked;
    if(er){ er.classList.toggle('show', !valid); if(!valid && msg) er.textContent = msg; }
    if(!valid) ok = false;
  }

  if(step===1){
    check('s5-nom',    's5-nom-err',    function(v){ return sp5ValidName(v); },    'Nom invalide (lettres uniquement, 2 car. min.)');
    check('s5-prenom', 's5-prenom-err', function(v){ return sp5ValidName(v); },    'Prénom invalide (lettres uniquement, 2 car. min.)');
    check('s5-ddn',    's5-ddn-err',    function(v){
      if(!sp5ValidDate(v)) return false;
      if(!sp5ValidAge(v)) return false;
      return true;
    }, 'Date invalide ou âge non conforme (18 ans minimum)');
    check('s5-nat',    's5-nat-err',    function(v){ return v && v.trim().length>0; }, 'Veuillez sélectionner votre nationalité');
    check('s5-sitfam', 's5-sitfam-err', function(v){ return v && v.trim().length>0; }, 'Veuillez sélectionner votre situation familiale');

  } else if(step===2){
    check('s5-sitpro',    's5-sitpro-err',    function(v){ return v && v.trim().length>0; }, 'Veuillez sélectionner votre situation professionnelle');
    check('s5-secteur',   's5-secteur-err',   function(v){ return v && v.trim().length>0; }, 'Veuillez sélectionner votre secteur d\'activité');
    check('s5-anciennete','s5-anciennete-err', function(v){ return v && v.trim().length>0; }, 'Veuillez indiquer votre ancienneté');
    check('s5-revenus',   's5-revenus-err',   function(v){
      var n = parseFloat((v||'').replace(/\s/g,'').replace(',','.'));
      return !isNaN(n) && n > 0 && n < 1000000;
    }, 'Montant de revenus invalide');
    check('s5-charges',   's5-charges-err',   function(v){
      var n = parseFloat((v||'').replace(/\s/g,'').replace(',','.'));
      return !isNaN(n) && n >= 0 && n < 1000000;
    }, 'Montant de charges invalide');

  } else if(step===3){
    check('s5-adresse', 's5-adresse-err', function(v){ return v && v.trim().length >= 5; }, 'Adresse incomplète (5 car. min.)');
    check('s5-cp',      's5-cp-err',      function(v){ return sp5ValidCP(v); },              'Code postal français invalide');
    check('s5-ville',   's5-ville-err',   function(v){ return v && v.trim().length >= 2; },  'Ville invalide');
    check('s5-banque',  's5-banque-err',  function(v){ return v && v.trim().length >= 2; },  'Nom de banque requis');
    check('s5-iban',    's5-iban-err',    function(v){ return sp5ValidIban(v); },             'IBAN invalide — vérifiez les chiffres');
    check('s5-email',   's5-email-err',   function(v){
      var val = (v||'').trim().toLowerCase();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) return false;
      var domain = val.split('@')[1];
      var blocked = SP5_DISPOSABLE_DOMAINS.indexOf(domain) !== -1;
      var emailEl = document.getElementById('s5-email');
      var emailEr = document.getElementById('s5-email-err');
      if(blocked && emailEr) emailEr.textContent = 'Les adresses email temporaires ne sont pas acceptées';
      return !blocked;
    }, 'Adresse email invalide');
    check('s5-tel',     's5-tel-err',     function(v){ return sp5ValidTelFR(v); },            'Numéro français invalide (ex : 06 12 34 56 78)');
    checkBox('s5-cg1', 's5-cg1-err', 'Vous devez accepter les conditions générales');
    checkBox('s5-cg2', 's5-cg2-err', 'Vous devez accepter la politique de données');

  } else if(step===4){
    var hasId = false;
    if(sp5DocMode==='cni')     hasId = !!(sp5Files['cni-r'] && sp5Files['cni-v']);
    else if(sp5DocMode==='passport') hasId = !!sp5Files['passport'];
    else if(sp5DocMode==='permis')   hasId = !!(sp5Files['permis-r'] && sp5Files['permis-v']);
    var idEr = document.getElementById('s5-id-err');
    if(idEr) idEr.classList.toggle('show', !hasId);
    if(!hasId) ok=false;

    var hasDom = !!sp5Files['domicile'];
    var domEr = document.getElementById('s5-dom-err');
    if(domEr) domEr.classList.toggle('show', !hasDom);
    if(!hasDom) ok=false;

    var hasRev = !!sp5Files['revenus'];
    var revEr = document.getElementById('s5-rev-err');
    if(revEr) revEr.classList.toggle('show', !hasRev);
    if(!hasRev) ok=false;

    // mot de passe espace client
    var pwd  = (document.getElementById('s5-pwd')||{}).value||'';
    var pwd2 = (document.getElementById('s5-pwd2')||{}).value||'';
    var pwdEl  = document.getElementById('s5-pwd');
    var pwd2El = document.getElementById('s5-pwd2');
    var pwdEr  = document.getElementById('s5-pwd-err');
    var pwd2Er = document.getElementById('s5-pwd2-err');
    var pwdOk = pwd.length >= 8;
    if(pwdEl)  pwdEl.classList.toggle('err', !pwdOk);
    if(pwdEr){ pwdEr.classList.toggle('show', !pwdOk); if(!pwdOk) pwdEr.textContent='Le mot de passe doit contenir au moins 8 caractères'; }
    if(!pwdOk) ok = false;
    var matchOk = pwd2 === pwd && pwd2.length > 0;
    if(pwd2El) pwd2El.classList.toggle('err', !matchOk);
    if(pwd2Er){ pwd2Er.classList.toggle('show', !matchOk); if(!matchOk) pwd2Er.textContent='Les mots de passe ne correspondent pas'; }
    if(!matchOk) ok = false;
  }
  return ok;
}

function sp5Go(toStep){
  if(toStep > sp5Current){
    if(!sp5Validate(sp5Current)) return;
  }
  var subs = ['sp5a','sp5b','sp5c','sp5d'];
  subs.forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.classList.remove('s5-show');
  });
  var target = document.getElementById('sp5'+['a','b','c','d'][toStep-1]);
  if(target) target.classList.add('s5-show');
  sp5Current = toStep;
  sp5UpdateProg(toStep);
  var sp5El = document.getElementById('sp5');
  if(sp5El) sp5El.scrollIntoView({behavior:'smooth',block:'start'});
  var simPage = document.getElementById('sim-page');
  if(simPage) simPage.scrollTop=0;
}

function sp5DocTab(mode, btn){
  sp5DocMode = mode;
  document.querySelectorAll('.sp5-doc-tab').forEach(function(t){t.classList.remove('active');});
  if(btn) btn.classList.add('active');
  var panels = ['cni','passport','permis'];
  panels.forEach(function(p){
    var el = document.getElementById('sp5-panel-'+p);
    if(el) el.classList.toggle('sp5-doc-panel-hide', p!==mode);
  });
}

function sp5PickFile(slot){
  var inp = document.getElementById('f-'+slot);
  if(inp) inp.click();
}

function sp5FileChosen(slot, inp){
  if(!inp.files || !inp.files.length) return;
  sp5Files[slot] = inp.files[0];
  var upEl = document.getElementById('sp5-up-'+slot);
  if(!upEl) return;
  upEl.classList.add('has-file');
  // show filename
  var nameEl = upEl.querySelector('.sp5-upload-name');
  if(!nameEl){
    nameEl = document.createElement('div');
    nameEl.className = 'sp5-upload-name';
    upEl.appendChild(nameEl);
  }
  nameEl.textContent = inp.files.length > 1 ? inp.files.length+' fichiers sélectionnés' : inp.files[0].name;
  // update button text
  var btn = upEl.querySelector('.sp5-choisir');
  if(btn) btn.textContent = 'Modifier';
}

function sp5Submit(){
  if(!sp5Validate(4)) return;

  // Génère un numéro de dossier unique
  var ts = Date.now().toString(36).toUpperCase();
  var rand = Math.floor(Math.random()*90000+10000);
  var ref = 'SOF-' + new Date().getFullYear() + '-' + rand + ts.slice(-3);

  // Date et heure de dépôt
  var now = new Date();
  var dateStr = now.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'});
  var timeStr = now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

  // Données du demandeur
  var prenom = (document.getElementById('s5-prenom')||{}).value || '';
  var nom    = (document.getElementById('s5-nom')||{}).value || '';
  var email  = (document.getElementById('s5-email')||{}).value || '';
  var tel    = (document.getElementById('s5-tel')||{}).value || '';
  var pwd    = (document.getElementById('s5-pwd')||{}).value || '';
  var nomAffiche = (prenom+' '+nom).trim() || 'Monsieur/Madame';

  // Calcule la mensualité réelle depuis simData
  var loanMontant = parseInt(simData.montant) || 0;
  var loanDuree   = parseInt(simData.duree)   || 60;
  var loanRate    = 3.5/100/12;
  var loanMens    = loanMontant > 0
    ? Math.round(loanMontant * loanRate * Math.pow(1+loanRate, loanDuree) / (Math.pow(1+loanRate, loanDuree) - 1))
    : 0;

  // Création automatique du compte espace client
  var ecUser = {
    civilite: simData.civilite || 'M',
    prenom: prenom.trim(),
    nom: nom.trim(),
    email: email.trim().toLowerCase(),
    tel: tel.trim(),
    ref: ref,
    pwd: pwd,
    createdAt: new Date().toISOString(),
    loan: {
      montant:    loanMontant,
      duree:      loanDuree,
      mensualite: loanMens,
      moisPasses: 0,
      dateDebut:  new Date().toISOString()
    }
  };
  localStorage.setItem('ec_user', JSON.stringify(ecUser));
  localStorage.setItem('ec_session', '1');

  document.querySelectorAll('.sp5-sub').forEach(function(s){s.classList.remove('s5-show');});

  // Marquer toutes les barres comme terminées
  sp5UpdateProg(5);

  var body = document.querySelector('.sim-body');
  var existing = document.querySelector('.sp5-confirm-wrap');
  if(existing) existing.remove();

  var wrap = document.createElement('div');
  wrap.className = 'sp5-confirm-wrap';
  wrap.innerHTML =
    '<div class="sp5-confirm-check">'+
      '<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">'+
        '<circle cx="26" cy="26" r="25" stroke="var(--teal)" stroke-width="2"/>'+
        '<path d="M14 26.5l8 8 16-16" stroke="var(--teal)" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'+
      '</svg>'+
    '</div>'+
    '<p class="sp5-confirm-hey">Merci, '+nomAffiche+' !</p>'+
    '<h2 class="sp5-confirm-title">Votre dossier a été soumis</h2>'+
    '<div class="sp5-confirm-ref-box">'+
      '<span class="sp5-confirm-ref-lbl">Numéro de dossier</span>'+
      '<span class="sp5-confirm-ref-num">'+ref+'</span>'+
      '<span class="sp5-confirm-ref-date">Déposé le '+dateStr+' à '+timeStr+'</span>'+
    '</div>'+
    '<div class="sp5-confirm-steps">'+
      '<div class="sp5-confirm-step done">'+
        '<div class="sp5-cs-dot"><svg viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="#fff" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>'+
        '<div class="sp5-cs-body"><strong>Dossier reçu</strong><span>Votre demande est enregistrée</span></div>'+
      '</div>'+
      '<div class="sp5-confirm-step">'+
        '<div class="sp5-cs-dot sp5-cs-pending">2</div>'+
        '<div class="sp5-cs-body"><strong>Analyse du dossier</strong><span>Sous 24 h ouvrées</span></div>'+
      '</div>'+
      '<div class="sp5-confirm-step">'+
        '<div class="sp5-cs-dot sp5-cs-pending">3</div>'+
        '<div class="sp5-cs-body"><strong>Appel de votre conseiller</strong><span>Confirmation et offre personnalisée</span></div>'+
      '</div>'+
      '<div class="sp5-confirm-step">'+
        '<div class="sp5-cs-dot sp5-cs-pending">4</div>'+
        '<div class="sp5-cs-body"><strong>Signature &amp; déblocage des fonds</strong><span>Dès validation de votre contrat</span></div>'+
      '</div>'+
    '</div>'+
    '<p class="sp5-confirm-email-note">Un email de confirmation a été envoyé à l\'adresse renseignée.</p>'+
    '<a class="sp5-confirm-close sp5-confirm-cta" href="espace-client.html">Accéder à mon espace client →</a>'+
    '<button class="sp5-confirm-close sp5-confirm-secondary" onclick="closeSim()">Fermer</button>';

  body.appendChild(wrap);
  document.getElementById('sim-page').scrollTop=0;
}


// ── Sélecteur de langue ──
(function(){
  var btn = document.getElementById('lang-switcher-btn');
  var dropdown = document.getElementById('lang-dropdown');
  if(!btn || !dropdown) return;

  // Save manual lang choice so auto-detect doesn't override it
  dropdown.querySelectorAll('.lang-opt').forEach(function(a){
    a.addEventListener('click', function(){
      var href = a.getAttribute('href') || '';
      var m = href.match(/^(?:\.\.\/)?([a-z]{2})\//);
      localStorage.setItem('lang_choice', m ? m[1] : 'fr');
    });
  });

  btn.addEventListener('click', function(e){
    e.stopPropagation();
    var open = dropdown.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('click', function(){
    dropdown.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){
      dropdown.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

// ── Sélecteur de langue footer — style Revolut ──
(function(){
  var trigger_wrap = document.getElementById('ft-lang-section');
  var panel = document.getElementById('ft-lang-panel');
  var list = document.getElementById('ft-lang-list');
  if(!trigger_wrap || !panel || !list) return;

  var langs = [
    {code:'fr', flag:'🇫🇷', name:'Français'},
    {code:'en', flag:'🇬🇧', name:'English'},
    {code:'de', flag:'🇩🇪', name:'Deutsch'},
    {code:'es', flag:'🇪🇸', name:'Español'},
    {code:'it', flag:'🇮🇹', name:'Italiano'},
    {code:'nl', flag:'🇳🇱', name:'Nederlands'},
    {code:'pl', flag:'🇵🇱', name:'Polski'},
    {code:'sv', flag:'🇸🇪', name:'Svenska'}
  ];

  var path = location.pathname;
  var m = path.match(/\/([a-z]{2})\//);
  var current = m ? m[1] : 'fr';
  var page = path.split('/').pop() || 'index.html';
  if(!page.endsWith('.html')) page = 'index.html';
  var depth = m ? 1 : 0;

  var cur = langs.filter(function(l){return l.code===current;})[0] || langs[0];

  // Build trigger button
  var btn = document.createElement('button');
  btn.className = 'ft-lang-trigger';
  btn.innerHTML = '<span class="ft-lang-trigger-flag">' + cur.flag + '</span>'
    + '<span class="ft-lang-trigger-name">' + cur.name + '</span>'
    + '<span class="ft-lang-trigger-chev">▾</span>';
  trigger_wrap.appendChild(btn);

  // Build list inside panel
  langs.forEach(function(l){
    var a = document.createElement('a');
    var href = l.code === 'fr'
      ? (depth === 1 ? '../' + page : page)
      : (depth === 1 ? '../' + l.code + '/' + page : l.code + '/' + page);
    a.href = href;
    a.className = 'ft-lang-list-item' + (l.code === current ? ' ft-lang-list-item--active' : '');
    a.innerHTML = '<span class="ft-lang-list-flag">' + l.flag + '</span>'
      + '<span class="ft-lang-list-name">' + l.name + '</span>'
      + '<span class="ft-lang-list-check">✓</span>';
    a.addEventListener('click', function(){ localStorage.setItem('lang_choice', l.code); });
    list.appendChild(a);
  });

  // Search filter
  var searchInput = document.getElementById('ft-lang-search-input');
  if(searchInput){
    searchInput.addEventListener('input', function(){
      var q = this.value.toLowerCase();
      list.querySelectorAll('.ft-lang-list-item').forEach(function(item){
        var name = item.querySelector('.ft-lang-list-name').textContent.toLowerCase();
        item.style.display = name.includes(q) ? '' : 'none';
      });
    });
  }

  // Open panel
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
    if(searchInput){ searchInput.value=''; searchInput.focus(); }
    list.querySelectorAll('.ft-lang-list-item').forEach(function(i){ i.style.display=''; });
  });

  // Close on overlay click
  panel.addEventListener('click', function(e){
    if(e.target === panel){
      panel.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && panel.classList.contains('open')){
      panel.classList.remove('open');
      document.body.style.overflow='';
    }
  });
})();
