import 'bootstrap';
import './index.scss';

// jQuery
import 'jquery';
import $ from 'jquery';  
window.jQuery = $; window.$ = $;

import { signFile, getFileAccount, getDecentraSignTx, loadMyIdentity, verify, getSeededSimpleIdentity, isValidPayload } from './dAPP';
import './notarizer';

$(function () {
	// Reset
	localStorage.setItem('file', '');

	$('#verifyPage').hide();
	$('#signPage').hide();
	$('#homePage').show();	
	$('#customFileImg').hide();

	$('.goHome').click(function(){
		$('#homePage').show();
		$('#signPage').hide();
		$('#verifyPage').hide();
	});

	$('.goVerify').click(function(){
		$('#homePage').hide();
		$('#signPage').hide();
		$('#verifyPage').show();
	});

	$('.goSign').click(function(){
		$('#homePage').hide();
		$('#signPage').show();
		$('#verifyPage').hide();
	});

	// Set account
	var fullIdentity = loadMyIdentity();
	var myIdentity = fullIdentity[0];
	var myAccount = fullIdentity[1]; 
	$('.myAddress').html(myAccount.getAddress());

	// Prepare sign button
	$('#signButton, #signButtonF').click(function() {

		var $this = $(this);
		var loadingText = '<div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div>';
		if ($(this).html() !== loadingText) {
			$this.data('original-text', $(this).html());
			$this.html(loadingText);
		}

		// Retrieve file
		var F = localStorage.getItem('file');
		if(F != ''){
			F = JSON.parse(F);

			// 1. Generate seeded account
			var fileIdentity = getSeededSimpleIdentity(F.hash);
			let fileAccount = fileIdentity.account;
			fileAccount.openNodeConnection().then(() =>{

				// Assuming new
				// Prepare to send payload
				var payload = {
					name: F.name,
					signer: myAccount.getAddress(),
					memo: $('#memo').val(),
					hash: F.hash,
					lastModified: F.lastModified,
				};
				$('.fileName').text(payload.name);
				$('.fileSigner').text(payload.signer);
				if(payload.memo) $('.fileMemo').text(payload.memo);
				$('.fileHash').text(payload.hash);
				$('.fileLastModified').text(payload.lastModified);
				$('.fileAddress').text(fileIdentity.account.getAddress());

				// 2. Look into account for message with valid payload
				getDecentraSignTx(fileAccount).then( tx => {
					// File had been previously claimed.
					// 3.a. If valid payload, load data
					$('.fileName').text(payload.name);
					$('.fileSignatureDate').text(new Date(tx.timestamp).toLocaleString());
					$('.fileSigner').text(payload.signer);
					if(payload.memo) $('.fileMemo').text(payload.memo);
					$('.fileHash').text(payload.hash);
					$('.fileLastModified').text(payload.lastModified.toLocaleString());
					$('.fileAddress').text(fileIdentity.account.getAddress());
					$('#verifyModal').modal('show');

					// Reset button
					$this.html($this.data('original-text'));
				}).catch(()=>{
					signFile(fullIdentity, fileIdentity.account.getAddress(), payload);
					$this.html($this.data('original-text'));
				});
			});
		} else {
			// No file
			$this.html($this.data('original-text'));
		}
	});

	$('#verifyButton').click(function(){		
		// Retrieve file
		var F = localStorage.getItem('file');
		if(F != ''){
			F = JSON.parse(F);

			// 1. Generate seeded account
			var fileIdentity = getSeededSimpleIdentity(F.hash);
			let fileAccount = fileIdentity.account;
			console.log("verif");
			fileAccount.openNodeConnection().then(() =>{
				console.log("openNodeConnection");
				getDecentraSignTx(fileAccount).then( tx => {
					$('.fileSignatureDate').text(new Date(tx.timestamp).toLocaleString());
					$('.fileName').text(tx.name);
					$('.fileSigner').text(tx.signer);
					if(tx.memo) $('.fileMemo').text(tx.memo);
					$('.fileHash').text(tx.hash);
					$('.fileLastModified').text(new Date(tx.lastModified).toLocaleString());
					$('.fileAddress').text(fileIdentity.account.getAddress());
					$('#verifyModal').modal('show');
				}).catch(()=>{
					$('#failModal').modal('show');
				});
			});
		}
	});

});
