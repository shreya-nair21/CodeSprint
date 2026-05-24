import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Terminal, Code2, Zap, Briefcase, Cpu, Trophy, ArrowRight, CheckCircle2, 
  Sparkles, TerminalSquare, Folder, FileCode, Activity, Check, ChevronRight, Play, Award, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollOffset, setScrollOffset] = useState(0);
  const [cardSpotlights, setCardSpotlights] = useState({});
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const leaderboardRanks = [
    { rank: 1, name: 'AlexChen', xp: '+120 XP' },
    { rank: 2, name: 'You', xp: '+240 XP' },
    { rank: 3, name: 'ByteMaster', xp: '10,950 XP' }
  ];


  // Track cursor movement for high-end interactive background spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track scroll movement for organic parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardMouseMove = (id, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCardSpotlights((prev) => ({
      ...prev,
      [id]: { x, y }
    }));
  };

  const handleCardMouseLeave = (id) => {
    setCardSpotlights((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  // IntersectionObserver to handle scroll reveal animations beautifully
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px -50px 0px -50px',
      threshold: 0.1,
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    const revealElements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right'
    );

    const timer = setTimeout(() => {
      revealElements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timer);
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Coordinates for decorative grid intersection crosses (+) like Twenty.com
  const gridIntersections = [
    { top: '8%', left: '12%' },
    { top: '15%', right: '18%' },
    { top: '32%', left: '5%' },
    { top: '48%', right: '8%' },
    { top: '60%', left: '15%' },
    { top: '75%', right: '22%' },
    { top: '88%', left: '8%' },
    { top: '94%', right: '14%' },
  ];

  const features = [
    {
      id: 'real-world',
      title: 'Real-World Assessments',
      description: 'Move beyond theoretical puzzles. Evaluate and practice with realistic, role-based technical challenges that mirror actual engineering tasks.',
      icon: Briefcase,
      preview: (
        <div className="preview-container twenty-card" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: '14px', height: '100%', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          </div>
          <div className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>task:</span> Build a rate-limited REST API
          </div>
          <div className="font-mono" style={{ background: 'var(--surface-hover)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.85rem', color: 'var(--text-main)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: '500' }}>
              <span>Tests Passing: 4/5</span>
              <span style={{ color: '#ef4444' }}>RateLimitError expected</span>
            </div>
            <div style={{ height: '4px', width: '100%', background: 'rgba(0,0,0,0.06)', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: '80%', background: '#10b981', borderRadius: '2px' }} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ide',
      title: 'Integrated IDE',
      description: 'Write, test, and submit your code instantly with our integrated, blazingly fast Monaco editor supporting over 40+ programming languages.',
      icon: TerminalSquare,
      preview: (
        <div className="preview-container twenty-card" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: '14px', height: '100%', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-main)', borderBottom: '2px solid var(--accent-color)', paddingBottom: '0.75rem', marginBottom: '-0.75rem', fontWeight: '600' }}>solution.js</span>
          </div>
          <pre className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.7', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
            <span style={{ color: '#cf222e' }}>function</span> <span style={{ color: '#0550ae' }}>twoSum</span>(nums, target) {'{\n'}
            {'  '}const map = new <span style={{ color: '#6f42c1' }}>Map</span>();{'\n'}
            {'  '}for (let i = 0; i {'<'} nums.length; i++) {'{\n'}
            {'    '}const complement = target - nums[i];{'\n'}
            {'    '}if (map.has(complement)) {'{\n'}
            {'      '}return [map.get(complement), i];{'\n'}
            {'    '}{'}'}{'\n'}
            {'    '}map.set(nums[i], i);{'\n'}
            {'  '}{'}'}{'\n'}
            {'}'}
          </pre>
        </div>
      )
    },
    {
      id: 'ai',
      title: 'AI-Powered Insights',
      description: 'Get deep insights into your problem-solving approach. Our AI analyzes your code complexity, identifies potential bugs, and suggests optimizations.',
      icon: Cpu,
      preview: (
        <div className="preview-container twenty-card" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: '14px', height: '100%', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-color)', color: '#0550ae' }}>
              <Cpu size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>Complexity Analysis</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Your solution runs in O(n) time, which is optimal. However, spatial complexity can be improved to O(1).</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border-color)', color: '#10b981' }}>
              <CheckCircle2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>Best Practices</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Excellent variable naming and modular design.</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'leaderboard',
      title: 'Global Leaderboard',
      description: 'See how you rank against developers worldwide. Earn points for optimal solutions, fast execution, and consistent problem-solving streaks.',
      icon: Trophy,
      preview: (
        <div className="preview-container twenty-card" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: '14px', height: '100%', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span style={{ width: '3rem' }}>Rank</span>
            <span style={{ flex: 1 }}>Developer</span>
            <span>Score</span>
          </div>
          {[
            { rank: 1, name: 'AlexChen', score: '12,450', highlight: true },
            { rank: 2, name: 'SarahDev', score: '11,200' },
            { rank: 3, name: 'ByteMaster', score: '10,950' },
            { rank: 4, name: 'You', score: '10,800', isUser: true },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i !== 3 ? '1px solid var(--border-color)' : 'none', color: row.isUser ? 'var(--text-main)' : 'var(--text-main)', fontWeight: row.isUser ? '600' : '400', alignItems: 'center' }}>
              <span style={{ width: '3rem', color: row.highlight ? 'var(--accent-color)' : 'inherit' }}>#{row.rank}</span>
              <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {row.name}
                {row.isUser && <span style={{ background: 'rgba(0,0,0,0.04)', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', color: 'var(--text-muted)', fontWeight: '600' }}>YOU</span>}
              </span>
              <span className="font-mono">{row.score}</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', width: '100%', background: 'var(--bg-color)' }}>

      {/* 📐 Twenty.com Delicate Background Base Grid Line Mesh */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '54px 54px',
        opacity: 0.85
      }} />

      {/* 📐 Twenty.com Interactive Cursor Spotlit Glow Grid Mesh */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        backgroundImage: `
          linear-gradient(rgba(227, 100, 54, 0.07) 1px, transparent 1px), 
          linear-gradient(90deg, rgba(227, 100, 54, 0.07) 1px, transparent 1px)
        `,
        backgroundSize: '54px 54px',
        WebkitMaskImage: `radial-gradient(240px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
        maskImage: `radial-gradient(240px circle at ${mousePos.x}px ${mousePos.y}px, black 30%, transparent 100%)`,
        transition: 'mask-image 0.04s ease-out, -webkit-mask-image 0.04s ease-out'
      }} />

      {/* 🔮 INTERACTIVE CURSOR SPOTLIGHT GLOW (Signature Twenty.com feature) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
        background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(251, 146, 60, 0.04), transparent 75%)`,
        transition: 'background 0.05s ease-out'
      }} />

      {/* Background glow orbs - elegant sunset / warm paper aura with scroll parallax */}
      <div className="glow-orb" style={{ width: '600px', height: '600px', background: 'rgba(251, 146, 60, 0.08)', top: '-15%', left: '10%', transform: `translateY(${scrollOffset * 0.12}px) translateZ(0)` }} />
      <div className="glow-orb" style={{ width: '700px', height: '700px', background: 'rgba(219, 39, 119, 0.04)', top: '20%', right: '-10%', animationDelay: '-6s', transform: `translateY(${scrollOffset * -0.08}px) translateZ(0)` }} />
      <div className="glow-orb" style={{ width: '450px', height: '450px', background: 'rgba(253, 224, 71, 0.03)', bottom: '5%', left: '20%', animationDelay: '-12s', transform: `translateY(${scrollOffset * 0.04}px) scale(${1 + scrollOffset * 0.0001}) translateZ(0)` }} />

      {/* Horizontal grid laser scanning ray (Fades away slowly as you scroll down) */}
      <div className="laser-line" style={{
        opacity: Math.max(0, 1 - scrollOffset / 600)
      }} />

      {/* 📐 DELICATE GRID INTERSECTION CROSSES (+) (Twenty.com Style with slight parallax stagger) */}
      {gridIntersections.map((coord, i) => (
        <div key={i} style={{
          position: 'absolute',
          ...coord,
          color: 'rgba(0, 0, 0, 0.06)',
          fontSize: '0.9rem',
          fontWeight: '300',
          fontFamily: 'monospace',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 1,
          transform: `translateY(${scrollOffset * (i % 2 === 0 ? 0.03 : -0.02)}px) translateZ(0)`,
          transition: 'transform 0.1s ease-out'
        }}>+</div>
      ))}

      {/* ✒️ LARGE ELEGANT BACKGROUND GEOMETRIC GLYPHS with scroll-induced rotation and parallax depth */}
      <div style={{
        position: 'absolute',
        top: '16%',
        left: '5%',
        color: 'rgba(0, 0, 0, 0.012)',
        fontSize: '18rem',
        fontWeight: '300',
        fontFamily: "'Instrument Serif', Georgia, serif",
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1,
        transform: `translateY(${scrollOffset * 0.22}px) rotate(${scrollOffset * 0.015}deg) translateZ(0)`,
        transition: 'transform 0.08s ease-out'
      }}>{'{'}</div>

      <div style={{
        position: 'absolute',
        top: '52%',
        right: '4%',
        color: 'rgba(0, 0, 0, 0.008)',
        fontSize: '22rem',
        fontWeight: '300',
        fontFamily: "'Instrument Serif', Georgia, serif",
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 1,
        transform: `translateY(${scrollOffset * -0.15}px) rotate(${scrollOffset * -0.01}deg) translateZ(0)`,
        transition: 'transform 0.08s ease-out'
      }}>{'}'}</div>

      <div className="container" style={{ padding: '8rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>

        {/* Floating badge */}
        <div className="flex items-center gap-2" style={{
          padding: '0.4rem 1.25rem',
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: '999px',
          fontSize: '0.85rem',
          color: 'var(--text-main)',
          marginBottom: '2rem',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
          fontWeight: '500'
        }}>
          <Sparkles size={14} style={{ color: 'var(--accent-color)' }} />
          <span style={{ letterSpacing: '0.02em' }}>The Next-Gen Coding Workspace</span>
        </div>

        {/* Hero Headline */}
        <div className="text-center" style={{ maxWidth: '950px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{
            fontSize: '5.2rem',
            fontWeight: '400',
            marginBottom: '2rem',
            letterSpacing: '-0.03em',
            lineHeight: '1.08',
            textAlign: 'center',
            fontFamily: "'Instrument Serif', Georgia, serif",
            color: 'var(--text-main)',
          }}>
            Master your code.<br />
            <span style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>designed for speed.</span>
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-muted)',
            marginBottom: '3.5rem',
            lineHeight: '1.6',
            maxWidth: '650px',
            textAlign: 'center'
          }}>
            CodeSprint is a minimal competitive coding platform styled beautifully. Practice algorithms, refine complex logic, and climb global rankings instantly.
          </p>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', marginBottom: '5rem' }}>
            <Link to="/problems" className="btn-primary" style={{
              padding: '0.9rem 2.8rem',
              fontSize: '1.05rem',
              borderRadius: '999px',
              background: 'var(--primary-color)',
              color: '#ffffff',
              border: 'none',
              fontWeight: '600',
              boxShadow: '0 10px 30px rgba(28,25,23,0.12)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(28,25,23,0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(28,25,23,0.12)';
              }}>
              Start Coding <ArrowRight size={18} />
            </Link>
            <a href="#features" style={{
              padding: '0.9rem 2.8rem',
              fontSize: '1.05rem',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(0,0,0,0.06)',
              color: 'var(--text-main)',
              fontWeight: '500',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.01)',
              transition: 'background 0.2s ease, transform 0.2s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.7)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}>
              Explore Features
            </a>
          </div>
        </div>

        {/* Floating Showcase Mockup Layout wrapped inside a flat layered parallax deck (exactly following Twenty.com) */}
        <div style={{
          width: '100%',
          maxWidth: '1060px',
          margin: '3rem 0 9rem 0',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2
        }}>
          
          <div style={{
            position: 'relative',
            width: '100%',
            height: '520px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>

            {/* Ambient Flat Depth Shadow Plane */}
            <div style={{
              position: 'absolute',
              width: '84%',
              height: '420px',
              background: 'rgba(28, 25, 23, 0.04)',
              borderRadius: '24px',
              filter: 'blur(24px)',
              pointerEvents: 'none',
              zIndex: 0,
              transform: `translateY(${scrollOffset * -0.02}px)`,
              transition: 'transform 0.1s ease-out'
            }} />

            {/* Main Showcase Panel - Monaco Editor Mockup (exactly following Twenty.com signature colors) */}
            <div className="twenty-card glowing-border-deck" style={{ 
              width: '85%', 
              height: '440px', 
              background: '#ffffff', 
              border: '1px solid rgba(227, 100, 54, 0.1)',
              borderRadius: '20px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              position: 'absolute',
              zIndex: 10,
              boxShadow: '0 20px 48px rgba(28,25,23,0.02), inset 0 1px 0 rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              transform: `translateY(${scrollOffset * -0.03}px)`,
              transition: 'transform 0.1s ease-out',
              overflow: 'hidden'
            }}>
              {/* Header bar */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                  <div style={{ width: '1px', height: '12px', background: 'rgba(0,0,0,0.08)', margin: '0 0.5rem' }} />
                  <Folder size={13} style={{ color: 'var(--accent-color)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontWeight: '500' }}>src/algorithms/sprint_engine.rs</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: 'rgba(227, 100, 54, 0.06)', color: 'var(--accent-color)', padding: '0.15rem 0.55rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-color)', display: 'inline-block' }} />
                    Live Sync
                  </div>
                </div>
              </div>
              
              {/* Mock IDE Content */}
              <div style={{ flex: 1, display: 'flex', gap: '1.25rem', overflow: 'hidden' }}>
                {/* Folder list explorer */}
                <div style={{ width: '180px', borderRight: '1px solid rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.78rem', color: 'var(--text-muted)', paddingRight: '0.75rem', userSelect: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: '600' }}>
                    <span>📂</span> <span>src/core</span>
                  </div>
                  <div style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-main)', fontWeight: '600' }}>
                    <FileCode size={13} style={{ color: 'var(--accent-color)' }} />
                    <span>sprint_engine.rs</span>
                  </div>
                  <div style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCode size={13} />
                    <span>analyzer.rs</span>
                  </div>
                  <div style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCode size={13} />
                    <span>balancer.go</span>
                  </div>
                  <div style={{ paddingLeft: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FileCode size={13} />
                    <span>pipeline.ts</span>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'var(--surface-hover)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(227, 100, 54, 0.05)' }}>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: '700', color: 'var(--text-muted)' }}>Local Compiler</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)', fontWeight: '600', fontSize: '0.7rem' }}>
                      <Play size={10} fill="var(--accent-color)" style={{ color: 'var(--accent-color)' }} /> Compiling...
                    </div>
                    <div className="mock-compile-bar" style={{ background: 'var(--accent-color)' }} />
                  </div>
                </div>
                
                {/* Editor Code space with colorized Rust syntax and line sidebar */}
                <div style={{ flex: 1, display: 'flex', gap: '1rem', background: 'var(--surface-hover)', borderRadius: '10px', border: '1px solid rgba(0,0,0,0.02)', padding: '1rem', overflow: 'hidden' }}>
                  {/* Line numbers column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem', fontSize: '0.78rem', color: 'rgba(0,0,0,0.18)', fontFamily: "'JetBrains Mono', monospace", textAlign: 'right', userSelect: 'none', borderRight: '1px solid rgba(0,0,0,0.03)', paddingRight: '0.75rem' }}>
                    {Array.from({ length: 11 }, (_, i) => i + 1).map(num => <div key={num}>{num}</div>)}
                  </div>

                  {/* High fidelity syntax codespace (Premium cream & coppery orange scheme) */}
                  <pre className="font-mono" style={{ flex: 1, fontSize: '0.8rem', color: 'var(--text-main)', lineHeight: '1.7', margin: 0, fontFamily: "'JetBrains Mono', monospace", whiteSpace: 'pre' }}>
                    <span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>impl</span>&lt;<span style={{ color: 'var(--text-main)', fontWeight: '700' }}>SprintRunner</span>&gt; {'{\n'}
                    {'  '}<span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>pub fn</span> <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>optimize_threads</span>(&amp;<span style={{ color: 'var(--accent-color)' }}>self</span>, tasks: <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>Vec</span>&lt;<span style={{ color: 'var(--text-main)', fontWeight: '700' }}>Task</span>&gt;) -&gt; <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>Result</span>&lt;<span style={{ color: 'var(--text-main)', fontWeight: '700' }}>Stats</span>&gt; {'{\n'}
                    {'    '}<span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>let</span> mut pool = <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>ThreadPool</span>::new(<span style={{ color: 'var(--accent-color)' }}>16</span>);{'\n'}
                    {'    '}<span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>let</span> results = pool.execute_concurrently(tasks, |t| {'{\n'}
                    {'      '}t.eval_complexity()<span className="blinking-caret" />{'\n'}
                    {'    '}{'}'});{'\n'}
                    {'    '}<span style={{ color: 'rgba(120, 113, 108, 0.65)', fontStyle: 'italic' }}>// Assert stack safety boundaries</span>{'\n'}
                    {'    '}results.verify_buffer_safety()?;{'\n'}
                    {'    '}<span style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Ok</span>(Stats::from(results)){'\n'}
                    {'  '}{'}'}{'\n'}
                    {'}'}
                  </pre>
                </div>
              </div>
            </div>

            {/* Floating Element 2: Leaderboard rankings following twenty.com signature colors */}
            <div 
              onMouseMove={(e) => handleCardMouseMove('showcase-leaderboard', e)}
              onMouseLeave={() => handleCardMouseLeave('showcase-leaderboard')}
              className="twenty-card" 
              style={{ 
                width: '290px',
                background: '#ffffff', 
                border: '1px solid rgba(227, 100, 54, 0.1)',
                borderRadius: '16px',
                padding: '1.25rem',
                position: 'absolute',
                top: '-35px',
                left: '-20px',
                zIndex: 15,
                boxShadow: !!cardSpotlights['showcase-leaderboard']
                  ? '0 24px 48px rgba(227, 100, 54, 0.08), 0 4px 12px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.95)'
                  : '0 12px 30px rgba(28,25,23,0.03), 0 1px 2px rgba(0,0,0,0.01), inset 0 1px 0 rgba(255,255,255,0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                transform: `translateY(${scrollOffset * -0.08 - (!!cardSpotlights['showcase-leaderboard'] ? 6 : 0)}px) scale(${!!cardSpotlights['showcase-leaderboard'] ? 1.015 : 1}) translateZ(0)`,
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden'
              }}
            >
              {/* Interactive spotlight overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0,
                background: cardSpotlights['showcase-leaderboard'] 
                  ? `radial-gradient(180px circle at ${cardSpotlights['showcase-leaderboard'].x}px ${cardSpotlights['showcase-leaderboard'].y}px, rgba(251, 146, 60, 0.08), transparent 80%)` 
                  : 'transparent',
                transition: 'background 0.15s ease'
              }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '0.45rem', background: 'rgba(227, 100, 54, 0.06)', color: 'var(--accent-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Global Sprint</div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Top leaderboard rankings</div>
                </div>
              </div>

              {/* Minimal Rankings Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', position: 'relative', zIndex: 1 }}>
                {leaderboardRanks.map((row, i) => (
                  <div 
                    key={i} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.4rem 0.6rem', 
                      fontSize: '0.78rem', 
                      borderTop: i !== 0 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease',
                      margin: '0 -0.4rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(227, 100, 54, 0.04)';
                      e.currentTarget.style.transform = 'translateX(2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <span style={{ color: row.rank === 1 ? 'var(--accent-color)' : 'var(--text-muted)', fontWeight: '700' }}>#{row.rank}</span>
                      <span style={{ fontWeight: row.name === 'You' ? '700' : '400', color: row.name === 'You' ? 'var(--text-main)' : 'inherit' }}>{row.name}</span>
                      {row.name === 'You' && <span style={{ background: 'rgba(227,100,54,0.08)', color: 'var(--accent-color)', fontSize: '0.55rem', padding: '0.05rem 0.25rem', borderRadius: '3px', fontWeight: '700' }}>YOU</span>}
                    </span>
                    <span style={{ color: 'var(--accent-color)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                      {row.xp}
                      {row.rank === 1 && <ArrowUpRight size={10} />}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Element 3: AI diagnostics coach following twenty.com signature colors */}
            <div 
              onMouseMove={(e) => handleCardMouseMove('showcase-diagnostics', e)}
              onMouseLeave={() => handleCardMouseLeave('showcase-diagnostics')}
              className="twenty-card" 
              style={{ 
                width: '340px',
                background: '#ffffff', 
                border: '1px solid rgba(227, 100, 54, 0.1)',
                borderRadius: '16px',
                padding: '1.25rem',
                position: 'absolute',
                bottom: '-35px',
                right: '-15px',
                zIndex: 15,
                boxShadow: !!cardSpotlights['showcase-diagnostics']
                  ? '0 24px 48px rgba(227, 100, 54, 0.08), 0 4px 12px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.95)'
                  : '0 12px 30px rgba(28,25,23,0.03), 0 1px 2px rgba(0,0,0,0.01), inset 0 1px 0 rgba(255,255,255,0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                transform: `translateY(${scrollOffset * -0.01 - (!!cardSpotlights['showcase-diagnostics'] ? 6 : 0)}px) scale(${!!cardSpotlights['showcase-diagnostics'] ? 1.015 : 1}) translateZ(0)`,
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden'
              }}
            >
              {/* Interactive spotlight overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0,
                background: cardSpotlights['showcase-diagnostics'] 
                  ? `radial-gradient(180px circle at ${cardSpotlights['showcase-diagnostics'].x}px ${cardSpotlights['showcase-diagnostics'].y}px, rgba(251, 146, 60, 0.08), transparent 80%)` 
                  : 'transparent',
                transition: 'background 0.15s ease'
              }} />

              {/* Scanning laser line - automatically animated in CSS purely on parent :hover! */}
              <div className="diagnostics-scanner-ray" style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--accent-color), transparent)',
                boxShadow: '0 0 8px var(--accent-color)',
                zIndex: 10,
                opacity: 0,
                pointerEvents: 'none'
              }} />

              <div style={{ display: 'flex', gap: '0.75rem', position: 'relative', zIndex: 1 }}>
                <div style={{ padding: '0.5rem', background: 'rgba(227, 100, 54, 0.06)', color: 'var(--accent-color)', borderRadius: '8px', height: 'fit-content', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Cpu size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.65rem' }}>AI Diagnostics</div>
                  
                  {/* Clean static system metrics */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Complexity</span>
                      <span style={{ background: 'rgba(227, 100, 54, 0.06)', color: 'var(--accent-color)', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>O(n) Optimal</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '0.4rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Memory Footprint</span>
                      <span style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>14.2MB Safe</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Thread Pool</span>
                      <span style={{ background: 'var(--surface-hover)', color: 'var(--text-muted)', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: '700' }}>16 Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>

        {/* Social Proof info */}
        <div className="scroll-reveal delay-100" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '8rem' }}>
          <div style={{ display: 'flex' }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid var(--bg-color)', background: `linear-gradient(135deg, hsl(${i * 45}, 70%, 80%), hsl(${i * 45 + 30}, 70%, 70%))`, marginLeft: i !== 1 ? '-12px' : '0', boxShadow: '0 4px 10px rgba(0,0,0,0.04)' }} />
            ))}
          </div>
          <div>
            <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>10,000+</span> engineers already competing live
          </div>
        </div>

        {/* Features Tabs Section */}
        <div id="features" style={{ width: '100%', maxWidth: '1100px', marginTop: '4rem' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{
              fontSize: '3.2rem',
              fontWeight: '400',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              fontFamily: "'Instrument Serif', Georgia, serif",
              color: 'var(--text-main)'
            }}>
              A platform built for engineers.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
              Everything you need to assess skills, practice effectively, and write better code in an elegant, rapid environment.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Tabs List */}
            <div className="scroll-reveal-left delay-100" style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {features.map((feature, index) => {
                const isActive = activeTab === index;
                const Icon = feature.icon;
                return (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(index)}
                    onMouseMove={(e) => handleCardMouseMove(feature.id, e)}
                    onMouseLeave={() => handleCardMouseLeave(feature.id)}
                    className="twenty-card scroll-reveal-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '1.5rem',
                      background: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.45)',
                      border: '1px solid',
                      borderColor: isActive ? 'rgba(227, 100, 54, 0.25)' : 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '16px',
                      textAlign: 'left',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isActive ? '0 12px 32px rgba(28,25,23,0.03)' : 'none',
                      cursor: 'pointer',
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Interactive spotlight overlay */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      pointerEvents: 'none',
                      zIndex: 0,
                      background: cardSpotlights[feature.id] 
                        ? `radial-gradient(180px circle at ${cardSpotlights[feature.id].x}px ${cardSpotlights[feature.id].y}px, rgba(251, 146, 60, 0.08), transparent 80%)` 
                        : 'transparent',
                      transition: 'background 0.15s ease'
                    }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: isActive ? '0.75rem' : '0', zIndex: 1 }}>
                      <div style={{ color: isActive ? 'var(--accent-color)' : 'var(--text-muted)', transition: 'color 0.3s' }}>
                        <Icon size={22} />
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: isActive ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.3s ease', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {feature.title}
                      </h3>
                    </div>
                    <div style={{
                      maxHeight: isActive ? '100px' : '0',
                      opacity: isActive ? 1 : 0,
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      color: 'var(--text-muted)',
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      zIndex: 1
                    }}>
                      {feature.description}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Showcase Panel */}
            <div className="scroll-reveal-right delay-200" style={{ flex: '1 1 450px', height: '400px', minWidth: '320px' }}>
              {features[activeTab].preview}
            </div>
          </div>
        </div>

        {/* Brand Showcase Staggered Grid */}
        <div style={{ width: '100%', maxWidth: '1100px', marginTop: '12rem', marginBottom: '8rem' }}>
          <div className="scroll-reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <h2 style={{ 
              fontSize: '3.2rem', 
              fontWeight: '400', 
              letterSpacing: '-0.02em',
              fontFamily: "'Instrument Serif', Georgia, serif",
              color: 'var(--text-main)'
            }}>
              engineered for performance.
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '500px', margin: '0.5rem auto 0 auto' }}>
              Unrivaled speed combined with enterprise security.
            </p>          {/* Twenty.com Style Minimalist Pill Tabs Selector */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            marginBottom: '3rem', 
            position: 'relative',
            zIndex: 15 
          }}>
            {[
              { id: 0, label: 'Blazingly Fast', icon: Zap },
              { id: 1, label: 'AI Coaching', icon: Cpu },
              { id: 2, label: 'Global Sprints', icon: Trophy }
            ].map(tab => {
              const isActive = activeCardIndex === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCardIndex(tab.id)}
                  style={{
                    background: isActive ? 'rgba(227, 100, 54, 0.07)' : 'rgba(255, 255, 255, 0.65)',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(227, 100, 54, 0.25)' : 'rgba(0, 0, 0, 0.04)',
                    color: isActive ? 'var(--accent-color)' : 'var(--text-muted)',
                    padding: '0.5rem 1.4rem',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: isActive ? '0 4px 12px rgba(227, 100, 54, 0.06)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
                      e.currentTarget.style.color = 'var(--text-main)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.65)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  <Icon size={14} style={{ color: isActive ? 'var(--accent-color)' : 'inherit' }} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Staggered Stacked features Deck Container (exactly like Twenty.com) */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '560px', 
            height: '280px', 
            margin: '0 auto 4rem auto'
          }}>
            
            {/* Card 1 - Speed */}
            <div 
              onClick={() => setActiveCardIndex(0)}
              onMouseMove={(e) => handleCardMouseMove('card-speed', e)}
              onMouseLeave={() => handleCardMouseLeave('card-speed')}
              className="twenty-card" 
              style={{ 
                padding: '2.25rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem', 
                background: '#ffffff',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: activeCardIndex === 0 ? 15 : (activeCardIndex === 1 ? 14 : 13),
                transform: activeCardIndex === 0 
                  ? 'translateY(0px) scale(1) rotate(0deg)' 
                  : (activeCardIndex === 1 
                      ? 'translateY(-16px) scale(0.96) rotate(-1.5deg)' 
                      : 'translateY(-32px) scale(0.92) rotate(-3.0deg)'),
                boxShadow: activeCardIndex === 0
                  ? '0 20px 48px rgba(227, 100, 54, 0.06), 0 4px 12px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
                  : '0 8px 24px rgba(28,25,23,0.03), inset 0 1px 0 rgba(255,255,255,0.95)',
                opacity: activeCardIndex === 0 ? 1 : 0.88,
                transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                pointerEvents: activeCardIndex === 0 ? 'auto' : 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0,
                background: cardSpotlights['card-speed'] 
                  ? `radial-gradient(220px circle at ${cardSpotlights['card-speed'].x}px ${cardSpotlights['card-speed'].y}px, rgba(251, 146, 60, 0.08), transparent 80%)` 
                  : 'transparent',
                transition: 'background 0.15s ease'
              }} />
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(227, 100, 54, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', zIndex: 1 }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', zIndex: 1 }}>Blazingly Fast</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.65', zIndex: 1 }}>
                Monaco editor integration loads execution outcomes in under 20ms. Compile code concurrently at lightning speed.
              </p>
            </div>

            {/* Card 2 - Insights */}
            <div 
              onClick={() => setActiveCardIndex(1)}
              onMouseMove={(e) => handleCardMouseMove('card-insights', e)}
              onMouseLeave={() => handleCardMouseLeave('card-insights')}
              className="twenty-card" 
              style={{ 
                padding: '2.25rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem', 
                background: '#ffffff',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: activeCardIndex === 1 ? 15 : 14,
                transform: activeCardIndex === 1 
                  ? 'translateY(0px) scale(1) rotate(0deg)' 
                  : (activeCardIndex === 0 
                      ? 'translateY(16px) scale(0.96) rotate(1.5deg)' 
                      : 'translateY(-16px) scale(0.96) rotate(-1.5deg)'),
                boxShadow: activeCardIndex === 1
                  ? '0 20px 48px rgba(227, 100, 54, 0.06), 0 4px 12px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
                  : '0 8px 24px rgba(28,25,23,0.03), inset 0 1px 0 rgba(255,255,255,0.95)',
                opacity: activeCardIndex === 1 ? 1 : 0.88,
                transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                pointerEvents: activeCardIndex === 1 ? 'auto' : 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0,
                background: cardSpotlights['card-insights'] 
                  ? `radial-gradient(219px circle at ${cardSpotlights['card-insights'].x}px ${cardSpotlights['card-insights'].y}px, rgba(219, 39, 119, 0.06), transparent 80%)` 
                  : 'transparent',
                transition: 'background 0.15s ease'
              }} />
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 80, 174, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0550ae', zIndex: 1 }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', zIndex: 1 }}>AI Coaching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.65', zIndex: 1 }}>
                Deep spatial-complexity audits trace every execution stack, suggesting localized buffer optimization automatically.
              </p>
            </div>

            {/* Card 3 - Leaderboards */}
            <div 
              onClick={() => setActiveCardIndex(2)}
              onMouseMove={(e) => handleCardMouseMove('card-sprints', e)}
              onMouseLeave={() => handleCardMouseLeave('card-sprints')}
              className="twenty-card" 
              style={{ 
                padding: '2.25rem', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem', 
                background: '#ffffff',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                zIndex: activeCardIndex === 2 ? 15 : (activeCardIndex === 1 ? 14 : 13),
                transform: activeCardIndex === 2 
                  ? 'translateY(0px) scale(1) rotate(0deg)' 
                  : (activeCardIndex === 1 
                      ? 'translateY(16px) scale(0.96) rotate(1.5deg)' 
                      : 'translateY(32px) scale(0.92) rotate(3.0deg)'),
                boxShadow: activeCardIndex === 2
                  ? '0 20px 48px rgba(227, 100, 54, 0.06), 0 4px 12px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255, 255, 255, 0.95)'
                  : '0 8px 24px rgba(28,25,23,0.03), inset 0 1px 0 rgba(255,255,255,0.95)',
                opacity: activeCardIndex === 2 ? 1 : 0.88,
                transition: 'all 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
                cursor: 'pointer',
                pointerEvents: activeCardIndex === 2 ? 'auto' : 'auto'
              }}
            >
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
                zIndex: 0,
                background: cardSpotlights['card-sprints'] 
                  ? `radial-gradient(220px circle at ${cardSpotlights['card-sprints'].x}px ${cardSpotlights['card-sprints'].y}px, rgba(16, 185, 129, 0.08), transparent 80%)` 
                  : 'transparent',
                transition: 'background 0.15s ease'
              }} />
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', zIndex: 1 }}>
                <Trophy size={20} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)', zIndex: 1 }}>Global Sprints</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.65', zIndex: 1 }}>
                Race against global engineering squads on daily and weekly algorithmic tracks. Gain XP points and level your dev badge.
              </p>
            </div>

          </div>

          </div>
        </div>

        {/* Footer Call to Action Block */}
        <div className="twenty-card scroll-reveal" style={{
          width: '100%',
          maxWidth: '1100px',
          background: 'linear-gradient(135deg, #ffffff 0%, #faf9f6 100%)',
          border: '1px solid rgba(0,0,0,0.05)',
          borderRadius: '24px',
          padding: '4.5rem 2rem',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(28,25,23,0.03)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          <h2 style={{
            fontSize: '3.6rem',
            fontWeight: '400',
            fontFamily: "'Instrument Serif', Georgia, serif",
            color: 'var(--text-main)',
            margin: 0
          }}>
            Ready to <span style={{ fontStyle: 'italic', color: 'var(--accent-color)' }}>start your sprint?</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: '500px', lineHeight: '1.6', margin: 0 }}>
            Join ten thousand engineers building robust, fast, and secure algorithmic systems. Free to play forever.
          </p>
          <Link to="/problems" className="btn-primary" style={{
            padding: '1rem 3.2rem',
            fontSize: '1.1rem',
            borderRadius: '999px',
            background: 'var(--primary-color)',
            color: '#ffffff',
            border: 'none',
            fontWeight: '600',
            boxShadow: '0 10px 30px rgba(28,25,23,0.15)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '1rem',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease'
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 35px rgba(28,25,23,0.22)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(28,25,23,0.15)';
            }}>
            Start Coding Now <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;
