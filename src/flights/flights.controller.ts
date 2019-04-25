import { Get, Controller, Query } from '@nestjs/common';
import { QueryFlightsDto } from './QueryFlightsDto';
import { ApiUseTags } from '@nestjs/swagger';
import * as flights from '../cache/data/flights.data.json';
import * as moment from 'moment';

@ApiUseTags('flights')
@Controller('flights')
export class FlightsController {
    @Get()
    async findByDirection(
        @Query() queryParams: QueryFlightsDto,
    ): Promise<Object> {
        return [...flights.flights]
            .sort((a, b) => {
                const dateA = moment(
                    a.estimatedLandingTime,
                    'YYYY-MM-DDTHH:mm:ss.SSS',
                ).valueOf();
                const dateB = moment(
                    b.estimatedLandingTime,
                    'YYYY-MM-DDTHH:mm:ss.SSS',
                ).valueOf();
                return dateA - dateB;
            })
            .filter(
                flight =>
                    (queryParams.flightDirection
                        ? flight.flightDirection === queryParams.flightDirection
                        : true) &&
                    (queryParams.serviceType
                        ? flight.serviceType === queryParams.serviceType
                        : true) &&
                    (queryParams.terminal
                        ? flight.terminal == queryParams.terminal
                        : true) &&
                    (queryParams.routesEU
                        ? flight.route.eu === queryParams.routesEU
                        : true) &&
                    (queryParams.visaYN
                        ? flight.route.visa ===
                          (queryParams.visaYN === 'Y' ? true : false)
                        : true) &&
                    flight.prefixIATA,
            );
    }
}
