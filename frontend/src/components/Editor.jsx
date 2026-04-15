import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Save, Trash2, CheckCircle2, FileText } from 'lucide-react';
import debounce from 'lodash.debounce';

const Editor = ({
  activeNote,
  onUpdateNote,
  onDeleteNote,
  theme
}) => {
  const [localTitle, setLocalTitle] = useState('');
  const [localContent, setLocalContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Sync local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setLocalTitle(activeNote.title || '');
      setLocalContent(activeNote.content || '');
      setLastSaved(new Date());
    } else {
      setLocalTitle('');
      setLocalContent('');
    }
  }, [activeNote?.id]); // Only re-sync when the ID changes to prevent wiping unsaved changes on auto-save updates

  // Debounced auto-save function
  const debouncedSave = useCallback(
    debounce(async (id, title, content) => {
      setIsSaving(true);
      await onUpdateNote(id, title, content);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 1000),
    [onUpdateNote]
  );

  // Trigger auto-save on content/title change
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setLocalContent(newContent);
    if (activeNote) {
      debouncedSave(activeNote.id, localTitle, newContent);
    }
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLocalTitle(newTitle);
    if (activeNote) {
      debouncedSave(activeNote.id, newTitle, localContent);
    }
  };

  // Immediate save for "Save" button (optional but good UX)
  const handleManualSave = async () => {
    if (!activeNote) return;
    debouncedSave.cancel(); // Cancel any pending debounced saves
    setIsSaving(true);
    await onUpdateNote(activeNote.id, localTitle, localContent);
    setIsSaving(false);
    setLastSaved(new Date());
  };

  if (!activeNote) {
    return (
      <div className="workspace">
        <div className="empty-state">
          <FileText size={48} opacity={0.2} />
          <h2>Select a note or create a new one</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="workspace">
      <div className="workspace-header">
        <input
          type="text"
          className="workspace-title-input"
          placeholder="Note Title"
          value={localTitle}
          onChange={handleTitleChange}
        />
        <div className="workspace-actions">
          {lastSaved && (
             <div className="status-indicator">
               {isSaving ? (
                 <span style={{color: 'var(--accent-color)'}}>Saving...</span>
               ) : (
                 <>
                    <CheckCircle2 size={14} color="var(--accent-color)" />
                    Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                 </>
               )}
             </div>
          )}
          <button className="delete-btn" onClick={() => onDeleteNote(activeNote.id)} title="Delete Note">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="split-container">
        <div className="editor-pane">
          <div className="pane-header">Markdown Editor</div>
          <textarea
            className="editor-textarea"
            placeholder="Start writing..."
            value={localContent}
            onChange={handleContentChange}
            spellCheck="false"
          />
        </div>
        <div className="preview-pane">
          <div className="pane-header">Live Preview</div>
          <div className="markdown-preview">
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      style={theme === 'dark' ? vscDarkPlus : vs}
                      language={match[1]}
                      PreTag="div"
                    />
                  ) : (
                    <code {...props} className={className}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {localContent || '*Nothing to preview.*'}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
