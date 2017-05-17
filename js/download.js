function messageCallback(){
	$('.loading_overlay').remove();
	//console.log( 'OK' );
}

function showMessage(message, callback, title, buttonName) {

	title = title || "default title";
	buttonName = buttonName || 'OK';

	if(navigator.notification && navigator.notification.alert) {
		//console.log( 'navigator.notification.alert' );
		navigator.notification.alert(
			message,    // message
			callback,   // callback
			title,      // title
			buttonName  // buttonName
		);

	} else {
		//console.log( 'browser alert' );
		alert(message);
		callback();
	}

}

myCanView = null;

myViewer = null;

$cacheWarning = '<p class="caching">Caching</p>';

//First step check parameters mismatch and checking network connection if available call    download function
function DownloadFile(URL, File_Name) {
	//Parameters mismatch check
	if (URL == null && Folder_Name == null && File_Name == null) {
		return;
	}
	else {
		//checking Internet connection availablity
		var networkState = navigator.connection.type;
		if (networkState == Connection.NONE) {
			//console.log( 'NOT connected' );
			//alert('Connection failed.\nPlease check that your connection is correctly configured, and restart app.\nDouble click home button and then close this app by swiping it upwards.');
			$('.loading_overlay').remove();
			return;
		} else {
			//console.log( 'download('+URL+', '+File_Name+')' );
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccesss, fileSystemFail);

			function fileSystemSuccesss(fileSystem) {
				//console.log('ok');
				var download_link = encodeURI(URL);
				//console.log( 'downloading: '+download_link);
				ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL
				
				type = download_link.substr(download_link.lastIndexOf('&doctype=') + 9);
				//console.log( 'download type: '+type);
				
				uniqueName = download_link.substr( download_link.lastIndexOf('?id=')+4,10 );
				$addWarning = $($cacheWarning).appendTo( '.feedback' );
				$addWarning.addClass(type+uniqueName);
				$addWarning.addClass('on');
				
				var directoryEntry = fileSystem.root; // to get root path of directory
				directoryEntry.getDirectory('pdf', { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
				var rootdir = fileSystem.root;
				var fp = rootdir.toURL();//rootdir.fullPath; // Returns Fulpath of local directory
				//console.log( 'fp: '+fp );
				//fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
				fp = fp + "pdf/" + File_Name; // fullpath and name of the file which we want to give
				// download function call
				//console.log( 'ok lets download: '+fp );
				// download a file into created folder
				//console.log('download_link: '+download_link);
				//console.log('fp: '+fp);
				var fileTransfer = new FileTransfer();
				fileTransfer.download(download_link, fp,
					function (entry) {
						console.log("download complete: " , entry);
						myName = download_link.substr( download_link.lastIndexOf('?id=')+4,10 );
						myType = download_link.substr(download_link.lastIndexOf('&doctype=') + 9);
						myUniqueName = myType+myName;
						$('p.'+myUniqueName).removeClass('on');
					},
					function (error) {
						//Download abort errors or download failed errors
						//showMessage('This file appears to be missing from the system.',messageCallback,'Download Error')
					}
				);
			}
			
			function onDirectorySuccess(parent) {
				// Directory created successfuly
			}
			
			function onDirectoryFail(error) {
				//Error while creating directory
				//console.log("Unable to create new directory: " + error.code);
			}
			
			function fileSystemFail(evt) {
				//Unable to access file system
				//console.log(evt.target.error.code);
			}
		}
	}
}

//Second step to get Write permission and Folder Creation
function download(URL, File_Name) {
	//step to request a file system 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccesss, fileSystemFail);

	function fileSystemSuccesss(fileSystem) {
		//console.log('ok');
		var download_link = encodeURI(URL);
		ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL
		
		var directoryEntry = fileSystem.root; // to get root path of directory
		directoryEntry.getDirectory('pdf', { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
		var rootdir = fileSystem.root;
		var fp = rootdir.toURL();//rootdir.fullPath; // Returns Fulpath of local directory
		//console.log( 'fp: '+fp );
		//fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
		fp = fp + "pdf/" + File_Name; // fullpath and name of the file which we want to give
		// download function call
		//console.log( 'ok lets download: '+fp );
		// download a file into created folder
		//console.log('download_link: '+download_link);
		//console.log('fp: '+fp);
		
		fileTransfer.download(download_link, fp,
			function (entry) {
				//console.log("download complete: " , entry);
			},
			function (error) {
				//Download abort errors or download failed errors
				showMessage('This file appears to be missing from the system.',messageCallback,'Download Error')
			}
		);
	}
	
	function onDirectorySuccess(parent) {
		// Directory created successfuly
	}
	
	function onDirectoryFail(error) {
		//Error while creating directory
		alert("Unable to create new directory: " + error.code);
	}
	
	function fileSystemFail(evt) {
		//Unable to access file system
		alert(evt.target.error.code);
	}
}

//Third step for download a file into created folder
function filetransfer(download_link, fp, Post_Title) {
	var fileTransfer = new FileTransfer();
	// File download function with URL and local path
	
	//console.log('download_link: '+download_link);
	//console.log('fp: '+fp);
	
	fileTransfer.download(download_link, fp,
		function (entry) {
			//console.log("download complete: " , entry);
		},
		function (error) {
			//Download abort errors or download failed errors
			showMessage('This file appears to be missing from the system.',messageCallback,'Download Error')
		}
	);
}


function openFile(URL, File_Name, Post_Title){
	//console.log( 'openFile('+URL+', '+File_Name+', '+Post_Title+')' );
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
	function fileSystemSuccess(fileSystem) {
		//console.log('fileSystemSuccess');
		var rootdir = fileSystem.root;
		var filepath = rootdir.toURL();
		filepath = filepath + 'pdf/';
		//console.log('filepath: '+filepath);
		//console.log('URL: '+URL);
		//console.log('File_Name: '+File_Name);
		//console.log('Post_Title: '+Post_Title);

		var options = {
			title: Post_Title
		};
		
		myCanView = SitewaertsDocumentViewer.canViewDocument(
			filepath+File_Name,
			'application/pdf',
            options,
			function ()
            {
                // CAN
                //console.log('can be opened');
                myViewer = SitewaertsDocumentViewer.viewDocument(
		            filepath+File_Name,
					'application/pdf',
		            options,
		            function ()
		            {
		                // shown
		                //console.log('document shown');
						//console.log('this: ',this);
						//console.log('$(this): ',$(this));
						//console.log('myViewer: ',myViewer);
		                $('.loading_overlay').remove();
		            },
		            function ()
		            {
		                // closed
		                //console.log('document closed');
		                $('.loading_overlay').remove();
		            },
		            function (appId, installer)
		            {
		                // missing app
		                if (confirm("Do you want to install the free PDF Viewer App "
		                        + appId + " for Android?"))
		                {
		                    installer(
		                            function ()
		                            {
		                                //console.log('successfully installed app');
		                                if (confirm("App installed. Do you want to view the document now?"))
		                                    viewDocument(url, mimeType, storage);
		                            },
		                            function (error)
		                            {
		                                //console.log('cannot install app');
		                                //console.log(error);
		                            }
		                    );
		                }
		            },
		            function (error)
		            {
		                $('.loading_overlay').remove();
		                alert('Error opening document');
		                //console.log(error);
		            }
		    	);
            },
			function (appId, installer)
            {
                // MISSING APP
                //console.log('missing app');
            },
			function ()
            {
                // CANNOT
                //console.log('CANNOT be opened');
                var networkState = navigator.connection.type;
				if (networkState == Connection.NONE) {
					//console.log( 'NOT connected' );
					alert('Connection failed.\nPlease check that your connection is correctly configured, and restart app.\nDouble click home button and then close this app by swiping it upwards.');
					$('.loading_overlay').remove();
					return;
				} else {
					//step to request a file system 
				    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
				
					function fileSystemSuccess(fileSystem) {
						var download_link = encodeURI(URL);
						ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL
						
						var directoryEntry = fileSystem.root; // to get root path of directory
						directoryEntry.getDirectory('pdf', { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
						var rootdir = fileSystem.root;
						var fp = rootdir.toURL();//rootdir.fullPath; // Returns Fulpath of local directory
						//console.log( 'fp: '+fp );
						//fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
						fp = fp + "pdf/" + File_Name; // fullpath and name of the file which we want to give
						// download function call
						//console.log( 'ok lets download: '+fp );
						// download a file into created folder
						var fileTransfer = new FileTransfer();
						//console.log('download_link: '+download_link);
						//console.log('fp: '+fp);
						
						fileTransfer.download(download_link, fp,
							function (entry) {
								//console.log("download complete: " , entry);
								openFile(URL, File_Name, Post_Title);
							},
							function (error) {
								//Download abort errors or download failed errors
								showMessage('This file appears to be missing from the system.',messageCallback,'Download Error')
							}
						);
					}
					
					function onDirectorySuccess(parent) {
						// Directory created successfuly
					}
					
					function onDirectoryFail(error) {
						//Error while creating directory
						alert("Unable to create new directory: " + error.code);
					}
					
					function fileSystemFail(evt) {
						//Unable to access file system
						alert(evt.target.error.code);
					}
				}
                
            },
			function (error)
            {
                // ERROR
                //console.log('ERROR');
                $('.loading_overlay').remove();
                alert('Error opening document');
                //console.log(error);
            }
		);
		
		

	}
	
	function fileSystemFail(evt) {
		//Unable to access file system
		alert(evt.target.error.code);
	}
}


//Fourth step open file
/*
function openFile(file, Post_Title){
		console.log('Post_Title: '+Post_Title);
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);
	function fileSystemSuccess(fileSystem) {
		var rootdir = fileSystem.root;
		var fp = rootdir.toURL();
		file = file.substring(1);
		console.log('fp: '+fp);
		console.log('file: '+file);
		
		var options = {
			title: Post_Title
		};
		myViewer = SitewaertsDocumentViewer.viewDocument(
            fp+file,
			'application/pdf',
            options,
            function ()
            {
                // shown
                window.console.log('document shown');
				window.console.log('this: ',this);
				window.console.log('$(this): ',$(this));
				window.console.log('myViewer: ',myViewer);
                $('.loading_overlay').remove();
            },
            function ()
            {
                // closed
                window.console.log('document closed');
                $('.loading_overlay').remove();
            },
            function (appId, installer)
            {
                // missing app
                if (confirm("Do you want to install the free PDF Viewer App "
                        + appId + " for Android?"))
                {
                    installer(
                            function ()
                            {
                                window.console.log('successfully installed app');
                                if (confirm("App installed. Do you want to view the document now?"))
                                    viewDocument(url, mimeType, storage);
                            },
                            function (error)
                            {
                                window.console.log('cannot install app');
                                window.console.log(error);
                            }
                    );
                }
            },
            function (error)
            {
                $('.loading_overlay').remove();
                alert('cannot view document ' + url);
                window.console.log('cannot view document ' + url);
                window.console.log(error);
            }
    	);
	}
	
	function fileSystemFail(evt) {
		//Unable to access file system
		alert(evt.target.error.code);
	}
}
*/