define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags', 'core/modules/persistent-storage', 'theme/js/user', 'theme/js/bootstrap.min'
		], 
		function( $, App, TemplateTags, Storage, User ) {
	
	var favorites = {};
	
	favorites.getFavorites = function(){
		var user_name = User.getUserName();
		var storedFavorites = Storage.get( 'thg','stored_favorites_'+user_name );
		return storedFavorites;
	}
	
	favorites.saveFavorites = function(){
		var favorites = [];
		var user_name = User.getUserName();
		$('ul#fav_btns_left .checked,ul#fav_btns_right .checked').each(function( i ){
			var slug = $(this).data('val');
			favorites.push(slug);
		});
		Storage.set(
			'thg',
			'stored_favorites_'+user_name,
			favorites
		);
		chosenCategories = favorites;
		App.refresh(
			function() { //Success callback (cb_ok)
				
            }, 
            function( error ) { //Error callback (cb_error)
                  //Hide loading spinner
                  //Display error message based on error.message
            }
		);
	}
	
	favorites.populateFavorites = function(){
		$('ul#fav_btns_left,ul#fav_btns_right').empty();
		var storedFavorites = favorites.getFavorites();
		var halfway = categoryNames.length/2;
		$.each(categoryNames,function(i,val){
			var slug = val[0];
			var name = val[1];
			var btnHtml = '<li><a href="#" data-val="'+slug+'"';
			if( !storedFavorites || storedFavorites.indexOf(slug)>-1 ){
				btnHtml+= ' class="checked"';
			}
			btnHtml+= '>'+name+'</a></li>';
			if(i<halfway){
				$('ul#fav_btns_left').append(btnHtml);
			} else {
				$('ul#fav_btns_right').append(btnHtml);
			}
		});
	}
	
	return favorites;
	
});