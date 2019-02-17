import Chance from 'chance';
import COMP_LIST from '../demo/list.json';
const chance = new Chance();

export function modelPropsGen() {
  return {
    visible: true
  };
}

export {
  COMP_LIST
}

