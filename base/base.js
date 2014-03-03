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
var fs = require( 'fs' );
var path = require( 'path' );
var npm = require( 'npm' );

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
 * 发布package到edp.baidu.com
 * @param {string} pkgloc package的目录.
 * @return {Deferred}
 */
exports.publish = function( pkgloc ) {
    var d = new Deferred();

    npm.commands.publish( [ pkgloc ], function( er, data ) {
        if ( er ) {
            d.reject( er );
            return;
        }

        d.resolve();
    });

    return d;
}

/**
 * @ignore
 */
var EDP_CONFIG = null;

/**
 * 根据key读取配置的内容
 *
 * @param {string} key 配置的key
 * @return {*}
 */
exports.getConfig = function( key ) {
    if ( !EDP_CONFIG ) {
        var yaml = require('js-yaml');
        var file = process.env.EDP_WEBHOOKS_CONFIG || 'config.yml';
        file = path.join( __dirname, '..', file );

        EDP_CONFIG = yaml.safeLoad( fs.readFileSync( file, 'utf-8' ) );
    }

    var parts = key.split( '.' );
    var cur = EDP_CONFIG;
    for ( var part; part = parts.shift(); ) {
        if ( cur[part] != null ) {
            cur = cur[part];
        }
        else {
            return null;
        }
    }
    return cur;
};

/**
 * 生成package的文档.
 * @param {string} pkgloc package的目录.
 * @param {Object} requestBody github event的请求体内容.
 * @return {Deferred}
 */
exports.gendocs = function( pkgloc, requestBody ) {
    var d = new Deferred();

    if ( !fs.existsSync( path.join( pkgloc, 'jsduck', 'config.json' ) ) ) {
        process.nextTick(function(){
            d.resolve();
        });
        return d;
    };

    // 生成jsduck文档
    var child = require( 'child_process' ).spawn(
        'jsduck',
        [ '--config=jsduck/config.json' ],
        { cwd: pkgloc, env: process.env }
    );
    var stderr = [];
    child.stderr.on( 'data', function( data ) {
        stderr.push( data );
    });
    child.on( 'close', function( code ) {
        if ( code !== 0 ) {
            d.reject( new Error( Buffer.concat( stderr ) ) );
            return;
        }

        console.log( Buffer.concat( stderr ).toString() );

        var docDir = path.join( pkgloc, 'doc', 'api' );
        if ( !fs.existsSync( docDir ) ) {
            d.reject( new Error( 'No such directory ' + docDir ) );
            return;
        }

        var uploadShell = path.join( __dirname, 'upload.sh' );

        // XXX 生成的文档默认放置在${pkgloc}/doc/api目录
        //
        // 文档生成成功了，把它放到 http://ecomfe.github.io/api 下面去.
        // 1. mv ${pkgloc}/doc/api -> ${ecomfe/api}/${repository.name}/${body.ref}
        // 2. cd ${ecomfe/api} && git add .
        // 3. git commit -a -m 'Add ${repository.name}/${body.ref}, auto commit'
        // 4. git push origin gh-pages

        // bash upload.sh localDocDirectory serverDocDirectory apiReposDir
        var args = [
            uploadShell,
            docDir,
            requestBody.repository.name + '/' + requestBody.ref,
            exports.getConfig( 'repos.api' )
        ];
        var child = require( 'child_process' ).spawn( 'bash', args );

        stderr = [];
        var stdout = [];
        child.stdout.on( 'data', function( data ) {
            stdout.push( data );
        });
        child.stderr.on( 'data', function( data ) {
            stderr.push( data );
        });
        child.on( 'close', function( code ){
            console.log( Buffer.concat( stderr ).toString() );
            console.log( Buffer.concat( stdout ).toString() );

            if ( code !== 0 ) {
                d.reject( new Error( 'Upload docs failed.' ) );
                return;
            }

            d.resolve();
        });
    });

    return d;
};

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

/**
 * 获取edp.baidu.com中ecomfe帐号的配置信息
 * 然后把package上传上去
 * @return {Object}
 */
exports.getNpmConfig = function() {
    return exports.getConfig( 'npm' );
}

/**
 * @return {RedisClient}
 */
exports.createRedisClient = function() {
    var port = exports.getConfig( 'redis.port' );
    var host = exports.getConfig( 'redis.host' );

    var redis = require( 'redis' );
    var client = redis.createClient( port, host );

    return client;
}

/**
 * @param {string} key
 * @return {string}
 */
exports.getRedisKey = function( key ) {
    return 'edp_webhooks_' + key;
}



















/* vim: set ts=4 sw=4 sts=4 tw=100: */
