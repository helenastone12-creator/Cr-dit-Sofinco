#!/usr/bin/env python3
"""Replace old sp5 HTML + update CSS + JS for 4-sub-step form."""
import os, re, glob

# ─────────────────────────────────────────────────────────────
# 1.  NEW SP5 HTML  (replaces old single-screen sp5 pane)
# ─────────────────────────────────────────────────────────────
NEW_SP5_HTML = '''<!-- ── Étape 5 : Formulaire multi-étapes ── -->
<div class="sim-pane" id="sp5">

  <!-- Barre de progression sp5 -->
  <div class="sp5-prog-bar">
    <div class="sp5-prog-step active" id="sp5p1">
      <div class="sp5-prog-dot"></div>
      <span>Identité</span>
    </div>
    <div class="sp5-prog-line"></div>
    <div class="sp5-prog-step" id="sp5p2">
      <div class="sp5-prog-dot"></div>
      <span>Situation</span>
    </div>
    <div class="sp5-prog-line"></div>
    <div class="sp5-prog-step" id="sp5p3">
      <div class="sp5-prog-dot"></div>
      <span>Coordonnées</span>
    </div>
    <div class="sp5-prog-line"></div>
    <div class="sp5-prog-step" id="sp5p4">
      <div class="sp5-prog-dot"></div>
      <span>Documents</span>
    </div>
  </div>

  <!-- ── 5A : Votre identité ── -->
  <div class="sp5-sub s5-show" id="sp5a">
    <h2 class="sp5-title">Votre identité</h2>

    <div class="sp5-field-group">
      <label class="sp5-lbl">Civilité <span class="sp5-req">*</span></label>
      <div class="sp5-civ-row">
        <button type="button" class="sp5-civ-btn active" id="sp5-civ-m" onclick="sp5Civ('M')">M.</button>
        <button type="button" class="sp5-civ-btn" id="sp5-civ-f" onclick="sp5Civ('Mme')">Mme</button>
      </div>
    </div>

    <div class="sp5-row2">
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-nom">Nom <span class="sp5-req">*</span></label>
        <input type="text" id="s5-nom" class="sp5-inp" placeholder="Votre nom" autocomplete="family-name"/>
        <span class="sp5-err" id="s5-nom-err">Champ requis</span>
      </div>
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-prenom">Prénom <span class="sp5-req">*</span></label>
        <input type="text" id="s5-prenom" class="sp5-inp" placeholder="Votre prénom" autocomplete="given-name"/>
        <span class="sp5-err" id="s5-prenom-err">Champ requis</span>
      </div>
    </div>

    <div class="sp5-row2">
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-ddn">Date de naissance <span class="sp5-req">*</span></label>
        <input type="date" id="s5-ddn" class="sp5-inp"/>
        <span class="sp5-err" id="s5-ddn-err">Champ requis</span>
      </div>
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-nat">Nationalité <span class="sp5-req">*</span></label>
        <select id="s5-nat" class="sp5-sel">
          <option value="" disabled selected>Choisir...</option>
          <option value="FR">Française</option>
          <option value="EU">Européenne</option>
          <option value="AUTRE">Autre</option>
        </select>
        <span class="sp5-err" id="s5-nat-err">Champ requis</span>
      </div>
    </div>

    <div class="sp5-row2">
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-sitfam">Situation familiale <span class="sp5-req">*</span></label>
        <select id="s5-sitfam" class="sp5-sel">
          <option value="" disabled selected>Choisir...</option>
          <option value="celibataire">Célibataire</option>
          <option value="marie">Marié(e)</option>
          <option value="pacse">Pacsé(e)</option>
          <option value="concubin">En concubinage</option>
          <option value="divorce">Divorcé(e)</option>
          <option value="veuf">Veuf/Veuve</option>
        </select>
        <span class="sp5-err" id="s5-sitfam-err">Champ requis</span>
      </div>
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-enfants">Nombre d'enfants à charge <span class="sp5-req">*</span></label>
        <select id="s5-enfants" class="sp5-sel">
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5+">5 ou plus</option>
        </select>
      </div>
    </div>

    <div class="sp5-nav">
      <div></div>
      <button type="button" class="sp5-cont-btn" onclick="sp5Go(2)">Continuer <span class="sp5-arr">›</span></button>
    </div>
  </div><!-- /sp5a -->

  <!-- ── 5B : Votre situation professionnelle ── -->
  <div class="sp5-sub" id="sp5b">
    <h2 class="sp5-title">Votre situation professionnelle</h2>

    <div class="sp5-2col">
      <div class="sp5-col-block">
        <div class="sp5-col-hd">SITUATION PROFESSIONNELLE</div>

        <div class="sp5-field-group">
          <label class="sp5-lbl" for="s5-sitpro">Situation <span class="sp5-req">*</span></label>
          <select id="s5-sitpro" class="sp5-sel">
            <option value="" disabled selected>Choisir...</option>
            <option value="cdi">Salarié(e) CDI</option>
            <option value="cdd">Salarié(e) CDD</option>
            <option value="independant">Travailleur indépendant</option>
            <option value="fonctionnaire">Fonctionnaire / Titulaire</option>
            <option value="interim">Intérimaire</option>
            <option value="retraite">Retraité(e)</option>
            <option value="sans">Sans emploi</option>
            <option value="autre">Autre</option>
          </select>
          <span class="sp5-err" id="s5-sitpro-err">Champ requis</span>
        </div>

        <div class="sp5-field-group">
          <label class="sp5-lbl" for="s5-secteur">Secteur d'activité <span class="sp5-req">*</span></label>
          <select id="s5-secteur" class="sp5-sel">
            <option value="" disabled selected>Choisir...</option>
            <option value="prive">Secteur privé</option>
            <option value="public">Secteur public</option>
            <option value="agricole">Agriculture</option>
            <option value="commerce">Commerce</option>
            <option value="industrie">Industrie</option>
            <option value="services">Services</option>
            <option value="autre">Autre</option>
          </select>
          <span class="sp5-err" id="s5-secteur-err">Champ requis</span>
        </div>

        <div class="sp5-field-group">
          <label class="sp5-lbl" for="s5-anciennete">Ancienneté dans l'emploi <span class="sp5-req">*</span></label>
          <select id="s5-anciennete" class="sp5-sel">
            <option value="" disabled selected>Choisir...</option>
            <option value="moins1">Moins d'1 an</option>
            <option value="1-3">1 à 3 ans</option>
            <option value="3-5">3 à 5 ans</option>
            <option value="plus5">Plus de 5 ans</option>
          </select>
          <span class="sp5-err" id="s5-anciennete-err">Champ requis</span>
        </div>
      </div>

      <div class="sp5-col-block">
        <div class="sp5-col-hd">SITUATION FINANCIÈRE</div>

        <div class="sp5-field-group">
          <label class="sp5-lbl" for="s5-revenus">Revenus mensuels nets (€) <span class="sp5-req">*</span></label>
          <input type="number" id="s5-revenus" class="sp5-inp" placeholder="Ex : 2 000" min="0"/>
          <span class="sp5-err" id="s5-revenus-err">Champ requis</span>
        </div>

        <div class="sp5-field-group">
          <label class="sp5-lbl" for="s5-autres-rev">Autres revenus mensuels (€)</label>
          <input type="number" id="s5-autres-rev" class="sp5-inp" placeholder="Ex : 500" min="0"/>
        </div>

        <div class="sp5-field-group">
          <label class="sp5-lbl" for="s5-charges">Charges mensuelles (€) <span class="sp5-req">*</span></label>
          <input type="number" id="s5-charges" class="sp5-inp" placeholder="Ex : 800" min="0"/>
          <span class="sp5-err" id="s5-charges-err">Champ requis</span>
        </div>
      </div>
    </div>

    <div class="sp5-nav">
      <button type="button" class="sp5-back-btn" onclick="sp5Go(1)"><span class="sp5-arr-l">‹</span> Retour</button>
      <button type="button" class="sp5-cont-btn" onclick="sp5Go(3)">Continuer <span class="sp5-arr">›</span></button>
    </div>
  </div><!-- /sp5b -->

  <!-- ── 5C : Vos coordonnées ── -->
  <div class="sp5-sub" id="sp5c">
    <h2 class="sp5-title">Vos coordonnées</h2>

    <div class="sp5-row2">
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-email">Email <span class="sp5-req">*</span></label>
        <input type="email" id="s5-email" class="sp5-inp" placeholder="votre@email.fr" autocomplete="email"/>
        <span class="sp5-err" id="s5-email-err">Email invalide</span>
      </div>
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-tel">Téléphone mobile <span class="sp5-req">*</span></label>
        <input type="tel" id="s5-tel" class="sp5-inp" placeholder="06 XX XX XX XX" autocomplete="tel"/>
        <span class="sp5-err" id="s5-tel-err">Numéro invalide</span>
      </div>
    </div>

    <div class="sp5-field-group">
      <label class="sp5-lbl" for="s5-adresse">Adresse <span class="sp5-req">*</span></label>
      <input type="text" id="s5-adresse" class="sp5-inp" placeholder="N° et nom de rue" autocomplete="street-address"/>
      <span class="sp5-err" id="s5-adresse-err">Champ requis</span>
    </div>

    <div class="sp5-row2">
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-cp">Code postal <span class="sp5-req">*</span></label>
        <input type="text" id="s5-cp" class="sp5-inp" placeholder="75001" maxlength="5" autocomplete="postal-code"/>
        <span class="sp5-err" id="s5-cp-err">Code postal invalide</span>
      </div>
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-ville">Ville <span class="sp5-req">*</span></label>
        <input type="text" id="s5-ville" class="sp5-inp" placeholder="Paris" autocomplete="address-level2"/>
        <span class="sp5-err" id="s5-ville-err">Champ requis</span>
      </div>
    </div>

    <div class="sp5-row2">
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-banque">Banque principale <span class="sp5-req">*</span></label>
        <select id="s5-banque" class="sp5-sel">
          <option value="" disabled selected>Choisir...</option>
          <option value="bnp">BNP Paribas</option>
          <option value="sg">Société Générale</option>
          <option value="ca">Crédit Agricole</option>
          <option value="lcl">LCL</option>
          <option value="ce">Caisse d'Épargne</option>
          <option value="bp">Banque Populaire</option>
          <option value="cm">Crédit Mutuel</option>
          <option value="hsbc">HSBC</option>
          <option value="bourso">Boursorama</option>
          <option value="autre">Autre</option>
        </select>
        <span class="sp5-err" id="s5-banque-err">Champ requis</span>
      </div>
      <div class="sp5-field-group">
        <label class="sp5-lbl" for="s5-iban">IBAN <span class="sp5-req">*</span></label>
        <input type="text" id="s5-iban" class="sp5-inp" placeholder="FR76 XXXX XXXX XXXX" autocomplete="off"/>
        <span class="sp5-err" id="s5-iban-err">IBAN invalide</span>
      </div>
    </div>

    <div class="sp5-consent-block">
      <label class="sp5-check-item">
        <input type="checkbox" id="s5-cg1"/>
        <span class="sp5-check-box"></span>
        <span class="sp5-check-txt">J'accepte que mes données personnelles soient traitées par Sofinco dans le cadre de ma demande de crédit. <a href="politique-donnees.html" target="_blank">En savoir plus</a></span>
      </label>
      <span class="sp5-err" id="s5-cg1-err">Consentement requis</span>

      <label class="sp5-check-item">
        <input type="checkbox" id="s5-cg2"/>
        <span class="sp5-check-box"></span>
        <span class="sp5-check-txt">J'accepte les <a href="cgu.html" target="_blank">Conditions Générales d'Utilisation</a> et la politique de confidentialité.</span>
      </label>
      <span class="sp5-err" id="s5-cg2-err">Consentement requis</span>

      <label class="sp5-check-item">
        <input type="checkbox" id="s5-cg3"/>
        <span class="sp5-check-box"></span>
        <span class="sp5-check-txt">J'accepte de recevoir des offres commerciales de la part de Sofinco et de ses partenaires. (Facultatif)</span>
      </label>
    </div>

    <div class="sp5-nav">
      <button type="button" class="sp5-back-btn" onclick="sp5Go(2)"><span class="sp5-arr-l">‹</span> Retour</button>
      <button type="button" class="sp5-cont-btn" onclick="sp5Go(4)">Continuer <span class="sp5-arr">›</span></button>
    </div>
  </div><!-- /sp5c -->

  <!-- ── 5D : Vos documents ── -->
  <div class="sp5-sub" id="sp5d">
    <h2 class="sp5-title">Vos documents</h2>

    <!-- Pièce d'identité -->
    <div class="sp5-doc-section">
      <div class="sp5-doc-sec-lbl">Pièce d'identité <span class="sp5-req">*</span></div>

      <div class="sp5-doc-tabs">
        <button type="button" class="sp5-doc-tab active" onclick="sp5DocTab('cni',this)">Carte nationale d'identité</button>
        <button type="button" class="sp5-doc-tab" onclick="sp5DocTab('passport',this)">Passeport</button>
        <button type="button" class="sp5-doc-tab" onclick="sp5DocTab('permis',this)">Permis de conduire</button>
      </div>

      <!-- CNI : recto + verso -->
      <div class="sp5-doc-panel" id="sp5-panel-cni">
        <div class="sp5-upload-grid">
          <div class="sp5-upload-item" id="sp5-up-cni-r">
            <div class="sp5-upload-ico">🪪</div>
            <div class="sp5-upload-lbl">Recto</div>
            <div class="sp5-upload-sub">JPG, PNG ou PDF – 5 Mo max</div>
            <button type="button" class="sp5-choisir" onclick="sp5PickFile('cni-r')">Choisir</button>
            <input type="file" id="f-cni-r" class="sp5-file-inp" accept="image/*,.pdf" onchange="sp5FileChosen('cni-r',this)"/>
          </div>
          <div class="sp5-upload-item" id="sp5-up-cni-v">
            <div class="sp5-upload-ico">🪪</div>
            <div class="sp5-upload-lbl">Verso</div>
            <div class="sp5-upload-sub">JPG, PNG ou PDF – 5 Mo max</div>
            <button type="button" class="sp5-choisir" onclick="sp5PickFile('cni-v')">Choisir</button>
            <input type="file" id="f-cni-v" class="sp5-file-inp" accept="image/*,.pdf" onchange="sp5FileChosen('cni-v',this)"/>
          </div>
        </div>
      </div>

      <!-- Passeport -->
      <div class="sp5-doc-panel sp5-doc-panel-hide" id="sp5-panel-passport">
        <div class="sp5-upload-item" id="sp5-up-passport">
          <div class="sp5-upload-ico">📘</div>
          <div class="sp5-upload-lbl">Page avec photo</div>
          <div class="sp5-upload-sub">JPG, PNG ou PDF – 5 Mo max</div>
          <button type="button" class="sp5-choisir" onclick="sp5PickFile('passport')">Choisir</button>
          <input type="file" id="f-passport" class="sp5-file-inp" accept="image/*,.pdf" onchange="sp5FileChosen('passport',this)"/>
        </div>
      </div>

      <!-- Permis -->
      <div class="sp5-doc-panel sp5-doc-panel-hide" id="sp5-panel-permis">
        <div class="sp5-upload-item" id="sp5-up-permis">
          <div class="sp5-upload-ico">🪪</div>
          <div class="sp5-upload-lbl">Recto du permis</div>
          <div class="sp5-upload-sub">JPG, PNG ou PDF – 5 Mo max</div>
          <button type="button" class="sp5-choisir" onclick="sp5PickFile('permis')">Choisir</button>
          <input type="file" id="f-permis" class="sp5-file-inp" accept="image/*,.pdf" onchange="sp5FileChosen('permis',this)"/>
        </div>
      </div>
      <span class="sp5-err" id="s5-id-err">Veuillez fournir votre pièce d'identité</span>
    </div>

    <!-- Justificatif de domicile -->
    <div class="sp5-doc-section">
      <div class="sp5-doc-sec-lbl">Justificatif de domicile <span class="sp5-req">*</span></div>
      <div class="sp5-upload-item" id="sp5-up-domicile">
        <div class="sp5-upload-ico">🏠</div>
        <div class="sp5-upload-lbl">Facture ou quittance (- 3 mois)</div>
        <div class="sp5-upload-sub">JPG, PNG ou PDF – 5 Mo max</div>
        <button type="button" class="sp5-choisir" onclick="sp5PickFile('domicile')">Choisir</button>
        <input type="file" id="f-domicile" class="sp5-file-inp" accept="image/*,.pdf" onchange="sp5FileChosen('domicile',this)"/>
      </div>
      <span class="sp5-err" id="s5-dom-err">Veuillez fournir un justificatif de domicile</span>
    </div>

    <!-- Justificatif de revenus -->
    <div class="sp5-doc-section">
      <div class="sp5-doc-sec-lbl">Justificatif de revenus <span class="sp5-req">*</span></div>
      <div class="sp5-upload-item" id="sp5-up-revenus">
        <div class="sp5-upload-ico">💶</div>
        <div class="sp5-upload-lbl">3 derniers bulletins de salaire</div>
        <div class="sp5-upload-sub">JPG, PNG ou PDF – 5 Mo max chacun</div>
        <button type="button" class="sp5-choisir" onclick="sp5PickFile('revenus-doc')">Choisir</button>
        <input type="file" id="f-revenus-doc" class="sp5-file-inp" accept="image/*,.pdf" multiple onchange="sp5FileChosen('revenus-doc',this)"/>
      </div>
      <span class="sp5-err" id="s5-rev-err">Veuillez fournir vos justificatifs de revenus</span>
    </div>

    <div class="sp5-nav">
      <button type="button" class="sp5-back-btn" onclick="sp5Go(3)"><span class="sp5-arr-l">‹</span> Retour</button>
      <button type="button" class="sp5-send-btn" onclick="sp5Submit()">Envoyer ma demande ✈</button>
    </div>
  </div><!-- /sp5d -->

</div><!-- /sp5 -->'''

# ─────────────────────────────────────────────────────────────
# 2.  CSS TO APPEND
# ─────────────────────────────────────────────────────────────
NEW_CSS = '''

/* ═══════════════════════════════════════════════
   SP5 — Formulaire multi-étapes (5A→5B→5C→5D)
════════════════════════════════════════════════*/

/* Hide bottombar on step 5 */
.sp5-active .sim-bottombar{ display:none !important; }

/* Sub-step visibility */
.sp5-sub{ display:none; }
.sp5-sub.s5-show{ display:block; }

/* ── Progress bar ── */
.sp5-prog-bar{
  display:flex;align-items:center;justify-content:center;
  gap:0;margin:0 0 1.6rem;padding-top:.2rem;
}
.sp5-prog-step{
  display:flex;flex-direction:column;align-items:center;gap:.35rem;
  min-width:64px;
}
.sp5-prog-dot{
  width:30px;height:30px;border-radius:50%;
  border:2.5px solid #ccc;background:#fff;
  transition:background .25s,border-color .25s;
}
.sp5-prog-step.active .sp5-prog-dot{
  background:var(--teal);border-color:var(--teal);
}
.sp5-prog-step.done .sp5-prog-dot{
  background:var(--teal-d);border-color:var(--teal-d);
}
.sp5-prog-step span{
  font-size:.68rem;font-weight:600;color:#aaa;text-align:center;
  transition:color .25s;
}
.sp5-prog-step.active span,.sp5-prog-step.done span{ color:var(--teal); }
.sp5-prog-line{
  flex:1;height:2px;background:#ccc;
  margin-bottom:1.1rem;max-width:40px;
  transition:background .25s;
}
.sp5-prog-line.done{ background:var(--teal-d); }

/* ── Title ── */
.sp5-title{
  font-size:1.25rem;font-weight:800;color:var(--navy);
  margin:0 0 1.2rem;
}

/* ── Labels & required star ── */
.sp5-lbl{
  display:block;font-size:.82rem;font-weight:700;
  color:var(--navy);margin-bottom:.35rem;
}
.sp5-req{ color:var(--teal);font-weight:800; }

/* ── Field group ── */
.sp5-field-group{ margin-bottom:1rem;position:relative; }

/* ── 2-column row ── */
.sp5-row2{ display:grid;grid-template-columns:1fr 1fr;gap:.9rem; }
@media(max-width:479px){
  .sp5-row2{ grid-template-columns:1fr; }
}

/* ── Civilité pills ── */
.sp5-civ-row{ display:flex;gap:.6rem;margin-top:.15rem; }
.sp5-civ-btn{
  flex:1;padding:.7rem 0;border-radius:2rem;border:2px solid #ddd;
  background:#fff;font-size:.95rem;font-weight:700;color:#666;
  cursor:pointer;transition:all .2s;font-family:inherit;
}
.sp5-civ-btn.active{
  border-color:var(--teal);background:var(--teal);color:#fff;
}

/* ── Inputs & selects ── */
.sp5-inp,.sp5-sel{
  width:100%;box-sizing:border-box;
  border:1.5px solid #ddd;border-radius:10px;
  padding:.72rem .9rem;font-size:.95rem;font-family:inherit;
  color:var(--navy);background:#fff;
  transition:border-color .2s;outline:none;
  -webkit-appearance:none;appearance:none;
}
.sp5-inp:focus,.sp5-sel:focus{ border-color:var(--teal); }
.sp5-inp.err,.sp5-sel.err{ border-color:#e74c3c; }
.sp5-sel{
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right .85rem center;
  padding-right:2.2rem;
}

/* ── Error text ── */
.sp5-err{
  display:none;font-size:.76rem;color:#e74c3c;
  margin-top:.3rem;font-weight:600;
}
.sp5-err.show{ display:block; }

/* ── 2-column professional layout (5B) ── */
.sp5-2col{
  display:grid;grid-template-columns:1fr 1fr;gap:1.2rem;
  margin-bottom:.5rem;
}
@media(max-width:600px){
  .sp5-2col{ grid-template-columns:1fr; }
}
.sp5-col-block{
  background:#f8f9fb;border-radius:14px;padding:1rem 1.1rem;
}
.sp5-col-hd{
  font-size:.72rem;font-weight:800;color:var(--teal);
  letter-spacing:.06em;margin-bottom:.9rem;
}

/* ── Consent checkboxes ── */
.sp5-consent-block{ margin:1rem 0; }
.sp5-check-item{
  display:flex;align-items:flex-start;gap:.7rem;
  margin-bottom:.6rem;cursor:pointer;
}
.sp5-check-item input[type="checkbox"]{
  display:none;
}
.sp5-check-box{
  width:20px;height:20px;min-width:20px;border-radius:5px;
  border:2px solid #ccc;background:#fff;margin-top:.1rem;
  transition:all .2s;position:relative;
}
.sp5-check-item input:checked + .sp5-check-box{
  background:var(--teal);border-color:var(--teal);
}
.sp5-check-item input:checked + .sp5-check-box::after{
  content:'✓';position:absolute;top:50%;left:50%;
  transform:translate(-50%,-55%);color:#fff;font-size:.75rem;font-weight:800;
}
.sp5-check-txt{
  font-size:.82rem;color:#555;line-height:1.5;
}
.sp5-check-txt a{ color:var(--teal);text-decoration:underline; }

/* ── Document section ── */
.sp5-doc-section{ margin-bottom:1.3rem; }
.sp5-doc-sec-lbl{
  font-size:.82rem;font-weight:700;color:var(--navy);margin-bottom:.6rem;
}

/* ── Doc tabs (CNI / Passeport / Permis) ── */
.sp5-doc-tabs{
  display:flex;gap:.4rem;margin-bottom:.9rem;
  border-bottom:2px solid #eee;padding-bottom:.5rem;
  flex-wrap:wrap;
}
.sp5-doc-tab{
  padding:.42rem .85rem;border-radius:2rem;border:1.5px solid #ddd;
  background:#fff;font-size:.8rem;font-weight:700;color:#666;
  cursor:pointer;transition:all .2s;font-family:inherit;white-space:nowrap;
}
.sp5-doc-tab.active{
  background:var(--navy);border-color:var(--navy);color:#fff;
}

/* ── Document panels ── */
.sp5-doc-panel{ }
.sp5-doc-panel-hide{ display:none; }

/* ── Upload grid (CNI recto+verso) ── */
.sp5-upload-grid{
  display:grid;grid-template-columns:1fr 1fr;gap:.8rem;
}
@media(max-width:420px){
  .sp5-upload-grid{ grid-template-columns:1fr; }
}

/* ── Upload item ── */
.sp5-upload-item{
  border:2px dashed #ddd;border-radius:14px;
  padding:1.1rem .8rem;text-align:center;
  background:#fafafa;transition:border-color .2s,background .2s;
}
.sp5-upload-item.has-file{
  border-color:var(--teal);background:#f0faf9;border-style:solid;
}
.sp5-upload-ico{ font-size:1.8rem;margin-bottom:.35rem; }
.sp5-upload-lbl{
  font-size:.85rem;font-weight:700;color:var(--navy);margin-bottom:.2rem;
}
.sp5-upload-sub{ font-size:.72rem;color:#888;margin-bottom:.65rem; }
.sp5-upload-name{
  font-size:.75rem;color:var(--teal);font-weight:600;
  margin-top:.3rem;word-break:break-all;
}

/* ── Choisir button ── */
.sp5-choisir{
  background:var(--navy);color:#fff;border:none;border-radius:2rem;
  padding:.5rem 1.1rem;font-size:.82rem;font-weight:700;
  font-family:inherit;cursor:pointer;transition:background .2s;
}
.sp5-choisir:hover{ background:var(--teal); }
.sp5-upload-item.has-file .sp5-choisir{
  background:var(--teal);
}

/* ── Hidden file input ── */
.sp5-file-inp{ display:none !important; }

/* ── Navigation buttons ── */
.sp5-nav{
  display:flex;align-items:center;justify-content:space-between;
  margin-top:1.4rem;padding-top:1rem;border-top:1px solid #eee;
  gap:.8rem;
}
.sp5-back-btn{
  padding:.75rem 1.3rem;border-radius:2rem;
  border:2px solid var(--navy);background:#fff;
  font-size:.9rem;font-weight:700;color:var(--navy);
  cursor:pointer;font-family:inherit;transition:all .2s;
  white-space:nowrap;
}
.sp5-back-btn:hover{ background:var(--navy);color:#fff; }
.sp5-cont-btn{
  padding:.78rem 1.6rem;border-radius:2rem;
  background:var(--teal);color:#fff;border:none;
  font-size:.9rem;font-weight:700;font-family:inherit;
  cursor:pointer;transition:background .2s;white-space:nowrap;
}
.sp5-cont-btn:hover{ background:var(--teal-d); }
.sp5-send-btn{
  padding:.82rem 1.6rem;border-radius:2rem;
  background:var(--teal);color:#fff;border:none;
  font-size:.95rem;font-weight:800;font-family:inherit;
  cursor:pointer;transition:background .2s;white-space:nowrap;
  letter-spacing:.01em;
}
.sp5-send-btn:hover{ background:var(--teal-d); }
.sp5-arr{ font-size:1.1rem; }
.sp5-arr-l{ font-size:1.1rem; }
'''

# ─────────────────────────────────────────────────────────────
# 3.  JS TO APPEND + showStep patch
# ─────────────────────────────────────────────────────────────
NEW_JS_FUNCTIONS = '''
/* ══════════════════════════════════════════
   SP5 — Formulaire multi-étapes
══════════════════════════════════════════ */
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
    var el = document.getElementById('sp5p'+i);
    if(!el) continue;
    el.classList.toggle('active', i===step);
    el.classList.toggle('done',   i<step);
  }
  var lines = document.querySelectorAll('.sp5-prog-line');
  lines.forEach(function(l,idx){
    l.classList.toggle('done', idx+1 < step);
  });
}

function sp5Validate(step){
  var ok = true;
  function req(id, errId){
    var el = document.getElementById(id);
    var er = document.getElementById(errId);
    if(!el) return;
    var empty = !el.value || !el.value.trim();
    el.classList.toggle('err', empty);
    if(er) er.classList.toggle('show', empty);
    if(empty) ok = false;
  }
  if(step===1){
    req('s5-nom','s5-nom-err');
    req('s5-prenom','s5-prenom-err');
    req('s5-ddn','s5-ddn-err');
    req('s5-nat','s5-nat-err');
    req('s5-sitfam','s5-sitfam-err');
  } else if(step===2){
    req('s5-sitpro','s5-sitpro-err');
    req('s5-secteur','s5-secteur-err');
    req('s5-anciennete','s5-anciennete-err');
    req('s5-revenus','s5-revenus-err');
    req('s5-charges','s5-charges-err');
  } else if(step===3){
    req('s5-adresse','s5-adresse-err');
    req('s5-cp','s5-cp-err');
    req('s5-ville','s5-ville-err');
    req('s5-banque','s5-banque-err');
    req('s5-iban','s5-iban-err');
    // email
    var em = document.getElementById('s5-email');
    var emEr = document.getElementById('s5-email-err');
    var emOk = em && /^[^@]+@[^@]+\\.[^@]+$/.test(em.value||'');
    if(em) em.classList.toggle('err', !emOk);
    if(emEr) emEr.classList.toggle('show', !emOk);
    if(!emOk) ok = false;
    // tel
    var tel = document.getElementById('s5-tel');
    var telEr = document.getElementById('s5-tel-err');
    var telOk = tel && /^[0-9 +()]{9,15}$/.test((tel.value||'').replace(/\\s/g,''));
    if(tel) tel.classList.toggle('err', !telOk);
    if(telEr) telEr.classList.toggle('show', !telOk);
    if(!telOk) ok = false;
    // consentements
    var c1 = document.getElementById('s5-cg1');
    var c1Er = document.getElementById('s5-cg1-err');
    if(c1 && !c1.checked){ if(c1Er) c1Er.classList.add('show'); ok=false; }
    else if(c1Er) c1Er.classList.remove('show');
    var c2 = document.getElementById('s5-cg2');
    var c2Er = document.getElementById('s5-cg2-err');
    if(c2 && !c2.checked){ if(c2Er) c2Er.classList.add('show'); ok=false; }
    else if(c2Er) c2Er.classList.remove('show');
  } else if(step===4){
    // Check at least one identity doc
    var hasId = false;
    if(sp5DocMode==='cni'){ hasId = !!(sp5Files['cni-r'] && sp5Files['cni-v']); }
    else if(sp5DocMode==='passport'){ hasId = !!sp5Files['passport']; }
    else if(sp5DocMode==='permis'){ hasId = !!sp5Files['permis']; }
    var idEr = document.getElementById('s5-id-err');
    if(idEr) idEr.classList.toggle('show', !hasId);
    if(!hasId) ok=false;
    // domicile
    var hasDom = !!sp5Files['domicile'];
    var domEr = document.getElementById('s5-dom-err');
    if(domEr) domEr.classList.toggle('show', !hasDom);
    if(!hasDom) ok=false;
    // revenus
    var hasRev = !!sp5Files['revenus-doc'];
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
  if(!sp5Validate(4)) return;
  // Hide sp5d, show confirmation
  document.querySelectorAll('.sp5-sub').forEach(function(s){s.classList.remove('s5-show');});
  var body = document.querySelector('.sim-body');
  var existing = document.querySelector('.sim-confirm');
  if(existing) existing.remove();
  var confirm = document.createElement('div');
  confirm.className = 'sim-pane s-show sim-confirm';
  confirm.innerHTML =
    '<div class="sim-confirm-ico"></div>'+
    '<p class="sim-confirm-title">Demande enregistrée !</p>'+
    '<p class="sim-confirm-msg">Un conseiller Sofinco vous contactera dans les plus brefs délais pour finaliser votre dossier.</p>';
  body.appendChild(confirm);
  document.getElementById('sim-page').scrollTop=0;
}
'''

# Patch for showStep — replace the n===5 block
OLD_SHOWSTEP_5_BLOCK = '''    if(n===3) renderResults();
  }'''

NEW_SHOWSTEP_5_BLOCK = '''    if(n===3) renderResults();
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
  }'''

# ─────────────────────────────────────────────────────────────
# 4.  RUN
# ─────────────────────────────────────────────────────────────
BASE = '/home/user/Cr-dit-Sofinco'

# — style.css —
with open(BASE+'/style.css','a',encoding='utf-8') as f:
    f.write(NEW_CSS)
print('✓ style.css updated')

# — script.js: patch showStep —
with open(BASE+'/script.js','r',encoding='utf-8') as f:
    js = f.read()

if OLD_SHOWSTEP_5_BLOCK in js:
    js = js.replace(OLD_SHOWSTEP_5_BLOCK, NEW_SHOWSTEP_5_BLOCK, 1)
    print('✓ showStep patched')
else:
    print('⚠ showStep patch NOT applied — pattern not found')

# Remove old step-5 click logic from sim-bb-next handler
OLD_S5_CLICK = '''    } else if(s===5){
      document.querySelectorAll('.sim-pane').forEach(function(p){p.classList.remove('s-show');});
      document.getElementById('sim-bb-next').style.display='none';
      document.getElementById('sim-bb-back').style.display='none';
      document.getElementById('sim-bb-prog').textContent='Demande envoyée !';
      var confirm=document.createElement('div');confirm.className='sim-pane s-show sim-confirm';
      confirm.innerHTML='<div class="sim-confirm-ico"></div><p class="sim-confirm-title">Demande enregistrée !</p><p class="sim-confirm-msg">Un conseiller Jkl.oin vous contactera dans les plus brefs délais pour finaliser votre dossier.</p>';
      document.querySelector('.sim-body').appendChild(confirm);
    }'''
if OLD_S5_CLICK in js:
    js = js.replace(OLD_S5_CLICK, '    }', 1)
    print('✓ old s===5 click block removed')
else:
    print('⚠ old s===5 click block not found (may already be removed)')

# Append new functions
js = js.rstrip() + '\n' + NEW_JS_FUNCTIONS + '\n'

with open(BASE+'/script.js','w',encoding='utf-8') as f:
    f.write(js)
print('✓ script.js updated')

# — HTML files: replace old sp5 pane —
# Old sp5 starts with the comment line and ends before </div><!-- /sim-body -->
HTML_FILES = glob.glob(BASE+'/*.html')

OLD_SP5_PATTERN = re.compile(
    r'<!-- ── Étape 5 : Formulaire de demande ── -->\s*'
    r'<div class="sim-pane" id="sp5">.*?</div>\s*(?=\s*</div><!-- /sim-body -->)',
    re.DOTALL
)

updated = 0
for path in HTML_FILES:
    with open(path,'r',encoding='utf-8') as f:
        html = f.read()
    new_html, count = OLD_SP5_PATTERN.subn(NEW_SP5_HTML, html)
    if count:
        with open(path,'w',encoding='utf-8') as f:
            f.write(new_html)
        updated += 1
        print('  ✓', os.path.basename(path))
    else:
        print('  – (no match)', os.path.basename(path))

print(f'\n✓ {updated}/{len(HTML_FILES)} HTML files updated')
