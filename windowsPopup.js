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
    'version': '0.0.3',
    'release_date' : '2014-11-19',
    'debugMode' : false
   })
  .config( function (wnpContans) {
    if (wnpContans.debugMode === true) {
      console.log('load windowsPopup AngularJs Module version=('+wnpContans.version+') Release Date('+wnpContans.release_date+')');
    }
  })
  
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
      if ( typeof val === 'undefined' || val === null) {
        return true;
      } else {
        return false;
      }
    };

    return service;
  })

  /**
   * This ONLY used in the Child window to get the data what the Parent provides
   * When the Child window loads, the 'window.opener' object should have the '$$$shareData' property.
   * The parent window puts it for the Child.
   */
  .factory('wnpFromParent', ['$window', 'wnpUtil', 'wnpToChild', function ($window, wnpUtil, wnpToChild) {
      var shareData = null;
      var service = {};
      service.isData = false;
      if ( service.isData === false) {

          if ( $window.opener && $window.opener !== null && $window.opener.$$$shareData ) {
            shareData = $window.opener.$$$shareData;
            service.isData = true;
          }
          
          // -- For IE closing function may need to be from the Parent
          if ( ! $window.onbeforeunload ) {
            if ( $window.opener && $window.opener !== null && $window.opener.$$$onCloseingFnc ) {
              $window.onbeforeunload = $window.opener.$$$onCloseingFnc;
            }
          }
      }

      /*
       * -- This is caled from the Child te get data from the Parent --
       */
      service.get = function() {
        return shareData.DATA;
         
      };

      service.getWnpTitle = function() {
        return shareData.CONFIG.wnpTitle;
      }

      /**
       * -- This is called from the Popup service, when the window is opened. --
       */
      service.setDataToChild = function(closeCallBack, wnpAutoUpdate, wnpTitle) {
          var childOnCloseFnc = function() {
              closeCallBack();
          };
          var childOnCloseFncWithWarning = function() {
              closeCallBack();
            return 'This Popup window can not be reloaded. If you want to Exit, that is okay, go ahead.';
          };
          $window.$$$shareData = wnpToChild.applyAndGetDataForChild(wnpAutoUpdate, wnpTitle);  
          $window.$$$onCloseingFnc = childOnCloseFnc;
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
  .factory('wnpToChild', ['wnpUtil', function(wnpUtil) {

      var dataToChildFncList = [];      
      var service = {};


      service.applyAndGetDataForChild = function(wnpAutoUpdate, wnpTitle) {
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
        ret.CONFIG.wnpTitle = wnpTitle;
        return ret;
      };

     service.addOneSharedModel = function(scope, popupBindVar, angModel, wnpUpdChild) {
        var fnc = function() {
          var inDta = {};
          inDta.name = popupBindVar;
          inDta.data = wnpUtil.getFromScope(scope, angModel);
          inDta.updateParentfnc = function(backMsg) {          
            wnpUtil.setToScope(scope, angModel, backMsg);
            scope.$apply();
          };

          if ( wnpUtil.notDefined(wnpUpdChild)  || (wnpUpdChild != 'false' && wnpUpdChild != 'no' && wnpUpdChild != false) ) {
            inDta.updateChildfnc = function(forwardMsg) {
              // --- Dummy template method -- Child need to replace it ---
              console.log('This is a Dummy template method. The Child need to replace it.');
            };
            // --- Data Bind from Parent to Child --
            scope.$watch(angModel, function(newValue, oldValue) {
              if (newValue != oldValue) {
                inDta.updateChildfnc(newValue);
              }
            });
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
  .factory('wnpOpenService', ['$window', 'wnpFromParent', function ($window, wnpFromParent) {
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
      service.popWdwfnc = function( url, wnpName, specsText, wnpToggleOpenClose, wnpAutoUpdate, wnpTitle, closeCallBack) {
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
          // --- Open Child Window ---
          currWind.popWdw = $window.open( url, wnpName, specsText, true );
          // --- Set the data to Child --
          wnpFromParent.setDataToChild(closeCallBack, wnpAutoUpdate, wnpTitle);

          currWind.popWdw.blur();
          currWind.popWdw.focus();
          // --- I reached this far, so the window was opened successfully ---
          ret = true;
        }

        return ret;
      };  

      return service;
  }])
        
  /**
   * This is the directive to popup a window with the left mouse click 
   */       
  .directive('wnpPopup', ['$window', 'wnpOpenService', 'wnpConfig', 'wnpUtil', function ($window, wnpOpenService, wnpConfig, wnpUtil) {
    var ret = {};

    ret.restrict = 'EA';
    ret.template = '<span class=""/><a ng-transclude></a>';
    ret.replace  = false;
    ret.transclude = true;
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

          // --- Call a service to difplay the popup  
          var ret = wnpOpenService.popWdwfnc( 
                                  params.wnpUrl,
                                  params.wnpName,
                                  params.specsText, 
                                  params.wnpToggleOpenClose,
                                  params.wnpAutoUpdate,
                                  params.wnpTitle,
                                  function () {
                                    // -- Note the remove MUST be first ---
                                    iconElem.removeClass( wnpConfig.winOpenSignCssClass );
                                    iconElem.addClass   ( wnpConfig.popupLinkCssClass ); 
                                  } );

          if ( ret === true ) {
            // -- Note the remove MUST be first ---
            iconElem.removeClass( wnpConfig.popupLinkCssClass ); 
            iconElem.addClass   ( wnpConfig.winOpenSignCssClass );
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
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
     
            var popupBindVar = attrs.wnpModel;
            var angModel     = attrs.ngModel;
            var wnpUpdChild  = attrs.wnpUpdChild;

            // --- Binding from Child to Parent ---  
            if ( popupBindVar &&
                 angModel  &&
                 wnpFromParent.isData === true) {

              var shareData = wnpFromParent.get();
              var item = shareData[popupBindVar];
              if ( item ) {
                // --- Set data to Child scope; from SharedData --                                    
                wnpUtil.setToScope(scope, angModel, item.data);

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

              // --- Get the CONFIG wnpTitle values ---
              var wnpTitle = wnpFromParent.getWnpTitle();
              $rootScope.wnpTitle = wnpTitle;
            }  

            if ( popupBindVar && angModel ) {
              // --- Link data from Parent scope and defer it to Shared object
              wnpToChild.addOneSharedModel(scope, popupBindVar, angModel, wnpUpdChild);
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

.directive('popContextMenu', ['$window', '$http', 'wnpOpenService', 'wnpConfig', function ($window, $http, wnpOpenService, wnpConfig) {
    return {
      restrict: 'EA',
        link : function (scope, elem, attrs) {
          $http.get('views/menuPopup.html').success(function(data, status, headers, config) {
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
$window.alert('Right click');
            elem.find('.dropdown-toggle').dropdown();
            return true;
          });
        }
    };
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
  
 



  
 
