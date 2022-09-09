import Auth from '../models/UserModelAuth.js';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);
    const pengguna = await Auth.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!pengguna[0]) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      const userId = pengguna[0].id;
      const nama = pengguna[0].nama;
      const email = pengguna[0].email;
      const accessToken = jwt.sign({ userId, nama, email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15s',
      });
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};
