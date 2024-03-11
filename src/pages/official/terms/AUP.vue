<template>
  <div class="h-full w-full items-center justify-center px-[5%] py-[5%]">
    <div class="flex flex-col space-y-20 text-md font-normal leading-lg">
      <div class="font-bold">{{ i18n?.aup?.line1 }}</div>
      <div>
        <div>
          {{ i18n?.aup?.line2 }}
        </div>
        <div>{{ i18n?.aup?.line3 }}</div>
        <div>
          {{ i18n?.aup?.line4 }}
        </div>
        <div>
          {{ i18n?.aup?.line5 }}
        </div>
        <div>{{ i18n?.aup?.line6 }}</div>
        <div>{{ i18n?.aup?.line7 }}</div>
        <div>
          {{ i18n?.aup?.line8 }}
        </div>
        <div>
          {{ i18n?.aup?.line9 }}
        </div>
      </div>
      <div>
        <div>{{ i18n?.aup?.line10 }}</div>
        <div>{{ i18n?.aup?.line11 }}</div>
        <div>{{ i18n?.aup?.line12 }}</div>
        <div>{{ i18n?.aup?.line13 }}</div>
        <div>{{ i18n?.aup?.line14 }}</div>
        <div>{{ i18n?.aup?.line15 }}</div>
        <div>
          {{ i18n?.aup?.line16 }}
        </div>
        <div>{{ i18n?.aup?.line17 }}</div>
        <div>{{ i18n?.aup?.line18 }}</div>
        <div>
          {{ i18n?.aup?.line19 }}
        </div>
        <div>{{ i18n?.aup?.line20 }}</div>
      </div>
      <div>
        <div>
          {{ i18n?.aup?.line21 }}
        </div>
        <div>
          {{ i18n?.aup?.line22 }}
        </div>
        <div>
          {{ i18n?.aup?.line23 }}
        </div>
        <div>{{ i18n?.aup?.line24 }}</div>
      </div>
      <div>
        <div>
          {{ i18n?.aup?.line25 }}
        </div>
        <div>
          {{ i18n?.aup?.line26 }}
        </div>
      </div>
      <div>
        <div>
          {{ i18n?.aup?.line27 }}
        </div>
        <div>
          {{ i18n?.aup?.line28 }}
        </div>
        <div>
          {{ i18n?.aup?.line29 }}
        </div>
        <div>
          {{ i18n?.aup?.line30 }}
        </div>
        <div>
          {{ i18n?.aup?.line31 }}
        </div>
        <div>
          {{ i18n?.aup?.line32 }}
        </div>
        <div>
          {{ i18n?.aup?.line33 }}
        </div>
        <div>
          {{ i18n?.aup?.line34 }}
        </div>
        <div>
          {{ i18n?.aup?.line35 }}
        </div>
        <div>
          {{ i18n?.aup?.line36 }}
        </div>
        <div>
          {{ i18n?.aup?.line37 }}
        </div>
        <div>
          {{ i18n?.aup?.line38 }}
        </div>
        <div>
          {{ i18n?.aup?.line39 }}
        </div>
        <div>
          {{ i18n?.aup?.line40 }}
        </div>
        <div>
          {{ i18n?.aup?.line41 }}
        </div>
        <div>
          {{ i18n?.aup?.line42 }}
        </div>
        <div>
          {{ i18n?.aup?.line43 }}
        </div>
        <div>
          {{ i18n?.aup?.line44 }}
        </div>
        <div>
          {{ i18n?.aup?.line45 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useI18nPack } from '@/compositions/request/i18nPack.js'

const i18n = useI18nPack('aup')
</script>
