/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import mongodb from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;
    const result = await dbClient.findUser(email);
    if (!email) {
      res.status(400);
      res.send({ error: 'Missing email' });
    } else if (!password) {
      res.status(400);
      res.send({ error: 'Missing password' });
    } else if (result) {
      res.status(400);
      res.send({ error: 'Already exist' });
    } else {
      res.status(201);
      console.log('creating user');
      const result = await (await dbClient.addUser(email, sha1(password)));
      res.status(201).json({ id: result._id, email: result.email });
    }
  }

  static async getUserFromXToken(req) {
    const token = req.headers['x-token'];
    if (!token) {
      return null;
    }
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return null;
    }
    const user = await (await dbClient.findUser({ _id: userId }));
    return user || null;
  }

  static async getMe(req, res) {
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    console.log(userId);
    if (!token || !userId) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }
    const user = await dbClient.client.db('files_manager').collection('users').findOne({ _id: new mongodb.ObjectId(userId) });
    res.status(200).json({ email: user.email, id: user._id.toString() });
  }
}
