import Vue from 'vue';
import FileUploader from "@/components/file-uploader.vue";
const Components = {
    FileUploader
};
Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});
export default Components