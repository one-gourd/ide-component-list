import * as React from 'react';
import { render } from 'react-dom';
import { ComponentList, IComponentListProps } from '../src/';
import COMP_LIST from './list.json';

function onSelectItem(value) {
  console.log('当前点击：', value);
}

const props: IComponentListProps = {
  list: COMP_LIST,
  visible: true
}

render(<ComponentList {...props} onSelectItem={onSelectItem} />, document.getElementById(
  'example'
) as HTMLElement);