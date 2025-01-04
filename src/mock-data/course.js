const { MongoClient, ObjectId } = require("mongodb");

const mockData = {
    courses: [
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234570"),
            thumbnail: "https://m.media-amazon.com/images/I/61JGJcZJfDL._AC_UF1000,1000_QL80_.jpg",
            title: "Introduction to Computer Science",
            description: "Explore the basics of algorithms, programming, and data structures.",
            subscribers: [
                new ObjectId("17663f44d703aed0356b5b63"),
                new ObjectId("1767927ea3b1157d451cb820"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234580"),
                new ObjectId("64a7f5e8d8f1b1c0d1234583"),
                new ObjectId("64a7f5e8d8f1b1c0d1234606"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234571"),
            thumbnail: "https://media.geeksforgeeks.org/wp-content/uploads/20230727175201/Calculus.webp",
            title: "Calculus I: Limits and Derivatives",
            description: "Learn the foundations of calculus, including limits, derivatives, and applications.",
            subscribers: [
                new ObjectId("1767939e271a78f2fec485d1"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234585"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234572"),
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW4oO1yc2Nktqr2-hAltLQ3oTocSNGLK1Eyw&s",
            title: "Web Development with JavaScript",
            description: "Build dynamic websites and web applications using JavaScript, HTML, and CSS.",
            subscribers: [
                new ObjectId("27663f44d703aed0356b5b63"),
                new ObjectId("2767927ea3b1157d451cb820"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234588"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234573"),
            thumbnail: "https://www.mcgill.ca/continuingstudies/files/continuingstudies/017-02-20-scs_shortprograms_fundamentalsofartificial.jpg",
            title: "Artificial Intelligence Fundamentals",
            description: "Learn the basics of AI, neural networks, and deep learning applications.",
            subscribers: [
                new ObjectId("37663f44d703aed0356b5b63"),
                new ObjectId("2767939e271a78f2fec485d1"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234598"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234574"),
            thumbnail: "https://media.geeksforgeeks.org/wp-content/cdn-uploads/20230318230239/Python-Data-Science-Tutorial.jpg",
            title: "Data Science with Python",
            description: "Analyze data and build machine learning models with Python.",
            subscribers: [
                new ObjectId("3767927ea3b1157d451cb820"),
                new ObjectId("3767939e271a78f2fec485d1"),
            ],
            sessions: [
                new ObjectId("64a7f5e8d8f1b1c0d1234599"),
                new ObjectId("64a7f5e8d8f1b1c0d1234600"),
            ],
        },
    ],
    subscribers: [
        { _id: new ObjectId("17663f44d703aed0356b5b63"), studentId: new ObjectId("67663f44d703aed0356b5b63"), progress: 80 },
        { _id: new ObjectId("1767927ea3b1157d451cb820"), studentId: new ObjectId("6767927ea3b1157d451cb820"), progress: 45 },
        { _id: new ObjectId("1767939e271a78f2fec485d1"), studentId: new ObjectId("6767939e271a78f2fec485d1"), progress: 60 },

        { _id: new ObjectId("27663f44d703aed0356b5b63"), studentId: new ObjectId("67663f44d703aed0356b5b63"), progress: 90 },
        { _id: new ObjectId("2767927ea3b1157d451cb820"), studentId: new ObjectId("6767927ea3b1157d451cb820"), progress: 45 },
        { _id: new ObjectId("2767939e271a78f2fec485d1"), studentId: new ObjectId("6767939e271a78f2fec485d1"), progress: 60 },

        { _id: new ObjectId("37663f44d703aed0356b5b63"), studentId: new ObjectId("67663f44d703aed0356b5b63"), progress: 100 },
        { _id: new ObjectId("3767927ea3b1157d451cb820"), studentId: new ObjectId("6767927ea3b1157d451cb820"), progress: 50 },
        { _id: new ObjectId("3767939e271a78f2fec485d1"), studentId: new ObjectId("6767939e271a78f2fec485d1"), progress: 10 },


    ],
    sessions: [
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234606"),
            video: "https://www.youtube.com/watch?v=0JUN9aDxVmI",
            name: "Advanced Algorithms",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234607"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234580"),
            video: "https://www.youtube.com/watch?v=rL8X2mlNHPM",
            name: "Introduction to Algorithms",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234591"),
                new ObjectId("64a7f5e8d8f1b1c0d1234592"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234583"),
            video: "https://www.youtube.com/watch?v=l26oaHV7D40",
            name: "Programming Basics",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234593"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234585"),
            video: "/path-to-video3.mp4",
            name: "Understanding Limits",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234594"),
                new ObjectId("64a7f5e8d8f1b1c0d1234595"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234588"),
            video: "/path-to-video4.mp4",
            name: "JavaScript Essentials",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234596"),
                new ObjectId("64a7f5e8d8f1b1c0d1234597"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234598"),
            video: "/path-to-video5.mp4",
            name: "Introduction to Neural Networks",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234601"),
                new ObjectId("64a7f5e8d8f1b1c0d1234602"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234599"),
            video: "/path-to-video6.mp4",
            name: "Python Basics for Data Science",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234603"),
            ],
        },
        {
            _id: new ObjectId("64a7f5e8d8f1b1c0d1234600"),
            video: "/path-to-video7.mp4",
            name: "Building Predictive Models",
            summaries: [
                new ObjectId("64a7f5e8d8f1b1c0d1234604"),
                new ObjectId("64a7f5e8d8f1b1c0d1234605"),
            ],
        },
    ],
    summaries: [
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234591"), content: "Introduction to algorithms.", type: "simple" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234592"), content: "Programming fundamentals.", type: "expanded" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234593"), content: "Data structures overview.", type: "simple" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234594"), content: "Introduction to limits.", type: "expanded" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234595"), content: "Derivatives basics.", type: "simple" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234596"), content: "JavaScript basics.", type: "expanded" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234597"), content: "Building web pages with HTML.", type: "simple" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234601"), content: "Introduction to neural networks.", type: "expanded" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234602"), content: "Deep learning applications.", type: "simple" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234603"), content: "Data preprocessing techniques.", type: "expanded" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234604"), content: "Python for machine learning.", type: "simple" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234605"), content: "Building predictive models.", type: "expanded" },
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234607"), content: "Exploration of advanced algorithmic concepts.", type: "expanded"},
        { _id: new ObjectId("64a7f5e8d8f1b1c0d1234609"), content: "Techniques for optimizing algorithms for performance.", type: "simple"}
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
