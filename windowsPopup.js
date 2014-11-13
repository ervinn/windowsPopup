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
  .constant('contans', {
    'version': '0.0.2',
    'last date' : '2014-11-06'
   })
  
  .config( function () {

  })
  
  .factory('winPopUtil', function() {
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
      if ( typeof val === 'undefined' ) {
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
  .factory('parentDataToChild', function ($window, winPopUtil, parentSharedData) {
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
        return shareData;
      };

      /**
       * -- This is called from the Popup service, when the window is opened. --
       */
      service.setDataToChild = function(closeCallBack, autoUpdate) {
          var childOnCloseFnc = function() {
              closeCallBack();
          };
          var childOnCloseFncWithWarning = function() {
              closeCallBack();
            return 'This Popup window can not be reloaded. If you want to Exit, that is okay, go ahead.';
          };
          $window.$$$shareData = parentSharedData.applyAndGetDataForChild(autoUpdate);  
          $window.$$$onCloseingFnc = childOnCloseFnc;
      };
      return service;
  })

  /**
   * The 'popupLinkModel' directive adds by calling 'addOneSharedModel' the Model data to this factory service
   * The 'popupService' directive will get Model data by calling 'applyAndGetDataForChild' and set it to the Child Window ...
   * Getting the Model data from the scope must be defered until the user actually clicks the 'winPopup' directive.
   * Because of this this service creates and adds functions to a list for each Model data, and will call those functions 
   * when the 'applyAndGetDataForChild' method is called. 
   */
  .factory('parentSharedData', function(winPopUtil) {

      var dataToChildFncList = [];      
      var service = {};


      service.applyAndGetDataForChild = function(autoUpdate) {
        var ret = {};
        var len = dataToChildFncList.length;
        var inDta = {};
        for (var i =0; i < len; i++) {        
          inDta = dataToChildFncList[i]();
	  inDta.autoUpdate = autoUpdate;
          ret[inDta.name] = inDta;
        }
        return ret;
      };

     service.addOneSharedModel = function(scope, popupBindVar, angModel) {
        var fnc = function() {
          var inDta = {};
          inDta.name = popupBindVar;
          inDta.data = winPopUtil.getFromScope(scope, angModel); // JSON.stringify(scope.foo);
          inDta.callBackfnc = function(backMsg) {
            // $window.alert(backMsg);
            winPopUtil.setToScope(scope, angModel, backMsg);
            //scope[angModel] = backMsg;
            scope.$apply();
          };        
          return inDta;
        };

        // --- Add the function to be called when the user clickes on the link
        dataToChildFncList.push(fnc);
      };

      return service;
  })

  /**
   * This service will open the popup windows, use it ONLY in a Parent
   * The 'winPopup' directive calls this service to open the Child Window, when the user clicks
   * This service keeps references for all opened Child windows 
   */
  .factory('popupService', function ($window, parentDataToChild) {

      var service = {
        popWindows : {}
      };

      /**
       * --- One Window object ---
       */
      var OneWindow = function(name) {
        this.name = name;
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
      service.popWdwfnc = function( url, name, specsText, secondclickclose, autoUpdate, closeCallBack) {
        var ret = false;  // -- return value

        var currWind = this.popWindows[name];
        // -- Check if the window with that name is open or not ---
        if ( ! currWind ) {
          // -- Create a new OneWindow object ---
          currWind = new OneWindow(name);
          this.popWindows[name] = currWind;
        }

        if ( currWind.isOpen() === true ) {
          currWind.popWdw.blur();          
          currWind.popWdw.focus();
          if ( secondclickclose === 'true' ||  secondclickclose === true ) {
            currWind.closeWdwfnc();
          } else {
            $window.alert('Dialog Window \"'+name+'\" is already open. Close it to open a new one.'); 
          }          
        } else {
          // --- Open Child Window ---
          currWind.popWdw = $window.open( url, name, specsText, true );
          // --- Set the data to Child --
          parentDataToChild.setDataToChild(closeCallBack, autoUpdate);

          currWind.popWdw.blur();
          currWind.popWdw.focus();
          // --- I reached this far, so the window was opened successfully ---
          ret = true;
        }

        return ret;
      };     
      return service;
  })
        
  /**
   * This is the directive to popup a window with the left mouse click 
   */       
  .directive('winPopup', ['$window', 'popupService', 'wpopConfig', 'winPopUtil', function ($window, popupService, wpopConfig, winPopUtil) {
    return {
        restrict: 'E',
        template : '<span class=""/><a ng-transclude></a>',
        replace : false,
        transclude: true,
        link : function (scope, elem, attrs) {
            var iconElem = elem.children('span');
            elem.css({ 'cursor': 'pointer' });
            iconElem.addClass( wpopConfig.popupLinkCssClass ); 

            // --- This will be the 'specs' parameter to the 'window.open()' method ---
            var specs = {};

            // --- Getting the Attributes ---
            var url = attrs.url;
            var secondClickclose = attrs.secondClickClose;
            var autoUpdate       = attrs.autoUpdate;
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
            var defaultParams = wpopConfig.getDefaultWindowParams();
            // --- See if the window name is specified ---
            var winName = attrs.name;
            if ( winName ) {
              // --- Is this a pre-defined window --
              var preDefWindow = wpopConfig.getPreWindow(winName);
              if ( preDefWindow ) {
                // --- Use the predefined window values --
                specs = winPopUtil.fillMissingParams(specs, preDefWindow.specs);
                if ( winPopUtil.notDefined(url)              ) { url  = preDefWindow.url; }
                if ( winPopUtil.notDefined(secondClickclose) ) { secondClickclose = preDefWindow.secondClickclose; }
                if ( winPopUtil.notDefined(autoUpdate)       ) { autoUpdate       = preDefWindow.autoUpdate; }
              }
              // --- Fill out the missing values from the default window ---
              specs = winPopUtil.fillMissingParams(specs, defaultParams.specs);
            } else {
              // --- Get the default Window name, and its parameters --
              winName = defaultParams.name;
              specs = defaultParams.specs;
            }
            var specsText = winPopUtil.createSpecsParam( specs );

            if ( winPopUtil.notDefined(url)              ) { url              = defaultParams.url; }
            if ( winPopUtil.notDefined(secondClickclose) ) { secondClickclose = defaultParams.secondClickclose; }
            if ( winPopUtil.notDefined(autoUpdate)       ) { autoUpdate       = defaultParams.autoUpdate; }

            /**
             * -- Add a click event handler function ---
             */
            elem.bind('click', function () {
              // --- Call a service to difplay the popup             
              var ret = popupService.popWdwfnc( 
                                      url,
                                      winName,
                                      specsText, 
                                      secondClickclose,
                                      autoUpdate,
                                      function () {
                                        // -- Note the remove MUST be first ---
                                        iconElem.removeClass( wpopConfig.winOpenSignCssClass );
                                        iconElem.addClass   ( wpopConfig.popupLinkCssClass ); 
                                      } );
 
              if ( ret === true ) {
                // -- Note the remove MUST be first ---
                iconElem.removeClass( wpopConfig.popupLinkCssClass ); 
                iconElem.addClass   ( wpopConfig.winOpenSignCssClass );
              }

            });
        }
    };
    
  }])




 /**
 *
 * --- This directive used both in parent and child to bind date from Child to Parent
 *     A Child can be a parent for an other child. ---
 */
.directive('popupLinkModel', ['parentDataToChild', 'parentSharedData', 'winPopUtil', function (parentDataToChild, parentSharedData, winPopUtil) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
     
            var popupBindVar = attrs.popupLinkModel;
            var angModel     = attrs.ngModel;

            // --- Binding from Child to Parent ---  
            if ( popupBindVar &&
                 angModel  &&
                 parentDataToChild.isData === true) {

              var shareData = parentDataToChild.get();

                  if ( shareData[popupBindVar] ) {
                    // --- Set data to Child scope; from SharedData --                                    
                    winPopUtil.setToScope(scope, angModel, shareData[popupBindVar].data);

                    if ( shareData[popupBindVar].autoUpdate === true || shareData[popupBindVar].autoUpdate === 'true'  ) {
                      // --- Data Bind from Child to Parent --
                      scope.$watch(angModel, function(newValue, oldValue) {
                        shareData[popupBindVar].callBackfnc(newValue);
                      });
                      //console.log('CHILD');
                    } else {
            		      // --- Store the ng-model name to get its value later ---
            		      shareData[popupBindVar].$$$angModel = angModel;
                    }
                  }
            }  
            if ( popupBindVar && angModel ) {
              // --- Link data from Parent scope and defer it to Shared object
              parentSharedData.addOneSharedModel(scope, popupBindVar, angModel);
            }
        }
    };
  
  }])

/**
 *
 * --- This directive used both in child to update Parent data
 *     A Child can be a parent for an other child. ---
 */
.directive('wnpUpdateParent', ['parentDataToChild', 'winPopUtil', function (parentDataToChild, winPopUtil) {
    return {
        restrict: 'AE',
        link: function (scope, elem, attrs) {
          elem.bind('click', function () {
            var shareData = parentDataToChild.get();
            var wnpUpdateParent = attrs.wnpUpdateParent;
console.log('wnpUpdateParent=',wnpUpdateParent);
            if ( ! wnpUpdateParent || wnpUpdateParent === 'ALL' || wnpUpdateParent === 'all' || wnpUpdateParent === 'All' ) {

              for (var property in shareData) {
                 if (shareData.hasOwnProperty(property)) {
                    var angModel = shareData[property].$$$angModel;
                    var newValue = winPopUtil.getFromScope(scope, angModel);
                    shareData[property].callBackfnc(newValue);
                  }
              }

            } else if ( wnpUpdateParent.indexOf(',') < 0 ) {
              // --- Only One Item is there two bind --
              if ( shareData[wnpUpdateParent] ) {
                var angModel = shareData[wnpUpdateParent].$$$angModel;
                var newValue = winPopUtil.getFromScope(scope, angModel);
                shareData[wnpUpdateParent].callBackfnc(newValue);
              }
            } else {
              // --- There is a list of bind variables ---
              var lst = wnpUpdateParent.split(',');
console.log('lst=',lst);              
              for (var index in lst) {
console.log('lst[index]=',lst[index]);
                var elem = lst[index];
                if ( shareData[elem] ) {
                  var angModel = shareData[elem].$$$angModel;
                  var newValue = winPopUtil.getFromScope(scope, angModel);
                  shareData[elem].callBackfnc(newValue);
                }
              }

            }
          
          });
        }
      }; 
  }])

.directive('popContextMenu', ['$window', '$http', 'popupService', 'wpopConfig', function ($window, $http, popupService, wpopConfig) {
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

.directive('popContextModal', ['$window', '$http', 'wpopConfig', function ($window, $http, wpopConfig) {
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
  
 



  
 
