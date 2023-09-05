<template>
  <div class="bullet-box">
    <div class="panel_tltle" style="padding">
      {{props.title}}
      <div class="pull-right">
              <n-icon 
                :component="Close" 
                size="20" 
                style="vertical-align: middle;cursor: pointer;"
                @click="handleCollect"/>
        </div>
    </div>
    <div class="content" >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
  import { Time, Navigate, Close } from '@vicons/ionicons5'
  const emit = defineEmits(['update:showModal']);
  const props = defineProps(['title']);
  // 修改父组件传的值
const handleCollect = () => {
  emit('update:showModal', false)
}
</script>

<style lang="scss" scoped>

.bullet-box {
  // height: 33.3333%;
  // width: 50%;
  // margin: 10px;
  width: 100%;
  background: rgba($color: #FFF, $alpha: 0.85);
  padding: 10px;
  box-sizing: border-box;
  border-radius: 6px;
  height: 100%;
  box-shadow: 1px 1px 5px #707070;
  position: relative;
  .content {
    position: absolute;
    top: 30px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

</style>

