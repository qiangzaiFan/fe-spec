import initAction from './actions/init';
import type { InitOptions } from './types';

export const init = async (options: InitOptions) => {
  return await initAction({
    ...options,
  });
};

export const scan = async () => {

};
