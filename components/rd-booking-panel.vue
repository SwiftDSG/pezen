<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-background" ref="rdBackground"></div>
    <div class="rd-panel" ref="rdPanel">
      <div class="rd-panel-header">
        <rd-input-button-small
          class="rd-panel-button"
          :icon="'arrow-left'"
          @clicked="exit"
        />
      </div>
      <div class="rd-panel-body">
        <div class="rd-panel-input-wrapper">
          <rd-input-switch class="rd-panel-input-switch" :input="modeInput" />
        </div>
        <div class="rd-panel-body-container">
          <div class="rd-panel-body-wrapper">
            <h2 class="rd-panel-title rd-headline-3">Pilih Waktu</h2>
            <p class="rd-panel-caption rd-caption-text">
              Silahkan masukkan jumlah tamu dan waktu yang diinginkan
            </p>
            <div class="rd-panel-input-wrapper">
              <rd-input-date class="rd-panel-input" :input="dateInput" />
              <rd-input-text
                class="rd-panel-input"
                style="width: calc(25% - 0.375rem)"
                :input="hoursInput"
              />
              <rd-input-text
                class="rd-panel-input"
                style="width: calc(25% - 0.375rem)"
                :input="minutesInput"
              />
            </div>
            <div class="rd-panel-input-wrapper" style="margin-top: 0">
              <rd-input-text
                class="rd-panel-input"
                style="width: 100%"
                :input="guestInput"
              />
            </div>
            <div class="rd-panel-button-wrapper">
              <rd-input-button
                class="rd-panel-button"
                label="masuk"
                :disabled="!date || (mode === 'Dine in' && !guest)"
                :loading="loading"
                @clicked="submit"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import gsap from "gsap";
  import { ComputedRef } from "vue";

  import {
    InputDateOption,
    InputOption,
    ViewMode,
  } from "~~/interfaces/general";

  const { checkRestaurantAvailability } = useRestaurants();
  const { setAlert } = useAlert();
  const { viewMode, errorHandler } = useMain();
  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      code: string;
      id: string;
    };
  }>();
  const emits = defineEmits(["exit", "change-page"]);

  const rdBackground = ref<HTMLDivElement>(null);
  const rdPanel = ref<HTMLDivElement>(null);

  const loading = ref<boolean>(false);

  const modeInput = ref<{
    options: [string, string];
    model: string;
    disabled?: boolean;
  }>({
    options: ["Dine in", "Take away"],
    model: "Dine in",
    disabled: false,
  });
  const dateInput = ref<InputDateOption>({
    name: "date",
    placeholder: "21-04-2021",
    model: "",
    label: "Tanggal",
    value: "",
    threshold: new Date(new Date().setHours(0, 0, 0, 0) + 86400000),
  });
  const hoursInput = ref<InputOption>({
    name: "hours",
    placeholder: "HH",
    model: "",
    label: "Jam",
    type: "hour",
  });
  const minutesInput = ref<InputOption>({
    name: "minutes",
    placeholder: "MM",
    model: "",
    label: "Menit",
    type: "minute",
  });
  const guestInput = ref<InputOption>({
    name: "guest",
    placeholder: "A01",
    model: "",
    label: "Jumlah tamu",
    type: "number",
    disabled: false,
  });

  const mode: ComputedRef<string> = computed(() => modeInput.value.model);
  const guest: ComputedRef<number> = computed(() =>
    parseInt(guestInput.value.model.split(".").join(""))
  );
  const date: ComputedRef<Date> = computed(() => {
    const date: Date = new Date(
      new Date(dateInput.value.value).setHours(
        parseInt(hoursInput.value.model),
        parseInt(minutesInput.value.model)
      )
    );
    return isNaN(date.getTime()) ? null : date;
  });

  const animate = {
    init(
      rdBackground: HTMLElement,
      rdPanel: HTMLElement,
      cb?: () => void
    ): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdBackground, {
        opacity: 1,
        duration: 0.5,
      }).to(
        rdPanel,
        {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "power4.out",
        },
        "<0"
      );
    },
    exit(
      viewMode: ViewMode,
      rdBackground: HTMLElement,
      rdPanel: HTMLElement,
      cb?: () => void
    ): void {
      const tl: GSAPTimeline = gsap.timeline({
        onComplete: cb,
      });

      tl.to(rdBackground, {
        opacity: 0,
        duration: 0.5,
      });

      if (viewMode === "mobile") {
        tl.to(
          rdPanel,
          {
            y: "125%",
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<0"
        );
      } else {
        tl.to(
          rdPanel,
          {
            x: "125%",
            duration: 0.5,
            ease: "power2.inOut",
          },
          "<0"
        );
      }
    },
  };

  function exit(cb?: () => void): void {
    animate.exit(viewMode.value, rdBackground.value, rdPanel.value, () => {
      if (cb) {
        cb();
      } else {
        emits("change-page", `/restaurants/${props?.data.code}?type=dine-in`);
      }
      emits("exit");
    });
  }

  async function submit(): Promise<void> {
    try {
      loading.value = true;
      await checkRestaurantAvailability({
        id: props.data.id,
        guest: guest.value,
        date: date.value.getTime(),
      });
      exit(() => {
        emits(
          "change-page",
          `/restaurants/${
            props.data.code
          }?type=booking&date=${date.value.getTime()}&${
            guest.value ? `guest=${guest.value}` : ""
          }`
        );
      });
    } catch (e) {
      const message: string = errorHandler(e?.message);
      loading.value = false;
      setAlert({
        type: "error",
        title: "Restoran tidak tersedia",
        message,
      });
    }
  }

  watch(
    () => mode.value,
    (val) => {
      guestInput.value.model = "";
      if (val === "Dine in") {
        guestInput.value.disabled = false;
      } else {
        guestInput.value.disabled = true;
      }
    }
  );

  onMounted(() => {
    animate.init(rdBackground.value, rdPanel.value);
  });
</script>

<style lang="scss" scoped>
  .rd-component {
    z-index: 100000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    .rd-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(43, 25, 6, 0.5);
      backdrop-filter: blur(10px);
      opacity: 0;
    }
    .rd-panel {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100vw;
      background: var(--background-depth-one-color);
      border-top-left-radius: 0.75rem;
      border-top-right-radius: 0.75rem;
      overflow-y: visible;
      overflow-x: visible;
      display: flex;
      flex-direction: column;
      transform: translateY(125%);
      .rd-panel-header {
        z-index: 1;
        position: relative;
        width: 100%;
        height: 4rem;
        background: var(--background-depth-one-color);
        padding: 1rem;
        box-sizing: border-box;
        border-top-left-radius: 0.75rem;
        border-top-right-radius: 0.75rem;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        .rd-panel-button {
          position: absolute;
          top: 1rem;
          left: 1rem;
        }
      }
      .rd-panel-body {
        z-index: 2;
        position: relative;
        width: 100%;
        height: calc(100% - 4rem);
        padding: 1rem 0 0 0;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        .rd-panel-input-switch {
          position: relative;
          width: 100%;
          margin-bottom: 1rem;
          padding: 0 1rem;
          box-sizing: border-box;
          display: flex;
        }
        .rd-panel-body-container {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;
          .rd-panel-body-wrapper {
            position: relative;
            width: 100%;
            padding: 0 1rem;
            box-sizing: border-box;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            transition: 0.25s transform ease-in-out;
            h2.rd-panel-title {
              position: relative;
              width: 100%;
              height: 1rem;
              margin-bottom: 1rem;
              display: flex;
              flex-shrink: 0;
              align-items: center;
            }
            .rd-panel-input-wrapper {
              position: relative;
              width: 100%;
              margin-top: 1rem;
              display: flex;
              justify-content: space-between;
              .rd-panel-input {
                width: calc(50% - 0.25rem);
              }
            }
            .rd-panel-button-wrapper {
              position: relative;
              width: 100%;
              margin-top: 2rem;
              margin-bottom: 1rem;
              display: flex;
              .rd-panel-button {
                width: 100%;
              }
            }
          }
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      .rd-panel {
        left: auto;
        top: 0;
        right: 0;
        width: 20rem;
        height: 100vh;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        box-sizing: border-box;
        transform: translateX(125%);
        .rd-panel-header {
          height: 6rem;
          padding: 2rem;
          .rd-panel-button {
            top: 2rem;
            left: 2rem;
          }
        }
        .rd-panel-body {
          padding: 1rem 2rem;
          height: calc(100% - 6rem);
          .rd-panel-input-switch {
            padding: 0;
          }
          .rd-panel-body-container {
            height: 100%;
            .rd-panel-body-wrapper {
              height: 100%;
              padding: 0;
              .rd-panel-button-wrapper {
                position: absolute;
                left: -2rem;
                bottom: 0;
                width: calc(100% + 4rem);
                height: 5rem;
                margin: 0;
                padding: 2rem 2rem 1rem 2rem;
                box-sizing: border-box;
                flex-shrink: 0;
                &::before {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 1px;
                  background: var(--border-color);
                }
              }
            }
          }
        }
      }
    }
  }
</style>
