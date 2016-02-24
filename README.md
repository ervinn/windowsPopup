windowsPopup
============

Windows Popup AngularJS Module

If you want to contribute please clone the ['windowsPopup-dev' Development Environment](https://github.com/ervinn/windowsPopup-dev) and follow the instructions there.  Thanks. Any idea, comment, feedback will be appreciated. The [development repository](https://github.com/ervinn/windowsPopup-dev) contains a sample page to demonstrate the usage of 'windowsPopup' module, and it contains all the test code for it. >>Happy coding<<

#####Latest stable version -> [v0.0.5 (Released on 2015-02-08) - download from here](https://github.com/ervinn/windowsPopup/tree/v0.0.5)  

##### Next Version: v0.0.6 -- (Released on NOT YET) --

-----------------------------------------------------------------------------------------

##Description and Usage
This is a reusable AngularJS module to help integrate popup browser windows to your application.

####Dependencies :
- jquery.js
- angular.js
- bootstrap.js

####The module defined in two files :
- **windowsPopup.js**       --> Contains the main **'windowsPopup'** AngularJS module code.
- **windowsPopupConfig.js** --> Contains the configuration values for **'windowsPopup'** module.

You can and should modify **'windowsPopupConfig.js'** file if you want to change the default values or if you want to add pre-defined windows parameters.

You should not modify **'windowsPopup.js'**.  

####How to use it?
###### Download :
You can download the two needed .js files form Github. Search for windowsPopup reposatory.
Or for testing you can point to the two links below:
- <http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/v0.0.5/windowsPopup.js>
- <http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/v0.0.5/windowsPopupConfig.js>

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

[To see a demo, you can click on this](http://www.hardcomsoft.com/ervin/angularJS/windowsPopup/v0.0.5/).  

...
[To see some videos ] (http://www.hardcomsoft.com//ervin/angularJS/windowsPopup/docs/videos.html)
...

We have the following main functionality directives, so far, we adding more as we go along ... :
- ***wnp-popup*** : directive. Clicking this link will open the secondary window. Use the left click 
- ***wnp-model*** : directive. Use this directive to link parent model to child model.- 
- ***wnp-pop*** : directive. Use this directive to open Model window instead of browser window. The default is to use the right click, `contextmenu` to open Modal. The default can be overwritten by adding `wnp-left-click` or `wnp-dbl-click`  attributes, or both.

The ***wnp-popup*** directive has all the attributes that are needed to pass on to 'window.open()' method's parameters. Plus is has some additional attributes to configure ***wnp-popup*** directive.

Those can add up to lot of attributes. To avoid repeating yourself, you can pre-configure a popup window by specifying its parameters, in the '**WindowsPopupConfig.js**' file, and those parameters will be used in the  ***wnp-popup*** directive . So in your HTML you can popup a window, like so :

```
<wnp-popup name="myPredifinedWindow" />
```
In this case all the needed parameters are defined in the **windowsPopupConfig** module.
If you want to override the default values, just specify the new values in the **wnp-popup** directive as an attribute. Usually you may want to use different URLs to open the same kind of window, then you say that like so :

```
<wnp-popup name="myPredifinedWindow" url="http://...." />
```

You do the pre-configuration in the '**WindowsPopupConfig.js**' file, where the '**windowsPopupConfig**' module is defined.

There are three levels where you can configure the needed parameters for a popup window :
- 1st level - **defualt window parameter values**. Used if no value is spefified on the two other levels.
- 2nd level - **pre-defined window values**, that can be access by window name. These values can be overwritten by the next level.
- 3rd level - **attribute values** specified on the ``` <wnp-popup width="500" height="500" ... /> ``` directive as attributes.
 
The first two level values are defined in the '**WindowsPopupConfig.js**' file. The 3rd level values are defined in your HTML file.

The lowest level values can be modified by changing the ``` var defaultWinValues ``` object values.
Those values will be used only if, no values are specified in you predefined window variable, or there is no attribute value in the **'wnp-popup'** directive.

The second level values are in your predifined window variable specified in the '**WindowsPopupConfig.js**' file. There are two pre-defined variables are already defined. Those are ``` var preDefineWindowOne ``` and ``` var preDefineWindowTwo ```.
Feel free to modify any of the values. Modify only the values. If you are a javaScript developer, it is obvious what you can and can not modify. 

Also feel free to define additional pre-defined windows. All predefined windows mus be added to the ``` var preWindows = {}; ``` object. _NOTE_: the key in the JavaScript object is the window name, that is the name attribute you specify in the ```<wnp-popup name="..." /> ``` directives, to refernce the values.

_NOTE_: other additional config values that will be added in the future will follow these three level logic configuration.

-----
#####New in v0.0.5 :
- Add more unit and E2E test cases for the new `wnp-pop`, directive.
- Add more help description for how to use the `wnp-pop` directive (add a "Modal usega Help" modal window).
- Fix some text spelling mistakes on the Demo window.
- BUG Fix : make sure only one Modal DOM element is added to the page, for each URL and name.

-----
#####New in v0.0.4 :
- Two new optional attributes are added to `wnp-popup` directive. Those are `wnp-on-open` and `wnp-on-close`. Now it is possible to add two callback functions, the function specified in `wnp-on-open` will be called when your window is opened, and the function in `wnp-on-close` will be called when your window is closed. Usage : ...  `wnp-on-open="yourOnOpenFnc(wnpName)" ... wnp-on-close="yourOnCloseFnc(wnpName)" `. Note : you need to use `wnpName` so the Window name will be passed in to your callback. The spelling is important for `wnpName` but the function name can be your choise.
- BUG Fix : When the Child window reseted by pressing the F5 key, now the connections between Child and Parent are not lost.
- Now, Parent window checks if the Child window loaded the AngularJS and windowPopup modules, before the `wnpOnOpen(wnpName)' method is called. If those are not loaded after a certain time interval, then an alert error mesage is presented, and the popup window is closed. The time interval will be configurable. 
- Add E2E (end to end) test cases for the Demo program using [Protractor][protractor]. These tests
are run with the [Protractor][protractor] End-to-End test runner.
- Add new directive `wnp-pop`. Sometimes you do not want to open a new browser window, just a simple Modal window would do. The `wnp-pop` directive is similar to `wnp-popup`, but it opens a Modal window not a new browser window. The good thing is that you can use the same html partial, whatever is in the url attribute will be used. The `wnp-pop` is using a new attribute, that is `wnp-pop-name`, to use pre-defined Modal windows. The main difference is that the `wnp-pop` directive open the Modal window by the right mouse click. This way, this new directive could also be used to open a context menu for you application. ( TODO: After this we will add a directive to open a drop down menu by right click, we plan to call it `wnp-pop-dn` or `wnp-pop-down` .) So you will have the option to have a simple drop down or you you can have a Modal window for more complex context menu, depending of your needs.

----
#####New in v0.0.3 :
- Made data binding bi-directional. Now when parent updates model data that is linked to child model, the child model is updated automatically.
- Rename directives and services names. All names are prefixed with `wnp-*` .
- Pass a Title text (`wnp-title`) to the Child window, or if that is not specified pass the text of the link the user clicked.
- Add 'Build Your Window' section to the Demo app.

----
#####New in v0.0.2 :

- Now a child window can be a parent and open its own child window.
- A new configuration parameter is added. The new configuration parameter is autoUpdate. This value can be specified in the default level, and the Pre-defined window level, or can be passed as an attribute auto-update in the wnp-popup directive. If the auto-update value is true (that was always true in v0.0.1), parent window will be automatically updated as data is typed on the Child. If that value is false, the parent won't be automatically updated. A new directive was added (wnp-update-parent), which must be placed to a buttom or link, which clicked, the parent window is updated at that time.
- Added angular-route to the Demo application for the popup windows loading. Now windowsPopup.html is used as template, and based on the #/value on the URL, different partial HTMLs can be loaded inside windowsPopup.html .
- New Sample popup partial windows were added to the Demo program, to demonstrate the new features.
- Added test cases for the directive wnp-model.

-----

