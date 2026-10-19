/* One shared, bounded WebGL buffer; HTML and Canvas remain the fallback. */
window.OrbitMaterials = (() => {
  const buffer=document.createElement('canvas');
  let gl,program,locations;
  const textures=new Map();
  const vertex='attribute vec2 position; varying vec2 uv; void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}';
  const fragment=`precision mediump float;
    varying vec2 uv; uniform sampler2D image; uniform float time,mode,surge;
    float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}
    float knot(float angle,float radius,float phase,float orbit){float d=atan(sin(angle-phase),cos(angle-phase));return exp(-d*d*22.-pow((radius-orbit)*25.,2.));}
    void main(){
      if(mode<.5){
        vec2 p=uv*2.-1.; float r=dot(p,p); if(r>1.){gl_FragColor=vec4(0.);return;}
        vec3 n=vec3(p,sqrt(1.-r));
        vec2 map=vec2(fract(atan(n.x,n.z)/6.283185+.52+time*.009),.5-asin(n.y)/3.141593);
        vec3 color=texture2D(image,map).rgb;
        float light=.16+.84*max(0.,dot(n,normalize(vec3(-.65,.4,.8))));
        color=color*light+vec3(.12,.2,.3)*pow(1.-n.z,3.)*.22;
        gl_FragColor=vec4(color,1.-smoothstep(.985,1.,r));
      }else{
        vec2 q=vec2(uv.x,1.-uv.y),p=q-vec2(.52,.52);
        float a=-.23,c=cos(a),s=sin(a);vec2 d=mat2(c,-s,s,c)*p;
        vec4 original=texture2D(image,q);
        vec2 plane=d/vec2(.46,.085);
        float radius=length(plane),angle=atan(plane.y,plane.x);
        float omega=.55/pow(max(radius,.42),1.2);
        float advected=angle-time*omega;
        vec2 orbit=vec2(cos(advected),sin(advected))*radius;
        float turbulence=noise(vec2(cos(advected),sin(advected))*3.+radius*38.)*.7+noise(orbit*17.+7.)*.3;
        float strands=.5+.5*sin(radius*110.+turbulence*3.);
        float knots=knot(angle,radius,time*.83,.68)+knot(angle,radius,time*.48+2.5,.9);
        // The upper/lower lensed image follows angular flow around the shadow.
        vec2 lens=p*vec2(1.,.6667);float arc=atan(lens.y,lens.x),rho=length(lens);
        float arcFlow=noise(vec2(cos(arc-time*.7),sin(arc-time*.7))*3.+rho*150.);
        float arcWeight=(1.-smoothstep(.025,.10,abs(d.y)));
        float structure=mix(arcFlow,turbulence*.85+strands*.15,arcWeight);
        float light=dot(original.rgb,vec3(.2126,.7152,.0722));
        float emission=smoothstep(.025,.17,light);
        float density=.28+structure*1.15+knots*1.6*arcWeight;
        density*=1.+.12*surge;
        vec3 temperature=mix(vec3(1.,.28,.045),vec3(1.,.79,.43),clamp(density*.5,0.,1.));
        vec3 radiance=temperature*density*sqrt(light)*1.8;
        vec3 mapped=.96*(1.-exp(-radiance));
        vec3 color=mix(original.rgb,mapped,emission*.9);
        gl_FragColor=vec4(color,original.a);
      }
    }`;
  function initialize(){
    try{
      gl=buffer.getContext('webgl',{alpha:true,premultipliedAlpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});
      if(!gl)return false;
      const shader=(type,code)=>{const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);return s;};
      const vs=shader(gl.VERTEX_SHADER,vertex),fs=shader(gl.FRAGMENT_SHADER,fragment);
      program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
      gl.deleteShader(vs);gl.deleteShader(fs);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS)){buffer.dataset.failure=gl.getProgramInfoLog(program)||'Shader link failed';gl.deleteProgram(program);program=null;return false;}
      gl.useProgram(program);
      const vertices=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertices);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
      locations=Object.fromEntries(['time','mode','surge'].map(name=>[name,gl.getUniformLocation(program,name)]));
      textures.clear();return true;
    }catch{program=null;return false;}
  }
  buffer.addEventListener('webglcontextlost',event=>{event.preventDefault();program=null;textures.clear();});
  buffer.addEventListener('webglcontextrestored',initialize);
  let attempted=false;
  function draw(context,image,time,mode,w,h,surge=0,low=false){
    if(!context||!image.complete||!image.naturalWidth)return false;
    if(!attempted){attempted=true;initialize();}
    if(!program||gl.isContextLost())return false;
    const cap=mode?low?270:1000:low?128:320,scale=Math.min(1,cap/Math.max(w,h));
    const bw=Math.max(1,Math.round(w*scale)),bh=Math.max(1,Math.round(h*scale));
    if(buffer.width!==bw||buffer.height!==bh){buffer.width=bw;buffer.height=bh;gl.viewport(0,0,bw,bh);}
    try{
      if(!textures.has(image)){
        const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);textures.set(image,texture);
      }else gl.bindTexture(gl.TEXTURE_2D,textures.get(image));
      gl.uniform1f(locations.time,time/1000);gl.uniform1f(locations.mode,mode);gl.uniform1f(locations.surge,surge);
      gl.drawArrays(gl.TRIANGLES,0,6);context.drawImage(buffer,0,0,w,h);return true;
    }catch{return false;}
  }
  return {draw,buffer};
})();
