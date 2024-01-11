<template>
    <div id="waves"></div>
</template>

<script>

import { animate, init } from '../assets/js/dotCanvas';

export default {
  name:'dotCanvas',
  mounted() {
    init()
    animate()
  },
  methods:{

  }
};
</script>

<style lang='scss' scoped>
#waves {
  display: block;
  width: 100%;
  height: 50%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: transparent;
}
#waves canvas {
  width: 100%;
  height: 100%;
}
</style>
