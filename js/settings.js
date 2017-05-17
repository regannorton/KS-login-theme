define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags', 
		  'theme/js/favorites', 'theme/js/menu', 
		  'theme/js/bootstrap.min','theme/js/clamp.min'
		], 
		function( $, App, TemplateTags, Favorites, Menu ) {
	
	function close(){
		$('#favorites_panel').fadeOut('fast');
		Favorites.saveFavorites();
	}
	
	var settings = {};
	
	settings.openSettings = function(){
		$('#favorites_panel').fadeIn('fast');
		Menu.closeMenu();
	}
	
	settings.closeSettings = function(){
		close();
	}
	
	return settings;
	
});