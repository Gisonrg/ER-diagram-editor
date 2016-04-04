# ER-diagram-editor
An editor to interactively draw, save and edit entity-relationship diagrams.    
[Start playing it](http://gisonrg.github.io/ER-diagram-editor/)

## User Guide
[here](https://github.com/Gisonrg/ER-diagram-editor/blob/master/User%20Manual.pdf)

## Tech Stack
* Angular.js v1.5
* jQueryUI's draggable
* Bootstrap
* Sass
* Gulp

## Installation
1. Install [Node](https://nodejs.org/en/download/) if you haven't done so.
1. Install [Sass](http://sass-lang.com/install). It is used for compiled SASS code into CSS.
2. Clone the project
3. `npm install`
4. `bower install`
5. `gulp` to start develop and automate all compiling/injecting process. Changes will be automatically refreshed and reflected in browser as well.

## Deployment
`gulp dist` to generate compact code for deployment. It will be in the `dist/` folder.
