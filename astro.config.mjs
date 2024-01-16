import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react' 
import vue from '@astrojs/vue';
export const prerender = false;
// https://astro.build/config
const config = {
  integrations:[react(), vue()],
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
  server: {
    host: true
  },
  // build: {
  //   assetsPrefix: '//examplea.com/static/' // work
  // },
  vite: {
    build: {
      target: ['es6', 'es2015']
    },
    experimental: {
      renderBuiltUrl(filename, { hostType }) {
        return '//examplea.com/static/' // don't work
      }
    }
  }
}

export default defineConfig(config);
