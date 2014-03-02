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

    var dir = path.dirname( fullPath );
    if ( !fs.existsSync( dir ) ) {
        require( 'mkdirp' ).sync( dir );
    }

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

/**
 * 提取zip文件
 * 
 * @param {string} zipFile zip文件名
 * @param {string} target 解压路径
 * @return {Deferred}
 */
exports.unzip = function ( zipFile, target ) {
    var path = require( 'path' );
    var parentDir = path.resolve( target, '..' );

    var tmpDirName = 'tmp' + ( (new Date()).getTime() + Math.random() );
    var tmpDir = path.resolve( parentDir, tmpDirName );

    require( 'mkdirp' ).sync( parentDir );

    var AdmZip = new require( 'adm-zip' )( zipFile );

    AdmZip.extractAllTo( target );
    // moveExtractToTarget( tmpDir, target );
};

/**
 * 将压缩文件的提取目录从临时目录移动到目标目录
 * 
 * @inner
 * @param {string} tempDir 提取目录
 * @param {string} target 目标目录
 */
function moveExtractToTarget( tempDir, target ) {
    var fs = require( 'fs' );
    var path = require( 'path' );
    if ( !fs.existsSync( tempDir ) ) {
        return;
    }

    var source = fs.readdirSync( tempDir )[ 0 ];
    if ( source ) {
        fs.renameSync(
            path.resolve( tempDir, source ),
            target
        );
    }

    fs.rmdirSync( tempDir );
}




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
