import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Upload, FileText, Moon, Sun, Coffee, Type, 
  Search, Copy, Check, Info, Lightbulb, AlertCircle, AlertTriangle, 
  ShieldAlert, Trash2, BookOpen, Compass, ExternalLink, ChevronLeft, 
  Maximize, Minimize, X, List, Sparkles, Files, Sliders, Scroll
} from 'lucide-react';
import { sampleMarkdown } from '../../sampleMarkdown';

// Helper to extract plain text recursively from React components (used for slugifying heading IDs)
const extractText = (node) => {
  if (!node) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.props && node.props.children) return extractText(node.props.children);
  return '';
};

// Helper to slugify text for headings
const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
};

// Custom Heading Component
const Heading = ({ level, children }) => {
  const text = extractText(children);
  const id = slugify(text);
  const Tag = `h${level}`;
  
  return (
    <Tag id={id} className="relative group">
      {children}
      <a 
        href={`#${id}`} 
        className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-[var(--accent)] pr-2 select-none"
        title="Direct link"
      >
        #
      </a>
    </Tag>
  );
};

// Custom Code Block component with Syntax Highlighting and Copy Button
const CodeBlock = ({ language, value }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Basic regex-based token highlight for JavaScript, HTML, and CSS
  const highlightCode = (code, lang) => {
    if (!lang) return code;
    
    // Escape HTML first
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    
    const lowerLang = lang.toLowerCase();
    
    if (lowerLang === 'javascript' || lowerLang === 'js' || lowerLang === 'typescript' || lowerLang === 'ts') {
      html = html
        // Keywords
        .replace(/\b(const|let|var|function|return|class|export|import|from|extends|if|else|for|while|do|switch|case|break|continue|new|try|catch|finally|throw|typeof|instanceof|async|await|yield|default)\b/g, '<span class="text-purple-400 font-semibold">$1</span>')
        // Built-ins/booleans
        .replace(/\b(true|false|null|undefined|console|log|window|document|process|require)\b/g, '<span class="text-amber-400">$1</span>')
        // Strings
        .replace(/(["'`])(.*?)\1/g, '<span class="text-emerald-400">$&</span>')
        // Comments
        .replace(/(\/\/.*)/g, '<span class="text-zinc-500 italic">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>')
        // Numbers
        .replace(/\b(\d+)\b/g, '<span class="text-sky-400">$1</span>');
    } else if (lowerLang === 'html' || lowerLang === 'xml') {
      html = html
        // Tags
        .replace(/(&lt;\/?[a-zA-Z0-9:-]+)/g, '<span class="text-purple-400 font-semibold">$1</span>')
        .replace(/(\/?&gt;)/g, '<span class="text-purple-400 font-semibold">$1</span>')
        // Attributes
        .replace(/(\s[a-zA-Z0-9:-]+=)(["'].*?["'])/g, ' <span class="text-sky-400">$1</span><span class="text-emerald-400">$2</span>')
        // Comments
        .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="text-zinc-500 italic">$1</span>');
    } else if (lowerLang === 'css') {
      html = html
        // Selectors
        .replace(/^([.#\w\s,-]+)(?=\s*\{)/gm, '<span class="text-purple-400 font-semibold">$1</span>')
        // Properties
        .replace(/([\w-]+)(?=\s*:)/g, '<span class="text-sky-400">$1</span>')
        // Values
        .replace(/(:\s*)([^;]+)(;)/g, '$1<span class="text-emerald-400">$2</span>$3')
        // Comments
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-zinc-500 italic">$1</span>');
    }
    
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="relative my-6 rounded-xl border border-[var(--border-color)] bg-zinc-950 overflow-hidden font-mono shadow-md group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-zinc-900 text-xs text-zinc-400 select-none">
        <span className="font-semibold uppercase tracking-wider text-purple-400">{language || 'code'}</span>
        <button 
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-all active:scale-95 cursor-pointer"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 m-0 overflow-x-auto text-sm leading-relaxed text-zinc-200 hide-scrollbar">
        <code>{highlightCode(value, language)}</code>
      </pre>
    </div>
  );
};

function MainBody({ theme, setTheme }) {
  const [loader, setLoader] = useState(false);
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  
  // Customization States
  const [fontSize, setFontSize] = useState('base'); // base, sm, lg, xl
  const [fontFamily, setFontFamily] = useState('sans'); // sans, serif, mono
  const [lineHeight, setLineHeight] = useState('normal'); // normal, relaxed, loose
  const [readingWidth, setReadingWidth] = useState('centered'); // centered, full
  
  // Navigation & UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('outline'); // outline, files
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [recentFiles, setRecentFiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('md-reader-history')) || [];
    } catch {
      return [];
    }
  });

  const scrollContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Sync recent files with localStorage
  useEffect(() => {
    localStorage.setItem('md-reader-history', JSON.stringify(recentFiles));
  }, [recentFiles]);

  // Parse Headings for Table of Contents
  const headings = React.useMemo(() => {
    if (!fileContent) return [];
    
    const lines = fileContent.split('\n');
    const list = [];
    let inCodeBlock = false;

    for (let line of lines) {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }
      if (inCodeBlock) continue;

      const match = line.match(/^(#{1,3})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2]
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove markdown links
          .replace(/[*_`~]/g, '') // remove formatting characters
          .trim();
        const id = slugify(text);
        list.push({ level, text, id });
      }
    }
    return list;
  }, [fileContent]);

  // Document Statistics
  const stats = React.useMemo(() => {
    if (!fileContent) return { words: 0, characters: 0, readTime: 0 };
    const characters = fileContent.length;
    const words = fileContent.trim().split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(words / 200)); // assuming 200 wpm
    return { words, characters, readTime };
  }, [fileContent]);

  // IntersectionObserver/Scroll listener for Scroll Spy and Progress bar
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !loader) return;

    const handleScroll = () => {
      // 1. Reading Progress
      const { scrollTop, scrollHeight, clientHeight } = container;
      const progress = scrollHeight - clientHeight > 0
        ? (scrollTop / (scrollHeight - clientHeight)) * 100
        : 0;
      setScrollProgress(progress);

      // 2. Scroll Spy (TOC highlighting)
      const headingElements = container.querySelectorAll('h1, h2, h3');
      let currentActive = '';
      const containerTop = container.getBoundingClientRect().top;

      for (let heading of headingElements) {
        const rect = heading.getBoundingClientRect();
        // If heading is near the top of the scroll container
        if (rect.top - containerTop <= 120) {
          currentActive = heading.id;
        } else {
          break; // Headings are in order, so if this one is below, others will be too
        }
      }
      if (currentActive) {
        setActiveHeadingId(currentActive);
      }
    };

    container.addEventListener('scroll', handleScroll);
    // Initial run
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [loader, fileContent]);

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    const mainWrapper = document.getElementById('reader-app-container');
    if (!mainWrapper) return;

    if (!document.fullscreenElement) {
      mainWrapper.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error("Fullscreen error:", err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Process File Extraction
  const loadFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      setFileContent(text);
      setFileName(file.name);
      setLoader(true);
      setSearchQuery('');
      setShowSearch(false);
      
      // Update history
      const newFileObj = {
        name: file.name,
        content: text,
        size: (file.size / 1024).toFixed(1) + ' KB',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setRecentFiles(prev => {
        const filtered = prev.filter(f => f.name !== file.name);
        return [newFileObj, ...filtered].slice(0, 5); // keep last 5 files
      });
    };

    reader.onerror = (e) => {
      console.error(e);
      alert("Failed to read the file.");
    };

    reader.readAsText(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    loadFile(file);
  };

  // Drag and Drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.md') || file.name.endsWith('.txt') || file.type === 'text/markdown')) {
      loadFile(file);
    } else {
      alert("Please drop a valid Markdown (.md) or Text (.txt) file.");
    }
  };

  // Onboarding Loader
  const loadSampleDoc = () => {
    setFileContent(sampleMarkdown);
    setFileName("Sample Document.md");
    setLoader(true);
    setSearchQuery('');
    setShowSearch(false);
    
    // Add to history
    const sampleObj = {
      name: "Sample Document.md",
      content: sampleMarkdown,
      size: "4.5 KB",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.name !== sampleObj.name);
      return [sampleObj, ...filtered].slice(0, 5);
    });
  };

  // Switch to previously loaded file from history
  const loadFileFromHistory = (file) => {
    setFileContent(file.content);
    setFileName(file.name);
    setLoader(true);
    setSearchQuery('');
    setShowSearch(false);
  };

  // Remove file from history
  const deleteHistoryItem = (name, e) => {
    e.stopPropagation();
    setRecentFiles(prev => prev.filter(f => f.name !== name));
  };

  const resetReader = () => {
    setLoader(false);
    setFileContent('');
    setFileName('');
    setScrollProgress(0);
    setActiveHeadingId('');
  };

  // Scroll to heading smoothly
  const scrollToHeading = (id) => {
    const element = document.getElementById(id);
    const container = scrollContainerRef.current;
    if (element && container) {
      const offsetTop = element.offsetTop - 40; // small offset padding
      container.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
      setActiveHeadingId(id);
    }
  };

  // CSS variables mapping for typography configurations
  const getTypographyStyle = () => {
    let sizeVar = '1.05rem';
    if (fontSize === 'sm') sizeVar = '0.9rem';
    if (fontSize === 'lg') sizeVar = '1.2rem';
    if (fontSize === 'xl') sizeVar = '1.35rem';

    let lhVar = '1.625';
    if (lineHeight === 'relaxed') lhVar = '1.875';
    if (lineHeight === 'loose') lhVar = '2.15';

    return {
      '--font-size': sizeVar,
      '--line-height': lhVar,
    };
  };

  // Text highlighting logic for Search Query
  const highlightText = (text, query) => {
    if (!query || typeof text !== 'string') return text;
    
    // Regex escape
    const escapedQuery = query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="highlight-match">{part}</mark> 
        : part
    );
  };

  const highlightQuery = (node, query) => {
    if (!query) return node;
    if (typeof node === 'string') {
      return highlightText(node, query);
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => <React.Fragment key={i}>{highlightQuery(child, query)}</React.Fragment>);
    }
    if (React.isValidElement(node)) {
      if (node.type === 'code' || node.type === 'pre') return node;
      const { children } = node.props;
      if (children) {
        return React.cloneElement(node, {}, highlightQuery(children, query));
      }
    }
    return node;
  };

  // Custom components map for react-markdown
  const customComponents = {
    h1: ({ children }) => <Heading level={1}>{children}</Heading>,
    h2: ({ children }) => <Heading level={2}>{children}</Heading>,
    h3: ({ children }) => <Heading level={3}>{children}</Heading>,
    h4: ({ children }) => <Heading level={4}>{children}</Heading>,
    h5: ({ children }) => <Heading level={5}>{children}</Heading>,
    h6: ({ children }) => <Heading level={6}>{children}</Heading>,
    
    table: ({ children }) => (
      <div className="markdown-table-wrapper select-text">
        <table>{children}</table>
      </div>
    ),
    
    a: ({ href, children, ...props }) => {
      const isExternal = href && !href.startsWith('#') && !href.startsWith('/');
      return (
        <a 
          href={href} 
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="inline-flex items-center gap-0.5"
          {...props}
        >
          {children}
          {isExternal && <ExternalLink size={11} className="opacity-60 inline mt-0.5" />}
        </a>
      );
    },
    
    code: ({ inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      
      return !inline && match ? (
        <CodeBlock language={match[1]} value={codeString} {...props} />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    blockquote: ({ children }) => {
      let isAlert = false;
      let alertType = '';
      let alertContent = children;

      // Extract AlertCallout markup if blockquote starts with [!TYPE]
      if (children && children.length > 0) {
        const firstChild = children[0];
        if (firstChild.props && firstChild.props.children) {
          const textChildren = firstChild.props.children;
          if (typeof textChildren === 'string' || (Array.isArray(textChildren) && typeof textChildren[0] === 'string')) {
            const firstString = typeof textChildren === 'string' ? textChildren : textChildren[0];
            const match = firstString.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n?/i);
            
            if (match) {
              isAlert = true;
              alertType = match[1].toLowerCase();
              const remainingString = firstString.slice(match[0].length);
              
              const newParagraphChildren = typeof textChildren === 'string' 
                ? [remainingString] 
                : [remainingString, ...textChildren.slice(1)];
                
              const newFirstChild = React.cloneElement(firstChild, {}, ...newParagraphChildren);
              alertContent = [newFirstChild, ...children.slice(1)];
            }
          }
        }
      }

      if (isAlert) {
        const icons = {
          note: <Info size={16} />,
          tip: <Lightbulb size={16} />,
          important: <AlertCircle size={16} />,
          warning: <AlertTriangle size={16} />,
          caution: <ShieldAlert size={16} />
        };

        return (
          <div className={`alert-callout alert-callout-${alertType} my-5 shadow-sm`}>
            <div className="alert-icon mt-0.5">{icons[alertType] || <Info size={16} />}</div>
            <div className="flex-1 text-sm">
              <div className="alert-title">{alertType}</div>
              <div className="alert-body select-text">{alertContent}</div>
            </div>
          </div>
        );
      }

      return <blockquote>{children}</blockquote>;
    },

    // Apply Search Highlighting
    p: ({ children }) => <p>{highlightQuery(children, searchQuery)}</p>,
    li: ({ children }) => <li>{highlightQuery(children, searchQuery)}</li>,
    td: ({ children }) => <td>{highlightQuery(children, searchQuery)}</td>,
    th: ({ children }) => <th>{highlightQuery(children, searchQuery)}</th>,
  };

  // Helper count matches for search query
  const searchMatchesCount = React.useMemo(() => {
    if (!searchQuery || !fileContent) return 0;
    try {
      const escaped = searchQuery.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const matches = fileContent.match(new RegExp(escaped, 'gi'));
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [searchQuery, fileContent]);

  return (
    <div 
      id="reader-app-container" 
      className={`theme-${theme} w-full h-[88vh] flex select-none overflow-hidden`}
    >
      <div className="w-full h-full bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex font-sans-custom relative">
        
        {/* ================= LEFT SIDEBAR ================= */}
        {loader && (
          <aside 
            className={`h-full border-r border-[var(--border-color)] bg-[var(--sidebar-bg)] transition-all duration-300 flex flex-col z-20 overflow-hidden ${
              sidebarOpen ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'
            }`}
          >
            {/* Sidebar Tabs */}
            <div className="flex border-b border-[var(--border-color)] text-sm font-semibold select-none">
              <button 
                onClick={() => setActiveTab('outline')}
                className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
                  activeTab === 'outline' 
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-primary)]' 
                    : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]/50'
                }`}
              >
                <List size={15} />
                <span>Outline</span>
              </button>
              <button 
                onClick={() => setActiveTab('files')}
                className={`flex-1 py-3 text-center flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-all ${
                  activeTab === 'files' 
                    ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--bg-primary)]' 
                    : 'border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-primary)]/50'
                }`}
              >
                <Files size={15} />
                <span>Recent Files</span>
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {activeTab === 'outline' ? (
                headings.length > 0 ? (
                  <nav className="space-y-1.5 select-none">
                    {headings.map((h, i) => (
                      <button 
                        key={i}
                        onClick={() => scrollToHeading(h.id)}
                        className={`w-full text-left rounded-lg py-1.5 px-3 text-xs leading-relaxed font-medium transition-all cursor-pointer flex items-center gap-2 hover:bg-[var(--bg-primary)] hover:text-[var(--accent)] ${
                          activeHeadingId === h.id 
                            ? 'bg-[var(--toc-active-bg)] text-[var(--accent)] font-semibold border-l-2 border-[var(--accent)] pl-2' 
                            : 'text-[var(--text-secondary)] border-l border-transparent'
                        }`}
                        style={{ paddingLeft: `${h.level * 0.75}rem` }}
                      >
                        <span className="opacity-50">h{h.level}</span>
                        <span className="truncate">{h.text}</span>
                      </button>
                    ))}
                  </nav>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-xs text-[var(--text-secondary)] p-6">
                    <BookOpen size={24} className="mb-2 opacity-40" />
                    <span>No headings found in this document.</span>
                  </div>
                )
              ) : (
                <div className="space-y-2.5">
                  <div className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">History</div>
                  {recentFiles.map((file, i) => (
                    <div 
                      key={i}
                      onClick={() => loadFileFromHistory(file)}
                      className={`group w-full text-left rounded-xl p-3 border border-[var(--border-color)] transition-all cursor-pointer flex items-start justify-between hover:bg-[var(--bg-primary)] hover:border-[var(--accent)] ${
                        fileName === file.name ? 'border-[var(--accent)] bg-[var(--bg-primary)]/60' : 'bg-[var(--bg-primary)]/20'
                      }`}
                    >
                      <div className="flex gap-2.5 items-center overflow-hidden">
                        <FileText size={16} className={fileName === file.name ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'} />
                        <div className="overflow-hidden">
                          <div className={`text-xs font-semibold truncate ${fileName === file.name ? 'text-[var(--accent)]' : 'text-[var(--text-primary)]'}`}>
                            {file.name}
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            {file.size} &bull; {file.timestamp}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => deleteHistoryItem(file.name, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 rounded hover:bg-[var(--bg-secondary)] transition-all cursor-pointer"
                        title="Delete history entry"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  {recentFiles.length === 0 && (
                    <div className="text-center text-xs text-[var(--text-secondary)] py-8">
                      No recently loaded files.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Document Statistics Panel */}
            <div className="border-t border-[var(--border-color)] bg-[var(--bg-primary)]/60 p-4 text-xs space-y-2 text-[var(--text-secondary)] font-medium">
              <div className="flex justify-between">
                <span>Words:</span>
                <span className="text-[var(--text-primary)] font-bold">{stats.words.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Characters:</span>
                <span className="text-[var(--text-primary)] font-bold">{stats.characters.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--border-color)]/50 pt-2 mt-1">
                <span>Reading Time:</span>
                <span className="text-[var(--accent)] font-bold flex items-center gap-1">
                  <Coffee size={12} />
                  {stats.readTime} {stats.readTime === 1 ? 'minute' : 'minutes'}
                </span>
              </div>
            </div>
          </aside>
        )}

        {/* ================= MAIN READER INTERFACE ================= */}
        <div className="flex-1 h-full flex flex-col relative overflow-hidden">
          
          {loader ? (
            <>
              {/* --- TOP SETTINGS / ACTIONS BAR --- */}
              <div className="w-full h-14 border-b border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 flex items-center justify-between z-10 select-none">
                
                {/* Left side actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSidebarOpen(prev => !prev)}
                    className="p-2 rounded-lg hover:bg-[var(--bg-primary)]/80 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-95"
                    title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                  >
                    <ChevronLeft size={18} className={`transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <button 
                    onClick={resetReader}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent)] hover:text-[var(--accent)] bg-[var(--bg-primary)] text-xs font-semibold transition-all cursor-pointer active:scale-95"
                  >
                    <ArrowLeftIcon />
                    <span>Upload New</span>
                  </button>
                  <div className="h-4 w-[1px] bg-[var(--border-color)] mx-1"></div>
                  <div className="text-xs font-bold truncate max-w-[200px] text-[var(--text-secondary)] flex items-center gap-1.5">
                    <FileText size={14} className="text-[var(--accent)]" />
                    <span className="truncate">{fileName}</span>
                  </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center gap-2 relative">
                  
                  {/* Theme Switcher Quick Toggle */}
                  <div className="flex items-center bg-[var(--bg-primary)] rounded-lg p-0.5 border border-[var(--border-color)]">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-1.5 rounded-md cursor-pointer transition-all ${
                        theme === 'light' 
                          ? 'bg-[var(--accent)] text-white shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Light Mode"
                    >
                      <Sun size={14} />
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-1.5 rounded-md cursor-pointer transition-all ${
                        theme === 'dark' 
                          ? 'bg-[var(--accent)] text-white shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Dark Mode"
                    >
                      <Moon size={14} />
                    </button>
                    <button 
                      onClick={() => setTheme('sepia')}
                      className={`p-1.5 rounded-md cursor-pointer transition-all ${
                        theme === 'sepia' 
                          ? 'bg-[var(--accent)] text-white shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Sepia Mode"
                    >
                      <Coffee size={14} />
                    </button>
                    <button 
                      onClick={() => setTheme('nord')}
                      className={`p-1.5 rounded-md cursor-pointer transition-all ${
                        theme === 'nord' 
                          ? 'bg-[var(--accent)] text-white shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Nord Mode"
                    >
                      <Compass size={14} />
                    </button>
                    <button 
                      onClick={() => setTheme('medieval')}
                      className={`p-1.5 rounded-md cursor-pointer transition-all ${
                        theme === 'medieval' 
                          ? 'bg-[var(--accent)] text-white shadow-sm' 
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                      title="Medieval Parchment"
                    >
                      <Scroll size={14} />
                    </button>
                  </div>

                  {/* Typography Settings Dropdown Trigger */}
                  <button 
                    onClick={() => setShowSettingsDropdown(prev => !prev)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                      showSettingsDropdown || fontSize !== 'base' || fontFamily !== 'sans' || lineHeight !== 'normal' || readingWidth !== 'centered'
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]' 
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Typography & Page Settings"
                  >
                    <Sliders size={15} />
                  </button>

                  {/* Typography dropdown panel */}
                  {showSettingsDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setShowSettingsDropdown(false)}
                      ></div>
                      <div className="absolute right-0 top-11 mt-1 w-64 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 shadow-xl z-40 space-y-4 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 border-b border-[var(--border-color)] pb-2 mb-1">
                          <Type size={14} />
                          <span>Reader Settings</span>
                        </div>
                        
                        {/* Font Family */}
                        <div className="space-y-1.5">
                          <div className="text-[var(--text-secondary)] font-semibold">Font Family</div>
                          <div className="grid grid-cols-3 gap-1 bg-[var(--bg-secondary)] p-0.5 rounded-lg border border-[var(--border-color)]">
                            {['sans', 'serif', 'mono'].map((f) => (
                              <button
                                key={f}
                                onClick={() => setFontFamily(f)}
                                className={`py-1 rounded capitalize cursor-pointer font-medium transition-all ${
                                  fontFamily === f 
                                    ? 'bg-[var(--accent)] text-white font-bold shadow-sm' 
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-1.5">
                          <div className="text-[var(--text-secondary)] font-semibold">Font Size</div>
                          <div className="grid grid-cols-4 gap-1 bg-[var(--bg-secondary)] p-0.5 rounded-lg border border-[var(--border-color)] text-[10px]">
                            {['sm', 'base', 'lg', 'xl'].map((sz) => (
                              <button
                                key={sz}
                                onClick={() => setFontSize(sz)}
                                className={`py-1 rounded uppercase cursor-pointer font-medium transition-all ${
                                  fontSize === sz 
                                    ? 'bg-[var(--accent)] text-white font-bold shadow-sm' 
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                {sz === 'base' ? 'MD' : sz}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Line Height */}
                        <div className="space-y-1.5">
                          <div className="text-[var(--text-secondary)] font-semibold">Line Spacing</div>
                          <div className="grid grid-cols-3 gap-1 bg-[var(--bg-secondary)] p-0.5 rounded-lg border border-[var(--border-color)]">
                            {['normal', 'relaxed', 'loose'].map((lh) => (
                              <button
                                key={lh}
                                onClick={() => setLineHeight(lh)}
                                className={`py-1 rounded capitalize cursor-pointer font-medium transition-all ${
                                  lineHeight === lh 
                                    ? 'bg-[var(--accent)] text-white font-bold shadow-sm' 
                                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                              >
                                {lh === 'normal' ? 'Std' : lh === 'relaxed' ? 'Mid' : 'Wide'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Reading Width */}
                        <div className="space-y-1.5">
                          <div className="text-[var(--text-secondary)] font-semibold">Layout Width</div>
                          <div className="grid grid-cols-2 gap-1 bg-[var(--bg-secondary)] p-0.5 rounded-lg border border-[var(--border-color)]">
                            <button
                              onClick={() => setReadingWidth('centered')}
                              className={`py-1 rounded cursor-pointer font-medium transition-all ${
                                readingWidth === 'centered' 
                                  ? 'bg-[var(--accent)] text-white font-bold shadow-sm' 
                                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              Centered
                            </button>
                            <button
                              onClick={() => setReadingWidth('full')}
                              className={`py-1 rounded cursor-pointer font-medium transition-all ${
                                readingWidth === 'full' 
                                  ? 'bg-[var(--accent)] text-white font-bold shadow-sm' 
                                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              Full Screen
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Search Bar Toggle */}
                  <button 
                    onClick={() => setShowSearch(prev => !prev)}
                    className={`p-2 rounded-lg border transition-all cursor-pointer active:scale-95 ${
                      showSearch 
                        ? 'border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]' 
                        : 'border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Search Text"
                  >
                    <Search size={15} />
                  </button>

                  <div className="h-4 w-[1px] bg-[var(--border-color)] mx-0.5"></div>

                  {/* Fullscreen Toggle */}
                  <button 
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-95"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
                  >
                    <Maximize size={15} className={isFullscreen ? 'scale-0 absolute' : 'scale-100 transition-all'} />
                    <Minimize size={15} className={isFullscreen ? 'scale-100 transition-all' : 'scale-0 absolute'} />
                  </button>
                </div>
              </div>

              {/* --- SEARCH BOX DRAWER --- */}
              {showSearch && (
                <div className="w-full bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-6 py-2.5 flex items-center justify-between gap-4 animate-in slide-in-from-top-1 duration-150 select-none z-10">
                  <div className="flex items-center gap-2 flex-1 max-w-lg">
                    <Search size={14} className="text-[var(--text-secondary)]" />
                    <input 
                      type="text"
                      placeholder="Search text in document..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-lg px-3 py-1 text-xs w-full focus:outline-none focus:border-[var(--accent)] font-medium"
                      autoFocus
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] font-semibold bg-[var(--bg-primary)] border border-[var(--border-color)] px-2.5 py-1 rounded-md">
                    {searchQuery ? `${searchMatchesCount} matches` : '0 matches'}
                  </div>
                </div>
              )}

              {/* --- SCROLL PROGRESS INDICATOR --- */}
              <div className="w-full h-[3px] bg-[var(--border-color)]/40 relative z-10 select-none">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--accent)] to-purple-400 transition-all duration-75"
                  style={{ width: `${scrollProgress}%` }}
                ></div>
              </div>

              {/* --- MARKDOWN RENDER BODY --- */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar select-text bg-[var(--bg-primary)] scroll-smooth"
              >
                <div 
                  className={`markdown-body mx-auto select-text font-${fontFamily}-custom`}
                  style={{
                    ...getTypographyStyle(),
                    maxWidth: readingWidth === 'centered' ? '52rem' : '100%',
                  }}
                >
                  <Markdown 
                    remarkPlugins={[remarkGfm]}
                    components={customComponents}
                  >
                    {fileContent || "None"}
                  </Markdown>
                </div>
              </div>
            </>
          ) : (
            
            // ================= DRAG AND DROP LANDING PANEL =================
            <div 
              className={`flex-1 flex flex-col items-center justify-center p-8 transition-all duration-300 relative ${
                isDragging ? 'bg-[var(--accent-light)]/40' : 'bg-[var(--bg-primary)]'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Drag and Drop Box */}
              <div 
                onClick={() => fileInputRef.current.click()}
                className={`max-w-2xl w-full aspect-[16/10] border-2 border-dashed rounded-3xl p-10 text-center flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group shadow-sm ${
                  isDragging 
                    ? 'border-[var(--accent)] bg-[var(--bg-primary)] scale-[1.01] shadow-lg shadow-[var(--accent)]/5' 
                    : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--accent)] hover:shadow-md'
                }`}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  onClick={(e) => e.stopPropagation()}
                  accept=".md,.txt,text/markdown,text/plain"
                  className="hidden"
                />
                
                <div className={`p-4 rounded-2xl mb-4 transition-all duration-300 ${
                  isDragging 
                    ? 'bg-[var(--accent)] text-white scale-110' 
                    : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] group-hover:text-[var(--accent)] group-hover:scale-105 group-hover:bg-[var(--accent-light)]'
                }`}>
                  <Upload size={32} />
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1.5 flex items-center gap-1.5">
                  Drag &amp; Drop Markdown File
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed mb-6 font-medium">
                  Support both <code className="px-1 py-0.5 rounded bg-[var(--bg-primary)]">.md</code> and <code className="px-1 py-0.5 rounded bg-[var(--bg-primary)]">.txt</code> documents. Or click anywhere inside this box to browse local folder.
                </p>

                <div className="flex gap-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold hover:opacity-90 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    Select File
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      loadSampleDoc();
                    }}
                    className="px-4 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[var(--text-primary)] text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                  >
                    <Sparkles size={13} className="text-amber-500" />
                    <span>Try Sample Doc</span>
                  </button>
                </div>
              </div>

              {/* History / Recent files below landing zone */}
              {recentFiles.length > 0 && (
                <div className="max-w-2xl w-full mt-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 mb-3">
                    <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-1.5">
                      <Files size={12} className="text-[var(--accent)]" />
                      <span>Recently Opened</span>
                    </h4>
                    <button 
                      onClick={() => setRecentFiles([])}
                      className="text-[10px] font-bold text-red-400 hover:text-red-500 cursor-pointer transition-all"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {recentFiles.map((file, i) => (
                      <div 
                        key={i}
                        onClick={() => loadFileFromHistory(file)}
                        className="group w-full text-left rounded-xl p-3 border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-secondary)]/80 hover:border-[var(--accent)] transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex gap-2.5 items-center overflow-hidden">
                          <FileText size={15} className="text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold truncate text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                              {file.name}
                            </div>
                            <div className="text-[10px] text-[var(--text-secondary)] font-medium mt-0.5">
                              {file.size} &bull; {file.timestamp}
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={(e) => deleteHistoryItem(file.name, e)}
                          className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 rounded hover:bg-[var(--bg-primary)] transition-all cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Inline sub-icons
const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);

export default MainBody;