import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMockData } from '../hooks/useMockData';
import { 
  ChevronLeft, Moon, Sun, Type, Heart, 
  Lock, Volume2, Pause, Sparkles, ArrowRight,
  ChevronRight, Menu, X, BookOpen, Settings
} from 'lucide-react';

// --- 核心修复：支持图片渲染，解决 React 报错，并限制文字换行防止撑开 ---
const Paragraph = React.memo(({ text, fontSize }) => {
  // 判断是否包含 HTML 标签（如图片）
  const hasHtml = typeof text === 'string' && text.includes('<');

  return (
    <div 
      className="mb-8 indent-8 w-full rich-content" 
      style={{ 
        fontSize: `${fontSize}px`,
        whiteSpace: 'pre-wrap',       // 保留原有换行
        overflowWrap: 'break-word',   // 核心限制：长字符自动换行
        wordBreak: 'break-word',      // 核心限制：防止撑坏屏幕
      }}
      // 解决报错：通过属性解构确保同一时间只设置危险 HTML 或 子内容
      {...(hasHtml 
        ? { dangerouslySetInnerHTML: { __html: text } } 
        : { children: text }
      )}
    />
  );
});

Paragraph.displayName = 'Paragraph';

export default function NovelReadingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { getNovelById, isLoading, handleLike } = useMockData();

  const checkAuth = () => {
    const hasSupaToken = Object.keys(localStorage).some(key => key.includes('auth-token'));
    return hasSupaToken || !!localStorage.getItem('user');
  };
  
  const [isLoggedIn] = useState(checkAuth());
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('novel_fontSize');
    return saved ? parseInt(saved, 10) : 18;
  });
  
  // --- 恢复你的草稿/页码保存逻辑 ---
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem(`novel_page_${id}`);
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const contentRef = useRef(null);
  const synth = window.speechSynthesis;
  const animationFrameRef = useRef(null);

  // 保存偏好设置与草稿
  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('novel_fontSize', fontSize.toString());
  }, [fontSize]);

  // 页码自动保存（你的草稿逻辑）
  useEffect(() => {
    if (id) {
      localStorage.setItem(`novel_page_${id}`, currentPage.toString());
    }
  }, [currentPage, id]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      synth.cancel();
      setIsSpeaking(false);
      return;
    }
    
    // 朗读时过滤掉 HTML 标签，防止朗读出图片代码
    const rawText = currentDisplayParagraphs.join(' ');
    const pageText = rawText.replace(/<[^>]+>/g, ''); 
    
    if (pageText.trim()) {
      const utterance = new SpeechSynthesisUtterance(pageText);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    return () => synth.cancel();
  }, [synth]);

  const novel = getNovelById(id || '');
  const paragraphsPerPage = 50; 
  
  const allParagraphs = useMemo(() => {
    if (!novel?.content) return [];
    // 兼容 Tiptap 生成的 HTML 段落和普通纯文本换行
    if (novel.content.includes('</p>')) {
      return novel.content.split('</p>').filter((p: string) => p.trim() !== "").map(p => p + '</p>');
    }
    return novel.content.split('\n').filter((p: string) => p.trim() !== "");
  }, [novel?.content]);

  const totalPages = Math.ceil(allParagraphs.length / paragraphsPerPage);
  
  const currentDisplayParagraphs = useMemo(() => {
    return allParagraphs.slice(currentPage * paragraphsPerPage, (currentPage + 1) * paragraphsPerPage);
  }, [allParagraphs, currentPage, paragraphsPerPage]);

  const totalLikes = (novel?.stats?.likes || 0) + (novel?.likes || 0);

  const formatDate = (dateStr: any) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const changePage = useCallback((newPage: number) => {
    if (newPage < 0 || newPage >= totalPages) return;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    const startTime = performance.now();
    const startScroll = window.scrollY;
    const duration = 150; 
    
    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startScroll * (1 - easeOutCubic));
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animateScroll);
      } else {
        setCurrentPage(newPage);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animateScroll);
  }, [totalPages]);

  // 键盘快捷键 (全逻辑保留)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space' && !(e.target instanceof HTMLButtonElement)) e.preventDefault();
      
      switch(e.code) {
        case 'ArrowLeft': case 'KeyA': changePage(currentPage - 1); break;
        case 'ArrowRight': case 'KeyD': case 'Space': case 'KeyJ': changePage(currentPage + 1); break;
        case 'KeyK': changePage(currentPage - 1); break;
        case 'Home': changePage(0); break;
        case 'End': changePage(totalPages - 1); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, changePage, totalPages]);

  // 触摸手势 (全逻辑保留)
  useEffect(() => {
    let touchStartX = 0; let touchStartY = 0; let touchStartTime = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const timeDiff = Date.now() - touchStartTime;
      const diffX = touchStartX - touchEndX;
      const diffY = touchStartY - touchEndY;
      if (timeDiff < 300 && Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > window.innerWidth * 0.1) changePage(currentPage + 1);
        else if (diffX < -window.innerWidth * 0.1) changePage(currentPage - 1);
      }
      touchStartX = 0;
    };
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [currentPage, changePage]);

  // 视口高度适配
  useEffect(() => {
    const updateVH = () => document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    updateVH();
    window.addEventListener('resize', updateVH);
    window.addEventListener('orientationchange', updateVH);
    return () => {
      window.removeEventListener('resize', updateVH);
      window.removeEventListener('orientationchange', updateVH);
    };
  }, []);

  if (isLoading) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-[#f6f1e7]'}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-stone-500">翻开书卷...</p>
      </div>
    </div>
  );
  
  if (!novel) return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-[#f6f1e7]'}`}>
      <div className="text-center">
        <p className="text-xl mb-4">📖</p>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>暂无内容</p>
        <button onClick={() => navigate('/novels')} className="mt-4 px-6 py-2 bg-stone-900 text-white rounded-lg">返回书库</button>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen relative flex items-center justify-center p-6 overflow-hidden ${isDarkMode ? 'bg-zinc-950' : 'bg-[#f6f1e7]'}`}>
        <div className="text-center z-10">
           <Lock size={48} className="mx-auto mb-4 text-stone-400" />
           <h2 className="text-2xl font-bold mb-4">需登录解锁内容</h2>
           <button onClick={() => navigate('/login')} className="px-8 py-3 bg-stone-900 text-white rounded-full">立即登录</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen ${isDarkMode ? 'bg-zinc-900 text-gray-300' : 'bg-[#f6f1e7] text-gray-800'}`}
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      <header className={`sticky top-0 z-50 border-b ${isDarkMode ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-stone-200'} backdrop-blur-lg`}>
        <div className="max-w-4xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/novels')} className="p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"><ChevronLeft size={20} /></button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-stone-100 dark:hover:bg-zinc-800 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">{isMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
          
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-900 border-b p-4 space-y-4 md:hidden z-50 shadow-xl">
              <div className="flex items-center justify-between">
                <span>字体大小</span>
                <div className="flex gap-2">
                  <button onClick={() => setFontSize(f => Math.max(16, f - 2))} className="p-2 bg-stone-100 dark:bg-zinc-800 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center">A-</button>
                  <span className="px-3 flex items-center">{fontSize}px</span>
                  <button onClick={() => setFontSize(f => Math.min(28, f + 2))} className="p-2 bg-stone-100 dark:bg-zinc-800 rounded-lg min-h-[36px] min-w-[36px] flex items-center justify-center">A+</button>
                </div>
              </div>
              <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center justify-between w-full p-3 rounded-lg bg-stone-50 dark:bg-zinc-800 min-h-[44px]">
                <span>深色模式</span>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={toggleSpeech} className="flex items-center justify-between w-full p-3 rounded-lg bg-stone-50 dark:bg-zinc-800 min-h-[44px]">
                <span>语音朗读</span>{isSpeaking ? <Pause size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2">
            <button onClick={toggleSpeech} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all min-h-[36px] ${isSpeaking ? 'bg-stone-900 text-white' : 'bg-white/50 border-stone-300 text-stone-500 hover:text-stone-900'}`}>
              {isSpeaking ? <Pause size={14} /> : <Volume2 size={14} />}<span className="text-[11px] font-black">{isSpeaking ? '停止' : '朗读'}</span>
            </button>
            <button onClick={() => handleLike?.(novel.id, totalLikes, 'novels')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all min-h-[36px] ${totalLikes > 0 ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white/50 border-stone-300'}`}>
              <Heart size={14} className={totalLikes > 0 ? 'fill-current' : ''} /><span className="text-[11px] font-black">{totalLikes}</span>
            </button>
            <div className="w-px h-4 bg-stone-300 dark:bg-zinc-700 mx-1" />
            <button onClick={() => setFontSize(f => (f >= 28 ? 16 : f + 2))} className="p-2 text-stone-400 hover:text-stone-900"><Type size={16} /></button>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 text-stone-400 hover:text-stone-900">{isDarkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
          </div>
        </div>
      </header>

      {/* 移动端点击边缘翻页 */}
      <div className="fixed inset-0 pointer-events-none z-20 md:hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/4" onClick={() => changePage(currentPage - 1)} style={{ pointerEvents: 'auto' }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/4" onClick={() => changePage(currentPage + 1)} style={{ pointerEvents: 'auto' }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 md:px-6 py-6 md:py-12 relative">
        <header className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-serif font-black mb-3 leading-tight">{novel.title}</h1>
          <p className="text-[10px] text-stone-500 dark:text-gray-500 font-bold tracking-[0.2em] uppercase">第 {currentPage + 1} / {totalPages} 回 | 刊印：{formatDate(novel.created_at)}</p>
        </header>

        <div className="mb-8 px-4">
          <div className="h-1 bg-stone-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-stone-900 dark:bg-blue-600 transition-all duration-300" style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }} />
          </div>
        </div>

        <article ref={contentRef} className="min-h-[50vh] leading-relaxed font-serif text-justify px-4">
          {currentDisplayParagraphs.map((p, i) => (
            <Paragraph key={`${currentPage}-${i}`} text={p} fontSize={fontSize} />
          ))}
          {currentPage === totalPages - 1 && (
            <div className="text-center py-12 text-stone-400"><BookOpen size={24} className="inline-block mb-4" /><p className="text-sm">本章节已结束</p></div>
          )}
        </article>

        <div className="mt-12 flex items-center justify-between border-t border-stone-300/20 pt-8 px-4">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 0} className="flex items-center gap-2 px-6 py-3 border border-stone-300 rounded-xl font-bold disabled:opacity-20 hover:bg-white min-h-[44px] min-w-[100px] justify-center"><ChevronLeft size={16} /><span>上一回</span></button>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-xl font-bold shadow-xl hover:bg-blue-900 disabled:opacity-20 min-h-[44px] min-w-[100px] justify-center"><span>下一回</span><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* 底部导航栏（移动端） */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-900/90 border-t backdrop-blur-lg py-2 px-4 z-30">
        <div className="flex items-center justify-between">
          <button onClick={() => setFontSize(f => Math.max(16, f - 2))} className="p-3"><Type size={20} /></button>
          <div className="flex items-center gap-4">
            <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 0} className="p-3 disabled:opacity-20"><ChevronLeft size={20} /></button>
            <div className="text-center"><div className="text-sm font-semibold">{currentPage + 1}</div></div>
            <button onClick={() => changePage(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="p-3 disabled:opacity-20"><ChevronRight size={20} /></button>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3">{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
        </div>
      </div>
      
      {/* 补充：全局样式限制 */}
      <style>{`
        .rich-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block;
          margin: 20px auto;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        /* 彻底防止 body 产生横向滚动条 */
        body, #root {
          max-width: 100vw;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}