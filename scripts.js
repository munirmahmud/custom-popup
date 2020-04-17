const wait = (ms = 0) => new Promise( resolve => setTimeout( resolve, ms ) );

async function destroyPopup( popup ) {
	popup.classList.remove( 'open' );
	await wait( 1000 );
	popup.parentElement.removeChild( popup );
	popup = null;
}

function ask( options ) {
	return new Promise( async function( resolve ) {
		//Create a popup by creating form element 
		const popup = document.createElement( 'form' );
		popup.classList.add( 'popup' );
		popup.insertAdjacentHTML( 'afterbegin', `
			<fieldset>
				<label>${options.title}</label>
				<input type="text" name="popup_input" />
				<button class="btn" type="submit">Submit</button>
			</fieldset>
		`);

		// Apply condition for cancel button, show it when they wnat it
		if ( options.cancel ) {
			const cancelBtn = document.createElement( 'button' );
			cancelBtn.type = 'button';
			cancelBtn.textContent = 'Cancel';
			cancelBtn.classList.add( 'btn' );
			//Insert the cancel button into the form
			popup.firstElementChild.appendChild( cancelBtn );
			
			cancelBtn.addEventListener( 'click', function() {
				resolve( null );
				destroyPopup( popup );
			} );
		}

		//Add an event for the submit/submit button 
		popup.addEventListener( 'submit', function(e) {
			e.preventDefault();
			resolve( e.target.popup_input.value );
			destroyPopup( popup );
		}, {once: true} ); 

		//Insert the popup into the DOM
		document.body.appendChild( popup );

		await wait( 40 );
		popup.classList.add( 'open' );
	} );
}

async function askQuestion(e) {
	const button = e.currentTarget;
	const cancel = button.hasAttribute( 'data-cancel' );
	const answer = await ask( { title: button.dataset.question, cancel } );
	console.log(answer)
}

const buttons = document.querySelectorAll('[data-question]');
buttons.forEach( button => button.addEventListener( 'click', askQuestion ) );