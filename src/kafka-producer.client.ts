import {
  Producer,
  TopicMessages,
  Message,
  ProducerBatch
} from 'kafkajs'

export class KafkaProducerClient {
  constructor (
    private readonly producer: Producer
  ) {}

  async send (data: { topic: string, message: string }): Promise<void> {
    try {
      if (!data.topic || !data.message)
        throw new Error('Invalid topic or message.')

      await this.producer.connect()
      await this.producer.send({
        topic: data.topic,
        messages: [
          { value: JSON.stringify(data.message) }
        ]
      })
    } catch (error) {
      throw new Error(`Error in producer (send): ${error}`)
    } finally {
      await this.producer.disconnect()
    }
  }

  async sendBatch (data: { topic: string, messages: string[] }): Promise<void> {
    try {
      if (!data.topic || !data.messages)
        throw new Error('Invalid topic or messages.')

      const kafkaMessages: Message[] = data.messages.map(message => ({
        value: JSON.stringify(message)
      }))

      const topicMessages: TopicMessages = {
        topic: data.topic,
        messages: kafkaMessages
      }

      const batch: ProducerBatch = { topicMessages: [topicMessages] }

      await this.producer.connect()
      await this.producer.sendBatch(batch)
    } catch (error) {
      throw new Error(`Error in producer (sendBatch): ${error}`)
    } finally {
      await this.producer.disconnect()
    }
  }
}
