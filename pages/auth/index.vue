<template>
  <div class="rd-container" ref="rdContainer">
    <div class="rd-background-image-container">
      <img src="/background.svg" class="rd-background-image" />
    </div>
    <form class="rd-panel" @submit="submitHandler">
      <div class="rd-panel-header">
        <div class="rd-panel-logo-container">
          <img src="/logo-type.svg" class="rd-panel-logo" />
        </div>
      </div>
      <div class="rd-panel-body">
        <div
          class="rd-panel-body-wrapper"
          :style="`transform: translateX(${panelIndex * -100}%)`"
        >
          <div class="rd-panel-title-container">
            <h1 class="rd-panel-title rd-headline-2">Selamat datang!</h1>
            <p class="rd-panel-message rd-body-text">
              Silahkan isi identitas anda untuk masuk ke Pezen
            </p>
          </div>
          <div class="rd-panel-input-container">
            <div class="rd-panel-input-wrapper" style="margin-bottom: 1rem">
              <rd-input-text class="rd-panel-input" :input="emailInput" />
            </div>
            <div class="rd-panel-input-wrapper">
              <rd-input-text class="rd-panel-input" :input="passwordInput" />
            </div>
          </div>
          <div class="rd-panel-button-container">
            <div class="rd-panel-error-container">
              <span class="rd-panel-error rd-caption-text">{{
                errorLogin
              }}</span>
            </div>
            <rd-input-button
              label="masuk"
              class="rd-panel-button"
              :disabled="!email || !password"
              :loading="loadingLogin"
              @clicked="userLogin"
            />
            <div class="rd-panel-caption-container">
              <span class="rd-panel-caption rd-caption-text"
                >Belum punya akun?
                <span
                  class="rd-panel-caption-highlight rd-headline-6"
                  @click="panelIndex = 1"
                  >Daftar</span
                >
              </span>
            </div>
          </div>
        </div>
        <div
          class="rd-panel-body-wrapper"
          :style="`transform: translateX(${panelIndex * -100}%)`"
        >
          <div class="rd-panel-title-container">
            <h1 class="rd-panel-title rd-headline-2">Masukkan emailmu</h1>
            <p class="rd-panel-message rd-body-text">
              Kami akan mengirim kode verifikasi untuk kamu.
            </p>
          </div>
          <div class="rd-panel-input-container">
            <div class="rd-panel-input-wrapper" style="margin-bottom: 1rem">
              <rd-input-text class="rd-panel-input" :input="regEmailInput" />
            </div>
          </div>
          <div class="rd-panel-button-container">
            <div class="rd-panel-error-container">
              <span class="rd-panel-error rd-caption-text">{{
                errorVerification
              }}</span>
            </div>
            <rd-input-button
              label="selanjutnya"
              class="rd-panel-button"
              @clicked="userVerification"
              :disabled="!regEmail"
              :loading="loadingVerification"
            />
            <div class="rd-panel-caption-container">
              <span class="rd-panel-caption rd-caption-text"
                >Sudah punya akun?
                <span
                  class="rd-panel-caption-highlight rd-headline-6"
                  @click="panelIndex = 0"
                  >Masuk</span
                >
              </span>
            </div>
          </div>
        </div>
        <div
          class="rd-panel-body-wrapper"
          :style="`transform: translateX(${panelIndex * -100}%)`"
        >
          <div class="rd-panel-title-container">
            <h1 class="rd-panel-title rd-headline-2">
              Masukkan kode verifikasi
            </h1>
            <p class="rd-panel-message rd-body-text">
              {{ `Kami mengirimnya pada ${regEmail}` }}
            </p>
          </div>
          <div class="rd-panel-input-container">
            <div class="rd-panel-input-wrapper" style="margin-bottom: 1rem">
              <rd-input-code class="rd-panel-input" :input="regCodeInput" />
            </div>
          </div>
          <div class="rd-panel-button-container">
            <div class="rd-panel-error-container">
              <span class="rd-panel-error rd-caption-text">{{
                errorVerify
              }}</span>
            </div>
            <rd-input-button
              label="varifikasi"
              class="rd-panel-button"
              @clicked="userVerify"
              :disabled="regCode.length !== 6"
              :loading="loadingVerify"
            />
            <div class="rd-panel-caption-container">
              <span class="rd-panel-caption rd-caption-text"
                >Sudah punya akun?
                <span
                  class="rd-panel-caption-highlight rd-headline-6"
                  @click="panelIndex = 0"
                  >Masuk</span
                >
              </span>
            </div>
          </div>
        </div>
        <div
          class="rd-panel-body-wrapper"
          :style="`transform: translateX(${panelIndex * -100}%)`"
        >
          <div class="rd-panel-title-container">
            <h1 class="rd-panel-title rd-headline-2">Langkah terakhir</h1>
            <p class="rd-panel-message rd-body-text">
              Silahkan lengkapi data diri kamu
            </p>
          </div>
          <div class="rd-panel-input-container">
            <div class="rd-panel-input-wrapper">
              <rd-input-text class="rd-panel-input" :input="regNameInput" />
            </div>
            <div class="rd-panel-input-wrapper">
              <rd-input-text class="rd-panel-input" :input="regPasswordInput" />
            </div>
            <div class="rd-panel-input-wrapper">
              <rd-input-text
                class="rd-panel-input"
                :input="regPasswordConfirmationInput"
              />
            </div>
          </div>
          <div class="rd-panel-button-container">
            <div class="rd-panel-error-container">
              <span class="rd-panel-error rd-caption-text">{{
                errorRegister
              }}</span>
            </div>
            <rd-input-button
              label="daftar"
              class="rd-panel-button"
              :disabled="
                !regName ||
                !regPassword ||
                !regPasswordConfirmation ||
                regPassword !== regPasswordConfirmation
              "
              :loading="loadingRegister"
              @clicked="userRegister"
            />
            <div class="rd-panel-caption-container">
              <span class="rd-panel-caption rd-caption-text"
                >Sudah punya akun?
                <span
                  class="rd-panel-caption-highlight rd-headline-6"
                  @click="panelIndex = 0"
                  >Masuk</span
                >
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
  import { create } from "domain";
  import { ComputedRef } from "vue";
  import { InputCodeOption, InputOption } from "~~/interfaces/general";
  import { UserMin } from "~~/interfaces/users";

  const { errorHandler } = useMain();
  const { setAlert } = useAlert();
  const { login, sendVerificationCode, verifyEmail, createAccount } = useUser();
  const emits = defineEmits(["shake"]);

  const emailInput = ref<InputOption>({
    name: "email",
    placeholder: "hello@mail.com",
    model: "",
    label: "Email",
    icon: "at",
    type: "email",
    disabled: false,
  });
  const passwordInput = ref<InputOption>({
    name: "password",
    placeholder: "ssst...",
    model: "",
    label: "Password",
    icon: "key",
    type: "password",
    disabled: false,
  });
  const regEmailInput = ref<InputOption>({
    name: "email",
    placeholder: "hello@mail.com",
    model: "",
    label: "Email",
    icon: "at",
    type: "email",
    disabled: false,
  });
  const regCodeInput = ref<InputCodeOption>({
    name: "code",
    length: 6,
    model: "",
    disabled: false,
  });
  const regNameInput = ref<InputOption>({
    name: "name",
    placeholder: "John Doe",
    model: "",
    label: "Name",
    icon: "account",
    error: "",
    disabled: false,
  });
  const regPasswordInput = ref<InputOption>({
    name: "password",
    placeholder: "ssst...",
    model: "",
    label: "Password",
    icon: "key",
    type: "password",
    error: "",
    disabled: false,
  });
  const regPasswordConfirmationInput = ref<InputOption>({
    name: "password",
    placeholder: "retype your password",
    model: "",
    label: "Password Confirmation",
    icon: "key",
    type: "password",
    error: "",
    disabled: false,
  });

  const panelIndex = ref<number>(0);

  const errorLogin = ref<string>("");
  const errorVerification = ref<string>("");
  const errorVerify = ref<string>("");
  const errorRegister = ref<string>("");

  const loadingLogin = ref<boolean>(false);
  const loadingVerification = ref<boolean>(false);
  const loadingVerify = ref<boolean>(false);
  const loadingRegister = ref<boolean>(false);

  const email: ComputedRef<string> = computed(() => emailInput.value.model);
  const password: ComputedRef<string> = computed(
    () => passwordInput.value.model
  );
  const regEmail: ComputedRef<string> = computed(
    () => regEmailInput.value.model
  );
  const regCode: ComputedRef<string> = computed(() => regCodeInput.value.model);
  const regName: ComputedRef<string> = computed(() => regNameInput.value.model);
  const regPassword: ComputedRef<string> = computed(
    () => regPasswordInput.value.model
  );
  const regPasswordConfirmation: ComputedRef<string> = computed(
    () => regPasswordConfirmationInput.value.model
  );

  function submitHandler(e: Event): void {
    e.preventDefault();
    if (panelIndex.value === 0) userLogin();
    else if (panelIndex.value === 1) userVerification();
    else if (panelIndex.value === 2) userVerify();
    else if (panelIndex.value === 3) userRegister();
  }

  function userLogin(): void {
    if (email.value && password.value && !loadingLogin.value) {
      loadingLogin.value = true;
      setTimeout(async () => {
        try {
          const user: UserMin = await login({
            email: email.value,
            password: password.value,
          });
          loadingLogin.value = false;
          errorLogin.value = "";
          console.log(user);
          // loginnnnn
        } catch (e) {
          emits("shake");
          loadingLogin.value = false;
          errorLogin.value = errorHandler(e?.message || "");
        }
      }, 500);
    }
  }
  function userVerification(): void {
    if (regEmail.value && !loadingVerification.value) {
      loadingVerification.value = true;
      setTimeout(async () => {
        try {
          await sendVerificationCode({ email: regEmail.value });
          panelIndex.value = 2;
          loadingVerification.value = false;
        } catch (e) {
          emits("shake");
          loadingVerification.value = false;
          errorVerification.value = errorHandler(e?.message || "");
        }
      }, 500);
    }
  }
  function userVerify(): void {
    if (regCode.value && !loadingVerify.value) {
      loadingVerify.value = true;
      setTimeout(async () => {
        try {
          await verifyEmail({ code: regCode.value, email: regEmail.value });
          panelIndex.value = 3;
          loadingVerify.value = false;
        } catch (e) {
          emits("shake");
          loadingVerify.value = false;
          errorVerify.value = errorHandler(e?.message || "");
        }
      }, 500);
    }
  }
  function userRegister(): void {
    if (
      regPassword.value === regPasswordConfirmation.value &&
      regName.value &&
      regPassword.value &&
      !loadingRegister.value
    ) {
      loadingRegister.value = true;
      setTimeout(async () => {
        try {
          await createAccount({
            code: regCode.value,
            email: regEmail.value,
            name: regName.value,
            password: regPassword.value,
          });
          panelIndex.value = 0;
          loadingRegister.value = false;
          setAlert({
            type: "success",
            title: "Anda telah terdaftar!",
            message: "Silahkan login untuk melanjutkan",
          });
        } catch (e) {
          emits("shake");
          loadingRegister.value = false;
          errorRegister.value = errorHandler(e?.message || "");
        }
      }, 500);
    }
  }

  watch(
    () => panelIndex.value,
    (val) => {
      emailInput.value.disabled = true;
      passwordInput.value.disabled = true;
      regEmailInput.value.disabled = true;
      regCodeInput.value.disabled = true;
      regNameInput.value.disabled = true;
      regPasswordInput.value.disabled = true;
      regPasswordConfirmationInput.value.disabled = true;
      if (val === 0) {
        emailInput.value.disabled = false;
        passwordInput.value.disabled = false;
      } else if (val === 1) {
        regEmailInput.value.disabled = false;
      } else if (val === 2) {
        regCodeInput.value.disabled = false;
      } else if (val === 3) {
        regNameInput.value.disabled = false;
        regPasswordInput.value.disabled = false;
        regPasswordConfirmationInput.value.disabled = false;
      }
    },
    {
      immediate: true,
    }
  );
  watch(
    () => regCode.value,
    (val) => {
      console.log(val);
    }
  );
</script>

<style lang="scss" scoped>
  .rd-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: flex-end;
    .rd-background-image-container {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      img.rd-background-image {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.25;
      }
    }
    .rd-panel {
      position: relative;
      width: 100%;
      background: var(--background-depth-one-color);
      padding: 1rem 0 0 0;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      .rd-panel-header {
        position: relative;
        width: 100%;
        height: 1.5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .rd-panel-logo-container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          img.rd-panel-logo {
            position: relative;
            height: 100%;
            object-fit: contain;
          }
        }
      }

      .rd-panel-body {
        position: relative;
        width: 100%;
        height: calc(100% - 1.5rem);
        padding-top: 2rem;
        box-sizing: border-box;
        display: flex;
        .rd-panel-body-wrapper {
          position: relative;
          width: 100%;
          padding: 0 1rem;
          box-sizing: border-box;
          display: flex;
          flex-shrink: 0;
          flex-direction: column;
          transition: 0.25s transform ease-in-out;
          .rd-panel-title-container {
            position: relative;
            width: 100%;
            margin-bottom: 1.5rem;
            display: flex;
            flex-direction: column;
            p.rd-panel-message {
              position: relative;
              margin-top: 0.25rem;
            }
          }
          .rd-panel-input-container {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            .rd-panel-input-wrapper {
              position: relative;
              width: 100%;
              display: flex;
              flex-direction: column;
            }
          }
          .rd-panel-button-container {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 0 1rem;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            .rd-panel-error-container {
              position: relative;
              width: 100%;
              height: 1.5rem;
              display: flex;
              justify-content: center;
              align-items: center;
              span.rd-panel-error {
                position: relative;
                color: var(--error-color);
              }
            }
            .rd-panel-caption-container {
              position: relative;
              width: 100%;
              height: 3rem;
              display: flex;
              justify-content: center;
              align-items: center;
              span.rd-panel-caption {
                position: relative;
                span.rd-panel-caption-highlight {
                  position: relative;
                  cursor: pointer;
                  color: var(--primary-color);
                }
              }
            }
          }
        }
      }
    }
    @media only screen and (min-width: 1025px) {
      .rd-background-image-container {
        position: relative;
        width: calc(100% - 20rem);
        height: 100%;
      }
      .rd-panel {
        width: 20rem;
        height: 100%;
        padding: 2rem 0 0 0;
        .rd-panel-header {
          height: 2rem;
        }
        .rd-panel-body {
          height: calc(100% - 2rem);
          padding-top: 2rem;
          .rd-panel-body-wrapper {
            padding: 0 2rem;
            .rd-panel-button-container {
              padding: 0 2rem;
              .rd-panel-caption-container {
                height: 3rem;
              }
            }
          }
        }
      }
    }
  }
</style>
