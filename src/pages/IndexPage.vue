<template>
  <div style="height: 400px; width: 300px;">
    <div class="q-ma-md row q-col-gutter-md">
      <q-input
        dense
        outlined
        label="start interval"
        type="number"
        v-model="startInterval"
        class="col-6"
      />
      <q-input
        dense
        outlined
        type="number"
        label="End Interval1"
        v-model="endInterval"
        class="col-6"
      />
      <q-btn
        class="col-12 q-mt-md"
        :label="action_label"
        @click="reloadPage = !reloadPage"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
  name: 'IndexPage',
  data () {
    return {
      startInterval: null,
      endInterval: null,
      reloadPage: false,
      intervalsArr: [],
      action_label: 'Start',
    }
  },
  created() {
    chrome.storage.local.get('signed_in', (data) => {
      if (data.signed_in) {
        chrome.action.setPopup({popup: 'src/pages/IndexPage.vue'});
      } else {
        chrome.action.setPopup({popup: 'www/index.html'});
      }
    });
  },

  watch: {
    reloadPage() {
      this.action_label = "Started."
        for (let i = Number(this.startInterval); i < Number(this.endInterval); i++ ) {
          this.intervalsArr.push(`${i}000`);
        }
        let delay = this.intervalsArr[Math.floor(Math.random()*this.intervalsArr.length)];
        setTimeout(() => {
          this.startReloading();
          this.reloadPage = !this.reloadPage;
        }, delay);
    }
  },
  methods: {
    startReloading() {
      console.log('page reloaded')
      this.$q.bex.send('reloading.page', this.intervalsArr);
    }
  }
})
</script>
