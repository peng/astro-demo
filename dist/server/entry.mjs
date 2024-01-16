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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
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
var _request, _requestValues, _outgoing, _ensureParsed, ensureParsed_fn, _ensureOutgoingMap, ensureOutgoingMap_fn, _parse, parse_fn, _result, _slots, _logger, _onRequest, _hooks, _endpointHandler, _tryRenderRoute, tryRenderRoute_fn, _ssrEndpointHandler, ssrEndpointHandler_fn, _manifest2, _manifestData, _routeDataToRouteInfo, _logger2, _baseWithoutTrailingSlash, _pipeline, _adapterLogger, _renderOptionsDeprecationWarningShown, _createEnvironment, createEnvironment_fn, _getPathnameFromRequest, getPathnameFromRequest_fn, _logRenderOptionsDeprecationWarning, logRenderOptionsDeprecationWarning_fn, _createRenderContext, createRenderContext_fn, _renderError, renderError_fn, _mergeResponses, mergeResponses_fn, _getDefaultStatusCode, getDefaultStatusCode_fn, _getModuleForRoute, getModuleForRoute_fn;
import fs from "node:fs";
import http from "node:http";
import { TLSSocket } from "node:tls";
import { appendForwardSlash as appendForwardSlash$1, joinPaths, trimSlashes, slash, prependForwardSlash, removeTrailingForwardSlash, collapseDuplicateSlashes } from "@astrojs/internal-helpers/path";
import { serialize, parse } from "cookie";
import { l as levels, g as getEventPrefix, L as Logger, A as AstroIntegrationLogger, manifest } from "./manifest_jQ0Xj5i1.mjs";
import "kleur/colors";
import "html-escaper";
import "clsx";
import { A as AstroError, R as ResponseSentError, l as MiddlewareNoDataOrNextCalled, n as MiddlewareNotAResponse, G as GetStaticPathsRequired, o as InvalidGetStaticPathsReturn, p as InvalidGetStaticPathsEntry, q as GetStaticPathsExpectedParams, t as GetStaticPathsInvalidRouteParam, P as PageNumberParamNotFound, N as NoMatchingStaticPathFound, u as PrerenderDynamicEndpointPathCollide, v as LocalsNotAnObject, w as ASTRO_VERSION, C as ClientAddressNotAvailable, S as StaticClientAddressNotAvailable, x as renderEndpoint, y as ReservedSlotName, z as renderSlotToString, B as renderJSX, D as chunkToString, F as CantRenderPage, H as renderPage$1 } from "./chunks/astro_HcNVr-er.mjs";
import buffer from "node:buffer";
import crypto from "node:crypto";
import https from "https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "os";
import send from "send";
import enableDestroy from "server-destroy";
import { renderers } from "./renderers.mjs";
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function toCodes(locales) {
  const codes = [];
  for (const locale of locales) {
    if (typeof locale === "string") {
      codes.push(locale);
    } else {
      for (const code of locale.codes) {
        codes.push(code);
      }
    }
  }
  return codes;
}
const routeDataSymbol = Symbol.for("astro.routeData");
function pathnameHasLocale(pathname, locales) {
  const segments = pathname.split("/");
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function createI18nMiddleware(i18n, base, trailingSlash) {
  if (!i18n) {
    return void 0;
  }
  return (context, next) => __async(this, null, function* () {
    if (!i18n) {
      return yield next();
    }
    const routeData = Reflect.get(context.request, routeDataSymbol);
    if (routeData) {
      if (routeData.type !== "page" && routeData.type !== "fallback") {
        return yield next();
      }
    }
    const url = context.url;
    const { locales, defaultLocale, fallback, routing } = i18n;
    const response = yield next();
    if (response instanceof Response) {
      const pathnameContainsDefaultLocale = url.pathname.includes(`/${defaultLocale}`);
      if (i18n.routing === "prefix-other-locales" && pathnameContainsDefaultLocale) {
        const newLocation = url.pathname.replace(`/${defaultLocale}`, "");
        response.headers.set("Location", newLocation);
        return new Response(null, {
          status: 404,
          headers: response.headers
        });
      } else if (i18n.routing === "prefix-always") {
        if (url.pathname === base + "/" || url.pathname === base) {
          if (trailingSlash === "always") {
            return context.redirect(`${appendForwardSlash$1(joinPaths(base, i18n.defaultLocale))}`);
          } else {
            return context.redirect(`${joinPaths(base, i18n.defaultLocale)}`);
          }
        } else if (!pathnameHasLocale(url.pathname, i18n.locales)) {
          return new Response(null, {
            status: 404,
            headers: response.headers
          });
        }
      }
      if (response.status >= 300 && fallback) {
        const fallbackKeys = i18n.fallback ? Object.keys(i18n.fallback) : [];
        const segments = url.pathname.split("/");
        const urlLocale = segments.find((segment) => {
          for (const locale of locales) {
            if (typeof locale === "string") {
              if (locale === segment) {
                return true;
              }
            } else if (locale.path === segment) {
              return true;
            }
          }
          return false;
        });
        if (urlLocale && fallbackKeys.includes(urlLocale)) {
          const fallbackLocale = fallback[urlLocale];
          const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
          let newPathname;
          if (pathFallbackLocale === defaultLocale && routing === "prefix-other-locales") {
            newPathname = url.pathname.replace(`/${urlLocale}`, ``);
          } else {
            newPathname = url.pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
          }
          return context.redirect(newPathname);
        }
      }
    }
    return response;
  });
}
const i18nPipelineHook = (ctx) => {
  Reflect.set(ctx.request, routeDataSymbol, ctx.route);
};
const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol$2 = Symbol.for("astro.responseSent");
class AstroCookie {
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false")
      return false;
    if (this.value === "0")
      return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  constructor(request) {
    __privateAdd(this, _ensureParsed);
    __privateAdd(this, _ensureOutgoingMap);
    __privateAdd(this, _parse);
    __privateAdd(this, _request, void 0);
    __privateAdd(this, _requestValues, void 0);
    __privateAdd(this, _outgoing, void 0);
    __privateSet(this, _request, request);
    __privateSet(this, _requestValues, null);
    __privateSet(this, _outgoing, null);
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options2) {
    const serializeOptions = {
      expires: DELETED_EXPIRATION
    };
    if (options2 == null ? void 0 : options2.domain) {
      serializeOptions.domain = options2.domain;
    }
    if (options2 == null ? void 0 : options2.path) {
      serializeOptions.path = options2.path;
    }
    __privateMethod(this, _ensureOutgoingMap, ensureOutgoingMap_fn).call(this).set(key, [
      DELETED_VALUE,
      serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options2 = void 0) {
    var _a;
    if ((_a = __privateGet(this, _outgoing)) == null ? void 0 : _a.has(key)) {
      let [serializedValue, , isSetValue] = __privateGet(this, _outgoing).get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const values = __privateMethod(this, _ensureParsed, ensureParsed_fn).call(this, options2);
    if (key in values) {
      const value = values[key];
      return new AstroCookie(value);
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @returns
   */
  has(key, options2 = void 0) {
    var _a;
    if ((_a = __privateGet(this, _outgoing)) == null ? void 0 : _a.has(key)) {
      let [, , isSetValue] = __privateGet(this, _outgoing).get(key);
      return isSetValue;
    }
    const values = __privateMethod(this, _ensureParsed, ensureParsed_fn).call(this, options2);
    return !!values[key];
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options2) {
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options2) {
      Object.assign(serializeOptions, options2);
    }
    __privateMethod(this, _ensureOutgoingMap, ensureOutgoingMap_fn).call(this).set(key, [
      serializedValue,
      serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (__privateGet(this, _request)[responseSentSymbol$2]) {
      throw new AstroError(__spreadValues({}, ResponseSentError));
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (__privateGet(this, _outgoing) == null)
      return;
    for (const [, value] of __privateGet(this, _outgoing)) {
      yield value[1];
    }
  }
}
_request = new WeakMap();
_requestValues = new WeakMap();
_outgoing = new WeakMap();
_ensureParsed = new WeakSet();
ensureParsed_fn = function(options2 = void 0) {
  if (!__privateGet(this, _requestValues)) {
    __privateMethod(this, _parse, parse_fn).call(this, options2);
  }
  if (!__privateGet(this, _requestValues)) {
    __privateSet(this, _requestValues, {});
  }
  return __privateGet(this, _requestValues);
};
_ensureOutgoingMap = new WeakSet();
ensureOutgoingMap_fn = function() {
  if (!__privateGet(this, _outgoing)) {
    __privateSet(this, _outgoing, /* @__PURE__ */ new Map());
  }
  return __privateGet(this, _outgoing);
};
_parse = new WeakSet();
parse_fn = function(options2 = void 0) {
  const raw = __privateGet(this, _request).headers.get("cookie");
  if (!raw) {
    return;
  }
  __privateSet(this, _requestValues, parse(raw, options2));
};
const astroCookiesSymbol = Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function responseHasCookies(response) {
  return Reflect.has(response, astroCookiesSymbol);
}
function getFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.headers()) {
    yield headerValue;
  }
  return [];
}
const consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.log;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};
function callMiddleware(onRequest, apiContext, responseFunction) {
  return __async(this, null, function* () {
    let nextCalled = false;
    let responseFunctionPromise = void 0;
    const next = () => __async(this, null, function* () {
      nextCalled = true;
      responseFunctionPromise = responseFunction();
      return responseFunctionPromise;
    });
    let middlewarePromise = onRequest(apiContext, next);
    return yield Promise.resolve(middlewarePromise).then((value) => __async(this, null, function* () {
      if (nextCalled) {
        if (typeof value !== "undefined") {
          if (value instanceof Response === false) {
            throw new AstroError(MiddlewareNotAResponse);
          }
          return ensureCookiesAttached(apiContext, value);
        } else {
          if (responseFunctionPromise) {
            return responseFunctionPromise;
          } else {
            throw new AstroError(MiddlewareNotAResponse);
          }
        }
      } else if (typeof value === "undefined") {
        throw new AstroError(MiddlewareNoDataOrNextCalled);
      } else if (value instanceof Response === false) {
        throw new AstroError(MiddlewareNotAResponse);
      } else {
        return ensureCookiesAttached(apiContext, value);
      }
    }));
  });
}
function ensureCookiesAttached(apiContext, response) {
  if (apiContext.cookies !== void 0 && !responseHasCookies(response)) {
    attachCookiesToResponse(response, apiContext.cookies);
  }
  return response;
}
function routeIsRedirect(route) {
  return (route == null ? void 0 : route.type) === "redirect";
}
function routeIsFallback(route) {
  return (route == null ? void 0 : route.type) === "fallback";
}
function redirectRouteGenerate(redirectRoute, data) {
  const routeData = redirectRoute.redirectRoute;
  const route = redirectRoute.redirect;
  if (typeof routeData !== "undefined") {
    return (routeData == null ? void 0 : routeData.generate(data)) || (routeData == null ? void 0 : routeData.pathname) || "/";
  } else if (typeof route === "string") {
    let target = route;
    for (const param of Object.keys(data)) {
      const paramValue = data[param];
      target = target.replace(`[${param}]`, paramValue);
      target = target.replace(`[...${param}]`, paramValue);
    }
    return target;
  } else if (typeof route === "undefined") {
    return "/";
  }
  return route.destination;
}
function redirectRouteStatus(redirectRoute, method = "GET") {
  const routeData = redirectRoute.redirectRoute;
  if (typeof (routeData == null ? void 0 : routeData.redirect) === "object") {
    return routeData.redirect.status;
  } else if (method !== "GET") {
    return 308;
  }
  return 301;
}
const RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
const RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next(),
  renderers: []
};
const VALID_PARAM_TYPES = ["string", "number", "undefined"];
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError(__spreadProps(__spreadValues({}, GetStaticPathsInvalidRouteParam), {
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    }));
  }
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && !mod.getStaticPaths) {
    throw new AstroError(__spreadProps(__spreadValues({}, GetStaticPathsRequired), {
      location: { file: route.component }
    }));
  }
}
function validateGetStaticPathsResult(result, logger, route) {
  if (!Array.isArray(result)) {
    throw new AstroError(__spreadProps(__spreadValues({}, InvalidGetStaticPathsReturn), {
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    }));
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError(__spreadProps(__spreadValues({}, InvalidGetStaticPathsEntry), {
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      }));
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError(__spreadProps(__spreadValues({}, GetStaticPathsExpectedParams), {
        location: {
          file: route.component
        }
      }));
    }
    for (const [key, val] of Object.entries(pathObject.params)) {
      if (!(typeof val === "undefined" || typeof val === "string" || typeof val === "number")) {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". A string, number or undefined value was expected, but got \`${JSON.stringify(
            val
          )}\`.`
        );
      }
      if (typeof val === "string" && val === "") {
        logger.warn(
          "router",
          `getStaticPaths() returned an invalid path param: "${key}". \`undefined\` expected for an optional param, but got empty string.`
        );
      }
    }
  });
}
function getParams(array) {
  const fn = (match) => {
    const params = {};
    array.forEach((key, i) => {
      if (key.startsWith("...")) {
        params[key.slice(3)] = match[i + 1] ? match[i + 1] : void 0;
      } else {
        params[key] = match[i + 1];
      }
    });
    return params;
  };
  return fn;
}
function stringifyParams(params, route) {
  const validatedParams = Object.entries(params).reduce((acc, next) => {
    validateGetStaticPathsParameter(next, route.component);
    const [key, value] = next;
    if (value !== void 0) {
      acc[key] = typeof value === "string" ? trimSlashes(value) : value.toString();
    }
    return acc;
  }, {});
  return JSON.stringify(route.generate(validatedParams));
}
function generatePaginateFunction(routeMatch) {
  return function paginateUtility(data, args = {}) {
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError(__spreadProps(__spreadValues({}, PageNumberParamNotFound), {
        message: PageNumberParamNotFound.message(paramName)
      }));
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start2 = pageSize === Infinity ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start2 + pageSize, data.length);
      const params = __spreadProps(__spreadValues({}, additionalParams), {
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      });
      const current = correctIndexRoute(routeMatch.generate(__spreadValues({}, params)));
      const next = pageNum === lastPage ? void 0 : correctIndexRoute(routeMatch.generate(__spreadProps(__spreadValues({}, params), { page: String(pageNum + 1) })));
      const prev = pageNum === 1 ? void 0 : correctIndexRoute(
        routeMatch.generate(__spreadProps(__spreadValues({}, params), {
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        }))
      );
      return {
        params,
        props: __spreadProps(__spreadValues({}, additionalProps), {
          page: {
            data: data.slice(start2, end),
            start: start2,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev }
          }
        })
      };
    });
    return result;
  };
}
function correctIndexRoute(route) {
  if (route === "") {
    return "/";
  }
  return route;
}
function callGetStaticPaths(_0) {
  return __async(this, arguments, function* ({
    mod,
    route,
    routeCache,
    logger,
    ssr
  }) {
    const cached = routeCache.get(route);
    if (!mod) {
      throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
    }
    if (cached == null ? void 0 : cached.staticPaths) {
      return cached.staticPaths;
    }
    validateDynamicRouteModule(mod, { ssr, route });
    if (ssr && !route.prerender) {
      const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
      routeCache.set(route, __spreadProps(__spreadValues({}, cached), { staticPaths: entry }));
      return entry;
    }
    let staticPaths = [];
    if (!mod.getStaticPaths) {
      throw new Error("Unexpected Error.");
    }
    staticPaths = yield mod.getStaticPaths({
      // Q: Why the cast?
      // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
      paginate: generatePaginateFunction(route)
    });
    validateGetStaticPathsResult(staticPaths, logger, route);
    const keyedStaticPaths = staticPaths;
    keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
    for (const sp of keyedStaticPaths) {
      const paramsKey = stringifyParams(sp.params, route);
      keyedStaticPaths.keyed.set(paramsKey, sp);
    }
    routeCache.set(route, __spreadProps(__spreadValues({}, cached), { staticPaths: keyedStaticPaths }));
    return keyedStaticPaths;
  });
}
class RouteCache {
  constructor(logger, mode = "production") {
    __publicField(this, "logger");
    __publicField(this, "cache", {});
    __publicField(this, "mode");
    this.logger = logger;
    this.mode = mode;
  }
  /** Clear the cache. */
  clearAll() {
    this.cache = {};
  }
  set(route, entry) {
    var _a;
    if (this.mode === "production" && ((_a = this.cache[route.component]) == null ? void 0 : _a.staticPaths)) {
      this.logger.warn(null, `Internal Warning: route cache overwritten. (${route.component})`);
    }
    this.cache[route.component] = entry;
  }
  get(route) {
    return this.cache[route.component];
  }
}
function findPathItemByKey(staticPaths, params, route, logger) {
  const paramsKey = stringifyParams(params, route);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
function getParamsAndProps(opts) {
  return __async(this, null, function* () {
    var _a;
    const { logger, mod, route, routeCache, pathname, ssr } = opts;
    if (!route || route.pathname) {
      return [{}, {}];
    }
    const params = (_a = getRouteParams(route, pathname)) != null ? _a : {};
    if (routeIsRedirect(route) || routeIsFallback(route)) {
      return [params, {}];
    }
    if (mod) {
      validatePrerenderEndpointCollision(route, mod, params);
    }
    const staticPaths = yield callGetStaticPaths({
      mod,
      route,
      routeCache,
      logger,
      ssr
    });
    const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger);
    if (!matchedStaticPath && (ssr ? route.prerender : true)) {
      throw new AstroError(__spreadProps(__spreadValues({}, NoMatchingStaticPathFound), {
        message: NoMatchingStaticPathFound.message(pathname),
        hint: NoMatchingStaticPathFound.hint([route.component])
      }));
    }
    const props = (matchedStaticPath == null ? void 0 : matchedStaticPath.props) ? __spreadValues({}, matchedStaticPath.props) : {};
    return [params, props];
  });
}
function getRouteParams(route, pathname) {
  if (route.params.length) {
    const paramsMatch = route.pattern.exec(decodeURIComponent(pathname));
    if (paramsMatch) {
      return getParams(route.params)(paramsMatch);
    }
  }
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError(__spreadProps(__spreadValues({}, PrerenderDynamicEndpointPathCollide), {
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      }));
    }
  }
}
const clientLocalsSymbol$2 = Symbol.for("astro.locals");
function createRenderContext(options2) {
  return __async(this, null, function* () {
    var _a;
    const request = options2.request;
    const pathname = (_a = options2.pathname) != null ? _a : new URL(request.url).pathname;
    const [params, props] = yield getParamsAndProps({
      mod: options2.mod,
      route: options2.route,
      routeCache: options2.env.routeCache,
      pathname,
      logger: options2.env.logger,
      ssr: options2.env.ssr
    });
    const context = __spreadProps(__spreadValues({}, options2), {
      pathname,
      params,
      props,
      locales: options2.locales,
      routing: options2.routing,
      defaultLocale: options2.defaultLocale
    });
    Object.defineProperty(context, "locals", {
      enumerable: true,
      get() {
        return Reflect.get(request, clientLocalsSymbol$2);
      },
      set(val) {
        if (typeof val !== "object") {
          throw new AstroError(LocalsNotAnObject);
        } else {
          Reflect.set(request, clientLocalsSymbol$2, val);
        }
      }
    });
    return context;
  });
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = toCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      if (a.qualityValue > b.qualityValue) {
        return -1;
      } else if (a.qualityValue < b.qualityValue) {
        return 1;
      }
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentLocale.path;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return locales.map((locale) => {
        if (typeof locale === "string") {
          return locale;
        } else {
          return locale.codes.at(0);
        }
      });
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(loopLocale.path);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(request, locales, routingStrategy, defaultLocale) {
  const requestUrl = new URL(request.url);
  for (const segment of requestUrl.pathname.split("/")) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        }
      }
    }
  }
  if (routingStrategy === "prefix-other-locales") {
    return defaultLocale;
  }
  return void 0;
}
function createEnvironment(options2) {
  return options2;
}
const clientAddressSymbol$2 = Symbol.for("astro.clientAddress");
const clientLocalsSymbol$1 = Symbol.for("astro.locals");
function createAPIContext({
  request,
  params,
  site,
  props,
  adapterName,
  locales,
  routingStrategy,
  defaultLocale
}) {
  let preferredLocale = void 0;
  let preferredLocaleList = void 0;
  let currentLocale = void 0;
  const context = {
    cookies: new AstroCookies(request),
    request,
    params,
    site: site ? new URL(site) : void 0,
    generator: `Astro v${ASTRO_VERSION}`,
    props,
    redirect(path2, status) {
      return new Response(null, {
        status: status || 302,
        headers: {
          Location: path2
        }
      });
    },
    get preferredLocale() {
      if (preferredLocale) {
        return preferredLocale;
      }
      if (locales) {
        preferredLocale = computePreferredLocale(request, locales);
        return preferredLocale;
      }
      return void 0;
    },
    get preferredLocaleList() {
      if (preferredLocaleList) {
        return preferredLocaleList;
      }
      if (locales) {
        preferredLocaleList = computePreferredLocaleList(request, locales);
        return preferredLocaleList;
      }
      return void 0;
    },
    get currentLocale() {
      if (currentLocale) {
        return currentLocale;
      }
      if (locales) {
        currentLocale = computeCurrentLocale(request, locales, routingStrategy, defaultLocale);
      }
      return currentLocale;
    },
    url: new URL(request.url),
    get clientAddress() {
      if (clientAddressSymbol$2 in request) {
        return Reflect.get(request, clientAddressSymbol$2);
      }
      if (adapterName) {
        throw new AstroError(__spreadProps(__spreadValues({}, ClientAddressNotAvailable), {
          message: ClientAddressNotAvailable.message(adapterName)
        }));
      } else {
        throw new AstroError(StaticClientAddressNotAvailable);
      }
    },
    get locals() {
      let locals = Reflect.get(request, clientLocalsSymbol$1);
      if (locals === void 0) {
        locals = {};
        Reflect.set(request, clientLocalsSymbol$1, locals);
      }
      if (typeof locals !== "object") {
        throw new AstroError(LocalsNotAnObject);
      }
      return locals;
    },
    // We define a custom property, so we can check the value passed to locals
    set locals(val) {
      if (typeof val !== "object") {
        throw new AstroError(LocalsNotAnObject);
      } else {
        Reflect.set(request, clientLocalsSymbol$1, val);
      }
    }
  };
  return context;
}
function callEndpoint(mod, env, ctx, onRequest) {
  return __async(this, null, function* () {
    const context = createAPIContext({
      request: ctx.request,
      params: ctx.params,
      props: ctx.props,
      site: env.site,
      adapterName: env.adapterName,
      routingStrategy: ctx.routing,
      defaultLocale: ctx.defaultLocale,
      locales: ctx.locales
    });
    let response;
    if (onRequest) {
      response = yield callMiddleware(onRequest, context, () => __async(this, null, function* () {
        return yield renderEndpoint(mod, context, env.ssr, env.logger);
      }));
    } else {
      response = yield renderEndpoint(mod, context, env.ssr, env.logger);
    }
    attachCookiesToResponse(response, context.cookies);
    return response;
  });
}
function sequence(...handlers) {
  const filtered = handlers.filter((h) => !!h);
  const length = filtered.length;
  if (!length) {
    const handler2 = defineMiddleware((context, next) => {
      return next();
    });
    return handler2;
  }
  return defineMiddleware((context, next) => {
    return applyHandle(0, context);
    function applyHandle(i, handleContext) {
      const handle = filtered[i];
      const result = handle(handleContext, () => __async(this, null, function* () {
        if (i < length - 1) {
          return applyHandle(i + 1, handleContext);
        } else {
          return next();
        }
      }));
      return result;
    }
  });
}
function defineMiddleware(fn) {
  return fn;
}
function createAssetLink(href, base, assetsPrefix) {
  if (assetsPrefix) {
    return joinPaths(assetsPrefix, slash(href));
  } else if (base) {
    return prependForwardSlash(joinPaths(base, slash(href)));
  } else {
    return href;
  }
}
function createStylesheetElement(stylesheet, base, assetsPrefix) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix) {
  return new Set(stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix)));
}
function createModuleScriptElement(script, base, assetsPrefix) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
function matchRoute(pathname, manifest2) {
  const decodedPathname = decodeURI(pathname);
  return manifest2.routes.find((route) => {
    return route.pattern.test(decodedPathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(decodedPathname));
  });
}
const clientAddressSymbol$1 = Symbol.for("astro.clientAddress");
const responseSentSymbol$1 = Symbol.for("astro.responseSent");
function getFunctionExpression(slot) {
  var _a;
  if (!slot)
    return;
  if (((_a = slot.expressions) == null ? void 0 : _a.length) !== 1)
    return;
  return slot.expressions[0];
}
class Slots {
  constructor(result, slots, logger) {
    __privateAdd(this, _result, void 0);
    __privateAdd(this, _slots, void 0);
    __privateAdd(this, _logger, void 0);
    __privateSet(this, _result, result);
    __privateSet(this, _slots, slots);
    __privateSet(this, _logger, logger);
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError(__spreadProps(__spreadValues({}, ReservedSlotName), {
            message: ReservedSlotName.message(key)
          }));
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!__privateGet(this, _slots))
      return false;
    return Boolean(__privateGet(this, _slots)[name]);
  }
  render(_0) {
    return __async(this, arguments, function* (name, args = []) {
      if (!__privateGet(this, _slots) || !this.has(name))
        return;
      const result = __privateGet(this, _result);
      if (!Array.isArray(args)) {
        __privateGet(this, _logger).warn(
          null,
          `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as a item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
        );
      } else if (args.length > 0) {
        const slotValue = __privateGet(this, _slots)[name];
        const component = typeof slotValue === "function" ? yield slotValue(result) : yield slotValue;
        const expression = getFunctionExpression(component);
        if (expression) {
          const slot = () => __async(this, null, function* () {
            return typeof expression === "function" ? expression(...args) : expression;
          });
          return yield renderSlotToString(result, slot).then((res) => {
            return res != null ? String(res) : res;
          });
        }
        if (typeof component === "function") {
          return yield renderJSX(result, component(...args)).then(
            (res) => res != null ? String(res) : res
          );
        }
      }
      const content = yield renderSlotToString(result, __privateGet(this, _slots)[name]);
      const outHTML = chunkToString(result, content);
      return outHTML;
    });
  }
}
_result = new WeakMap();
_slots = new WeakMap();
_logger = new WeakMap();
function createResult(args) {
  var _a, _b, _c, _d;
  const { params, request, resolve, locals } = args;
  const url = new URL(request.url);
  const headers = new Headers();
  headers.set("Content-Type", "text/html");
  const response = {
    status: args.status,
    statusText: "OK",
    headers
  };
  Object.defineProperty(response, "headers", {
    value: response.headers,
    enumerable: true,
    writable: false
  });
  let cookies = args.cookies;
  let preferredLocale = void 0;
  let preferredLocaleList = void 0;
  let currentLocale = void 0;
  const result = {
    styles: (_a = args.styles) != null ? _a : /* @__PURE__ */ new Set(),
    scripts: (_b = args.scripts) != null ? _b : /* @__PURE__ */ new Set(),
    links: (_c = args.links) != null ? _c : /* @__PURE__ */ new Set(),
    componentMetadata: (_d = args.componentMetadata) != null ? _d : /* @__PURE__ */ new Map(),
    renderers: args.renderers,
    clientDirectives: args.clientDirectives,
    compressHTML: args.compressHTML,
    partial: args.partial,
    pathname: args.pathname,
    cookies,
    /** This function returns the `Astro` faux-global */
    createAstro(astroGlobal, props, slots) {
      const astroSlots = new Slots(result, slots, args.logger);
      const Astro = {
        // @ts-expect-error
        __proto__: astroGlobal,
        get clientAddress() {
          if (!(clientAddressSymbol$1 in request)) {
            if (args.adapterName) {
              throw new AstroError(__spreadProps(__spreadValues({}, ClientAddressNotAvailable), {
                message: ClientAddressNotAvailable.message(args.adapterName)
              }));
            } else {
              throw new AstroError(StaticClientAddressNotAvailable);
            }
          }
          return Reflect.get(request, clientAddressSymbol$1);
        },
        get cookies() {
          if (cookies) {
            return cookies;
          }
          cookies = new AstroCookies(request);
          result.cookies = cookies;
          return cookies;
        },
        get preferredLocale() {
          if (preferredLocale) {
            return preferredLocale;
          }
          if (args.locales) {
            preferredLocale = computePreferredLocale(request, args.locales);
            return preferredLocale;
          }
          return void 0;
        },
        get preferredLocaleList() {
          if (preferredLocaleList) {
            return preferredLocaleList;
          }
          if (args.locales) {
            preferredLocaleList = computePreferredLocaleList(request, args.locales);
            return preferredLocaleList;
          }
          return void 0;
        },
        get currentLocale() {
          if (currentLocale) {
            return currentLocale;
          }
          if (args.locales) {
            currentLocale = computeCurrentLocale(
              request,
              args.locales,
              args.routingStrategy,
              args.defaultLocale
            );
            if (currentLocale) {
              return currentLocale;
            }
          }
          return void 0;
        },
        params,
        props,
        locals,
        request,
        url,
        redirect(path2, status) {
          if (request[responseSentSymbol$1]) {
            throw new AstroError(__spreadValues({}, ResponseSentError));
          }
          return new Response(null, {
            status: status || 302,
            headers: {
              Location: path2
            }
          });
        },
        response,
        slots: astroSlots
      };
      return Astro;
    },
    resolve,
    response,
    _metadata: {
      hasHydrationScript: false,
      rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
      hasRenderedHead: false,
      hasDirectives: /* @__PURE__ */ new Set(),
      headInTree: false,
      extraHead: [],
      propagators: /* @__PURE__ */ new Set()
    }
  };
  return result;
}
function renderPage(_0) {
  return __async(this, arguments, function* ({ mod, renderContext, env, cookies }) {
    var _a, _b;
    if (routeIsRedirect(renderContext.route)) {
      return new Response(null, {
        status: redirectRouteStatus(renderContext.route, renderContext.request.method),
        headers: {
          location: redirectRouteGenerate(renderContext.route, renderContext.params)
        }
      });
    } else if (routeIsFallback(renderContext.route)) {
      return new Response(null, {
        status: 404
      });
    } else if (!mod) {
      throw new AstroError(CantRenderPage);
    }
    const Component = mod.default;
    if (!Component)
      throw new Error(`Expected an exported Astro component but received typeof ${typeof Component}`);
    const result = createResult({
      adapterName: env.adapterName,
      links: renderContext.links,
      styles: renderContext.styles,
      logger: env.logger,
      params: renderContext.params,
      pathname: renderContext.pathname,
      componentMetadata: renderContext.componentMetadata,
      resolve: env.resolve,
      renderers: env.renderers,
      clientDirectives: env.clientDirectives,
      compressHTML: env.compressHTML,
      request: renderContext.request,
      partial: !!mod.partial,
      site: env.site,
      scripts: renderContext.scripts,
      ssr: env.ssr,
      status: (_a = renderContext.status) != null ? _a : 200,
      cookies,
      locals: (_b = renderContext.locals) != null ? _b : {},
      locales: renderContext.locales,
      defaultLocale: renderContext.defaultLocale,
      routingStrategy: renderContext.routing
    });
    const response = yield renderPage$1(
      result,
      Component,
      renderContext.props,
      {},
      env.streaming,
      renderContext.route
    );
    if (result.cookies) {
      attachCookiesToResponse(response, result.cookies);
    }
    return response;
  });
}
class Pipeline {
  /**
   * When creating a pipeline, an environment is mandatory.
   * The environment won't change for the whole lifetime of the pipeline.
   */
  constructor(env) {
    /**
     * It attempts to render a route. A route can be a:
     * - page
     * - redirect
     * - endpoint
     *
     * ## Errors
     *
     * It throws an error if the page can't be rendered.
     */
    __privateAdd(this, _tryRenderRoute);
    __publicField(this, "env");
    __privateAdd(this, _onRequest, void 0);
    __privateAdd(this, _hooks, {
      before: []
    });
    /**
     * The handler accepts the *original* `Request` and result returned by the endpoint.
     * It must return a `Response`.
     */
    __privateAdd(this, _endpointHandler, void 0);
    this.env = env;
  }
  setEnvironment() {
  }
  /**
   * When rendering a route, an "endpoint" will a type that needs to be handled and transformed into a `Response`.
   *
   * Each consumer might have different needs; use this function to set up the handler.
   */
  setEndpointHandler(handler2) {
    __privateSet(this, _endpointHandler, handler2);
  }
  /**
   * A middleware function that will be called before each request.
   */
  setMiddlewareFunction(onRequest) {
    __privateSet(this, _onRequest, onRequest);
  }
  /**
   * Removes the current middleware function. Subsequent requests won't trigger any middleware.
   */
  unsetMiddlewareFunction() {
    __privateSet(this, _onRequest, void 0);
  }
  /**
   * Returns the current environment
   */
  getEnvironment() {
    return this.env;
  }
  /**
   * The main function of the pipeline. Use this function to render any route known to Astro;
   */
  renderRoute(renderContext, componentInstance) {
    return __async(this, null, function* () {
      for (const hook of __privateGet(this, _hooks).before) {
        hook(renderContext, componentInstance);
      }
      const result = yield __privateMethod(this, _tryRenderRoute, tryRenderRoute_fn).call(this, renderContext, this.env, componentInstance, __privateGet(this, _onRequest));
      if (renderContext.route.type === "endpoint") {
        if (!__privateGet(this, _endpointHandler)) {
          throw new Error(
            "You created a pipeline that does not know how to handle the result coming from an endpoint."
          );
        }
        return __privateGet(this, _endpointHandler).call(this, renderContext.request, result);
      } else {
        return result;
      }
    });
  }
  /**
   * Store a function that will be called before starting the rendering phase.
   * @param fn
   */
  onBeforeRenderRoute(fn) {
    __privateGet(this, _hooks).before.push(fn);
  }
}
_onRequest = new WeakMap();
_hooks = new WeakMap();
_endpointHandler = new WeakMap();
_tryRenderRoute = new WeakSet();
tryRenderRoute_fn = function(renderContext, env, mod, onRequest) {
  return __async(this, null, function* () {
    const apiContext = createAPIContext({
      request: renderContext.request,
      params: renderContext.params,
      props: renderContext.props,
      site: env.site,
      adapterName: env.adapterName,
      locales: renderContext.locales,
      routingStrategy: renderContext.routing,
      defaultLocale: renderContext.defaultLocale
    });
    switch (renderContext.route.type) {
      case "page":
      case "fallback":
      case "redirect": {
        if (onRequest) {
          return yield callMiddleware(onRequest, apiContext, () => {
            return renderPage({
              mod,
              renderContext,
              env,
              cookies: apiContext.cookies
            });
          });
        } else {
          return yield renderPage({
            mod,
            renderContext,
            env,
            cookies: apiContext.cookies
          });
        }
      }
      case "endpoint": {
        return yield callEndpoint(mod, env, renderContext, onRequest);
      }
      default:
        throw new Error(`Couldn't find route of type [${renderContext.route.type}]`);
    }
  });
};
class EndpointNotFoundError extends Error {
  constructor(originalResponse) {
    super();
    __publicField(this, "originalResponse");
    this.originalResponse = originalResponse;
  }
}
class SSRRoutePipeline extends Pipeline {
  constructor(env) {
    super(env);
    // This function is responsible for handling the result coming from an endpoint.
    __privateAdd(this, _ssrEndpointHandler);
    this.setEndpointHandler(__privateMethod(this, _ssrEndpointHandler, ssrEndpointHandler_fn));
  }
}
_ssrEndpointHandler = new WeakSet();
ssrEndpointHandler_fn = function(request, response) {
  return __async(this, null, function* () {
    if (response.headers.get("X-Astro-Response") === "Not-Found") {
      throw new EndpointNotFoundError(response);
    }
    return response;
  });
};
const clientLocalsSymbol = Symbol.for("astro.locals");
const responseSentSymbol = Symbol.for("astro.responseSent");
const STATUS_CODES = /* @__PURE__ */ new Set([404, 500]);
class App {
  constructor(manifest2, streaming = true) {
    /**
     * Creates an environment by reading the stored manifest
     *
     * @param streaming
     * @private
     */
    __privateAdd(this, _createEnvironment);
    __privateAdd(this, _getPathnameFromRequest);
    __privateAdd(this, _logRenderOptionsDeprecationWarning);
    /**
     * Creates the render context of the current route
     */
    __privateAdd(this, _createRenderContext);
    /**
     * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
     * This also handles pre-rendered /404 or /500 routes
     */
    __privateAdd(this, _renderError);
    __privateAdd(this, _mergeResponses);
    __privateAdd(this, _getDefaultStatusCode);
    __privateAdd(this, _getModuleForRoute);
    /**
     * The current environment of the application
     */
    __privateAdd(this, _manifest2, void 0);
    __privateAdd(this, _manifestData, void 0);
    __privateAdd(this, _routeDataToRouteInfo, void 0);
    __privateAdd(this, _logger2, new Logger({
      dest: consoleLogDestination,
      level: "info"
    }));
    __privateAdd(this, _baseWithoutTrailingSlash, void 0);
    __privateAdd(this, _pipeline, void 0);
    __privateAdd(this, _adapterLogger, void 0);
    __privateAdd(this, _renderOptionsDeprecationWarningShown, false);
    __privateSet(this, _manifest2, manifest2);
    __privateSet(this, _manifestData, {
      routes: manifest2.routes.map((route) => route.routeData)
    });
    __privateSet(this, _routeDataToRouteInfo, new Map(manifest2.routes.map((route) => [route.routeData, route])));
    __privateSet(this, _baseWithoutTrailingSlash, removeTrailingForwardSlash(__privateGet(this, _manifest2).base));
    __privateSet(this, _pipeline, new SSRRoutePipeline(__privateMethod(this, _createEnvironment, createEnvironment_fn).call(this, streaming)));
    __privateSet(this, _adapterLogger, new AstroIntegrationLogger(
      __privateGet(this, _logger2).options,
      __privateGet(this, _manifest2).adapterName
    ));
  }
  getAdapterLogger() {
    return __privateGet(this, _adapterLogger);
  }
  set setManifestData(newManifestData) {
    __privateSet(this, _manifestData, newManifestData);
  }
  removeBase(pathname) {
    if (pathname.startsWith(__privateGet(this, _manifest2).base)) {
      return pathname.slice(__privateGet(this, _baseWithoutTrailingSlash).length + 1);
    }
    return pathname;
  }
  match(request) {
    const url = new URL(request.url);
    if (__privateGet(this, _manifest2).assets.has(url.pathname))
      return void 0;
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    const routeData = matchRoute(pathname, __privateGet(this, _manifestData));
    if (!routeData || routeData.prerender)
      return void 0;
    return routeData;
  }
  render(request, routeDataOrOptions, maybeLocals) {
    return __async(this, null, function* () {
      let routeData;
      let locals;
      if (routeDataOrOptions && ("routeData" in routeDataOrOptions || "locals" in routeDataOrOptions)) {
        if ("routeData" in routeDataOrOptions) {
          routeData = routeDataOrOptions.routeData;
        }
        if ("locals" in routeDataOrOptions) {
          locals = routeDataOrOptions.locals;
        }
      } else {
        routeData = routeDataOrOptions;
        locals = maybeLocals;
        if (routeDataOrOptions || locals) {
          __privateMethod(this, _logRenderOptionsDeprecationWarning, logRenderOptionsDeprecationWarning_fn).call(this);
        }
      }
      if (request.url !== collapseDuplicateSlashes(request.url)) {
        request = new Request(collapseDuplicateSlashes(request.url), request);
      }
      if (!routeData) {
        routeData = this.match(request);
      }
      if (!routeData) {
        return __privateMethod(this, _renderError, renderError_fn).call(this, request, { status: 404 });
      }
      Reflect.set(request, clientLocalsSymbol, locals != null ? locals : {});
      const pathname = __privateMethod(this, _getPathnameFromRequest, getPathnameFromRequest_fn).call(this, request);
      const defaultStatus = __privateMethod(this, _getDefaultStatusCode, getDefaultStatusCode_fn).call(this, routeData, pathname);
      const mod = yield __privateMethod(this, _getModuleForRoute, getModuleForRoute_fn).call(this, routeData);
      const pageModule = yield mod.page();
      const url = new URL(request.url);
      const renderContext = yield __privateMethod(this, _createRenderContext, createRenderContext_fn).call(this, url, request, routeData, mod, defaultStatus);
      let response;
      try {
        let i18nMiddleware = createI18nMiddleware(
          __privateGet(this, _manifest2).i18n,
          __privateGet(this, _manifest2).base,
          __privateGet(this, _manifest2).trailingSlash
        );
        if (i18nMiddleware) {
          if (mod.onRequest) {
            __privateGet(this, _pipeline).setMiddlewareFunction(sequence(i18nMiddleware, mod.onRequest));
          } else {
            __privateGet(this, _pipeline).setMiddlewareFunction(i18nMiddleware);
          }
          __privateGet(this, _pipeline).onBeforeRenderRoute(i18nPipelineHook);
        } else {
          if (mod.onRequest) {
            __privateGet(this, _pipeline).setMiddlewareFunction(mod.onRequest);
          }
        }
        response = yield __privateGet(this, _pipeline).renderRoute(renderContext, pageModule);
      } catch (err) {
        if (err instanceof EndpointNotFoundError) {
          return __privateMethod(this, _renderError, renderError_fn).call(this, request, { status: 404, response: err.originalResponse });
        } else {
          __privateGet(this, _logger2).error(null, err.stack || err.message || String(err));
          return __privateMethod(this, _renderError, renderError_fn).call(this, request, { status: 500 });
        }
      }
      if (routeData.type === "page" || routeData.type === "redirect") {
        if (STATUS_CODES.has(response.status)) {
          return __privateMethod(this, _renderError, renderError_fn).call(this, request, {
            response,
            status: response.status
          });
        }
        Reflect.set(response, responseSentSymbol, true);
        return response;
      }
      return response;
    });
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
}
_manifest2 = new WeakMap();
_manifestData = new WeakMap();
_routeDataToRouteInfo = new WeakMap();
_logger2 = new WeakMap();
_baseWithoutTrailingSlash = new WeakMap();
_pipeline = new WeakMap();
_adapterLogger = new WeakMap();
_renderOptionsDeprecationWarningShown = new WeakMap();
_createEnvironment = new WeakSet();
createEnvironment_fn = function(streaming = false) {
  return createEnvironment({
    adapterName: __privateGet(this, _manifest2).adapterName,
    logger: __privateGet(this, _logger2),
    mode: "production",
    compressHTML: __privateGet(this, _manifest2).compressHTML,
    renderers: __privateGet(this, _manifest2).renderers,
    clientDirectives: __privateGet(this, _manifest2).clientDirectives,
    resolve: (specifier) => __async(this, null, function* () {
      if (!(specifier in __privateGet(this, _manifest2).entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = __privateGet(this, _manifest2).entryModules[specifier];
      switch (true) {
        case bundlePath.startsWith("data:"):
        case bundlePath.length === 0: {
          return bundlePath;
        }
        default: {
          return createAssetLink(bundlePath, __privateGet(this, _manifest2).base, __privateGet(this, _manifest2).assetsPrefix);
        }
      }
    }),
    routeCache: new RouteCache(__privateGet(this, _logger2)),
    site: __privateGet(this, _manifest2).site,
    ssr: true,
    streaming
  });
};
_getPathnameFromRequest = new WeakSet();
getPathnameFromRequest_fn = function(request) {
  const url = new URL(request.url);
  const pathname = prependForwardSlash(this.removeBase(url.pathname));
  return pathname;
};
_logRenderOptionsDeprecationWarning = new WeakSet();
logRenderOptionsDeprecationWarning_fn = function() {
  if (__privateGet(this, _renderOptionsDeprecationWarningShown))
    return;
  __privateGet(this, _logger2).warn(
    "deprecated",
    `The adapter ${__privateGet(this, _manifest2).adapterName} is using a deprecated signature of the 'app.render()' method. From Astro 4.0, locals and routeData are provided as properties on an optional object to this method. Using the old signature will cause an error in Astro 5.0. See https://github.com/withastro/astro/pull/9199 for more information.`
  );
  __privateSet(this, _renderOptionsDeprecationWarningShown, true);
};
_createRenderContext = new WeakSet();
createRenderContext_fn = function(url, request, routeData, page, status = 200) {
  return __async(this, null, function* () {
    var _a, _b, _c, _d, _e, _f;
    if (routeData.type === "endpoint") {
      const pathname = "/" + this.removeBase(url.pathname);
      const mod = yield page.page();
      const handler2 = mod;
      return yield createRenderContext({
        request,
        pathname,
        route: routeData,
        status,
        env: __privateGet(this, _pipeline).env,
        mod: handler2,
        locales: (_a = __privateGet(this, _manifest2).i18n) == null ? void 0 : _a.locales,
        routing: (_b = __privateGet(this, _manifest2).i18n) == null ? void 0 : _b.routing,
        defaultLocale: (_c = __privateGet(this, _manifest2).i18n) == null ? void 0 : _c.defaultLocale
      });
    } else {
      const pathname = prependForwardSlash(this.removeBase(url.pathname));
      const info = __privateGet(this, _routeDataToRouteInfo).get(routeData);
      const links = /* @__PURE__ */ new Set();
      const styles = createStylesheetElementSet(info.styles);
      let scripts = /* @__PURE__ */ new Set();
      for (const script of info.scripts) {
        if ("stage" in script) {
          if (script.stage === "head-inline") {
            scripts.add({
              props: {},
              children: script.children
            });
          }
        } else {
          scripts.add(createModuleScriptElement(script));
        }
      }
      const mod = yield page.page();
      return yield createRenderContext({
        request,
        pathname,
        componentMetadata: __privateGet(this, _manifest2).componentMetadata,
        scripts,
        styles,
        links,
        route: routeData,
        status,
        mod,
        env: __privateGet(this, _pipeline).env,
        locales: (_d = __privateGet(this, _manifest2).i18n) == null ? void 0 : _d.locales,
        routing: (_e = __privateGet(this, _manifest2).i18n) == null ? void 0 : _e.routing,
        defaultLocale: (_f = __privateGet(this, _manifest2).i18n) == null ? void 0 : _f.defaultLocale
      });
    }
  });
};
_renderError = new WeakSet();
renderError_fn = function(_0, _1) {
  return __async(this, arguments, function* (request, { status, response: originalResponse, skipMiddleware = false }) {
    const errorRoutePath = `/${status}${__privateGet(this, _manifest2).trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, __privateGet(this, _manifestData));
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(
          `${__privateGet(this, _baseWithoutTrailingSlash)}/${status}${maybeDotHtml}`,
          url
        );
        const response2 = yield fetch(statusURL.toString());
        const override = { status };
        return __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, response2, originalResponse, override);
      }
      const mod = yield __privateMethod(this, _getModuleForRoute, getModuleForRoute_fn).call(this, errorRouteData);
      try {
        const newRenderContext = yield __privateMethod(this, _createRenderContext, createRenderContext_fn).call(this, url, request, errorRouteData, mod, status);
        const page = yield mod.page();
        if (skipMiddleware === false && mod.onRequest) {
          __privateGet(this, _pipeline).setMiddlewareFunction(mod.onRequest);
        }
        if (skipMiddleware) {
          __privateGet(this, _pipeline).unsetMiddlewareFunction();
        }
        const response2 = yield __privateGet(this, _pipeline).renderRoute(newRenderContext, page);
        return __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, response2, originalResponse);
      } catch (e) {
        if (skipMiddleware === false && mod.onRequest) {
          return __privateMethod(this, _renderError, renderError_fn).call(this, request, {
            status,
            response: originalResponse,
            skipMiddleware: true
          });
        }
      }
    }
    const response = __privateMethod(this, _mergeResponses, mergeResponses_fn).call(this, new Response(null, { status }), originalResponse);
    Reflect.set(response, responseSentSymbol, true);
    return response;
  });
};
_mergeResponses = new WeakSet();
mergeResponses_fn = function(newResponse, originalResponse, override) {
  if (!originalResponse) {
    if (override !== void 0) {
      return new Response(newResponse.body, {
        status: override.status,
        statusText: newResponse.statusText,
        headers: newResponse.headers
      });
    }
    return newResponse;
  }
  const status = (override == null ? void 0 : override.status) ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
  } catch (e) {
  }
  return new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    // If you're looking at here for possible bugs, it means that it's not a bug.
    // With the middleware, users can meddle with headers, and we should pass to the 404/500.
    // If users see something weird, it's because they are setting some headers they should not.
    //
    // Although, we don't want it to replace the content-type, because the error page must return `text/html`
    headers: new Headers([
      ...Array.from(newResponse.headers),
      ...Array.from(originalResponse.headers)
    ])
  });
};
_getDefaultStatusCode = new WeakSet();
getDefaultStatusCode_fn = function(routeData, pathname) {
  if (!routeData.pattern.exec(pathname)) {
    for (const fallbackRoute of routeData.fallbackRoutes) {
      if (fallbackRoute.pattern.test(pathname)) {
        return 302;
      }
    }
  }
  const route = removeTrailingForwardSlash(routeData.route);
  if (route.endsWith("/404"))
    return 404;
  if (route.endsWith("/500"))
    return 500;
  return 200;
};
_getModuleForRoute = new WeakSet();
getModuleForRoute_fn = function(route) {
  return __async(this, null, function* () {
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (__privateGet(this, _manifest2).pageMap) {
        const importComponentInstance = __privateGet(this, _manifest2).pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        const pageModule = yield importComponentInstance();
        return pageModule;
      } else if (__privateGet(this, _manifest2).pageModule) {
        const importComponentInstance = __privateGet(this, _manifest2).pageModule;
        return importComponentInstance;
      } else {
        throw new Error(
          "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
        );
      }
    }
  });
};
function apply() {
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, "crypto", {
      value: crypto.webcrypto
    });
  }
  if (!globalThis.File) {
    Object.defineProperty(globalThis, "File", {
      value: buffer.File
    });
  }
}
const clientAddressSymbol = Symbol.for("astro.clientAddress");
function createRequestFromNodeRequest(req, options2) {
  var _a;
  const protocol = req.socket instanceof TLSSocket || req.headers["x-forwarded-proto"] === "https" ? "https" : "http";
  const hostname = req.headers.host || req.headers[":authority"];
  const url = `${protocol}://${hostname}${req.url}`;
  const headers = makeRequestHeaders(req);
  const method = req.method || "GET";
  let bodyProps = {};
  const bodyAllowed = method !== "HEAD" && method !== "GET" && !(options2 == null ? void 0 : options2.emptyBody);
  if (bodyAllowed) {
    bodyProps = makeRequestBody(req);
  }
  const request = new Request(url, __spreadValues({
    method,
    headers
  }, bodyProps));
  if ((_a = req.socket) == null ? void 0 : _a.remoteAddress) {
    Reflect.set(request, clientAddressSymbol, req.socket.remoteAddress);
  }
  return request;
}
function makeRequestHeaders(req) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(req.headers)) {
    if (value === void 0) {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else {
      headers.append(name, value);
    }
  }
  return headers;
}
function makeRequestBody(req) {
  if (req.body !== void 0) {
    if (typeof req.body === "string" && req.body.length > 0) {
      return { body: Buffer.from(req.body) };
    }
    if (typeof req.body === "object" && req.body !== null && Object.keys(req.body).length > 0) {
      return { body: Buffer.from(JSON.stringify(req.body)) };
    }
    if (typeof req.body === "object" && req.body !== null && typeof req.body[Symbol.asyncIterator] !== "undefined") {
      return asyncIterableToBodyProps(req.body);
    }
  }
  return asyncIterableToBodyProps(req);
}
function asyncIterableToBodyProps(iterable) {
  return {
    // Node uses undici for the Request implementation. Undici accepts
    // a non-standard async iterable for the body.
    // @ts-expect-error
    body: iterable,
    // The duplex property is required when using a ReadableStream or async
    // iterable for the body. The type definitions do not include the duplex
    // property because they are not up-to-date.
    // @ts-expect-error
    duplex: "half"
  };
}
class NodeApp extends App {
  match(req) {
    if (!(req instanceof Request)) {
      req = createRequestFromNodeRequest(req, {
        emptyBody: true
      });
    }
    return super.match(req);
  }
  render(req, routeDataOrOptions, maybeLocals) {
    if (!(req instanceof Request)) {
      req = createRequestFromNodeRequest(req);
    }
    return super.render(req, routeDataOrOptions, maybeLocals);
  }
}
const createOutgoingHttpHeaders = (headers) => {
  if (!headers) {
    return void 0;
  }
  const nodeHeaders = Object.fromEntries(headers.entries());
  if (Object.keys(nodeHeaders).length === 0) {
    return void 0;
  }
  if (headers.has("set-cookie")) {
    const cookieHeaders = headers.getSetCookie();
    if (cookieHeaders.length > 1) {
      nodeHeaders["set-cookie"] = cookieHeaders;
    }
  }
  return nodeHeaders;
};
function nodeMiddleware_default(app, mode) {
  return function(...args) {
    return __async(this, null, function* () {
      let error = null;
      let locals;
      let [req, res, next] = args;
      if (mode === "middleware") {
        let { [3]: _locals } = args;
        locals = _locals;
      }
      if (args[0] instanceof Error) {
        [error, req, res, next] = args;
        if (mode === "middleware") {
          let { [4]: _locals } = args;
          locals = _locals;
        }
        if (error) {
          if (next) {
            return next(error);
          } else {
            throw error;
          }
        }
      }
      const logger = app.getAdapterLogger();
      try {
        const routeData = app.match(req);
        if (routeData) {
          try {
            const response = yield app.render(req, { routeData, locals });
            yield writeWebResponse(app, res, response, logger);
          } catch (err) {
            if (next) {
              next(err);
            } else {
              throw err;
            }
          }
        } else if (next) {
          return next();
        } else {
          const response = yield app.render(req);
          yield writeWebResponse(app, res, response, logger);
        }
      } catch (err) {
        logger.error(`Could not render ${req.url}`);
        console.error(err);
        if (!res.headersSent) {
          res.writeHead(500, `Server error`);
          res.end();
        }
      }
    });
  };
}
function writeWebResponse(app, res, webResponse, logger) {
  return __async(this, null, function* () {
    const { status, headers, body } = webResponse;
    if (app.setCookieHeaders) {
      const setCookieHeaders = Array.from(app.setCookieHeaders(webResponse));
      if (setCookieHeaders.length) {
        for (const setCookieHeader of setCookieHeaders) {
          headers.append("set-cookie", setCookieHeader);
        }
      }
    }
    const nodeHeaders = createOutgoingHttpHeaders(headers);
    res.writeHead(status, nodeHeaders);
    if (body) {
      try {
        const reader = body.getReader();
        res.on("close", () => {
          reader.cancel().catch((err) => {
            logger.error(
              `There was an uncaught error in the middle of the stream while rendering ${res.req.url}.`
            );
            console.error(err);
          });
        });
        let result = yield reader.read();
        while (!result.done) {
          res.write(result.value);
          result = yield reader.read();
        }
      } catch (e) {
        res.write("Internal server error");
      }
    }
    res.end();
  });
}
const wildcardHosts = /* @__PURE__ */ new Set(["0.0.0.0", "::", "0000:0000:0000:0000:0000:0000:0000:0000"]);
function getNetworkAddress(protocol = "http", hostname, port, base) {
  const NetworkAddress = {
    local: [],
    network: []
  };
  Object.values(os.networkInterfaces()).flatMap((nInterface) => nInterface != null ? nInterface : []).filter(
    (detail) => detail && detail.address && (detail.family === "IPv4" || // @ts-expect-error Node 18.0 - 18.3 returns number
    detail.family === 4)
  ).forEach((detail) => {
    let host = detail.address.replace(
      "127.0.0.1",
      hostname === void 0 || wildcardHosts.has(hostname) ? "localhost" : hostname
    );
    if (host.includes(":")) {
      host = `[${host}]`;
    }
    const url = `${protocol}://${host}:${port}${base ? base : ""}`;
    if (detail.address.includes("127.0.0.1")) {
      NetworkAddress.local.push(url);
    } else {
      NetworkAddress.network.push(url);
    }
  });
  return NetworkAddress;
}
function parsePathname(pathname, host, port) {
  try {
    const urlPathname = new URL(pathname, `http://${host}:${port}`).pathname;
    return decodeURI(encodeURI(urlPathname));
  } catch (err) {
    return void 0;
  }
}
function createServer({ client, port, host, removeBase, assets }, handler2) {
  const assetsPrefix = `/${assets}/`;
  function isImmutableAsset(pathname) {
    return pathname.startsWith(assetsPrefix);
  }
  const listener = (req, res) => {
    if (req.url) {
      let pathname = removeBase(req.url);
      pathname = pathname[0] === "/" ? pathname : "/" + pathname;
      const encodedURI = parsePathname(pathname, host, port);
      if (!encodedURI) {
        res.writeHead(400);
        res.end("Bad request.");
        return res;
      }
      const stream = send(req, encodedURI, {
        root: fileURLToPath(client),
        dotfiles: pathname.startsWith("/.well-known/") ? "allow" : "deny"
      });
      let forwardError = false;
      stream.on("error", (err) => {
        if (forwardError) {
          console.error(err.toString());
          res.writeHead(500);
          res.end("Internal server error");
          return;
        }
        handler2(req, res);
      });
      stream.on("headers", (_res) => {
        if (isImmutableAsset(encodedURI)) {
          _res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      });
      stream.on("directory", () => {
        let location;
        if (req.url.includes("?")) {
          const [url = "", search] = req.url.split("?");
          location = `${url}/?${search}`;
        } else {
          location = req.url + "/";
        }
        res.statusCode = 301;
        res.setHeader("Location", location);
        res.end(location);
      });
      stream.on("file", () => {
        forwardError = true;
      });
      stream.pipe(res);
    } else {
      handler2(req, res);
    }
  };
  let httpServer;
  if (process.env.SERVER_CERT_PATH && process.env.SERVER_KEY_PATH) {
    httpServer = https.createServer(
      {
        key: fs.readFileSync(process.env.SERVER_KEY_PATH),
        cert: fs.readFileSync(process.env.SERVER_CERT_PATH)
      },
      listener
    );
  } else {
    httpServer = http.createServer(listener);
  }
  httpServer.listen(port, host);
  enableDestroy(httpServer);
  const closed = new Promise((resolve, reject) => {
    httpServer.addListener("close", resolve);
    httpServer.addListener("error", reject);
  });
  return {
    host,
    port,
    closed() {
      return closed;
    },
    server: httpServer,
    stop: () => __async(this, null, function* () {
      yield new Promise((resolve, reject) => {
        httpServer.destroy((err) => err ? reject(err) : resolve(void 0));
      });
    })
  };
}
function resolvePaths(options2) {
  const clientURLRaw = new URL(options2.client);
  const serverURLRaw = new URL(options2.server);
  const rel = path.relative(fileURLToPath(serverURLRaw), fileURLToPath(clientURLRaw));
  const serverEntryURL = new URL(import.meta.url);
  const clientURL = new URL(appendForwardSlash(rel), serverEntryURL);
  return {
    client: clientURL
  };
}
function appendForwardSlash(pth) {
  return pth.endsWith("/") ? pth : pth + "/";
}
function getResolvedHostForHttpServer(host) {
  if (host === false) {
    return "127.0.0.1";
  } else if (host === true) {
    return void 0;
  } else {
    return host;
  }
}
function startServer$1(app, options2) {
  var _a;
  const logger = app.getAdapterLogger();
  const port = process.env.PORT ? Number(process.env.PORT) : (_a = options2.port) != null ? _a : 8080;
  const { client } = resolvePaths(options2);
  const handler2 = nodeMiddleware_default(app, options2.mode);
  const host = getResolvedHostForHttpServer(
    process.env.HOST !== void 0 && process.env.HOST !== "" ? process.env.HOST : options2.host
  );
  const server = createServer(
    {
      client,
      port,
      host,
      removeBase: app.removeBase.bind(app),
      assets: options2.assets
    },
    handler2
  );
  const protocol = server.server instanceof https.Server ? "https" : "http";
  const address = getNetworkAddress(protocol, host, port);
  if (host === void 0) {
    logger.info(
      `Server listening on 
  local: ${address.local[0]} 	
  network: ${address.network[0]}
`
    );
  } else {
    logger.info(`Server listening on ${address.local[0]}`);
  }
  return {
    server,
    done: server.closed()
  };
}
apply();
function createExports(manifest2, options2) {
  const app = new NodeApp(manifest2);
  return {
    options: options2,
    handler: nodeMiddleware_default(app, options2.mode),
    startServer: () => startServer$1(app, options2)
  };
}
function start(manifest2, options2) {
  if (options2.mode !== "standalone" || process.env.ASTRO_NODE_AUTOSTART === "disabled") {
    return;
  }
  const app = new NodeApp(manifest2);
  startServer$1(app, options2);
}
const adapter = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  createExports,
  start
}, Symbol.toStringTag, { value: "Module" }));
const _page0 = () => import("./chunks/node_Frv0gqdO.mjs");
const _page1 = () => import("./chunks/index_yHa1cRyg.mjs");
const pageMap = /* @__PURE__ */ new Map([["node_modules/astro/dist/assets/endpoint/node.js", _page0], ["src/pages/index.astro", _page1]]);
const _manifest = Object.assign(manifest, {
  pageMap,
  renderers
});
const _args = { "mode": "standalone", "client": "file:///Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/dist/client/", "server": "file:///Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/dist/server/", "host": true, "port": 4321, "assets": "_astro" };
const _exports = createExports(_manifest, _args);
const handler = _exports["handler"];
const startServer = _exports["startServer"];
const options = _exports["options"];
const _start = "start";
if (_start in adapter) {
  adapter[_start](_manifest, _args);
}
export {
  handler,
  options,
  pageMap,
  startServer
};
