define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags'
		], 
		function( $, App, TemplateTags ) {
	
	var user = {};
	
	user.name = '';
	
	user.setUserName = function( userName ){
		user.name = userName;
	}
	
	user.getUserName = function(){
		return user.name;
	}
	
	return user;
	
});