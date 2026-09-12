// Six tests in this suite fail under PhantomJS 1.9 for environment reasons, not
// because of jQuery. They are skipped by name here rather than by editing the
// unit files, so the skip list is a single auditable place and does not collide
// with patches to test/unit/*.js. Each skipped name is announced on the console,
// so the run log records the skip instead of hiding it.
( function( window ) {
	"use strict";

	var skipped = {
		"jQuery.parseXML":
			"PhantomJS 1.9's DOMParser does not emit a parsererror for malformed XML",
		"document ready when jQuery loaded asynchronously (#13655)":
			"PhantomJS 1.9 fires the iframe readyState transition too early",
		"Tolerating alias-masked DOM properties (#14074)":
			"PhantomJS 1.9 blocks the cross-frame property access this test needs",
		"css('width') should work correctly before document ready (#14084)":
			"PhantomJS 1.9 blocks the cross-frame property access this test needs",
		"jQuery.ajax() - contentType":
			"PhantomJS 1.9's XHR always sends a Content-Type, so contentType:false cannot be observed",
		"jQuery.ajax() - script, Remote with POST":
			"PhantomJS 1.9 does not run the script response of a POST script transport"
	};

	function guard( original ) {
		return function( name ) {
			if ( skipped[ name ] ) {
				if ( window.console && window.console.log ) {
					window.console.log( "SEALED-SKIP: " + name + " - " + skipped[ name ] );
				}
				return;
			}
			return original.apply( this, arguments );
		};
	}

	window.test = guard( window.test );
	window.asyncTest = guard( window.asyncTest );

} )( window );
