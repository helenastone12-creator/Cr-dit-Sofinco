/* ─── Fidexico Email System ───────────────────────────────────────────────── */

var FIDEXICO_CONFIG = {
  RESEND_KEY:     're_a9PWcLj8_CH2jpwVeWTLL6ks3Vf4VYuFU',
  SUPABASE_URL:   'https://kjabxuvybinrlnwkareu.supabase.co',
  SUPABASE_ANON:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJ4dXZ5Ymlucmxud2thcmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjEzNDMsImV4cCI6MjA5ODI5NzM0M30.VfMq-rUuh-eHil8nSk9oaU1yRWSKeKtQY8yrcoJi4_o',
  FROM_EMAIL:     'Fidexico <contact@fidexico.eu>',
  ADMIN_EMAIL:    'contact@fidexico.eu',
  SITE_URL:       'https://fidexico.eu'
};

/* ── Supabase REST helper ── */
function sbFetch(path, method, body){
  return fetch(FIDEXICO_CONFIG.SUPABASE_URL + '/rest/v1/' + path, {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'apikey': FIDEXICO_CONFIG.SUPABASE_ANON,
      'Authorization': 'Bearer ' + FIDEXICO_CONFIG.SUPABASE_ANON,
      'Prefer': 'return=representation'
    },
    body: body ? JSON.stringify(body) : undefined
  }).then(function(r){ return r.json(); });
}

/* ── Resend email sender ── */
function sendEmail(to, subject, html){
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + FIDEXICO_CONFIG.RESEND_KEY
    },
    body: JSON.stringify({
      from: FIDEXICO_CONFIG.FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html
    })
  }).then(function(r){ return r.json(); })
    .then(function(d){
      /* log in Supabase */
      sbFetch('email_logs', 'POST', {
        type: subject,
        recipient: Array.isArray(to) ? to[0] : to,
        subject: subject
      }).catch(function(){});
      return d;
    })
    .catch(function(e){ console.warn('Email error:', e); });
}

/* ── Email templates ── */
function emailBase(content){
  return '<div style="font-family:\'Segoe UI\',Arial,sans-serif;background:#f4f6f9;padding:40px 20px;min-height:100vh">'
    +'<div style="max-width:560px;margin:0 auto">'
    +'<div style="text-align:center;margin-bottom:28px">'
    +'<span style="font-size:1.7rem;font-weight:800;color:#0B5E8A">Fidexico</span>'
    +'</div>'
    +'<div style="background:#fff;border-radius:16px;padding:36px 32px;box-shadow:0 4px 24px rgba(0,0,0,.07)">'
    +content
    +'</div>'
    +'<p style="text-align:center;color:#aaa;font-size:.75rem;margin-top:24px">© 2026 Fidexico · fidexico.eu<br>Cet email est automatique, ne pas répondre.</p>'
    +'</div></div>';
}

function btnStyle(){ return 'display:inline-block;background:#0B5E8A;color:#fff;text-decoration:none;padding:13px 32px;border-radius:50px;font-weight:700;font-size:.95rem;margin:20px 0'; }
function dividerStyle(){ return 'border:none;border-top:1px solid #eee;margin:20px 0'; }
function rowStyle(){ return 'display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:.9rem'; }

/* 1. Bienvenue */
function emailBienvenue(prenom, nom, email){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Bienvenue, '+prenom+' !</h2>'
    +'<p style="color:#555;margin:0 0 20px">Votre espace client Fidexico est maintenant actif.</p>'
    +'<hr style="'+dividerStyle()+'">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Nom</span><strong>'+prenom+' '+nom+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Email</span><strong>'+email+'</strong></div>'
    +'<hr style="'+dividerStyle()+'">'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Accéder à mon espace</a>'
    +'<p style="color:#999;font-size:.82rem;margin:0">Si vous n\'êtes pas à l\'origine de cette inscription, contactez-nous immédiatement.</p>'
  );
}

/* 2. Connexion */
function emailConnexion(prenom, date){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Nouvelle connexion détectée</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', une connexion a été effectuée sur votre espace client.</p>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Date</span><strong>'+date+'</strong></div>'
    +'</div>'
    +'<p style="color:#999;font-size:.82rem">Si ce n\'était pas vous, sécurisez votre compte en contactant le support.</p>'
  );
}

/* 3. Virement sortant */
function emailVirementSortant(prenom, montant, destinataire, iban, motif, ref, date){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Virement effectué</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', votre virement a été traité avec succès.</p>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Montant</span><strong style="color:#0B5E8A;font-size:1.1rem">'+montant+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Destinataire</span><strong>'+destinataire+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">IBAN</span><strong style="font-family:monospace">'+iban+'</strong></div>'
    +(motif?'<div style="'+rowStyle()+'"><span style="color:#888">Motif</span><strong>'+motif+'</strong></div>':'')
    +'<div style="'+rowStyle()+'"><span style="color:#888">Référence</span><strong style="font-family:monospace">'+ref+'</strong></div>'
    +'<div style="'+rowStyle()+'border:none"><span style="color:#888">Date</span><strong>'+date+'</strong></div>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Voir mon espace</a>'
  );
}

/* 4. Virement entrant */
function emailVirementEntrant(prenom, montant, expediteur, ref, date){
  return emailBase(
    '<h2 style="color:#27ae60;margin:0 0 8px">Virement reçu ✓</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', vous avez reçu un virement sur votre compte.</p>'
    +'<div style="background:#f0faf4;border-radius:10px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #27ae60">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Montant reçu</span><strong style="color:#27ae60;font-size:1.1rem">+'+montant+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Expéditeur</span><strong>'+expediteur+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Référence</span><strong style="font-family:monospace">'+ref+'</strong></div>'
    +'<div style="'+rowStyle()+'border:none"><span style="color:#888">Date</span><strong>'+date+'</strong></div>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Voir mon solde</a>'
  );
}

/* 5. Nouveau message client */
function emailNouveauMessage(prenom, apercu){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Nouveau message</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', vous avez reçu un nouveau message de votre conseiller Fidexico.</p>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #B59A55">'
    +'<p style="margin:0;color:#333;font-style:italic">"'+apercu+'"</p>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Lire le message</a>'
  );
}

/* 6. Simulation soumise */
function emailSimulationSoumise(prenom, montant, duree, mensualite){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Simulation reçue</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', nous avons bien reçu votre demande de simulation de crédit.</p>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Montant demandé</span><strong>'+montant+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Durée</span><strong>'+duree+'</strong></div>'
    +'<div style="'+rowStyle()+'border:none"><span style="color:#888">Mensualité estimée</span><strong style="color:#0B5E8A">'+mensualite+'</strong></div>'
    +'</div>'
    +'<p style="color:#555">Notre équipe étudie votre dossier. Vous serez contacté sous <strong>24 à 48h ouvrées</strong>.</p>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Suivre mon dossier</a>'
  );
}

/* 7. Dossier en étude */
function emailDossierEnEtude(prenom){
  return emailBase(
    '<h2 style="color:#f39c12;margin:0 0 8px">📋 Dossier en cours d\'étude</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', votre dossier de crédit est actuellement en cours d\'analyse par notre équipe.</p>'
    +'<div style="background:#fffbf0;border-radius:10px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #f39c12">'
    +'<p style="margin:0;color:#666">Nous vérifions l\'ensemble des informations de votre demande. Cette étape prend généralement <strong>24 à 72h ouvrées</strong>.</p>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Voir mon espace</a>'
  );
}

/* 8. Dossier validé */
function emailDossierValide(prenom, montant, duree, mensualite){
  return emailBase(
    '<div style="text-align:center;margin-bottom:24px">'
    +'<div style="width:64px;height:64px;background:#27ae60;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2rem">✓</div>'
    +'</div>'
    +'<h2 style="color:#27ae60;margin:0 0 8px;text-align:center">Félicitations ! Dossier validé</h2>'
    +'<p style="color:#555;margin:0 0 20px;text-align:center">Bonjour '+prenom+', votre demande de crédit a été <strong>approuvée</strong>.</p>'
    +'<div style="background:#f0faf4;border-radius:10px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #27ae60">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Montant accordé</span><strong style="color:#27ae60;font-size:1.1rem">'+montant+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Durée</span><strong>'+duree+'</strong></div>'
    +'<div style="'+rowStyle()+'border:none"><span style="color:#888">Mensualité</span><strong>'+mensualite+'</strong></div>'
    +'</div>'
    +'<p style="color:#555">Votre conseiller vous contactera prochainement pour finaliser les démarches et procéder au déblocage des fonds.</p>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Accéder à mon espace</a>'
  );
}

/* 9. Dossier refusé */
function emailDossierRefuse(prenom, motif){
  return emailBase(
    '<h2 style="color:#e74c3c;margin:0 0 8px">Décision sur votre dossier</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', nous avons étudié attentivement votre demande de crédit.</p>'
    +'<div style="background:#fff5f5;border-radius:10px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #e74c3c">'
    +'<p style="margin:0;color:#666">Après analyse, nous ne sommes malheureusement pas en mesure de donner une suite favorable à votre demande'+(motif?' pour la raison suivante : <strong>'+motif+'</strong>':'')+'. </p>'
    +'</div>'
    +'<p style="color:#555">Vous pouvez nous contacter pour plus d\'informations ou soumettre une nouvelle demande dans 3 mois.</p>'
    +'<a href="mailto:'+FIDEXICO_CONFIG.ADMIN_EMAIL+'" style="'+btnStyle()+'">Contacter le support</a>'
  );
}

/* 10. Documents complémentaires */
function emailDocumentsRequis(prenom, liste){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Documents requis</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', pour finaliser l\'étude de votre dossier, nous avons besoin des documents suivants :</p>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px">'
    +'<ul style="margin:0;padding-left:20px;color:#333;line-height:2">'
    +liste.map(function(d){ return '<li>'+d+'</li>'; }).join('')
    +'</ul>'
    +'</div>'
    +'<p style="color:#555">Merci de nous transmettre ces documents via votre espace client ou par email à <a href="mailto:'+FIDEXICO_CONFIG.ADMIN_EMAIL+'">'+FIDEXICO_CONFIG.ADMIN_EMAIL+'</a>.</p>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Envoyer les documents</a>'
  );
}

/* 11. Déblocage des fonds */
function emailDeblocageFonds(prenom, montant, date){
  return emailBase(
    '<div style="text-align:center;margin-bottom:24px">'
    +'<div style="width:64px;height:64px;background:#0B5E8A;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:2rem">💳</div>'
    +'</div>'
    +'<h2 style="color:#0B5E8A;margin:0 0 8px;text-align:center">Fonds débloqués</h2>'
    +'<p style="color:#555;margin:0 0 20px;text-align:center">Bonjour '+prenom+', vos fonds ont été crédités sur votre compte.</p>'
    +'<div style="background:#f0f6fb;border-radius:10px;padding:16px 20px;margin-bottom:20px;border-left:4px solid #0B5E8A">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Montant crédité</span><strong style="color:#0B5E8A;font-size:1.1rem">'+montant+'</strong></div>'
    +'<div style="'+rowStyle()+'border:none"><span style="color:#888">Date</span><strong>'+date+'</strong></div>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Voir mon solde</a>'
  );
}

/* 12. Rappel de suivi (J+3, J+7) */
function emailRappelSuivi(prenom, jours){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Suivi de votre dossier</h2>'
    +'<p style="color:#555;margin:0 0 20px">Bonjour '+prenom+', cela fait <strong>'+jours+' jours</strong> que votre dossier est en cours d\'étude.</p>'
    +'<p style="color:#555;margin:0 0 20px">Notre équipe travaille activement sur votre demande. Vous serez informé dès qu\'une décision sera prise.</p>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/espace-client.html" style="'+btnStyle()+'">Voir mon espace</a>'
    +'<p style="color:#999;font-size:.82rem;margin-top:16px">Pour toute question urgente : <a href="mailto:'+FIDEXICO_CONFIG.ADMIN_EMAIL+'">'+FIDEXICO_CONFIG.ADMIN_EMAIL+'</a></p>'
  );
}

/* 13. Notification admin — nouveau client */
function emailAdminNouveauClient(prenom, nom, email){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">🆕 Nouveau client inscrit</h2>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Nom</span><strong>'+prenom+' '+nom+'</strong></div>'
    +'<div style="'+rowStyle()+'border:none"><span style="color:#888">Email</span><strong>'+email+'</strong></div>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/admin.html" style="'+btnStyle()+'">Voir le panel admin</a>'
  );
}

/* 14. Notification admin — nouveau virement */
function emailAdminNouveauVirement(clientNom, montant, destinataire){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">💸 Nouveau virement</h2>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Client</span><strong>'+clientNom+'</strong></div>'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Montant</span><strong>'+montant+'</strong></div>'
    +'<div style="'+rowStyle()+'border:none"><span style="color:#888">Destinataire</span><strong>'+destinataire+'</strong></div>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/admin.html" style="'+btnStyle()+'">Voir le panel admin</a>'
  );
}

/* 15. Notification admin — nouveau message */
function emailAdminNouveauMessage(clientNom, apercu){
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">✉️ Nouveau message client</h2>'
    +'<div style="background:#f8f9fa;border-radius:10px;padding:16px 20px;margin-bottom:20px">'
    +'<div style="'+rowStyle()+'"><span style="color:#888">Client</span><strong>'+clientNom+'</strong></div>'
    +'<div style="padding:10px 0;color:#555;font-style:italic">"'+apercu+'"</div>'
    +'</div>'
    +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/admin.html" style="'+btnStyle()+'">Répondre dans l\'admin</a>'
  );
}

/* 16. Réinitialisation mot de passe admin */
function emailResetPassword(token){
  var link = FIDEXICO_CONFIG.SITE_URL + '/admin.html?reset=' + token;
  return emailBase(
    '<h2 style="color:#0B5E8A;margin:0 0 8px">Réinitialisation du mot de passe</h2>'
    +'<p style="color:#555;margin:0 0 20px">Une demande de réinitialisation du mot de passe administrateur a été effectuée.</p>'
    +'<a href="'+link+'" style="'+btnStyle()+'">Réinitialiser le mot de passe</a>'
    +'<p style="color:#999;font-size:.82rem;margin-top:16px">Ce lien est valable <strong>1 heure</strong>. Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.</p>'
    +'<p style="color:#ccc;font-size:.75rem;word-break:break-all">'+link+'</p>'
  );
}

/* ── Public API ── */
var FidEmail = {

  bienvenue: function(prenom, nom, email){
    return sendEmail(email, 'Bienvenue sur Fidexico !', emailBienvenue(prenom, nom, email));
  },

  connexion: function(prenom, email){
    var now = new Date().toLocaleString('fr-FR');
    return sendEmail(email, 'Connexion à votre espace Fidexico', emailConnexion(prenom, now));
  },

  virementSortant: function(prenom, email, montant, destinataire, iban, motif, ref){
    var date = new Date().toLocaleDateString('fr-FR');
    return sendEmail(email, 'Confirmation de virement — ' + montant, emailVirementSortant(prenom, montant, destinataire, iban, motif, ref, date));
  },

  virementEntrant: function(prenom, email, montant, expediteur, ref){
    var date = new Date().toLocaleDateString('fr-FR');
    return sendEmail(email, 'Virement reçu — +' + montant, emailVirementEntrant(prenom, montant, expediteur, ref, date));
  },

  nouveauMessage: function(prenom, email, apercu){
    return sendEmail(email, 'Nouveau message de Fidexico', emailNouveauMessage(prenom, apercu));
  },

  simulationSoumise: function(prenom, email, montant, duree, mensualite){
    return sendEmail(email, 'Simulation de crédit reçue', emailSimulationSoumise(prenom, montant, duree, mensualite));
  },

  dossierEnEtude: function(prenom, email){
    return sendEmail(email, 'Votre dossier est en cours d\'étude', emailDossierEnEtude(prenom));
  },

  dossierValide: function(prenom, email, montant, duree, mensualite){
    return sendEmail(email, '✅ Dossier validé — ' + montant + ' accordés', emailDossierValide(prenom, montant, duree, mensualite));
  },

  dossierRefuse: function(prenom, email, motif){
    return sendEmail(email, 'Suite donnée à votre dossier', emailDossierRefuse(prenom, motif||''));
  },

  documentsRequis: function(prenom, email, liste){
    return sendEmail(email, 'Documents requis pour votre dossier', emailDocumentsRequis(prenom, liste));
  },

  deblocageFonds: function(prenom, email, montant){
    var date = new Date().toLocaleDateString('fr-FR');
    return sendEmail(email, '💳 Fonds débloqués — ' + montant, emailDeblocageFonds(prenom, montant, date));
  },

  rappelSuivi: function(prenom, email, jours){
    return sendEmail(email, 'Suivi de votre dossier Fidexico', emailRappelSuivi(prenom, jours));
  },

  /* Admin notifications */
  adminNouveauClient: function(prenom, nom, email){
    return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, 'Nouveau client : '+prenom+' '+nom, emailAdminNouveauClient(prenom, nom, email));
  },

  adminNouveauVirement: function(clientNom, montant, destinataire){
    return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, 'Virement soumis — '+montant, emailAdminNouveauVirement(clientNom, montant, destinataire));
  },

  adminNouveauMessage: function(clientNom, apercu){
    return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, 'Message client — '+clientNom, emailAdminNouveauMessage(clientNom, apercu));
  },

  /* Password reset */
  sendResetLink: function(){
    var token = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c){
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
    var expires = new Date(Date.now() + 3600000).toISOString();
    return sbFetch('password_reset_tokens', 'POST', { token: token, expires_at: expires })
      .then(function(){
        return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, 'Réinitialisation mot de passe Fidexico Admin', emailResetPassword(token));
      });
  },

  validateResetToken: function(token){
    return sbFetch('password_reset_tokens?token=eq.'+encodeURIComponent(token)+'&used=eq.false&select=id,expires_at')
      .then(function(rows){
        if(!rows || !rows[0]) return null;
        if(new Date(rows[0].expires_at) < new Date()) return null;
        return rows[0].id;
      });
  },

  consumeResetToken: function(id){
    return sbFetch('password_reset_tokens?id=eq.'+id, 'PATCH', { used: true });
  },

  getAdminPassword: function(){
    return sbFetch('admin_config?key=eq.admin_password&select=value')
      .then(function(rows){ return rows && rows[0] ? rows[0].value : 'Fidexico2026!'; });
  },

  setAdminPassword: function(newPwd){
    return sbFetch('admin_config?key=eq.admin_password', 'PATCH', { value: newPwd, updated_at: new Date().toISOString() });
  }
};
