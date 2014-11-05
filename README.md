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

_NOTE_: do not use the above two links in production applications, the availability and performance of that server is not guaranteed. 

###### Description :
One page applications developed by AngularJS is starting to look like a normal GU desktop application. However in a desktop application usually you need to open secondary windows to change some properties, or do some changes related the application running.  

Unfortunately, opening secondary, child windows in javaScripts are not straightforward.
Each window has its own main ***window***, ***document***, object, and data can not be easily accessed from one to the other.
Communication between the main application window and popup windows are not standardised. There are different solutions for different browsers. For example, in FireFox, the parent has access to the child window, that is the return object of the 'window.open()' method. 
In IE, however, it does not work. In IE, the child needs to get the 'sharedData', using the 'window.opener' .
But, all those details are hiden in this module, so hopefully you wont need to worry about them.

This **windowsPopup** module tries to help AngularJS developers to open secondary windows and communicate between, them. 
Initially, this module just support child to parent data binding. 

[To see a demo, you can click on this](http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/).  

In this first release, functionality is limited, but we plan to add more and more as we go along...

In this release we have :
- ***win-popup*** : directive. Clicking this link will open the secondary window.
- ***popup-link-model*** : directive. Use this directive to link parent model to child model.- 

The ***win-popup*** directive has all the attributes that are needed to pass on to 'window.open()' method's parameters. Plus is has some additional attributes to configure ***win-popup*** directive.

Those can add up to lot of attributes. To avoid repeating yourself, you can pre-configure a popup window by specifying its parameters, in the '**WindowsPopupConfig.js**' file, and those parameters will be used in the  ***win-pop*** directive . So in your HTML you can popup a window, like so :

```
<win-pop name="myPredifinedWindow" />
```
In this case all the needed parameters are defined in the **windowsPopup** module.
If you want to override the default values, just specify the new values in the **win-pop** directive as an attribute. Usually you may want to use different URLs to open the same kind of windowm, then you say that like so :

```
<win-pop name="myPredifinedWindow" url="http://...." />
```

You do the pre-configuration in the '**WindowsPopupConfig.js**' file.

There are three level of window configurations.
- 1st level - defualt window parameter values. Used if no value is spefified on the two other level.
- 2nd level - pre-defined window values, that can be access by window name. This value can be overwritten by the next level.
- 3rd level - parameters specified on the ``` <win-pop width="500" height="500" ... /> ``` directive as attributes.
 
The lowest level is defined in the '**WindowsPopupConfig.js**' file, by the ``` var defaultWinValues ``` variables.
Those values will be used only if, no values are specified in you predefined window variable, or there is no attribute value in the **'win-pop'** directive.

The second level is in your predifined window variable specified in the '**WindowsPopupConfig.js**' file. There are two pre-defined variables are already defined. Those are ``` var preDefineWindowOne ''' and ''' var preDefineWindowTwo '''.
Feel free to modify any of the values. Modify only the values. If you are a javaScript developer, it is obvious what you can and can not be modified. 

Also feel free to define additional pre-defined windows. All predefined windows mus be added to the ``` var preWindows = {}; ``` object. _NOTE_: the key in the JavaScript object is the window name, that is the name attribute you specify in the ```<win-pop name="..." /> ``` directives.

_NOTE_: other additional config values that will be added in the future will follow these three level logic configuration.





