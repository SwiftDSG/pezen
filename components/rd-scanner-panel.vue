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
        <div v-if="viewMode === 'mobile'" class="rd-panel-input-wrapper">
          <rd-input-switch class="rd-panel-input-switch" :input="modeInput" />
        </div>
        <div class="rd-panel-body-container">
          <div
            v-if="viewMode === 'mobile'"
            class="rd-panel-body-wrapper"
            :style="`transform: translateX(${panelIndex * -100}%)`"
          >
            <h2 class="rd-panel-title rd-headline-3">Scan kode QR</h2>
            <p class="rd-panel-caption rd-caption-text">
              Scan kode QR yang ada di meja restoran, anda akan masuk ke halaman
              restoran.
            </p>
            <div class="rd-panel-video-container">
              <video ref="rdPanelVideo" class="rd-panel-video"></video>
              <rd-progress-bar
                type="overlay"
                :state="loading ? 'show' : 'hide'"
              />
            </div>
          </div>
          <div
            class="rd-panel-body-wrapper"
            :style="`transform: translateX(${panelIndex * -100}%)`"
          >
            <h2 class="rd-panel-title rd-headline-3">Masukkan kode restoran</h2>
            <p class="rd-panel-caption rd-caption-text">
              Masukkan kode yang ada di meja restoran untuk melihat menu
              restoran, kosongkan jika ingin ambil pesananmu sendiri.
            </p>
            <div class="rd-panel-input-wrapper">
              <rd-input-text class="rd-panel-input" :input="codeInput" />
              <rd-input-text class="rd-panel-input" :input="tableInput" />
            </div>
            <div class="rd-panel-button-wrapper">
              <rd-input-button class="rd-panel-button" label="masuk" />
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
  import { BrowserQRCodeReader, IScannerControls } from "@zxing/browser";

  import { InputOption, ViewMode } from "~~/interfaces/general";

  const { setAlert } = useAlert();
  const { viewMode } = useMain();
  const props = defineProps<{
    state: "idle" | "hide";
    code?: string;
  }>();
  const emits = defineEmits(["exit"]);

  const rdBackground = ref<HTMLDivElement>(null);
  const rdPanel = ref<HTMLDivElement>(null);
  const rdPanelVideo = ref<HTMLVideoElement>(null);

  const loading = ref<boolean>(false);
  const scanner = ref<BrowserQRCodeReader>(null);
  const cameras = ref<MediaDeviceInfo[]>(null);
  const controls = ref<IScannerControls>(null);

  const modeInput = ref<{
    options: [string, string];
    model: string;
    disabled?: boolean;
  }>({
    options: ["Scan QR", "Manual"],
    model: "Scan QR",
    disabled: false,
  });
  const codeInput = ref<InputOption>({
    name: "code",
    placeholder: "ABCDEF",
    model: "",
    label: "Kode",
  });
  const tableInput = ref<InputOption>({
    name: "table",
    placeholder: "A01",
    model: "",
    label: "Nomor Meja",
  });

  const panelIndex: ComputedRef<number> = computed(() =>
    modeInput.value.model === "Scan QR" ? 0 : 1
  );

  const animate = {
    init(rdBackground: HTMLElement, rdPanel: HTMLElement): void {
      const tl: GSAPTimeline = gsap.timeline();

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
        onComplete() {
          if (cb) cb();
        },
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

  function exit(): void {
    controls.value?.stop();
    animate.exit(viewMode.value, rdBackground.value, rdPanel.value, () => {
      emits("exit");
    });
  }
  async function startScan(): Promise<void> {
    try {
      if (!cameras.value.length) throw new Error();
      controls.value = await scanner.value.decodeFromVideoDevice(
        cameras.value[1]?.deviceId || cameras.value[0].deviceId,
        rdPanelVideo.value,
        (result, error) => {
          console.log(result);
          console.log(error);
        }
      );
    } catch (e) {
      setAlert({
        type: "error",
        title: "Tidak dapat mendeteksi kamera",
        message: "Silahkan ketik manual kode meja anda",
      });
      modeInput.value.model = "Manual";
      modeInput.value.disabled = true;
    }
  }

  function shiftBody(currentIndex: number, nextIndex: number): void {
    const rdPanelBodyWrapper: HTMLDivElement[] = gsap.utils.toArray(
      rdPanel.value.querySelectorAll(".rd-panel-body-wrapper")
    );

    const currentHeight: number =
      rdPanelBodyWrapper[currentIndex]?.getBoundingClientRect().height;
    const nextHeight: number =
      rdPanelBodyWrapper[nextIndex]?.getBoundingClientRect().height;

    gsap.to(rdPanel.value, {
      y: `+=${currentHeight - nextHeight}`,
      duration: 0.25,
      ease: "power2.inOut",
    });
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") console.log("hide");
    }
  );

  watch(
    () => panelIndex.value,
    (val, oldVal) => {
      if (val !== 0) controls.value?.stop();
      else startScan();
      if (viewMode.value === "mobile") shiftBody(oldVal, val);
    }
  );

  onMounted(async () => {
    animate.init(rdBackground.value, rdPanel.value);

    if (viewMode.value === "mobile") {
      scanner.value = new BrowserQRCodeReader();
      cameras.value = await BrowserQRCodeReader.listVideoInputDevices();
      startScan();
    }
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
      overflow-y: hidden;
      overflow-x: visible;
      display: flex;
      flex-direction: column;
      transform: translateY(125%);
      .rd-panel-header {
        z-index: 2;
        position: relative;
        width: 100%;
        height: 4rem;
        background: var(--background-depth-one-color);
        padding: 1rem;
        box-sizing: border-box;
        box-shadow: 0 0.5rem 0.5rem 0.5rem var(--background-depth-one-color);
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
        z-index: 1;
        position: relative;
        width: 100%;
        height: calc(100% - 4rem);
        padding: 1rem 0 0 0;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;
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
            .rd-panel-video-container {
              position: relative;
              width: 100%;
              height: 15rem;
              border-radius: 0.75rem;
              background: var(--background-depth-three-color);
              margin: 1rem 0;
              overflow: hidden;
              .rd-panel-video {
                position: relative;
                width: 100%;
                height: 100%;
                border-radius: 0.75rem;
                object-fit: cover;
              }
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
