define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags', 'core/modules/authentication',
		  'theme/js/download',
		  'theme/js/bootstrap.min'
		], 
		function( $, App, TemplateTags, Auth ) {
	
	/**
	* Builds a secured download link
	* 
	* @param {String} Id of the file (WP attachment for example) to download
	* @return {String} Secured download link (if a user has previously logged into
	*  the app using Auth.logUserIn(...) ).
	*/
	function build_secured_download_link( download_id, document_type ) {
	
		//Retrieve authentication data that we will be added to our link
		//to secure it. We want to be sure that the id received by the
		//server has not been modified along the way, so we add it to
		//the hmac (= control token) computation :
		var auth_data = Auth.getActionAuthData(
			'download-file', //action name
			['id'], //defines the key order of the following data for hmac computation
			        //(order matters for hmac and JSON objects are not ordered)
			{ id: download_id } //data that we want to be added to hmac computation
		);
		
		//Build download link:
		var download_link = '';
		
		//If a user is authenticated, add authentication data to the download link:
		if ( auth_data ) { 
			download_link = base_url+'/download.php?id='+ download_id; //Path example
			download_link += '&user='+ auth_data.user;
			download_link += '&timestamp='+ auth_data.timestamp;
			download_link += '&control='+ auth_data.control;
			download_link += '&doctype='+ document_type;
		}
		
		return download_link;
	}
	
	var pdf = {};
	
	pdf.printPDF = function(pdf_id, pdf_name, post_title, doc_type){
		var pdf_url = build_secured_download_link( pdf_id, doc_type );			
		console.log( 'pdf_url: '+pdf_url );
		if(window.requestFileSystem){
			$('body').prepend('<div class="loading_overlay"/>');
			$('.loading_overlay').click(function(e){
                $('.loading_overlay').remove();
			});
			openFile(
				pdf_url,
				pdf_name,
				post_title
			);
		} else {
			//IN BROWSER
			var win = window.open(pdf_url, '_system');
			win.focus();
		}
	}
	
	return pdf;
	
});