Bootstrap package
================

This package is based on the Bootstrap framework. In order to use it you need to add the package to the ResourcePackages folder of your project. If the ResourcePackages folder doesn't contain any packages, widget templates will be loaded from Feather or from the MVC folder of SitefinityWebApp (if this folder contains files with names, matching the naming convention). Templates from the source of Feather have lowest loading priority. Templates in the MVC folder of SitefinityWebApp are with higher priority, and templates from a package have highest loading priority.

The MVC folder of the Bootstrap package contains a Views folder. In it are the:
* Layouts folder - containing cshtml files, corresponding to master pages in Sitefinity;
* ContentBlock folder - containing all templates of the ContentBlock widget, as well as the templates of its designer;
* Grids folder - containing the grid widgets, that are the Bootsrap version of Sitefinity layout widgets;
* SocialShare folder - containing all templates of the SocialShare widget and the templates of its designer;

 To create a custom template for a widget, you need to add to the Views folder of your package a cshtml file with the same name as the name of the Feather template you would like to replace. This will automatically replace the default template and force Feather to use your custom one (this is not valid for grids widgets, because the feature hasn't been implemented yet. However, we're planning to deliver it soon).

