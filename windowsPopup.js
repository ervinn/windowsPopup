'use strict';

/**
 * @ngdoc overview
 * @name windowsPopup
 * @description
 * The <b>'windowsPopup'</b> module helps you to integrate other popup windows to your main one page application. 
 * For each browser window AngularJs has to be loaded separatelly. 
 * You need to load the same "WindowsPopup.js" file in both the Parent and the Child window. 
 * The 'windowsPopup' module helps you to communicate between the Child and Parent window. 
 *
 * @Author Ervin Nemesszeghy
 * # windowsPopup
 *
 * Main module of the Window Popup application.
 */
angular
  .module('windowsPopup', ['windowsPopupConfig']) 
  .constant('wnpContans', {
    'version': '0.0.5',
    'release_date' : '2015-02-08',
    'debugMode' : false
   })
  .config( function (wnpContans) {
    if (wnpContans.debugMode === true) {
      console.log('load windowsPopup AngularJs Module version=('+wnpContans.version+') Release Date('+wnpContans.release_date+')');
    }
  })
  
.directive('wnpVersion', ['wnpContans', function (wnpContans) {
    return {
      restrict: 'AE',
      compile: function(element, attributes) {
        var versionText = 'Powered By WNP &#169 (WindowsPopup) V:' + wnpContans.version + ' Released on ' + wnpContans.release_date;
console.log(versionText);
        element.html(versionText);
      }
    }
  }])
  .factory('wnpUtil', function() {
    var service = {};

    /**
     * If the 'name' has dots init, using JavaScript 'scope[name] = value' does not work.
     * This function solves that.
     */
    service.setToScope = function(scope, name, value) {                                             
      var tmp = scope;
      var lst = name.split('.');
      var len = lst.length;      
      if (len === 1) {
        tmp[name] = value;
      } else {
        for (var i=0; i < len; i++) {         
          if (! tmp[lst[i]] ) {
            tmp[lst[i]] = {}; 
          }
          tmp = tmp[lst[i]];
          if (i < len-1) { 
            tmp[lst[i+1]] = value;
            break;
          }           
        } // --- End of loop ---      
      }      
    };

    /**
     * If the 'name' has dots init, using JavaScript ' scope[name] = value' does not work.
     * This function solves that.
     */
    service.getFromScope = function(scope, name) {   
      var tmp = scope;
      var ret = '';
      var lst = name.split('.');
      var len = lst.length;      
      if (len === 1) {
        return scope[name];
      } else {
        for (var i=0; i < len; i++) {
          ret = tmp[lst[i]];
          if ( ! ret )  {return ret;}
          tmp = ret; 
        }
      }
      return ret;
    };

    /**
     * --- This is called from 'win-pop' directive to apply the default values that is not specified ...
     */
    service.fillMissingParams = function(specs, defaultSpecs) {
        // --- Fill out the missing values from the default window ---
        if ( ! specs.width )      {  specs.width       = defaultSpecs.width; }
        if ( ! specs.height )     {  specs.height      = defaultSpecs.height; }
        if ( ! specs.left )       {  specs.left        = defaultSpecs.left; }
        if ( ! specs.top )        {  specs.top         = defaultSpecs.top; }
        if ( ! specs.location )   {  specs.location    = defaultSpecs.location; }
        if ( ! specs.channelmode ) { specs.channelmode = defaultSpecs.channelmode; }
        if ( ! specs.fullscreen )  { specs.fullscreen  = defaultSpecs.fullscreen; }
        if ( ! specs.menubar )     { specs.menubar     = defaultSpecs.menubar; }
        if ( ! specs.resizable )   { specs.resizable   = defaultSpecs.resizable; }
        if ( ! specs.scrollbars )  { specs.scrollbars  = defaultSpecs.scrollbars; }
        if ( ! specs.status )      { specs.status      = defaultSpecs.status; }
        if ( ! specs.titlebar )    { specs.titlebar    = defaultSpecs.titlebar; }
        if ( ! specs.toolbar )     { specs.toolbar     = defaultSpecs.toolbar; }
      return specs;
    };

    /**
     * Convert 'specs' params to long text form, as required to pass to 'window.open()' method.
     * This is called from 'windowsPopup' module.
     */
    service.createSpecsParam = function( specs ) {
      var ret = '';
      ret += 'width='      + specs.width;
      ret += ',height='     + specs.height;
      ret += ',left='       + specs.left;
      ret += ',top='        + specs.top;
      ret += ',location='   + specs.location;
      ret += ',channelmode='+ specs.channelmode;
      ret += ',fullscreen=' + specs.fullscreen;
      ret += ',menubar='    + specs.menubar;
      ret += ',resizable='  + specs.resizable;
      ret += ',scrollbars=' + specs.scrollbars;
      ret += ',status='     + specs.status;
      ret += ',titlebar='   + specs.titlebar;
      ret += ',toolbar='    + specs.toolbar;
      return ret;
    };

    service.notDefined = function( val ) {
      if ( typeof val === 'undefined' || val === null || val === '') {
        return true;
      } else {
        return false;
      }
    };

    return service;
  })

  /**
   * This used Child window to get the data what the Parent provides
   * When the Child window loads, the 'window.opener' object should have the '$$$shareData' property.
   * The parent window puts it for the Child.
   */
  .factory('wnpFromParent', ['$window', 'wnpUtil', 'wnpToChild', function ($window, wnpUtil, wnpToChild) {
      var modalData;
      var modalBindingToBeCalledfncList = [];

      var shareData = null;
      var service = {};
      service.isData = false;
      if ( service.isData === false) {
          if ( $window.opener && $window.opener !== null && $window.opener.$$$shareData ) {
            shareData = $window.opener.$$$shareData;
            service.isData = true;
            // --- Set the fact that Child is loaded ---
            shareData.CONFIG.isWnpChildLoaded = true;

            // -- Call the onOpen fnc --
            if ( shareData.CONFIG  && shareData.CONFIG.wnpOnOpen ) {
              shareData.CONFIG.wnpOnOpen( shareData.CONFIG.wnpName );
            }
          }

          // -- For IE closing function may need to be from the Parent
          if ( ! $window.onbeforeunload ) {
            if ( $window.opener && $window.opener !== null && $window.opener.$$$onCloseingFnc ) {
              $window.onbeforeunload = $window.opener.$$$onCloseingFnc;
            }
          }
      }

      /**
       * -- This is called from the Child te get data from the Parent --
       */
      service.get = function() {
        return shareData.DATA;         
      };

      /**
       * -- This is called to get the Modal data
       */
      service.getModalData = function() {
        return modalData.DATA;
      };

      /**
       * -- This is called to registert Modal window binding functions ---
       */
      service.registerModalBindingToBeCalled = function(fnc) {
        modalBindingToBeCalledfncList.push(fnc);
      };
      /**
       * -- This is called to call ALL registert Modal window binding functions ---
       */
      service.bindModaldata = function() {
        var len = modalBindingToBeCalledfncList.length;
        for (var i =0; i < len; i++) {
          modalBindingToBeCalledfncList[i]();
        }
      };


      service.getWnpTitle = function() {
        return shareData.CONFIG.wnpTitle;
      }

      /**
       * -- This is called from the Popup service, when the window is opened. --
       */
      service.setDataToChild = function(wnpAutoUpdate, CONFIG) {
          var childOnCloseFnc = function() {
              CONFIG.wnpOnClose();
          };
          var childOnCloseFncWithWarning = function() {
              CONFIG.wnpOnClose();
            return 'This Popup window can not be reloaded. If you want to Exit, that is okay, go ahead.';
          };
          $window.$$$shareData = wnpToChild.applyAndGetDataForChild(wnpAutoUpdate, CONFIG);  
          $window.$$$onCloseingFnc = childOnCloseFnc;
      };

      /**
       * -- This is called from the Popup service, when Modal window is opened. --
       */
      service.setDataToModal = function(wnpAutoUpdate, CONFIG) {
        modalData = wnpToChild.applyAndGetDataForChild(wnpAutoUpdate, CONFIG);
      
      };



      /**
       * -- This is a 'static' method, called by the Parent to check if the Child window loaded ---
       */
      service.isChildWindowLoaded =  function(win) {
        var ret = false;
        if ( wnpUtil.notDefined(win.opener) === false &&
             wnpUtil.notDefined(win.opener.$$$shareData) === false &&
             wnpUtil.notDefined(win.opener.$$$shareData.CONFIG) === false ) {

          ret = win.opener.$$$shareData.CONFIG.isWnpChildLoaded;
        }
        return ret;
      };

      return service;
  }])

  /**
   * The 'wnpModel' directive adds by calling 'addOneSharedModel' the Model data to this factory service
   * The 'wnpOpenService' directive will get Model data by calling 'applyAndGetDataForChild' and set it to the Child Window ...
   * Getting the Model data from the scope must be defered until the user actually clicks the 'wnpPopup' directive.
   * Because of this this service creates and adds functions to a list for each Model data, and will call those functions 
   * when the 'applyAndGetDataForChild' method is called. 
   */
  .factory('wnpToChild', ['wnpUtil', '$timeout', function(wnpUtil, $timeout) {

      var dataToChildFncList = [];      
      var service = {};


      service.applyAndGetDataForChild = function(wnpAutoUpdate, CONFIG) {
        var ret = {};
        ret.DATA = {};
        ret.CONFIG = {};
        var len = dataToChildFncList.length;
        var inDta = {};
        for (var i =0; i < len; i++) {        
          inDta = dataToChildFncList[i]();
	        inDta.wnpAutoUpdate = wnpAutoUpdate;
          ret.DATA[inDta.name] = inDta;
        }
        ret.CONFIG = CONFIG;
        return ret;
      };

     service.addOneSharedModel = function(scope, popupBindVar, angModel, wnpUpdChild) {
        var fnc = function() {
          var unwatchParentFnc;
          var watchParentFnc;

          var inDta = {};
          inDta.name = popupBindVar;
          inDta.data = wnpUtil.getFromScope(scope, angModel);
          inDta.updateParentfnc = function(backMsg) {          
            if ( unwatchParentFnc ) {
              unwatchParentFnc();  // --- Stop watching 
            } 
            // --- updateParent --
            wnpUtil.setToScope(scope, angModel, backMsg);

            if ( watchParentFnc ) {
              unwatchParentFnc = watchParentFnc(); // --- Start Watching again, Eliminate circular dependency --
            }
            $timeout(function () {      
              scope.$apply();
            }, 300);
            
          };

          if ( wnpUtil.notDefined(wnpUpdChild)  || (wnpUpdChild != 'false' && wnpUpdChild != 'no' && wnpUpdChild != false) ) {
            inDta.updateChildfnc = function(forwardMsg) {
              // --- Dummy template method -- Child need to replace it ---
              console.log('This is a Dummy template method. The Child need to replace it.');
            };
            // --- Data Bind from Parent to Child --
            watchParentFnc = function() { 
              scope.$watch(angModel, function(newValue, oldValue) {
              try {
                if (newValue != oldValue) {
                  inDta.updateChildfnc(newValue);
                }
              } catch(err) {
              }
            });
            };
            // --- Call to Watch Parent to update Child ---
            unwatchParentFnc = watchParentFnc();  
          }


          return inDta;
        };
        // --- Add the function to be called when the user clickes on the link
        dataToChildFncList.push(fnc);

      };

      return service;
  }])

  /**
   * This service will open the popup windows, use it ONLY in a Parent
   * The 'wnpPopup' directive calls this service to open the Child Window, when the user clicks
   * This service keeps references for all opened Child windows 
   */
  .factory('wnpOpenService', ['$window', '$interval', 'wnpFromParent', 'wnpConfig', function ($window,  $interval, wnpFromParent, wnpConfig) {
      var service = {
        popWindows : {}
      };
      /**
       * --- One Window object ---
       */
      var OneWindow = function(wnpName) {
        this.wnpName = wnpName;
        this.popWdw = null;
        /**
         * Check if the popup is open or closed
         */
        this.isOpen = function() {
          if (this.popWdw !== null && this.popWdw.closed === false ) {
            return true;
          } else {
            return false;
          }
        };

        /**
         * Close the popup if open 
         */
        this.closeWdwfnc = function() {
          if (this.isOpen() === true ) {
            this.popWdw.close();
//            this.popWdw = null;
          }
        };
      };
      /**
       * Open the popup Window
       * @return true if the window was opened 
       */
      service.popWdwfnc = function( url, wnpName, specsText, wnpToggleOpenClose, wnpAutoUpdate, CONFIG) {
        var ret = false;  // -- return value

        var currWind = this.popWindows[wnpName];
        // -- Check if the window with that wnpName is open or not ---
        if ( ! currWind ) {
          // -- Create a new OneWindow object ---
          currWind = new OneWindow(wnpName);
          this.popWindows[wnpName] = currWind;
        }

        if ( currWind.isOpen() === true ) {
          currWind.popWdw.blur();          
          currWind.popWdw.focus();
          if ( wnpToggleOpenClose === 'true' ||  wnpToggleOpenClose === true ) {
            currWind.closeWdwfnc();
          } else {
            $window.alert('Dialog Window \"'+wnpName+'\" is already open. Close it to open a new one.'); 
          }          
        } else {
          // --- Set the data to Child --
          wnpFromParent.setDataToChild(wnpAutoUpdate, CONFIG);

          // --- Open Child Window ---
          currWind.popWdw = $window.open( url, wnpName, specsText, true );
          currWind.popWdw.blur();
          currWind.popWdw.focus();
          // --- I reached this far, so the window was opened successfully ---
          ret = true;

          // --- Check if the opened window has windowsPopup Angular Module there ---
          var popWinTimeOutMillisec = wnpConfig.popWinTimeOutMillisec;
          var loaded;
          var promize = $interval( function() {
            loaded = wnpFromParent.isChildWindowLoaded( currWind.popWdw);
 //           console.log('LODAEDDDDDD', loaded );
            if (loaded === true ) {
//                promize.resolve(true);
              $interval.cancel(promize);
            }
          }, 300, popWinTimeOutMillisec / 300, false );
          
          promize.then(function(result) {
//            console.log('Promize Result', result);
            // --- Failed to open in a certain time ---
            if ( loaded != true ) {
              $window.alert('WnpPopup Window faild to open. The URL is invalid, and/or AngularJS or windowsPopup module not loaded on the Child Window.');
              currWind.closeWdwfnc();
            } 
            $interval.cancel(promize);
          });
        }

        return ret;
      };  

      /**
       * Open the popup Window
       * @return true if the window was opened 
       */
      service.popModalfnc = function(wnpAutoUpdate, CONFIG) {

          // --- Set the data to Modal --
          wnpFromParent.setDataToModal(wnpAutoUpdate, CONFIG);

          wnpFromParent.bindModaldata();
      }


      return service;
  }])
        
  /**
   * This is the directive to popup a window with the left mouse click 
   */       
  .directive('wnpPopup', ['$window', '$parse', 'wnpOpenService', 'wnpConfig', 'wnpUtil', function ($window, $parse, wnpOpenService, wnpConfig, wnpUtil) {
    var ret = {};

    ret.restrict = 'EA';
    ret.template = '<span class=""/><a ng-transclude></a>';
    ret.replace  = false;
    ret.transclude = true;
    ret.scope = { 
          wnpOnOpen : '&',
          wnpOnClose: '&'
        };
    ret.link = function (scope, elem, attrs) {
        var iconElem = elem.children('span');
        elem.css({ 'cursor': 'pointer' });
        iconElem.addClass( wnpConfig.popupLinkCssClass ); 

        /**
         * -- Add a click event handler function ---
         */
        elem.bind('click', function () {
          // --- Call apply, they may use interpolation on the incoming attributes. --- 
          scope.$apply();

          var params = prepareParameters(attrs, elem);
          var wnpOnOpen  = scope.wnpOnOpen;
          var wnpOnClose = scope.wnpOnClose;
          var CONFIG = {};
          CONFIG.wnpName  = params.wnpName;
          CONFIG.wnpTitle = params.wnpTitle;
          CONFIG.isWnpChildLoaded - false;
          CONFIG.wnpOnClose =  function () {
            // -- Note the remove MUST be first ---
            iconElem.removeClass( wnpConfig.winOpenSignCssClass );
            iconElem.addClass   ( wnpConfig.popupLinkCssClass ); 

            // --- Call the User CallBack --
            if (wnpOnClose) {
              wnpOnClose({wnpName : params.wnpName});
              scope.$apply();
            }
          }; 
          CONFIG.wnpOnOpen = function () {
            // -- Note the remove MUST be first ---
            iconElem.removeClass( wnpConfig.popupLinkCssClass ); 
            iconElem.addClass   ( wnpConfig.winOpenSignCssClass );

            // --- Call the User CallBack --
            if (wnpOnOpen) {
              wnpOnOpen({wnpName : params.wnpName});
              scope.$apply();
            } 
          };

          // --- Call a service to difplay the popup  
          var ret = wnpOpenService.popWdwfnc( 
                                  params.wnpUrl,
                                  params.wnpName,
                                  params.specsText, 
                                  params.wnpToggleOpenClose,
                                  params.wnpAutoUpdate,
                                  CONFIG);

          if ( ret === true ) {
          //  console.log('Open successfully');
          }

      });
    };
    
    /**
     * Prepare parameters for 'popWdwfnc' function
     * @return true if the window was opened 
     */    
    var prepareParameters = function(attrs, elem) {
        var params = {};

        // --- This will be the 'specs' parameter to the 'window.open()' method ---
        var specs = {};

        // --- Getting the Attributes ---
        var url = attrs.url;
        var wnpToggleOpenClose = attrs.wnpToggleOpenClose;
        var wnpAutoUpdate      = attrs.wnpAutoUpdate;
        var wnpTitle           = attrs.wnpTitle;

        specs.width      = attrs.width;
        specs.height     = attrs.height;
        specs.left       = attrs.left;
        specs.top        = attrs.top;
        specs.location   = attrs.location;
        specs.channelmode= attrs.channelmode;
        specs.fullscreen = attrs.fullscreen;
        specs.menubar    = attrs.menubar;
        specs.resizable  = attrs.resizable;
        specs.scrollbars = attrs.scrollbars;
        specs.status     = attrs.status;
        specs.titlebar   = attrs.titlebar;
        specs.toolbar    = attrs.toolbar;

        // --- Get the default window spec configuration values from the Config Module ---
        var defaultParams = wnpConfig.getDefaultWindowParams();
        // --- See if the window wnpName is specified ---
        var wnpName = attrs.wnpName;
        if ( wnpName ) {
          // --- Is this a pre-defined window --
          var preDefWindow = wnpConfig.getPreWindow(wnpName);
          if ( preDefWindow ) {
            // --- Use the predefined window values --
            specs = wnpUtil.fillMissingParams(specs, preDefWindow.specs);
            if ( wnpUtil.notDefined(url)              ) { url  = preDefWindow.url; }
            if ( wnpUtil.notDefined(wnpToggleOpenClose) ) { wnpToggleOpenClose = preDefWindow.wnpToggleOpenClose; }
            if ( wnpUtil.notDefined(wnpAutoUpdate)       ) { wnpAutoUpdate     = preDefWindow.wnpAutoUpdate; }
            if ( wnpUtil.notDefined(wnpTitle)           ) { wnpTitle          = preDefWindow.wnpTitle; }
          }
        } else {
          // --- Get the default Window wnpName, and its parameters --
          wnpName = defaultParams.wnpName;
        }
        // --- Fill out the missing values from the default window ---
        specs = wnpUtil.fillMissingParams(specs, defaultParams.specs);

        var specsText = wnpUtil.createSpecsParam( specs );

        if ( wnpUtil.notDefined(url)              ) { url              = defaultParams.url; }
        if ( wnpUtil.notDefined(wnpToggleOpenClose) ) { wnpToggleOpenClose = defaultParams.wnpToggleOpenClose; }
        if ( wnpUtil.notDefined(wnpAutoUpdate)      ) { wnpAutoUpdate      = defaultParams.wnpAutoUpdate; }
        if ( wnpUtil.notDefined(wnpTitle)           ) { wnpTitle          = defaultParams.wnpTitle; }

        // --- If No Title specified, use the text of the link ---
        if ( wnpUtil.notDefined(wnpTitle)  ) { wnpTitle = elem.text()  ; }


        params.specs = specs;
        params.wnpName = wnpName;
        params.wnpUrl  = url;
        params.wnpTitle = wnpTitle;
        params.wnpToggleOpenClose = wnpToggleOpenClose;
        params.wnpAutoUpdate = wnpAutoUpdate;
        params.specsText = specsText;

        return params;
       };

    return ret;

  }])




 /**
 *
 * --- This directive used both in parent and child to bind date from Child to Parent
 *     A Child can be a parent for an other child. ---
 */
.directive('wnpModel', ['$rootScope','wnpFromParent', 'wnpToChild', 'wnpUtil', '$timeout', function ($rootScope,wnpFromParent, wnpToChild, wnpUtil, $timeout ) {

    var childParentBindingFnc = function( scope,
                                          shareData,
                                          popupBindVar,
                                          angModel ) {
      var item = shareData[popupBindVar];
      if ( item ) {
        // --- Set data to Child scope; from SharedData --
        wnpUtil.setToScope(scope, angModel, item.data); 
        $timeout(function () {
            scope.$apply();
        }, 0);

        // --- Set the function the Parent should call when data changes ---
        item.updateChildfnc = function(valueMsg) {
          $timeout( function() {
            wnpUtil.setToScope(scope, angModel, valueMsg);
          }, 0 );
  //                  scope.$apply();
        };

        if ( item.wnpAutoUpdate === true || item.wnpAutoUpdate === 'true'  ) {
          // --- Data Bind from Child to Parent --
          scope.$watch(angModel, function(newValue, oldValue) {
            item.updateParentfnc(newValue);
          });
          //console.log('CHILD');
        } else {
          // --- Store the ng-model name to get its value later ---
          item.$$$angModel = angModel;
        }
      }

    };


    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
     
            var popupBindVar = attrs.wnpModel;
            var angModel     = attrs.ngModel;
            var wnpUpdChild  = attrs.wnpUpdChild;

            var par;
            if ( elem.parents ) {
              par = elem.parents('div.wnp-modal');
            }

            // --- If this is part of a Model ; skip Data Binding --
            if ( wnpUtil.notDefined(par) == false &&  par.length > 0 ) {
              // --- This is used in a wnp-pop window ---
              // --- Register this element for Modal updtae
              wnpFromParent.registerModalBindingToBeCalled( function() {
                var shareD = wnpFromParent.getModalData();
                childParentBindingFnc(scope, shareD, popupBindVar, angModel);                
              });

            } else {
              // --- Binding from Child to Parent ---  
              if ( popupBindVar &&
                   angModel  &&
                   wnpFromParent.isData === true) {

                var shareData = wnpFromParent.get();

                childParentBindingFnc(scope, shareData, popupBindVar, angModel);

                // --- Get the CONFIG wnpTitle values ---
                var wnpTitle = wnpFromParent.getWnpTitle();
                $rootScope.wnpTitle = wnpTitle;
              }  

              // --- In parent 
              if ( popupBindVar && angModel ) {
                // --- Link data from Parent scope and defer it to Shared object
                wnpToChild.addOneSharedModel(scope, popupBindVar, angModel, wnpUpdChild);
              }
            }
        }
    };
  
  }])

/**
 *
 * --- Use this directive in a button or link, which if clicked the specified wnpModel 
 *     values will be used to update the parent Model.
 *     Possible values for 'wnpUpdateParent' attribute.
 *     wnpUpdateParent="ALL" -> to update parent with all wnpModel data
 *     wnpUpdateParent="<wnpModel1>,<wnpModel2>". for exmpl : wnpUpdateParent="item_one,item_two"
 *     will update parent only for those comma separated wnpModel values, when the button or link clicked.
 *     This directive used both in child to update Parent data
 *     A Child can be a parent for an other child. ---
 */
.directive('wnpUpdateParent', ['wnpFromParent', 'wnpUtil', function (wnpFromParent, wnpUtil) {
    return {
        restrict: 'AE',
        link: function (scope, elem, attrs) {
          elem.bind('click', function () {
            var shareData = wnpFromParent.get();
            var wnpUpdateParent = attrs.wnpUpdateParent;
            if ( ! wnpUpdateParent || wnpUpdateParent === 'ALL' || wnpUpdateParent === 'all' || wnpUpdateParent === 'All' ) {

              for (var property in shareData) {
                 if (shareData.hasOwnProperty(property)) {
                    var angModel = shareData[property].$$$angModel;
                    var newValue = wnpUtil.getFromScope(scope, angModel);
                    shareData[property].updateParentfnc(newValue);
                  }
              }

            } else if ( wnpUpdateParent.indexOf(',') < 0 ) {
              // --- Only One Item is there two bind --
              if ( shareData[wnpUpdateParent] ) {
                var angModel = shareData[wnpUpdateParent].$$$angModel;
                var newValue = wnpUtil.getFromScope(scope, angModel);
                shareData[wnpUpdateParent].updateParentfnc(newValue);
              }
            } else {
              // --- There is a list of bind variables ---
              var lst = wnpUpdateParent.split(',');
              for (var index in lst) {
                var elem = lst[index];
                if ( shareData[elem] ) {
                  var angModel = shareData[elem].$$$angModel;
                  var newValue = wnpUtil.getFromScope(scope, angModel);
                  shareData[elem].updateParentfnc(newValue);
                }
              }

            }
          
          });
        }
      }; 
  }])

// .filter('unsafe', function($sce) { return $sce.trustAsHtml; })

.directive('wnpPop', ['wnpUtil', 'wnpOpenService', 'wnpModalConfig', function (wnpUtil, wnpOpenService, wnpModalConfig) {
  var createModalName = function(name) {
    var ret = name.replace(/\//g, '').replace(/\./g, '');
    return ret;
  };
  var modalWind = {};
  var ret = {};
  ret.restrict ='EA';
//  ret.template = modalW;
//  ret.replace  = false;
//  ret.transclude = true;
  ret.compile = function (element, atttributes) {
    var modalElementTxt;
    var smallModalElement = '<!-- Small modal -->' +

      '<div class="$$$modalName$$$ modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="false">' +
  '<div class="modal-dialog modal-sm">' +
    '<div class="wnp-modal modal-content" > ' +
    '<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
            '<div ng-include="' + "'" + '$$$modalContentUrl$$$' + "'"  + '">' +
              '$$$errorMessage$$$' +
      '</div>' +
    '</div>' +
  '</div>' +
      '</div>';

    var predefinedUrl;
    var wnpPopName = atttributes.wnpPopName;
    if ( wnpPopName ) {
      modalElementTxt = wnpModalConfig.getPreModalElement(wnpPopName);
      predefinedUrl   = wnpModalConfig.getPreModalUrl(wnpPopName);
    } else {
     wnpPopName = '';
    }
    // --- Apply default if needed ---
    if ( wnpUtil.notDefined(modalElementTxt) ) {
      modalElementTxt = wnpModalConfig.getDefaultModalElement();
    }

    var modalContentUrl = atttributes.url;
    if ( wnpUtil.notDefined(modalContentUrl) ) {
      modalContentUrl = predefinedUrl;
      if ( wnpUtil.notDefined(modalContentUrl) ) {
        modalContentUrl = wnpModalConfig.getDefaultModalUrl();
      }
    } 
    // --- If no Model element and URL was found; Open an Error Modal ---
    if ( wnpUtil.notDefined(modalElementTxt) || wnpUtil.notDefined(modalContentUrl) ) {
      modalElementTxt = smallModalElement;
      modalElementTxt = modalElementTxt.replace('$$$errorMessage$$$','Error, no Modal parameters was found');
    }

    // --- Create a unique name; there should be one Modal DOM element for a URL and Name --
    //     This is for identifying the Model Element to open and close ---
    var uniqueName = createModalName(modalContentUrl) + wnpPopName;
    // --- Subtitute Name and Url in the Element string ---
    modalElementTxt = modalElementTxt.replace('$$$modalName$$$', uniqueName);
    modalElementTxt = modalElementTxt.replace('$$$modalContentUrl$$$', modalContentUrl);
    // --- There should be only one Modal created by URL and name for each unique urr
    //     The same Modal window can be opened from different positions --
    var currWind = modalWind[uniqueName];
    // -- Check if the window with that name  is defined or not ---
    if ( ! currWind ) {
      // -- Create a new Modal element ---
    var parent = element.parent();
      var modalElem = angular.element(modalElementTxt);
    parent.append(modalElem);
      // -- store it that Modal is created --
      modalWind[uniqueName] = uniqueName;
    }

    var linkFunction = function($scope, element, atttributes) {
          element.bind('contextmenu', function () {
            var CONFIG = {};
            CONFIG.wnpName = uniqueName;

            wnpOpenService.popModalfnc("true", CONFIG);

            element.parent().find('.'+ uniqueName).modal( {'backdrop' : 'static'} );
            return false;
          });
          // element.bind('click', function() {
          //   element.find('.modal').modal('hide');
          // });    
    }
    return linkFunction;
  };
  return ret;

}])

.directive('popContextModal', ['$window', '$http', 'wnpConfig', function ($window, $http, wnpConfig) {
    return {
      restrict: 'EA',
//        compile : function(tElement, attrs) {
//          var content_1 = angular.element('<script type="text/ng-template" id="modalPopup.html" src="views/modalPopup.html"></script>');
//          tElement.append(content_1);
//        },
        link : function (scope, elem, attrs) {
          $http.get('views/modalPopup.html').success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
console.log(data);              
              elem.append(data);
          }).error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
              // or server returns response with an error status.
console.log('ERROR');              
          });
          elem.bind('contextmenu', function () {

           elem.find('#basicModal').modal( {'backdrop' : 'static'} );

            });            
        }
    };
}]);
  
 



  
 
