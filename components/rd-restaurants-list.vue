<template>
  <div class="rd-component" ref="rdComponent">
    <div class="rd-header">
      <span class="rd-title rd-headline-3">{{ label }}</span>
    </div>
    <div class="rd-body">
      <div
        v-for="restaurant in data"
        :key="restaurant._id"
        class="rd-restaurant"
      >
        <div class="rd-restaurant-logo-section">
          <div class="rd-restaurant-logo-container">
            <img
              :src="restaurant.logo_url || '/menu-default.svg'"
              class="rd-restaurant-logo"
            />
          </div>
          <div
            v-if="
              !lessThanMonth(new Date(restaurant.create_date)) &&
              restaurant.rating?.count
            "
            class="rd-restaurant-rating"
          >
            <div class="rd-restaurant-rating-icon-container">
              <rd-svg
                class="rd-restaurant-rating-icon"
                name="start"
                color="primary"
              />
            </div>
            <span class="rd-restaurant-rating-value rd-headline-6">{{
              restaurant.rating?.value?.toFixed(2) || "0.00"
            }}</span>
          </div>
          <div class="rd-restaurant-rating rd-restaurant-rating-new">
            <div class="rd-restaurant-rating-icon-container">
              <rd-svg
                class="rd-restaurant-rating-icon"
                name="alert-decagram"
                color="secondary"
              />
            </div>
            <span class="rd-restaurant-rating-value rd-headline-6">New</span>
          </div>
        </div>
        <div class="rd-restaurant-details-section">
          <div class="rd-restaurant-types">
            <span
              v-for="i in restaurant.categories"
              :key="i"
              class="rd-restaurant-type rd-caption-text"
            >
              {{ restaurantTypes[i] }}
            </span>
          </div>
          <div class="rd-restaurant-name-container">
            <span class="rd-restaurant-name rd-headline-5">{{
              restaurant.name
            }}</span>
          </div>
          <div class="rd-restaurant-location">
            <div class="rd-restaurant-location-icon-container">
              <rd-svg class="rd-restaurant-location-icon" name="map-marker" />
            </div>
            <div class="rd-restaurant-location-details">
              <span class="rd-restaurant-location-placeholder rd-caption-text"
                >Lokasi</span
              >
              <span class="rd-restaurant-location-value rd-headline-6">{{
                restaurant.formatted_address[2]
                  .toLowerCase()
                  .replace(/kab\.|kabupaten|kota|regency/gi, "")
                  .trim()
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Restaurant } from "~~/interfaces/restaurants";

  const { restaurantTypes } = useRestaurants();
  const props = defineProps<{
    label: string;
    data: Restaurant[];
  }>();

  function lessThanMonth(date: Date): boolean {
    const now = new Date().getTime();
    return now - date.getTime() <= 2592000000;
  }
</script>

<style lang="scss" scoped>
  .rd-component {
    .rd-header {
      position: relative;
      width: 100%;
      height: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .rd-body {
      position: relative;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      .rd-restaurant {
        position: relative;
        width: 100%;
        height: 5.5rem;
        padding: 0.75rem 0 0.75rem 0.75rem;
        margin-bottom: 0.5rem;
        border-radius: 0.75rem;
        border: var(--border);
        overflow: hidden;
        background: var(--background-depth-one-color);
        box-sizing: border-box;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        .rd-restaurant-logo-section {
          position: relative;
          width: 4rem;
          height: 4rem;
          display: flex;
          background: var(--background-depth-three-color);
          border-radius: 0.5rem;
          .rd-restaurant-logo-container {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            img.rd-restaurant-logo {
              position: relative;
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 0.5rem;
            }
          }
          .rd-restaurant-rating {
            position: absolute;
            bottom: -0.5rem;
            left: 50%;
            height: 1rem;
            background: #fff;
            border-radius: 0.5rem;
            padding: 0 0.375rem 0 0.25rem;
            box-sizing: border-box;
            border: var(--border);
            transform: translateX(-50%);
            display: flex;
            justify-content: center;
            align-items: center;
            .rd-restaurant-rating-icon-container {
              position: relative;
              width: 0.75rem;
            }
            span.rd-restaurant-rating-value {
              position: relative;
              margin-left: 0.125rem;
              line-height: 1;
            }
            &.rd-restaurant-rating-new {
              background-color: var(--error-color);
              border-color: var(--error-color);
              span.rd-restaurant-rating-value {
                color: #fff;
              }
            }
          }
        }
        .rd-restaurant-details-section {
          position: relative;
          width: calc(100% - 4rem);
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          .rd-restaurant-types {
            position: relative;
            width: 100%;
            padding-left: 0.5rem;
            overflow-x: auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            span.rd-restaurant-type {
              position: relative;
              height: 1rem;
              padding: 0 0.25rem;
              box-sizing: border-box;
              border-radius: 0.5rem;
              border: var(--border);
              margin-right: 0.25rem;
              display: flex;
              justify-content: center;
              align-items: center;
              white-space: nowrap;
              &:last-child {
                margin-right: 0.75rem;
              }
            }
          }
          .rd-restaurant-name-container {
            position: relative;
            width: 100%;
            height: calc(100% - 2.5rem);
            padding: 0 0.75rem 0 0.5rem;
            display: flex;
            align-items: center;
            span.rd-restaurant-name {
              position: relative;
              width: 100%;
              line-height: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .rd-restaurant-location {
            position: absolute;
            bottom: 0;
            left: 0.5rem;
            height: 1.5rem;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            .rd-restaurant-location-icon-container {
              position: relative;
              width: 1.5rem;
              height: 1.5rem;
              border-radius: 0.5rem;
              border: var(--border);
              padding: 0 0.25rem;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .rd-restaurant-location-details {
              position: relative;
              height: 100%;
              margin-left: 0.25rem;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              span.rd-restaurant-location-placeholder {
                position: relative;
                margin-bottom: 0.125rem;
              }
            }
          }
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      .rd-header {
        height: 2rem;
        flex-shrink: 0;
      }
      .rd-body {
        .rd-restaurant {
          height: calc((((100vw - 5rem) / 4) - 1rem) / 3);
          .rd-restaurant-logo-section {
            width: calc((25vw - 6.75rem - 6px) / 3);
            height: calc((25vw - 6.75rem - 6px) / 3);
          }
          .rd-restaurant-details-section {
            width: calc(100% - ((25vw - 6.75rem - 6px) / 3));
          }
        }
      }
    }
  }
</style>
