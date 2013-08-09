/* TODO:
   make multipage w/routes
   design basic skin
   replace $http calls with services
   push to lab 

   BUG:
   details on actively-edited employee are update on edit, should be on submit
*/

// module definition defines route provider
angular.module('iptop', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/employees', {templateUrl: 'partials/employee-list.html',   controller: IptopCtrl}).
      when('/employee/:id', {templateUrl: 'partials/employee-detail.html', controller: EmployeeDetailCtrl}).
      otherwise({redirectTo: '/employees'});
}]);


// Controller
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

function EmployeeDetailCtrl($scope, $routeParams, $http, $location) {
    console.log("EmployeeDetailCtrl", $routeParams);
    // make call for details if no id is passed in 
    if ($routeParams.id != "new") {
        $http.get('employee/'+$routeParams.id).success(function (data) {
            console.log("got it", data);
            $scope.employee = data;
        })
    }


  $scope.employee = {};

  $scope.upsertEmployee = function () {
      // don't require user to enter 0 if there is no active employee
      if (!this.employee.isManager) this.employee.isManager=0;

      // don't do anything if UI has no values
      if (!this.employee.name || !this.employee.email) return;

      $http.post('/upsertEmployee', this.employee).
          success(function(data, status, headers, config) {
              console.log("SUCCESS");
              $location.path("#/employees");
          }).
          error(function(data, status, headers, config) {
              console.log("upsert ERR");
          });
  }
}
