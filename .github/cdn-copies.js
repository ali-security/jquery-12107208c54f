var fs = require( "fs" ),
	VER = require( "../package.json" ).version,

	// Mirrors makeReleaseCopies() in build/release.js, which is normally driven by
	// the external jquery-release tool. The published npm tarball ships dist/cdn/*,
	// so the sealed build regenerates those copies from the freshly built dist files.
	releaseFiles = {
		"jquery-VER.js": "dist/jquery.js",
		"jquery-VER.min.js": "dist/jquery.min.js",
		"jquery-VER.min.map": "dist/jquery.min.map",
		"jquery.js": "dist/jquery.js",
		"jquery.min.js": "dist/jquery.min.js",
		"jquery.min.map": "dist/jquery.min.map",
		"jquery-latest.js": "dist/jquery.js",
		"jquery-latest.min.js": "dist/jquery.min.js",
		"jquery-latest.min.map": "dist/jquery.min.map"
	};

if ( !fs.existsSync( "dist/cdn" ) ) {
	fs.mkdirSync( "dist/cdn" );
}

Object.keys( releaseFiles ).forEach(function( key ) {
	var text,
		builtFile = releaseFiles[ key ],
		unpathedFile = key.replace( /VER/g, VER ),
		releaseFile = "dist/cdn/" + unpathedFile;

	if ( /\.map$/.test( releaseFile ) ) {
		text = fs.readFileSync( builtFile, "utf8" )
			.replace( /"file":"([^"]+)","sources":\["([^"]+)"\]/,
				"\"file\":\"" + unpathedFile.replace( /\.min\.map/, ".min.js" ) +
				"\",\"sources\":[\"" + unpathedFile.replace( /\.min\.map/, ".js" ) + "\"]" );
		fs.writeFileSync( releaseFile, text );
	} else if ( /\.min\.js$/.test( releaseFile ) ) {
		text = fs.readFileSync( builtFile, "utf8" )
			.replace( /\/\/# sourceMappingURL=\S+/, "" );
		fs.writeFileSync( releaseFile, text );
	} else {
		fs.writeFileSync( releaseFile, fs.readFileSync( builtFile ) );
	}
});
