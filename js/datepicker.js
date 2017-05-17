define( [ 'jquery', 'core/theme-app', 'core/theme-tpl-tags', 'theme/js/moment.min',
		  'theme/js/bootstrap.min','theme/js/clamp.min', 'theme/js/daterangepicker'
		], 
		function( $, App, TemplateTags, moment ) {
	
	function dateFilter(startDate,endDate)
	{
		start_date = startDate;
		end_date = endDate;
		var st = moment.unix(start_date).format('MM/DD/YY');
		var en = moment.unix(end_date).format('MM/DD/YY');
		$('#daterange').val(st+' - '+en);
		$('#daterange2').val(st+' - '+en);
		App.refreshComponent( {
            success: function () {
                App.reloadCurrentScreen();
            }
		});
	}
		
	start = moment("2014-01-01");
    end = moment();
    
	var options =
	{	
		opens: 'left',
		ranges: {
			'Today and Yesterday': [moment().subtract('days', 1), moment()],
			'Last 7 Days': [moment().subtract('days', 6), moment()],
			'Last 30 Days': [moment().subtract('days', 29), moment()],
			'This Month': [moment().startOf('month'), moment().endOf('month')],
			'Last Month': [moment().subtract('month', 1).startOf('month'), moment().subtract('month', 1).endOf('month')],
			'Last 12 Months': [moment().subtract('days', 365), moment()],
			'All Time': [moment("2014-01-01"), moment()]
		},
		startDate: start,
		endDate: end
	}
	
	$('#daterange2').daterangepicker(
		options,
		function(start, end) {
			start = moment(start).unix();
			end = moment(end).unix();
			dateFilter(start,end);
		}
	);
	
	$('#daterange').daterangepicker(
		options,
		function(start, end) {
			start = moment(start).unix();
			end = moment(end).unix();
			dateFilter(start,end);
		}
	);
	
	$('#daterange').on('show.daterangepicker', function(ev, picker) {
		$('.input-mini').attr('readonly', true);
	});
	
	var datePicker = {};
	
	return datePicker;	
	
});