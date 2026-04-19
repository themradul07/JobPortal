import { Kafka, Producer, Admin } from "kafkajs";

let producer:Producer;
let admin:Admin;

export const connectKafka = async()=>{
    try{
        const kafka = new Kafka({
            clientId:"auth-service",
            brokers:[process.env.Kafka_Broker || "localhost:9092"]
        })

        admin = kafka.admin();
        await admin.connect();

        const topics = await admin.listTopics();

        if(!topics.includes("send-email")){
            await admin.createTopics({
                topics:[
                    {
                        topic:"send-mail",
                        numPartitions :1,
                        replicationFactor :1,
                    }
                ]
            });
            console.log("✅ Topic 'send-mail' created")
        }
        await admin.disconnect();

        producer = kafka.producer();
        await producer.connect();
        console.log("✅ Connected to the Kafka Producer")
    }catch(error){
        console.log("Error while connecting to Kafka", error);
        process.exit(1);
    }
}

export const publishToTopic = async (topic: string, message: any)=>{
    if(!producer){
        console.log("Kafka producer is not initialized");    
        return;
    }
    try{
        await producer.send({
            topic,
            messages:[
                {value:JSON.stringify(message)}
            ]
        })
        console.log(`✅ Message sent to topic ${topic}`)
    }catch(error){
        console.log("Error while sending message", error);
    }
}

export const disconnectKafka = async ()=>{
    if(producer){
        await producer.disconnect();
        console.log("✅ Disconnected from Kafka Producer")
    }
}