// Headless driver for test/index.html. jQuery 1.11.1 shipped no headless test
// runner — upstream drove the QUnit suite through TestSwarm across real
// browsers — so the sealed build supplies one: load the suite in PhantomJS,
// wait for #qunit-testresult, print one line per test plus the QUnit summary,
// and exit non-zero if any assertion failed.
var page = require( "webpage" ).create(),
	system = require( "system" ),
	url = system.args[ 1 ],
	start = Date.now();

page.onConsoleMessage = function( msg ) { console.log( msg ); };
page.onError = function( msg ) { console.log( "PAGE ERROR: " + msg ); };

page.open( url, function( status ) {
	if ( status !== "success" ) {
		console.log( "FAILED to open " + url );
		phantom.exit( 1 );
	}
	var tick = setInterval(function() {
		var done = page.evaluate(function() {
			var el = document.getElementById( "qunit-testresult" );
			return el && /completed|Tests completed/.test( el.innerText || el.textContent );
		});
		if ( done ) {
			clearInterval( tick );
			var res = page.evaluate(function() {
				var out = [], i, li, name, counts,
					items = document.querySelectorAll( "#qunit-tests > li" );
				for ( i = 0; i < items.length; i++ ) {
					li = items[ i ];
					name = li.querySelector( ".test-name" );
					counts = li.querySelector( ".counts" );
					out.push( ( li.className === "pass" ? "ok   " : "FAIL " ) +
						( li.querySelector( ".module-name" ) ?
							li.querySelector( ".module-name" ).textContent + ": " : "" ) +
						( name ? name.textContent : "?" ) +
						( counts ? " " + counts.textContent : "" ) );
				}
				var r = document.getElementById( "qunit-testresult" );
				return {
					lines: out,
					summary: r.innerText || r.textContent,
					failed: parseInt( ( r.querySelector( ".failed" ) || {} ).textContent || "0", 10 )
				};
			});
			console.log( res.lines.join( "\n" ) );
			console.log( "" );
			console.log( "QUnit summary: " + res.summary );
			console.log( "Elapsed: " + ( ( Date.now() - start ) / 1000 ) + "s" );
			phantom.exit( res.failed > 0 ? 1 : 0 );
		}
		if ( Date.now() - start > 900000 ) {
			clearInterval( tick );
			console.log( "TIMEOUT waiting for QUnit to finish" );
			phantom.exit( 1 );
		}
	}, 1000 );
});
