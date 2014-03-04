/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * workers/create-tag-handler.js ~ 2014/03/02 19:16:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * 创建tag的处理函数.
 **/
var Deferred = require( '../base/Deferred' );
var base = require( '../base/base' );
var Worker = require( '../base/Worker' );

// npm link npm
var npm = require( 'npm' );
var util = require( 'util' );
var path = require( 'path' );
var fs = require( 'fs' );
var edp = require( 'edp-core' );

/**
 * @constructor
 * @extends Worker
 */
function CreateTagHandler( headers, body ) {
    Worker.call( this, headers, body );
}
util.inherits( CreateTagHandler, Worker );

/** @inheritdoc */
CreateTagHandler.prototype.info = function() {
    var event = this.headers[ 'x-github-event' ];
    return util.format( 'Process %s/%s event by CreateTagHandler',
        event, this.body.ref_type );
}

/** @inheritdoc */
CreateTagHandler.prototype.match = function() {
    var event = this.headers[ 'x-github-event' ];
    var refType = this.body[ 'ref_type' ];

    return ( event === 'create' ) && ( refType === 'tag' );
}

/** @inheritdoc */
CreateTagHandler.prototype.start = function() {
    edp.log.info( this.info() );

    var headers = this.headers;
    var body = this.body;

    var all = new Deferred();

    // body.html_url === "https://github.com/leeight/node.hi"
    var tpl = 'https://codeload.github.com/%s/zip/%s';
    var zipfile = path.join( __dirname, '..', 'data', 'github.com',
        body.repository.full_name, body.ref + '.zip' );
    var url = util.format( tpl, body.repository.full_name, body.ref );

    function done() {
        // 解压zip
        var target = zipfile.replace( /\.zip$/, '' );
        base.unzip( zipfile, target );

        // 检查package.json是否存在，以及package.json中的版本跟tag的版本是否一致.
        var pkgloc = path.join( target, body.repository.name + '-' + body.ref );
        var file = path.join( pkgloc, '', 'package.json' );
        if ( !fs.existsSync( file ) ) {
            all.reject( new Error( 'No such file ' + path.join( target, 'package.json' ) ) );
            return;
        }

        var pkg = JSON.parse( fs.readFileSync( file, 'utf-8' ) );
        if ( !pkg ) {
            all.reject( new Error( 'Invalid package.json format' ) );
            return;
        }

        if ( pkg.version !== body.ref ) {
            all.reject( new Error( 'Package version ' + pkg.version + ' mismatch with the tag version ' + body.ref ) );
            return;
        }

        // 1. 上传到edp
        npm.load( base.getNpmConfig(), function( er ) {
            if ( er ) {
                all.reject( er );
                return;
            }

            Deferred.all( base.publish( pkgloc ), base.gendocs( pkgloc, body ) )
                .done( function(){ all.resolve() } )
                .fail( function( e ){ all.reject( e ) } );
        });
    }

    function fail() {
        all.reject( new Error( 'Download ' + url + ' failed.' ) );
    }

    base.download( url, zipfile ).then( done, fail );

    return all;
}

/**
 * @ignore
 */
module.exports = exports = CreateTagHandler;





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
