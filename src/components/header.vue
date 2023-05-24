<template>
    <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-brand href="#">
            Soca Resume Editor
        </b-navbar-brand>
        <input type="file" @change="handleFileUpload" accept=".pdf"/>
        <div v-if="isLoading" class="d-flex justify-content-center mb-3">
            <b-spinner label="Loading...">
                Loading...
            </b-spinner>
        </div>
        <b-button :disabled="!selectedFile" @click="extractText" variant="primary">Extract Text</b-button>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav class="ml-auto">
                <b-nav-item >
                    <locale-changer/>
                </b-nav-item>
            </b-navbar-nav>
        </b-collapse>

    </b-navbar>
</template>

<script>
    import localeChanger from './form/localeChanger'
    import axios from 'axios'

    export default {
        name: 'appHeader',
        components: {localeChanger},
        data(){
            return {
                selectedFile: null,
                isLoading: false,
            };
        },
        methods: {
            handleFileUpload(event) {
                const file = event.target.files[0];
                const reader = new FileReader();

                reader.onload = () => {
                    this.selectedFile = file;
                };

                reader.readAsText(file);
                },
            extractText() {
                const formData = new FormData();
                formData.append("file", this.selectedFile);
                this.isLoading = true;
                axios.post('http://localhost:8090/api/parseResume', formData)
                .then(response => {
                    // Handle the response
                    console.log(response.data['model']);
                    this.$store.state.form.fullName = response.data['model']['fullName'];
                    this.$store.state.form.job = response.data['model']['job'];
                    this.$store.state.form.phone = response.data['model']['phone'];
                    this.$store.state.form.email = response.data['model']['email'];
                    this.$store.state.form.links = response.data['model']['links'];
                    this.$store.state.form.socialNetworks = response.data['model']['socialNetworks'];
                    this.$store.state.form.resume = response.data['model']['resume'];
                    this.$store.state.form.experiences = response.data['model']['experiences'];
                    this.$store.state.form.projects = response.data['model']['projects'];
                    this.$store.state.form.educations = response.data['model']['educations'];
                    this.$store.state.form.skills = response.data['model']['skills'];
                    this.$store.state.form.languages = response.data['model']['languages'];
                    this.$store.state.form.interests = response.data['model']['interests'];
                    this.isLoading = false;
                })
                .catch(error => {
                    // Handle the error
                    console.error(error);
                    this.isLoading = false;
                });
            }
            
        }
    }
</script>
