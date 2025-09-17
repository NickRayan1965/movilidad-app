import * as assembliesService from '../services/assembliesService.js';
import { QueryParams } from '../utils/queryParamsUtil.js';

export function assembliesDashboard(_, res) {
  res.render('assemblies/dashboard');
}
export function editAssemblyView(req, res) {
  const { id } = req.params;
  res.render('assemblies/assembly-edit', {id});
}
export function createAssembly(req, res) {
  const data = req.body;
  const result = assembliesService.createAssembly(data, req.user);
  return res.status(201).json(result);
}
export function getActiveAssemblies(req, res) {
  const { 
    getDays,
    getReservations 
  } = req.query;
  
  const data = assembliesService.getActiveAssemblies({
    congregation_id: req.user.CODIGO_CONGREGACION,
    getDays: QueryParams.bool(getDays),
    getReservations: QueryParams.bool(getReservations)
  });
  return res.json(data);
}
export function getAssemblyById(req, res) {
  const {
    id
  } = req.params;
  const data = assembliesService.getActiveAssemblies({
    congregation_id: req.user.CODIGO_CONGREGACION,
    getDays: true,
    getReservations: true,
    id,
  });
  return res.json(data[0]);
}