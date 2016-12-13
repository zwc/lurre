$( document ).ready(function() {
	$('#driver-places a').on('click', function(e) {
		e.preventDefault();
		$('#driver-places a').removeClass('active');
		$(this).addClass('active');
		$('#driver-times').show();
	});
	$('#driver-times a').on('click', function(e) {
		e.preventDefault();
		$('#driver-times a').removeClass('active');
		$(this).addClass('active');
		$('#driver-cars').show();
	});
	$('#driver-cars a').on('click', function(e) {
		e.preventDefault();
		$('#driver-cars a').removeClass('active');
		$(this).addClass('active');
		$('#driver-go').show();
	});
});