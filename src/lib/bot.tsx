import { World } from "./world";
import Rgba from "./color";
import { Coords } from "./grid";
import { fixNumber, limit, randInt } from "./helpers";
import { WorldBlock, DynamicBlock } from "./block";
import { Gene, GenePool, GENES, GeneTemplate, Genome } from "./genome";
import { VisualiserParams } from "./view-modes";
import React from "react";
import SubBlock from "../components/App/Sidebar/SubBlock";
import Block from "../components/App/Sidebar/Block";
import WorldBlockIcon from "./WorldBlockVisualiser";
import OptionalBlock from "../components/App/Sidebar/OptionalBlock";

export type BotAbilityName = keyof typeof Bot.prototype.abilities;

export class Bot extends DynamicBlock {
    alive = true;
    private _narrow: number = randInt(0, 8);
    age = 0;
    childrenAmount = 0;
    lastAction: GeneTemplate = GENES.doNothing!;
    constructor(
        color: Rgba,
        public energy: number,
        public abilities: {
            photosynthesis: number,
            attack: number
        },
        public genome: Genome
    ) {
        super(color);
    }
    set narrow(n: number) {
        this._narrow = fixNumber(0, 8, n);
    }
    get narrow(): number {
        return this._narrow;
    }
    getNormalColor(): Rgba {
        return this.color;
    }
    getEnergyColor(params: VisualiserParams): Rgba {
        return new Rgba(0, 0, 100, 255)
            .interpolate(
                new Rgba(255, 255, 0, 255),
                this.energy / params.energyDivider
            );
    }
    getAgeColor(params: VisualiserParams): Rgba {
        return new Rgba(150, 255, 255, 255)
            .interpolate(
                new Rgba(80, 80, 100, 255),
                this.age / params.ageDivider
            );
    }
    getLastActionColor(params: VisualiserParams): Rgba | null {
        if (!params.action[this.lastAction.name]) {
            // console.log(params.action[this.lastAction.name]);
            return new Rgba(20, 20, 20, 255)
        }
        const MAYBE_COLOR = this.lastAction.color;
        return MAYBE_COLOR
            ? MAYBE_COLOR
            : new Rgba(20, 20, 20, 255);
    }
    getChildrenAmountColor(params: VisualiserParams): Rgba | null {
        return new Rgba(20, 20, 150, 255)
            .interpolate(
                new Rgba(255, 0, 0, 255),
                this.childrenAmount / 10
            );
    }
    getAbilityColor(): Rgba | null {
        return new Rgba(255, 0, 0, 255)
            .interpolate(new Rgba(0, 255, 0, 255), this.abilities.photosynthesis);
    }
    increaseAbility(ability: BotAbilityName) {
        for (const name in this.abilities) {
            if (Object.prototype.hasOwnProperty.call(this.abilities, name)) {
                this.abilities[name as BotAbilityName] = limit(
                    0,
                    1,
                    this.abilities[name as BotAbilityName] + (name === ability
                        ? 0.01
                        : -0.01
                    )
                );
            }
        }
    }
    getAttacked(bot: Bot, value: number) {
        const REAL_VALUE = Math.min(this.energy, value);
        this.energy -= REAL_VALUE;
        bot.energy += REAL_VALUE * bot.abilities.attack ** 2;
        bot.increaseAbility('attack');
    }
    multiply(pool: GenePool) {
        const colorCopy = Object
            .assign(Object.create(Object.getPrototypeOf(this.color)), this.color) as Rgba;
        this.energy /= 2;
        this.childrenAmount++;
        return new Bot(
            colorCopy,
            this.energy,
            { ...this.abilities },
            this.genome.replication(pool)
        );
    }
    live(x: number, y: number, world: World) {
        if (this.age > 2000 || this.energy < 1 || this.energy > 300) {
            this.alive = false;
            world.remove(x, y);
            // world.set(x, y, new Block(this.color.interpolate(new Rgba(0, 0, 0, 255), 0.5)));
            return;
        }
        this.genome.doAction(this, x, y, world);
        this.age++;
    }
    getInfo() {
        return (
            <OptionalBlock>
                <div style={{ display: 'flex' }} >
                    <div style={{ transform: 'translateY(3px)' }}>
                        <WorldBlockIcon block={this} />
                    </div>
                    <span style={{ marginLeft: '5px' }}>Бот</span>
                </div>
                {this.alive ? <div>
                    <div>Возраст: {this.age}</div>
                    <div>Энергия: {this.energy.toFixed(2)}</div>
                    <div>Направление: {narrowToName(this.narrow)}</div>
                </div> : 'Мёртв'}
                {this.genome.getInfo()}
            </OptionalBlock>
        );
    }
}

function narrowToName(narrow: number) {
    switch (narrow) {
        case 0: return 'лево-верх';
        case 1: return 'верх';
        case 2: return 'право-верх';
        case 3: return 'право';
        case 4: return 'право-низ';
        case 5: return 'низ';
        case 6: return 'лево-низ';
        case 7: return 'лево';
    }
}