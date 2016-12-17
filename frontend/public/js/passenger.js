$( document ).ready(function() {
	$('#tours a').on('click', function(e) {
		e.preventDefault();
		$('#tours a').removeClass('active');
		$(this).addClass('active');
		var forward = $(this).attr('data-seats-forward');
		var back = $(this).attr('data-seats-back');
		$('#seats .forward .amount').text(forward);
		$('#seats .back .amount').text(back);
		if(forward !== "1") { $('#seats .forward .plural').text('er'); } else { $('#seats .forward .plural').text(''); }
		if(back !== "1") { $('#seats .back .plural').text('er'); } else { $('#seats .back .plural').text(''); }
		if(forward === "0") { $('#seats .forward').hide(); } else { $('#seats .forward').show(); }
		if(back === "0") { $('#seats .back').hide(); } else { $('#seats .back').show(); }
		$('#seats a').removeClass('active');
		$('#go').hide();
		$('#seats').show();
	});
	$('#seats a').on('click', function(e) {
		e.preventDefault();

		$('#seats a').removeClass('active');
		$(this).addClass('active');

		// fill out form
		$('#create .guid').val($('#tours .list-group-item.active').attr('data-id'));
		$('#create .seat').val($('#seats .list-group-item.active').attr('data-id'));

		$('#go').show();
	});
	$('#follow').on('click', function(e) {
		e.preventDefault();
		$('#create').submit();
	});
});