import Bot, { Genome } from "./lib/Bot";
import { Rgba } from "./lib/drawing";
import { ActionFn, createGenePool, GeneName, getAllGenesNames } from "./lib/Gene-templates";
import { limNumber } from "./lib/math-functions";
import {
    drawAbilities,
    drawAges,
    drawColors,
    drawEnergy,
    drawFamilies,
    drawLastAction,
    getNarrowImg
} from "./lib/view-modes";
import { World } from "./lib/world";

window.addEventListener('load', () => {

    type AppState = {
        world: World,
        botsAmount: number,
        imgOffset: { x: number, y: number },
        genePool: ActionFn[],
    };

    function onResizeWindow() {
        (document.querySelector('.wrapper') as HTMLElement)
            .style
            .maxHeight = `${window.innerHeight}px`;
    }

    function startNewWorld() {

        Bot.amount = 0;
        Genome.genePool = getGenePool();

        world = new World(
            parseInt($inputWidth.value),
            parseInt($inputHeight.value),
            parseInt($inputPixel.value),
            $img
        );

        const BOTS_AMOUNT = parseInt($inputBots.value);

        for (let i = 0; i < Math.min(world.width * world.height, BOTS_AMOUNT); i++) {
            new Bot(
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
        updateImage();

        updateHTMLInfo();
        $img.style.transform = 'none';
        appState = {
            world: world,
            botsAmount: Bot.amount,
            imgOffset: { x: 0, y: 0 },
            genePool: [...Genome.genePool]
        }
        console.log(appState);
    }

    function step() {
        if (Date.now() - lastLoop > 1000) {
            $fps.innerText = fps.toFixed(0);
            fps = 0;
            lastLoop = Date.now();
        }
        fps++;
        world.step();
        if ($chbxUpdImg.checked) updateImage();
        updateHTMLInfo();
    }

    function updateHTMLInfo() {
        $amount.innerHTML = Bot.amount.toString();
        $frameNumber.innerHTML = `${(world.age / 1000).toFixed(1)}`;
    }

    function updateImage() {
        world.clearImage();
        switch ($viewMode.value) {
            case 'normal':
                world.visualize(drawColors);
                break;
            case 'energy':
                world.visualize(drawEnergy(parseInt($rangeViewEnergy.value)));
                break;
            case 'ages':
                world.visualize(drawAges);
                break;
            case 'families':
                world.visualize(drawFamilies);
                break;
            case 'abilities':
                world.visualize(drawAbilities);
                break;
            case 'action':
                world.visualize(drawLastAction(viewActionsOptions));
                break;
            default: break;
        }
        if ($chbxNarrows.checked) {
            world.drawLayer(getNarrowImg(world));
        }
    }

    function pauseSimulation() {
        clearInterval(intervalId);
        $chbxUpdImg.checked = false;
        $chbxUpdImg.disabled = true;
        $fps.innerText = '0 (пауза)';
    }

    function continueSimulation() {
        intervalId = setInterval(step);
        $chbxUpdImg.checked = true;
        $chbxUpdImg.disabled = false;
    }

    function onChangePause() {
        if ($chbxPause.checked) {
            pauseSimulation();
            ($chbxPause.nextElementSibling as HTMLElement).innerText = 'Продолжить';
        } else {
            continueSimulation();
            ($chbxPause.nextElementSibling as HTMLElement).innerText = 'Пауза';
        }
    };

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        active = false;
    }

    window.addEventListener('resize', onResizeWindow);

    onResizeWindow();

    let world: World;

    let appState: AppState;

    let currentX: number;
    let currentY: number;
    let initialX: number;
    let initialY: number;
    let active = false;

    const $imgContainer = document.querySelector('#img-container') as HTMLElement;

    // Touch drag
    $imgContainer.addEventListener("touchstart", e => {
        initialX = e.touches[0].clientX - appState.imgOffset.x;
        initialY = e.touches[0].clientY - appState.imgOffset.y;
        if (e.target === $img) {
            active = true;
        }
    });
    $imgContainer.addEventListener("touchmove", e => {
        if (active) {
            e.preventDefault();
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
            appState.imgOffset.x = currentX;
            appState.imgOffset.y = currentY;
            $img.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    });
    $imgContainer.addEventListener("touchend", dragEnd);

    // Mouse drag
    $imgContainer.addEventListener("mousedown", e => {
        initialX = e.clientX - appState.imgOffset.x;
        initialY = e.clientY - appState.imgOffset.y;
        if (e.target === $img) {
            active = true;
        }
    });
    $imgContainer.addEventListener("mousemove", e => {
        if (active) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            appState.imgOffset.x = currentX;
            appState.imgOffset.y = currentY;
            $img.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    });
    $imgContainer.addEventListener("mouseup", dragEnd);

    const $img = document.querySelector('#img') as HTMLCanvasElement;

    document.querySelector('#btn-menu')?.addEventListener('change', event => {
        if ((event.target as HTMLInputElement).checked) {
            $imgContainer.classList.add('img-wrapper--menu-opened');
            document.querySelector('#menu')?.classList.add('wrapper__menu--menu-opened');
        } else {
            $imgContainer.classList.remove('img-wrapper--menu-opened');
            document.querySelector('#menu')?.classList.remove('wrapper__menu--menu-opened');
        }
    });

    const $amount = document.querySelector('#amount') as HTMLElement;
    const $frameNumber = document.querySelector('#frame-number') as HTMLElement;
    const $fps = document.querySelector('#fps') as HTMLElement;

    const $viewMode = document.querySelector('#view-mode') as HTMLSelectElement;
    $viewMode.addEventListener('change', () => {
        const $viewModeOptionsBlock = document
            .querySelector('#view-modes-options') as HTMLElement;
        Array
            .from($viewModeOptionsBlock.children)
            .forEach(element => {
                if (element.id === `view-${$viewMode.value}-options`) {
                    element.classList.remove('hidden');
                } else {
                    element.classList.add('hidden');
                }
            });
        updateImage();
    });

    type viewActionsMode
        = 'view-photosynthesis'
        | 'view-attack'
        | 'view-multiply'
        | 'view-share-energy'
        | 'view-move'
        | 'view-do-nothing'
        | 'view-virus';

    const viewActionsOptions = {
        'view-photosynthesis': false,
        'view-attack': false,
        'view-multiply': false,
        'view-share-energy': false,
        'view-move': false,
        'view-do-nothing': false,
        'view-virus': false,
    };

    const viewActionsOptionsList: string[] = [];
    for (const actionName in viewActionsOptions) {
        viewActionsOptionsList.push(`#${actionName}`);
    }

    document.querySelectorAll(viewActionsOptionsList.join(','))
        .forEach(checkbox => {
            const chbx = checkbox as HTMLInputElement;
            chbx.addEventListener('change', () => {
                viewActionsOptions[chbx.id as viewActionsMode] = chbx.checked;
                updateImage();
            });
        });

    const $rangeViewEnergy = document.querySelector('#view-energy-divider') as HTMLInputElement;
    $rangeViewEnergy.addEventListener('input', updateImage);

    const $chbxUpdImg = document.querySelector('#chbx-upd-img') as HTMLInputElement;

    const $chbxNarrows = document.querySelector('#chbx-narrows') as HTMLInputElement;
    $chbxNarrows.addEventListener('change', updateImage);

    const $chbxPause = document.querySelector('#chbx-pause') as HTMLInputElement;
    $chbxPause.addEventListener('input', onChangePause);

    document.querySelector('#btn-step')?.addEventListener('click', () => {
        $chbxPause.checked = true;
        onChangePause();
        world.step();
        updateImage();
    });


    function getGenePool() {
        const geneNames: GeneName[] = [];
        for (const geneName of getAllGenesNames()) {
            const $chbx = document.querySelector(`#chbx-gene-${geneName}`) as HTMLInputElement;
            // console.log(document.querySelector(`#chbx-gene-${geneName}`), geneName);
            if ($chbx.checked) geneNames.push(geneName);
        }
        console.log(geneNames);
        return createGenePool(geneNames);
    }

    const geneCheckboxesId = getAllGenesNames()
        .map(n => `#chbx-gene-${n}`)
        .join(', ');

    document.querySelectorAll(geneCheckboxesId).forEach(elem => {
        const $chbx = elem as HTMLInputElement;
        $chbx.addEventListener('change', () => {
            appState.genePool = getGenePool();
            Genome.genePool = getGenePool();
        });
    });

    const $inputWidth = document.querySelector('#input-width') as HTMLInputElement;
    const $inputHeight = document.querySelector('#input-height') as HTMLInputElement;
    const $inputPixel = document.querySelector('#input-pixel') as HTMLInputElement;

    // Normalize input values
    document.querySelectorAll(
        '#input-width, #input-height, #input-pixel'
    ).forEach(elem => {
        elem.addEventListener('change', event => {
            const target = event.target as HTMLInputElement;
            target.value = (limNumber(
                parseInt(target.min),
                parseInt(target.max),
                parseInt(target.value)
            ) || parseInt(target.min)).toString();
        })
    });

    const $inputBots = document.querySelector('#input-bots') as HTMLInputElement;

    document.querySelector('#btn-start')?.addEventListener('click', startNewWorld);

    startNewWorld();

    let lastLoop = Date.now();
    let fps = 0;
    let intervalId = setInterval(step);
});