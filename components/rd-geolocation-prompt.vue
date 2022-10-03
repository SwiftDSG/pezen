<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-prompt-illustration">
      <img
        src="/illustrations/enablelocation.svg"
        class="rd-prompt-illustration-image"
      />
    </div>
    <span class="rd-prompt-title rd-headline-5">Tentukan Lokasi</span>
    <span class="rd-prompt-text rd-caption-text">
      Ini akan membantu kami mencari restoran dekat anda!
    </span>
    <rd-input-button
      @clicked="emits('open-panel')"
      type="background"
      label="Aktifkan"
      icon="crosshairs"
    />
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";

  const emits = defineEmits(["open-panel"]);
</script>

<style lang="scss" scoped>
  .rd-component {
    position: relative;
    width: 100%;
    border-radius: 0.75rem;
    background: var(--primary-color);
    padding: 0.75rem 6rem 0.75rem 0.75rem;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    .rd-prompt-illustration {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 6rem;
      height: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      img.rd-prompt-illustration-image {
        position: relative;
        width: 100%;
        height: 100%;
        transform: translate(0.5rem, 0.75rem);
        object-fit: cover;
      }
    }
    span.rd-prompt-title {
      position: relative;
      margin-bottom: 0.5rem;
      line-height: 1;
      color: #fff;
    }
    span.rd-prompt-text {
      position: relative;
      color: #fff;
      margin-bottom: 1rem;
    }
    @media only screen and (min-width: 1025px) {
      width: 10rem;
      height: calc(100% - 2rem);
      padding: 0.75rem;
    }
  }
</style>
