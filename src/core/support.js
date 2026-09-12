define([
	"../var/support"
], function( support ) {

support.createHTMLDocument = (function() {
	var doc;

	// Support: IE<9
	// document.implementation.createHTMLDocument is not available there;
	// jQuery.parseHTML then falls back to the main document
	try {
		doc = document.implementation.createHTMLDocument( "" );
		doc.body.innerHTML = "<form></form><form></form>";
		return doc.body.childNodes.length === 2;
	} catch( e ) {
		return false;
	}
})();

return support;

});
