import { ref, onMounted, defineComponent } from 'vue'

const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false)
    onMounted(() => {
      show.value = true
    })
    return () => (show.value && slots.default ? slots.default() : slots.fallback ? slots.fallback() : null)
  },
})

export default ClientOnly
