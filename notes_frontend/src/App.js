import React, { useEffect, useState } from "react";
import "./App.css";

// Environment variables usage example
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const THEME_COLORS = {
  accent: "#ff9800",
  primary: "#1976d2",
  secondary: "#9c27b0",
};

//
// COMPONENTS
//

// Header with app title and (optional) search
function AppHeader({ searchTerm, onSearchChange }) {
  return (
    <header className="notes-header">
      <h1 className="notes-title">Notes</h1>
      <input
        className="notes-search"
        type="text"
        value={searchTerm}
        placeholder="Search notes..."
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search notes"
      />
    </header>
  );
}

// List of notes in sidebar
function NoteList({ notes, selectedId, onSelect, onDelete }) {
  return (
    <aside className="notes-list">
      {notes.length === 0 ? (
        <div className="notes-list-empty">No notes.</div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={
              "notes-list-item" +
              (selectedId === note.id ? " notes-list-item-selected" : "")
            }
            onClick={() => onSelect(note.id)}
            tabIndex={0}
            aria-label={`Note: ${note.title}`}
          >
            <div className="notes-list-item-title">{note.title || "Untitled"}</div>
            <button
              className="notes-list-item-delete"
              title="Delete note"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              aria-label="Delete note"
            >
              &times;
            </button>
          </div>
        ))
      )}
    </aside>
  );
}

// Note editor/details panel
function NoteEditor({ note, onEdit, onSave, onDelete, isNew, hasChanged }) {
  // If note prop is null, display empty state
  if (!note) {
    return (
      <section className="notes-editor-empty">
        <span>No note selected</span>
      </section>
    );
  }

  return (
    <section className="notes-editor">
      <input
        className="notes-editor-title"
        type="text"
        placeholder="Note title"
        value={note.title}
        onChange={(e) => onEdit({ ...note, title: e.target.value })}
        aria-label="Note title"
      />

      <textarea
        className="notes-editor-body"
        placeholder="Start writing..."
        value={note.body}
        onChange={(e) => onEdit({ ...note, body: e.target.value })}
        aria-label="Note content"
        rows={12}
      />

      <div className="notes-editor-actions">
        <button
          className="notes-btn notes-btn-primary"
          onClick={onSave}
          disabled={!hasChanged}
          aria-label="Save"
        >
          {isNew ? "Create" : "Save"}
        </button>
        {!isNew && (
          <button
            className="notes-btn notes-btn-secondary"
            onClick={() => onDelete(note.id)}
            aria-label="Delete"
          >
            Delete
          </button>
        )}
      </div>
    </section>
  );
}

// Floating "New Note" Button (FAB)
function FloatingNewNoteButton({ onClick }) {
  return (
    <button
      className="notes-floating-btn"
      onClick={onClick}
      title="New Note"
      aria-label="New Note"
    >
      +
    </button>
  );
}

//
// MAIN APP COMPONENT
//

// PUBLIC_INTERFACE
function App() {
  // App state
  const [notes, setNotes] = useState([]); // [{id, title, body}]
  const [selectedId, setSelectedId] = useState(null); // id of selected note
  const [searchTerm, setSearchTerm] = useState("");
  const [editingNote, setEditingNote] = useState(null); // note being edited/created
  const [hasChanged, setHasChanged] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Load notes from localStorage (demo purpose; replace with API if desired)
  useEffect(() => {
    const saved = window.localStorage.getItem("notes");
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch {
        setNotes([]);
      }
    }
  }, []);

  // Persist notes to localStorage
  useEffect(() => {
    window.localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Handle selecting a note
  const handleSelectNote = (id) => {
    setSelectedId(id);
    const note = notes.find((n) => n.id === id);
    // Clone note to editing field
    setEditingNote(note ? { ...note } : null);
    setIsCreating(false);
    setHasChanged(false);
  };

  // Start creating a new note
  const handleCreateNew = () => {
    const blank = {
      id: generateId(),
      title: "",
      body: "",
      created: Date.now(),
      updated: Date.now(),
    };
    setEditingNote(blank);
    setIsCreating(true);
    setSelectedId(null);
    setHasChanged(true);
  };

  // CRUD: Save or update note
  const handleSaveNote = () => {
    if (!editingNote) return;
    let updatedList;

    if (isCreating) {
      updatedList = [
        { ...editingNote, created: Date.now(), updated: Date.now() },
        ...notes,
      ];
      setNotes(updatedList);
    } else {
      updatedList = notes.map((n) =>
        n.id === editingNote.id
          ? { ...editingNote, updated: Date.now() }
          : n
      );
      setNotes(updatedList);
    }
    setIsCreating(false);
    setSelectedId(editingNote.id);
    setHasChanged(false);
  };

  // CRUD: Delete note
  const handleDeleteNote = (id) => {
    const updatedList = notes.filter((n) => n.id !== id);
    setNotes(updatedList);
    if (selectedId === id) {
      setEditingNote(null);
      setSelectedId(null);
    }
    setIsCreating(false);
    setHasChanged(false);
  };

  // Handle field edit
  const handleEditNote = (note) => {
    setEditingNote(note);
    setHasChanged(true);
  };

  // Search filter
  const filteredNotes = searchTerm
    ? notes.filter(
        (n) =>
          (n.title && n.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (n.body && n.body.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : notes;

  // Helper: Get currently displayed note for editor
  const displayedNote = isCreating
    ? editingNote
    : notes.find((n) => n.id === selectedId) || null;

  // FAB always shown
  // PUBLIC_INTERFACE
  return (
    <div className="notes-app" style={{
      "--color-accent": THEME_COLORS.accent,
      "--color-primary": THEME_COLORS.primary,
      "--color-secondary": THEME_COLORS.secondary,
    }}>
      <AppHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <main className="notes-main">
        <NoteList
          notes={filteredNotes}
          selectedId={selectedId}
          onSelect={handleSelectNote}
          onDelete={handleDeleteNote}
        />
        <NoteEditor
          note={editingNote}
          onEdit={handleEditNote}
          onSave={handleSaveNote}
          onDelete={handleDeleteNote}
          isNew={isCreating}
          hasChanged={hasChanged}
        />
      </main>
      <FloatingNewNoteButton onClick={handleCreateNew} />
      <Footer />
    </div>
  );
}

// Simple id generator
function generateId() {
  // Not for secure/production use
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Footer
function Footer() {
  return (
    <footer className="notes-footer">
      <span>
        &copy; {new Date().getFullYear()} Note Organizer. Modern & minimal design.
      </span>
    </footer>
  );
}

export default App;
