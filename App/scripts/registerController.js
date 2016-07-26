var configuration = require('./configuration');

sync.controller('RegisterController', ['$scope','$rootScope','$http',function ($scope,$rootScope,$http) {
    var options = {
        'password-notMatch': 'password do not match',
        'SignUpInProgress' : 'Wait we are setting up your account.'
    };
    $scope.doSignUp=function(user){
      $('.register-form-main-message').addClass('show success').html(options['SignUpInProgress']);
        if(jQuery('#password').val() !== jQuery('#password-confirm').val()){
          $('.register-form-main-message').addClass('show error').html(options['password-notMatch']);
          setTimeout(messageRemove, 2000);
          function messageRemove(){
              jQuery('.register-form-main-message').removeClass('show error');
          }
          return;
        };
        var username=$('#username').val();
        var email=$('#email').val();
        jQuery.post($rootScope.endPoint+'/register', {username: username, password:user.password, email:email, option:'register', phone:user.phone}, function(data, textStatus, xhr) {
            if(data.status === 200){
                 if (!configuration.readSettings('user_credentials')) {
                    configuration.saveSettings('user_credentials', [user.email, user.password]);
                    //TODO on SignUp complete with success please use the above code to save user credential for future use also encrypt it on local!
                };
                 Redirecting();
            }else if(data.status ===500){
                
            };
        });
        function Redirecting(){
            window.location = '#EmailConfirmation';
        };
    };
}]);
sync.factory('isUsernameAvailable', ['$q','$http','$rootScope',function($q, $http,$rootScope) {
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! Redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };
    return function(username) {
        var deferred = $q.defer();
        $http.get($rootScope.endPoint + '/api/v1/users?username=' + username + '&access_token=8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY').success(function(data){
            if(data === 'available'){
                jQuery('.register-form-main-message').addClass('show success').html(options['msg-username-available']);
                setTimeout(messageRemove, 2000);
                function messageRemove(){
                    jQuery('.register-form-main-message').removeClass('show success');
                }
            }else if(data === 'taken'){
                jQuery('.register-form-main-message').addClass('show error').html(options['msg-username-taken']);
                setTimeout(usernameTaken, 2000);
                function usernameTaken(){
                    jQuery('.register-form-main-message').removeClass('show error');
                };
            };
            deferred.reject();
        }).error(function(err) {
           deferred.resolve();
        });
        return deferred.promise;
    };
}]);
sync.directive('uniqueEmail', ['isEmailAvailable',function(isEmailAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueEmail = isEmailAvailable;
        }
    };
}]);
sync.directive('uniqueUsername', ['isUsernameAvailable',function(isUsernameAvailable) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
            ngModel.$asyncValidators.uniqueUsername = isUsernameAvailable;
        }
    };
}]);
sync.factory('isEmailAvailable', ['$q','$http','$rootScope',function ($q, $http, $rootScope) {
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! Redirecting...',
        'msg-username-available': 'good username available!',
        'msg-username-taken'    : 'oops username taken',
        'msg-email-taken'       : 'email taken',
        'msg-email-available'   : 'email available',
        'msg-your-phone-suck'   : 'your phone is not valid',
        'useAJAX': true,
    };

    return function(email) {
         var deferred = $q.defer();

        $http.get($rootScope.endPoint + '/api/v1/users?email=' + email + '&access_token=8EuqcMNkF2yP50Dicpv9hLRRp7WOSabPlCu22liY').success(function(data){

            if(data==='email-available'){
                jQuery('.register-form-main-message').addClass('show success').html(options['msg-email-available']);
                setTimeout(messageRemove, 2000);
                function messageRemove(){
                    jQuery('.register-form-main-message').removeClass('show success');
                };

            }else if(data==='email-taken'){
                jQuery('.register-form-main-message').addClass('show error').html(options['msg-email-taken']);
                setTimeout(messageEmailTaken, 2000);
                function messageEmailTaken(){
                    jQuery('.register-form-main-message').removeClass('show error');
                };
            };
             deferred.reject();
         }).error(function() {
            deferred.resolve();
         });
         return deferred.promise;
    };
}]);
