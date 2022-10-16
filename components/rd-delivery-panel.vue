<template>
  <rd-panel
    class="rd-panel"
    :label="mode === 'Delivery' ? 'Atur Pengiriman' : 'Atur Pengambilan'"
    :state="panelState"
    :loading="dataLoading"
    @exit="emits('exit')"
  >
    <div v-if="dataRestaurant" class="rd-panel-body">
      <div class="rd-panel-input-switch-wrapper">
        <rd-input-switch class="rd-panel-input-switch" :input="modeInput" />
      </div>
      <div class="rd-panel-card" style="width: 100%">
        <div class="rd-panel-card-header">
          <span class="rd-panel-card-name rd-headline-4">{{
            mode === "Delivery" ? "Dikirim dari" : "Alamat pengambilan"
          }}</span>
          <div class="rd-panel-card-icon-container">
            <rd-svg class="rd-panel-card-icon" name="map-marker" />
          </div>
        </div>
        <div class="rd-panel-card-body">
          <span class="rd-panel-card-value rd-headline-5">{{
            dataRestaurant.name
          }}</span>
          <span class="rd-panel-card-placeholder rd-caption-text">{{
            dataRestaurant.address
          }}</span>
        </div>
      </div>
      <div class="rd-panel-card" style="width: 100%">
        <div class="rd-panel-card-header">
          <span class="rd-panel-card-name rd-headline-4">{{
            mode === "Delivery" ? "Waktu pengiriman" : "Waktu pengambilan"
          }}</span>
          <div class="rd-panel-card-icon-container">
            <rd-svg class="rd-panel-card-icon" name="calendar" />
          </div>
        </div>
        <div class="rd-panel-card-body">
          <div class="rd-panel-card-wrapper">
            <div class="rd-panel-card-section">
              <span class="rd-panel-card-value rd-headline-5">Tanggal</span>
              <span
                v-if="!dateRaw"
                @click="backdropIndex = 0"
                class="rd-panel-card-placeholder rd-panel-card-placeholder-primary rd-headline-6"
                >Klik untuk ubah</span
              >
              <span
                v-else
                @click="backdropIndex = 0"
                class="rd-panel-card-placeholder rd-headline-6"
                >{{ dateRaw }}</span
              >
            </div>
            <div class="rd-panel-card-section">
              <span class="rd-panel-card-value rd-headline-5">Waktu</span>
              <span
                v-if="!timeRaw"
                @click="backdropIndex = 1"
                class="rd-panel-card-placeholder rd-panel-card-placeholder-primary rd-headline-6"
                >Klik untuk ubah</span
              >
              <span
                v-else
                @click="backdropIndex = 1"
                class="rd-panel-card-placeholder rd-headline-6"
                >{{ timeRaw }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <span v-if="mode === 'Delivery'" class="rd-panel-name rd-headline-3"
        >Alamat tujuan</span
      >
      <div v-if="mode === 'Delivery'" class="rd-panel-card-row">
        <div class="rd-panel-card" style="width: 10rem; margin-right: 0.75rem">
          <div class="rd-panel-card-header">
            <div class="rd-panel-card-icon-container">
              <rd-svg class="rd-panel-card-icon" name="calendar" />
            </div>
            <span class="rd-panel-card-tag rd-headline-6">15.6 km</span>
          </div>
          <div class="rd-panel-card-body">
            <span class="rd-panel-card-value rd-headline-4">Rumah</span>
            <span class="rd-panel-card-placeholder rd-caption-text"
              >Test alone rest asd zxc</span
            >
          </div>
        </div>
        <div
          class="rd-panel-card"
          style="width: 10rem; border-color: var(--primary-color)"
        >
          <div class="rd-panel-card-overlay">
            <div class="rd-panel-card-icon-container">
              <rd-svg class="rd-panel-card-icon" name="plus" color="primary" />
            </div>
            <span class="rd-panel-card-message rd-headline-6"
              >tambah alamat</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="rd-panel-footer">
      <rd-input-button class="rd-panel-button" :label="'simpan'" />
    </div>
    <rd-input-date-backdrop
      @exit="backdropIndex = -1"
      v-if="backdropIndex === 0"
      :input="dateInput"
    />
    <rd-input-time-backdrop
      @exit="backdropIndex = -1"
      v-if="backdropIndex === 1"
      :input="timeInput"
    />
  </rd-panel>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import {
    InputDateOption,
    InputSwitchOption,
    InputTimeOption,
  } from "~~/interfaces/general";
  import { MenuGroup } from "~~/interfaces/menus";
  import { Restaurant, RestaurantMin } from "~~/interfaces/restaurants";

  const { getRestaurantCheckout } = useRestaurants();
  const props = defineProps<{
    state: "idle" | "hide";
    data: {
      group: MenuGroup;
      restaurant: RestaurantMin;
    };
  }>();
  const emits = defineEmits(["exit", "open-panel"]);

  const dataLoading = ref<boolean>(true);
  const dataRestaurant = ref<Restaurant>(null);

  const panelState = ref<"idle" | "hide">("idle");

  const backdropIndex = ref<number>(-1);

  const modeInput = ref<InputSwitchOption>({
    options: ["Delivery", "Ambil sendiri"],
    model: "Delivery",
  });
  const dateInput = ref<InputDateOption>({
    model: "",
    value: "",
    threshold: new Date(),
  });
  const timeInput = ref<InputTimeOption>({
    model: "",
  });

  const mode: ComputedRef<string> = computed(() => modeInput.value.model);
  const dateRaw: ComputedRef<string> = computed(() => dateInput.value.model);
  const timeRaw: ComputedRef<string> = computed(() => timeInput.value.model);
  const date: ComputedRef<Date> = computed(
    () =>
      new Date(
        new Date(dateInput.value.value).setHours(
          parseInt(timeRaw.value?.split(":")[0] || "0"),
          parseInt(timeRaw.value?.split(":")[1] || "0"),
          0,
          0
        )
      )
  );

  const delay: ComputedRef<number> = computed(() =>
    Math.max(...props.data.group.items.map((a) => a.make_duration || 0))
  );
  const available: ComputedRef<number[]> = computed(() =>
    dataRestaurant.value?.opening_hours.map((a, i) => (a === "closed" ? -1 : i))
  );

  const months: string[] = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  function dateHandler(data: Date): string {
    const date: number = data.getDate();
    const month: number = data.getMonth();
    const year: number = data.getFullYear();

    return `${date} ${months[month]} ${year}`;
  }

  watch(
    () => props.state,
    (val) => {
      if (val === "hide") panelState.value = "hide";
    }
  );

  watch(
    () => dateRaw.value,
    (val) => {
      timeInput.value.model = "";
      if (val) {
        timeInput.value.date = new Date(dateInput.value.value);
      }
    }
  );

  onMounted(async () => {
    dataRestaurant.value = await getRestaurantCheckout(
      props.data.restaurant.code
    );

    setTimeout(() => {
      if (delay.value)
        dateInput.value.threshold = new Date(
          new Date().getTime() + 86400000 * delay.value
        );
      if (available.value?.length) dateInput.value.available = available.value;
      timeInput.value.opening_hours = dataRestaurant.value.opening_hours;
      dataLoading.value = false;
    }, 500);
  });
</script>

<style lang="scss" scoped>
  .rd-panel {
    .rd-panel-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      .rd-panel-input-switch-wrapper {
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
        display: flex;
      }
      span.rd-panel-name {
        position: relative;
        width: 100%;
        margin: 1rem 0;
      }
      .rd-panel-card-row {
        position: relative;
        left: -1rem;
        width: calc(100% + 2rem);
        padding: 0 1rem;
        margin-bottom: 5rem;
        box-sizing: border-box;
        display: flex;
        overflow-x: auto;
        .rd-panel-card {
          margin-bottom: 0;
        }
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .rd-panel-card {
        position: relative;
        border: var(--border);
        border-radius: 0.75rem;
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        box-sizing: border-box;
        display: flex;
        flex-shrink: 0;
        flex-direction: column;
        .rd-panel-card-header {
          position: relative;
          width: 100%;
          height: 2rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .rd-panel-card-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            border: var(--border);
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          span.rd-panel-card-tag {
            position: relative;
            height: 1rem;
            padding: 0 0.375rem;
            border-radius: 0.5rem;
            color: var(--primary-color);
            display: flex;
            justify-content: center;
            align-items: center;
            &::before {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              border-radius: 0.5rem;
              background: var(--primary-color);
              opacity: 0.1;
            }
          }
        }
        .rd-panel-card-body {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          span.rd-panel-card-placeholder {
            position: relative;
            margin-top: 0.125rem;
            &.rd-panel-card-placeholder-primary {
              cursor: pointer;
              color: var(--primary-color);
            }
          }
          .rd-panel-card-wrapper {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: space-between;
            .rd-panel-card-section {
              position: relative;
              width: calc(50% - 0.375rem);
              border-radius: 0.5rem;
              border: var(--border);
              padding: 0.5rem;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              span.rd-panel-card-placeholder {
                position: relative;
                margin-top: 0.75rem;
              }
            }
          }
        }
        .rd-panel-card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .rd-panel-card-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border-radius: 0.5rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            &::before {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              background: var(--primary-color);
              border-radius: 0.5rem;
              opacity: 0.1;
            }
          }
          span.rd-panel-card-message {
            position: relative;
            margin-top: 0.75rem;
            color: var(--primary-color);
          }
          &::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            background: var(--primary-color);
            opacity: 0.1;
          }
        }
      }
      span.rd-panel-section-name {
        position: relative;
        margin: 2rem 0 1rem 0;
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
