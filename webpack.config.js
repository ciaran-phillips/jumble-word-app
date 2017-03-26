module.exports = {
    entry: "./app/app.module.js",
    output: {
        path: __dirname,
        publicPath: "/jumble-word-app/",
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['env']
                }
            }
        ]
    },
    // Because I'm developing in a VM and normal file watchers don't work
    watchOptions: {
        poll: true
    },
    
};