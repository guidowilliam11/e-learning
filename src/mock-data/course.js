const { MongoClient, ObjectId } = require("mongodb");

const mockData = {
    courses: [
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234570"),
            thumbnail: "64a7f5e8d8f1b1c0d1234570.png",
            title: "Introduction to Computer Science",
            description: "Explore the basics of algorithms, programming, and data structures.",
            subscribers: [
                new ObjectId("67663f44d703aed0356b5b63"),
                new ObjectId("6767927ea3b1157d451cb820"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234580"),
                new ObjectId("64a7f5e8d8f1b1c0d1234583"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234571"),
            thumbnail: "64a7f5e8d8f1b1c0d1234571.png",
            title: "Calculus I: Limits and Derivatives",
            description: "Learn the foundations of calculus, including limits, derivatives, and applications.",
            subscribers: [
                new ObjectId("6767939e271a78f2fec485d1"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234585"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234572"),
            thumbnail: "64a7f5e8d8f1b1c0d1234572.png",
            title: "Web Development with JavaScript",
            description: "Build dynamic websites and web applications using JavaScript, HTML, and CSS.",
            subscribers: [
                new ObjectId("67663f44d703aed0356b5b63"),
                new ObjectId("6767927ea3b1157d451cb820"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234588"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234573"),
            thumbnail: "64a7f5e8d8f1b1c0d1234573.png",
            title: "Artificial Intelligence Fundamentals",
            description: "Learn the basics of AI, neural networks, and deep learning applications.",
            subscribers: [
                new ObjectId("67663f44d703aed0356b5b63"),
                new ObjectId("6767939e271a78f2fec485d1"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234598"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234574"),
            thumbnail: "64a7f5e8d8f1b1c0d1234574.png",
            title: "Data Science with Python",
            description: "Analyze data and build machine learning models with Python.",
            subscribers: [
                new ObjectId("6767927ea3b1157d451cb820"),
                new ObjectId("6767939e271a78f2fec485d1"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234599"),
                new ObjectId("64a7f5e8d8f1b1c0d1234600"),
            ],
        },
    ],
    subscribers: [
        { _id: new ObjectId("67663f44d703aed0356b5b63"), progress: 80 },
        { _id: new ObjectId("6767927ea3b1157d451cb820"), progress: 45 },
        { _id: new ObjectId("6767939e271a78f2fec485d1"), progress: 60 },
    ],
    sessions: [
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234580"),
            video: "/path-to-video1.mp4",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234591"),
                new ObjectId("64a7f5e8d8f1b1c0d1234592"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234583"),
            video: "/path-to-video2.mp4",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234593"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234585"),
            video: "/path-to-video3.mp4",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234594"),
                new ObjectId("64a7f5e8d8f1b1c0d1234595"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234588"),
            video: "/path-to-video4.mp4",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234596"),
                new ObjectId("64a7f5e8d8f1b1c0d1234597"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234598"),
            video: "/path-to-video5.mp4",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234601"),
                new ObjectId("64a7f5e8d8f1b1c0d1234602"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234599"),
            video: "/path-to-video6.mp4",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234603"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234600"),
            video: "/path-to-video7.mp4",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234604"),
                new ObjectId("64a7f5e8d8f1b1c0d1234605"),
            ],
        },
    ],
    summaries: [
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234591"), content: "Introduction to algorithms.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234592"), content: "Programming fundamentals.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234593"), content: "Data structures overview.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234594"), content: "Introduction to limits.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234595"), content: "Derivatives basics.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234596"), content: "JavaScript basics.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234597"), content: "Building web pages with HTML.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234601"), content: "Introduction to neural networks.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234602"), content: "Deep learning applications.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234603"), content: "Data preprocessing techniques.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234604"), content: "Python for machine learning.", type: "text" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234605"), content: "Building predictive models.", type: "text" },
    ],
};

// Database Injection Code remains the same


const MONGO_URI =
    "mongodb+srv://testerseizure:RN2nsmPjBjVnpm5N@thesis.ascm6.mongodb.net/e-learning?retryWrites=true&w=majority&appName=Thesis";

const injectMockData = async () => {
    const client = new MongoClient(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        await client.connect();
        console.log("Connected to MongoDB Cloud");

        const db = client.db("e-learning");

        // Clear existing collections (optional)
        await db.collection("courses").deleteMany({});
        await db.collection("subscribers").deleteMany({});
        await db.collection("sessions").deleteMany({});
        await db.collection("summaries").deleteMany({});
        console.log("Cleared existing data");

        // Insert mock data
        await db.collection("courses").insertMany(mockData.courses);
        console.log("Courses injected");

        await db.collection("subscribers").insertMany(mockData.subscribers);
        console.log("Subscribers injected");

        await db.collection("sessions").insertMany(mockData.sessions);
        console.log("Sessions injected");

        await db.collection("summaries").insertMany(mockData.summaries);
        console.log("Summaries injected");
    } catch (error) {
        console.error("Error injecting data:", error);
    } finally {
        await client.close();
        console.log("Database connection closed");
    }
};

// Execute the injection
if (require.main === module) {
    injectMockData();
}
