import * as React from 'react';
import { render } from 'react-dom';
import {
  ComponentList,
  ComponentListFactory,
  IComponentListProps
} from '../src/';
import { Collapse, Button } from 'antd';
import COMP_LIST from './list.json';
import NEW_COMP_LIST from './gourd2-complist';
const Panel = Collapse.Panel;

declare const axios: any;

const {
  ComponentWithStore: ComponentListWithStore,
  client
} = ComponentListFactory();

function onSelectItem(value) {
  console.log('当前点击：', value);
}

const props: IComponentListProps = {
  visible: true,
  list: COMP_LIST
};

function onChangeList() {
  client.put('/model', {
    name: 'list',
    value: NEW_COMP_LIST
  });
}

render(
  <Collapse defaultActiveKey={['1']}>
    <Panel header="普通组件" key="0">
      <ComponentList {...props} onSelectItem={onSelectItem} />
    </Panel>
    <Panel header="包含 store 功能" key="1">
      <Button onClick={onChangeList}>更换 list</Button>
      <ComponentListWithStore onSelectItem={onSelectItem} />
    </Panel>
  </Collapse>,
  document.getElementById('example') as HTMLElement
);

client.post('/model', {
  model: {
    visible: true,
    list: COMP_LIST
  }
});
