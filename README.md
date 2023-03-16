# kafka client

*Powered by Leonardo Araújo*

Biblioteca para padronizar e facilitar a utilização do Apache Kafka como um broker de mensagens.

# Estrutura

![structure](https://i.ibb.co/qgvBTWg/Captura-de-tela-de-2023-03-16-16-12-23.png)

# Como utilizar

## Configuração

A classe KafkaFactory foi constuída sob o design pattern `Factory` que possui o comportamento de criação e devolução de objetos para determinado fim.

A classe `KafkaFactory` conta com um objeto em seu construtor e mais dois métodos após a configuração de sua instância:

Em seu construtor, fica a seu critério aplicar as configurações que achar pertinente com referência nas configurações do [KafkaJs](https://kafka.js.org/docs/configuration), porém esta abstração, possui a particularidade de que só é possível
configurar um broker por instância de `KafkaFactory`. Sendo assim, o uníco campo que sofre alteração no objeto de configuração é o `brokers`, ficando da seguinte maneira:

#### antes

- `brokers: ['kafka1:9092', 'kafka2:9092']`

#### agora

- `broker: 'kafka:9092'`

## Produtor

Após a configuração inicial da instância de factory, para o produtor, contamos com o método:

- **getProducer** - Responsável por criar um `KafkaProducerClient` e o devolver.

### Exemplo de utilização

```ts
import { KafkaFactory } from '@develop-fapp/kafka-client'

async function bootstrap() {
  const factory = new KafkaFactory({
    clientId: 'test-app',
    broker: 'localhost:9092'
  })

  const producer = factory.getProducer()

  try {
    // Producer a one message by time.
    await producer.send({ topic: 'quickstart', message: 'Test kafka.' })

    // Producer messages in batch by time.
    await producer.sendBatch({
      topic: 'quickstart',
      messages: [
        'Test kafka.',
        'Other message,',
        'One more message'
      ]
    })
  } catch (error) {
    console.log({ error })
  }
}

bootstrap()
```

## Consumidor

Também contamos com o método abaixo para consumidores:

- **getConsumer** - Responsável por criar um `KafkaConsumerClient` e o devolver.

### Exemplo de utilização

```ts
import { KafkaFactory, KafkaConsumerConfig } from '@develop-fapp/kafka-client'

async function bootstrap() {
  const factory = new KafkaFactory({
    clientId: 'test-app',
    broker: 'localhost:9092'
  })

  const consumerConfig: KafkaConsumerConfig = {
    topic: 'quickstart',
    fromBeginning: true,
    config: {
      groupId: 'quickstart-group'
    }
  }

  const consumer = factory.getConsumer(consumerConfig)

  try {
    // Consumer a one message by time.
    await consumer.consume({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        })
      }
    })

    // Consumer messages in batch by time.
    await consumer.consume({
      eachBatch: async ({ batch }) => {
        for (const message of batch.messages) {
          const prefix = `${batch.topic}[${batch.partition} | ${message.offset}] / ${message.timestamp}`
          console.log(`- ${prefix} # ${message.value}`)
        }
      }
    })
  } catch (error) {
    console.log({ error })
  }
}

bootstrap()
```
