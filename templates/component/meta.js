import en from './locales/en.json';
import config from './config/config.json';
import configResources from './config/locales/en.json';

export const SampleComponent = {
  resources: {
    en
  },
  config: {
    ...config,
    locales: {
      en: configResources
    }
  }
};
