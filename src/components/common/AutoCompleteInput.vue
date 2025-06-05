<template>
    <div class="autocomplete-container">
      <div class="form-group">
        <label :for="id">{{ label }}</label>
        
        <!-- Input field dengan autocomplete -->
        <div class="input-wrapper" :class="{ 'has-suggestions': showSuggestions }">
          <input 
            :id="id"
            :type="type"
            :placeholder="placeholder"
            :value="modelValue"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @keydown="onKeydown"
            :class="{ 'filled': modelValue, 'loading': isLoading }"
            ref="inputRef"
            autocomplete="off"
          />
          
          <!-- Loading indicator -->
          <div v-if="isLoading" class="loading-spinner">
            <div class="spinner"></div>
          </div>
          
          <!-- Clear button jika ada text -->
          <button 
            v-if="modelValue && !isLoading" 
            type="button"
            class="clear-btn"
            @click="clearInput"
          >
            ✕
          </button>
        </div>
        
        <!-- Dropdown suggestions -->
        <div 
          v-if="showSuggestions && suggestions.length > 0" 
          class="suggestions-dropdown"
          ref="dropdownRef"
        >
          <!-- ⭐ SIMPLIFIED: Search info tanpa detail -->
          <div class="search-info">
            <span class="search-count">{{ suggestions.length }} nama ditemukan</span>
            <span class="search-query">untuk "{{ searchQuery }}"</span>
          </div>
          
          <!-- ⭐ CLEANED: Suggestion items - hanya nama dan status registrasi -->
          <div 
            v-for="(suggestion, index) in suggestions" 
            :key="suggestion.id"
            class="suggestion-item"
            :class="{ 
              'active': selectedIndex === index,
              'registered': suggestion.isRegistered,
              'not-registered': !suggestion.isRegistered
            }"
            @click="selectSuggestion(suggestion)"
            @mouseenter="selectedIndex = index"
          >
            <!-- Nama dengan highlighting -->
            <div class="suggestion-name">
              <span v-html="highlightMatch(suggestion.nama, searchQuery)"></span>
            </div>
            
            <!-- ⭐ SIMPLIFIED: Hanya status badge, tanpa sektor -->
            <div class="suggestion-status">
              <span 
                class="status-badge"
                :class="suggestion.isRegistered ? 'registered' : 'not-registered'"
              >
                {{ suggestion.isRegistered ? 'SUDAH REGISTRASI' : 'BELUM REGISTRASI' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- No results -->
        <div 
          v-if="showSuggestions && suggestions.length === 0 && searchQuery && !isLoading"
          class="no-results"
        >
          <div class="no-results-icon">🔍</div>
          <div class="no-results-text">
            <p><strong>Tidak ada nama yang cocok dengan "{{ searchQuery }}"</strong></p>
            <p>Coba ketik dengan ejaan yang berbeda atau hubungi admin untuk mendaftarkan nama Anda.</p>
          </div>
        </div>
        
        <!-- Error message -->
        <p v-if="error" class="error-text">{{ error }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import { getAllJemaatNames } from '@/services/auth'
  
  export default {
    name: 'AutoCompleteInput',
    props: {
      id: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: ''
      },
      modelValue: {
        type: String,
        default: ''
      },
      error: {
        type: String,
        default: ''
      },
      minChars: {
        type: Number,
        default: 2 // Minimal 2 karakter untuk mulai search
      }
    },
    
    data() {
      return {
        suggestions: [],
        showSuggestions: false,
        isLoading: false,
        selectedIndex: -1,
        searchQuery: '',
        searchTimeout: null,
        allNames: [], // Cache semua nama
        isDropdownVisible: false
      }
    },
    
    emits: ['update:modelValue', 'suggestion-selected', 'nama-validated'],
    
    watch: {
      modelValue(newValue) {
        if (newValue !== this.searchQuery) {
          this.searchQuery = newValue
          this.debouncedSearch()
        }
      }
    },
    
    mounted() {
      // Load semua nama saat component dimount
      this.loadAllNames()
      
      // Add click outside listener
      document.addEventListener('click', this.handleClickOutside)
    },
    
    beforeUnmount() {
      // Cleanup
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      document.removeEventListener('click', this.handleClickOutside)
    },
    
    methods: {
      async loadAllNames() {
        try {
          console.log('🔍 [AutoComplete] Loading all names...')
          this.allNames = await getAllJemaatNames()
          console.log('✅ [AutoComplete] Loaded', this.allNames.length, 'names')
        } catch (error) {
          console.error('❌ [AutoComplete] Failed to load names:', error)
        }
      },
      
      onInput(event) {
        const value = event.target.value
        this.searchQuery = value
        this.$emit('update:modelValue', value)
        this.selectedIndex = -1
        
        // Reset suggestions saat user mengetik
        if (value.length < this.minChars) {
          this.suggestions = []
          this.showSuggestions = false
          return
        }
        
        this.debouncedSearch()
      },
      
      onFocus() {
        // Show suggestions jika ada query dan results
        if (this.searchQuery.length >= this.minChars && this.suggestions.length > 0) {
          this.showSuggestions = true
        }
      },
      
      onBlur() {
        // Delay hide untuk allow click pada suggestions
        setTimeout(() => {
          this.showSuggestions = false
          this.selectedIndex = -1
        }, 150)
      },
      
      onKeydown(event) {
        if (!this.showSuggestions || this.suggestions.length === 0) return
        
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1)
            this.scrollToSelected()
            break
            
          case 'ArrowUp':
            event.preventDefault()
            this.selectedIndex = Math.max(this.selectedIndex - 1, -1)
            this.scrollToSelected()
            break
            
          case 'Enter':
            event.preventDefault()
            if (this.selectedIndex >= 0 && this.selectedIndex < this.suggestions.length) {
              this.selectSuggestion(this.suggestions[this.selectedIndex])
            }
            break
            
          case 'Escape':
            this.showSuggestions = false
            this.selectedIndex = -1
            this.$refs.inputRef.blur()
            break
        }
      },
      
      debouncedSearch() {
        // Clear previous timeout
        if (this.searchTimeout) {
          clearTimeout(this.searchTimeout)
        }
        
        // Set new timeout
        this.searchTimeout = setTimeout(() => {
          this.performSearch()
        }, 300) // 300ms delay
      },
      
      performSearch() {
        if (this.searchQuery.length < this.minChars) {
          this.suggestions = []
          this.showSuggestions = false
          return
        }
        
        this.isLoading = true
        
        try {
          // Filter berdasarkan query
          const query = this.searchQuery.toLowerCase().trim()
          
          const filteredNames = this.allNames.filter(person => {
            const nama = person.nama.toLowerCase()
            
            // Multiple search criteria:
            // 1. Starts with query
            // 2. Contains query  
            // 3. Word starts with query
            return (
              nama.startsWith(query) ||
              nama.includes(query) ||
              nama.split(' ').some(word => word.startsWith(query))
            )
          })
          
          // Sort results: exact matches first, then starts with, then contains
          filteredNames.sort((a, b) => {
            const aName = a.nama.toLowerCase()
            const bName = b.nama.toLowerCase()
            
            // Exact match comes first
            if (aName === query) return -1
            if (bName === query) return 1
            
            // Starts with comes second
            if (aName.startsWith(query) && !bName.startsWith(query)) return -1
            if (bName.startsWith(query) && !aName.startsWith(query)) return 1
            
            // Alphabetical for the rest
            return aName.localeCompare(bName)
          })
          
          this.suggestions = filteredNames.slice(0, 8) // Limit to 8 results
          this.showSuggestions = this.suggestions.length > 0
          this.selectedIndex = -1
          
          console.log('🔍 [AutoComplete] Search results:', this.suggestions.length)
          
        } catch (error) {
          console.error('❌ [AutoComplete] Search error:', error)
          this.suggestions = []
          this.showSuggestions = false
        } finally {
          this.isLoading = false
        }
      },
      
      selectSuggestion(suggestion) {
        console.log('✅ [AutoComplete] Selected:', suggestion.nama)
        
        this.$emit('update:modelValue', suggestion.nama)
        this.$emit('suggestion-selected', suggestion)
        this.$emit('nama-validated', {
          nama: suggestion.nama,
          exists: true,
          isRegistered: suggestion.isRegistered,
          userData: suggestion
        })
        
        this.showSuggestions = false
        this.selectedIndex = -1
        
        // Focus out
        this.$refs.inputRef.blur()
      },
      
      clearInput() {
        this.$emit('update:modelValue', '')
        this.suggestions = []
        this.showSuggestions = false
        this.searchQuery = ''
        this.$refs.inputRef.focus()
      },
      
      highlightMatch(text, query) {
        if (!query) return text
        
        const regex = new RegExp(`(${query})`, 'gi')
        return text.replace(regex, '<mark>$1</mark>')
      },
      
      scrollToSelected() {
        if (this.selectedIndex >= 0 && this.$refs.dropdownRef) {
          const dropdown = this.$refs.dropdownRef
          const items = dropdown.querySelectorAll('.suggestion-item')
          const selectedItem = items[this.selectedIndex]
          
          if (selectedItem) {
            selectedItem.scrollIntoView({
              block: 'nearest',
              behavior: 'smooth'
            })
          }
        }
      },
      
      handleClickOutside(event) {
        // Hide suggestions jika click di luar component
        if (!this.$el.contains(event.target)) {
          this.showSuggestions = false
          this.selectedIndex = -1
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .autocomplete-container {
    position: relative;
    width: 100%;
  }
  
  .form-group {
    width: 100%;
    max-width: 360px;
    margin-bottom: 16px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 6px;
    font-family: 'Inter';
    font-size: 14px;
  }
  
  .input-wrapper {
    position: relative;
    width: 100%;
  }
  
  .input-wrapper.has-suggestions {
    border-radius: 6px 6px 0 0;
  }
  
  input {
    width: 100%;
    height: 44px;
    padding: 12px 40px 12px 12px; /* Space for clear button */
    font-size: 14px;
    font-family: 'Inter';
    border: 2px solid #41442A;
    border-radius: 6px;
    background-color: #fcfcf7;
    box-sizing: border-box;
    transition: all 0.2s ease;
  }
  
  input:focus {
    outline: none;
    border-color: #5a5e3d;
    box-shadow: 0 0 0 3px rgba(65, 68, 42, 0.1);
  }
  
  input.filled {
    color: #333;
  }
  
  input:not(.filled) {
    color: #777;
  }
  
  input.loading {
    padding-right: 70px; /* More space for spinner */
  }
  
  /* Loading spinner */
  .loading-spinner {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #e0e0e0;
    border-top: 2px solid #41442A;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  /* Clear button */
  .clear-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    border: none;
    background: #ccc;
    color: white;
    border-radius: 50%;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s ease;
  }
  
  .clear-btn:hover {
    background: #999;
  }
  
  /* Suggestions dropdown */
  .suggestions-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #41442A;
    border-top: 1px solid #e0e0e0;
    border-radius: 0 0 8px 8px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .search-info {
    padding: 8px 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    font-size: 12px;
    color: #666;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .search-count {
    font-weight: 600;
    color: #41442A;
  }
  
  .search-query {
    font-style: italic;
  }
  
  /* ⭐ CLEANED: Suggestion items - layout yang lebih clean */
  .suggestion-item {
    padding: 12px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    transition: all 0.2s ease;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .suggestion-item:hover,
  .suggestion-item.active {
    background-color: #f0f8ff;
    border-left: 3px solid #41442A;
  }
  
  .suggestion-item:last-child {
    border-bottom: none;
  }
  
  .suggestion-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    font-family: 'Inter';
    flex: 1;
    min-width: 0;
  }
  
  .suggestion-name :deep(mark) {
    background-color: #ffeb3b;
    color: #333;
    padding: 1px 2px;
    border-radius: 2px;
    font-weight: 700;
  }
  
  /* ⭐ SIMPLIFIED: Hanya status, tanpa info sektor */
  .suggestion-status {
    display: flex;
    align-items: center;
  }
  
  .status-badge {
    font-size: 9px;
    padding: 3px 6px;
    border-radius: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  
  .status-badge.registered {
    background: #e8f5e8;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
  }
  
  .status-badge.not-registered {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
  }
  
  /* No results */
  .no-results {
    padding: 20px;
    text-align: center;
    color: #666;
  }
  
  .no-results-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }
  
  .no-results-text p {
    margin: 4px 0;
    font-size: 14px;
    line-height: 1.4;
  }
  
  .no-results-text p:first-child {
    font-weight: 600;
    color: #333;
  }
  
  /* Error text */
  .error-text {
    color: red;
    font-size: 12px;
    margin-top: 4px;
    margin-bottom: 0;
    font-family: 'Inter';
  }
  
  /* Responsive */
  @media (max-width: 360px) {
    .suggestion-item {
      padding: 10px;
    }
    
    .suggestion-name {
      font-size: 13px;
    }
    
    .status-badge {
      font-size: 8px;
      padding: 2px 4px;
    }
  }
  
  /* Accessibility */
  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
    }
    
    input,
    .suggestion-item,
    .clear-btn {
      transition: none;
    }
  }
  </style>