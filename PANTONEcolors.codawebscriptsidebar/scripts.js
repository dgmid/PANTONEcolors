/* note(@duncanmid): PANTONEcolors - Coda 2 Sidebar Plugin v.1.2 | © D.G. Midwinter, @duncanmid */

//done(@duncanmid): options

var swatches = [
	'pantone solid coated',
	'pantone solid coated 112 new colors',
	'pantone color bridge coated',
	'pantone color bridge coated 112 new colors',
	'pantone pastels and neons coated',
	'pantone extended gamut coated',
	'pantone metallics coated',
	'pantone premium metallics coated',
	'pantone cmyk coated',
	'pantone pms'
];

var parameters = {
	'type': 	'hex',
	'size': 	'large',
	'name': 	'Yellow C',
	'category': 'all',
	'hex': 		'#FEDD00',
	'rgb': 		'rgb(254,221,0)',
	'comment':	'1',
	'palette':	'pantone_solid_coated'
};

var options = Object.keys(parameters);



//done(@duncanmid): setup (options)

function setup() {

	options.forEach( function(key) {
		
		if( window.CodaPlugInPreferences.preferenceForKey(key) === undefined ) {
			window.CodaPlugInPreferences.setPreferenceForKey(parameters[key], key);
		}
	});
}

setup();



//done(@duncanmid): update header swatch

function updateSwatch(name, hex, rgb) {
	
	$('#header-button').attr('data-name', name).attr('data-hex', hex).attr('data-rgb', rgb);
	$('.color-name').html(name);
	$('.swatch').css('background-color', hex);
}



//done(@duncanmid): initialize

function initialize() {
	
	var palette 	= window.CodaPlugInPreferences.preferenceForKey('palette'),
		type 		= window.CodaPlugInPreferences.preferenceForKey('type'),
		size 		= window.CodaPlugInPreferences.preferenceForKey('size'),
		name 		= window.CodaPlugInPreferences.preferenceForKey('name'),
		hex 		= window.CodaPlugInPreferences.preferenceForKey('hex'),
		rgb 		= window.CodaPlugInPreferences.preferenceForKey('rgb');
	
	
	//note(@duncanmid): swatches select
	
	swatches.forEach( function(key) {
		$('#palettes').append('<option value="' + key.replace(/\s+/g, "_") + '">' + key + '</option>');
	});
	
	
	//note(@duncanmid): set swatch sizes
	
	if( size === 'small' ) {

		$('main ul').addClass('small');

	} else if ( size === 'list' ) {

		$('main ul').removeClass('small').addClass('list');
	}
	
	
	//note(@duncanmid): set controls & classes based on preferences
	
	$('input[value="' + type + '"]').prop('checked', true);
	$('input[value="' + size + '"]').prop('checked', true);
	
	
	//note(@duncanmid): set palette
	
	$('#palettes').val( palette );
	$('#selected-palette').html( $('#palettes option:selected').text() );
	
	
	//note(@duncanmid): set selection
	
	updateSwatch(name, hex, rgb);
	
	//note(@duncanmid): set type
	
	$('.selected-type').html(type);	
}



//note(@duncanmid): load colors

function loadColors(swatches) {

	var palette = Object.keys( this[swatches] ),
		color;
	
	$('main ul').html('');
	
	palette.forEach( function(key) {
		
		color = this[swatches][key];
		
		$('main ul').append('<li><a href="#" data-hex="' + color.hex + '" data-rgb="' + color.rgb + '" style="background: ' + color.hex + ';" data-name="' + key + '" title="' + key + '"><span class="name">' + key + '</span></a></li>');
	});
}



//note(@duncanmid): docready

$(document).ready(function() {
	
	loadColors( window.CodaPlugInPreferences.preferenceForKey('palette') );	
	initialize();


	//done(@duncanmid): select color
	
	$('body').on('click', '#header-button, main ul li a', function( e ) {
		
		e.preventDefault();
		
		var type 		= $('input[name="type"]:checked').val(),
			name 		= $(this).attr('data-name'),
			hex 		= $(this).attr('data-hex'),
			rgb 		= $(this).attr('data-rgb'),
			comment 	= $('input[name="comment"]:checked').val(),
			pallete 	= $('#palettes option:selected').text(),
			
			range, prevRange, line, lineRange;
			
		//update selection
		window.CodaPlugInPreferences.setPreferenceForKey(name, 'name');
		window.CodaPlugInPreferences.setPreferenceForKey(hex, 'hex');
		window.CodaPlugInPreferences.setPreferenceForKey(rgb, 'rgb');
		
		//update selection swatch
		updateSwatch(name, hex, rgb);

		
		//insert value into document		
		window.CodaTextView.beginUndoGrouping();
		
		// 1) get selected text range
		range = window.CodaTextView.selectedRange();
		
		// 2) replace selection with value
		window.CodaTextView.replaceCharactersInRangeWithString(range, eval(type));
		
		// 3) get previous range to allow another selection
		prevRange = window.CodaTextView.previousWordRange();
		
		
		// 4) if adding a comment
		if( comment === '1' ) {
		
			line = window.CodaTextView.currentLine();
			
			// if a comment exists eliminate it.
			
			line = line.replace( /\s\/\*(.*)\*\// , '');
			
			line = line + ' /* '+ name +' (' + pallete + ') */';
			
			lineRange = window.CodaTextView.rangeOfCurrentLine();
			
			window.CodaTextView.replaceCharactersInRangeWithString(lineRange, line);
		
		}
		
		window.CodaTextView.endUndoGrouping();
		
		window.CodaTextView.setSelectedRange(prevRange);
		
	});
	

	
	//done(@duncanmid): filter categories
	
	$('#palettes').change(function() {
		
		var palette = $(this).val(),
			name 	= $('#palettes option:selected').text();
		
		$('#selected-palette').html(name);
		
		loadColors(palette);
		
		window.CodaPlugInPreferences.setPreferenceForKey(palette, 'palette');
	});
	
	
	
	//done(@duncanmid): color value
	
	$('input[name="type"]').click(function() {
		
		var type = $('input[name="type"]:checked').val();
		
		$('.selected-type').html(type);
		window.CodaPlugInPreferences.setPreferenceForKey(type, 'type');
	});



	//done(@duncanmid): swatch size
	
	$('input[name="size"]').click(function() {
		
		var category = window.CodaPlugInPreferences.preferenceForKey('category'),
			the_class = $(this).filter(':checked').val();

		$('main ul li').removeClass('hidden');

		if( the_class === 'large' ) {
			$('main ul').removeClass('small').removeClass('list');

		} else if ( the_class === 'small' ) {
			$('main ul').removeClass().addClass('small');

		} else {
			$('main ul').removeClass().addClass('list');
		}
		
		if(category !== 'all') {
			
			$('main ul li[data-category!="' + category + '"]').addClass('hidden');
		}
		
		window.CodaPlugInPreferences.setPreferenceForKey(the_class, 'size');
	});



	//done(@duncanmid): open options panel
	
	$('#toggle-options').click(function() {
		
		$('footer').toggleClass('revealed');
		
		if( $('footer').hasClass('revealed') ) {
			
			setTimeout(function(){
				$('main ul').addClass('blur');
			}, 150);
		
		} else {
			
			$('main ul').removeClass('blur');
		}
	});
	
	
	
	//done(@duncanmid): twitter
	
	$('#twitter').click( function() {
		
		window.CodaPlugInsController.displayHTMLString('<meta http-equiv="refresh" content="1;url=http://twitter.com/duncanmid" />');
	});
});
