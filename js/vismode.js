define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags', 'core/modules/persistent-storage',
		  'theme/js/bootstrap.min'
		], 
		function( $, App, TemplateTags, PersistentStorage ) {
	
	var vismode = {};
	
	vismode.checkVisMode = function(){
		var useVisMode = PersistentStorage.get( 'accessibility','visMode' );
		if(useVisMode===true){
			$('#app-layout').addClass('accessible');
			$('#vis_mode').addClass('checked');
		} else {
			$('#app-layout').removeClass('accessible');
			$('#vis_mode').removeClass('checked');
		}
	}
	
	vismode.toggleVisMode = function(){
		var useVisMode = PersistentStorage.get( 'accessibility','visMode' );
		if(useVisMode===true){
			$('#app-layout').removeClass('accessible');
			$('#vis_mode').removeClass('checked');
			PersistentStorage.set ('accessibility','visMode',false);
		} else {
			$('#app-layout').addClass('accessible');
			$('#vis_mode').addClass('checked');
			PersistentStorage.set ('accessibility','visMode',true);
		}
	}

	
	return vismode;
	
});