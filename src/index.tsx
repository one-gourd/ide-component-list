import { Instance } from 'mobx-state-tree';
import { initSuitsFromConfig } from 'ide-lib-engine';

export * from './ComponentList/config';
export * from './ComponentList/';

import { ComponentListCurrying } from './ComponentList/';
import { configComponentList } from './ComponentList/config';

const {
    ComponentModel: ComponentListModel,
    StoresModel: ComponentListStoresModel,
    NormalComponent: ComponentList,
    ComponentHOC: ComponentListHOC,
    ComponentAddStore: ComponentListAddStore,
    ComponentFactory: ComponentListFactory
} = initSuitsFromConfig(ComponentListCurrying,configComponentList);

export {
    ComponentListModel,
    ComponentListStoresModel,
    ComponentList,
    ComponentListHOC,
    ComponentListAddStore,
    ComponentListFactory
};

export interface IComponentListModel extends Instance<typeof ComponentListModel> { }
