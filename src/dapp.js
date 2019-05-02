// CryptoJS
// import CryptoJS from 'cryptojs';

// jQuery
import 'jquery';
import $ from 'jquery';  
import {Buffer} from 'buffer';
window.jQuery = $; window.$ = $;


// Radix
import {radixUniverse, RadixUniverse} from 'radixdlt';
import {RadixIdentityManager, RadixAccount} from 'radixdlt';
import {RadixTransactionBuilder, radixTokenManager} from 'radixdlt';
import {RadixSimpleIdentity, RadixUtil} from 'radixdlt';
import {RadixKeyPair, RadixKeyStore} from 'radixdlt';

/*
 * Generates a seeded account in a unique fashion so that there are not
 * collisions with seeded accounts from different dapps. 
 */
export function getSeededSimpleIdentity(seed){
	var appID = "decentraSign";
	seed = RadixUtil.hash(Buffer.from(appID+seed));
	var keyPair = RadixKeyPair.fromPrivate(seed);
	var identity = new RadixSimpleIdentity(keyPair);
	return identity;
}

/*
 * Gets all transactions from that accountwith the 'decentraSign' appID 
 */
 // TODO: check its not cheat as it's not ordered
export function getDecentraSignTx(account){
    var deferred = new $.Deferred();

	var subscription = account.dataSystem.getApplicationData('decentraSign').subscribe((tx)=>{
		var payload = JSON.parse(tx.data.payload);
		if(isValidPayload(payload)){
			payload.timestamp = tx.data.timestamp;
			deferred.resolve(payload);
		}
		deferred.resolve(false);
	});

	setTimeout(() => {
		subscription.unsubscribe();
		deferred.reject();
	}, 3000)

	return deferred.promise();
}


/*
 * Simple on-browser identity manager. Creates a new account if it doesn't already exist 
 * and stores it on local storage. 
 */ 
export function loadMyIdentity(){
	
	// Create/Load identity
	const identityManager = new RadixIdentityManager();
	var myIdentity = '';
	var myAccount = '';

	console.log(localStorage.getItem('myKeyPair'))

	if(localStorage && localStorage.getItem('myKeyPair')){
		var privateKey = Buffer.from(localStorage.getItem('myKeyPair'), 'hex');
		myIdentity = identityManager.addSimpleIdentity(RadixKeyPair.fromPrivate(privateKey));
		myAccount = myIdentity.account;
		myAccount.openNodeConnection();
		console.log(myAccount.getAddress())

	} else {
		myIdentity = identityManager.generateSimpleIdentity();
		localStorage.setItem('myKeyPair', myIdentity.keyPair.getPrivate('hex'));
		myAccount = myIdentity.account;
		myAccount.openNodeConnection();
	}

	return [myIdentity, myAccount];
}

/*
 * Sends a transaction from fullIdentity (claimer) to destAddress (file)
 * that includes the payloadObject (metadata) with decentraSign appID as a claim for the file.
 */ 
export function signFile(fullIdentity, destAddress, payloadObject){
	var myIdentity = fullIdentity[0];
	var myAccount = fullIdentity[1];

	// No need to load data from the ledger for the recipient account
	const toAccount = RadixAccount.fromAddress(destAddress, true);
	const payload = JSON.stringify(payloadObject);
	const applicationId = 'decentraSign'

	const transactionStatus = RadixTransactionBuilder
		.createPayloadAtom([myAccount, toAccount], applicationId, payload)
		.signAndSubmit(myIdentity);

	transactionStatus.subscribe({
		complete: () => { 
			console.log('Transaction complete to '+destAddress);
			$('#successModal').modal('show');
		},
		error: error => { console.error('Error submitting transaction', error) }
	});
}

/*
 *	Checks the payload's format.  
 */

export function isValidPayload(payloadB) {
	var payloadA = {
		name:'',
		signer:'',
		memo:'',
		hash:'',
		lastModified:'',
	}
	var payloadAKeys = Object.keys(payloadA).sort();
	var payloadBKeys = Object.keys(payloadB).sort();
	return JSON.stringify(payloadAKeys) === JSON.stringify(payloadBKeys);
}

$(function () {
	// Bootstrap connection the universe on Alphanet2
	radixUniverse.bootstrap(RadixUniverse.ALPHANET2);
});
