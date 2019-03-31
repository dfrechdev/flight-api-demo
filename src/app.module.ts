import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AircraftTypesController } from './aircrafttypes/aircrafttypes.controller';
import { AirlinesController } from './airlines/airlines.controller';
import { FlightsController } from './flights/flights.controller';
import { DestinationsController } from './destinations/destinations.controller';
import { CacheController } from './cache/cache.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    AircraftTypesController,
    AirlinesController,
    FlightsController,
    DestinationsController,
    CacheController,
  ],
  providers: [AppService],
})
export class AppModule {}
