define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags',
		  'addons/wp-appkit-search/wpak-search'
		], 
		function( $, App, TemplateTags, WpakSearch ) {
	
	var doSearch = function( a ){
		
		var search_string = a;
		
		WpakSearch.search( {
			string : search_string,
			tax_query : [
				{
					taxonomy : 'category',
					field : 'slug',
					terms : chosenCategories
				}
			],
			success : function( answer ) {
				//answer contains search results if you need to do
				//something with it, but in most cases you won't, because
				//the search addon redirects you to the search result
				//screen automatically. If you don't want this auto-redirect,
				//you can call WpakSearch.search() with the "redirect_after_search" 
				//option set to "false".
			}
		} );
	}


	$('#search-form').submit(function(e) {
		e.preventDefault();
		var searchTerm = $(this).find('input[type=text]').val();
		doSearch( searchTerm );
	});
	$('#search-form2').submit(function(e) {
		e.preventDefault();
		doSearch();
	});
	
	var search = {};
	
	return search;
	
});