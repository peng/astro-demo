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
import { c as createAstro, d as createComponent, r as renderTemplate, e as addAttribute, f as renderHead, g as renderSlot, h as renderComponent, m as maybeRenderHead } from "../astro_HcNVr-er.mjs";
import "kleur/colors";
import "html-escaper";
import "clsx";
/* empty css                          */
const $$Astro$1 = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => __async(void 0, null, function* () {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}), "/Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/src/layouts/Layout.astro", void 0);
const $$Astro = createAstro();
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => __async(void 0, null, function* () {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Welcome to Astro.", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="main-cont" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "TestReactComp", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-j7pv25f6": true, "client:component-path": "/Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/src/components/TestReactComp", "client:component-export": "default" })} </div> ` })} `;
}), "/Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/src/pages/index.astro", void 0);
const $$file = "/Users/a58/Desktop/work_code/src/github.com/peng/astro-demo/src/pages/index.astro";
const $$url = "";
export {
  $$Index as default,
  $$file as file,
  prerender,
  $$url as url
};
