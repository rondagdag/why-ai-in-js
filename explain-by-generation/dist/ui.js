import{r as x,g as S}from"./vendor.js";function j(e,r){for(var n=0;n<r.length;n++){const o=r[n];if(typeof o!="string"&&!Array.isArray(o)){for(const t in o)if(t!=="default"&&!(t in e)){const i=Object.getOwnPropertyDescriptor(o,t);i&&Object.defineProperty(e,t,i.get?i:{enumerable:!0,get:()=>o[t]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}var _={exports:{}},d={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var R;function O(){if(R)return d;R=1;var e=x(),r=Symbol.for("react.element"),n=Symbol.for("react.fragment"),o=Object.prototype.hasOwnProperty,t=e.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,i={key:!0,ref:!0,__self:!0,__source:!0};function c(a,l,f){var u,p={},m=null,h=null;f!==void 0&&(m=""+f),l.key!==void 0&&(m=""+l.key),l.ref!==void 0&&(h=l.ref);for(u in l)o.call(l,u)&&!i.hasOwnProperty(u)&&(p[u]=l[u]);if(a&&a.defaultProps)for(u in l=a.defaultProps,l)p[u]===void 0&&(p[u]=l[u]);return{$$typeof:r,type:a,key:m,ref:h,props:p,_owner:t.current}}return d.Fragment=n,d.jsx=c,d.jsxs=c,d}var g;function k(){return g||(g=1,_.exports=O()),_.exports}var v=k(),s=x();const L=S(s),P=j({__proto__:null,default:L},[s]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),E=(...e)=>e.filter((r,n,o)=>!!r&&r.trim()!==""&&o.indexOf(r)===n).join(" ").trim();/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var $={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=s.forwardRef(({color:e="currentColor",size:r=24,strokeWidth:n=2,absoluteStrokeWidth:o,className:t="",children:i,iconNode:c,...a},l)=>s.createElement("svg",{ref:l,...$,width:r,height:r,stroke:e,strokeWidth:o?Number(n)*24/Number(r):n,className:E("lucide",t),...a},[...c.map(([f,u])=>s.createElement(f,u)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=(e,r)=>{const n=s.forwardRef(({className:o,...t},i)=>s.createElement(I,{ref:i,iconNode:r,className:E(`lucide-${A(e)}`,o),...t}));return n.displayName=`${e}`,n};/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=b("ChevronDown",[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=b("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);function C(e,r){if(typeof e=="function")return e(r);e!=null&&(e.current=r)}function N(...e){return r=>{let n=!1;const o=e.map(t=>{const i=C(t,r);return!n&&typeof i=="function"&&(n=!0),i});if(n)return()=>{for(let t=0;t<o.length;t++){const i=o[t];typeof i=="function"?i():C(e[t],null)}}}}var D=Symbol.for("react.lazy"),y=P[" use ".trim().toString()];function T(e){return typeof e=="object"&&e!==null&&"then"in e}function w(e){return e!=null&&typeof e=="object"&&"$$typeof"in e&&e.$$typeof===D&&"_payload"in e&&T(e._payload)}function q(e){const r=W(e),n=s.forwardRef((o,t)=>{let{children:i,...c}=o;w(i)&&typeof y=="function"&&(i=y(i._payload));const a=s.Children.toArray(i),l=a.find(B);if(l){const f=l.props.children,u=a.map(p=>p===l?s.Children.count(f)>1?s.Children.only(null):s.isValidElement(f)?f.props.children:null:p);return v.jsx(r,{...c,ref:t,children:s.isValidElement(f)?s.cloneElement(f,void 0,u):null})}return v.jsx(r,{...c,ref:t,children:i})});return n.displayName=`${e}.Slot`,n}var Z=q("Slot");function W(e){const r=s.forwardRef((n,o)=>{let{children:t,...i}=n;if(w(t)&&typeof y=="function"&&(t=y(t._payload)),s.isValidElement(t)){const c=J(t),a=F(i,t.props);return t.type!==s.Fragment&&(a.ref=o?N(o,c):c),s.cloneElement(t,a)}return s.Children.count(t)>1?s.Children.only(null):null});return r.displayName=`${e}.SlotClone`,r}var V=Symbol("radix.slottable");function B(e){return s.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===V}function F(e,r){const n={...r};for(const o in r){const t=e[o],i=r[o];/^on[A-Z]/.test(o)?t&&i?n[o]=(...a)=>{const l=i(...a);return t(...a),l}:t&&(n[o]=t):o==="style"?n[o]={...t,...i}:o==="className"&&(n[o]=[t,i].filter(Boolean).join(" "))}return{...e,...n}}function J(e){let r=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,n=r&&"isReactWarning"in r&&r.isReactWarning;return n?e.ref:(r=Object.getOwnPropertyDescriptor(e,"ref")?.get,n=r&&"isReactWarning"in r&&r.isReactWarning,n?e.props.ref:e.props.ref||e.ref)}export{H as C,Y as R,Z as S,v as j,s as r};
