$( document ).ready(function() {
	jQuery.validator.addMethod("time", function(value, element) {
		return this.optional(element) || /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
	}, jQuery.validator.format("Please enter the correct value for {0} + {1}"));

	$('#theForm').validate();
});