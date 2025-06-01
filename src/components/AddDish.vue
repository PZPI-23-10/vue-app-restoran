<template>
  <transition name="modal-scale">
    <div class="modal-overlay" v-if="visible">
      <div class="modal-window">
        <div class="add-dish-form">
          <h2>Додавання страви</h2>
          <div>
             <div class="photo-and-name">
              <div class="photo-upload" @click="triggerFileInput">
                <input 
                  type="file" 
                  ref="fileInput" 
                  accept="image/*" 
                  @change="onFileChange" 
                  style="display: none;"
                />
                <div
                  v-if="previewImage"
                  class="preview"
                  :style="{ backgroundImage: `url(${previewImage})` }"
                ></div>
                <div v-else class="placeholder">Натисніть щоб вибрати фото</div>
              </div>

              <div class="name-field">
                <label for="dish-name">Назва страви</label>
                <input 
                  id="dish-name" 
                  v-model="formData.name" 
                  @blur="validateField('name')" 
                  type="text" 
                  name="name" 
                />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="input-field">
              <label for="dish-weight">Кількість у грамах</label>
                <input 
                  id="dish-weight" 
                  v-model.number="formData.weight" 
                  @blur="validateField('weight')" 
                  type="number" 
                  name="weight" 
                />
              <span class="error" v-if="errors.weight">{{ errors.weight }}</span>
            </div>
            
            <div class="input-field">
              <label for="dish-price">Вартість (грн)</label>
                <input 
                  id="dish-price" 
                  v-model.number="formData.price" 
                  @blur="validateField('price')" 
                  type="number" 
                  name="price" 
                />
              <span class="error" v-if="errors.price">{{ errors.price }}</span>
            </div>
          </div>

          <div class="input-field">
            <label for="dish-ingredients">Інгредієнти</label>
              <textarea 
                id="dish-ingredients" 
                v-model="formData.ingredients" 
                @blur="validateField('ingredients')" 
                name="ingredients" 
              >
              </textarea>
          </div>

          <div class="actions">
            <button class="cancel" @click="close">Скасувати</button>
            <button 
              class="submit" 
              @click="submitForm"
              :disabled="!canSubmit"
            >
              {{ isEditMode ? 'Оновити' : 'Додати страву' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AddDish',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    dishData: {
      type: Object,
      default: () => ({
      name: '',
      weight: 0,
      price: 0,
      ingredients: '',
      image: '',
      }),
    }
  },
  
  emits: ['close', 'submit', 'update-dish', 'show-dishes', 'add-dish'],
  data() {
    return {
      selectedTag: '',
      previewImage: null,
      errors: {
        name: '',
        weight: '',
        price: '',
        ingredients: ''
      },
      formData: {
        name: '',
        weight: 0,
        price: 0,
        ingredients: '',
        image: '',
      }
    };
  },
  computed: {
    canSubmit() {
      return (
        (this.formData.name || '').trim() &&
        this.formData.weight > 0 &&
        this.formData.price > 0 &&
        (this.formData.ingredients || '').trim()
      );
    },

    isFormValid() {
      return (
        this.formData.name.trim() &&
        this.formData.weight > 0 &&
        this.formData.price > 0 &&
        this.formData.ingredients.trim() &&
        !Object.values(this.errors).some(error => error)
      );
    },

    isEditMode() {
      return !!this.dishData;
    }
  },
  created() {
    if (this.dishData) {
      this.formData = { ...this.dishData };
    }
  },
  methods: {
    validateField(field) {
      const value = this.formData[field];
      
      switch(field) {
        case 'name':
        case 'ingredients':
          this.errors[field] = value.trim() ? '' : 'Поле обязательно для заполнения';
          break;
        case 'weight':
        case 'price':
          this.errors[field] = value > 0 ? '' : 'Значение должно быть больше нуля';
          break;
      }
    },
    
    submitForm() {
      if (!this.validateForm()) return;

      if (this.isEditMode) {
        this.$emit('update-dish', { ...this.formData });
      } else {
        this.$emit('add-dish', { ...this.formData });
      }
    },

    validateForm() {
      Object.keys(this.errors).forEach(key => this.errors[key] = '');
      let valid = true;

      if (!this.formData.name.trim()) {
        this.errors.name = 'Назва страви обов\'язкова';
        valid = false;
      }
      if (!(this.formData.weight > 0)) {
        this.errors.weight = 'Значення має бути більше нуля';
        valid = false;
      }
      if (!(this.formData.price > 0)) {
        this.errors.price = 'Значення має бути більше нуля';
        valid = false;
      }
      if (!this.formData.ingredients.trim()) {
        this.errors.ingredients = 'Поле обов\'язкове';
        valid = false;
      }
      return valid;
    },
    close() {
      if (!this.isEditMode) {
        this.formData = {
          name: '',
          weight: '',
          price: '',
          ingredients: '',
          image: '',
        };
        this.previewImage = null;
        this.selectedTag = '';
      }
      this.$emit('show-dishes');
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (!file) return;

      this.formData.image = file;
      
      const reader = new FileReader();
      reader.onload = e => {
      this.previewImage = e.target.result;   
      this.formData.image = e.target.result; 
      };
      reader.readAsDataURL(file);
    },
  },
  watch: {
    dishData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.formData = {
            name: newVal.name || '',
            weight: newVal.weight || 0,
            price: newVal.price || 0,
            ingredients: newVal.ingredients || '',
            image: newVal.image || newVal.photoUrl || '',
          };

          this.previewImage = newVal.image || newVal.photoUrl || '';
        } else {
          this.formData = {
            name: '',
            weight: 0,
            price: 0,
            ingredients: '',
            image: '',
          };
          this.previewImage = null;
        }

        this.selectedTag = '';
      }
    }
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-window {
  background: white;
  padding: 28px;
  border-radius: 12px;
  width: 500px;
  max-width: 90vw;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.photo-upload .preview {
  width: 120px;
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.add-dish-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  font-family: 'Segoe UI', system-ui, sans-serif;
}
.photo-and-name {
  display: flex;
  align-items: center; 
  gap: 20px;
  margin-bottom: 20px; 
}
.photo-upload {
  width: 150px;
  height: 150px;
  border: 2px dashed #ccc;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.photo-upload .preview {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
}

.photo-upload .placeholder {
  color: #aaa;
  text-align: center;
  padding: 10px;
  font-size: 14px;
}

.name-field {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; 
  height: 150px; 
}

.name-field label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #333;
}

.name-field input {
  padding: 12px 14px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: border-color 0.3s ease;
}

.name-field input:focus {
  border-color: #4a90e2;
  outline: none;
}

h2 {
  margin: 0 0 12px 0;
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
}

h3 {
  margin: 10px 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
}

.input-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-size: 15px;
  color: #555;
  font-weight: 500;
}

input, textarea, select {
  padding: 13px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 15px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f9f9f9;
}

input:focus, textarea:focus, select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
  background-color: white;
  outline: none;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.row {
  display: flex;
  gap: 15px;
}

.row .input-field {
  flex: 1;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.tags-container {
  margin-top: 10px;
}

.tags-scrollable {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 120px;
  overflow-y: auto;
  padding-right: 5px;
}

.tag {
  display: inline-flex;
  align-items: center;
  background: #f0f4f8;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.tag-remove {
  margin-left: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #777;
  padding: 0 0 0 5px;
  line-height: 1;
}

.tag-remove:hover {
  color: #ff6b6b;
}


.add-tag {
  background-color: #cf9820;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.add-tag:hover {
  background-color: #c48a0f;
  transform: translateY(-1px);
}

.add-tag:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}

button {
  padding: 11px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

button.submit {
  background-color: #ff6b6b;
  color: white;
  border: 1px solid #ff6b6b;
}

button.submit:hover {
  background-color: #c93c3c;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button.cancel {
  background-color: transparent;
  color: #666;
  border: 1px solid #ddd;
}

button.cancel:hover {
  background-color: #f5f5f5;
  border-color: #ccc;
  transform: translateY(-1px);
}

.error {
  color: #ff6b6b;
  font-size: 13px;
  margin-top: 4px;
}

input:invalid {
  border-color: #ff6b6b;
}

.modal-scale-enter-active,
.modal-scale-leave-active {
  transition: all 0.35s cubic-bezier(0.36, 0.66, 0.04, 1);
}

.modal-scale-enter-from,
.modal-scale-leave-to {
  opacity: 0;
}

.modal-scale-enter-active .modal-window,
.modal-scale-leave-active .modal-window {
  transition: all 0.35s cubic-bezier(0.36, 0.66, 0.04, 1);
}

.modal-scale-enter-from .modal-window {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

.modal-scale-enter-to .modal-window {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.modal-scale-leave-to .modal-window {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>