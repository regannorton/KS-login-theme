define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags'
		], 
		function( $, App, TemplateTags ) {
	
	var theMenu = $('#categories');
	var menuOpen = false;
	var closeMenu;
	
	function afterOpen(){
		menuOpen = true;
		clearTimeout(closeMenu);
		closeMenu = setTimeout(menu.closeMenu,2000);
	}
	
	function afterClose(){
		menuOpen = false;
		clearTimeout(closeMenu);
	}
	
	var menu = {};
	
/*
	menu.toggleMenu = function(){
		theMenu.fadeToggle('fast','swing',
			closeMenu = setTimeout(menu.closeMenu,2000);
		);
	}
*/
	
	menu.openMenu = function(){
		if( menuOpen ){
			menu.closeMenu();
		} else {
			theMenu.fadeIn('fast','swing',
				afterOpen
			);
		}
	}
	
	menu.closeMenu = function(){
		theMenu.fadeOut('fast','swing',
			afterClose
		);
	}
	
	return menu;
	
});