export default {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns:'usage',
      corejs:3,
      targets: 'node 16'
    }],
    '@babel/preset-typescript'
  ]
}