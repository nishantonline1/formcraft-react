import { defineConfig } from 'tsup'

export default defineConfig([
  // Main entry point - core configuration functionality
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    clean: true,
    outDir: 'dist',
    // Core functionality should not bundle React dependencies
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    // Enable tree-shaking by preserving modules
    splitting: true,
    treeshake: true,
    esbuildOptions(options) {
      options.jsx = 'transform'
      options.jsxFactory = 'React.createElement'
      options.jsxFragment = 'React.Fragment'
    },
  },
  // UI entry point - optional React components
  {
    entry: ['src/ui.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/ui',
    // UI components require React as external dependency
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    // Enable tree-shaking for UI components
    splitting: true,
    treeshake: true,
    esbuildOptions(options) {
      options.jsx = 'transform'
      options.jsxFactory = 'React.createElement'
      options.jsxFragment = 'React.Fragment'
    },
  },
  // Full entry point - complete library for backward compatibility
  {
    entry: ['src/full.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/full',
    // Full library includes all React dependencies as external
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    // Enable tree-shaking even for full build
    splitting: true,
    treeshake: true,
    esbuildOptions(options) {
      options.jsx = 'transform'
      options.jsxFactory = 'React.createElement'
      options.jsxFragment = 'React.Fragment'
    },
  },
]) 