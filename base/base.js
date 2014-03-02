/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * base/base.js ~ 2014/03/02 13:08:20
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var Deferred = require( './Deferred' );

/**
 * 下载一个文件
 * @param {string} url 需要下载的url地址.
 * @param {string=} opt_saved 保存的文件地址.
 * @return {Defered}
 */
exports.download = function( url, opt_saved ) {
    var d = new Deferred();

    var lib = /^https/.test( url ) ? require( 'https' ) : require( 'http' );
    var fs = require( 'fs' );
    var path = require( 'path' );

    var fullPath = opt_saved || path.basename( url );
    var stream = fs.createWriteStream( fullPath );
    lib.get( url, function( res ) {
        try {
            res.pipe( stream );
            d.resolve();
        } catch ( ex ) {
            d.reject( ex );
        }
    }).on( 'error', function( error ){
        d.reject( error );
    });

    return d;
}

/**
 * 计算md5的值
 * @param {Buffer} buffer 输入的数据.
 * @return {string}
 */
exports.md5 = function( buffer ) {
    var crypto = require( 'crypto' );
    var md5 = crypto.createHash( 'md5' );
    md5.update( buffer );
    return md5.digest( 'hex' );
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
