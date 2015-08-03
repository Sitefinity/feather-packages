# Minimal package #

Empty package

## Package structure ##

The Minimal package contains 3 folders and several files.
 - assets folder - this contains CSS, JS, images and fonts.
 - MVC folder - contains all widget templates categorized by widget
 - GridSystem - contains all layout/grid templates
 - gruntfile.js and other files in the root - these are files we use in our GruntJS set up.


## Editing and creating a widget
By default we include all widget templates in every package. Modifying a template is super easy. If you want to modify the Pills navigation template, just go to `/ResourcePackages/Minimal/MVC/Views/Navigation`, open the `NavigationView.Pills.cshtml` file and make your changes.

Creating a new template is just as easy.
Duplicate an existing template, gve a name to the new file, keeping in mind the following structure - NavigationView.XXXXXX.cshtml. Then the new template will appear in the list of templates for this widget.

For widgets that have list and details views, the structure should be List.XXXXXX.cshtml or Detail.XXXXXX.cshtml, respectively.
