# flight-api-demo

A nest.js server running a cached and simplified version of the Schipol airport "Flight API" at https://www.schiphol.nl/en/developer-center/ for use in demo applications.

The API comes with data from the real flight API of the Schipol airport already loaded and can be used immediately. See below how you can refresh the cached data according to your needs.

## Start flight API server

To start the server of the flight API, run the following command:

```bash
npm run start
```

This will start the server on localhost, port 3000. To change the location or port, go to src/main.ts.

## Swagger UI

The Swagger UI for the flight API can be access once the server has been started at http://localhost:3000/api. This shows all the available routes and parameters.

## Refresh the cashed data

This API allows you to cache results from the Schipol Flight API for your demo purposes as needed. In order to use the caching functionality, you must have an active account with the Schipol flight API. Visit https://developer.schiphol.nl/signup to create an account and start using the API.

Once you have a valid API key, add two systems variables on your machine where the flight API should be running:

-   FLIGHT_API_APP_ID - this is the app ID of your Schipol Flight API
-   FLIGHT_API_APP_KEY - this is your app key of your Schipol Flight API

Once set, you can call the cache routes and fill your API with new data

Tip: Check "npm run env" to see if your credentials are available to node. You might have to restart your command line or IDE in order to have them available after setting them.

## Issues

This project is intended for demo applications such as for talks or workshops. If you encounter a problem create an issue or feel fre to open a pull request if you know the fix.

## License

MIT

## Author

Daniel Frech
