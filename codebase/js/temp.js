import saveAs from '../external/FileSaver.js/src/FileSaver.js';

export default class temp {
    static testrun() {
        var preparedString = `${title}
        
        ${body}`;
        var file = new File([preparedString], "untitled." + formatString, {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(file);
    }
}