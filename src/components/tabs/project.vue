<template>
    <b-tab :title="$t('tabs.project')" id="projects">
        <b-form @submit.prevent="onSubmit" @reset="onReset">
            <b-form-group>
                <label for="project-name">
                    <font-awesome-icon icon="signature" />
                    {{ $t('labels.projectName') }} :
                </label>
                <b-form-input
                        :class="{ 'is-invalid' : validation.hasError('name')}"
                        id="project-name"
                        type="text"
                        required
                        v-model="name"
                        :placeholder="$t('placeholders.projectName')"
                ></b-form-input>
                <small class="text-danger">{{ validation.firstError('name')}}</small>
            </b-form-group>

            <b-form-group>
                <label for="project-link">
                    <font-awesome-icon icon="link" />
                    {{ $t('labels.projectLink') }} :
                </label>
                <b-form-input
                        :class="{ 'is-invalid' : validation.hasError('link')}"
                        id="project-link"
                        type="url"
                        v-model="link"
                        :placeholder="$t('placeholders.projectLink')"
                ></b-form-input>
                <small class="text-danger">{{ validation.firstError('link')}}</small>
            </b-form-group>

            <b-form-group>
                <label for="project-from-to">
                    <font-awesome-icon icon="calendar-alt" />
                    {{ $t('labels.fromTo') }} :
                </label>
                <date-picker :input-attr="{
                                            name: 'project-from-to',
                                            id: 'project-from-to'
                            }"
                             class="w-100"
                             :class="{'is-invalid' : validation.hasError('fromTo')}"
                             v-model="fromTo"
                             valueType="MMMM-YYYY" range
                            :placeholder="$t('placeholders.fromTo')"
                >
                </date-picker>
            </b-form-group>

            <b-form-group>
                <label for="project-tags">
                    <font-awesome-icon icon="tags" />
                    {{ $t('labels.tags') }} :
                </label>
                <b-form-tags
                        input-id="project-tags"
                        separator=" ,;"
                        class="mb-2"
                        v-model="tags"
                        tag-variant="info"
                        :placeholder="$t('placeholders.tags')"
                ></b-form-tags>
            </b-form-group>

            <b-form-group>
                <label for="project-description">
                    <font-awesome-icon icon="pencil-alt" />
                    {{ $t('labels.description') }} :
                </label>
                <b-form-textarea
                    v-model="message"
                    :placeholder="$t('placeholders.chatgpt')+'...'"
                    rows="5">
                </b-form-textarea>
                <b-button
                        v-b-tooltip.hover
                        block type="button"
                        @click="generateProjectDescription"
                        variant="info">
                    <i class="fas fa-magic"></i>
                    {{$t('toggles.generateProjectDescription')}}
                </b-button>
                <div v-if="isLoading" class="d-flex justify-content-center mb-3">
                    <b-spinner variant="info" type="grow">
                        Loading...
                    </b-spinner>
                </div>
                <markdown-editor
                        id="project-description"
                        v-model="description"
                        theme="primary"
                        :placeholder="$t('placeholders.description')+'...'"
                        height="200px"
                        :toolbar="'redo undo | bold italic heading | link | numlist bullist quote | preview'"
                ></markdown-editor>
            </b-form-group>

            <div v-if="getEditedProject">
                <b-button
                        v-b-tooltip.hover
                        :title="$t('toggles.edit')"
                        block type="button"
                        @click="EditState('projects', getEditedProject.id)"
                        variant="warning">
                    <font-awesome-icon icon="edit"></font-awesome-icon>
                </b-button>

                <b-button
                        v-b-tooltip.hover
                        :title="$t('toggles.cancel')"
                        block type="button"
                        @click="onReset"
                        variant="primary">
                    <font-awesome-icon icon="times"></font-awesome-icon>
                </b-button>
            </div>
            <b-button
                    v-else
                    v-b-tooltip.hover
                    :title="$t('buttons.add')+ ' ' +$t('tabs.project')"
                    block type="submit" variant="primary">
                <font-awesome-icon icon="plus"></font-awesome-icon>
            </b-button>
        </b-form>
    </b-tab>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from "vuex";
    import SimpleVueValidation from "simple-vue-validator";
    const Validator = SimpleVueValidation.Validator;

    export default {
        name: 'project',
        data() {
            return {
                project: {
                    id: 1,
                    name: '',
                    link: '',
                    fromTo: '',
                    description: '',
                    tags: []
                },
                isLoading: false,
                message: '',
            }
        },
        computed: {
            ...mapGetters(["getEditedProject"]),
            id: {
                get: function () {
                    if (this.getEditedProject) {
                        return this.$store.state.edit.projects.id
                    } else {
                        return this.$store.state.form.projects.length
                    }
                },
                set: function (value) {
                    if (this.getEditedProject.id) {
                        this.$store.state.edit.projects.id = value;
                    } else {
                        // this.project.id = this.$store.state.form.projects.length;
                        return this.project.id;
                    }
                },
            },
            name: {
                get: function () {
                    if (this.getEditedProject) {
                        return this.$store.state.edit.projects.name;
                    } else {
                        return this.project.name
                    }
                },
                set: function (value) {
                    if (this.getEditedProject) {
                        this.$store.state.edit.projects.name = value
                    } else {
                        this.project.name = value
                    }
                }
            },
            link: {
                get: function () {
                    if (this.getEditedProject) {
                        return this.$store.state.edit.projects.link;
                    } else {
                        return this.project.link
                    }
                },
                set: function (value) {
                    if (this.getEditedProject) {
                        this.$store.state.edit.projects.link = value;
                    } else {
                        this.project.link = value;
                    }
                }
            },
            fromTo: {
                get: function () {
                    if (this.getEditedProject) {
                        return this.$store.state.edit.projects.fromTo;
                    } else {
                        return this.project.fromTo
                    }
                },
                set: function (value) {
                    if (this.getEditedProject) {
                        this.$store.state.edit.projects.fromTo = value
                    } else {
                        this.project.fromTo = value
                    }
                }
            },
            description: {
                get: function () {
                    if (this.getEditedProject) {
                        return this.$store.state.edit.projects.description;
                    } else {
                        return this.project.description
                    }
                },
                set: function (value) {
                    if (this.getEditedProject) {
                        this.$store.state.edit.projects.description = value;
                    } else {
                        this.project.description = value
                    }
                }
            },
            tags: {
                get: function () {
                    if (this.getEditedProject) {
                        return this.$store.state.edit.projects.tags;
                    } else {
                        return this.project.tags
                    }
                },
                set: function (value) {
                    if (this.getEditedProject) {
                        this.$store.state.edit.projects.tags = value;
                    } else {
                        this.project.tags = value;
                    }
                }
            },
        },
        validators: {
            name: function (value) {
                return Validator.value(value).required();
            },
            link: function (value) {
                return Validator.value(value).url();
            },
            fromTo: function (value) {
                return Validator.value(value).required();
            }
        },
        methods: {
            onReset() {
                this.project.id          = this.$store.state.form.projects.length;
                this.project.name        = "";
                this.project.link        = "";
                this.project.fromTo      = "";
                this.project.description = "";
                this.project.tags        = [];
                this.validation.reset();

                this.$store.dispatch('restoreState', {
                    field: 'projects',
                    id:     this.$store.state.edit.projects.id
                });

                this.$store.state.edit.projects    = null;
                this.$store.state.backups.projects = {};
            },
            EditState(state, id) {
                this.$validate().then((success)=> {
                    if (success) {
                        this.$store.dispatch('submitEditedState', {
                            field: state,
                            id: id
                        });
                        this.onReset()
                    }
                });
            },
            // add validation
            onSubmit() {
                this.$validate().then((success)=> {
                    if (success) {
                        this.$store.commit('appendStateField', {
                            field: 'projects',
                            value: {
                                id:            this.project.id,
                                name:          this.project.name,
                                link:          this.project.link,
                                fromTo:        this.project.fromTo,
                                description:   this.project.description,
                                tags:          this.project.tags,
                            }
                        });
                        this.onReset()
                    }
                })
            },
            generateProjectDescription(){
                if(!this.message) return;
                const information = this.getEditedProject? this.$store.state.edit.projects:this.project;
                const requestBody = {
                    "id":            information.id,
                    "name":          information.name,
                    "link":          information.link,
                    "fromTo":        information.fromTo,
                    "description":   this.message,
                    "tags":          information.tags,
                };
                const headers = {
                    'Content-Type': 'application/json',
                };
                this.isLoading=true;
                axios.post('http://localhost:8090/api/generateProject', requestBody,{ headers })
                    .then(response => {
                        if(this.getEditedProject){
                            this.$store.state.edit.projects.description = response.data['generatedContent'];
                        }else{
                            this.project.description = response.data['generatedContent'];
                        }
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