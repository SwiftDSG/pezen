<template>
  <div class="rd-container" ref="rdContainer">
    <div v-if="viewMode === 'mobile'" class="rd-header">
      <rd-input-button-small class="rd-notification" icon="bell" />
      <rd-input-button-small class="rd-profile" image="/user-default.svg" />
    </div>
    <div v-if="viewMode === 'mobile'" class="rd-greet-container">
      <h3 class="rd-greet-subtitle rd-subtitle-text">
        {{ `Selamat ${time[hour]}` }}
      </h3>
      <h1 class="rd-greet-title rd-headline-2">
        {{ user ? user.name : "Food Lovers" }}
      </h1>
    </div>
    <div v-if="viewMode === 'mobile'" class="rd-search-container">
      <rd-input-search
        class="rd-search"
        :input="searchInput"
        @click="
          emits('open-panel', {
            state: 'show',
            type: 'search',
          })
        "
      />
      <rd-input-button-small
        class="rd-search-code"
        icon="qr-code"
        @clicked="
          emits('open-panel', {
            state: 'show',
            type: 'scanner',
          })
        "
      />
    </div>
    <div v-if="viewMode === 'mobile'" class="rd-mobile-column">
      <rd-geolocation-prompt
        v-if="!positionSelected"
        @open-panel="
          emits('open-panel', {
            state: 'show',
            type: 'addresses',
          })
        "
      />
      <rd-address
        v-else
        type="current"
        :data="positionSelected"
        @clicked="
          emits('open-panel', {
            state: 'show',
            type: 'addresses',
          })
        "
      />
      <div v-if="homeData?.menus['pack']?.length" class="rd-mobile-row">
        <rd-menus-scheduled
          label="Jadwal Menu"
          :data="homeData.menus['pack']"
        />
      </div>
      <div class="rd-navigation-container">
        <div
          v-for="(navigation, i) in navigations"
          :key="i"
          class="rd-navigation"
        >
          <div class="rd-navigation-icon-container">
            <rd-svg class="rd-navigation-icon" :name="navigation.icon" />
          </div>
          <div class="rd-navigation-details">
            <span class="rd-navigation-name rd-headline-6">{{
              navigation.name
            }}</span>
          </div>
        </div>
      </div>
      <div v-if="homeData?.menus['pre-order']?.length" class="rd-mobile-row">
        <rd-menus-list
          label="Pre-order di dekatmu!"
          :data="homeData?.menus['pre-order']"
        />
      </div>
      <div v-if="homeData?.menus['dine-in']?.length" class="rd-mobile-row">
        <rd-menus-list
          label="Cobain ini yuk!"
          :data="homeData?.menus['dine-in']"
        />
      </div>
    </div>
    <div
      v-if="viewMode === 'desktop'"
      class="rd-desktop-row"
      style="margin-bottom: 1rem"
    >
      <rd-geolocation-prompt
        v-if="!positionSelected"
        style="margin-top: 2rem"
        @open-panel="
          emits('open-panel', {
            state: 'show',
            type: 'addresses',
          })
        "
      />
      <div v-else class="rd-address-container">
        <div class="rd-address-header">
          <span class="rd-address-title rd-headline-5">Lokasi</span>
          <div class="rd-address-icon-container">
            <rd-svg class="rd-address-icon" name="crosshairs-gps" />
          </div>
        </div>
        <rd-address
          size="desktop"
          type="current"
          :data="positionSelected"
          @clicked="
            emits('open-panel', {
              state: 'show',
              type: 'addresses',
            })
          "
        />
        <rd-input-button
          label="Ubah"
          class="rd-address-button"
          @clicked="
            emits('open-panel', {
              state: 'show',
              type: 'addresses',
            })
          "
        />
      </div>
      <div class="rd-desktop-column rd-desktop-column-xl">
        <rd-menus-scheduled
          label="Jadwal Menu"
          :data="homeData?.menus['pack'] || []"
        />
      </div>
      <div class="rd-desktop-column">
        <div class="rd-navigation-header">
          <span class="rd-navigation-title rd-headline-3">Cari Restoran</span>
        </div>
        <div class="rd-navigation-container">
          <div
            v-for="(navigation, i) in navigations"
            :key="i"
            class="rd-navigation"
          >
            <div class="rd-navigation-icon-container">
              <rd-svg class="rd-navigation-icon" :name="navigation.icon" />
            </div>
            <div class="rd-navigation-details">
              <span class="rd-navigation-name rd-headline-5">{{
                navigation.name
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="viewMode === 'desktop'" class="rd-desktop-row rd-desktop-row-xl">
      <div class="rd-desktop-column">
        <rd-menus-list
          v-if="homeData?.menus['pre-order']?.length"
          label="Pre-order di dekatmu!"
          :data="homeData?.menus['pre-order']"
        />
      </div>
      <div class="rd-desktop-column">
        <rd-menus-list
          v-if="homeData?.menus['dine-in']?.length"
          label="Cobain makan ini yuk!"
          :data="homeData?.menus['dine-in']"
        />
      </div>
      <div class="rd-desktop-column">
        <rd-restaurants-list
          v-if="homeData?.restaurants['popular']?.length"
          :label="'Restoran populer disekitarmu'"
          :data="homeData?.restaurants['popular']"
        />
      </div>
      <div class="rd-desktop-column">
        <rd-restaurants-list
          v-if="homeData?.restaurants['reservable']?.length"
          :label="'Yuk booking untuk acaramu!'"
          :data="homeData?.restaurants['reservable']"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import { InputSearchOption } from "~~/interfaces/general";

  interface Navigation {
    icon: string;
    name: string;
    to: string;
  }

  const { user } = useUser();
  const { positionSelected, viewMode, homeData, getHomeData } = useMain();
  const emits = defineEmits(["open-panel"]);

  const searchInput = ref<InputSearchOption>({
    name: "query",
    placeholder: "Mau makan apa hari ini?",
    model: "",
    type: "secondary",
  });

  const navigations: Navigation[] = [
    {
      name: "Resto populer",
      icon: "seal",
      to: "",
    },
    {
      name: "Resto terdekat",
      icon: "map-marker",
      to: "",
    },
    {
      name: "Reservasi populer",
      icon: "table-chair",
      to: "",
    },
    {
      name: "Katering populer",
      icon: "calendar-range",
      to: "",
    },
  ];

  const hour: ComputedRef<number> = computed(() => {
    const hour: number = new Date().getHours();
    let i = 3;
    if (hour >= 3 && hour < 11) i = 0;
    else if (hour >= 11 && hour < 15) i = 1;
    else if (hour >= 15 && hour < 18) i = 2;
    else i = 3;
    return i;
  });

  const time: string[] = ["pagi", "siang", "sore", "malam"];

  onMounted(() => {
    getHomeData();
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100%;
    padding: 0 1rem 4.5rem 1rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    transform-origin: center 50vh;
    .rd-header {
      position: relative;
      width: 100%;
      height: 4rem;
      padding: 1rem 0;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
    }
    .rd-greet-container {
      position: relative;
      width: 100%;
      margin: 1rem 0;
      display: flex;
      flex-direction: column;
    }
    .rd-search-container {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: space-between;
      .rd-search {
        position: relative;
        width: calc(100% - 2.5rem);
      }
    }
    .rd-mobile-column {
      position: relative;
      width: 100%;
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .rd-mobile-row {
        position: relative;
        width: 100%;
        margin-bottom: 0.5rem;
      }
    }
    .rd-navigation-container {
      position: relative;
      width: 100%;
      gap: 0.5rem;
      margin-top: 1rem;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;
      .rd-navigation {
        position: relative;
        width: calc(50% - 0.25rem);
        padding: 0.75rem;
        border-radius: 0.75rem;
        border: var(--border);
        box-sizing: border-box;
        background: var(--background-depth-one-color);
        display: flex;
        flex-direction: column;
        transition: 0.125s border-color cubic-bezier(0.445, 0.05, 0.55, 0.95);
        .rd-navigation-icon-container {
          position: relative;
          width: 1.5rem;
          height: 1.5rem;
          margin-bottom: 1rem;
          border-radius: 0.5rem;
          background: var(--background-depth-three-color);
          padding: 0 0.25rem;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.125s background-color
            cubic-bezier(0.445, 0.05, 0.55, 0.95);
        }
        .rd-navigation-details {
          position: relative;
          width: 100%;
          padding: 0;
          display: flex;
          flex-direction: column;
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      padding: 6rem 2rem 4.5rem 2rem;
      .rd-desktop-row {
        position: relative;
        width: 100%;
        height: 15rem;
        gap: 1rem;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .rd-desktop-column {
          position: relative;
          width: calc((100% - 3rem) / 4);
          height: 100%;
          display: flex;
          flex-direction: column;
          &.rd-desktop-column-xl {
            width: calc(((100% - 3rem) * 3 / 4) - 9rem);
          }
        }
        &.rd-desktop-row-xl {
          height: calc(2rem + ((100vw - 5rem) / 4));
        }
      }
      .rd-address-container {
        position: relative;
        width: 10rem;
        height: calc(100% - 2rem);
        padding: 0.75rem;
        border-radius: 0.75rem;
        background: var(--background-depth-one-color);
        border: var(--border);
        box-sizing: border-box;
        margin-top: 2rem;
        flex-direction: column;
        align-items: flex-start;
        .rd-address-header {
          position: relative;
          width: 100%;
          height: 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-address-icon-container {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: 0.5rem;
            background: var(--background-depth-three-color);
            padding: 0 0.25rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: 0.125s background-color
              cubic-bezier(0.445, 0.05, 0.55, 0.95);
          }
        }
        .rd-address-button {
          width: 100%;
          margin-top: 0.5rem;
        }
      }
      .rd-navigation-header {
        position: relative;
        width: 100%;
        height: 2rem;
        display: flex;
        flex-shrink: 0;
        justify-content: space-between;
        align-items: center;
      }
      .rd-navigation-container {
        height: calc(100% - 2rem);
        margin-top: 0;
        .rd-navigation {
          height: calc(50% - 0.25rem);
          justify-content: space-between;
        }
      }
    }
  }
</style>
