import { Get, Controller, Param, Query } from '@nestjs/common';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import * as destinations from '../cache/data/destinations.data.json';

@ApiUseTags('destinations')
@Controller('destinations')
export class DestinationsController {
    @Get()
    async find(): Promise<Object> {
        return destinations;
    }

    @Get(':destination')
    @ApiImplicitParam({ name: 'destination', description: 'IATA code' })
    async findByIata(@Param('destination') destinationParam): Promise<Object> {
        const result: Object = [...destinations.destinations].find(
            destination => destination.iata === destinationParam,
        );
        return result || {};
    }
}
