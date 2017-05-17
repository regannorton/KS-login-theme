define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags',
		  'theme/js/bootstrap.min','theme/js/clamp.min'
		], 
		function( $, App, TemplateTags ) {
	
	var text = {};
	
	font_size = 'medium';
	
	text.cycleFontSize = function(){
		if(font_size=='small'){
			$('.copy').removeClass('small');
			font_size='medium';
		} else if(font_size=='medium'){
			$('.copy').removeClass('medium');
			font_size='large';
		} else {
			$('.copy').removeClass('large');
			font_size='small';
		}
		$('.copy').addClass(font_size);
	}
	
	text.truncateTitles = function(){		
		var forEach = Array.prototype.forEach;
		var els = document.getElementsByTagName('h4');
		forEach.call(els, function(el) {
			$clamp(el, {clamp: 3});
		});
	}
	
	return text;
	
});