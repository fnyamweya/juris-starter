import { Module, Global, DynamicModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PulsarService } from './pulsar';

@Global()
@Module({})
export class EventsModule {
  static forRoot(): DynamicModule {
    return {
      module: EventsModule,
      imports: [ConfigModule],
      providers: [PulsarService],
      exports: [PulsarService],
    };
  }

  static forRootAsync(): DynamicModule {
    return {
      module: EventsModule,
      imports: [ConfigModule],
      providers: [PulsarService],
      exports: [PulsarService],
    };
  }
}
