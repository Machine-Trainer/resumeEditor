<template>
    <b-form-group>
        <label for="resume">
            <font-awesome-icon icon="pencil-alt" />
            {{ $t('labels.resume') }} :
        </label>
        <b-form-textarea
            v-model="message"
            :placeholder="$t('placeholders.chatgpt')+'...'"
            rows="5"></b-form-textarea>
        <b-button
                v-b-tooltip.hover
                block type="button"
                @click="generateIntroduction"
                variant="info">
            <i class="fas fa-magic"></i>
            {{$t('toggles.generateIntroduction')}}
        </b-button>
        <div v-if="isLoading" class="d-flex justify-content-center mb-3">
            <b-spinner variant="info" type="grow">
                Loading...
            </b-spinner>
        </div>
        <markdown-editor
                id="resume"
                :value="getResume"
                @input="updateResume"
                theme="primary"
                :placeholder="$t('placeholders.resume')+'...'"
                height="200px"
                :toolbar="'redo undo | bold italic heading | link | numlist bullist quote | preview'"
        ></markdown-editor>
    </b-form-group>
</template>
<script>
    import { mapGetters } from 'vuex'
    import axios from 'axios';
    export default {
        name: 'resume',
        data(){
            return {
                message: '',
                isLoading: false,
            }
        },
        computed: {
            ...mapGetters([
                'getResume'
            ])
        },
        methods:{
            updateResume(e) {
                this.$store.commit('updateStateField', {field: 'resume', value: e})
            },
            generateIntroduction(){
                if(!this.message) return;
                const requestBody = {
                    "introduction": this.message,
                };
                const headers = {
                    'Content-Type': 'application/json',
                };
                this.isLoading=true;
                axios.post('http://localhost:8090/api/generateIntroduction', requestBody,{ headers })
                    .then(response => {
                        console.log(response.data['generatedContent']);
                        this.updateResume(response.data['generatedContent']);
                        this.description = response.data['generatedContent'];
                        this.isLoading=false;
                    })
                    .catch(error => {
                        this.isLoading=false;
                        console.log(error);
                    });
            },
        }
    }
</script>