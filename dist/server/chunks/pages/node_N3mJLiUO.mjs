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
import { isRemotePath } from "@astrojs/internal-helpers/path";
import { readFile } from "fs/promises";
import mime from "mime/lite.js";
import "os";
import { A as AstroError, i as InvalidImageService, j as ExpectedImageOptions, E as ExpectedImage, c as createAstro, d as createComponent, k as ImageMissingAlt, r as renderTemplate, m as maybeRenderHead, e as addAttribute, s as spreadAttributes } from "../astro_HcNVr-er.mjs";
import { i as isESMImportedImage, a as isLocalService, b as isRemoteImage, D as DEFAULT_HASH_PROPS, c as isRemoteAllowed } from "../astro/assets-service_0yoFNE94.mjs";
import "html-escaper";
import "clsx";
function getConfiguredImageService() {
  return __async(this, null, function* () {
    var _a;
    if (!((_a = globalThis == null ? void 0 : globalThis.astroAsset) == null ? void 0 : _a.imageService)) {
      const { default: service } = yield import(
        // @ts-expect-error
        "../astro/assets-service_0yoFNE94.mjs"
      ).then((n) => n.s).catch((e) => {
        const error = new AstroError(InvalidImageService);
        error.cause = e;
        throw error;
      });
      if (!globalThis.astroAsset)
        globalThis.astroAsset = {};
      globalThis.astroAsset.imageService = service;
      return service;
    }
    return globalThis.astroAsset.imageService;
  });
}
function getImage$1(options, imageConfig2) {
  return __async(this, null, function* () {
    var _a, _b, _c;
    if (!options || typeof options !== "object") {
      throw new AstroError(__spreadProps(__spreadValues({}, ExpectedImageOptions), {
        message: ExpectedImageOptions.message(JSON.stringify(options))
      }));
    }
    if (typeof options.src === "undefined") {
      throw new AstroError(__spreadProps(__spreadValues({}, ExpectedImage), {
        message: ExpectedImage.message(
          options.src,
          "undefined",
          JSON.stringify(options)
        )
      }));
    }
    const service = yield getConfiguredImageService();
    const resolvedOptions = __spreadProps(__spreadValues({}, options), {
      src: typeof options.src === "object" && "then" in options.src ? (_a = (yield options.src).default) != null ? _a : yield options.src : options.src
    });
    const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
      // @ts-expect-error - clone is a private, hidden prop
      (_b = resolvedOptions.src.clone) != null ? _b : resolvedOptions.src
    ) : resolvedOptions.src;
    resolvedOptions.src = clonedSrc;
    const validatedOptions = service.validateOptions ? yield service.validateOptions(resolvedOptions, imageConfig2) : resolvedOptions;
    const srcSetTransforms = service.getSrcSet ? yield service.getSrcSet(validatedOptions, imageConfig2) : [];
    let imageURL = yield service.getURL(validatedOptions, imageConfig2);
    let srcSets = yield Promise.all(
      srcSetTransforms.map((srcSet) => __async(this, null, function* () {
        return {
          transform: srcSet.transform,
          url: yield service.getURL(srcSet.transform, imageConfig2),
          descriptor: srcSet.descriptor,
          attributes: srcSet.attributes
        };
      }))
    );
    if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
      const propsToHash = (_c = service.propertiesToHash) != null ? _c : DEFAULT_HASH_PROPS;
      imageURL = globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash);
      srcSets = srcSetTransforms.map((srcSet) => ({
        transform: srcSet.transform,
        url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      }));
    }
    return {
      rawOptions: resolvedOptions,
      options: validatedOptions,
      src: imageURL,
      srcSet: {
        values: srcSets,
        attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
      },
      attributes: service.getHTMLAttributes !== void 0 ? yield service.getHTMLAttributes(validatedOptions, imageConfig2) : {}
    };
  });
}
const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};
const $$Astro$1 = createAstro();
const $$Image = createComponent(($$result, $$props, $$slots) => __async(void 0, null, function* () {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = yield getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}), "/Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/node_modules/astro/components/Image.astro", void 0);
const $$Astro = createAstro();
const $$Picture = createComponent(($$result, $$props, $$slots) => __async(void 0, null, function* () {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const _a = Astro2.props, { formats = defaultFormats, pictureAttributes = {}, fallbackFormat } = _a, props = __objRest(_a, ["formats", "pictureAttributes", "fallbackFormat"]);
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const optimizedImages = yield Promise.all(
    formats.map(
      (format) => __async(void 0, null, function* () {
        return yield getImage(__spreadProps(__spreadValues({}, props), { format, widths: props.widths, densities: props.densities }));
      })
    )
  );
  let resultFallbackFormat = fallbackFormat != null ? fallbackFormat : defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(props.src) && specialFormatsFallback.includes(props.src.format)) {
    resultFallbackFormat = props.src.format;
  }
  const fallbackImage = yield getImage(__spreadProps(__spreadValues({}, props), {
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  }));
  const imgAdditionalAttributes = {};
  const sourceAdditionaAttributes = {};
  if (props.sizes) {
    sourceAdditionaAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute("image/" + image.options.format, "type")}${spreadAttributes(sourceAdditionaAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}), "/Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/node_modules/astro/components/Picture.astro", void 0);
const imageConfig = { "service": { "entrypoint": "astro/assets/services/sharp", "config": {} }, "domains": [], "remotePatterns": [], "endpoint": "astro/assets/endpoint/node" };
const assetsDir = new URL("file:///Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/dist/client/");
const getImage = (options) => __async(void 0, null, function* () {
  return yield getImage$1(options, imageConfig);
});
function loadLocalImage(src, url) {
  return __async(this, null, function* () {
    const filePath = new URL("." + src, assetsDir);
    let buffer = void 0;
    try {
      buffer = yield readFile(filePath);
    } catch (e) {
      const sourceUrl = new URL(src, url.origin);
      buffer = yield loadRemoteImage(sourceUrl);
    }
    return buffer;
  });
}
function loadRemoteImage(src) {
  return __async(this, null, function* () {
    try {
      const res = yield fetch(src);
      if (!res.ok) {
        return void 0;
      }
      return Buffer.from(yield res.arrayBuffer());
    } catch (err) {
      return void 0;
    }
  });
}
const GET = (_0) => __async(void 0, [_0], function* ({ request }) {
  var _a;
  try {
    const imageService = yield getConfiguredImageService();
    if (!("transform" in imageService)) {
      throw new Error("Configured image service is not a local service");
    }
    const url = new URL(request.url);
    const transform = yield imageService.parseURL(url, imageConfig);
    if (!(transform == null ? void 0 : transform.src)) {
      throw new Error("Incorrect transform returned by `parseURL`");
    }
    let inputBuffer = void 0;
    if (isRemotePath(transform.src)) {
      if (isRemoteAllowed(transform.src, imageConfig) === false) {
        return new Response("Forbidden", { status: 403 });
      }
      inputBuffer = yield loadRemoteImage(new URL(transform.src));
    } else {
      inputBuffer = yield loadLocalImage(transform.src, url);
    }
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = yield imageService.transform(inputBuffer, transform, imageConfig);
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": (_a = mime.getType(format)) != null ? _a : `image/${format}`,
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: (/* @__PURE__ */ new Date()).toUTCString()
      }
    });
  } catch (err) {
    console.error("Could not process image request:", err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
});
export {
  GET
};
