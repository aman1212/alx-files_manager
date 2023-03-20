import mongodb from 'mongodb';

class DBClinet {
  constructor() {
    this.host = process.env.DB_HOST ? process.env.DB_HOST : 'localhost';
    this.port = process.env.DB_PORT ? process.env.DB_PORT : 27017;
    this.database = process.env.DB_DATABASE ? process.env.DB_DATABASE : 'files_manager';
    const dbURL = `mongodb://${this.host}:${this.port}/`;
    this.client = new mongodb.MongoClient(dbURL, { useUnifiedTopology: true });
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db(this.database).collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db(this.database).collection('files').countDocuments();
  }

  async list() {
    const dbs = await this.client.db().admin().listDatabases();
    return dbs;
  }

  async addUser(newEmail, newPassword) {
    const myObj = {
      password: newPassword,
      email: newEmail,
    };
    await this.client.db(this.database).collection('users').insertOne(myObj);
    const newUser = await this.findUser(newEmail);
    return newUser;
  }

  async findUser(email) {
    const result = await this.client.db(this.database).collection('users').findOne({ email });
    return result;
  }

  async findAll(userId) {
    const result = await this.client.db(this.database).collection('users').findOne({ _id: userId });
    return result;
  }
  async usersCollection() {
    return this.client.db().collection('users');
  }

  async filesCollection() {
    return this.client.db().collection('files');
  }
}

const dbClinet = new DBClinet();
export default dbClinet;
