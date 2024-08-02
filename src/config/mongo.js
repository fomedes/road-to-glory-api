import { connect, disconnect } from 'mongoose';

// Wrap the code in an async function to ensure environment variables are available
async function startMongo() {
  // Pause briefly to allow dotenv to load environment variables
  await new Promise((resolve) => setTimeout(resolve, 100));

  const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env;
  const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI;

  if (!connectionString) {
    console.error('Database connection error');
  }


  // Connection to MongoDB
  connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log('Database connected');
    })
    .catch(err => {
      console.error(err);
    });

  process.on('uncaughtException', error => {
    console.error(error);
    disconnect();
  });
}

startMongo();
