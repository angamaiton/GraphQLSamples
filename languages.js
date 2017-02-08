import { GraphQLList as List } from 'graphql';
import LanguageType from '../types/LanguageType';
import fetch from '../../core/fetch';

const url = '../languages.json';

let items = [];
let lastFetchTask;
let lastFetchTime = new Date(1970, 0, 1);

const languages = {
  type: new List(LanguageType),
  resolve() {
    if (lastFetchTask) {
      return lastFetchTask;
    }
    if ((new Date() - lastFetchTime) > 1000 * 60 * 10 /* 10 mins */) {
      lastFetchTime = new Date();
      lastFetchTask = fetch(url)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            items = data.items;
          }

          return items;
        })
        .finally(() => {
          lastFetchTask = null;
        });

      if (items.length) {
        return items;
      }

      return lastFetchTask;
    }

    return items;
  },
};

export default languages;
