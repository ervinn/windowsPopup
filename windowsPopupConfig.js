'use strict';

/**
 * @ngdoc overview
 * @name windowsPopupConfig
 * @description
 * The 'windowsPopupConfig' module contains configuration values for the 'windowsPopup' AngularJS module.
 * The user should modify this to add or modify configuration data for the 'windowsPopup' module.
 * @Author Ervin Nemesszeghy
 * # windowsPopupConfig
 *
 * Configuration module of the 'windowsPopup' AngularJS module.
 */
angular
  .module('windowsPopupConfig', [])
  .constant('contans', {
    'version': '0.0.3',
   })
  
  .provider('wnpConfig', function() {
    var preWindows = {};
    var config = {};    
    var defaultWinValues = null;
    var specs = null;
    
    // ------------------------------------
    // ---- CONFIGURATION VALUES STARTS ---
    // ---- You can modify below ONLY Modify values, or add new predefined windows 
    // ---- Do not modify Existing varable names ---
    // ------------------------------------

    // -- 
    config.winOpenSignCssClass = 'glyphicon glyphicon-new-window';
    config.popupLinkCssClass   = 'glyphicon glyphicon-upload';
    
    // --- Default Windows Parameters ---
    defaultWinValues = {  
      wnpName  : 'defaultWin',   // -- wnpName - The name of the window (Note: the name does not specify the title of the new window)
      wnpTitle : null,   // -- NOTE, There may be no point to have default title, Use null, so the link Text will be the Popup Title
      url   : 'views/popupWindow.html',  // -- PROBABLY YOU WANT THIS TO BE DIFFERENT --
      specs : {},
      // --- Additional Configuration values, other than 'specs' --      
      wnpToggleOpenClose : 'false',
      wnpAutoUpdate: 'true'
    };
    specs = {
      // --- window.open() 'specs' parameters -- 
      width : '500',       // -- width=pixels;  -The width of the window. Min. value is 100
      height: '500',       // -- height=pixels; -The height of the window. Min. value is 100
      left  : '10',       // -- left=pixels;   -The left position of the window. Negative values not allowed
      top   : '100',       // -- top=pixels;    -The top position of the window. Negative values not allowed
      location : 'no',     // -- location=yes|no|1|0;     -Whether or not to display the address field. Opera only
      channelmode : 'no',  // -- channelmode=yes|no|1|0; -Whether or not to display the window in theater mode. Default is no. IE only
      fullscreen :  'no',  // -- fullscreen=yes|no|1|0;  -Whether or not to display the browser in full-screen mode. Default is no. A window in full-screen mode must also be in theater mode. IE only
      menubar : 'no',      // -- menubar=yes|no|1|0;     -Whether or not to display the menu bar
      resizable : 'no',    // -- resizable=yes|no|1|0;   -Whether or not the window is resizable. IE only.
      scrollbars : 'no',   // -- scrollbars=yes|no|1|0;  -Whether or not to display scroll bars. IE, Firefox & Opera only
      status : 'no',       // -- status=yes|no|1|0;      -Whether or not to add a status bar
      titlebar : 'no',     // -- titlebar=yes|no|1|0;    -Whether or not to display the title bar. Ignored unless the calling application is an HTML Application or a trusted dialog box
      toolbar : 'no'      // -- toolbar=yes|no|1|0;     -Whether or not to display the browser toolbar. IE and Firefox only
    };
    defaultWinValues.specs = specs;
    preWindows[defaultWinValues.wnpName] = defaultWinValues;

    // --- PreDefined Window One ---
    var preDefineWindowOne = {
      wnpName  : 'winOne',
      wnpTitle : 'PreDefined winOne Title',   // --- NOTE: If you do not specify this the text of the Link will be the title
      url   : 'yourURL',
      specs : {},
      wnpToggleOpenClose : 'true',
      wnpAutoUpdate: 'true'
    };
    specs = {      
      width : '600',
      height: '700'
    };
    preDefineWindowOne.specs = specs;
    preWindows[preDefineWindowOne.wnpName] = preDefineWindowOne;

    // --- PreDefined Window One ---
    var preDefineWindowTwo = {
      wnpName  : 'winTwo',
      specs : {},
      wnpToggleOpenClose : 'false'
    };
    specs = {      
      width : '600',
      height: '700'
    };
    preDefineWindowTwo.specs = specs;
    preWindows[preDefineWindowTwo.wnpName] = preDefineWindowTwo;

    // ---- You can modify above --------
    // ---- CONFIGURATION VALUES ENDS ---
    // ----------------------------------
    // === DO NOT Modify After this ---

    /**
     * --- This will return the Pre defined window 'specs' defined above ---
     */
    config.getPreWindow = function(wnpName) {
      return preWindows[wnpName];
    };

    /** 
     * --- This will return the Default window 'specs' defined above ---
     */
    config.getDefaultWindowParams = function() {
      return defaultWinValues;
    };

    /**
     * The provider method, needed for Providers.
     */
    config.$get = function() {
      return this;
    }; 

    return config; 
  });
