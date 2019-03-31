import { Get, Controller, Param, Query } from '@nestjs/common';
import { ApiUseTags, ApiImplicitParam } from '@nestjs/swagger';
import * as airlines from '../cache/data/airlines.data.json';

@ApiUseTags('airlines')
@Controller('airlines')
export class AirlinesController {
    @Get()
    async find(): Promise<Object> {
        return airlines;
    }

    @Get(':airline')
    @ApiImplicitParam({ name: 'airline', description: 'IATA / ICAO code' })
    async findByIata(@Param('airline') airlineParam): Promise<Object> {
        const result: Object = [...airlines.airlines].filter(
            airline =>
                airline.iata === airlineParam || airline.icao === airlineParam,
        );
        return result || {};
    }
}
