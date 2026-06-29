/* ─── Fidexico DB — Supabase data layer ─────────────────────────────────── */

var FID_SB_URL  = 'https://kjabxuvybinrlnwkareu.supabase.co';
var FID_SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqYWJ4dXZ5Ymlucmxud2thcmV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjEzNDMsImV4cCI6MjA5ODI5NzM0M30.VfMq-rUuh-eHil8nSk9oaU1yRWSKeKtQY8yrcoJi4_o';

function sbQ(path, method, body, extra){
  var headers = {
    'Content-Type': 'application/json',
    'apikey': FID_SB_ANON,
    'Authorization': 'Bearer ' + FID_SB_ANON,
    'Prefer': 'return=representation'
  };
  if(extra) Object.assign(headers, extra);
  return fetch(FID_SB_URL + '/rest/v1/' + path, {
    method: method || 'GET',
    headers: headers,
    body: body ? JSON.stringify(body) : undefined
  }).then(function(r){
    if(r.status === 204) return null;
    return r.json().then(function(d){
      if(!r.ok) console.error('[FidDB] '+method+' /'+path+' → '+r.status+':', JSON.stringify(d));
      return d;
    });
  }).catch(function(e){ console.error('[FidDB] fetch error on '+path+':', e); throw e; });
}

var FidDB = {

  /* ── Clients ── */

  getClientByEmail: function(email){
    return sbQ('clients?email=eq.'+encodeURIComponent(email.toLowerCase().trim())+'&select=*')
      .then(function(rows){ return (rows && rows[0]) ? rows[0] : null; });
  },

  getClientById: function(id){
    return sbQ('clients?id=eq.'+encodeURIComponent(id)+'&select=*')
      .then(function(rows){ return (rows && rows[0]) ? rows[0] : null; });
  },

  createClient: function(user){
    var row = {
      id:        user.id,
      prenom:    user.prenom||'',
      nom:       user.nom||'',
      email:     (user.email||'').toLowerCase().trim(),
      tel:       user.tel||'',
      ref:       user.ref||'',
      pwd:       user.pwd||'',
      civilite:  user.civilite||user.civility||'M',
      solde:     0,
      blocked:   false,
      loan:      user.loan||null,
      created_at: user.createdAt||new Date().toISOString()
    };
    return sbQ('clients', 'POST', row)
      .then(function(rows){ return rows && rows[0] ? rows[0] : row; });
  },

  updateClient: function(id, data){
    data.updated_at = new Date().toISOString();
    return sbQ('clients?id=eq.'+encodeURIComponent(id), 'PATCH', data);
  },

  getAllClients: function(){
    return sbQ('clients?select=*&order=created_at.desc');
  },

  deleteClient: function(id){
    return sbQ('clients?id=eq.'+encodeURIComponent(id), 'DELETE');
  },

  /* ── Solde ── */

  getSolde: function(clientId){
    return sbQ('clients?id=eq.'+encodeURIComponent(clientId)+'&select=solde')
      .then(function(rows){ return (rows && rows[0]) ? parseFloat(rows[0].solde)||0 : 0; });
  },

  setSolde: function(clientId, solde){
    return sbQ('clients?id=eq.'+encodeURIComponent(clientId), 'PATCH', { solde: solde, updated_at: new Date().toISOString() });
  },

  /* ── Transactions ── */

  getTx: function(clientId){
    return sbQ('transactions?client_id=eq.'+encodeURIComponent(clientId)+'&order=created_at.desc&select=*')
      .then(function(rows){ return rows||[]; });
  },

  addTx: function(clientId, tx){
    return sbQ('transactions', 'POST', {
      client_id: clientId,
      type:      tx.type||'credit',
      label:     tx.label||'',
      amt:       tx.amt||0,
      iban:      tx.iban||null,
      motif:     tx.motif||null,
      date:      tx.date||new Date().toLocaleDateString('fr-FR')
    });
  },

  /* ── Messages ── */

  getMessages: function(clientId){
    return sbQ('messages?client_id=eq.'+encodeURIComponent(clientId)+'&order=created_at.asc&select=*')
      .then(function(rows){ return rows||[]; });
  },

  addMessage: function(clientId, text, fromClient){
    return sbQ('messages', 'POST', {
      client_id:   clientId,
      text:        text,
      from_client: fromClient !== false
    });
  },

  getClientByIdAndEmail: function(id, email){
    return sbQ('clients?id=eq.'+encodeURIComponent(id)+'&email=eq.'+encodeURIComponent(email.toLowerCase().trim())+'&select=*')
      .then(function(rows){ return (rows && rows[0]) ? rows[0] : null; });
  },

  /* ── Login ── */

  login: function(email, pwd){
    return FidDB.getClientByEmail(email).then(function(client){
      if(!client) return null;
      if(client.pwd === null || client.pwd === undefined || client.status === 'pending') return {__pending: true};
      if(client.pwd !== pwd) return {__wrongpwd: true};
      return client;
    });
  },

  /* ── Sync localStorage → Supabase (migration) ── */

  syncFromLocalStorage: function(){
    var keys = Object.keys(localStorage).filter(function(k){ return k==='ec_user'||k.startsWith('ec_user_'); });
    var promises = keys.map(function(k){
      try{
        var u = JSON.parse(localStorage.getItem(k));
        if(!u || !u.id || !u.email) return Promise.resolve();
        return FidDB.getClientById(u.id).then(function(existing){
          if(existing) return Promise.resolve();
          return FidDB.createClient(u).then(function(){
            var txKey = k==='ec_user' ? 'ec_tx' : 'ec_tx_'+u.id;
            var soldeKey = k==='ec_user' ? 'ec_solde' : 'ec_solde_'+u.id;
            var msgKey = k==='ec_user' ? 'ec_messages' : 'ec_messages_'+u.id;
            var solde = parseFloat(localStorage.getItem(soldeKey))||0;
            var txArr = [];
            var msgArr = [];
            try{ txArr = JSON.parse(localStorage.getItem(txKey)||'[]'); }catch(e){}
            try{ msgArr = JSON.parse(localStorage.getItem(msgKey)||'[]'); }catch(e){}
            var p = FidDB.setSolde(u.id, solde);
            txArr.slice().reverse().forEach(function(tx){
              p = p.then(function(){ return FidDB.addTx(u.id, tx); });
            });
            msgArr.forEach(function(m){
              p = p.then(function(){ return FidDB.addMessage(u.id, m.text, m.fromClient); });
            });
            return p;
          });
        });
      }catch(e){ return Promise.resolve(); }
    });
    return Promise.all(promises);
  }

};
