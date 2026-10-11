(function(){
  var root=document.documentElement;
  document.querySelectorAll('.copy').forEach(function(b){
    b.addEventListener('click',function(){
      var el=document.getElementById(b.dataset.t),txt=el.textContent;
      var done=function(){b.textContent='copied';setTimeout(function(){b.textContent='copy'},1400)};
      var sel=function(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r)};
      try{navigator.clipboard.writeText(txt).then(done,sel)}catch(e){sel()}
    });
  });

  /* hero signal line: noisy points with a smoothed trend drawn over them */
  var cv=document.getElementById('sig'),cx=cv.getContext('2d'),W=0,H=0,t0=0,pts=[],N=48,reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  for(var i=0;i<N;i++){pts.push({n:Math.sin(i*12.9898)*43758.5453%1})}
  function css(v){return getComputedStyle(root).getPropertyValue(v).trim()}
  function size(){var r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);W=r.width;H=r.height;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
  function y(i,t){var x=i/(N-1);return H*(.78-.34*x-.07*Math.sin(x*7+t*.6))}
  function draw(t){
    cx.clearRect(0,0,W,H);
    var line=css('--line'),acc=css('--accent');
    cx.strokeStyle=line;cx.lineWidth=1;
    for(var g=1;g<6;g++){cx.beginPath();cx.moveTo(0,H*g/6);cx.lineTo(W,H*g/6);cx.stroke()}
    cx.fillStyle=acc;cx.globalAlpha=.35;
    for(var i=0;i<N;i++){var x=W*i/(N-1),yy=y(i,t)+pts[i].n*H*.18;cx.beginPath();cx.arc(x,yy,2.5,0,6.283);cx.fill()}
    cx.globalAlpha=.9;cx.strokeStyle=acc;cx.lineWidth=2.5;cx.beginPath();
    for(var j=0;j<N;j++){var X=W*j/(N-1),Y=y(j,t);j?cx.lineTo(X,Y):cx.moveTo(X,Y)}
    cx.stroke();cx.globalAlpha=1;
  }
  function loop(ts){draw(ts/1000);requestAnimationFrame(loop)}
  size();draw(0);
  addEventListener('resize',function(){size();draw(0)});
  if(!reduce)requestAnimationFrame(loop);
})();
