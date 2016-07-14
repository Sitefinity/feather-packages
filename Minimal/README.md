# Minimal package #

This is a basic package, which contains all default templates of the frontend widgets, such as News, Blogs, and Images, etc. as plain HTML, minimal CSS, and a basic grunt configuration. It can be used as a foundation for custom Feather packages, as well as packages that are based on frontend frameworks of your choice.

## Package structure ##

The Minimal package contains minimal front-end assets, widget template, grid widget templates and grunt configuration
 - assets - contains front-end files such as CSS, JS, images and fonts.
 -- dist - contains the processed ready-to-use front-end assets
 --- images - contains minified images from src folder which are usually used as background images in the css
 --- js - contains a minified js file which is a concatenation of js files listed in jsfiles.json. To use this file add a reference to it in the package Razor layout file MVC/Views/Layouts/default.cshtml
 --- css - contains the processed css files
 ---- main.css - this is output of the processed main.scss from assets/src/project/sass
 ---- main.min.css - this is same as main.css but minified. This is the distributed css file which is added in the package Razor layout file MVC/Views/Layouts/default.cshtml
 ---- sitefinity.css - this is output of the processed sitefinity.scss from assets/src/sitefinity/sass. This files contain css added by Sitefinity
 ---- sitefinity.min.css - minified sitefinity.css
 -- src - contains the source front-end files which are processed via Grunt javascript task runner to dist folder
 --- project - add your non-sitefinity front-end assets here
 ---- images - add images here. Images added in this folder will be minified and copied to assets/dist/images
 ---- js - add js files here and list them in jsfiles.json. All js files listed in jsfiles.json will be concatenated and minified to project.min.js in assets/dist/js/
 ---- sass - create subfolders in this folder and add your scss files here
 ---- sass/main.scss - import all your scss files here. This file will be processed to assets/dist/css/main.min.css
 --- sitefinity - contains css and images for tags and social share widgets
 - MVC folder - contains all widget templates categorized by widget and the Razor layout file
 -- Layouts/default.cshtml - Razor layout file
 - GridSystem - contains grid widget templates
 -- Templates/container.html - contains one placeholder
 -- Templates/one-column.html - contains one column widget - row + column
 -- Templates/two-columns.html - contains two column widget (columns are display as rows one below the other, it is up to you to style the columns to be displayed one side by side)
 - csslint.json - contains csslint options and globals
 - gruntfile.js - used to configure and define tasks as well as load grunt plugins
 - jsfiles.json - contains a list of js files to be automatically concatenated and minified when grunt is run
 - package.json - stores metadata grunt and grunt plugins that the project needs

## Editing and creating a widget ##
By default we include all widget templates in every package. Modifying a template is super easy. If you want to modify the Horizontal navigation template, just go to `/ResourcePackages/Minimal/MVC/Views/Navigation`, open the `NavigationView.Horizontal.cshtml` file and make your changes.

Creating a new template is just as easy.
Duplicate an existing template, give a name to the new file, keeping in mind the following structure - NavigationView.XXXXXX.cshtml. Then the new template will appear in the list of templates for this widget in the widget's designer.

For widgets that have list and details views, the structure should be List.XXXXXX.cshtml or Detail.XXXXXX.cshtml, respectively.
