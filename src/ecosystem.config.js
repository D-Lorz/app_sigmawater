module.exports = {
    apps: [{
        name: "app_sgWater",
        script: "./app.js",
        watch: ["server", "client"],
        // Delay between restart
        watch_delay: 1000,
        ignore_watch: ["public/licences", "public/licences_customers"],
        env_production: {
            NODE_ENV: "production"
        },
        env_development: {
            NODE_ENV: "development"
        }
    }]
}