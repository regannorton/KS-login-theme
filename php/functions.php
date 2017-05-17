<?php

add_filter( 'wpak_post_data', 'add_meta_to_my_app_posts', 10, 3 );
function add_meta_to_my_app_posts ( $post_data, $post, $component ) {
	
	$categories = get_the_category( $post->ID );
	$hash = '#';
	$separator = ', ';
	$data = '';
	$output = '';
	if($categories){
		foreach($categories as $category) {
			$data .= strtolower($category->cat_name).$hash;
			//$output .= '<a href="#component-'.strtolower($category->cat_name).'" title="' . esc_attr( sprintf( __( "View all posts in %s" ), $category->name ) ) . '">'.$category->cat_name.'</a>'.$separator;
			$output .= $category->cat_name.$separator;
		}
		$post_data['cat_data'] = trim($data, $hash);
		$post_data['categories'] = trim($output, $separator);
		$post_data['thumb_custom'] = wp_get_attachment_image_src(get_post_thumbnail_id($post->ID), array(1024,221));
	}
	
	
    //Add our meta to the application post data :
    $post_data['thg_curator_article_source'] = get_post_meta( $post->ID, 'thg_curator_article_source', true);
    $post_data['custom_id'] = get_post_meta( $post->ID, 'custom-id', true);
    
	//error_log( 'custom_id: '.$post_data['custom_id'], 3, "/var/tmp/my-errors.log" );
	
	$post_comments = get_comments( array(
		'post_id' => $post->ID,
		'status' => 'approve',
		'number' => 30, //Set the max number of comments here
		//Set any other get_comment() args you may need
	) );
	
	// Maybe here you should remove from $post_comments comments
	// all that is not useful in your app display (things like 
	// "comment_author_IP" etc...) to keep the web service as
	// light as possible.
	
	$post_data['comments'] = $post_comments;
	
	$meta_key = rwmb_meta( 'thg_curator_file',array(),$post->ID );
	$post_meta = get_post_meta($meta_key, '_wp_attached_file', true);
	$attachment = 'https://knowledgesharedev.hfnelson.com/wp-content/uploads/'.$post_meta;
	$post_data['attachment'] = $attachment;
	
    return $post_data; //Return the modified $post_data
    
}

add_filter( 'wpak_navigation_items', 'my_navigation_items' );
function my_navigation_items( $navigation_items ) {
	$visible_categories = WpakWebServiceContext::getClientAppParam('user_cats');
	
//	var_dump( $visible_categories );
//	exit();
	
	foreach( $navigation_items as $k=>$v ) {
		if(is_array($visible_categories)){
			if(!in_array($k,$visible_categories)){
				unset( $navigation_items[$k] );
			}
		}
	}
	
	return $navigation_items;
}

add_filter( 'wpak_posts_list_query_args', 'my_query_args_filter', 10, 2);
function my_query_args_filter( $query_args, $component ){
	
	//if( $component->slug == 'my-component-slug' && WpakWebServiceContext::$current_app_slug == 'my-app-slug' ) {
		$chosen_date_range = WpakWebServiceContext::getClientAppParam('date_range');
		$start = $chosen_date_range[0];
		$start = date('F d, Y',$start);
		$end = $chosen_date_range[1];
		$end = date('F d, Y',$end);
		$end = $end." 23:59:59";
		$query_args['date_query'] = array(
			array(
				'after' =>$start,
				'before' =>$end,
				'inclusive' => true,
			)
		);
		
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