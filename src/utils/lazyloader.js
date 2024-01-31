let intersectionObserver

if (!import.meta.env.SSR) {
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.load && entry.target.load()
        } else {
          entry.target.unload && entry.target.unload()
        }
      })
    },
    {
      rootMargin: '50% 0px 50% 0px',
      threshold: 0,
    },
  )
}

export default intersectionObserver
