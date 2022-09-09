import User from '../models/UserModel.js';
import Auth from '../models/UserModelAuth.js';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const getAuth = async (req, res) => {
  try {
    const response = await Auth.findAll({
      attributes: ['id', 'nama', 'email'],
    });
    console.log(Auth);
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const Register = async (req, res) => {
  const { nama, email, password, confPassword } = req.body;
  if (password !== confPassword) return res.status(400).json({ msg: 'Password dan Confirm Password tidak cocok' });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await Auth.create({
      nama: nama,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: 'Register Berhasil' });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const auth = await Auth.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, auth[0].password);
    if (!match) return res.status(400).json({ msg: 'Password Salah' });
    const userId = auth[0].id;
    const nama = auth[0].nama;
    const email = auth[0].email;
    const accessToken = jwt.sign({ userId, nama, email }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '20s',
    });
    const refreshToken = jwt.sign({ userId, nama, email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    });
    await Auth.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: 'Email tidak ditemukan' });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const pengguna = await Auth.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!pengguna[0]) return res.sendStatus(204);
  const userId = pengguna[0].id;
  await Auth.update(
    { refresh_token: null },
    {
      where: {
        id: userId,
      },
    }
  );
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
};

export const getUsers = async (req, res) => {
  // try {
  //   const response = await User.findAll();
  //   res.status(200).json(response);
  // } catch (error) {
  //   console.log(error.message);
  // }
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || '';
  const offset = limit * page;
  const totalRows = await User.count({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: '%' + search + '%',
          },
        },
        {
          produk: {
            [Op.like]: '%' + search + '%',
          },
        },
      ],
    },
  });
  const totalPage = Math.ceil(totalRows / limit);
  const result = await User.findAll({
    where: {
      [Op.or]: [
        {
          nama: {
            [Op.like]: '%' + search + '%',
          },
        },
        {
          produk: {
            [Op.like]: '%' + search + '%',
          },
        },
      ],
    },
    offset: offset,
    limit: limit,
    order: [['id', 'ASC']],
  });
  res.json({
    result: result,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ msg: 'User Created' });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'User Updated' });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(error.message);
  }
};
