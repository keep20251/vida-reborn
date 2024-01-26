let intersectionObserver

if (!import.meta.env.SSR) {
  intersectionObserver = new IntersectionObserver(
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
}

export default intersectionObserver
