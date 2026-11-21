/* SocraticSelf in five steps, fifteen seconds: an SVG film drawn from one clock, so the page and the exported video show the same frames.
   The stage has a fixed viewBox; only opacity, stroke offsets, path shapes and transforms change. Nothing around it moves. */
(function(){
  var T=15, STEPS=[0,1.6,3.8,6,8.4,12.2];
  var SIG='#ffe35a', RAW='#aaa2d6', MOON='#f5f4ef', DUST='#9b9aae', PANE='#15151c', HAIR='rgba(255,255,255,.16)';
  var PAL=['#8b6cff','#ff5fa8','#4cc3ff','#b9a6ff'];
  var clamp=function(x){return x<0?0:x>1?1:x}, ramp=function(t,a,b){return clamp((t-a)/(b-a))};
  var ease=function(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
  var back=function(x){var c1=1.9,c3=c1+1;return x<=0?0:x>=1?1:1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
  var hex=function(h){var n=parseInt(h.slice(1),16);return [(n>>16)&255,(n>>8)&255,n&255]};
  var mixc=function(a,b,k){a=hex(a);b=hex(b);return 'rgb('+[0,1,2].map(function(i){return Math.round(a[i]+(b[i]-a[i])*k)}).join(',')+')'};
  var wave=function(x0,x1,y,seed,amp){var d='M'+x0+' '+(y+Math.sin(x0*.11+seed)*amp).toFixed(1);for(var x=x0+5;x<=x1;x+=5){d+=' L'+x+' '+(y+Math.sin(x*.11+seed)*amp+Math.sin(x*.37+seed*2)*amp*.45).toFixed(1)}return d};
  var MARK=function(x,y,s,id){return '<g'+(id?' id="'+id+'"':'')+'><g transform="translate('+(x-12*s)+' '+(y-12*s)+') scale('+s+')"><path d="M12 2a10 10 0 0 0 0 20" fill="none" stroke="'+MOON+'" stroke-width="1.6" stroke-dasharray="2.2 2.6" stroke-linecap="round"/><path d="M12 2a10 10 0 0 1 0 20z" fill="'+SIG+'" stroke="'+MOON+'" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 .8v22.4" stroke="'+MOON+'" stroke-width="1.6" stroke-linecap="round"/></g></g>'};
  var bars=function(x,y,ws,gap,col,w,cls){return ws.map(function(l,i){return '<line class="'+(cls||'bar')+'" pathLength="1" x1="'+x+'" y1="'+(y+i*gap)+'" x2="'+(x+l)+'" y2="'+(y+i*gap)+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/>'}).join('')};
  var RW=[300,280,308,190];
  var answer=function(live){
    return '<rect x="0" y="0" width="360" height="242" rx="18" fill="#1c1a10" stroke="rgba(255,227,90,.55)" stroke-width="1.5"/>'+
      (live?RW.map(function(){return '<path class="rl" d="" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>'}).join(''):bars(26,34,RW,26,SIG,7))+
      [0,1,2].map(function(k){return '<g class="chip"><rect x="'+(24+k*104)+'" y="134" width="94" height="26" rx="7" fill="none" stroke="'+SIG+'" stroke-width="1.5"/><line x1="'+(36+k*104)+'" y1="147" x2="'+(96+k*104)+'" y2="147" stroke="'+SIG+'" stroke-width="3" stroke-linecap="round" opacity=".7"/></g>'}).join('')+
      '<g class="gaps">'+bars(26,190,[230,170],24,'#8d8ba3',5)+'</g>';
  };

  var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')};
  window.SSFilm=function(root,opt){
    opt=opt||{};
    var L0=opt.labels||{project:'Il tuo progetto',chat:'Nuova chat',left:'Dillo male.',right:'Rileggilo chiaro.'}, L={};
    for(var k in L0)L[k]=esc(L0[k]);
    var TX=[140,260,380,620,740,860];
    var svg='<svg viewBox="0 0 1000 1000" role="img" aria-label="'+esc(opt.alt||'')+'">'+
      '<defs><filter id="ssglow" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>'+
      '<g id="f-cam"><g id="f-scene">'+
        '<g id="f-proj"><text x="62" y="788" fill="'+DUST+'" font-size="26" font-family="Inter,system-ui,sans-serif" font-weight="500">'+L.project+'</text>'+
          '<rect x="40" y="806" width="920" height="126" rx="20" fill="'+PANE+'" stroke="'+HAIR+'" stroke-width="1.5"/>'+
          TX.map(function(cx){return '<g class="tileW"><g class="tile"><rect x="'+(cx-52)+'" y="836" width="104" height="66" rx="10" fill="none" stroke="'+HAIR+'" stroke-width="1.5"/>'+bars(cx-36,856,[72,56,64],13,'#5d5c70',4,'tl')+'</g></g>'}).join('')+'</g>'+
        '<line id="f-cA" pathLength="1" x1="260" y1="742" x2="260" y2="806" stroke="'+DUST+'" stroke-width="2.5"/>'+
        '<line id="f-cB" pathLength="1" x1="740" y1="742" x2="740" y2="806" stroke="'+DUST+'" stroke-width="2.5"/>'+
        '<g id="f-pAW"><rect x="40" y="88" width="420" height="654" rx="24" fill="'+PANE+'" stroke="'+HAIR+'" stroke-width="1.5"/>'+MARK(84,132,1.35)+'<text x="112" y="142" fill="'+MOON+'" font-size="28" font-family="Newsreader,Georgia,serif" font-weight="500">Socratic<tspan font-style="italic" font-weight="400">Self</tspan></text><line x1="40" y1="170" x2="460" y2="170" stroke="'+HAIR+'"/></g>'+
        '<g id="f-pBW"><rect id="f-pBr" x="540" y="88" width="420" height="654" rx="24" fill="'+PANE+'" stroke="'+HAIR+'" stroke-width="1.5"/><text x="576" y="142" fill="'+MOON+'" font-size="28" font-family="Newsreader,Georgia,serif" font-weight="500">'+L.chat+'</text><line x1="540" y1="170" x2="960" y2="170" stroke="'+HAIR+'"/>'+
          bars(572,520,[330,300,340,260,310],24,'#cfcfda',5,'wb')+'</g>'+
        '<g id="f-noteW"><rect x="140" y="194" width="300" height="140" rx="18" fill="rgba(170,162,214,.1)" stroke="rgba(170,162,214,.45)" stroke-width="1.5"/>'+
          [0,1,2,3].map(function(i){return '<path class="sq" pathLength="1" d="" fill="none" stroke="'+PAL[i]+'" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'}).join('')+'</g>'+
        '<g id="f-askW"><rect x="64" y="352" width="140" height="50" rx="16" fill="#1d1d26" stroke="'+HAIR+'" stroke-width="1.5"/><text x="92" y="386" fill="'+SIG+'" font-size="30" font-family="Newsreader,Georgia,serif" font-weight="500">?</text>'+bars(120,377,[60],0,'#8d8ba3',5)+'</g>'+
        '<g id="f-replyW"><rect x="316" y="414" width="124" height="42" rx="16" fill="rgba(170,162,214,.1)" stroke="rgba(170,162,214,.45)" stroke-width="1.5"/><path class="sq2" d="" fill="none" stroke="'+PAL[3]+'" stroke-width="4" stroke-linecap="round"/></g>'+
        '<g id="f-respW"><g transform="translate(64 478)">'+answer(true)+'</g></g>'+
        '<g id="f-work">'+[0,1,2].map(function(k){return '<circle cx="'+(584+k*28)+'" cy="478" r="8" fill="'+SIG+'"/>'}).join('')+'</g>'+
        '<circle id="f-enter" cx="902" cy="404" r="22" fill="'+SIG+'"/>'+
      '</g>'+
      '<line id="f-axis" x1="500" y1="-200" x2="500" y2="1200" stroke="'+SIG+'" stroke-width="2"/>'+
      '<g id="f-ghost">'+answer(false)+'</g></g>'+
      '<g id="f-end">'+MARK(500,410,3.4,'f-endmark')+
        '<text id="f-endl" x="470" y="560" text-anchor="end" fill="'+RAW+'" font-size="54" font-style="italic" font-family="Newsreader,Georgia,serif">'+L.left+'</text>'+
        '<text id="f-endr" x="530" y="560" fill="'+MOON+'" font-size="54" font-weight="500" font-family="Newsreader,Georgia,serif">'+L.right+'</text></g>'+
    '</svg>';
    var stage=root.querySelector('.film-stage'); stage.innerHTML=svg;
    var $=function(id){return stage.querySelector('#f-'+id)}, all=function(sel,el){return [].slice.call((el||stage).querySelectorAll(sel))};
    var E={}; 'cam scene proj cA cB pAW pBW pBr noteW askW replyW respW work enter axis ghost end endmark endl endr'.split(' ').forEach(function(k){E[k]=$(k)});
    var sq=all('.sq',E.noteW), sq2=E.replyW.querySelector('.sq2'), tileW=all('.tileW'), tileR=all('.tile rect'), rl=all('.rl',E.respW), chips=all('.chip',E.respW), gaps=E.respW.querySelector('.gaps'), dots=all('circle',E.work), wb=all('.wb',E.pBW);
    var caps=all('.film-cap p',root), steps=all('.film-steps button',root);
    var op=function(el,v){el.setAttribute('opacity',(+v).toFixed(3))};
    var draw=function(el,p){el.setAttribute('stroke-dasharray','1 1');el.setAttribute('stroke-dashoffset',(1-p).toFixed(3))};
    var pop=function(el,p,cx,cy){var s=.86+.14*back(p);el.setAttribute('transform','translate('+cx+' '+cy+') scale('+s.toFixed(4)+') translate('+(-cx)+' '+(-cy)+')');op(el,clamp(p*1.6))};
    var pulse=function(el,t,on){if(on){el.setAttribute('stroke-dasharray','.16 .1');el.setAttribute('stroke-dashoffset',(-(t*1.6)%1).toFixed(3))}};
    var render=function(t){
      t=((t%T)+T)%T;
      var fadeOut=1-ramp(t,14.5,15), dim=1-.9*ramp(t,12.2,12.7);
      /* camera: a quick reveal, a push towards the panels while the note is clarified, back out for the hand-over; it scales around the line */
      var s=1.08-.08*ease(ramp(t,0,1.4))+.06*ease(ramp(t,1.6,2.6))-.06*ease(ramp(t,8.4,9.3));
      E.cam.setAttribute('transform','translate(500 430) scale('+s.toFixed(4)+') translate(-500 -430)');
      op(E.scene,dim*fadeOut);
      var pp=ramp(t,0,.7); op(E.proj,pp); E.proj.setAttribute('transform','translate(0 '+(30*(1-ease(pp))).toFixed(1)+')');
      tileW.forEach(function(g,i){pop(g,ramp(t,.15+i*.07,.55+i*.07),TX[i],869)});
      pop(E.pAW,ramp(t,.5,1.1),250,415);
      draw(E.cA,ramp(t,.9,1.4)); pulse(E.cA,t,t>=3.8&&t<6); E.cA.setAttribute('stroke',t>=3.8&&t<6?SIG:DUST);
      /* the note: written fast, and never still */
      pop(E.noteW,ramp(t,1.6,2),290,264);
      sq.forEach(function(p,i){p.setAttribute('d',wave(166,[414,392,418,340][i],226+i*28,i*1.7+t*4.2,6));draw(p,ramp(t,1.9+i*.32,2.35+i*.32))});
      /* reading the project: pulses run down to the files, which light one after another */
      tileR.forEach(function(r,i){var k=[1,2,3].indexOf(i), lit=k>=0&&t>=4.1+k*.28, flash=k>=0?Math.max(0,1-Math.abs(t-(4.1+k*.28))/.25):0, edit=k>=0&&t>=10.6&&t<12.2?.5+.5*Math.sin((t-10.6)*9+k):0;
        r.setAttribute('stroke',lit?SIG:HAIR); r.setAttribute('stroke-width',(1.5+2.5*flash).toFixed(2)); r.setAttribute('fill',lit?'rgba(255,227,90,'+(.08+.3*flash+.16*edit).toFixed(3)+')':'none')});
      pop(E.askW,ramp(t,4.9,5.25),134,377); pop(E.replyW,ramp(t,5.35,5.7),378,435);
      sq2.setAttribute('d',wave(336,416,435,4+t*4.2,4));
      /* the answer: the same lines, straightened and turned clear */
      pop(E.respW,ramp(t,6,6.4),244,599);
      rl.forEach(function(p,i){var k=ease(ramp(t,6.4+i*.16,7.2+i*.16));p.setAttribute('d',wave(26,26+RW[i],34+i*26,i*1.7+t*4.2*(1-k),6*(1-k)));p.setAttribute('stroke',mixc(PAL[i],SIG,k));p.setAttribute('stroke-width',(5+2*k).toFixed(2))});
      chips.forEach(function(c,k){pop(c,ramp(t,7.4+k*.12,7.75+k*.12),71+k*104,147)});
      op(gaps,ramp(t,7.8,8.2));
      /* the hand-over: a new chat in the same project; the copy crosses the line */
      var open=ramp(t,8.4,8.8);
      pop(E.pBW,.62+.38*open,750,415); op(E.pBW,.3*ramp(t,.9,1.4)+.7*open); E.pBr.setAttribute('stroke-dasharray',open<1?'10 10':'none');
      draw(E.cB,ramp(t,8.6,9)); pulse(E.cB,t,t>=10.5&&t<12.2); E.cB.setAttribute('stroke',t>=10.5?SIG:DUST);
      var m=ease(ramp(t,8.9,9.9)), arc=Math.sin(m*Math.PI)*70, gx=64+476*m, gy=478-286*m-arc, gs=1+.08*Math.sin(m*Math.PI);
      E.ghost.setAttribute('transform','translate('+gx.toFixed(1)+' '+gy.toFixed(1)+') translate(180 121) scale('+gs.toFixed(3)+') translate(-180 -121)');
      op(E.ghost,(t>=8.9?1:0)*dim*fadeOut);
      var cross=t>=8.9&&t<10.4?Math.max(0,1-Math.abs(gx+180-500)/130):0;
      E.axis.setAttribute('stroke-width',(2+6*cross).toFixed(2)); op(E.axis,(.32+.68*cross)*(t<12.2?1:fadeOut)); E.axis.setAttribute('filter',cross>.05?'url(#ssglow)':'');
      op(E.enter,ramp(t,10,10.12)*(1-ramp(t,10.25,10.55))); E.enter.setAttribute('r',(18+16*ramp(t,10,10.55)).toFixed(1));
      dots.forEach(function(d,k){op(d,t>=10.3&&t<10.9?.25+.75*(.5+.5*Math.sin((t-10.3)*14-k*.9)):0)});
      wb.forEach(function(b,i){draw(b,ramp(t,10.8+i*.22,11.2+i*.22))});
      /* the end card */
      op(E.end,fadeOut*ramp(t,12.5,12.8));
      var em=back(ramp(t,12.5,13)); E.endmark.setAttribute('transform','translate(500 410) scale('+(.5+.5*em).toFixed(3)+') translate(-500 -410)');
      var tx=ease(ramp(t,12.7,13.3)); E.endl.setAttribute('transform','translate('+(-40*(1-tx)).toFixed(1)+' 0)'); op(E.endl,tx); E.endr.setAttribute('transform','translate('+(40*(1-tx)).toFixed(1)+' 0)'); op(E.endr,tx);
      var st=0; for(var i=0;i<STEPS.length;i++)if(t>=STEPS[i])st=i;
      caps.forEach(function(c,i){c.classList.toggle('on',i===st)});
      steps.forEach(function(b,i){b.classList.toggle('on',i===st);b.setAttribute('aria-current',i===st?'step':'false')});
    };
    var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clock=0, last=null, playing=false, visible=false, raf=null, wanted=!reduce&&!opt.manual;
    var frame=function(now){if(last!==null)clock+=(now-last)/1000;last=now;render(clock);raf=playing&&visible?requestAnimationFrame(frame):null};
    var go=function(){if(playing&&visible&&!raf){last=null;raf=requestAnimationFrame(frame)}};
    var btn=root.querySelector('.film-play');
    var setPlay=function(p){playing=p;if(btn){btn.querySelector('.lab').textContent=p?btn.dataset.pause:btn.dataset.play;btn.setAttribute('aria-pressed',String(!p))}if(!p&&raf){cancelAnimationFrame(raf);raf=null}go()};
    if(btn)btn.addEventListener('click',function(){setPlay(!playing);wanted=playing});
    steps.forEach(function(b,i){b.addEventListener('click',function(){clock=STEPS[i]+[1.2,1.8,1.9,2.2,3.3][i];render(clock);if(!reduce)setPlay(true)})});
    if(reduce){root.classList.add('still');render(11.9)}
    else{render(0);
      if('IntersectionObserver' in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting;if(!visible&&raf){cancelAnimationFrame(raf);raf=null}if(visible&&wanted&&!playing)setPlay(true);else go()},{threshold:.35}).observe(root);
      else{visible=true;if(wanted)setPlay(true)}}
    return {seek:function(t){playing=false;render(t)},T:T};
  };
})();
