import styled from 'styled-components';
import { Select, Input } from 'antd';
import { IBaseStyledProps } from 'ide-lib-base-component';
import { IComponentListProps } from './index';

interface IStyledProps extends IComponentListProps, IBaseStyledProps { }

export const StyledContainer = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
  display: ${(props: IStyledProps) => (props.visible ? 'block' : 'none')};
  width: 380px;
  padding: 10px;

  .list-select{
    margin-right: 10px;
  }

  .list-input{
    width: 175px
  }
`;

export const StyledFilterWrap = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
  margin-bottom: 10px;
`;


export const StyledSelect = styled(Select).attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
   width: 175px;
`;

export const StyledInput = styled(Input).attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
   width: 175px;
`;

export const StyledGroupWrap = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
  border-bottom: 1px solid #e9e9e9;
  margin-bottom: 10px;
  &:last-child{
    border-bottom: none;
    margin-bottom: 0;
  }

  h3{
    margin-bottom: 10px;
    color: #666;
  }
`

export const StyledItemWrap = styled.a.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})<IStyledProps>`
    display: block;
    color: rgba(0,0,0,.65);
    background-color: #f5f7f7;
    margin-bottom: 10px;
    margin-right: 10px;
    padding: 10px;
`;


export const StyledItemInfo = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
    margin-bottom: 6px;
`

export const StyledItemDesc = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
  color: #666;
  display: inline-block;
  margin-right: 10px;
`

export const StyledItemName = styled.div.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
  color: #C8C5C6;
`

export const StyledItemImage = styled.img.attrs({
  style: (props: IStyledProps) => props.style || {}  // 优先级会高一些，行内样式
})`
  max-width: 150px;
  align-self: center;
  display: block;
`




