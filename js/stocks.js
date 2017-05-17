define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags',
		  'theme/js/bootstrap.min'
		], 
		function( $, App, TemplateTags ) {
	
	var stocks = {};
	
	stocks.hideStocks = function(){
		$( '.stocks' ).addClass( 'inactive' );
	}
	
	stocks.showStocks = function(){
		$( '.stocks.inactive' ).removeClass( 'inactive' );
	}
	
	stocks.getStockInfo = function(){
		$.getJSON('https://finance.google.com/finance/info?client=ig&q=NASDAQ:HCCI&callback=?',
		function(response){
			var stockInfo = response[0];
			var stockPrice = stockInfo.l;
			var stockChange = parseFloat(stockInfo.c);
			if(stockChange<0){
				$('.hcci').css('color','red');
			} else {
				$('.hcci').css('color','green');
			}
			$('.hcci').html('HCCI: '+stockPrice);
			
			$.getJSON('https://finance.google.com/finance/info?client=ig&q=NASDAQ:CLMT&callback=?',
			function(response){
				var stockInfo = response[0];
				var stockPrice = stockInfo.l;
				var stockChange = parseFloat(stockInfo.c);
				if(stockChange<0){
					$('.clmt').css('color','red');
				} else {
					$('.clmt').css('color','green');
				}
				$('.clmt').html('CLMT: '+stockPrice);
				
				stocks.showStocks();
		  	});
	  	});
		
		
	}
	
	return stocks;
	
});