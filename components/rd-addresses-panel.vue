<template>
  <rd-panel
    class="rd-panel"
    label="Pilih Lokasi"
    :state="panelState"
    :loading="dataLoading"
    @exit="emits('exit')"
  >
    <div class="rd-addresses-container">
      <rd-address
        v-if="!positionCurrent"
        type="prompt"
        :data="{
          position: {
            lat: 0,
            lng: 0,
          },
          name: 'Nyalakan lokasi?',
          address: 'Untuk mencari rekomendasi dekat anda',
        }"
        :loading="locationLoading"
        @clicked="getPosition"
      />
      <rd-address
        v-else
        type="current"
        :data="positionCurrent"
        :active="
          positionCurrent.position.lat === selected?.position.lat &&
          positionCurrent.position.lng === selected?.position.lng
        "
        @clicked="getPosition"
      />
    </div>
    <div class="rd-panel-footer">
      <rd-input-button
        class="rd-panel-button"
        :label="'Terapkan'"
        @clicked="submit"
        :disabled="!selected"
      />
    </div>
  </rd-panel>
</template>

<script lang="ts" setup>
  import { Position } from "~~/interfaces/general";

  const {
    positionCurrent,
    positionSelected,
    geolocate,
    reverseGeocode,
    setPosition,
  } = useMain();
  const props = defineProps<{
    state: "idle" | "hide";
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const dataLoading = ref<boolean>(false);
  const locationLoading = ref<boolean>(false);

  const panelState = ref<"idle" | "hide">("idle");

  const selected = ref<Position>(null);

  async function getPosition(): Promise<void> {
    try {
      locationLoading.value = true;
      const { lat, lng } = await geolocate();
      if (typeof lat === "number" && typeof lng === "number") {
        const address: string[] = await reverseGeocode({ lat, lng });
        const name: string = address.reverse()[0];
        selected.value = positionCurrent.value = {
          address: address.join(", "),
          position: { lat, lng },
          name,
        };
        locationLoading.value = false;
      }
    } catch (e) {
      locationLoading.value = false;
    }
  }

  function submit(): void {
    setPosition(selected.value);
    panelState.value = "hide";
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  onMounted(() => {
    if (positionSelected.value) selected.value = positionSelected.value;
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-addresses-container {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .rd-address {
        cursor: pointer;
        position: relative;
        width: 100%;
        height: 3rem;
        border-radius: 0.75rem;
        border: var(--border);
        padding-right: 0.75rem;
        margin-bottom: 0.5rem;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .rd-address-icon-container {
          position: relative;
          width: 3rem;
          height: 3rem;
          padding: 0 1rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .rd-address-details-container {
          position: relative;
          width: calc(100% - 3rem);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          span.rd-address-detail {
            position: relative;
            width: 100%;
            margin-top: 0.125rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        &.rd-address-active {
          background: var(--primary-color);
          border-color: var(--primary-color);
          color: #fff;
        }
        &.rd-address-loading {
          pointer-events: none;
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
      .rd-panel-footer {
        height: 6rem;
        padding: 2rem;
      }
    }
  }
</style>
