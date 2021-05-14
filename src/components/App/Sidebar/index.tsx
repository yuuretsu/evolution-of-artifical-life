import React from "react";
import styled from 'styled-components';
import { WorldBlock } from "../../../lib/block";
import { GENES } from "../../../lib/genome";
import { limit } from "../../../lib/helpers";
import VIEW_MODES, { VisualiserParams } from "../../../lib/view-modes";
import { SquareWorld, World, WorldInfo, NewWorldProps } from "../../../lib/world";
import Accordion from "./Accordion";
import Block from "./Block";
import Checkbox from "./Checkbox";
import DropdownSmall from "./DropdownSmall";
import InputNumber from "./InputNumber";
import InputRange from "./InputRange";
import OptionalBlock from "./OptionalBlock";
import RadioGroup from "./RadioGroup";
import SubBlock from "./SubBlock";
import WideButton from "./WideButton";

interface ISidebarProps {
  readonly opened: boolean,
  readonly padding: string;
  readonly width: string;
};

const Wrapper = styled.div<ISidebarProps>`
    position: fixed;
    left: ${props => props.opened ? 0 : `-${props.width}`};
    box-sizing: border-box;
    width: ${props => props.width};
    min-width: ${props => props.width};
    height: 100%;
    overflow-y: auto;
    padding: ${props => `${props.padding} ${props.padding} 0 ${props.padding}`};
    background-color: rgba(20, 20, 20);
    color: whitesmoke;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    transition-duration: 0.2s;
    &::after {
        content: "";
        display: block;
        padding-bottom: ${props => props.padding};
    }
    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: rgb(50, 50, 50);
        border-radius: 3px;
    }
    &::-webkit-scrollbar-thumb:hover {
        background-color: rgb(80, 80, 80);
    }
`;

type SidebarProps = {
  opened: boolean,
  style: { padding: string, width: string },
  viewModesList: { value: string, title: string }[],
  viewMode: string,
  visualizerParams: VisualiserParams,
  setVisualizerParams: (value: VisualiserParams) => any;
  newWorldProps: NewWorldProps,
  setNewWorldProps: (value: NewWorldProps) => any
  setWorld: (world: World) => any,
  setViewMode: (value: string) => any,
  world: World,
  worldInfo: WorldInfo,
  enabledGenes: { [name: string]: boolean }
  setEnabledGenes: (value: { [name: string]: boolean }) => any;
  selectedBlock: WorldBlock | null;
  setSelectedBlock: (block: WorldBlock | null) => void;
};

const Sidebar = (props: SidebarProps) => {
  return (
    <Wrapper opened={props.opened} padding={props.style.padding} width={props.style.width}>
      {/* <Dropdown
        selected={'Hello'}
        list={[
          { value: '5', title: '5' },
          { value: 'sg', title: 'Sf' },
        ]}
        onChange={() => { }}
      /> */}
      <Accordion name='Инфо о мире' defaultOpened>
        <div>Возраст: {(props.worldInfo.cycle / 1000).toFixed(1)} тыс. кадров</div>
        <div>Ботов: {props.worldInfo.dynamicBlocks}</div>
      </Accordion>
      <Accordion name='Инфо о блоке' defaultOpened>
        {props.selectedBlock
          ? <>
            <SubBlock>
              <WideButton onClick={() => props.setSelectedBlock(null)}>Снять выделение</WideButton>
            </SubBlock>
            {props.selectedBlock.getInfo()}
          </>
          : <span>Кликните по пикселю на карте, чтобы увидеть здесь информацию о нём.</span>
        }
      </Accordion>
      <Accordion name='Настройки просмотра' defaultOpened>
        <SubBlock name="Режим отображения">
          <RadioGroup
            name='view-mode'
            list={props.viewModesList}
            defaultChecked={props.viewMode}
            onChange={props.setViewMode as (value: string) => any}
          />
        </SubBlock>
        {props.viewMode === 'age' && <OptionalBlock>
          <SubBlock name="Делитель возраста">
            <InputRange
              min={10}
              max={1000}
              value={props.visualizerParams.ageDivider}
              onChange={e => props.setVisualizerParams({
                ...props.visualizerParams,
                ...{ ageDivider: parseInt(e.target.value) }
              })}
            />
          </SubBlock>
        </OptionalBlock>}
        {props.viewMode === 'energy' && <OptionalBlock>
          <SubBlock name="Делитель энергии">
            <InputRange
              min={1}
              max={500}
              value={props.visualizerParams.energyDivider}
              onChange={e => props.setVisualizerParams({
                ...props.visualizerParams,
                ...{ energyDivider: parseInt(e.target.value) }
              })}
            />
          </SubBlock>
        </OptionalBlock>}
        {props.viewMode === 'lastAction' && <OptionalBlock>
          <SubBlock name="Отображение отдельных действий">
            {
              Object
                .keys(props.visualizerParams.action)
                .map(actionName => {
                  return (
                    <Checkbox
                      title={actionName}
                      value={actionName}
                      key={actionName}
                      checked={props.visualizerParams.action[actionName]}
                      onChange={(value, checked) => {
                        const newParams = {
                          ...props.visualizerParams,
                        };
                        newParams.action[value] = checked;
                        console.log('chbx click');
                        props.setVisualizerParams(newParams);
                      }}
                    />
                  );
                })
            }
          </SubBlock>
          <WideButton
            onClick={() => {
              const newParams = {
                ...props.visualizerParams,
              };
              Object
                .keys(newParams.action)
                .forEach(name => {
                  newParams.action[name] = true;
                });
              props.setVisualizerParams(newParams);
            }}
          >
            Включить все
            </WideButton>
          <WideButton
            onClick={() => {
              const newParams = {
                ...props.visualizerParams,
              };
              Object
                .keys(newParams.action)
                .forEach(name => {
                  newParams.action[name] = false;
                });
              props.setVisualizerParams(newParams);
            }}
          >
            Выключить все
          </WideButton>
        </OptionalBlock>}
      </Accordion>
      <Accordion name='Настройки мира' defaultOpened>
        <SubBlock name="Генофонд">
          {Object.keys(props.enabledGenes).map(key => {
            return (<Checkbox
              title={GENES[key]!.name}
              value={key}
              key={key}
              checked={props.enabledGenes[key]}
              onChange={(value, checked) => {
                const newEnabledGenes = { ...props.enabledGenes };
                newEnabledGenes[value] = checked;
                props.setEnabledGenes(newEnabledGenes)
              }}
            />)
          })}
        </SubBlock>
      </Accordion>
      <Accordion name='Перезапуск' defaultOpened>
        <SubBlock name="Размер мира">
          <InputNumber
            placeholder="Ширина"
            min={1}
            max={2048}
            value={props.newWorldProps.width}
            onChange={e => {
              props.setNewWorldProps({
                ...props.newWorldProps,
                ...{
                  width: limit(
                    parseInt(e.target.min),
                    parseInt(e.target.max),
                    parseInt(e.target.value)
                  )
                }
              })
            }}
          />
          <InputNumber
            placeholder="Высота"
            min={1}
            max={2048}
            value={props.newWorldProps.height}
            onChange={e => props.setNewWorldProps({
              ...props.newWorldProps,
              ...{
                height: limit(
                  parseInt(e.target.min),
                  parseInt(e.target.max),
                  parseInt(e.target.value)
                )
              }
            })}
          />
        </SubBlock>
        <SubBlock name="Кол-во ботов">
          <InputNumber
            placeholder="Кол-во ботов"
            min={1}
            max={props.world.width * props.world.height}
            value={props.newWorldProps.botsAmount}
            onChange={e => props.setNewWorldProps({
              ...props.newWorldProps,
              ...{
                botsAmount: limit(
                  parseInt(e.target.min),
                  parseInt(e.target.max),
                  parseInt(e.target.value))
              }
            })}
          />
        </SubBlock>
        <SubBlock>
          <WideButton
            onClick={() => {
              props.setWorld(new SquareWorld(props.newWorldProps));
              props.setSelectedBlock(null);
            }}
          >
            Рестарт
                    </WideButton>
        </SubBlock>
      </Accordion>
    </Wrapper>
  );
};

export default Sidebar;