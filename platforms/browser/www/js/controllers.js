/* global angular, document, window */
'use strict';

angular.module('starter.controllers', ['ngCordova'])

.controller('AppCtrl', function($http,$scope, $state, $ionicModal, $ionicPopover, $timeout,$ionicPopup, $cordovaBarcodeScanner,$stateParams) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
	$scope.nombre_real = window.localStorage.getItem('nombre_real');
    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.CerrarSesion = function(){
      localStorage.clear();
      $state.go('app.login',{},{
        reload: true
      });
    }

  

      $scope.scanBarcode = function() {
        $cordovaBarcodeScanner.scan().then(function(imageData) {
           
            console.log("Barcode Format -> " + imageData.format);
            console.log("Cancelled -> " + imageData.cancelled);


              $scope.id_usuarios = window.localStorage.getItem('id_usuarios');

  var id = $scope.id_usuarios;



       $http({
        method: 'POST',
        url: "http://netzasonepar.systemlog.cl/webservices/scan.php",
        dataType: JSON,
        data: $.param({
          'id_ot': imageData.text,'usuario_pod': id
        }), // pass in data as strings
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        } // set the headers so angular passing info as form data (not request payload)
      })
    .success(function(data) {
   
      if (data==0) {
        var alertPopup = $ionicPopup.alert({
           title: 'Alerta',
           template: 'Vuelva a escanear'
        });

      }else {



        navigator.notification.alert(
      'Se ha agregado exitosamente a su lista GE',// message
      null,             // callback
      '', // title
      'Aceptar'              // buttonName
             );

         window.location.reload(true);
     // $state.transitionTo("app.profile");
       
      }
    });



        }, function(error) {
            

             var alertPopup = $ionicPopup.alert({
           title: 'Alerta',
           template: 'Vuelva a escanear'
        });


        });
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($http, $scope, $state, $timeout, $stateParams, ionicMaterialInk, $ionicLoading, $ionicPopup,$ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false);
	$scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

	$scope.verificar = function(user,pass){
    $ionicLoading.show({
      template: 'Cargando...'
    })
		var usuario = user;
		var contra = pass;

		$http({
        method: 'POST',
        url: "http://netzasonepar.systemlog.cl/webservices/login.php",
        dataType: JSON,
        data: $.param({
          'user': usuario, "pass":contra
        }), // pass in data as strings
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        } // set the headers so angular passing info as form data (not request payload)
      })
		.success(function(data) {
      $ionicLoading.hide();

      if (data=="") {
        var alertPopup = $ionicPopup.alert({
           title: 'Alerta',
           template: 'Credenciales incorrectas'
        });

      }else {
			var datosAct = data;
			console.log(data);
  			window.localStorage.setItem('id_usuarios', datosAct[0]['id_usuarios'] );
			window.localStorage.setItem('nombre_completo', datosAct[0]['nombre_completo'] );
  			window.localStorage.setItem('id_perfil', datosAct[0]['id_perfil'] );
			window.localStorage.setItem('nombre_perfil', datosAct[0]['nombre_perfil'] );
  			window.localStorage.setItem('id_sucursal', datosAct[0]['id_sucursal'] );
			window.localStorage.setItem('nombre_sucursal', datosAct[0]['nombre_sucursal'] );
			
  			if(datosAct[0]['id_perfil'] == 1){

  				$state.go('app.profile',{},{
  					reload: false
  				});
  			}else{
			  var alertPopup = $ionicPopup.alert({
				 title: 'Alerta',
				 template: 'Usuario sin permisos'
			  });
  			}
      }

		});
	}
})

.controller('FriendsCtrl', function($scope, $stateParams,$http, $state,$timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Delay expansion
   /* $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);*/
	$scope.nombre_real = window.localStorage.getItem('nombre_real');
	$scope.cargo = window.localStorage.getItem('cargo');

	$scope.id_ot = window.localStorage.getItem('id_ot');
	var ot = $scope.id_ot;
	$http({
		method: 'POST',
		url: "http://netzasonepar.systemlog.cl/webservices/datosOT.php",
		dataType: JSON,
		data: $.param({
		  "id_ot":ot
		}),
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	.success(function(data) {
		
console.log(data);
    if(data!=""){
      var obj = data;
    $scope.objetivos = obj;

    }
    else{
     var obj = [{id_ot:'No hay Datos'}];
    $scope.objetivos = obj;
    }

		/*$scope.en = obj[0]['enunciado'];*/
	});


  // Set Motion
  ionicMaterialMotion.fadeSlideInRight();

  // Set Ink
  ionicMaterialInk.displayEffect();

	$scope.cargarInformacionDoc = function(id_documento){

		var documento = id_documento;
		window.localStorage.setItem('id_documento', documento );
		$state.go('app.activity',{},{
			reload: false
		});

	}
	  // Set Motion
  $timeout(function() {
      ionicMaterialMotion.slideUp({
          selector: '.slide-up'
      });
  }, 300);

  $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight({
          startVelocity: 3000
      });
  }, 800);

  // Set Ink
  ionicMaterialInk.displayEffect();


})

.controller('ProfileCtrl', function($scope, $stateParams, $http,$state, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);


	$scope.nombre_completo = window.localStorage.getItem('nombre_completo');
	$scope.nombre_sucursal = window.localStorage.getItem('nombre_sucursal');
	$scope.id_usuarios = window.localStorage.getItem('id_usuarios');
	$scope.nombre_perfil = window.localStorage.getItem('nombre_perfil');

	var id = $scope.id_usuarios;

	$http({
	method: 'POST',
	url: "http://netzasonepar.systemlog.cl/webservices/listadosGE.php",
	dataType: JSON,
	data: $.param({
	  'id': id
	}),
	headers: {
	  'Content-Type': 'application/x-www-form-urlencoded'
	}
	})
	.success(function(data) {


  

  if(data!=""){
      var evaluados = data;
  $scope.datos = evaluados;

    }
    else{
     var obj = [{id_documento:'No hay Datos'}];
     $scope.datos = obj;
    }

		

    

	});


  // Set Motion
  $timeout(function() {
      ionicMaterialMotion.slideUp({
          selector: '.slide-up'
      });
  }, 300);

  $timeout(function() {
      ionicMaterialMotion.fadeSlideInRight({
          startVelocity: 3000
      });
  }, 700);

  // Set Ink
  ionicMaterialInk.displayEffect();

	$scope.cargarObjetivos = function(id_ot){

		var ot = id_ot;
		window.localStorage.setItem('id_ot', ot );
		$state.go('app.friends',{},{
			reload: false
		});

	}

})

.controller('ActivityCtrl', function($location, $scope, $state, $window, $stateParams,$http, $timeout,$ionicModal,$ionicPopup, ionicMaterialMotion, ionicMaterialInk) {
    //$scope.$parent.showHeader();
 //Comentado por cristian
    
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');

    $ionicModal.fromTemplateUrl('contact-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
      $scope.modalDragStart = { active: true, value: 0 }
    })

    $scope.openModal = function() {
        $scope.modal.show()
      }

      $scope.cambiar = function(){

    $state.go('app.friends',{},{
      reload: false
    });

  }

   $scope.cambiar2 = function(){

    $state.go('app.profile',{},{
      reload: false
    });

  }

  
       /*
      $scope.guardar = function(comentario){
        var obj = window.localStorage.getItem('id_objetivo');

        if(comentario == "" || comentario == null){
          var alertPopup = $ionicPopup.alert({
            title: 'Alerta',
            template: 'Debe Ingresar un Comentario'
          });
        }else{
        $http({
          method: 'POST',
          url: "http://colun.gruposentte.cl/ws_agregarComentario.php",
          dataType: JSON,
          data: $.param({
            "obj":obj, "enunciado":comentario
          }),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .success(function(data) {
          var coment = data;
      		$scope.comentarios = coment;
          $scope.modal.hide();


          //Recargar El scope
          $scope.id_objetivo = window.localStorage.getItem('id_objetivo');
          var obj = $scope.id_objetivo;
          $http({
            method: 'POST',
            url: "http://colun.gruposentte.cl/ws_cargarComentarios.php",
            dataType: JSON,
            data: $.param({
              "obj":obj
            }),
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })
          .success(function(data) {
            var coment = data;
            $scope.comentarios = coment;
            var id_counter = 1;

            id_counter += 1;
            $scope.data=null;
            var alertPopup = $ionicPopup.alert({
               title: 'COMENTARIO AGREGADO'
            });
            //$scope.comentarios.push({data:$scope.data, sort_id:id_counter})


            //$state.reload();
            //window.location.reload(true);
          });
          //fin
        });
      }
      }
       */
      $scope.closeModal = function() {
        return $scope.modal.hide();
      };

      $scope.$on('$destroy', function() {

        $scope.modal.remove();
      });

	$scope.id_documento = window.localStorage.getItem('id_documento');
  $scope.id_ot = window.localStorage.getItem('id_ot');
	var doc = $scope.id_documento;
    var ot = $scope.id_ot;


	$http({
		method: 'POST',
		url: "http://netzasonepar.systemlog.cl/webservices/InformacionDoc.php",
		dataType: JSON,
		data: $.param({
		  "doc":doc,
      "id_ot":ot
		}),
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded'
		}
	})
	.success(function(data) {
    
		var info = data;
		$scope.informacion = info;
	});

  $timeout(function() {
      ionicMaterialMotion.fadeSlideIn({
          selector: '.animate-fade-slide-in .item'
      });
  }, 200);

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

});





/*!
 * ngCordova
 * v0.1.27-alpha
 * Copyright 2015 Drifty Co. http://drifty.com/
 * See LICENSE in this repository for license information
 */
!function(){angular.module("ngCordova",["ngCordova.plugins"]),angular.module("ngCordova.plugins.3dtouch",[]).factory("$cordova3DTouch",["$q",function(e){var n=[],r={},o=function(e){return function(n){for(var r in e)n.type===r&&e[r]()}};return{isAvailable:function(){var n=e.defer();return window.cordova?window.ThreeDeeTouch?window.ThreeDeeTouch.isAvailable(function(e){n.resolve(e)},function(e){n.reject(e)}):n.reject("Could not find 3D touch plugin"):n.reject("Not supported in browser"),n.promise},addQuickAction:function(t,i,a,c,u,s){var l=e.defer(),f={type:t,title:i,subtitle:u};return a&&(f.iconType=a),c&&(f.iconTemplate=c),this.isAvailable().then(function(){n.push(f),r[t]=s,window.ThreeDeeTouch.configureQuickActions(n),window.ThreeDeeTouch.onHomeIconPressed=o(r),l.resolve(n)},function(e){l.reject(e)}),l.promise},addQuickActionHandler:function(n,t){var i=e.defer();return this.isAvailable().then(function(){r[n]=t,window.ThreeDeeTouch.onHomeIconPressed=o(r),i.resolve(!0)},function(e){i.reject(e)}),i.promise},enableLinkPreview:function(){var n=e.defer();return this.isAvailable().then(function(){window.ThreeDeeTouch.enableLinkPreview(),n.resolve(!0)},function(e){n.reject(e)}),n.promise},addForceTouchHandler:function(n){var r=e.defer();return this.isAvailable().then(function(){window.ThreeDeeTouch.watchForceTouches(n),r.resolve(!0)},function(e){r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.actionSheet",[]).factory("$cordovaActionSheet",["$q","$window",function(e,n){return{show:function(r){var o=e.defer();return n.plugins.actionsheet.show(r,function(e){o.resolve(e)}),o.promise},hide:function(){return n.plugins.actionsheet.hide()}}}]),angular.module("ngCordova.plugins.adMob",[]).factory("$cordovaAdMob",["$q","$window",function(e,n){return{createBannerView:function(r){var o=e.defer();return n.plugins.AdMob.createBannerView(r,function(){o.resolve()},function(){o.reject()}),o.promise},createInterstitialView:function(r){var o=e.defer();return n.plugins.AdMob.createInterstitialView(r,function(){o.resolve()},function(){o.reject()}),o.promise},requestAd:function(r){var o=e.defer();return n.plugins.AdMob.requestAd(r,function(){o.resolve()},function(){o.reject()}),o.promise},showAd:function(r){var o=e.defer();return n.plugins.AdMob.showAd(r,function(){o.resolve()},function(){o.reject()}),o.promise},requestInterstitialAd:function(r){var o=e.defer();return n.plugins.AdMob.requestInterstitialAd(r,function(){o.resolve()},function(){o.reject()}),o.promise}}}]),angular.module("ngCordova.plugins.appAvailability",[]).factory("$cordovaAppAvailability",["$q",function(e){return{check:function(n){var r=e.defer();return appAvailability.check(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.appRate",[]).provider("$cordovaAppRate",[function(){this.setPreferences=function(e){e&&angular.isObject(e)&&(AppRate.preferences.useLanguage=e.language||null,AppRate.preferences.displayAppName=e.appName||"",AppRate.preferences.promptAgainForEachNewVersion=e.promptForNewVersion||!0,AppRate.preferences.openStoreInApp=e.openStoreInApp||!1,AppRate.preferences.usesUntilPrompt=e.usesUntilPrompt||3,AppRate.preferences.useCustomRateDialog=e.useCustomRateDialog||!1,AppRate.preferences.storeAppURL.ios=e.iosURL||null,AppRate.preferences.storeAppURL.android=e.androidURL||null,AppRate.preferences.storeAppURL.blackberry=e.blackberryURL||null,AppRate.preferences.storeAppURL.windows8=e.windowsURL||null)},this.setCustomLocale=function(e){var n={title:"Rate %@",message:"If you enjoy using %@, would you mind taking a moment to rate it? It won’t take more than a minute. Thanks for your support!",cancelButtonLabel:"No, Thanks",laterButtonLabel:"Remind Me Later",rateButtonLabel:"Rate It Now"};n=angular.extend(n,e),AppRate.preferences.customLocale=n},this.$get=["$q",function(e){return{promptForRating:function(n){var r=e.defer(),o=AppRate.promptForRating(n);return r.resolve(o),r.promise},navigateToAppStore:function(){var n=e.defer(),r=AppRate.navigateToAppStore();return n.resolve(r),n.promise},onButtonClicked:function(e){AppRate.preferences.callbacks.onButtonClicked=e.bind(this)},onRateDialogShow:function(e){AppRate.preferences.callbacks.onRateDialogShow=e.bind(this)}}}]}]),angular.module("ngCordova.plugins.appVersion",[]).factory("$cordovaAppVersion",["$q",function(e){return{getAppName:function(){var n=e.defer();return cordova.getAppVersion.getAppName(function(e){n.resolve(e)}),n.promise},getPackageName:function(){var n=e.defer();return cordova.getAppVersion.getPackageName(function(e){n.resolve(e)}),n.promise},getVersionNumber:function(){var n=e.defer();return cordova.getAppVersion.getVersionNumber(function(e){n.resolve(e)}),n.promise},getVersionCode:function(){var n=e.defer();return cordova.getAppVersion.getVersionCode(function(e){n.resolve(e)}),n.promise}}}]),angular.module("ngCordova.plugins.backgroundGeolocation",[]).factory("$cordovaBackgroundGeolocation",["$q","$window",function(e,n){return{init:function(){n.navigator.geolocation.getCurrentPosition(function(e){return e})},configure:function(r){this.init();var o=e.defer();return n.plugins.backgroundGeoLocation.configure(function(e){o.notify(e),n.plugins.backgroundGeoLocation.finish()},function(e){o.reject(e)},r),this.start(),o.promise},start:function(){var r=e.defer();return n.plugins.backgroundGeoLocation.start(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},stop:function(){var r=e.defer();return n.plugins.backgroundGeoLocation.stop(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.badge",[]).factory("$cordovaBadge",["$q",function(e){return{hasPermission:function(){var n=e.defer();return cordova.plugins.notification.badge.hasPermission(function(e){e?n.resolve(!0):n.reject("You do not have permission")}),n.promise},promptForPermission:function(){return cordova.plugins.notification.badge.promptForPermission()},set:function(n,r,o){var t=e.defer();return cordova.plugins.notification.badge.hasPermission(function(e){e?t.resolve(cordova.plugins.notification.badge.set(n,r,o)):t.reject("You do not have permission to set Badge")}),t.promise},get:function(){var n=e.defer();return cordova.plugins.notification.badge.hasPermission(function(e){e?cordova.plugins.notification.badge.get(function(e){n.resolve(e)}):n.reject("You do not have permission to get Badge")}),n.promise},clear:function(n,r){var o=e.defer();return cordova.plugins.notification.badge.hasPermission(function(e){e?o.resolve(cordova.plugins.notification.badge.clear(n,r)):o.reject("You do not have permission to clear Badge")}),o.promise},increase:function(n,r,o){var t=e.defer();return this.hasPermission().then(function(){t.resolve(cordova.plugins.notification.badge.increase(n,r,o))},function(){t.reject("You do not have permission to increase Badge")}),t.promise},decrease:function(n,r,o){var t=e.defer();return this.hasPermission().then(function(){t.resolve(cordova.plugins.notification.badge.decrease(n,r,o))},function(){t.reject("You do not have permission to decrease Badge")}),t.promise},configure:function(e){return cordova.plugins.notification.badge.configure(e)}}}]),angular.module("ngCordova.plugins.barcodeScanner",[]).factory("$cordovaBarcodeScanner",["$q",function(e){return{scan:function(n){var r=e.defer();return cordova.plugins.barcodeScanner.scan(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise},encode:function(n,r){var o=e.defer();return n=n||"TEXT_TYPE",cordova.plugins.barcodeScanner.encode(n,r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}}]),angular.module("ngCordova.plugins.batteryStatus",[]).factory("$cordovaBatteryStatus",["$rootScope","$window","$timeout",function(e,n,r){var o=function(n){r(function(){e.$broadcast("$cordovaBatteryStatus:status",n)})},t=function(n){r(function(){e.$broadcast("$cordovaBatteryStatus:critical",n)})},i=function(n){r(function(){e.$broadcast("$cordovaBatteryStatus:low",n)})};return document.addEventListener("deviceready",function(){navigator.battery&&(n.addEventListener("batterystatus",o,!1),n.addEventListener("batterycritical",t,!1),n.addEventListener("batterylow",i,!1))},!1),!0}]).run(["$injector",function(e){e.get("$cordovaBatteryStatus")}]),angular.module("ngCordova.plugins.beacon",[]).factory("$cordovaBeacon",["$window","$rootScope","$timeout","$q",function(e,n,r,o){var t=null,i=null,a=null,c=null,u=null,s=null,l=null,f=null;return document.addEventListener("deviceready",function(){if(e.cordova&&e.cordova.plugins&&e.cordova.plugins.locationManager){var o=new e.cordova.plugins.locationManager.Delegate;o.didDetermineStateForRegion=function(e){r(function(){n.$broadcast("$cordovaBeacon:didDetermineStateForRegion",e)}),t&&t(e)},o.didStartMonitoringForRegion=function(e){r(function(){n.$broadcast("$cordovaBeacon:didStartMonitoringForRegion",e)}),i&&i(e)},o.didExitRegion=function(e){r(function(){n.$broadcast("$cordovaBeacon:didExitRegion",e)}),a&&a(e)},o.didEnterRegion=function(e){r(function(){n.$broadcast("$cordovaBeacon:didEnterRegion",e)}),c&&c(e)},o.didRangeBeaconsInRegion=function(e){r(function(){n.$broadcast("$cordovaBeacon:didRangeBeaconsInRegion",e)}),u&&u(e)},o.peripheralManagerDidStartAdvertising=function(e){r(function(){n.$broadcast("$cordovaBeacon:peripheralManagerDidStartAdvertising",e)}),s&&s(e)},o.peripheralManagerDidUpdateState=function(e){r(function(){n.$broadcast("$cordovaBeacon:peripheralManagerDidUpdateState",e)}),l&&l(e)},o.didChangeAuthorizationStatus=function(e){r(function(){n.$broadcast("$cordovaBeacon:didChangeAuthorizationStatus",e)}),f&&f(e)},e.cordova.plugins.locationManager.setDelegate(o)}},!1),{setCallbackDidDetermineStateForRegion:function(e){t=e},setCallbackDidStartMonitoringForRegion:function(e){i=e},setCallbackDidExitRegion:function(e){a=e},setCallbackDidEnterRegion:function(e){c=e},setCallbackDidRangeBeaconsInRegion:function(e){u=e},setCallbackPeripheralManagerDidStartAdvertising:function(e){s=e},setCallbackPeripheralManagerDidUpdateState:function(e){l=e},setCallbackDidChangeAuthorizationStatus:function(e){f=e},createBeaconRegion:function(n,r,o,t,i){return o=o||void 0,t=t||void 0,new e.cordova.plugins.locationManager.BeaconRegion(n,r,o,t,i)},isBluetoothEnabled:function(){return o.when(e.cordova.plugins.locationManager.isBluetoothEnabled())},enableBluetooth:function(){return o.when(e.cordova.plugins.locationManager.enableBluetooth())},disableBluetooth:function(){return o.when(e.cordova.plugins.locationManager.disableBluetooth())},startMonitoringForRegion:function(n){return o.when(e.cordova.plugins.locationManager.startMonitoringForRegion(n))},stopMonitoringForRegion:function(n){return o.when(e.cordova.plugins.locationManager.stopMonitoringForRegion(n))},requestStateForRegion:function(n){return o.when(e.cordova.plugins.locationManager.requestStateForRegion(n))},startRangingBeaconsInRegion:function(n){return o.when(e.cordova.plugins.locationManager.startRangingBeaconsInRegion(n))},stopRangingBeaconsInRegion:function(n){return o.when(e.cordova.plugins.locationManager.stopRangingBeaconsInRegion(n))},getAuthorizationStatus:function(){return o.when(e.cordova.plugins.locationManager.getAuthorizationStatus())},requestWhenInUseAuthorization:function(){return o.when(e.cordova.plugins.locationManager.requestWhenInUseAuthorization())},requestAlwaysAuthorization:function(){return o.when(e.cordova.plugins.locationManager.requestAlwaysAuthorization())},getMonitoredRegions:function(){return o.when(e.cordova.plugins.locationManager.getMonitoredRegions())},getRangedRegions:function(){return o.when(e.cordova.plugins.locationManager.getRangedRegions())},isRangingAvailable:function(){return o.when(e.cordova.plugins.locationManager.isRangingAvailable())},isMonitoringAvailableForClass:function(n){return o.when(e.cordova.plugins.locationManager.isMonitoringAvailableForClass(n))},startAdvertising:function(n,r){return o.when(e.cordova.plugins.locationManager.startAdvertising(n,r))},stopAdvertising:function(){return o.when(e.cordova.plugins.locationManager.stopAdvertising())},isAdvertisingAvailable:function(){return o.when(e.cordova.plugins.locationManager.isAdvertisingAvailable())},isAdvertising:function(){return o.when(e.cordova.plugins.locationManager.isAdvertising())},disableDebugLogs:function(){return o.when(e.cordova.plugins.locationManager.disableDebugLogs())},enableDebugNotifications:function(){return o.when(e.cordova.plugins.locationManager.enableDebugNotifications())},disableDebugNotifications:function(){return o.when(e.cordova.plugins.locationManager.disableDebugNotifications())},enableDebugLogs:function(){return o.when(e.cordova.plugins.locationManager.enableDebugLogs())},appendToDeviceLog:function(n){return o.when(e.cordova.plugins.locationManager.appendToDeviceLog(n))}}}]),angular.module("ngCordova.plugins.ble",[]).factory("$cordovaBLE",["$q","$timeout","$log",function(e,n,r){return{scan:function(r,o){var t=e.defer();return ble.startScan(r,function(e){t.notify(e)},function(e){t.reject(e)}),n(function(){ble.stopScan(function(){t.resolve()},function(e){t.reject(e)})},1e3*o),t.promise},startScan:function(e,n,r){return ble.startScan(e,n,r)},stopScan:function(){var n=e.defer();return ble.stopScan(function(){n.resolve()},function(e){n.reject(e)}),n.promise},connect:function(n){var r=e.defer();return ble.connect(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},disconnect:function(n){var r=e.defer();return ble.disconnect(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},read:function(n,r,o){var t=e.defer();return ble.read(n,r,o,function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise},write:function(n,r,o,t){var i=e.defer();return ble.write(n,r,o,t,function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise},writeWithoutResponse:function(n,r,o,t){var i=e.defer();return ble.writeWithoutResponse(n,r,o,t,function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise},writeCommand:function(e,n,o,t){return r.warning("writeCommand is deprecated, use writeWithoutResponse"),this.writeWithoutResponse(e,n,o,t)},startNotification:function(e,n,r,o,t){return ble.startNotification(e,n,r,o,t)},stopNotification:function(n,r,o){var t=e.defer();return ble.stopNotification(n,r,o,function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise},isConnected:function(n){var r=e.defer();return ble.isConnected(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},enable:function(){var n=e.defer();return ble.enable(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},isEnabled:function(){var n=e.defer();return ble.isEnabled(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise}}}]),angular.module("ngCordova.plugins.bluetoothSerial",[]).factory("$cordovaBluetoothSerial",["$q","$window",function(e,n){return{connect:function(r){var o=e.defer(),t=e.defer(),i=!1;return n.bluetoothSerial.connect(r,function(){i=!0,o.resolve(t)},function(e){i===!1&&t.reject(e),o.reject(e)}),o.promise},connectInsecure:function(r){var o=e.defer();return n.bluetoothSerial.connectInsecure(r,function(){o.resolve()},function(e){o.reject(e)}),o.promise},disconnect:function(){var r=e.defer();return n.bluetoothSerial.disconnect(function(){r.resolve()},function(e){r.reject(e)}),r.promise},list:function(){var r=e.defer();return n.bluetoothSerial.list(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},discoverUnpaired:function(){var r=e.defer();return n.bluetoothSerial.discoverUnpaired(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},setDeviceDiscoveredListener:function(){var r=e.defer();return n.bluetoothSerial.setDeviceDiscoveredListener(function(e){r.notify(e)}),r.promise},clearDeviceDiscoveredListener:function(){n.bluetoothSerial.clearDeviceDiscoveredListener()},showBluetoothSettings:function(){var r=e.defer();return n.bluetoothSerial.showBluetoothSettings(function(){r.resolve()},function(e){r.reject(e)}),r.promise},isEnabled:function(){var r=e.defer();return n.bluetoothSerial.isEnabled(function(){r.resolve()},function(){r.reject()}),r.promise},enable:function(){var r=e.defer();return n.bluetoothSerial.enable(function(){r.resolve()},function(){r.reject()}),r.promise},isConnected:function(){var r=e.defer();return n.bluetoothSerial.isConnected(function(){r.resolve()},function(){r.reject()}),r.promise},available:function(){var r=e.defer();return n.bluetoothSerial.available(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},read:function(){var r=e.defer();return n.bluetoothSerial.read(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},readUntil:function(r){var o=e.defer();return n.bluetoothSerial.readUntil(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},write:function(r){var o=e.defer();return n.bluetoothSerial.write(r,function(){o.resolve()},function(e){o.reject(e)}),o.promise},subscribe:function(r){var o=e.defer();return n.bluetoothSerial.subscribe(r,function(e){o.notify(e)},function(e){o.reject(e)}),o.promise},subscribeRawData:function(){var r=e.defer();return n.bluetoothSerial.subscribeRawData(function(e){r.notify(e)},function(e){r.reject(e)}),r.promise},unsubscribe:function(){var r=e.defer();return n.bluetoothSerial.unsubscribe(function(){r.resolve()},function(e){r.reject(e)}),r.promise},unsubscribeRawData:function(){var r=e.defer();return n.bluetoothSerial.unsubscribeRawData(function(){r.resolve()},function(e){r.reject(e)}),r.promise},clear:function(){var r=e.defer();return n.bluetoothSerial.clear(function(){r.resolve()},function(e){r.reject(e)}),r.promise},readRSSI:function(){var r=e.defer();return n.bluetoothSerial.readRSSI(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.brightness",[]).factory("$cordovaBrightness",["$q","$window",function(e,n){return{get:function(){var r=e.defer();return n.cordova?n.cordova.plugins.brightness.getBrightness(function(e){r.resolve(e)},function(e){r.reject(e)}):r.reject("Not supported without cordova.js"),r.promise},set:function(r){var o=e.defer();return n.cordova?n.cordova.plugins.brightness.setBrightness(r,function(e){o.resolve(e)},function(e){o.reject(e)}):o.reject("Not supported without cordova.js"),o.promise},setKeepScreenOn:function(r){var o=e.defer();return n.cordova?n.cordova.plugins.brightness.setKeepScreenOn(r,function(e){o.resolve(e)},function(e){o.reject(e)}):o.reject("Not supported without cordova.js"),o.promise}}}]),angular.module("ngCordova.plugins.calendar",[]).factory("$cordovaCalendar",["$q","$window",function(e,n){return{createCalendar:function(r){var o=e.defer(),t=n.plugins.calendar.getCreateCalendarOptions();return"string"==typeof r?t.calendarName=r:t=angular.extend(t,r),n.plugins.calendar.createCalendar(t,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},deleteCalendar:function(r){var o=e.defer();return n.plugins.calendar.deleteCalendar(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},createEvent:function(r){var o=e.defer(),t={title:null,location:null,notes:null,startDate:null,endDate:null};return t=angular.extend(t,r),n.plugins.calendar.createEvent(t.title,t.location,t.notes,new Date(t.startDate),new Date(t.endDate),function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},createEventWithOptions:function(r){var o=e.defer(),t=[],i=window.plugins.calendar.getCalendarOptions(),a={title:null,location:null,notes:null,startDate:null,endDate:null};t=Object.keys(a);for(var c in r)-1===t.indexOf(c)?i[c]=r[c]:a[c]=r[c];return n.plugins.calendar.createEventWithOptions(a.title,a.location,a.notes,new Date(a.startDate),new Date(a.endDate),i,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},createEventInteractively:function(r){var o=e.defer(),t={title:null,location:null,notes:null,startDate:null,endDate:null};return t=angular.extend(t,r),n.plugins.calendar.createEventInteractively(t.title,t.location,t.notes,new Date(t.startDate),new Date(t.endDate),function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},createEventInNamedCalendar:function(r){var o=e.defer(),t={title:null,location:null,notes:null,startDate:null,endDate:null,calendarName:null};return t=angular.extend(t,r),n.plugins.calendar.createEventInNamedCalendar(t.title,t.location,t.notes,new Date(t.startDate),new Date(t.endDate),t.calendarName,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},findEvent:function(r){var o=e.defer(),t={title:null,location:null,notes:null,startDate:null,endDate:null};return t=angular.extend(t,r),n.plugins.calendar.findEvent(t.title,t.location,t.notes,new Date(t.startDate),new Date(t.endDate),function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},listEventsInRange:function(r,o){var t=e.defer();return n.plugins.calendar.listEventsInRange(r,o,function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise},listCalendars:function(){var r=e.defer();return n.plugins.calendar.listCalendars(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},findAllEventsInNamedCalendar:function(r){var o=e.defer();return n.plugins.calendar.findAllEventsInNamedCalendar(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},modifyEvent:function(r){var o=e.defer(),t={title:null,location:null,notes:null,startDate:null,endDate:null,newTitle:null,newLocation:null,newNotes:null,newStartDate:null,newEndDate:null};return t=angular.extend(t,r),n.plugins.calendar.modifyEvent(t.title,t.location,t.notes,new Date(t.startDate),new Date(t.endDate),t.newTitle,t.newLocation,t.newNotes,new Date(t.newStartDate),new Date(t.newEndDate),function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},deleteEvent:function(r){var o=e.defer(),t={newTitle:null,location:null,notes:null,startDate:null,endDate:null};return t=angular.extend(t,r),n.plugins.calendar.deleteEvent(t.newTitle,t.location,t.notes,new Date(t.startDate),new Date(t.endDate),function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}}]),angular.module("ngCordova.plugins.camera",[]).factory("$cordovaCamera",["$q",function(e){return{getPicture:function(n){var r=e.defer();return navigator.camera?(navigator.camera.getPicture(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise):(r.resolve(null),r.promise)},cleanup:function(){var n=e.defer();return navigator.camera.cleanup(function(){n.resolve()},function(e){n.reject(e)}),n.promise}}}]),angular.module("ngCordova.plugins.capture",[]).factory("$cordovaCapture",["$q",function(e){return{captureAudio:function(n){var r=e.defer();return navigator.device.capture?(navigator.device.capture.captureAudio(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise):(r.resolve(null),r.promise)},captureImage:function(n){var r=e.defer();return navigator.device.capture?(navigator.device.capture.captureImage(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise):(r.resolve(null),r.promise)},captureVideo:function(n){var r=e.defer();return navigator.device.capture?(navigator.device.capture.captureVideo(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise):(r.resolve(null),r.promise)}}}]),angular.module("ngCordova.plugins.cardIO",[]).provider("$cordovaNgCardIO",[function(){var e=["card_type","redacted_card_number","card_number","expiry_month","expiry_year","short_expiry_year","cvv","zip"],n={expiry:!0,cvv:!0,zip:!1,suppressManual:!1,suppressConfirm:!1,hideLogo:!0};this.setCardIOResponseFields=function(n){n&&angular.isArray(n)&&(e=n)},this.setScanerConfig=function(e){e&&angular.isObject(e)&&(n.expiry=e.expiry||!0,n.cvv=e.cvv||!0,n.zip=e.zip||!1,n.suppressManual=e.suppressManual||!1,n.suppressConfirm=e.suppressConfirm||!1,n.hideLogo=e.hideLogo||!0)},this.$get=["$q",function(r){return{scanCard:function(){var o=r.defer();return CardIO.scan(n,function(n){if(null===n)o.reject(null);else{for(var r={},t=0,i=e.length;i>t;t++){var a=e[t];"short_expiry_year"===a?r[a]=String(n.expiry_year).substr(2,2)||"":r[a]=n[a]||""}o.resolve(r)}},function(){o.reject(null)}),o.promise}}}]}]),angular.module("ngCordova.plugins.clipboard",[]).factory("$cordovaClipboard",["$q","$window",function(e,n){return{copy:function(r){var o=e.defer();return n.cordova.plugins.clipboard.copy(r,function(){o.resolve()},function(){o.reject()}),o.promise},paste:function(){var r=e.defer();return n.cordova.plugins.clipboard.paste(function(e){r.resolve(e)},function(){r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins.contacts",[]).factory("$cordovaContacts",["$q",function(e){return{save:function(n){var r=e.defer(),o=navigator.contacts.create(n);return o.save(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},remove:function(n){var r=e.defer(),o=navigator.contacts.create(n);return o.remove(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},clone:function(e){var n=navigator.contacts.create(e);return n.clone(e)},find:function(n){var r=e.defer(),o=n.fields||["id","displayName"];return delete n.fields,0===Object.keys(n).length?navigator.contacts.find(o,function(e){r.resolve(e)},function(e){r.reject(e)}):navigator.contacts.find(o,function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise},pickContact:function(){var n=e.defer();return navigator.contacts.pickContact(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise}}}]),angular.module("ngCordova.plugins.datePicker",[]).factory("$cordovaDatePicker",["$window","$q",function(e,n){return{show:function(r){var o=n.defer();return r=r||{date:new Date,mode:"date"},e.datePicker.show(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}}]),angular.module("ngCordova.plugins.device",[]).factory("$cordovaDevice",[function(){return{getDevice:function(){return device},getCordova:function(){return device.cordova},getModel:function(){return device.model},getName:function(){return device.name},getPlatform:function(){return device.platform},getUUID:function(){return device.uuid},getVersion:function(){return device.version},getManufacturer:function(){return device.manufacturer}}}]),angular.module("ngCordova.plugins.deviceMotion",[]).factory("$cordovaDeviceMotion",["$q",function(e){return{getCurrentAcceleration:function(){var n=e.defer();return angular.isUndefined(navigator.accelerometer)||!angular.isFunction(navigator.accelerometer.getCurrentAcceleration)?(n.reject("Device do not support watchAcceleration"),n.promise):(navigator.accelerometer.getCurrentAcceleration(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise)},watchAcceleration:function(n){var r=e.defer();if(angular.isUndefined(navigator.accelerometer)||!angular.isFunction(navigator.accelerometer.watchAcceleration))return r.reject("Device do not support watchAcceleration"),r.promise;var o=navigator.accelerometer.watchAcceleration(function(e){r.notify(e)},function(e){r.reject(e)},n);return r.promise.cancel=function(){navigator.accelerometer.clearWatch(o)},r.promise.clearWatch=function(e){navigator.accelerometer.clearWatch(e||o)},r.promise.watchID=o,r.promise},clearWatch:function(e){return navigator.accelerometer.clearWatch(e)}}}]),angular.module("ngCordova.plugins.deviceOrientation",[]).factory("$cordovaDeviceOrientation",["$q",function(e){var n={frequency:3e3};return{getCurrentHeading:function(){var n=e.defer();return navigator.compass?(navigator.compass.getCurrentHeading(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise):(n.reject("No compass on Device"),n.promise)},watchHeading:function(r){var o=e.defer();if(!navigator.compass)return o.reject("No compass on Device"),o.promise;var t=angular.extend(n,r),i=navigator.compass.watchHeading(function(e){o.notify(e)},function(e){o.reject(e)},t);return o.promise.cancel=function(){navigator.compass.clearWatch(i)},o.promise.clearWatch=function(e){navigator.compass.clearWatch(e||i)},o.promise.watchID=i,o.promise},clearWatch:function(e){return navigator.compass.clearWatch(e)}}}]),angular.module("ngCordova.plugins.dialogs",[]).factory("$cordovaDialogs",["$q","$window",function(e,n){return{alert:function(r,o,t){var i=e.defer();return n.navigator.notification?navigator.notification.alert(r,function(){i.resolve()},o,t):(n.alert(r),i.resolve()),i.promise},confirm:function(r,o,t){var i=e.defer();return n.navigator.notification?navigator.notification.confirm(r,function(e){i.resolve(e)},o,t):n.confirm(r)?i.resolve(1):i.resolve(2),i.promise},prompt:function(r,o,t,i){var a=e.defer();if(n.navigator.notification)navigator.notification.prompt(r,function(e){a.resolve(e)},o,t,i);else{var c=n.prompt(r,i);null!==c?a.resolve({input1:c,buttonIndex:1}):a.resolve({input1:c,buttonIndex:2})}return a.promise},beep:function(e){return navigator.notification.beep(e)},activityStart:function(n,r){var o=e.defer();return"android"===cordova.platformId?(navigator.notification.activityStart(r,n),o.resolve()):o.reject(n,r),o.promise},activityStop:function(){var n=e.defer();return"android"===cordova.platformId?(navigator.notification.activityStop(),n.resolve()):n.reject(),n.promise},progressStart:function(n,r){var o=e.defer();return"android"===cordova.platformId?(navigator.notification.progressStart(r,n),o.resolve()):o.reject(n,r),o.promise},progressStop:function(){var n=e.defer();return"android"===cordova.platformId?(navigator.notification.progressStop(),n.resolve()):n.reject(),n.promise},progressValue:function(n){var r=e.defer();return"android"===cordova.platformId?(navigator.notification.progressValue(n),r.resolve()):r.reject(n),r.promise}}}]),angular.module("ngCordova.plugins.emailComposer",[]).factory("$cordovaEmailComposer",["$q",function(e){return{isAvailable:function(){var n=e.defer();return cordova.plugins.email.isAvailable(function(e){e?n.resolve():n.reject()}),n.promise},open:function(n){var r=e.defer();return cordova.plugins.email.open(n,function(){r.reject()}),r.promise},addAlias:function(e,n){cordova.plugins.email.addAlias(e,n)}}}]),angular.module("ngCordova.plugins.facebook",[]).provider("$cordovaFacebook",[function(){this.browserInit=function(e,n){this.appID=e,this.appVersion=n||"v2.0",facebookConnectPlugin.browserInit(this.appID,this.appVersion)},this.$get=["$q",function(e){return{login:function(n){var r=e.defer();return facebookConnectPlugin.login(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},showDialog:function(n){var r=e.defer();return facebookConnectPlugin.showDialog(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},api:function(n,r){var o=e.defer();return facebookConnectPlugin.api(n,r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},getAccessToken:function(){var n=e.defer();return facebookConnectPlugin.getAccessToken(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},getLoginStatus:function(){var n=e.defer();return facebookConnectPlugin.getLoginStatus(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},logout:function(){var n=e.defer();return facebookConnectPlugin.logout(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise}}}]}]),angular.module("ngCordova.plugins.facebookAds",[]).factory("$cordovaFacebookAds",["$q","$window",function(e,n){return{setOptions:function(r){var o=e.defer();return n.FacebookAds.setOptions(r,function(){o.resolve()},function(){o.reject()}),o.promise},createBanner:function(r){var o=e.defer();return n.FacebookAds.createBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},removeBanner:function(){var r=e.defer();return n.FacebookAds.removeBanner(function(){r.resolve()},function(){r.reject()}),r.promise},showBanner:function(r){var o=e.defer();return n.FacebookAds.showBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},showBannerAtXY:function(r,o){var t=e.defer();return n.FacebookAds.showBannerAtXY(r,o,function(){t.resolve()},function(){t.reject()}),t.promise},hideBanner:function(){var r=e.defer();return n.FacebookAds.hideBanner(function(){r.resolve()},function(){r.reject()}),r.promise},prepareInterstitial:function(r){var o=e.defer();return n.FacebookAds.prepareInterstitial(r,function(){o.resolve()},function(){o.reject()}),o.promise},showInterstitial:function(){var r=e.defer();return n.FacebookAds.showInterstitial(function(){r.resolve()},function(){
r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins.file",[]).constant("$cordovaFileError",{1:"NOT_FOUND_ERR",2:"SECURITY_ERR",3:"ABORT_ERR",4:"NOT_READABLE_ERR",5:"ENCODING_ERR",6:"NO_MODIFICATION_ALLOWED_ERR",7:"INVALID_STATE_ERR",8:"SYNTAX_ERR",9:"INVALID_MODIFICATION_ERR",10:"QUOTA_EXCEEDED_ERR",11:"TYPE_MISMATCH_ERR",12:"PATH_EXISTS_ERR"}).provider("$cordovaFile",[function(){this.$get=["$q","$window","$cordovaFileError",function(e,n,r){return{getFreeDiskSpace:function(){var n=e.defer();return cordova.exec(function(e){n.resolve(e)},function(e){n.reject(e)},"File","getFreeDiskSpace",[]),n.promise},checkDir:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("directory cannot start with /");try{var a=o+t;n.resolveLocalFileSystemURL(a,function(e){e.isDirectory===!0?i.resolve(e):i.reject({code:13,message:"input is not a directory"})},function(e){e.message=r[e.code],i.reject(e)})}catch(c){c.message=r[c.code],i.reject(c)}return i.promise},checkFile:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("directory cannot start with /");try{var a=o+t;n.resolveLocalFileSystemURL(a,function(e){e.isFile===!0?i.resolve(e):i.reject({code:13,message:"input is not a file"})},function(e){e.message=r[e.code],i.reject(e)})}catch(c){c.message=r[c.code],i.reject(c)}return i.promise},createDir:function(o,t,i){var a=e.defer();/^\//.test(t)&&a.reject("directory cannot start with /"),i=i?!1:!0;var c={create:!0,exclusive:i};try{n.resolveLocalFileSystemURL(o,function(e){e.getDirectory(t,c,function(e){a.resolve(e)},function(e){e.message=r[e.code],a.reject(e)})},function(e){e.message=r[e.code],a.reject(e)})}catch(u){u.message=r[u.code],a.reject(u)}return a.promise},createFile:function(o,t,i){var a=e.defer();/^\//.test(t)&&a.reject("file-name cannot start with /"),i=i?!1:!0;var c={create:!0,exclusive:i};try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,c,function(e){a.resolve(e)},function(e){e.message=r[e.code],a.reject(e)})},function(e){e.message=r[e.code],a.reject(e)})}catch(u){u.message=r[u.code],a.reject(u)}return a.promise},removeDir:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getDirectory(t,{create:!1},function(e){e.remove(function(){i.resolve({success:!0,fileRemoved:e})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(a){a.message=r[a.code],i.reject(a)}return i.promise},removeFile:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,{create:!1},function(e){e.remove(function(){i.resolve({success:!0,fileRemoved:e})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(a){a.message=r[a.code],i.reject(a)}return i.promise},removeRecursively:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getDirectory(t,{create:!1},function(e){e.removeRecursively(function(){i.resolve({success:!0,fileRemoved:e})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(a){a.message=r[a.code],i.reject(a)}return i.promise},writeFile:function(o,t,i,a){var c=e.defer();/^\//.test(t)&&c.reject("file-name cannot start with /"),a=a?!1:!0;var u={create:!0,exclusive:a};try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,u,function(e){e.createWriter(function(e){u.append===!0&&e.seek(e.length),u.truncate&&e.truncate(u.truncate),e.onwriteend=function(e){this.error?c.reject(this.error):c.resolve(e)},e.write(i),c.promise.abort=function(){e.abort()}})},function(e){e.message=r[e.code],c.reject(e)})},function(e){e.message=r[e.code],c.reject(e)})}catch(s){s.message=r[s.code],c.reject(s)}return c.promise},writeExistingFile:function(o,t,i){var a=e.defer();/^\//.test(t)&&a.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,{create:!1},function(e){e.createWriter(function(e){e.seek(e.length),e.onwriteend=function(e){this.error?a.reject(this.error):a.resolve(e)},e.write(i),a.promise.abort=function(){e.abort()}})},function(e){e.message=r[e.code],a.reject(e)})},function(e){e.message=r[e.code],a.reject(e)})}catch(c){c.message=r[c.code],a.reject(c)}return a.promise},readAsText:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,{create:!1},function(e){e.file(function(e){var n=new FileReader;n.onloadend=function(e){void 0!==e.target.result||null!==e.target.result?i.resolve(e.target.result):void 0!==e.target.error||null!==e.target.error?i.reject(e.target.error):i.reject({code:null,message:"READER_ONLOADEND_ERR"})},n.readAsText(e)})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(a){a.message=r[a.code],i.reject(a)}return i.promise},readAsDataURL:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,{create:!1},function(e){e.file(function(e){var n=new FileReader;n.onloadend=function(e){void 0!==e.target.result||null!==e.target.result?i.resolve(e.target.result):void 0!==e.target.error||null!==e.target.error?i.reject(e.target.error):i.reject({code:null,message:"READER_ONLOADEND_ERR"})},n.readAsDataURL(e)})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(a){a.message=r[a.code],i.reject(a)}return i.promise},readAsBinaryString:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,{create:!1},function(e){e.file(function(e){var n=new FileReader;n.onloadend=function(e){void 0!==e.target.result||null!==e.target.result?i.resolve(e.target.result):void 0!==e.target.error||null!==e.target.error?i.reject(e.target.error):i.reject({code:null,message:"READER_ONLOADEND_ERR"})},n.readAsBinaryString(e)})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(a){a.message=r[a.code],i.reject(a)}return i.promise},readAsArrayBuffer:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,{create:!1},function(e){e.file(function(e){var n=new FileReader;n.onloadend=function(e){void 0!==e.target.result||null!==e.target.result?i.resolve(e.target.result):void 0!==e.target.error||null!==e.target.error?i.reject(e.target.error):i.reject({code:null,message:"READER_ONLOADEND_ERR"})},n.readAsArrayBuffer(e)})},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(a){a.message=r[a.code],i.reject(a)}return i.promise},moveFile:function(r,o,t,i){var a=e.defer();i=i||o,(/^\//.test(o)||/^\//.test(i))&&a.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(r,function(e){e.getFile(o,{create:!1},function(e){n.resolveLocalFileSystemURL(t,function(n){e.moveTo(n,i,function(e){a.resolve(e)},function(e){a.reject(e)})},function(e){a.reject(e)})},function(e){a.reject(e)})},function(e){a.reject(e)})}catch(c){a.reject(c)}return a.promise},moveDir:function(r,o,t,i){var a=e.defer();i=i||o,(/^\//.test(o)||/^\//.test(i))&&a.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(r,function(e){e.getDirectory(o,{create:!1},function(e){n.resolveLocalFileSystemURL(t,function(n){e.moveTo(n,i,function(e){a.resolve(e)},function(e){a.reject(e)})},function(e){a.reject(e)})},function(e){a.reject(e)})},function(e){a.reject(e)})}catch(c){a.reject(c)}return a.promise},copyDir:function(o,t,i,a){var c=e.defer();a=a||t,(/^\//.test(t)||/^\//.test(a))&&c.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getDirectory(t,{create:!1,exclusive:!1},function(e){n.resolveLocalFileSystemURL(i,function(n){e.copyTo(n,a,function(e){c.resolve(e)},function(e){e.message=r[e.code],c.reject(e)})},function(e){e.message=r[e.code],c.reject(e)})},function(e){e.message=r[e.code],c.reject(e)})},function(e){e.message=r[e.code],c.reject(e)})}catch(u){u.message=r[u.code],c.reject(u)}return c.promise},copyFile:function(o,t,i,a){var c=e.defer();a=a||t,/^\//.test(t)&&c.reject("file-name cannot start with /");try{n.resolveLocalFileSystemURL(o,function(e){e.getFile(t,{create:!1,exclusive:!1},function(e){n.resolveLocalFileSystemURL(i,function(n){e.copyTo(n,a,function(e){c.resolve(e)},function(e){e.message=r[e.code],c.reject(e)})},function(e){e.message=r[e.code],c.reject(e)})},function(e){e.message=r[e.code],c.reject(e)})},function(e){e.message=r[e.code],c.reject(e)})}catch(u){u.message=r[u.code],c.reject(u)}return c.promise},readFileMetadata:function(o,t){var i=e.defer();/^\//.test(t)&&i.reject("directory cannot start with /");try{var a=o+t;n.resolveLocalFileSystemURL(a,function(e){e.file(function(e){i.resolve(e)},function(e){e.message=r[e.code],i.reject(e)})},function(e){e.message=r[e.code],i.reject(e)})}catch(c){c.message=r[c.code],i.reject(c)}return i.promise}}}]}]),angular.module("ngCordova.plugins.fileOpener2",[]).factory("$cordovaFileOpener2",["$q",function(e){return{open:function(n,r){var o=e.defer();return cordova.plugins.fileOpener2.open(n,r,{error:function(e){o.reject(e)},success:function(){o.resolve()}}),o.promise},uninstall:function(n){var r=e.defer();return cordova.plugins.fileOpener2.uninstall(n,{error:function(e){r.reject(e)},success:function(){r.resolve()}}),r.promise},appIsInstalled:function(n){var r=e.defer();return cordova.plugins.fileOpener2.appIsInstalled(n,{success:function(e){r.resolve(e)}}),r.promise}}}]),angular.module("ngCordova.plugins.fileTransfer",[]).factory("$cordovaFileTransfer",["$q","$timeout",function(e,n){return{download:function(r,o,t,i){var a=e.defer(),c=new FileTransfer,u=t&&t.encodeURI===!1?r:encodeURI(r);return t&&void 0!==t.timeout&&null!==t.timeout&&(n(function(){c.abort()},t.timeout),t.timeout=null),c.onprogress=function(e){a.notify(e)},a.promise.abort=function(){c.abort()},c.download(u,o,a.resolve,a.reject,i,t),a.promise},upload:function(r,o,t,i){var a=e.defer(),c=new FileTransfer,u=t&&t.encodeURI===!1?r:encodeURI(r);return t&&void 0!==t.timeout&&null!==t.timeout&&(n(function(){c.abort()},t.timeout),t.timeout=null),c.onprogress=function(e){a.notify(e)},a.promise.abort=function(){c.abort()},c.upload(o,u,a.resolve,a.reject,t,i),a.promise}}}]),angular.module("ngCordova.plugins.flashlight",[]).factory("$cordovaFlashlight",["$q","$window",function(e,n){return{available:function(){var r=e.defer();return n.plugins.flashlight.available(function(e){r.resolve(e)}),r.promise},switchOn:function(){var r=e.defer();return n.plugins.flashlight.switchOn(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},switchOff:function(){var r=e.defer();return n.plugins.flashlight.switchOff(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},toggle:function(){var r=e.defer();return n.plugins.flashlight.toggle(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.flurryAds",[]).factory("$cordovaFlurryAds",["$q","$window",function(e,n){return{setOptions:function(r){var o=e.defer();return n.FlurryAds.setOptions(r,function(){o.resolve()},function(){o.reject()}),o.promise},createBanner:function(r){var o=e.defer();return n.FlurryAds.createBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},removeBanner:function(){var r=e.defer();return n.FlurryAds.removeBanner(function(){r.resolve()},function(){r.reject()}),r.promise},showBanner:function(r){var o=e.defer();return n.FlurryAds.showBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},showBannerAtXY:function(r,o){var t=e.defer();return n.FlurryAds.showBannerAtXY(r,o,function(){t.resolve()},function(){t.reject()}),t.promise},hideBanner:function(){var r=e.defer();return n.FlurryAds.hideBanner(function(){r.resolve()},function(){r.reject()}),r.promise},prepareInterstitial:function(r){var o=e.defer();return n.FlurryAds.prepareInterstitial(r,function(){o.resolve()},function(){o.reject()}),o.promise},showInterstitial:function(){var r=e.defer();return n.FlurryAds.showInterstitial(function(){r.resolve()},function(){r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins.ga",[]).factory("$cordovaGA",["$q","$window",function(e,n){return{init:function(r,o){var t=e.defer();return o=o>=0?o:10,n.plugins.gaPlugin.init(function(e){t.resolve(e)},function(e){t.reject(e)},r,o),t.promise},trackEvent:function(r,o,t,i,a,c){var u=e.defer();return n.plugins.gaPlugin.trackEvent(function(e){u.resolve(e)},function(e){u.reject(e)},t,i,a,c),u.promise},trackPage:function(r,o,t){var i=e.defer();return n.plugins.gaPlugin.trackPage(function(e){i.resolve(e)},function(e){i.reject(e)},t),i.promise},setVariable:function(r,o,t,i){var a=e.defer();return n.plugins.gaPlugin.setVariable(function(e){a.resolve(e)},function(e){a.reject(e)},t,i),a.promise},exit:function(){var r=e.defer();return n.plugins.gaPlugin.exit(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.geolocation",[]).factory("$cordovaGeolocation",["$q",function(e){return{getCurrentPosition:function(n){var r=e.defer();return navigator.geolocation.getCurrentPosition(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise},watchPosition:function(n){var r=e.defer(),o=navigator.geolocation.watchPosition(function(e){r.notify(e)},function(e){r.reject(e)},n);return r.promise.cancel=function(){navigator.geolocation.clearWatch(o)},r.promise.clearWatch=function(e){navigator.geolocation.clearWatch(e||o)},r.promise.watchID=o,r.promise},clearWatch:function(e){return navigator.geolocation.clearWatch(e)}}}]),angular.module("ngCordova.plugins.globalization",[]).factory("$cordovaGlobalization",["$q",function(e){return{getPreferredLanguage:function(){var n=e.defer();return navigator.globalization.getPreferredLanguage(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},getLocaleName:function(){var n=e.defer();return navigator.globalization.getLocaleName(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},getFirstDayOfWeek:function(){var n=e.defer();return navigator.globalization.getFirstDayOfWeek(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},dateToString:function(n,r){var o=e.defer();return navigator.globalization.dateToString(n,function(e){o.resolve(e)},function(e){o.reject(e)},r),o.promise},stringToDate:function(n,r){var o=e.defer();return navigator.globalization.stringToDate(n,function(e){o.resolve(e)},function(e){o.reject(e)},r),o.promise},getDatePattern:function(n){var r=e.defer();return navigator.globalization.getDatePattern(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise},getDateNames:function(n){var r=e.defer();return navigator.globalization.getDateNames(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise},isDayLightSavingsTime:function(n){var r=e.defer();return navigator.globalization.isDayLightSavingsTime(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},numberToString:function(n,r){var o=e.defer();return navigator.globalization.numberToString(n,function(e){o.resolve(e)},function(e){o.reject(e)},r),o.promise},stringToNumber:function(n,r){var o=e.defer();return navigator.globalization.stringToNumber(n,function(e){o.resolve(e)},function(e){o.reject(e)},r),o.promise},getNumberPattern:function(n){var r=e.defer();return navigator.globalization.getNumberPattern(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise},getCurrencyPattern:function(n){var r=e.defer();return navigator.globalization.getCurrencyPattern(n,function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.googleAds",[]).factory("$cordovaGoogleAds",["$q","$window",function(e,n){return{setOptions:function(r){var o=e.defer();return n.AdMob.setOptions(r,function(){o.resolve()},function(){o.reject()}),o.promise},createBanner:function(r){var o=e.defer();return n.AdMob.createBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},removeBanner:function(){var r=e.defer();return n.AdMob.removeBanner(function(){r.resolve()},function(){r.reject()}),r.promise},showBanner:function(r){var o=e.defer();return n.AdMob.showBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},showBannerAtXY:function(r,o){var t=e.defer();return n.AdMob.showBannerAtXY(r,o,function(){t.resolve()},function(){t.reject()}),t.promise},hideBanner:function(){var r=e.defer();return n.AdMob.hideBanner(function(){r.resolve()},function(){r.reject()}),r.promise},prepareInterstitial:function(r){var o=e.defer();return n.AdMob.prepareInterstitial(r,function(){o.resolve()},function(){o.reject()}),o.promise},showInterstitial:function(){var r=e.defer();return n.AdMob.showInterstitial(function(){r.resolve()},function(){r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins.googleAnalytics",[]).factory("$cordovaGoogleAnalytics",["$q","$window",function(e,n){return{startTrackerWithId:function(r){var o=e.defer();return n.analytics.startTrackerWithId(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},setUserId:function(r){var o=e.defer();return n.analytics.setUserId(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},debugMode:function(){var r=e.defer();return n.analytics.debugMode(function(e){r.resolve(e)},function(){r.reject()}),r.promise},trackView:function(r){var o=e.defer();return n.analytics.trackView(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},addCustomDimension:function(r,o){var t=e.defer(),i=parseInt(r,10);return isNaN(i)&&t.reject('Parameter "key" must be an integer.'),n.analytics.addCustomDimension(i,o,function(){t.resolve()},function(e){t.reject(e)}),t.promise},trackEvent:function(r,o,t,i){var a=e.defer();return n.analytics.trackEvent(r,o,t,i,function(e){a.resolve(e)},function(e){a.reject(e)}),a.promise},trackException:function(r,o){var t=e.defer();return n.analytics.trackException(r,o,function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise},trackTiming:function(r,o,t,i){var a=e.defer();return n.analytics.trackTiming(r,o,t,i,function(e){a.resolve(e)},function(e){a.reject(e)}),a.promise},addTransaction:function(r,o,t,i,a,c){var u=e.defer();return n.analytics.addTransaction(r,o,t,i,a,c,function(e){u.resolve(e)},function(e){u.reject(e)}),u.promise},addTransactionItem:function(r,o,t,i,a,c,u){var s=e.defer();return n.analytics.addTransactionItem(r,o,t,i,a,c,u,function(e){s.resolve(e)},function(e){s.reject(e)}),s.promise}}}]),angular.module("ngCordova.plugins.googleMap",[]).factory("$cordovaGoogleMap",["$q","$window",function(e,n){var r=null;return{getMap:function(o){var t=e.defer();if(n.plugin.google.maps){var i=document.getElementById("map_canvas");r=n.plugin.google.maps.Map.getMap(o),r.setDiv(i),t.resolve(r)}else t.reject(null);return t.promise},isMapLoaded:function(){return!!r},addMarker:function(n){var o=e.defer();return r.addMarker(n,function(e){o.resolve(e)}),o.promise},getMapTypeIds:function(){return n.plugin.google.maps.mapTypeId},setVisible:function(n){var o=e.defer();return r.setVisible(n),o.promise},cleanup:function(){r=null}}}]),angular.module("ngCordova.plugins.googlePlayGame",[]).factory("$cordovaGooglePlayGame",["$q",function(e){return{auth:function(){var n=e.defer();return googleplaygame.auth(function(e){return n.resolve(e)},function(e){return n.reject(e)}),n.promise},signout:function(){var n=e.defer();return googleplaygame.signout(function(e){return n.resolve(e)},function(e){return n.reject(e)}),n.promise},isSignedIn:function(){var n=e.defer();return googleplaygame.isSignedIn(function(e){return n.resolve(e)},function(e){return n.reject(e)}),n.promise},showPlayer:function(){var n=e.defer();return googleplaygame.showPlayer(function(e){return n.resolve(e)},function(e){return n.reject(e)}),n.promise},submitScore:function(n){var r=e.defer();return googleplaygame.submitScore(n,function(e){return r.resolve(e)},function(e){return r.reject(e)}),r.promise},showAllLeaderboards:function(){var n=e.defer();return googleplaygame.showAllLeaderboards(function(e){return n.resolve(e)},function(e){return n.reject(e)}),n.promise},showLeaderboard:function(n){var r=e.defer();return googleplaygame.showLeaderboard(n,function(e){return r.resolve(e)},function(e){return r.reject(e)}),r.promise},unlockAchievement:function(n){var r=e.defer();return googleplaygame.unlockAchievement(n,function(e){return r.resolve(e)},function(e){return r.reject(e)}),r.promise},incrementAchievement:function(n){var r=e.defer();return googleplaygame.incrementAchievement(n,function(e){return r.resolve(e)},function(e){return r.reject(e)}),r.promise},showAchievements:function(){var n=e.defer();return googleplaygame.showAchievements(function(e){return n.resolve(e)},function(e){return n.reject(e)}),n.promise}}}]),angular.module("ngCordova.plugins.googlePlus",[]).factory("$cordovaGooglePlus",["$q","$window",function(e,n){return{login:function(r){var o=e.defer();return void 0===r&&(r={}),n.plugins.googleplus.login({iOSApiKey:r},function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},silentLogin:function(r){var o=e.defer();return void 0===r&&(r={}),n.plugins.googleplus.trySilentLogin({iOSApiKey:r},function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},logout:function(){var r=e.defer();n.plugins.googleplus.logout(function(e){r.resolve(e)})},disconnect:function(){var r=e.defer();n.plugins.googleplus.disconnect(function(e){r.resolve(e)})},isAvailable:function(){var r=e.defer();return n.plugins.googleplus.isAvailable(function(e){e?r.resolve(e):r.reject(e)}),r.promise}}}]),angular.module("ngCordova.plugins.healthKit",[]).factory("$cordovaHealthKit",["$q","$window",function(e,n){return{isAvailable:function(){var r=e.defer();return n.plugins.healthkit.available(function(e){r.resolve(e)},function(e){r.reject(e)}),r.promise},checkAuthStatus:function(r){var o=e.defer();return r=r||"HKQuantityTypeIdentifierHeight",n.plugins.healthkit.checkAuthStatus({type:r},function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},requestAuthorization:function(r,o){var t=e.defer();return r=r||["HKCharacteristicTypeIdentifierDateOfBirth","HKQuantityTypeIdentifierActiveEnergyBurned","HKQuantityTypeIdentifierHeight"],o=o||["HKQuantityTypeIdentifierActiveEnergyBurned","HKQuantityTypeIdentifierHeight","HKQuantityTypeIdentifierDistanceCycling"],n.plugins.healthkit.requestAuthorization({readTypes:r,writeTypes:o},function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise},readDateOfBirth:function(){var r=e.defer();return n.plugins.healthkit.readDateOfBirth(function(e){r.resolve(e)},function(e){r.resolve(e)}),r.promise},readGender:function(){var r=e.defer();return n.plugins.healthkit.readGender(function(e){r.resolve(e)},function(e){r.resolve(e)}),r.promise},saveWeight:function(r,o,t){var i=e.defer();return n.plugins.healthkit.saveWeight({unit:o||"lb",amount:r,date:t||new Date},function(e){i.resolve(e)},function(e){i.resolve(e)}),i.promise},readWeight:function(r){var o=e.defer();return n.plugins.healthkit.readWeight({unit:r||"lb"},function(e){o.resolve(e)},function(e){o.resolve(e)}),o.promise},saveHeight:function(r,o,t){var i=e.defer();return n.plugins.healthkit.saveHeight({unit:o||"in",amount:r,date:t||new Date},function(e){i.resolve(e)},function(e){i.resolve(e)}),i.promise},readHeight:function(r){var o=e.defer();return n.plugins.healthkit.readHeight({unit:r||"in"},function(e){o.resolve(e)},function(e){o.resolve(e)}),o.promise},findWorkouts:function(){var r=e.defer();return n.plugins.healthkit.findWorkouts({},function(e){r.resolve(e)},function(e){r.resolve(e)}),r.promise},saveWorkout:function(r){var o=e.defer();return n.plugins.healthkit.saveWorkout(r,function(e){o.resolve(e)},function(e){o.resolve(e)}),o.promise},querySampleType:function(r){var o=e.defer();return n.plugins.healthkit.querySampleType(r,function(e){o.resolve(e)},function(e){o.resolve(e)}),o.promise}}}]),angular.module("ngCordova.plugins.httpd",[]).factory("$cordovaHttpd",["$q",function(e){return{startServer:function(n){var r=e.defer();return cordova.plugins.CorHttpd.startServer(n,function(){r.resolve()},function(){r.reject()}),r.promise},stopServer:function(){var n=e.defer();return cordova.plugins.CorHttpd.stopServer(function(){n.resolve()},function(){n.reject()}),n.promise},getURL:function(){var n=e.defer();return cordova.plugins.CorHttpd.getURL(function(e){n.resolve(e)},function(){n.reject()}),n.promise},getLocalPath:function(){var n=e.defer();return cordova.plugins.CorHttpd.getLocalPath(function(e){n.resolve(e)},function(){n.reject()}),n.promise}}}]),angular.module("ngCordova.plugins.iAd",[]).factory("$cordovaiAd",["$q","$window",function(e,n){return{setOptions:function(r){var o=e.defer();return n.iAd.setOptions(r,function(){o.resolve()},function(){o.reject()}),o.promise},createBanner:function(r){var o=e.defer();return n.iAd.createBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},removeBanner:function(){var r=e.defer();return n.iAd.removeBanner(function(){r.resolve()},function(){r.reject()}),r.promise},showBanner:function(r){var o=e.defer();return n.iAd.showBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},showBannerAtXY:function(r,o){var t=e.defer();return n.iAd.showBannerAtXY(r,o,function(){t.resolve()},function(){t.reject()}),t.promise},hideBanner:function(){var r=e.defer();return n.iAd.hideBanner(function(){r.resolve()},function(){r.reject()}),r.promise},prepareInterstitial:function(r){var o=e.defer();return n.iAd.prepareInterstitial(r,function(){o.resolve()},function(){o.reject()}),o.promise},showInterstitial:function(){var r=e.defer();return n.iAd.showInterstitial(function(){r.resolve()},function(){r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins.imagePicker",[]).factory("$cordovaImagePicker",["$q","$window",function(e,n){return{getPictures:function(r){var o=e.defer();return n.imagePicker.getPictures(function(e){o.resolve(e)},function(e){o.reject(e)},r),o.promise}}}]),angular.module("ngCordova.plugins.inAppBrowser",[]).provider("$cordovaInAppBrowser",[function(){var e,n=this.defaultOptions={};this.setDefaultOptions=function(e){n=angular.extend(n,e)},this.$get=["$rootScope","$q","$window","$timeout",function(r,o,t,i){return{open:function(a,c,u){var s=o.defer();if(u&&!angular.isObject(u))return s.reject("options must be an object"),s.promise;var l=angular.extend({},n,u),f=[];angular.forEach(l,function(e,n){f.push(n+"="+e)});var d=f.join();return e=t.open(a,c,d),e.addEventListener("loadstart",function(e){i(function(){r.$broadcast("$cordovaInAppBrowser:loadstart",e)})},!1),e.addEventListener("loadstop",function(e){s.resolve(e),i(function(){r.$broadcast("$cordovaInAppBrowser:loadstop",e)})},!1),e.addEventListener("loaderror",function(e){s.reject(e),i(function(){r.$broadcast("$cordovaInAppBrowser:loaderror",e)})},!1),e.addEventListener("exit",function(e){i(function(){r.$broadcast("$cordovaInAppBrowser:exit",e)})},!1),s.promise},close:function(){e.close(),e=null},show:function(){e.show()},executeScript:function(n){var r=o.defer();return e.executeScript(n,function(e){r.resolve(e)}),r.promise},insertCSS:function(n){var r=o.defer();return e.insertCSS(n,function(e){r.resolve(e)}),r.promise}}}]}]),angular.module("ngCordova.plugins.insomnia",[]).factory("$cordovaInsomnia",["$window",function(e){return{keepAwake:function(){return e.plugins.insomnia.keepAwake()},allowSleepAgain:function(){return e.plugins.insomnia.allowSleepAgain()}}}]),angular.module("ngCordova.plugins.instagram",[]).factory("$cordovaInstagram",["$q",function(e){return{share:function(n){var r=e.defer();return window.Instagram?(Instagram.share(n.image,n.caption,function(e){e?r.reject(e):r.resolve(!0)}),r.promise):(console.error("Tried to call Instagram.share but the Instagram plugin isn't installed!"),r.resolve(null),r.promise)},isInstalled:function(){var n=e.defer();return window.Instagram?(Instagram.isInstalled(function(e,r){e?n.reject(e):n.resolve(r)}),n.promise):(console.error("Tried to call Instagram.isInstalled but the Instagram plugin isn't installed!"),n.resolve(null),n.promise)}}}]),angular.module("ngCordova.plugins.keyboard",[]).factory("$cordovaKeyboard",["$rootScope",function(e){var n=function(){e.$evalAsync(function(){e.$broadcast("$cordovaKeyboard:show")})},r=function(){e.$evalAsync(function(){e.$broadcast("$cordovaKeyboard:hide")})};return document.addEventListener("deviceready",function(){cordova.plugins.Keyboard&&(window.addEventListener("native.keyboardshow",n,!1),window.addEventListener("native.keyboardhide",r,!1))}),{hideAccessoryBar:function(e){return cordova.plugins.Keyboard.hideKeyboardAccessoryBar(e)},close:function(){return cordova.plugins.Keyboard.close()},show:function(){return cordova.plugins.Keyboard.show()},disableScroll:function(e){return cordova.plugins.Keyboard.disableScroll(e)},isVisible:function(){return cordova.plugins.Keyboard.isVisible},clearShowWatch:function(){document.removeEventListener("native.keyboardshow",n),e.$$listeners["$cordovaKeyboard:show"]=[]},clearHideWatch:function(){document.removeEventListener("native.keyboardhide",r),e.$$listeners["$cordovaKeyboard:hide"]=[]}}}]),angular.module("ngCordova.plugins.keychain",[]).factory("$cordovaKeychain",["$q",function(e){return{getForKey:function(n,r){var o=e.defer(),t=new Keychain;return t.getForKey(o.resolve,o.reject,n,r),o.promise},setForKey:function(n,r,o){var t=e.defer(),i=new Keychain;return i.setForKey(t.resolve,t.reject,n,r,o),t.promise},removeForKey:function(n,r){var o=e.defer(),t=new Keychain;return t.removeForKey(o.resolve,o.reject,n,r),o.promise}}}]),angular.module("ngCordova.plugins.launchNavigator",[]).factory("$cordovaLaunchNavigator",["$q",function(e){return{navigate:function(n,r,o){var t=e.defer();return launchnavigator.navigate(n,r,function(){t.resolve()},function(e){t.reject(e)},o),t.promise}}}]),angular.module("ngCordova.plugins.localNotification",[]).factory("$cordovaLocalNotification",["$q","$window","$rootScope","$timeout",function(e,n,r,o){return document.addEventListener("deviceready",function(){n.cordova&&n.cordova.plugins&&n.cordova.plugins.notification&&n.cordova.plugins.notification.local&&(n.cordova.plugins.notification.local.on("schedule",function(e,n){o(function(){r.$broadcast("$cordovaLocalNotification:schedule",e,n)})}),n.cordova.plugins.notification.local.on("trigger",function(e,n){o(function(){r.$broadcast("$cordovaLocalNotification:trigger",e,n)})}),n.cordova.plugins.notification.local.on("update",function(e,n){o(function(){r.$broadcast("$cordovaLocalNotification:update",e,n)})}),n.cordova.plugins.notification.local.on("clear",function(e,n){o(function(){r.$broadcast("$cordovaLocalNotification:clear",e,n)})}),n.cordova.plugins.notification.local.on("clearall",function(e){o(function(){r.$broadcast("$cordovaLocalNotification:clearall",e)})}),n.cordova.plugins.notification.local.on("cancel",function(e,n){o(function(){r.$broadcast("$cordovaLocalNotification:cancel",e,n)})}),n.cordova.plugins.notification.local.on("cancelall",function(e){o(function(){r.$broadcast("$cordovaLocalNotification:cancelall",e)})}),n.cordova.plugins.notification.local.on("click",function(e,n){o(function(){r.$broadcast("$cordovaLocalNotification:click",e,n)})}))},!1),{schedule:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.schedule(r,function(e){t.resolve(e)},o),t.promise},add:function(r,o){console.warn('Deprecated: use "schedule" instead.');var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.schedule(r,function(e){t.resolve(e)},o),t.promise},update:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.update(r,function(e){t.resolve(e)},o),t.promise},clear:function(r,o){var t=e.defer();
return o=o||null,n.cordova.plugins.notification.local.clear(r,function(e){t.resolve(e)},o),t.promise},clearAll:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.clearAll(function(e){o.resolve(e)},r),o.promise},cancel:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.cancel(r,function(e){t.resolve(e)},o),t.promise},cancelAll:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.cancelAll(function(e){o.resolve(e)},r),o.promise},isPresent:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.isPresent(r,function(e){t.resolve(e)},o),t.promise},isScheduled:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.isScheduled(r,function(e){t.resolve(e)},o),t.promise},isTriggered:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.isTriggered(r,function(e){t.resolve(e)},o),t.promise},hasPermission:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.hasPermission(function(e){e?o.resolve(e):o.reject(e)},r),o.promise},registerPermission:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.registerPermission(function(e){e?o.resolve(e):o.reject(e)},r),o.promise},promptForPermission:function(r){console.warn('Deprecated: use "registerPermission" instead.');var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.registerPermission(function(e){e?o.resolve(e):o.reject(e)},r),o.promise},getAllIds:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.getAllIds(function(e){o.resolve(e)},r),o.promise},getIds:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.getIds(function(e){o.resolve(e)},r),o.promise},getScheduledIds:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.getScheduledIds(function(e){o.resolve(e)},r),o.promise},getTriggeredIds:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.getTriggeredIds(function(e){o.resolve(e)},r),o.promise},get:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.get(r,function(e){t.resolve(e)},o),t.promise},getAll:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.getAll(function(e){o.resolve(e)},r),o.promise},getScheduled:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.getScheduled(r,function(e){t.resolve(e)},o),t.promise},getAllScheduled:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.getAllScheduled(function(e){o.resolve(e)},r),o.promise},getTriggered:function(r,o){var t=e.defer();return o=o||null,n.cordova.plugins.notification.local.getTriggered(r,function(e){t.resolve(e)},o),t.promise},getAllTriggered:function(r){var o=e.defer();return r=r||null,n.cordova.plugins.notification.local.getAllTriggered(function(e){o.resolve(e)},r),o.promise},getDefaults:function(){return n.cordova.plugins.notification.local.getDefaults()},setDefaults:function(e){n.cordova.plugins.notification.local.setDefaults(e)}}}]),angular.module("ngCordova.plugins.mMediaAds",[]).factory("$cordovaMMediaAds",["$q","$window",function(e,n){return{setOptions:function(r){var o=e.defer();return n.mMedia.setOptions(r,function(){o.resolve()},function(){o.reject()}),o.promise},createBanner:function(r){var o=e.defer();return n.mMedia.createBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},removeBanner:function(){var r=e.defer();return n.mMedia.removeBanner(function(){r.resolve()},function(){r.reject()}),r.promise},showBanner:function(r){var o=e.defer();return n.mMedia.showBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},showBannerAtXY:function(r,o){var t=e.defer();return n.mMedia.showBannerAtXY(r,o,function(){t.resolve()},function(){t.reject()}),t.promise},hideBanner:function(){var r=e.defer();return n.mMedia.hideBanner(function(){r.resolve()},function(){r.reject()}),r.promise},prepareInterstitial:function(r){var o=e.defer();return n.mMedia.prepareInterstitial(r,function(){o.resolve()},function(){o.reject()}),o.promise},showInterstitial:function(){var r=e.defer();return n.mMedia.showInterstitial(function(){r.resolve()},function(){r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins.media",[]).service("NewMedia",["$q","$interval",function(e,n){function r(e){angular.isDefined(s)||(s=n(function(){0>d&&(d=e.getDuration(),a&&d>0&&a.notify({duration:d})),e.getCurrentPosition(function(e){e>-1&&(f=e)},function(e){console.log("Error getting pos="+e)}),a&&a.notify({position:f})},1e3))}function o(){angular.isDefined(s)&&(n.cancel(s),s=void 0)}function t(){f=-1,d=-1}function i(e){this.media=new Media(e,function(e){o(),t(),a.resolve(e)},function(e){o(),t(),a.reject(e)},function(e){l=e,a.notify({status:l})})}var a,c,u,s,l=null,f=-1,d=-1;return i.prototype.play=function(n){return a=e.defer(),"object"!=typeof n&&(n={}),this.media.play(n),r(this.media),a.promise},i.prototype.pause=function(){o(),this.media.pause()},i.prototype.stop=function(){this.media.stop()},i.prototype.release=function(){this.media.release(),this.media=void 0},i.prototype.seekTo=function(e){this.media.seekTo(e)},i.prototype.setVolume=function(e){this.media.setVolume(e)},i.prototype.startRecord=function(){this.media.startRecord()},i.prototype.stopRecord=function(){this.media.stopRecord()},i.prototype.currentTime=function(){return c=e.defer(),this.media.getCurrentPosition(function(e){c.resolve(e)}),c.promise},i.prototype.getDuration=function(){return u=e.defer(),this.media.getDuration(function(e){u.resolve(e)}),u.promise},i}]).factory("$cordovaMedia",["NewMedia",function(e){return{newMedia:function(n){return new e(n)}}}]),angular.module("ngCordova.plugins.mobfoxAds",[]).factory("$cordovaMobFoxAds",["$q","$window",function(e,n){return{setOptions:function(r){var o=e.defer();return n.MobFox.setOptions(r,function(){o.resolve()},function(){o.reject()}),o.promise},createBanner:function(r){var o=e.defer();return n.MobFox.createBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},removeBanner:function(){var r=e.defer();return n.MobFox.removeBanner(function(){r.resolve()},function(){r.reject()}),r.promise},showBanner:function(r){var o=e.defer();return n.MobFox.showBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},showBannerAtXY:function(r,o){var t=e.defer();return n.MobFox.showBannerAtXY(r,o,function(){t.resolve()},function(){t.reject()}),t.promise},hideBanner:function(){var r=e.defer();return n.MobFox.hideBanner(function(){r.resolve()},function(){r.reject()}),r.promise},prepareInterstitial:function(r){var o=e.defer();return n.MobFox.prepareInterstitial(r,function(){o.resolve()},function(){o.reject()}),o.promise},showInterstitial:function(){var r=e.defer();return n.MobFox.showInterstitial(function(){r.resolve()},function(){r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins",["ngCordova.plugins.3dtouch","ngCordova.plugins.actionSheet","ngCordova.plugins.adMob","ngCordova.plugins.appAvailability","ngCordova.plugins.appRate","ngCordova.plugins.appVersion","ngCordova.plugins.backgroundGeolocation","ngCordova.plugins.badge","ngCordova.plugins.barcodeScanner","ngCordova.plugins.batteryStatus","ngCordova.plugins.beacon","ngCordova.plugins.ble","ngCordova.plugins.bluetoothSerial","ngCordova.plugins.brightness","ngCordova.plugins.calendar","ngCordova.plugins.camera","ngCordova.plugins.capture","ngCordova.plugins.clipboard","ngCordova.plugins.contacts","ngCordova.plugins.datePicker","ngCordova.plugins.device","ngCordova.plugins.deviceMotion","ngCordova.plugins.deviceOrientation","ngCordova.plugins.dialogs","ngCordova.plugins.emailComposer","ngCordova.plugins.facebook","ngCordova.plugins.facebookAds","ngCordova.plugins.file","ngCordova.plugins.fileTransfer","ngCordova.plugins.fileOpener2","ngCordova.plugins.flashlight","ngCordova.plugins.flurryAds","ngCordova.plugins.ga","ngCordova.plugins.geolocation","ngCordova.plugins.globalization","ngCordova.plugins.googleAds","ngCordova.plugins.googleAnalytics","ngCordova.plugins.googleMap","ngCordova.plugins.googlePlayGame","ngCordova.plugins.googlePlus","ngCordova.plugins.healthKit","ngCordova.plugins.httpd","ngCordova.plugins.iAd","ngCordova.plugins.imagePicker","ngCordova.plugins.inAppBrowser","ngCordova.plugins.instagram","ngCordova.plugins.keyboard","ngCordova.plugins.keychain","ngCordova.plugins.launchNavigator","ngCordova.plugins.localNotification","ngCordova.plugins.media","ngCordova.plugins.mMediaAds","ngCordova.plugins.mobfoxAds","ngCordova.plugins.mopubAds","ngCordova.plugins.nativeAudio","ngCordova.plugins.network","ngCordova.plugins.pinDialog","ngCordova.plugins.preferences","ngCordova.plugins.printer","ngCordova.plugins.progressIndicator","ngCordova.plugins.push","ngCordova.plugins.push_v5","ngCordova.plugins.sms","ngCordova.plugins.socialSharing","ngCordova.plugins.spinnerDialog","ngCordova.plugins.splashscreen","ngCordova.plugins.sqlite","ngCordova.plugins.statusbar","ngCordova.plugins.toast","ngCordova.plugins.touchid","ngCordova.plugins.vibration","ngCordova.plugins.videoCapturePlus","ngCordova.plugins.zip","ngCordova.plugins.insomnia"]),angular.module("ngCordova.plugins.mopubAds",[]).factory("$cordovaMoPubAds",["$q","$window",function(e,n){return{setOptions:function(r){var o=e.defer();return n.MoPub.setOptions(r,function(){o.resolve()},function(){o.reject()}),o.promise},createBanner:function(r){var o=e.defer();return n.MoPub.createBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},removeBanner:function(){var r=e.defer();return n.MoPub.removeBanner(function(){r.resolve()},function(){r.reject()}),r.promise},showBanner:function(r){var o=e.defer();return n.MoPub.showBanner(r,function(){o.resolve()},function(){o.reject()}),o.promise},showBannerAtXY:function(r,o){var t=e.defer();return n.MoPub.showBannerAtXY(r,o,function(){t.resolve()},function(){t.reject()}),t.promise},hideBanner:function(){var r=e.defer();return n.MoPub.hideBanner(function(){r.resolve()},function(){r.reject()}),r.promise},prepareInterstitial:function(r){var o=e.defer();return n.MoPub.prepareInterstitial(r,function(){o.resolve()},function(){o.reject()}),o.promise},showInterstitial:function(){var r=e.defer();return n.MoPub.showInterstitial(function(){r.resolve()},function(){r.reject()}),r.promise}}}]),angular.module("ngCordova.plugins.nativeAudio",[]).factory("$cordovaNativeAudio",["$q","$window",function(e,n){return{preloadSimple:function(r,o){var t=e.defer();return n.plugins.NativeAudio.preloadSimple(r,o,function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise},preloadComplex:function(r,o,t,i,a){var c=e.defer();return n.plugins.NativeAudio.preloadComplex(r,o,t,i,a,function(e){c.resolve(e)},function(e){c.reject(e)}),c.promise},play:function(r,o){var t=e.defer();return n.plugins.NativeAudio.play(r,function(e){t.resolve(e)},function(e){t.reject(e)},o),t.promise},stop:function(r){var o=e.defer();return n.plugins.NativeAudio.stop(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},loop:function(r){var o=e.defer();return n.plugins.NativeAudio.loop(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},unload:function(r){var o=e.defer();return n.plugins.NativeAudio.unload(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},setVolumeForComplexAsset:function(r,o){var t=e.defer();return n.plugins.NativeAudio.setVolumeForComplexAsset(r,o,function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise}}}]),angular.module("ngCordova.plugins.network",[]).factory("$cordovaNetwork",["$rootScope","$timeout",function(e,n){var r=function(){var r=navigator.connection.type;n(function(){e.$broadcast("$cordovaNetwork:offline",r)})},o=function(){var r=navigator.connection.type;n(function(){e.$broadcast("$cordovaNetwork:online",r)})};return document.addEventListener("deviceready",function(){navigator.connection&&(document.addEventListener("offline",r,!1),document.addEventListener("online",o,!1))}),{getNetwork:function(){return navigator.connection.type},isOnline:function(){var e=navigator.connection.type;return e!==Connection.UNKNOWN&&e!==Connection.NONE},isOffline:function(){var e=navigator.connection.type;return e===Connection.UNKNOWN||e===Connection.NONE},clearOfflineWatch:function(){document.removeEventListener("offline",r),e.$$listeners["$cordovaNetwork:offline"]=[]},clearOnlineWatch:function(){document.removeEventListener("online",o),e.$$listeners["$cordovaNetwork:online"]=[]}}}]).run(["$injector",function(e){e.get("$cordovaNetwork")}]),angular.module("ngCordova.plugins.pinDialog",[]).factory("$cordovaPinDialog",["$q","$window",function(e,n){return{prompt:function(r,o,t){var i=e.defer();return n.plugins.pinDialog.prompt(r,function(e){i.resolve(e)},o,t),i.promise}}}]),angular.module("ngCordova.plugins.preferences",[]).factory("$cordovaPreferences",["$window","$q",function(e,n){return{pluginNotEnabledMessage:"Plugin not enabled",decoratePromise:function(e){e.success=function(n){return e.then(n),e},e.error=function(n){return e.then(null,n),e}},store:function(r,o,t){function i(e){c.resolve(e)}function a(e){c.reject(new Error(e))}var c=n.defer(),u=c.promise;if(e.plugins){var s;s=3===arguments.length?e.plugins.appPreferences.store(t,r,o):e.plugins.appPreferences.store(r,o),s.then(i,a)}else c.reject(new Error(this.pluginNotEnabledMessage));return this.decoratePromise(u),u},fetch:function(r,o){function t(e){a.resolve(e)}function i(e){a.reject(new Error(e))}var a=n.defer(),c=a.promise;if(e.plugins){var u;u=2===arguments.length?e.plugins.appPreferences.fetch(o,r):e.plugins.appPreferences.fetch(r),u.then(t,i)}else a.reject(new Error(this.pluginNotEnabledMessage));return this.decoratePromise(c),c},remove:function(r,o){function t(e){a.resolve(e)}function i(e){a.reject(new Error(e))}var a=n.defer(),c=a.promise;if(e.plugins){var u;u=2===arguments.length?e.plugins.appPreferences.remove(o,r):e.plugins.appPreferences.remove(r),u.then(t,i)}else a.reject(new Error(this.pluginNotEnabledMessage));return this.decoratePromise(c),c},show:function(){function r(e){t.resolve(e)}function o(e){t.reject(new Error(e))}var t=n.defer(),i=t.promise;return e.plugins?e.plugins.appPreferences.show().then(r,o):t.reject(new Error(this.pluginNotEnabledMessage)),this.decoratePromise(i),i}}}]),angular.module("ngCordova.plugins.printer",[]).factory("$cordovaPrinter",["$q","$window",function(e,n){return{isAvailable:function(){var r=e.defer();return n.plugin.printer.isAvailable(function(e){r.resolve(e)}),r.promise},print:function(r,o){var t=e.defer();return n.plugin.printer.print(r,o,function(){t.resolve()}),t.promise}}}]),angular.module("ngCordova.plugins.progressIndicator",[]).factory("$cordovaProgress",[function(){return{show:function(e){var n=e||"Please wait...";return ProgressIndicator.show(n)},showSimple:function(e){var n=e||!1;return ProgressIndicator.showSimple(n)},showSimpleWithLabel:function(e,n){var r=e||!1,o=n||"Loading...";return ProgressIndicator.showSimpleWithLabel(r,o)},showSimpleWithLabelDetail:function(e,n,r){var o=e||!1,t=n||"Loading...",i=r||"Please wait";return ProgressIndicator.showSimpleWithLabelDetail(o,t,i)},showDeterminate:function(e,n){var r=e||!1,o=n||5e4;return ProgressIndicator.showDeterminate(r,o)},showDeterminateWithLabel:function(e,n,r){var o=e||!1,t=n||5e4,i=r||"Loading...";return ProgressIndicator.showDeterminateWithLabel(o,t,i)},showAnnular:function(e,n){var r=e||!1,o=n||5e4;return ProgressIndicator.showAnnular(r,o)},showAnnularWithLabel:function(e,n,r){var o=e||!1,t=n||5e4,i=r||"Loading...";return ProgressIndicator.showAnnularWithLabel(o,t,i)},showBar:function(e,n){var r=e||!1,o=n||5e4;return ProgressIndicator.showBar(r,o)},showBarWithLabel:function(e,n,r){var o=e||!1,t=n||5e4,i=r||"Loading...";return ProgressIndicator.showBarWithLabel(o,t,i)},showSuccess:function(e,n){var r=e||!1,o=n||"Success";return ProgressIndicator.showSuccess(r,o)},showText:function(e,n,r){var o=e||!1,t=n||"Warning",i=r||"center";return ProgressIndicator.showText(o,t,i)},hide:function(){return ProgressIndicator.hide()}}}]),angular.module("ngCordova.plugins.push",[]).factory("$cordovaPush",["$q","$window","$rootScope","$timeout",function(e,n,r,o){return{onNotification:function(e){o(function(){r.$broadcast("$cordovaPush:notificationReceived",e)})},register:function(r){var o,t=e.defer();return void 0!==r&&void 0===r.ecb&&(o=null===document.querySelector("[ng-app]")?"document.body":"document.querySelector('[ng-app]')",r.ecb="angular.element("+o+").injector().get('$cordovaPush').onNotification"),n.plugins.pushNotification.register(function(e){t.resolve(e)},function(e){t.reject(e)},r),t.promise},unregister:function(r){var o=e.defer();return n.plugins.pushNotification.unregister(function(e){o.resolve(e)},function(e){o.reject(e)},r),o.promise},setBadgeNumber:function(r){var o=e.defer();return n.plugins.pushNotification.setApplicationIconBadgeNumber(function(e){o.resolve(e)},function(e){o.reject(e)},r),o.promise}}}]),angular.module("ngCordova.plugins.push_v5",[]).factory("$cordovaPushV5",["$q","$rootScope","$timeout",function(e,n,r){var o;return{initialize:function(n){var r=e.defer();return o=PushNotification.init(n),r.resolve(o),r.promise},onNotification:function(){r(function(){o.on("notification",function(e){n.$emit("$cordovaPushV5:notificationReceived",e)})})},onError:function(){r(function(){o.on("error",function(e){n.$emit("$cordovaPushV5:errorOccurred",e)})})},register:function(){var n=e.defer();return void 0===o?n.reject(new Error("init must be called before any other operation")):o.on("registration",function(e){n.resolve(e.registrationId)}),n.promise},unregister:function(){var n=e.defer();return void 0===o?n.reject(new Error("init must be called before any other operation")):o.unregister(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},getBadgeNumber:function(){var n=e.defer();return void 0===o?n.reject(new Error("init must be called before any other operation")):o.getApplicationIconBadgeNumber(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise},setBadgeNumber:function(n){var r=e.defer();return void 0===o?r.reject(new Error("init must be called before any other operation")):o.setApplicationIconBadgeNumber(function(e){r.resolve(e)},function(e){r.reject(e)},n),r.promise},finish:function(){var n=e.defer();return void 0===o?n.reject(new Error("init must be called before any other operation")):o.finish(function(e){n.resolve(e)},function(e){n.reject(e)}),n.promise}}}]),angular.module("ngCordova.plugins.recentsControl",[]).factory("$cordovaRecents",function(){return{setColor:function(e){return RecentsControl.setColor(e)},setDescription:function(e){return RecentsControl.setDescription(e)},setOptions:function(e,n){return RecentsControl.setOptions(e,n)}}}),angular.module("ngCordova.plugins.screenshot",[]).factory("$cordovaScreenshot",["$q",function(e){return{captureToFile:function(n){var r=n||{},o=r.extension||"jpg",t=r.quality||"100",i=e.defer();return navigator.screenshot?(navigator.screenshot.save(function(e,n){e?i.reject(e):i.resolve(n.filePath)},o,t,r.filename),i.promise):(i.resolve(null),i.promise)},captureToUri:function(n){var r=n||{},o=r.extension||"jpg",t=r.quality||"100",i=e.defer();return navigator.screenshot?(navigator.screenshot.URI(function(e,n){e?i.reject(e):i.resolve(n.URI)},o,t,r.filename),i.promise):(i.resolve(null),i.promise)}}}]),angular.module("ngCordova.plugins.serial",[]).factory("$cordovaSerial",["$q",function(e){var n={};return n.requestPermission=function(n){var r=e.defer();return serial.requestPermission(n,function(){r.resolve()},function(e){r.reject(e)}),r.promise},n.open=function(n){var r=e.defer();return serial.open(n,function(){r.resolve()},function(e){r.reject(e)}),r.promise},n.write=function(n){var r=e.defer();return serial.write(n,function(){r.resolve()},function(e){r.reject(e)}),r.promise},n.writeHex=function(n){var r=e.defer();return serial.writeHex(n,function(){r.resolve()},function(e){r.reject(e)}),r.promise},n.read=function(){var n=e.defer();return serial.read(function(e){var r=new Uint8Array(e);n.resolve(r)},function(e){n.reject(e)}),n.promise},n.registerReadCallback=function(e,n){serial.registerReadCallback(function(n){var r=new Uint8Array(n);e(r)},n)},n.close=function(){var n=e.defer();return serial.close(function(){n.resolve()},function(e){n.reject(e)}),n.promise},n}]),angular.module("ngCordova.plugins.sms",[]).factory("$cordovaSms",["$q",function(e){return{send:function(n,r,o){var t=e.defer();return sms.send(n,r,o,function(e){t.resolve(e)},function(e){t.reject(e)}),t.promise}}}]),angular.module("ngCordova.plugins.socialSharing",[]).factory("$cordovaSocialSharing",["$q","$window",function(e,n){return{share:function(r,o,t,i){var a=e.defer();return o=o||null,t=t||null,i=i||null,n.plugins.socialsharing.share(r,o,t,i,function(){a.resolve(!0)},function(){a.reject(!1)}),a.promise},shareWithOptions:function(r){var o=e.defer();return n.plugins.socialsharing.shareWithOptions(r,function(){o.resolve(!0)},function(){o.reject(!1)}),o.promise},shareViaTwitter:function(r,o,t){var i=e.defer();return o=o||null,t=t||null,n.plugins.socialsharing.shareViaTwitter(r,o,t,function(){i.resolve(!0)},function(){i.reject(!1)}),i.promise},shareViaWhatsApp:function(r,o,t){var i=e.defer();return o=o||null,t=t||null,n.plugins.socialsharing.shareViaWhatsApp(r,o,t,function(){i.resolve(!0)},function(){i.reject(!1)}),i.promise},shareViaFacebook:function(r,o,t){var i=e.defer();return r=r||null,o=o||null,t=t||null,n.plugins.socialsharing.shareViaFacebook(r,o,t,function(){i.resolve(!0)},function(){i.reject(!1)}),i.promise},shareViaFacebookWithPasteMessageHint:function(r,o,t,i){var a=e.defer();return o=o||null,t=t||null,n.plugins.socialsharing.shareViaFacebookWithPasteMessageHint(r,o,t,i,function(){a.resolve(!0)},function(){a.reject(!1)}),a.promise},shareViaSMS:function(r,o){var t=e.defer();return n.plugins.socialsharing.shareViaSMS(r,o,function(){t.resolve(!0)},function(){t.reject(!1)}),t.promise},shareViaEmail:function(r,o,t,i,a,c){var u=e.defer();return t=t||null,i=i||null,a=a||null,c=c||null,n.plugins.socialsharing.shareViaEmail(r,o,t,i,a,c,function(){u.resolve(!0)},function(){u.reject(!1)}),u.promise},shareVia:function(r,o,t,i,a){var c=e.defer();return o=o||null,t=t||null,i=i||null,a=a||null,n.plugins.socialsharing.shareVia(r,o,t,i,a,function(){c.resolve(!0)},function(){c.reject(!1)}),c.promise},canShareViaEmail:function(){var r=e.defer();return n.plugins.socialsharing.canShareViaEmail(function(){r.resolve(!0)},function(){r.reject(!1)}),r.promise},canShareVia:function(r,o,t,i,a){var c=e.defer();return n.plugins.socialsharing.canShareVia(r,o,t,i,a,function(e){c.resolve(e)},function(e){c.reject(e)}),c.promise},available:function(){var n=e.defer();return window.plugins.socialsharing.available(function(e){e?n.resolve():n.reject()}),n.promise}}}]),angular.module("ngCordova.plugins.spinnerDialog",[]).factory("$cordovaSpinnerDialog",["$window",function(e){return{show:function(n,r,o,t){return o=o||!1,e.plugins.spinnerDialog.show(n,r,o,t)},hide:function(){return e.plugins.spinnerDialog.hide()}}}]),angular.module("ngCordova.plugins.splashscreen",[]).factory("$cordovaSplashscreen",[function(){return{hide:function(){return navigator.splashscreen.hide()},show:function(){return navigator.splashscreen.show()}}}]),angular.module("ngCordova.plugins.sqlite",[]).factory("$cordovaSQLite",["$q","$window",function(e,n){return{openDB:function(e,r){return angular.isObject(e)&&!angular.isString(e)?("undefined"!=typeof r&&(e.bgType=r),n.sqlitePlugin.openDatabase(e)):n.sqlitePlugin.openDatabase({name:e,bgType:r})},execute:function(n,r,o){var t=e.defer();return n.transaction(function(e){e.executeSql(r,o,function(e,n){t.resolve(n)},function(e,n){t.reject(n)})}),t.promise},insertCollection:function(n,r,o){var t=e.defer(),i=o.slice(0);return n.transaction(function(e){!function n(){var o=i.splice(0,1)[0];try{e.executeSql(r,o,function(e,r){0===i.length?t.resolve(r):n()},function(e,n){t.reject(n)})}catch(a){t.reject(a)}}()}),t.promise},nestedExecute:function(n,r,o,t,i){var a=e.defer();return n.transaction(function(e){e.executeSql(r,t,function(e,n){a.resolve(n),e.executeSql(o,i,function(e,n){a.resolve(n)})})},function(e,n){a.reject(n)}),a.promise},deleteDB:function(r){var o=e.defer();return n.sqlitePlugin.deleteDatabase(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise}}}]),angular.module("ngCordova.plugins.statusbar",[]).factory("$cordovaStatusbar",[function(){return{overlaysWebView:function(e){return StatusBar.overlaysWebView(!!e)},STYLES:{DEFAULT:0,LIGHT_CONTENT:1,BLACK_TRANSLUCENT:2,BLACK_OPAQUE:3},style:function(e){switch(e){case 0:return StatusBar.styleDefault();case 1:return StatusBar.styleLightContent();case 2:return StatusBar.styleBlackTranslucent();case 3:return StatusBar.styleBlackOpaque();default:return StatusBar.styleDefault()}},styleColor:function(e){return StatusBar.backgroundColorByName(e)},styleHex:function(e){return StatusBar.backgroundColorByHexString(e)},hide:function(){return StatusBar.hide()},show:function(){return StatusBar.show()},isVisible:function(){return StatusBar.isVisible}}}]),angular.module("ngCordova.plugins.toast",[]).factory("$cordovaToast",["$q","$window",function(e,n){return{showShortTop:function(r){var o=e.defer();return n.plugins.toast.showShortTop(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},showShortCenter:function(r){var o=e.defer();return n.plugins.toast.showShortCenter(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},showShortBottom:function(r){var o=e.defer();return n.plugins.toast.showShortBottom(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},showLongTop:function(r){var o=e.defer();return n.plugins.toast.showLongTop(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},showLongCenter:function(r){var o=e.defer();return n.plugins.toast.showLongCenter(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},showLongBottom:function(r){var o=e.defer();return n.plugins.toast.showLongBottom(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},showWithOptions:function(r){var o=e.defer();return n.plugins.toast.showWithOptions(r,function(e){o.resolve(e)},function(e){o.reject(e)}),o.promise},show:function(r,o,t){var i=e.defer();return n.plugins.toast.show(r,o,t,function(e){i.resolve(e)},function(e){i.reject(e)}),i.promise},hide:function(){var r=e.defer();try{n.plugins.toast.hide(),r.resolve()}catch(o){r.reject(o&&o.message)}return r.promise}}}]),angular.module("ngCordova.plugins.touchid",[]).factory("$cordovaTouchID",["$q",function(e){return{checkSupport:function(){var n=e.defer();return window.cordova?touchid.checkSupport(function(e){n.resolve(e)},function(e){n.reject(e)}):n.reject("Not supported without cordova.js"),n.promise},authenticate:function(n){var r=e.defer();return window.cordova?touchid.authenticate(function(e){r.resolve(e)},function(e){r.reject(e)},n):r.reject("Not supported without cordova.js"),r.promise}}}]),angular.module("ngCordova.plugins.tts",[]).factory("$cordovaTTS",function(){return{speak:function(e,n,r){return TTS.speak(e,n,r)}}}),angular.module("ngCordova.plugins.upsPush",[]).factory("$cordovaUpsPush",["$q","$window","$rootScope","$timeout",function(e,n,r,o){return{register:function(t){var i=e.defer();return n.push.register(function(e){o(function(){r.$broadcast("$cordovaUpsPush:notificationReceived",e)})},function(){i.resolve()},function(e){i.reject(e)},t),i.promise},unregister:function(r){var o=e.defer();return n.push.unregister(function(){o.resolve()},function(e){o.reject(e)},r),o.promise},setBadgeNumber:function(r){var o=e.defer();return n.push.setApplicationIconBadgeNumber(function(){o.resolve()},r),o.promise}}}]),angular.module("ngCordova.plugins.vibration",[]).factory("$cordovaVibration",[function(){return{vibrate:function(e){return navigator.notification.vibrate(e)},vibrateWithPattern:function(e,n){return navigator.notification.vibrateWithPattern(e,n)},cancelVibration:function(){return navigator.notification.cancelVibration()}}}]),angular.module("ngCordova.plugins.videoCapturePlus",[]).provider("$cordovaVideoCapturePlus",[function(){var e={};this.setLimit=function(n){e.limit=n},this.setMaxDuration=function(n){e.duration=n},this.setHighQuality=function(n){e.highquality=n},this.useFrontCamera=function(n){e.frontcamera=n},this.setPortraitOverlay=function(n){e.portraitOverlay=n},this.setLandscapeOverlay=function(n){e.landscapeOverlay=n},this.setOverlayText=function(n){e.overlayText=n},this.$get=["$q","$window",function(n,r){return{captureVideo:function(o){var t=n.defer();return r.plugins.videocaptureplus?(r.plugins.videocaptureplus.captureVideo(t.resolve,t.reject,angular.extend({},e,o)),t.promise):(t.resolve(null),t.promise)}}}]}]),angular.module("ngCordova.plugins.zip",[]).factory("$cordovaZip",["$q","$window",function(e,n){return{unzip:function(r,o){var t=e.defer();return n.zip.unzip(r,o,function(e){0===e?t.resolve():t.reject()},function(e){t.notify(e)}),t.promise}}}])}();
