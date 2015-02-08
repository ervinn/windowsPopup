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
    'version': '0.0.5',
   })
  
  .provider('wnpConfig', function() {
    var preWindows = {};
    // --- This the Config object, will be returned --
    var config = {};    
    var defaultWinValues = null;
    var specs = null;
    
    // ------------------------------------
    // ---- CONFIGURATION VALUES STARTS for wnp-popup directive ---
    // ---- You can modify below ONLY Modify values, or add new predefined windows 
    // ---- Do not modify Existing varable names ---
    // ------------------------------------

    config.popWinTimeOutMillisec = 3000;  // --- Time waited for the Child window to load. --

    // -- 
    config.winOpenSignCssClass = 'glyphicon glyphicon-new-window';
    config.popupLinkCssClass   = 'glyphicon glyphicon-upload';
    
    /** 
     * Default wnp-popup New Browser Windows Parameters  --
     */
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
    // === DO NOT Modify After this ONLY in the next provider for Modal Windows---

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
  })
  .provider('wnpModalConfig', function() {
    // --- This the Config object, will be returned --
    var config = {}; 
    var smallModalElement = '<!-- Small modal -->' +
      '<div class="$$$modalName$$$ modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false">' +
        '<div class="modal-dialog modal-sm">' +
          '<div class="wnp-modal modal-content" > ' +
          '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<div ng-include="' + "'" + '$$$modalContentUrl$$$' + "'"  + '">' +
              '<!-- Modal content -->' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  var largeModalElement = '<!-- Large modal -->' +
    '<div class="$$$modalName$$$ modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false">' +
      '<div class="modal-dialog modal-lg">' +
        '<div class="wnp-modal modal-content" > ' +
        '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
          '<div ng-include="' + "'" + '$$$modalContentUrl$$$' + "'"  + '">' +
            '<!-- Modal content -->' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
    // ------------------------------------
    // ---- CONFIGURATION VALUES STARTS for wnp-pop directive ---
    // ------------------------------------
    /**
     * --- YOU COULD DEFINE YOUR 'modalElement' here --
     *     Make sure that your Modal element has two place holder inside 
     *     Those are : $$$modalName$$$  and  $$$modalContentUrl$$$ 
     *     In the right place, see an example above ---
     */
    /** 
     * --This object contains all the defined elements 
     *   YOU CAN ADD YOURS
    */
    var preModal = {};
    /**
     * Add the default Modal Element parameters.
     */
     preModal.wnpPopDefault = {
      url        : 'views/sampleOne.html',  // -- PROBABLY YOU WANT THIS TO BE DIFFERENT --
      element : largeModalElement
     };
     preModal.small = {
      url     : null,
      element : smallModalElement
     };
     preModal.large = {
      url     : null,
      element : largeModalElement
     };
     preModal.yourModal = {
      url     :  'put yours here',
      element : 'Put yours here'
     };
    // ---- You can modify above --------
    // ---- CONFIGURATION VALUES ENDS ---
    // ----------------------------------
    // === DO NOT Modify After this ONLY in the next provider for Modal Windows---
    /**
     * --- This will return the Pre defined Modal Element based on wnpPopName ---
     */
    config.getPreModalElement = function(wnpPopName) {
      var ret;
      var mod = preModal[wnpPopName];
      if ( mod ) {
        ret = mod.element;
      }
      return ret;
    };
    /**
     * --- This will return the Pre defined Modal URL based on wnpPopName ---
     */
    config.getPreModalUrl = function(wnpPopName) {
      var ret;
      var mod = preModal[wnpPopName];
      if ( mod ) {
        ret = mod.url;
      }
      return ret;
    };
    /**
     * --- This will return the DEFAULT Modal Element ---
     */
    config.getDefaultModalElement = function() {
      return this.getPreModalElement('wnpPopDefault');
    };
    /**
     * --- This will return the DEFAULT Modal URL ---
     */
    config.getDefaultModalUrl = function() {
      return this.getPreModalUrl('wnpPopDefault');
    };
    /**
     * The provider method, needed for Providers.
     */
    config.$get = function() {
      return this;
    };
    return config;
  });
