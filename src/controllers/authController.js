import * as authService from "../services/authService.js";
export function register(req, res) {
  const data = req.body;
  const result = authService.register(data);
  if(result.success) return res.status(201).json(result);
  res.status(400).json(result);
}
export function login(req, res) {
  const { username, password } = req.body;
  const result = authService.login(username, password);
  if (result.success) return res.json({ token: result.token, user: result.user });
  res.status(401).json({ error: result.message });
}
export function loginForm(_, res) {
  res.render('auth/login', {title: ''});
}