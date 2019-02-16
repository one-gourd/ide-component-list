import React, { Component, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Col, Select  } from 'antd';
import { ThemeProvider } from 'styled-components';
// import useInputValue from '@rehooks/input-value';
// import {
//   ISchemaTreeProps,
//   SchemaTree,
//   SchemaTreeAddStore,
//   TSchemaTreeControlledKeys
// } from 'ide-tree';

import { debugRender } from '../lib/debug';
import { pick } from '../lib/util';
import { StyledContainer, StyledFilterWrap, StyledSelect, StyledInput, StyledGroupWrap, StyledItemWrap, StyledItemInfo, StyledItemDesc, StyledItemName, StyledItemImage } from './styles';
import { AppFactory } from './controller/index';
import { StoresFactory, IStoresModel } from './schema/stores';
import { TComponentListControlledKeys, CONTROLLED_KEYS } from './schema/index';

const Option = Select.Option;


type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
// type OptionalProps<T, K> = T | Omit<T, K>;
// type OptionalSchemaTreeProps = OptionalProps<
//   ISchemaTreeProps,
//   TSchemaTreeControlledKeys
// >;
interface ISubComponents {
  // SchemaTreeComponent: React.ComponentType<OptionalSchemaTreeProps>;
}

export interface IComponentListEvent {
  /**
   * 点击回调函数
   */
  onSelectItem?: (item: IComponentListItem)=>void;
}

export interface IStyles {
  [propName: string]: React.CSSProperties;
}

export interface IComponentListStyles extends IStyles {
  container?: React.CSSProperties;
}

export interface IComponentListTheme {
  main: string;
  [prop: string]: any;
}

export interface IComponentListItem {
  /**
  * 组件名称
  */
  name: string;

  /**
  * 组件描述
  */
  desc?: string;

  /**
  * 组件图片
  */
  image?: string;
  [prop: string]: any;

}

export interface IComponentListGroup{
  [prop: string]: IComponentListItem;
  
}

export interface IComponentListProps extends IComponentListEvent{
  // /**
  // * 子组件 schemaTree
  // */
  // schemaTree: OptionalSchemaTreeProps;

  /**
   * 是否展现
   */
  visible?: boolean;

  /**
   * 组件列表
   */
  list?: IComponentListGroup;

  text?: string;
  /**
   * 样式集合，方便外部控制
   */
  styles?: IComponentListStyles;

  /**
   * 设置主题
   */
  theme?: IComponentListTheme;

};


export const DEFAULT_PROPS: IComponentListProps = {
  visible: true,
  theme: {
    main: '#25ab68'
  },
  styles: {
    container: {},
    input:{
      width: 175
    }
  }
};

/**
 * 使用高阶组件打造的组件生成器
 * @param subComponents - 子组件列表
 */
export const ComponentListHOC = (subComponents: ISubComponents) => {
  const ComponentListHOC = (props: IComponentListProps = DEFAULT_PROPS) => {
    // const { SchemaTreeComponent } = subComponents;
    const mergedProps = Object.assign({}, DEFAULT_PROPS, props);
    const { /* schemaTree, */ visible, list, styles, theme } = mergedProps;

    const onSelectItem = (item: IComponentListItem) => (event: React.MouseEvent<HTMLAnchorElement>) => {
      const { onSelectItem } = props;
      onSelectItem && onSelectItem(item);
    };

    const [listFromCatagory, setListFromCatagory] = useState(props.list); // 通过类目筛选的
    const [listFromSearch, setListFromSearch] = useState(null); // 通过搜索获取的结果集

  
    const resultList = listFromSearch || listFromCatagory;

    const groupKeys = Object.keys(resultList); // 筛选后的 key
    const listKeys = Object.keys(list); // 所有的 key

    const onChangeCatagory = function(value: string) {
      console.log('value', value);
    }

    const handleSearch = function (ev: any) {
      console.log(777, ev.target.value);
    }

    return (
      <ThemeProvider theme={theme}>
        <StyledContainer
          style={styles.container}
          visible={visible}
          // ref={this.root}
          className="ide-component-list-container"
        >
          <StyledFilterWrap style={styles.filterWrap}>
            <StyledSelect style={
              styles.select
            } className="list-select" defaultValue="" onChange={onChangeCatagory} >
              <Option value="">全部</Option>
              {
                listKeys.map((cat:string) => {
                  const curGroup = list[cat];
                  return <Option key={cat} value={cat}>{curGroup.title}</Option>;
                })
              }
            </StyledSelect>
            <StyledInput className="list-input" style={styles.input} placeholder="搜索"  onChange={handleSearch}></StyledInput>
          </StyledFilterWrap>
          {
            groupKeys.map(group => {
              const curGroup = resultList[group];
              const { list: childrenList, title } = curGroup;
              return <StyledGroupWrap style={styles.groupWrap} key={title} className="group-wrap">
                <h3>{title}</h3>
                <Row>
                  {
                    childrenList.map((item: IComponentListItem) => {
                      return <Col key={item.name} span={12}>
                        <StyledItemWrap style={styles.itemWrap} href="javascript:void(0)" className="item-wrap" onClick={onSelectItem(item)}>
                          <StyledItemInfo style={styles.itemInfo} className='item-info'>
                            <StyledItemDesc style={styles.itemDesc} className="item-desc">{item.desc}</StyledItemDesc>
                            <StyledItemName style={styles.itemName} className="item-name">{item.name}</StyledItemName>
                          </StyledItemInfo>
                          <StyledItemImage style={styles.itemImage} src={item.image} className="item-image"></StyledItemImage>
                        </StyledItemWrap>
                      </Col>
                    })
                  }
                </Row>
              </StyledGroupWrap>;
            })
          }
        </StyledContainer>
      </ThemeProvider>
    );
  };
  ComponentListHOC.displayName = 'ComponentListHOC';
  return observer(ComponentListHOC);
};

// 采用高阶组件方式生成普通的 ComponentList 组件
export const ComponentList = ComponentListHOC({
  // SchemaTreeComponent: SchemaTree,
});

/* ----------------------------------------------------
    以下是专门配合 store 时的组件版本
----------------------------------------------------- */


/**
 * 科里化创建 ComponentListWithStore 组件
 * @param stores - store 模型实例
 */
export const ComponentListAddStore = (stores: IStoresModel) => {
  const ComponentListHasSubStore = ComponentListHOC({
    // SchemaTreeComponent: SchemaTreeAddStore(stores.schemaTree)
  });

  const ComponentListWithStore = (props: Omit<IComponentListProps, TComponentListControlledKeys>) => {
    const {/* schemaTree, */ onSelectItem, ...otherProps} = props;
    const {/* schemaTree, */ model } = stores;
    const controlledProps = pick(model, CONTROLLED_KEYS);
    debugRender(`[${stores.id}] rendering`);
    return (
      <ComponentListHasSubStore
        // schemaTree={ schemaTree }
        {...controlledProps}
        {...otherProps}
      />
    );
  };

  ComponentListWithStore.displayName = 'ComponentListWithStore';
  return observer(ComponentListWithStore);
}
/**
 * 工厂函数，每调用一次就获取一副 MVC
 * 用于隔离不同的 ComponentListWithStore 的上下文
 */
export const ComponentListFactory = () => {
  const {stores, innerApps} = StoresFactory(); // 创建 model
  const app = AppFactory(stores, innerApps); // 创建 controller，并挂载 model
  return {
    stores,
    app,
    client: app.client,
    ComponentListWithStore: ComponentListAddStore(stores)
  };
};