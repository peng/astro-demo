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
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import React, { createElement } from "react";
import ReactDOM from "react-dom/server";
import { defineComponent, h, createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
const StaticHtml$1 = ({ value, name, hydrate = true }) => {
  if (!value)
    return null;
  const tagName = hydrate ? "astro-slot" : "astro-static-slot";
  return createElement(tagName, {
    name,
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: { __html: value }
  });
};
StaticHtml$1.shouldComponentUpdate = () => false;
const contexts = /* @__PURE__ */ new WeakMap();
const ID_PREFIX = "r";
function getContext(rendererContextResult) {
  if (contexts.has(rendererContextResult)) {
    return contexts.get(rendererContextResult);
  }
  const ctx = {
    currentIndex: 0,
    get id() {
      return ID_PREFIX + this.currentIndex.toString();
    }
  };
  contexts.set(rendererContextResult, ctx);
  return ctx;
}
function incrementId(rendererContextResult) {
  const ctx = getContext(rendererContextResult);
  const id = ctx.id;
  ctx.currentIndex++;
  return id;
}
const opts = {
  experimentalReactChildren: false
};
const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase());
const reactTypeof = Symbol.for("react.element");
function errorIsComingFromPreactComponent(err) {
  return err.message && (err.message.startsWith("Cannot read property '__H'") || err.message.includes("(reading '__H')"));
}
function check$1(Component, props, children) {
  return __async(this, null, function* () {
    if (typeof Component === "object") {
      return Component["$$typeof"].toString().slice("Symbol(".length).startsWith("react");
    }
    if (typeof Component !== "function")
      return false;
    if (Component.name === "QwikComponent")
      return false;
    if (typeof Component === "function" && Component["$$typeof"] === Symbol.for("react.forward_ref"))
      return false;
    if (Component.prototype != null && typeof Component.prototype.render === "function") {
      return React.Component.isPrototypeOf(Component) || React.PureComponent.isPrototypeOf(Component);
    }
    let error = null;
    let isReactComponent = false;
    function Tester(...args) {
      try {
        const vnode = Component(...args);
        if (vnode && vnode["$$typeof"] === reactTypeof) {
          isReactComponent = true;
        }
      } catch (err) {
        if (!errorIsComingFromPreactComponent(err)) {
          error = err;
        }
      }
      return React.createElement("div");
    }
    yield renderToStaticMarkup$1(Tester, props, children, {});
    if (error) {
      throw error;
    }
    return isReactComponent;
  });
}
function getNodeWritable() {
  return __async(this, null, function* () {
    let nodeStreamBuiltinModuleName = "node:stream";
    let { Writable } = yield import(
      /* @vite-ignore */
      nodeStreamBuiltinModuleName
    );
    return Writable;
  });
}
function needsHydration(metadata) {
  return metadata.astroStaticSlot ? !!metadata.hydrate : true;
}
function renderToStaticMarkup$1(Component, props, _a, metadata) {
  return __async(this, null, function* () {
    var _b = _a, { default: children } = _b, slotted = __objRest(_b, ["default"]);
    let prefix;
    if (this && this.result) {
      prefix = incrementId(this.result);
    }
    const attrs = { prefix };
    delete props["class"];
    const slots = {};
    for (const [key, value] of Object.entries(slotted)) {
      const name = slotName(key);
      slots[name] = React.createElement(StaticHtml$1, {
        hydrate: needsHydration(metadata),
        value,
        name
      });
    }
    const newProps = __spreadValues(__spreadValues({}, props), slots);
    const newChildren = children != null ? children : props.children;
    if (children && opts.experimentalReactChildren) {
      attrs["data-react-children"] = true;
      const convert = yield import("./chunks/vnode-children_VnAql7PQ.mjs").then((mod) => mod.default);
      newProps.children = convert(children);
    } else if (newChildren != null) {
      newProps.children = React.createElement(StaticHtml$1, {
        hydrate: needsHydration(metadata),
        value: newChildren
      });
    }
    const vnode = React.createElement(Component, newProps);
    const renderOptions = {
      identifierPrefix: prefix
    };
    let html;
    if (metadata == null ? void 0 : metadata.hydrate) {
      if ("renderToReadableStream" in ReactDOM) {
        html = yield renderToReadableStreamAsync(vnode, renderOptions);
      } else {
        html = yield renderToPipeableStreamAsync(vnode, renderOptions);
      }
    } else {
      if ("renderToReadableStream" in ReactDOM) {
        html = yield renderToReadableStreamAsync(vnode, renderOptions);
      } else {
        html = yield renderToStaticNodeStreamAsync(vnode, renderOptions);
      }
    }
    return { html, attrs };
  });
}
function renderToPipeableStreamAsync(vnode, options) {
  return __async(this, null, function* () {
    const Writable = yield getNodeWritable();
    let html = "";
    return new Promise((resolve, reject) => {
      let error = void 0;
      let stream = ReactDOM.renderToPipeableStream(vnode, __spreadProps(__spreadValues({}, options), {
        onError(err) {
          error = err;
          reject(error);
        },
        onAllReady() {
          stream.pipe(
            new Writable({
              write(chunk, _encoding, callback) {
                html += chunk.toString("utf-8");
                callback();
              },
              destroy() {
                resolve(html);
              }
            })
          );
        }
      }));
    });
  });
}
function renderToStaticNodeStreamAsync(vnode, options) {
  return __async(this, null, function* () {
    const Writable = yield getNodeWritable();
    let html = "";
    return new Promise((resolve, reject) => {
      let stream = ReactDOM.renderToStaticNodeStream(vnode, options);
      stream.on("error", (err) => {
        reject(err);
      });
      stream.pipe(
        new Writable({
          write(chunk, _encoding, callback) {
            html += chunk.toString("utf-8");
            callback();
          },
          destroy() {
            resolve(html);
          }
        })
      );
    });
  });
}
function readResult(stream) {
  return __async(this, null, function* () {
    const reader = stream.getReader();
    let result = "";
    const decoder = new TextDecoder("utf-8");
    while (true) {
      const { done, value } = yield reader.read();
      if (done) {
        if (value) {
          result += decoder.decode(value);
        } else {
          decoder.decode(new Uint8Array());
        }
        return result;
      }
      result += decoder.decode(value, { stream: true });
    }
  });
}
function renderToReadableStreamAsync(vnode, options) {
  return __async(this, null, function* () {
    return yield readResult(yield ReactDOM.renderToReadableStream(vnode, options));
  });
}
const _renderer0 = {
  check: check$1,
  renderToStaticMarkup: renderToStaticMarkup$1,
  supportsAstroStaticSlot: true
};
const setup = () => {
};
const StaticHtml = defineComponent({
  props: {
    value: String,
    name: String,
    hydrate: {
      type: Boolean,
      default: true
    }
  },
  setup({ name, value, hydrate }) {
    if (!value)
      return () => null;
    let tagName = hydrate ? "astro-slot" : "astro-static-slot";
    return () => h(tagName, { name, innerHTML: value });
  }
});
function check(Component) {
  return !!Component["ssrRender"] || !!Component["__ssrInlineRender"];
}
function renderToStaticMarkup(Component, inputProps, slotted, metadata) {
  return __async(this, null, function* () {
    const slots = {};
    const props = __spreadValues({}, inputProps);
    delete props.slot;
    for (const [key, value] of Object.entries(slotted)) {
      slots[key] = () => h(StaticHtml, {
        value,
        name: key === "default" ? void 0 : key,
        // Adjust how this is hydrated only when the version of Astro supports `astroStaticSlot`
        hydrate: metadata.astroStaticSlot ? !!metadata.hydrate : true
      });
    }
    const app = createSSRApp({ render: () => h(Component, props, slots) });
    yield setup();
    const html = yield renderToString(app);
    return { html };
  });
}
const _renderer1 = {
  check,
  renderToStaticMarkup,
  supportsAstroStaticSlot: true
};
const renderers = [Object.assign({ "name": "@astrojs/react", "clientEntrypoint": "@astrojs/react/client.js", "serverEntrypoint": "@astrojs/react/server.js" }, { ssr: _renderer0 }), Object.assign({ "name": "@astrojs/vue", "clientEntrypoint": "@astrojs/vue/client.js", "serverEntrypoint": "@astrojs/vue/server.js" }, { ssr: _renderer1 })];
export {
  renderers
};
