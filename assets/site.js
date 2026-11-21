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
  document.querySelectorAll('.rise,footer').forEach(function(e){when(e,function(){e.classList.add('in')},.1)});

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

  /* the line: placed between the opening and the signature, it grows with the scroll; stations light when it reaches them */
  var page=document.querySelector('.page'), axis=page&&page.querySelector('.axis');
  if(axis){
    var fill=axis.firstElementChild, rows=[].slice.call(document.querySelectorAll('.row')), top=0, h=1;
    var abs=function(el){return el.getBoundingClientRect().top-page.getBoundingClientRect().top};
    var tick=function(){
      var reach=innerHeight*.78-page.getBoundingClientRect().top;
      fill.style.setProperty('--p',(reduce?1:Math.max(0,Math.min(1,(reach-top)/h))).toFixed(4));
      rows.forEach(function(r){r.classList.toggle('lit',reduce||abs(r)<reach)});
    };
    var place=function(){
      var phone=innerWidth<=760, start=phone?document.querySelector('main'):document.querySelector('.axis-start'), end=document.querySelector('.end-dot');
      if(!start||!end)return;
      top=abs(start)+(phone?0:start.offsetHeight/2); h=Math.max(1,abs(end)-top+4);
      axis.style.top=top+'px'; axis.style.height=h+'px'; tick();
    };
    addEventListener('scroll',tick,{passive:true}); addEventListener('resize',place);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(place);
    place();
  }

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

  /* scenes: each project picks one; the canvas is absolutely placed, so layout never moves */
  var hex=function(h){h=h.replace('#','');var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]};
  var SCENES={
    /* the flow: a disordered swarm enters from the left, crosses a luminous line and leaves in ordered files */
    flow:function(S,cfg){
      var c=S.ctx,P=[],K=9,top,bot,mid,pal=['#8b6cff','#ff5fa8','#4cc3ff','#b9a6ff','#ff9ac6'], sig=cfg.signal, rgb=hex(sig);
      var laneY=function(k){return top+(k+.5)*(bot-top)/K};
      return {init:function(){
          var band=cfg.band&&S.host.querySelector(cfg.band), hr=S.host.getBoundingClientRect();
          if(band&&band.offsetHeight){var br=band.getBoundingClientRect();top=br.top-hr.top+8;bot=br.bottom-hr.top-8}else{top=S.H*.2;bot=S.H*.8}
          mid=S.W/2; P=[]; var n=Math.round(Math.min(760,Math.max(160,S.W*(bot-top)/260)));
          for(var i=0;i<n;i++)P.push({x:Math.random()*S.W,y:top+Math.random()*(bot-top),vy:0,ph:Math.random()*6.28,c:i%pal.length,r:1+Math.random()*1.6,k:i%K});
          c.fillStyle='#0c0c10';c.fillRect(0,0,S.W,S.H)},
        draw:function(){var W=S.W,H=S.H,t=S.t/60;
          c.fillStyle='rgba(12,12,16,.2)';c.fillRect(0,0,W,H);
          for(var i=0;i<P.length;i++){var p=P[i];
            if(p.x<mid){p.vy+=Math.sin(p.x*.013+t*1.4+p.ph)*.34+(Math.random()-.5)*.7;p.vy*=.91;p.y+=p.vy*1.7;p.x+=1.2+Math.sin(p.ph+t)*.9;
              if(p.y<top)p.vy+=.6;if(p.y>bot)p.vy-=.6;
              var near=Math.max(0,1-(mid-p.x)/170);
              if(near>0){p.k=Math.max(0,Math.min(K-1,Math.round((p.y-top)/((bot-top)/K)-.5)));p.y+=(laneY(p.k)-p.y)*.1*near}
              c.globalAlpha=.85;c.fillStyle=pal[p.c];c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill();
            }else{p.y+=(laneY(p.k)-p.y)*.22;p.x+=3;
              c.globalAlpha=.9;c.strokeStyle=sig;c.lineWidth=1.6;c.beginPath();c.moveTo(p.x-14,p.y);c.lineTo(p.x,p.y);c.stroke();
              if(p.x>W+16){p.x=-10-Math.random()*40;p.y=top+Math.random()*(bot-top);p.vy=0}}}
          c.globalAlpha=1;
          var g=c.createLinearGradient(0,top-30,0,bot+30);g.addColorStop(0,'rgba('+rgb+',0)');g.addColorStop(.5,'rgba(255,246,200,1)');g.addColorStop(1,'rgba('+rgb+',0)');
          c.shadowColor=sig;c.shadowBlur=30;c.fillStyle=g;c.fillRect(mid-1.5,top-30,3,bot-top+60);c.shadowBlur=0}};
    },
    /* the living network: regions of five colours, like areas of expertise; where the cursor passes, its region lights up */
    network:function(S,cfg){
      var c=S.ctx,N=[],E=[],ptr={x:-999,y:-999,live:-999};
      var PAL=[cfg.signal,'#ff9f5a','#ff5fa8','#8b6cff','#4cc3ff'].map(hex);
      var mix=function(a,b,w){return [0,1,2].map(function(i){return Math.round(a[i]*w+b[i]*(1-w))})};
      var move=function(x,y){var r=S.cv.getBoundingClientRect();ptr.x=x-r.left;ptr.y=y-r.top;ptr.live=S.t};
      S.host.addEventListener('mousemove',function(e){move(e.clientX,e.clientY)});
      S.host.addEventListener('touchmove',function(e){move(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
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
          if(S.t-ptr.live>150){ptr.x=W*(.5+.36*Math.sin(t*.55));ptr.y=H*(.5+.34*Math.sin(t*.83+1.2))}
          if(S.t%70===0){n=N[Math.floor(Math.random()*N.length)];n.e=Math.max(n.e,.9)}
          for(i=0;i<N.length;i++){n=N[i];n.x=n.ax+Math.sin(t*.6+n.ph)*7;n.y=n.ay+Math.cos(t*.5+n.ph*1.7)*7;var dx=n.x-ptr.x,dy=n.y-ptr.y;if(dx*dx+dy*dy<8100)n.e=1}
          if(S.t%3===0){for(i=0;i<N.length;i++)N[i].n=Math.max(0,N[i].e*.9-.012);
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
  document.querySelectorAll('canvas[data-scene]').forEach(function(cv){
    if(!SCENES[cv.dataset.scene])return;
    var host=cv.parentNode, ctx=cv.getContext('2d'), S={W:0,H:0,t:0,cv:cv,ctx:ctx,host:host}, on=false, raf, lw=0, lh=0;
    var sc=SCENES[cv.dataset.scene](S,{signal:signal,band:cv.dataset.band});
    var fit=function(){var d=Math.min(window.devicePixelRatio||1,2);S.W=host.clientWidth;S.H=host.clientHeight;lw=S.W;lh=S.H;cv.width=S.W*d;cv.height=S.H*d;ctx.setTransform(d,0,0,d,0,0);sc.init();if(reduce)for(var i=0;i<240;i++){S.t++;sc.draw()}};
    var loop=function(){S.t++;sc.draw();if(on&&!reduce)raf=requestAnimationFrame(loop)};
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){on=e[0].isIntersecting;cancelAnimationFrame(raf);if(on&&!reduce)loop()},{threshold:.02}).observe(host);
    else{on=true;loop()}
    addEventListener('resize',function(){if(host.clientWidth!==lw||Math.abs(host.clientHeight-lh)>80)fit()});
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
    fit();
  });
})();
