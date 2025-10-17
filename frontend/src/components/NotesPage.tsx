import { useState, useEffect } from 'react'
import { 
  FolderPlus, 
  FilePlus, 
  Upload, 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FileText,
  Trash2,
  Save,
  Eye,
  Code,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  Quote
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useAuthStore } from '../store/authStore'

interface TreeNode {
  id: number
  title: string
  type: 'FILE' | 'FOLDER'
  fileType: 'MARKDOWN' | 'PDF' | 'NONE'
  folderPath: string | null
  children: TreeNode[]
}

interface NotesPageProps {
  category: 'schule' | 'arbeit' | 'privat'
}

export default function NotesPage({ category }: NotesPageProps) {
  const token = useAuthStore((state) => state.token)
  const [tree, setTree] = useState<TreeNode[]>([])
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [content, setContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [expandedFolders, setExpandedFolders] = useState<Set<number>>(new Set())
  const [showNewFolderModal, setShowNewFolderModal] = useState(false)
  const [showNewNoteModal, setShowNewNoteModal] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [parentFolder, setParentFolder] = useState<TreeNode | null>(null)

  // Lade Ordnerstruktur
  useEffect(() => {
    loadTree()
  }, [category])

  const loadTree = async () => {
    try {
      const response = await fetch(`/api/notes/folders/tree?category=${category}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setTree(data)
    } catch (error) {
      console.error('Fehler beim Laden der Ordnerstruktur:', error)
    }
  }

  // Ordner erstellen
  const createFolder = async () => {
    if (!newItemName.trim()) return

    try {
      const response = await fetch('/api/notes/folders/create-folder', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newItemName,
          category: category,
          parentId: parentFolder?.id,
          folderPath: parentFolder?.folderPath
        })
      })

      if (response.ok) {
        setNewItemName('')
        setShowNewFolderModal(false)
        setParentFolder(null)
        loadTree()
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Ordners:', error)
    }
  }

  // Neue Notiz erstellen
  const createNote = async () => {
    if (!newItemName.trim()) return

    try {
      const response = await fetch('/api/notes/folders/create-note', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: newItemName,
          category: category,
          content: '# ' + newItemName + '\n\nBeginne hier mit deiner Notiz...',
          parentId: parentFolder?.id,
          folderPath: parentFolder?.folderPath
        })
      })

      if (response.ok) {
        const newNote = await response.json()
        setNewItemName('')
        setShowNewNoteModal(false)
        setParentFolder(null)
        loadTree()
        setSelectedNode(newNote)
        setContent(newNote.content)
      }
    } catch (error) {
      console.error('Fehler beim Erstellen der Notiz:', error)
    }
  }

  // Notiz laden
  const loadNote = async (node: TreeNode) => {
    if (node.type === 'FOLDER') return

    try {
      const response = await fetch(`/api/notes/${node.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      setSelectedNode(node)
      setContent(data.content || '')
    } catch (error) {
      console.error('Fehler beim Laden der Notiz:', error)
    }
  }

  // Notiz speichern
  const saveNote = async () => {
    if (!selectedNode || selectedNode.type === 'FOLDER') return

    try {
      const response = await fetch(`/api/notes/folders/update-note/${selectedNode.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        alert('Gespeichert!')
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error)
    }
  }

  // PDF hochladen
  const uploadPdf = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    if (parentFolder) {
      formData.append('parentId', parentFolder.id.toString())
      if (parentFolder.folderPath) {
        formData.append('folderPath', parentFolder.folderPath)
      }
    }

    try {
      const response = await fetch('/api/notes/folders/upload-pdf', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        loadTree()
      }
    } catch (error) {
      console.error('Fehler beim PDF-Upload:', error)
    }
  }

  // Element löschen
  const deleteItem = async (node: TreeNode) => {
    if (!window.confirm(`"${node.title}" wirklich löschen?`)) return

    try {
      const response = await fetch(`/api/notes/folders/${node.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        loadTree()
        if (selectedNode?.id === node.id) {
          setSelectedNode(null)
          setContent('')
        }
      }
    } catch (error) {
      console.error('Fehler beim Löschen:', error)
    }
  }

  // Ordner toggle
  const toggleFolder = (id: number) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFolders(newExpanded)
  }

  // Markdown formatieren
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newText)
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  // Render Baum
  const renderTree = (nodes: TreeNode[], level: number = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div
          className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
            selectedNode?.id === node.id ? 'bg-primary-100 dark:bg-primary-900/30' : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
        >
          {node.type === 'FOLDER' ? (
            <>
              <button
                onClick={() => toggleFolder(node.id)}
                className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                {expandedFolders.has(node.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
              <Folder size={16} className="text-yellow-500" />
              <span onClick={() => setSelectedNode(node)} className="flex-1">{node.title}</span>
            </>
          ) : (
            <>
              <div className="w-5" /> {/* Spacer */}
              {node.fileType === 'PDF' ? (
                <File size={16} className="text-red-500" />
              ) : (
                <FileText size={16} className="text-blue-500" />
              )}
              <span onClick={() => loadNote(node)} className="flex-1">{node.title}</span>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              deleteItem(node)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600"
            title="Löschen"
          >
            <Trash2 size={14} />
          </button>
        </div>
        {node.type === 'FOLDER' && expandedFolders.has(node.id) && node.children && (
          <div>{renderTree(node.children, level + 1)}</div>
        )}
      </div>
    ))
  }

  return (
    <div className="flex h-[calc(100vh-200px)] gap-4">
      {/* Linker Bereich: Ordnerbaum */}
      <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">
            {category === 'schule' ? '📚 Schule' : category === 'arbeit' ? '💼 Arbeit' : '🏠 Privat'}
          </h2>
        </div>

        {/* Aktionsbuttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setParentFolder(selectedNode?.type === 'FOLDER' ? selectedNode : null)
              setShowNewFolderModal(true)
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm"
            title="Neuer Ordner"
          >
            <FolderPlus size={16} />
            <span>Ordner</span>
          </button>
          <button
            onClick={() => {
              setParentFolder(selectedNode?.type === 'FOLDER' ? selectedNode : null)
              setShowNewNoteModal(true)
            }}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
            title="Neue Notiz"
          >
            <FilePlus size={16} />
            <span>Notiz</span>
          </button>
          <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm cursor-pointer"
            title="PDF hochladen">
            <Upload size={16} />
            <span>PDF</span>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) uploadPdf(file)
              }}
            />
          </label>
        </div>

        {/* Ordnerbaum */}
        <div className="flex-1 overflow-y-auto space-y-1">
          {renderTree(tree)}
          {tree.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <Folder className="mx-auto mb-2" size={48} />
              <p className="text-sm">Noch keine Notizen</p>
              <p className="text-xs mt-1">Erstelle einen Ordner oder eine Notiz</p>
            </div>
          )}
        </div>
      </div>

      {/* Rechter Bereich: Editor/Viewer */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col">
        {selectedNode && selectedNode.type === 'FILE' && selectedNode.fileType === 'MARKDOWN' ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => insertMarkdown('**', '**')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Fett (Ctrl+B)"
                >
                  <Bold size={18} />
                </button>
                <button
                  onClick={() => insertMarkdown('*', '*')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Kursiv (Ctrl+I)"
                >
                  <Italic size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                  onClick={() => insertMarkdown('# ', '')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Überschrift 1"
                >
                  <Heading1 size={18} />
                </button>
                <button
                  onClick={() => insertMarkdown('## ', '')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Überschrift 2"
                >
                  <Heading2 size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                  onClick={() => insertMarkdown('- ', '')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Liste"
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => insertMarkdown('1. ', '')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Nummerierte Liste"
                >
                  <ListOrdered size={18} />
                </button>
                <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
                <button
                  onClick={() => insertMarkdown('[Text](', ')')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Link"
                >
                  <LinkIcon size={18} />
                </button>
                <button
                  onClick={() => insertMarkdown('![Alt](', ')')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Bild"
                >
                  <ImageIcon size={18} />
                </button>
                <button
                  onClick={() => insertMarkdown('> ', '')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Zitat"
                >
                  <Quote size={18} />
                </button>
                <button
                  onClick={() => insertMarkdown('```\n', '\n```')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  title="Code-Block"
                >
                  <Code size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-1.5 rounded flex items-center gap-2 ${
                    showPreview ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                >
                  <Eye size={16} />
                  <span className="text-sm">Vorschau</span>
                </button>
                <button
                  onClick={saveNote}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-2"
                >
                  <Save size={16} />
                  <span className="text-sm">Speichern</span>
                </button>
              </div>
            </div>

            {/* Editor/Preview */}
            <div className="flex-1 overflow-hidden">
              {showPreview ? (
                <div className="h-full overflow-y-auto p-6 prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '')
                        const isInline = !match
                        return isInline ? (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        ) : (
                          <pre className={className}>
                            <code {...props}>{children}</code>
                          </pre>
                        )
                      }
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-6 bg-transparent resize-none focus:outline-none font-mono text-sm"
                  placeholder="Beginne mit dem Schreiben..."
                />
              )}
            </div>
          </>
        ) : selectedNode && selectedNode.fileType === 'PDF' ? (
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`/api/notes/folders/pdf/${selectedNode.id}`}
              className="w-full h-full"
              title={selectedNode.title}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <FileText className="mx-auto mb-4" size={64} />
              <p className="text-lg">Wähle eine Notiz zum Bearbeiten</p>
              <p className="text-sm mt-2">Oder erstelle eine neue Notiz</p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Neuer Ordner</h2>
            {parentFolder && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                In: {parentFolder.title}
              </p>
            )}
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createFolder()}
              placeholder="Ordnername..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewFolderModal(false)
                  setNewItemName('')
                  setParentFolder(null)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                Abbrechen
              </button>
              <button
                onClick={createFolder}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Neue Notiz</h2>
            {parentFolder && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                In: {parentFolder.title}
              </p>
            )}
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && createNote()}
              placeholder="Notizname..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowNewNoteModal(false)
                  setNewItemName('')
                  setParentFolder(null)
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                Abbrechen
              </button>
              <button
                onClick={createNote}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg"
              >
                Erstellen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
