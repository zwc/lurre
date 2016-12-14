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

		// fill out form
		var place = $('#driver-places .list-group-item.active').attr('data-id');
		var time = $('#driver-times .list-group-item.active').attr('data-id');
		var car = $('#driver-cars .list-group-item.active').attr('data-id');
		$('#create .place').val(place);
		$('#create .time').val(time);
		$('#create .car').val(car);

		$('#driver-go').show();
	});
	$('#drive').on('click', function(e) {
		e.preventDefault();
		$('#create').submit();
	});
});