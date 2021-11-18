# Minimal package #

This is a basic package, which contains all default templates of the frontend widgets as plain HTML and minimal CSS. It can be used as a foundation for custom MVC packages, as well as packages that are based on frontend frameworks of your choice. In order to use it you need to add the package to the `ResourcePackages` folder of your project. If the `ResourcePackages` folder doesn't contain any packages, widget templates will be loaded from *Embedded resources* or from the **MVC** folder of **SitefinityWebApp** folder only if it contains files with names, matching the naming convention. The priority for loading templates is as follows (in descending order):
1. Templates from the resource package
2. Templates in the **MVC** folder of **SitefinityWebApp**
3. Templates from the *Embedded resources* source

## Npm
### Install
Npm is the package manager for JavaScript that enables you to assemble packages of reusable code. For more information, visit [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) websites. Currently *Minimal* package supports Node.js LTS version 12.17.0.
```
> npm install
> npm start
```
`npm start` executes the default **npm** scritps and subsequently watches for any changes in the files after.

## Package structure ##

The Minimal package contains minimal front-end assets, widget template and grid widget templates. Following is a hierarchical list of the major folders and files that come with the *Minimal* package.
 - **assets** - contains frontend files such as CSS, JS, images and SVG sprites
    - **dist** - contains the processed ready-to-use frontend assets
        - **images** - contains compressed images from the project's `src` folder. These images are usually used as background images in the CSS.
        - **js** - contains a js file which are listed in `package.json` file in `config.copyJs` section. To use this file add a reference to it in the package Razor layout file `MVC/Views/Layouts/default.cshtml`
        - **css** - contains the processed CSS files
            - **main.css** - this is output of the processed `main.scss` from `assets/src/project/sass`. This file contains Sitefinity CMS and the project itself
            - **main.min.css** - this is the minified version of the `main.css` file. The `main.min.css` file is the distributed CSS file that is linked in the `MVC/Views/Layouts/default.cshtml` Razor layout file of the package.
            - **sitefinity.css** - this is output of the processed `sitefinity.scss` from `assets/src/sitefinity/sass`. This files contain CSS added by Sitefinity CMS
            - **sitefinity.min.css** - this is the minified version of `sitefinity.css`
    - **src** - contains the source front-end files which are processed via grunt to dist folder
        - **project** - add your non-Sitefinity CMS frontend assets in this folder
            - **images** - add images in this folder. These images will be compressed and output to the `assets/dist/images` folder.
            - **js** - add JavaScript files in this folder that need to be moved to the `assets/dist/js` folder. You will need to extend the file paths listed in `package.json` file in `config.copyJs` section.
            - **sass** - create subfolders in this folder to add your SCSS files
                - **main.scss** - import all your SCSS files here. This file will be processed to the `assets/dist/css/main.min.css` folder.
        - **sitefinity** - contains the SCSS files for Sitefinity CMS styling

    Following is an example of how to structure files hierarchically:
    ```     
    | ResourcePackages
    |-- Minimal
    |---- assests
    |------ dist
    |------ src
    |-------- sitefinity
    |-------- project
    |---------- images
    |---------- js
    |---------- sass
    |------------ main.scss
    ```
    **IMPORTANT:** We do **not** recommend renaming the subfolders since they are used in npm scripts

- **MVC folder** - contains all widget templates (categorized by widget) and the Razor layout file
 	- **Layouts/default.cshtml** - Razor layout file
 - **GridSystem** - contains grid widget templates
 - **package.json** - stores metadata that the project requires and all the **npm** scripts that are used for the build

## Create and modify widget templates
By default, all widget templates are included in the Minimal package. To modify a widget template, simply open the respective template, say, *Horizontal* navigation template. To do so, navigate to `/ResourcePackages/Minimal/MVC/Views/Navigation`, open the `NavigationView.Horizontal.cshtml` file, and make your changes.

Creating a new template is just as simple:
1. Duplicate an existing template.
2. Name the new file according to the following convention: `NavigationView.XXXXXX.cshtml`.
**NOTE:** For widgets that have list and details views, the structure should be `List.XXXXXX.cshtml` or `Detail.XXXXXX.cshtml`, respectively.

As a result, the new template is displayed in widget designer for this widget in the list with templates.

To create a new widget template for dynamic content:

1. Create a folder with a name that corresponds to the name of the dynamic content module (in singular).
In this folder, you organize the project widget templates, located in either `/Mvc/Views/` or `/ResourcePackages/Minimal/MVC/Views`.
2. Create a `*.cshtml` file, according to the following convention: `List.XXXXXX.cshtml` for list view and `Detail.XXXXXX.cshtml` for details view.
3. Write the markup of the template.

When you create a new Dynamic module, list and details widget templates for this module are automatically created in for this module in `Design > Widget Templates`.

## Create and edit grid widget templates
By default we include three grid widgets. We don't include CSS to style them. It is up to you to add a grid system and make the columns appear side by side.
To modify a grid widget, for example, a grid widgegt with two columns, simply navigate to `/ResourcePackages/Minimal/GridSystem/Templates`, open `two-columns.html` and make your changes.

You can:
- Add an extra CSS class to a column
- Change the label of the field for adding CSS classes for this column in the grid widget designer
- Change the name of a column placeholder name in Page editor.

**Example:**
```
<div class="" data-sf-element="Row">
    <div class="sf_colsIn **EXTRA_CSS_CLASS**" data-sf-element="**NEW_COLUMN_1_CSS_CLASS_FIELD_LABEL**" data-placeholder-label="**NEW_COLUMN_1_PLACEHOLDER_NAME**">
    </div>
    <div class="sf_colsIn" data-sf-element="Column 2" data-placeholder-label="Column 2">
    </div>
</div>
```
**IMPORTANT:** Do **not** remove `sf_colsIn` since it is a system CSS classe that indicates where a placeholder is created.

To create a new grid widget is just as simple:
1. Duplicate an existing grid widget template
2. Name the new file, so that the new grid widget is displayed in the list of grid widgets in the Layout tab in the Page editor.

**Example:** To create a simple placeholder with `<section>` tag, create `section.html` in `/ResourcePackages/Minimal/GridSystem/Templates/`
```
<section class="section" data-sf-element="Section" data-placeholder-label="Section"></section>
```

## Recommendations for managing widget templates

### Modifying widget templates

To make upgrades easier, we recommend not to change the default widget templates. If you need to make changes to a default template, we recommend that you create a new one by duplicating the existing template you want to modify. You then make the changes on the newly created template.

### Location of project templates

If you want to have separate locations for the project widget templates and the default widget templates, you can place project templates in the MVC folder in the root `SitefinityWebApp` folder of your project `/Mvc/Views/`. This makes it easier to navigate and manage only the project-specific files you need. 

You can apply the same separation for grid widget templates as well. You can move the project-specific grid widget templates to the `/GridSystem/Templates` folder in the root `SitefinityWebApp` folder of the project.

## Location of project frontend assets
All project-specific frontend assets like SCSS, images, JavaSCript files, and so on need to be placed in the `assets/src/project` folder. When the `npm start` is run, all source files are processed and moved to the `assets/dist` folder, from which there are used in the project.

### Scss
Place all your SCSS files in the `assets/src/project/sass` folder. We recommend that you create subfolders to organize the project files and only then import the files in `main.scss`
**Example:**
```
File structure
|- sass
|-- settings
|--- _colors.scss
|--- _typography.scss
...
|-- base
|--- _link.scss
|--- _typography.scss
...

main.scss
// Sitefinity CSS
@import "../../sitefinity/sass/sitefinity";

//Import .scss files here
@import "setting/colors";
@import "setting/typography";
...
@import "base/link";
@import "base/typography";
...
```
When you run `npm start`, all SCSS files imported in `assets/src/project/sass/main.scss` are processed and output in `assets/dist/css/main.css`
If you do not want to include Sitefinity CMS remove the import rule `@import "../../sitefinity/sass/sitefinity.scss";` in `assets/src/project/sass/main.scss`.

### Images
Place all images in `assets/src/project/images`. After `npm start` is run, all images from this folder will be compressed and moved to `assets/dist/images`.

### Javascript
In the `packages.json -> config.copyJs` section, list all your JavaScript files (separated by space) that you want to be moved to `assets/dist/js`.
