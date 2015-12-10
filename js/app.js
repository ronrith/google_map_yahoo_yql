
// Create a new module
var searchApp = angular.module('searchApp', []);
searchApp.controller('mainCtrl', function($scope, $http) {

	// Initial listing
	$scope.loading = false;
	$scope.category = ['Japanese','American','Chinese','Italian','Mexican','French','Asian','Pizza','Sea Food','Spanish','Polish','Bars',
						'Diner','Breakfast','Fusion','Grill'];
	$scope.location = ['Boston', 'Chicago', 'Dallas', 'Detroit', 'Las Vegas', 'Los Angeles', 'Miami',  
						'New York', 'Philadelphia', 'Portland', 'San Diego', 'San Francisco', 'Seattle', 'Washington'];
	

	$scope.fetchLocal = function(query, location){
		// Prepare YQL and fetch Local listing
		$scope.loading=true;
		$scope.apiResult=null;
		var	urlYQL = "https://query.yahooapis.com/v1/public/yql?format=json&q=",
			urlQuery = encodeURIComponent("select * from local.search(0,30) where query='"+query+"' and location='"+location+"'"),
			endPoint = urlYQL+urlQuery;
		$http.get(endPoint).success(function(data, status, headers, config) {
			$scope.apiResult = data.query.results.Result; 
			$scope.loading=false;
		}).error(function() {
			$scope.loading=false;
		});
	};

	$scope.setInput = function(type,input){
		// Set inputs for what to find and location
		if (type==1){
			$scope.cfind = input;
		}else{
			$scope.clocation = input;	
		}
	}

	$scope.keyEnter = function($event){
		// Submit event on keypress
		if ($event.which === 13){
			$scope.fetchLocal($("#query").val(), $("#location").val());
		}
	}

	$scope.submit = function(){
		// Submit event
		$scope.fetchLocal($("#query").val(), $("#location").val());
	}

	$scope.setMap = function($event,$index){
		// Set Google Map location with Marker
		var myLatlng = new google.maps.LatLng($scope.apiResult[$index].Latitude, $scope.apiResult[$index].Longitude);
		var marker = new google.maps.Marker({ position: myLatlng });
		gMap.setCenter(new google.maps.LatLng($scope.apiResult[$index].Latitude,$scope.apiResult[$index].Longitude));
		marker.setMap(gMap);
	}

	$scope.fetchLocal('sushi','lowell, ma');

}); 


// Custom filter directives
searchApp
	.filter('replace', function(){
	  return function(input, find, replace) {
	  	if (input){
	  		return input.replace(find, ''); 
	  	}
	  };
	})
	.filter('strlen', function() {
	  return function(input, limit) {
	  	if (input){
		    out = input.substring(0,limit);
		    return out;
		}
	  };
	});


/* ========================================================== */
// Google Map Initial functon

var gMap;
function mapInit() {
	var mapProp = {
		center:new google.maps.LatLng(42.64519,-71.30712),
		zoom:18,
		mapTypeId:google.maps.MapTypeId.ROADMAP
	};
	gMap=new google.maps.Map(document.getElementById("googleMap"),mapProp);
}
google.maps.event.addDomListener(window, 'load', mapInit);


