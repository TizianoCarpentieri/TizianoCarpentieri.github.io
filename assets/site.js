/* Scenes, the line, the live objects, copy buttons. Nothing here changes the size or the place of a block:
   scenes draw in an absolutely placed canvas, text is laid out in full from the start and only made visible,
   appearances are fades, and the line grows with a transform. */
(function(){
  var root=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');
  var when=function(el,fn,th){
    if(!el)return;
    if(reduce||!('IntersectionObserver' in window)){fn();return}
    new IntersectionObserver(function(es,o){if(es[0].isIntersecting){o.disconnect();fn()}},{threshold:th||.3}).observe(el);
  };

  /* fade in on scroll: opacity only */
  document.querySelectorAll('.rise').forEach(function(e){when(e,function(){e.classList.add('in')},.1)});

  /* scroll cue: appears after a moment, disappears once the reader scrolls */
  if(document.querySelector('.cue')){
    var scrolled=function(){root.classList.toggle('scrolled',(window.scrollY||root.scrollTop)>40)};
    addEventListener('scroll',scrolled,{passive:true});scrolled();
    setTimeout(function(){root.classList.add('ready')},reduce?0:1200);
  }

  /* copy buttons: fixed width, the label swaps in place */
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var lab=b.querySelector('.lab')||b, old=lab.textContent;
      var done=function(){lab.textContent=b.dataset.done;setTimeout(function(){lab.textContent=old},1600)};
      try{navigator.clipboard.writeText(b.dataset.copy).then(done,done)}catch(e){done()}
    });
  });

  /* the end: when the line reaches its dot, the dot lights and the signature is written in the order of the pen (penna.json).
     Each stroke runs inside a mask over the ink. A copy of the mask, drawn above, shows only a short stretch behind the tip:
     the fresh ink, in the colour of the line, which then slides off the end of the stroke.
     Once written the masks go, so the signature at rest is the file itself. Without script or with reduced motion it is whole from the start. */
  var foot=document.querySelector('footer'), sign=foot&&foot.querySelector('.sign'), landed=false, pens=[];
  var TRAIL=150, SETTLE=320, PEN='cubic-bezier(.4,.1,.4,1)'; /* fresh ink: its length in viewBox units, and how long it takes to slide off */
  var canWrite=!reduce&&sign&&sign.animate&&sign.querySelector('mask path')&&sign.querySelector('mask path').getTotalLength;
  if(canWrite){
    var mask=sign.querySelector('mask'), ink=sign.querySelector('use.ink'), fresh=mask.cloneNode(true), fu=ink.cloneNode(false);
    fresh.id='pen-fresh'; fu.setAttribute('class','fresh'); fu.setAttribute('mask','url(#pen-fresh)');
    mask.parentNode.insertBefore(fresh,mask); ink.parentNode.appendChild(fu);
    pens=[].slice.call(sign.querySelectorAll('mask path'));
    pens.forEach(function(p){var L=p.getTotalLength()+2;p.L=L;p.fresh=p.closest('mask')===fresh;
      p.style.strokeDasharray=p.fresh?TRAIL+' '+(L+TRAIL):L+' '+L;p.style.strokeDashoffset=p.fresh?TRAIL:L});
  }
  var land=function(){
    if(landed||!foot)return; landed=true; foot.classList.add('landed');
    if(!canWrite){foot.classList.add('written');return}
    var end=0;
    pens.forEach(function(p){
      var t=(+p.dataset.at+.35)*1000, d=+p.dataset.for*1000;
      if(p.fresh){end=Math.max(end,t+d+SETTLE);
        p.animate([{strokeDashoffset:TRAIL,easing:PEN},{strokeDashoffset:TRAIL-p.L,offset:d/(d+SETTLE),easing:'ease-out'},{strokeDashoffset:-p.L}],{delay:t,duration:d+SETTLE,fill:'forwards'})}
      else p.animate([{strokeDashoffset:p.L},{strokeDashoffset:0}],{delay:t,duration:d,easing:PEN,fill:'forwards'});
    });
    setTimeout(function(){foot.classList.add('written')},end+80);
  };

  /* the line: placed between the opening and the signature, it grows with the scroll; stations light when it reaches them, and so does its end */
  var page=document.querySelector('.page'), axis=page&&page.querySelector('.axis');
  if(axis){
    var fill=axis.firstElementChild, rows=[].slice.call(document.querySelectorAll('.row')), top=0, h=1, endAt=1e9;
    var abs=function(el){return el.getBoundingClientRect().top-page.getBoundingClientRect().top};
    var tick=function(){
      var reach=innerHeight*.78-page.getBoundingClientRect().top;
      fill.style.setProperty('--p',(reduce?1:Math.max(0,Math.min(1,(reach-top)/h))).toFixed(4));
      rows.forEach(function(r){r.classList.toggle('lit',reduce||abs(r)<reach)});
      if(!landed&&(reduce||reach>=endAt||innerHeight+(window.scrollY||root.scrollTop)>=root.scrollHeight-2))land();
    };
    var place=function(){
      var phone=innerWidth<=760, start=phone?document.querySelector('main'):document.querySelector('.axis-start'), end=document.querySelector('.end-dot');
      if(!start||!end)return;
      top=abs(start)+(phone?0:start.offsetHeight/2); h=Math.max(1,abs(end)-top+4); endAt=abs(end);
      axis.style.top=top+'px'; axis.style.height=h+'px'; tick();
    };
    addEventListener('scroll',tick,{passive:true}); addEventListener('resize',place);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(place);
    place();
  }
  else if(foot)when(foot,land,.3);

  /* typing: every character is placed from the start and only made visible */
  var type=function(el,opt){
    var text=el.textContent; el.textContent='';
    var ch=text.split('').map(function(c){var s=document.createElement('span');s.className='ch';s.textContent=c;el.appendChild(s);return s});
    var timers=[];
    var play=function(){
      timers.forEach(clearTimeout);timers=[];
      ch.forEach(function(c){c.className='ch'});
      if(opt.reset)opt.reset();
      var t=300;
      ch.forEach(function(c,i){t+=22+Math.random()*30;timers.push(setTimeout(function(){if(i)ch[i-1].classList.remove('cur');c.classList.add('v','cur')},t))});
      timers.push(setTimeout(function(){ch[ch.length-1].classList.remove('cur');opt.done()},t+500));
    };
    if(reduce){ch.forEach(function(c){c.className='ch v'});opt.done()}
    return {play:reduce?function(){}:play};
  };

  /* precision: each step adds words to the prompt and leaves lit only the expert on the line */
  var prec=document.querySelector('.prec');
  if(prec){
    var r=prec.querySelector('input'), segs=prec.querySelectorAll('.seg'), orbs=prec.querySelectorAll('.orb');
    var A=[[.5,.5,.5,.5,.5],[.12,.55,1,.12,0],[0,.22,1,0,0],[0,0,1,0,0]], auto=null, touched=false;
    var set=function(l){
      l=+l; prec.dataset.level=l; r.value=l;
      segs.forEach(function(s){s.classList.toggle('v',+s.dataset.l<=l)});
      orbs.forEach(function(o,i){o.style.setProperty('--a',A[l][i]);o.classList.toggle('lit',A[l][i]>.4)});
    };
    var stop=function(){touched=true;clearTimeout(auto)};
    r.addEventListener('input',function(){stop();set(r.value)});
    r.addEventListener('pointerdown',stop);
    var run=function(){if(touched)return;var l=+prec.dataset.level;auto=setTimeout(function(){set(l>=3?0:l+1);run()},l>=3?3600:1700)};
    set(reduce?3:0);
    if(!reduce)when(prec,run,.4);
  }

  /* press enter: the note is typed, sent across the line, and the clear version comes back */
  var raw=document.querySelector('.raw');
  if(raw){
    var res=document.querySelector('.result'), enter=document.querySelector('.enter'), t1;
    var ty=type(raw,{reset:function(){res.classList.remove('on');enter.classList.remove('go');clearTimeout(t1)},
      done:function(){enter.classList.add('go');t1=setTimeout(function(){res.classList.add('on');if(!reduce)t1=setTimeout(function(){ty.play()},13000)},reduce?0:450)}});
    enter.addEventListener('click',function(){ty.play()});
    when(raw,function(){ty.play()});
  }

  /* the cycle: a spark travels the ring; the move it passes lights up */
  var ring=document.querySelector('.ring');
  if(ring){
    var mv=document.querySelectorAll('.mv'), pts=ring.querySelectorAll('.pt'), sp=ring.querySelector('.spark'), cur=-1, t0=performance.now(), ringOn=false;
    var light=function(i){if(i===cur)return;cur=i;mv.forEach(function(m,k){m.classList.toggle('on',k===i)});pts.forEach(function(p,k){p.classList.toggle('on',k===i)})};
    if(reduce){mv.forEach(function(m){m.classList.add('on')});pts.forEach(function(p){p.classList.add('on')});sp.style.display='none'}
    else{
      var step=function(now){var th=((now-t0)/9600*360-90)%360,a=th*Math.PI/180;
        sp.setAttribute('cx',(100+90*Math.cos(a)).toFixed(2));sp.setAttribute('cy',(100+90*Math.sin(a)).toFixed(2));
        light(Math.round((th+90)/90)%4);if(ringOn)requestAnimationFrame(step)};
      light(0);
      if('IntersectionObserver' in window)new IntersectionObserver(function(e){var was=ringOn;ringOn=e[0].isIntersecting;if(ringOn&&!was)requestAnimationFrame(step)}).observe(ring);
      else{ringOn=true;requestAnimationFrame(step)}
    }
  }

  /* the film, when the page has one (film.js) */
  if(window.SSFilm)document.querySelectorAll('[data-film]').forEach(function(f){SSFilm(f,{labels:JSON.parse(f.dataset.labels),alt:f.dataset.alt})});

  /* scenes: each project picks one; the canvas is placed out of the flow, so layout never moves.
     A scene advances by S.k per draw (1 = one frame at full speed) and may read S.e, how far it has gone into depth (0 in the opening, 1 behind the content). */
  var hex=function(h){h=h.replace('#','');var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]};
  var SCENES={
    /* the flow: a disordered swarm enters from the left, crosses a luminous line and leaves in ordered files.
       In depth its band opens to most of the height, so the files fill the empty sides. */
    flow:function(S,cfg){
      var c=S.ctx,P=[],K=9,top,bot,t0,b0,mid,pal=['#8b6cff','#ff5fa8','#4cc3ff','#b9a6ff','#ff9ac6'], sig=cfg.signal, rgb=hex(sig);
      var laneY=function(k){return top+(k+.5)*(bot-top)/K};
      return {init:function(){
          var band=cfg.band&&S.host.querySelector(cfg.band), hr=S.host.getBoundingClientRect();
          if(band&&band.offsetHeight){var br=band.getBoundingClientRect();t0=br.top-hr.top+8+S.oy;b0=br.bottom-hr.top-8+S.oy}else{t0=S.H*.2;b0=S.H*.8}
          top=t0;bot=b0;mid=S.W/2; P=[]; var n=Math.round(Math.min(760,Math.max(160,S.W*(bot-top)/260)));
          for(var i=0;i<n;i++)P.push({x:Math.random()*S.W,y:top+Math.random()*(bot-top),vy:0,ph:Math.random()*6.28,c:i%pal.length,r:1+Math.random()*1.6,k:i%K});
          c.fillStyle='#0c0c10';c.fillRect(0,0,S.W,S.H)},
        draw:function(){var W=S.W,H=S.H,t=S.t/60,k=S.k,damp=Math.pow(.91,k);
          if(S.e){top=t0+(S.oy+H*.12-t0)*S.e;bot=b0+(H-S.oy-H*.12-b0)*S.e}else{top=t0;bot=b0}
          c.fillStyle='rgba(12,12,16,.2)';c.fillRect(0,0,W,H);
          for(var i=0;i<P.length;i++){var p=P[i];
            if(p.x<mid){p.vy+=(Math.sin(p.x*.013+t*1.4+p.ph)*.34+(Math.random()-.5)*.7)*k;p.vy*=damp;p.y+=p.vy*1.7*k;p.x+=(1.2+Math.sin(p.ph+t)*.9)*k;
              if(p.y<top)p.vy+=.6*k;if(p.y>bot)p.vy-=.6*k;
              var near=Math.max(0,1-(mid-p.x)/170);
              if(near>0){p.k=Math.max(0,Math.min(K-1,Math.round((p.y-top)/((bot-top)/K)-.5)));p.y+=(laneY(p.k)-p.y)*Math.min(1,.1*near*k)}
              c.globalAlpha=.85;c.fillStyle=pal[p.c];c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill();
            }else{p.y+=(laneY(p.k)-p.y)*Math.min(1,.22*k);p.x+=3*k;
              c.globalAlpha=.9;c.strokeStyle=sig;c.lineWidth=1.6;c.beginPath();c.moveTo(p.x-14,p.y);c.lineTo(p.x,p.y);c.stroke();
              if(p.x>W+16){p.x=-10-Math.random()*40;p.y=top+Math.random()*(bot-top);p.vy=0}}}
          c.globalAlpha=1;
          var g=c.createLinearGradient(0,top-30,0,bot+30);g.addColorStop(0,'rgba('+rgb+',0)');g.addColorStop(.5,'rgba(255,246,200,1)');g.addColorStop(1,'rgba('+rgb+',0)');
          c.shadowColor=sig;c.shadowBlur=30;c.fillStyle=g;c.fillRect(mid-1.5,top-30,3,bot-top+60);c.shadowBlur=0}};
    },
    /* the living network: regions of five colours, like areas of expertise; where the cursor passes, its region lights up.
       It listens to the whole window, so in depth the cursor still wakes it in the empty sides of the page. */
    network:function(S,cfg){
      var c=S.ctx,N=[],E=[],ptr={x:-999,y:-999,live:-999},spark=0,step=0;
      var PAL=[cfg.signal,'#ff9f5a','#ff5fa8','#8b6cff','#4cc3ff'].map(hex);
      var mix=function(a,b,w){return [0,1,2].map(function(i){return Math.round(a[i]*w+b[i]*(1-w))})};
      var move=function(x,y){var r=S.cv.getBoundingClientRect();if(!r.width||x<r.left||x>r.right||y<r.top||y>r.bottom)return;
        ptr.x=(x-r.left)*S.W/r.width;ptr.y=(y-r.top)*S.H/r.height;ptr.live=S.t};
      addEventListener('mousemove',function(e){move(e.clientX,e.clientY)},{passive:true});
      addEventListener('touchmove',function(e){move(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
      return {init:function(){N=[];E=[];var g=S.W<700?58:74,cols=Math.ceil(S.W/g)+1,rows=Math.ceil(S.H/g)+1,i,k,r,q;
          var sc=Math.max(2,Math.round(S.W/480)),sr=Math.max(2,Math.round(S.H/480)),seeds=[];
          for(r=0;r<sr;r++)for(q=0;q<sc;q++)seeds.push({x:(q+.5+(Math.random()-.5)*.6)*S.W/sc,y:(r+.5+(Math.random()-.5)*.6)*S.H/sr,c:PAL[(q+r*2)%PAL.length]});
          for(r=0;r<rows;r++)for(q=0;q<cols;q++){
            var ax=q*g+(r%2?g/2:0)+(Math.random()-.5)*g*.55,ay=r*g+(Math.random()-.5)*g*.55,d1=1e9,d2=1e9,c1,c2;
            for(k=0;k<seeds.length;k++){var d=Math.hypot(ax-seeds[k].x,ay-seeds[k].y);if(d<d1){d2=d1;c2=c1;d1=d;c1=seeds[k].c}else if(d<d2){d2=d;c2=seeds[k].c}}
            var cc=mix(c1,c2||c1,.5+.5*Math.min(1,(d2-d1)/(g*1.4)));
            N.push({ax:ax,ay:ay,ph:Math.random()*6.28,e:0,n:0,x:0,y:0,cs:'rgba('+cc+',',rest:'rgba('+cc+',.3)'})}
          var R=g*1.38;for(i=0;i<N.length;i++)for(k=i+1;k<N.length;k++){var dx=N[i].ax-N[k].ax,dy=N[i].ay-N[k].ay;if(dx*dx+dy*dy<R*R)E.push([i,k,N[i].cs])}},
        draw:function(){var W=S.W,H=S.H,t=S.t/60,i,n,e;
          /* with no cursor it wakes itself; in depth its path widens into the empty sides, where it can be seen */
          if(S.t-ptr.live>150){ptr.x=W*(.5+(.36+.12*S.e)*Math.sin(t*.55));ptr.y=H*(.5+.34*Math.sin(t*.83+1.2))}
          for(spark+=S.k;spark>=70;spark-=70){n=N[Math.floor(Math.random()*N.length)];n.e=Math.max(n.e,.9)}
          for(i=0;i<N.length;i++){n=N[i];n.x=n.ax+Math.sin(t*.6+n.ph)*7;n.y=n.ay+Math.cos(t*.5+n.ph*1.7)*7;var dx=n.x-ptr.x,dy=n.y-ptr.y;if(dx*dx+dy*dy<8100)n.e=1}
          for(step+=S.k;step>=3;step-=3){for(i=0;i<N.length;i++)N[i].n=Math.max(0,N[i].e*.9-.012);
            for(i=0;i<E.length;i++){e=E[i];var a=N[e[0]],b=N[e[1]];if(b.e*.68>a.n)a.n=b.e*.68;if(a.e*.68>b.n)b.n=a.e*.68}
            for(i=0;i<N.length;i++)N[i].e=N[i].n}
          c.clearRect(0,0,W,H);c.strokeStyle='rgba(255,255,255,.07)';c.lineWidth=1;c.beginPath();
          for(i=0;i<E.length;i++){e=E[i];c.moveTo(N[e[0]].x,N[e[0]].y);c.lineTo(N[e[1]].x,N[e[1]].y)}c.stroke();
          for(i=0;i<E.length;i++){e=E[i];var m=Math.min(N[e[0]].e,N[e[1]].e);if(m>.04){c.strokeStyle=e[2]+(m*.85).toFixed(3)+')';c.lineWidth=1+m*1.2;c.beginPath();c.moveTo(N[e[0]].x,N[e[0]].y);c.lineTo(N[e[1]].x,N[e[1]].y);c.stroke()}}
          for(i=0;i<N.length;i++){n=N[i];
            if(n.e>.04){c.shadowColor=n.cs+'1)';c.shadowBlur=18*n.e;c.fillStyle=n.cs+(.35+.65*n.e).toFixed(3)+')'}else{c.shadowBlur=0;c.fillStyle=n.rest}
            c.beginPath();c.arc(n.x,n.y,1.7+n.e*3,0,6.3);c.fill()}
          c.shadowBlur=0}};
    }
  };
  var signal=(getComputedStyle(document.body).getPropertyValue('--signal')||'#ffe35a').trim();
  var css=function(n){return getComputedStyle(root).getPropertyValue(n).trim()};
  var lvh=function(){var d=document.createElement('div');d.style.cssText='position:fixed;top:0;width:0;height:100vh;height:100lvh;visibility:hidden';document.body.appendChild(d);var h=d.offsetHeight||innerHeight;d.remove();return h};
  document.querySelectorAll('canvas[data-scene]').forEach(function(cv){
    if(!SCENES[cv.dataset.scene])return;
    var host=cv.parentNode, ctx=cv.getContext('2d'), S={W:0,H:0,t:0,k:1,e:0,ox:0,oy:0,cv:cv,ctx:ctx,host:host}, on=false, raf=0, lw=0, lh=0;
    var sc=SCENES[cv.dataset.scene](S,{signal:signal,band:cv.dataset.band});
    /* depth applies to the opening scene only; the scenes in the home stations stay in their frames */
    var opening=cv.classList.contains('scene')&&host.classList.contains('hero'), deep=false, mode='off', look={}, heroH=1, vh=0, over=0, lastE=-1, n=0, every=2, fm=16.7, prev=0;
    var endEl=document.querySelector('.end-dot'), endY=1e9, rest=0;
    var measure=function(){heroH=host.offsetHeight||1;if(endEl)endY=endEl.getBoundingClientRect().top+(window.scrollY||root.scrollTop)};
    var read=function(){
      var phone=innerWidth<=760; mode=reduce||!opening?'off':(css(phone?'--depth-phone':'--depth-wide')||'off');
      look={s:Math.min(1,+css('--depth-scale')||1),a:mode==='stay'?+css(phone?'--depth-faint':'--depth-dim'):1,v:+css('--depth-speed')||1,b:+css('--depth-blur')||0};
      lastE=-1;
    };
    /* how far the opening has scrolled away, eased; the scene follows with transform, opacity and filter only.
       As the end of the line comes up, the scene comes to rest, half as bright and half as fast, so the signature is the last thing that moves. */
    var depth=function(){
      var y=window.scrollY||root.scrollTop, p=Math.max(0,Math.min(1,y/(heroH*.8))), e=p*p*(3-2*p), f=Math.max(0,Math.min(1,(y+innerHeight-endY)/(innerHeight*.55)));
      f=f*f*(3-2*f)*e;
      if(e+f*3!==lastE){lastE=e+f*3;S.e=e;rest=f;
        cv.style.transform=e?'scale('+(1+(look.s-1)*e).toFixed(4)+')':'';
        cv.style.opacity=((mode==='fade'?1-e:1+(look.a-1)*e)*(1-.5*f)).toFixed(3);
        cv.style.filter=look.b&&e?'blur('+(look.b*e).toFixed(2)+'px)':'';
        cv.style.setProperty('--fade',e.toFixed(3))}
      return e;
    };
    var fit=function(){
      read(); deep=mode!=='off'; if(opening)root.classList.toggle('deep',deep);
      var d=Math.min(window.devicePixelRatio||1,2);
      if(deep){
        /* fixed to the viewport, with a margin wide enough that the receded scene still reaches every edge */
        if(innerWidth!==lw||!vh)vh=lvh(); over=Math.max(0,(1/look.s-1)/2)+.01; measure();
        S.ox=Math.ceil(innerWidth*over); S.oy=Math.ceil(vh*over); S.W=innerWidth+2*S.ox; S.H=vh+2*S.oy;
        cv.style.cssText='left:'+(-S.ox)+'px;top:'+(-S.oy)+'px;width:'+S.W+'px;height:'+S.H+'px;--m0:'+(S.oy+heroH*.4)+'px;--m1:'+(S.oy+heroH*.96)+'px';
        lw=innerWidth; lh=vh;
      }else{
        S.ox=S.oy=0; S.e=0; cv.removeAttribute('style'); S.W=host.clientWidth; S.H=host.clientHeight; lw=S.W; lh=S.H;
      }
      cv.width=S.W*d;cv.height=S.H*d;ctx.setTransform(d,0,0,d,0,0);S.k=1;sc.init();
      if(reduce)for(var i=0;i<240;i++){S.t++;sc.draw()}
      wake();
    };
    /* drawing: every frame in the opening; once in depth, about thirty times a second, at the speed of the depth look.
       It stops when nothing would be seen: the opening off screen, or the scene dissolved on a phone. */
    var loop=function(now){
      raf=0; if(prev)fm=fm*.9+Math.min(50,now-prev)*.1; prev=now;
      var e=deep?depth():0;
      if(deep?(mode==='fade'&&e>=1):!on){prev=0;return}
      n++;
      if(!(e>=1&&n<every)){S.k=(1+(look.v-1)*e)*(1-.5*rest)*n;n=0;every=Math.max(1,Math.round(33.3/fm));S.t+=S.k;sc.draw()}
      raf=requestAnimationFrame(loop);
    };
    var wake=function(){if(!raf&&!reduce)raf=requestAnimationFrame(loop)};
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){on=e[0].isIntersecting;if(on)wake()},{threshold:.02}).observe(host);
    else on=true;
    if(opening)addEventListener('scroll',function(){if(deep)wake()},{passive:true});
    addEventListener('resize',function(){
      var was=mode; read();
      if(mode!==was||(deep&&(innerWidth!==lw||(1/look.s-1)/2+.01>over))||(!deep&&(host.clientWidth!==lw||Math.abs(host.clientHeight-lh)>80)))fit();
      else{measure();wake()}
    });
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
    fit();
  });
})();
