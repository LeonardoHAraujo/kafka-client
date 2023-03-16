import { ConsumerConfig, KafkaConfig } from 'kafkajs'

export interface KafkaConnectionConfig extends Partial<KafkaConfig> {
  broker: string
}

export type KafkaConsumerConfig = {
  topic: string
  fromBeginning: boolean
  config: ConsumerConfig
}
