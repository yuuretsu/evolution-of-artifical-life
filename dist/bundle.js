(()=>{"use strict";var e={184:function(e,t,n){var r,o=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)}),i=this&&this.__assign||function(){return(i=Object.assign||function(e){for(var t,n=1,r=arguments.length;n<r;n++)for(var o in t=arguments[n])Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o]);return e}).apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0}),t.Genome=t.DeadBot=void 0;var a=n(571),c=n(240),s=n(439),l=n(812),u=function(e){function t(n,r,o,i,c,l,u,h){var d=e.call(this,n,r,o,i)||this;return d.energy=c,d.genome=l,d.family=u,d.abilities=h,t.amount++,d._narrow=s.randInt(0,8),d.age=0,d.lastAction={name:"none",color:new a.Rgba(20,20,20,255)},d}return o(t,e),Object.defineProperty(t.prototype,"narrow",{get:function(){return this._narrow},set:function(e){this._narrow=s.fixNumber(0,8,e)},enumerable:!1,configurable:!0}),t.prototype.narrowToCoords=function(){var e=this.x+l.MOORE_NEIGHBOURHOOD[this.narrow][0],t=this.y+l.MOORE_NEIGHBOURHOOD[this.narrow][1];return this.world.fixCoords(e,t)},t.prototype.getForvard=function(){var e,t=this.narrowToCoords();return{block:(e=this.world).get.apply(e,t),coords:t}},t.prototype.moveTo=function(e,t){this.world.swap(this.x,this.y,e,t)},t.prototype.multiplyTo=function(e,n){new t(this.world,e,n,this.color.interpolate(new a.Rgba(255,255,255,255),.25),this.energy/3,this.genome.replication(),this.family.mutateRgb(10),i({},this.abilities)),this.energy/=3},t.prototype.randMove=function(){var e=this.world.fixCoords(this.x+s.randInt(-1,2),this.y+s.randInt(-1,2));this.moveTo.apply(this,e)},t.prototype.onStep=function(){this.energy<1||this.energy>100||this.age>2e3?this.alive=!1:(this.genome.doAction(this),this.energy-=.1,this.age+=1)},t.prototype.onDie=function(){t.amount--},t.amount=0,t}(l.DynamicBlock);t.default=u;var h=function(e){function t(t){var n=e.call(this,t.world,t.x,t.y,t.color.interpolate(new a.Rgba(0,0,0,255),.5))||this;return n.age=0,n}return o(t,e),t.prototype.onStep=function(){this.age>500&&(this.alive=!1),this.color=this.color.interpolate(new a.Rgba(10,10,50,255),.005),this.age++},t}(l.DynamicBlock);t.DeadBot=h;var d=function(){function e(e){this.length=e,this.genes=[],this._pointer=0}return Object.defineProperty(e.prototype,"pointer",{get:function(){return this._pointer},set:function(e){this._pointer=s.fixNumber(0,this.length,e)},enumerable:!1,configurable:!0}),e.prototype.randGene=function(){return{action:s.randChoice(e.genePool),property:Math.random(),branches:[s.randInt(0,this.length),s.randInt(0,this.length),s.randInt(0,this.length),s.randInt(0,this.length)]}},e.prototype.mutateGene=function(t){var n=this;return{action:Math.random()>.9?s.randChoice(e.genePool):t.action,property:s.limNumber(0,1,t.property+s.randFloat(-.01,.01)),branches:t.branches.map((function(e){return Math.random()>.9?s.randInt(0,n.length):e}))}},e.prototype.fillRandom=function(e){void 0===e&&(e=0);for(var t=e;t<this.length;t++)this.genes[t]=this.randGene();return this},e.prototype.replication=function(){for(var t=new e(this.length),n=0;n<this.length;n++)t.genes[n]=Math.random()>.995?this.mutateGene(this.genes[n]):this.genes[n];return t},e.prototype.doAction=function(e){for(var t=0;t<20;t++){var n=this.genes[this.pointer],r=n.action(e,n.property,n.branches);if(r.goto?this.pointer=r.goto:this.pointer++,r.completed)return}e.lastAction={name:"view-do-nothing",color:new a.Rgba(50,50,50,255)},e.color=e.color.interpolate(new a.Rgba(100,100,100,255),.1)},e.genePool=c.createGenePool(c.getAllGenesNames()),e}();t.Genome=d},240:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GENES=t.getAllGenesNames=t.createGenePool=void 0;var r=n(184),o=n(571);t.createGenePool=function(e){for(var n=[],r=0,o=e;r<o.length;r++){var i=o[r];n.push(t.GENES[i])}return n},t.getAllGenesNames=function(){return Object.keys(t.GENES)},t.GENES={restart:function(e,t,n){return{completed:!1,goto:0}},photosynthesis:function(e,t,n){return e.energy+=.5*Math.pow(e.abilities.photo,2),e.abilities.photo=Math.min(1,e.abilities.photo+.01),e.abilities.attack=Math.max(0,e.abilities.attack-.01),e.color=e.color.interpolate(new o.Rgba(0,255,0,255),.01),e.lastAction={name:"view-photosynthesis",color:new o.Rgba(0,200,0,255)},{completed:!0}},rotate:function(e,t,n){return t>.5?e.narrow++:e.narrow--,{completed:!1}},multiply:function(e,t,n){var r=e.getForvard();return!r.block&&e.age>2&&(e.multiplyTo.apply(e,r.coords),e.lastAction={name:"view-multiply",color:new o.Rgba(0,0,200,255)}),{completed:!0}},"share-energy":function(e,t,n){e.color=e.color.interpolate(new o.Rgba(0,0,255,255),.005);var i=e.getForvard();if(i.block instanceof r.default&&i.block.energy<e.energy){var a=(i.block.energy+e.energy)/2;e.energy=a,i.block.energy=a,e.lastAction={name:"view-share-energy",color:new o.Rgba(0,150,150,255)}}return{completed:!0}},move:function(e,t,n){var r=e.getForvard();return r.block||e.moveTo.apply(e,r.coords),e.lastAction={name:"view-move",color:new o.Rgba(150,150,150,255)},{completed:!0}},attack:function(e,t,n){e.energy-=.1,e.color=e.color.interpolate(new o.Rgba(255,0,0,255),.01),e.abilities.attack=Math.min(1,e.abilities.attack+.01),e.abilities.photo=Math.max(0,e.abilities.photo-.01);var i=e.getForvard();if(i.block instanceof r.default){var a=i.block.energy/2*Math.pow(e.abilities.attack,2);i.block.energy-=i.block.energy/2,e.energy+=a,e.lastAction={name:"view-attack",color:new o.Rgba(200,0,0,255)}}return{completed:!0}},"look-forward":function(e,t,n){var o=e.getForvard();return o.block instanceof r.default?o.block.family.difference(e.color)<t?{completed:!1,goto:n[0]}:{completed:!1,goto:n[1]}:o.block instanceof r.DeadBot?{completed:!1,goto:n[2]}:{completed:!1,goto:n[3]}},"check-energy":function(e,t,n){return e.energy/100<t?{completed:!1,goto:n[0]}:{completed:!1,goto:n[1]}},virus:function(e,t,n){e.color=e.color.interpolate(new o.Rgba(255,0,255,255),.01);var i=e.getForvard();return i.block instanceof r.default&&(i.block.genome=e.genome.replication(),e.lastAction={name:"view-virus",color:new o.Rgba(200,0,200,255)}),{completed:!0}}}},140:(e,t,n)=>{Object.defineProperty(t,"__esModule",{value:!0});var r=n(439),o=function(){function e(e,t){this.width=e,this.height=t,this.cells=[];for(var n=0;n<e;n++)this.cells[n]=[]}return e.prototype.get=function(e,t){return this.cells[e][t]},e.prototype.set=function(e,t,n){this.cells[e][t]=n},e.prototype.remove=function(e,t){delete this.cells[e][t]},e.prototype.swap=function(e,t,n,r){var o=this.get(e,t),i=this.get(n,r);this.set(e,t,i),this.set(n,r,o)},e.prototype.fixCoords=function(e,t){return[r.fixNumber(0,this.width,e),r.fixNumber(0,this.height,t)]},e.prototype.randCoords=function(){return[r.randInt(0,this.width),r.randInt(0,this.height)]},e.prototype.randEmpty=function(){var e;do{e=this.randCoords()}while(this.get.apply(this,e));return e},e}();t.default=o},571:function(e,t,n){var r,o=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.PixelsData=t.Canvas=t.Rgba=void 0;var i=n(439),a=function(){function e(e,t,n,r){this.red=e,this.green=t,this.blue=n,this.alpha=r}return e.randRgb=function(){return new e(i.randInt(0,256),i.randInt(0,256),i.randInt(0,256),255)},e.prototype.interpolate=function(t,n){return new e(i.interpolate(this.red,t.red,n),i.interpolate(this.green,t.green,n),i.interpolate(this.blue,t.blue,n),i.interpolate(this.alpha,t.alpha,n))},e.prototype.normalise=function(){return new e(i.limNumber(0,255,this.red),i.limNumber(0,255,this.green),i.limNumber(0,255,this.blue),i.limNumber(0,255,this.alpha))},e.prototype.mutateRgb=function(t){return new e(this.red+i.randFloat(-t,t),this.green+i.randFloat(-t,t),this.blue+i.randFloat(-t,t),this.alpha).normalise()},e.prototype.difference=function(t){return(Math.abs(this.red-t.red)+Math.abs(this.green-t.green)+Math.abs(this.blue-t.blue)+Math.abs(this.alpha-t.alpha))/e.MAX_DIF},e.MAX_DIF=1020,e}();t.Rgba=a;var c=function(e,t,n){this.node=n||document.createElement("canvas"),this.node.width=e,this.node.height=t,this.ctx=this.node.getContext("2d")};t.Canvas=c;var s=function(e){function t(t,n,r){var o=e.call(this,t,n,r)||this;return o.data=o.ctx.createImageData(o.node.width,o.node.height),o}return o(t,e),t.prototype.setPixel=function(e,t,n){var r=4*(t*this.data.width+e);this.data.data[r]=n.red,this.data.data[r+1]=n.green,this.data.data[r+2]=n.blue,this.data.data[r+3]=n.alpha},t.prototype.update=function(){return this.ctx.putImageData(this.data,0,0),this},t}(c);t.PixelsData=s},439:function(e,t){var n=this&&this.__generator||function(e,t){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!((o=(o=a.trys).length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=t.call(e,a)}catch(e){i=[6,e],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}};function r(e,t){return Math.random()*(t-e)+e}function o(e,t){return Math.floor(r(e,t))}Object.defineProperty(t,"__esModule",{value:!0}),t.interpolate=t.limNumber=t.normalizeNumber=t.fixNumber=t.randChoice=t.randInt=t.randFloat=t.range=void 0,t.range=function(e,t){return n(this,(function(n){switch(n.label){case 0:return e<t?[4,e++]:[3,2];case 1:return n.sent(),[3,0];case 2:return[2]}}))},t.randFloat=r,t.randInt=o,t.randChoice=function(e){return e[o(0,e.length)]},t.fixNumber=function(e,t,n){return n>=e?n%t:t- -n%t},t.normalizeNumber=function(e,t,n){return(n-e)/(t-e)},t.limNumber=function(e,t,n){return Math.max(Math.min(n,t),e)},t.interpolate=function(e,t,n){return e+(t-e)*n}},903:function(e,t,n){var r=this&&this.__spreadArrays||function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),o=0;for(t=0;t<n;t++)for(var i=arguments[t],a=0,c=i.length;a<c;a++,o++)r[o]=i[a];return r};Object.defineProperty(t,"__esModule",{value:!0}),t.getNarrowImg=t.drawLastAction=t.drawAges=t.drawFamilies=t.drawAbilities=t.drawEnergy=t.drawColors=void 0;var o=n(184),i=n(571),a=n(439),c=n(812);t.drawColors=function(e){return e instanceof c.Block?e.color:null},t.drawEnergy=function(e){return function(t){return t instanceof o.default?new i.Rgba(0,0,50,255).interpolate(new i.Rgba(255,255,0,255),t.energy/e):null}},t.drawAbilities=function(e){return e instanceof o.default?new i.Rgba(255*a.normalizeNumber(.5,1,e.abilities.attack),255*a.normalizeNumber(.5,1,e.abilities.photo),50,255):null},t.drawFamilies=function(e){return e instanceof o.default?e.family:null},t.drawAges=function(e){return e instanceof o.default?new i.Rgba(150,150,150,255).interpolate(new i.Rgba(0,0,100,255),e.age/2e3):null},t.drawLastAction=function(e){return function(t){return t instanceof o.default?e[t.lastAction.name]?t.lastAction.color:new i.Rgba(20,20,20,255):null}},t.getNarrowImg=function(e){for(var t=new i.PixelsData(3*e.width,3*e.height),n=0;n<e.width;n++)for(var a=0;a<e.height;a++){var s=e.get(n,a);if(s instanceof o.default){var l=[3*s.x+1+c.MOORE_NEIGHBOURHOOD[s.narrow][0],3*s.y+1+c.MOORE_NEIGHBOURHOOD[s.narrow][1]];t.setPixel.apply(t,r(l,[new i.Rgba(0,0,0,127)]))}}return t.update(),t.node}},812:function(e,t,n){var r,o=this&&this.__extends||(r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n])})(e,t)},function(e,t){function n(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)});Object.defineProperty(t,"__esModule",{value:!0}),t.World=t.DynamicBlock=t.Block=t.MOORE_NEIGHBOURHOOD=void 0;var i=n(571),a=n(140),c=n(439);t.MOORE_NEIGHBOURHOOD=[[-1,-1],[0,-1],[1,-1],[1,0],[1,1],[0,1],[-1,1],[-1,0]];var s=function(e,t,n,r){this.world=e,this.x=t,this.y=n,this.color=r,e.set(t,n,this)};t.Block=s;var l=function(e){function t(t,n,r,o){var i=e.call(this,t,n,r,o)||this;return t.assign(i),i.alive=!0,i}return o(t,e),t.prototype.onStep=function(){},t.prototype.onDie=function(){},t}(s);t.DynamicBlock=l;var u=function(e){function t(t,n,r,o){var a=e.call(this,t,n)||this;return a.width=t,a.height=n,a.img=new i.Canvas(t*r,n*r,o),a.img.ctx.imageSmoothingEnabled=!1,a.dynamic={a:{},b:{}},a.age=0,a}return o(t,e),t.prototype.set=function(t,n,r){e.prototype.set.call(this,t,n,r),r&&(r.x=t,r.y=n)},t.prototype.drawLayer=function(e){this.img.ctx.drawImage(e,0,0,this.img.node.width,this.img.node.height)},t.prototype.clearImage=function(){this.img.ctx.clearRect(0,0,this.img.node.width,this.img.node.height)},t.prototype.visualize=function(e){for(var t=new i.PixelsData(this.width,this.height),n=0;n<this.width;n++)for(var r=0;r<this.height;r++){var o=e(this.get(n,r),n,r);o&&t.setPixel(n,r,o)}this.drawLayer(t.update().node)},t.prototype.assign=function(e){var t;do{t=c.randInt(0,this.width*this.height*1e3)}while(this.dynamic.a[t]);this.dynamic.a[t]=e},t.prototype.init=function(){this.dynamic.b=this.dynamic.a},t.prototype.step=function(){for(var e in this.dynamic.a={},this.dynamic.b){var t=this.dynamic.b[e];t.alive?(t.onStep(),this.assign(t)):(this.set(t.x,t.y,void 0),t.onDie())}this.dynamic.b=this.dynamic.a,this.age++},t}(a.default);t.World=u},519:function(e,t,n){var r=this&&this.__spreadArrays||function(){for(var e=0,t=0,n=arguments.length;t<n;t++)e+=arguments[t].length;var r=Array(e),o=0;for(t=0;t<n;t++)for(var i=arguments[t],a=0,c=i.length;a<c;a++,o++)r[o]=i[a];return r};Object.defineProperty(t,"__esModule",{value:!0});var o=n(184),i=n(571),a=n(240),c=n(439),s=n(903),l=n(812);window.addEventListener("load",(function(){var e,t,n,u,h,d,p,f,g;function m(){document.querySelector(".wrapper").style.maxHeight=window.innerHeight+"px"}function v(){o.default.amount=0,o.Genome.genePool=C(),u=new l.World(parseInt(H.value),parseInt(T.value),parseInt(z.value),I);for(var e=parseInt(U.value),t=0;t<Math.min(u.width*u.height,e);t++)new(o.default.bind.apply(o.default,r([void 0,u],u.randEmpty(),[new i.Rgba(100,100,100,255),100,new o.Genome(64).fillRandom(),i.Rgba.randRgb(),{photo:.5,attack:.5}])));u.init(),w(),b(),I.style.transform="none",h={world:u,botsAmount:o.default.amount,imgOffset:{x:0,y:0},genePool:r(o.Genome.genePool)},console.log(h)}function y(){Date.now()-X>1e3&&(M.innerText=Y.toFixed(0),Y=0,X=Date.now()),Y++,u.step(),q.checked&&w(),b()}function b(){A.innerHTML=o.default.amount.toString(),S.innerHTML=""+(u.age/1e3).toFixed(1)}function w(){switch(u.clearImage(),N.value){case"normal":u.visualize(s.drawColors);break;case"energy":u.visualize(s.drawEnergy(parseInt(D.value)));break;case"ages":u.visualize(s.drawAges);break;case"families":u.visualize(s.drawFamilies);break;case"abilities":u.visualize(s.drawAbilities);break;case"action":u.visualize(s.drawLastAction(P))}j.checked&&u.drawLayer(s.getNarrowImg(u))}function _(){F.checked?(clearInterval(W),q.checked=!1,q.disabled=!0,M.innerText="0 (пауза)",F.nextElementSibling.innerText="Продолжить"):(W=setInterval(y),q.checked=!0,q.disabled=!1,F.nextElementSibling.innerText="Пауза")}function x(e){e instanceof TouchEvent?(f=e.touches[0].clientX-h.imgOffset.x,g=e.touches[0].clientY-h.imgOffset.y):(f=e.clientX-h.imgOffset.x,g=e.clientY-h.imgOffset.y),e.target===I&&(E=!0)}function O(){f=d,g=p,E=!1}function k(e){E&&(e.preventDefault(),e instanceof TouchEvent?(d=e.touches[0].clientX-f,p=e.touches[0].clientY-g):(d=e.clientX-f,p=e.clientY-g),h.imgOffset.x=d,h.imgOffset.y=p,I.style.transform="translate3d("+d+"px, "+p+"px, 0)")}window.addEventListener("resize",m),m();var E=!1,R=document.querySelector("#img-container");R.addEventListener("touchstart",x,!1),R.addEventListener("touchend",O,!1),R.addEventListener("touchmove",k,!1),R.addEventListener("mousedown",x,!1),R.addEventListener("mouseup",O,!1),R.addEventListener("mousemove",k,!1);var I=document.querySelector("#img");null===(e=document.querySelector("#btn-menu"))||void 0===e||e.addEventListener("change",(function(e){var t,n;e.target.checked?(R.classList.add("img-wrapper--menu-opened"),null===(t=document.querySelector("#menu"))||void 0===t||t.classList.add("wrapper__menu--menu-opened")):(R.classList.remove("img-wrapper--menu-opened"),null===(n=document.querySelector("#menu"))||void 0===n||n.classList.remove("wrapper__menu--menu-opened"))}));var A=document.querySelector("#amount"),S=document.querySelector("#frame-number"),M=document.querySelector("#fps"),N=document.querySelector("#view-mode");N.addEventListener("change",(function(){var e=document.querySelector("#view-modes-options");Array.from(e.children).forEach((function(e){e.id==="view-"+N.value+"-options"?e.classList.remove("hidden"):e.classList.add("hidden")})),w()}));var P={"view-photosynthesis":!1,"view-attack":!1,"view-multiply":!1,"view-share-energy":!1,"view-move":!1,"view-do-nothing":!1,"view-virus":!1},L=[];for(var G in P)L.push("#"+G);document.querySelectorAll(L.join(",")).forEach((function(e){var t=e;t.addEventListener("change",(function(){P[t.id]=t.checked,w()}))}));var D=document.querySelector("#view-energy-divider");D.addEventListener("input",w);var q=document.querySelector("#chbx-upd-img"),j=document.querySelector("#chbx-narrows");j.addEventListener("change",w);var F=document.querySelector("#chbx-pause");function C(){for(var e=[],t=0,n=a.getAllGenesNames();t<n.length;t++){var r=n[t];document.querySelector("#chbx-gene-"+r).checked&&e.push(r)}return console.log(e),a.createGenePool(e)}F.addEventListener("input",_),null===(t=document.querySelector("#btn-step"))||void 0===t||t.addEventListener("click",(function(){F.checked=!0,_(),u.step(),w()}));var B=a.getAllGenesNames().map((function(e){return"#chbx-gene-"+e})).join(", ");document.querySelectorAll(B).forEach((function(e){e.addEventListener("change",(function(){h.genePool=C(),o.Genome.genePool=C()}))}));var H=document.querySelector("#input-width"),T=document.querySelector("#input-height"),z=document.querySelector("#input-pixel");document.querySelectorAll("#input-width, #input-height, #input-pixel").forEach((function(e){e.addEventListener("change",(function(e){var t=e.target;t.value=(c.limNumber(parseInt(t.min),parseInt(t.max),parseInt(t.value))||parseInt(t.min)).toString()}))}));var U=document.querySelector("#input-bots");null===(n=document.querySelector("#btn-start"))||void 0===n||n.addEventListener("click",v),v();var X=Date.now(),Y=0,W=setInterval(y)}))}},t={};!function n(r){if(t[r])return t[r].exports;var o=t[r]={exports:{}};return e[r].call(o.exports,o,o.exports,n),o.exports}(519)})();
//# sourceMappingURL=bundle.js.map