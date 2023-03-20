/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import sha1 from 'sha1';
import atob from 'atob';
import mongodb from 'mongodb';
import dbClient from './db';
import redisClient from './redis';

const getUserFromXToken = async (req) => {
  const token = req.headers['x-token'];

  if (!token) {
    return null;
  }
  const userId = await redisClient.get(`auth_${token}`);
  if (!userId) {
    return null;
  }
  const user = await dbClient.client.db('files_manager').collection('users').findOne({ _id: new mongodb.ObjectId(userId) });
  return user || null;
};

async function getUserFromAuth(req) {
  const authHeader = req.headers.authorization.split(' ')[1];
  const data = atob(authHeader).split(':');
  const email = data[0];
  const password = data[1];
  const user = await dbClient.findUser(email);
  console.log(user);
  if (!user || sha1(password) !== user.password) {
    return null;
  }
  return user;
}

export default {
  getUserFromAuth: async (req) => getUserFromAuth(req),
  getUserFromXToken: async (req) => getUserFromXToken(req),
};
