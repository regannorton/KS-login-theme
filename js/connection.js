define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags',
		  'theme/js/bootstrap.min'
		], 
		function( $, App, TemplateTags ) {
	
	//
	//
	
	//CHECK OUR CONNECTIVITY STATE
	
	//
	//
	
	var conn = {};
	
	conn.isConnected = function(){
    	var is_connected = false;
	    if(navigator.connection){
			var networkState = navigator.connection.type;
			if (networkState == Connection.NONE) {
				is_connected = false;
			} else {
				is_connected = true;
			}
		} else {
			//WE'RE IN-BROWSER
			//NO NEED TO CHECK FOR CONNECTION STATE
			is_connected = true;
		}
		return is_connected;
	}
	
	return conn;
	
});