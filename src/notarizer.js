// CryptoJS
import sha256 from 'crypto-js/sha256';
// import CryptoJS from 'cryptojs';

// jQuery
import 'jquery';
import $ from 'jquery';  
window.jQuery = $; window.$ = $;

$(function (){
	// Prep file for signature
	$('#customFile, #customFileV').change(function(){
		localStorage.setItem('file','');
		var input = this;
		var url = $(this).val();

		// Load file
		if (input.files && input.files[0]) {

			var file = {
				name: input.files[0].name,
				ext: url.substring(url.lastIndexOf('.') + 1).toLowerCase(), 
				lastModified: input.files[0].lastModified,
			};
			var reader = new FileReader();
			
			// Get hash and store file object on localStorage
			reader.onload = function (e) {
				$('.customFileImg').show();
				if (file.ext == 'gif' || file.ext == 'png' || file.ext == 'jpeg' || file.ext == 'jpg') {
					$('.customFileImg').attr('src', e.target.result);
				}
				else {
					$('.customFileImg').attr('src', 'https://i2.wp.com/frankmedilink.in/wp-content/uploads/2017/02/no-preview-big1.jpg');
				}
				var binary = e.target.result;
				var hash = sha256(binary).toString();
				file.hash = hash;
				localStorage.setItem('file', JSON.stringify(file));
			};
			reader.readAsDataURL(input.files[0]);
		}
	});
});