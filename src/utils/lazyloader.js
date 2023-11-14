export default new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.load()
      }
    })
  },
  {
    threshold: 0,
  },
)
