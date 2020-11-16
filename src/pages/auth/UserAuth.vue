<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An error occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="email">E-mail</label>
          <input type="text" name="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" name="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">
          Please enter valid email address and password(must be atleast 6
          characters long).
        </p>
        <base-button>{{ submitButtonCaption }}</base-button>
        <base-button type="button" mode="flat" @click="switchAuthMode">{{
          switchModeCaption
        }}</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            email:'',
            password:'',
            formIsValid: true,
            mode: 'login',
            isLoading:false,
            error:null
        };
    },
    computed:{
        submitButtonCaption(){
            if (this.mode === 'login') {
                return 'Login';
            } else {
                return 'Signup';
            }
        },
        switchModeCaption(){
            if (this.mode === 'login') {
                return 'Signup instead';
            } else {
                return 'login instead';
            }
        }
    },
    methods:{
        async submitForm(){
                this.formIsValid = true;
            if (this.email === '' || !this.email.includes('@') || this.password.length < 6) {
                this.formIsValid = false;
                return;
            }
            this.isLoading = true;
            const redirectUrl = '/' + (this.$route.query.redirect || 'coaches');
            try {
                await this.$store.dispatch('authenticate',{
                    email: this.email,
                    password: this.password,
                    mode: this.mode
                })
                this.$router.replace(redirectUrl);
            } catch (error) {
                this.error = error.message || 'Failed to Autnenticate';
                this.isLoading = false;
            }
                this.isLoading = false;
        },
        switchAuthMode(){
            if (this.mode === 'login') {
                this.mode = 'signup';
            } else {
                this.mode = 'login';
            }
        },
        handleError(){
            this.error = null;
        }
    }
}
</script>

<style>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>