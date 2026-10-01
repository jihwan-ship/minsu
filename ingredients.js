/* =====================================================================
   재료 SVG 아이콘 · 용기 속 장면 · 투하(붓기/떨어뜨리기) 연출
   - ic(키, 크기)      : 재료 아이콘 SVG 문자열
   - scene(...)        : 냄비/팬/그릇 안에 담긴 재료 장면
   - fall(id, v)       : 재료를 넣을 때의 연출 (떨어지기 / 붓기)
   ===================================================================== */
const QN=id=>document.getElementById(id);

/* ---------- 공용 그라디언트 ---------- */
const DEFS_IN=`
<linearGradient id="qLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#c4f57a"/><stop offset="1" stop-color="#2f9a3a"/></linearGradient>
<radialGradient id="qMeat" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ffb8bd"/><stop offset="1" stop-color="#d93a56"/></radialGradient>
<linearGradient id="qOil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffe680"/><stop offset=".55" stop-color="#ffc21a"/><stop offset="1" stop-color="#e08a00"/></linearGradient>
<radialGradient id="qOilP" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#ffe98f" stop-opacity=".55"/><stop offset="1" stop-color="#f0a800" stop-opacity=".8"/></radialGradient>
<linearGradient id="qGlass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".5" stop-color="#e3f2fd" stop-opacity=".6"/><stop offset="1" stop-color="#b0bec5" stop-opacity=".75"/></linearGradient>
<radialGradient id="qPaste" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#6e4631"/><stop offset=".55" stop-color="#2b150b"/><stop offset="1" stop-color="#0d0503"/></radialGradient>
<radialGradient id="qPasteF" cx=".4" cy=".3" r=".85"><stop offset="0" stop-color="#8a4a2a"/><stop offset=".55" stop-color="#3a170a"/><stop offset="1" stop-color="#140603"/></radialGradient>
<linearGradient id="qWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b6ebff"/><stop offset="1" stop-color="#2f93e6"/></linearGradient>
<linearGradient id="qWaterP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9ee3ff" stop-opacity=".95"/><stop offset="1" stop-color="#2b86d6" stop-opacity=".95"/></linearGradient>
<radialGradient id="qSauce" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#85421d"/><stop offset=".55" stop-color="#3d1b0a"/><stop offset="1" stop-color="#1b0b04"/></radialGradient>
<linearGradient id="qCer" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#cfd8dc"/></linearGradient>
<radialGradient id="qGarlic" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#fff"/><stop offset=".6" stop-color="#f4e8d6"/><stop offset="1" stop-color="#d6bf9f"/></radialGradient>
<linearGradient id="qCap" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6a58"/><stop offset="1" stop-color="#b3201a"/></linearGradient>
<linearGradient id="qGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe082"/><stop offset="1" stop-color="#d49a00"/></linearGradient>`;
if(typeof document!=='undefined')document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>${DEFS_IN}</defs></svg>`);

/* ---------- 유틸 ---------- */
const RN=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const HS=str=>{let h=2166136261;for(const c of str)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const rep=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
const ep=(r,cx,cy,rx,ry)=>{const a=r()*6.2832,d=Math.sqrt(r());return[cx+Math.cos(a)*rx*d,cy+Math.sin(a)*ry*d]};
const jig=r=>`style="animation-delay:-${(r()*.3).toFixed(2)}s"`;

/* ---------- 작은 조각들 (원점 중심, 약 ±10) ---------- */
const PC={
 leaf:f=>{const a=f?'#a9a23c':'#79d24e',b=f?'#6a6420':'#3f9f2f',h=f?'#e2cf6a':'#c8f59a';
  return `<path d="M-9 -2 Q-6 -9 2 -8 Q10 -6 9 1 Q6 8 -3 7 Q-10 5 -9 -2Z" fill="${a}" stroke="${b}" stroke-width="1.2"/><path d="M-6 2 Q0 -1 6 -3" stroke="${h}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`},
 meat:f=>{const a=f?'#b9733b':'#f0868f',b=f?'#6e3d17':'#a52c44',fat=f?'#f0c27a':'#ffe6dd';
  return `<path d="M-8 -5 Q-2 -9 6 -6 Q10 -2 8 4 Q3 9 -5 7 Q-10 3 -8 -5Z" fill="${a}" stroke="${b}" stroke-width="1.2"/><path d="M-7 3 Q0 8 7 2 Q5 7 -3 7 Q-7 6 -7 3Z" fill="${fat}"/><path d="M-4 -4 Q0 -6 4 -4" stroke="#fff" stroke-opacity=".5" stroke-width="1.6" fill="none" stroke-linecap="round"/>`},
 garlic:()=>`<path d="M0 -8 Q6 -3 6 3 Q4 8 0 8 Q-4 8 -6 3 Q-6 -3 0 -8Z" fill="#fff7e6" stroke="#b79b78" stroke-width="1"/><path d="M-2 -3 Q-3 2 -1 6" stroke="#e6d3b3" stroke-width="1.2" fill="none"/>`,
 crystal:()=>`<path d="M0 -3 L3 0 L0 3 L-3 0Z" fill="#fff" stroke="#cfd8dc" stroke-width=".6"/>`,
 glob:()=>`<path d="M-9 0 Q-8 -8 0 -8 Q9 -7 9 0 Q8 8 0 8 Q-9 7 -9 0Z" fill="url(#qPaste)"/><ellipse cx="-3" cy="-3" rx="3" ry="1.6" fill="#fff" opacity=".35"/>`,
 strand:()=>`<path d="M-12 0 Q-6 -8 0 0 T12 0" stroke="#d1a84c" stroke-width="4.4" fill="none" stroke-linecap="round"/><path d="M-12 0 Q-6 -8 0 0 T12 0" stroke="#ffeeb4" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
};
const pc=(k,x,y,r=0,s=1,f=0)=>`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${r.toFixed(0)}) scale(${s.toFixed(2)})">${PC[k](f)}</g>`;

/* ---------- 재료 아이콘 (64×64) ---------- */
const STEAM=(y=12)=>`<path d="M22 ${y}c-3-3 3-5 0-9M32 ${y}c-3-3 3-5 0-9M42 ${y}c-3-3 3-5 0-9" stroke="#fff" stroke-opacity=".8" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
const IC={
 veggies:`<path d="M32 6C14 8 5 27 13 43c6 12 23 15 34 7 11-8 13-27 5-37-5-6-12-8-20-7z" fill="url(#qLeaf)" stroke="#1f6b2a" stroke-width="2"/><path d="M32 11C29 25 29 40 32 56" stroke="#eaffd2" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M32 24L20 17M32 32L15 27M32 41L18 38M32 24L44 17M32 32L49 27M32 41L46 38" stroke="#d9ffb0" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".85"/><path d="M17 21c3-7 9-10 15-10" stroke="#fff" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>`,
 meat:`<path d="M9 29c0-13 13-19 27-17 14 2 20 12 18 24-2 12-14 18-28 16C14 50 9 40 9 29z" fill="url(#qMeat)" stroke="#8e1e34" stroke-width="2"/><path d="M12 40c9 7 25 9 40-3-1 7-5 12-11 14-14 4-26-1-29-11z" fill="#fff0e6" stroke="#e8b9b0" stroke-width="1"/><path d="M21 23c6 3 11 3 17 0M25 31c5 2 10 2 15-1" stroke="#ffd0d6" stroke-width="2" opacity=".75" fill="none" stroke-linecap="round"/><ellipse cx="24" cy="20" rx="8" ry="3.5" transform="rotate(-20 24 20)" fill="#fff" opacity=".45"/>`,
 oil:`<rect x="24" y="3" width="16" height="9" rx="2" fill="url(#qCap)" stroke="#6b1410" stroke-width="2"/><path d="M26 12h12v6c8 3 12 8 12 16v20c0 4-3 7-7 7H21c-4 0-7-3-7-7V34c0-8 4-13 12-16z" fill="url(#qOil)" stroke="#9a5a00" stroke-width="2"/><rect x="18" y="32" width="28" height="17" rx="3" fill="#fff8e1" stroke="#9a5a00" stroke-width="1.5"/><path d="M32 35c-3 4-5 6-5 8.5a5 5 0 0010 0c0-2.500-2-4.500-5-8.500z" fill="#f5a300"/><path d="M19 36v-6M19 52v3" stroke="#fff" stroke-width="3" opacity=".6" stroke-linecap="round"/>`,
 chunjang:`<ellipse cx="32" cy="55" rx="23" ry="4.500" fill="#000" opacity=".2"/><path d="M8 31h48c0 14-10 24-24 24S8 45 8 31z" fill="url(#qCer)" stroke="#78909c" stroke-width="2"/><ellipse cx="32" cy="31" rx="24" ry="7" fill="#eceff1" stroke="#78909c" stroke-width="2"/><path d="M12 30c2-13 12-19 20-19s18 6 20 19c-6 5-34 5-40 0z" fill="url(#qPaste)"/><path d="M22 21c3-4 7-6 11-6" stroke="#d3a083" stroke-width="2.500" opacity=".75" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="24" rx="3.500" ry="1.700" fill="#fff" opacity=".4"/>`,
 sugar:`<rect x="18" y="4" width="28" height="10" rx="3" fill="url(#qGold)" stroke="#8a6a00" stroke-width="2"/><path d="M16 38h32v15c0 4-3 6-6 6H22c-3 0-6-2-6-6z" fill="#f4f7fa"/><path d="M20 14h24c4 3 6 7 6 12v27c0 5-3 8-8 8H22c-5 0-8-3-8-8V26c0-5 2-9 6-12z" fill="url(#qGlass)" stroke="#78909c" stroke-width="2"/><g fill="#fff" stroke="#cfd8dc" stroke-width=".6"><path d="M20 38l2-2 2 2-2 2zM28 36l2-2 2 2-2 2zM38 37l2-2 2 2-2 2zM44 40l2-2 2 2-2 2z"/></g><rect x="22" y="28" width="20" height="13" rx="3" fill="#ffe0f0" stroke="#e57aa8" stroke-width="1.5"/><path d="M32 39l-4-4a2.500 2.500 0 014-3 2.500 2.500 0 014 3z" fill="#e5457f"/><path d="M45 47l1.500-3 1.500 3 3 1.500-3 1.500-1.500 3-1.500-3-3-1.500z" fill="#fff" stroke="#b0bec5" stroke-width=".6"/>`,
 garlic:`<path d="M32 5c1 6 2 9 4 13 12 4 18 14 16 24-2 10-10 16-20 16S14 52 12 42c-2-10 4-20 16-24 2-4 3-8 4-13z" fill="url(#qGarlic)" stroke="#a88f70" stroke-width="2"/><path d="M32 20c-8 6-10 18-6 34M32 20c8 6 10 18 6 34M32 20v35" stroke="#cdb594" stroke-width="2" fill="none" opacity=".85"/><path d="M26 57h12l-2 4h-8z" fill="#c9a97a"/><path d="M19 38c0-6 3-11 8-14" stroke="#fff" stroke-width="3" opacity=".85" fill="none" stroke-linecap="round"/>`,
 noodles:`${rep(7,i=>{const x=14+i*6;return `<path d="M${x} 6C${x-6} 18 ${x+6} 28 ${x} 40S${x-5} 54 ${x+1} 60" stroke="#c99f45" stroke-width="5" fill="none" stroke-linecap="round"/>`})}${rep(7,i=>{const x=14+i*6;return `<path d="M${x} 6C${x-6} 18 ${x+6} 28 ${x} 40S${x-5} 54 ${x+1} 60" stroke="#ffeab0" stroke-width="3" fill="none" stroke-linecap="round"/>`})}<rect x="10" y="26" width="44" height="11" rx="2.500" fill="url(#qCap)" stroke="#6b1410" stroke-width="1.5"/><path d="M32 27.500l1.700 3.300 3.600.5-2.600 2.500.6 3.600-3.300-1.800-3.300 1.800.6-3.600-2.600-2.500 3.600-.5z" fill="#ffe082"/>`,
 water:`<path d="M15 7h28c2 0 3 1 3 3l-2 41c0 5-4 9-9 9H24c-5 0-9-4-9-9L12 10c0-2 1-3 3-3z" fill="url(#qGlass)" stroke="#5a8fb5" stroke-width="2"/><path d="M13.500 22h31.500l-1 29c0 4-3 7-8 7H23c-5 0-8-3-8-7z" fill="url(#qWater)"/><ellipse cx="29" cy="22" rx="15.500" ry="2.800" fill="#dff5ff" stroke="#fff" stroke-opacity=".8"/><path d="M46 15c10 0 12 6 12 12s-2 12-11 13" stroke="#5a8fb5" stroke-width="4.500" fill="none" stroke-linecap="round"/><path d="M46 15c9 0 10 5 10 12s-2 11-9 12" stroke="#d6efff" stroke-width="1.500" fill="none" stroke-linecap="round"/><path d="M20 14v38" stroke="#fff" stroke-width="3" opacity=".65" stroke-linecap="round"/>`,
 friedVeg:`<ellipse cx="32" cy="53" rx="25" ry="6" fill="#000" opacity=".2"/>${pc('leaf',20,42,-15,2.1,1)}${pc('meat',44,43,12,2,1)}${pc('leaf',32,47,8,1.9,1)}${pc('meat',24,31,-30,1.9,1)}${pc('leaf',42,30,25,2,1)}${pc('meat',33,20,5,1.8,1)}${pc('leaf',22,20,-40,1.6,1)}${pc('leaf',44,19,35,1.5,1)}<ellipse cx="30" cy="25" rx="12" ry="2.500" fill="#fff" opacity=".18"/>`,
 friedChun:`<ellipse cx="32" cy="56" rx="25" ry="5" fill="#000" opacity=".2"/><path d="M7 44c-2-14 8-26 22-28 14-2 27 8 27 22 0 11-11 17-25 17S9 54 7 44z" fill="url(#qPasteF)" stroke="#000" stroke-opacity=".6" stroke-width="2"/><path d="M17 31c4-7 10-10 17-10" stroke="#e9bb9d" stroke-width="3.500" opacity=".75" fill="none" stroke-linecap="round"/><ellipse cx="42" cy="31" rx="5" ry="2.200" fill="#fff" opacity=".45"/><path d="M12 47c10 8 30 8 42-3" stroke="#b5532b" stroke-opacity=".55" stroke-width="2" fill="none"/>${STEAM(12)}`,
 jajang:`<ellipse cx="32" cy="57" rx="26" ry="4.500" fill="#000" opacity=".2"/><path d="M5 32h54c0 16-11 26-27 26S5 48 5 32z" fill="url(#qCer)" stroke="#546e7a" stroke-width="2"/><path d="M7 41c16 5 34 5 50 0" stroke="#3a7bd5" stroke-width="3" fill="none"/><ellipse cx="32" cy="31" rx="27" ry="7.500" fill="#eceff1" stroke="#546e7a" stroke-width="2"/><path d="M9 30c1-12 11-18 23-18s22 6 23 18c-8 5-38 5-46 0z" fill="url(#qSauce)" stroke="#1b0b04" stroke-width="1.500"/><circle cx="22" cy="24" r="2.200" fill="#a8a23c"/><circle cx="38" cy="20" r="2.400" fill="#c27a3a"/><circle cx="31" cy="27" r="2" fill="#7a7a2a"/><circle cx="45" cy="26" r="2" fill="#c27a3a"/><path d="M18 20c4-4 9-6 14-6" stroke="#e2a77f" stroke-width="2.600" opacity=".65" fill="none" stroke-linecap="round"/><ellipse cx="41" cy="17" rx="3.500" ry="1.600" fill="#fff" opacity=".4"/>${STEAM(9)}`,
 boiled:`<ellipse cx="32" cy="55" rx="26" ry="5" fill="#000" opacity=".2"/><path d="M5 40c0-14 12-24 27-24s27 10 27 24c0 9-12 15-27 15S5 49 5 40z" fill="#ffe9ac" stroke="#c9a24a" stroke-width="2"/><g fill="none" stroke-linecap="round"><path d="M9 38c7-10 15-13 23-13s16 3 23 13M12 45c7 6 14 8 20 8s13-2 20-8M14 33c11 6 25 6 36 0M18 40c9 4 19 4 28 0" stroke="#d1a84c" stroke-width="4.600"/><path d="M9 38c7-10 15-13 23-13s16 3 23 13M12 45c7 6 14 8 20 8s13-2 20-8M14 33c11 6 25 6 36 0M18 40c9 4 19 4 28 0" stroke="#fff1bd" stroke-width="2.800"/></g><path d="M18 27c4-4 9-5 14-5" stroke="#fff" stroke-width="2.500" opacity=".7" fill="none" stroke-linecap="round"/>${STEAM(13)}`,
 result:`<ellipse cx="32" cy="58" rx="27" ry="4" fill="#000" opacity=".2"/><path d="M3 30h58c0 17-12 28-29 28S3 47 3 30z" fill="url(#qCer)" stroke="#546e7a" stroke-width="2"/><path d="M5 40c18 6 36 6 54 0" stroke="#d32f2f" stroke-width="3" fill="none"/><ellipse cx="32" cy="29" rx="29" ry="8" fill="#ffeaa8" stroke="#c9a24a" stroke-width="2"/><path d="M8 28c8-5 16-6 24-6s16 1 24 6M12 31c6 3 14 4 20 4s14-1 20-4" stroke="#d1a84c" stroke-width="2" fill="none"/><path d="M13 27c1-11 9-17 19-17s18 6 19 17c-7 5-31 5-38 0z" fill="url(#qSauce)" stroke="#1b0b04" stroke-width="1.500"/><path d="M26 14l9-3M30 18l10-2M22 19l8-3" stroke="#7bd24a" stroke-width="2.200" stroke-linecap="round"/><path d="M20 20c4-4 8-6 13-6" stroke="#e2a77f" stroke-width="2.400" opacity=".6" fill="none" stroke-linecap="round"/><ellipse cx="43" cy="19" rx="3.500" ry="1.500" fill="#fff" opacity=".4"/>${STEAM(8)}`
};
const ic=(k,s=40)=>`<svg viewBox="0 0 64 64" width="${s}" height="${s}" style="overflow:visible" aria-hidden="true">${IC[k]}</svg>`;

/* ---------- 용기 속 장면 ---------- */
const VD={pot:[212,92],pan:[242,92],plate:[206,92]};
const PAN_ORD=['oil','water','chunjang','friedChun','veggies','meat','friedVeg','garlic','sugar'];
function scat(v,k,n,kind,fried,a,b,box,cx=121,cy=47){const r=RN(HS(v+k+kind));let o='';for(let i=0;i<n;i++){const[x,y]=ep(r,cx,cy,box[0],box[1]);o+=`<g class="pc" ${jig(r)}>${pc(kind,x,y,r()*360,a+r()*(b-a),fried)}</g>`}return o}
const BLOB='M58 52C52 30 80 20 116 20C158 20 190 32 182 54C176 68 150 72 118 72C86 72 62 66 58 52Z';
function panItem(k){
 switch(k){
  case'oil':return `<ellipse cx="121" cy="47" rx="106" ry="36" fill="url(#qOilP)"/><path d="M38 40C60 22 100 16 140 20" stroke="#fff" stroke-width="3" stroke-opacity=".55" fill="none" stroke-linecap="round"/><ellipse cx="170" cy="60" rx="9" ry="3" fill="#fff" fill-opacity=".35"/><ellipse cx="80" cy="64" rx="5" ry="2" fill="#fff" fill-opacity=".3"/>`;
  case'water':return `<ellipse cx="121" cy="48" rx="102" ry="33" fill="#8fd6ff" fill-opacity=".38"/><path d="M50 52q10-5 20 0t20 0t20 0t20 0t20 0" stroke="#e6f7ff" stroke-width="2" fill="none" stroke-opacity=".7"/>`;
  case'chunjang':return `<path d="${BLOB}" fill="url(#qPaste)" stroke="#000" stroke-opacity=".5" stroke-width="1.5"/><path d="M78 36C92 28 116 26 134 28" stroke="#d7a98a" stroke-width="3.500" stroke-opacity=".6" fill="none" stroke-linecap="round"/><ellipse cx="158" cy="40" rx="8" ry="3" fill="#fff" fill-opacity=".3"/>`;
  case'friedChun':return `<g transform="translate(34 6) scale(.7)"><path d="${BLOB}" fill="url(#qPasteF)" stroke="#000" stroke-opacity=".5" stroke-width="2"/><path d="M78 36C92 28 116 26 134 28" stroke="#f0c3a5" stroke-width="4" stroke-opacity=".7" fill="none" stroke-linecap="round"/><path d="M66 56C90 70 150 70 176 52" stroke="#b5532b" stroke-opacity=".6" stroke-width="3" fill="none"/><ellipse cx="158" cy="40" rx="9" ry="3.500" fill="#fff" fill-opacity=".4"/></g>`;
  case'veggies':return scat('pan',k,11,'leaf',0,.9,1.3,[90,28]);
  case'meat':return scat('pan',k,8,'meat',0,.9,1.25,[90,28]);
  case'friedVeg':return scat('pan',k,9,'leaf',1,1,1.3,[92,28])+scat('pan',k,6,'meat',1,.95,1.25,[88,26]);
  case'garlic':return scat('pan',k,7,'garlic',0,.8,1.1,[86,26]);
  case'sugar':return scat('pan',k,34,'crystal',0,.8,1.5,[96,31]);
 }return''}
function potWater(){const r=RN(HS('potw')),wv='M0 28q13-6 26 0'+'t26 0'.repeat(8);
 return `<path d="${wv}V92H0Z" fill="url(#qWaterP)"/><path d="${wv}" stroke="#fff" stroke-opacity=".8" stroke-width="2" fill="none"/><path d="M0 44c40-6 90 8 212 0" stroke="#fff" stroke-opacity=".15" stroke-width="10" fill="none"/>`+rep(8,()=>`<circle class="bub" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="1.6" cx="${(14+r()*184).toFixed(0)}" cy="${(52+r()*28).toFixed(0)}" r="${(2.5+r()*3).toFixed(1)}" style="animation-delay:-${(r()*.8).toFixed(2)}s"/>`)}
function potNoodles(){const r=RN(HS('potn'));return rep(11,i=>{const x=4+i*14+r()*6,y=36+r()*16,rot=(r()-.5)*50,amp=9+r()*8,d=`M0 0q10-${amp.toFixed(0)} 20 0t20 0t20 0t20 0`;
 return `<g class="pc" ${jig(r)}><g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) rotate(${rot.toFixed(0)})"><path d="${d}" stroke="#c99f45" stroke-width="5.600" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ffeab0" stroke-width="3.400" fill="none" stroke-linecap="round"/></g></g>`})}
function plateNoodles(){const r=RN(HS('platen'));
 let o='<ellipse cx="103" cy="54" rx="66" ry="24" fill="#e0b95f"/>';
 for(let i=0;i<6;i++){const rx=64-i*8,ry=23-i*3,cy=54-i*3.6;o+=`<ellipse cx="103" cy="${cy.toFixed(1)}" rx="${rx}" ry="${ry}" stroke="#d1a84c" stroke-width="5.600" fill="#f6dc8e" /><ellipse cx="103" cy="${cy.toFixed(1)}" rx="${rx}" ry="${ry}" stroke="#fff1bd" stroke-width="3" fill="none"/>`}
 o+=rep(7,()=>{const[x,y]=ep(r,103,40,44,12);return `<g class="pc">${pc('strand',x,y,(r()-.5)*70,1.15)}</g>`});
 return o+`<path d="M62 44c10-14 30-20 48-18" stroke="#fff" stroke-width="3" stroke-opacity=".7" fill="none" stroke-linecap="round"/>`}
function plateSauce(){const r=RN(HS('plates')),cols=['#6b6a1f','#9a4b2a','#c27a3a','#8a8a2c'];
 let o=`<path d="M56 50C54 27 78 16 104 16C132 16 154 27 152 50C144 61 64 61 56 50Z" fill="url(#qSauce)" stroke="#1b0b04" stroke-width="1.500"/>`;
 o+=rep(16,()=>{const[x,y]=ep(r,104,36,40,14);return `<rect x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(3+r()*3).toFixed(1)}" height="${(3+r()*3).toFixed(1)}" rx="1.200" fill="${cols[Math.floor(r()*4)]}" transform="rotate(${(r()*90).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`});
 o+=`<path d="M82 28c8-8 20-11 32-10" stroke="#e2a77f" stroke-width="3.500" stroke-opacity=".6" fill="none" stroke-linecap="round"/><ellipse cx="128" cy="26" rx="7" ry="2.600" fill="#fff" fill-opacity=".38"/>`;
 return o+`<path d="M92 24l16-5M98 30l16-3M86 31l12-4" stroke="#7bd24a" stroke-width="2.800" stroke-linecap="round"/>`}

function scene(v,list,nw){
 const W=VD[v][0],H=VD[v][1],has=k=>list.includes(k),g=(k,s)=>`<g class="it${k==nw?' land':''}">${s}</g>`;let o='';
 if(v=='pot'){if(has('water'))o+=g('water',potWater());if(has('noodles'))o+=g('noodles',potNoodles());if(has('water'))o+=`<rect y="33" width="212" height="60" fill="#5bb6f0" fill-opacity=".22"/>`}
 else if(v=='pan'){for(const k of PAN_ORD)if(has(k))o+=g(k,panItem(k))}
 else{if(has('boiled'))o+=g('boiled',plateNoodles());if(has('jajang'))o+=g('jajang',plateSauce())}
 return o+`<rect class="tint" width="${W}" height="${H}" fill="#000" opacity="0"/>`}

function renderCont(v,nw){const c=QN('sc_'+v);if(!c)return;const[W,H]=VD[v];
 c.innerHTML=`<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${scene(v,(S.landed&&S.landed[v])||[],nw)}</svg>`}
function renderAllCont(){['pan','pot','plate'].forEach(v=>{const c=QN('sc_'+v);if(c)c.classList.remove('sizz','boil');renderCont(v)})}

/* 가열 정도에 따라 팬/냄비 내용물 색 변화 (설익음 → 잘익음 → 탐) */
function tintUpdate(){if(!S||!S.cook)return;const t=document.querySelector('#sc_'+S.cook.v+' .tint');if(!t)return;const h=S.heat;let c,o;
 if(h<GMIN){c='255,170,60';o=h/GMIN*.12}
 else if(h<=GMAX){c='140,70,15';o=.12+(h-GMIN)/(GMAX-GMIN)*.2}
 else{c='10,6,4';o=.32+(h-GMAX)/(100-GMAX)*.5}
 if(S.cook.v=='pot'&&h<=GMAX)o=0;
 t.style.fill='rgb('+c+')';t.style.opacity=o.toFixed(2)}

/* ---------- 투하 연출 ---------- */
const TR=(x,y,w,h,r=0,s=1)=>`translate(${(x-w/2).toFixed(1)}px,${(y-h/2).toFixed(1)}px) rotate(${r.toFixed(0)}deg) scale(${s})`;
function dpv(html,w,h,frames,o){const d=document.createElement('div');d.className='dp';d.style.width=w+'px';d.style.height=h+'px';d.innerHTML=html;QN('dfx').append(d);
 const a=d.animate(frames,Object.assign({fill:'both',easing:'linear'},o));a.onfinish=()=>d.remove();return d}
function ring(x,y,w,col,dl=0){dpv(`<div style="width:100%;height:100%;border:3px solid ${col};border-radius:50%"></div>`,w,w*.34,[{transform:TR(x,y,w,w*.34,0,.2),opacity:.9},{transform:TR(x,y,w,w*.34,0,1),opacity:0}],{duration:650,delay:dl,easing:'ease-out'})}

/* [조각 종류, 튀김색 여부, 개수] */
const FXK={veggies:['leaf',0,10],meat:['meat',0,8],garlic:['garlic',0,7],chunjang:['glob',0,4],friedVeg:['mix',1,11],friedChun:['glob',0,4],jajang:['glob',0,6],noodles:['strand',0,9],boiled:['strand',0,9]};
const SPL={veggies:['120,210,80',0],meat:['245,130,145',0],garlic:['255,245,225',0],chunjang:['70,40,22',1],friedVeg:['185,160,60',0],friedChun:['60,30,18',1],jajang:['80,40,18',1],noodles:['255,235,170',0],boiled:['255,235,170',0]};
const POUR={oil:'#ffc21a',water:'#58b8f5',sugar:'#ffffff'};
const SPC={oil:['255,210,70',0],water:['150,210,255',0],sugar:['255,255,255',0]};

function solids(id,v){
 const e=QN(v),cx=e.offsetLeft+e.offsetWidth/2,top=e.offsetTop,ly=top+e.offsetHeight*.5,[k,f,n]=FXK[id],sw=Math.min(e.offsetWidth*.3,66),[col,m]=SPL[id];
 for(let i=0;i<n;i++){
  const kk=k=='mix'?(i%3?'leaf':'meat'):k,x0=cx+(Math.random()-.5)*30,x1=cx+(Math.random()-.5)*sw*2,y0=top-135-Math.random()*40,y1=ly+(Math.random()-.5)*28,
   dl=i*34+Math.random()*30,du=420+Math.random()*120,sz=34,sc=.95+Math.random()*.5,r0=Math.random()*360,r1=r0+(Math.random()-.5)*600,at=(a)=>[x0+(x1-x0)*a,y0+(y1-y0)*a,r0+(r1-r0)*a];
  dpv(`<svg viewBox="-15 -15 30 30" width="${sz}" height="${sz}" style="overflow:visible">${PC[kk](f)}</svg>`,sz,sz,[
   {transform:TR(x0,y0,sz,sz,r0,sc*.6),opacity:0,offset:0},
   {transform:TR(at(.2)[0],at(.2)[1],sz,sz,at(.2)[2],sc),opacity:1,offset:.12},
   {transform:TR(x1,y1,sz,sz,r1,sc),opacity:1,offset:.82},
   {transform:TR(x1,y1-10,sz,sz,r1+20,sc*.95),opacity:.9,offset:.91},
   {transform:TR(x1,y1,sz,sz,r1+25,sc*.4),opacity:0,offset:1}],{duration:du,delay:dl,easing:'cubic-bezier(.45,0,.9,.7)'});
  setTimeout(()=>emit(x1,y1,3,{w:6,v:70,s:2.4,g:260,t:.4,r:3,c:col,m:!!m}),dl+du*.8)}
 ring(cx,ly+6,e.offsetWidth*.55,'rgba(255,255,255,.55)',n*22+260);
 return Math.min(n*24,240)+430}

function pour(id,v){
 const e=QN(v),cx=e.offsetLeft+e.offsetWidth/2,top=e.offsetTop,sy=top-58,ly=top+e.offsetHeight*.52,B=88,bx=cx+33,by=sy+14,col=POUR[id],[pcol,pm]=SPC[id];
 dpv(ic(id,B),B,B,[
  {transform:TR(bx+30,by-26,B,B,20,.7),opacity:0,offset:0},
  {transform:TR(bx,by,B,B,-62,1),opacity:1,offset:.22},
  {transform:TR(bx,by,B,B,-66,1),opacity:1,offset:.8},
  {transform:TR(bx+30,by-26,B,B,10,.8),opacity:0,offset:1}],{duration:1050,easing:'ease-in-out'});
 if(id=='sugar'){
  for(let i=0;i<28;i++){const x=cx+(Math.random()-.5)*8,x2=x+(Math.random()-.5)*14,dl=200+i*26,du=260+Math.random()*80;
   dpv(`<svg viewBox="-15 -15 30 30" width="12" height="12" style="overflow:visible">${PC.crystal()}</svg>`,12,12,[
    {transform:TR(x,sy,12,12,0,1.2),opacity:0,offset:0},{transform:TR(x,sy+8,12,12,60,1.2),opacity:1,offset:.1},
    {transform:TR(x2,ly,12,12,300,1),opacity:1,offset:.92},{transform:TR(x2,ly,12,12,330,.5),opacity:0,offset:1}],{duration:du,delay:dl,easing:'ease-in'})}
 }else{
  const w=id=='oil'?9:8;
  dpv(`<div style="width:100%;height:100%;border-radius:5px;background:linear-gradient(90deg,rgba(255,255,255,.8) 0 22%,${col} 22% 100%);opacity:.93"></div>`,w,ly-sy,[
   {transform:`translate(${cx-w/2}px,${sy}px)`,clipPath:'inset(0 0 100% 0)',offset:0},
   {transform:`translate(${cx-w/2}px,${sy}px)`,clipPath:'inset(0 0 0% 0)',offset:.2},
   {transform:`translate(${cx-w/2}px,${sy}px)`,clipPath:'inset(0 0 0% 0)',offset:.72},
   {transform:`translate(${cx-w/2}px,${sy}px)`,clipPath:'inset(100% 0 0 0)',offset:1}],{duration:1000,delay:120})
 }
 for(let t=260;t<900;t+=90)setTimeout(()=>emit(cx,ly,4,{w:8,v:90,s:2.4,g:320,t:.35,r:3,c:pcol,m:!!pm}),t);
 ring(cx,ly+4,e.offsetWidth*.4,'rgba(255,255,255,.6)',280);ring(cx,ly+4,e.offsetWidth*.55,'rgba(255,255,255,.4)',560);
 return 520}

function fall(id,v){return POUR[id]?pour(id,v):solids(id,v)}

/* 완성된 재료가 용기에서 '완성 재료' 칸으로 날아감 */
function ship(k,v){const e=QN(v),t=QN('tray'),p=QN('p_'+k);if(!e||!p)return;
 const x0=e.offsetLeft+e.offsetWidth/2,y0=e.offsetTop+e.offsetHeight/2,x1=t.offsetLeft+t.clientLeft+p.offsetLeft+30,y1=t.offsetTop+t.clientTop+p.offsetTop+p.offsetHeight/2;
 dpv(ic(k,64),64,64,[{transform:TR(x0,y0,64,64,0,.6),opacity:0,offset:0},{transform:TR(x0,y0-30,64,64,-6,1.3),opacity:1,offset:.3},{transform:TR(x1,y1,64,64,10,.7),opacity:.15,offset:1}],{duration:650,easing:'ease-in-out'})}

/* ---------- 초기화 (용기 내용물 레이어 + 연출 레이어) ---------- */
if(typeof document!=='undefined'){
 ['pan','pot','plate'].forEach(v=>{const d=document.createElement('div');d.className='cont';d.id='sc_'+v;QN(v).prepend(d)});
 const f=document.createElement('div');f.id='dfx';QN('stage').append(f)}
if(typeof module!=='undefined')module.exports={IC,ic,scene,DEFS_IN,VD};
