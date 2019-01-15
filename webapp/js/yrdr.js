var yrdrapp = angular.module('yrdrapp',['ngRoute']);

yrdrapp.config(function($routeProvider) {
	$routeProvider
	.when('/yrdrcustomersearch', {
		templateUrl : 'yrdrCustomerSearch.html'
	})
	.when('/yrdrcreatecustomer', {
		templateUrl : 'yrdrCreateCustomer.html',
		controller : 'yrdrCustomerCreateController'
	})
	.when('/yrdrprices', {
		templateUrl : 'yrdrPrices.html',
		controller : 'yrdrPriceController'
	})
	.when('/yrdrexpenses', {
		templateUrl : 'yrdrExpenses.html',
		controller : 'yrdrExpenseController'
	})
	.when('/yrdremail', {
		templateUrl : 'yrdrEmail.html',
		controller : 'yrdrCustomerEmailController'
	})
	.when('/stacks', {
		templateUrl : 'stacks.html',
	})
	.otherwise({
		redirectTo: '/yrdrcustomersearch'
	});
});

/*------------------------PRICE CONTROLLER------------------------*/

yrdrapp.controller('yrdrPriceController', function($scope, $http) {

	$scope.showSearch = true;
	$scope.showEditDelete = false;
	$scope.nav = { button : 'update' };

	$scope.totalPrice; 

		$scope.updateJob = function(jobToUpdate) {
		console.log('jobToUpdate');
	}

	$scope.getJobs = function() {
		console.log('getJobs');
		$scope.jobs = [{ "jobs " : "retrieving jobs..." }];

		$http.get("/movieapi/api/v1/jobs")
		.then(function(response) {
			$scope.jobs = response.data;
			console.log('number of jobs: ' + $scope.jobs.length);
		}, function(response) {
			console.log('error HTTP GET jobs: ' + response.status);
		});
	}

	$scope.updateJob = function(jobToUpdate) {
		console.log('JobToUpdate: ' + jobToUpdate.jobName);

		$scope.jobToUpdate = angular.copy(jobToUpdate);
		$scope.showEditDelete = true;
		$scope.showSearch = false;
		$scope.isUpdateButtonDisabled = false;
		$scope.isDeleteButtonDisabled = false;
		$scope.updateStatus = '';
	}

	$scope.returnToSearch = function() {
		$scope.showEditDelete = false;
		$scope.showSearch = true;
		$scope.getJobs();
	}

	$scope.deleteJob = function(id) {
		console.log('delete job: ' + id);
		$http.delete("/movieapi/api/v1/jobs/" + id)
		.then(function(response) {
			$scope.isUpdateButtonDisabled = true;
			$scope.isDeleteButtonDisabled = true;
			$scope.updateStatus = 'delete successful';
			console.log('number of jobs deleted: ' + response.data.length);
		}, function(response) {
			console.log('error HTTP DELETE jobs: ' + response.status);
			$scope.updateStatus = 'delete error, ' + response.data.message;
		});
	}

	$scope.putJob = function(jobToUpdate) {
		$scope.jsonObject = angular.toJson(jobToUpdate, false);
		console.log('update job: ' + $scope.jsonObject);

		$http.put("/movieapi/api/v1/jobs", $scope.jsonObject)
		.then(
				function success(response) {
					$scope.isUpdateButtonDisabled = true;
					console.log('status: ' + response.status);
					$scope.updateStatus = 'update successful';
				},
				function error(response) {
					console.log('error, return status: ' + response.status);
					$scope.updateStatus = 'update error, ' + response.data.message;
				}
		);
	};


	$scope.postJob = function() {
		$scope.jsonObject = angular.toJson($scope.newJob, false);
		console.log('new job: ' + $scope.jsonObject);

		$http.post("/movieapi/api/v1/jobs", $scope.jsonObject)
		.then(
				function success(response) {
					console.log('status: ' + response.status);
					$scope.createStatus = 'successful insert of new jobs';
					$scope.successfulInsert = true;
				},
				function error(response) {
					console.log('error, return status: ' + response.status);
					$scope.createStatus = 'insert error, ' + response.data.message;
				}
		);
	};

	$scope.clearJob = function() {
		$scope.createStatus = 'Enter new job information';
		$scope.successfulInsert = false;
		$scope.newJob = {
				JobId : '' ,
				JobName : '',
				JobPrice : ''							
		};
	}
	
	
	/*--------------------------INVOICE-----------------------*/

	$scope.invoice = {
			items: []
	};

	$scope.add = function(selectedJob) {
		$scope.invoice.items.push({
			name: selectedJob.jobName,
			description: '',
			qty: 1,
			price: selectedJob.jobPrice
		});
	}

	$scope.remove = function(index) {
		$scope.invoice.items.splice(index, 1);
	}

	$scope.total = function() {
		var total = 0;
		angular.forEach($scope.invoice.items, function(item){
			total += item.qty * item.price;
		})
		return total;
	}
		
	$scope.getReceipts = function() {
		console.log('getReceipts');
		$scope.jobs = [{ "receipts " : "retrieving receipts..." }];

		$http.get("/movieapi/api/v1/receipts")
		.then(function(response) {
			$scope.receipts = response.data;
			console.log('number of jobs: ' + $scope.receipts.length);
		}, function(response) {
			console.log('error HTTP GET receipts: ' + response.status);
		});
	}
	
	$scope.postReceipt = function() {
		$scope.jsonObject = angular.toJson($scope.newReceipt, false);
		console.log('new receipt: ' + $scope.jsonObject);

		$http.post("/movieapi/api/v1/receipts", $scope.jsonObject)
		.then(
				function success(response) {
					console.log('status: ' + response.status);
					$scope.createStatus = 'successful insert of new receipt';
					$scope.successfulInsert = true;
				},
				function error(response) {
					console.log('error, return status: ' + response.status);
					$scope.createStatus = 'insert error, ' + response.data.message;
				}
		);
	};


	/*-----------when the page first loads, then get all jobs------------*/
	$scope.getJobs();

});

/*-----------------------EXPENSE CONTROLLER----------------------*/

yrdrapp.controller('yrdrExpenseController', function($scope, $http) {
	
	$scope.invoice = {
			items: []
	};

	$scope.add = function(selectedExpense){
		$scope.invoice.items.push({
			name: selectedExpense.expenseName,
			description: '',
			qty: 1,
			price: selectedExpense.expensePrice
		});
	},

	$scope.remove = function(index){
		$scope.invoice.items.splice(index, 1);
	},

	$scope.total = function(){
		var total = 0;
		angular.forEach($scope.invoice.items, function(item){
			total += item.qty * item.price;
		})
		return total;
	}

	$scope.showSearch = true;
	$scope.showEditDelete = false;
	

	$scope.updateExpense = function(expenseToUpdate) {
		console.log('expenseToUpdate');
	}

	$scope.getExpenses = function() {
		console.log('getExpenses');
		$scope.expenses = [{ "expenses " : "retrieving expenses..." }];

		$http.get("/movieapi/api/v1/expenses")
		.then(function(response) {
			$scope.expenses = response.data;
			console.log('number of expenses: ' + $scope.expenses.length);
		}, function(response) {
			console.log('error HTTP GET expenses: ' + response.status);
		});
	}

	$scope.updateExpense = function(expenseToUpdate) {
		console.log('ExpenseToUpdate: ' + expenseToUpdate.expenseName);
				
			$scope.expenseToUpdate = angular.copy(expenseToUpdate);
			$scope.isUpdateButtonDisabled = false;
							
	}

	$scope.returnToSearch = function() {
		$scope.getExpenses();
	}

	$scope.deleteExpense = function(id) {
		console.log('delete expense: ' + id);
		$http.delete("/movieapi/api/v1/expenses/" + id)
		.then(function(response) {
			$scope.isUpdateButtonDisabled = true;
			$scope.isDeleteButtonDisabled = true;
			$scope.updateStatus = 'delete successful';
			console.log('number of expenses deleted: ' + response.data.length);
		}, function(response) {
			console.log('error HTTP DELETE expenses: ' + response.status);
			$scope.updateStatus = 'delete error, ' + response.data.message;
		});
	}

	$scope.putExpense = function(expenseToUpdate) {
		$scope.jsonObject = angular.toJson(expenseToUpdate, false);
		console.log('update expense: ' + $scope.jsonObject);

		$http.put("/movieapi/api/v1/expenses", $scope.jsonObject)
		.then(
				function success(response) {
					$scope.isUpdateButtonDisabled = true;
					console.log('status: ' + response.status);
					$scope.updateStatus = 'update successful';
				},
				function error(response) {
					console.log('error, return status: ' + response.status);
					$scope.updateStatus = 'update error, ' + response.data.message;
				}
		);	
		$scope.getExpenses();
	};

	$scope.postExpense = function() {
		$scope.jsonObject = angular.toJson($scope.newExpense, false);
		console.log('new expense: ' + $scope.jsonObject);

		$http.post("/movieapi/api/v1/expenses", $scope.jsonObject)
		.then(
				function success(response) {
					console.log('status: ' + response.status);
					$scope.createStatus = 'successful insert of new expense';
					$scope.successfulInsert = true;
				},
				function error(response) {
					console.log('error, return status: ' + response.status);
					$scope.createStatus = 'insert error, ' + response.data.message;
				}
		);
	};

	$scope.clearExpense = function() {
		$scope.createStatus = 'Enter new expense information';
		$scope.successfulInsert = false;
		$scope.newExpense = {
				Id : '' ,
				ExpenseName : '',
				ExpensePrice : ''							
		};
	}

	/*-----------when the page first loads, then get all expenses------------*/
	$scope.getExpenses();
	
});

/*-----------------------YRDR CONTROLLER----------------------*/

yrdrapp.controller('yrdrcontroller', function($scope, $http, $location) {

	$scope.navName = 'YRDR';

	/*----------------------------Search View Variables-------------------------------------*/

	$scope.showSearch = true;
	$scope.showEditDelete = false;
	$scope.nav = { button : 'update' };
	
	
	$scope.updateCustomer = function(customerToUpdate) {
		console.log('customerToUpdate');
	}

	$scope.getCustomers = function() {
		console.log('getCustomers');
		$scope.customers = [{ "customers " : "retrieving customers..." }];

		$http.get("/movieapi/api/v1/customers")
		.then(function(response) {
			$scope.customers = response.data;
			console.log('number of customers: ' + $scope.customers.length);
		}, function(response) {
			console.log('error HTTP GET customers: ' + response.status);
		});
	}

	$scope.updateCustomer = function(customerToUpdate) {
		console.log('customerToUpdate: ' + customerToUpdate.firstName + " " + customerToUpdate.lastName);

		if($scope.nav.button === 'text') {
			$scope.textNumber = (1 + customerToUpdate.phoneNumber);
			$scope.go('/yrdremail');	
		}else if($scope.nav.button === 'email') {
			$scope.emailText = customerToUpdate.eMail;
			$scope.go('/yrdremail');
		}else if($scope.nav.button === 'receipt') {
			$scope.emailText = customerToUpdate.eMail;
			$scope.go('/yrdrreceipt');
		} else {
			$scope.customerToUpdate = angular.copy(customerToUpdate);
			$scope.showEditDelete = true;
			$scope.showSearch = false;
			$scope.isUpdateButtonDisabled = false;
			$scope.isDeleteButtonDisabled = false;
			$scope.updateStaus = '';
		}
	}

	$scope.go = function(path) {
		$location.path(path);
	}

	$scope.returnToSearch = function() {
		$scope.showEditDelete = false;
		$scope.showSearch = true;
		$scope.getCustomers();
	}

	$scope.deleteCustomer = function(id) {
		console.log('delete customer: ' + id);
		$http.delete("/movieapi/api/v1/customers/" + id)
		.then(function(response) {
			$scope.isUpdateButtonDisabled = true;
			$scope.isDeleteButtonDisabled = true;
			$scope.updateStatus = 'delete successful';
			console.log('number of customers deleted: ' + response.data.length);
		}, function(response) {
			console.log('error HTTP DELETE customers: ' + response.status);
			$scope.updateStatus = 'delete error, ' + response.data.message;
		});
	}

	$scope.putCustomer = function(customerToUpdate) {
		$scope.jsonObject = angular.toJson(customerToUpdate, false);
		console.log('update customer: ' + $scope.jsonObject);

		$http.put("/movieapi/api/v1/customers", $scope.jsonObject)
		.then(
				function success(response) {
					$scope.isUpdateButtonDisabled = true;
					console.log('status: ' + response.status);
					$scope.updateStatus = 'update successful';
				},
				function error(response) {
					console.log('error, return status: ' + response.status);
					$scope.updateStatus = 'update error, ' + response.data.message;
				}
		);
	};
	

	/*-----------when the page first loads, then get all customers------------*/
	$scope.getCustomers();
	

});

yrdrapp.controller('yrdrCustomerCreateController', function($scope, $http) {

	$scope.postCustomer = function() {
		$scope.jsonObject = angular.toJson($scope.newCustomer, false);
		console.log('new customer: ' + $scope.jsonObject);

		$http.post("/movieapi/api/v1/customers", $scope.jsonObject)
		.then(
				function success(response) {
					console.log('status: ' + response.status);
					$scope.createStatus = 'successful insert of new customer';
					$scope.successfulInsert = true;
				},
				function error(response) {
					console.log('error, return status: ' + response.status);
					$scope.createStatus = 'insert error, ' + response.data.message;
				}
		);
	};

	$scope.clearCustomer = function() {
		$scope.createStatus = 'Enter new customer information';
		$scope.successfulInsert = false;
		$scope.newCustomer = {
				firstName : '',
				lastName : '',
				address : '',
				city : '',
				state : '',
				phoneNumber : '',
				eMail : '',
				serviceDay : ''
		};
	}
});

/*-----------------------------Email and SNS Controller-------------------------------*/
yrdrapp.controller('yrdrCustomerEmailController', function($scope, $http) {
	$scope.emailCustomers = function() {
		var email = {
				emailSubject : $scope.emailSubject,
				emailText : $scope.emailText
		};
		$scope.jsonEmailObject = angular.toJson(email, false);
		console.log('email customers: ' + $scope.jsonEmailObject);

		$http.post("/movieapi/api/v1/customers/email", $scope.jsonEmailObject)
		.then(
				function success(response) {
					$scope.emailStatus = "success. press 'Clear' to enter new email";
				},
				function error(response) {
					console.log('error sending email, status: ' + response.status);
					$scope.emailStatus = "error. press 'Clear' to try again";
				}
		);
	};

	$scope.emailCustomersClear = function() {
		$scope.emailSubject = '';
		$scope.emailText = '';
		$scope.emailStatus = '';
	};
	
	

	$scope.textCustomer = function() {
		console.log('text customer');
		var text = {
				textNumber : $scope.textNumber,
				textContent : $scope.textContent
		};

		$scope.jsonTextObject = angular.toJson(text, false);
		console.log('email customers: ' + $scope.jsonTextObject);

		$http.post("/movieapi/api/v1/customers/text", $scope.jsonTextObject)
		.then(
				function success(response) {
					$scope.textStatus = "success. press 'Clear' to enter new text";
				},
				function error(response) {
					console.log('error sending text, status: ' + response.status);
					$scope.textStatus = "error. press 'Clear' to try again";
				}
		);
	};

	$scope.textCustomerClear = function() {
		$scope.textNumber = '';
		$scope.textContent = '';
		$scope.textStatus = '';
	};
});
