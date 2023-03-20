// eslint-disable-next-line import/no-extraneous-dependencies
import atob from 'atob';
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClinet from '../utils/db';
import { redisClient } from '../utils/redis';

export default class AuthController {
  static async getConnect(req, res) {
    const authHeader = req.headers.authorization.split(' ')[1];
    const data = atob(authHeader).split(':');
    const email = data[0];
    const password = data[1];
    const user = await dbClinet.findUser(email);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
    } else if (sha1(password) === user.password) {
      const token = uuidv4();
      const key = `auth_${token}`;
      await redisClient.set(key, user._id.toString(), 24 * 60 * 60);
      res.status(200).json({ token: `${token}` });
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  static async getDisconnect(req, res) {
    const token = req.headers['x-token'];
    if (!(await redisClient.get(`auth_${token}`))) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    await redisClient.del(`auth_${token}`);
    res.status(204).send();
  }
}
