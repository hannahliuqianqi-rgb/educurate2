import React, { useEffect, useRef } from 'react';
import { AppView } from '../types';
import { DisqusComments } from './DisqusComments';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initialize the WebGL Neuro-AI Shader Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    const vsSource = `
      attribute vec4 a_position;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = a_position;
        v_texCoord = a_position.xy * 0.5 + 0.5;
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                 -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
          dot(x12.zw,x12.zw)), 0.0);
        m = m * m;
        m = m * m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 a0 = x - floor(x + 0.5);
        vec3 g = a0.x  * vec3(x0.x,x12.xz) + h.x * vec3(x0.y,x12.yw);
        float n = 130.0 * dot(m, g);
        return n;
      }

      void main() {
        vec2 uv = v_texCoord;
        uv.x *= u_resolution.x / u_resolution.y;
        
        float n1 = snoise(uv * 2.0 + u_time * 0.1);
        float n2 = snoise(uv * 4.0 - u_time * 0.05);
        float noise = n1 * 0.6 + n2 * 0.4;
        
        vec3 color1 = vec3(0.85, 0.9, 1.0);
        vec3 color2 = vec3(0.95, 0.97, 1.0);
        vec3 color3 = vec3(0.98, 0.99, 1.0);
        
        vec3 finalColor = mix(color1, color2, noise * 0.5 + 0.5);
        finalColor = mix(finalColor, color3, clamp(n2 * 0.2, 0.0, 1.0));
        
        vec2 center = vec2(0.5 * (u_resolution.x / u_resolution.y), 0.5);
        float dist = distance(uv, center);
        finalColor *= 1.0 - dist * 0.1;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
      const shader = glCtx.createShader(type);
      if (!shader) return null;
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error(glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [
      -1.0, -1.0,
       1.0, -1.0,
      -1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
       1.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const timeUniformLocation = gl.getUniformLocation(program, "u_time");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    let animationFrameId: number;
    const startTime = Date.now();

    function resizeCanvas() {
      if (!canvas || !gl) return;
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;
      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
      }
    }

    function render() {
      if (!canvas || !gl || !program) return;
      resizeCanvas();
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      gl.useProgram(program);
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

      const currentTime = (Date.now() - startTime) / 1000.0;
      gl.uniform1f(timeUniformLocation, currentTime);
      gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(render);
    }

    render();

    const handleResize = () => {
      resizeCanvas();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-surface text-on-background font-body-md antialiased pt-16 md:pb-0 pb-[80px] relative min-h-screen">
      
      {/* WebGL Background */}
      <div id="webgl-bg-container" className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <canvas id="glcanvas" ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* TopNavBar */}
      <nav 
        aria-label="Top Navigation" 
        className="hidden md:flex fixed top-0 w-full z-50 justify-between items-center px-margin-desktop h-20 max-w-container-max mx-auto bg-surface/80 backdrop-blur-xl border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-transform duration-150 rounded-b-3xl mt-2 left-0 right-0"
      >
        <div className="flex items-center gap-stack-md cursor-pointer" onClick={() => onNavigate('landing')}>
          <span className="text-headline-md font-headline-md font-bold text-primary">EduCurate</span>
        </div>
        <div className="flex items-center gap-stack-lg">
          <button 
            aria-label="Search" 
            onClick={() => onNavigate('aspirators')}
            className="text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center p-2 rounded-full hover:bg-surface-container-low cursor-pointer"
          >
            <span className="material-symbols-outlined" data-icon="search">search</span>
          </button>
          <div className="flex gap-stack-md">
            <button 
              onClick={() => onNavigate('landing')}
              className="text-primary font-label-md hover:text-primary transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full cursor-pointer bg-transparent border-none"
            >
              Dashboard
            </button>
            <button 
              onClick={() => onNavigate('aspirators')}
              className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              Discovery
            </button>
            <button 
              onClick={() => onNavigate('learning_plan')}
              className="text-on-surface-variant text-label-md font-label-md hover:text-primary transition-colors cursor-pointer bg-transparent border-none"
            >
              My Library
            </button>
          </div>
          <button 
            onClick={() => onNavigate('parent_dashboard')}
            className="bg-primary text-on-primary text-label-md font-label-md px-6 py-2.5 rounded-full hover:bg-primary-container transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* BottomNavBar (Visible on Mobile Only) */}
      <nav 
        aria-label="Bottom Navigation" 
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile py-3 pb-safe bg-surface/90 backdrop-blur-lg shadow-[0_-8px_30px_rgba(0,0,0,0.08)] rounded-t-[2rem] border-t border-white/20"
      >
        <button 
          onClick={() => onNavigate('landing')}
          className="flex flex-col items-center justify-center bg-primary text-on-primary rounded-2xl px-5 py-2 transition-transform duration-200 shadow-md shadow-primary/20 cursor-pointer"
        >
          <span className="material-symbols-outlined filled" data-icon="home" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
          <span className="text-tiny font-tiny mt-1">Home</span>
        </button>
        <button 
          onClick={() => onNavigate('curator_ai')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant rounded-xl transition-colors cursor-pointer bg-transparent border-none"
        >
          <span className="material-symbols-outlined" data-icon="chat_bubble">chat_bubble</span>
          <span className="text-tiny font-tiny mt-1">Guide</span>
        </button>
        <button 
          onClick={() => onNavigate('aspirators')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant rounded-xl transition-colors cursor-pointer bg-transparent border-none"
        >
          <span className="material-symbols-outlined" data-icon="search">search</span>
          <span className="text-tiny font-tiny mt-1">Explore</span>
        </button>
        <button 
          onClick={() => onNavigate('quest_player')}
          className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-1 active:bg-surface-variant rounded-xl transition-colors cursor-pointer bg-transparent border-none"
        >
          <span className="material-symbols-outlined" data-icon="local_library">local_library</span>
          <span className="text-tiny font-tiny mt-1">Library</span>
        </button>
      </nav>

      {/* Main Content Canvas */}
      <main className="max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-xl flex flex-col gap-[120px] relative z-10 pt-24 md:pt-32">
        
        {/* Neural connection lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 3000" xmlns="http://www.w3.org/2000/svg">
          <path className="neural-line" d="M 500,0 C 700,500 300,800 500,1500 C 700,2200 300,2500 500,3000" fill="none" stroke="currentColor" strokeWidth="2"></path>
          <path className="neural-line" d="M 200,0 C 400,600 100,1000 300,1800 C 500,2600 200,2800 400,3000" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animationDuration: '25s', opacity: 0.1 }}></path>
          <path className="neural-line" d="M 800,0 C 600,400 900,900 700,1600 C 500,2300 800,2700 600,3000" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ animationDuration: '22s', opacity: 0.1 }}></path>
        </svg>

        {/* Hero Section: Centered Glassmorphism */}
        <section className="flex flex-col items-center justify-center text-center gap-stack-lg min-h-[80vh] relative z-10">
          <div className="glass-panel rounded-[3rem] p-stack-xl md:p-[80px] max-w-4xl mx-auto flex flex-col items-center gap-stack-lg shadow-2xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
            
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md text-primary px-4 py-2 rounded-full text-label-md font-label-md border border-white shadow-sm z-10">
              <span className="material-symbols-outlined text-[18px]" data-icon="auto_awesome">auto_awesome</span>
              Curated Clarity
            </div>

            <h1 className="text-display-lg font-display-lg text-on-surface z-10 leading-tight">
              A single home for <br className="hidden md:block" />
              <span className="text-primary relative inline-block">
                trusted learning
                <svg className="absolute w-full h-4 -bottom-2 left-0 text-primary-fixed-dim/80" preserveAspectRatio="none" viewBox="0 0 100 10">
                  <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="6"></path>
                </svg>
              </span> <br className="hidden md:block" /> across every age.
            </h1>

            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl z-10">
              Escape the endless scroll. EduCurate brings together meticulously vetted educational resources—from early childhood discovery to advanced adult learning—into one beautifully organized digital mentor.
            </p>

            <div className="flex flex-col sm:flex-row gap-stack-md mt-6 z-10">
              <button 
                onClick={() => onNavigate('aspirators')}
                className="bg-primary text-on-primary text-label-md font-label-md px-10 py-5 rounded-full hover:bg-primary-container transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 flex items-center justify-center gap-3 transform hover:-translate-y-1 cursor-pointer"
              >
                Start Your Learning Journey
                <span className="material-symbols-outlined text-[20px]" data-icon="arrow_forward">arrow_forward</span>
              </button>
              
              <button 
                onClick={() => scrollToSection('features-curated')}
                className="bg-white/80 backdrop-blur-md border border-outline-variant/30 text-on-surface text-label-md font-label-md px-10 py-5 rounded-full hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3 transform hover:-translate-y-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]" data-icon="play_circle">play_circle</span>
                See How It Works
              </button>
            </div>
          </div>

          {/* Floating Hero Image / Overlay */}
          <div className="w-full max-w-5xl mx-auto h-[400px] lg:h-[500px] rounded-[4rem] overflow-hidden shadow-2xl relative mt-[-60px] md:mt-[-80px] z-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent mix-blend-multiply z-10 pointer-events-none"></div>
            <img 
              alt="A diverse group of Singaporean children and a teacher (Chinese, Malay, and Indian) smiling and interacting with tablets in a bright, modern, and high-tech Singaporean classroom or library." 
              className="absolute inset-0 w-full h-full object-cover scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCsYOkSrzvuaHDLECJXwf3uPsWvcCF1zcI6W-SwItLJlWUivfL3-BmvWCANuRiP4kgvHIKS5GM__-j2XO_p1M8zJqogs33XVo3y7eV8hhC2qV3hFAzbAH3V6bh-TAqjkqrEHhXK15qEF0eyYV3AGYYYbvjLCnulx74wFoEn_e6t-mj1pFDAYukQAlp1ZBtLo0C6rd1bvVSWVIhluQOaFV7ejPXFfPwC7Jo36ldoIyboyuF7g0l8MwN2" 
              style={{ maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)' }}
            />
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 glass-panel p-stack-md rounded-[2rem] flex items-center gap-stack-md z-20">
              <div className="w-14 h-14 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-[28px]" data-icon="check_circle">check_circle</span>
              </div>
              <div className="pr-6 text-left">
                <p className="text-label-md font-label-md text-on-surface font-semibold">Curated by Experts</p>
                <p className="text-caption font-caption text-on-surface-variant">Over 10,000+ vetted resources</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid: Age Categories */}
        <section id="pathways-section" className="flex flex-col gap-stack-xl pt-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto flex flex-col gap-stack-md animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-headline-lg font-headline-lg text-on-surface">Learning pathways for every stage</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant">Tailored environments that adapt to the cognitive and emotional needs of the learner.</p>
          </div>

          <div className="bento-grid grid-cols-1 md:grid-cols-12 auto-rows-[minmax(280px,auto)]">
            
            {/* Early Childhood (Spans 8 cols on desktop) */}
            <div 
              onClick={() => onNavigate('junior')}
              className="md:col-span-8 bg-surface-lowest/80 backdrop-blur-xl border border-white/40 rounded-[3rem] overflow-hidden card-lift flex flex-col md:flex-row relative group cursor-pointer shadow-xl animate-fade-in-up" 
              style={{ animationDelay: '0.4s' }}
            >
              <div className="p-stack-xl flex-1 flex flex-col justify-between z-10 bg-gradient-to-r from-surface to-transparent/10">
                <div>
                  <span className="inline-flex items-center gap-2 bg-early-childhood/10 text-early-childhood px-4 py-1.5 rounded-full text-label-md font-label-md font-bold mb-6">
                    <span className="material-symbols-outlined text-[18px]" data-icon="toys">toys</span> Ages 3-7
                  </span>
                  <h3 className="text-headline-lg font-headline-lg text-on-surface mb-4">Early Childhood</h3>
                  <p className="text-body-lg font-body-lg text-on-surface-variant max-w-[320px]">Playful, high-contrast, and deeply tactile. Focused on fundamental concepts, emotional intelligence, and reducing cognitive load.</p>
                </div>
                <div className="mt-8 flex items-center text-early-childhood font-label-md text-label-md group-hover:underline text-lg font-semibold">
                  Go to EduCurate Junior 
                  <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1" data-icon="arrow_forward">arrow_forward</span>
                </div>
              </div>
              <div className="md:w-[45%] h-[250px] md:h-auto relative">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface z-10"></div>
                <img 
                  alt="A young Singaporean boy happily playing with a colorful, interactive educational tablet in a modern Singaporean home setting." 
                  className="absolute inset-0 w-full h-full object-cover rounded-r-[3rem]" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgBWEJup3KgCBKfNhwgENPLRVF1bq9epcttP3LFtHqmPS1O1GG4_4k2JpipJjHn7z0OPljdgAM7jiPlmppGrLZrP6laXOnV_PiyfCLYEYbjNBd9QlQR_BZoNKrlPyLHIKxm8RZss8U3vtcnANgRHIrJzJ3C3Fr7Zj2e6Rc_mI9jvYd2E34zSV7rloyLNycWUnbwEdX00HoVvVYrI3os6IZob6I7q4hN90EqMIqGch6vBOi6jSS7cyl"
                />
              </div>
            </div>

            {/* Primary / Middle (Spans 4 cols) */}
            <div 
              onClick={() => onNavigate('aspirators')}
              className="md:col-span-4 bg-primary-fixed/30 backdrop-blur-xl border border-primary-fixed/50 rounded-[3rem] overflow-hidden card-lift p-stack-xl flex flex-col relative group cursor-pointer shadow-xl animate-fade-in-up" 
              style={{ animationDelay: '0.5s' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full blur-2xl pointer-events-none"></div>
              <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-label-md font-label-md font-bold w-fit mb-6 relative z-10">
                <span className="material-symbols-outlined text-[18px]" data-icon="school">school</span> Ages 7-12
              </span>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-4 relative z-10">Primary</h3>
              <p className="text-body-md font-body-md text-on-surface-variant flex-1 relative z-10">Structured curiosity. Introducing more complex knowledge blocks, interactive quizzes, and project-based learning concepts.</p>
              <div className="mt-8 flex items-center text-primary font-label-md text-label-md group-hover:underline relative z-10 text-lg font-semibold">
                Explore Pathway 
                <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>

            {/* High School / Prep (Spans 4 cols) */}
            <div 
              onClick={() => onNavigate('quest_player')}
              className="md:col-span-4 bg-tertiary-fixed/30 backdrop-blur-xl border border-tertiary-fixed/50 rounded-[3rem] overflow-hidden card-lift p-stack-xl flex flex-col relative group cursor-pointer shadow-xl animate-fade-in-up" 
              style={{ animationDelay: '0.6s' }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-bl-full blur-2xl pointer-events-none"></div>
              <span className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-4 py-1.5 rounded-full text-label-md font-label-md font-bold w-fit mb-6 relative z-10">
                <span className="material-symbols-outlined text-[18px]" data-icon="architecture">architecture</span> Ages 15-18
              </span>
              <h3 className="text-headline-md font-headline-md text-on-surface mb-4 relative z-10">Teenagers</h3>
              <p className="text-body-md font-body-md text-on-surface-variant flex-1 relative z-10">Aged 13 and above. Tailored for secondary, JC, Poly, and ITE students with advanced subjects and exam frameworks.</p>
              <div className="mt-8 flex items-center text-tertiary font-label-md text-label-md group-hover:underline relative z-10 text-lg font-semibold">
                Explore Pathway 
                <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1" data-icon="arrow_forward">arrow_forward</span>
              </div>
            </div>

            {/* Adult / Lifelong (Spans 8 cols) */}
            <div 
              onClick={() => onNavigate('learning_plan')}
              className="md:col-span-8 bg-adult-ed text-on-tertiary border border-adult-ed/20 rounded-[3rem] overflow-hidden card-lift flex flex-col md:flex-row relative group cursor-pointer shadow-2xl shadow-adult-ed/20 animate-fade-in-up" 
              style={{ animationDelay: '0.7s' }}
            >
              <div className="p-stack-xl flex-1 flex flex-col justify-between z-10 bg-gradient-to-r from-adult-ed via-adult-ed/90 to-transparent">
                <div>
                  <span className="inline-flex items-center gap-2 bg-white/10 text-on-tertiary px-4 py-1.5 rounded-full text-label-md font-label-md font-bold mb-6 border border-white/20">
                    <span className="material-symbols-outlined text-[18px]" data-icon="workspace_premium">workspace_premium</span> Professional & Lifelong
                  </span>
                  <h3 className="text-headline-lg font-headline-lg text-on-tertiary mb-4">University & Beyond</h3>
                  <p className="text-body-lg font-body-lg text-gray-300 max-w-[320px]">Ages 18 and above. Professional, research-grade materials for university students and lifelong learners.</p>
                </div>
                <div className="mt-8 flex items-center text-secondary-fixed-dim font-label-md text-label-md group-hover:underline text-lg font-semibold">
                  Explore Pathway 
                  <span className="material-symbols-outlined ml-2 text-[20px] transition-transform group-hover:translate-x-1" data-icon="arrow_forward">arrow_forward</span>
                </div>
              </div>
              <div className="md:w-[45%] h-[250px] md:h-auto relative">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-adult-ed z-10"></div>
                <img 
                  alt="A Singaporean secondary school student focused and studying with a laptop in a modern, airy study space." 
                  className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-luminosity" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDx9JcruIJXb5sslSrDZ4ld-ZmQvlReGsgonbT47LCHknBaPhr5X-K4boyuR9OASc6j8OeRsqQ-nzgDTGIvyccvojtwcpr_n0hyImsQd89L8hKZafRBq_hub0Jer5-ZzsP9GJa1_My3cB9Q8KdJS0aEXPztw7sEB3f4cpB6GjsYiYhcmCkoLzEOYnY7RKJnrQZqvrMYad0gmogRaXLrUznMDkK7A0qXBn56LqEJpOcsgFA7F_O81zan"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Feature Highlight: Curated, Not Endless */}
        <section id="features-curated" className="py-16 md:py-32 mt-12 flex flex-col md:flex-row items-center gap-[80px] relative z-10 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-container-low/50 to-transparent -z-10 rounded-[4rem]"></div>
          
          <div className="flex-1 w-full flex justify-center">
            {/* Simulating a UI component interaction */}
            <div className="w-full max-w-lg glass-panel rounded-[3rem] p-stack-xl relative shadow-2xl">
              <div className="absolute -top-6 -left-6 bg-secondary text-on-secondary w-16 h-16 rounded-full flex items-center justify-center shadow-xl border-4 border-surface">
                <span className="material-symbols-outlined text-[32px]" data-icon="filter_list">filter_list</span>
              </div>
              <h4 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-widest mb-6 font-bold">The Algorithm</h4>
              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-4 bg-white/50 border border-outline-variant/30 rounded-2xl opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error text-[18px]" data-icon="close">close</span>
                    </div>
                    <span className="text-body-md font-body-md text-on-surface font-medium">Endless auto-play</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/50 border border-outline-variant/30 rounded-2xl opacity-60">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-error-container/50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-error text-[18px]" data-icon="close">close</span>
                    </div>
                    <span className="text-body-md font-body-md text-on-surface font-medium">Unverified sources</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-primary/5 border border-primary/20 rounded-3xl shadow-lg relative overflow-hidden transform scale-105 z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent translate-x-[-100%] animate-shimmer"></div>
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined font-bold" data-icon="check">check</span>
                    </div>
                    <span className="text-body-lg font-body-lg font-bold text-primary">Curated Knowledge Blocks</span>
                  </div>
                  <span className="bg-primary text-on-primary text-caption font-caption px-3 py-1 rounded-full relative z-10 shadow-sm font-semibold">Active</span>
                </div>

              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-stack-lg">
            <h2 className="text-display-lg font-display-lg text-on-surface">Curated, not endless.</h2>
            <p className="text-body-lg font-body-lg text-on-surface-variant leading-relaxed">
              We believe learning should be a guided journey, not a labyrinth. EduCurate acts as your digital mentor, filtering out the noise to present only high-quality, relevant resources. 
            </p>
            
            <ul className="mt-6 space-y-8">
              <li className="flex items-start gap-6 bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[24px]" data-icon="library_books">library_books</span>
                </div>
                <div>
                  <strong className="text-headline-md font-headline-md text-on-surface block mb-2">Knowledge Blocks</strong>
                  <span className="text-body-md font-body-md text-on-surface-variant">Information organized into digestible, logical steps.</span>
                </div>
              </li>
              
              <li className="flex items-start gap-6 bg-white/40 p-6 rounded-[2rem] border border-white/60 shadow-sm backdrop-blur-sm transition-transform hover:-translate-y-1">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                  <span className="material-symbols-outlined text-[24px]" data-icon="verified">verified</span>
                </div>
                <div>
                  <strong className="text-headline-md font-headline-md text-on-surface block mb-2">Trusted Sources Only</strong>
                  <span className="text-body-md font-body-md text-on-surface-variant">Every video, article, and book is vetted for accuracy.</span>
                </div>
              </li>
            </ul>
          </div>

        </section>

        {/* Community Feedback & Discussions Powered by Disqus */}
        <section id="community-discussions" className="py-12 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                <span className="material-symbols-outlined text-sm">forum</span> Community Forum
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Portal Feedback &amp; Student Community</h2>
              <p className="text-sm text-on-surface-variant max-w-xl mx-auto">
                Join the conversation! Leave feedback, share curriculum ideas, or connect with fellow learners across Singapore and beyond.
              </p>
            </div>

            <DisqusComments 
              pageIdentifier="PORTAL FEEDBACK AND STUDENT COMMUNITY"
              pageTitle="PORTAL FEEDBACK AND STUDENT COMMUNITY"
              pageUrl="https://educurate-vy74.vercel.app/"
            />
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full py-stack-xl px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-lowest/80 backdrop-blur-xl border-t border-white/40 mt-16 rounded-t-[3rem] relative z-10 shadow-[0_-4px_30px_rgba(0,0,0,0.02)]">
        <div className="text-headline-md font-headline-md font-bold text-primary">
          EduCurate
        </div>
        <div className="flex flex-wrap justify-center gap-gutter gap-6 text-center">
          <button onClick={() => onNavigate('parent_dashboard')} className="text-on-surface-variant text-body-md font-body-md hover:text-primary transition-all bg-transparent border-none cursor-pointer">
            Guardian Controls
          </button>
          <button onClick={() => onNavigate('curator_ai')} className="text-on-surface-variant text-body-md font-body-md hover:text-primary transition-all bg-transparent border-none cursor-pointer">
            AI Curator
          </button>
          <button onClick={() => onNavigate('aspirators')} className="text-on-surface-variant text-body-md font-body-md hover:text-primary transition-all bg-transparent border-none cursor-pointer">
            Discovery
          </button>
          <button onClick={() => onNavigate('quest_player')} className="text-on-surface-variant text-body-md font-body-md hover:text-primary transition-all bg-transparent border-none cursor-pointer">
            Space Quest
          </button>
        </div>
        <div className="text-on-surface-variant text-caption font-caption text-center md:text-right">
          © 2026 EduCurate Learning Platform. Curated Clarity for every learner.
        </div>
      </footer>

    </div>
  );
};
