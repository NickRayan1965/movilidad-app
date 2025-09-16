import * as assembliesService from '../services/assembliesService.js';

export function assembliesDashboard(_, res) {
  res.render('assemblies/dashboard', {title: ''});
}
export function createAssembly(req, res) {
  const data = req.body;
  const result = assembliesService.createAssembly(data, req.user);
  return res.status(201).json(result);
}
export function getActiveAssemblies(req, res) {
  const data = assembliesService.getActiveAssemblies(req.user.CODIGO_CONGREGACION);
  return res.json(data);
}