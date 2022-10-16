<template>
  <rd-panel
    class="rd-panel"
    label="Pilih Lokasi"
    :state="panelState"
    @exit="emits('exit')"
  >
    <div class="rd-panel-body">
      <div class="rd-panel-map-container">
        <div class="rd-panel-map-action-container">
          <rd-input-button-small
            class="rd-panel-map-action"
            :icon="mapLocked ? 'lock-close' : 'lock-open'"
            @clicked="mapLocked = !mapLocked"
          />
          <rd-input-button-small
            class="rd-panel-map-action"
            icon="crosshairs-gps"
            @clicked="changeToCurrentPos"
          />
        </div>
        <div class="rd-panel-map-marker-container">
          <img src="/marker.svg" class="rd-panel-map-marker" />
        </div>
        <div
          class="rd-panel-map"
          ref="rdPanelMap"
          :style="mapLocked ? 'pointer-events: none' : ''"
        ></div>
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text class="rd-panel-input" :input="nameInput" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-text class="rd-panel-input" :input="phoneInput" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-select class="rd-panel-input" :input="typeInput" />
      </div>
      <div class="rd-panel-input-wrapper">
        <rd-input-textarea class="rd-panel-input" :input="addressInput" />
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'simpan'"
        :disabled="!selected"
        :loading="loading"
        @clicked="submit"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputGeneric, InputOption } from "~~/interfaces/general";

  /// <reference types="@types/google.maps" />

  const config = useRuntimeConfig();
  const { setAlert } = useAlert();
  const { geolocate, errorHandler } = useMain();
  const { addAddress } = useUser();
  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const rdPanelMap = ref<HTMLDivElement>(null);

  const loading = ref<boolean>(false);

  const panelState = ref<"idle" | "hide">("idle");

  const selected = ref<google.maps.LatLngLiteral>({
    lat: -6.17519,
    lng: 106.8271,
  });

  const map = ref<google.maps.Map>(null);
  const mapLocked = ref<boolean>(true);

  const nameInput = ref<InputOption>({
    name: "name",
    placeholder: "Rumahku",
    model: "",
    label: "Label alamat",
  });
  const phoneInput = ref<InputOption>({
    name: "phone",
    placeholder: "0812345678",
    model: "",
    label: "Telpon penerima",
  });
  const typeInput = ref<InputGeneric<string>>({
    name: "type",
    placeholder: "rumah",
    model: "",
    value: "",
    label: "Tipe alamat",
    options: ["rumah", "apartment", "kos", "kantor", "sekolah"],
  });
  const addressInput = ref<InputOption>({
    name: "address",
    placeholder: "Di ujung dunia",
    model: "",
    label: "Detil alamat",
  });

  const name: ComputedRef<string> = computed(() => nameInput.value.model);
  const phone: ComputedRef<string> = computed(() => phoneInput.value.model);
  const type: ComputedRef<string> = computed(() => typeInput.value.value);
  const address: ComputedRef<string> = computed(() => addressInput.value.model);

  async function changeToCurrentPos(): Promise<void> {
    selected.value = await geolocate();
    map.value.setCenter(selected.value);
  }

  async function submit(): Promise<void> {
    try {
      loading.value = true;
      await addAddress({
        position: selected.value,
        name: name.value,
        phone: phone.value,
        type: type.value,
        address: address.value,
      });
      setTimeout(() => {
        setAlert({
          type: "success",
          title: "Alamat berhasil ditambahkan",
          message: "Alamat dapat digunakan sebagai lokasi pengiriman",
        });
        loading.value = false;
        panelState.value = "hide";
      }, 500);
    } catch (e) {
      loading.value = false;
      const message: string = errorHandler(e?.message);
      setAlert({
        type: "error",
        title: "Restoran tidak tersedia",
        message,
      });
    }
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(() => {
    map.value = new google.maps.Map(rdPanelMap.value, {
      center: selected.value,
      zoom: 15,
      disableDefaultUI: true,
      mapId: config.public.mapId,
    });
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      .rd-panel-map-container {
        position: relative;
        width: calc(100vw - 2rem);
        height: calc(100vw - 2rem);
        border-radius: 0.75rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        .rd-panel-map-action-container {
          z-index: 1;
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          width: calc(100% - 1.5rem);
          height: 2rem;
          display: flex;
          justify-content: space-between;
        }
        .rd-panel-map-marker-container {
          z-index: 2;
          position: absolute;
          bottom: 50%;
          left: calc(50% - 0.75rem);
          width: 1.5rem;
          display: flex;
          img.rd-panel-map-marker {
            position: relative;
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
        .rd-panel-map {
          z-index: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 0.75rem;
          background: var(--background-depth-two-color);
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
      .rd-panel-input-wrapper {
        position: relative;
        width: 100%;
        margin-top: 1rem;
        display: flex;
        justify-content: space-between;
        .rd-panel-input {
          width: 100%;
        }
        &:last-child {
          margin-bottom: 5rem;
        }
      }
    }
    .rd-panel-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4rem;
      background: var(--background-depth-one-color);
      padding: 1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: center;
      .rd-panel-button {
        width: 100%;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 1px;
        background: var(--border-color);
      }
    }
    @media only screen and (min-width: 1025px) {
      .rd-panel-body {
        .rd-panel-map-container {
          width: 16rem;
          height: 16rem;
        }
        .rd-panel-input-wrapper {
          &:last-child {
            margin-bottom: 6.5rem;
          }
        }
      }
      .rd-panel-footer {
        height: 6rem;
        padding: 2rem;
      }
    }
  }
</style>
