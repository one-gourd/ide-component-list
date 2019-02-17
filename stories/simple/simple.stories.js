import React from 'react';
import { storiesOf } from '@storybook/react';
import { wInfo } from '../../.storybook/utils';

import { ComponentList, createModel, ComponentListAddStore } from '../../src/';
import mdMobx from './simple-mobx.md';
import mdPlain from './simple-plain.md';
import { COMP_LIST } from '../helper';


const propsNormal = {
  visible: true
};
const propsModel = createModel(propsNormal);

function onClick(value) {
  console.log('当前值：', value);
}

const clickBtn = target => () => {
  if (target && target.setVisible) {
    target.setVisible(false);
  } else {
    target.visible = false;
  }
};

storiesOf('基础使用', module)
  .addParameters(wInfo(mdMobx))
  .addWithJSX('使用 mobx 化的 props', () => {
    const ComponentListWithStore = ComponentListAddStore({ model: propsModel });
    return (
      <div>
        <button onClick={clickBtn(propsModel)}>
          更改 visible（会响应）
        </button>
        <ComponentListWithStore list={COMP_LIST} onClick={onClick} />
      </div>
    );
  })
  .addParameters(wInfo(mdPlain))
  .addWithJSX('普通 props 对象', () => (
    <div>
      <button onClick={clickBtn(propsNormal)}>
        更改 visible（不会响应）
      </button>
      <ComponentList list={COMP_LIST} {...propsNormal} onSelectItem={onClick} />
    </div>
  ));
