module.exports = {
    apps: [{
        name: "sigmawater",
        script: "./app.js",
        watch: ["server", "client"],
        // Delay between restart
        watch_delay: 1000,
        ignore_watch: ["node_modules", "public/imglicencias"],
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }]
}