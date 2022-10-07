<template>
  <div class="rd-container" ref="rdContainer">
    <div v-if="restaurant" class="rd-header">
      <div class="rd-restaurant-name-container">
        <rd-input-button-small icon="arrow-left" />
        <h2
          class="rd-restaurant-name"
          :class="viewMode === 'mobile' ? 'rd-headline-5' : 'rd-headline-3'"
        >
          {{ restaurant.name }}
        </h2>
        <rd-input-button-small
          v-if="viewMode === 'mobile'"
          icon="information"
        />
      </div>
      <div v-if="viewMode === 'desktop'" class="rd-restaurant-order-method">
        <div class="rd-restaurant-order-method-details">
          <span class="rd-restaurant-order-method-value rd-headline-5"
            >Dine in</span
          >
          <span class="rd-restaurant-order-method-placeholder rd-caption-text"
            >13 menu tersedia</span
          >
        </div>
        <div class="rd-restaurant-order-method-icon-container">
          <rd-svg class="rd-restaurant-order-method-icon" name="table-chair" />
        </div>
      </div>
    </div>
    <div v-if="restaurant" class="rd-body">
      <div class="rd-restaurant-jumbotron">
        <div class="rd-restaurant-jumbotron-image-container">
          <img src="/background.svg" class="rd-restaurant-jumbotron-image" />
        </div>
        <div class="rd-restaurant-jumbotron-details">
          <div class="rd-restaurant-jumbotron-main-details">
            <div class="rd-restaurant-jumbotron-categories">
              <span
                v-for="n in restaurant.categories"
                :key="n"
                class="rd-restaurant-jumbotron-category rd-headline-6"
                >{{ restaurantTypes[n] }}</span
              >
            </div>
            <h1 class="rd-restaurant-jumbotron-name rd-headline-3">
              {{ restaurant.name }}
            </h1>
          </div>
          <div class="rd-restaurant-jumbotron-secondary-details">
            <div class="rd-restaurant-jumbotron-detail">
              <div class="rd-restaurant-jumbotron-icon-container">
                <rd-svg
                  class="rd-restaurant-jumbotron-icon"
                  name="star"
                  color="primary"
                />
              </div>
              <span class="rd-restaurant-jumbotron-value rd-headline-6"
                >4.8</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="rd-restaurant-details">
        <div class="rd-restaurant-details-row">
          <div class="rd-restaurant-detail rd-restaurant-detail-small">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="currency" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-placeholder rd-caption-text"
                >Harga</span
              >
              <span class="rd-restaurant-detail-value rd-headline-5">{{
                restaurantPriceLevels[restaurant.price_level]
              }}</span>
            </div>
          </div>
          <div class="rd-restaurant-detail rd-restaurant-detail-small">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="map-marker" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-placeholder rd-caption-text">{{
                restaurant.distance ? "Jarak" : "Lokasi"
              }}</span>
              <span class="rd-restaurant-detail-value rd-headline-5">{{
                restaurant.distance
                  ? `${(restaurant.distance / 1000).toFixed(2)}km`
                  : restaurantCity
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="viewMode === 'desktop'" class="rd-restaurant-details-row">
          <div class="rd-restaurant-detail rd-restaurant-detail-large">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="map-marker" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-placeholder rd-caption-text"
                >Alamat</span
              >
              <span class="rd-restaurant-detail-value rd-headline-5">{{
                restaurant.address
              }}</span>
            </div>
          </div>
        </div>
        <div v-if="viewMode === 'desktop'" class="rd-restaurant-details-row">
          <div class="rd-restaurant-detail rd-restaurant-detail-large">
            <div class="rd-restaurant-detail-icon-container">
              <rd-svg class="rd-restaurant-detail-icon" name="calendar" />
            </div>
            <div class="rd-restaurant-detail-value-container">
              <span class="rd-restaurant-detail-value rd-headline-5"
                >Jadwal Operasional</span
              >
            </div>
            <div
              v-for="(hour, i) in restaurant.opening_hours"
              :key="i"
              class="rd-restaurant-detail-day-container"
              :style="i === 0 ? 'margin-top: 0.75rem' : ''"
              :class="
                i === new Date().getDay()
                  ? 'rd-restaurant-detail-day-container-active'
                  : ''
              "
            >
              <div class="rd-restaurant-detail-day-icon-container">
                <span class="rd-restaurant-detail-day-icon rd-headline-3">{{
                  days[i][0]
                }}</span>
              </div>
              <div class="rd-restaurant-detail-value-container">
                <span
                  class="rd-restaurant-detail-placeholder rd-caption-text"
                  >{{ days[i] }}</span
                >
                <span class="rd-restaurant-detail-value rd-headline-5">{{
                  hour === "opened"
                    ? "24 jam"
                    : hour === "closed"
                    ? "Libur"
                    : `${hour.open} - ${hour.close}`
                }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-if="viewMode === 'mobile'" class="rd-restaurant-order-method">
          <div class="rd-restaurant-order-method-icon-container">
            <rd-svg
              class="rd-restaurant-order-method-icon"
              name="table-chair"
            />
          </div>
          <div class="rd-restaurant-order-method-details">
            <span class="rd-restaurant-order-method-value rd-headline-5"
              >Dine in</span
            >
            <span class="rd-restaurant-order-method-placeholder rd-caption-text"
              >13 menu tersedia</span
            >
          </div>
        </div>
      </div>
      <div
        v-for="(menus, i) in visibleMenus"
        :key="`${i}-${menus.category}`"
        class="rd-restaurant-menus"
      >
        <div class="rd-restaurant-menus-header">
          <span class="rd-restaurant-menus-category rd-headline-4">{{
            menus.category
          }}</span>
          <span class="rd-restaurant-menus-count rd-headline-4">{{
            `${menus.menus?.length} item`
          }}</span>
        </div>
        <div class="rd-restaurant-menus-body">
          <rd-menu
            v-for="menu in menus.menus"
            :key="menu._id"
            :data="menu"
            class="rd-restaurant-menu"
          />
        </div>
      </div>
    </div>
    <rd-progress-bar
      type="overlay"
      style="height: 100vh"
      :state="restaurantLoading ? 'show' : 'hide'"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ComputedRef } from "vue";
  import {
    RestaurantMenuCategories,
    RestaurantMenusResponse,
  } from "~~/interfaces/general";
  import { MenuPack } from "~~/interfaces/menus";
  import { Restaurant } from "~~/interfaces/restaurants";

  const route = useRoute();
  const { viewMode } = useMain();
  const { setAlert } = useAlert();
  const { restaurantTypes, getRestaurantDetails, getRestaurantMenus } =
    useRestaurants();

  const restaurantMenus = ref<{
    "dine-in": RestaurantMenusResponse;
    "pre-order": RestaurantMenusResponse;
  }>({
    "dine-in": null,
    "pre-order": null,
  });
  const restaurantLoading = ref<boolean>(true);
  const restaurant = ref<Restaurant>(null);

  const visibleMenus = ref<RestaurantMenuCategories[]>(null);
  const visibleMenuPacks = ref<MenuPack[]>(null);

  const restaurantPriceLevels: string[] = [
    "< 25k",
    "25k ~ 50k",
    "50k ~ 100k",
    "> 100k",
  ];

  const days: string[] = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];

  const restaurantCity: ComputedRef<string> = computed(() => {
    let str: string = "";
    if (!restaurant.value) str = "Indonesia";
    const index: number = restaurant.value.formatted_address.findIndex((a) => {
      a = a.toLowerCase();
      return (
        a.includes("kota") || a.includes("kabupaten") || a.includes("kab.")
      );
    });
    if (index > -1) {
      str = restaurant.value.formatted_address[index];
      if (viewMode.value === "mobile") {
        str = str
          .toLowerCase()
          .replace(/(kota)|(kabupaten)|(kab\.)|(kab)| /g, "");
      }
    } else {
      str = restaurant.value.formatted_address[1];
    }
    return str;
  });
  const restaurantOrderMethod: ComputedRef<"dine-in" | "pre-order"> = computed(
    () => {
      let str: string = route.query.type.toString();
      if (str === "booking" || (str !== "dine-in" && str !== "pre-order"))
        return "dine-in";
      return str;
    }
  );

  onMounted(async () => {
    try {
      restaurant.value = await getRestaurantDetails(
        route.params.code.toString()
      );
      restaurantMenus.value[restaurantOrderMethod.value] =
        await getRestaurantMenus(
          route.params.code.toString(),
          restaurantOrderMethod.value
        );
      visibleMenus.value =
        restaurantMenus.value[restaurantOrderMethod.value].categories;
      console.log(visibleMenus.value);
      visibleMenuPacks.value =
        restaurantMenus.value[restaurantOrderMethod.value].packs || [];
      setTimeout(() => {
        restaurantLoading.value = false;
      }, 500);
    } catch (e) {
      setAlert({
        type: "error",
        title: "Tidak dapat memuat restoran",
        message: "Terjadi masalah memuat restoran",
      });
    }
  });
</script>

<style lang="scss" scoped>
  .rd-container {
    position: relative;
    width: 100vw;
    display: flex;
    flex-direction: column;
    .rd-header {
      z-index: 2;
      position: fixed;
      width: 100%;
      height: 4rem;
      padding: 0 1rem;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .rd-restaurant-name-container {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .rd-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      > * {
        flex-shrink: 0;
      }
      .rd-restaurant-jumbotron {
        position: relative;
        width: 100%;
        height: 17.5rem;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
        overflow: hidden;
        background: var(--background-depth-three-color);
        display: flex;
        flex-shrink: 0;
        justify-content: flex-start;
        align-items: flex-start;
        .rd-restaurant-jumbotron-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          img.rd-restaurant-jumbotron-image {
            position: relative;
            width: 100%;
            height: 100%;
            border-bottom-left-radius: 1rem;
            border-bottom-right-radius: 1rem;
            object-fit: cover;
          }
        }
        .rd-restaurant-jumbotron-details {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          border-radius: 1rem;
          padding: 1rem 0;
          background: rgba(0, 0, 0, 0.25);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          .rd-restaurant-jumbotron-main-details {
            position: relative;
            width: calc(100% - 3.5rem);
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            .rd-restaurant-jumbotron-categories {
              position: relative;
              width: 100%;
              height: 1rem;
              margin-bottom: 0.5rem;
              padding-left: 1rem;
              overflow-x: visible;
              display: flex;
              justify-content: flex-start;
              align-items: flex-start;
              span.rd-restaurant-jumbotron-category {
                position: relative;
                height: 1rem;
                padding: 0 0.375rem;
                margin-right: 0.5rem;
                color: #ccc;
                background: rgba(0, 0, 0, 0.25);
                border-radius: 0.5rem;
                white-space: nowrap;
                display: flex;
                justify-content: center;
                align-items: center;
              }
            }
            h1.rd-restaurant-jumbotron-name {
              position: relative;
              color: #fff;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              line-height: 1.15;
              margin-left: 1rem;
            }
          }
          .rd-restaurant-jumbotron-secondary-details {
            position: relative;
            width: 2.5rem;
            height: 2.5rem;
            margin-right: 1rem;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            .rd-restaurant-jumbotron-detail {
              position: relative;
              width: 2.5rem;
              height: 2.5rem;
              border-radius: 0.75rem;
              background: rgba(0, 0, 0, 0.25);
              backdrop-filter: blur(10px);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              .rd-restaurant-jumbotron-icon-container {
                position: relative;
                width: 0.85rem;
                height: 0.85rem;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              span.rd-restaurant-jumbotron-value {
                position: relative;
                color: #ccc;
                margin-top: 0.125rem;
              }
            }
          }
        }
      }
      .rd-restaurant-details {
        position: relative;
        width: 100%;
        padding: 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-restaurant-details-row {
          position: relative;
          width: 100%;
          margin-bottom: 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          .rd-restaurant-detail {
            position: relative;
            width: 100%;
            height: 2rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .rd-restaurant-detail-icon-container {
              position: relative;
              width: 2rem;
              height: 2rem;
              border-radius: 0.75rem;
              border: var(--border);
              padding: 0 0.5rem;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .rd-restaurant-detail-value-container {
              position: relative;
              width: calc(100% - 2rem);
              height: 100%;
              padding-left: 0.5rem;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: flex-start;
              span.rd-restaurant-detail-placeholder {
                position: relative;
                margin-bottom: 0.125rem;
              }
            }
            &.rd-restaurant-detail-small {
              width: 50%;
            }
            // &.rd-restaurant-detail-large {
            //   .rd-restaurant-detail-value-container {
            //     span.rd-restaurant-detail-value {
            //       position: relative;
            //       width: 100%;
            //       padding-right: 25%;
            //       box-sizing: border-box;
            //     }
            //   }
            // }
          }
        }
        .rd-restaurant-order-method {
          position: relative;
          width: 100%;
          border: var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .rd-restaurant-order-method-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border: var(--border);
            border-radius: 0.5rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .rd-restaurant-order-method-details {
            position: relative;
            width: calc(100% - 2rem);
            height: 100%;
            padding-left: 0.5rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            span.rd-restaurant-order-method-placeholder {
              position: relative;
              margin-top: 0.125rem;
            }
          }
        }
      }
      .rd-restaurant-menus {
        position: relative;
        width: 100%;
        padding: 0 1rem;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .rd-restaurant-menus-header {
          position: relative;
          width: 100%;
          height: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .rd-restaurant-menus-body {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        &:last-child {
          margin: 0 0 1rem 0;
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      height: 100vh;
      flex-direction: row;
      overflow-x: auto;
      .rd-header {
        position: fixed;
        top: 0;
        left: 0;
        height: 6rem;
        border-bottom: var(--border);
        background: var(--background-depth-one-color);
        padding: 2rem;
        box-sizing: border-box;
        justify-content: space-between;
        .rd-restaurant-name-container {
          width: auto;
          h2.rd-restaurant-name {
            position: relative;
            margin-left: 1rem;
          }
        }
        .rd-restaurant-order-method {
          position: relative;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          .rd-restaurant-order-method-icon-container {
            position: relative;
            width: 2rem;
            height: 2rem;
            border: var(--border);
            border-radius: 0.5rem;
            padding: 0 0.5rem;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .rd-restaurant-order-method-details {
            position: relative;
            width: calc(100% - 2rem);
            height: 100%;
            padding-right: 1rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            span.rd-restaurant-order-method-placeholder {
              position: relative;
              margin-top: 0.125rem;
              text-align: right;
            }
            span.rd-restaurant-order-method-value {
              position: relative;
              text-align: right;
            }
          }
        }
      }
      .rd-body {
        position: absolute;
        bottom: 0;
        left: 0;
        width: auto;
        height: calc(100% - 6rem);
        flex-direction: row;
        .rd-restaurant-jumbotron {
          width: 30rem;
          height: calc(100vh - 6rem);
          border-radius: 0;
          .rd-restaurant-jumbotron-details {
            bottom: 2rem;
            left: 2rem;
            width: calc(100% - 4rem);
          }
        }
        .rd-restaurant-details {
          width: 20rem;
          height: calc(100% - 4rem);
          margin: 2rem 0 2rem 2rem;
          padding: 1rem;
          border: var(--border);
          border-radius: 1rem;
          overflow-y: auto;
          box-sizing: border-box;
          background: var(--background-depth-one-color);
          .rd-restaurant-details-row {
            .rd-restaurant-detail {
              height: auto;
              padding: 0.75rem;
              border-radius: 0.75rem;
              border: var(--border);
              background: var(--background-depth-one-color);
              box-sizing: border-box;
              flex-direction: column;
              align-items: flex-start;
              .rd-restaurant-detail-value-container {
                margin-top: 1rem;
                width: 100%;
                padding: 0;
                span.rd-restaurant-detail-placeholder {
                  margin-bottom: 0.125rem;
                }
              }
              .rd-restaurant-detail-day-container {
                position: relative;
                width: 100%;
                height: 2rem;
                margin-bottom: 0.75rem;
                display: flex;
                align-items: center;
                .rd-restaurant-detail-day-icon-container {
                  position: relative;
                  width: 2rem;
                  height: 2rem;
                  margin: 0 0.5rem 0 0;
                  border-radius: 0.5rem;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  span.rd-restaurant-detail-day-icon {
                    position: relative;
                    line-height: 1;
                  }
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
                    filter: grayscale(1);
                  }
                }
                .rd-restaurant-detail-value-container {
                  width: calc(100% - 2.5rem);
                  margin-top: 0;
                }
                &.rd-restaurant-detail-day-container-active {
                  .rd-restaurant-detail-day-icon-container {
                    span.rd-restaurant-detail-day-icon {
                      color: var(--primary-color);
                    }
                    &::before {
                      filter: grayscale(0);
                    }
                  }
                }
                &:last-child {
                  margin-bottom: 0;
                }
              }
              &.rd-restaurant-detail-small {
                width: calc(50% - 0.375rem);
              }
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .rd-restaurant-menus {
          width: 20rem;
          height: calc(100% - 4rem);
          margin: 2rem 0 2rem 2rem;
          padding: 1rem;
          border: var(--border);
          border-radius: 1rem;
          overflow-y: auto;
          box-sizing: border-box;
          background: var(--background-depth-one-color);
          .rd-restaurant-menus-header {
            top: -1rem;
            left: -1rem;
            width: calc(100% + 2rem);
            height: 3rem;
            padding: 1rem;
            border-bottom: var(--border);
            box-sizing: border-box;
          }
          &:last-child {
            margin: 0 2rem 0 0;
          }
        }
      }
    }
  }
</style>
