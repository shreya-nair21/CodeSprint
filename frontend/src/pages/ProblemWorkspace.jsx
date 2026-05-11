import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { marked } from 'marked';
import api from '../api/axios';
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
  Clock
} from 'lucide-react';

const ProblemWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleSubmit = async () => {
    if (!code) return;
    setSubmitting(true);
    setResult(null);
    setConsoleOpen(true);
    try {
      const response = await api.post('/submissions', {
        problemId: id,
        code,
        languageId: parseInt(language)
      });
      setResult(response.data);
      // Refresh submissions if we are on that tab
      if (leftTab === 'submissions') fetchSubmissions();
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
          
          <div className="flex gap-2">
            <button className="run-btn" onClick={handleSubmit} disabled={submitting}>
              <Play size={14} fill="currentColor" /> Run
            </button>
            <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>
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
        <div className="console-panel" style={{ height: consoleOpen ? '35%' : '40px' }}>
          <div className="console-header" onClick={() => setConsoleOpen(!consoleOpen)}>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <ConsoleIcon size={14} /> 
              {result ? 'Submission Result' : 'Console'}
            </div>
            <div className="flex items-center gap-4">
              {result && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${result.status === 'Accepted' ? 'bg-accent/10 text-accent' : 'bg-danger/10 text-danger'}`}>
                  {result.status}
                </span>
              )}
              {consoleOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            </div>
          </div>
          
          {consoleOpen && (
            <div className="console-content">
              {submitting ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 opacity-50">
                  <Loader2 className="animate-spin" size={24} />
                  <p className="text-xs">Running test cases...</p>
                </div>
              ) : result ? (
                <div className="animate-fade-in">
                  <div className={`mb-4 p-4 rounded-lg border ${result.status === 'Accepted' ? 'border-accent/20 bg-accent/5' : 'border-danger/20 bg-danger/5'}`}>
                    <h4 className={`text-sm font-bold mb-2 ${result.status === 'Accepted' ? 'text-accent' : 'text-danger'}`}>
                      {result.status === 'Accepted' ? 'Success!' : 'Failed'}
                    </h4>
                    
                    {result.status === 'Accepted' ? (
                      <div className="text-xs grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-muted block">Runtime</span>
                          <span className="font-mono text-main">{result.executionTime}s</span>
                        </div>
                        <div>
                          <span className="text-muted block">Memory</span>
                          <span className="font-mono text-main">-- MB</span>
                        </div>
                        <div>
                          <span className="text-muted block">Points</span>
                          <span className="font-mono text-main">{result.points}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2">
                        <pre className="text-xs text-danger bg-black/20 p-3 rounded overflow-x-auto">
                          {result.message || 'The code did not pass all test cases.'}
                        </pre>
                        {result.status === 'Wrong Answer' && (
                          <p className="text-[10px] mt-2 text-muted">Check your logic and handle all edge cases as specified in the description.</p>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {result.status !== 'Accepted' && result.error && (
                    <div className="text-xs text-danger mt-4 p-3 bg-danger/10 rounded border border-danger/20">
                      <strong>Server Error:</strong> {result.error}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted text-xs italic">
                  Run your code to see the output here.
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
