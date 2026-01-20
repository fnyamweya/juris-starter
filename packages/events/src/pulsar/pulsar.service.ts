import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EventMessage,
  PulsarConfig,
  ProducerConfig,
  ConsumerConfig,
} from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

// Note: In production, you would import from 'pulsar-client'
// For now, we define interfaces that match the Pulsar client API

interface PulsarClient {
  createProducer(config: any): Promise<PulsarProducer>;
  subscribe(config: any): Promise<PulsarConsumer>;
  close(): Promise<void>;
}

interface PulsarProducer {
  send(message: any): Promise<any>;
  flush(): Promise<void>;
  close(): Promise<void>;
}

interface PulsarConsumer {
  receive(timeout?: number): Promise<any>;
  acknowledge(message: any): Promise<void>;
  negativeAcknowledge(message: any): Promise<void>;
  close(): Promise<void>;
}

@Injectable()
export class PulsarService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PulsarService.name);
  private client: PulsarClient | null = null;
  private producers: Map<string, PulsarProducer> = new Map();
  private consumers: Map<string, PulsarConsumer> = new Map();
  private serviceName: string;

  constructor(private readonly configService: ConfigService) {
    this.serviceName = this.configService.get<string>('APP_NAME') || 'unknown-service';
  }

  async onModuleInit() {
    try {
      await this.connect();
    } catch (error) {
      this.logger.warn('Pulsar connection failed, running in offline mode', error);
    }
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    const serviceUrl = this.configService.get<string>('PULSAR_SERVICE_URL');
    
    if (!serviceUrl) {
      this.logger.warn('PULSAR_SERVICE_URL not configured, event bus disabled');
      return;
    }

    try {
      // Dynamic import for pulsar-client
      const Pulsar = await import('pulsar-client');
      
      this.client = new Pulsar.Client({
        serviceUrl,
        operationTimeoutSeconds: 30,
        ioThreads: 4,
        messageListenerThreads: 4,
      });

      this.logger.log(`Connected to Pulsar at ${serviceUrl}`);
    } catch (error) {
      this.logger.error('Failed to connect to Pulsar', error);
      throw error;
    }
  }

  private async disconnect(): Promise<void> {
    // Close all producers
    for (const [topic, producer] of this.producers) {
      try {
        await producer.close();
        this.logger.log(`Closed producer for topic: ${topic}`);
      } catch (error) {
        this.logger.error(`Error closing producer for topic ${topic}`, error);
      }
    }
    this.producers.clear();

    // Close all consumers
    for (const [subscription, consumer] of this.consumers) {
      try {
        await consumer.close();
        this.logger.log(`Closed consumer for subscription: ${subscription}`);
      } catch (error) {
        this.logger.error(`Error closing consumer for subscription ${subscription}`, error);
      }
    }
    this.consumers.clear();

    // Close client
    if (this.client) {
      try {
        await this.client.close();
        this.logger.log('Pulsar client closed');
      } catch (error) {
        this.logger.error('Error closing Pulsar client', error);
      }
      this.client = null;
    }
  }

  async getProducer(config: ProducerConfig): Promise<PulsarProducer | null> {
    if (!this.client) {
      this.logger.warn('Pulsar client not connected');
      return null;
    }

    const key = config.topic;
    
    if (this.producers.has(key)) {
      return this.producers.get(key)!;
    }

    try {
      const producer = await this.client.createProducer({
        topic: config.topic,
        producerName: config.producerName || `${this.serviceName}-producer`,
        sendTimeoutMs: config.sendTimeoutMs || 30000,
        batchingEnabled: config.batchingEnabled ?? true,
        batchingMaxPublishDelayMs: config.batchingMaxPublishDelayMs || 10,
        batchingMaxMessages: config.batchingMaxMessages || 1000,
      });

      this.producers.set(key, producer);
      this.logger.log(`Created producer for topic: ${config.topic}`);
      return producer;
    } catch (error) {
      this.logger.error(`Failed to create producer for topic ${config.topic}`, error);
      throw error;
    }
  }

  async subscribe(config: ConsumerConfig): Promise<PulsarConsumer | null> {
    if (!this.client) {
      this.logger.warn('Pulsar client not connected');
      return null;
    }

    const key = config.subscription;

    if (this.consumers.has(key)) {
      return this.consumers.get(key)!;
    }

    try {
      const consumer = await this.client.subscribe({
        topic: config.topic,
        subscription: config.subscription,
        subscriptionType: config.subscriptionType || 'Shared',
        subscriptionInitialPosition: config.subscriptionInitialPosition || 'Latest',
        ackTimeoutMs: config.ackTimeoutMs || 10000,
        nAckRedeliverTimeoutMs: config.nAckRedeliverTimeoutMs || 60000,
        receiverQueueSize: config.receiverQueueSize || 1000,
      });

      this.consumers.set(key, consumer);
      this.logger.log(`Created consumer for subscription: ${config.subscription}`);
      return consumer;
    } catch (error) {
      this.logger.error(`Failed to create consumer for subscription ${config.subscription}`, error);
      throw error;
    }
  }

  async publish<T = any>(topic: string, data: T, metadata?: Record<string, any>): Promise<void> {
    const message: EventMessage<T> = {
      id: uuidv4(),
      type: topic,
      source: this.serviceName,
      timestamp: new Date(),
      data,
      metadata,
    };

    const producer = await this.getProducer({ topic });
    
    if (!producer) {
      this.logger.warn(`Unable to publish to ${topic}: Pulsar not connected`);
      return;
    }

    try {
      await producer.send({
        data: Buffer.from(JSON.stringify(message)),
        properties: {
          eventId: message.id,
          eventType: message.type,
          source: message.source,
          timestamp: message.timestamp.toISOString(),
        },
      });

      this.logger.debug(`Published event to ${topic}: ${message.id}`);
    } catch (error) {
      this.logger.error(`Failed to publish event to ${topic}`, error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.client !== null;
  }
}
