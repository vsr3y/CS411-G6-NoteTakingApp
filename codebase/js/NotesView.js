// NotesView.js
// All functionalities related to communications with the user go here.

export default class NotesView {
    constructor(root, { onNoteSelect, 
                        onNoteAdd, 
                        onNoteEdit, 
                        onNoteDelete,
                        // ▼
                        onNoteSearch,
                        onNoteImport,
                        onNoteExport
                        // ▲
                    } = {}) {
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        // ▼
        this.onNoteSearch = onNoteSearch;
        this.onNoteImport = onNoteImport;
        this.onNoteExport = onNoteExport;

        this.root.innerHTML = `
            <div class="notes__sidebar">
                <a href="https://github.com/vsr3y/CS411-G6-NoteTakingApp">
                    <img class="notes__logo" src="./images/logo.png" href="https://github.com/vsr3y/CS411-G6-NoteTakingApp">
                </a>
                <div class="notes__header2">
                    <button class="notes__add" type="button">+</button>
                    <input class="notes__search" type="text" placeholder="Search notes...">
                </div>
                <div class="notes__header3">
                    <span>Import</span>
                    <input class="notes__import" type="file" id="file__import" style="width:74%" />
                </div>
                <div class="notes__header4">
                    <button class="notes__export" type="button">Export</button>
                </div>
                <div class="notes__list"></div>
            </div>
            <div class="notes__preview">
                <input class="notes__title" type="text" placeholder="Enter a title..." />
                <textarea class="notes__body">I am the notes body...</textarea>
            </div>
        `;
        // ▲

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        // ▼
        const inpSearch = this.root.querySelector(".notes__search");
        const inpImport = this.root.querySelector(".notes__import");
        const btnExport = this.root.querySelector(".notes__export");
        // ▲
        
        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const updatedTitle = inpTitle.value.trim();
                const updatedBody = inpBody.value.trim();
                this.onNoteEdit(updatedTitle, updatedBody);
            });
        });

        // ▼
        inpSearch.addEventListener("click", () => {
            inpSearch.addEventListener("keyup", ({key}) => { if (key === "Enter") {
                const queryString = inpSearch.value.trim();
                this.onNoteSearch(queryString);
            }});
            // Design Decision: 
            //  Search results do not persist. Results are shown once. Once the user clicks into
            // any result—selecting the note as active note and showing the note on the "notes__preview"
            // tab—and clicks out of the tab triggering {onNoteEdit}, the "notes__list" will refresh
            // back to show all notes. 
            //  After clicking on a result, if the user haven't clicked inside of "notes__preview"
            // tab immediately after, the user can still choose other search results!

        });
        
        // (1) Import any format x ∈ {TXT, MD, JSON, XML}, 
        //  NotesAPI fn's will be ones to parse the format.
        // (2) Using "FileReader" object in JavaScript's File API for import.
        inpImport.addEventListener('change', importEvent => {
            var file = importEvent.target.files[0];
            var formatString = file.name.split(".").pop();      // e.g. "txt", "md", "json", "xml"
            if (!file) { return; }

            var reader = new FileReader();

            // callback() is called after {readAsText()}!!!
            function callback(THIS, contentString) {
                // ▼DISREGARD
                // // (1) {JSON.stringify(String)}
                // //  Convert special invisible character (e.g TAB, ENTER, etc.) into escaped characters (e.g. \t, \n, etc.)
                // //  ↳ Newline characters are converted into '\r\n' combo. ('\r' for Carriage Return)
                // // (2) {String.slice(1, -1)}
                // //  JSON.stringify() appends double-quotes for some reason (e.g. 'hi' → '"hi"')
                // //  {String.slice(1 ,-1)} truncates these double-quotes.
                // contentString = JSON.stringify(contentString);
                // ▲DISREGARD

                console.log(file);
                console.log(contentString);
                console.log(formatString);
                console.log(THIS);

                // Apparently, {this} object can't be accessed inside {callback()} for some reason.
                THIS.onNoteImport(contentString, formatString);
            };

            // reader.onload:
            //  Event handler fn to execute when {FileReader.load_event} is triggered by 
            //  {FileReader.readAs___} fn's. {FileReader.result} can't be accessed outside this fn.
            // However, we can call a {callback()} from inside in order to use {reader.result}.
            // https://docs.w3cub.com/dom/filereader/onload
            // https://stackoverflow.com/a/26298948
            reader.onload = () => {
                callback(this, reader.result);
            };
            reader.readAsText(file);


            

        });
        
        btnExport.addEventListener("click", () => {
            // TODO: add context menu here to determine which format to export as

            // this.onNoteExport(formatString);
        })
        // ▲

        this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body, updated) {
        const MAX_BODY_LENGTH = 60;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-title">${title}</div>
                <div class="notes__small-body">
                    ${body.substring(0, MAX_BODY_LENGTH)}
                    ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                </div>
                <div class="notes__small-updated">
                    ${updated.toLocaleString(undefined, { dateStyle: "full", timeStyle: "short" })}
                </div>
            </div>
        `;
    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Are you sure you want to delete this note?");
                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });
        });
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }
}
