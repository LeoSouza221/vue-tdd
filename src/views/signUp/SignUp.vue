<template>
  <h1>Sign Up</h1>

  <div>
    <label for="username">Username</label>
    <input
      type="text"
      id="username"
      v-model="form.username"
    />
  </div>

  <div>
    <label for="email">Email</label>
    <input
      type="text"
      id="email"
      v-model="form.email"
    />
  </div>

  <div>
    <label for="password">Password</label>
    <input
      type="password"
      id="password"
      v-model="form.password"
    />
  </div>

  <div>
    <label for="confirmPassword">Confirm Password</label>
    <input
      type="password"
      id="confirmPassword"
      v-model="form.confirmPassword"
    />
  </div>

  <button
    :disabled="isDisabled"
    @click="submit"
    >Sign up</button
  >
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

  axios.post('api/v1/users', body);
};
</script>
