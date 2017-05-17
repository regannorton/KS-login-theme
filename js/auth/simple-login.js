define( [ 'jquery', 'core/theme-app', 'core/modules/authentication', 'theme/js/favorites', 'theme/js/settings', 'theme/js/user', 'theme/js/datepicker' ], function( $, App, Auth, Favorites, Settings, User, DatePicker ) {
	
	/**
	 * User authentication theme module example that implements a "Simple login/logout form" 
	 * displayed under the topbar of app's theme.
	 * 
	 * When the user clicks the "Login" button, a minimalist login form comes up.
	 * When the user has logged in, a "Log out" button appears, and user connection 
	 * state info is displayed next to it, along with a link to the user page.
	 * 
	 * Login/logout are handled with the WP-AppKit Authentication API.
	 */
	
	
	App.setParam( 'refresh-at-app-launch', false );
//	App.setParam( 'go-to-default-route-after-refresh', false );

	App.addCustomRoute( 'login-page-route', 'login-page' );
	//This creates a route ('login-page-route' here) associated to your login-page.html template, so you can navigate to it whenever you want 
	
	App.filter( 'launch-route', function( launch_route, stats ){
		var user = Auth.getCurrentUser();
		if ( user ) {
			
			$('#waiting').show();
			launch_route = 'component-latest';
			//fragment of the component (post list) you want to display if logged in.
			//If this is a page, you can use TemplateTags.getPageLink()
			getTerms( user );
			
		} else {
			
			launch_route = 'login-page-route';
			//your login page route as defined in App.addCustomRoute
			
		}
		return launch_route;
	} );
	
	App.filter( 'web-service-params', function ( web_service_params, web_service_name ){
		var date_range = [start_date,end_date];
		web_service_params.date_range = date_range;
		web_service_params.date_range = date_range;
		web_service_params.auth_data = Auth.getActionAuthData( web_service_name );
		web_service_params.chosen_categories = chosenCategories;
		web_service_params.user_cats = availableCategories;
		return web_service_params;
	} );
	
/*
	function saveUserPassword(password){
		var credentials_group = 'credentials';
		var user_data_key = 'user_password';
		PersistentStorage.set (credentials_group, user_data_key, password);
	}
	
	function saveUserData(user){
		var credentials_group = 'credentials';
		var user_data_key = 'user_data';
		PersistentStorage.set (credentials_group, user_data_key, user);
	}
	
	function getSavedUserData(){
		var credentials_group = 'credentials';
		var user_data_key = 'user_data';
		var user_data = PersistentStorage.get (credentials_group, user_data_key);
		return user_data;
	}
*/
	
	function getTerms(data){
		if(data.user){
			var user_name = data.user;
		}
		if(data.login){
			var user_name = data.login;
		}
		$.ajax({
			url:base_dir+'/user_terms.php',
			type:'GET',
			dataType:'json',
			data:{name:user_name},
			success: function(data){
				$('#app-menu a[href^="#component"]').remove();
				availableCategories = [];
				categoryNames = [];
				$.each(data,function(k,v){
					//console.log('v',v);
					var name = v.name;
					var slug = v.slug;
					//if( $.inArray(slug,availableCategories)<0 ){
						availableCategories.push(slug);
						var categoryName = [slug,name];
						categoryNames.push(categoryName);
					//}
				});
				User.setUserName(user_name);
				//
				// INITIALLY SET CHOSEN CATEGORIES TO ALL CATEGORIES
				//
				chosenCategories = availableCategories;
				if( Favorites.getFavorites() ){
					chosenCategories = Favorites.getFavorites();
					App.refresh(
						function() { //Success callback (cb_ok)
							App.refreshComponent( {
					            success: function () {
					                App.reloadCurrentScreen();
					            }
							});
			            }, 
			            function( error ) { //Error callback (cb_error)
			                  //Hide loading spinner
			                  //Display error message based on error.message
			            }
					);
				} else {
					Settings.openSettings();
				}
				Favorites.populateFavorites();
								
			}
		});
	}

	var login = {};
	
	login.logIn = function(login,pass){
		//console.log('logging in with: '+login+', '+pass);
		$('#waiting').show();
		Auth.logUserIn( 
			login, 
			pass,
			function(data){
				//saveUserData(data);
				//saveUserPassword(pass);
				getTerms( data );
			}
		);
	}
	
	login.logout = function(){
		Auth.logUserOut();
		App.navigate( 'login-page' );
	}
	
	return login;

} );




