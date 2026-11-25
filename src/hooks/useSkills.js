import { useRequest } from './useRequest';

export function useSkills(enabled = true) {
  return useRequest(enabled ? '/habilidades' : null, {}, true);
}
