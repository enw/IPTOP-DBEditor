function IptopCtrl($scope, $http) {
    function updateUI () {
  $http({method: 'GET', url: '/employees'}).
  success(function(data, status, headers, config) {
      $scope.employees = data;
  }).
  error(function(data, status, headers, config) {
      console.log("ERR");
  });
    };
    updateUI();

  $scope.employees = [
                      /*
    {name:'Elliot', email:'elliot.winard@frogdesign.com', employeeNumber:1984, department:'TECH', isManager:true},
    {name:'Bob', email:'elliot.winard@frogdesign.com', employeeNumber:1984, department:'TECH', isManager:true},
    {name:'Ted', email:'elliot.winard@frogdesign.com', employeeNumber:1984, department:'TECH', isManager:true},
    {name:'Sean', email:'elliot.winard@frogdesign.com', employeeNumber:1984, department:'TECH', isManager:true}
                      */
];
  $scope.activeEmployee = {};

  $scope.deleteEmployee = function () {
      console.log("TODO: deleteEmployee", this.employee);

  $http({method: 'GET', url: '/deleteEmployee/'+this.employee.id}).
  success(function(data, status, headers, config) {
          console.log("SUCCESS: update view");
          // update view
          updateUI();
  }).
  error(function(data, status, headers, config) {
      console.log("ERR");
  });

  }
  $scope.upsertEmployee = function () {
      console.log("TODO: updateEmployee", this.activeEmployee);
      // don't require user to enter 0 if there is no active employee
      if (!this.activeEmployee.isManager) this.activeEmployee.isManager=0;

      // don't do anything if UI has no values
      if (!this.activeEmployee.name || !this.activeEmployee.email) return;

      $http.post('/upsertEmployee', this.activeEmployee).
  success(function(data, status, headers, config) {
          updateUI();
  }).
  error(function(data, status, headers, config) {
      console.log("ERR");
  });

  }
  $scope.selectEmployee = function () {
      $scope.activeEmployee = this.employee;
  }
}
