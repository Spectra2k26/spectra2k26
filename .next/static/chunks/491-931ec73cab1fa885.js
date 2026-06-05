"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[491],{78030:function(e,t,n){n.d(t,{Z:function(){return u}});var r=n(2265);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),i=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.filter((e,t,n)=>!!e&&n.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var l={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let s=(0,r.forwardRef)((e,t)=>{let{color:n="currentColor",size:o=24,strokeWidth:s=2,absoluteStrokeWidth:u,className:a="",children:c,iconNode:h,...d}=e;return(0,r.createElement)("svg",{ref:t,...l,width:o,height:o,stroke:n,strokeWidth:u?24*Number(s)/Number(o):s,className:i("lucide",a),...d},[...h.map(e=>{let[t,n]=e;return(0,r.createElement)(t,n)}),...Array.isArray(c)?c:[c]])}),u=(e,t)=>{let n=(0,r.forwardRef)((n,l)=>{let{className:u,...a}=n;return(0,r.createElement)(s,{ref:l,iconNode:t,className:i("lucide-".concat(o(e)),u),...a})});return n.displayName="".concat(e),n}},24241:function(e,t,n){n.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,n(78030).Z)("Calendar",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]])},92940:function(e,t,n){n.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,n(78030).Z)("CircleCheckBig",[["path",{d:"M22 11.08V12a10 10 0 1 1-5.93-9.14",key:"g774vq"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]])},92513:function(e,t,n){n.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,n(78030).Z)("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]])},10883:function(e,t,n){n.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,n(78030).Z)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]])},85016:function(e,t,n){n.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,n(78030).Z)("Trophy",[["path",{d:"M6 9H4.5a2.5 2.5 0 0 1 0-5H6",key:"17hqa7"}],["path",{d:"M18 9h1.5a2.5 2.5 0 0 0 0-5H18",key:"lmptdp"}],["path",{d:"M4 22h16",key:"57wxv0"}],["path",{d:"M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22",key:"1nw9bq"}],["path",{d:"M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22",key:"1np0yb"}],["path",{d:"M18 2H6v7a6 6 0 0 0 12 0V2Z",key:"u46fv3"}]])},34446:function(e,t,n){n.d(t,{M:function(){return k}});var r=n(57437),o=n(2265),i=n(5050),l=n(30458),s=n(67797),u=n(29791);class a extends o.Component{getSnapshotBeforeUpdate(e){let t=this.props.childRef.current;if(t&&e.isPresent&&!this.props.isPresent){let e=this.props.sizeRef.current;e.height=t.offsetHeight||0,e.width=t.offsetWidth||0,e.top=t.offsetTop,e.left=t.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function c(e){let{children:t,isPresent:n}=e,i=(0,o.useId)(),l=(0,o.useRef)(null),s=(0,o.useRef)({width:0,height:0,top:0,left:0}),{nonce:c}=(0,o.useContext)(u._);return(0,o.useInsertionEffect)(()=>{let{width:e,height:t,top:r,left:o}=s.current;if(n||!l.current||!e||!t)return;l.current.dataset.motionPopId=i;let u=document.createElement("style");return c&&(u.nonce=c),document.head.appendChild(u),u.sheet&&u.sheet.insertRule('\n          [data-motion-pop-id="'.concat(i,'"] {\n            position: absolute !important;\n            width: ').concat(e,"px !important;\n            height: ").concat(t,"px !important;\n            top: ").concat(r,"px !important;\n            left: ").concat(o,"px !important;\n          }\n        ")),()=>{document.head.removeChild(u)}},[n]),(0,r.jsx)(a,{isPresent:n,childRef:l,sizeRef:s,children:o.cloneElement(t,{ref:l})})}let h=e=>{let{children:t,initial:n,isPresent:i,onExitComplete:u,custom:a,presenceAffectsLayout:h,mode:p}=e,f=(0,l.h)(d),m=(0,o.useId)(),y=(0,o.useCallback)(e=>{for(let t of(f.set(e,!0),f.values()))if(!t)return;u&&u()},[f,u]),k=(0,o.useMemo)(()=>({id:m,initial:n,isPresent:i,custom:a,onExitComplete:y,register:e=>(f.set(e,!1),()=>f.delete(e))}),h?[Math.random(),y]:[i,y]);return(0,o.useMemo)(()=>{f.forEach((e,t)=>f.set(t,!1))},[i]),o.useEffect(()=>{i||f.size||!u||u()},[i]),"popLayout"===p&&(t=(0,r.jsx)(c,{isPresent:i,children:t})),(0,r.jsx)(s.O.Provider,{value:k,children:t})};function d(){return new Map}var p=n(73241);let f=e=>e.key||"";function m(e){let t=[];return o.Children.forEach(e,e=>{(0,o.isValidElement)(e)&&t.push(e)}),t}var y=n(9033);let k=e=>{let{children:t,custom:n,initial:s=!0,onExitComplete:u,presenceAffectsLayout:a=!0,mode:c="sync",propagate:d=!1}=e,[k,v]=(0,p.oO)(d),x=(0,o.useMemo)(()=>m(t),[t]),g=d&&!k?[]:x.map(f),w=(0,o.useRef)(!0),M=(0,o.useRef)(x),C=(0,l.h)(()=>new Map),[E,Z]=(0,o.useState)(x),[R,j]=(0,o.useState)(x);(0,y.L)(()=>{w.current=!1,M.current=x;for(let e=0;e<R.length;e++){let t=f(R[e]);g.includes(t)?C.delete(t):!0!==C.get(t)&&C.set(t,!1)}},[R,g.length,g.join("-")]);let b=[];if(x!==E){let e=[...x];for(let t=0;t<R.length;t++){let n=R[t],r=f(n);g.includes(r)||(e.splice(t,0,n),b.push(n))}"wait"===c&&b.length&&(e=b),j(m(e)),Z(x);return}let{forceRender:L}=(0,o.useContext)(i.p);return(0,r.jsx)(r.Fragment,{children:R.map(e=>{let t=f(e),o=(!d||!!k)&&(x===R||g.includes(t));return(0,r.jsx)(h,{isPresent:o,initial:(!w.current||!!s)&&void 0,custom:o?void 0:n,presenceAffectsLayout:a,mode:c,onExitComplete:o?void 0:()=>{if(!C.has(t))return;C.set(t,!0);let e=!0;C.forEach(t=>{t||(e=!1)}),e&&(null==L||L(),j(M.current),d&&(null==v||v()),u&&u())},children:e},t)})})}}}]);