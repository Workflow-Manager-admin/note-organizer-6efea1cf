# Notes Organizer – React Minimal Frontend

A modern, minimal web UI for creating, editing, deleting, viewing, and searching notes.

## Features

- **Create New Notes:** Add notes instantly with title and markdown/text.
- **Edit Existing Notes:** Update title and body, with instant save.
- **Delete Notes:** Remove notes with one click (with confirmation).
- **View Note List:** Sidebar navigation for all your notes.
- **Search Notes:** Real-time, case-insensitive search by title/content.
- **Responsive:** Fully usable on mobile, tablet, and desktop.
- **Floating Action Button:** Start a new note from anywhere.
- **Minimal Local Storage:** All notes are saved to your browser.
- **Modern Styling:** Minimal, light-themed, and keyboard accessible.

## Layout

- **Header:** App title and search box (top).
- **Main:** 
    - *Left sidebar*: List of notes.
    - *Right panel*: Note editor/details for selected note.
- **Floating "+" button:** Always visible, creates a new note.
- **Footer:** App copyright.

## Color Palette

- **Primary:** #1976d2
- **Secondary:** #9c27b0
- **Accent:** #ff9800
- Colors are set as CSS variables in `src/App.css`.

## Technical

- Written with React and vanilla CSS, no heavy dependencies.
- Uses environment variables via `.env` (e.g., to set an API endpoint).  
  Example: Add `REACT_APP_API_BASE_URL=https://your-api-host.com` to `.env`.
- All note data is currently stored in browser `localStorage` for demo/dev (change to API easily).

## To Run

```sh
npm install
npm start
```
App runs at http://localhost:3000.

## Customization

- Change colors in `src/App.css`
- Change initial note data structure or backend integration in `src/App.js`

## Accessibility

All controls have ARIA labels and are keyboard-accessible.

## License

MIT
