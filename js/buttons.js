define( [ 'jquery', 'core/theme-app',
		  'theme/js/auth/simple-login', 'theme/js/settings', 'theme/js/pdf', 'theme/js/vismode', 'theme/js/text', 'theme/js/menu'
		], 
		function( $, App, Login, Settings, PDF, Vismode, Text, Menu ) {

	var timer;
	
	function refresh(){
		App.refreshComponent( {
            success: function () {
                App.reloadCurrentScreen();
            }
		});
	}
	
	$('#app-menu').on('click', '#select', function(e){
		//$('#app-menu a').addClass('checked');
		chosenCategories = [];
		$('#app-menu a[href^="#component"]').each(function(i,e){
			var myId = $(this).attr('id');
			if(!myId){
				var myHref = $(this).attr('href');
				mySlug = myHref.substr(11);
				chosenCategories.push(mySlug);
			}
			$(this).addClass('checked');
		});
		refresh();
	});
	
	$('#app-menu').on('click', '#deselect', function(e){
		$('#app-menu a[href^="#component"]').removeClass('checked');
		chosenCategories = [];
		refresh();
	});
	
	$('#app-menu').on('click', '[href^="#component"]' ,function(e){
		//
		// CATEGORY BUTTON
		//
		e.stopImmediatePropagation();
		e.preventDefault();
		var target_href = $(e.target).attr('href');
		var target_category = target_href.substr(11);
		if($.inArray(target_category,chosenCategories)<0){
			chosenCategories.push(target_category);
			$(this).addClass('checked');
		} else {
			var index = chosenCategories.indexOf(target_category);
			chosenCategories.splice(index, 1);
			$(this).removeClass('checked');
		}
		refresh();
	});
	
	$( '#app-layout' ).on( 'click', '#settings', function( e ) {
		e.preventDefault();
		Settings.openSettings();
	} );
	
	$('#settings_modal').on('click', '#fav_btns_left a,#fav_btns_right a', function(e){
		e.preventDefault();
		myVal = $(this).data('val');
		$(this).toggleClass('checked');
	});
	
	$( '#settings_modal' ).on( 'click', '#save_favorites', function( e ) {
		e.preventDefault();
		Settings.closeSettings();
	});
	
	$( '#settings_modal' ).on( 'click', '#vis_mode', function( e ) {
		e.preventDefault();
		Vismode.toggleVisMode();
	});
	
	$( '.navbar' ).on( 'click', '.navbar-home', function( e ) {
		e.preventDefault();
		App.navigate( 'component-latest' );
	});
	$('.navbar').on('touchstart','.navbar-home',function(e){
		$(this).find('polygon').attr('stroke','#AAAAAA');
	});
	$('.navbar').on('touchend','.navbar-home',function(e){
		e.preventDefault();
		$(this).find('polygon').attr('stroke','#010101');
	});
	
	$( '.navbar' ).on( 'click', '#menu', function( e ) {
		e.preventDefault();
		Menu.openMenu();
	});
	
	$( '.navbar' ).on('click','#fontSizeAdjust',function(e){
		e.preventDefault();
		Text.cycleFontSize();
		Text.truncateTitles();
	});
	$('.navbar').on('touchstart','#fontSizeAdjust',function(e){
		$(this).find('path').attr('fill','#AAAAAA');
	});
	$('.navbar').on('touchend','#fontSizeAdjust',function(e){
		e.preventDefault();
		$(this).find('path').attr('fill','#010101');
	});
	
	$( '.navbar' ).on('click','#favorites',function(e){
		e.preventDefault();
		//accessFavorites();
		App.refresh();
	});
	$('.navbar').on('touchstart','#favorites',function(e){
		$(this).find('polygon').attr('stroke','#AAAAAA');
	});
	$('.navbar').on('touchend','#favorites',function(e){
		e.preventDefault();
		$(this).find('polygon').attr('stroke','#010101');
	});
	$('.navbar').on('touchstart','#share',function(e){
		$(this).find('polyline, rect').attr('stroke','#AAAAAA');
	});
	$('.navbar').on('touchend','#share',function(e){
		e.preventDefault();
		$(this).find('polyline, rect').attr('stroke','#010101');
	});
	
	/**
	 * Login page form submit : log the user in when submitting the login form,
	 * calling Auth.logUserIn(login, pass) with login and password entered by
	 * the user in the login form.
	 */
	$( '#app-content-wrapper' ).on( 'click', '#btn-login', function( e ) {
		e.preventDefault();
		var user = $('#user-login').val();
		var pass = $('#user-pass').val();
		Login.logIn(user,pass);
	} );
	
	/**
	 * Log the user out when clicking the "Log out" button
	 */
	$( '#app-layout' ).on( 'click', '#logout', function( e ) {
		e.preventDefault();
		Login.logout();
	} );
	
	//$( '#my-container' ).on( 'touchstart', '.print_btn', function(e){
	$( '#my-container' ).on( 'click', '.print_btn', function(e){
		e.preventDefault();
		var myOverlay = $(e.target).siblings('.view_article_overlay');
		if(myOverlay.is(':hidden')){
			myOverlay.fadeIn('fast');
			timer = window.setTimeout(function(){
				myOverlay.fadeOut('fast');
			}, 4000);

		} else {
			window.clearTimeout(timer);
			myOverlay.fadeOut('fast');
		}

	});
	
	$( '#my-container' ).on( 'touchstart', '.print_post', function( e ) {
		e.preventDefault();
		$(this).addClass( 'focus' );
	} );
	//$( '#my-container' ).on( 'touchend', '.print_post', function( e ) {
	$( '#my-container' ).on( 'click', '.print_post', function( e ) {
		e.preventDefault();
		$(this).removeClass( 'focus' );
		var pdf_id = $(this).data('pdf_id');
		var post_title = $(this).data('post_title');
		PDF.printPDF(pdf_id, pdf_id+'.pdf', post_title, 'a');
	} );
	
	$( '#my-container' ).on( 'touchstart', '.print_attachments', function( e ) {
		e.preventDefault();
		$(this).addClass( 'focus' );
	} );	
	//$( '#my-container' ).on( 'touchend', '.print_attachments', function( e ) {
	$( '#my-container' ).on( 'click', '.print_attachments', function( e ) {
		e.preventDefault();
		$(this).removeClass( 'focus' );
		var pdf_id = $(this).data('pdf_id');
		var post_title = $(this).data('post_title');
		PDF.printPDF(pdf_id, pdf_id+'_a.pdf', post_title, 'as');
	} );
	
	$( '#my-container' ).on( 'touchstart', '.print_all', function( e ) {
		e.preventDefault();
		$(this).addClass( 'focus' );
	} );
	//$( '#my-container' ).on( 'touchend', '.print_all', function( e ) {
	$( '#my-container' ).on( 'click', '.print_all', function( e ) {
		e.preventDefault();
		$(this).removeClass( 'focus' );
		var pdf_id = $(this).data('pdf_id');
		var post_title = $(this).data('post_title');
		PDF.printPDF(pdf_id, pdf_id+'_a_c.pdf', post_title, 'asc');
	} );
	
    $( '#app-layout' ).on( 'click', '.summary a', function( e ) {
        clicked_index = $(this).data('index');
    });
	
});