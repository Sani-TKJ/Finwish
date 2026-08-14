/* FinWish v3 — UI/auth animations */
window.showAuth = function(mode) {
  const login = document.getElementById('loginPane');
  const register = document.getElementById('registerPane');
  const msg = document.getElementById('authMsg');
  if (!login || !register) return;
  login.classList.toggle('hidden', mode !== 'login');
  register.classList.toggle('hidden', mode !== 'register');
  if (msg) msg.textContent = '';
};
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('#loginPane button[onclick*="register"]');
  const back = document.querySelector('#registerPane button[onclick*="login"]');
  if (btn) btn.addEventListener('click', function(e) {
    e.preventDefault();
    window.showAuth('register');
  });
  if (back) back.addEventListener('click', function(e) {
    e.preventDefault();
    window.showAuth('login');
  });
});

window.showAuth = function(mode){
 const login=document.getElementById('loginPane'), reg=document.getElementById('registerPane'), msg=document.getElementById('authMsg');
 if(!login||!reg)return;
 login.classList.toggle('hidden',mode!=='login'); reg.classList.toggle('hidden',mode!=='register');
 if(msg){msg.textContent='';msg.className='auth-msg';}
};
window.setAuthMessage=function(text,type=''){
 const m=document.getElementById('authMsg'); if(!m)return;
 m.textContent=text; m.className='auth-msg '+type;
};
window.authLoading=function(which,on){
 const x=document.getElementById(which+'Loading'); if(x)x.classList.toggle('show',on);
};
window.authSuccess=function(){
 const x=document.getElementById('authSuccess'); if(!x)return;
 x.classList.add('show'); setTimeout(()=>x.classList.remove('show'),1200);
};