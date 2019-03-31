import { Get, Controller, Query } from '@nestjs/common';
import * as flights from '../cache/data/flights.data.json';
import * as moment from 'moment';
import {
    ApiUseTags,
    ApiImplicitParam,
    ApiImplicitQuery,
} from '@nestjs/swagger';

@ApiUseTags('flights')
@Controller('flights')
export class FlightsController {
    @Get()
    @ApiImplicitQuery({
        name: 'flightDirection',
        description:
            'Direction of the flight. Indicates whether the commercial flight is a departure flight (D) or an arrival flight (A).',
        required: false,
    })
    @ApiImplicitQuery({
        name: 'serviceType',
        description:
            'Category of the commercial flight. J = Passenger Line, C= Passenger Charter, F = Freight Line and H = Freight Charter.',
        required: false,
    })
    @ApiImplicitQuery({
        name: 'terminal',
        description: 'Terminal number. Can be terminal 1, 2, 3 or 4.',
        required: false,
    })
    @ApiImplicitQuery({
        name: 'routesEU',
        description: '',
        required: false,
    })
    @ApiImplicitQuery({
        name: 'visaYN',
        description: '',
        required: false,
    })
    async findByDirection(@Query() queryParam): Promise<Object> {
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
                    (queryParam.flightDirection
                        ? flight.flightDirection === queryParam.flightDirection
                        : true) &&
                    (queryParam.serviceType
                        ? flight.serviceType === queryParam.serviceType
                        : true) &&
                    (queryParam.terminal
                        ? flight.terminal == queryParam.terminal
                        : true) &&
                    (queryParam.routesEU
                        ? flight.route.eu === queryParam.routesEU
                        : true) &&
                    (queryParam.visaYN
                        ? flight.route.visa ===
                          (queryParam.visaYN === 'Y' ? true : false)
                        : true),
            );
    }
}
