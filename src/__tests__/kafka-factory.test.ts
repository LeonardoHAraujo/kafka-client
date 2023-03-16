import { KafkaFactory } from '../kafka.factory'
import { KafkaConsumerClient } from '../kafka-consumer.client'
import { KafkaProducerClient } from '../kafka-producer.client'

describe('Unit test for the factory', () => {
  it('Test KafkaFactory', async () => {
    const factory = new KafkaFactory({
      clientId: 'my-app',
      broker: 'kafka1:9092'
    })

    const producer = factory.getProducer()
    const consumer = factory.getConsumer({
      topic: 'test-topic',
      fromBeginning: false,
      config: {
        groupId: 'test-group'
      }
    })

    expect(factory).toBeInstanceOf(KafkaFactory)
    expect(producer).toBeInstanceOf(KafkaProducerClient)
    expect(consumer).toBeInstanceOf(KafkaConsumerClient)
  })
})
