import {
  Consumer,
  ConsumerSubscribeTopics,
  ConsumerRunConfig
} from 'kafkajs'

export class KafkaConsumerClient {
  constructor (
    private readonly consumer: Consumer,
    private readonly topic: ConsumerSubscribeTopics
  ) {}

  async consume (config: ConsumerRunConfig): Promise<void> {
    try {
      await this.consumer.connect()
      await this.consumer.subscribe(this.topic)
      await this.consumer.run(config)
    } catch (error) {
      await this.consumer.disconnect()
      throw new Error(`Error in consumer (consume): ${error}`)
    }
  }
}
