module.exports = {
    entry: {
        'song-flux': './song-flux.js'
    },
    output: {
        path: 'browser/',
        filename: '[name].js',
        library: 'song-dispatcher',
        libraryTarget: 'umd'
    }
};

