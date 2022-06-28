# 411onedaymiracle

## How to use

(1) Please host your own webserver such as Apache via XAMPP since using `file:///` on browsers will not activate JavaScript scripts.
(2) In such a case, put this repository where the webserver can locate. In the case of Apache-XAMPP for instance, put it inside `C:\xampp\htdocs`.
(3) Launch the application via HTTP protocol:
`http://localhost:8080/CS411proj/mynotesapp/index.html`

## Consumption Pipeline

- NotesAPI.js   >==(automated fn's for)===          App.js
- NotesView.js  >==(user-interactive fn's for)===   App.js
- App.js        >==(act as interface for)===        main.js
- main.js       >==(generates html for)===          index.html


