'use strict';

angular.module('ngSocial.facebook', ['ngRoute','ngFacebook'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/facebook', {
    templateUrl: 'facebook/facebook.html',
    controller: 'facebookCtrl'
  });
}])

.config( function( $facebookProvider ) {
  $facebookProvider.setAppId('709330139215548');
  $facebookProvider.setPermissions("user_likes,email,public_profile,user_posts,user_photos,publish_actions");
})

.run( function( $rootScope ) {
  // Cut and paste the "Load the SDK" code from the facebook javascript sdk page.

  // Load the facebook SDK asynchronously
  (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) return;
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/es_LA/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
})
.controller('facebookCtrl', ['$scope','$facebook',function($scope,$facebook) {
  $scope.isLoggedIn = false;
  $scope.login = function(){
    $facebook.login().then(function(){
      $scope.isLoggedIn = true;
      refresh();
    });
  }

    $scope.logout = function(){
      $facebook.logout().then(function(){
        $scope.isLoggedIn = false;
        refresh();
      });
  }

  function refresh(){
    $facebook.api("/me?fields=id,email,first_name,last_name,locale,gender,link").then(function(response){
      $scope.welcomeMsg = "Welcome "+response.first_name+" "+response.last_name;
      $scope.isLoggedIn = true;
      $scope.userInfo = response;
      console.log($scope.userInfo);
      $facebook.api("/me/picture").then(function(response){
        $scope.picture = response.data.url;
        $facebook.api("/me/permissions").then(function(response){
          $scope.permissions = response.data;
          $facebook.api("/me/posts").then(function(response){
            $scope.posts = response.data;
            console.log("ok "+response.data)
          });
        });
      });
    },
  function(err){
    $scope.welcomeMsg = "Please Log In";
  });
  }

  $scope.postStatus = function(){
    var body = this.body;
    $facebook.api("/me/feed","post",{message:body}).then(function(response){
      $scope.msg = "Thanks for Posting";
    });
    refresh();
  }

  refresh();
}]);
