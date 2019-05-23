import React, { useCallback, useState } from 'react';
import { Row, Col, Select, Alert } from 'antd';
import { IBaseTheme, IBaseComponentProps } from 'ide-lib-base-component';

import { TComponentCurrying } from 'ide-lib-engine';

import { debugInteract, debugRender, debugModel } from '../lib/debug';
import {
  StyledContainer,
  StyledFilterWrap,
  StyledSelect,
  StyledInput,
  StyledGroupWrap,
  StyledItemWrap,
  StyledItemInfo,
  StyledItemDesc,
  StyledItemName,
  StyledItemImage
} from './styles';

import { ISubProps } from './subs';

const Option = Select.Option;

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
export interface IComponentListGroup {
  [prop: string]: {
    title: string;
    list: IComponentListItem[];
  };
}

export interface IComponentListEvent {
  /**
   * 点击回调函数
   */
  onSelectItem?: (item: IComponentListItem) => void;
}

// export interface IComponentListStyles extends IBaseStyles {
//   container?: React.CSSProperties;
// }

export interface IComponentListTheme extends IBaseTheme {
  main: string;
}

export interface IComponentListProps
  extends IComponentListEvent,
    ISubProps,
    IBaseComponentProps {
  /**
   * 是否展现
   */
  visible?: boolean;

  /**
   * 组件列表
   */
  list?: IComponentListGroup;
}

export const DEFAULT_PROPS: IComponentListProps = {
  visible: true,
  theme: {
    main: '#25ab68'
  },
  list: {},
  styles: {
    container: {},
    input: {
      width: 175
    }
  }
};

// 自定义 hooks，当 input 或者 select 更改之后，就更改筛选结果集
const useFilterResult = (
  category: string,
  inputValue: string,
  list: IComponentListGroup
): IComponentListGroup => {
  if (!list) return;
  // 筛选出来的列别范围
  let selectedCategories: IComponentListGroup = {};
  if (!!category) {
    selectedCategories[category] = list[category];
  } else {
    selectedCategories = list;
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

    const lowerCaseInput = inputValue.toLowerCase();
    groupKeys.map((group: string) => {
      // 获取当前的 key
      const curGroup = selectedCategories[group];
      const { list: childrenList } = curGroup;
      {
        childrenList.map((item: IComponentListItem) => {
          if (
            new RegExp(lowerCaseInput).test(item.desc.toLowerCase()) ||
            new RegExp(lowerCaseInput).test(item.name.toLowerCase())
          ) {
            searchList.result.list.push(item);
          }
        });
      }
    });
    debugInteract('[筛选] 通过 input 筛选后：%o', searchList as any);

    return searchList;
  }
};

export const ComponentListCurrying: TComponentCurrying<
  IComponentListProps,
  ISubProps
> = subComponents => props => {
  const { visible, list = {}, styles, onClick, onSelectItem } = props;

  const onSelectItemCallback = useCallback(
    (item: IComponentListItem) => (
      event: React.MouseEvent<HTMLAnchorElement>
    ) => {
      onSelectItem && onSelectItem(item);
    },
    [onSelectItem]
  );

  const [category, setCategory] = useState(''); // 通过类目筛选的
  const [inputValue, setInputValue] = useState(''); // 通过搜索获取的结果集

  // 点击切换类别筛选
  const onChangeCatagory = useCallback((value: string) => {
    setCategory(value);
  }, []);

  // 当用户搜索的时候，建议用 debounce 来提升效率
  const handleSearch = useCallback((ev: any) => {
    setInputValue(ev.target.value);
  }, []);

  const resultList = useFilterResult(category, inputValue, list);

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
        <StyledSelect
          style={styles.select}
          className="list-select"
          defaultValue=""
          onChange={onChangeCatagory}
        >
          <Option value="">全部</Option>
          {listKeys.map((cat: string) => {
            const curGroup = list[cat];
            return (
              <Option key={cat} value={cat}>
                {curGroup.title}
              </Option>
            );
          })}
        </StyledSelect>
        <StyledInput
          className="list-input"
          style={styles.input}
          placeholder="搜索"
          onChange={handleSearch}
        />
      </StyledFilterWrap>
      {(!props.list && (
        <Alert message="请给组件传入 list 列表" type="error" />
      )) ||
        null}
      {groupKeys.map(group => {
        const curGroup = resultList[group];
        const { list: childrenList, title } = curGroup;
        return (
          <StyledGroupWrap
            style={styles.groupWrap}
            key={title}
            className="group-wrap"
          >
            <h3>{title}</h3>
            <Row>
              {childrenList.map((item: IComponentListItem) => {
                return (
                  <Col key={item.name} span={12}>
                    <StyledItemWrap
                      style={styles.itemWrap}
                      href="javascript:void(0)"
                      className="item-wrap"
                      onClick={onSelectItemCallback(item)}
                    >
                      <StyledItemInfo
                        style={styles.itemInfo}
                        className="item-info"
                      >
                        <StyledItemDesc
                          style={styles.itemDesc}
                          className="item-desc"
                        >
                          {item.desc}
                        </StyledItemDesc>
                        <StyledItemName
                          style={styles.itemName}
                          className="item-name"
                        >
                          {item.name}
                        </StyledItemName>
                      </StyledItemInfo>
                      <StyledItemImage
                        style={styles.itemImage}
                        src={item.image}
                        className="item-image"
                      />
                    </StyledItemWrap>
                  </Col>
                );
              })}
            </Row>
          </StyledGroupWrap>
        );
      })}
    </StyledContainer>
  );
};
