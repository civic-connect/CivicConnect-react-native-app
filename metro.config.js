const { getDefaultConfig } = require('expo/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  // Add 'glb' to the list of asset extensions
  defaultConfig.resolver.assetExts.push('json');
  return defaultConfig;
})();
