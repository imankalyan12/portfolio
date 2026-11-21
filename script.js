(function(){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");io.unobserve(e.target);}});},{threshold:.15});
document.querySelectorAll(".rv").forEach(function(el,i){el.style.transitionDelay=(i%5)*60+"ms";io.observe(el);});
var ec=document.getElementById("eclipse"),ang=-12,vel=0,auto=matchMedia("(prefers-reduced-motion: reduce)").matches?0:.15,drag=false,last=0;
vel=auto;
function pa(e){var r=ec.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2))*180/Math.PI;}
ec.addEventListener("pointerdown",function(e){drag=true;last=pa(e);try{ec.setPointerCapture(e.pointerId);}catch(x){}});
ec.addEventListener("pointermove",function(e){if(!drag)return;var a=pa(e),d=a-last;if(d>180)d-=360;if(d<-180)d+=360;ang+=d;vel=d;last=a;});
function end(){drag=false;}
ec.addEventListener("pointerup",end);ec.addEventListener("pointercancel",end);
(function spin(){if(!drag){ang+=vel;vel+=(auto-vel)*.02;}ec.style.transform="rotate("+ang+"deg)";requestAnimationFrame(spin);})();
var arc=document.getElementById("arc");
if(!matchMedia("(prefers-reduced-motion: reduce)").matches){
  addEventListener("pointermove",function(e){var x=e.clientX/innerWidth-.5,y=e.clientY/innerHeight-.5;
    arc.style.transform="translateX(calc(-50% + "+(x*26)+"px)) translateY("+(y*16)+"px)";});
}
})();
(function(){
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* hero stars: twinkling dots and shooting stars */
var cv=document.getElementById("stars"),hero=cv.parentNode,ctx=cv.getContext("2d"),W=0,H=0,P=[],S=[],K=[],dpr=Math.min(devicePixelRatio||1,2);
var nextShot=performance.now()+2500;
var SHOT_COLORS=[[255,255,255],[201,188,255],[255,160,205],[150,255,215]];
function make(){P=[];var n=Math.round(W*H/8000);for(var i=0;i<n;i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.3+.3,vx:-(Math.random()*.3+.06),vy:-(Math.random()*.12),a:Math.random()*6.28,tw:Math.random()*.03+.01,big:Math.random()<.05});}
function size(){W=hero.clientWidth;H=hero.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);make();draw();}
function shoot(){
  var ang=(24+Math.random()*18)*Math.PI/180,sp=9+Math.random()*6;
  S.push({x:W*(.35+Math.random()*.7),y:-10+Math.random()*H*.35,vx:-Math.cos(ang)*sp,vy:Math.sin(ang)*sp,len:130+Math.random()*130,life:0,max:55+Math.random()*35,c:SHOT_COLORS[Math.floor(Math.random()*SHOT_COLORS.length)]});
}
function draw(){
  ctx.clearRect(0,0,W,H);
  P.forEach(function(p){
    var al=.35+.65*Math.abs(Math.sin(p.a));
    ctx.fillStyle="rgba(225,220,255,"+al+")";
    ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.283);ctx.fill();
    if(p.big){
      ctx.strokeStyle="rgba(225,220,255,"+(al*.6)+")";ctx.lineWidth=.8;
      ctx.beginPath();ctx.moveTo(p.x-5,p.y);ctx.lineTo(p.x+5,p.y);ctx.moveTo(p.x,p.y-5);ctx.lineTo(p.x,p.y+5);ctx.stroke();
    }
  });
  K.forEach(function(k){ctx.fillStyle="rgba("+k.c+","+Math.max(0,k.l)+")";ctx.beginPath();ctx.arc(k.x,k.y,k.r,0,6.283);ctx.fill();});
  S.forEach(function(s){
    var sp=Math.sqrt(s.vx*s.vx+s.vy*s.vy),tx=s.x-s.vx/sp*s.len,ty=s.y-s.vy/sp*s.len,c=s.c.join(",");
    var fade=Math.min(1,s.life/10)*Math.min(1,(s.max-s.life)/20);
    var g=ctx.createLinearGradient(s.x,s.y,tx,ty);
    g.addColorStop(0,"rgba("+c+","+(.95*fade)+")");g.addColorStop(.35,"rgba("+c+","+(.35*fade)+")");g.addColorStop(1,"rgba("+c+",0)");
    ctx.lineCap="round";ctx.strokeStyle=g;
    ctx.globalAlpha=.3;ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(tx,ty);ctx.stroke();
    ctx.globalAlpha=1;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.x,s.y);ctx.lineTo(tx,ty);ctx.stroke();
    ctx.save();ctx.shadowColor="rgba("+c+",1)";ctx.shadowBlur=14;ctx.fillStyle="rgba(255,255,255,"+fade+")";
    ctx.beginPath();ctx.arc(s.x,s.y,2.2,0,6.283);ctx.fill();ctx.restore();
  });
}
function step(){
  P.forEach(function(p){p.x+=p.vx;p.y+=p.vy;p.a+=p.tw;if(p.x<-10){p.x=W+10;p.y=Math.random()*H;}if(p.y<-10){p.y=H+10;}if(p.y>H+10){p.y=-10;p.x=Math.random()*W;}});
  var now=performance.now();
  if(now>nextShot){shoot();nextShot=now+1400+Math.random()*3200;}
  S.forEach(function(s){
    s.x+=s.vx;s.y+=s.vy;s.life++;
    if(Math.random()<.7)K.push({x:s.x,y:s.y,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,l:.8,r:Math.random()*1.1+.3,c:s.c.join(",")});
  });
  S=S.filter(function(s){return s.life<s.max&&s.x>-s.len&&s.y<H+s.len;});
  K.forEach(function(k){k.x+=k.vx;k.y+=k.vy;k.l-=.03;});
  K=K.filter(function(k){return k.l>0;});
}
(function frame(){if(!reduce&&scrollY<H*1.1){step();draw();}requestAnimationFrame(frame);})();
addEventListener("resize",size);size();
/* rotatable circle of skills */
var o=document.getElementById("orbit"),nodes=[].slice.call(o.querySelectorAll(".node")),ang=0,vel=reduce?0:.25,drag=false,last=0;
function place(){
  var outer=nodes.filter(function(n){return !n.classList.contains("inner");}),
      inner=nodes.filter(function(n){return n.classList.contains("inner");}),
      w=o.clientWidth;
  function put(list,r,dir){
    list.forEach(function(n,i){
      var a=(dir*ang+i*360/list.length)*Math.PI/180;
      n.style.transform="translate(-50%,-50%) translate("+(Math.cos(a)*r)+"px,"+(Math.sin(a)*r)+"px)";
    });
  }
  put(outer,w/2*.99,1);
  put(inner,w*.31,-1);
}
function pa(e){var b=o.getBoundingClientRect();return Math.atan2(e.clientY-b.top-b.height/2,e.clientX-b.left-b.width/2)*180/Math.PI;}
o.addEventListener("pointerdown",function(e){drag=true;last=pa(e);vel=0;try{o.setPointerCapture(e.pointerId);}catch(x){}});
o.addEventListener("pointermove",function(e){if(!drag)return;var a=pa(e),d=a-last;if(d>180)d-=360;if(d<-180)d+=360;ang+=d;vel=d;last=a;});
function end(){if(!drag)return;drag=false;if(reduce){vel=0;}else if(Math.abs(vel)<.25){vel=vel<0?-.25:.25;}}
o.addEventListener("pointerup",end);o.addEventListener("pointercancel",end);
(function loop(){if(!drag){ang+=vel;if(Math.abs(vel)>.3)vel*=.97;}place();requestAnimationFrame(loop);})();
})();
/* Reusable pop-up: call showPopup({...}) from anywhere */
var PROJECTS={
  java:{title:"Java projects",text:"Click a project to open it.",items:[
    {name:"Library Management System",tag:"Java · OOP",link:"https://github.com/your-username/library-system"},
    {name:"Bank Account Simulator",tag:"Java · Classes",link:"https://github.com/your-username/bank-app"},
    {name:"Tic-Tac-Toe Game",tag:"Java · Logic",link:"https://github.com/your-username/tic-tac-toe"}
  ]},
  python:{title:"Python projects",text:"Click a project to open it.",items:[
    {name:"Face Detection App",tag:"Python · OpenCV",link:"https://github.com/your-username/face-detection"},
    {name:"Image Filters and Edge Detection",tag:"Python · OpenCV",link:"https://github.com/your-username/image-filters"},
    {name:"Number Guessing Game",tag:"Python",link:"https://github.com/your-username/number-guessing-game"}
  ]}
};
(function(){
var modal,last;
function build(){
  modal=document.createElement("div");
  modal.className="modal";modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");
  modal.innerHTML='<div class="modal-box"><button class="modal-x" type="button" aria-label="Close">×</button><h3></h3><p></p><ul class="plist"></ul></div>';
  document.body.appendChild(modal);
  modal.addEventListener("click",function(e){if(e.target===modal||e.target.closest(".modal-x"))closePopup();});
  addEventListener("keydown",function(e){if(e.key==="Escape")closePopup();});
}
window.showPopup=function(o){
  if(!modal)build();
  o=o||{};
  modal.querySelector("h3").textContent=o.title||"";
  var p=modal.querySelector("p");p.textContent=o.text||"";p.style.display=o.text?"":"none";
  var ul=modal.querySelector("ul");ul.innerHTML="";
  (o.items||[]).forEach(function(it){
    var li=document.createElement("li"),a=document.createElement("a");
    a.href=it.link||"#";
    if(it.link&&it.link!=="#"){a.target="_blank";a.rel="noopener";}
    a.textContent=it.name;
    if(it.tag){var s=document.createElement("span");s.textContent=it.tag;a.appendChild(s);}
    li.appendChild(a);ul.appendChild(li);
  });
  ul.style.display=(o.items&&o.items.length)?"":"none";
  last=document.activeElement;
  modal.classList.add("open");document.body.style.overflow="hidden";
  modal.querySelector(".modal-x").focus();
};
window.closePopup=function(){
  if(!modal||!modal.classList.contains("open"))return;
  modal.classList.remove("open");document.body.style.overflow="";
  if(last&&last.focus)last.focus();
};
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-popup]");
  if(b&&PROJECTS[b.getAttribute("data-popup")])showPopup(PROJECTS[b.getAttribute("data-popup")]);
});
})();
/* Cursor effect */
(function(){
if(!matchMedia("(hover:hover) and (pointer:fine)").matches||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var dot=document.createElement("div"),ring=document.createElement("div"),glow=document.createElement("div");
dot.className="cur-dot";ring.className="cur-ring";glow.className="cur-glow";
document.body.append(glow,ring,dot);
var mx=innerWidth/2,my=innerHeight/2,rx=mx,ry=my,gx=mx,gy=my,lastSp=0;
addEventListener("pointermove",function(e){
  mx=e.clientX;my=e.clientY;document.body.classList.add("cur-on");
  ring.classList.toggle("big",!!(e.target.closest&&e.target.closest("a,button,.orbit,.glass,.ufo")));
  var t=performance.now();if(t-lastSp<30)return;lastSp=t;
  var s=document.createElement("i");s.className="cur-spark";
  s.style.left=mx+"px";s.style.top=my+"px";
  s.style.setProperty("--dx",(Math.random()*44-22)+"px");
  s.style.setProperty("--dy",(Math.random()*40+8)+"px");
  document.body.appendChild(s);setTimeout(function(){s.remove();},800);
});
document.documentElement.addEventListener("mouseleave",function(){document.body.classList.remove("cur-on");});
(function cur(){
  rx+=(mx-rx)*.18;ry+=(my-ry)*.18;gx+=(mx-gx)*.08;gy+=(my-gy)*.08;
  dot.style.transform="translate("+mx+"px,"+my+"px)";
  ring.style.transform="translate("+rx+"px,"+ry+"px)";
  glow.style.transform="translate("+gx+"px,"+gy+"px)";
  requestAnimationFrame(cur);
})();
})();

/* Alien spaceship */
(function(){
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
var msgs=["Hi! I'm Lem!","Hello human! 👽","Why you touch me!","Nice portfolio!","Hey!","I come in peace… and for the projects."];
var ufo=document.createElement("div");
ufo.className="ufo";
ufo.setAttribute("role","img");ufo.setAttribute("aria-label","A small alien spaceship. Click it.");
ufo.innerHTML=`<div class="ufo-msg"></div><svg viewBox="0 0 120 130" width="90" height="98" aria-hidden="true">
<defs>
<linearGradient id="ufoB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3deff"/><stop offset="1" stop-color="#5a4bff"/></linearGradient>
<linearGradient id="ufoBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9ffe6" stop-opacity=".75"/><stop offset="1" stop-color="#b9ffe6" stop-opacity="0"/></linearGradient>
</defs>
<polygon class="ufo-beam" points="45,54 75,54 98,128 22,128" fill="url(#ufoBeam)" opacity="0"/>
<path d="M38 40 A22 24 0 0 1 82 40 Z" fill="rgba(160,255,230,.35)" stroke="#b9ffe6" stroke-width="1.5"/>
<circle cx="60" cy="31" r="9" fill="#6dffb0"/>
<ellipse cx="56" cy="30" rx="2.2" ry="3.2" fill="#0a0a2a" transform="rotate(-15 56 30)"/>
<ellipse cx="64" cy="30" rx="2.2" ry="3.2" fill="#0a0a2a" transform="rotate(15 64 30)"/>
<ellipse cx="60" cy="43" rx="52" ry="13" fill="url(#ufoB)" stroke="#fff" stroke-opacity=".5"/>
<ellipse cx="60" cy="54" rx="18" ry="4" fill="#7a5cff" opacity=".6"/>
<circle class="l" cx="28" cy="46" r="3" fill="#ffe27a"/>
<circle class="l" style="animation-delay:.2s" cx="60" cy="50" r="3" fill="#ffe27a"/>
<circle class="l" style="animation-delay:.4s" cx="92" cy="46" r="3" fill="#ffe27a"/>
</svg>`;
document.body.appendChild(ufo);
var beam=ufo.querySelector(".ufo-beam"),msg=ufo.querySelector(".ufo-msg"),anim,banim,talking=false,k=0;
function fly(){
  var vw=innerWidth,vh=innerHeight,dir=Math.random()<.5?-1:1;
  var x0=vw*(.15+Math.random()*.65),y0=Math.max(140,vh*(.2+Math.random()*.45));
  var dx=dir*vw*(.1+Math.random()*.15),a=14+Math.random()*14,dur=7000;
  function t(x,y,s,r){return "translate("+x+"px,"+y+"px) scale("+s+") rotate("+r+"deg)";}
  ufo.style.display="block";
  anim=ufo.animate([
    {transform:t(x0,y0,0,0),opacity:0,offset:0},
    {transform:t(x0+dx*.12,y0-a,1,dir*8),opacity:1,offset:.12},
    {transform:t(x0+dx*.4,y0+a,1,-dir*8),opacity:1,offset:.4},
    {transform:t(x0+dx*.7,y0-a,1,dir*8),opacity:1,offset:.7},
    {transform:t(x0+dx*.88,y0+a/2,1,0),opacity:1,offset:.88},
    {transform:t(x0+dx,y0,0,0),opacity:0,offset:1}
  ],{duration:dur,easing:"ease-in-out"});
  banim=beam.animate([{opacity:0,offset:0},{opacity:0,offset:.38},{opacity:.8,offset:.48},{opacity:0,offset:.62},{opacity:0,offset:1}],{duration:dur});
  anim.onfinish=function(){ufo.style.display="none";msg.classList.remove("show");talking=false;setTimeout(fly,9000+Math.random()*10000);};
}
ufo.addEventListener("click",function(){
  if(talking||!anim)return;talking=true;
  msg.textContent=msgs[k++%msgs.length];msg.classList.add("show");
  anim.pause();banim.pause();
  setTimeout(function(){msg.classList.remove("show");talking=false;anim.play();banim.play();},2600);
});
setTimeout(fly,3000+Math.random()*3000);
})();
/* Stop placeholder links (href="#") from jumping to the top 
document.addEventListener("click",function(e){
  var a=e.target.closest&&e.target.closest('a[href="#"]');
  if(a)e.preventDefault();
});*/
/* Contact form */
(function(){
var f=document.getElementById("lead");if(!f)return;
var out=f.querySelector(".lead-msg"),btn=f.querySelector("button");
f.addEventListener("submit",function(e){
  e.preventDefault();btn.disabled=true;out.textContent="Sending…";
  fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Accept":"application/json"},body:new FormData(f)})
    .then(function(r){return r.json();})
    .then(function(d){out.textContent=d.success?"Thank you! I’ll get back to you soon.":"Something went wrong. Please try again.";if(d.success)f.reset();})
    .catch(function(){out.textContent="Network error. Please try again.";})
    .then(function(){btn.disabled=false;});
});
})();
/* Baby robot on the footer line */
(function(){
var track=document.getElementById("botTrack"),bot=document.getElementById("bot");
if(!track||!bot)return;
var BW=56,x=track.clientWidth*.5-BW/2,state="sit",timer;
bot.style.left=x+"px";
if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
function pos(){return bot.getBoundingClientRect().left-track.getBoundingClientRect().left;}
function go(s){
  clearTimeout(timer);
  x=pos();bot.style.transition="none";bot.style.left=x+"px";
  state=s;bot.setAttribute("data-s",s);
  var d=3500;
  if(s==="walk"){
    var max=track.clientWidth-BW,tx=Math.random()*max;
    if(Math.abs(tx-x)<80)tx=x<max/2?x+Math.min(160,max-x):x-Math.min(160,x);
    d=Math.abs(tx-x)/38*1000+200;
    void bot.offsetWidth;
    bot.style.transition="left "+(d-200)+"ms linear";bot.style.left=tx+"px";
  }else if(s==="wave")d=2400;
  else if(s==="read"||s==="sleep")d=5200;
  else if(s==="jump")d=1500;
  timer=setTimeout(next,d);
}
function next(){
  var pool=["sit","walk","wave","read","sleep","jump","walk"].filter(function(s){return s!==state;});
  go(pool[Math.floor(Math.random()*pool.length)]);
}
bot.addEventListener("click",function(){go("jump");});
addEventListener("resize",function(){
  if(state==="walk")return;
  var m=track.clientWidth-BW;
  if(x>m){x=Math.max(0,m);bot.style.transition="none";bot.style.left=x+"px";}
});
timer=setTimeout(next,1800);
})();
/* Typing effect: add class="typing" to any element. Replays every time it scrolls into view. */
(function(){
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".typing").forEach(function(el){
  var text=el.textContent.trim();
  el.setAttribute("aria-label",text);
  if(reduce)return;
  el.textContent="";
  var chars=[];
  var words=text.split(" ");
  words.forEach(function(w,wi){
    var word=document.createElement("span");
    word.className="tw";word.setAttribute("aria-hidden","true");
    w.split("").forEach(function(ch){
      var c=document.createElement("span");
      c.className="c";c.textContent=ch;
      word.appendChild(c);chars.push(c);
    });
    el.appendChild(word);
    if(wi<words.length-1)el.appendChild(document.createTextNode(" "));
  });
  var timer=null,playing=false;
  function reset(){
    clearTimeout(timer);
    chars.forEach(function(c){c.classList.remove("on","last");});
  }
  function run(){
    reset();
    var i=0,last=null;
    (function tick(){
      if(i>=chars.length){timer=setTimeout(function(){if(last)last.classList.remove("last");},2500);return;}
      if(last)last.classList.remove("last");
      last=chars[i++];last.classList.add("on","last");
      timer=setTimeout(tick,45+Math.random()*55);
    })();
  }
  var io=new IntersectionObserver(function(es){
    var e=es[es.length-1];
    if(e.intersectionRatio>=.8&&!playing){playing=true;run();}
    else if(!e.isIntersecting&&playing){playing=false;reset();}
  },{threshold:[0,.8]});
  io.observe(el);
});
})();
/* Scroll animations for page blocks (replays every time they scroll into view) */
(function(){
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* [selector, animation]  animations: up, left, right, zoom, flip, alt (left/right alternating) */
var GROUPS=[
  ["section .head","up"],
  [".skills > *","zoom"],
  [".work > *","alt"],
  [".about > *","alt"],
  [".now","zoom"],
  [".timeline > *","alt"],
  [".gh > *","zoom"],
  [".lead > *","up"],
  [".foot-top > *","up"],
  [".foot-bottom","up"]
];
var items=[];
document.querySelectorAll("[data-fx]").forEach(function(el,i){
  el.classList.remove("rv");el.classList.add("fx");el.setAttribute("data-i",i);items.push(el);
});
GROUPS.forEach(function(g){
  document.querySelectorAll(g[0]).forEach(function(el,i){
    if(el.classList.contains("fx"))return;
    var kind=g[1]==="alt"?(i%2?"right":"left"):g[1];
    el.classList.remove("rv");el.classList.add("fx");
    el.setAttribute("data-fx",kind);el.setAttribute("data-i",i);items.push(el);
  });
});
if(reduce){items.forEach(function(el){el.classList.add("in");});return;}
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){
    var el=e.target,d=(parseInt(el.getAttribute("data-i"),10)%6)*90;
    if(e.isIntersecting&&!el.classList.contains("in")){
      el.style.transitionDelay=d+"ms";
      el.classList.add("in");
      clearTimeout(el._t);
      el._t=setTimeout(function(){el.classList.add("done");el.style.transitionDelay="";},900+d);
    }else if(!e.isIntersecting&&el.classList.contains("in")){
      clearTimeout(el._t);
      el.classList.remove("in","done");el.style.transitionDelay="";
    }
  });
},{threshold:.12});
items.forEach(function(el){io.observe(el);});
})();

/* Copy-to-clipboard buttons: add data-copy="text" to any button */
(function(){
var toast=document.createElement("div");
toast.className="toast";toast.setAttribute("role","status");
document.body.appendChild(toast);
var t;
function say(m){toast.textContent=m;toast.classList.add("show");clearTimeout(t);t=setTimeout(function(){toast.classList.remove("show");},1800);}
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-copy]");
  if(!b)return;
  var v=b.getAttribute("data-copy");
  function fallback(){
    var ta=document.createElement("textarea");
    ta.value=v;ta.style.position="fixed";ta.style.opacity="0";
    document.body.appendChild(ta);ta.select();
    try{document.execCommand("copy");say("Copied: "+v);}catch(x){say("Press Ctrl+C to copy: "+v);}
    ta.remove();
  }
  if(navigator.clipboard&&window.isSecureContext){
    navigator.clipboard.writeText(v).then(function(){say("Copied: "+v);},fallback);
  }else fallback();
});
})();

/* Intro loading screen */
(function(){
var ONCE_PER_SESSION=true; /* false = show it every time browser tab */
var intro=document.getElementById("intro");
if(!intro)return;
function done(){document.dispatchEvent(new Event("introdone"));}
var seen=false;
try{seen=ONCE_PER_SESSION&&sessionStorage.getItem("introSeen");}catch(e){}
if(seen||matchMedia("(prefers-reduced-motion: reduce)").matches){intro.remove();done();return;}
function flyName(){
  var nm=intro.querySelector(".intro-name"),logo=document.querySelector("nav.bar .logo");
  if(!nm||!logo)return;
  var a=nm.getBoundingClientRect(),b=logo.getBoundingClientRect(),ns=getComputedStyle(nm),ls=getComputedStyle(logo);
  var ph=document.createElement("div");
  ph.style.cssText="width:"+a.width+"px;height:"+a.height+"px";
  nm.parentNode.insertBefore(ph,nm);
  logo.style.visibility="hidden";
  nm.style.animation="none";
  nm.style.cssText+=";position:fixed;z-index:210;margin:0;white-space:nowrap;left:"+a.left+"px;top:"+a.top+"px;font-size:"+ns.fontSize+";letter-spacing:"+ns.letterSpacing+";padding-left:"+ns.paddingLeft+";";
  document.body.appendChild(nm);
  void nm.offsetWidth;
  var ease=" 1s cubic-bezier(.65,0,.25,1)";
  nm.style.transition="left"+ease+",top"+ease+",font-size"+ease+",letter-spacing"+ease+",padding-left"+ease;
  nm.style.left=b.left+"px";nm.style.top=b.top+"px";
  nm.style.fontSize=ls.fontSize;nm.style.letterSpacing=ls.letterSpacing;nm.style.paddingLeft="0px";
  setTimeout(function(){logo.style.visibility="";nm.remove();},1050);
}
function close(){
  if(intro.classList.contains("out"))return;
  flyName();
  intro.classList.add("out");
  try{sessionStorage.setItem("introSeen","1");}catch(e){}
  setTimeout(function(){intro.remove();done();},750);
}
setTimeout(close,2400);
intro.addEventListener("click",close);
})();

/* Rotating role text in the hero */
(function(){
var el=document.getElementById("role");
if(!el)return;
var roles=(el.getAttribute("data-roles")||"").split("|").filter(Boolean);
if(!roles.length)return;
if(matchMedia("(prefers-reduced-motion: reduce)").matches){
  el.textContent=roles[0];
  var cc=document.querySelector(".role-caret");if(cc)cc.style.display="none";
  return;
}
var r=0,i=0,del=false,started=false;
function tick(){
  var word=roles[r];
  if(!del){
    i++;el.textContent=word.slice(0,i);
    if(i===word.length){del=true;setTimeout(tick,1600);return;}
    setTimeout(tick,80);
    return;
  }
  i--;el.textContent=word.slice(0,i);
  if(i===0){del=false;r=(r+1)%roles.length;setTimeout(tick,350);return;}
  setTimeout(tick,40);
}
function start(){if(started)return;started=true;tick();}
if(document.getElementById("intro")){
  document.addEventListener("introdone",start);
  setTimeout(start,5000);
}else start();
})();

/* Scroll progress bar */
(function(){
var bar=document.getElementById("progress");
if(!bar)return;
function upd(){
  var h=document.documentElement.scrollHeight-innerHeight;
  bar.style.transform="scaleX("+(h>0?Math.min(1,scrollY/h):0)+")";
}
addEventListener("scroll",upd,{passive:true});
addEventListener("resize",upd);
upd();
})();

/* Highlight the current section in the menu */
(function(){
var links=[].slice.call(document.querySelectorAll(".links a[href^='#']"));
if(!links.length||!("IntersectionObserver" in window))return;
var map={};
links.forEach(function(a){map[a.getAttribute("href").slice(1)]=a;});
function mark(id){links.forEach(function(a){a.classList.toggle("active",map[id]===a);});}
var opts={rootMargin:"-45% 0px -50% 0px"};
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting)mark(e.target.id);});
},opts);
document.querySelectorAll("section[id]").forEach(function(s){io.observe(s);});
var hero=document.getElementById("top");
if(hero)new IntersectionObserver(function(es){if(es[0].isIntersecting)mark("");},opts).observe(hero);
})();

/* Robot jumps when you reach the bottom of the page */
(function(){
var bot=document.getElementById("bot"),end=document.querySelector(".foot-bottom");
if(!bot||!end||!("IntersectionObserver" in window))return;
var inView=false,last=0;
new IntersectionObserver(function(es){
  var vis=es[0].isIntersecting;
  if(vis&&!inView&&Date.now()-last>12000){last=Date.now();setTimeout(function(){bot.click();},500);}
  inView=vis;
},{threshold:1}).observe(end);
})();


/* Ambient space sound: starts on the visitor's first click, tap or key press. They can turn it off. */
(function(){
var btn=document.getElementById("sound");
if(!btn)return;
var AC=window.AudioContext||window.webkitAudioContext;
if(!AC){btn.style.display="none";return;}
var lbl=btn.querySelector(".lbl"),ctx,master,on=false,muted=false;
window.soundIsOn=function(){return on;};
try{muted=localStorage.getItem("sound")==="off";}catch(e){}
function save(v){try{localStorage.setItem("sound",v);}catch(e){}}
var verb,ci=0,lastT=-99;
var chords=[[146.83,220,293.66,369.99],[130.81,196,261.63,329.63],[110,164.81,220,277.18],[123.47,185,246.94,311.13]];
function build(){
  ctx=new AC();
  master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
  verb=ctx.createConvolver();
  var len=ctx.sampleRate*2.6,ib=ctx.createBuffer(2,len,ctx.sampleRate);
  for(var c=0;c<2;c++){var d=ib.getChannelData(c);for(var i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.4);}
  verb.buffer=ib;
  var vg=ctx.createGain();vg.gain.value=.7;verb.connect(vg);vg.connect(master);
  setInterval(chord,6000);
}
function pad(f,t,dur,v){
  var o=ctx.createOscillator(),g=ctx.createGain();
  o.type="sine";o.frequency.value=f;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);
  o.connect(g);g.connect(master);g.connect(verb);o.start(t);o.stop(t+dur+.1);
}
function chord(){
  if(!on||!ctx||ctx.state!=="running")return;
  var t=ctx.currentTime;if(t-lastT<3)return;lastT=t;
  chords[ci++%4].forEach(function(f){pad(f,t,9,.06);pad(f*1.005,t,9,.04);});
}
function fade(to){
  var t=ctx.currentTime;
  master.gain.cancelScheduledValues(t);
  master.gain.setValueAtTime(master.gain.value,t);
  master.gain.linearRampToValueAtTime(to,t+1.2);
}
function ui(state){
  btn.classList.remove("pending");
  btn.classList.toggle("on",state);
  btn.setAttribute("aria-pressed",state);
  lbl.textContent=state?"Sound on":"Sound off";
  btn.classList.add("peek");
  clearTimeout(btn._pk);
  btn._pk=setTimeout(function(){btn.classList.remove("peek");},2000);
}
function start(){
  if(!ctx)build();
  on=true;var r=ctx.resume();if(r&&r.then)r.then(chord);fade(.3);ui(true);
}
function stop(){
  on=false;fade(0);ui(false);
  setTimeout(function(){if(!on)ctx.suspend();},1400);
}
btn.addEventListener("click",function(){
  if(on){muted=true;save("off");stop();}
  else{muted=false;save("on");start();}
});
var evs=["pointerdown","keydown","touchend","click"];
function off(){evs.forEach(function(n){document.removeEventListener(n,gesture,true);});}
function gesture(e){
  if(btn.contains(e.target))return;
  if(muted){off();return;}
  start();
  if(ctx.state==="running")off();
}
if(muted){ui(false);}
else{evs.forEach(function(n){document.addEventListener(n,gesture,true);});}
document.addEventListener("visibilitychange",function(){
  if(!ctx||!on)return;
  if(document.hidden)ctx.suspend();else ctx.resume();
});
})();

/* Spaceship whoosh on buttons (only plays when the sound button is on) */
(function(){
var AC=window.AudioContext||window.webkitAudioContext;
if(!AC)return;
var sx,nbuf,last=0;
function whoosh(){
  if(typeof window.soundIsOn!=="function"||!window.soundIsOn())return;
  var now=Date.now();if(now-last<150)return;last=now;
  if(!sx)sx=new AC();
  if(sx.state==="suspended")sx.resume();
  if(!nbuf){
    var len=sx.sampleRate,d;
    nbuf=sx.createBuffer(1,len,sx.sampleRate);d=nbuf.getChannelData(0);
    for(var i=0;i<len;i++)d[i]=Math.random()*2-1;
  }
  var t=sx.currentTime,s=sx.createBufferSource(),bp=sx.createBiquadFilter(),g=sx.createGain();
  s.buffer=nbuf;bp.type="bandpass";bp.Q.value=2;
  bp.frequency.setValueAtTime(300,t);bp.frequency.exponentialRampToValueAtTime(3000,t+.55);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.22,t+.2);g.gain.exponentialRampToValueAtTime(.0001,t+.6);
  s.connect(bp);bp.connect(g);g.connect(sx.destination);s.start(t);s.stop(t+.65);
}
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("a.pill,button.pill,.viewbtn,.totop");
  if(b)whoosh();
});
})();

/* Robot jobs: greeter, tour guide and joke teller */
(function(){
var bot=document.getElementById("bot"),track=document.getElementById("botTrack");
if(!bot||!track)return;
var NAME="Bit"; /* change the robot's name here */
var tips=[
  "Hey! Press the ♪ button for space sounds.",
  "Need a resume? Hit “Download CV” in the footer.",
  "Secret code: ↑ ↑ ↓ ↓ ← → ← → B A",
  "Iman is open to internships. Say hello!",
  "Try dragging the skill circle. It spins!"
];
var facts=[
  "Why do programmers prefer dark mode? Light attracts bugs.",
  "There are 10 kinds of people: those who know binary and those who don’t.",
  "I would tell you a UDP joke, but you might not get it.",
  "A SQL query walks into a bar and asks two tables: “Can I join you?”",
  "My favourite snack is a byte."
];
var say=document.createElement("div");
say.className="bot-say";say.setAttribute("role","status");
(bot.querySelector(".bot-in")||bot).appendChild(say);
var hideT,lastSpeak=Date.now(),ti=0,fi=0,greeted=false;
function asleep(){return bot.getAttribute("data-s")==="sleep";}
new MutationObserver(function(){if(asleep()){clearTimeout(hideT);say.classList.remove("show");}}).observe(bot,{attributes:true,attributeFilter:["data-s"]});
function speak(text){
  if(asleep())return;
  clearTimeout(hideT);
  say.textContent=text;
  var r=bot.getBoundingClientRect(),cx=r.left+r.width/2,half=say.offsetWidth/2,dx=0;
  if(cx-half<8)dx=8-(cx-half);
  else if(cx+half>innerWidth-8)dx=innerWidth-8-(cx+half);
  say.style.setProperty("--dx",dx+"px");
  say.classList.add("show");
  lastSpeak=Date.now();
  hideT=setTimeout(function(){say.classList.remove("show");},3600+text.length*35);
}
function visible(){var r=track.getBoundingClientRect();return r.top<innerHeight*.9&&r.bottom>0;}
function greet(){
  if(asleep()){greeted=false;return;}
  var h=new Date().getHours(),g=h<12?"Good morning":h<18?"Good afternoon":"Good evening";
  speak(g+"! I’m "+NAME+", the robot guarding this site.");
}
setInterval(function(){
   if(!visible()||asleep())return;
  if(!greeted){greeted=true;setTimeout(greet,900);return;}
  if(Date.now()-lastSpeak>12000&&!say.classList.contains("show"))speak(tips[ti++%tips.length]);
},1500);
bot.addEventListener("click",function(e){
  if(!e.isTrusted)return;
  greeted=true;
  speak(facts[fi++%facts.length]);
});
})();

/* 3D Earth with clouds, atmosphere glow, and space debris */
(function () {
  var cv = document.getElementById("planet");
  if (!cv) return;
  var wrap = cv.parentNode;
  if (typeof THREE === "undefined") {
    wrap.classList.add("nogl");
    return;
  }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true });
  } catch (e) {
    wrap.classList.add("nogl");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 0.15, 4.4);

  /* Dramatic side lighting */
  var sunDir = new THREE.Vector3(-4.5, 2.2, 2.8).normalize();
  var sun = new THREE.DirectionalLight(0xffffff, 2.6);
  sun.position.copy(sunDir).multiplyScalar(10);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0x1a2644, 0.22));

  /* Main tiltable container */
  var system = new THREE.Group();
  system.rotation.z = 0.22;
  scene.add(system);

  /* Textures */
  var TEX = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/planets/";
  var loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");

  var R = 1.05;
  var earthGeo = new THREE.SphereGeometry(R, 64, 64);
  var earthMat = new THREE.MeshPhongMaterial({
    map: loader.load(TEX + "earth_atmos_2048.jpg"),
    normalMap: loader.load(TEX + "earth_normal_2048.jpg"),
    normalScale: new THREE.Vector2(0.85, 0.85),
    specularMap: loader.load(TEX + "earth_specular_2048.jpg"),
    specular: new THREE.Color(0x2a4d7a),
    shininess: 18
  });
  var earth = new THREE.Mesh(earthGeo, earthMat);
  earth.rotation.y = -2.1;
  system.add(earth);

  /* Drifting cloud layer */
  var cloudGeo = new THREE.SphereGeometry(R * 1.016, 64, 64);
  var cloudMat = new THREE.MeshLambertMaterial({
    map: loader.load(TEX + "earth_clouds_1024.png"),
    transparent: true,
    opacity: 0.75,
    depthWrite: false
  });
  var clouds = new THREE.Mesh(cloudGeo, cloudMat);
  system.add(clouds);

  /* Blue atmospheric Fresnel rim glow */
  var atmoGeo = new THREE.SphereGeometry(R * 1.065, 64, 64);
  var atmoMat = new THREE.ShaderMaterial({
    uniforms: { uSun: { value: sunDir } },
    vertexShader: [
      "varying vec3 vNorm; varying vec3 vWorldNorm;",
      "void main(){",
      "  vNorm = normalize(normalMatrix * normal);",
      "  vWorldNorm = normalize(mat3(modelMatrix) * normal);",
      "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
      "}"
    ].join("\n"),
    fragmentShader: [
      "uniform vec3 uSun; varying vec3 vNorm; varying vec3 vWorldNorm;",
      "void main(){",
      "  float rim = pow(0.68 - dot(vNorm, vec3(0.0, 0.0, 1.0)), 3.2);",
      "  float lit = smoothstep(-0.35, 0.6, dot(vWorldNorm, uSun));",
      "  vec3 col = vec3(0.32, 0.66, 1.0) * rim * (0.25 + 0.95 * lit);",
      "  gl_FragColor = vec4(col, clamp(rim * (0.35 + 0.8 * lit), 0.0, 0.95));",
      "}"
    ].join("\n"),
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  system.add(new THREE.Mesh(atmoGeo, atmoMat));

  /* Space debris cloud (white/silver fragments only) */
  var debrisCount = 900;
  var dPos = new Float32Array(debrisCount * 3);
  var dCol = new Float32Array(debrisCount * 3);
  for (var i = 0; i < debrisCount; i++) {
    var u = Math.random();
    var v = Math.random();
    var theta = u * 2.0 * Math.PI;
    var phi = Math.acos(2.0 * v - 1.0);
    var dist = R * (1.07 + Math.pow(Math.random(), 1.9) * 0.42);
    dPos[i * 3]     = dist * Math.sin(phi) * Math.cos(theta);
    dPos[i * 3 + 1] = dist * Math.cos(phi);
    dPos[i * 3 + 2] = dist * Math.sin(phi) * Math.sin(theta);

    var b = 0.55 + Math.random() * 0.45;
    dCol[i * 3]     = b;
    dCol[i * 3 + 1] = b;
    dCol[i * 3 + 2] = Math.min(1.0, b * 1.05);
  }
  var debrisGeo = new THREE.BufferGeometry();
  debrisGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
  debrisGeo.setAttribute("color", new THREE.BufferAttribute(dCol, 3));
  var debrisMat = new THREE.PointsMaterial({
    size: 0.018,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    sizeAttenuation: true
  });
  var debris = new THREE.Points(debrisGeo, debrisMat);
  system.add(debris);

  /* Drag to rotate smoothly */
  var drag = false, px = 0, py = 0, vx = 0, vy = 0;
  cv.addEventListener("pointerdown", function (e) {
    drag = true; px = e.clientX; py = e.clientY;
    cv.setPointerCapture && cv.setPointerCapture(e.pointerId);
  });
  cv.addEventListener("pointermove", function (e) {
    if (!drag) return;
    var dx = e.clientX - px, dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    vx = dx * 0.005; vy = dy * 0.005;
    system.rotation.y += vx;
    system.rotation.x = Math.max(-0.8, Math.min(0.8, system.rotation.x + vy));
  });
  function stopDrag() { drag = false; }
  cv.addEventListener("pointerup", stopDrag);
  cv.addEventListener("pointercancel", stopDrag);

  /* Responsive sizing */
  function resize() {
    var w = Math.max(1, cv.clientWidth);
    var h = Math.max(1, cv.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  /* Animation loop */
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var vis = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(cv);
  }

  (function loop() {
    requestAnimationFrame(loop);
    if (!vis) return;

    if (!reduce) {
      earth.rotation.y += 0.0014;
      clouds.rotation.y += 0.0021;
      debris.rotation.y -= 0.0009;
      debris.rotation.x += 0.0003;
      if (!drag) {
        vx *= 0.94; vy *= 0.94;
        system.rotation.y += vx;
        system.rotation.x = Math.max(-0.8, Math.min(0.8, system.rotation.x + vy));
      }
    }
    renderer.render(scene, camera);
  })();
})();
