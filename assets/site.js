(function(){
  var root=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  /* fade in on scroll: opacity only, nothing moves */
  var rise=document.querySelectorAll('.rise,footer');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
    rise.forEach(function(e){io.observe(e)});
  }else rise.forEach(function(e){e.classList.add('in')});

  /* scroll cue: appears after a moment, disappears once the reader scrolls; opacity only */
  if(document.querySelector('.cue')){
    var scrolled=function(){root.classList.toggle('scrolled',(window.scrollY||root.scrollTop)>40)};
    window.addEventListener('scroll',scrolled,{passive:true});scrolled();
    setTimeout(function(){root.classList.add('ready')},reduce?0:1200);
  }

  /* copy buttons: fixed width, label swaps in place */
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){
      var old=b.textContent, done=function(){b.textContent=b.dataset.done;setTimeout(function(){b.textContent=old},1600)};
      if(navigator.clipboard)navigator.clipboard.writeText(b.dataset.copy).then(done,done);else done();
    });
  });

  /* demo: characters are laid out from the start and only made visible, so nothing reflows */
  var raw=document.querySelector('.raw'), lines=document.querySelectorAll('.rv');
  if(raw){
    var text=raw.textContent; raw.textContent='';
    var chars=text.split('').map(function(c){var s=document.createElement('span');s.className='ch';s.textContent=c;raw.appendChild(s);return s});
    var timers=[];
    var play=function(){
      timers.forEach(clearTimeout);timers=[];
      chars.forEach(function(c){c.className='ch'});lines.forEach(function(l){l.classList.remove('on')});
      var t=400;
      chars.forEach(function(c,i){t+=26+Math.random()*34;timers.push(setTimeout(function(){if(i)chars[i-1].classList.remove('cur');c.classList.add('v','cur')},t))});
      lines.forEach(function(l,k){timers.push(setTimeout(function(){l.classList.add('on')},t+600+k*650))});
      timers.push(setTimeout(play,t+600+lines.length*650+9000));
    };
    if(reduce){chars.forEach(function(c){c.classList.add('v')});lines.forEach(function(l){l.classList.add('on')})}
    else{
      var started=false, start=function(){if(!started){started=true;play()}};
      if('IntersectionObserver' in window)new IntersectionObserver(function(es,o){if(es[0].isIntersecting){start();o.disconnect()}},{threshold:.3}).observe(raw);else start();
    }
  }

  /* network figure: fixed viewBox, state is a single attribute */
  var fig=document.querySelector('.figure'), svg=fig&&fig.querySelector('.net');
  if(svg){
    var NS='http://www.w3.org/2000/svg', labs=JSON.parse(svg.dataset.labels), HOT=2, vert=null, auto;
    var el=function(n,a,c,txt){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(c)e.setAttribute('class',c);if(txt)e.textContent=txt;svg.appendChild(e);return e};
    var build=function(){
      var v=window.innerWidth<700; if(v===vert)return; vert=v; svg.textContent='';
      var W=v?400:1000,H=v?720:450, A=v?[40,180,360,540,680]:[90,270,500,730,910], mid=v?200:225;
      var LN=v?[50,110,170,230,290,350]:[75,135,195,255,315,375], CL=v?[44,122,200,278,356]:[55,140,225,310,395], R=v?13:19;
      var P=function(a,b){return v?[b,a]:[a,b]};
      svg.setAttribute('viewBox','0 0 '+W+' '+H);
      var line=function(p,q,c){el('line',{x1:p[0],y1:p[1],x2:q[0],y2:q[1]},'e '+c)};
      var I=P(A[0],mid),O=P(A[4],mid);
      LN.forEach(function(b){line(I,P(A[1],b),'hot');line(P(A[3],b),O,'hot')});
      CL.forEach(function(c,i){LN.forEach(function(b){line(P(A[1],b),P(A[2],c),i===HOT?'hot':'');line(P(A[2],c),P(A[3],b),i===HOT?'hot':'')})});
      LN.forEach(function(b){[A[1],A[3]].forEach(function(a){var q=P(a,b);el('circle',{cx:q[0],cy:q[1],r:v?4:5},'n l hot')})});
      CL.forEach(function(c,i){
        var q=P(A[2],c), h=i===HOT?' hot':'';
        if(i===HOT)el('circle',{cx:q[0],cy:q[1],r:R+10},'ring');
        for(var k=0;k<7;k++){var ang=k*Math.PI/3,r=k===6?0:R;var n=el('circle',{cx:q[0]+r*Math.cos(ang),cy:q[1]+r*Math.sin(ang),r:v?3.6:4.4},'n cl'+h);n.style.setProperty('--dl',(-Math.random()*1.2).toFixed(2)+'s')}
        var t=el('text',{x:q[0],y:v?q[1]+R+20:q[1]-R-12,'text-anchor':'middle'},'lab'+h);
        if(v)labs[i].forEach(function(w,k){if(!w)return;var s=document.createElementNS(NS,'tspan');s.setAttribute('x',q[0]);s.setAttribute('dy',k?14:0);s.textContent=w;t.appendChild(s)});
        else t.textContent=labs[i].join(' ').trim();
      });
      el('circle',{cx:I[0],cy:I[1],r:v?8:10},'n in');el('circle',{cx:O[0],cy:O[1],r:v?8:10},'n out hot');
      var li=v?{x:I[0]+16,y:I[1]+5}:{x:I[0],y:I[1]+34,'text-anchor':'middle'}, lo=v?{x:O[0]+16,y:O[1]+5}:{x:O[0],y:O[1]+34,'text-anchor':'middle'};
      el('text',li,'io',svg.dataset.inp);el('text',lo,'io io-v',svg.dataset.outVague);el('text',lo,'io io-c',svg.dataset.outClear);
    };
    var set=function(m,manual){
      fig.dataset.mode=m; clearTimeout(auto);
      if(!reduce)auto=setTimeout(function(){set(fig.dataset.mode==='vague'?'clear':'vague')},manual?9000:4800);
    };
    fig.querySelectorAll('.sw').forEach(function(b){b.addEventListener('click',function(){set(b.dataset.set,true)})});
    window.addEventListener('resize',build);
    build(); set(reduce?'clear':'vague');
  }
  /* hero scenes: each project picks one; the canvas is absolutely placed, so layout never moves */
  var cv=document.querySelector('canvas.scene');
  if(cv){
    var hero=cv.parentNode, ctx=cv.getContext('2d'), S={W:0,H:0,t:0}, onScreen=false, raf, scene;
    var signal=(getComputedStyle(document.body).getPropertyValue('--signal')||'#ffe35a').trim();
    var rgb=function(h){h=h.replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]}(signal);
    var SCENES={
      flow:function(){
        var P=[],K=9,top,bot,pal=['#8b6cff','#ff5fa8','#4cc3ff','#b9a6ff','#ff9ac6'];
        var laneY=function(k){return top+(k+.5)*(bot-top)/K};
        return {init:function(){top=S.H*.66;bot=S.H-(S.W<560?140:104);P=[];var n=S.W<700?240:760;
            for(var i=0;i<n;i++)P.push({x:Math.random()*S.W,y:top+Math.random()*(bot-top),vy:0,ph:Math.random()*6.28,c:i%pal.length,r:1+Math.random()*1.6,k:i%K})},
          draw:function(){var W=S.W,H=S.H,mid=W/2,t=S.t/60,c=ctx;
            c.fillStyle='rgba(12,12,16,.2)';c.fillRect(0,0,W,H);
            for(var i=0;i<P.length;i++){var p=P[i];
              if(p.x<mid){p.vy+=Math.sin(p.x*.013+t*1.4+p.ph)*.34+(Math.random()-.5)*.7;p.vy*=.91;p.y+=p.vy*1.7;p.x+=1.2+Math.sin(p.ph+t)*.9;
                if(p.y<top)p.vy+=.6;if(p.y>bot)p.vy-=.6;
                var near=Math.max(0,1-(mid-p.x)/170);
                if(near>0){p.k=Math.max(0,Math.min(K-1,Math.round((p.y-top)/((bot-top)/K)-.5)));p.y+=(laneY(p.k)-p.y)*.1*near}
                c.globalAlpha=.85;c.fillStyle=pal[p.c];c.beginPath();c.arc(p.x,p.y,p.r,0,6.3);c.fill();
              }else{p.y+=(laneY(p.k)-p.y)*.22;p.x+=3;
                c.globalAlpha=.9;c.strokeStyle=signal;c.lineWidth=1.6;c.beginPath();c.moveTo(p.x-14,p.y);c.lineTo(p.x,p.y);c.stroke();
                if(p.x>W+16){p.x=-10-Math.random()*40;p.y=top+Math.random()*(bot-top);p.vy=0}}}
            c.globalAlpha=1;
            var g=c.createLinearGradient(0,top-30,0,bot+30);g.addColorStop(0,'rgba('+rgb+',0)');g.addColorStop(.5,'rgba(255,246,200,1)');g.addColorStop(1,'rgba('+rgb+',0)');
            c.shadowColor=signal;c.shadowBlur=30;c.fillStyle=g;c.fillRect(mid-1.5,top-30,3,bot-top+42);c.shadowBlur=0}};
      },
      network:function(){
        /* a network split into coloured regions, like areas of expertise; where the cursor passes, its region lights up */
        var N=[],E=[],ptr={x:-999,y:-999,live:-999};
        var PAL=[signal,'#ff9f5a','#ff5fa8','#8b6cff','#4cc3ff'].map(function(h){h=h.replace('#','');var n=parseInt(h,16);return [(n>>16)&255,(n>>8)&255,n&255]});
        var mix=function(a,b,w){return [0,1,2].map(function(i){return Math.round(a[i]*w+b[i]*(1-w))})};
        var move=function(x,y){var r=cv.getBoundingClientRect();ptr.x=x-r.left;ptr.y=y-r.top;ptr.live=S.t};
        hero.addEventListener('mousemove',function(e){move(e.clientX,e.clientY)});
        hero.addEventListener('touchmove',function(e){move(e.touches[0].clientX,e.touches[0].clientY)},{passive:true});
        return {init:function(){N=[];E=[];var g=S.W<700?58:74,cols=Math.ceil(S.W/g)+1,rows=Math.ceil(S.H/g)+1,i,k;
            var sc=Math.max(2,Math.round(S.W/480)),sr=Math.max(2,Math.round(S.H/480)),seeds=[];
            for(var r=0;r<sr;r++)for(var q=0;q<sc;q++)seeds.push({x:(q+.5+(Math.random()-.5)*.6)*S.W/sc,y:(r+.5+(Math.random()-.5)*.6)*S.H/sr,c:PAL[(q+r*2)%PAL.length]});
            for(r=0;r<rows;r++)for(q=0;q<cols;q++){
              var ax=q*g+(r%2?g/2:0)+(Math.random()-.5)*g*.55,ay=r*g+(Math.random()-.5)*g*.55,d1=1e9,d2=1e9,c1,c2;
              for(k=0;k<seeds.length;k++){var d=Math.hypot(ax-seeds[k].x,ay-seeds[k].y);if(d<d1){d2=d1;c2=c1;d1=d;c1=seeds[k].c}else if(d<d2){d2=d;c2=seeds[k].c}}
              var c=mix(c1,c2,.5+.5*Math.min(1,(d2-d1)/(g*1.4)));
              N.push({ax:ax,ay:ay,ph:Math.random()*6.28,e:0,n:0,x:0,y:0,c:c,cs:'rgba('+c+',',rest:'rgba('+c+',.3)'})}
            var R=g*1.38;for(i=0;i<N.length;i++)for(k=i+1;k<N.length;k++){var dx=N[i].ax-N[k].ax,dy=N[i].ay-N[k].ay;if(dx*dx+dy*dy<R*R)E.push([i,k,'rgba('+mix(N[i].c,N[k].c,.5)+','])}},
          draw:function(){var W=S.W,H=S.H,t=S.t/60,c=ctx,i,n,e;
            if(S.t-ptr.live>150){ptr.x=W*(.5+.36*Math.sin(t*.55));ptr.y=H*(.5+.34*Math.sin(t*.83+1.2))}
            /* a few sparks elsewhere, so several regions glow at once */
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
    scene=(SCENES[cv.dataset.scene]||SCENES.network)();
    var fit=function(){var d=Math.min(window.devicePixelRatio||1,2);S.W=hero.clientWidth;S.H=hero.clientHeight;cv.width=S.W*d;cv.height=S.H*d;ctx.setTransform(d,0,0,d,0,0);scene.init();if(reduce)for(var i=0;i<200;i++){S.t++;scene.draw()}};
    var loop=function(){S.t++;scene.draw();if(onScreen&&!reduce)raf=requestAnimationFrame(loop)};
    if('IntersectionObserver' in window)new IntersectionObserver(function(e){onScreen=e[0].isIntersecting;cancelAnimationFrame(raf);if(onScreen&&!reduce)loop()},{threshold:.02}).observe(hero);
    else{onScreen=true;loop()}
    window.addEventListener('resize',fit);fit();
  }
})();
