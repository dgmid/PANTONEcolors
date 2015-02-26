function setup() {
	
	//presets...
	//presets...
	if( window.CodaPlugInPreferences.preferenceForKey('type') === undefined ) {
		window.CodaPlugInPreferences.setPreferenceForKey('hex', 'type');
	}
	
	if( window.CodaPlugInPreferences.preferenceForKey('size') === undefined ) {
		window.CodaPlugInPreferences.setPreferenceForKey('large', 'size');
	}
	
	if( window.CodaPlugInPreferences.preferenceForKey('name') === undefined ) {
		window.CodaPlugInPreferences.setPreferenceForKey('Yellow C', 'name');
	}
	
	if( window.CodaPlugInPreferences.preferenceForKey('category') === undefined ) {
		window.CodaPlugInPreferences.setPreferenceForKey('all', 'category');
	}
	
	if( window.CodaPlugInPreferences.preferenceForKey('hex') === undefined ) {
		window.CodaPlugInPreferences.setPreferenceForKey('#FEDD00', 'hex');
	}
	
	if( window.CodaPlugInPreferences.preferenceForKey('rgb') === undefined ) {
		window.CodaPlugInPreferences.setPreferenceForKey('rgb(254,221,0)', 'rgb');
	}
	
	//set controls & classes based on preferences...
	$('input[value="' + window.CodaPlugInPreferences.preferenceForKey('type') + '"]').prop('checked', true);
	$('input[value="' + window.CodaPlugInPreferences.preferenceForKey('size') + '"]').prop('checked', true);
	
	//set swatch sizes...
	if( window.CodaPlugInPreferences.preferenceForKey('size') === 'small' ) {

		$('main ul li').addClass('small');

	} else if ( window.CodaPlugInPreferences.preferenceForKey('size') === 'list' ) {

		$('main ul li').removeClass('small').addClass('list');
	}
	
	//set category...
	var category = window.CodaPlugInPreferences.preferenceForKey('category');
	
	$('#categories').val(category);
	
	if( category !== 'all' ) {		
		$('main ul li[data-category!="' + category + '"]').addClass('hidden');		
	}
	
	var type = window.CodaPlugInPreferences.preferenceForKey('type'),
	value;
	
	if( type === 'hex' ) {
		
		value = window.CodaPlugInPreferences.preferenceForKey('hex');
		
	} {
		
		value = window.CodaPlugInPreferences.preferenceForKey('rgb');
		
	}
	
	//set selection...
	$('.color-name').html(window.CodaPlugInPreferences.preferenceForKey('name'));
	$('.swatch').css('background-color', value);
	$('#header-button').attr('data-name', window.CodaPlugInPreferences.preferenceForKey('name')).attr('data-hex', window.CodaPlugInPreferences.preferenceForKey('hex')).attr('data-rgb', window.CodaPlugInPreferences.preferenceForKey('rgb'));
	
	//set type...
	$('.selected-type').html(type);
}


$(document).ready(function() {

	setup();


	//select color...
	$('#header-button, main ul li a').click(function(e) {
		
		e.preventDefault();

		var type 	= $('input[name="type"]:checked').val(),
		name 		= $(this).attr('data-name'),
		hex 		= $(this).attr('data-hex'),
		rgb 		= $(this).attr('data-rgb'),
		value;
	
		if( type === 'hex' ) {
			//hex color...
			value = hex;

		} else {
			//rgb color...
			value = rgb;

		}
			
		//update selection...
		window.CodaPlugInPreferences.setPreferenceForKey(name, 'name');
		window.CodaPlugInPreferences.setPreferenceForKey(hex, 'hex');
		window.CodaPlugInPreferences.setPreferenceForKey(rgb, 'rgb');
		
		//update selection swatch...
		$('#header-button').attr('data-name', name).attr('data-hex', hex).attr('data-rgb', rgb);
		$('.color-name').html(name);
		$('.swatch').css('background-color', value);
		
		//insert value into document...

		// 1) get selected text range...
		var range = window.CodaTextView.selectedRange();
		
		// 2) replace selection with value...
		window.CodaTextView.replaceCharactersInRangeWithString(range, value);
		
		// 3) re-select previous range to allow another selection...
		window.CodaTextView.setSelectedRange(window.CodaTextView.previousWordRange());
			
	});
	
	
	//Category filter...
	$('#categories').change(function() {
		var category = $(this).val();
		
		$('main ul li').removeClass('hidden');
		
		//filter swatches...
		if(category !== 'all') {
			
			$('main ul li[data-category!="' + category + '"]').addClass('hidden');
		}
		
		window.CodaPlugInPreferences.setPreferenceForKey(category, 'category');
		
	});
	
	//color value...
	$('input[name="type"]').click(function() {

		//update preferences...
		var type = $('input[name="type"]:checked').val();
		$('.selected-type').html(type);
		window.CodaPlugInPreferences.setPreferenceForKey(type, 'type');

	});

	//swatch size...
	$('input[name="size"]').click(function() {
		
		var category = window.CodaPlugInPreferences.preferenceForKey('category');
		
		var the_class = $(this).filter(':checked').val();

		$('main ul li').removeClass('hidden');

		if( the_class === 'large' ) {
			$('main ul li').removeClass('small').removeClass('list');

		} else if ( the_class === 'small' ) {
			$('main ul li').removeClass().addClass('small');

		} else {
			$('main ul li').removeClass().addClass('list');
		}
		
		if(category !== 'all') {
			
			$('main ul li[data-category!="' + category + '"]').addClass('hidden');
		}
		
		//update preferences...
		window.CodaPlugInPreferences.setPreferenceForKey(the_class, 'size');

	});


	//open options panel...
	$('#toggle-options').click(function() {
		$('footer').toggleClass('revealed');
	});

});
