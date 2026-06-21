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

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item');
      var isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(el){el.classList.remove('open');el.querySelector('.faq-question').setAttribute('aria-expanded','false');});
      if(!isOpen){item.classList.add('open');this.setAttribute('aria-expanded','true');}
    });
  });

  // FAQ accordion (product pages)
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click',function(){
      var item=this.closest('.faq-item');
      var isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(el){el.classList.remove('open');});
      if(!isOpen){item.classList.add('open');}
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

  document.getElementById('sim-ph-quit').addEventListener('click',closeSim);
  document.getElementById('sim-ph-logo').addEventListener('click',closeSim);

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
    } else if(s===5){
      document.querySelectorAll('.sim-pane').forEach(function(p){p.classList.remove('s-show');});
      document.getElementById('sim-bb-next').style.display='none';
      document.getElementById('sim-bb-back').style.display='none';
      document.getElementById('sim-bb-prog').textContent='Demande envoyée !';
      var confirm=document.createElement('div');confirm.className='sim-pane s-show sim-confirm';
      confirm.innerHTML='<div class="sim-confirm-ico"></div><p class="sim-confirm-title">Demande enregistrée !</p><p class="sim-confirm-msg">Un conseiller Jkl.oin vous contactera dans les plus brefs délais pour finaliser votre dossier.</p>';
      document.querySelector('.sim-body').appendChild(confirm);
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

  document.getElementById('sim-restart').addEventListener('click',function(){
    openSim(null,null);
  });

  document.querySelector('.sim-cta-big').addEventListener('click',function(){
    showStep(5);
  });

  document.getElementById('sp4-back-btn').addEventListener('click',function(){
    showStep(3);
  });

  document.getElementById('sp4-cta-btn').addEventListener('click',function(){
    showStep(5);
  });

  // Sidebar modifiable (desktop step 4)
  document.getElementById('sp4-sb-montant-inp').addEventListener('change',function(){
    var v=parseInt(this.value);
    if(v>=500 && v<=75000){ simData.montant=v; renderResults(); }
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
  document.getElementById('cof-montant').addEventListener('input',function(){
    var v=parseInt(this.value)||0;
    var errEl=document.getElementById('cof-montant-err');
    var ok=!this.value||(v>=3000&&v<=200000);
    this.classList.toggle('f-err',!ok);
    errEl.classList.toggle('show',!ok);
  });

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

  // ── Bannière cookies ──
  (function(){
    var banner = document.getElementById('cookie-banner');
    if(!banner) return;
    if(!localStorage.getItem('cookie_choice')){
      setTimeout(function(){ banner.classList.add('show'); }, 800);
    }
    function closeBanner(){ banner.classList.remove('show'); }
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
