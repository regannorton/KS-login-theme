<?php
/*
Plugin Name: WPAK Log User In
*/

/**
 * Authenticate the user when calling any WPAK web service.
 * Put this in a plugin : will not work in the php folder of the WPAK theme.
 */
add_action( 'template_redirect', 'wpak_log_user_in', 4 );
function wpak_log_user_in() {
	global $wp_query;
	
	//If we're calling a WP-AppKit web service:
	if ( !empty( $wp_query->query_vars['wpak'] ) ) {
	
		//Retrieve authentication data:
		$auth_data = isset( $_GET['auth_data'] ) ? $_GET['auth_data'] : array();

		//Log the user into WordPress
		WpakUserLogin::log_user_from_authenticated_action( 
			WpakApps::get_app_id( 'test-app' ),
			$wp_query->query_vars['wpak_slug'],
			$auth_data, 
			array()
		);

	}
	
}
