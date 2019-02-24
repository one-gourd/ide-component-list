import React, { Component, useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Row, Col, Select, Alert  } from 'antd';
import { pick } from 'ide-lib-utils';
import { based, Omit, IBaseTheme, IBaseStyles, IBaseComponentProps} from 'ide-lib-base-component';
// import useInputValue from '@rehooks/input-value';
// import {
//   ISchemaTreeProps,
//   SchemaTree,
//   SchemaTreeAddStore,
//   TSchemaTreeControlledKeys
// } from 'ide-tree';

import { debugInteract, debugRender, debugModel } from '../lib/debug';
import { StyledContainer, StyledFilterWrap, StyledSelect, StyledInput, StyledGroupWrap, StyledItemWrap, StyledItemInfo, StyledItemDesc, StyledItemName, StyledItemImage } from './styles';
import { AppFactory } from './controller/index';
import { StoresFactory, IStoresModel } from './schema/stores';
import { TComponentListControlledKeys, CONTROLLED_KEYS } from './schema/index';

const Option = Select.Option;

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

export interface IComponentListStyles extends IBaseStyles {
  container?: React.CSSProperties;
}

export interface IComponentListTheme extends IBaseTheme {
  main: string;
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
  [prop: string]: {
    title: string;
    list: IComponentListItem[];
  };
}

export interface IComponentListProps extends IComponentListEvent, IBaseComponentProps{
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
};


export const DEFAULT_PROPS: IComponentListProps = {
  visible: true,
  theme: {
    main: '#25ab68'
  },
  list: {},
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

    const [category, setCategory] = useState(''); // 通过类目筛选的
    const [inputValue, setInputValue] = useState(''); // 通过搜索获取的结果集
    

    // 点击切换类别筛选
    const onChangeCatagory = function(value: string) {
      setCategory(value);
    }
    // 当用户搜索的时候，建议用 debounce 来提升效率
    const handleSearch = function (ev: any) {
      setInputValue(ev.target.value);
    }

    // 自定义 hooks，当 input 或者 select 更改之后，就更改筛选结果集
    const useFilterResult = (category: string, inputValue: string): IComponentListGroup =>{
      if(!props.list) return;
      // 筛选出来的列别范围
      let selectedCategories: IComponentListGroup = {};
      if (!!category) {
        selectedCategories[category] = props.list[category];
      } else {
        selectedCategories = props.list;
      }

      debugInteract('[类别筛选] 通过 select 筛选后：%o', selectedCategories as any);

      // 开始处理 input
      if (!inputValue) {
        return selectedCategories;
      } else {
        // 获取每组的 keys
        const groupKeys = Object.keys(selectedCategories);
        // 构造结果集
        const searchList: IComponentListGroup = {
          result: {
            title: '搜索结果',
            list: []
          }
        };

        groupKeys.map((group: string) => {
          // 获取当前的 key
          const curGroup = selectedCategories[group];
          const { list: childrenList } = curGroup;
          {
            childrenList.map((item: IComponentListItem) => {
              if (new RegExp(inputValue).test(item.desc) || new RegExp(inputValue).test(item.name.toLowerCase())) {
                searchList.result.list.push(item);
              }
            })
          }
        });
        debugInteract('[筛选] 通过 input 筛选后：%o', searchList as any);

        return searchList;
      }
    }

    const resultList = useFilterResult(category, inputValue);

    const groupKeys = Object.keys(resultList || {}); // 筛选后的 key
    const listKeys = Object.keys(list || {}); // 所有的 key

  
    return (
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
              listKeys.map((cat: string) => {
                const curGroup = list[cat];
                return <Option key={cat} value={cat}>{curGroup.title}</Option>;
              })
            }
          </StyledSelect>
          <StyledInput className="list-input" style={styles.input} placeholder="搜索" onChange={handleSearch}></StyledInput>
        </StyledFilterWrap>
        {
          !props.list && <Alert message="请给组件传入 list 列表" type="error" /> || null
        }
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
    );
  };
  ComponentListHOC.displayName = 'ComponentListHOC';
  return observer(based(ComponentListHOC));
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
    const {/* schemaTree, onSelectItem, */ ...otherProps} = props;
    const {/* schemaTree, */ model } = stores;
    const controlledProps = pick(model, CONTROLLED_KEYS);
    debugRender(`[${stores.id}] rendering.`);
    debugModel(`[${stores.id}] controlledProps: %o`, controlledProps);
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