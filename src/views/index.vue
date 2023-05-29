<template>
    <div class="content flexRow1">
       <china-map></china-map>
    </div>
</template>

<script>
import ChinaMap from "@/components/chinaMap.vue";

export default {
    components: {ChinaMap}

}
</script>

<style lang="scss" scoped>
.content{
  width: 100vw;
  height: 100vh;
}
</style>