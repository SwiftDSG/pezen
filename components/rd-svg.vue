<template>
  <div
    class="rd-component-svg"
    ref="rdComponent"
    :class="color ? `rd-color-${color}` : ''"
  ></div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";

  const props = defineProps<{
    name: string;
    color?: string;
  }>();

  const rdComponent = ref<HTMLDivElement>(null);

  const rdElementText = ref<string>("");

  onBeforeMount(async () => {
    const data: Response = await fetch(`/icons/${props.name}.svg`);
    rdElementText.value = await data.text();
  });

  watch(
    () => rdElementText.value,
    (val) => {
      rdComponent.value.innerHTML = val;
    }
  );
</script>

<style lang="scss">
  .rd-component-svg {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.25s transform;
    svg {
      position: relative;
      width: 100%;
      height: 100%;
      &.rd-svg-filled {
        .rd-svg-filled-main {
          fill: var(--font-color);
        }
        .rd-svg-filled-secondary {
          fill: var(--secondary-color);
        }
      }
      &.rd-svg-outlined {
        .rd-svg-outlined-main {
          stroke: var(--font-color);
        }
        .rd-svg-outlined-secondary {
          stroke: var(--secondary-color);
        }
      }
    }
    &.rd-color-secondary {
      svg {
        &.rd-svg-filled {
          .rd-svg-filled-main {
            fill: var(--secondary-color);
          }
          .rd-svg-filled-secondary {
            fill: #fff;
          }
        }
        &.rd-svg-outlined {
          .rd-svg-outlined-main {
            stroke: var(--secondary-color);
          }
          .rd-svg-outlined-secondary {
            stroke: #fff;
          }
        }
      }
    }
    &.rd-color-primary {
      svg {
        &.rd-svg-filled {
          .rd-svg-filled-main {
            fill: var(--primary-color);
          }
          .rd-svg-filled-secondary {
            fill: var(--secondary-color);
          }
        }
        &.rd-svg-outlined {
          .rd-svg-outlined-main {
            stroke: var(--primary-color);
          }
          .rd-svg-outlined-secondary {
            stroke: var(--secondary-color);
          }
        }
      }
    }
  }
</style>
