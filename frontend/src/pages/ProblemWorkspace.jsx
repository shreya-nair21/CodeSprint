import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { marked } from 'marked';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Play,
  Send,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
  Settings,
  RotateCcw,
  Terminal as ConsoleIcon,
  ChevronUp,
  ChevronDown,
  BookOpen,
  History,
  MessageSquare,
  User as UserIcon,
  Clock,
  Sparkles
} from 'lucide-react';

const ProblemWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('71'); // Default Python 3
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [leftTab, setLeftTab] = useState('description');
  const [consoleOpen, setConsoleOpen] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: "Hello! I am Socrates AI, your programming mentor. Write your code on the right and ask me questions about it. I won't give away the solution directly, but I will guide you to it!" }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [complexityReview, setComplexityReview] = useState(null);
  const [analyzingComplexity, setAnalyzingComplexity] = useState(false);

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, aiLoading]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || aiLoading) return;

    const userMsg = inputMessage;
    setInputMessage('');
    
    const updatedHistory = [...chatHistory, { sender: 'user', text: userMsg }];
    setChatHistory(updatedHistory);
    setAiLoading(true);

    try {
      const response = await api.post('/ai/mentor', {
        problemId: id,
        code,
        language: languages.find(l => l.id === language)?.name || 'Python 3',
        chatHistory: updatedHistory.map(m => ({ sender: m.sender, text: m.text }))
      });

      setChatHistory([...updatedHistory, { sender: 'ai', text: response.data.reply }]);
    } catch (error) {
      console.error('Error talking to Socratic Mentor:', error);
      setChatHistory([...updatedHistory, { 
        sender: 'ai', 
        text: 'Sorry, I ran into an error connecting to my neural core. Please try again in a moment!' 
      }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestionClick = async (type) => {
    if (aiLoading) return;

    if (type === 'complexity') {
      setAnalyzingComplexity(true);
      try {
        const response = await api.post('/ai/review', {
          problemId: id,
          code,
          language: languages.find(l => l.id === language)?.name || 'Python 3'
        });
        setComplexityReview(response.data);
      } catch (error) {
        console.error('Error analyzing complexity:', error);
        alert('Failed to analyze complexity. Please try again.');
      } finally {
        setAnalyzingComplexity(false);
      }
    } else if (type === 'bugs') {
      setAiLoading(true);
      const userMsg = 'Are there any logical bugs or unhandled edge cases in my current code?';
      const updatedHistory = [...chatHistory, { sender: 'user', text: userMsg }];
      setChatHistory(updatedHistory);
      try {
        const response = await api.post('/ai/mentor', {
          problemId: id,
          code,
          language: languages.find(l => l.id === language)?.name || 'Python 3',
          chatHistory: updatedHistory.map(m => ({ sender: m.sender, text: m.text }))
        });
        setChatHistory([...updatedHistory, { sender: 'ai', text: response.data.reply }]);
      } catch (error) {
        console.error('Error finding bugs:', error);
        setChatHistory([...updatedHistory, { sender: 'ai', text: 'Failed to scan for bugs. Please try again.' }]);
      } finally {
        setAiLoading(false);
      }
    } else if (type === 'hint') {
      setAiLoading(true);
      const userMsg = 'Could you give me a gentle conceptual hint without spoiling the solution?';
      const updatedHistory = [...chatHistory, { sender: 'user', text: userMsg }];
      setChatHistory(updatedHistory);
      try {
        const response = await api.post('/ai/mentor', {
          problemId: id,
          code,
          language: languages.find(l => l.id === language)?.name || 'Python 3',
          chatHistory: updatedHistory.map(m => ({ sender: m.sender, text: m.text }))
        });
        setChatHistory([...updatedHistory, { sender: 'ai', text: response.data.reply }]);
      } catch (error) {
        console.error('Error getting hint:', error);
        setChatHistory([...updatedHistory, { sender: 'ai', text: 'Failed to fetch hint. Please try again.' }]);
      } finally {
        setAiLoading(false);
      }
    }
  };

  const languages = [
    { id: '71', name: 'Python 3', monaco: 'python', starter: 'def solve():\n    # Write your code here\n    pass\n\nif __name__ == "__main__":\n    solve()' },
    { id: '63', name: 'Node.js', monaco: 'javascript', starter: 'function solve() {\n    // Write your code here\n}\n\nsolve();' },
    { id: '54', name: 'C++', monaco: 'cpp', starter: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}' },
    { id: '62', name: 'Java', monaco: 'java', starter: 'public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}' }
  ];

  useEffect(() => {
    fetchProblem();
  }, [id]);

  useEffect(() => {
    const selectedLang = languages.find(l => l.id === language);
    if (selectedLang) {
      setCode(selectedLang.starter);
    }
  }, [language]);

  useEffect(() => {
    if (leftTab === 'submissions') {
      fetchSubmissions();
    } else if (leftTab === 'discussion') {
      fetchComments();
    }
  }, [leftTab, id]);

  const fetchProblem = async () => {
    try {
      const response = await api.get(`/problems/${id}`);
      setProblem(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching problem:', error);
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const response = await api.get(`/submissions?problemId=${id}`);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await api.get(`/comments/${id}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setPostingComment(true);
    try {
      const response = await api.post('/comments', {
        problemId: id,
        content: newComment
      });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setPostingComment(false);
    }
  };

  const handleSubmit = async (isSubmit = false) => {
    setSubmitting(true);
    setConsoleOpen(true);
    setResult(null);
    try {
      const response = await api.post('/submissions', {
        problemId: id,
        code,
        languageId: parseInt(language),
        runOnly: !isSubmit
      });
      setResult(response.data);
      if (isSubmit && leftTab === 'submissions') fetchSubmissions();
    } catch (error) {
      console.error('Submission error:', error);
      setResult({
        status: 'Error',
        message: error.response?.data?.message || error.message || 'Server error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-color">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="container text-center mt-12">
        <h2 className="text-2xl font-bold mb-4">Problem not found</h2>
        <button onClick={() => navigate('/problems')} className="btn-primary">Back to Problems</button>
      </div>
    );
  }

  return (
    <div className="workspace-container">
      {/* Left Panel: Description, Submissions, etc. */}
      <div className="workspace-panel workspace-panel-left">
        <div className="panel-header">
          <div className="panel-tabs">
            <div
              className={`tab-item ${leftTab === 'description' ? 'active' : ''}`}
              onClick={() => setLeftTab('description')}
            >
              <div className="flex items-center gap-2">
                <BookOpen size={14} /> Description
              </div>
            </div>
            <div
              className={`tab-item ${leftTab === 'ai-mentor' ? 'active' : ''}`}
              onClick={() => setLeftTab('ai-mentor')}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-accent" /> AI Mentor
              </div>
            </div>
            <div
              className={`tab-item ${leftTab === 'submissions' ? 'active' : ''}`}
              onClick={() => setLeftTab('submissions')}
            >
              <div className="flex items-center gap-2">
                <History size={14} /> Submissions
              </div>
            </div>
            <div
              className={`tab-item ${leftTab === 'discussion' ? 'active' : ''}`}
              onClick={() => setLeftTab('discussion')}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={14} /> Discussion
              </div>
            </div>
            <div
              className={`tab-item ${leftTab === 'editorial' ? 'active' : ''}`}
              onClick={() => setLeftTab('editorial')}
            >
              <div className="flex items-center gap-2">
                <Info size={14} /> Editorial
              </div>
            </div>
          </div>
        </div>

        <div className="panel-content">
          {leftTab === 'description' && (
            <div className="animate-fade-in">
              <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span className={`badge badge-${problem.difficulty.toLowerCase()}`}>
                  {problem.difficulty}
                </span>
              </div>

              <div
                className="problem-description mb-8"
                dangerouslySetInnerHTML={{ __html: marked.parse(problem.description || '') }}
              />

              {problem.testCases && problem.testCases.length > 0 && (
                <div className="examples mt-6">
                  <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted">Example Test Case</h3>
                  <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-lg bg-surface-hover border border-border-color">
                      <span className="text-xs font-bold text-muted uppercase tracking-widest block mb-2">Input</span>
                      <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">{problem.testCases[0].input}</pre>
                    </div>
                    <div className="p-4 rounded-lg bg-surface-hover border border-border-color">
                      <span className="text-xs font-bold text-muted uppercase tracking-widest block mb-2">Output</span>
                      <pre className="text-sm font-mono overflow-x-auto whitespace-pre-wrap">{problem.testCases[0].expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {leftTab === 'ai-mentor' && (
            <div className="flex flex-col h-full animate-fade-in chat-panel-container">
              <div className="flex justify-between items-center mb-4 pb-3 border-b border-border-color/60">
                <div>
                  <h2 className="text-lg font-bold text-main flex items-center gap-2">
                    <Sparkles size={18} className="text-accent" /> AI Socratic Mentor
                  </h2>
                  <p className="text-[11px] font-semibold text-accent/80 flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                    Socratic Mode Active
                  </p>
                </div>
                <button 
                  className="text-xs text-muted hover:text-accent flex items-center gap-1.5 border border-border-color rounded-lg px-2.5 py-1.5 bg-surface-hover transition-all hover:border-accent/30"
                  onClick={() => setChatHistory([
                    { sender: 'ai', text: "Hello! I am Socrates AI, your programming mentor. Write your code on the right and ask me questions about it. I won't give away the solution directly, but I will guide you to it!" }
                  ])}
                >
                  <RotateCcw size={12} /> Reset Chat
                </button>
              </div>

              {/* Chat Message Window */}
              <div className="chat-messages-container">
                {chatHistory.map((msg, idx) => {
                  const isAi = msg.sender === 'ai';
                  return (
                    <div key={idx} className={`chat-bubble-wrapper ${isAi ? 'ai' : 'user'}`}>
                      <div className="chat-bubble-avatar">
                        {isAi ? (
                          <Sparkles size={14} />
                        ) : (
                          (user?.username?.charAt(0).toUpperCase() || 'U')
                        )}
                      </div>
                      <div className="chat-bubble-content">
                        <span className="chat-bubble-sender-name">
                          {isAi ? 'Socrates AI' : (user?.name || user?.username || 'You')}
                        </span>
                        
                        {isAi ? (
                          <div 
                            className="chat-bubble-text text-sm markdown-content problem-description"
                            dangerouslySetInnerHTML={{ __html: marked.parse(msg.text || '') }}
                          />
                        ) : (
                          <div className="chat-bubble-text text-sm whitespace-pre-wrap">
                            {msg.text}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {aiLoading && (
                  <div className="chat-bubble-wrapper ai">
                    <div className="chat-bubble-avatar">
                      <Sparkles size={14} className="animate-spin text-white" />
                    </div>
                    <div className="chat-bubble-content">
                      <span className="chat-bubble-sender-name">Socrates AI</span>
                      <div className="typing-indicator">
                        <span className="dot"></span>
                        <span className="dot"></span>
                        <span className="dot"></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Suggestion Chips */}
              <div className="suggestion-chips-container">
                <button 
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick('complexity')}
                  disabled={aiLoading || analyzingComplexity}
                >
                  {analyzingComplexity ? <Loader2 className="animate-spin animate-spin-slow" size={12} /> : '🔍 Analyze Complexity'}
                </button>
                <button 
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick('bugs')}
                  disabled={aiLoading}
                >
                  🐛 Find Logical Bugs
                </button>
                <button 
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick('hint')}
                  disabled={aiLoading}
                >
                  💡 Get Socratic Hint
                </button>
              </div>

              {/* Complexity Review Card */}
              {complexityReview && (
                <div className="complexity-review-card mb-4">
                  <button 
                    className="absolute top-3 right-3 text-muted hover:text-accent text-sm font-bold transition-colors"
                    onClick={() => setComplexityReview(null)}
                  >
                    ×
                  </button>
                  <h3 className="text-xs font-bold text-accent mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    🧠 Code Efficiency Review
                  </h3>
                  
                  <div className="flex gap-6 mb-3 pb-3 border-b border-border-color">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Time Complexity</span>
                      <span className="badge badge-easy font-mono text-xs font-bold block w-max">
                        {complexityReview.timeComplexity}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-muted block mb-0.5">Space Complexity</span>
                      <span className="badge badge-medium font-mono text-xs font-bold block w-max">
                        {complexityReview.spaceComplexity}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-[10px] uppercase font-bold text-muted block mb-1.5">Key Review Points</span>
                    <ul className="list-disc list-inside text-xs text-main pl-1 flex flex-col gap-1.5">
                      {complexityReview.reviewPoints?.map((pt, i) => (
                        <li key={i} className="leading-relaxed">{pt}</li>
                      ))}
                    </ul>
                  </div>

                  {complexityReview.suggestions && (
                    <div className="mt-2 bg-surface-hover p-2.5 rounded-lg border border-border-color">
                      <span className="text-[10px] uppercase font-bold text-muted block mb-1">Suggestions</span>
                      <p className="text-xs text-main leading-relaxed font-medium">{complexityReview.suggestions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Chat Input Field */}
              <form onSubmit={handleSendMessage} className="chat-input-form mt-auto">
                <input
                  type="text"
                  className="chat-input-field"
                  placeholder="Ask Socrates AI a question..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={aiLoading}
                />
                <button 
                  type="submit" 
                  className="chat-send-btn" 
                  disabled={aiLoading || !inputMessage.trim()}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}

          {leftTab === 'submissions' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6">My Submissions</h2>
              {loadingSubmissions ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
              ) : submissions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="submissions-table">
                    <thead>
                      <tr>
                        <th>Status</th>
                        <th>Runtime</th>
                        <th>Points</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissions.map((sub) => (
                        <tr key={sub._id}>
                          <td className={sub.status === 'Accepted' ? 'status-accepted' : 'status-failed'}>
                            {sub.status}
                          </td>
                          <td className="font-mono text-xs">{sub.executionTime ? `${sub.executionTime}s` : '--'}</td>
                          <td>{sub.points}</td>
                          <td className="text-muted text-[10px]">{new Date(sub.createdAt).toLocaleDateString()}</td>
                          <td>
                            <button
                              className="text-xs text-primary hover:underline"
                              onClick={() => {
                                setCode(sub.code);
                                setLanguage(sub.languageId.toString());
                                setLeftTab('description');
                              }}
                            >
                              Reuse
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-muted">
                  <History size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No submissions found for this problem.</p>
                </div>
              )}
            </div>
          )}

          {leftTab === 'discussion' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6">Discussion</h2>

              <form onSubmit={handleAddComment} className="mb-8">
                <textarea
                  className="w-full bg-surface-hover border border-border-color rounded-lg p-3 text-sm min-h-[80px] mb-2 focus:border-primary outline-none transition-colors"
                  placeholder="Share your thoughts or ask a question..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    className="submit-btn"
                    type="submit"
                    disabled={postingComment || !newComment.trim()}
                    style={{ padding: '4px 16px', fontSize: '0.8rem' }}
                  >
                    {postingComment ? <Loader2 className="animate-spin" size={12} /> : <Send size={12} />}
                    Post
                  </button>
                </div>
              </form>

              {loadingComments ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin" /></div>
              ) : comments.length > 0 ? (
                <div className="flex flex-col">
                  {comments.map((comment) => (
                    <div key={comment._id} className="comment-card animate-fade-in">
                      <div className="comment-header">
                        <div className="user-avatar">
                          {comment.userId?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="comment-meta">
                          <span className="comment-user">{comment.userId?.username}</span>
                          <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="comment-body">
                        {comment.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted">
                  <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No comments yet. Be the first to start the discussion!</p>
                </div>
              )}
            </div>
          )}

          {leftTab === 'editorial' && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold mb-6">Solution & Editorial</h2>
              {problem.editorial ? (
                <div
                  className="problem-description mb-8"
                  dangerouslySetInnerHTML={{ __html: marked.parse(problem.editorial) }}
                />
              ) : (
                <div className="text-center py-12 text-muted">
                  <Info size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No editorial available for this problem yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Editor & Console */}
      <div className="workspace-panel workspace-panel-right">
        <div className="panel-header">
          <div className="flex items-center gap-3">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-surface-hover text-sm border-none rounded px-2 py-1 outline-none cursor-pointer"
            >
              {languages.map(lang => (
                <option key={lang.id} value={lang.id}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button className="run-btn" onClick={() => handleSubmit(false)} disabled={submitting}>
              <Play size={14} fill="currentColor" /> Run
            </button>
            <button className="submit-btn" onClick={() => handleSubmit(true)} disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin" size={14} /> : <Send size={14} />}
              Submit
            </button>
          </div>
        </div>

        <div className="editor-container">
          <Editor
            height="100%"
            theme="vs-dark"
            language={languages.find(l => l.id === language)?.monaco || 'python'}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              fontFamily: "'Fira Code', 'Roboto Mono', monospace",
              fontLigatures: true,
              cursorSmoothCaretAnimation: "on",
              smoothScrolling: true,
            }}
          />
        </div>

        {/* Console / Result Panel */}
        <div className="console-panel" style={{ height: consoleOpen ? '350px' : '40px', flexBasis: consoleOpen ? '350px' : '40px' }}>
          <div className="console-header" onClick={() => setConsoleOpen(!consoleOpen)}>
            <div className="flex items-center gap-6 h-full">
              <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest h-full border-b-2 transition-colors ${(!result || result.isRunOnly) ? 'border-primary text-main' : 'border-transparent text-muted'}`}>
                <ConsoleIcon size={14} /> Console
              </div>

            </div>
            <div className="flex items-center gap-4">
              {consoleOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>
          </div>

          {consoleOpen && (
            <div className="console-content">
              {submitting ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 opacity-70 py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-sm font-medium tracking-wide">Running test cases...</p>
                </div>
              ) : result ? (
                <div className="animate-fade-in flex flex-col h-full">
                  {/* Status Section */}
                  <div className="lc-result-header">
                    <div className={`lc-status-text ${result.status === 'Accepted' ? 'lc-status-accepted' : 'lc-status-failed'}`}>
                      {result.status === 'Accepted' ? (result.isRunOnly ? 'Finished' : 'Accepted') : result.status || 'Failed'}
                    </div>
                    {result.status === 'Accepted' && (
                      <div className="text-xs text-muted font-medium">
                        {result.isRunOnly ? 'Sample test case passed.' : 'All test cases passed successfully.'}
                      </div>
                    )}
                  </div>

                  {/* Metrics Section */}
                  {result.status === 'Accepted' && (
                    <div className="lc-metrics-container">
                      <div className="lc-metric-item">
                        <span className="lc-metric-label">Runtime</span>
                        <span className="lc-metric-value">{result.executionTime}s</span>
                      </div>
                      <div className="lc-metric-item">
                        <span className="lc-metric-label">Memory</span>
                        <span className="lc-metric-value">{result.memory ? `${result.memory} MB` : '-- MB'}</span>
                      </div>
                      {!result.isRunOnly && (
                        <div className="lc-metric-item">
                          <span className="lc-metric-label">Points</span>
                          <span className="lc-metric-value text-accent">{result.points}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Details Section */}
                  <div className="lc-output-section">
                    {result.status !== 'Accepted' ? (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="lc-output-label">Error Message</span>
                          <pre className="lc-code-block text-danger border-danger/20 bg-danger/5">
                            {result.message || 'The code did not pass all test cases.'}
                          </pre>
                        </div>
                        {result.error && (
                          <div className="flex flex-col">
                            <span className="lc-output-label">System Error</span>
                            <pre className="lc-code-block text-muted text-xs">
                              {result.error}
                            </pre>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-col">
                          <span className="lc-output-label">{result.isRunOnly ? 'Standard Output' : 'Result Status:- '}</span>
                          <div className="text-sm text-main">
                            {result.isRunOnly ? (
                              <pre className="lc-code-block mt-2">
                                {result.output || 'No output produced.'}
                              </pre>
                            ) : (
                              'Your code was executed against all hidden test cases.'
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted text-sm font-medium py-12">
                  <div className="flex flex-col items-center gap-3 opacity-40">
                    <ConsoleIcon size={40} />
                    <p>Run your code to see the test results here.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemWorkspace;
