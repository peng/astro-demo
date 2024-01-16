var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { parse, DOCUMENT_NODE, ELEMENT_NODE, TEXT_NODE } from "ultrahtml";
import { createElement, Fragment } from "react";
let ids = 0;
function convert(children) {
  let doc = parse(children.toString().trim());
  let id = ids++;
  let key = 0;
  function createReactElementFromNode(node) {
    const childVnodes = Array.isArray(node.children) && node.children.length ? node.children.map((child) => createReactElementFromNode(child)).filter(Boolean) : void 0;
    if (node.type === DOCUMENT_NODE) {
      return createElement(Fragment, {}, childVnodes);
    } else if (node.type === ELEMENT_NODE) {
      const _a = node.attributes, { class: className } = _a, props = __objRest(_a, ["class"]);
      return createElement(node.name, __spreadProps(__spreadValues({}, props), { className, key: `${id}-${key++}` }), childVnodes);
    } else if (node.type === TEXT_NODE) {
      return node.value.trim() ? node.value : void 0;
    }
  }
  const root = createReactElementFromNode(doc);
  return root.props.children;
}
export {
  convert as default
};
