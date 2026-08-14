/* FinWish v3 — Main application
   Supabase URL/key are kept in this file as in the previous version.
*/

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL='https://vrojyomvoadfxtwfcujb.supabase.co/';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyb2p5b212b2FkZnh0d2ZjdWpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2ODcyMTcsImV4cCI6MjEwMjI2MzIxN30.CWzEDu6fcP3plixuUC4IsC5ifPiH6DGYA_XVI1ZtvAg';
const cloudReady=!SUPABASE_URL.startsWith('GANTI_')&&!SUPABASE_ANON_KEY.startsWith('GANTI_');
const supabase=cloudReady?createClient(SUPABASE_URL,SUPABASE_ANON_KEY):null;
const LOCAL='finwish_local_v2';
let data=JSON.parse(localStorage.getItem(LOCAL)||'{"transactions":[],"wishlists":[],"goals":[]}'),user=null;
const $=id=>document.getElementById(id), money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(+n||0);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function msg(x){$('authMsg').textContent=x} function toast(x){$('toast').textContent=x;$('toast').style.display='block';setTimeout(()=>$('toast').style.display='none',1800)}
window.showAuth=m=>{
  $('loginPane').classList.toggle('hidden',m!=='login');
  $('registerPane').classList.toggle('hidden',m!=='register');
  $('phonePane').classList.toggle('hidden',m!=='phone');
  msg('');
};
window.openModal=id=>$(id).classList.add('show');window.closeModal=id=>$(id).classList.remove('show');
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active')});
const dateState={target:null,view:new Date(),selected:null};
const monthNames=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
function isoDate(d){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
function setDateDisplay(id){
  const val=$(id)?.value, text=$(id+'Text');
  if(text) text.textContent=val?prettyDate(val):'Pilih tanggal';
  const btn=$(id+'Picker');
  if(btn) btn.classList.toggle('selected',!!val);
}
function renderCalendar(){
  const d=dateState.view, y=d.getFullYear(), m=d.getMonth();
  $('calYear').textContent=y;
  $('calTitle').textContent=monthNames[m];
  $('calMonthLabel').textContent=`${monthNames[m]} ${y}`;
  const first=new Date(y,m,1), start=(first.getDay()+6)%7;
  const total=new Date(y,m+1,0).getDate();
  const prevTotal=new Date(y,m,0).getDate();
  let cells='';
  for(let i=0;i<42;i++){
    const day=i-start+1;
    let date, muted=false;
    if(day<1){date=new Date(y,m-1,prevTotal+day);muted=true}
    else if(day>total){date=new Date(y,m+1,day-total);muted=true}
    else date=new Date(y,m,day);
    const iso=isoDate(date);
    const today=iso===isoDate(new Date());
    const selected=iso===dateState.selected;
    cells+=`<button type="button" class="cal-day ${muted?'muted-day':''} ${today?'today':''} ${selected?'selected-day':''}" data-date="${iso}">${date.getDate()}</button>`;
  }
  $('calendarDays').innerHTML=cells;
  $('calendarDays').querySelectorAll('[data-date]').forEach(b=>b.onclick=()=>{
    dateState.selected=b.dataset.date;
    renderCalendar();
  });
}
window.openDatePicker=function(id){
  dateState.target=id;
  const current=$(id).value;
  dateState.selected=current||isoDate(new Date());
  const base=current?new Date(current+'T00:00:00'):new Date();
  dateState.view=new Date(base.getFullYear(),base.getMonth(),1);
  renderCalendar();
  $('calendarModal').classList.add('show');
};
$('calPrev').onclick=()=>{dateState.view=new Date(dateState.view.getFullYear(),dateState.view.getMonth()-1,1);renderCalendar()};
$('calNext').onclick=()=>{dateState.view=new Date(dateState.view.getFullYear(),dateState.view.getMonth()+1,1);renderCalendar()};
$('calToday').onclick=()=>{dateState.selected=isoDate(new Date());dateState.view=new Date(new Date().getFullYear(),new Date().getMonth(),1);renderCalendar()};
$('calClear').onclick=()=>{if(dateState.target){$(dateState.target).value='';setDateDisplay(dateState.target)}closeModal('calendarModal')};
$('calDone').onclick=()=>{if(dateState.target){$(dateState.target).value=dateState.selected;setDateDisplay(dateState.target)}closeModal('calendarModal')};
$('tDatePicker').onclick=()=>openDatePicker('tDate');
$('gDatePicker').onclick=()=>openDatePicker('gDate');
function setStatus(){ $('status').textContent=navigator.onLine?'● Online':'● Offline — tersimpan di HP' } window.addEventListener('online',()=>{setStatus();sync()});window.addEventListener('offline',setStatus);setStatus();

function persist(){localStorage.setItem(LOCAL,JSON.stringify(data));render()}
function prettyDate(v){
  if(!v)return 'Tanpa tanggal';
  const d=new Date(v+'T00:00:00');
  return new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'short',year:'numeric'}).format(d);
}
function txRow(x){
  return `<div class="row transaction-row"><div class="row-main"><div class="row-icon ${x.type==='income'?'income-bg':'expense-bg'}">${x.type==='income'?'↗':'↘'}</div><div><b>${esc(x.note||'Tanpa keterangan')}</b><small>📅 ${prettyDate(x.date)}</small></div></div><div class="row-right"><div class="amount ${x.type==='income'?'income':'expense'}">${x.type==='income'?'+':'-'}${money(x.amount)}</div><button class="icon-btn danger-icon" onclick="removeItem('transactions','${x.id}')" aria-label="Hapus">×</button></div></div>`
}
function goalRow(g){
  let p=g.target>0?Math.min(100,Math.round(g.saved/g.target*100)):0;
  return `<div class="progressline"><div class="top goal-title"><b>🎯 ${esc(g.name)}</b><span>${p}%</span></div><div class="bar"><i style="width:${p}%"></i></div><div class="goal-bottom"><div><small class="muted">${money(g.saved)} / ${money(g.target)}</small>${g.date?`<small class="muted goal-date">📅 ${prettyDate(g.date)}</small>`:''}</div><div class="goal-actions"><button class="btn small" onclick="addMoney('${g.id}')">+ Nabung</button><button class="icon-btn danger-icon" onclick="removeItem('goals','${g.id}')" aria-label="Hapus">×</button></div></div></div>`
}
function render(){
let inc=data.transactions.filter(x=>x.type==='income').reduce((a,x)=>a+x.amount,0),exp=data.transactions.filter(x=>x.type==='expense').reduce((a,x)=>a+x.amount,0);
$('balance').textContent=money(inc-exp);$('income').textContent=money(inc);$('expense').textContent=money(exp);
$('recent').innerHTML=data.transactions.slice(0,6).map(txRow).join('')||'<div class="empty">Belum ada transaksi</div>';
$('transactions').innerHTML=data.transactions.map(txRow).join('')||'<div class="empty">Belum ada transaksi</div>';
$('goals').innerHTML=data.goals.map(goalRow).join('')||'<div class="empty">Belum ada target</div>';
$('homeGoals').innerHTML=data.goals.slice(0,3).map(goalRow).join('')||'<div class="empty">Belum ada target</div>';
$('wishGrid').innerHTML=data.wishlists.map(w=>{
  let p=w.price>0?Math.min(100,Math.round((+w.saved||0)/(+w.price||1)*100)):0;
  return `<article class="wish">${w.image?`<img src="${w.image}" alt="">`:'<div class="wish-image-empty">✨</div>'}
  <div class="wishbody"><h3>${esc(w.name)}</h3><p>${esc(w.msg||'Tidak ada pesan.')}</p>
  <div class="bar"><i style="width:${p}%"></i></div>
  <div class="wish-progress-text"><b>${money(w.saved)}</b><span>${p}%</span><small>dari ${money(w.price)}</small></div>
  <div class="wish-actions"><button class="btn small" onclick="addWishMoney('${w.id}')">+ Nabung</button><button class="btn small danger" onclick="removeItem('wishlists','${w.id}')">Hapus</button></div>
  </div></article>`}).join('')||'<div class="card empty">Belum ada wishlist ✨</div>';
}
async function add(table,obj){
obj.id=crypto.randomUUID();obj.user_id=user?.id||'local';obj.created_at=new Date().toISOString();
data[table].unshift(obj);persist();
if(cloudReady&&user&&navigator.onLine) await push(table,obj);
}
async function uploadWishlistImage(file){
  if(!file) return '';
  if(!cloudReady || !user) throw new Error('Silakan login terlebih dahulu.');
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
  const path=`${user.id}/${crypto.randomUUID()}.${ext}`;
  const {error}=await supabase.storage.from('wishlist-images').upload(path,file,{
    cacheControl:'31536000',upsert:false,contentType:file.type||'image/jpeg'
  });
  if(error) throw new Error('Gagal menyimpan gambar: '+error.message);
  const {data}=supabase.storage.from('wishlist-images').getPublicUrl(path);
  return data.publicUrl;
}
async function push(table,obj){
  if(!cloudReady||!user) return;
  const payload={...obj,user_id:user.id};
  const {error}=await supabase.from(table).upsert(payload,{onConflict:'id'});
  if(error) throw error;
}
let confirmResolver=null;
window.askConfirm=function(title='Hapus data?',text='Data yang dihapus tidak bisa dikembalikan.'){
  $('confirmTitle').textContent=title;$('confirmText').textContent=text;
  $('confirmDialog').classList.add('show');$('confirmDialog').setAttribute('aria-hidden','false');
  return new Promise(resolve=>{confirmResolver=resolve});
};
function closeConfirm(result){
  $('confirmDialog').classList.remove('show');$('confirmDialog').setAttribute('aria-hidden','true');
  if(confirmResolver){const r=confirmResolver;confirmResolver=null;r(result)}
}
$('confirmCancel').onclick=()=>closeConfirm(false);
$('confirmOk').onclick=()=>closeConfirm(true);
$('confirmDialog').addEventListener('click',e=>{if(e.target.id==='confirmDialog')closeConfirm(false)});
window.removeItem=async(table,id)=>{
  const ok=await askConfirm('Hapus data?',table==='wishlists'?'Wishlist ini akan dihapus dari akunmu.':'Data ini akan dihapus dari akunmu.');
  if(!ok)return;
  data[table]=data[table].filter(x=>x.id!==id);persist();
  if(cloudReady&&user&&navigator.onLine){
    const {error}=await supabase.from(table).delete().eq('id',id).eq('user_id',user.id);
    if(error){toast('Gagal menghapus di cloud');await sync();return}
  }
  toast('Data berhasil dihapus');
};

let moneyWishId=null;
window.addWishMoney=async id=>{
  const w=data.wishlists.find(x=>x.id===id); if(!w)return;
  moneyWishId=id;
  $('wishMoneyAmount').value='';
  $('wishMoneyInfo').innerHTML=`<b>${esc(w.name)}</b><div class="wish-money-bar"><i style="width:${w.price>0?Math.min(100,(w.saved/w.price)*100):0}%"></i></div><small>${money(w.saved)} / ${money(w.price)}</small>`;
  $('wishMoneyModal').classList.add('show'); $('wishMoneyAmount').focus();
};
$('wishMoneyForm').onsubmit=async e=>{
  e.preventDefault();
  const w=data.wishlists.find(x=>x.id===moneyWishId), n=+$('wishMoneyAmount').value;
  if(!w||!(n>0))return;
  w.saved=Math.min(+w.price||0,(+w.saved||0)+n);
  persist();
  if(cloudReady&&user&&navigator.onLine) await push('wishlists',w);
  closeModal('wishMoneyModal'); moneyWishId=null;
  toast(w.saved>=w.price?'🎉 Wishlist berhasil tercapai!':'💰 Tabungan wishlist bertambah!');
};
document.querySelectorAll('[data-wish-money]').forEach(b=>b.onclick=()=>{ $('wishMoneyAmount').value=b.dataset.wishMoney; });

let moneyGoalId=null;
window.addMoney=async id=>{
  const g=data.goals.find(x=>x.id===id); if(!g)return;
  moneyGoalId=id; $('moneyAmount').value='';
  $('moneyModal').classList.add('show'); $('moneyAmount').focus();
};
$('moneyForm').onsubmit=async e=>{
  e.preventDefault();
  const g=data.goals.find(x=>x.id===moneyGoalId), n=+$('moneyAmount').value;
  if(!g||!(n>0)) return;
  g.saved=Math.min(g.target,g.saved+n); persist();
  if(cloudReady&&user&&navigator.onLine) await push('goals',g);
  closeModal('moneyModal'); moneyGoalId=null; toast('Target berhasil diperbarui 🎯');
};
document.querySelectorAll('[data-money]').forEach(b=>b.onclick=()=>{ $('moneyAmount').value=b.dataset.money; });

$('loginForm').onsubmit=async e=>{e.preventDefault();if(!cloudReady)return setAuthMessage('Supabase belum dikonfigurasi.','error');authLoading('login',true);setAuthMessage('');let {data:d,error}=await supabase.auth.signInWithPassword({email:$('loginEmail').value,password:$('loginPass').value});authLoading('login',false);if(error){setAuthMessage(error.message,'error');$('loginForm').classList.remove('shake');void $('loginForm').offsetWidth;$('loginForm').classList.add('shake');return}user=d.user;authSuccess();setTimeout(start,650)};
$('registerForm').onsubmit=async e=>{e.preventDefault();if(!cloudReady)return msg('Isi konfigurasi Supabase terlebih dahulu.');let {data:d,error}=await supabase.auth.signUp({email:$('regEmail').value,password:$('regPass').value});if(error)return msg(error.message);msg('Akun dibuat. Jika email confirmation aktif, cek email lalu masuk.');};
$('logout').onclick=async()=>{if(supabase)await supabase.auth.signOut();user=null;closeModal('accountModal');$('app').classList.add('hidden');$('auth').classList.remove('hidden');showAuth('login')};

$('transForm').onsubmit=async e=>{e.preventDefault();await add('transactions',{type:$('tType').value,amount:+$('tAmount').value,note:$('tNote').value,date:$('tDate').value});e.target.reset();$('tDate').value=isoDate(new Date());setDateDisplay('tDate');closeModal('transModal');toast('Transaksi disimpan')};
$('goalForm').onsubmit=async e=>{e.preventDefault();await add('goals',{name:$('gName').value,target:+$('gTarget').value,saved:+($('gSaved').value||0),date:$('gDate').value||null});e.target.reset();setDateDisplay('gDate');closeModal('goalModal');toast('Target dibuat')};
$('wishForm').onsubmit=async e=>{
  e.preventDefault();
  const btn=e.target.querySelector('button[type="submit"]');
  const oldText=btn.textContent;btn.disabled=true;btn.textContent='Menyimpan...';
  try{
    let f=$('wImage').files[0], image='';
    if(f) image=await uploadWishlistImage(f);
    await add('wishlists',{name:$('wName').value,msg:$('wMsg').value,price:+$('wPrice').value,saved:+($('wSaved').value||0),image});
    e.target.reset();
    wishPreview?.classList.add('hidden'); if(wishPreview)wishPreview.removeAttribute('src');
    if($('wishUploadIcon'))$('wishUploadIcon').textContent='📷';
    if($('wishUploadTitle'))$('wishUploadTitle').textContent='Tambah gambar';
    if($('wishUploadHint'))$('wishUploadHint').textContent='Ketuk di sini untuk memilih foto dari HP';
    closeModal('wishModal');toast('Wishlist + gambar tersimpan ☁️');
  }catch(err){toast(err.message||'Gagal menyimpan wishlist')}
  finally{btn.disabled=false;btn.textContent=oldText}
};
function imageData(f){return new Promise((res,rej)=>{let r=new FileReader();r.onload=()=>{let im=new Image();im.onload=()=>{let c=document.createElement('canvas'),m=1000,s=Math.min(1,m/im.width);c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.78))};im.src=r.result};r.onerror=rej;r.readAsDataURL(f)})}


const wishUploadBox=$('wishUploadBox'), wishImage=$('wImage'), wishPreview=$('wishPreview');
if(wishUploadBox&&wishImage){
  wishUploadBox.onclick=e=>{if(e.target!==wishImage)wishImage.click()};
  wishUploadBox.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();wishImage.click()}};
  wishImage.onchange=()=>{
    const f=wishImage.files?.[0];
    if(!f){wishPreview.classList.add('hidden');return}
    if(!f.type.startsWith('image/')){toast('Pilih file gambar yang valid');wishImage.value='';return}
    if(f.size>8*1024*1024){toast('Ukuran gambar maksimal 8 MB');wishImage.value='';return}
    wishPreview.src=URL.createObjectURL(f); wishPreview.classList.remove('hidden');
    $('wishUploadIcon').textContent='🖼️'; $('wishUploadTitle').textContent=f.name;
    $('wishUploadHint').textContent='Ketuk lagi untuk mengganti gambar';
  };
}

function initDateInputs(){
  const today=isoDate(new Date());
  if($('tDate')&&!$('tDate').value)$('tDate').value=today;
  setDateDisplay('tDate'); setDateDisplay('gDate');
}
document.addEventListener('DOMContentLoaded',initDateInputs);

async function sync(){
if(!cloudReady||!user||!navigator.onLine)return;
for(const table of ['transactions','goals','wishlists']){
  const {data:rows,error}=await supabase.from(table).select('*').eq('user_id',user.id).order('created_at',{ascending:false});
  if(error){console.warn('Sync '+table,error);continue}
  if(rows) data[table]=rows.map(r=>({...r}));
}
localStorage.setItem(LOCAL,JSON.stringify(data));render();
}

$('accountBtn').onclick=()=>{
  if(user){
    $('accountEmail').textContent=user.email||user.phone||'Pengguna FinWish';
    $('accountProvider').textContent=user.app_metadata?.provider ? `Masuk dengan ${user.app_metadata.provider}` : 'Akun tersimpan di cloud';
  }
  $('accountModal').classList.add('show');
};

async function start(){
  $('auth').classList.add('hidden');$('app').classList.remove('hidden');
  if(user){$('accountEmail').textContent=user.email||user.phone||'Pengguna FinWish';$('accountProvider').textContent=user.app_metadata?.provider?`Masuk dengan ${user.app_metadata.provider}`:'Akun tersimpan di cloud'}
  await sync();render()
}
async function boot(){if(cloudReady){let {data:d}=await supabase.auth.getSession();if(d.session){user=d.session.user;await start()}}else msg('Mode demo belum aktif. Konfigurasikan Supabase untuk login & database.');render()}
boot();

/* finwishModalScrollFix */
(function(){
  const syncModalScroll=()=>{
    const open=document.querySelector('.modal.show,.modal.active');
    document.body.classList.toggle('modal-open',!!open);
  };
  const mo=new MutationObserver(syncModalScroll);
  mo.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class']});
  syncModalScroll();
})();

/* finwishPrettyAlert: replace native alert appearance with the FinWish toast when available */
(function(){
  const nativeAlert=window.alert;
  window.finwishPrettyAlert=function(message){
    if(typeof window.toast==='function') return window.toast(message);
    nativeAlert(message);
  };
})();
