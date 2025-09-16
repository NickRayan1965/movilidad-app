import * as assemblyTypes from "../services/assemblyTypesService.js";

export function getAssemblyTypes(_, res) {
  const data = assemblyTypes.getAssemblyTypes();
  return res.json(data);
}