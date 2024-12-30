// Mock Data
const {MongoClient, ObjectId} = require('mongodb');

const mockData = {
    folders: [
        // Folders for User 67663f44d703aed0356b5b63
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234570"), name: "Personal", ownerId: new ObjectId("67663f44d703aed0356b5b63"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234580") , new ObjectId("64a7f5e8d8f1b1c0d1234581") , new ObjectId("64a7f5e8d8f1b1c0d1234589")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234571"), name: "Work", ownerId: new ObjectId("67663f44d703aed0356b5b63"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234582")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234572"), name: "Shared", ownerId: new ObjectId("67663f44d703aed0356b5b63"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234585"), new ObjectId("64a7f5e8d8f1b1c0d1234586")] },
        // Folders for User 6767927ea3b1157d451cb820
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234573"), name: "Personal", ownerId: new ObjectId("6767927ea3b1157d451cb820"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234584")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234574"), name: "Work", ownerId: new ObjectId("6767927ea3b1157d451cb820"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234583"), new ObjectId("64a7f5e8d8f1b1c0d1234585")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234575"), name: "Shared", ownerId: new ObjectId("6767927ea3b1157d451cb820"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234582"), new ObjectId("64a7f5e8d8f1b1c0d1234580"), new ObjectId("64a7f5e8d8f1b1c0d1234589"), new ObjectId("64a7f5e8d8f1b1c0d1234588")]},
        // Folders for User 6767939e271a78f2fec485d1
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234576"), name: "Personal", ownerId: new ObjectId("6767939e271a78f2fec485d1"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234586"), new ObjectId("64a7f5e8d8f1b1c0d1234587")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234577"), name: "Work", ownerId: new ObjectId("6767939e271a78f2fec485d1"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234588")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234578"), name: "Shared", ownerId: new ObjectId("6767939e271a78f2fec485d1"), notes: [new ObjectId("64a7f5e8d8f1b1c0d1234582"), new ObjectId("64a7f5e8d8f1b1c0d1234589"), new ObjectId("64a7f5e8d8f1b1c0d1234583")] },
    ],
    notes: [
        // Notes for User 67663f44d703aed0356b5b63
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234580"), topic: "Math", creatorId: new ObjectId("67663f44d703aed0356b5b63"), collaborators: [new ObjectId("6767927ea3b1157d451cb820")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234581"), topic: "Science", creatorId: new ObjectId("67663f44d703aed0356b5b63"), collaborators: [] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234582"), topic: "Project", creatorId: new ObjectId("67663f44d703aed0356b5b63"), collaborators: [new ObjectId("6767939e271a78f2fec485d1"), new ObjectId("6767927ea3b1157d451cb820")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234589"), topic: "Collaboration Note", creatorId: new ObjectId("67663f44d703aed0356b5b63"), collaborators: [new ObjectId("6767939e271a78f2fec485d1"), new ObjectId("6767927ea3b1157d451cb820")] },
        // Notes for User 6767927ea3b1157d451cb820
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234583"), topic: "Literature", creatorId: new ObjectId("6767927ea3b1157d451cb820"), collaborators: [new ObjectId("6767939e271a78f2fec485d1")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234584"), topic: "History", creatorId: new ObjectId("6767927ea3b1157d451cb820"), collaborators: [] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234585"), topic: "Research", creatorId: new ObjectId("6767927ea3b1157d451cb820"), collaborators: [new ObjectId("67663f44d703aed0356b5b63")] },
        // Notes for User 6767939e271a78f2fec485d1
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234586"), topic: "Design", creatorId: new ObjectId("6767939e271a78f2fec485d1"), collaborators: [new ObjectId("67663f44d703aed0356b5b63")] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234587"), topic: "Art", creatorId: new ObjectId("6767939e271a78f2fec485d1"), collaborators: [] },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234588"), topic: "Draft", creatorId: new ObjectId("6767939e271a78f2fec485d1"), collaborators: [new ObjectId("6767927ea3b1157d451cb820")] },
    ],
};
const MONGO_URI = 'mongodb+srv://testerseizure:RN2nsmPjBjVnpm5N@thesis.ascm6.mongodb.net/e-learning?retryWrites=true&w=majority&appName=Thesis';

const injectMockData = async () => {
    const client = new MongoClient(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log('Connected to MongoDB Cloud');

        const db = client.db('e-learning');

        // Clear existing collections (optional)
        await db.collection('folders').deleteMany({});
        await db.collection('notes').deleteMany({});
        console.log('Cleared existing data');

        // Insert mock data
        await db.collection('folders').insertMany(mockData.folders);
        console.log('Folders injected');

        await db.collection('notes').insertMany(mockData.notes);
        console.log('Notes injected');

    } catch (error) {
        console.error('Error injecting data:', error);
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
};

// Execute the injection
if (require.main === module) {
    injectMockData();
}