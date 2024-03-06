<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-lg-2">
    <form
      v-if="!successMessage"
      class="card"
      @submit.prevent="submit"
      data-testId="form-sign-up"
    >
      <div class="card-header text-center">
        <h1>Sign Up</h1>
      </div>

      <div class="card-body">
        <div class="mb-3">
          <label
            class="form-label"
            for="username"
            >Username</label
          >
          <input
            class="form-control"
            type="text"
            id="username"
            v-model="form.username"
          />
        </div>

        <div class="mb-3">
          <label
            class="form-label"
            for="email"
            >Email</label
          >
          <input
            class="form-control"
            type="text"
            id="email"
            v-model="form.email"
          />
        </div>

        <div class="mb-3">
          <label
            class="form-label"
            for="password"
            >Password</label
          >
          <input
            class="form-control"
            type="password"
            id="password"
            v-model="form.password"
          />
        </div>

        <div class="mb-3">
          <label
            class="form-label"
            for="confirmPassword"
            >Confirm Password</label
          >
          <input
            class="form-control"
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
          />
        </div>

        <div class="text-center mb-3">
          <button
            :disabled="isDisabled || apiRequest"
            class="btn btn-primary"
            type="submit"
          >
            <span
              v-if="apiRequest"
              class="spinner-border spinner-border-sm"
              role="status"
            ></span>
            Sign up
          </button>
        </div>
        <div
          v-if="hasError"
          class="alert alert-danger"
          role="alert"
        >
          Unexpected error occurred, please try again
        </div>
      </div>
    </form>
    <div
      v-if="successMessage"
      class="alert alert-success"
      role="alert"
    >
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, reactive, ref } from 'vue';

const apiRequest = ref(false);
const hasError = ref(false);
const successMessage = ref();
const form = reactive({
  password: '',
  confirmPassword: '',
  email: '',
  username: '',
});

const isDisabled = computed(() => {
  return form.password || form.confirmPassword ? form.password !== form.confirmPassword : true;
});

const submit = async () => {
  try {
    apiRequest.value = true;
    const { confirmPassword, ...body } = form;

    const response = await axios.post('/api/v1/users', body);

    if (response?.data) {
      const { data } = response;
      successMessage.value = data.message;
      hasError.value = false;
    }
  } catch (apiError) {
    hasError.value = true;
  } finally {
    apiRequest.value = false;
  }
};
</script>
