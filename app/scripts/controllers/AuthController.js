controllers.controller('AuthController', [
  '$rootScope', '$scope', '$state',
  function ($rootScope, $scope, $state) {
    if (D.debug) console.log('AuthController reporting in.');
    var vm = this;

    vm.user = D.user;
    vm.processing = false;
    vm.form = {};


  }
]);