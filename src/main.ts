import Bot, { Genome } from "./lib/Bot";
import { PixelsData, Rgba } from "./lib/drawing";
import Grid from "./lib/Grid";
import { limNumber, normalizeNumber } from "./lib/math-functions";
import { Block, MOORE_NEIGHBOURHOOD, World } from "./lib/world";

function onResizeWindow() {
    (document.querySelector('.wrapper') as HTMLElement).style.maxHeight = `${window.innerHeight}px`;
}

function start() {

    Bot.amount = 0;

    world = new World(
        parseInt((document.querySelector('#input-width') as HTMLInputElement).value),
        parseInt((document.querySelector('#input-height') as HTMLInputElement).value),
        parseInt((document.querySelector('#input-pixel') as HTMLInputElement).value),
        document.querySelector('#img') as HTMLCanvasElement
    );

    const BOTS_AMOUNT = parseInt((document.querySelector('#input-bots') as HTMLInputElement).value);

    for (let i = 0; i < Math.min(world.width * world.height, BOTS_AMOUNT); i++) {
        const a = new Bot(
            world,
            ...world.randEmpty(),
            new Rgba(100, 100, 100, 255),
            100,
            new Genome(64).fillRandom(),
            Rgba.randRgb(),
            { photo: 0.5, attack: 0.5 }
        );
    }

    world.init();
}

function drawColors(block: any) {
    if (block instanceof Block) {
        return block.color;
    }
    return null;
}

function drawEnergy(block: any) {
    if (block instanceof Bot) {
        return new Rgba(20, 20, 100, 255)
            .interpolate(
                new Rgba(255, 255, 0, 255),
                block.energy / 100
            );
    }
    return null;
}

function drawAbilities(block: any) {
    if (block instanceof Bot) {
        return new Rgba(
            normalizeNumber(0.5, 1, block.abilities.attack) * 255,
            normalizeNumber(0.5, 1, block.abilities.photo) * 255,
            50,
            255
        );
    }
    return null;
}

function drawFamilies(block: any) {
    if (block instanceof Bot) {
        return block.family;
    }
    return null;
}

function drawLastAction(block: any) {
    if (block instanceof Bot) {
        return block.lastAction;
    }
    return null;
}

function getNarrowImg(world: World): HTMLCanvasElement {
    const img = new PixelsData(world.width * 3, world.height * 3);
    for (let x = 0; x < world.width; x++) {
        for (let y = 0; y < world.height; y++) {
            const block = world.get(x, y);
            if (block instanceof Bot) {
                const xy: [number, number] = [
                    block.x * 3 + 1 + MOORE_NEIGHBOURHOOD[block.narrow][0],
                    block.y * 3 + 1 + MOORE_NEIGHBOURHOOD[block.narrow][1],
                ];
                img.setPixel(...xy, new Rgba(0, 0, 0, 255));
            }
        }
    }
    img.update();
    return img.node;
}

function updateImage(world: World, mode: string, drawBotsNarrow: boolean) {
    switch (mode) {
        case 'normal': world.clearImage(); world.visualize(drawColors); break;
        case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
        case 'families': world.clearImage(); world.visualize(drawFamilies); break;
        case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
        case 'last-action': world.clearImage(); world.visualize(drawLastAction); break;
        default: break;
    }
    if (drawBotsNarrow) {
        world.drawLayer(getNarrowImg(world));
    }
}

let world: World;

window.addEventListener('resize', onResizeWindow);

onResizeWindow();

window.addEventListener('load', () => {

    document.querySelector('#input-width')?.addEventListener('change', e => {
        const target = e.target as HTMLInputElement;
        target.value = limNumber(1, 2048, parseInt(target.value)).toString();
    });

    document.querySelector('#input-height')?.addEventListener('change', e => {
        const target = e.target as HTMLInputElement;
        target.value = limNumber(1, 2048, parseInt(target.value)).toString();
    });

    document.querySelector('#input-pixel')?.addEventListener('change', e => {
        const target = e.target as HTMLInputElement;
        target.value = limNumber(1, 50, parseInt(target.value)).toString();
    });

    const $btnMenu = document.querySelector('#btn-menu') as HTMLInputElement;
    const $imgContainer = document.querySelector('#img-container') as HTMLElement;
    const $img = document.querySelector('#img') as HTMLElement;

    // const $fpsLimit = document.querySelector('#fps-limit') as HTMLInputElement;
    // $fpsLimit.addEventListener('input', () => {
    //     $fpsLimit.value = limNumber(1, 250, parseInt($fpsLimit.value) || 60).toString();
    // });

    $btnMenu.addEventListener('change', () => {
        if ($btnMenu.checked) {
            $imgContainer.classList.add('img-wrapper--menu-opened');
            document.querySelector('#menu')?.classList.add('wrapper__menu--menu-opened');
        } else {
            $imgContainer.classList.remove('img-wrapper--menu-opened');
            document.querySelector('#menu')?.classList.remove('wrapper__menu--menu-opened');
        }
    })

    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;
    let xOffset = 0;
    let yOffset = 0;
    let active = false;

    function dragStart(e: TouchEvent | MouseEvent) {
        if (e instanceof TouchEvent) {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
        if (e.target === $img) {
            active = true;
        }
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        active = false;
    }

    function drag(e: TouchEvent | MouseEvent) {
        if (active) {
            e.preventDefault();
            if (e instanceof TouchEvent) {
                currentX = e.touches[0].clientX - initialX;
                currentY = e.touches[0].clientY - initialY;
            } else {
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
            }
            xOffset = currentX;
            yOffset = currentY;
            $img.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    $imgContainer.addEventListener("touchstart", dragStart, false);
    $imgContainer.addEventListener("touchend", dragEnd, false);
    $imgContainer.addEventListener("touchmove", drag, false);

    $imgContainer.addEventListener("mousedown", dragStart, false);
    $imgContainer.addEventListener("mouseup", dragEnd, false);
    $imgContainer.addEventListener("mousemove", drag, false);

    const $amount = document.querySelector('#amount') as HTMLElement;
    const $fps = document.querySelector('#fps') as HTMLElement;
    const $frameNumber = document.querySelector('#frame-number') as HTMLElement;
    const $viewMode = document.querySelector('#view-mode') as HTMLSelectElement;
    const $narrows = document.querySelector('#chbx-narrows') as HTMLInputElement;
    const $chbxUpdImg = document.querySelector('#chbx-upd-img') as HTMLInputElement;
    document.querySelector('#btn-start')?.addEventListener('click', start);
    document.querySelector('#btn-step')?.addEventListener('click', () => {
        world.step();
        updateImage(world, $viewMode.value, $narrows.checked);
    });
    const $btnPause = document.querySelector('#btn-pause') as HTMLButtonElement;
    $btnPause.addEventListener('click', (e) => {
        switch (paused) {
            case true:
                paused = false;
                break;
            case false:
                paused = true;
                break;
        }
    });
    start();

    let lastLoop = Date.now();
    let fps = 0;
    let paused = false;
    setInterval(() => {
        if (Date.now() - lastLoop > 1000) {
            $fps.innerHTML = fps.toFixed(0);
            fps = 0;
            lastLoop = Date.now();
        }
        fps++;
        if (!paused) world.step();
        if ($chbxUpdImg.checked) {
            updateImage(world, $viewMode.value, $narrows.checked);
            // switch ($viewMode.value) {
            //     case 'normal': world.clearImage(); world.visualize(drawColors); break;
            //     case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
            //     case 'families': world.clearImage(); world.visualize(drawFamilies); break;
            //     case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
            //     case 'last-action': world.clearImage(); world.visualize(drawLastAction); break;
            //     default: break;
            // }
            // if (!($viewMode.value === 'disabled') && $narrows.checked) {
            //     world.drawLayer(getNarrowImg(world));
            // }
        }
        $amount.innerHTML = Bot.amount.toString();
        $frameNumber.innerHTML = `${(world.age / 1000).toFixed(1)} тыс. кадров`;
    });

    // (function step() {
    //     if (Date.now() - lastLoop > 1000) {
    //         $fps.innerHTML = fps.toFixed(0);
    //         fps = 0;
    //         lastLoop = Date.now();
    //     }
    //     fps++;
    //     if (!paused) world.step();
    //     switch ($viewMode.value) {
    //         case 'normal': world.clearImage(); world.visualize(drawColors); break;
    //         case 'energy': world.clearImage(); world.visualize(drawEnergy); break;
    //         case 'families': world.clearImage(); world.visualize(drawFamilies); break;
    //         case 'abilities': world.clearImage(); world.visualize(drawAbilities); break;
    //         case 'last-action': world.clearImage(); world.visualize(drawLastAction); break;
    //         default: break;
    //     }
    //     if (!($viewMode.value === 'disabled') && $narrows.checked) {
    //         world.drawLayer(getNarrowImg(world));
    //     }
    //     $amount.innerHTML = Bot.amount.toString();
    //     $frameNumber.innerHTML = `${(world.age / 1000).toFixed(1)} тыс. кадров`;
    //     setTimeout(step);
    // })();
});