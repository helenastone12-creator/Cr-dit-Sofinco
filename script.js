var LANG = (function(){
  var m = location.pathname.match(/^\/(en|de|es|it|nl|pl|sv)\//);
  return m ? m[1] : 'fr';
})();
var T = {
  fr: {
    next: 'Suivant',
    discover_offers: 'Découvrir les offres',
    validate: 'Valider ma demande',
    progress: 'Progression',
    monthly: 'Mensualité',
    nb_monthly: 'Nombre de mensualités',
    months: 'mois',
    per_month: '€ / mois',
    duration: 'Durée',
    fixed_taeg: 'TAEG fixe',
    see_detail: 'voir le détail',
    total_due: 'Montant total dû',
    your_sim: 'Votre simulation personnalisée',
    offer_on: 'Une offre sur',
    indicate_pref: 'Indiquez vos préférences pour rembourser votre emprunt de',
    pret_perso: 'Prêt personnel',
    credit_auto: 'Crédit auto',
    credit_travaux: 'Crédit travaux',
    regroupement: 'Regroupement de crédits',
    famille: 'Famille & loisirs',
    auto_lbl: 'Auto',
    travaux_lbl: 'Travaux',
    autre_lbl: 'Autre',
    regroupement_lbl: 'Regroupement',
    nationality_err: 'Veuillez sélectionner votre nationalité',
    sitfam_err: 'Veuillez sélectionner votre situation familiale',
    sitpro_err: 'Veuillez sélectionner votre situation professionnelle',
    secteur_err: 'Veuillez sélectionner votre secteur d\'activité',
    anciennete_err: 'Veuillez indiquer votre ancienneté',
    advisor_call: 'Appel de votre conseiller',
    advisor_sub: 'Confirmation et offre personnalisée',
    sign_funds: 'Signature & déblocage des fonds',
    sign_sub: 'Dès validation de votre contrat',
    years: 'ans',
    search: 'Rechercher'
  },
  en: {
    next: 'Next',
    discover_offers: 'Discover offers',
    validate: 'Submit my application',
    progress: 'Progress',
    monthly: 'Monthly payment',
    nb_monthly: 'Number of instalments',
    months: 'months',
    per_month: '€ / month',
    duration: 'Duration',
    fixed_taeg: 'Fixed APR',
    see_detail: 'see details',
    total_due: 'Total amount due',
    your_sim: 'Your personalised simulation',
    offer_on: 'An offer over',
    indicate_pref: 'Set your preferences to repay your loan of',
    pret_perso: 'Personal loan',
    credit_auto: 'Car loan',
    credit_travaux: 'Home improvement loan',
    regroupement: 'Debt consolidation',
    famille: 'Family & leisure',
    auto_lbl: 'Car',
    travaux_lbl: 'Home',
    autre_lbl: 'Other',
    regroupement_lbl: 'Consolidation',
    nationality_err: 'Please select your nationality',
    sitfam_err: 'Please select your family situation',
    sitpro_err: 'Please select your professional situation',
    secteur_err: 'Please select your activity sector',
    anciennete_err: 'Please indicate your seniority',
    advisor_call: 'Advisor call',
    advisor_sub: 'Confirmation and personalised offer',
    sign_funds: 'Signature & fund release',
    sign_sub: 'Upon validation of your contract',
    years: 'yrs',
    search: 'Search'
  },
  de: {
    next: 'Weiter',
    discover_offers: 'Angebote entdecken',
    validate: 'Antrag einreichen',
    progress: 'Fortschritt',
    monthly: 'Monatliche Rate',
    nb_monthly: 'Anzahl der Raten',
    months: 'Monate',
    per_month: '€ / Monat',
    duration: 'Laufzeit',
    fixed_taeg: 'Fester effektiver Jahreszins',
    see_detail: 'Details anzeigen',
    total_due: 'Gesamtrückzahlungsbetrag',
    your_sim: 'Ihre persönliche Simulation',
    offer_on: 'Ein Angebot über',
    indicate_pref: 'Geben Sie Ihre Präferenzen für die Rückzahlung Ihres Darlehens von',
    pret_perso: 'Privatkredit',
    credit_auto: 'Autokredit',
    credit_travaux: 'Renovierungskredit',
    regroupement: 'Schuldenumschuldung',
    familie: 'Familie & Freizeit',
    auto_lbl: 'Auto',
    travaux_lbl: 'Renovierung',
    autre_lbl: 'Sonstiges',
    regroupement_lbl: 'Umschuldung',
    nationality_err: 'Bitte wählen Sie Ihre Nationalität',
    sitfam_err: 'Bitte wählen Sie Ihren Familienstand',
    sitpro_err: 'Bitte wählen Sie Ihre berufliche Situation',
    secteur_err: 'Bitte wählen Sie Ihren Tätigkeitsbereich',
    anciennete_err: 'Bitte geben Sie Ihre Betriebszugehörigkeit an',
    advisor_call: 'Beratergespräch',
    advisor_sub: 'Bestätigung und persönliches Angebot',
    sign_funds: 'Unterschrift & Auszahlung',
    sign_sub: 'Nach Genehmigung Ihres Vertrags',
    years: 'J.',
    search: 'Suchen'
  },
  es: {
    next: 'Siguiente',
    discover_offers: 'Descubrir ofertas',
    validate: 'Enviar mi solicitud',
    progress: 'Progreso',
    monthly: 'Cuota mensual',
    nb_monthly: 'Número de cuotas',
    months: 'meses',
    per_month: '€ / mes',
    duration: 'Duración',
    fixed_taeg: 'TAE fija',
    see_detail: 'ver detalles',
    total_due: 'Importe total a pagar',
    your_sim: 'Su simulación personalizada',
    offer_on: 'Una oferta a',
    indicate_pref: 'Indique sus preferencias para reembolsar su préstamo de',
    pret_perso: 'Préstamo personal',
    credit_auto: 'Préstamo de coche',
    credit_travaux: 'Préstamo para reformas',
    regroupement: 'Consolidación de deudas',
    famille: 'Familia & ocio',
    auto_lbl: 'Coche',
    travaux_lbl: 'Reformas',
    autre_lbl: 'Otro',
    regroupement_lbl: 'Consolidación',
    nationality_err: 'Por favor seleccione su nacionalidad',
    sitfam_err: 'Por favor seleccione su situación familiar',
    sitpro_err: 'Por favor seleccione su situación profesional',
    secteur_err: 'Por favor seleccione su sector de actividad',
    anciennete_err: 'Por favor indique su antigüedad',
    advisor_call: 'Llamada de su asesor',
    advisor_sub: 'Confirmación y oferta personalizada',
    sign_funds: 'Firma y desembolso de fondos',
    sign_sub: 'Tras la validación de su contrato',
    years: 'años',
    search: 'Buscar'
  },
  it: {
    next: 'Avanti',
    discover_offers: 'Scopri le offerte',
    validate: 'Invia la mia richiesta',
    progress: 'Avanzamento',
    monthly: 'Rata mensile',
    nb_monthly: 'Numero di rate',
    months: 'mesi',
    per_month: '€ / mese',
    duration: 'Durata',
    fixed_taeg: 'TAEG fisso',
    see_detail: 'vedi dettagli',
    total_due: 'Importo totale dovuto',
    your_sim: 'La tua simulazione personalizzata',
    offer_on: "Un'offerta su",
    indicate_pref: 'Indica le tue preferenze per rimborsare il tuo prestito di',
    pret_perso: 'Prestito personale',
    credit_auto: 'Prestito auto',
    credit_travaux: 'Prestito ristrutturazione',
    regroupement: 'Consolidamento debiti',
    famille: 'Famiglia & svago',
    auto_lbl: 'Auto',
    travaux_lbl: 'Ristrutturazione',
    autre_lbl: 'Altro',
    regroupement_lbl: 'Consolidamento',
    nationality_err: 'Seleziona la tua nazionalità',
    sitfam_err: 'Seleziona la tua situazione familiare',
    sitpro_err: 'Seleziona la tua situazione professionale',
    secteur_err: 'Seleziona il tuo settore di attività',
    anciennete_err: 'Indica la tua anzianità',
    advisor_call: 'Chiamata del tuo consulente',
    advisor_sub: 'Conferma e offerta personalizzata',
    sign_funds: 'Firma e sblocco dei fondi',
    sign_sub: 'Dopo la convalida del contratto',
    years: 'anni',
    search: 'Cerca'
  },
  nl: {
    next: 'Volgende',
    discover_offers: 'Aanbiedingen ontdekken',
    validate: 'Aanvraag indienen',
    progress: 'Voortgang',
    monthly: 'Maandbedrag',
    nb_monthly: 'Aantal termijnen',
    months: 'maanden',
    per_month: '€ / maand',
    duration: 'Looptijd',
    fixed_taeg: 'Vaste JKP',
    see_detail: 'details bekijken',
    total_due: 'Totaal te betalen bedrag',
    your_sim: 'Uw persoonlijke simulatie',
    offer_on: 'Een aanbieding over',
    indicate_pref: 'Geef uw voorkeuren aan voor de terugbetaling van uw lening van',
    pret_perso: 'Persoonlijke lening',
    credit_auto: 'Autolening',
    credit_travaux: 'Renovatielening',
    regroupement: 'Schuldenherstructurering',
    famille: 'Familie & vrije tijd',
    auto_lbl: 'Auto',
    travaux_lbl: 'Renovatie',
    autre_lbl: 'Overig',
    regroupement_lbl: 'Herstructurering',
    nationality_err: 'Selecteer uw nationaliteit',
    sitfam_err: 'Selecteer uw gezinssituatie',
    sitpro_err: 'Selecteer uw beroepssituatie',
    secteur_err: 'Selecteer uw activiteitssector',
    anciennete_err: 'Geef uw dienstverband aan',
    advisor_call: 'Oproep van uw adviseur',
    advisor_sub: 'Bevestiging en persoonlijk aanbod',
    sign_funds: 'Ondertekening & uitbetaling',
    sign_sub: 'Na goedkeuring van uw contract',
    years: 'jr',
    search: 'Zoeken'
  },
  pl: {
    next: 'Dalej',
    discover_offers: 'Odkryj oferty',
    validate: 'Złóż wniosek',
    progress: 'Postęp',
    monthly: 'Rata miesięczna',
    nb_monthly: 'Liczba rat',
    months: 'miesięcy',
    per_month: '€ / miesiąc',
    duration: 'Czas trwania',
    fixed_taeg: 'Stałe RRSO',
    see_detail: 'zobacz szczegóły',
    total_due: 'Całkowita kwota do zapłaty',
    your_sim: 'Twoja spersonalizowana symulacja',
    offer_on: 'Oferta na',
    indicate_pref: 'Podaj swoje preferencje dotyczące spłaty pożyczki w wysokości',
    pret_perso: 'Pożyczka osobista',
    credit_auto: 'Kredyt samochodowy',
    credit_travaux: 'Kredyt remontowy',
    regroupement: 'Konsolidacja długów',
    famille: 'Rodzina i wypoczynek',
    auto_lbl: 'Samochód',
    travaux_lbl: 'Remont',
    autre_lbl: 'Inne',
    regroupement_lbl: 'Konsolidacja',
    nationality_err: 'Proszę wybrać narodowość',
    sitfam_err: 'Proszę wybrać sytuację rodzinną',
    sitpro_err: 'Proszę wybrać sytuację zawodową',
    secteur_err: 'Proszę wybrać sektor działalności',
    anciennete_err: 'Proszę podać staż pracy',
    advisor_call: 'Rozmowa z doradcą',
    advisor_sub: 'Potwierdzenie i spersonalizowana oferta',
    sign_funds: 'Podpisanie i uruchomienie środków',
    sign_sub: 'Po zatwierdzeniu umowy',
    years: 'lat',
    search: 'Szukaj'
  },
  sv: {
    next: 'Nästa',
    discover_offers: 'Utforska erbjudanden',
    validate: 'Skicka min ansökan',
    progress: 'Framsteg',
    monthly: 'Månadsbetalning',
    nb_monthly: 'Antal avbetalningar',
    months: 'månader',
    per_month: '€ / månad',
    duration: 'Löptid',
    fixed_taeg: 'Fast effektiv ränta',
    see_detail: 'se detaljer',
    total_due: 'Totalt belopp att betala',
    your_sim: 'Din personliga simulering',
    offer_on: 'Ett erbjudande på',
    indicate_pref: 'Ange dina preferenser för återbetalning av ditt lån på',
    pret_perso: 'Personligt lån',
    credit_auto: 'Billån',
    credit_travaux: 'Renoveringslån',
    regroupement: 'Skuldkonsolidering',
    famille: 'Familj & fritid',
    auto_lbl: 'Bil',
    travaux_lbl: 'Renovering',
    autre_lbl: 'Övrigt',
    regroupement_lbl: 'Konsolidering',
    nationality_err: 'Välj ditt medborgarskap',
    sitfam_err: 'Välj din familjesituation',
    sitpro_err: 'Välj din yrkessituation',
    secteur_err: 'Välj din verksamhetssektor',
    anciennete_err: 'Ange din anställningstid',
    advisor_call: 'Rådgivares samtal',
    advisor_sub: 'Bekräftelse och personligt erbjudande',
    sign_funds: 'Underskrift & utbetalning',
    sign_sub: 'Efter godkännande av ditt avtal',
    years: 'år',
    search: 'Sök'
  }
};
var t = T[LANG] || T.fr;
// ── Scroll lock universel (iOS Safari + PC + tablette) ──
var _lockScrollY = 0;
function lockScroll(){
  _lockScrollY = window.scrollY || window.pageYOffset;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + _lockScrollY + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';
}
function unlockScroll(){
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  window.scrollTo(0, _lockScrollY);
}

// Menu mobile
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('mob-menu');
  var closeBtn = document.getElementById('mob-close');
  var simBar = document.getElementById('mob-sim-bar');
  function openMenu(){ menu.classList.add('open'); lockScroll(); if(simBar) simBar.style.display='none'; }
  function closeMenu(){ menu.classList.remove('open'); unlockScroll(); if(simBar) simBar.style.display=''; }
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
    document.getElementById('sim-bb-prog').textContent=t.progress+' : '+(PROG[n]||'90%');
    var nxt=document.getElementById('sim-bb-next');
    if(n===3){ nxt.textContent=t.discover_offers; nxt.classList.add('bb-teal'); }
    else if(n===5){ nxt.textContent=t.validate; nxt.classList.add('bb-teal'); }
    else{ nxt.textContent=t.next; nxt.classList.remove('bb-teal'); }
    document.getElementById('sim-bb-back').disabled=(n<=1);
    if(n===3){
      var P=parseInt(simData.montant)||5000;
      document.getElementById('sim-step3-sub').innerHTML=
        t.indicate_pref+' <strong>'+fmtAmt(P)+'</strong>.';
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
      document.getElementById('sim-dd-type-lbl').textContent=t.monthly;
      [180,144,120,96,84,72,60,48,36,24,12,6].forEach(function(m){
        var pmt=calcPMT(P,m,isReg);
        items.push({value:m,label:Math.round(pmt)+' '+t.per_month});
      });
    } else {
      document.getElementById('sim-dd-type-lbl').textContent=t.nb_monthly;
      [6,12,24,36,48,60,72,84,96,120,144,180].forEach(function(m){
        items.push({value:m,label:m+' '+t.months});
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
    document.getElementById('sim-r-duree').textContent=offer.duree+' '+t.months;
    document.getElementById('sim-r-taeg').textContent='3,5 %';
    document.getElementById('sim-r-total').textContent=fmtEur(offer.mensualite*offer.duree);
  }

  function renderResults(){
    var P=parseInt(simData.montant)||5000;
    var n=simData.duree||36;
    var isReg=(simData.projet==='regroupement');
    var projetLabels={'famille-loisirs':t.pret_perso,'auto':t.credit_auto,'travaux':t.credit_travaux,'autre':t.pret_perso,'regroupement':t.regroupement};
    var projetNames={'famille-loisirs':t.famille,'auto':t.auto_lbl,'travaux':t.travaux_lbl,'autre':t.autre_lbl,'regroupement':t.regroupement_lbl};
    var typeName=projetLabels[simData.projet]||'Prêt personnel';

    // 3 offres pour desktop, 2 onglets pour mobile
    var alt1=n>12?n-12:n+12; if(alt1<6)alt1=6;
    var alt2=n+12;
    var offers=[
      {duree:alt1, mensualite:calcPMT(P,alt1,isReg), lbl:t.offer_on+' '+alt1+' '+t.months},
      {duree:n,    mensualite:calcPMT(P,n,isReg),    lbl:t.your_sim},
      {duree:alt2, mensualite:calcPMT(P,alt2,isReg), lbl:t.offer_on+' '+alt2+' '+t.months}
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
      btn.innerHTML='<span class="sim-otab-price">'+fmtEur(offer.mensualite)+' '+t.per_month+'</span><span class="sim-otab-dur">'+offer.duree+' '+t.months+'</span>';
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
        opt.textContent=Math.round(pmt)+' '+t.per_month;
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
        opt.textContent=d+' '+t.months+' ('+Math.round(d/12*10)/10+' '+t.years+')';
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
        '<div class="sp4-card-price">'+fmtNum(offer.mensualite)+' <sup>€</sup> '+t.per_month+'</div>'+
        '<div class="sp4-card-sublbl">'+offer.lbl+'</div>'+
        '<div class="sp4-card-row"><span class="sp4-card-row-lbl">'+t.duration+'</span><span class="sp4-card-row-val">'+offer.duree+' '+t.months+'</span></div>'+
        '<div class="sp4-card-row"><span class="sp4-card-row-lbl">'+t.fixed_taeg+'</span><span class="sp4-card-row-val">'+t.see_detail+'</span></div>'+
        '<div class="sp4-card-total"><span>'+t.total_due+'<sup>(1)</sup></span><b>'+fmtEur(offer.mensualite*offer.duree)+'</b></div>';
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
    document.getElementById('sp4-d-mens').textContent=fmtEur(offer.mensualite)+' '+t.per_month;
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
    lockScroll();
    if(document.getElementById('mob-sim-bar')) document.getElementById('mob-sim-bar').style.display='none';
    showStep(startStep);
  }

  function closeSim(){
    var page = document.getElementById('sim-page');
    page.classList.add('closing');
    setTimeout(function(){
      page.classList.remove('open','closing');
      unlockScroll();
      if(document.getElementById('mob-sim-bar')) document.getElementById('mob-sim-bar').style.display='';
    }, 280);
  }

  var simPhQuit=document.getElementById('sim-ph-quit');
  if(simPhQuit) simPhQuit.addEventListener('click',closeSim);
  var simPhLogo=document.getElementById('sim-ph-logo');
  if(simPhLogo) simPhLogo.addEventListener('click',closeSim);

  // Validation temps réel montant simulateur
  var simAmtInput = document.getElementById('sim-amount-input');
  if(simAmtInput) simAmtInput.addEventListener('input',function(){
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
      lockScroll();
    }
    function closeBanner(){
      banner.classList.remove('show');
      if(overlay) overlay.classList.remove('show');
      unlockScroll();
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
      if(telErr){ telErr.classList.toggle('show', !valid); if(!valid) telErr.textContent=({'fr':'Numéro invalide','en':'Invalid phone number','de':'Ungültige Telefonnummer','es':'Número inválido','it':'Numero non valido','nl':'Ongeldig telefoonnummer','pl':'Nieprawidłowy numer','sv':'Ogiltigt telefonnummer'}[LANG]||'Numéro invalide'); }
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
var TEL_LENGTH = {
  FR:9, ES:9, IT:9, PT:9, NL:9, BE:9, CH:9, GR:9, PL:9, CZ:9, SK:9, RO:9, HU:9, TR:9,
  GB:10, DE:10, SE:10, FI:10, IE:10,
  NO:8, DK:8, LU:8, CY:8, MT:8,
  AT:[10,11],
  BG:[8,9], HR:[8,9], SI:[8,9], RS:[8,9], AL:[8,9], BA:[8,9], ME:[8,9], MK:[8,9], XK:[8,9],
  EE:[7,8], LV:[7,8], LT:[7,8],
  IS:7, LI:7
};
function sp5ValidTelFR(v){
  var local = v.replace(/[\s\.\-\(\)]/g,'');
  if(!/^[0-9]+$/.test(local)) return false;
  var len = local.length;
  var country = window.currentTelCountry || 'FR';
  var rule = TEL_LENGTH[country] || [6,14];
  if(Array.isArray(rule)) return len >= rule[0] && len <= rule[1];
  return len === rule;
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
var CP_REGEX = {
  'FR': /^(0[1-9]|[1-8]\d|9[0-5]|97[1-6])\d{3}$/,
  'MC': /^\d{5}$/,
  'DE': /^\d{5}$/,
  'AT': /^\d{4}$/,
  'CH': /^\d{4}$/,
  'LI': /^\d{4}$/,
  'LU': /^\d{4}$/,
  'BE': /^\d{4}$/,
  'NL': /^\d{4}\s?[A-Z]{2}$/i,
  'GB': /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i,
  'IE': /^[A-Z]\d{2}\s?[A-Z0-9]{4}$/i,
  'ES': /^\d{5}$/,
  'IT': /^\d{5}$/,
  'PT': /^\d{4}-?\d{3}$/,
  'PL': /^\d{2}-?\d{3}$/,
  'SE': /^\d{3}\s?\d{2}$/,
  'FI': /^\d{5}$/,
  'DK': /^\d{4}$/,
  'NO': /^\d{4}$/,
  'GR': /^\d{5}$/,
  'CZ': /^\d{3}\s?\d{2}$/,
  'SK': /^\d{3}\s?\d{2}$/,
  'HU': /^\d{4}$/,
  'RO': /^\d{6}$/,
  'BG': /^\d{4}$/,
  'HR': /^\d{5}$/
};
function sp5ValidCP(v){
  v = (v||'').trim();
  var country = (window.currentTelCountry || 'FR').toUpperCase();
  var rx = CP_REGEX[country];
  if(rx) return rx.test(v);
  return v.length >= 3;
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
    check('s5-nat',    's5-nat-err',    function(v){ return v && v.trim().length>0; }, t.nationality_err);
    check('s5-sitfam', 's5-sitfam-err', function(v){ return v && v.trim().length>0; }, t.sitfam_err);

  } else if(step===2){
    check('s5-sitpro',    's5-sitpro-err',    function(v){ return v && v.trim().length>0; }, t.sitpro_err);
    check('s5-secteur',   's5-secteur-err',   function(v){ return v && v.trim().length>0; }, t.secteur_err);
    check('s5-anciennete','s5-anciennete-err', function(v){ return v && v.trim().length>0; }, t.anciennete_err);
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
    check('s5-cp',      's5-cp-err',      function(v){ return sp5ValidCP(v); },              'Code postal invalide');
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
    check('s5-tel',     's5-tel-err',     function(v){ return sp5ValidTelFR(v); },            'Numéro invalide (6 à 14 chiffres)');
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
  if(!sp5Validate(4)){
    // Scroll to first visible error so user can see what's missing
    var sub = document.getElementById('sp5d');
    var err = sub && sub.querySelector('.sp5-err.show, .sp5-err-msg.show, [class*="err"].show');
    if(err){ err.scrollIntoView({behavior:'smooth', block:'center'}); }
    else {
      var simPage = document.getElementById('sim-page');
      if(simPage) simPage.scrollTo({top:0, behavior:'smooth'});
    }
    return;
  }

  // Génère un numéro unique partagé par l'ID client et le dossier
  var _yr = new Date().getFullYear();
  var _fdxNum = 'FDX-' + _yr + '-' + String(Math.floor(100000 + Math.random()*900000));
  var ref = _fdxNum;

  // Date et heure de dépôt
  var now = new Date();
  var dateStr = now.toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'});
  var timeStr = now.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});

  // Données du demandeur
  var prenom = (document.getElementById('s5-prenom')||{}).value || '';
  var nom    = (document.getElementById('s5-nom')||{}).value || '';
  var email  = (document.getElementById('s5-email')||{}).value || '';
  var tel    = (document.getElementById('s5-tel')||{}).value || '';
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
    id: _fdxNum,
    civilite: simData.civilite || 'M',
    prenom: prenom.trim(),
    nom: nom.trim(),
    email: email.trim().toLowerCase(),
    tel: tel.trim(),
    ref: ref,
    pwd: null,
    status: 'pending',
    createdAt: new Date().toISOString(),
    loan: {
      montant:    loanMontant,
      duree:      loanDuree,
      mensualite: loanMens,
      moisPasses: 0,
      dateDebut:  new Date().toISOString()
    }
  };
  // Sauvegarder dans Supabase
  if(typeof FidDB !== 'undefined'){
    FidDB.createClient(ecUser).catch(function(e){ console.error('[sp5] Supabase createClient failed:', e); });
  }

  // Emails automatiques à la soumission du dossier
  if(typeof FidEmail !== 'undefined' && email){
    var montantStr = loanMontant.toLocaleString('fr-FR')+ ' €';
    var dureeStr   = loanDuree + ' mois';
    var mensStr    = loanMens.toLocaleString('fr-FR') + ' €/mois';
    /* 1. Email bienvenue au client */
    FidEmail.bienvenue(prenom.trim(), nom.trim(), email.trim().toLowerCase(), _fdxNum);
    /* 2. Email simulation soumise au client */
    FidEmail.simulationSoumise(prenom.trim(), email.trim().toLowerCase(), montantStr, dureeStr, mensStr);
    /* 3. Notification admin : formulaire complet */
    var g = function(id){ return ((document.getElementById(id)||{}).value||'').trim(); };
    var projetLabel = simData.projet||'Non précisé';
    function row(lbl,val){ return val ? '<tr><td style="padding:8px 12px;color:#888;font-size:.85rem;white-space:nowrap;vertical-align:top">'+lbl+'</td><td style="padding:8px 12px;font-size:.85rem;font-weight:600;color:#1a1a2e">'+val+'</td></tr>' : ''; }
    function section(title){ return '<tr><td colspan="2" style="padding:12px 12px 4px;font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#B59A55;background:#fafafa">'+title+'</td></tr>'; }
    var tableRows =
      section('Simulation')
      +row('Projet', projetLabel)
      +row('Montant demandé', montantStr)
      +row('Durée', dureeStr)
      +row('Mensualité estimée', mensStr)
      +row('N° dossier', ref)
      +section('Identité')
      +row('Civilité', g('s5-civilite')||simData.civilite||'')
      +row('Prénom', prenom.trim())
      +row('Nom', nom.trim())
      +row('Date de naissance', g('s5-ddn'))
      +row('Nationalité', g('s5-nat'))
      +row('Situation familiale', g('s5-sitfam'))
      +section('Situation professionnelle')
      +row('Statut', g('s5-sitpro'))
      +row('Secteur', g('s5-secteur'))
      +row('Ancienneté', g('s5-anciennete'))
      +row('Revenus mensuels nets', g('s5-revenus')+' €')
      +row('Charges mensuelles', g('s5-charges')+' €')
      +section('Coordonnées')
      +row('Email', email.trim())
      +row('Téléphone', tel.trim())
      +row('Adresse', g('s5-adresse'))
      +row('Code postal', g('s5-cp'))
      +row('Ville', g('s5-ville'))
      +section('Informations bancaires')
      +row('Banque', g('s5-banque'))
      +row('IBAN', g('s5-iban'));
    var adminHtml = '<div style="font-family:\'Segoe UI\',Arial,sans-serif;background:#f4f6f9;padding:40px 20px">'
      +'<div style="max-width:620px;margin:0 auto">'
      +'<div style="text-align:center;margin-bottom:28px"><span style="font-size:1.7rem;font-weight:800;color:#0B5E8A">Fidexico</span></div>'
      +'<div style="background:#fff;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.07)">'
      +'<h2 style="color:#0B5E8A;margin:0 0 20px;font-size:1.15rem">🆕 Nouvelle demande de crédit</h2>'
      +'<table style="width:100%;border-collapse:collapse;border:1px solid #e8eaed;border-radius:10px;overflow:hidden">'+tableRows+'</table>'
      +'<div style="margin-top:24px"><a href="https://fidexico.eu/admin.html" style="display:inline-block;background:#0B5E8A;color:#fff;text-decoration:none;padding:12px 28px;border-radius:50px;font-weight:700;font-size:.9rem">Voir dans l\'admin</a></div>'
      +'</div>'
      +'<p style="text-align:center;color:#aaa;font-size:.75rem;margin-top:20px">© 2026 Fidexico · fidexico.eu</p>'
      +'</div></div>';
    /* Convertir les fichiers en base64 pour les pièces jointes */
    var fileSlots = [
      {key:'cni-r',      label:'CNI_recto'},
      {key:'cni-v',      label:'CNI_verso'},
      {key:'passport',   label:'Passeport'},
      {key:'permis-r',   label:'Permis_recto'},
      {key:'permis-v',   label:'Permis_verso'},
      {key:'domicile',   label:'Justificatif_domicile'},
      {key:'revenus',    label:'Justificatif_revenus'}
    ];
    var fileEntries = fileSlots.filter(function(s){ return !!sp5Files[s.key]; });

    function fileToB64(file){
      return new Promise(function(resolve){
        var reader = new FileReader();
        reader.onload = function(e){
          var b64 = e.target.result.split(',')[1];
          resolve({filename: file.name, content: b64, type: file.type||'application/octet-stream'});
        };
        reader.readAsDataURL(file);
      });
    }

    Promise.all(fileEntries.map(function(s){ return fileToB64(sp5Files[s.key]); }))
      .then(function(attachments){
        var payload = {
          from:'Fidexico <contact@fidexico.eu>',
          to:['contact@fidexico.eu'],
          subject:'Nouvelle demande — '+prenom.trim()+' '+nom.trim()+' — '+montantStr,
          html: adminHtml
        };
        if(attachments.length > 0) payload.attachments = attachments;
        return fetch('/send-email.php', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(payload)
        });
      })
      .then(function(r){ return r && r.json ? r.json().then(function(d){ if(!r.ok) console.error('[Admin Email] Resend error '+r.status+':', JSON.stringify(d)); else console.log('[Admin Email] Sent, id:', d.id); }) : null; })
      .catch(function(e){ console.error('[Admin Email] Fetch failed:', e); });
  }

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
        '<div class="sp5-cs-body"><strong>'+t.advisor_call+'</strong><span>'+t.advisor_sub+'</span></div>'+
      '</div>'+
      '<div class="sp5-confirm-step">'+
        '<div class="sp5-cs-dot sp5-cs-pending">4</div>'+
        '<div class="sp5-cs-body"><strong>'+t.sign_funds+'</strong><span>'+t.sign_sub+'</span></div>'+
      '</div>'+
    '</div>'+
    '<p class="sp5-confirm-email-note">Un email de confirmation a été envoyé à l\'adresse renseignée.</p>'+
    '<a class="sp5-confirm-close sp5-confirm-cta" href="inscription.html">Finaliser mon inscription →</a>'+
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

  // flagcdn.com fournit de vraies images de drapeaux circulaires
  var flagUrl = function(code){ return 'https://flagcdn.com/w40/' + code + '.png'; };
  var flagMap = {fr:'fr',en:'gb',de:'de',es:'es',it:'it',nl:'nl',pl:'pl',sv:'se'};

  var langs = [
    {code:'fr', name:'Français'},
    {code:'en', name:'English'},
    {code:'de', name:'Deutsch'},
    {code:'es', name:'Español'},
    {code:'it', name:'Italiano'},
    {code:'nl', name:'Nederlands'},
    {code:'pl', name:'Polski'},
    {code:'sv', name:'Svenska'}
  ];

  // Twemoji CDN — SVG flags fiables sur PC et mobile
  var twemoji = 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/';
  var flagSvg = {
    fr: twemoji + '1f1eb-1f1f7.svg',
    en: twemoji + '1f1ec-1f1e7.svg',
    de: twemoji + '1f1e9-1f1ea.svg',
    es: twemoji + '1f1ea-1f1f8.svg',
    it: twemoji + '1f1ee-1f1f9.svg',
    nl: twemoji + '1f1f3-1f1f1.svg',
    pl: twemoji + '1f1f5-1f1f1.svg',
    sv: twemoji + '1f1f8-1f1ea.svg'
  };

  var CHECK_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  var GLOBE_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>';

  var path = location.pathname;
  var m = path.match(/\/([a-z]{2})\//);
  var current = m ? m[1] : 'fr';
  var depth = m ? 1 : 0;
  var pageMap = {
    "index.html":               {"en":"index.html","de":"index.html","es":"index.html","it":"index.html","nl":"index.html","pl":"index.html","sv":"index.html"},
    "connexion.html":           {"en":"login.html","de":"anmelden.html","es":"iniciar-sesion.html","it":"accedi.html","nl":"inloggen.html","pl":"logowanie.html","sv":"logga-in.html"},
    "inscription.html":         {"en":"register.html","de":"registrieren.html","es":"registro.html","it":"registrazione.html","nl":"registreren.html","pl":"rejestracja.html","sv":"registrera.html"},
    "mot-de-passe-oublie.html": {"en":"forgot-password.html","de":"passwort-vergessen.html","es":"contrasena-olvidada.html","it":"password-dimenticata.html","nl":"wachtwoord-vergeten.html","pl":"zapomniane-haslo.html","sv":"glomt-losenord.html"},
    "espace-client.html":       {"en":"my-account.html","de":"mein-konto.html","es":"mi-cuenta.html","it":"il-mio-conto.html","nl":"mijn-account.html","pl":"moje-konto.html","sv":"mitt-konto.html"},
    "mes-documents.html":       {"en":"my-documents.html","de":"meine-dokumente.html","es":"mis-documentos.html","it":"i-miei-documenti.html","nl":"mijn-documenten.html","pl":"moje-dokumenty.html","sv":"mina-dokument.html"},
    "suivi-dossier.html":       {"en":"application-tracking.html","de":"antrag-verfolgen.html","es":"seguimiento-solicitud.html","it":"monitoraggio-pratica.html","nl":"dossier-volgen.html","pl":"sledzenie-wniosku.html","sv":"arende-uppfoljning.html"},
    "questions-reponses.html":  {"en":"faq.html","de":"faq.html","es":"faq.html","it":"faq.html","nl":"faq.html","pl":"faq.html","sv":"faq.html"},
    "tarifs.html":              {"en":"pricing.html","de":"preise.html","es":"tarifas.html","it":"tariffe.html","nl":"tarieven.html","pl":"cennik.html","sv":"priser.html"},
    "cartes.html":              {"en":"cards.html","de":"karten.html","es":"tarjetas.html","it":"carte.html","nl":"kaarten.html","pl":"karty.html","sv":"kort.html"},
    "securite.html":            {"en":"security.html","de":"sicherheit.html","es":"seguridad.html","it":"sicurezza.html","nl":"beveiliging.html","pl":"bezpieczenstwo.html","sv":"sakerhet.html"},
    "devenir-partenaire.html":  {"en":"become-a-partner.html","de":"partner-werden.html","es":"convertirse-en-socio.html","it":"diventa-partner.html","nl":"word-partner.html","pl":"zostan-partnerem.html","sv":"bli-partner.html"},
    "mentions-legales.html":    {"en":"legal-notice.html","de":"impressum.html","es":"aviso-legal.html","it":"note-legali.html","nl":"juridische-informatie.html","pl":"nota-prawna.html","sv":"juridisk-information.html"},
    "informations-legales.html":{"en":"legal-information.html","de":"rechtliche-informationen.html","es":"informacion-legal.html","it":"informazioni-legali.html","nl":"wettelijke-informatie.html","pl":"informacje-prawne.html","sv":"rattslig-information.html"},
    "cgu.html":                 {"en":"terms.html","de":"nutzungsbedingungen.html","es":"terminos-uso.html","it":"termini-uso.html","nl":"gebruiksvoorwaarden.html","pl":"regulamin.html","sv":"anvandarvillkor.html"},
    "politique-donnees.html":   {"en":"privacy-policy.html","de":"datenschutz.html","es":"politica-privacidad.html","it":"politica-privacy.html","nl":"privacybeleid.html","pl":"polityka-prywatnosci.html","sv":"integritetspolicy.html"},
    "cookies.html":             {"en":"cookies.html","de":"cookies.html","es":"cookies.html","it":"cookies.html","nl":"cookies.html","pl":"cookies.html","sv":"cookies.html"},
    "reclamations.html":        {"en":"complaints.html","de":"beschwerden.html","es":"reclamaciones.html","it":"reclami.html","nl":"klachten.html","pl":"reklamacje.html","sv":"klagomal.html"},
    "accessibilite.html":       {"en":"accessibility.html","de":"barrierefreiheit.html","es":"accesibilidad.html","it":"accessibilita.html","nl":"toegankelijkheid.html","pl":"dostepnosc.html","sv":"tillganglighet.html"},
    "conditions-credit.html":   {"en":"credit-conditions.html","de":"kreditbedingungen.html","es":"condiciones-credito.html","it":"condizioni-credito.html","nl":"kredietvoorwaarden.html","pl":"warunki-kredytu.html","sv":"kreditvillkor.html"},
    "nous-contacter.html":      {"en":"contact.html","de":"kontakt.html","es":"contacto.html","it":"contatti.html","nl":"contact.html","pl":"kontakt.html","sv":"kontakt.html"},
    "nous-decouvrir.html":      {"en":"about-us.html","de":"ueber-uns.html","es":"sobre-nosotros.html","it":"chi-siamo.html","nl":"over-ons.html","pl":"o-nas.html","sv":"om-oss.html"},
    "assurances.html":          {"en":"insurance.html","de":"versicherungen.html","es":"seguros.html","it":"assicurazioni.html","nl":"verzekeringen.html","pl":"ubezpieczenia.html","sv":"forsakringar.html"},
    "credit-auto.html":         {"en":"car-loan.html","de":"autokredit.html","es":"credito-auto.html","it":"credito-auto.html","nl":"autolening.html","pl":"kredyt-samochodowy.html","sv":"billaan.html"},
    "credit-moto.html":         {"en":"motorcycle-loan.html","de":"motorradkredit.html","es":"credito-moto.html","it":"credito-moto.html","nl":"motorlening.html","pl":"kredyt-motocyklowy.html","sv":"motorcykellaan.html"},
    "credit-renouvelable.html": {"en":"revolving-credit.html","de":"revolving-kredit.html","es":"credito-renovable.html","it":"credito-revolving.html","nl":"doorlopend-krediet.html","pl":"kredyt-odnawialny.html","sv":"roterande-kredit.html"},
    "credit-travaux.html":      {"en":"home-improvement-loan.html","de":"renovierungskredit.html","es":"credito-obras.html","it":"credito-ristrutturazione.html","nl":"verbouwingslening.html","pl":"kredyt-remontowy.html","sv":"renoveringslaan.html"},
    "pret-personnel.html":      {"en":"personal-loan.html","de":"privatkredit.html","es":"prestamo-personal.html","it":"prestito-personale.html","nl":"persoonlijke-lening.html","pl":"pozyczka-osobista.html","sv":"personligt-laan.html"},
    "rachat-de-credits.html":   {"en":"debt-consolidation.html","de":"kreditabloesung.html","es":"reunion-de-deudas.html","it":"consolidamento-debiti.html","nl":"schuldenherfinanciering.html","pl":"konsolidacja-dlugow.html","sv":"skuldkonsolidering.html"}
  };
  // Build reverse map: lang -> {localized_name: fr_name}
  var reverseMap = {};
  Object.keys(pageMap).forEach(function(fr){ Object.keys(pageMap[fr]).forEach(function(lc){ if(!reverseMap[lc]) reverseMap[lc]={};reverseMap[lc][pageMap[fr][lc]]=fr; }); });
  var rawPage = path.split('/').pop() || 'index.html';
  if(!rawPage.endsWith('.html')) rawPage = 'index.html';
  // Resolve to FR canonical name
  var frPage = (current === 'fr') ? rawPage : ((reverseMap[current] && reverseMap[current][rawPage]) || rawPage);

  var cur = langs.filter(function(l){return l.code===current;})[0] || langs[0];

  // Trigger — globe + nom
  var btn = document.createElement('button');
  btn.className = 'ft-lang-trigger';
  btn.innerHTML = GLOBE_SVG
    + '<span class="ft-lang-trigger-name">' + cur.name + '</span>'
    + '<svg class="ft-lang-trigger-chev" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>';
  trigger_wrap.appendChild(btn);

  // Liste — drapeau rond + nom
  langs.forEach(function(l){
    var a = document.createElement('a');
    var targetPage = l.code === 'fr' ? frPage : ((pageMap[frPage] && pageMap[frPage][l.code]) || frPage);
    var href = l.code === 'fr'
      ? (depth === 1 ? '../' + targetPage : targetPage)
      : (depth === 1 ? '../' + l.code + '/' + targetPage : l.code + '/' + targetPage);
    a.href = href;
    a.className = 'ft-lang-list-item' + (l.code === current ? ' ft-lang-list-item--active' : '');
    a.innerHTML = '<span class="ft-lang-list-flag"><img src="' + flagSvg[l.code] + '" alt=""></span>'
      + '<span class="ft-lang-list-name">' + l.name + '</span>'
      + '<span class="ft-lang-list-check">' + CHECK_SVG + '</span>';
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

  // Open panel — pas de focus() pour éviter le clavier mobile
  btn.addEventListener('click', function(e){
    e.stopPropagation();
    panel.classList.add('open');
    lockScroll();
    if(searchInput){ searchInput.value=''; }
    list.querySelectorAll('.ft-lang-list-item').forEach(function(i){ i.style.display=''; });
  });

  // Close on overlay click
  panel.addEventListener('click', function(e){
    if(e.target === panel){
      panel.classList.remove('open');
      unlockScroll();
    }
  });

  // Close on Escape
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape' && panel.classList.contains('open')){
      panel.classList.remove('open');
      unlockScroll();
    }
  });
})();

// ── IP Geolocation — auto-redirect + form adaptation ──
(function(){
  var COUNTRY_LANG = {
    // Français
    'FR':'fr','MC':'fr','LU':'fr',
    // English
    'GB':'en','IE':'en',
    // Deutsch
    'DE':'de','AT':'de','LI':'de','CH':'de',
    // Español
    'ES':'es',
    // Italiano
    'IT':'it','SM':'it','VA':'it',
    // Nederlands
    'NL':'nl','BE':'nl',
    // Polski
    'PL':'pl',
    // Svenska
    'SE':'sv','FI':'sv',
    // Autres pays européens → anglais par défaut
    'PT':'en','GR':'en','CZ':'en','SK':'en','HU':'en','RO':'en','BG':'en',
    'HR':'en','RS':'en','SI':'en','BA':'en','MK':'en','AL':'en','NO':'en',
    'DK':'en','IS':'en','EE':'en','LV':'en','LT':'en','BY':'en','MD':'en',
    'ME':'en','XK':'en','CY':'en','MT':'en'
  };

  var FORM_DATA = {
    'FR': { tel:'06 XX XX XX XX',   cp:'75001',   ibanPfx:'FR76 XXXX XXXX XXXX XXXX XXXX XXX',      cpLen:5 },
    'MC': { tel:'+377 6X XX XX XX', cp:'98000',   ibanPfx:'MC58 XXXX XXXX XXXX XXXX XXXX XXX',      cpLen:5 },
    'LU': { tel:'+352 6XX XXX XXX', cp:'1009',    ibanPfx:'LU28 XXXX XXXX XXXX XXXX',               cpLen:4 },
    'DE': { tel:'+49 XXX XXXXXXX',  cp:'10115',   ibanPfx:'DE89 XXXX XXXX XXXX XXXX XX',            cpLen:5 },
    'AT': { tel:'+43 XXX XXXXXXX',  cp:'1010',    ibanPfx:'AT61 XXXX XXXX XXXX XXXX',               cpLen:4 },
    'CH': { tel:'+41 XX XXX XX XX', cp:'8001',    ibanPfx:'CH56 XXXX XXXX XXXX XXXX X',             cpLen:4 },
    'LI': { tel:'+423 XXX XXXX',    cp:'9490',    ibanPfx:'LI21 XXXX XXXX XXXX XXXX X',             cpLen:4 },
    'GB': { tel:'+44 7XXX XXXXXX',  cp:'SW1A 1AA',ibanPfx:'GB29 XXXX XXXX XXXX XXXX XX',            cpLen:7 },
    'IE': { tel:'+353 8X XXX XXXX', cp:'D01 F5P2',ibanPfx:'IE29 XXXX XXXX XXXX XXXX XX',            cpLen:7 },
    'ES': { tel:'+34 6XX XXX XXX',  cp:'28001',   ibanPfx:'ES91 XXXX XXXX XXXX XXXX XXXX',          cpLen:5 },
    'IT': { tel:'+39 3XX XXX XXXX', cp:'00100',   ibanPfx:'IT60 XXXX XXXX XXXX XXXX XXXX XXX',      cpLen:5 },
    'NL': { tel:'+31 6 XXXX XXXX',  cp:'1000 AA', ibanPfx:'NL91 XXXX XXXX XXXX XX',                 cpLen:6 },
    'BE': { tel:'+32 4XX XX XX XX', cp:'1000',    ibanPfx:'BE68 XXXX XXXX XXXX',                    cpLen:4 },
    'PL': { tel:'+48 XXX XXX XXX',  cp:'00-001',  ibanPfx:'PL61 XXXX XXXX XXXX XXXX XXXX XXXX',    cpLen:6 },
    'SE': { tel:'+46 7X XXX XX XX', cp:'111 20',  ibanPfx:'SE45 XXXX XXXX XXXX XXXX XXXX',          cpLen:5 },
    'FI': { tel:'+358 4X XXX XXXX', cp:'00100',   ibanPfx:'FI21 XXXX XXXX XXXX XX',                 cpLen:5 },
    'DK': { tel:'+45 XX XX XX XX',  cp:'1000',    ibanPfx:'DK50 XXXX XXXX XXXX XX',                 cpLen:4 },
    'NO': { tel:'+47 4XX XX XXX',   cp:'0010',    ibanPfx:'NO93 XXXX XXXX XXX',                     cpLen:4 },
    'PT': { tel:'+351 9XX XXX XXX', cp:'1000-001',ibanPfx:'PT50 XXXX XXXX XXXX XXXX XXXX X',        cpLen:8 },
    'GR': { tel:'+30 6XX XXX XXXX', cp:'10431',   ibanPfx:'GR16 XXXX XXXX XXXX XXXX XXXX XXX',      cpLen:5 },
    'CZ': { tel:'+420 7XX XXX XXX', cp:'110 00',  ibanPfx:'CZ65 XXXX XXXX XXXX XXXX XXXX',          cpLen:6 },
    'SK': { tel:'+421 9XX XXX XXX', cp:'811 01',  ibanPfx:'SK31 XXXX XXXX XXXX XXXX XXXX',          cpLen:6 },
    'HU': { tel:'+36 XX XXX XXXX',  cp:'1011',    ibanPfx:'HU42 XXXX XXXX XXXX XXXX XXXX XXXX',    cpLen:4 },
    'RO': { tel:'+40 7XX XXX XXX',  cp:'010011',  ibanPfx:'RO49 XXXX XXXX XXXX XXXX XXXX',          cpLen:6 },
    'BG': { tel:'+359 8XX XXX XXX', cp:'1000',    ibanPfx:'BG80 XXXX XXXX XXXX XXXX XX',            cpLen:4 },
    'HR': { tel:'+385 9X XXX XXXX', cp:'10000',   ibanPfx:'HR12 XXXX XXXX XXXX XXXX X',             cpLen:5 },
  };

  var DIAL_CODES = {
    'FR':'+33','MC':'+377','LU':'+352','DE':'+49','AT':'+43','CH':'+41','LI':'+423',
    'GB':'+44','IE':'+353','ES':'+34','IT':'+39','NL':'+31','BE':'+32','PL':'+48',
    'SE':'+46','FI':'+358','DK':'+45','NO':'+47','PT':'+351','GR':'+30','CZ':'+420',
    'SK':'+421','HU':'+36','RO':'+40','BG':'+359','HR':'+385','SI':'+386','EE':'+372',
    'LV':'+371','LT':'+370','MT':'+356','CY':'+357','IS':'+354','AL':'+355',
    'BA':'+387','RS':'+381','ME':'+382','MK':'+389','UA':'+380','MD':'+373','BY':'+375','TR':'+90'
  };

  // Local placeholder without dial prefix
  var TEL_LOCAL = {
    'FR':'6 XX XX XX XX','MC':'6X XX XX XX','LU':'6XX XXX XXX','DE':'XXX XXXXXXX',
    'AT':'XXX XXXXXXX','CH':'XX XXX XX XX','LI':'XXX XXXX','GB':'7XXX XXXXXX',
    'IE':'8X XXX XXXX','ES':'6XX XXX XXX','IT':'3XX XXX XXXX','NL':'6 XXXX XXXX',
    'BE':'4XX XX XX XX','PL':'XXX XXX XXX','SE':'7X XXX XX XX','FI':'4X XXX XXXX',
    'DK':'XX XX XX XX','NO':'4XX XX XXX','PT':'9XX XXX XXX','GR':'6XX XXX XXXX',
    'CZ':'7XX XXX XXX','SK':'9XX XXX XXX','HU':'XX XXX XXXX','RO':'7XX XXX XXX',
    'BG':'8XX XXX XXX','HR':'9X XXX XXXX','SI':'XX XXX XXX','EE':'5XXX XXXX',
    'LV':'2XXX XXXX','LT':'6XX XXXXX','MT':'79XX XXXX','CY':'9X XXX XXX',
    'IS':'XXX XXXX','AL':'6X XXX XXXX','BA':'6X XXX XXX','RS':'6X XXX XXXX',
    'ME':'6X XXX XXX','MK':'7X XXX XXX','UA':'XX XXX XXXX','MD':'7X XXX XXX',
    'BY':'XX XXX XXXX','TR':'5XX XXX XXXX'
  };

  // Country names for tel picker (use same names as nat dropdown — fr fallback)
  var TEL_COUNTRY_NAMES = {
    'FR':'France','DE':'Allemagne','GB':'Royaume-Uni','IT':'Italie','ES':'Espagne',
    'BE':'Belgique','NL':'Pays-Bas','PT':'Portugal','CH':'Suisse','AT':'Autriche',
    'PL':'Pologne','SE':'Suède','DK':'Danemark','NO':'Norvège','FI':'Finlande',
    'IE':'Irlande','GR':'Grèce','CZ':'Rép. tchèque','SK':'Slovaquie','HU':'Hongrie',
    'RO':'Roumanie','BG':'Bulgarie','HR':'Croatie','SI':'Slovénie','EE':'Estonie',
    'LV':'Lettonie','LT':'Lituanie','MT':'Malte','CY':'Chypre','LU':'Luxembourg',
    'MC':'Monaco','LI':'Liechtenstein','IS':'Islande','AL':'Albanie','BA':'Bosnie',
    'RS':'Serbie','ME':'Monténégro','MK':'Macédoine','UA':'Ukraine','MD':'Moldavie',
    'BY':'Biélorussie','TR':'Turquie'
  };

  window.currentTelCountry = 'FR';
  var currentTelCountry = 'FR';
  var telPickerOpen = false;

  function buildTelPicker(){
    if(document.getElementById('tel-picker-panel')) return;
    var lang = (typeof LANG !== 'undefined' ? LANG : 'fr');
    var titleMap = {fr:'Code pays',en:'Country code',de:'Ländervorwahl',es:'Código de país',it:'Prefisso paese',nl:'Landcode',pl:'Kod kraju',sv:'Landskod'};
    var searchMap = {fr:'Rechercher...',en:'Search...',de:'Suchen...',es:'Buscar...',it:'Cerca...',nl:'Zoeken...',pl:'Szukaj...',sv:'Sök...'};

    var panel = document.createElement('div');
    panel.id = 'tel-picker-panel';
    panel.className = 'nat-panel';

    // Header
    var hdr = document.createElement('div');
    hdr.className = 'nat-header';
    var closeB = document.createElement('button');
    closeB.type='button'; closeB.className='nat-close-btn';
    closeB.innerHTML='<svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 1l6 7 6-7" stroke="#555" stroke-width="2" stroke-linecap="round"/></svg>';
    var titleS = document.createElement('span');
    titleS.className='nat-title';
    titleS.textContent = titleMap[lang]||'Country code';
    hdr.appendChild(closeB); hdr.appendChild(titleS);

    // Search
    var sw = document.createElement('div'); sw.className='nat-search-wrap';
    var sb = document.createElement('div'); sb.className='nat-search-box';
    sb.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    var sinp = document.createElement('input');
    sinp.type='text'; sinp.className='nat-search'; sinp.placeholder=searchMap[lang]||'Search...'; sinp.autocomplete='off';
    sb.appendChild(sinp); sw.appendChild(sb);

    // List
    var list = document.createElement('ul'); list.className='nat-list';

    var entries = Object.keys(DIAL_CODES).sort(function(a,b){
      var na = TEL_COUNTRY_NAMES[a]||a, nb = TEL_COUNTRY_NAMES[b]||b;
      return na.localeCompare(nb);
    });

    function renderTelList(filter){
      list.innerHTML='';
      entries.forEach(function(code){
        var name = TEL_COUNTRY_NAMES[code]||code;
        var dial = DIAL_CODES[code];
        if(filter && name.toLowerCase().indexOf(filter.toLowerCase())<0 && dial.indexOf(filter)<0) return;
        var li = document.createElement('li');
        li.className='nat-item'+(code===currentTelCountry?' nat-sel':'');
        li.innerHTML='<img class="nat-flag" src="https://hatscripts.github.io/circle-flags/flags/'+code.toLowerCase()+'.svg" alt="'+code+'">'
          +'<span class="nat-item-label">'+name+'</span>'
          +'<span style="color:#888;font-size:.9rem">'+dial+'</span>'
          +(code===currentTelCountry?'<svg class="nat-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06c2b0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>':'');
        li.addEventListener('click', function(){
          currentTelCountry = code;
          window.currentTelCountry = code;
          updateTelPfx(null, code);
          // Update placeholder to local format
          var tel = document.getElementById('s5-tel');
          if(tel) tel.placeholder = TEL_LOCAL[code]||'XX XX XX XX';
          closeTelPicker();
        });
        list.appendChild(li);
      });
    }

    sinp.addEventListener('input', function(){ renderTelList(this.value); });
    closeB.addEventListener('click', function(){ closeTelPicker(); });
    panel.addEventListener('click', function(e){ if(e.target===panel) closeTelPicker(); });

    panel.appendChild(hdr); panel.appendChild(sw); panel.appendChild(list);
    document.body.appendChild(panel);

    panel._renderList = renderTelList;
    return panel;
  }

  function openTelPicker(){
    var panel = document.getElementById('tel-picker-panel') || buildTelPicker();
    panel._renderList('');
    var scrollY = window.scrollY;
    document.body.style.position='fixed';
    document.body.style.top='-'+scrollY+'px';
    document.body.style.width='100%';
    panel._scrollY = scrollY;
    panel.classList.add('open');
    telPickerOpen = true;
  }

  function closeTelPicker(){
    var panel = document.getElementById('tel-picker-panel');
    if(panel){ panel.classList.remove('open'); }
    var sy = panel && panel._scrollY || 0;
    document.body.style.position='';
    document.body.style.top='';
    document.body.style.width='';
    window.scrollTo(0, sy);
    telPickerOpen = false;
  }

  function initTelPrefix(){
    var tel = document.getElementById('s5-tel');
    if(!tel || tel.dataset.pfxDone) return;
    tel.dataset.pfxDone = '1';
    var wrap = document.createElement('div');
    wrap.className = 'sp5-tel-wrap';
    tel.parentNode.insertBefore(wrap, tel);
    // Flag button (left) — contains flag + dial code + chevron
    var pfx = document.createElement('button');
    pfx.type = 'button';
    pfx.id = 's5-tel-pfx';
    pfx.className = 'sp5-tel-pfx';
    pfx.addEventListener('click', function(e){ e.stopPropagation(); openTelPicker(); });
    // Dial code span (inside the button)
    var dialSpan = document.createElement('span');
    dialSpan.id = 's5-tel-dial';
    dialSpan.className = 'sp5-tel-dial';
    dialSpan.textContent = DIAL_CODES[currentTelCountry]||'+33';
    // Separator (hidden via CSS but kept for structure)
    var sep = document.createElement('span');
    sep.className = 'sp5-tel-sep';
    wrap.appendChild(pfx);
    wrap.appendChild(tel);
    updateTelPfx(pfx, currentTelCountry);
    tel.classList.add('sp5-inp--tel');
    tel.placeholder = TEL_LOCAL[currentTelCountry]||'XX XX XX XX';
  }

  function updateTelPfx(btn, country){
    if(!btn) btn = document.getElementById('s5-tel-pfx');
    if(!btn) return;
    var flagUrl = 'https://hatscripts.github.io/circle-flags/flags/' + country.toLowerCase() + '.svg';
    var dial = DIAL_CODES[country]||'+33';
    btn.innerHTML =
      '<img class="sp5-tel-flag" src="'+flagUrl+'" alt="'+country+'">'
      +'<span class="sp5-tel-dial">'+dial+'</span>';
  }

  var BANK_EXAMPLES = {
    FR:'Ex : Crédit Agricole, BNP Paribas...',
    GB:'Ex : Barclays, HSBC, Lloyds...',
    DE:'Ex : Deutsche Bank, Commerzbank...',
    ES:'Ex : Santander, BBVA, CaixaBank...',
    IT:'Ex : Intesa Sanpaolo, UniCredit...',
    NL:'Ex : ING, ABN AMRO, Rabobank...',
    BE:'Ex : BNP Paribas Fortis, KBC...',
    PT:'Ex : Caixa Geral, Millennium BCP...',
    CH:'Ex : UBS, Credit Suisse, PostFinance...',
    AT:'Ex : Raiffeisen, Erste Bank, BAWAG...',
    PL:'Ex : PKO BP, Pekao, mBank...',
    SE:'Ex : Swedbank, SEB, Nordea...',
    DK:'Ex : Danske Bank, Nordea, Jyske Bank...',
    NO:'Ex : DNB, Nordea, SpareBank...',
    FI:'Ex : OP Financial, Nordea, Danske Bank...',
    IE:'Ex : AIB, Bank of Ireland, Ulster Bank...',
    GR:'Ex : National Bank, Piraeus Bank...',
    CZ:'Ex : Česká spořitelna, ČSOB, KB...',
    SK:'Ex : Slovenská sporiteľňa, VÚB...',
    HU:'Ex : OTP Bank, K&H, MKB...',
    RO:'Ex : BCR, BRD, Transilvania...',
    BG:'Ex : UniCredit Bulbank, DSK Bank...',
    HR:'Ex : Zagrebačka banka, Erste...',
    SI:'Ex : NLB, Nova KBM, SKB...',
    EE:'Ex : Swedbank, SEB, LHV...',
    LV:'Ex : Swedbank, SEB, Citadele...',
    LT:'Ex : Swedbank, SEB, Luminor...',
    LU:'Ex : BGL BNP Paribas, Spuerkeess...',
    MT:'Ex : Bank of Valletta, HSBC Malta...',
    CY:'Ex : Bank of Cyprus, Hellenic Bank...',
    RS:'Ex : Banca Intesa, UniCredit...',
    AL:'Ex : Raiffeisen Bank, BKT...',
    BA:'Ex : UniCredit, Raiffeisen, NLB...',
    ME:'Ex : CKB, NLB, Erste Bank...',
    MK:'Ex : Stopanska Banka, NLB...',
    UA:'Ex : PrivatBank, Oschadbank...',
    TR:'Ex : İş Bankası, Garanti BBVA, Ziraat...',
    IS:'Ex : Arion Bank, Landsbankinn...',
    LI:'Ex : LGT Bank, VP Bank...',
    MC:'Ex : CFM, BNP Paribas Monaco...'
  };

  function applyFormData(country) {
    var d = FORM_DATA[country] || FORM_DATA['FR'];
    currentTelCountry = country;
    window.currentTelCountry = country;
    var tel    = document.getElementById('s5-tel');
    var cp     = document.getElementById('s5-cp');
    var iban   = document.getElementById('s5-iban');
    var banque = document.getElementById('s5-banque');
    if(tel)    tel.placeholder = TEL_LOCAL[country] || d.tel;
    if(cp)     { cp.placeholder = d.cp; cp.maxLength = d.cpLen + 2; }
    if(iban)   iban.placeholder = d.ibanPfx;
    if(banque) banque.placeholder = BANK_EXAMPLES[country] || BANK_EXAMPLES['FR'];
    updateTelPfx(null, country);
  }

  document.addEventListener('DOMContentLoaded', function(){ initTelPrefix(); });
  document.addEventListener('click', function(){ setTimeout(initTelPrefix, 100); });

  function getPagePath() {
    var path = location.pathname;
    var m = path.match(/\/([a-z]{2})\//);
    var page = path.split('/').pop() || 'index.html';
    if(!page.endsWith('.html')) page = 'index.html';
    return { lang: m ? m[1] : 'fr', page: page, depth: m ? 1 : 0 };
  }

  var pageInfo = getPagePath();

  // Apply form data immediately based on current lang
  var langCountryDefault = { fr:'FR', en:'GB', de:'DE', es:'ES', it:'IT', nl:'NL', pl:'PL', sv:'SE' };
  applyFormData(langCountryDefault[pageInfo.lang] || 'FR');

  // Detect visitor country via IP (free, unlimited) — fallback to lang default
  fetch('https://ipwho.is/')
    .then(function(r){ return r.json(); })
    .then(function(data){
      var c = (data.country_code || '').toUpperCase();
      if(FORM_DATA[c] || TEL_LENGTH[c]) applyFormData(c);
      // Update city placeholder with detected city
      var city = data.city || '';
      if(city){
        var villeEl = document.getElementById('s5-ville');
        if(villeEl) villeEl.placeholder = city;
      }
    })
    .catch(function(){});

  // Detect language from browser for redirect
  var browserLang = (navigator.language || navigator.userLanguage || 'fr').toLowerCase().split('-');
  var browserLangCode = browserLang[0];
  var browserCountry = (browserLang[1] || '').toUpperCase();
  var LANG_MAP = {'fr':'fr','de':'de','es':'es','it':'it','nl':'nl','pl':'pl','sv':'sv','en':'en'};
  var detectedLang = LANG_MAP[browserLangCode] || null;
  if(browserCountry && COUNTRY_LANG[browserCountry]) detectedLang = COUNTRY_LANG[browserCountry];

  // Don't redirect if user already chose a language manually
  if(localStorage.getItem('lang_choice')) return;

  // Redirect immediately (no network needed — no flash)
  if(!detectedLang || detectedLang === pageInfo.lang) return;

      // Build target URL
  var pageMap = {
    'index.html':{'en':'index.html','de':'index.html','es':'index.html','it':'index.html','nl':'index.html','pl':'index.html','sv':'index.html'},
    'connexion.html':{'en':'login.html','de':'anmelden.html','es':'iniciar-sesion.html','it':'accedi.html','nl':'inloggen.html','pl':'logowanie.html','sv':'logga-in.html'},
    'inscription.html':{'en':'register.html','de':'registrieren.html','es':'registro.html','it':'registrazione.html','nl':'registreren.html','pl':'rejestracja.html','sv':'registrera.html'},
    'tarifs.html':{'en':'pricing.html','de':'preise.html','es':'tarifas.html','it':'tariffe.html','nl':'tarieven.html','pl':'cennik.html','sv':'priser.html'},
    'pret-personnel.html':{'en':'personal-loan.html','de':'privatkredit.html','es':'prestamo-personal.html','it':'prestito-personale.html','nl':'persoonlijke-lening.html','pl':'pozyczka-osobista.html','sv':'personligt-laan.html'},
    'credit-auto.html':{'en':'car-loan.html','de':'autokredit.html','es':'credito-auto.html','it':'credito-auto.html','nl':'autolening.html','pl':'kredyt-samochodowy.html','sv':'billaan.html'},
    'credit-renouvelable.html':{'en':'revolving-credit.html','de':'revolving-kredit.html','es':'credito-renovable.html','it':'credito-revolving.html','nl':'doorlopend-krediet.html','pl':'kredyt-odnawialny.html','sv':'roterande-kredit.html'},
    'rachat-de-credits.html':{'en':'debt-consolidation.html','de':'kreditabloesung.html','es':'reunion-de-deudas.html','it':'consolidamento-debiti.html','nl':'schuldenherfinanciering.html','pl':'konsolidacja-dlugow.html','sv':'skuldkonsolidering.html'},
    'assurances.html':{'en':'insurance.html','de':'versicherungen.html','es':'seguros.html','it':'assicurazioni.html','nl':'verzekeringen.html','pl':'ubezpieczenia.html','sv':'forsakringar.html'},
    'nous-contacter.html':{'en':'contact.html','de':'kontakt.html','es':'contacto.html','it':'contatti.html','nl':'contact.html','pl':'kontakt.html','sv':'kontakt.html'},
    'nous-decouvrir.html':{'en':'about-us.html','de':'ueber-uns.html','es':'sobre-nosotros.html','it':'chi-siamo.html','nl':'over-ons.html','pl':'o-nas.html','sv':'om-oss.html'}
  };

  var reverseMap = {};
  Object.keys(pageMap).forEach(function(fr){
    Object.keys(pageMap[fr]).forEach(function(lc){
      if(!reverseMap[lc]) reverseMap[lc] = {};
      reverseMap[lc][pageMap[fr][lc]] = fr;
    });
  });
  var frPage = (pageInfo.lang === 'fr') ? pageInfo.page
    : ((reverseMap[pageInfo.lang] && reverseMap[pageInfo.lang][pageInfo.page]) || pageInfo.page);

  var targetPage = (detectedLang === 'fr') ? frPage
    : ((pageMap[frPage] && pageMap[frPage][detectedLang]) || frPage);

  var targetUrl = (detectedLang === 'fr')
    ? (pageInfo.depth ? '../' + targetPage : targetPage)
    : (pageInfo.depth ? '../' + detectedLang + '/' + targetPage : detectedLang + '/' + targetPage);

  localStorage.setItem('lang_choice', detectedLang);
  window.location.replace(targetUrl);
})();

// ── Searchable nationality dropdown ──
(function(){
  var searchLabel = {fr:'Rechercher...',en:'Search...',de:'Suchen...',es:'Buscar...',it:'Cerca...',nl:'Zoeken...',pl:'Szukaj...',sv:'Sök...'};
  var otherLabel  = {fr:'Autre',en:'Other',de:'Andere',es:'Otro',it:'Altro',nl:'Andere',pl:'Inne',sv:'Annan'};
  var lang = (typeof LANG !== 'undefined' ? LANG : 'fr');

  // Circle-flags — drapeaux parfaitement ronds
  function flagUrl(code){
    if(!code || code==='AUTRE') return '';
    return 'https://hatscripts.github.io/circle-flags/flags/' + code.toLowerCase() + '.svg';
  }
  var GLOBE_SVG = '<svg class="nat-globe" width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z"/></svg>';

  function flagImg(code){
    if(!code || code==='AUTRE') return GLOBE_SVG;
    return '<img class="nat-flag" src="'+flagUrl(code)+'" alt="'+code+'" onerror="this.style.display=\'none\'">';
  }

  function initNatDropdown(){
    var sel = document.getElementById('s5-nat');
    if(!sel || sel.dataset.customized) return;
    sel.dataset.customized = '1';

    // Collect options (AUTRE already in HTML, don't add again)
    var opts = [];
    for(var i=0;i<sel.options.length;i++){
      var o = sel.options[i];
      if(o.value) opts.push({value:o.value, label:o.text});
    }

    // Hide native select
    sel.style.display='none';

    // Build custom widget
    var wrap = document.createElement('div');
    wrap.className='nat-wrap';

    var trigger = document.createElement('button');
    trigger.type='button';
    trigger.className='nat-trigger';
    trigger.innerHTML = '<span class="nat-trigger-label">'+(sel.options[0]?sel.options[0].text:'...')+'</span><svg class="nat-chev" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="#999" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';

    var titleLabel = {fr:'Choisir la nationalité',en:'Choose nationality',de:'Staatsangehörigkeit',es:'Elegir nacionalidad',it:'Scegli nazionalità',nl:'Kies nationaliteit',pl:'Wybierz narodowość',sv:'Välj nationalitet'};
    var searchPlLabel = {fr:'Rechercher un pays...',en:'Search a country...',de:'Land suchen...',es:'Buscar un país...',it:'Cerca un paese...',nl:'Zoek een land...',pl:'Szukaj kraju...',sv:'Sök ett land...'};

    var panel = document.createElement('div');
    panel.className='nat-panel';

    // Header
    var natHeader = document.createElement('div');
    natHeader.className='nat-header';
    var natCloseBtn = document.createElement('button');
    natCloseBtn.type='button';
    natCloseBtn.className='nat-close-btn';
    natCloseBtn.innerHTML='<svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 1l6 7 6-7" stroke="#555" stroke-width="2" stroke-linecap="round"/></svg>';
    var titleEl = document.createElement('span');
    titleEl.className='nat-title';
    titleEl.textContent = titleLabel[lang]||'Choose nationality';
    natHeader.appendChild(natCloseBtn);
    natHeader.appendChild(titleEl);

    // Search
    var searchWrap = document.createElement('div');
    searchWrap.className='nat-search-wrap';
    var searchBox = document.createElement('div');
    searchBox.className='nat-search-box';
    searchBox.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
    var searchInp = document.createElement('input');
    searchInp.type='text';
    searchInp.className='nat-search';
    searchInp.placeholder = searchPlLabel[lang]||'Search...';
    searchInp.autocomplete='off';
    searchBox.appendChild(searchInp);
    searchWrap.appendChild(searchBox);

    var list = document.createElement('ul');
    list.className='nat-list';

    var CHECK_SVG = '<svg class="nat-check" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#06c2b0" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    function renderList(filter){
      list.innerHTML='';
      var filtered = filter ? opts.filter(function(o){
        return o.label.toLowerCase().indexOf(filter.toLowerCase())>=0;
      }) : opts;
      filtered.forEach(function(o){
        var li = document.createElement('li');
        li.className='nat-item' + (o.value===sel.value?' nat-sel':'');
        li.dataset.value=o.value;
        li.innerHTML = flagImg(o.value)
          + '<span class="nat-item-label">'+o.label+'</span>'
          + (o.value===sel.value ? CHECK_SVG : '');
        li.addEventListener('click',function(e){
          e.stopPropagation();
          sel.value=o.value;
          trigger.innerHTML = (o.value?flagImg(o.value):'')
            + '<span class="nat-trigger-label">'+o.label+'</span>'
            + '<svg class="nat-chev" width="12" height="8" viewBox="0 0 12 8"><path d="M1 1l5 5 5-5" stroke="#999" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>';
          trigger.classList.toggle('nat-has-val',!!o.value);
          closePanel();
          sel.dispatchEvent(new Event('change'));
        });
        list.appendChild(li);
      });
    }

    var scrollY = 0;
    function preventScroll(e){
      if(list.contains(e.target)) return;
      e.preventDefault();
    }
    function openPanel(){
      searchInp.value='';
      renderList('');
      scrollY = window.scrollY;
      document.body.style.position='fixed';
      document.body.style.top='-'+scrollY+'px';
      document.body.style.width='100%';
      document.addEventListener('touchmove', preventScroll, {passive:false});
      panel.classList.add('open');
    }
    function closePanel(){
      panel.classList.remove('open');
      document.removeEventListener('touchmove', preventScroll);
      document.body.style.position='';
      document.body.style.top='';
      document.body.style.width='';
      window.scrollTo(0, scrollY);
    }

    trigger.addEventListener('click',function(e){
      e.stopPropagation();
      panel.classList.contains('open') ? closePanel() : openPanel();
    });

    panel.addEventListener('click',function(e){
      if(e.target===panel) closePanel();
    });

    natCloseBtn.addEventListener('click',function(){ closePanel(); });

    searchInp.addEventListener('input',function(){
      renderList(this.value);
    });

    panel.appendChild(natHeader);
    panel.appendChild(searchWrap);
    panel.appendChild(list);
    wrap.appendChild(trigger);
    document.body.appendChild(panel);
    sel.parentNode.insertBefore(wrap,sel);
  }

  // Init when simulator step 5a is shown
  document.addEventListener('DOMContentLoaded', function(){
    initNatDropdown();
  });
  // Also try after simulator opens
  document.addEventListener('click', function(){
    setTimeout(initNatDropdown, 100);
  });
})();
