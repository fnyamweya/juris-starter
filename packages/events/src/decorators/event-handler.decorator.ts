import { SetMetadata } from '@nestjs/common';

export const EVENT_HANDLER_METADATA = 'EVENT_HANDLER_METADATA';

export interface EventHandlerOptions {
  topic: string | string[];
  subscription?: string;
}

export const EventHandler = (options: EventHandlerOptions): MethodDecorator =>
  SetMetadata(EVENT_HANDLER_METADATA, options);

export const OnEvent = (topic: string | string[]): MethodDecorator =>
  EventHandler({ topic });
