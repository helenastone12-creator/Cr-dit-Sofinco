/* ── Fidexico 2FA — Google Authenticator TOTP (RFC 6238) ─────────────────── */
var FID2FA = (function(){
  var B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  function b32encode(arr){
    var s = '';
    for(var i = 0; i < arr.length; i += 5){
      var b = [arr[i]||0, arr[i+1]||0, arr[i+2]||0, arr[i+3]||0, arr[i+4]||0];
      s += B32[ b[0]>>3 ];
      s += B32[ ((b[0]&7)<<2)|(b[1]>>6) ];
      s += B32[ (b[1]>>1)&31 ];
      s += B32[ ((b[1]&1)<<4)|(b[2]>>4) ];
      s += B32[ ((b[2]&15)<<1)|(b[3]>>7) ];
      s += B32[ (b[3]>>2)&31 ];
      s += B32[ ((b[3]&3)<<3)|(b[4]>>5) ];
      s += B32[ b[4]&31 ];
    }
    return s;
  }

  function b32decode(s){
    s = s.replace(/=+$/,'').toUpperCase().replace(/[^A-Z2-7]/g,'');
    var bytes=[], buf=0, bits=0;
    for(var i=0; i<s.length; i++){
      buf=(buf<<5)|B32.indexOf(s[i]); bits+=5;
      if(bits>=8){ bytes.push((buf>>(bits-8))&255); bits-=8; }
    }
    return new Uint8Array(bytes);
  }

  function getOTP(secret, counter){
    return crypto.subtle.importKey('raw', b32decode(secret), {name:'HMAC',hash:'SHA-1'}, false, ['sign'])
      .then(function(key){
        var hi = Math.floor(counter / 0x100000000);
        var lo = counter >>> 0;
        var msg = new Uint8Array([
          (hi>>>24)&255,(hi>>>16)&255,(hi>>>8)&255,hi&255,
          (lo>>>24)&255,(lo>>>16)&255,(lo>>>8)&255,lo&255
        ]);
        return crypto.subtle.sign('HMAC', key, msg);
      })
      .then(function(sig){
        var arr = new Uint8Array(sig);
        var off = arr[19] & 0xf;
        var code = ((arr[off]&0x7f)<<24)|(arr[off+1]<<16)|(arr[off+2]<<8)|arr[off+3];
        return String(code % 1000000).padStart(6,'0');
      });
  }

  return {
    genSecret: function(){
      var arr = new Uint8Array(20);
      crypto.getRandomValues(arr);
      return b32encode(arr);
    },
    verify: function(secret, token){
      var c = Math.floor(Date.now()/30000);
      var checks = [getOTP(secret,c-1), getOTP(secret,c), getOTP(secret,c+1)];
      return Promise.all(checks).then(function(otps){
        return otps.indexOf(String(token).replace(/\s/g,'').padStart(6,'0')) !== -1;
      });
    },
    qrUrl: function(secret, email){
      var uri = 'otpauth://totp/Fidexico:'+encodeURIComponent(email)+'?secret='+secret+'&issuer=Fidexico';
      return 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data='+encodeURIComponent(uri);
    }
  };
})();
