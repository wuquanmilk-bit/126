import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  Loader2, Clock, AlertCircle, BookOpen, Globe, Lock, 
  ImageIcon, Send, Upload, Bold, Heading1, 
  Heading2, List, X, ChevronLeft
} from 'lucide-react';

// --- Tiptap 核心引入 ---
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';

function WritePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  // 状态管理
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("fantasy");
  const [tags] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const categories = [
    { id: "fantasy", name: "玄幻奇幻", icon: "⚔️" },
    { id: "urban", name: "都市生活", icon: "🏙️" },
    { id: "romance", name: "现代言情", icon: "❤️" },
    { id: "scifi", name: "科幻未来", icon: "🚀" },
    { id: "historical", name: "历史军事", icon: "🏰" },
  ];

  // --- 1. 图片上传逻辑 (Supabase Storage) ---
  const uploadFile = async (file: File) => {
    if (!user) throw new Error('请先登录');
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, file);
      
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return data.publicUrl;
  };

  // --- 2. Tiptap 编辑器配置 (支持粘贴图片) ---
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: { class: 'rounded-xl shadow-lg max-w-full my-6 mx-auto border' },
      }),
      Placeholder.configure({
        placeholder: '在此处开始你的创作，支持直接粘贴图片 (Ctrl+V)...',
      }),
    ],
    content: '',
    editorProps: {
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (const item of items) {
            if (item.type.indexOf('image') === 0) {
              const file = item.getAsFile();
              if (file) {
                setUploading(true);
                uploadFile(file).then(url => {
                  view.dispatch(
                    view.state.tr.replaceSelectionWith(view.state.schema.nodes.image.create({ src: url }))
                  );
                }).catch(err => alert("粘贴失败: " + err.message))
                  .finally(() => setUploading(false));
                return true;
              }
            }
          }
        }
        return false;
      },
    },
  });

  // --- 3. 自动保存草稿至本地 ---
  useEffect(() => {
    if (!editor || isEditMode || editId) return;

    const saveDraft = () => {
      const content = editor.getHTML();
      if (title.trim() || (content && content !== '<p></p>')) {
        const draftData = {
          title,
          description,
          category,
          content,
          coverUrl,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem('novel_write_draft', JSON.stringify(draftData));
        setLastSaved(new Date());
      }
    };

    const timer = setInterval(saveDraft, 20000); 
    return () => clearInterval(timer);
  }, [editor, title, description, category, coverUrl, isEditMode, editId]);

  // --- 4. 初始化加载 (编辑模式或恢复草稿) ---
  useEffect(() => {
    if (!user || !editor) return;
    
    const initContent = async () => {
      if (editId) {
        setLoading(true);
        try {
          const { data, error: fetchErr } = await supabase
            .from('novels')
            .select('*')
            .eq('id', editId)
            .single();
          if (fetchErr) throw fetchErr;
          if (data) {
            setTitle(data.title);
            setDescription(data.description || "");
            setCategory(data.category || "fantasy");
            setCoverUrl(data.cover || "");
            setIsPublic(data.is_public !== false);
            editor.commands.setContent(data.content || "");
            setIsEditMode(true);
          }
        } catch (err: any) {
          setError("加载失败: " + err.message);
        } finally {
          setLoading(false);
        }
      } else {
        const savedDraft = localStorage.getItem('novel_write_draft');
        if (savedDraft) {
          const data = JSON.parse(savedDraft);
          setTitle(data.title || "");
          setDescription(data.description || "");
          setCategory(data.category || "fantasy");
          setCoverUrl(data.coverUrl || "");
          editor.commands.setContent(data.content || "");
        }
      }
    };
    initContent();
  }, [editId, user, editor]);

  // --- 5. 提交逻辑 ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !editor) return;
    if (!title.trim()) return alert("请输入标题");

    setLoading(true);
    setError("");

    try {
      const finalData: any = {
        title: title.trim(),
        description: description.trim(),
        content: editor.getHTML(),
        category: category,
        tags: tags,
        cover: coverUrl || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
        is_public: isPublic,
        user_id: user.id,
        author: {
          id: user.id,
          name: user.email?.split('@')[0] || '书友',
          avatar_url: user.user_metadata?.avatar_url || ''
        },
        stats: { likes: 0, views: 0, chapters: 1 },
        word_count: editor.getText().length,
        updated_at: new Date().toISOString(),
      };

      if (isEditMode) {
        const { error: updateErr } = await supabase.from('novels').update(finalData).eq('id', editId);
        if (updateErr) throw updateErr;
        alert("更新成功！");
      } else {
        const { data: newDoc, error: insertErr } = await supabase.from('novels').insert([{ ...finalData, created_at: new Date().toISOString() }]).select().single();
        if (insertErr) throw insertErr;
        localStorage.removeItem('novel_write_draft');
        navigate(`/novel/${newDoc.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
              <ChevronLeft size={20} /> <span className="ml-1 font-medium">返回</span>
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            {/* 草稿箱按钮：跳转至 MyDrafts */}
            <button 
              onClick={() => navigate('/MyDrafts')} 
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
              <BookOpen size={18} />
              <span className="font-bold text-sm">我的草稿</span>
            </button>
            {lastSaved && !isEditMode && (
              <span className="hidden md:flex items-center gap-1 text-[10px] text-green-500 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                <Clock size={10} /> 自动保存 {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={loading || uploading} 
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-2 rounded-full font-bold hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin"/> : <Send size={18}/>}
            {isEditMode ? '更新文章' : '立即发布'}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2"><AlertCircle size={20}/>{error}</div>}

        <div className="space-y-6">
          {/* 标题 & 简介 */}
          <div className="bg-white rounded-3xl shadow-sm border p-8">
             <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入标题..."
              className="w-full text-4xl font-black focus:outline-none mb-6 border-b border-gray-100 pb-4"
            />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">简介</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="介绍故事..."
                  rows={4}
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-500 mb-2 uppercase">封面</label>
                <div className="h-32 bg-gray-50 rounded-2xl border-2 border-dashed flex items-center justify-center relative overflow-hidden">
                  {coverUrl ? (
                    <img src={coverUrl} className="w-full h-full object-cover" alt="封面" />
                  ) : (
                    <label className="cursor-pointer text-center">
                      <Upload className="mx-auto text-gray-400" size={24}/>
                      <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) setCoverUrl(await uploadFile(file));
                      }} />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 编辑器 */}
          <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
            {editor && (
              <div className="bg-gray-50/50 border-b p-3 flex gap-2 sticky top-16 z-20 backdrop-blur-md">
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} icon={<Bold size={20}/>} />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} icon={<Heading1 size={20}/>} />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} icon={<Heading2 size={20}/>} />
                <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} icon={<List size={20}/>} />
                <label className="p-2 cursor-pointer hover:bg-white rounded-xl transition">
                  <ImageIcon size={20}/>
                  <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploading(true);
                      const url = await uploadFile(file);
                      editor.chain().focus().setImage({ src: url }).run();
                      setUploading(false);
                    }
                  }} />
                </label>
              </div>
            )}
            <div className="p-8 min-h-[600px] prose prose-blue max-w-none">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* 分类 & 权限 */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border">
              <label className="block text-sm font-bold text-gray-500 mb-4 uppercase">选择分类</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button key={cat.id} type="button" onClick={() => setCategory(cat.id)} className={`px-4 py-2 rounded-xl border-2 transition-all ${category === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-100'}`}>
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border">
              <label className="block text-sm font-bold text-gray-500 mb-4 uppercase">发布权限</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsPublic(true)} className={`flex-1 p-3 rounded-2xl border-2 flex items-center justify-center gap-2 ${isPublic ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-100 text-gray-400'}`}>
                  <Globe size={18}/> 公开
                </button>
                <button type="button" onClick={() => setIsPublic(false)} className={`flex-1 p-3 rounded-2xl border-2 flex items-center justify-center gap-2 ${!isPublic ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-100 text-gray-400'}`}>
                  <Lock size={18}/> 私密
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ProseMirror { min-height: 550px; outline: none; }
        .prose img { border-radius: 1rem; max-width: 100%; height: auto; display: block; margin: 2rem auto; }
        .prose p { line-height: 1.8; word-wrap: break-word; overflow-wrap: break-word; }
      `}</style>
    </div>
  );
}

const ToolbarBtn = ({ onClick, active, icon }: { onClick: () => void, active: boolean, icon: React.ReactNode }) => (
  <button type="button" onClick={onClick} className={`p-2.5 rounded-xl ${active ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{icon}</button>
);

export default WritePage;