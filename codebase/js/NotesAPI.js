// NotesAPI.js
// All automated functionalities go here.

import saveAs from '../external/FileSaver.js/src/FileSaver.js';


export default class NotesAPI {
    static getAllNotes() {
        const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]");

        return notes.sort((a, b) => {
            return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
        });
    }

    static saveNote(noteToSave) {
        const notes = NotesAPI.getAllNotes();
        const existing = notes.find(note => note.id == noteToSave.id);

        // Edit/Update
        if (existing) {
            existing.title = noteToSave.title;
            existing.body = noteToSave.body;
            existing.updated = new Date().toISOString();
        } else {
            noteToSave.id = Math.floor(Math.random() * 1000000);
            noteToSave.updated = new Date().toISOString();
            notes.push(noteToSave);
        }

        localStorage.setItem("notesapp-notes", JSON.stringify(notes));
    }

    static deleteNote(id) {
        const notes = NotesAPI.getAllNotes();
        const newNotes = notes.filter(note => note.id != id);

        localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
    }

    // ▼

    // >==SEARCH==<

    static getMatchedNotes(queryString) {
        // get only a list of note objects that contain the keyword; 
        // no highlighting implementation needed for now.
        // return list of note objects which match the keyword.
        const regex = new RegExp(queryString);
        var notes = NotesAPI.getAllNotes();
        matchedNotes = [];
        for (const note in notes) {
            if (regex.test(note.title) | regex.test(note.body)) {
                matchedNotes.push(note);
            }
        }
        return matchedNotes
    }

    // >==IMPORT (TEXT PARSING)==<

    // returns [title, body] from helper parsers.
    static parseString(contentString, formatString) {
        switch (formatString) {
            case "txt": return this.parseTXT(contentString);
            case "md": return this.parseMD(contentString);
            case "json": return this.parseJSON(contentString);
            case "xml": return this.parseXML(contentString);
        }
    }

    static parseTXT(contentString) {
        // format: 'TITLE\r\n\r\nBODY'
        // consume Line1 as TITLE
        // consume Line2
        // consume Line3 → EOF as BODY
        const i = contentString.indexOf('\r\n\r\n');
        if (i !== -1) {
            const title = contentString.substring(0, i);
            const body = contentString.slice(i+8);
            return [title, body];
        } else {
            throw 'Cannot parse TXT.';
        }
    }

    static parseMD(contentString) {
        // format: '# TITLE\r\n\r\nBODY'
        if (contentString.substring(0, 2) === '# ') {
            return parseTXT(contentString.substring(3));
        } else {
            throw 'Cannot parse MD.';
        }
    }

    static parseJSON(contentString) {
        // format: '{\r\n    \"title\": \"TITLE\",\r\n    \"body\": \"BODY\"\r\n}'
        if (contentString.substring(0, 22) === '{\r\n    \"title\": \"') {
            const i = contentString.indexOf('\",\r\n    \"body\": \"');
            const j = contentString.indexOf('\"\r\n}');
            if (i !== -1 && j !== -1) {
                const title = contentString.substring(22, i);
                var body = '"' + contentString.substring(i+23, j) + '"';
                body = JSON.parse(body);
                return [title, body];
            }
        }
        throw 'Cannot parse JSON.';
    }

    static parseXML(contentString) {
        // format: '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<content>\r\n    <title>TITLE</title>\r\n    <body>BODY</body>\r\n</content>'
        if (contentString.substring(0, 70) === '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n<content>\r\n    <title>') {
            const i = contentString.indexOf('</title>\r\n    <body>');
            const j = contentString.indexOf('</body>\r\n</content>');
            if (i !== -1 && j !== -1) {
                const title = contentString.substring(70, i);
                var body = '"' + contentString.substring(i+22, j) + '"';
                body = JSON.parse(body);
                return [title, body];
            }
        }
        throw 'Cannot parse XML.';
    }


    // >==EXPORT (TEXT PREPARATION)==<

    //  Using eligrey/FileSaver.js (https://github.com/eligrey/FileSaver.js) for export,
    // reciprocal to JavaScript's "FileReader" object.
    static prepareString(formatString, title, body) {
        var preparedString;
        switch (formatString) {
            case "txt": preparedString = this.prepareTXT(title, body);
            case "md": preparedString = this.prepareMD(title, body);
            case "json": preparedString = this.prepareJSON(title, body);
            case "xml": preparedString = this.prepareXML(title, body);
        }
        
        // FileSaver.js
        var file = new File([preparedString], "untitled." + formatString, {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(file);
    }

    static prepareTXT(title, body) {
        return `${title}
        
        ${body}`;
    }

    static prepareMD(title, body) {
        return `# ${title}

        ${body}`;
    }

    static prepareJSON(title, body) {
        return `{
            "title": "${title}",
            "body": "${JSON.stringify(body).slice(1, -1)}"
        }`;
    }

    static prepareXML(title, body) {
        return `<?xml version="1.0" encoding="UTF-8"?>
        <content>
            <title>${title}</title>
            <body>${JSON.stringify(body).slice(1, -1)}</body>
        </content>`;
    }
    // ▲
}
