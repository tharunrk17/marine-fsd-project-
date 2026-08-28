import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { makeToken } from '../utils/token.js';

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash, role: role === 'researcher' ? 'researcher' : 'student' });
  res.status(201).json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid email or password' });
  res.json({ token: makeToken(user.id), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}

export async function me(req, res) { res.json(req.user); }
