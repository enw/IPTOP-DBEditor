/* TODO:
   replace $http calls with services
*/

// module definition defines route provider
angular.module('iptop', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/employees', {templateUrl: 'partials/employee-list.html',   controller: IptopCtrl}).
      when('/employee/:id', {templateUrl: 'partials/employee-detail.html', controller: EmployeeDetailCtrl}).
      otherwise({redirectTo: '/employees'});
}]). factory('employeeSvc', function ($http, $q) {
    return {
        apiPath:'/',
        
        /* find all employees */
	findAll: function () {
	    //Creating a deferred object
	    var deferred = $q.defer();
            
	    //Calling Web API to fetch shopping cart items
	    $http.get(this.apiPath+'employees').success(function(data){
		//Passing data to deferred's resolve function on successful completion
		deferred.resolve(data);
	    }).error(function(){
		//Sending a friendly error message in case of failure
		deferred.reject("An error occured while fetching items");
	    });
	    //Returning the promise object
	    return deferred.promise;
        },

        /* delete employee */
        deleteEmployee: function (id) {
	    var deferred = $q.defer();
            
            $http({method: 'GET', url: '/deleteEmployee/'+id}).
                success(function(data, status, headers, config) {
                    deferred.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    deferred.reject("ERRR while deleting");
                });
            return deferred.promise;
        }
    };
});


// Controller
function IptopCtrl($scope, $http, employeeSvc) {
    function updateUI () {
        employeeSvc.findAll().then(
           function(data){
               $scope.employees=data;
           },
           function(err) {
               console.log("ERR", err);
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

      employeeSvc.deleteEmployee(this.employee.id).then(
          function () {
              // upate view;
              updateUI();
          },
          function () {
console.log("ERR");
          }
      );
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
