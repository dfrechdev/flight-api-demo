import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class QueryFlightsDto {
    @ApiModelPropertyOptional({
        description:
            'Direction of the flight (A = Arriving flights, D = Departing flights)',
        enum: ['A', 'D'],
    })
    readonly flightDirection: string;

    @ApiModelPropertyOptional({
        description:
            'Category of the flight (J = Passenger Line, C = Passanger Charter, F = Freight Line, H = Freight Charter)',
        enum: ['J', 'C', 'F', 'H'],
    })
    readonly serviceType: string;

    @ApiModelPropertyOptional({
        description:
            'Terminal from where the flight departs or where it arrives.',
        enum: ['1', '2', '3', '4'],
    })
    readonly terminal: number;

    @ApiModelPropertyOptional({
        description:
            'Route of the origin or destination of the flight (S = Schengen, E = Europe, N = non-Europe)',
        enum: ['E', 'N', 'S'],
    })
    readonly routesEU: string;

    @ApiModelPropertyOptional({
        description: 'Destination requires visa (Y) or not (N)',
        enum: ['Y', 'N'],
    })
    readonly visaYN: string;
}
