define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags', 'core/modules/persistent-storage', 'theme/js/connection', 'theme/js/stocks', 'theme/js/pdf', 'theme/js/vismode', 'theme/js/text', 'theme/js/settings', 'theme/js/user', 'theme/js/menu', 'theme/js/moment.min', 
		  'theme/js/bootstrap.min', 'theme/js/search', 'theme/js/buttons','theme/js/swiper.jquery.min', 'theme/js/auth/auth-pages', 'theme/js/auth/simple-login', 'theme/js/auth/premium-posts', 'theme/js/comments', 'theme/js/datepicker', 'theme/js/clamp.min'
		], 
		function( $, App, TemplateTags, Storage, Conn, Stocks, PDF, Vismode, Text, Settings, User, Menu, moment ) {
			
	isConnected = Conn.isConnected();
	
	base_dir = 'https://knowledgesharedev.hfnelson.com';
	
	start_date = moment("2014-01-01").unix();
	end_date = moment().subtract(4,'hours').unix();
	
	availableCategories = [];

	chosenCategories = [];

	categoryNames = [];
	
	// HOLDS POST DATA FOR SINGLE-PAGE SECTIONS
	// SET WHEN retrievePosts IS CALLED
	section_data = [];
	
	clicked_index = 0;
	
	var swiperParams = {
        spaceBetween: 30,
        threshold: 40,
        onSlideChangeStart: function(swiper){
            window.scrollTo(0,0);
        }
    }

	App.on( 'info', function( info ) {
		console.log( 'Info: ',info );
		switch( info.event ) {
			case 'app-ready':			
				break;
			case 'auth:user-login':
			case 'auth:user-logout':
				console.log( 'LOGIN/LOGOUT' );
				break;
		}
	} );
	
	$(window).scroll(function() {
	   if($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
		   getMoreItems();
	   }
	});
	
	function getMoreItems(){
		App.getMoreComponentItems( 
			function() {
				//If something is needed once items are retrieved, do it here.
				//Note : if the "get more" link is included in the archive.html template (which is recommended),
				//it will be automatically refreshed.
				console.log( 'SUCCESS' );
				//$this.removeAttr( 'disabled' );
			},
			function( error, get_more_link_data ) {
				console.log( 'ERROR', error );
				//$this.removeAttr( 'disabled' ).text( text_memory );
			}
		);
	}

	var $refresh_button = $( '#refresh-button' );

	/**
	 * Launch app contents refresh when clicking the refresh button :
	 */
	$refresh_button.click( function( e ) {
		e.preventDefault();
		closeMenu();
		App.refresh();
	} );
    
	$( '.navbar' ).on( 'click', '.navbar-brand', function( e ) {
		e.preventDefault();
		Storage.clearAll();
		console.log( 'DELETE FAVORITES' );
	});

	/**
	 * Animate refresh button when the app starts refreshing
	 */
	App.on( 'refresh:start', function() {
		$refresh_button.addClass( 'refreshing' );
	} );

	/**
	 * When the app stops refreshing :
	 * - scroll to top
	 * - stop refresh button animation
	 * - display success or error message
	 *
	 * Callback param : result : object {
	 *		ok: boolean : true if refresh is successful,
	 *		message: string : empty if success, error message if refresh fails,
	 *		data: object : empty if success, error object if refresh fails :
	 *					   use result.data to get more info about the error
	 *					   if needed.
	 * }
	 */
	App.on( 'refresh:end', function( result ) {
		scrollTop();
		//Storage.clear( 'scroll-pos' );
		$refresh_button.removeClass( 'refreshing' );
		if ( result.ok ) {
			$( '#feedback' ).removeClass( 'error' ).html( 'Content updated successfully :)' ).slideDown();
		} else {
			$( '#feedback' ).addClass( 'error' ).html( result.message ).slideDown();
		}
		
		$('#waiting').hide();
		console.log('availableCategories: ', availableCategories);
		console.log('chosenCategories: ', chosenCategories);
		console.log('categoryNames: ', categoryNames);
		Stocks.getStockInfo();
		
	} );

	/**
	 * When an error occurs, display it in the feedback box
	 */
	App.on( 'error', function( error ) {
		console.log( error.message );
	} );

	/**
	 * Allow to click anywhere on post list <li> to go to post detail :
	 */
	$( '#container' ).on( 'click', 'li.media', function( e ) {
		e.preventDefault();
		var navigate_to = $( 'a', this ).attr( 'href' );
		App.navigate( navigate_to );
	} );

	/**
	 * Close menu when we click a link inside it.
	 * The menu can be dynamically refreshed, so we use "on" on parent div (which is always here):
	 */
	$( '#navbar-collapse' ).on( 'click', 'a', function( e ) {
		closeMenu();
	} );

	/**
	 * Open all links inside single content with the inAppBrowser
	 */
	$( "#container" ).on( "click", ".single-content a, .page-content a", function( e ) {
		e.preventDefault();
		openWithInAppBrowser( e.target.href );
	} );

	$( "#container" ).on( "click", ".comments", function( e ) {
		e.preventDefault();
		
		$('#waiting').show();
		
		App.displayPostComments( 
			$(this).attr( 'data-post-id' ),
			function( comments, post, item_global ) {
				//Do something when comments display is ok
				//We hide the waiting panel in 'screen:showed'
			},
			function( error ){
				//Do something when comments display fail (note that an app error is triggered automatically)
				$('#waiting').hide();
			}
		);
	} );

	/**
	 * "Get more" button in post lists
	 */
	$( '#container' ).on( 'click', '.get-more', function( e ) {
		e.preventDefault();
		
		var $this = $( this );
		
		var text_memory = $this.text();
		$this.attr( 'disabled', 'disabled' ).text( 'Loading...' );

		App.getMoreComponentItems( 
			function() {
				//If something is needed once items are retrieved, do it here.
				//Note : if the "get more" link is included in the archive.html template (which is recommended),
				//it will be automatically refreshed.
				console.log( 'SUCCESS' );
				$this.removeAttr( 'disabled' );
			},
			function( error, get_more_link_data ) {
				console.log( 'ERROR', error );
				$this.removeAttr( 'disabled' ).text( text_memory );
			}
		);
	} );

	/**
	 * Do something before leaving a screen.
	 * Here, if we're leaving a post list, we memorize the current scroll position, to
	 * get back to it when coming back to this list.
	 */
	App.on( 'screen:leave', function( current_screen, queried_screen, view ) {
		//current_screen.screen_type can be 'list','single','page','comments'
		if ( current_screen.screen_type == 'list' ) {
			//Storage.set( 'scroll-pos', current_screen.fragment, $( 'body' ).scrollTop() );
		}
	} );

	/**
	 * Do something when a new screen is showed.
	 * Here, if we arrive on a post list, we resore the scroll position
	 */
	App.on( 'screen:showed', function( current_screen, current_view ) {
		//console.log('Current Screen: ',current_screen);
	    //console.log('View: ',current_view);
		//current_screen.screen_type can be 'list','single','page','comments'
		if ( current_screen.screen_type == 'list' ) {
/*
			var pos = Storage.get( 'scroll-pos', current_screen.fragment );
			if ( pos !== null ) {
				$( 'body' ).scrollTop( pos );
			} else {
				scrollTop();
			}
*/
		} else {
// 			scrollTop();
		}
		
		if( current_view.template_name == 'archive' || current_view.template_name == 'single' ){
			
			$( 'nav.login' ).removeClass( 'login' );
			
		}
		
		if( current_view.template_name == 'archive' ){
			
			$( 'nav.single' ).removeClass( 'single' );
			$( 'nav' ).addClass( 'archive' );
			
			$('#app-menu a[href^="#component"]').each(function(){
				$(this).removeClass('checked');
				var myCategory = $(this).attr('href').substr(11);
				if($.inArray(myCategory,chosenCategories)>=0){
					$(this).addClass('checked');
				}
			});
			
		}
		
		if( current_view.template_name == 'single' ){
			
			$( 'nav.archive' ).removeClass( 'archive' );
			$( 'nav' ).addClass( 'single' );
			
			if(section_data.length>1){
			   var swiper = new Swiper('.swiper-container', swiperParams);
			   swiper.slideTo(clicked_index, 0, false);
			}
			
		}
		
		if( current_view.template_name == 'login-page' ){
			
			$( 'nav.archive' ).removeClass( 'archive' );
			$( 'nav.single' ).removeClass( 'single' );
			$( 'nav' ).addClass( 'login' );
			Menu.closeMenu();
			Stocks.hideStocks();
			
		}
		
		if ( current_screen.screen_type == 'comments' ) {
			
			$('#waiting').hide();
			
		}
		
	} );

	/**
	 * Example of how to react to network state changes :
	 */
	/*
	 App.on( 'network:online', function(event) {
	 $( '#feedback' ).removeClass( 'error' ).html( "Internet connexion ok :)" ).slideDown();
	 } );
	 
	 App.on( 'network:offline', function(event) {
	 $( '#feedback' ).addClass( 'error' ).html( "Internet connexion lost :(" ).slideDown();
	 } );
	 */

	/**
	 * Manually close the bootstrap navbar
	 */
	function closeMenu() {
		var navbar_toggle_button = $( ".navbar-toggle" ).eq( 0 );
		if ( !navbar_toggle_button.hasClass( 'collapsed' ) ) {
			navbar_toggle_button.click();
		}
	}

	/**
	 * Get back to the top of the screen
	 */
	function scrollTop() {
		window.scrollTo( 0, 0 );
	}

	/**
	 * Opens the given url using the inAppBrowser
	 */
	function openWithInAppBrowser( url ) {
		window.open( url, "_blank", "location=yes" );
	}

} );
