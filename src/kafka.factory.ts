import { Kafka, ConsumerSubscribeTopics, Partitioners } from 'kafkajs'

import { KafkaProducerClient } from './kafka-producer.client'
import { KafkaConsumerClient } from './kafka-consumer.client'
import { KafkaConnectionConfig, KafkaConsumerConfig } from './config/kafka.config'

export class KafkaFactory {
  private kafka: Kafka

  constructor (config: KafkaConnectionConfig) {
    this.kafka = new Kafka({
      ... config,
      brokers: [config.broker]
    })
  }

  getProducer (): KafkaProducerClient {
    const producer = this.kafka.producer({
      createPartitioner: Partitioners.LegacyPartitioner
    })

    return new KafkaProducerClient(producer)
  }

  getConsumer ({ config, topic, fromBeginning }: KafkaConsumerConfig): KafkaConsumerClient {
    const consumer = this.kafka.consumer(config)
    const consumeTopic: ConsumerSubscribeTopics = {
      topics: [topic],
      fromBeginning
    }

    return new KafkaConsumerClient(consumer, consumeTopic)
  }
}
