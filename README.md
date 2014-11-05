windowsPopup
============

Windows Popup AngularJS Module

THIS MODULE IS UNDER CONSTRUCTION -- NOT READY YET -- DO NOT DOWNLOAD YET -- . Check back later, IT WILL BE AVAILABLE SOON ---
In the meantime you can look at the following link -> http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/ 


###Latest Version -> beta v0.0.1

-----------------------------------------------------------------------------------------

##Description and Usage
This is a reusable AngularJS module to help integrate popup browser windows to your application.

####Dependencies :
- jquery.js
- angular.js
- bootstrap.js

####The module defined in two files :
- windowsPopup.js       --> Contains the main **'windowsPopup'** AngularJS module code.
- windowsPopupConfig.js --> Contains the configuration values for **'windowsPopup'** module.

You can and should modify **'windowsPopupConfig.js'** file if you want to change the default values or if you want to add pre-defined windows parameters.

You should not modify **'windowsPopup.js'**.  

####How to use it?
###### Download :
You can download the two needed .js files form Github. Search for windowsPopup reposatory.
Or for testing you can point to the two links below:
- http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/windowsPopup.js
- http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/windowsPopupConfig.js

Note : do not use the above two links for production applications, the availability and performance of that server is not guaranteed. 

###### Description :
One page applications developed by AngularJS is starting to look like a normal GU desktop application. However in a desktop application usually you need to open secondary windows to change some properties, or do some changes related the application running.  

Unfortunately, opening secondary, child windows in javaScripts are not traitforward.
Each window has its own main ***window***, ***document***, object, and data can not be easily accessed from one to the other.
Communication between the main application window and popup windows are not standardised. There are different solutions for different browsers. For example, in FireFox, the parent has access to the child window, that is the return object of the 'window.open()' method. So you can do this:

```sh
var childWin = window.open( .... );
childWin.sharedData = <some data>
```

In IE, however, it does not work. In IE, the child needs to get the 'sharedData', using the 'window.opener' .
In IE the parent would do:

```
window.sharedData = <some data>
var childWin = window.open( .... );
```
The child would get it from :

```
var shareddata = window.opener.shareddata;
```

This **windowsPopup** module tries to help AngularJS developers to open secondary windows and communicate between, them. 
Initially, this module just support child to parent data binding. 

[To see a demo, you can click on this](http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/).  

In this first release, functionality is limited, but the plan is to add more and more as we go along...

In this release we have :
- win-pop : directive
- win



