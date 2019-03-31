import { Get, Controller, Query } from '@nestjs/common';
import { ApiUseTags, ApiImplicitQuery } from '@nestjs/swagger';
import * as aircraftTypes from '../cache/data/aircraftTypes.data.json';

@ApiUseTags('aircraftTypes')
@Controller('aircraftTypes')
export class AircraftTypesController {
    @Get()
    @ApiImplicitQuery({
        name: 'iataMain',
        description: 'IATA main code',
        required: false,
    })
    @ApiImplicitQuery({
        name: 'iataSub',
        description: 'IATA sub code',
        required: false,
    })
    async find(@Query() queryParams): Promise<Object> {
        if (queryParams) {
            const result = [...aircraftTypes.aircraftTypes].filter(
                aircraftType =>
                    (queryParams.iataMain
                        ? aircraftType.iataMain === queryParams.iataMain
                        : true) &&
                    (queryParams.iataSub
                        ? aircraftType.iataSub === queryParams.iataSub
                        : true),
            );
            return result || {};
        }
        return aircraftTypes;
    }
}
