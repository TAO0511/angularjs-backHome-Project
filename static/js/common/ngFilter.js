var commonFilter = angular.module("common.filter",[]);
commonFilter.filter("formatDate",[function(){
	var result = function(date){
		if (date) {
			return date.substring(0,10);
		}
		return "";
	};
	return result;
}]);
commonFilter.filter("handleDate",[function(){
	var result = function(date){
		if (date) {
			var year = date.substring(0,4);
			var month = date.substring(4,6);
			var handle_date = year + '-' + month;
			return handle_date;
		}else{
			return '';
		}
	};
	return result;
}]);