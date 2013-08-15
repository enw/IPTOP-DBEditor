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
    // helpers
    function resolver(deferred) {
        return function (data) {deferred.resolve(data);}
    }
    function errorer(msg, deferred) {
        return function(deferred) {
	    deferred.reject(msg);
        }
    }

    return {
        apiPath:'/',
        
        /* find all employees */
	findAll: function () {
	    //Creating a deferred object
	    var deferred = $q.defer();
            
	    //Calling Web API to fetch employees
	    $http.get(this.apiPath+'employees')
                .success(resolver(deferred))
	        .error(errorer("An error occured while fetching items", deferred));

	    //Returning the promise object
	    return deferred.promise;
        },

        /* delete employee */
        deleteEmployee: function (id) {
	    var deferred = $q.defer();
            $http.get('/deleteEmployee/'+id)
                .success(resolver(deferred))
	        .error(errorer("ERR while deleting", deferred));
            return deferred.promise;
        },

        /* add or update employee */
        upsertEmployee: function (emp) {
	    var deferred = $q.defer();
            $http.post('/upsertEmployee', emp)
                .success(resolver(deferred))
	        .error(errorer("ERR while upserting", deferred));
            return deferred.promise;
        },
        
        /* get deets for one employee */
        getOne: function (id) {
	    var deferred = $q.defer();
            $http.get('employee/'+id)
                .success(resolver(deferred))
                .error(errorer("ERR while getting one", id));
            return deferred.promise;
        }

    };
});


// Controller
function IptopCtrl($scope, employeeSvc) {
    // helper
    function logErr(err) {
        if (!err) err="";
        console.log("ERR", err);
    }

    // helper
    function updateUI () {
        employeeSvc.findAll().then(
           function(data){
               $scope.employees=data;
           }, logErr);
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
      employeeSvc.deleteEmployee(this.employee.id).then(updateUI, logErr);
  }

  $scope.upsertEmployee = function () {
      // don't require user to enter 0 if there is no active employee
      if (!this.activeEmployee.isManager) this.activeEmployee.isManager=0;

      // don't do anything if UI has no values
      if (!this.activeEmployee.name || !this.activeEmployee.email) return;
      
      employeeSvc.upsert(this.activeEmployee).then(updateUI, logErr);
  }
  $scope.selectEmployee = function () {
      $scope.activeEmployee = this.employee;
  }
}

function EmployeeDetailCtrl($scope, $routeParams, $http, $location, employeeSvc) {
    //console.log("EmployeeDetailCtrl", $routeParams);

    // make call for details if no id is passed in 
    if ($routeParams.id != "new") {
        employeeSvc.getOne($routeParams.id)
        .then(function (data) {
            $scope.employee = data;
        });
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
