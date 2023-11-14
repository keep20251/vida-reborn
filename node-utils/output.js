export const getOutputDir = () => {
  const args = process.argv.slice(2)
  if (args.includes('staging')) {
    return 'dist-staging'
  }
  return 'dist'
}
