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

// npm link npm
var npm = require( 'npm' );
var util = require( 'util' );
var path = require( 'path' );

module.exports = exports = function( headers, body ) {
    var all = new Deferred();

    // body.html_url === "https://github.com/leeight/node.hi"
    var tpl = 'https://codeload.github.com/%s/zip/%s';
    var zipfile = path.join( __dirname, '..', 'data', 'github.com', body.repository.full_name, body.ref + '.zip' );
    var url = util.format( tpl, body.repository.full_name, body.ref );

    base.download( url, zipfile )
        .done(function(){
            // 解压zip
            base.unzip( zipfile, zipfile.replace( /\.zip$/, '' ) );

            // 1. 上传到edp

            // 2. 生成jsduck
            all.resolve();
        }).fail(function(){
            all.reject();
        });
    /*
    npm.load( config, function( er ) {
        if ( er ) throw err;

        npm.commands.publish( [ '.' ])
    });
    */

    return all;
}





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
