/* ProjectLearns in five steps, 17.5 seconds: "Solid foundations, great projects".
   An SVG film drawn from one deterministic clock, so the website page and the exported
   GIF/MP4 show the exact same frames. Fixed viewBox (0 0 1000 1000); only opacity,
   stroke offsets, path shapes and transforms change. Nothing outside moves. */
(function(){
  var T=17.5, STEPS=[0,3.0,6.2,9.6,12.8,15.2];
  var SIG='#ffe35a', CORE='#fff6c8', RAW='#aaa2d6', MOON='#f5f4ef', DUST='#9b9aae';
  var BG='#0c0c10', PANE='#15151c', DEEP='#101017', GOLD_BG='#19170f', HAIR='rgba(255,255,255,.15)';
  var PAL=['#8b6cff','#4cc3ff','#ff5fa8','#ff9f5a','#b9a6ff','#4cc3ff'];
  var WARN='#ff6b8b';

  var clamp=function(x){return x<0?0:x>1?1:x};
  var ramp=function(t,a,b){return clamp((t-a)/(b-a))};
  var ease=function(x){x=clamp(x);return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2};
  var easeOut=function(x){x=clamp(x);return 1-Math.pow(1-x,3)};
  var back=function(x){x=clamp(x);var c1=1.65,c3=c1+1;return x<=0?0:x>=1?1:1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2)};
  var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')};
  var bez=function(p0,p1,p2,p3,u){
    var m=1-u;
    return [
      m*m*m*p0[0]+3*m*m*u*p1[0]+3*m*u*u*p2[0]+u*u*u*p3[0],
      m*m*m*p0[1]+3*m*m*u*p1[1]+3*m*u*u*p2[1]+u*u*u*p3[1]
    ];
  };

  /* ProjectLearns geometric mark (24x24): scattered fragments left, vertical spine center, linked golden nodes right */
  var MARK=function(x,y,s,id){
    return '<g'+(id?' id="'+id+'"':'')+'>'+
      '<g transform="translate('+(x-12*s)+' '+(y-12*s)+') scale('+s+')">'+
      '<line x1="3" y1="6.8" x2="8.2" y2="6.8" stroke="'+RAW+'" stroke-width="1.6" stroke-linecap="round"/>'+
      '<line x1="4.8" y1="12" x2="8.8" y2="12" stroke="'+RAW+'" stroke-width="1.6" stroke-linecap="round"/>'+
      '<line x1="2.6" y1="17.2" x2="7.6" y2="17.2" stroke="'+RAW+'" stroke-width="1.6" stroke-linecap="round"/>'+
      '<path d="M12 2.4a9.6 9.6 0 0 1 0 19.2" fill="rgba(255,227,90,.16)" stroke="'+SIG+'" stroke-width="1.6" stroke-linecap="round"/>'+
      '<path d="M12 12 L18.2 7.6 M12 12 L19.4 12 M12 12 L18.2 16.4" stroke="'+SIG+'" stroke-width="1.5" stroke-linecap="round"/>'+
      '<circle cx="18.4" cy="7.5" r="1.55" fill="'+SIG+'"/>'+
      '<circle cx="19.5" cy="12" r="1.55" fill="'+SIG+'"/>'+
      '<circle cx="18.4" cy="16.5" r="1.55" fill="'+SIG+'"/>'+
      '<line x1="12" y1="1" x2="12" y2="23" stroke="'+MOON+'" stroke-width="1.6" stroke-linecap="round"/>'+
      '</g></g>';
  };

  /* Crisp geometric glyph inside each operator pill (circle / diamond / triangle / hex) */
  var GLYPH=function(kind,cx,cy,col){
    if(kind===0) return '<circle cx="'+cx+'" cy="'+cy+'" r="6" fill="'+col+'"/>';
    if(kind===1) return '<polygon points="'+cx+','+(cy-6.5)+' '+(cx+6.5)+','+cy+' '+cx+','+(cy+6.5)+' '+(cx-6.5)+','+cy+'" fill="'+col+'"/>';
    if(kind===2) return '<polygon points="'+cx+','+(cy-6.5)+' '+(cx+6.5)+','+(cy+5.2)+' '+(cx-6.5)+','+(cy+5.2)+'" fill="'+col+'"/>';
    return '<rect x="'+(cx-5.2)+'" y="'+(cy-5.2)+'" width="10.4" height="10.4" rx="2.4" fill="'+col+'"/>';
  };

  /* Operator pill floating in the sky (harness / agent / LLM) */
  var PILL=function(id,cx,cy,w,col,kind,label){
    var x=cx-w/2, y=cy-23;
    return '<g id="p-'+id+'">'+
      '<rect class="opR" x="'+x+'" y="'+y+'" width="'+w+'" height="46" rx="23" fill="'+PANE+'" stroke="'+col+'" stroke-width="1.6"/>'+
      GLYPH(kind,x+24,cy,col)+
      '<text x="'+(x+42)+'" y="'+(cy+5.5)+'" fill="'+MOON+'" font-size="15.5" font-family="Inter,system-ui,sans-serif" font-weight="500">'+label+'</text>'+
    '</g>';
  };

  /* Architectural structural bay inside the growing project */
  var BAY=function(id,x,y,w,h,accent,rows,cls){
    var inner='';
    for(var i=0;i<rows.length;i++){
      var rw=rows[i];
      inner+='<line class="'+(cls||'bl')+'" pathLength="1" x1="'+(x+18)+'" y1="'+(y+24+i*18)+'" x2="'+(x+18+rw)+'" y2="'+(y+24+i*18)+'" stroke="'+(i===0?accent:'#6c6b82')+'" stroke-width="'+(i===0?4:3.2)+'" stroke-linecap="round" opacity="'+(i===0?.85:.62)+'"/>';
    }
    return '<g id="p-'+id+'">'+
      '<rect class="bayR" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="13" fill="'+PANE+'" stroke="'+HAIR+'" stroke-width="1.5"/>'+
      /* Load-bearing top lintel + corner rivets */
      '<line class="bayTop" pathLength="1" x1="'+(x+14)+'" y1="'+y+'" x2="'+(x+w-14)+'" y2="'+y+'" stroke="'+SIG+'" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>'+
      '<circle cx="'+(x+12)+'" cy="'+(y+h-10)+'" r="2.2" fill="'+SIG+'" opacity="0.45"/>'+
      '<circle cx="'+(x+w-12)+'" cy="'+(y+h-10)+'" r="2.2" fill="'+SIG+'" opacity="0.45"/>'+
      inner+
    '</g>';
  };

  var bars=function(x,y,ws,gap,col,w,cls){
    return ws.map(function(l,i){
      return '<line class="'+(cls||'bar')+'" pathLength="1" x1="'+x+'" y1="'+(y+i*gap)+'" x2="'+(x+l)+'" y2="'+(y+i*gap)+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/>';
    }).join('');
  };

  window.PLFilm=function(root,opt){
    opt=opt||{};
    var L0=opt.labels||{
      folder:'Your folder · files stay in place',
      fragile:'No foundations',
      sessionPrefix:'Session ',
      setup:'Setup',
      op1:'Harness A · LLM 1',
      op2:'Harness B · LLM 2',
      op3:'Agent 2 · LLM 3',
      op4:'Agent 3 · LLM 2',
      left:'Solid foundations.',
      right:'Great projects.'
    };
    var L={};
    for(var k in L0) L[k]=esc(L0[k]);

    var TX=[125,275,425,575,725,875];
    var TILT=[-6.5,5.2,-4.4,6.8,-5.5,4.2];
    var DY=[8,-7,10,-8,7,-9];

    /* Graceful outer read arcs from sky operators down to the Foundation Slab shoulders (clear of Tier 1) */
    var ARC1L=[[500,137],[108,210],[68,490],[132,640]];
    var ARC1R=[[500,137],[892,210],[932,490],[868,640]];
    var ARC2=[[212,137],[64,265],[64,515],[124,640]];
    var ARC3=[[500,137],[500,310],[500,480],[500,640]];
    var ARC4=[[788,137],[936,265],[936,515],[876,640]];
    var arcD=function(a){return 'M'+a[0][0]+' '+a[0][1]+' C'+a[1][0]+' '+a[1][1]+' '+a[2][0]+' '+a[2][1]+' '+a[3][0]+' '+a[3][1]};

    var svg='<svg viewBox="0 0 1000 1000" role="img" aria-label="'+esc(opt.alt||'')+'">'+
      '<defs>'+
        '<filter id="plglow" filterUnits="userSpaceOnUse" x="0" y="0" width="1000" height="1000">'+
          '<feGaussianBlur stdDeviation="6.5" result="b"/>'+
          '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>'+
        '</filter>'+
        '<linearGradient id="spineGrad" x1="0" y1="180" x2="0" y2="920" gradientUnits="userSpaceOnUse">'+
          '<stop offset="0%" stop-color="'+CORE+'" stop-opacity="0.95"/>'+
          '<stop offset="55%" stop-color="'+SIG+'" stop-opacity="0.85"/>'+
          '<stop offset="100%" stop-color="'+SIG+'" stop-opacity="0.25"/>'+
        '</linearGradient>'+
        '<radialGradient id="baseAura" cx="500" cy="698" r="390" gradientUnits="userSpaceOnUse">'+
          '<stop offset="0%" stop-color="'+SIG+'" stop-opacity="0.16"/>'+
          '<stop offset="100%" stop-color="'+SIG+'" stop-opacity="0"/>'+
        '</radialGradient>'+
      '</defs>'+

      '<g id="p-cam">'+
        /* Vertical central plumb-line ("la linea") */
        '<line id="p-axis" x1="500" y1="-120" x2="500" y2="1120" stroke="'+SIG+'" stroke-width="2" opacity="0.25"/>'+

        '<g id="p-scene">'+
          /* Rising structural spine inside p-scene so it dims cleanly with the edifice on the end card */
          '<line id="p-axisCore" pathLength="1" x1="500" y1="640" x2="500" y2="188" stroke="url(#spineGrad)" stroke-width="3"/>'+
          /* Subtle warm ground glow once foundations are laid */
          '<ellipse id="p-aura" cx="500" cy="698" rx="410" ry="118" fill="url(#baseAura)"/>'+

          /* === TOP BLUEPRINT METADATA (no chat boxes) === */
          '<g id="p-head">'+
            MARK(78,48,1.08)+
            '<text x="103" y="55" fill="'+MOON+'" font-size="22" font-family="Newsreader,Georgia,serif" font-weight="500" opacity="0.9">Project<tspan font-style="italic" font-weight="400">Learns</tspan></text>'+
            '<g id="p-sessW">'+
              '<rect x="770" y="30" width="166" height="34" rx="17" fill="'+PANE+'" stroke="'+HAIR+'" stroke-width="1.3"/>'+
              '<circle id="p-sessDot" cx="790" cy="47" r="4.5" fill="'+SIG+'"/>'+
              '<text id="p-sessTxt" x="805" y="52.5" fill="'+DUST+'" font-size="14.5" font-family="JetBrains Mono,ui-monospace,monospace">'+L.setup+'</text>'+
            '</g>'+
          '</g>'+

          /* === STEP 1: UNGROUNDED ATTEMPT (wobbles off-axis & dissolves without foundations) === */
          '<g id="p-fragile">'+
            '<g id="p-fragStack">'+
              '<rect x="330" y="608" width="340" height="66" rx="12" fill="rgba(170,162,214,.06)" stroke="'+RAW+'" stroke-width="1.6" stroke-dasharray="8 6"/>'+
              '<line x1="358" y1="634" x2="510" y2="634" stroke="'+RAW+'" stroke-width="3.5" stroke-linecap="round" opacity="0.5"/>'+
              '<line x1="358" y1="652" x2="462" y2="652" stroke="'+RAW+'" stroke-width="3" stroke-linecap="round" opacity="0.35"/>'+
              '<rect x="366" y="522" width="286" height="66" rx="12" fill="rgba(170,162,214,.06)" stroke="'+RAW+'" stroke-width="1.6" stroke-dasharray="8 6" transform="rotate(-2.2 509 555)"/>'+
              '<line x1="396" y1="548" x2="546" y2="548" stroke="'+RAW+'" stroke-width="3.5" stroke-linecap="round" opacity="0.5" transform="rotate(-2.2 509 555)"/>'+
              '<rect id="p-fragTop" x="406" y="436" width="218" height="64" rx="12" fill="rgba(170,162,214,.06)" stroke="'+RAW+'" stroke-width="1.6" stroke-dasharray="8 6" transform="rotate(3.6 515 468)"/>'+
              '<line x1="436" y1="464" x2="548" y2="464" stroke="'+RAW+'" stroke-width="3.5" stroke-linecap="round" opacity="0.5" transform="rotate(3.6 515 468)"/>'+
              /* Subtle crack glyph when unstable */
              '<path id="p-fragCrack" d="M498 588 L488 600 L506 608 L494 622" fill="none" stroke="'+WARN+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+
            '</g>'+
            '<rect x="396" y="370" width="208" height="32" rx="16" fill="'+BG+'"/>'+
            '<text x="500" y="392" text-anchor="middle" fill="'+RAW+'" font-size="21" font-style="italic" font-family="Newsreader,Georgia,serif">'+L.fragile+'</text>'+
          '</g>'+

          /* === LAYER 1 (BOTTOM): EXISTING FILES IN PLACE + ANCHOR PILINGS === */
          '<g id="p-piers">'+
            TX.map(function(cx){
              return '<line class="pier" pathLength="1" x1="'+cx+'" y1="758" x2="'+cx+'" y2="824" stroke="'+SIG+'" stroke-width="2.2" opacity="0.65"/>'+
                     '<circle class="pierDot" cx="'+cx+'" cy="824" r="4" fill="'+SIG+'"/>';
            }).join('')+
          '</g>'+

          '<g id="p-floor">'+
            '<line id="p-groundLine" pathLength="1" x1="64" y1="824" x2="936" y2="824" stroke="'+HAIR+'" stroke-width="1.2"/>'+
            TX.map(function(cx,i){
              return '<g class="tileW" data-i="'+i+'">'+
                '<rect class="tileR" x="'+(cx-58)+'" y="828" width="116" height="84" rx="12" fill="'+DEEP+'" stroke="'+HAIR+'" stroke-width="1.5"/>'+
                '<line class="tileTop" x1="'+(cx-40)+'" y1="850" x2="'+(cx+28)+'" y2="850" stroke="'+PAL[i]+'" stroke-width="4.5" stroke-linecap="round" opacity="0.82"/>'+
                bars(cx-40,869,[74,56,64],13,'#58576b',3.4,'tl')+
              '</g>';
            }).join('')+
            '<rect x="270" y="936" width="460" height="32" rx="12" fill="'+BG+'"/>'+
            '<text id="p-flab" x="500" y="958" text-anchor="middle" fill="'+DUST+'" font-size="20" font-family="Inter,system-ui,sans-serif" font-weight="500">'+L.folder+'</text>'+
          '</g>'+

          /* === OPERATOR READ ARCS & DROP BEAMS (behind edifice & foundation) === */
          '<g id="p-arcs">'+
            '<path id="p-arc1L" pathLength="1" d="'+arcD(ARC1L)+'" fill="none" stroke="'+PAL[0]+'" stroke-width="1.6"/>'+
            '<path id="p-arc1R" pathLength="1" d="'+arcD(ARC1R)+'" fill="none" stroke="'+PAL[0]+'" stroke-width="1.6"/>'+
            '<path id="p-arc2" pathLength="1" d="'+arcD(ARC2)+'" fill="none" stroke="'+PAL[1]+'" stroke-width="1.6"/>'+
            '<path id="p-arc3" pathLength="1" d="'+arcD(ARC3)+'" fill="none" stroke="'+PAL[3]+'" stroke-width="1.6"/>'+
            '<path id="p-arc4" pathLength="1" d="'+arcD(ARC4)+'" fill="none" stroke="'+PAL[4]+'" stroke-width="1.6"/>'+
            /* Vertical build guides from operators to Tiers */
            '<line id="p-drop1" pathLength="1" x1="500" y1="137" x2="500" y2="516" stroke="'+PAL[0]+'" stroke-width="1.5"/>'+
            '<line id="p-drop2" pathLength="1" x1="306" y1="137" x2="306" y2="404" stroke="'+PAL[1]+'" stroke-width="1.5"/>'+
            '<line id="p-drop3" pathLength="1" x1="500" y1="137" x2="500" y2="404" stroke="'+PAL[3]+'" stroke-width="1.5"/>'+
            '<line id="p-drop4" pathLength="1" x1="694" y1="137" x2="694" y2="404" stroke="'+PAL[4]+'" stroke-width="1.5"/>'+
          '</g>'+

          /* === LAYER 2 (FOUNDATION SLAB): PROJECT_INDEX.md + AGENTS.md === */
          '<g id="p-found">'+
            /* Clean matte interrupt over vertical axis */
            '<rect x="52" y="630" width="896" height="138" rx="22" fill="'+BG+'"/>'+
            /* Heavy architectural footing container */
            '<rect id="p-slabR" x="64" y="640" width="872" height="118" rx="18" fill="'+GOLD_BG+'" stroke="rgba(255,227,90,.55)" stroke-width="1.8"/>'+
            /* Load-bearing golden datum top beam */
            '<line id="p-datum" pathLength="1" x1="84" y1="640" x2="916" y2="640" stroke="'+SIG+'" stroke-width="4" stroke-linecap="round"/>'+
            /* Subtle reinforcement shimmer sweep */
            '<line id="p-slabSweep" pathLength="1" x1="84" y1="640" x2="916" y2="640" stroke="'+CORE+'" stroke-width="6.5" stroke-linecap="round" filter="url(#plglow)"/>'+

            /* Left Foundation Block: PROJECT_INDEX.md */
            '<g id="p-idx">'+
              '<rect x="82" y="656" width="382" height="86" rx="12" fill="rgba(12,12,16,.55)" stroke="rgba(255,227,90,.30)" stroke-width="1.2"/>'+
              '<text x="104" y="684" fill="'+SIG+'" font-size="18.5" font-family="JetBrains Mono,ui-monospace,monospace">PROJECT_INDEX.md</text>'+
              '<circle cx="109" cy="705" r="3" fill="'+SIG+'" opacity="0.75"/>'+
              '<circle cx="109" cy="723" r="3" fill="'+SIG+'" opacity="0.75"/>'+
              bars(122,705,[246,198],18,'#cfcfda',4.2,'ib')+
            '</g>'+

            /* Center Keystone locking foundation onto "la linea" */
            '<g id="p-keystone">'+
              '<line x1="464" y1="699" x2="536" y2="699" stroke="'+SIG+'" stroke-width="2" opacity="0.8"/>'+
              '<polygon points="500,683 516,699 500,715 484,699" fill="'+GOLD_BG+'" stroke="'+SIG+'" stroke-width="2.2"/>'+
              '<circle cx="500" cy="699" r="4.5" fill="'+CORE+'" filter="url(#plglow)"/>'+
            '</g>'+

            /* Right Foundation Block: AGENTS.md (live rules that reinforce & update in place) */
            '<g id="p-ag">'+
              '<rect id="p-agR" x="536" y="656" width="382" height="86" rx="12" fill="rgba(12,12,16,.55)" stroke="rgba(255,227,90,.30)" stroke-width="1.2"/>'+
              '<text x="558" y="684" fill="'+SIG+'" font-size="18.5" font-family="JetBrains Mono,ui-monospace,monospace">AGENTS.md</text>'+
              /* Rule 1 (initial rule, cleanly refreshed in Step 5) */
              '<circle cx="563" cy="701" r="3.2" fill="#cfcfda"/>'+
              '<line id="p-rule1" pathLength="1" x1="576" y1="701" x2="778" y2="701" stroke="#cfcfda" stroke-width="4" stroke-linecap="round"/>'+
              /* Rule 2 (verified lesson from Step 3 — glows gold!) */
              '<g id="p-rule2W">'+
                '<circle cx="564" cy="718" r="6.8" fill="'+SIG+'"/>'+
                '<path d="M560.8 718.2 L563.1 720.5 L567.5 715.8" fill="none" stroke="#111" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>'+
                '<line id="p-rule2" pathLength="1" x1="578" y1="718" x2="884" y2="718" stroke="'+SIG+'" stroke-width="4.6" stroke-linecap="round"/>'+
              '</g>'+
              /* Rule 3 (added in Step 4 multi-agent pass) */
              '<g id="p-rule3W">'+
                '<circle cx="564" cy="734" r="5.5" fill="'+CORE+'"/>'+
                '<line id="p-rule3" pathLength="1" x1="578" y1="734" x2="846" y2="734" stroke="'+SIG+'" stroke-width="3.8" stroke-linecap="round" opacity="0.88"/>'+
              '</g>'+
            '</g>'+
          '</g>'+

          /* === LAYER 3 (THE RISING EDIFICE): 4 ARCHITECTURAL TIERS === */
          '<g id="p-edifice">'+
            /* Vertical structural tie-columns connecting tiers */
            '<g id="p-cols">'+
              '<line class="col1" pathLength="1" x1="258" y1="640" x2="258" y2="626" stroke="'+SIG+'" stroke-width="3"/>'+
              '<line class="col1" pathLength="1" x1="500" y1="640" x2="500" y2="626" stroke="'+SIG+'" stroke-width="3"/>'+
              '<line class="col1" pathLength="1" x1="742" y1="640" x2="742" y2="626" stroke="'+SIG+'" stroke-width="3"/>'+
              '<line class="col2" pathLength="1" x1="306" y1="516" x2="306" y2="504" stroke="'+SIG+'" stroke-width="2.6"/>'+
              '<line class="col2" pathLength="1" x1="500" y1="516" x2="500" y2="504" stroke="'+SIG+'" stroke-width="2.6"/>'+
              '<line class="col2" pathLength="1" x1="694" y1="516" x2="694" y2="504" stroke="'+SIG+'" stroke-width="2.6"/>'+
              '<line class="col3" pathLength="1" x1="396" y1="404" x2="396" y2="392" stroke="'+SIG+'" stroke-width="2.4"/>'+
              '<line class="col3" pathLength="1" x1="604" y1="404" x2="604" y2="392" stroke="'+SIG+'" stroke-width="2.4"/>'+
              '<line class="col4" pathLength="1" x1="448" y1="302" x2="448" y2="290" stroke="'+SIG+'" stroke-width="2.2"/>'+
              '<line class="col4" pathLength="1" x1="552" y1="302" x2="552" y2="290" stroke="'+SIG+'" stroke-width="2.2"/>'+
            '</g>'+

            /* TIER 1 (Step 3 — 3 wide bays, 704px total: x=148..852, y=516..626) */
            '<g id="p-t1">'+
              BAY('t1a',148,516,220,110,PAL[0],[150,118,136,92],'t1l')+
              BAY('t1b',384,516,232,110,SIG,[162,134,152,110],'t1l')+
              BAY('t1c',632,516,220,110,PAL[1],[146,122,138,88],'t1l')+
              /* Brief friction badge caught on Tier 1 right bay during Step 3 */
              '<g id="p-clash">'+
                '<circle cx="742" cy="571" r="22" fill="'+BG+'" stroke="'+WARN+'" stroke-width="2.2"/>'+
                '<text x="742" y="579" text-anchor="middle" fill="'+WARN+'" font-size="24" font-family="Inter,system-ui,sans-serif" font-weight="600">≠</text>'+
              '</g>'+
            '</g>'+

            /* TIER 2 (Step 4 — 3 parallel bays, 564px total: x=218..782, y=404..504) */
            '<g id="p-t2">'+
              BAY('t2a',218,404,176,100,PAL[1],[120,96,108],'t2l')+
              BAY('t2b',410,404,180,100,PAL[3],[124,102,114],'t2l')+
              BAY('t2c',606,404,176,100,PAL[4],[118,92,106],'t2l')+
            '</g>'+

            /* TIER 3 (Step 5 — twin pavilions, 400px total: x=300..700, y=302..392) */
            '<g id="p-t3">'+
              BAY('t3a',300,302,188,90,PAL[2],[128,100,112],'t3l')+
              BAY('t3b',512,302,188,90,SIG,[128,104,116],'t3l')+
            '</g>'+

            /* TIER 4 / CROWN & APEX (Step 5 climax: x=382..618, y=214..290 + apex at y=186) */
            '<g id="p-t4">'+
              '<rect id="p-crownR" x="382" y="214" width="236" height="76" rx="15" fill="'+GOLD_BG+'" stroke="'+SIG+'" stroke-width="1.8"/>'+
              '<line x1="406" y1="214" x2="594" y2="214" stroke="'+CORE+'" stroke-width="3" stroke-linecap="round"/>'+
              bars(414,242,[172,134],19,SIG,4,'t4l')+
              '<line id="p-spire" pathLength="1" x1="500" y1="214" x2="500" y2="188" stroke="'+SIG+'" stroke-width="2.6"/>'+
              '<g id="p-apex">'+
                '<circle cx="500" cy="186" r="15" fill="rgba(255,227,90,.14)"/>'+
                '<polygon points="500,175 511,186 500,197 489,186" fill="'+CORE+'" stroke="'+SIG+'" stroke-width="1.6" filter="url(#plglow)"/>'+
              '</g>'+
            '</g>'+
          '</g>'+

          /* === LAYER 4 (SKY OPERATORS): INTERCHANGEABLE HARNESSES / AGENTS / LLMS === */
          '<g id="p-ops">'+
            /* Step 3: single agent centered cleanly on "la linea" */
            PILL('op1',500,114,228,PAL[0],0,L.op1)+
            /* Step 4: 3 parallel agents across new harness & LLMs */
            PILL('op2',212,114,228,PAL[1],1,L.op2)+
            PILL('op3',500,114,228,PAL[3],2,L.op3)+
            PILL('op4',788,114,228,PAL[4],3,L.op4)+
            /* Step 5: sleek continuous relay nodes cycling effortlessly across sessions */
            '<g id="p-relay">'+
              [0,1,2,3].map(function(k){
                var rx=[260,420,580,740][k];
                return '<g class="relN" data-k="'+k+'">'+
                  '<circle cx="'+rx+'" cy="114" r="18" fill="'+PANE+'" stroke="'+PAL[k]+'" stroke-width="1.8"/>'+
                  GLYPH(k,rx,114,PAL[k])+
                '</g>';
              }).join('')+
              '<line id="p-relLine" x1="278" y1="114" x2="722" y2="114" stroke="'+HAIR+'" stroke-width="1.2" stroke-dasharray="4 6"/>'+
            '</g>'+
          '</g>'+

          /* Traveling golden sparks (reading foundations + saving lessons + final climb) */
          '<circle id="p-spA" cx="500" cy="500" r="7.5" fill="'+CORE+'" filter="url(#plglow)"/>'+
          '<circle id="p-spB" cx="500" cy="500" r="7.5" fill="'+CORE+'" filter="url(#plglow)"/>'+
          '<circle id="p-spC" cx="500" cy="500" r="7.5" fill="'+CORE+'" filter="url(#plglow)"/>'+
        '</g>'+
      '</g>'+

      /* === END CARD === */
      '<g id="p-end">'+
        '<circle cx="500" cy="405" r="56" fill="'+BG+'"/>'+
        MARK(500,405,3.4,'p-endmark')+
        '<text id="p-endl" x="474" y="550" text-anchor="end" fill="'+RAW+'" font-size="42" font-style="italic" font-family="Newsreader,Georgia,serif">'+L.left+'</text>'+
        '<text id="p-endr" x="526" y="550" text-anchor="start" fill="'+MOON+'" font-size="42" font-weight="500" font-family="Newsreader,Georgia,serif">'+L.right+'</text>'+
      '</g>'+
    '</svg>';

    var stage=root.querySelector('.film-stage');
    stage.innerHTML=svg;
    var $=function(id){return stage.querySelector('#p-'+id)};
    var all=function(sel,el){return [].slice.call((el||stage).querySelectorAll(sel))};

    var E={};
    'cam axis axisCore scene aura head sessW sessDot sessTxt fragile fragStack fragTop fragCrack piers floor groundLine flab arcs arc1L arc1R arc2 arc3 arc4 drop1 drop2 drop3 drop4 found slabR datum slabSweep idx keystone ag agR rule1 rule2W rule2 rule3W rule3 edifice cols t1 t1a t1b t1c clash t2 t2a t2b t2c t3 t3a t3b t4 crownR spire apex ops op1 op2 op3 op4 relay relLine spA spB spC end endmark endl endr'
      .split(' ').forEach(function(k){E[k]=$(k)});

    var tileW=all('.tileW'), tileR=all('.tileR'), tileTop=all('.tileTop');
    var piers=all('.pier'), pierDots=all('.pierDot');
    var ib=all('.ib'), t1l=all('.t1l'), t2l=all('.t2l'), t3l=all('.t3l'), t4l=all('.t4l');
    var col1=all('.col1'), col2=all('.col2'), col3=all('.col3'), col4=all('.col4');
    var relN=all('.relN');
    var caps=all('.film-cap p',root), steps=all('.film-steps button',root);

    var op=function(el,v){el.setAttribute('opacity',clamp(v).toFixed(3))};
    var draw=function(el,p){p=clamp(p);el.setAttribute('stroke-dasharray','1 1');el.setAttribute('stroke-dashoffset',(1-p).toFixed(3))};
    var pop=function(el,p,cx,cy){
      p=clamp(p);
      var s=.88+.12*back(p);
      el.setAttribute('transform','translate('+cx+' '+cy+') scale('+s.toFixed(4)+') translate('+(-cx)+' '+(-cy)+')');
      op(el,clamp(p*1.6));
    };
    var riseBay=function(el,p,dist){
      p=clamp(p);
      var dy=((dist||26)*(1-easeOut(p))).toFixed(1);
      el.setAttribute('transform','translate(0 '+dy+')');
      op(el,clamp(p*1.45));
    };
    var setSpark=function(el,pos,alpha){
      if(alpha<=.01||!pos){op(el,0);return}
      el.setAttribute('cx',pos[0].toFixed(1));
      el.setAttribute('cy',pos[1].toFixed(1));
      op(el,alpha);
    };

    var render=function(t){
      t=((t%T)+T)%T;
      var fadeOut=1-ramp(t,17.0,17.5);
      var dim=1-.90*ramp(t,15.1,15.6);

      /* Gentle architectural camera breathing: slightly closer for foundations, pulling back as edifice grows tall */
      var camS=1.03-.03*ease(ramp(t,0,1.2))+.025*ease(ramp(t,3.0,4.2))-.045*ease(ramp(t,12.2,14.8));
      E.cam.setAttribute('transform','translate(500 520) scale('+camS.toFixed(4)+') translate(-500 -520)');
      op(E.scene,dim*fadeOut);

      /* Header metadata & live session counter */
      op(E.head,ramp(t,.2,.75));
      var sessOn=ramp(t,3.1,3.6);
      op(E.sessW,sessOn);
      if(t<6.2){
        E.sessTxt.textContent=L.setup;
        E.sessTxt.setAttribute('fill',DUST);
        op(E.sessDot,.55);
      }else if(t<9.6){
        E.sessTxt.textContent=L.sessionPrefix+'01';
        E.sessTxt.setAttribute('fill',MOON);
        op(E.sessDot,1);
      }else if(t<12.8){
        E.sessTxt.textContent=L.sessionPrefix+'04';
        E.sessTxt.setAttribute('fill',MOON);
        op(E.sessDot,1);
      }else{
        var nums=[8,12,18,24,31,42];
        var idxN=Math.min(nums.length-1,Math.floor(ramp(t,12.8,14.9)*nums.length));
        var sNum=nums[idxN]<10?'0'+nums[idxN]:String(nums[idxN]);
        E.sessTxt.textContent=L.sessionPrefix+sNum;
        E.sessTxt.setAttribute('fill',SIG);
        op(E.sessDot,.65+.35*Math.sin(t*10));
      }

      /* === STEP 1 (0.0 - 3.0s): Existing files scattered + fragile ungrounded attempt fails === */
      var floorIn=ramp(t,0,.6);
      op(E.floor,floorIn);
      draw(E.groundLine,ramp(t,2.95,3.65));

      /* Tiles settle smoothly from slightly crooked (Step 1) to crisp aligned-in-place (Step 2) */
      var settle=ease(ramp(t,3.05,3.85));
      tileW.forEach(function(g,i){
        var tin=ramp(t,.1+i*.06,.48+i*.06);
        var rot=(TILT[i]*(1-settle)).toFixed(2);
        var dy=(DY[i]*(1-settle)+(22*(1-easeOut(tin)))).toFixed(1);
        g.setAttribute('transform','translate(0 '+dy+') rotate('+rot+' '+TX[i]+' 870)');
        op(g,tin);
      });

      /* Fragile ungrounded stack rises (0.65..1.6), tilts/cracks (1.6..2.3), dissolves (2.3..2.85) */
      var fIn=ramp(t,.65,1.25);
      var fOut=1-ramp(t,2.25,2.85);
      op(E.fragile,fIn*fOut);
      var wob=ease(ramp(t,1.55,2.35));
      var shake=t>=1.55&&t<2.45?Math.sin((t-1.55)*26)*2.4*wob:0;
      E.fragStack.setAttribute('transform','translate('+(18*wob+shake).toFixed(1)+' '+(12*wob+24*(1-easeOut(fIn))).toFixed(1)+') rotate('+(6.5*wob).toFixed(2)+' 500 660)');
      var fCrackOn=ramp(t,1.65,1.95)*(1-ramp(t,2.3,2.75));
      op(E.fragCrack,fCrackOn);
      E.fragTop.setAttribute('stroke',t>=1.65?WARN:RAW);

      /* === STEP 2 (3.0 - 6.2s): Golden plumb-line + Solid Foundation Slab + Anchor Pilings === */
      var fndIn=ramp(t,3.1,3.75);
      op(E.found,fndIn);
      var fndDy=(20*(1-easeOut(fndIn))).toFixed(1);
      E.found.setAttribute('transform','translate(0 '+fndDy+')');
      draw(E.datum,ramp(t,3.25,4.15));
      pop(E.idx,ramp(t,3.55,4.15),273,699);
      ib.forEach(function(b,i){draw(b,ramp(t,4.05+i*.22,4.55+i*.22))});
      pop(E.keystone,ramp(t,3.85,4.3),500,699);
      pop(E.ag,ramp(t,4.1,4.65),727,699);
      draw(E.rule1,ramp(t,4.6,5.15));

      /* Aura glows once foundation locks in */
      var auraBase=ramp(t,3.6,4.6)*.7 + ramp(t,12.8,14.5)*.3;
      op(E.aura,auraBase);

      /* Anchor pilings drive straight down into all 6 files in place */
      piers.forEach(function(p,i){
        var pp=ramp(t,4.35+i*.15,4.85+i*.15);
        draw(p,pp);
        op(p,pp>0?.65:0);
      });
      pierDots.forEach(function(d,i){
        pop(d,ramp(t,4.78+i*.15,5.05+i*.15),TX[i],824);
      });

      /* Tile borders: violet when ungrounded, golden flash when anchored, calm gold hairline after */
      tileR.forEach(function(r,i){
        var hit=Math.max(0,1-Math.abs(t-(4.92+i*.15))/.28);
        var finPulse=t>=13.8&&t<15.0?Math.sin(ramp(t,13.8,15.0)*Math.PI)*.55:0;
        if(hit>.02){
          r.setAttribute('stroke',SIG);
          r.setAttribute('stroke-width',(1.6+2.2*hit).toFixed(2));
          r.setAttribute('fill','rgba(255,227,90,'+(.18*hit).toFixed(3)+')');
        }else if(t>=4.92+i*.15){
          r.setAttribute('stroke','rgba(255,227,90,'+(.32+.48*finPulse).toFixed(3)+')');
          r.setAttribute('stroke-width',(1.4+1.2*finPulse).toFixed(2));
          r.setAttribute('fill',finPulse>.05?'rgba(255,227,90,'+(.10*finPulse).toFixed(3)+')':DEEP);
        }else{
          r.setAttribute('stroke','rgba(170,162,214,.32)');
          r.setAttribute('stroke-width','1.4');
          r.setAttribute('fill',DEEP);
        }
        tileTop[i].setAttribute('opacity',(t>=4.92+i*.15?.92:.52).toFixed(2));
      });

      /* === STEP 3 (6.2 - 9.6s): Single agent reads foundations symmetrically, builds Tier 1, learns & reinforces === */
      var op1In=ramp(t,6.2,6.65);
      var op1Out=1-ramp(t,8.95,9.45);
      var op1Vis=op1In*op1Out;
      pop(E.op1,op1In,500,114);
      op(E.op1,op1Vis);

      /* Twin symmetrical read arcs to PROJECT_INDEX.md & AGENTS.md, then golden sparks shoot UP */
      var a1=ramp(t,6.45,6.85)*(1-ramp(t,8.8,9.25));
      draw(E.arc1L,ramp(t,6.45,6.95)); op(E.arc1L,a1*.52);
      draw(E.arc1R,ramp(t,6.45,6.95)); op(E.arc1R,a1*.52);
      var d1=ramp(t,6.95,7.3)*(1-ramp(t,8.7,9.1));
      draw(E.drop1,ramp(t,6.95,7.35));
      op(E.drop1,d1*.48);

      /* Tier 1 rises cleanly onto the golden datum */
      col1.forEach(function(c,i){draw(c,ramp(t,7.0+i*.08,7.3+i*.08));op(c,ramp(t,7.0,7.2))});
      riseBay(E.t1a,ramp(t,7.05,7.55),24);
      riseBay(E.t1b,ramp(t,7.22,7.72),24);
      riseBay(E.t1c,ramp(t,7.40,7.90),24);
      t1l.forEach(function(l,i){draw(l,ramp(t,7.45+(i%4)*.12,7.85+(i%4)*.12))});

      /* Brief friction on Tier 1 right bay (7.8..8.35) -> fixed -> lesson drops into AGENTS.md Rule 2 */
      var clashVis=ramp(t,7.75,8.0)*(1-ramp(t,8.35,8.65));
      op(E.clash,clashVis);
      var t1cRect=E.t1c.querySelector('.bayR');
      if(clashVis>.05){
        t1cRect.setAttribute('stroke',WARN);
        t1cRect.setAttribute('stroke-width',(1.6+1.4*clashVis).toFixed(2));
      }else{
        t1cRect.setAttribute('stroke',t>=8.55?'rgba(255,227,90,.36)':HAIR);
        t1cRect.setAttribute('stroke-width','1.5');
      }

      /* Verified lesson locks into AGENTS.md Rule 2 permanently! */
      var r2Pop=ramp(t,8.55,8.95);
      pop(E.rule2W,r2Pop,564,718);
      draw(E.rule2,ramp(t,8.65,9.2));

      /* === STEP 4 (9.6 - 12.8s): Switch harness, LLMs & multi-agent in parallel -> Tier 2 rises! === */
      var mIn=ramp(t,9.6,10.05);
      var mOut=1-ramp(t,12.45,12.85);
      var mVis=mIn*mOut;
      pop(E.op2,ramp(t,9.6,10.05),212,114); op(E.op2,mVis);
      pop(E.op3,ramp(t,9.72,10.17),500,114); op(E.op3,mVis);
      pop(E.op4,ramp(t,9.84,10.29),788,114); op(E.op4,mVis);

      /* All 3 parallel agents read the SAME foundations simultaneously */
      var mArcs=ramp(t,9.95,10.35)*(1-ramp(t,12.35,12.75));
      draw(E.arc2,ramp(t,9.95,10.4)); op(E.arc2,mArcs*.52);
      draw(E.arc3,ramp(t,10.0,10.45)); op(E.arc3,mArcs*.45);
      draw(E.arc4,ramp(t,10.05,10.5)); op(E.arc4,mArcs*.52);

      var mDrops=ramp(t,10.65,11.0)*(1-ramp(t,12.25,12.65));
      draw(E.drop2,ramp(t,10.65,11.05)); op(E.drop2,mDrops*.48);
      draw(E.drop3,ramp(t,10.7,11.1)); op(E.drop3,mDrops*.40);
      draw(E.drop4,ramp(t,10.75,11.15)); op(E.drop4,mDrops*.48);

      /* Tier 2 builds cleanly in parallel across all 3 bays */
      col2.forEach(function(c,i){draw(c,ramp(t,10.75+i*.06,11.05+i*.06));op(c,ramp(t,10.75,10.95))});
      riseBay(E.t2a,ramp(t,10.85,11.35),24);
      riseBay(E.t2b,ramp(t,10.92,11.42),24);
      riseBay(E.t2c,ramp(t,11.00,11.50),24);
      t2l.forEach(function(l,i){draw(l,ramp(t,11.25+(i%3)*.12,11.68+(i%3)*.12))});

      /* Second lesson strengthens AGENTS.md Rule 3 */
      pop(E.rule3W,ramp(t,11.85,12.25),564,734);
      draw(E.rule3,ramp(t,11.95,12.45));

      /* === STEP 5 (12.8 - 15.2s): Continuous multi-session growth -> Tier 3 + Crown + Apex! === */
      var relVis=ramp(t,12.8,13.2);
      op(E.relay,relVis);
      op(E.relLine,relVis*.55);
      relN.forEach(function(n,k){
        var cyc=.45+.55*(.5+.5*Math.sin((t-12.8)*4.8-k*1.35));
        op(n,relVis*cyc);
        var sc=.92+.12*cyc;
        var rx=[260,420,580,740][k];
        n.setAttribute('transform','translate('+rx+' 114) scale('+sc.toFixed(3)+') translate('+(-rx)+' -114)');
      });

      /* Rule 1 lean refresh in place during Step 5 (never bloats, stays sharp) */
      var r1Refresh=t>=13.15&&t<13.85?Math.sin(ramp(t,13.15,13.85)*Math.PI):0;
      E.rule1.setAttribute('stroke',t>=13.5?SIG:'#cfcfda');
      E.rule1.setAttribute('stroke-width',(4+2*r1Refresh).toFixed(2));

      /* Tier 3 rises */
      col3.forEach(function(c,i){draw(c,ramp(t,12.85+i*.08,13.15+i*.08));op(c,ramp(t,12.85,13.05))});
      riseBay(E.t3a,ramp(t,12.95,13.48),24);
      riseBay(E.t3b,ramp(t,13.05,13.58),24);
      t3l.forEach(function(l,i){draw(l,ramp(t,13.35+(i%3)*.1,13.75+(i%3)*.1))});

      /* Tier 4 Crown + Apex star lock into place */
      col4.forEach(function(c,i){draw(c,ramp(t,13.55+i*.06,13.85+i*.06));op(c,ramp(t,13.55,13.75))});
      riseBay(E.t4,ramp(t,13.65,14.2),26);
      t4l.forEach(function(l,i){draw(l,ramp(t,13.95+i*.15,14.35+i*.15))});
      draw(E.spire,ramp(t,14.1,14.42));
      pop(E.apex,ramp(t,14.25,14.72),500,186);

      /* Foundation reinforcement glow & sweep pulses */
      var sweepA=t>=8.55&&t<9.35?Math.sin(ramp(t,8.55,9.35)*Math.PI):0;
      var sweepB=t>=11.85&&t<12.55?Math.sin(ramp(t,11.85,12.55)*Math.PI):0;
      var sweepC=t>=14.2&&t<15.05?Math.sin(ramp(t,14.2,15.05)*Math.PI):0;
      var sw=Math.max(sweepA,sweepB,sweepC);
      draw(E.slabSweep,sw>0?1:0);
      op(E.slabSweep,sw*.95);
      E.slabR.setAttribute('stroke-width',(1.8+1.8*sw).toFixed(2));
      E.agR.setAttribute('stroke',sw>.15?SIG:'rgba(255,227,90,.30)');

      /* Traveling golden sparks across Steps 3, 4 and 5 */
      var pA=null, aA=0, pB=null, aB=0, pC=null, aC=0;
      if(t>=6.65&&t<7.25){
        /* Step 3: Foundation (both sides) -> Op1 (reads map & rules symmetrically) */
        var u3r=ease(ramp(t,6.65,7.25));
        var al3=Math.sin(u3r*Math.PI)*1.2;
        pA=bez(ARC1L[3],ARC1L[2],ARC1L[1],ARC1L[0],u3r); aA=al3;
        pB=bez(ARC1R[3],ARC1R[2],ARC1R[1],ARC1R[0],u3r); aB=al3;
      }else if(t>=8.18&&t<8.75){
        /* Step 3: Tier 1 clash -> AGENTS.md Rule 2 (lesson reinforces foundation!) */
        var u3l=ease(ramp(t,8.18,8.75));
        pA=bez([742,571],[790,635],[695,675],[585,718],u3l);
        aA=Math.sin(u3l*Math.PI)*1.25;
      }else if(t>=10.25&&t<10.85){
        /* Step 4: Foundation -> all 3 parallel agents simultaneously! */
        var u4=ease(ramp(t,10.25,10.85));
        var al4=Math.sin(u4*Math.PI)*1.2;
        pA=bez(ARC2[3],ARC2[2],ARC2[1],ARC2[0],u4); aA=al4;
        pB=bez(ARC3[3],ARC3[2],ARC3[1],ARC3[0],u4); aB=al4;
        pC=bez(ARC4[3],ARC4[2],ARC4[1],ARC4[0],u4); aC=al4;
      }else if(t>=11.55&&t<12.1){
        /* Step 4: Tier 2 -> AGENTS.md Rule 3 */
        var u4l=ease(ramp(t,11.55,12.1));
        pA=bez([694,454],[780,555],[760,655],[630,734],u4l);
        aA=Math.sin(u4l*Math.PI)*1.2;
      }else if(t>=14.0&&t<14.85){
        /* Step 5 climax: golden current climbs central spine from Foundation to Apex! */
        var u5=ease(ramp(t,14.0,14.85));
        pA=[500,699-(699-186)*u5];
        aA=Math.sin(u5*Math.PI)*1.3;
      }
      setSpark(E.spA,pA,aA);
      setSpark(E.spB,pB,aB);
      setSpark(E.spC,pC,aC);

      /* Central vertical axis ("la linea") + rising luminous spine */
      var axisOn=ramp(t,2.95,3.55);
      var axisFlare=Math.max(
        t>=2.95&&t<3.9?Math.sin(ramp(t,2.95,3.9)*Math.PI):0,
        t>=14.0&&t<15.0?Math.sin(ramp(t,14.0,15.0)*Math.PI)*.55:0
      );
      E.axis.setAttribute('stroke',t<2.95?RAW:SIG);
      E.axis.setAttribute('stroke-dasharray',t<2.95?'8 12':'none');
      E.axis.setAttribute('stroke-width',(1.6+0.5*axisOn+2.2*axisFlare).toFixed(2));
      op(E.axis,(.14+.18*axisOn+.48*axisFlare)*fadeOut);
      E.axis.setAttribute('filter',axisFlare>.15?'url(#plglow)':'');

      /* Structural spine climbs proportionally with each new tier! */
      var spineH=
        .26*ease(ramp(t,7.0,7.8))+
        .26*ease(ramp(t,10.8,11.5))+
        .24*ease(ramp(t,12.9,13.6))+
        .24*ease(ramp(t,13.65,14.45));
      draw(E.axisCore,spineH);
      op(E.axisCore,spineH>0?.72+.28*axisFlare:0);
      E.axisCore.setAttribute('filter',axisFlare>.15?'url(#plglow)':'');

      /* === END CARD (15.2 - 17.5s) === */
      var endOn=ramp(t,15.25,15.65)*fadeOut;
      op(E.end,endOn);
      var em=back(ramp(t,15.25,15.8));
      E.endmark.setAttribute('transform','translate(500 405) scale('+(.5+.5*em).toFixed(3)+') translate(-500 -405)');
      var tx=ease(ramp(t,15.45,16.0));
      E.endl.setAttribute('transform','translate('+(-34*(1-tx)).toFixed(1)+' 0)'); op(E.endl,tx*fadeOut);
      E.endr.setAttribute('transform','translate('+(34*(1-tx)).toFixed(1)+' 0)'); op(E.endr,tx*fadeOut);

      /* Sync step dots & captions */
      var st=0; for(var s=0;s<STEPS.length;s++) if(t>=STEPS[s]) st=s;
      caps.forEach(function(c,i){c.classList.toggle('on',i===st)});
      steps.forEach(function(b,i){b.classList.toggle('on',i===st);b.setAttribute('aria-current',i===st?'step':'false')});
    };

    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clock=0, last=null, playing=false, visible=false, raf=null, wanted=!reduce&&!opt.manual;
    var frame=function(now){if(last!==null)clock+=(now-last)/1000;last=now;render(clock);raf=playing&&visible?requestAnimationFrame(frame):null};
    var go=function(){if(playing&&visible&&!raf){last=null;raf=requestAnimationFrame(frame)}};
    var btn=root.querySelector('.film-play');
    var setPlay=function(p){playing=p;if(btn){btn.querySelector('.lab').textContent=p?btn.dataset.pause:btn.dataset.play;btn.setAttribute('aria-pressed',String(!p))}if(!p&&raf){cancelAnimationFrame(raf);raf=null}go()};
    if(btn)btn.addEventListener('click',function(){setPlay(!playing);wanted=playing});
    steps.forEach(function(b,i){b.addEventListener('click',function(){clock=STEPS[i]+[1.75,2.0,2.35,2.15,1.95][i];render(clock);if(!reduce)setPlay(true)})});
    if(opt.manual){render(0)}
    else if(reduce){root.classList.add('still');render(14.9)}
    else{
      render(0);
      if('IntersectionObserver' in window)new IntersectionObserver(function(e){visible=e[0].isIntersecting;if(!visible&&raf){cancelAnimationFrame(raf);raf=null}if(visible&&wanted&&!playing)setPlay(true);else go()},{threshold:.35}).observe(root);
      else{visible=true;if(wanted)setPlay(true)}
    }
    return {
      seek:function(t){playing=false;clock=t;render(t)},
      play:function(){setPlay(true)},
      pause:function(){setPlay(false)},
      isPlaying:function(){return playing},
      time:function(){return ((clock%T)+T)%T},
      T:T,
      STEPS:STEPS
    };
  };
})();
