<?php

add_filter( 'wpak_posts_list_query_args', 'my_query_args_filter', 10, 2);
function my_query_args_filter( $query_args, $component ){
	
	//if( $component->slug == 'my-component-slug' && WpakWebServiceContext::$current_app_slug == 'my-app-slug' ) {
		
		$chosen_categories_slugs = WpakWebServiceContext::getClientAppParam('chosen_categories'); //Retrieve categories slugs sent by the app
		
		if( !empty( $chosen_categories_slugs ) ) {
			$query_args['tax_query'] = array(); //Maybe set some default categories here ?
			$query_args['tax_query']['relation'] = 'OR';
			foreach( $chosen_categories_slugs as $cat_slug ) {
				$query_args['tax_query'][] = array(
					'taxonomy' => 'category',
					'field'    => 'slug',
					'terms'    => $cat_slug,
				);
			}
		}
	//}
	
	return $query_args;
}