import { Get, Controller, Param, Query } from '@nestjs/common';
import {
    ApiUseTags,
    ApiImplicitParam,
    ApiImplicitQuery,
} from '@nestjs/swagger';
import axios from 'axios';
import * as moment from 'moment';
import * as path from 'path';
import * as fs from 'fs';

/**
 * @description
 * This API allows you to cache results from the Schipol Flight API for your demo
 * purposes. In order to use the caching functionality, you must have an active account
 * with the Schipol flight API. Visit https://developer.schiphol.nl/signup to create an account
 * and start using the API. Once you have a valid API key, add two systems variables on your
 * machine where the flight API should be running:
 * 1.) FLIGHT_API_APP_ID - this is the app ID of your Schipol Flight API
 * 2.) FLIGHT_API_APP_KEY - this is your app key of your Schipol Flight API
 * Once set, you can call the cache routes and fill your API with new data
 *
 * Tip: Check "npm run env" to see if your credentials are available to node. You might have
 * to restart your command line or IDE in order to have them available after setting them.
 *
 * @example
 * //to set as a system variable (permanent) on windows:
 * setx FLIGHT_API_APP_ID your_app_id
 * setx FLIGHT_API_APP_KEY your_app_key
 */
const credentials = {
    app_id: process.env.FLIGHT_API_APP_ID,
    app_key: process.env.FLIGHT_API_APP_KEY,
};

@ApiUseTags('cache')
@Controller('cache')
export class CacheController {
    @ApiImplicitQuery({
        name: 'fromDateTime',
        description:
            "From date of search period. Format: yyyy-MM-dd'T'HH:mm:ss",
        required: true,
    })
    @ApiImplicitQuery({
        name: 'toDateTime',
        description:
            "To date of search period (inclusive). Format: yyyy-MM-dd'T'HH:mm:ss",
        required: true,
    })
    @ApiImplicitParam({
        name: 'searchDateTimeField',
        description:
            'Query by a specific DateTime field. Allowed fields are estimatedLandingTime, actualLandingTime, publicEstimatedOffBlockTime, actualOffBlockTime, expectedTimeBoarding, expectedTimeGateClosing, expectedTimeGateOpen, expectedTimeOnBelt, scheduleDateTime. Defaults to scheduleDateTime if not provided',
        required: false,
    })
    @Get('all')
    async cacheAll(@Query() queryParams): Promise<Object> {
        const flightsResponse: Object = await this.cacheFlights(queryParams);
        const airlinedResponse: Object = await this.cacheAirlines();
        const aircraftTypesResponse: Object = await this.cacheAircrafttypes();
        const destinationsResponse: Object = await this.cacheDestinations();
        return [
            flightsResponse,
            airlinedResponse,
            aircraftTypesResponse,
            destinationsResponse,
        ];
    }

    @Get('destinations')
    async cacheDestinations(): Promise<Object> {
        let config = {
            method: 'get',
            url: 'https://api.schiphol.nl/public-flights/destinations',
            headers: {
                Accept: 'application/json',
                resourceversion: 'v4',
                app_id: credentials.app_id,
                app_key: credentials.app_key,
            },
            params: {
                page: 0,
                sort: 'publicName.english',
            },
        };

        try {
            let destinations = [];
            let doContinue = true;

            // get all responses but the last page
            while (doContinue) {
                const response = await axios(config);
                destinations = [...destinations, ...response.data.destinations];
                config.params.page++;
                if (response.headers.link.indexOf('rel="next"') === -1) {
                    doContinue = false;
                }
            }

            // get last page
            const response = await axios(config);
            destinations = [...destinations, ...response.data.destinations];

            // cache the results
            fs.writeFileSync(
                path.resolve(__dirname, 'data', 'destinations.data.json'),
                JSON.stringify({ destinations: destinations }),
                {
                    encoding: 'utf8',
                    flag: 'w',
                },
            );

            return { cachedDestinations: destinations.length };
        } catch (err) {
            console.log(err);
            return '';
        }
    }

    @Get('airlines')
    async cacheAirlines(): Promise<Object> {
        let config = {
            method: 'get',
            url: 'https://api.schiphol.nl/public-flights/airlines',
            headers: {
                Accept: 'application/json',
                resourceversion: 'v4',
                app_id: credentials.app_id,
                app_key: credentials.app_key,
            },
            params: {
                page: 0,
                sort: 'publicName',
            },
        };

        try {
            let airlines = [];
            let doContinue = true;

            // get all responses but the last page
            while (doContinue) {
                const response = await axios(config);
                airlines = [...airlines, ...response.data.airlines];
                config.params.page++;
                if (response.headers.link.indexOf('rel="next"') === -1) {
                    doContinue = false;
                }
            }

            // get last page
            const response = await axios(config);
            airlines = [...airlines, ...response.data.airlines];

            // cache the results
            fs.writeFileSync(
                path.resolve(__dirname, 'data', 'airlines.data.json'),
                JSON.stringify({ airlines: airlines }),
                {
                    encoding: 'utf8',
                    flag: 'w',
                },
            );

            return { cachedAirlines: airlines.length };
        } catch (err) {
            console.log(err);
            return '';
        }
    }

    @Get('aircrafttypes')
    async cacheAircrafttypes(): Promise<Object> {
        let config = {
            method: 'get',
            url: 'https://api.schiphol.nl/public-flights/aircrafttypes',
            headers: {
                Accept: 'application/json',
                resourceversion: 'v4',
                app_id: credentials.app_id,
                app_key: credentials.app_key,
            },
            params: {
                page: 0,
                sort: 'iataMain',
            },
        };

        try {
            let aircraftTypes = [];
            let doContinue = true;

            // get all responses but the last page
            while (doContinue) {
                const response = await axios(config);
                aircraftTypes = [
                    ...aircraftTypes,
                    ...response.data.aircraftTypes,
                ];
                config.params.page++;
                if (response.headers.link.indexOf('rel="next"') === -1) {
                    doContinue = false;
                }
            }

            // get last page
            const response = await axios(config);
            aircraftTypes = [...aircraftTypes, ...response.data.aircraftTypes];

            // cache the results
            fs.writeFileSync(
                path.resolve(__dirname, 'data', 'aircraftTypes.data.json'),
                JSON.stringify({ aircraftTypes: aircraftTypes }),
                {
                    encoding: 'utf8',
                    flag: 'w',
                },
            );

            return { cachedAircraftTypes: aircraftTypes.length };
        } catch (err) {
            console.log(err);
            return '';
        }
    }

    @Get('flights')
    @ApiImplicitQuery({
        name: 'fromDateTime',
        description:
            "From date of search period. Format: yyyy-MM-dd'T'HH:mm:ss",
        required: true,
    })
    @ApiImplicitQuery({
        name: 'toDateTime',
        description:
            "To date of search period (inclusive). Format: yyyy-MM-dd'T'HH:mm:ss",
        required: true,
    })
    @ApiImplicitParam({
        name: 'searchDateTimeField',
        description:
            'Query by a specific DateTime field. Allowed fields are estimatedLandingTime, actualLandingTime, publicEstimatedOffBlockTime, actualOffBlockTime, expectedTimeBoarding, expectedTimeGateClosing, expectedTimeGateOpen, expectedTimeOnBelt, scheduleDateTime. Defaults to scheduleDateTime if not provided',
        required: false,
    })
    async cacheFlights(@Query() queryParams): Promise<Object> {
        let config = {
            method: 'get',
            url: 'https://api.schiphol.nl/public-flights/flights',
            headers: {
                Accept: 'application/json',
                resourceversion: 'v4',
                app_id: credentials.app_id,
                app_key: credentials.app_key,
            },
            params: {
                page: 0,
                sort: '+estimatedLandingTime',
                includedelays: false,
                flightDirection: 'A',
                searchDateTimeField:
                    queryParams.searchDateTimeField || 'estimatedLandingTime',
                fromDateTime: queryParams.fromDateTime,
                toDateTime: queryParams.toDateTime,
            },
        };

        try {
            let flights = [];
            let doContinue = true;

            // get all responses but the last page
            while (doContinue) {
                const response = await axios(config);
                flights = [
                    ...flights,
                    ...response.data.flights.filter(
                        flight => flight.mainFlight === flight.flightName,
                    ),
                ];
                config.params.page++;
                if (response.headers.link.indexOf('rel="next"') === -1) {
                    doContinue = false;
                }
            }

            // get last page
            const response = await axios(config);
            flights = [
                ...flights,
                ...response.data.flights.filter(
                    flight => flight.mainFlight === flight.flightName,
                ),
            ];

            // cache the results
            fs.writeFileSync(
                path.resolve(__dirname, 'data', 'flights.data.json'),
                JSON.stringify({ flights: flights }),
                {
                    encoding: 'utf8',
                    flag: 'w',
                },
            );

            return { cachedFlights: flights.length };
        } catch (err) {
            console.log(err);
            return '';
        }
    }
}
