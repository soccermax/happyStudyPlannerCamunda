function loadCaseStatus() {
	   // load task details via REST API from Camunda
  	   $.get( '/engine-rest/task/' + camForm.taskId, function( task ) {

  	   	   $scope.currentTask = task;

  	       // load "enabled" activities via REST API from Camunda
		   $.get( '/engine-rest/case-execution?caseInstanceId=' + task.caseInstanceId + '&enabled=true', function( result1 ) {
	         $scope.$apply(function () {
	            // remeber as Angular Scope Variable
	            $scope.enabledCaseExecutions = result1;
	         });
		   });

  	       // load "active" activities via REST API from Camunda
	  	   $.get( '/engine-rest/case-execution?caseInstanceId=' + task.caseInstanceId + '&active=true', function( result2 ) {
	         $scope.$apply(function () {
	            // remeber as Angular Scope Variable
	            $scope.activeCaseExecutions = result2;
	         });
		   });

  	       // load "finished" activities via REST API from Camunda
	  	   $.get( '/engine-rest/history/case-activity-instance?caseInstanceId=' + task.caseInstanceId + '&finished=true', function( result3 ) {
	         $scope.$apply(function () {
	            $scope.finishedCaseExecutions = result3;
	         });
		   });
	   });
	 };

	 // load case status when the form is rendered
	 loadCaseStatus();

	 // define function to manually start an activity which is "enabled"
	 $scope.manualStartCaseExecution = function(caseExecution) {
	 console.log(caseExecution);
	       var data = {
	            "variables": {
	       			"hinweise": {
	       				"value":  $('#textareaHints').val(),
	       				"type": "String"
	       			}
	       	    },
	       	    "deletions" : []
	       };
	       $('#textareaHints').val("");

	       // Call according REST API
		   $.ajax('/engine-rest/case-execution/' + caseExecution.id + '/manual-start', {
		         data: JSON.stringify(data),
		         contentType : 'application/json',
		         type : 'POST',
		         success: function (result) {
		            // when successful reload case status to reflect possible changes
		            loadCaseStatus();
		         }
		    });
	 };
	 // define function to disable an activity which is "enabled"
	 $scope.disableCaseExecution = function(caseExecution) {
		   $.ajax('/engine-rest/case-execution/' + caseExecution.id + '/disable', {
		         data: JSON.stringify({}),
		         contentType : 'application/json',
		         type : 'POST',
		         success: function (result) {
		            // when successful reload case status to reflect possible changes
		            loadCaseStatus();
		         }
		    });
	 };
	 $scope.saveVorerkrankungOnServer = function() {
        $.get( '/engine-rest/task/' + camForm.taskId, function( task ) {
		   $.ajax('/engine-rest/case-execution/' + $scope.currentTask.caseInstanceId + '/variables/vorerkrankung', {
		         data: JSON.stringify({
		         	value: $('#vorerkrankung').val(),
		         	type: "String"
		         }),
		         contentType : 'application/json',
		         type : 'PUT',
		         success: function (result) {
		         	window.location.reload();
		         }
		    });
	    });
	 };

	 $scope.saveRejectionOnServer = function() {
        $.get( '/engine-rest/task/' + camForm.taskId, function( task ) {
		   $.ajax('/engine-rest/case-execution/' + $scope.currentTask.caseInstanceId + '/variables/rejected', {
		         data: JSON.stringify({
		         	value: "true",
		         	type: "Boolean"
		         }),
		         contentType : 'application/json',
		         type : 'PUT',
		         success: function (result) {
		         	window.location.reload();
		         }
		    });
	    });
	 };
