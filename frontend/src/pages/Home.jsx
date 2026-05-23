import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code2, Zap, Briefcase, Cpu, Trophy, ArrowRight, CheckCircle2, Sparkles, TerminalSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Track cursor movement for high-end interactive background spotlight
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

      {/* Background glow orbs - elegant sunset / warm paper aura */}
      <div className="glow-orb" style={{ width: '600px', height: '600px', background: 'rgba(251, 146, 60, 0.08)', top: '-15%', left: '10%' }} />
      <div className="glow-orb" style={{ width: '700px', height: '700px', background: 'rgba(219, 39, 119, 0.04)', top: '20%', right: '-10%', animationDelay: '-6s' }} />
      <div className="glow-orb" style={{ width: '450px', height: '450px', background: 'rgba(253, 224, 71, 0.03)', bottom: '5%', left: '20%', animationDelay: '-12s' }} />
      
      {/* Horizontal grid laser scanning ray */}
      <div className="laser-line" />

      {/* 📐 DELICATE GRID INTERSECTION CROSSES (+) (Twenty.com Style) */}
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
          zIndex: 1
        }}>+</div>
      ))}

      {/* ✒️ LARGE ELEGANT BACKGROUND GEOMETRIC GLYPHS */}
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
        zIndex: 1
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
        zIndex: 1
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

        {/* Floating Showcase Mockup Layout */}
        <div className="scroll-reveal" style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '520px', margin: '2rem 0 8rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          
          {/* Main Showcase Panel - Editor Mockup (Floating Layer 1) */}
          <div className="twenty-card float-1" style={{ 
            width: '85%', 
            height: '420px', 
            background: '#ffffff', 
            border: '1px solid rgba(0,0,0,0.05)',
            borderRadius: '16px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'absolute',
            zIndex: 10,
            boxShadow: '0 32px 64px rgba(28,25,23,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
          }}>
            {/* Header bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
                <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>workspace / codesprint_app.js</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(227, 100, 54, 0.08)', color: 'var(--accent-color)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                  Live Compiler
                </div>
              </div>
            </div>
            
            {/* Mock IDE Content */}
            <div style={{ flex: 1, display: 'flex', gap: '1.5rem' }}>
              {/* Sidebar file list */}
              <div style={{ width: '160px', borderRight: '1px solid rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)', paddingRight: '1rem' }}>
                <div style={{ color: 'var(--text-main)', fontWeight: '600' }}>📁 src/core</div>
                <div style={{ paddingLeft: '1rem', color: 'var(--text-main)', fontWeight: '600' }}>⚡ pipeline.js</div>
                <div style={{ paddingLeft: '1rem' }}>📄 solution.py</div>
                <div style={{ paddingLeft: '1rem' }}>📄 test_suite.rs</div>
                <div style={{ paddingLeft: '1rem' }}>⚙️ config.json</div>
              </div>
              {/* Editor Code space */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <pre className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.7', margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ color: '#cf222e' }}>const</span> <span style={{ color: '#0550ae' }}>optimizePipeline</span> = <span style={{ color: '#cf222e' }}>async</span> (tasks) =&gt; {'{\n'}
                  {'  '}<span style={{ color: '#cf222e' }}>const</span> <span style={{ color: '#953800' }}>scheduler</span> = <span style={{ color: '#cf222e' }}>new</span> <span style={{ color: '#0550ae' }}>TaskScheduler</span>();{'\n'}
                  {'  '}<span style={{ color: '#6e7781' }}>// Evaluate thread concurrency dynamically</span>{'\n'}
                  {'  '}<span style={{ color: '#cf222e' }}>const</span> <span style={{ color: '#953800' }}>result</span> = <span style={{ color: '#cf222e' }}>await</span> scheduler.processConcurrency(tasks, {'{'}
                  {'\n    '}maxWorkers: <span style={{ color: '#116329' }}>8</span>,{'\n    '}timeoutMs: <span style={{ color: '#116329' }}>1200</span>
                  {'\n  '}{'}'});{'\n'}
                  {'  '}<span style={{ color: '#cf222e' }}>return</span> result.filter(res =&gt; res.status === <span style={{ color: '#6f42c1' }}>\'completed\'</span>);{'\n'}
                  {'}'};
                </pre>
              </div>
            </div>
          </div>

          {/* Floating Element 2: Leaderboard Rank Ups */}
          <div className="twenty-card float-2" style={{ 
            width: '280px',
            background: 'rgba(255, 255, 255, 0.85)', 
            border: '1px solid rgba(0,0,0,0.04)',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'absolute',
            top: '-20px',
            left: '20px',
            zIndex: 15,
            boxShadow: '0 20px 48px rgba(28,25,23,0.04), 0 1px 2px rgba(0,0,0,0.01)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.4rem', background: 'rgba(227, 100, 54, 0.08)', color: 'var(--accent-color)', borderRadius: '8px' }}>
                <Trophy size={16} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>Weekly Sprint</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Global rankings updated</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>1. AlexChen</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>+120 XP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0', fontSize: '0.8rem', borderTop: '1px solid rgba(0,0,0,0.03)' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>2. You</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>+240 XP 🚀</span>
              </div>
            </div>
          </div>

          {/* Floating Element 3: AI Code Coach */}
          <div className="twenty-card float-3" style={{ 
            width: '320px',
            background: 'rgba(255, 255, 255, 0.85)', 
            border: '1px solid rgba(0,0,0,0.04)',
            borderRadius: '14px',
            padding: '1.25rem',
            position: 'absolute',
            bottom: '-10px',
            right: '25px',
            zIndex: 15,
            boxShadow: '0 20px 48px rgba(28,25,23,0.04), 0 1px 2px rgba(0,0,0,0.01)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', background: 'rgba(5, 80, 174, 0.06)', color: '#0550ae', borderRadius: '8px', height: 'fit-content' }}>
                <Cpu size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>AI Diagnostics</div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '600', marginBottom: '0.5rem' }}>Complexity: O(n) • Spatial: O(1)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                  "Optimal concurrency achieved. Thread pools match container resources. Recommending micro-optimization in memory buffers."
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
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '1.5rem',
                      background: isActive ? 'rgba(0,0,0,0.02)' : 'transparent',
                      border: '1px solid',
                      borderColor: isActive ? 'rgba(0,0,0,0.04)' : 'transparent',
                      borderRadius: '12px',
                      textAlign: 'left',
                      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: isActive ? '0.75rem' : '0' }}>
                      <div style={{ color: isActive ? 'var(--accent-color)' : 'var(--text-muted)', transition: 'color 0.3s' }}>
                        <Icon size={22} />
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: isActive ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.3s ease', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
                      lineHeight: '1.6'
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
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
            
            {/* Card 1 - Speed */}
            <div className="twenty-card scroll-reveal delay-100" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface-color)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(227, 100, 54, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)' }}>
                <Zap size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Blazingly Fast</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Monaco editor integration loads execution outcomes in under 20ms. Compile code concurrently at lightning speed.
              </p>
            </div>

            {/* Card 2 - Insights */}
            <div className="twenty-card scroll-reveal delay-200" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface-color)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(5, 80, 174, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0550ae' }}>
                <Cpu size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>AI Coaching</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Deep spatial-complexity audits trace every execution stack, suggesting localized buffer optimization automatically.
              </p>
            </div>

            {/* Card 3 - Leaderboards */}
            <div className="twenty-card scroll-reveal delay-300" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--surface-color)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <Trophy size={20} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>Global Sprints</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Race against global engineering squads on daily and weekly algorithmic tracks. Gain XP points and level your dev badge.
              </p>
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
