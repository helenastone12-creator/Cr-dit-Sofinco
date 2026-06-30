/* ─── Fidexico Email System ───────────────────────────────────────────────── */

var FIDEXICO_CONFIG = {
  RESEND_KEY:     're_a9PWcLj8_CH2jpwVeWTLL6ks3Vf4VYuFU',
  SUPABASE_URL:   'https://kjabxuvybinrlnwkareu.supabase.co',
  SUPABASE_ANON:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJ4dXZ5Ymlucmxud2thcmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjEzNDMsImV4cCI6MjA5ODI5NzM0M30.VfMq-rUuh-eHil8nSk9oaU1yRWSKeKtQY8yrcoJi4_o',
  FROM_EMAIL:     'Fidexico <contact@fidexico.eu>',
  ADMIN_EMAIL:    'contact@fidexico.eu',
  SITE_URL:       'https://fidexico.eu'
};

/* ── Langue détectée ── */
function fidLang(){
  if(typeof EC_LANG !== 'undefined') return EC_LANG;
  if(typeof LANG !== 'undefined') return LANG;
  var l = (navigator.language||'fr').slice(0,2).toLowerCase();
  var supported = ['fr','en','de','es','it','nl','pl','sv'];
  return supported.indexOf(l) !== -1 ? l : 'fr';
}

/* ── Traductions ── */
var FID_T = {
  fr: {
    welcome_subject:    'Bienvenue sur Fidexico !',
    welcome_title:      'Bienvenue, {prenom} !',
    welcome_body:       'Votre espace client Fidexico est maintenant actif.',
    welcome_cta:        'Accéder à mon espace',
    welcome_warn:       'Si vous n\'êtes pas à l\'origine de cette inscription, contactez-nous immédiatement.',
    login_subject:      'Connexion à votre espace Fidexico',
    login_title:        'Nouvelle connexion détectée',
    login_body:         'Bonjour {prenom}, une connexion a été effectuée sur votre espace client.',
    login_warn:         'Si ce n\'était pas vous, sécurisez votre compte en contactant le support.',
    vir_out_subject:    'Confirmation de virement — {montant}',
    vir_out_title:      'Virement effectué',
    vir_out_body:       'Bonjour {prenom}, votre virement a été traité avec succès.',
    vir_in_subject:     'Virement reçu — +{montant}',
    vir_in_title:       'Virement reçu ✓',
    vir_in_body:        'Bonjour {prenom}, vous avez reçu un virement sur votre compte.',
    msg_subject:        'Nouveau message de Fidexico',
    msg_title:          'Nouveau message',
    msg_body:           'Bonjour {prenom}, vous avez reçu un nouveau message de votre conseiller Fidexico.',
    msg_cta:            'Lire le message',
    sim_subject:        'Simulation de crédit reçue',
    sim_title:          'Simulation reçue',
    sim_body:           'Bonjour {prenom}, nous avons bien reçu votre demande de simulation de crédit.',
    sim_delay:          'Notre équipe étudie votre dossier. Vous serez contacté sous <strong>24 à 48h ouvrées</strong>.',
    sim_cta:            'Suivre mon dossier',
    etude_subject:      'Votre dossier est en cours d\'étude',
    etude_title:        '📋 Dossier en cours d\'étude',
    etude_body:         'Bonjour {prenom}, votre dossier de crédit est actuellement en cours d\'analyse par notre équipe.',
    etude_delay:        'Nous vérifions l\'ensemble des informations de votre demande. Cette étape prend généralement <strong>24 à 72h ouvrées</strong>.',
    valide_subject:     '✅ Dossier validé — {montant} accordés',
    valide_title:       'Félicitations ! Dossier validé',
    valide_body:        'Bonjour {prenom}, votre demande de crédit a été <strong>approuvée</strong>.',
    valide_next:        'Votre conseiller vous contactera prochainement pour finaliser les démarches et procéder au déblocage des fonds.',
    refuse_subject:     'Suite donnée à votre dossier',
    refuse_title:       'Décision sur votre dossier',
    refuse_body:        'Bonjour {prenom}, nous avons étudié attentivement votre demande de crédit.',
    refuse_text:        'Après analyse, nous ne sommes malheureusement pas en mesure de donner une suite favorable à votre demande',
    refuse_reason:      ' pour la raison suivante : <strong>{motif}</strong>',
    refuse_retry:       'Vous pouvez nous contacter pour plus d\'informations ou soumettre une nouvelle demande dans 3 mois.',
    refuse_cta:         'Contacter le support',
    docs_subject:       'Documents requis pour votre dossier',
    docs_title:         'Documents requis',
    docs_body:          'Bonjour {prenom}, pour finaliser l\'étude de votre dossier, nous avons besoin des documents suivants :',
    docs_send:          'Merci de nous transmettre ces documents via votre espace client ou par email à',
    docs_cta:           'Envoyer les documents',
    debloc_subject:     '💳 Fonds débloqués — {montant}',
    debloc_title:       'Fonds débloqués',
    debloc_body:        'Bonjour {prenom}, vos fonds ont été crédités sur votre compte.',
    debloc_cta:         'Voir mon solde',
    rappel_subject:     'Suivi de votre dossier Fidexico',
    rappel_title:       'Suivi de votre dossier',
    rappel_body:        'Bonjour {prenom}, cela fait <strong>{jours} jours</strong> que votre dossier est en cours d\'étude.',
    rappel_text:        'Notre équipe travaille activement sur votre demande. Vous serez informé dès qu\'une décision sera prise.',
    reset_subject:      'Réinitialisation mot de passe Fidexico Admin',
    reset_title:        'Réinitialisation du mot de passe',
    reset_body:         'Une demande de réinitialisation du mot de passe administrateur a été effectuée.',
    reset_cta:          'Réinitialiser le mot de passe',
    reset_expire:       'Ce lien est valable <strong>1 heure</strong>. Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.',
    lbl_name:           'Nom',
    lbl_email:          'Email',
    lbl_date:           'Date',
    lbl_amount:         'Montant',
    lbl_amount_recv:    'Montant reçu',
    lbl_sender:         'Expéditeur',
    lbl_recipient:      'Destinataire',
    lbl_iban:           'IBAN',
    lbl_reason:         'Motif',
    lbl_ref:            'Référence',
    lbl_duration:       'Durée',
    lbl_monthly:        'Mensualité',
    lbl_granted:        'Montant accordé',
    footer:             'Cet email est automatique, ne pas répondre.',
    view_space:         'Voir mon espace',
    contact_support:    'Contacter le support'
  },
  en: {
    welcome_subject:    'Welcome to Fidexico!',
    welcome_title:      'Welcome, {prenom}!',
    welcome_body:       'Your Fidexico client area is now active.',
    welcome_cta:        'Access my account',
    welcome_warn:       'If you did not register, please contact us immediately.',
    login_subject:      'Login to your Fidexico account',
    login_title:        'New login detected',
    login_body:         'Hello {prenom}, a login was made to your client area.',
    login_warn:         'If this wasn\'t you, please secure your account by contacting support.',
    vir_out_subject:    'Transfer confirmation — {montant}',
    vir_out_title:      'Transfer completed',
    vir_out_body:       'Hello {prenom}, your transfer has been processed successfully.',
    vir_in_subject:     'Transfer received — +{montant}',
    vir_in_title:       'Transfer received ✓',
    vir_in_body:        'Hello {prenom}, you have received a transfer to your account.',
    msg_subject:        'New message from Fidexico',
    msg_title:          'New message',
    msg_body:           'Hello {prenom}, you have received a new message from your Fidexico advisor.',
    msg_cta:            'Read the message',
    sim_subject:        'Credit simulation received',
    sim_title:          'Simulation received',
    sim_body:           'Hello {prenom}, we have received your credit simulation request.',
    sim_delay:          'Our team is reviewing your file. You will be contacted within <strong>24 to 48 business hours</strong>.',
    sim_cta:            'Track my file',
    etude_subject:      'Your file is under review',
    etude_title:        '📋 File under review',
    etude_body:         'Hello {prenom}, your credit file is currently being analysed by our team.',
    etude_delay:        'We are verifying all information in your application. This step usually takes <strong>24 to 72 business hours</strong>.',
    valide_subject:     '✅ File approved — {montant} granted',
    valide_title:       'Congratulations! File approved',
    valide_body:        'Hello {prenom}, your credit application has been <strong>approved</strong>.',
    valide_next:        'Your advisor will contact you shortly to finalise the process and release the funds.',
    refuse_subject:     'Decision on your file',
    refuse_title:       'Decision on your file',
    refuse_body:        'Hello {prenom}, we have carefully reviewed your credit application.',
    refuse_text:        'After review, we are unfortunately unable to approve your application',
    refuse_reason:      ' for the following reason: <strong>{motif}</strong>',
    refuse_retry:       'You may contact us for more information or submit a new application in 3 months.',
    refuse_cta:         'Contact support',
    docs_subject:       'Documents required for your file',
    docs_title:         'Documents required',
    docs_body:          'Hello {prenom}, to complete the review of your file, we need the following documents:',
    docs_send:          'Please send these documents via your client area or by email to',
    docs_cta:           'Send documents',
    debloc_subject:     '💳 Funds released — {montant}',
    debloc_title:       'Funds released',
    debloc_body:        'Hello {prenom}, your funds have been credited to your account.',
    debloc_cta:         'View my balance',
    rappel_subject:     'Follow-up on your Fidexico file',
    rappel_title:       'File follow-up',
    rappel_body:        'Hello {prenom}, it has been <strong>{jours} days</strong> since your file was submitted.',
    rappel_text:        'Our team is actively working on your request. You will be informed as soon as a decision is made.',
    reset_subject:      'Fidexico Admin password reset',
    reset_title:        'Password reset',
    reset_body:         'A password reset request was made for the administrator account.',
    reset_cta:          'Reset password',
    reset_expire:       'This link is valid for <strong>1 hour</strong>. If you did not request this, please ignore this email.',
    lbl_name:           'Name',
    lbl_email:          'Email',
    lbl_date:           'Date',
    lbl_amount:         'Amount',
    lbl_amount_recv:    'Amount received',
    lbl_sender:         'Sender',
    lbl_recipient:      'Recipient',
    lbl_iban:           'IBAN',
    lbl_reason:         'Reference',
    lbl_ref:            'Reference',
    lbl_duration:       'Duration',
    lbl_monthly:        'Monthly payment',
    lbl_granted:        'Amount granted',
    footer:             'This is an automated email, please do not reply.',
    view_space:         'View my account',
    contact_support:    'Contact support'
  },
  de: {
    welcome_subject:    'Willkommen bei Fidexico!',
    welcome_title:      'Willkommen, {prenom}!',
    welcome_body:       'Ihr Fidexico-Kundenbereich ist jetzt aktiv.',
    welcome_cta:        'Mein Konto aufrufen',
    welcome_warn:       'Wenn Sie sich nicht registriert haben, kontaktieren Sie uns bitte sofort.',
    login_subject:      'Anmeldung bei Ihrem Fidexico-Konto',
    login_title:        'Neue Anmeldung erkannt',
    login_body:         'Hallo {prenom}, eine Anmeldung wurde in Ihrem Kundenbereich durchgeführt.',
    login_warn:         'Wenn das nicht Sie waren, sichern Sie Ihr Konto durch Kontakt zum Support.',
    vir_out_subject:    'Überweisungsbestätigung — {montant}',
    vir_out_title:      'Überweisung durchgeführt',
    vir_out_body:       'Hallo {prenom}, Ihre Überweisung wurde erfolgreich verarbeitet.',
    vir_in_subject:     'Überweisung erhalten — +{montant}',
    vir_in_title:       'Überweisung erhalten ✓',
    vir_in_body:        'Hallo {prenom}, Sie haben eine Überweisung auf Ihr Konto erhalten.',
    msg_subject:        'Neue Nachricht von Fidexico',
    msg_title:          'Neue Nachricht',
    msg_body:           'Hallo {prenom}, Sie haben eine neue Nachricht von Ihrem Fidexico-Berater erhalten.',
    msg_cta:            'Nachricht lesen',
    sim_subject:        'Kreditanfrage erhalten',
    sim_title:          'Anfrage erhalten',
    sim_body:           'Hallo {prenom}, wir haben Ihre Kreditanfrage erhalten.',
    sim_delay:          'Unser Team prüft Ihre Unterlagen. Sie werden innerhalb von <strong>24 bis 48 Geschäftsstunden</strong> kontaktiert.',
    sim_cta:            'Meine Anfrage verfolgen',
    etude_subject:      'Ihre Akte wird geprüft',
    etude_title:        '📋 Akte in Bearbeitung',
    etude_body:         'Hallo {prenom}, Ihre Kreditakte wird derzeit von unserem Team analysiert.',
    etude_delay:        'Wir überprüfen alle Angaben Ihres Antrags. Dieser Schritt dauert in der Regel <strong>24 bis 72 Geschäftsstunden</strong>.',
    valide_subject:     '✅ Akte genehmigt — {montant} bewilligt',
    valide_title:       'Herzlichen Glückwunsch! Akte genehmigt',
    valide_body:        'Hallo {prenom}, Ihr Kreditantrag wurde <strong>genehmigt</strong>.',
    valide_next:        'Ihr Berater wird sich in Kürze mit Ihnen in Verbindung setzen, um die Formalitäten abzuschließen.',
    refuse_subject:     'Entscheidung zu Ihrer Akte',
    refuse_title:       'Entscheidung zu Ihrer Akte',
    refuse_body:        'Hallo {prenom}, wir haben Ihren Kreditantrag sorgfältig geprüft.',
    refuse_text:        'Nach Prüfung können wir Ihrem Antrag leider nicht stattgeben',
    refuse_reason:      ' aus folgendem Grund: <strong>{motif}</strong>',
    refuse_retry:       'Sie können uns für weitere Informationen kontaktieren oder in 3 Monaten einen neuen Antrag stellen.',
    refuse_cta:         'Support kontaktieren',
    docs_subject:       'Erforderliche Dokumente für Ihre Akte',
    docs_title:         'Erforderliche Dokumente',
    docs_body:          'Hallo {prenom}, zur Prüfung Ihrer Akte benötigen wir folgende Dokumente:',
    docs_send:          'Bitte senden Sie diese Dokumente über Ihren Kundenbereich oder per E-Mail an',
    docs_cta:           'Dokumente senden',
    debloc_subject:     '💳 Mittel freigegeben — {montant}',
    debloc_title:       'Mittel freigegeben',
    debloc_body:        'Hallo {prenom}, Ihre Mittel wurden Ihrem Konto gutgeschrieben.',
    debloc_cta:         'Kontostand anzeigen',
    rappel_subject:     'Follow-up zu Ihrer Fidexico-Akte',
    rappel_title:       'Akte Follow-up',
    rappel_body:        'Hallo {prenom}, Ihre Akte ist seit <strong>{jours} Tagen</strong> in Bearbeitung.',
    rappel_text:        'Unser Team arbeitet aktiv an Ihrer Anfrage. Sie werden informiert, sobald eine Entscheidung getroffen wurde.',
    reset_subject:      'Fidexico Admin Passwort zurücksetzen',
    reset_title:        'Passwort zurücksetzen',
    reset_body:         'Eine Anfrage zum Zurücksetzen des Administrator-Passworts wurde gestellt.',
    reset_cta:          'Passwort zurücksetzen',
    reset_expire:       'Dieser Link ist <strong>1 Stunde</strong> gültig. Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.',
    lbl_name:           'Name',
    lbl_email:          'E-Mail',
    lbl_date:           'Datum',
    lbl_amount:         'Betrag',
    lbl_amount_recv:    'Erhaltener Betrag',
    lbl_sender:         'Absender',
    lbl_recipient:      'Empfänger',
    lbl_iban:           'IBAN',
    lbl_reason:         'Verwendungszweck',
    lbl_ref:            'Referenz',
    lbl_duration:       'Laufzeit',
    lbl_monthly:        'Monatliche Rate',
    lbl_granted:        'Bewilligter Betrag',
    footer:             'Diese E-Mail wurde automatisch generiert, bitte nicht antworten.',
    view_space:         'Mein Konto anzeigen',
    contact_support:    'Support kontaktieren'
  },
  es: {
    welcome_subject:    '¡Bienvenido a Fidexico!',
    welcome_title:      '¡Bienvenido, {prenom}!',
    welcome_body:       'Su área de cliente Fidexico ya está activa.',
    welcome_cta:        'Acceder a mi cuenta',
    welcome_warn:       'Si no se ha registrado, contáctenos de inmediato.',
    login_subject:      'Inicio de sesión en su cuenta Fidexico',
    login_title:        'Nuevo inicio de sesión detectado',
    login_body:         'Hola {prenom}, se ha iniciado sesión en su área de cliente.',
    login_warn:         'Si no fue usted, proteja su cuenta contactando al soporte.',
    vir_out_subject:    'Confirmación de transferencia — {montant}',
    vir_out_title:      'Transferencia realizada',
    vir_out_body:       'Hola {prenom}, su transferencia ha sido procesada con éxito.',
    vir_in_subject:     'Transferencia recibida — +{montant}',
    vir_in_title:       'Transferencia recibida ✓',
    vir_in_body:        'Hola {prenom}, ha recibido una transferencia en su cuenta.',
    msg_subject:        'Nuevo mensaje de Fidexico',
    msg_title:          'Nuevo mensaje',
    msg_body:           'Hola {prenom}, ha recibido un nuevo mensaje de su asesor Fidexico.',
    msg_cta:            'Leer el mensaje',
    sim_subject:        'Simulación de crédito recibida',
    sim_title:          'Simulación recibida',
    sim_body:           'Hola {prenom}, hemos recibido su solicitud de simulación de crédito.',
    sim_delay:          'Nuestro equipo está revisando su expediente. Será contactado en <strong>24 a 48 horas hábiles</strong>.',
    sim_cta:            'Seguir mi expediente',
    etude_subject:      'Su expediente está siendo revisado',
    etude_title:        '📋 Expediente en revisión',
    etude_body:         'Hola {prenom}, su expediente de crédito está siendo analizado por nuestro equipo.',
    etude_delay:        'Estamos verificando toda la información de su solicitud. Este paso suele tardar <strong>24 a 72 horas hábiles</strong>.',
    valide_subject:     '✅ Expediente aprobado — {montant} concedidos',
    valide_title:       '¡Felicidades! Expediente aprobado',
    valide_body:        'Hola {prenom}, su solicitud de crédito ha sido <strong>aprobada</strong>.',
    valide_next:        'Su asesor le contactará próximamente para finalizar los trámites y proceder al desbloqueo de los fondos.',
    refuse_subject:     'Decisión sobre su expediente',
    refuse_title:       'Decisión sobre su expediente',
    refuse_body:        'Hola {prenom}, hemos estudiado detenidamente su solicitud de crédito.',
    refuse_text:        'Tras el análisis, lamentablemente no podemos aprobar su solicitud',
    refuse_reason:      ' por el siguiente motivo: <strong>{motif}</strong>',
    refuse_retry:       'Puede contactarnos para más información o enviar una nueva solicitud en 3 meses.',
    refuse_cta:         'Contactar soporte',
    docs_subject:       'Documentos requeridos para su expediente',
    docs_title:         'Documentos requeridos',
    docs_body:          'Hola {prenom}, para finalizar el estudio de su expediente, necesitamos los siguientes documentos:',
    docs_send:          'Por favor envíenos estos documentos a través de su área de cliente o por email a',
    docs_cta:           'Enviar documentos',
    debloc_subject:     '💳 Fondos liberados — {montant}',
    debloc_title:       'Fondos liberados',
    debloc_body:        'Hola {prenom}, sus fondos han sido acreditados en su cuenta.',
    debloc_cta:         'Ver mi saldo',
    rappel_subject:     'Seguimiento de su expediente Fidexico',
    rappel_title:       'Seguimiento de su expediente',
    rappel_body:        'Hola {prenom}, han pasado <strong>{jours} días</strong> desde que su expediente está en revisión.',
    rappel_text:        'Nuestro equipo trabaja activamente en su solicitud. Será informado en cuanto se tome una decisión.',
    reset_subject:      'Restablecimiento de contraseña Fidexico Admin',
    reset_title:        'Restablecimiento de contraseña',
    reset_body:         'Se realizó una solicitud de restablecimiento de contraseña del administrador.',
    reset_cta:          'Restablecer contraseña',
    reset_expire:       'Este enlace es válido durante <strong>1 hora</strong>. Si no realizó esta solicitud, ignore este email.',
    lbl_name:           'Nombre',
    lbl_email:          'Email',
    lbl_date:           'Fecha',
    lbl_amount:         'Importe',
    lbl_amount_recv:    'Importe recibido',
    lbl_sender:         'Remitente',
    lbl_recipient:      'Destinatario',
    lbl_iban:           'IBAN',
    lbl_reason:         'Concepto',
    lbl_ref:            'Referencia',
    lbl_duration:       'Duración',
    lbl_monthly:        'Cuota mensual',
    lbl_granted:        'Importe concedido',
    footer:             'Este email es automático, no responder.',
    view_space:         'Ver mi cuenta',
    contact_support:    'Contactar soporte'
  },
  it: {
    welcome_subject:    'Benvenuto su Fidexico!',
    welcome_title:      'Benvenuto, {prenom}!',
    welcome_body:       'La tua area clienti Fidexico è ora attiva.',
    welcome_cta:        'Accedi al mio account',
    welcome_warn:       'Se non ti sei registrato, contattaci immediatamente.',
    login_subject:      'Accesso al tuo account Fidexico',
    login_title:        'Nuovo accesso rilevato',
    login_body:         'Ciao {prenom}, è stato effettuato un accesso alla tua area clienti.',
    login_warn:         'Se non eri tu, proteggi il tuo account contattando il supporto.',
    vir_out_subject:    'Conferma bonifico — {montant}',
    vir_out_title:      'Bonifico effettuato',
    vir_out_body:       'Ciao {prenom}, il tuo bonifico è stato elaborato con successo.',
    vir_in_subject:     'Bonifico ricevuto — +{montant}',
    vir_in_title:       'Bonifico ricevuto ✓',
    vir_in_body:        'Ciao {prenom}, hai ricevuto un bonifico sul tuo conto.',
    msg_subject:        'Nuovo messaggio da Fidexico',
    msg_title:          'Nuovo messaggio',
    msg_body:           'Ciao {prenom}, hai ricevuto un nuovo messaggio dal tuo consulente Fidexico.',
    msg_cta:            'Leggi il messaggio',
    sim_subject:        'Simulazione di credito ricevuta',
    sim_title:          'Simulazione ricevuta',
    sim_body:           'Ciao {prenom}, abbiamo ricevuto la tua richiesta di simulazione di credito.',
    sim_delay:          'Il nostro team sta analizzando la tua pratica. Sarai contattato entro <strong>24-48 ore lavorative</strong>.',
    sim_cta:            'Segui la mia pratica',
    etude_subject:      'La tua pratica è in fase di analisi',
    etude_title:        '📋 Pratica in analisi',
    etude_body:         'Ciao {prenom}, la tua pratica di credito è attualmente in fase di analisi da parte del nostro team.',
    etude_delay:        'Stiamo verificando tutte le informazioni della tua richiesta. Questo passaggio richiede generalmente <strong>24-72 ore lavorative</strong>.',
    valide_subject:     '✅ Pratica approvata — {montant} concessi',
    valide_title:       'Congratulazioni! Pratica approvata',
    valide_body:        'Ciao {prenom}, la tua richiesta di credito è stata <strong>approvata</strong>.',
    valide_next:        'Il tuo consulente ti contatterà a breve per finalizzare le procedure e procedere allo sblocco dei fondi.',
    refuse_subject:     'Decisione sulla tua pratica',
    refuse_title:       'Decisione sulla tua pratica',
    refuse_body:        'Ciao {prenom}, abbiamo esaminato attentamente la tua richiesta di credito.',
    refuse_text:        'Dopo l\'analisi, purtroppo non siamo in grado di accogliere la tua richiesta',
    refuse_reason:      ' per il seguente motivo: <strong>{motif}</strong>',
    refuse_retry:       'Puoi contattarci per ulteriori informazioni o inviare una nuova richiesta tra 3 mesi.',
    refuse_cta:         'Contatta il supporto',
    docs_subject:       'Documenti richiesti per la tua pratica',
    docs_title:         'Documenti richiesti',
    docs_body:          'Ciao {prenom}, per finalizzare l\'analisi della tua pratica, abbiamo bisogno dei seguenti documenti:',
    docs_send:          'Ti chiediamo di inviarci questi documenti tramite la tua area clienti o per email a',
    docs_cta:           'Invia documenti',
    debloc_subject:     '💳 Fondi sbloccati — {montant}',
    debloc_title:       'Fondi sbloccati',
    debloc_body:        'Ciao {prenom}, i tuoi fondi sono stati accreditati sul tuo conto.',
    debloc_cta:         'Vedi il mio saldo',
    rappel_subject:     'Aggiornamento sulla tua pratica Fidexico',
    rappel_title:       'Aggiornamento pratica',
    rappel_body:        'Ciao {prenom}, sono passati <strong>{jours} giorni</strong> da quando la tua pratica è in analisi.',
    rappel_text:        'Il nostro team sta lavorando attivamente sulla tua richiesta. Sarai informato non appena verrà presa una decisione.',
    reset_subject:      'Reset password Fidexico Admin',
    reset_title:        'Reset della password',
    reset_body:         'È stata effettuata una richiesta di reset della password amministratore.',
    reset_cta:          'Reimposta password',
    reset_expire:       'Questo link è valido per <strong>1 ora</strong>. Se non hai richiesto questo reset, ignora questa email.',
    lbl_name:           'Nome',
    lbl_email:          'Email',
    lbl_date:           'Data',
    lbl_amount:         'Importo',
    lbl_amount_recv:    'Importo ricevuto',
    lbl_sender:         'Mittente',
    lbl_recipient:      'Destinatario',
    lbl_iban:           'IBAN',
    lbl_reason:         'Causale',
    lbl_ref:            'Riferimento',
    lbl_duration:       'Durata',
    lbl_monthly:        'Rata mensile',
    lbl_granted:        'Importo concesso',
    footer:             'Questa email è automatica, non rispondere.',
    view_space:         'Visualizza il mio account',
    contact_support:    'Contatta il supporto'
  },
  nl: {
    welcome_subject:    'Welkom bij Fidexico!',
    welcome_title:      'Welkom, {prenom}!',
    welcome_body:       'Uw Fidexico-klantenruimte is nu actief.',
    welcome_cta:        'Toegang tot mijn account',
    welcome_warn:       'Als u zich niet heeft geregistreerd, neem dan onmiddellijk contact met ons op.',
    login_subject:      'Inloggen op uw Fidexico-account',
    login_title:        'Nieuwe inlog gedetecteerd',
    login_body:         'Hallo {prenom}, er is ingelogd op uw klantenruimte.',
    login_warn:         'Als u dit niet was, beveilig dan uw account door contact op te nemen met support.',
    vir_out_subject:    'Overboekingsbevestiging — {montant}',
    vir_out_title:      'Overboeking uitgevoerd',
    vir_out_body:       'Hallo {prenom}, uw overboeking is succesvol verwerkt.',
    vir_in_subject:     'Overboeking ontvangen — +{montant}',
    vir_in_title:       'Overboeking ontvangen ✓',
    vir_in_body:        'Hallo {prenom}, u heeft een overboeking op uw rekening ontvangen.',
    msg_subject:        'Nieuw bericht van Fidexico',
    msg_title:          'Nieuw bericht',
    msg_body:           'Hallo {prenom}, u heeft een nieuw bericht ontvangen van uw Fidexico-adviseur.',
    msg_cta:            'Bericht lezen',
    sim_subject:        'Kredietaanvraag ontvangen',
    sim_title:          'Aanvraag ontvangen',
    sim_body:           'Hallo {prenom}, wij hebben uw kredietaanvraag ontvangen.',
    sim_delay:          'Ons team beoordeelt uw dossier. U wordt binnen <strong>24 tot 48 werkuren</strong> gecontacteerd.',
    sim_cta:            'Mijn dossier volgen',
    etude_subject:      'Uw dossier wordt beoordeeld',
    etude_title:        '📋 Dossier in behandeling',
    etude_body:         'Hallo {prenom}, uw kredietdossier wordt momenteel geanalyseerd door ons team.',
    etude_delay:        'Wij verifiëren alle informatie van uw aanvraag. Deze stap duurt doorgaans <strong>24 tot 72 werkuren</strong>.',
    valide_subject:     '✅ Dossier goedgekeurd — {montant} toegekend',
    valide_title:       'Gefeliciteerd! Dossier goedgekeurd',
    valide_body:        'Hallo {prenom}, uw kredietaanvraag is <strong>goedgekeurd</strong>.',
    valide_next:        'Uw adviseur neemt binnenkort contact met u op om de procedure af te ronden en de fondsen vrij te geven.',
    refuse_subject:     'Beslissing over uw dossier',
    refuse_title:       'Beslissing over uw dossier',
    refuse_body:        'Hallo {prenom}, wij hebben uw kredietaanvraag zorgvuldig bestudeerd.',
    refuse_text:        'Na analyse zijn wij helaas niet in staat uw aanvraag goed te keuren',
    refuse_reason:      ' om de volgende reden: <strong>{motif}</strong>',
    refuse_retry:       'U kunt contact met ons opnemen voor meer informatie of over 3 maanden een nieuwe aanvraag indienen.',
    refuse_cta:         'Contact opnemen',
    docs_subject:       'Vereiste documenten voor uw dossier',
    docs_title:         'Vereiste documenten',
    docs_body:          'Hallo {prenom}, om de beoordeling van uw dossier te voltooien, hebben wij de volgende documenten nodig:',
    docs_send:          'Stuur deze documenten via uw klantenruimte of per e-mail naar',
    docs_cta:           'Documenten sturen',
    debloc_subject:     '💳 Fondsen vrijgegeven — {montant}',
    debloc_title:       'Fondsen vrijgegeven',
    debloc_body:        'Hallo {prenom}, uw fondsen zijn bijgeschreven op uw rekening.',
    debloc_cta:         'Mijn saldo bekijken',
    rappel_subject:     'Follow-up van uw Fidexico-dossier',
    rappel_title:       'Dossier follow-up',
    rappel_body:        'Hallo {prenom}, uw dossier is al <strong>{jours} dagen</strong> in behandeling.',
    rappel_text:        'Ons team werkt actief aan uw aanvraag. U wordt geïnformeerd zodra een beslissing is genomen.',
    reset_subject:      'Fidexico Admin wachtwoord reset',
    reset_title:        'Wachtwoord resetten',
    reset_body:         'Er is een verzoek ingediend om het beheerderswachtwoord te resetten.',
    reset_cta:          'Wachtwoord resetten',
    reset_expire:       'Deze link is <strong>1 uur</strong> geldig. Als u dit verzoek niet heeft ingediend, negeer dan deze e-mail.',
    lbl_name:           'Naam',
    lbl_email:          'E-mail',
    lbl_date:           'Datum',
    lbl_amount:         'Bedrag',
    lbl_amount_recv:    'Ontvangen bedrag',
    lbl_sender:         'Afzender',
    lbl_recipient:      'Ontvanger',
    lbl_iban:           'IBAN',
    lbl_reason:         'Omschrijving',
    lbl_ref:            'Referentie',
    lbl_duration:       'Looptijd',
    lbl_monthly:        'Maandlast',
    lbl_granted:        'Toegekend bedrag',
    footer:             'Deze e-mail is automatisch gegenereerd, niet beantwoorden.',
    view_space:         'Mijn account bekijken',
    contact_support:    'Contact opnemen'
  },
  pl: {
    welcome_subject:    'Witamy w Fidexico!',
    welcome_title:      'Witaj, {prenom}!',
    welcome_body:       'Twoja strefa klienta Fidexico jest teraz aktywna.',
    welcome_cta:        'Przejdź do konta',
    welcome_warn:       'Jeśli nie rejestrowałeś się, skontaktuj się z nami natychmiast.',
    login_subject:      'Logowanie do konta Fidexico',
    login_title:        'Wykryto nowe logowanie',
    login_body:         'Cześć {prenom}, zalogowano się do Twojej strefy klienta.',
    login_warn:         'Jeśli to nie byłeś Ty, zabezpiecz swoje konto kontaktując się z pomocą techniczną.',
    vir_out_subject:    'Potwierdzenie przelewu — {montant}',
    vir_out_title:      'Przelew wykonany',
    vir_out_body:       'Cześć {prenom}, Twój przelew został pomyślnie zrealizowany.',
    vir_in_subject:     'Przelew otrzymany — +{montant}',
    vir_in_title:       'Przelew otrzymany ✓',
    vir_in_body:        'Cześć {prenom}, otrzymałeś przelew na swoje konto.',
    msg_subject:        'Nowa wiadomość od Fidexico',
    msg_title:          'Nowa wiadomość',
    msg_body:           'Cześć {prenom}, otrzymałeś nową wiadomość od swojego doradcy Fidexico.',
    msg_cta:            'Przeczytaj wiadomość',
    sim_subject:        'Wniosek kredytowy otrzymany',
    sim_title:          'Wniosek otrzymany',
    sim_body:           'Cześć {prenom}, otrzymaliśmy Twój wniosek o symulację kredytu.',
    sim_delay:          'Nasz zespół analizuje Twoją dokumentację. Skontaktujemy się z Tobą w ciągu <strong>24-48 godzin roboczych</strong>.',
    sim_cta:            'Śledź swój wniosek',
    etude_subject:      'Twój wniosek jest rozpatrywany',
    etude_title:        '📋 Wniosek w trakcie rozpatrywania',
    etude_body:         'Cześć {prenom}, Twój wniosek kredytowy jest obecnie analizowany przez nasz zespół.',
    etude_delay:        'Weryfikujemy wszystkie informacje zawarte w Twoim wniosku. Ten etap zwykle trwa <strong>24-72 godziny robocze</strong>.',
    valide_subject:     '✅ Wniosek zatwierdzony — {montant} przyznane',
    valide_title:       'Gratulacje! Wniosek zatwierdzony',
    valide_body:        'Cześć {prenom}, Twój wniosek kredytowy został <strong>zatwierdzony</strong>.',
    valide_next:        'Twój doradca skontaktuje się z Tobą wkrótce, aby sfinalizować formalności i uruchomić środki.',
    refuse_subject:     'Decyzja w sprawie Twojego wniosku',
    refuse_title:       'Decyzja w sprawie Twojego wniosku',
    refuse_body:        'Cześć {prenom}, dokładnie przeanalizowaliśmy Twój wniosek kredytowy.',
    refuse_text:        'Po analizie niestety nie jesteśmy w stanie pozytywnie rozpatrzyć Twojego wniosku',
    refuse_reason:      ' z następującego powodu: <strong>{motif}</strong>',
    refuse_retry:       'Możesz się z nami skontaktować w celu uzyskania dodatkowych informacji lub złożyć nowy wniosek za 3 miesiące.',
    refuse_cta:         'Kontakt z pomocą',
    docs_subject:       'Wymagane dokumenty do Twojego wniosku',
    docs_title:         'Wymagane dokumenty',
    docs_body:          'Cześć {prenom}, w celu sfinalizowania analizy Twojego wniosku potrzebujemy następujących dokumentów:',
    docs_send:          'Prosimy o przesłanie tych dokumentów przez strefę klienta lub mailem na adres',
    docs_cta:           'Wyślij dokumenty',
    debloc_subject:     '💳 Środki odblokowane — {montant}',
    debloc_title:       'Środki odblokowane',
    debloc_body:        'Cześć {prenom}, Twoje środki zostały zaksięgowane na Twoim koncie.',
    debloc_cta:         'Zobacz saldo',
    rappel_subject:     'Aktualizacja statusu wniosku Fidexico',
    rappel_title:       'Aktualizacja wniosku',
    rappel_body:        'Cześć {prenom}, minęło już <strong>{jours} dni</strong> od złożenia Twojego wniosku.',
    rappel_text:        'Nasz zespół aktywnie pracuje nad Twoim wnioskiem. Zostaniesz poinformowany, gdy zostanie podjęta decyzja.',
    reset_subject:      'Reset hasła Fidexico Admin',
    reset_title:        'Reset hasła',
    reset_body:         'Złożono wniosek o reset hasła administratora.',
    reset_cta:          'Resetuj hasło',
    reset_expire:       'Ten link jest ważny przez <strong>1 godzinę</strong>. Jeśli nie składałeś tego wniosku, zignoruj tę wiadomość.',
    lbl_name:           'Imię i nazwisko',
    lbl_email:          'Email',
    lbl_date:           'Data',
    lbl_amount:         'Kwota',
    lbl_amount_recv:    'Otrzymana kwota',
    lbl_sender:         'Nadawca',
    lbl_recipient:      'Odbiorca',
    lbl_iban:           'IBAN',
    lbl_reason:         'Tytuł',
    lbl_ref:            'Numer referencyjny',
    lbl_duration:       'Okres',
    lbl_monthly:        'Rata miesięczna',
    lbl_granted:        'Przyznana kwota',
    footer:             'Ta wiadomość została wygenerowana automatycznie, prosimy nie odpowiadać.',
    view_space:         'Zobacz moje konto',
    contact_support:    'Kontakt z pomocą'
  },
  sv: {
    welcome_subject:    'Välkommen till Fidexico!',
    welcome_title:      'Välkommen, {prenom}!',
    welcome_body:       'Din Fidexico-kundzon är nu aktiv.',
    welcome_cta:        'Gå till mitt konto',
    welcome_warn:       'Om du inte registrerat dig, kontakta oss omedelbart.',
    login_subject:      'Inloggning på ditt Fidexico-konto',
    login_title:        'Ny inloggning registrerad',
    login_body:         'Hej {prenom}, en inloggning gjordes på ditt kundkonto.',
    login_warn:         'Om det inte var du, säkra ditt konto genom att kontakta support.',
    vir_out_subject:    'Överföringsbekräftelse — {montant}',
    vir_out_title:      'Överföring utförd',
    vir_out_body:       'Hej {prenom}, din överföring har behandlats framgångsrikt.',
    vir_in_subject:     'Överföring mottagen — +{montant}',
    vir_in_title:       'Överföring mottagen ✓',
    vir_in_body:        'Hej {prenom}, du har mottagit en överföring på ditt konto.',
    msg_subject:        'Nytt meddelande från Fidexico',
    msg_title:          'Nytt meddelande',
    msg_body:           'Hej {prenom}, du har fått ett nytt meddelande från din Fidexico-rådgivare.',
    msg_cta:            'Läs meddelandet',
    sim_subject:        'Kreditansökan mottagen',
    sim_title:          'Ansökan mottagen',
    sim_body:           'Hej {prenom}, vi har mottagit din kreditansökan.',
    sim_delay:          'Vårt team granskar ditt ärende. Du kommer att kontaktas inom <strong>24 till 48 arbetstimmar</strong>.',
    sim_cta:            'Följ mitt ärende',
    etude_subject:      'Ditt ärende granskas',
    etude_title:        '📋 Ärende under granskning',
    etude_body:         'Hej {prenom}, ditt kreditärende analyseras för närvarande av vårt team.',
    etude_delay:        'Vi verifierar all information i din ansökan. Detta steg tar vanligtvis <strong>24 till 72 arbetstimmar</strong>.',
    valide_subject:     '✅ Ärende godkänt — {montant} beviljat',
    valide_title:       'Grattis! Ärende godkänt',
    valide_body:        'Hej {prenom}, din kreditansökan har <strong>godkänts</strong>.',
    valide_next:        'Din rådgivare kontaktar dig snart för att slutföra processen och frigöra medlen.',
    refuse_subject:     'Beslut om ditt ärende',
    refuse_title:       'Beslut om ditt ärende',
    refuse_body:        'Hej {prenom}, vi har noggrant granskat din kreditansökan.',
    refuse_text:        'Efter granskning kan vi tyvärr inte bevilja din ansökan',
    refuse_reason:      ' av följande skäl: <strong>{motif}</strong>',
    refuse_retry:       'Du kan kontakta oss för mer information eller lämna in en ny ansökan om 3 månader.',
    refuse_cta:         'Kontakta support',
    docs_subject:       'Handlingar krävs för ditt ärende',
    docs_title:         'Handlingar krävs',
    docs_body:          'Hej {prenom}, för att slutföra granskningen av ditt ärende behöver vi följande handlingar:',
    docs_send:          'Vänligen skicka dessa handlingar via din kundzon eller via e-post till',
    docs_cta:           'Skicka handlingar',
    debloc_subject:     '💳 Medel frigjorda — {montant}',
    debloc_title:       'Medel frigjorda',
    debloc_body:        'Hej {prenom}, dina medel har krediterats på ditt konto.',
    debloc_cta:         'Se mitt saldo',
    rappel_subject:     'Uppföljning av ditt Fidexico-ärende',
    rappel_title:       'Ärendeuppföljning',
    rappel_body:        'Hej {prenom}, det har gått <strong>{jours} dagar</strong> sedan ditt ärende lämnades in.',
    rappel_text:        'Vårt team arbetar aktivt med din ansökan. Du informeras så snart ett beslut har fattats.',
    reset_subject:      'Fidexico Admin lösenordsåterställning',
    reset_title:        'Lösenordsåterställning',
    reset_body:         'En begäran om återställning av administratörslösenordet har gjorts.',
    reset_cta:          'Återställ lösenord',
    reset_expire:       'Den här länken är giltig i <strong>1 timme</strong>. Om du inte begärde detta, ignorera det här e-postmeddelandet.',
    lbl_name:           'Namn',
    lbl_email:          'E-post',
    lbl_date:           'Datum',
    lbl_amount:         'Belopp',
    lbl_amount_recv:    'Mottaget belopp',
    lbl_sender:         'Avsändare',
    lbl_recipient:      'Mottagare',
    lbl_iban:           'IBAN',
    lbl_reason:         'Meddelande',
    lbl_ref:            'Referens',
    lbl_duration:       'Löptid',
    lbl_monthly:        'Månadsbetalning',
    lbl_granted:        'Beviljat belopp',
    footer:             'Detta är ett automatiskt e-postmeddelande, svara inte.',
    view_space:         'Se mitt konto',
    contact_support:    'Kontakta support'
  }
};

function fidT(key, vars, lang){
  var l = lang || fidLang();
  var dict = FID_T[l] || FID_T['fr'];
  var str = dict[key] || FID_T['fr'][key] || key;
  if(vars) Object.keys(vars).forEach(function(k){ str = str.replace(new RegExp('\\{'+k+'\\}','g'), vars[k]); });
  return str;
}

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

/* ── Resend email sender (via PHP proxy to avoid CORS) ── */
function sendEmail(to, subject, html, lang){
  return fetch('/send-email.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FIDEXICO_CONFIG.FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject: subject,
      html: html
    })
  }).then(function(r){
      return r.json().then(function(d){ return {ok: r.ok, status: r.status, data: d}; });
    })
    .then(function(res){
      if(!res.ok){
        console.error('[Fidexico Email] Resend error '+res.status+':', JSON.stringify(res.data));
      } else {
        console.log('[Fidexico Email] Sent to', Array.isArray(to)?to[0]:to, '| id:', res.data.id);
      }
      return res.data;
    })
    .catch(function(e){ console.error('[Fidexico Email] Fetch failed:', e); });
}

/* ════════════════════════════════════════════════════════════
   BASE LAYOUT — style minimaliste (inspiré ChatGPT)
   ════════════════════════════════════════════════════════════ */
function emailBase(content, lang, opts){
  opts = opts || {};
  return '<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Fidexico</title></head>'
  +'<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif">'
  +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#ffffff;padding:40px 0 0">'
  +'<tr><td align="center">'
  +'<table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%">'

  /* ── LOGO ── */
  +'<tr><td style="padding:0 40px 40px;text-align:center">'
  +'<span style="font-family:Arial,sans-serif;font-size:26px;font-weight:900;letter-spacing:2px;color:#06c2b0">FIDEXICO</span>'
  +'</td></tr>'

  /* ── CORPS ── */
  +'<tr><td style="padding:0 40px 40px">'
  +content
  +'</td></tr>'

  /* ── AVERTISSEMENT SÉCURITÉ ── */
  +'<tr><td style="padding:0 0 16px">'
  +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffbe6;border:1px solid #f0d080;border-radius:10px">'
  +'<tr><td style="padding:14px 18px;font-family:Arial,sans-serif;font-size:12px;color:#555;line-height:1.6">'
  +'<strong style="color:#333">⚠ Avertissement de sécurité</strong> : Fidexico ne vous demandera jamais vos codes d\'accès, mots de passe ou informations bancaires complètes par email. En cas de doute, ne cliquez sur aucun lien et contactez-nous via notre formulaire.'
  +'</td></tr></table>'
  +'</td></tr>'

  /* ── FOOTER GRIS ── */
  +'<tr><td style="background:#f5f5f5;border-radius:16px;padding:32px 40px">'
  +'<p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:15px;font-weight:800;color:#000">FIDEXICO</p>'
  +'<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;color:#666;line-height:1.6">12 Rue de la Finance, 75008 Paris</p>'
  +'<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;color:#999;line-height:1.6">'
  +'Cet email a été envoyé à l\'adresse associée à votre espace client Fidexico. Il est strictement confidentiel et destiné uniquement à son destinataire. Toute utilisation, divulgation ou reproduction non autorisée est interdite.'
  +'</p>'
  +'<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:11px;color:#999;line-height:1.6">'
  +'Conformément au Règlement (UE) 2016/679 (RGPD), vous disposez d\'un droit d\'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, écrivez-nous à <a href="mailto:contact@fidexico.eu" style="color:#999">contact@fidexico.eu</a> ou via notre <a href="'+FIDEXICO_CONFIG.SITE_URL+'/nous-contacter.html" style="color:#999">formulaire de contact</a>.'
  +'</p>'
  +'<p style="margin:0;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#999">'
  +'<a href="'+FIDEXICO_CONFIG.SITE_URL+'/nous-contacter.html" style="color:#999;text-decoration:underline">Nous contacter</a>'
  +' &nbsp;·&nbsp; <a href="'+FIDEXICO_CONFIG.SITE_URL+'/politique-donnees.html" style="color:#999;text-decoration:underline">Politique de confidentialité</a>'
  +' &nbsp;·&nbsp; <a href="'+FIDEXICO_CONFIG.SITE_URL+'/mentions-legales.html" style="color:#999;text-decoration:underline">Mentions légales</a>'
  +'</p>'
  +'</td></tr>'

  +'<tr><td style="height:40px"></td></tr>'
  +'</table>'
  +'</td></tr></table>'
  +'</body></html>';
}

/* ── Helpers internes ── */
function _btn(label, url){
  return '<table cellpadding="0" cellspacing="0" border="0" style="margin:32px auto"><tr>'
    +'<td align="center" style="background:#e8e8e8;border-radius:50px">'
    +'<a href="'+url+'" style="display:inline-block;padding:14px 36px;font-family:Arial,sans-serif;font-size:15px;font-weight:600;color:#000;text-decoration:none">'+label+'</a>'
    +'</td></tr></table>';
}
function _tbl(rows){
  return '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:20px 0">'
    +rows.map(function(r,i){
      var border = i < rows.length-1 ? 'border-bottom:1px solid #e8e8e8' : '';
      return '<tr>'
        +'<td style="padding:12px 0;font-family:Arial,sans-serif;font-size:14px;color:#999;width:45%;'+border+'">'+r[0]+'</td>'
        +'<td style="padding:12px 0;font-family:Arial,sans-serif;font-size:14px;color:#000;font-weight:600;'+border+'">'+r[1]+'</td>'
        +'</tr>';
    }).join('')
    +'</table>';
}
function _section(title){
  return '<p style="margin:28px 0 8px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#999;letter-spacing:1px;text-transform:uppercase">'+title+'</p>';
}
function _divider(){
  return '<hr style="border:none;border-top:1px solid #e8e8e8;margin:24px 0">';
}
function _body(text){
  return '<p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.7">'+text+'</p>';
}
function _note(text){
  return '<p style="margin:24px 0 0;font-family:Arial,sans-serif;font-size:12px;color:#999;line-height:1.6">'+text+'</p>';
}
function _sign(){
  return '<p style="margin:32px 0 0;font-family:Arial,sans-serif;font-size:14px;color:#444;line-height:1.7">'
    +'Nous restons à votre disposition pour toute question.<br>'
    +'<strong style="color:#000">L\'équipe Fidexico</strong>'
    +'</p>';
}
function _alertBox(color, bgColor, title, text){
  return '<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0;background:#f5f5f5;border-radius:12px"><tr>'
    +'<td style="padding:16px 20px;font-family:Arial,sans-serif">'
    +'<p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#000">'+title+'</p>'
    +'<p style="margin:0;font-size:13px;color:#666;line-height:1.6">'+text+'</p>'
    +'</td></tr></table>';
}

/* ════════════════════════════════════════════════════════════
   TEMPLATES CLIENT
   ════════════════════════════════════════════════════════════ */

function emailBienvenue(prenom, nom, email, fdxNum, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Bienvenue chez Fidexico,<br>'+prenom+' !</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666;line-height:1.6">Votre espace client est maintenant actif.<br>Connectez-vous avec votre email et votre numéro de dossier.</p>'
    +_tbl([
      ['Titulaire', prenom+' '+nom],
      ['Email', email],
      ['Numéro de dossier', '<strong>'+fdxNum+'</strong>'],
      ['Date', new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})]
    ])
    +_alertBox('','','Conservez votre numéro de dossier','<strong>'+fdxNum+'</strong> — Ce numéro est indispensable pour vous connecter et contacter notre équipe.')
    +_btn('Accéder à mon espace client', FIDEXICO_CONFIG.SITE_URL+'/connexion.html')
    +_sign()
    +_note('Si vous n\'êtes pas à l\'origine de cette inscription, ignorez cet email ou <a href="'+FIDEXICO_CONFIG.SITE_URL+'/nous-contacter.html" style="color:#999">contactez-nous</a>.'),
  'fr', {ref:fdxNum});
}

function emailConnexion(prenom, date, lang){
  var ref = 'SEC-'+Date.now().toString(36).toUpperCase().slice(-8);
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Nouvelle connexion<br>sur votre compte</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', une connexion a été enregistrée sur votre espace.</p>'
    +_tbl([
      ['Date et heure', date],
      ['Statut', 'Authentification réussie'],
      ['Référence', ref]
    ])
    +_alertBox('','','Ce n\'était pas vous ?','Contactez-nous immédiatement via <a href="'+FIDEXICO_CONFIG.SITE_URL+'/nous-contacter.html" style="color:#000;font-weight:700">notre formulaire</a> pour sécuriser votre compte.')
    +_btn('Accéder à mon espace', FIDEXICO_CONFIG.SITE_URL+'/espace-client.html')
    +_note('Cet email est généré automatiquement à chaque connexion. Si c\'était vous, aucune action n\'est nécessaire.'),
  'fr', {ref:ref});
}

function emailVirementSortant(prenom, montant, destinataire, iban, motif, ref, date, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Votre virement<br>a été exécuté</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', votre virement a été traité avec succès.</p>'
    +_tbl([
      ['Montant débité', '− '+montant],
      ['Bénéficiaire', destinataire],
      ['IBAN', iban],
      motif ? ['Motif', motif] : null,
      ['Date', date],
      ['Référence', ref]
    ].filter(Boolean))
    +_alertBox('','','Vous n\'avez pas initié ce virement ?','Contactez-nous immédiatement — les virements sont irréversibles une fois traités.')
    +_btn('Consulter mon espace', FIDEXICO_CONFIG.SITE_URL+'/espace-client.html')
    +_sign()
    +_note('Conservez cet email comme justificatif. Réf. : '+ref),
  'fr', {ref:ref});
}

function emailVirementEntrant(prenom, montant, expediteur, ref, date, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Vous avez reçu<br>un virement</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', un virement a été crédité sur votre compte.</p>'
    +_tbl([
      ['Montant crédité', '+ '+montant],
      ['Expéditeur', expediteur],
      ['Date', date],
      ['Référence', ref]
    ])
    +_btn('Voir mon solde', FIDEXICO_CONFIG.SITE_URL+'/espace-client.html')
    +_sign(),
  'fr', {ref:ref});
}

function emailNouveauMessage(prenom, apercu, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Vous avez un nouveau<br>message</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', votre conseiller vous a envoyé un message.</p>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background:#f5f5f5;border-radius:12px"><tr>'
    +'<td style="padding:20px 24px;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.7;font-style:italic">"'+apercu+'..."</td>'
    +'</tr></table>'
    +_btn('Lire le message', FIDEXICO_CONFIG.SITE_URL+'/espace-client.html')
    +_sign(),
  'fr');
}

function emailSimulationSoumise(prenom, montant, duree, mensualite, lang){
  var ref = 'DOS-'+Date.now().toString(36).toUpperCase().slice(-8);
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Votre demande<br>a bien été reçue</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', votre dossier a été enregistré et transmis à notre équipe.</p>'
    +_tbl([
      ['Montant demandé', montant],
      ['Durée', duree],
      ['Mensualité estimée', mensualite],
      ['Référence dossier', ref],
      ['Date de dépôt', new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})]
    ])
    +_section('Prochaines étapes')
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:12px 0">'
    +[
      ['1','Analyse de votre dossier','Sous 24 à 48h ouvrées'],
      ['2','Contact par votre conseiller','Rendez-vous téléphonique'],
      ['3','Validation et signature','Contrat dématérialisé'],
      ['4','Déblocage des fonds','Virement sur votre compte']
    ].map(function(s){
      return '<tr><td width="36" valign="top" style="padding:10px 0">'
        +'<div style="width:28px;height:28px;background:#000;border-radius:50%;text-align:center;line-height:28px;font-family:Arial,sans-serif;font-size:12px;font-weight:700;color:#fff">'+s[0]+'</div>'
        +'</td><td style="padding:10px 0 10px 12px;font-family:Arial,sans-serif;border-bottom:1px solid #e8e8e8">'
        +'<p style="margin:0;font-size:14px;font-weight:700;color:#000">'+s[1]+'</p>'
        +'<p style="margin:2px 0 0;font-size:13px;color:#999">'+s[2]+'</p>'
        +'</td></tr>';
    }).join('')
    +'</table>'
    +_btn('Suivre mon dossier', FIDEXICO_CONFIG.SITE_URL+'/connexion.html')
    +_sign()
    +_note('Réf. dossier : '+ref+' · Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.'),
  'fr', {ref:ref});
}

function emailDossierEnEtude(prenom, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Votre dossier est<br>en cours d\'étude</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', notre équipe analyse votre dossier de financement.</p>'
    +_alertBox('','','Délai estimé','Notre comité de crédit vous répondra sous <strong>24 à 48 heures ouvrées</strong>. Aucune action n\'est requise de votre part.')
    +_btn('Consulter mon espace', FIDEXICO_CONFIG.SITE_URL+'/connexion.html')
    +_sign(),
  'fr');
}

function emailDossierValide(prenom, montant, duree, mensualite, lang){
  var ref = 'CTR-'+Date.now().toString(36).toUpperCase().slice(-8);
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Félicitations '+prenom+' !<br>Dossier validé</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Votre demande de financement a été approuvée par notre comité de crédit.</p>'
    +_tbl([
      ['Montant accordé', montant],
      ['Durée', duree],
      ['Mensualité', mensualite],
      ['Réf. contrat', ref],
      ['Date de décision', new Date().toLocaleDateString('fr-FR',{day:'2-digit',month:'long',year:'numeric'})]
    ])
    +_alertBox('','','Prochaine étape','Votre conseiller vous transmettra l\'offre de prêt pour signature. Vous disposez d\'un délai légal de réflexion de <strong>14 jours</strong>.')
    +_btn('Accéder à mon espace', FIDEXICO_CONFIG.SITE_URL+'/connexion.html')
    +_sign()
    +_note('Le déblocage des fonds interviendra après signature et expiration du délai de rétractation. Réf. : '+ref),
  'fr', {ref:ref});
}

function emailDossierRefuse(prenom, motif, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Suite donnée<br>à votre dossier</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', nous avons étudié attentivement votre demande de financement.</p>'
    +_body('Après analyse, nous ne sommes malheureusement pas en mesure de donner une suite favorable à votre demande.'+(motif ? ' Motif retenu : <em>'+motif+'</em>.' : ''))
    +_alertBox('','','Vos droits','Vous pouvez demander les raisons objectives de cette décision en nous contactant. Cette décision peut évoluer dans le temps.')
    +_btn('Contacter notre équipe', FIDEXICO_CONFIG.SITE_URL+'/nous-contacter.html')
    +_sign()
    +_note('Nos équipes restent disponibles pour explorer d\'autres solutions adaptées à votre situation.'),
  'fr');
}

function emailDocumentsRequis(prenom, liste, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Documents requis<br>pour votre dossier</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', pour finaliser votre dossier nous avons besoin des documents suivants :</p>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px">'
    +liste.map(function(d,i){
      var border = i < liste.length-1 ? 'border-bottom:1px solid #e8e8e8' : '';
      return '<tr><td width="36" valign="top" style="padding:12px 0;'+border+'">'
        +'<div style="width:26px;height:26px;background:#000;border-radius:50%;text-align:center;line-height:26px;font-family:Arial,sans-serif;font-size:11px;font-weight:700;color:#fff">'+(i+1)+'</div>'
        +'</td><td style="padding:12px 0 12px 12px;font-family:Arial,sans-serif;font-size:15px;color:#000;'+border+'">'+d+'</td></tr>';
    }).join('')
    +'</table>'
    +_alertBox('','','À noter','L\'instruction de votre dossier est suspendue dans l\'attente de ces pièces.')
    +_btn('Envoyer mes documents', FIDEXICO_CONFIG.SITE_URL+'/connexion.html')
    +_sign(),
  'fr');
}

function emailDeblocageFonds(prenom, montant, date, lang){
  var ref = 'DBL-'+Date.now().toString(36).toUpperCase().slice(-8);
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Vos fonds ont<br>été débloqués</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', le déblocage de vos fonds a été effectué.</p>'
    +_tbl([
      ['Montant débloqué', montant],
      ['Date de crédit', date],
      ['Référence', ref]
    ])
    +_alertBox('','','Rappel','Vos mensualités seront prélevées automatiquement selon votre contrat. En cas de difficulté, contactez-nous avant toute échéance.')
    +_btn('Consulter mon espace', FIDEXICO_CONFIG.SITE_URL+'/connexion.html')
    +_sign()
    +_note('Réf. : '+ref),
  'fr', {ref:ref});
}

function emailRappelSuivi(prenom, jours, lang){
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Point de situation<br>sur votre dossier</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', votre conseiller revient vers vous après '+jours+' jours.</p>'
    +_body('Votre dossier reste ouvert. Avez-vous pu rassembler les éléments nécessaires à la finalisation de votre demande ?')
    +_btn('Accéder à mon espace', FIDEXICO_CONFIG.SITE_URL+'/connexion.html')
    +_sign()
    +_note('Si vous ne souhaitez plus donner suite, <a href="'+FIDEXICO_CONFIG.SITE_URL+'/nous-contacter.html" style="color:#999">contactez-nous</a> et votre dossier sera classé sans suite.'),
  'fr');
}

function emailResetPassword(token){
  var link = FIDEXICO_CONFIG.SITE_URL + '/admin.html?reset=' + token;
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Réinitialisation<br>du mot de passe</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Une demande de réinitialisation du mot de passe administrateur a été effectuée.</p>'
    +_btn('Réinitialiser mon mot de passe', link)
    +_alertBox('','','Ce lien expire dans 1 heure','Pour des raisons de sécurité, ce lien n\'est valable qu\'une seule fois. Si vous n\'êtes pas à l\'origine de cette demande, ignorez cet email.')
    +_note('Lien : <span style="word-break:break-all;font-size:11px">'+link+'</span>'),
  'fr');
}

/* ════════════════════════════════════════════════════════════
   TEMPLATES ADMIN (toujours en français)
   ════════════════════════════════════════════════════════════ */

function emailAdminNouveauClient(prenom, nom, email){
  var date = new Date().toLocaleString('fr-FR');
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Nouveau client<br>inscrit</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Un nouveau client vient de soumettre une demande.</p>'
    +_tbl([
      ['Prénom', prenom],
      ['Nom', nom],
      ['Email', email],
      ['Date', date]
    ])
    +_btn('Voir dans l\'admin', FIDEXICO_CONFIG.SITE_URL+'/admin.html'),
  'fr');
}

function emailAdminNouveauVirement(clientNom, montant, destinataire){
  var date = new Date().toLocaleString('fr-FR');
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Nouveau virement<br>client</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Un client a initié un virement depuis son espace.</p>'
    +_tbl([
      ['Client', clientNom],
      ['Montant', montant],
      ['Bénéficiaire', destinataire],
      ['Date', date]
    ])
    +_btn('Voir dans l\'admin', FIDEXICO_CONFIG.SITE_URL+'/admin.html'),
  'fr');
}

function emailAdminNouveauMessage(clientNom, apercu){
  var date = new Date().toLocaleString('fr-FR');
  return emailBase(
    '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Nouveau message<br>client</h1>'
    +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">'+clientNom+' vous a envoyé un message.</p>'
    +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background:#f5f5f5;border-radius:12px"><tr>'
    +'<td style="padding:20px 24px;font-family:Arial,sans-serif;font-size:15px;color:#444;line-height:1.7;font-style:italic">"'+apercu+'..."</td>'
    +'</tr></table>'
    +_tbl([['Reçu le', date]])
    +_btn('Répondre dans l\'admin', FIDEXICO_CONFIG.SITE_URL+'/admin.html'),
  'fr');
}

/* ── Public API ── */
var FidEmail = {

  bienvenue: function(prenom, nom, email, fdxNum){
    var l = fidLang();
    return sendEmail(email, 'Finalisez votre inscription Fidexico', emailBienvenue(prenom, nom, email, fdxNum, l));
  },

  connexion: function(prenom, email){
    var l = fidLang();
    var now = new Date().toLocaleString(l==='fr'?'fr-FR':l==='de'?'de-DE':l==='es'?'es-ES':l==='it'?'it-IT':l==='nl'?'nl-NL':l==='pl'?'pl-PL':l==='sv'?'sv-SE':'en-GB');
    return sendEmail(email, fidT('login_subject',null,l), emailConnexion(prenom, now, l));
  },

  virementSortant: function(prenom, email, montant, destinataire, iban, motif, ref){
    var l = fidLang();
    var date = new Date().toLocaleDateString('fr-FR');
    return sendEmail(email, fidT('vir_out_subject',{montant:montant},l), emailVirementSortant(prenom, montant, destinataire, iban, motif, ref, date, l));
  },

  virementEntrant: function(prenom, email, montant, expediteur, ref){
    var l = fidLang();
    var date = new Date().toLocaleDateString('fr-FR');
    return sendEmail(email, fidT('vir_in_subject',{montant:montant},l), emailVirementEntrant(prenom, montant, expediteur, ref, date, l));
  },

  nouveauMessage: function(prenom, email, apercu){
    var l = fidLang();
    return sendEmail(email, fidT('msg_subject',null,l), emailNouveauMessage(prenom, apercu, l));
  },

  simulationSoumise: function(prenom, email, montant, duree, mensualite){
    var l = fidLang();
    return sendEmail(email, fidT('sim_subject',null,l), emailSimulationSoumise(prenom, montant, duree, mensualite, l));
  },

  dossierEnEtude: function(prenom, email){
    var l = fidLang();
    return sendEmail(email, fidT('etude_subject',null,l), emailDossierEnEtude(prenom, l));
  },

  dossierValide: function(prenom, email, montant, duree, mensualite){
    var l = fidLang();
    return sendEmail(email, fidT('valide_subject',{montant:montant},l), emailDossierValide(prenom, montant, duree, mensualite, l));
  },

  dossierRefuse: function(prenom, email, motif){
    var l = fidLang();
    return sendEmail(email, fidT('refuse_subject',null,l), emailDossierRefuse(prenom, motif||'', l));
  },

  documentsRequis: function(prenom, email, liste){
    var l = fidLang();
    return sendEmail(email, fidT('docs_subject',null,l), emailDocumentsRequis(prenom, liste, l));
  },

  deblocageFonds: function(prenom, email, montant){
    var l = fidLang();
    var date = new Date().toLocaleDateString('fr-FR');
    return sendEmail(email, fidT('debloc_subject',{montant:montant},l), emailDeblocageFonds(prenom, montant, date, l));
  },

  rappelSuivi: function(prenom, email, jours){
    var l = fidLang();
    return sendEmail(email, fidT('rappel_subject',null,l), emailRappelSuivi(prenom, jours, l));
  },

  adminNouveauClient: function(prenom, nom, email){
    return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, 'Nouveau client : '+prenom+' '+nom, emailAdminNouveauClient(prenom, nom, email));
  },

  adminNouveauVirement: function(clientNom, montant, destinataire){
    return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, 'Virement soumis — '+montant, emailAdminNouveauVirement(clientNom, montant, destinataire));
  },

  adminNouveauMessage: function(clientNom, apercu){
    return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, 'Message client — '+clientNom, emailAdminNouveauMessage(clientNom, apercu));
  },

  sendResetLink: function(){
    var token = ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, function(c){
      return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
    });
    var expires = new Date(Date.now() + 3600000).toISOString();
    return sbFetch('password_reset_tokens', 'POST', { token: token, expires_at: expires })
      .then(function(){
        return sendEmail(FIDEXICO_CONFIG.ADMIN_EMAIL, fidT('reset_subject',null,'fr'), emailResetPassword(token));
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
  },

  sendLoginOTP: function(email, prenom, code, fdxNum){
    var html = emailBase(
      '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Votre code<br>de connexion</h1>'
      +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', voici votre code à usage unique.</p>'
      +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px"><tr><td align="center">'
      +'<div style="background:#f5f5f5;border-radius:16px;padding:28px 40px;display:inline-block;text-align:center">'
      +'<div style="font-family:Courier New,monospace;font-size:44px;font-weight:900;color:#000;letter-spacing:.25em">'+code+'</div>'
      +'<div style="font-family:Arial,sans-serif;font-size:13px;color:#999;margin-top:10px">Code valable 10 minutes</div>'
      +'</div>'
      +'</td></tr></table>'
      +_tbl([
        ['Numéro de dossier', fdxNum],
        ['Email', email]
      ])
      +_alertBox('','','Important','Ce code est à usage unique. Ne le communiquez jamais à personne.')
      +_note('Si vous n\'avez pas demandé à vous connecter, ignorez cet email. Votre compte reste sécurisé.'),
    'fr', {ref: fdxNum});
    return sendEmail(email, 'Votre code de connexion Fidexico', html);
  },

  sendActivationOTP: function(email, prenom, code, fdxNum){
    var html = emailBase(
      '<h1 style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:36px;font-weight:900;color:#000;line-height:1.15;text-align:center">Votre code<br>de vérification</h1>'
      +'<p style="margin:0 0 32px;font-family:Arial,sans-serif;font-size:15px;color:#666">Bonjour '+prenom+', voici votre code pour activer votre espace client.</p>'
      +'<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 32px"><tr><td align="center">'
      +'<div style="background:#f5f5f5;border-radius:16px;padding:28px 40px;display:inline-block;text-align:center">'
      +'<div style="font-family:Courier New,monospace;font-size:44px;font-weight:900;color:#000;letter-spacing:.25em">'+code+'</div>'
      +'<div style="font-family:Arial,sans-serif;font-size:13px;color:#999;margin-top:10px">Code valable 10 minutes</div>'
      +'</div>'
      +'</td></tr></table>'
      +_tbl([
        ['Numéro de dossier', fdxNum],
        ['Email', email]
      ])
      +_alertBox('','','Important','Ce code est à usage unique. Ne le communiquez jamais à personne.')
      +_note('Si vous n\'avez pas demandé la création d\'un espace Fidexico, ignorez cet email.'),
    'fr', {ref: fdxNum});
    return sendEmail(email, 'Votre code de sécurité Fidexico', html);
  }
};
