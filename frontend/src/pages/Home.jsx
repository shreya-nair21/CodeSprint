import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Code2, Zap, Briefcase, Cpu, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      id: 'real-world',
      title: 'Real-World Assessments',
      description: 'Move beyond theoretical puzzles. Evaluate and practice with realistic, role-based technical challenges that mirror actual engineering tasks.',
      icon: Briefcase,
      preview: (
        <div className="preview-container" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', height: '100%', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--danger-color)' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-color)' }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
            <span style={{ color: 'var(--primary-color)' }}>task:</span> Build a rate-limited REST API
          </div>
          <div style={{ background: 'var(--bg-color)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-main)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>tests passing: 4/5</span>
              <span style={{ color: 'var(--danger-color)' }}>RateLimitError expected</span>
            </div>
            <div style={{ height: '4px', width: '100%', background: 'var(--border-color)', borderRadius: '2px' }}>
              <div style={{ height: '100%', width: '80%', background: 'var(--accent-color)', borderRadius: '2px' }} />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'ide',
      title: 'Integrated IDE',
      description: 'Write, test, and submit your code instantly with our integrated, blazingly fast Monaco editor supporting over 40+ programming languages.',
      icon: Terminal,
      preview: (
        <div className="preview-container" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', height: '100%', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-main)', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.75rem', marginBottom: '-0.75rem' }}>solution.js</span>
          </div>
          <pre style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
            <span style={{ color: 'var(--secondary-color)' }}>function</span> <span style={{ color: 'var(--primary-color)' }}>twoSum</span>(nums, target) {'{\n'}
            {'  '}const map = new <span style={{ color: 'var(--secondary-color)' }}>Map</span>();{'\n'}
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
        <div className="preview-container" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', height: '100%', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--secondary-color)' }}>
              <Cpu size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.25rem' }}>Complexity Analysis</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>Your solution runs in O(n) time, which is optimal. However, spatial complexity can be improved to O(1).</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'var(--accent-color)' }}>
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
        <div className="preview-container" style={{ padding: '2rem', background: 'var(--surface-color)', borderRadius: 'var(--border-radius)', height: '100%', border: '1px solid var(--border-color)' }}>
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
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 0', borderBottom: i !== 3 ? '1px solid var(--border-color)' : 'none', color: row.isUser ? 'var(--primary-color)' : 'var(--text-main)', fontWeight: row.isUser ? '600' : '400', alignItems: 'center' }}>
              <span style={{ width: '3rem', color: row.highlight ? '#f59e0b' : 'inherit' }}>#{row.rank}</span>
              <span style={{ flex: 1 }}>{row.name}</span>
              <span style={{ fontFamily: 'monospace' }}>{row.score}</span>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className="container" style={{ padding: '6rem 1rem' }}>
      <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="text-gradient" style={{ fontSize: '4.5rem', fontWeight: '700', marginBottom: '1.5rem', letterSpacing: '-0.04em', lineHeight: '1.1' }}>
          Master Your Code.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          CodeSprint is the modern platform for developers to practice algorithms, prepare for interviews, and compete globally.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {user ? (
            <Link to="/problems" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
              Start Coding
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary" style={{ padding: '0.8rem 2rem', fontSize: '1.1rem' }}>
                Start for free
              </Link>
              <Link to="/login" className="panel" style={{ color: 'var(--text-main)', padding: '0.8rem 2rem', fontSize: '1.1rem', background: 'transparent' }}>
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: '8rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', letterSpacing: '-0.03em' }}>A platform built for engineers.</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Everything you need to assess skills, practice effectively, and write better code.</p>
        </div>

        <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Tabs Menu */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                    background: isActive ? 'var(--surface-color)' : 'transparent',
                    border: '1px solid',
                    borderColor: isActive ? 'var(--border-color)' : 'transparent',
                    borderRadius: 'var(--border-radius)',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: isActive ? '0.75rem' : '0' }}>
                    <div style={{ color: isActive ? 'var(--primary-color)' : 'var(--text-muted)' }}>
                      <Icon size={24} />
                    </div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '600', color: isActive ? 'var(--text-main)' : 'var(--text-muted)', transition: 'color 0.3s ease' }}>
                      {feature.title}
                    </h3>
                  </div>
                  <div style={{
                    maxHeight: isActive ? '100px' : '0',
                    opacity: isActive ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
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

          {/* Dynamic Preview Window */}
          <div style={{ flex: '1 1 450px', height: '400px' }}>
            {features[activeTab].preview}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
