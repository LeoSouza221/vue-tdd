<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-lg-2">
    <form
      class="card"
      @submit="submit"
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

        <div class="text-center">
          <button
            class="btn btn-primary"
            :disabled="isDisabled"
            type="submit"
            >Sign up</button
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { computed, reactive } from 'vue';

const form = reactive({
  password: '',
  confirmPassword: '',
  email: '',
  username: '',
});

const isDisabled = computed(() => {
  return form.password || form.confirmPassword ? form.password !== form.confirmPassword : true;
});

const submit = () => {
  const { confirmPassword, ...body } = form;

  console.log('teste', body);
  axios.post('api/v1/users', body);
};
</script>
