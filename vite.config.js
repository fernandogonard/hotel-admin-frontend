// vite.config.js
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2117',  // Ensure this is the correct backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
};
