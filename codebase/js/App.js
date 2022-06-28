// App.js
// All front-end UI functionalities go here.

import NotesView from "./NotesView.js";                                      
import NotesAPI from "./NotesAPI.js";

// import temp from "./temp.js";

export default class App {
    constructor(root) {
        this.notes = [];
        this.activeNote = null;
        this.view = new NotesView(root, this._handlers());
        this._refreshNotes();
    }

    _refreshNotes() {
        const notes = NotesAPI.getAllNotes();
        this._setNotes(notes);
        if (notes.length > 0) {
            this._setActiveNote(notes[0]);
        }
    }

    _setNotes(notes) {
        this.notes = notes;
        this.view.updateNoteList(notes);
        this.view.updateNotePreviewVisibility(notes.length > 0);
    }

    _setActiveNote(note) {
        this.activeNote = note;
        this.view.updateActiveNote(note);
    }

    // ▼
    _refreshMatchedNotes(matchedNotes) {
    // consumes a list of notes id and shows all corresponding note objects.
    // copy off of getAllNotes()
        //  Using {._setNotes} to {this.notes = notes} is only for {onNoteSelect},
        // it doesn't actually rewrite {localStorage} module with {matchedNotes}.
        //  This rewrite happens when the user clicks into any x ∈ matchedNotes, activating
        // [inpTitle, inpBody]'s event listener for "blur", and clicks outside the title/body area,
        // triggering the event listener to rewrite the activeNote in localStorage.
        this._setNotes(matchedNotes);
        if (matchedNotes.length > 0) {
            this._setActiveNote(matchedNotes[0]);
        }
    }
    // ▲

    _handlers() {
        return {
            onNoteSelect: noteId => {
                const selectedNote = this.notes.find(note => note.id == noteId);
                this._setActiveNote(selectedNote);
            },
            onNoteAdd: () => {
                const newNote = {
                    title: "New Note",
                    body: "Take note..."
                };
                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            onNoteEdit: (title, body) => {
                const currentNote = {
                    id: this.activeNote.id,
                    title,
                    body
                };
                NotesAPI.saveNote(currentNote);
                this._refreshNotes();
            },
            onNoteDelete: noteId => {
                NotesAPI.deleteNote(noteId);
                this._refreshNotes();
            },

            // ▼
            onNoteSearch: queryString => {
                const matchedNotes = NotesAPI.getMatchedNotes(queryString);
                this._refreshMatchedNotes(matchedNotes);
            },
            
            //  Built upon {onNoteAdd} 
            onNoteImport: (contentString, formatString) => {
                var title, body;
                [title, body] = NotesAPI.parseString(contentString, formatString);
                const newNote = {
                    title,
                    body
                };
                NotesAPI.saveNote(newNote);
                this._refreshNotes();
            },
            
            onNoteExport: formatString => {
                // NotesAPI.prepareString( formatString, 
                //                         this.activeNote.title,
                //                         this.activeNote.body);
                // temp.testrun();
            },
            // ▲
        };
    }
}
