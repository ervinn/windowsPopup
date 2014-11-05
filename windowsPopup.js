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
    'version': '0.0.1',
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

    return service;
  })

  /**
   * This ONLY used in the Child window to get the data what the Parent provides
   * When the Child window loads, the 'window' object should have the '$$$shareData' property.
   * The parent window puts it for the Child.
   * For Chrome and Firefix it works, however for IT it does not, because of that 'sharedData' also put 
   * on the Parent 'window' object.
   * So, if the 'sharedData' is not in the 'window' object, we need to get it from the 'window.opener' .
   * TODO : revise this logic if possible (Think about it using 'document' object??). This is not nice... 
   */
  .factory('parentDataToChild', function ($window) {
      var service = {};
      service.isData = false;
      if ( service.isData === false) {
         if ( $window.$$$shareData ) {
            service.shareData = $window.$$$shareData;
            service.isData = true;
          // --- IE need need to use the Parent --  
          } else if ( $window.opener && $window.opener !== null && $window.opener.$$$shareData ) {
            service.shareData = $window.opener.$$$shareData;
            service.isData = true;
          }
          // -- For IE closing function may need to be from the Parent
          if ( ! $window.onbeforeunload ) {
            if ( $window.opener && $window.opener !== null && $window.opener.$$$onCloseingFnc ) {
              $window.onbeforeunload = $window.opener.$$$onCloseingFnc;
            }
          }
      }
      return service;
  })

  /**
   * The 'popupLinkModel' directive adds by calling 'addOneSharedModel' the Model data to this factory service
   * The 'popupService' directive will get Model data by calling 'getDataForChild' and set it to the Child Window ...
   * Getting the Model data from the scope must be defered until the user actually clicks the 'winPopup' directive.
   * Because of this this service creates and adds functions to a list for each Model data, and will call those functions 
   * when the 'getDataForChild' method is called. 
   */
  .factory('parentSharedData', function(winPopUtil) {

      var dataToChildFncList = [];
      var service = {};

      service.getDataForChild = function() {
        var ret = {};
        var len = dataToChildFncList.length;
        var inDta = {};
        for (var i =0; i < len; i++) {        
          inDta = dataToChildFncList[i]();
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
   * This service keeps references for all opened Child window 
   */
  .factory('popupService', function ($window, parentSharedData) {

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
      service.popWdwfnc = function( url, name, specsText, secondclickclose, closeCallBack) {
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

          var childOnCloseFnc = function() {
              closeCallBack();
          };
          var childOnCloseFncWithWarning = function() {
              closeCallBack();
            return 'This Popup window can not be reloaded. If you want to Exit, that is okay, go ahead.';
          };
 
  
          $window.$$$shareData = parentSharedData.getDataForChild();  // --- Put it here for IE < 11 --
          $window.$$$onCloseingFnc = childOnCloseFnc;
          currWind.popWdw = $window.open( url, name, specsText, true );
          //console.log( parentSharedData.getDataForChild());
          currWind.popWdw.$$$shareData = parentSharedData.getDataForChild();

          // --- I reached this far, so the window was opened successfully ---
          ret = true;

//          currWind.popWdw.window.onbeforeunload = childOnCloseFnc;

          currWind.popWdw.blur();
          currWind.popWdw.focus();

        }

        return ret;
      };     
      return service;
  })
        
  /**
   * This is the directive to popup a window with the left mouse click 
   */       
  .directive('winPopup', ['$window', 'popupService', 'wpopConfig', function ($window, popupService, wpopConfig) {
    return {
        restrict: 'E',
        template : '<span class=""/> <a ng-transclude> </a>',
        replace : false,
        transclude: true,
        link : function (scope, elem, attrs) {
            var iconElem = elem.children('span');
            elem.css({ 'cursor': 'pointer' });
            iconElem.addClass( wpopConfig.popupLinkCssClass ); 

            // --- This will be the 'specs' parameter to the 'window.open()' method ---
            var specs = {};
            var secondClickclose = attrs.secondClickclose;

            // --- Get the default window spec configuration values from the Config Module ---
            var defaultParams = wpopConfig.getDefaultWindowParams();
            // --- See if the window name is specified ---
            var winName = attrs.name;
            if ( ! winName ) {
              // --- Is this a pre-defined window --
              var preDefWindow = wpopConfig.getPreWindow(winName);
              if ( ! preDefWindow ) {
                // --- Use the predefined window values --
                specs = preDefWindow.specs;

                // --- Fill out the missing values from the default window ---
                specs = wpopConfig.fillMissingParamsFromDefault(specs, defaultParams.specs);                
              }

            } else {
              // --- Get the default Window name, and its parameters --
              winName = defaultParams.name;
              specs = defaultParams.specs;
            }
            var specsText = wpopConfig.createSpecsParam( specs );

            if ( ! secondClickclose ) { secondClickclose = defaultParams.secondClickclose; }


            /**
             * -- Add a click event handler function ---
             */
            elem.bind('click', function () {
              // --- Call a service to difplay the popup             
              var ret = popupService.popWdwfnc( 
                                      attrs.url,
                                      winName,
                                      specsText, 
                                      secondClickclose,
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
 *     NOTE: currently only one level of Child is supported, a Child canot have child.
 *     TODO: Make it possible to a Child to become a Parent. 
 */
.directive('popupLinkModel', ['$window', 'parentDataToChild', 'parentSharedData', 'winPopUtil', function ($window, parentDataToChild, parentSharedData, winPopUtil) {
    return {
        restrict: 'AE',
        link: function (scope, elem, attrs) {
     
            var popupBindVar = attrs.popupLinkModel;
            var angModel     = attrs.ngModel;

            // --- Binding from Child to Parent ---  
            
            if ( popupBindVar &&
                 angModel  &&
                 parentDataToChild.shareData &&
                 parentDataToChild.isData === true) {

                  if ( parentDataToChild.shareData[popupBindVar] ) {
                    // --- WE ARE IN CHILD application, no nesting allowed ---
                    // --- TODO: make it passible to multiple level of popups ---  

                    // --- Set Parent data to Child                                       
                    winPopUtil.setToScope(scope, angModel, parentDataToChild.shareData[popupBindVar].data);

                    // --- Data Bind from Child to Parent --
                    scope.$watch(angModel, function(newValue, oldValue) {
                      parentDataToChild.shareData[popupBindVar].callBackfnc(newValue);
                    });
                    //console.log('CHILD');
                  }
            } else if ( popupBindVar && angModel ) {
              // --- WE ARE IN PARENT application, no nesting allowed ---
              // --- TODO: make it passible to multiple level of popups ---  
              //console.log('PARENT='+angModel);

              parentSharedData.addOneSharedModel(scope, popupBindVar, angModel);

            }

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
  
 



  
 
