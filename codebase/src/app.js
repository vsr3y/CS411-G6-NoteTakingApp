//strict js allows better debugging
'use strict';
//0 means save as txt, 1 means docx
//default is saving as txt
var docx_or_txt = 0;


const mode_switcher = document.querySelector('.btn_mode_switch');
mode_switcher.addEventListener('click', function() {
    document.body.classList.toggle('txt-theme');
    document.body.classList.toggle('docx-theme');

    const className = document.body.className;

    if(className == "txt-theme") 
    {
        this.textContent = "Save as .txt";
        pdf_or_txt = 0;
    } 
    else 
    {
        this.textContent = "Save as .docx";
        pdf_or_txt = 1;
    }
    console.log('current class name: ' + className);

});


function save_fun()
{
 var textToWrite = document.getElementById('text_box_1').innerHTML;
  var textFileAsBlob = new Blob([ textToWrite ], { type: 'text/plain' });
  var fileNameToSaveAs = "file.txt"; //filename.extension

  var downloadLink = document.createElement("a");
  downloadLink.download = fileNameToSaveAs;
  downloadLink.innerHTML = "Download File";
  if (window.webkitURL != null) {
    // Chrome allows the link to be clicked without actually adding it to the DOM.
    downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
  } else {
    // Firefox requires the link to be added to the DOM before it can be clicked.
    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
  }
}
const element = document.querySelector("btn_save");
element.addEventListener("btn_save", save_fun);
element.addEventListener("mouseover", mouse_over);
