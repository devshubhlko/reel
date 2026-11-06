<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden">
    <!-- Header Navbar -->
    <header class="border-b border-slate-200 bg-white/90 backdrop-blur px-3 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-xs">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 flex items-center justify-center p-0.5 shadow-sm">
          <img src="/logo.png" alt="Logo" class="w-full h-full object-contain" />
        </div>
      </div>

      <!-- Ratio Quick Switcher in Header -->
      <div class="flex items-center gap-1.5 sm:gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button 
          v-for="r in ['1:1', '9:16', '16:9']" 
          :key="r"
          @click="changeAspectRatio(r as any)"
          class="px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer"
          :class="selectedRatio === r ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'"
        >
          {{ r === '1:1' ? 'Square' : r === '9:16' ? 'Reel' : 'Youtube' }} 
        </button> 
      </div>
    </header>

    <!-- Main Workspace -->
    <main class="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 p-3 sm:p-6 pb-20 lg:pb-6 max-w-[1700px] w-full mx-auto items-start">
      
      <!-- LEFT PANEL: Controls & Form (5 Cols) -->
      <section class="order-2 lg:order-1 lg:col-span-5 flex flex-col gap-4 bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm h-fit">

        <!-- DESKTOP TOP TABS: Question vs Settings (Hidden on Mobile) -->
        <div class="hidden lg:grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button 
            type="button"
            @click="activeTab = 'question'"
            class="py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeTab === 'question' 
              ? 'bg-amber-500 text-white shadow-xs font-extrabold' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'"
          >
            <span>Question</span>
          </button>
          
          <button 
            type="button"
            @click="activeTab = 'settings'"
            class="py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            :class="activeTab === 'settings' 
              ? 'bg-amber-500 text-white shadow-xs font-extrabold' 
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'"
          >
            <span>Settings</span>
          </button>
        </div>

        <!-- DESKTOP TAB 1: QUESTION CONTENT (Ratio, Type, Question, Options) -->
        <div v-show="activeTab === 'question'" class="hidden lg:block space-y-4">
          <!-- 0. Video / Image Aspect Ratio Selection -->
          <div class="bg-amber-50/70 border border-amber-200/80 p-3 rounded-xl space-y-1.5">
            <label class="block text-xs font-bold text-amber-900">
              Select Resolution & Aspect Ratio:
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                @click="changeAspectRatio('1:1')"
                class="py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                :class="selectedRatio === '1:1' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              >
                <div>1080 × 1080</div>
                <div class="text-[10px] font-normal opacity-90">1:1 Square</div>
              </button>
              <button 
                @click="changeAspectRatio('9:16')"
                class="py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                :class="selectedRatio === '9:16' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              >
                <div>1080 × 1920</div>
                <div class="text-[10px] font-normal opacity-90">9:16 Reel/Story</div>
              </button>
              <button 
                @click="changeAspectRatio('16:9')"
                class="py-2 px-2 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                :class="selectedRatio === '16:9' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              >
                <div>1920 × 1080</div>
                <div class="text-[10px] font-normal opacity-90">16:9 YouTube</div>
              </button>
            </div>
          </div>

          <!-- Multi-Question Header & Add Button -->
          <div class="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Questions ({{ quizList.length }})
              </span>
              <span v-if="quizList.length > 1" class="text-[10px] font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                Multi-Video Mode
              </span>
            </div>
            <button
              type="button"
              @click="addQuestion"
              class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"/></svg>
              <span>Add Question</span>
            </button>
          </div>

          <!-- All Questions Stacked Vertically (Ek ke niche ek) -->
          <div class="space-y-4">
            <div 
              v-for="(qItem, qIdx) in quizList" 
              :key="qItem.id || qIdx"
              @click="setActiveQuestion(qIdx)"
              class="bg-white border rounded-2xl p-3.5 transition-all space-y-3 relative shadow-2xs"
              :class="activeQuestionIndex === qIdx ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200 hover:border-slate-300'"
            >
              <!-- Question Header (Number, Canvas Indicator, + and - buttons) -->
              <div class="flex items-center justify-between pb-2 border-b border-slate-100">
                <div class="flex items-center gap-2">
                  <span 
                    class="w-6 h-6 rounded-lg flex items-center justify-center font-extrabold text-xs"
                    :class="activeQuestionIndex === qIdx ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'"
                  >
                    #{{ qIdx + 1 }}
                  </span>
                  <span class="text-xs font-bold text-slate-800">Question {{ qIdx + 1 }}</span>
                  <span 
                    v-if="activeQuestionIndex === qIdx" 
                    class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                  >
                    Canvas
                  </span>
                </div>

                <!-- Action Buttons: Add (+) and Delete (-) -->
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    @click.stop="addQuestionAfter(qIdx)"
                    class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center text-sm font-extrabold transition-all cursor-pointer active:scale-95"
                    title="Add Question Below"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    @click.stop="removeQuestion(qIdx)"
                    :disabled="quizList.length <= 1"
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-extrabold transition-all cursor-pointer active:scale-95"
                    :class="quizList.length <= 1 ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border border-slate-200' : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'"
                    title="Delete Question"
                  >
                    −
                  </button>
                </div>
              </div>

              <!-- 1. Topic / Type -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Enter Type</label>
                <input 
                  v-model="qItem.category"
                  @focus="setActiveQuestion(qIdx)"
                  type="text" 
                  placeholder="Enter Type / Category Here"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
                />
              </div> 

              <!-- 2. Question -->
              <div>
                <label class="block text-[11px] font-semibold text-slate-600 mb-1">Enter Question</label>
                <textarea 
                  v-model="qItem.question"
                  @focus="setActiveQuestion(qIdx)"
                  rows="2" 
                  placeholder="Enter Question Here"
                  class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 rounded-xl px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <!-- 3. Options (A, B, C, D) & Right Answer Selector -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <label class="block text-[11px] font-semibold text-slate-600">Enter Options</label>
                  <span class="text-[10px] font-medium text-amber-600 select-none">Click letter to set correct</span>
                </div>

                <div 
                  v-for="(opt, optIdx) in qItem.options" 
                  :key="optIdx"
                  @click="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                  class="flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer"
                  :class="qItem.correctOption === optIdx + 1 ? 'bg-emerald-50/50 border-emerald-400 ring-1 ring-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300'"
                >
                  <!-- Left Letter Badge (A, B, C, D) with checkmark on selected -->
                  <button
                    type="button"
                    @click.stop="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                    class="w-8 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all select-none border cursor-pointer"
                    :class="qItem.correctOption === optIdx + 1 
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-extrabold' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  >
                    <span v-if="qItem.correctOption === optIdx + 1" class="flex items-center gap-1 font-bold">
                      <span>✓</span><span>{{ ['A','B','C','D'][optIdx] }}</span>
                    </span>
                    <span v-else>{{ ['A','B','C','D'][optIdx] }}</span>
                  </button>

                  <!-- Option Text Input -->
                  <input 
                    v-model="qItem.options[optIdx]"
                    @focus="setActiveQuestion(qIdx)"
                    type="text" 
                    :placeholder="'Option ' + ['A','B','C','D'][optIdx]"
                    @click.stop
                    class="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 outline-none px-1"
                  />

                  <!-- Right-Side Text Button: 'Correct' when selected, 'Mark' when unselected -->
                  <button 
                    type="button"
                    @click.stop="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                    class="px-2 py-0.5 rounded-lg text-xs font-bold transition-all shrink-0 select-none cursor-pointer border active:scale-95"
                    :class="qItem.correctOption === optIdx + 1 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs' 
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'"
                    :title="'Mark Option ' + ['A','B','C','D'][optIdx] + ' as Correct'"
                  >
                    {{ qItem.correctOption === optIdx + 1 ? 'Correct' : 'Mark' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DESKTOP TAB 2: SETTINGS (Fonts, Border, Font Sizes, Drag Mode, Watermark) -->
        <div v-show="activeTab === 'settings'" class="hidden lg:block space-y-4">
          <!-- 4. Typography & Layout Adjustments (With Type Font Size Slider) -->
          <div class="space-y-3">
            <!-- Google Hindi Font Selector Card -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-600">Fonts</label>
              </div>
              <button 
                type="button"
                @click="openFontModal"
                class="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400 rounded-xl transition-all cursor-pointer group shadow-2xs text-left"
              >
                <div class="flex items-center gap-3">
                  <div>
                    <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{{ currentFontDisplayName }}</span>
                    </div>
                    <div class="text-xs text-slate-500 font-medium mt-0.5" :style="{ fontFamily: style.fontFamily }">
                      सामान्य विज्ञान प्रश्नोत्तरी
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white group-hover:bg-amber-50 text-amber-600 border border-slate-200 group-hover:border-amber-300 transition-all shadow-2xs">
                  <span>Browse Fonts</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            </div>

            <!-- All Sliders: 1 Per Line, Full Width, Thick with Touch Stepper Buttons -->
            <div class="space-y-2.5">
              <!-- Border Width Slider -->
              <div class="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span class="font-bold">Border Width</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.borderWidth }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.borderWidth = Math.max(0, style.borderWidth - 1)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="-1px"
                  >−</button>
                  <input 
                    v-model.number="style.borderWidth"
                    type="range" 
                    min="0" 
                    max="10" 
                    step="1"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.borderWidth = Math.min(10, style.borderWidth + 1)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="+1px"
                  >+</button>
                </div>
              </div>

              <!-- Type Font Size Slider -->
              <div class="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span class="font-bold">Type Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.typeFontSize }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.typeFontSize = Math.max(24, style.typeFontSize - 2)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="-2px"
                  >−</button>
                  <input 
                    v-model.number="style.typeFontSize"
                    type="range" 
                    min="24" 
                    max="68" 
                    step="2"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.typeFontSize = Math.min(68, style.typeFontSize + 2)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="+2px"
                  >+</button>
                </div>
              </div>

              <!-- Question Size Slider -->
              <div class="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span class="font-bold">Question Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.questionFontSize }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.questionFontSize = Math.max(28, style.questionFontSize - 2)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="-2px"
                  >−</button>
                  <input 
                    v-model.number="style.questionFontSize"
                    type="range" 
                    min="28" 
                    max="68" 
                    step="2"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.questionFontSize = Math.min(68, style.questionFontSize + 2)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="+2px"
                  >+</button>
                </div>
              </div>

              <!-- Option Text Size Slider -->
              <div class="bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span class="font-bold">Option Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.optionFontSize }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.optionFontSize = Math.max(20, style.optionFontSize - 2)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="-2px"
                  >−</button>
                  <input 
                    v-model.number="style.optionFontSize"
                    type="range" 
                    min="20" 
                    max="46" 
                    step="2"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.optionFontSize = Math.min(46, style.optionFontSize + 2)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="+2px"
                  >+</button>
                </div>
              </div>
            </div>

            <!-- Option Badge Shape (5 Inbuilt Shapes: Default Circle) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700">Option Badge Shape</span>
                <span class="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 capitalize font-bold">
                  {{ style.optionShape }}
                </span>
              </div>

              <div class="grid grid-cols-5 gap-1.5">
                <button
                  v-for="shp in [
                    { id: 'circle', label: 'Circle', icon: '●' },
                    { id: 'rounded-square', label: 'Squircle', icon: '▢' },
                    { id: 'square', label: 'Square', icon: '■' },
                    { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
                    { id: 'diamond', label: 'Diamond', icon: '◆' }
                  ]"
                  :key="'desk-shp-' + shp.id"
                  type="button"
                  @click="style.optionShape = shp.id as any"
                  class="flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer text-center"
                  :class="style.optionShape === shp.id ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-102 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                >
                  <span class="text-base leading-none mb-1">{{ shp.icon }}</span>
                  <span class="text-[10px] tracking-tight">{{ shp.label }}</span>
                </button>
              </div>
            </div>

            <!-- Custom Colors: Question Type, Question, Option Text, Shape Fill & Shape Text -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2.5">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Colors</h4>

              <!-- 1. Question Type Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700">Type Heading Color</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.typeColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.typeColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#000000', '#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#ffffff']"
                    :key="'desk-type-c-' + c"
                    type="button"
                    @click="style.typeColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.typeColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 2. Question Text Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700">Question Color</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.questionColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.questionColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#000000', '#1e293b', '#dc2626', '#2563eb', '#059669', '#d97706', '#ffffff']"
                    :key="'desk-q-c-' + c"
                    type="button"
                    @click="style.questionColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.questionColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 3. Option Text Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700">Option Text Color</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.optionColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.optionColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#000000', '#1e293b', '#334155', '#2563eb', '#059669', '#dc2626', '#ffffff']"
                    :key="'desk-opt-c-' + c"
                    type="button"
                    @click="style.optionColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.optionColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 4. Option Shape Fill Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="block text-xs font-bold text-slate-700">Option Shape Fill</span>
                    <span class="text-[10px] text-slate-400">Background of A, B, C, D</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.optionBadgeBgColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.optionBadgeBgColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#1f2937', '#000000', '#2563eb', '#059669', '#dc2626', '#d97706', '#7c3aed', '#ffffff']"
                    :key="'desk-badge-bg-c-' + c"
                    type="button"
                    @click="style.optionBadgeBgColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.optionBadgeBgColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 5. Option Shape Letter Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="block text-xs font-bold text-slate-700">Option Shape Letter</span>
                    <span class="text-[10px] text-slate-400">Letter inside shape</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.optionBadgeTextColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.optionBadgeTextColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#ffffff', '#000000', '#facc15', '#f87171', '#6ee7b7']"
                    :key="'desk-badge-text-c-' + c"
                    type="button"
                    @click="style.optionBadgeTextColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.optionBadgeTextColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>
            </div>

            <!-- Drag Switch & Target Selector -->
            <div class="space-y-2 pt-1 border-t border-slate-100">
              <div class="flex items-center justify-between text-xs font-medium text-slate-600">
                <span class="flex items-center gap-1.5 font-bold">
                  <span>Drag Mode</span>
                </span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="enableDrag" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  <span class="ml-2 text-slate-700 text-xs font-bold">{{ enableDrag ? 'ON' : 'OFF' }}</span>
                </label>
              </div>

              <!-- Drag Target Pills (Only active element can be dragged) -->
              <div v-if="enableDrag" class="bg-amber-50/80 border border-amber-200 p-2.5 rounded-xl space-y-1.5 transition-all">
                <label class="block text-[11px] font-bold text-amber-900">
                  Choose Element
                </label>
                <div class="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  <button
                    type="button"
                    @click="activeDragTarget = 'type'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'type' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  >
                    Type
                  </button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'question'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'question' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  >
                    Question
                  </button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'options'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'options' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                  >
                    Options
                  </button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'logo'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'logo' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                    :disabled="!logoConfig.show"
                    :title="!logoConfig.show ? 'Logo is OFF' : ''"
                  >
                    Logo
                  </button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'watermark'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'watermark' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                    :disabled="!watermark.enabled"
                    :title="!watermark.enabled ? 'Watermark is OFF' : ''"
                  >
                    Watermark
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 4.5 Logo Controls (Upload, Visibility, Size) -->
          <div class="border-t border-slate-100 pt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Logo</span>
              </h3>
              <!-- Yes/No Toggle: Default YES -->
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="logoConfig.show" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                <span class="ml-2 text-slate-700 text-xs font-bold">{{ logoConfig.show ? 'YES' : 'NO' }}</span>
              </label>
            </div>

            <!-- Logo Options Panel (Shown when YES/Active) -->
            <div v-if="logoConfig.show" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5 transition-all">
              <!-- Upload / Change Logo Button -->
              <div class="bg-white/90 border border-amber-200/70 p-2.5 rounded-xl flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-10 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                    <img :src="logoConfig.customUrl || '/logo.png'" alt="Logo Preview" class="w-full h-full object-contain" />
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-slate-800">Post Logo</span>
                    <span class="text-[10px] text-slate-500">{{ logoConfig.customUrl ? 'Custom uploaded logo' : 'Default logo' }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  <button 
                    type="button" 
                    @click="triggerLogoUpload" 
                    class="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <span>Upload Logo</span>
                  </button>
                  <button 
                    v-if="logoConfig.customUrl" 
                    type="button" 
                    @click="resetLogoToDefault" 
                    class="py-1.5 px-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                    title="Reset to default logo"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <!-- Logo Size Slider -->
              <div class="bg-white/80 border border-amber-200/70 p-2.5 rounded-xl">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                  <span class="font-bold">Logo Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ logoConfig.size }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="logoConfig.size = Math.max(50, logoConfig.size - 10)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="-10px"
                  >−</button>
                  <input 
                    v-model.number="logoConfig.size"
                    type="range" 
                    min="50" 
                    max="400" 
                    step="5"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="logoConfig.size = Math.min(400, logoConfig.size + 10)" 
                    class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                    title="+10px"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 4.6 Background Controls (Solid Color / Custom Image) -->
          <div class="border-t border-slate-100 pt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>Background</span>
              </h3>
              <!-- Mode Tabs: Color vs Image -->
              <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  @click="setBgType('color')"
                  class="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                  :class="bgConfig.type === 'color' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  Color
                </button>
                <button
                  type="button"
                  @click="setBgType('image')"
                  class="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                  :class="bgConfig.type === 'image' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'"
                >
                  Image
                </button>
              </div>
            </div>

            <!-- Panel for Solid Color -->
            <div v-if="bgConfig.type === 'color'" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5 transition-all">
              <div class="bg-white/90 border border-amber-200/70 p-2.5 rounded-xl space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700">Solid Color</span>
                  <div class="flex items-center gap-2">
                    <input 
                      v-model="bgConfig.color" 
                      type="color" 
                      class="w-7 h-7 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ bgConfig.color }}</span>
                  </div>
                </div>

                <!-- Preset Color Swatches -->
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <div class="flex items-center gap-1.5 flex-wrap">
                    <button
                      v-for="c in ['#ffffff', '#fafaf9', '#f1f5f9', '#fefce8', '#f0fdf4', '#fff1f2', '#1e293b']"
                      :key="c"
                      type="button"
                      @click="bgConfig.color = c"
                      class="w-6 h-6 rounded-md border transition-all cursor-pointer shadow-2xs hover:scale-110"
                      :class="bgConfig.color.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-105' : 'border-slate-300'"
                      :style="{ backgroundColor: c }"
                      :title="c === '#ffffff' ? 'Pure White (Default)' : c"
                    ></button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Panel for Background Image -->
            <div v-else class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5 transition-all">
              <div class="bg-white/90 border border-amber-200/70 p-2.5 rounded-xl flex items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <div class="w-12 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                    <img v-if="bgConfig.imageUrl" :src="bgConfig.imageUrl" alt="BG Preview" class="w-full h-full object-cover" />
                    <span v-else class="text-[10px] text-slate-400 font-bold">No Image</span>
                  </div>
                  <div>
                    <span class="block text-xs font-bold text-slate-800">Background Image</span>
                    <span class="text-[10px] text-slate-500">{{ bgConfig.imageUrl ? 'Custom image applied' : 'Upload any image for BG' }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5">
                  <button 
                    type="button" 
                    @click="triggerBgUpload" 
                    class="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <span>{{ bgConfig.imageUrl ? 'Change' : 'Upload' }}</span>
                  </button>
                  <button 
                    v-if="bgConfig.imageUrl" 
                    type="button" 
                    @click="removeBgImage" 
                    class="py-1.5 px-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer"
                    title="Remove background image"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. Watermark Logo Controls (Center Overlay) -->
          <div class="border-t border-slate-100 pt-3 space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                Watermark
              </h3>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="watermark.enabled" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                <span class="ml-2 text-slate-700 text-xs font-bold">{{ watermark.enabled ? 'YES' : 'NO' }}</span>
              </label>
            </div>

            <!-- Watermark Options Panel (Shown only when Yes/Active) -->
            <div v-if="watermark.enabled" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5 transition-all">
              <div class="space-y-2.5">
                <!-- Watermark Opacity Slider -->
                <div class="bg-white/80 border border-amber-200/70 p-2.5 rounded-xl">
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span class="font-bold">Watermark Opacity</span>
                    <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ Math.round(watermark.opacity * 100) }}%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      @click="watermark.opacity = Math.max(0.05, +(watermark.opacity - 0.05).toFixed(2))" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                      title="-5%"
                    >−</button>
                    <input 
                      v-model.number="watermark.opacity"
                      type="range" 
                      min="0.05" 
                      max="1.0" 
                      step="0.05"
                      class="w-full"
                    />
                    <button 
                      type="button" 
                      @click="watermark.opacity = Math.min(1.0, +(watermark.opacity + 0.05).toFixed(2))" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                      title="+5%"
                    >+</button>
                  </div>
                </div>

                <!-- Watermark Size Slider -->
                <div class="bg-white/80 border border-amber-200/70 p-2.5 rounded-xl">
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1.5">
                    <span class="font-bold">Logo Size</span>
                    <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ watermark.size }}px</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      @click="watermark.size = Math.max(100, watermark.size - 10)" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                      title="-10px"
                    >−</button>
                    <input 
                      v-model.number="watermark.size"
                      type="range" 
                      min="100" 
                      max="700" 
                      step="10"
                      class="w-full"
                    />
                    <button 
                      type="button" 
                      @click="watermark.size = Math.min(700, watermark.size + 10)" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                      title="+10px"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- DESKTOP ACTION BUTTONS (Always visible at bottom of Left Panel on Desktop) -->
        <div class="hidden lg:flex border-t border-slate-100 pt-3 flex-col gap-2.5">
          <!-- Download Image & Generate Video Side-by-Side (1 Line) -->
          <div class="grid grid-cols-2 gap-2.5 w-full">
            <!-- Download Image Button -->
            <button 
              @click="downloadImage"
              type="button"
              class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Download Image</span>
            </button>

            <!-- Generate Video Button -->
            <button 
              @click="startBulletproofVideoGeneration"
              :disabled="isGeneratingVideo"
              type="button"
              class="w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border shadow-md"
              :class="isGeneratingVideo ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-transparent shadow-indigo-500/20'"
            >
              <svg v-if="!isGeneratingVideo" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <svg v-else class="animate-spin w-4 h-4 shrink-0 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              <span class="truncate">{{ isGeneratingVideo ? `Generating (${videoProgress}%)` : `Generate Video` }}</span>
            </button>
          </div>

          <!-- Video Ready Controls --> 
          <div v-if="generatedVideoUrl" class="mt-1 p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-900 flex items-center gap-1.5"> 
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Video Generated
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="playVideoModal = true"
                class="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Play Video
              </button>
              <button 
                @click="downloadVideo"
                class="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> 
                Download Video
              </button>
            </div>
          </div>
        </div>

        <!-- ============================================== -->
        <!-- MOBILE-ONLY CONTROLS (Switched via Bottom Nav)  -->
        <!-- ============================================== -->
        <div class="block lg:hidden space-y-4">
          <!-- MOBILE TAB 1: Q/A (Multi-Question List) -->
          <div v-show="mobileTab === 'qa'" class="space-y-3">
            <!-- Mobile Action Bar -->
            <div class="flex items-center justify-between bg-amber-50/80 border border-amber-200/80 p-2.5 rounded-xl">
              <span class="text-xs font-bold text-amber-950 uppercase">Questions ({{ quizList.length }})</span>
              <button
                type="button"
                @click="addQuestion"
                class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-xs cursor-pointer flex items-center gap-1 active:scale-95"
              >
                + Add Question
              </button>
            </div>

            <!-- Mobile Questions Stacked -->
            <div class="space-y-3">
              <div 
                v-for="(qItem, qIdx) in quizList" 
                :key="'mob-q-' + (qItem.id || qIdx)"
                @click="setActiveQuestion(qIdx)"
                class="bg-white border rounded-2xl p-3 space-y-2.5 relative shadow-2xs"
                :class="activeQuestionIndex === qIdx ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'"
              >
                <!-- Card Header -->
                <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <div class="flex items-center gap-1.5">
                    <span 
                      class="w-5 h-5 rounded-md flex items-center justify-center font-extrabold text-[11px]"
                      :class="activeQuestionIndex === qIdx ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'"
                    >
                      #{{ qIdx + 1 }}
                    </span>
                    <span class="text-xs font-bold text-slate-800">Question {{ qIdx + 1 }}</span>
                    <span 
                      v-if="activeQuestionIndex === qIdx" 
                      class="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded border border-amber-200"
                    >
                      Canvas
                    </span>
                  </div>

                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      @click.stop="addQuestionAfter(qIdx)"
                      class="w-6 h-6 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center text-xs font-extrabold active:scale-95"
                      title="Add Below"
                    >+</button>
                    <button
                      type="button"
                      @click.stop="removeQuestion(qIdx)"
                      :disabled="quizList.length <= 1"
                      class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-extrabold active:scale-95"
                      :class="quizList.length <= 1 ? 'opacity-30 bg-slate-100 text-slate-400 border border-slate-200' : 'bg-rose-50 text-rose-600 border border-rose-200'"
                      title="Delete"
                    >−</button>
                  </div>
                </div>

                <!-- Type -->
                <div>
                  <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">Enter Type</label>
                  <input 
                    v-model="qItem.category"
                    @focus="setActiveQuestion(qIdx)"
                    type="text" 
                    placeholder="Enter Type Here"
                    class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none"
                  />
                </div> 

                <!-- Question -->
                <div>
                  <label class="block text-[10px] font-semibold text-slate-600 mb-0.5">Enter Question</label>
                  <textarea 
                    v-model="qItem.question"
                    @focus="setActiveQuestion(qIdx)"
                    rows="2" 
                    placeholder="Enter Question Here"
                    class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none resize-none"
                  ></textarea>
                </div>

                <!-- Options -->
                <div class="space-y-1.5">
                  <div class="flex items-center justify-between">
                    <label class="block text-[10px] font-semibold text-slate-600">Enter Options</label>
                    <span class="text-[10px] text-amber-600 select-none">Click letter to set correct</span>
                  </div>

                  <div 
                    v-for="(opt, optIdx) in qItem.options" 
                    :key="'mob-' + qIdx + '-' + optIdx"
                    @click="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                    class="flex items-center gap-1.5 p-1.5 rounded-xl border transition-all cursor-pointer"
                    :class="qItem.correctOption === optIdx + 1 ? 'bg-emerald-50/50 border-emerald-400 ring-1 ring-emerald-300' : 'bg-white border-slate-200'"
                  >
                    <button
                      type="button"
                      @click.stop="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                      class="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all select-none border cursor-pointer"
                      :class="qItem.correctOption === optIdx + 1 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-extrabold' 
                        : 'bg-white text-slate-700 border-slate-200'"
                    >
                      <span v-if="qItem.correctOption === optIdx + 1">✓ {{ ['A','B','C','D'][optIdx] }}</span>
                      <span v-else>{{ ['A','B','C','D'][optIdx] }}</span>
                    </button>

                    <input 
                      v-model="qItem.options[optIdx]"
                      @focus="setActiveQuestion(qIdx)"
                      type="text" 
                      :placeholder="'Option ' + ['A','B','C','D'][optIdx]"
                      @click.stop
                      class="flex-1 bg-transparent border-none text-xs text-slate-900 placeholder-slate-400 outline-none px-1"
                    />

                    <button 
                      type="button"
                      @click.stop="qItem.correctOption = optIdx + 1; setActiveQuestion(qIdx)"
                      class="px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all shrink-0 select-none cursor-pointer border active:scale-95"
                      :class="qItem.correctOption === optIdx + 1 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs' 
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'"
                    >
                      {{ qItem.correctOption === optIdx + 1 ? 'Correct' : 'Mark' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- MOBILE TAB 2: SIZE (Single-slider-at-a-time selector) -->
          <div v-show="mobileTab === 'size'" class="space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-slate-100">
              <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Size To Adjust</span>
            </div>

            <!-- 5-Pill Size Target Selector -->
            <div class="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 text-center">
              <button 
                type="button" 
                @click="activeSizeTarget = 'border'"
                class="py-2 px-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                :class="activeSizeTarget === 'border' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              >
                Border
              </button>
              <button 
                type="button" 
                @click="activeSizeTarget = 'type'"
                class="py-2 px-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                :class="activeSizeTarget === 'type' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              >
                Type
              </button>
              <button  
                type="button" 
                @click="activeSizeTarget = 'question'"
                class="py-2 px-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                :class="activeSizeTarget === 'question' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              >
                Question
              </button>
              <button 
                type="button" 
                @click="activeSizeTarget = 'option'"
                class="py-2 px-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                :class="activeSizeTarget === 'option' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              >
                Option
              </button>
              <button 
                type="button" 
                @click="activeSizeTarget = 'logo'"
                class="py-2 px-1 text-xs font-bold rounded-lg transition-all cursor-pointer"
                :class="activeSizeTarget === 'logo' ? 'bg-amber-500 text-white shadow-xs font-extrabold' : 'text-slate-600 hover:text-slate-900'"
              >
                Logo
              </button>
            </div>

            <!-- Only Active Size Slider Is Shown Here -->
            <div class="bg-slate-50 border border-slate-200/90 p-3.5 rounded-xl">
              <!-- Border Width Slider -->
              <div v-show="activeSizeTarget === 'border'">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span class="font-bold">Border Width</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.borderWidth }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.borderWidth = Math.max(0, style.borderWidth - 1)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >−</button>
                  <input 
                    v-model.number="style.borderWidth"
                    type="range" 
                    min="0" 
                    max="10" 
                    step="1"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.borderWidth = Math.min(10, style.borderWidth + 1)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >+</button>
                </div>
              </div>

              <!-- Type Font Size Slider -->
              <div v-show="activeSizeTarget === 'type'">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span class="font-bold">Type Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.typeFontSize }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.typeFontSize = Math.max(24, style.typeFontSize - 2)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >−</button>
                  <input 
                    v-model.number="style.typeFontSize"
                    type="range" 
                    min="24" 
                    max="68" 
                    step="2"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.typeFontSize = Math.min(68, style.typeFontSize + 2)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >+</button>
                </div>
              </div>

              <!-- Question Size Slider -->
              <div v-show="activeSizeTarget === 'question'">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span class="font-bold">Question Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.questionFontSize }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.questionFontSize = Math.max(28, style.questionFontSize - 2)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >−</button>
                  <input 
                    v-model.number="style.questionFontSize"
                    type="range" 
                    min="28" 
                    max="68" 
                    step="2"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.questionFontSize = Math.min(68, style.questionFontSize + 2)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >+</button>
                </div>
              </div>

              <!-- Option Font Size Slider -->
              <div v-show="activeSizeTarget === 'option'">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span class="font-bold">Option Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ style.optionFontSize }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="style.optionFontSize = Math.max(20, style.optionFontSize - 2)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >−</button>
                  <input 
                    v-model.number="style.optionFontSize"
                    type="range" 
                    min="20" 
                    max="46" 
                    step="2"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="style.optionFontSize = Math.min(46, style.optionFontSize + 2)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >+</button>
                </div>
              </div>

              <!-- Logo Size Slider -->
              <div v-show="activeSizeTarget === 'logo'">
                <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
                  <span class="font-bold">Logo Size</span>
                  <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ logoConfig.size }}px</span>
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    type="button" 
                    @click="logoConfig.size = Math.max(50, logoConfig.size - 10)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >−</button>
                  <input 
                    v-model.number="logoConfig.size"
                    type="range" 
                    min="50" 
                    max="400" 
                    step="5"
                    class="w-full"
                  />
                  <button 
                    type="button" 
                    @click="logoConfig.size = Math.min(400, logoConfig.size + 10)" 
                    class="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-lg shrink-0 active:scale-90 transition-all shadow-xs cursor-pointer select-none"
                  >+</button>
                </div>
              </div>
            </div>

            <!-- Option Badge Shape (Mobile) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-700">Option Badge Shape</span>
                <span class="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 capitalize font-bold">
                  {{ style.optionShape }}
                </span>
              </div>

              <div class="grid grid-cols-5 gap-1.5">
                <button
                  v-for="shp in [
                    { id: 'circle', label: 'Circle', icon: '●' },
                    { id: 'rounded-square', label: 'Squircle', icon: '▢' },
                    { id: 'square', label: 'Square', icon: '■' },
                    { id: 'hexagon', label: 'Hexagon', icon: '⬡' },
                    { id: 'diamond', label: 'Diamond', icon: '◆' }
                  ]"
                  :key="'mob-shp-' + shp.id"
                  type="button"
                  @click="style.optionShape = shp.id as any"
                  class="flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all cursor-pointer text-center"
                  :class="style.optionShape === shp.id ? 'bg-amber-500 text-white border-amber-600 shadow-xs scale-102 font-bold' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
                >
                  <span class="text-base leading-none mb-1">{{ shp.icon }}</span>
                  <span class="text-[10px] tracking-tight">{{ shp.label }}</span>
                </button>
              </div>
            </div>

            <!-- Custom Colors (Mobile) -->
            <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-2.5">
              <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider">Custom Colors</h4>

              <!-- 1. Question Type Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700">Type Heading Color</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.typeColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.typeColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#000000', '#dc2626', '#2563eb', '#059669', '#d97706', '#7c3aed', '#ffffff']"
                    :key="'mob-type-c-' + c"
                    type="button"
                    @click="style.typeColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.typeColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 2. Question Text Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700">Question Color</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.questionColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.questionColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#000000', '#1e293b', '#dc2626', '#2563eb', '#059669', '#d97706', '#ffffff']"
                    :key="'mob-q-c-' + c"
                    type="button"
                    @click="style.questionColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.questionColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 3. Option Text Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-bold text-slate-700">Option Text Color</span>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.optionColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.optionColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#000000', '#1e293b', '#334155', '#2563eb', '#059669', '#dc2626', '#ffffff']"
                    :key="'mob-opt-c-' + c"
                    type="button"
                    @click="style.optionColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.optionColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 4. Option Shape Fill Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="block text-xs font-bold text-slate-700">Option Shape Fill</span>
                    <span class="text-[10px] text-slate-400">Background of A, B, C, D</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.optionBadgeBgColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.optionBadgeBgColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#1f2937', '#000000', '#2563eb', '#059669', '#dc2626', '#d97706', '#7c3aed', '#ffffff']"
                    :key="'mob-badge-bg-c-' + c"
                    type="button"
                    @click="style.optionBadgeBgColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.optionBadgeBgColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>

              <!-- 5. Option Shape Letter Color -->
              <div class="bg-white border border-slate-200/80 p-2.5 rounded-lg space-y-1.5">
                <div class="flex items-center justify-between">
                  <div>
                    <span class="block text-xs font-bold text-slate-700">Option Shape Letter</span>
                    <span class="text-[10px] text-slate-400">Letter inside shape</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <input 
                      v-model="style.optionBadgeTextColor" 
                      type="color" 
                      class="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                    />
                    <span class="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ style.optionBadgeTextColor }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                  <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                  <button
                    v-for="c in ['#ffffff', '#000000', '#facc15', '#f87171', '#6ee7b7']"
                    :key="'mob-badge-text-c-' + c"
                    type="button"
                    @click="style.optionBadgeTextColor = c"
                    class="w-5 h-5 rounded-md border transition-all cursor-pointer shadow-2xs"
                    :class="style.optionBadgeTextColor.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-110' : 'border-slate-300'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>
            </div>
          </div>

          <!-- MOBILE TAB 3: SETTINGS (Fonts, Drag Mode, Watermark) -->
          <div v-show="mobileTab === 'settings'" class="space-y-4">
            <!-- Google Hindi Font Selector Card -->
            <div>
              <div class="flex items-center justify-between mb-1.5">
                <label class="block text-xs font-semibold text-slate-600">Hindi Font</label>
              </div>
              <button 
                type="button"
                @click="openFontModal"
                class="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400 rounded-xl transition-all cursor-pointer group shadow-2xs text-left"
              >
                <div class="flex items-center gap-3">
                  <div>
                    <div class="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>{{ currentFontDisplayName }}</span>
                    </div>
                    <div class="text-xs text-slate-500 font-medium mt-0.5" :style="{ fontFamily: style.fontFamily }">
                      सामान्य विज्ञान प्रश्नोत्तरी
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white group-hover:bg-amber-50 text-amber-600 border border-slate-200 group-hover:border-amber-300 transition-all shadow-2xs">
                  <span>Browse Fonts</span>
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            </div>

            <!-- Drag Switch & Target Selector -->
            <div class="space-y-2 pt-1 border-t border-slate-100">
              <div class="flex items-center justify-between text-xs font-medium text-slate-600">
                <span class="font-bold">Drag Mode</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="enableDrag" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  <span class="ml-2 text-slate-700 text-xs font-bold">{{ enableDrag ? 'ON' : 'OFF' }}</span>
                </label>
              </div>

              <div v-if="enableDrag" class="bg-amber-50/80 border border-amber-200 p-2.5 rounded-xl space-y-1.5">
                <label class="block text-[11px] font-bold text-amber-900">Choose Element</label>
                <div class="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    @click="activeDragTarget = 'type'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'type' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'"
                  >Type</button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'question'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'question' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'"
                  >Question</button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'options'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'options' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'"
                  >Options</button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'logo'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'logo' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'"
                    :disabled="!logoConfig.show"
                  >Logo</button>
                  <button
                    type="button"
                    @click="activeDragTarget = 'watermark'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'watermark' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'"
                    :disabled="!watermark.enabled"
                  >Watermark</button>
                </div>
              </div>
            </div>

            <!-- Logo Controls -->
            <div class="border-t border-slate-100 pt-3 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider">Logo</h3>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="logoConfig.show" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  <span class="ml-2 text-slate-700 text-xs font-bold">{{ logoConfig.show ? 'YES' : 'NO' }}</span>
                </label>
              </div>

              <div v-if="logoConfig.show" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5">
                <!-- Upload / Change Logo Button -->
                <div class="bg-white/90 border border-amber-200/70 p-2 rounded-xl flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div class="w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 p-0.5">
                      <img :src="logoConfig.customUrl || '/logo.png'" alt="Logo Preview" class="w-full h-full object-contain" />
                    </div>
                    <div>
                      <span class="block text-xs font-bold text-slate-800">Post Logo</span>
                      <span class="text-[10px] text-slate-500">{{ logoConfig.customUrl ? 'Custom' : 'Default' }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <button 
                      type="button" 
                      @click="triggerLogoUpload" 
                      class="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <span>Upload</span>
                    </button>
                    <button 
                      v-if="logoConfig.customUrl" 
                      type="button" 
                      @click="resetLogoToDefault" 
                      class="py-1.5 px-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-rose-600 border border-slate-200"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <!-- Logo Size Slider -->
                <div class="bg-white/80 border border-amber-200/70 p-2 rounded-xl">
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span class="font-bold">Logo Size</span>
                    <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ logoConfig.size }}px</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      @click="logoConfig.size = Math.max(50, logoConfig.size - 10)" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90"
                    >−</button>
                    <input 
                      v-model.number="logoConfig.size"
                      type="range" 
                      min="50" 
                      max="400" 
                      step="5"
                      class="w-full"
                    />
                    <button 
                      type="button" 
                      @click="logoConfig.size = Math.min(400, logoConfig.size + 10)" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Background Controls (Mobile) -->
            <div class="border-t border-slate-100 pt-3 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider">Background</h3>
                <!-- Mode Tabs: Color vs Image -->
                <div class="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    @click="setBgType('color')"
                    class="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                    :class="bgConfig.type === 'color' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600'"
                  >Color</button>
                  <button
                    type="button"
                    @click="setBgType('image')"
                    class="px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                    :class="bgConfig.type === 'image' ? 'bg-amber-500 text-white shadow-2xs' : 'text-slate-600'"
                  >Image</button>
                </div>
              </div>

              <!-- Mobile Solid Color Panel -->
              <div v-if="bgConfig.type === 'color'" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5">
                <div class="bg-white/90 border border-amber-200/70 p-2.5 rounded-xl space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold text-slate-700">Solid Color</span>
                    <div class="flex items-center gap-2">
                      <input 
                        v-model="bgConfig.color" 
                        type="color" 
                        class="w-7 h-7 rounded-md border border-slate-300 cursor-pointer p-0 bg-transparent" 
                      />
                      <span class="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 uppercase">{{ bgConfig.color }}</span>
                    </div>
                  </div>

                  <!-- Presets -->
                  <div class="flex items-center gap-1.5 pt-1 border-t border-slate-100 flex-wrap">
                    <span class="text-[10px] text-slate-400 font-semibold shrink-0">Presets:</span>
                    <button
                      v-for="c in ['#ffffff', '#fafaf9', '#f1f5f9', '#fefce8', '#f0fdf4', '#fff1f2', '#1e293b']"
                      :key="'mob-bg-' + c"
                      type="button"
                      @click="bgConfig.color = c"
                      class="w-6 h-6 rounded-md border transition-all cursor-pointer shadow-2xs"
                      :class="bgConfig.color.toLowerCase() === c.toLowerCase() ? 'ring-2 ring-amber-500 border-amber-500 scale-105' : 'border-slate-300'"
                      :style="{ backgroundColor: c }"
                    ></button>
                  </div>
                </div>
              </div>

              <!-- Mobile Background Image Panel -->
              <div v-else class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5">
                <div class="bg-white/90 border border-amber-200/70 p-2 rounded-xl flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2">
                    <div class="w-12 h-10 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                      <img v-if="bgConfig.imageUrl" :src="bgConfig.imageUrl" alt="BG Preview" class="w-full h-full object-cover" />
                      <span v-else class="text-[10px] text-slate-400 font-bold">No Image</span>
                    </div>
                    <div>
                      <span class="block text-xs font-bold text-slate-800">Background Image</span>
                      <span class="text-[10px] text-slate-500">{{ bgConfig.imageUrl ? 'Custom image' : 'No image' }}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-1.5">
                    <button 
                      type="button" 
                      @click="triggerBgUpload" 
                      class="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500 text-white shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <span>{{ bgConfig.imageUrl ? 'Change' : 'Upload' }}</span>
                    </button>
                    <button 
                      v-if="bgConfig.imageUrl" 
                      type="button" 
                      @click="removeBgImage" 
                      class="py-1.5 px-2 rounded-lg text-[11px] font-medium text-slate-500 hover:text-rose-600 border border-slate-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Watermark Controls -->
            <div class="border-t border-slate-100 pt-3 space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-bold text-xs text-slate-700 uppercase tracking-wider">Watermark</h3>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="watermark.enabled" class="sr-only peer" />
                  <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  <span class="ml-2 text-slate-700 text-xs font-bold">{{ watermark.enabled ? 'YES' : 'NO' }}</span>
                </label>
              </div>

              <div v-if="watermark.enabled" class="bg-amber-50/50 border border-amber-200/80 p-3 rounded-xl space-y-2.5">
                <!-- Watermark Opacity Slider -->
                <div class="bg-white/80 border border-amber-200/70 p-2 rounded-xl">
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span class="font-bold">Watermark Opacity</span>
                    <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ Math.round(watermark.opacity * 100) }}%</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      @click="watermark.opacity = Math.max(0.05, +(watermark.opacity - 0.05).toFixed(2))" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90"
                    >−</button>
                    <input 
                      v-model.number="watermark.opacity"
                      type="range" 
                      min="0.05" 
                      max="1.0" 
                      step="0.05"
                      class="w-full"
                    />
                    <button 
                      type="button" 
                      @click="watermark.opacity = Math.min(1.0, +(watermark.opacity + 0.05).toFixed(2))" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90"
                    >+</button>
                  </div>
                </div>

                <!-- Watermark Size Slider -->
                <div class="bg-white/80 border border-amber-200/70 p-2 rounded-xl">
                  <div class="flex justify-between items-center text-xs font-semibold text-slate-700 mb-1">
                    <span class="font-bold">Logo Size</span>
                    <span class="text-amber-600 font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">{{ watermark.size }}px</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <button 
                      type="button" 
                      @click="watermark.size = Math.max(100, watermark.size - 10)" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90"
                    >−</button>
                    <input 
                      v-model.number="watermark.size"
                      type="range" 
                      min="100" 
                      max="700" 
                      step="10"
                      class="w-full"
                    />
                    <button 
                      type="button" 
                      @click="watermark.size = Math.min(700, watermark.size + 10)" 
                      class="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-base shrink-0 active:scale-90"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section> 

      <!-- RIGHT PANEL: Live Preview & Canvas (Top on Mobile, Sticky on Desktop) -->
      <section class="order-1 lg:order-2 lg:col-span-7 lg:sticky lg:top-20 flex flex-col items-center gap-4 bg-white border border-slate-200/90 p-4 sm:p-5 rounded-2xl shadow-sm">
        <div class="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 flex-wrap gap-2">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Preview:</span>
            <!-- Multi-Question Navigation Pills -->
            <div v-if="quizList.length > 1" class="flex items-center gap-1 overflow-x-auto py-0.5">
              <button
                v-for="(_, idx) in quizList"
                :key="'preview-pill-' + idx"
                type="button"
                @click="setActiveQuestion(idx)"
                class="px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer"
                :class="activeQuestionIndex === idx ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
              >
                Q{{ idx + 1 }}
              </button>
            </div>
            <span v-else class="text-[11px] font-bold text-slate-400">Question 1</span>
          </div>
          <div class="text-xs flex items-center gap-2">
            <button @click="resetPositions" class="text-slate-500 hover:text-amber-600 text-xs font-medium cursor-pointer">Reset Positions</button>
          </div>
        </div>

        <!-- Interactive Canvas Container with Dynamic Aspect Ratio -->
        <div 
          class="relative w-full max-w-[560px] overflow-hidden shadow-md border border-slate-300 bg-white flex items-center justify-center"
          :style="{ aspectRatio: selectedRatio === '9:16' ? '9/16' : selectedRatio === '16:9' ? '16/9' : '1/1', maxHeight: selectedRatio === '9:16' ? 'min(700px, calc(100vh - 170px))' : 'min(560px, calc(100vh - 170px))' }"
        >
          <canvas 
            ref="previewCanvas" 
            :width="currentDimensions.w" 
            :height="currentDimensions.h"
            class="w-full h-full object-contain select-none"
            :class="enableDrag ? 'touch-none cursor-move' : 'cursor-default'"
            @mousedown="onCanvasMouseDown"
            @mousemove="onCanvasMouseMove"
            @mouseup="onCanvasMouseUp"
            @mouseleave="onCanvasMouseUp"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
            @touchcancel="onTouchEnd"
          ></canvas>

          <!-- Rendering video overlay -->
          <div 
            v-if="isGeneratingVideo" 
            class="absolute inset-0 bg-slate-900/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20"
          >
            <div class="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin mb-3"></div>
            <p class="font-bold text-lg text-white">Rendering Video...</p>
            <p class="text-xs text-slate-300 mt-1 max-w-xs font-medium">{{ currentVideoStatus }}</p>
            <div class="w-52 bg-slate-800 h-2.5 rounded-full mt-4 overflow-hidden border border-slate-700">
              <div class="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-200" :style="{ width: videoProgress + '%' }"></div>
            </div>
            <span class="text-xs text-amber-400 font-mono mt-1 font-bold">{{ videoProgress }}%</span>
          </div>
        </div>

        <!-- Mobile-Only Action Buttons directly below Preview Canvas -->
        <div class="w-full max-w-[560px] flex lg:hidden flex-col gap-2 pt-1">
          <!-- Download Image & Generate Video Side-by-Side (1 Line) -->
          <div class="grid grid-cols-2 gap-2 w-full">
            <!-- Download Image Button -->
            <button 
              @click="downloadImage"
              type="button"
              class="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Download Image</span>
            </button>

            <!-- Generate Video Button -->
            <button 
              @click="startBulletproofVideoGeneration"
              :disabled="isGeneratingVideo"
              type="button"
              class="w-full py-2.5 px-2 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] border shadow-md"
              :class="isGeneratingVideo ? 'bg-slate-200 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white border-transparent shadow-indigo-500/20'"
            >
              <svg v-if="!isGeneratingVideo" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              <svg v-else class="animate-spin w-4 h-4 shrink-0 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
              <span class="truncate">{{ isGeneratingVideo ? `Generating (${videoProgress}%)` : `Generate Video` }}</span>
            </button>
          </div>

          <!-- Video Ready Controls on Mobile --> 
          <div v-if="generatedVideoUrl" class="mt-1 p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-indigo-900 flex items-center gap-1.5"> 
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                Video Generated
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button 
                @click="playVideoModal = true"
                class="py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Play Video
              </button>
              <button 
                @click="downloadVideo"
                class="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Download Video
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Mobile Fixed Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden px-4 py-2 shadow-xl flex items-center justify-around safe-bottom">
      <!-- Tab 1: Q/A -->
      <button 
        type="button"
        @click="mobileTab = 'qa'"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
        :class="mobileTab === 'qa' ? 'text-amber-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span class="text-[11px] tracking-tight">Q/A</span>
      </button>

      <!-- Tab 2: Size -->
      <button 
        type="button"
        @click="mobileTab = 'size'"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
        :class="mobileTab === 'size' ? 'text-amber-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
        <span class="text-[11px] tracking-tight">Size</span>
      </button>

      <!-- Tab 3: Settings -->
      <button 
        type="button"
        @click="mobileTab = 'settings'"
        class="flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer select-none active:scale-95"
        :class="mobileTab === 'settings' ? 'text-amber-600 font-extrabold' : 'text-slate-500 font-medium hover:text-slate-700'"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span class="text-[11px] tracking-tight">Settings</span>
      </button>
    </nav>

    <!-- Video Modal -->
    <div 
      v-if="playVideoModal && generatedVideoUrl" 
      class="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div class="bg-white border border-slate-200 max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col">
        <div class="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-sm text-slate-800">Video Player</h3>
          <button @click="playVideoModal = false" class="text-slate-400 hover:text-slate-700 p-1 text-base cursor-pointer">✕</button>
        </div>
        <div class="p-4 bg-slate-100 flex items-center justify-center">
          <video 
            :src="generatedVideoUrl" 
            controls 
            autoplay 
            class="max-h-[500px] w-auto border border-slate-300 bg-white"
            :style="{ aspectRatio: selectedRatio === '9:16' ? '9/16' : selectedRatio === '16:9' ? '16/9' : '1/1' }"
          ></video>
        </div>
        <div class="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50">
          <button 
            @click="playVideoModal = false" 
            class="px-4 py-2 rounded-xl text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            Close
          </button>
          <button 
            @click="downloadVideo" 
            class="px-4 py-2 rounded-xl text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
             Download
          </button>
        </div>
      </div>
    </div>

    <!-- Google Hindi Fonts Picker Modal -->
    <div 
      v-if="isFontModalOpen" 
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      @click.self="closeFontModal"
    >
      <div class="bg-white border border-slate-200 max-w-xl w-full rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <!-- Modal Header -->
        <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 class="font-bold text-sm sm:text-base text-slate-800">Hindi Fonts</h3>
            </div>
          </div>
          <button 
            type="button"
            @click="closeFontModal" 
            class="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-lg cursor-pointer transition-colors"
          >✕</button>
        </div>

        <!-- Scrollable Fonts List (One below another) -->
        <div class="flex-1 overflow-y-auto p-3 space-y-2">
          <div 
            v-if="isLoadingFonts && hindiFonts.length === 0" 
            class="py-12 flex flex-col items-center justify-center text-center text-slate-500 text-xs"
          >
            <div class="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mb-2"></div>
            Loading Hindi fonts from Google Fonts API...
          </div>

          <div 
            v-for="font in hindiFonts" 
            :key="font.family"
            @click="tempSelectedFont = font.family"
            class="p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none"
            :class="tempSelectedFont === font.family 
              ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/30 shadow-xs' 
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'"
          >
            <!-- Left Info & Live Hindi Preview -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {{ font.family }}
                </span>
              </div>
              
              <!-- Hindi Sample Text Rendered in this exact font! -->
              <div 
                :style="{ fontFamily: getFontCss(font.family) }" 
                class="text-base sm:text-lg font-bold text-slate-800 tracking-wide truncate"
              >
                सामान्य विज्ञान प्रश्नोत्तरी - सही उत्तर
              </div>
            </div>

            <!-- Right Selection Radio / Checkmark -->
            <div class="shrink-0 flex items-center justify-center">
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                :class="tempSelectedFont === font.family 
                  ? 'bg-amber-500 text-white shadow-xs font-bold text-xs' 
                  : 'border-2 border-slate-300 group-hover:border-slate-400'"
              >
                <span v-if="tempSelectedFont === font.family">✓</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer: Close and Apply buttons -->
        <div class="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div class="text-xs text-slate-600 truncate">
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button 
              type="button" 
              @click="closeFontModal"
              class="px-4 py-2 rounded-xl text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-all cursor-pointer active:scale-95"
            >
              Close
            </button>
            <button 
              type="button" 
              @click="applySelectedFont"
              class="px-5 py-2 rounded-xl text-xs bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold transition-all cursor-pointer shadow-md shadow-orange-500/20 active:scale-95 flex items-center gap-1.5"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              Apply Font
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Global hidden file inputs for background image & custom logo -->
    <input 
      type="file" 
      ref="bgFileInput" 
      accept="image/*" 
      @change="onBgFileChange" 
      class="hidden" 
    />
    <input 
      type="file" 
      ref="logoFileInput" 
      accept="image/*" 
      @change="onLogoFileChange" 
      class="hidden" 
    />

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue';
import { Muxer, ArrayBufferTarget } from 'mp4-muxer';

// Aspect Ratios: 1:1, 9:16, 16:9
type AspectRatio = '1:1' | '9:16' | '16:9';
const selectedRatio = ref<AspectRatio>('1:1');

// Active Tab in Left Panel on Desktop ('question' | 'settings')
const activeTab = ref<'question' | 'settings'>('question');

// Mobile Navigation State ('size' | 'qa' | 'settings')
const mobileTab = ref<'size' | 'qa' | 'settings'>('qa');
const activeSizeTarget = ref<'border' | 'type' | 'question' | 'option' | 'logo'>('type');

const currentDimensions = computed(() => {
  if (selectedRatio.value === '9:16') {
    return { w: 1080, h: 1920 };
  } else if (selectedRatio.value === '16:9') {
    return { w: 1920, h: 1080 };
  }
  return { w: 1080, h: 1080 };
});

async function changeAspectRatio(r: AspectRatio) {
  selectedRatio.value = r;
  resetPositions();
  await nextTick();
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

// Multi-Question Model & Persistence
export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctOption: number;
}

const savedQuizListJson = (() => {
  try {
    const raw = localStorage.getItem('quiz_multi_list');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (_) {}
  return null;
})();

const quizList = reactive<QuizQuestion[]>(
  savedQuizListJson || [
    {
      id: 'q_default',
      category: 'सामान्य विज्ञान',
      question: 'वायुमंडलीय दाब मापने वाला यंत्र कौन-सा है?',
      options: [
        'बैरोमीटर',
        'थर्मामीटर',
        'स्पीडोमीटर',
        'कैलोरीमीटर'
      ],
      correctOption: 1
    }
  ]
);

const activeQuestionIndex = ref(0);

// Active question computed getter for convenience and backwards-compatibility
const quiz = computed(() => {
  if (activeQuestionIndex.value < 0 || activeQuestionIndex.value >= quizList.length) {
    activeQuestionIndex.value = 0;
  }
  return quizList[activeQuestionIndex.value] || quizList[0];
});

watch(
  quizList,
  (newList) => {
    try {
      localStorage.setItem('quiz_multi_list', JSON.stringify(newList));
    } catch (_) {}
  },
  { deep: true }
);

function addQuestion() {
  quizList.push({
    id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    category: quizList[quizList.length - 1]?.category || 'सामान्य विज्ञान',
    question: '',
    options: ['', '', '', ''],
    correctOption: 1
  });
  activeQuestionIndex.value = quizList.length - 1;
}

function addQuestionAfter(idx: number) {
  quizList.splice(idx + 1, 0, {
    id: 'q_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    category: quizList[idx]?.category || 'सामान्य विज्ञान',
    question: '',
    options: ['', '', '', ''],
    correctOption: 1
  });
  activeQuestionIndex.value = idx + 1;
}

function removeQuestion(idx: number) {
  if (quizList.length <= 1) return;
  quizList.splice(idx, 1);
  if (activeQuestionIndex.value >= quizList.length) {
    activeQuestionIndex.value = Math.max(0, quizList.length - 1);
  }
}

function setActiveQuestion(idx: number) {
  activeQuestionIndex.value = idx;
}

// 5 Inbuilt Shapes for Option Letter Badge
type OptionShape = 'circle' | 'rounded-square' | 'square' | 'hexagon' | 'diamond';

const savedStyleJson = (() => {
  try {
    const raw = localStorage.getItem('quiz_style_config');
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
})();

// Styling Model (With Type font size slider, custom colors & 5 option shapes!)
const style = reactive({
  fontFamily: savedStyleJson?.fontFamily || "'Kalam', cursive",
  typeFontSize: savedStyleJson?.typeFontSize ?? 46,       // Independent Type Font Size
  questionFontSize: savedStyleJson?.questionFontSize ?? 50,
  optionFontSize: savedStyleJson?.optionFontSize ?? 36,
  borderWidth: savedStyleJson?.borderWidth ?? 2,
  typeColor: savedStyleJson?.typeColor || '#000000',
  questionColor: savedStyleJson?.questionColor || '#000000',
  optionColor: savedStyleJson?.optionColor || '#000000',
  optionBadgeBgColor: savedStyleJson?.optionBadgeBgColor || '#1f2937',
  optionBadgeTextColor: savedStyleJson?.optionBadgeTextColor || '#ffffff',
  optionShape: (savedStyleJson?.optionShape as OptionShape) || 'circle'
});

// Watch style changes to auto-persist to localStorage
watch(
  style,
  (newStyle) => {
    try {
      localStorage.setItem('quiz_style_config', JSON.stringify({
        fontFamily: newStyle.fontFamily,
        typeFontSize: newStyle.typeFontSize,
        questionFontSize: newStyle.questionFontSize,
        optionFontSize: newStyle.optionFontSize,
        borderWidth: newStyle.borderWidth,
        typeColor: newStyle.typeColor,
        questionColor: newStyle.questionColor,
        optionColor: newStyle.optionColor,
        optionBadgeBgColor: newStyle.optionBadgeBgColor,
        optionBadgeTextColor: newStyle.optionBadgeTextColor,
        optionShape: newStyle.optionShape
      }));
    } catch (_) {}
  },
  { deep: true }
);

// ==========================================
// GOOGLE FONTS DEVELOPER API (Devanagari/Hindi)
// ==========================================
interface HindiFontItem {
  family: string;
  category: string;
}

const GOOGLE_FONTS_API_KEY = 'AIzaSyCl9SxEXh-nqyUza8E0iyLaHSvRFWix95A';

// Fallback / Pre-cached list of 62 Google Devanagari (Hindi) fonts
const DEFAULT_HINDI_FONTS: HindiFontItem[] = [
  { family: "Kalam", category: "handwriting" },
  { family: "Poppins", category: "sans-serif" },
  { family: "Noto Sans Devanagari", category: "sans-serif" },
  { family: "Mukta", category: "sans-serif" },
  { family: "Baloo 2", category: "display" },
  { family: "Rozha One", category: "serif" },
  { family: "Yatra One", category: "display" },
  { family: "Tiro Devanagari Hindi", category: "serif" },
  { family: "Rajdhani", category: "sans-serif" },
  { family: "Hind", category: "sans-serif" },
  { family: "Teko", category: "sans-serif" },
  { family: "Khand", category: "sans-serif" },
  { family: "Martel", category: "serif" },
  { family: "Yantramanav", category: "sans-serif" },
  { family: "Biryani", category: "sans-serif" },
  { family: "Eczar", category: "serif" },
  { family: "Pragati Narrow", category: "sans-serif" },
  { family: "Amita", category: "handwriting" },
  { family: "Palanquin", category: "sans-serif" },
  { family: "Khula", category: "sans-serif" },
  { family: "Sarala", category: "sans-serif" },
  { family: "Martel Sans", category: "sans-serif" },
  { family: "Akshar", category: "sans-serif" },
  { family: "Palanquin Dark", category: "sans-serif" },
  { family: "Glegoo", category: "serif" },
  { family: "Karma", category: "serif" },
  { family: "Amiko", category: "sans-serif" },
  { family: "Halant", category: "serif" },
  { family: "Noto Serif Devanagari", category: "serif" },
  { family: "Inknut Antiqua", category: "serif" },
  { family: "Anek Devanagari", category: "sans-serif" },
  { family: "Alkatra", category: "display" },
  { family: "Kadwa", category: "serif" },
  { family: "Laila", category: "serif" },
  { family: "Cambay", category: "sans-serif" },
  { family: "Gotu", category: "sans-serif" },
  { family: "Jaldi", category: "sans-serif" },
  { family: "Modak", category: "display" },
  { family: "Kurale", category: "serif" },
  { family: "Bakbak One", category: "display" },
  { family: "Sarpanch", category: "sans-serif" },
  { family: "Sumana", category: "serif" },
  { family: "Vesper Libre", category: "serif" },
  { family: "Asar", category: "serif" },
  { family: "Arya", category: "sans-serif" },
  { family: "IBM Plex Sans Devanagari", category: "sans-serif" },
  { family: "Tiro Devanagari Sanskrit", category: "serif" },
  { family: "Sura", category: "serif" },
  { family: "Tillana", category: "display" },
  { family: "Dekko", category: "handwriting" },
  { family: "Sahitya", category: "serif" },
  { family: "Tiro Devanagari Marathi", category: "serif" },
  { family: "Rhodium Libre", category: "serif" },
  { family: "Ranga", category: "display" },
  { family: "Annapurna SIL", category: "serif" },
  { family: "Gajraj One", category: "display" },
  { family: "Jaini Purva", category: "display" },
  { family: "Playpen Sans Deva", category: "handwriting" },
  { family: "Jaini", category: "display" },
  { family: "Kripa", category: "sans-serif" },
  { family: "Matangi", category: "sans-serif" },
  { family: "Noto Sans", category: "sans-serif" }
];

const hindiFonts = ref<HindiFontItem[]>([...DEFAULT_HINDI_FONTS]);
const isFontModalOpen = ref(false);
const fontSearchQuery = ref('');
const tempSelectedFont = ref('Kalam');
const isLoadingFonts = ref(false);

const currentFontDisplayName = computed(() => {
  const match = style.fontFamily.match(/['"]([^'"]+)['"]/);
  return match ? match[1] : style.fontFamily.split(',')[0].trim();
});

const fontCategoryMap = computed(() => {
  const map: Record<string, string> = {};
  for (const f of hindiFonts.value) {
    map[f.family] = f.category === 'handwriting' ? 'cursive' : f.category === 'serif' ? 'serif' : 'sans-serif';
  }
  return map;
});

function getFontCss(family: string) {
  const cat = fontCategoryMap.value[family] || 'sans-serif';
  return `'${family}', ${cat}`;
}

const filteredHindiFonts = computed(() => {
  const q = fontSearchQuery.value.trim().toLowerCase();
  if (!q) return hindiFonts.value;
  return hindiFonts.value.filter(f => f.family.toLowerCase().includes(q));
});

function openFontModal() {
  tempSelectedFont.value = currentFontDisplayName.value;
  fontSearchQuery.value = '';
  isFontModalOpen.value = true;
  injectFontPreviewStylesheets();
  fetchGoogleFontsList();
}

function closeFontModal() {
  isFontModalOpen.value = false;
}

async function applySelectedFont() {
  const fam = tempSelectedFont.value;
  const cat = fontCategoryMap.value[fam] || 'sans-serif';
  style.fontFamily = `'${fam}', ${cat}`;
  isFontModalOpen.value = false;
  await loadGoogleFont(fam);
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

// Dynamically inject stylesheet for individual selected font
async function loadGoogleFont(family: string) {
  const id = `gfont-${family.replace(/\s+/g, '-').toLowerCase()}`;
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;700;800;900&display=swap`;
    document.head.appendChild(link);
  }
  try {
    await document.fonts.load(`700 40px "${family}"`);
    await document.fonts.ready;
  } catch (err) {
    console.warn('Font load warning:', err);
  }
}

// Inject Google Fonts preview batches so each font in modal displays its real Hindi appearance
function injectFontPreviewStylesheets() {
  const families = hindiFonts.value.map(f => f.family);
  const chunkSize = 15;
  for (let i = 0; i < families.length; i += chunkSize) {
    const chunk = families.slice(i, i + chunkSize);
    const linkId = `gfonts-preview-batch-${i}`;
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      const q = chunk.map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@700`).join('&');
      link.href = `https://fonts.googleapis.com/css2?${q}&display=swap`;
      document.head.appendChild(link);
    }
  }
}

// Fetch dynamic updates from Google Fonts API using provided key
async function fetchGoogleFontsList() {
  if (isLoadingFonts.value) return;
  isLoadingFonts.value = true;
  try {
    const res = await fetch(`https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        const devanagariItems = data.items
          .filter((item: any) => item.subsets && item.subsets.includes('devanagari') && item.family !== 'Google Sans')
          .map((item: any) => ({
            family: item.family,
            category: item.category || 'sans-serif'
          }));
        
        if (devanagariItems.length > 0) {
          // Keep Kalam at the top since it is default
          const kalamIdx = devanagariItems.findIndex((f: any) => f.family === 'Kalam');
          if (kalamIdx > -1) {
            const [kalamItem] = devanagariItems.splice(kalamIdx, 1);
            devanagariItems.unshift(kalamItem);
          }
          hindiFonts.value = devanagariItems;
          injectFontPreviewStylesheets();
        }
      }
    }
  } catch (e) {
    console.warn('Failed to fetch from Google Fonts API, using pre-cached Devanagari fonts:', e);
  } finally {
    isLoadingFonts.value = false;
  }
}

// =============================================================================
// IndexedDB Storage Helper for High-Res Persistent Media Assets (Background & Logo)
// =============================================================================
const DB_NAME = 'QuizStudioAssetsDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_assets';

function openAssetDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not supported in this browser'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveAssetToStorage(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openAssetDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn(`IndexedDB save error for ${key}:`, err);
    try {
      localStorage.setItem(`quiz_asset_${key}`, dataUrl);
    } catch (_) {}
  }
}

async function getAssetFromStorage(key: string): Promise<string | null> {
  try {
    const db = await openAssetDb();
    return await new Promise<string | null>((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => {
        db.close();
        resolve((req.result as string) || null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    });
  } catch (err) {
    try {
      return localStorage.getItem(`quiz_asset_${key}`) || null;
    } catch (_) {
      return null;
    }
  }
}

async function deleteAssetFromStorage(key: string): Promise<void> {
  try {
    const db = await openAssetDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    });
  } catch (err) {
    console.warn(`IndexedDB delete error for ${key}:`, err);
  }
  try {
    localStorage.removeItem(`quiz_asset_${key}`);
  } catch (_) {}
}

// Top Logo Model (Upload, Toggle YES/NO, Custom Size, Draggable)
const savedLogoShow = localStorage.getItem('quiz_logo_show');
const logoConfig = reactive({
  show: savedLogoShow !== null ? savedLogoShow === 'true' : false, // Default: NO (side logo removed, watermark kept)
  size: 160,            // Default: 160px
  customUrl: ''
});

watch(() => logoConfig.show, (newVal) => {
  try {
    localStorage.setItem('quiz_logo_show', String(newVal));
  } catch (_) {}
});

const logoFileInput = ref<HTMLInputElement | null>(null);

function triggerLogoUpload() {
  logoFileInput.value?.click();
}

async function onLogoFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const result = event.target?.result as string;
    if (!result) return;
    
    // Persist custom logo in IndexedDB (replaces previous logo)
    await saveAssetToStorage('custom_logo', result);

    logoConfig.customUrl = result;
    const img = new Image();
    img.onload = () => {
      logoImg = img;
      renderCanvas(-1, 4, 0.0, false, false, 1.0);
    };
    img.src = result;
  };
  reader.readAsDataURL(file);
  target.value = '';
}

async function resetLogoToDefault() {
  await deleteAssetFromStorage('custom_logo');
  logoConfig.customUrl = '';
  const img = new Image();
  img.onload = () => {
    logoImg = img;
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
  };
  img.src = '/logo.png';
}

// Background Model (Solid Color or Uploaded Custom Image)
const bgConfig = reactive({
  type: 'color' as 'color' | 'image',
  color: '#ffffff',
  imageUrl: ''
});

let bgImg: HTMLImageElement | null = null;
const bgFileInput = ref<HTMLInputElement | null>(null);

function setBgType(type: 'color' | 'image') {
  bgConfig.type = type;
  try {
    localStorage.setItem('quiz_bg_type', type);
  } catch (_) {}
  if (type === 'image' && !bgConfig.imageUrl) {
    triggerBgUpload();
  }
}

function triggerBgUpload() {
  bgFileInput.value?.click();
}

async function onBgFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    const result = event.target?.result as string;
    if (!result) return;
    
    // Save image to IndexedDB (cleanly overwrites/replaces previously stored background image)
    await saveAssetToStorage('bg_image', result);

    bgConfig.imageUrl = result;
    bgConfig.type = 'image';
    try {
      localStorage.setItem('quiz_bg_type', 'image');
    } catch (_) {}

    const img = new Image();
    img.onload = () => {
      bgImg = img;
      renderCanvas(-1, 4, 0.0, false, false, 1.0);
    };
    img.src = result;
  };
  reader.readAsDataURL(file);
  target.value = '';
}

async function removeBgImage() {
  // Completely delete background image from persistent storage
  await deleteAssetFromStorage('bg_image');
  bgConfig.imageUrl = '';
  bgConfig.type = 'color';
  bgImg = null;
  try {
    localStorage.setItem('quiz_bg_type', 'color');
  } catch (_) {}
  renderCanvas(-1, 4, 0.0, false, false, 1.0);
}

// Watermark Logo Model
const watermark = reactive({
  enabled: true,
  opacity: 0.15,
  size: 340,
  offsetX: 0,
  offsetY: 0,
  transparentOptions: true
});

function resetWatermarkPosition() {
  watermark.offsetX = 0;
  watermark.offsetY = 0;
}

// Positioning offsets (completely independent dragging everywhere without bounds)
const offsets = reactive({
  typeX: 0,
  typeY: 0,
  questionX: 0,
  questionY: 0,
  optionsX: 0,
  optionsY: 0,
  logoX: 0,
  logoY: 0
});

const enableDrag = ref(false);
type DragTarget = 'type' | 'question' | 'options' | 'logo' | 'watermark';
const activeDragTarget = ref<DragTarget>('type');
const isDragging = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let initialTargetX = 0;
let initialTargetY = 0;

// Video Generation State
const isGeneratingVideo = ref(false);
const videoProgress = ref(0);
const currentVideoStatus = ref('Preparing Audio & Animation...');
const generatedVideoUrl = ref<string | null>(null);
const playVideoModal = ref(false);
const isPlayingAudioTest = ref(false);
const isPlayingSfxTest = ref(false);

const previewCanvas = ref<HTMLCanvasElement | null>(null);

// Preloaded Assets
let logoImg: HTMLImageElement | null = null;

onMounted(async () => {
  // 1. Restore Custom Logo if previously saved in IndexedDB
  const savedLogo = await getAssetFromStorage('custom_logo');
  if (savedLogo) {
    logoConfig.customUrl = savedLogo;
    logoImg = new Image();
    logoImg.src = savedLogo;
  } else {
    logoImg = new Image();
    logoImg.src = '/logo.png';
  }

  // 2. Restore Background Image if previously saved in IndexedDB
  const savedBg = await getAssetFromStorage('bg_image');
  let bgLoadedPromise: Promise<void> = Promise.resolve();
  if (savedBg) {
    bgConfig.imageUrl = savedBg;
    const savedType = localStorage.getItem('quiz_bg_type');
    if (savedType === 'image') {
      bgConfig.type = 'image';
    }
    bgImg = new Image();
    bgLoadedPromise = new Promise((res) => {
      bgImg!.onload = () => res();
      bgImg!.onerror = () => res();
    });
    bgImg.src = savedBg;
  }

  // Restore saved solid bg color if previously chosen
  const savedColor = localStorage.getItem('quiz_bg_color');
  if (savedColor) {
    bgConfig.color = savedColor;
  }

  await Promise.all([
    new Promise((resolve) => { logoImg!.onload = resolve; logoImg!.onerror = resolve; }),
    bgLoadedPromise,
    document.fonts.ready
  ]);

  renderCanvas(-1, 4, 0.0, false, false, 1.0);
});

// Watch bg color to persist in localStorage
watch(() => bgConfig.color, (newColor) => {
  try {
    localStorage.setItem('quiz_bg_color', newColor);
  } catch (_) {}
});

// Watch inputs to re-render in real-time
watch(
  [quizList, activeQuestionIndex, style, offsets, watermark, logoConfig, bgConfig, selectedRatio],
  async () => {
    await nextTick();
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
  },
  { deep: true }
);

function resetToExactSample() {
  quizList.splice(0, quizList.length, {
    id: 'q_default',
    category: 'सामान्य विज्ञान',
    question: 'वायुमंडलीय दाब मापने वाला यंत्र कौन-सा है?',
    options: [
      'बैरोमीटर',
      'थर्मामीटर',
      'स्पीडोमीटर',
      'कैलोरीमीटर'
    ],
    correctOption: 1
  });
  activeQuestionIndex.value = 0;
  style.typeFontSize = 46;
  style.questionFontSize = 50;
  style.optionFontSize = 36;
  style.borderWidth = 4;
  style.typeColor = '#000000';
  style.questionColor = '#000000';
  style.optionColor = '#000000';
  style.optionBadgeBgColor = '#1f2937';
  style.optionBadgeTextColor = '#ffffff';
  style.optionShape = 'circle';
  resetPositions();
}

function resetPositions() {
  offsets.typeX = 0;
  offsets.typeY = 0;
  offsets.questionX = 0;
  offsets.questionY = 0;
  offsets.optionsX = 0;
  offsets.optionsY = 0;
  offsets.logoX = 0;
  offsets.logoY = 0;
  watermark.offsetX = 0;
  watermark.offsetY = 0;
}

// ----------------- GOOGLE TTS AUDIO GENERATOR -----------------
async function fetchTtsAudioBuffer(text: string, audioCtx: AudioContext): Promise<{ buffer: AudioBuffer, duration: number }> {
  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, lang: 'hi' })
  });

  if (!res.ok) {
    throw new Error(`TTS server responded with ${res.status}`);
  }

  const arrayBuffer = await res.arrayBuffer();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  return {
    buffer: audioBuffer,
    duration: audioBuffer.duration
  };
}

// Quick Audio Test
async function testVoiceAudio() {
  if (isPlayingAudioTest.value) return;
  isPlayingAudioTest.value = true;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const curQ = quizList[activeQuestionIndex.value] || quizList[0];
    const testText = `${curQ.question || 'प्रश्न'}`;
    const { buffer } = await fetchTtsAudioBuffer(testText, audioCtx);
    const source = audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(audioCtx.destination);
    source.start(0);
    source.onended = () => {
      isPlayingAudioTest.value = false;
    };
  } catch (err) {
    console.error(err);
    alert('Voice test failed: ' + err);
    isPlayingAudioTest.value = false;
  }
}

// Helper: Fetch and decode static audio asset file
async function fetchAudioFileBuffer(url: string, audioCtx: AudioContext): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn(`Could not load audio asset ${url}:`, err);
    return null;
  }
}

// Quick SFX Test (Plays 3s of Timer Sound followed immediately by Correct Answer Sound)
async function testSfxAudio() {
  if (isPlayingSfxTest.value) return;
  isPlayingSfxTest.value = true;
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    const [timerBuf, corrBuf] = await Promise.all([
      fetchAudioFileBuffer('/timer-sound.wav', audioCtx),
      fetchAudioFileBuffer('/correct-answer-sound.wav', audioCtx)
    ]);

    if (timerBuf) {
      const srcTimer = audioCtx.createBufferSource();
      const gainTimer = audioCtx.createGain();
      srcTimer.buffer = timerBuf;
      gainTimer.gain.value = 0.85;
      srcTimer.connect(gainTimer);
      gainTimer.connect(audioCtx.destination);
      srcTimer.start(0);
      srcTimer.stop(audioCtx.currentTime + 3.0);
    }

    setTimeout(() => {
      if (corrBuf) {
        const srcCorr = audioCtx.createBufferSource();
        const gainCorr = audioCtx.createGain();
        srcCorr.buffer = corrBuf;
        gainCorr.gain.value = 0.95;
        srcCorr.connect(gainCorr);
        gainCorr.connect(audioCtx.destination);
        srcCorr.start(0);
        srcCorr.onended = () => {
          isPlayingSfxTest.value = false;
        };
      } else {
        isPlayingSfxTest.value = false;
      }
    }, 3100);
  } catch (err) {
    console.error(err);
    isPlayingSfxTest.value = false;
  }
}

// Helper: Smart Wrap text on canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth) {
      if (currentLine !== '') {
        lines.push(currentLine);
        if (ctx.measureText(word).width > maxWidth) {
          let subWord = '';
          for (const char of word) {
            if (ctx.measureText(subWord + char).width > maxWidth) {
              lines.push(subWord);
              subWord = char;
            } else {
              subWord += char;
            }
          }
          currentLine = subWord;
        } else {
          currentLine = word;
        }
      } else {
        let subWord = '';
        for (const char of word) {
          if (ctx.measureText(subWord + char).width > maxWidth) {
            lines.push(subWord);
            subWord = char;
          } else {
            subWord += char;
          }
        }
        currentLine = subWord;
      }
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Helper: Draw rounded pill rectangle
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// Helper: Draw 5 Inbuilt Shapes for Option Letter Badge (Circle, Squircle, Square, Hexagon, Diamond)
function drawOptionShape(
  ctx: CanvasRenderingContext2D,
  shape: OptionShape,
  cx: number,
  cy: number,
  size: number
) {
  const r = size / 2;
  ctx.beginPath();
  switch (shape) {
    case 'circle': {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    }
    case 'rounded-square': {
      const x = cx - r;
      const y = cy - r;
      const cornerR = r * 0.35;
      roundRect(ctx, x, y, size, size, cornerR);
      break;
    }
    case 'square': {
      const x = cx - r;
      const y = cy - r;
      ctx.rect(x, y, size, size);
      break;
    }
    case 'hexagon': {
      for (let s = 0; s < 6; s++) {
        const angle = (s * Math.PI) / 3 - Math.PI / 6;
        const hx = cx + r * Math.cos(angle);
        const hy = cy + r * Math.sin(angle);
        if (s === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      break;
    }
    case 'diamond': {
      const dr = r * 1.05;
      ctx.moveTo(cx, cy - dr);
      ctx.lineTo(cx + dr, cy);
      ctx.lineTo(cx, cy + dr);
      ctx.lineTo(cx - dr, cy);
      ctx.closePath();
      break;
    }
    default: {
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    }
  }
}

// Helper: Normalize options progress (supports number[] or legacy count number 0..4)
function normalizeOptsProgress(opts: number[] | number | undefined): number[] {
  if (Array.isArray(opts)) return opts;
  const count = typeof opts === 'number' ? opts : 4;
  return [0, 1, 2, 3].map((i) => (i < count ? 1.0 : 0.0));
}

/**
 * Core render routine to any CanvasRenderingContext2D
 */
function renderCanvasToCtx(
  ctx: CanvasRenderingContext2D,
  targetCanvas: HTMLCanvasElement,
  questionAnimProgress: number = 1.0,
  optsProgress: number[] | number = [1.0, 1.0, 1.0, 1.0],
  animProgress: number = 0.0,
  revealCorrect: boolean = false,
  showTimer: boolean = false,
  pulseScale: number = 1.0,
  targetQuiz?: QuizQuestion
) {
  const W = targetCanvas.width;
  const H = targetCanvas.height;
  const curQuiz = targetQuiz || quizList[activeQuestionIndex.value] || quizList[0];

  // 1. Canvas Background (Solid Color or Uploaded Image)
  if (bgConfig.type === 'image' && bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
    // Fallback solid base
    ctx.fillStyle = bgConfig.color || '#ffffff';
    ctx.fillRect(0, 0, W, H);

    // Draw background image with aspect cover (fills full canvas perfectly without distortion)
    ctx.save();
    const imgW = bgImg.naturalWidth;
    const imgH = bgImg.naturalHeight;
    const canvasAspect = W / H;
    const imgAspect = imgW / imgH;

    let sx = 0, sy = 0, sW = imgW, sH = imgH;
    if (imgAspect > canvasAspect) {
      sW = imgH * canvasAspect;
      sx = (imgW - sW) / 2;
    } else {
      sH = imgW / canvasAspect;
      sy = (imgH - sH) / 2;
    }
    ctx.drawImage(bgImg, sx, sy, sW, sH, 0, 0, W, H);
    ctx.restore();
  } else {
    // Solid Color (Default: #ffffff)
    ctx.fillStyle = bgConfig.color || '#ffffff';
    ctx.fillRect(0, 0, W, H);
  }

  // 2. Outer Black Frame Border (Drawn only if borderWidth > 0)
  const bw = Math.max(0, style.borderWidth);
  if (bw > 0) {
    ctx.lineWidth = bw;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);
  }

  // 2.5 Optional Center Watermark Logo (Active ONLY when YES/enabled, aspect-ratio preserved)
  if (watermark.enabled && logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.01, Math.min(1.0, watermark.opacity));
    const maxDim = watermark.size;
    const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
    let wmW = maxDim;
    let wmH = maxDim;
    if (aspect > 1) {
      wmW = maxDim;
      wmH = maxDim / aspect;
    } else {
      wmH = maxDim;
      wmW = maxDim * aspect;
    }
    const wmX = (W - wmW) / 2 + watermark.offsetX;
    const wmY = (H - wmH) / 2 + watermark.offsetY;
    ctx.drawImage(logoImg, wmX, wmY, wmW, wmH);
    ctx.restore();
  }

  // Scale references based on height & width
  const isReel = selectedRatio.value === '9:16';
  const isLandscape = selectedRatio.value === '16:9';

  // 3. Top-Left Category (Type Heading) - Independent Dragging Anywhere!
  const categoryText = (curQuiz.category || 'सामान्य विज्ञान').trim();
  const typeBaseX = 64 + offsets.typeX;
  const typeBaseY = (isReel ? 120 : isLandscape ? 40 : 55) + offsets.typeY;

  ctx.save();
  ctx.fillStyle = style.typeColor || '#000000';
  ctx.font = `700 ${style.typeFontSize}px ${style.fontFamily}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(categoryText, typeBaseX, typeBaseY);
  ctx.restore();

  // 4. Logo (Top-Right Default, Drag Anywhere, Configurable Size & Visibility)
  if (logoConfig.show && logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    const maxDim = logoConfig.size;
    const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
    let logoW = maxDim;
    let logoH = maxDim;
    if (aspect > 1) {
      logoW = maxDim;
      logoH = maxDim / aspect;
    } else {
      logoH = maxDim;
      logoW = maxDim * aspect;
    }

    const baseLogoX = W - logoW - (isLandscape ? 40 : 55);
    const baseLogoY = isReel ? 95 : isLandscape ? 25 : 32;
    const logoX = baseLogoX + offsets.logoX;
    const logoY = baseLogoY + offsets.logoY;
    ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    ctx.restore();
  }

  // 5. Question Section (Directly visible, no animation or typewriter)
  const questionBaseX = W / 2 + offsets.questionX;
  const questionBaseY = (isReel ? 420 : isLandscape ? 180 : 220) + offsets.questionY;
  const questionMaxW = isLandscape ? 1600 : 920;

  const fullQuestion = curQuiz.question || 'प्रश्न यहाँ दिखाई देगा...';

  ctx.save();
  ctx.fillStyle = style.questionColor || '#000000';
  ctx.font = `700 ${style.questionFontSize}px ${style.fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  const qLines = wrapText(ctx, fullQuestion, questionMaxW);
  const qLineHeight = style.questionFontSize * 1.32;
  const totalQuestionHeight = qLines.length * qLineHeight;

  // Question is directly visible right from the very start
  for (let i = 0; i < qLines.length; i++) {
    ctx.fillText(qLines[i], questionBaseX, questionBaseY + (i * qLineHeight));
  }
  ctx.restore();

  // 6. Black Timer Line (5-second countdown timer)
  const timerY = questionBaseY + totalQuestionHeight + (isReel ? 30 : 20);
  if (showTimer) {
    ctx.save();
    const timerW = isLandscape ? 1400 : 900;
    const timerH = 8;
    const timerX = (W - timerW) / 2;

    ctx.fillStyle = '#e5e7eb';
    roundRect(ctx, timerX, timerY, timerW, timerH, 4);
    ctx.fill();

    const fillW = Math.max(0, timerW * (1 - animProgress));
    ctx.fillStyle = '#000000';
    roundRect(ctx, timerX, timerY, fillW, timerH, 4);
    ctx.fill();
    ctx.restore();
  }

  // 7. Four Options with Canva Pan Animation (Slide in from Left →) & Shape Badge
  const optW = isLandscape ? 1400 : 910;
  const optX = (W - optW) / 2 + offsets.optionsX;
  const optGap = isReel ? 28 : isLandscape ? 16 : 16;
  const optionsStartY = (isReel ? 780 : isLandscape ? 400 : 430) + offsets.optionsY;
  const letters = ['A', 'B', 'C', 'D'];

  const shapeSize = isReel ? 68 : isLandscape ? 58 : 64;
  const shapeMarginLeft = 14;
  const textStartX = optX + shapeMarginLeft + shapeSize + (isReel ? 26 : 20);
  const maxTextAvailableWidth = optW - (shapeMarginLeft + shapeSize + 40);

  ctx.font = `700 ${style.optionFontSize}px ${style.fontFamily}`;

  const normalizedOpts = normalizeOptsProgress(optsProgress);

  let currentY = optionsStartY;

  for (let i = 0; i < 4; i++) {
    const panP = normalizedOpts[i] !== undefined ? normalizedOpts[i] : 1.0;
    const optionText = curQuiz.options[i] || `Option ${letters[i]}`;
    
    const optLines = wrapText(ctx, optionText, maxTextAvailableWidth);
    const lineH = style.optionFontSize * 1.25;
    
    const contentH = optLines.length * lineH;
    const optH = Math.max(isReel ? 84 : 72, contentH + 24);

    const isCorrect = (curQuiz.correctOption === i + 1);
    const isHighlighted = revealCorrect && isCorrect;

    if (panP > 0.001) {
      ctx.save();

      // Canva Pan Animation: Ease-Out Cubic translation from left (→) + Opacity Fade-in
      if (panP < 1.0) {
        const ease = 1 - Math.pow(1 - panP, 3);
        const panOffsetX = (1 - ease) * -180;
        const panOpacity = Math.min(1.0, panP * 1.6);
        ctx.globalAlpha = panOpacity;
        ctx.translate(panOffsetX, 0);
      }

      if (isHighlighted) {
        const cx = optX + optW / 2;
        const cy = currentY + optH / 2;
        ctx.translate(cx, cy);
        ctx.scale(pulseScale, pulseScale);
        ctx.translate(-cx, -cy);
      }

      // Draw Option Shape (Circle [default], Squircle, Square, Hexagon, Diamond)
      const shapeCenterX = optX + shapeMarginLeft + shapeSize / 2;
      const shapeCenterY = currentY + optH / 2;

      ctx.save();
      const badgeBgColor = isHighlighted ? '#16a34a' : (style.optionBadgeBgColor || '#1f2937');
      ctx.fillStyle = badgeBgColor;
      drawOptionShape(ctx, style.optionShape || 'circle', shapeCenterX, shapeCenterY, shapeSize);
      ctx.fill();

      // Shape Letter (A, B, C, D)
      const badgeTextColor = isHighlighted ? '#ffffff' : (style.optionBadgeTextColor || '#ffffff');
      ctx.fillStyle = badgeTextColor;
      ctx.font = `800 ${isReel ? 30 : 26}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letters[i], shapeCenterX, shapeCenterY + 1);
      ctx.restore();

      // Render Option Name / Text (Aligned cleanly to left, customizable color)
      ctx.fillStyle = isHighlighted ? '#15803d' : (style.optionColor || '#000000');
      ctx.font = `${isHighlighted ? '800' : '700'} ${style.optionFontSize}px ${style.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const startTextY = currentY + (optH - (optLines.length - 1) * lineH) / 2;
      for (let l = 0; l < optLines.length; l++) {
        ctx.fillText(optLines[l], textStartX, startTextY + l * lineH);
      }

      ctx.restore();
    }

    currentY += optH + optGap;
  }
}

/**
 * Main render function for canvas preview
 */
function renderCanvas(
  questionAnimProgress: number = 1.0,
  optsProgress: number[] | number = [1.0, 1.0, 1.0, 1.0],
  animProgress: number = 0.0,
  revealCorrect: boolean = false,
  showTimer: boolean = false,
  pulseScale: number = 1.0
) {
  const canvas = previewCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  renderCanvasToCtx(
    ctx,
    canvas,
    questionAnimProgress,
    optsProgress,
    animProgress,
    revealCorrect,
    showTimer,
    pulseScale
  );
}

// ----------------- TARGETED DRAG AND DROP (PC MOUSE + MOBILE TOUCH) -----------------
function getCanvasCoords(clientX: number, clientY: number): { x: number; y: number } | null {
  const canvas = previewCanvas.value;
  if (!canvas) return null;
  const rect = canvas.getBoundingClientRect();
  const scale = currentDimensions.value.w / rect.width;
  return {
    x: (clientX - rect.left) * scale,
    y: (clientY - rect.top) * scale
  };
}

function startDragging(clientX: number, clientY: number) {
  if (!enableDrag.value) return;
  const coords = getCanvasCoords(clientX, clientY);
  if (!coords) return;

  isDragging.value = true;
  dragStartX = coords.x;
  dragStartY = coords.y;

  // Lock initial coordinates of the chosen target
  if (activeDragTarget.value === 'type') {
    initialTargetX = offsets.typeX;
    initialTargetY = offsets.typeY;
  } else if (activeDragTarget.value === 'question') {
    initialTargetX = offsets.questionX;
    initialTargetY = offsets.questionY;
  } else if (activeDragTarget.value === 'options') {
    initialTargetX = offsets.optionsX;
    initialTargetY = offsets.optionsY;
  } else if (activeDragTarget.value === 'logo') {
    initialTargetX = offsets.logoX;
    initialTargetY = offsets.logoY;
  } else if (activeDragTarget.value === 'watermark') {
    initialTargetX = watermark.offsetX;
    initialTargetY = watermark.offsetY;
  }
}

function moveDragging(clientX: number, clientY: number) {
  if (!enableDrag.value || !isDragging.value) return;
  const coords = getCanvasCoords(clientX, clientY);
  if (!coords) return;

  const deltaX = coords.x - dragStartX;
  const deltaY = coords.y - dragStartY;

  // ONLY move the explicitly selected element! All others remain completely untouched.
  if (activeDragTarget.value === 'type') {
    offsets.typeX = initialTargetX + deltaX;
    offsets.typeY = initialTargetY + deltaY;
  } else if (activeDragTarget.value === 'question') {
    offsets.questionX = initialTargetX + deltaX;
    offsets.questionY = initialTargetY + deltaY;
  } else if (activeDragTarget.value === 'options') {
    offsets.optionsX = initialTargetX + deltaX;
    offsets.optionsY = initialTargetY + deltaY;
  } else if (activeDragTarget.value === 'logo') {
    offsets.logoX = initialTargetX + deltaX;
    offsets.logoY = initialTargetY + deltaY;
  } else if (activeDragTarget.value === 'watermark') {
    watermark.offsetX = initialTargetX + deltaX;
    watermark.offsetY = initialTargetY + deltaY;
  }
}

function stopDragging() {
  isDragging.value = false;
}

// Mouse Event Handlers
function onCanvasMouseDown(e: MouseEvent) {
  startDragging(e.clientX, e.clientY);
}

function onCanvasMouseMove(e: MouseEvent) {
  moveDragging(e.clientX, e.clientY);
}

function onCanvasMouseUp() {
  stopDragging();
}

// Touch Event Handlers for Mobile Phones & Tablets
function onTouchStart(e: TouchEvent) {
  if (!enableDrag.value) return; // Allow natural smooth page scrolling when Drag Mode is OFF
  if (e.cancelable) e.preventDefault();
  if (e.touches && e.touches.length > 0) {
    const t = e.touches[0];
    startDragging(t.clientX, t.clientY);
  }
}

function onTouchMove(e: TouchEvent) {
  if (!enableDrag.value) return; // Allow natural smooth page scrolling when Drag Mode is OFF
  if (e.cancelable) e.preventDefault();
  if (e.touches && e.touches.length > 0) {
    const t = e.touches[0];
    moveDragging(t.clientX, t.clientY);
  }
}

function onTouchEnd() {
  stopDragging();
}

// ----------------- DOWNLOAD IMAGE (CRYSTAL CLEAR ULTRA-HD 4K) -----------------
async function downloadImage() {
  const baseW = currentDimensions.value.w;
  const baseH = currentDimensions.value.h;

  // 1. Ensure all custom fonts (Google Fonts) are completely loaded before render
  try {
    if (document.fonts) {
      await document.fonts.ready;
    }
  } catch (e) {
    console.warn('Font ready check warning:', e);
  }

  // 2. High-Resolution 2x Ultra-HD Offscreen Canvas (2160x2160 / 2160x3840 / 3840x2160)
  const scale = 2;
  const hdCanvas = document.createElement('canvas');
  hdCanvas.width = baseW * scale;
  hdCanvas.height = baseH * scale;

  const hdCtx = hdCanvas.getContext('2d', { alpha: false });
  if (!hdCtx) return;

  // High quality smoothing for logos & silhouettes
  hdCtx.imageSmoothingEnabled = true;
  hdCtx.imageSmoothingQuality = 'high';

  // Apply 2x scale: all drawing commands render with 2x subpixel rasterization & zero blur
  hdCtx.save();
  hdCtx.scale(scale, scale);

  renderCanvasToCtx(
    hdCtx,
    { width: baseW, height: baseH } as HTMLCanvasElement,
    1.0,
    [1.0, 1.0, 1.0, 1.0],
    0.0,
    false,
    false,
    1.0
  );
  hdCtx.restore();

  // 3. Export as pristine lossless PNG blob (avoids dataURL truncation and blur)
  hdCanvas.toBlob((blob) => {
    if (!blob) {
      const fallbackUrl = hdCanvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `hindi-quiz-hd-${selectedRatio.value}-${Date.now()}.png`;
      link.href = fallbackUrl;
      link.click();
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `hindi-quiz-hd-${selectedRatio.value}-${Date.now()}.png`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1500);
  }, 'image/png');
}

// Helper: Convert AudioBuffer to WAV Blob
function audioBufferToWavBlob(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const len = buffer.length;
  const dataSize = len * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < len; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = buffer.getChannelData(channel)[i];
      sample = Math.max(-1, Math.min(1, sample));
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// ----------------- TOP-CLASS MULTI-QUESTION VIDEO COMPILATION GENERATOR -----------------
async function startBulletproofVideoGeneration() {
  if (isGeneratingVideo.value) return;
  isGeneratingVideo.value = true;
  videoProgress.value = 5;
  currentVideoStatus.value = `Step 1/3: Preparing Audio for ${quizList.length} Question(s)...`;

  const canvas = previewCanvas.value;
  if (!canvas) {
    isGeneratingVideo.value = false;
    return;
  }

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    
    const letters = ['A', 'B', 'C', 'D'];
    const letterNamesHindi = ['ए', 'बी', 'सी', 'डी'];

    // Preload sound effects once
    const [timerSoundBuf, correctSoundBuf] = await Promise.all([
      fetchAudioFileBuffer('/timer-sound.wav', audioCtx),
      fetchAudioFileBuffer('/correct-answer-sound.wav', audioCtx)
    ]);

    interface QuestionSegment {
      index: number;
      quizItem: QuizQuestion;
      startTime: number;
      duration: number;
      contentDuration: number;
      pauseAfter: number;
      opt0Start: number;
      opt1Start: number;
      opt2Start: number;
      opt3Start: number;
      timerStart: number;
      timerCountdown: number;
      timerEnd: number;
      revealStart: number;
    }

    const segments: QuestionSegment[] = [];
    let currentTimeline = 0;

    const audioPlacementList: Array<{
      buffer: AudioBuffer | null;
      startSec: number;
      maxDurationSec?: number;
      volume?: number;
      fadeOutSec?: number;
    }> = [];

    // 1. Generate Voice and build segments for all questions sequentially
    for (let qIdx = 0; qIdx < quizList.length; qIdx++) {
      const qItem = quizList[qIdx];
      const qNum = qIdx + 1;
      currentVideoStatus.value = `Step 1/3: Generating Audio for Question ${qNum}/${quizList.length}...`;
      videoProgress.value = Math.round(5 + (qIdx / quizList.length) * 15);

      const correctLetterHindi = letterNamesHindi[qItem.correctOption - 1] || 'ए';
      const correctOptionText = qItem.options[qItem.correctOption - 1] || '';

      const questionSpeechText = `${qItem.question || 'प्रश्न ' + qNum}`;
      const optTexts = [
        `ऑप्शन ए: ${qItem.options[0] || 'ऑप्शन ए'}`,
        `ऑप्शन बी: ${qItem.options[1] || 'ऑप्शन बी'}`,
        `ऑप्शन सी: ${qItem.options[2] || 'ऑप्शन सी'}`,
        `ऑप्शन डी: ${qItem.options[3] || 'ऑप्शन डी'}`
      ];
      const correctSpeechText = `सही उत्तर है: ऑप्शन ${correctLetterHindi}, ${correctOptionText}`;

      const [qAudio, opt0Audio, opt1Audio, opt2Audio, opt3Audio, corrAudio] = await Promise.all([
        fetchTtsAudioBuffer(questionSpeechText, audioCtx),
        fetchTtsAudioBuffer(optTexts[0], audioCtx),
        fetchTtsAudioBuffer(optTexts[1], audioCtx),
        fetchTtsAudioBuffer(optTexts[2], audioCtx),
        fetchTtsAudioBuffer(optTexts[3], audioCtx),
        fetchTtsAudioBuffer(correctSpeechText, audioCtx)
      ]);

      const qDuration = Math.max(3.0, qAudio.duration + 0.3);
      const opt0Dur = opt0Audio.duration + 0.25;
      const opt1Dur = opt1Audio.duration + 0.25;
      const opt2Dur = opt2Audio.duration + 0.25;
      const opt3Dur = opt3Audio.duration + 0.35;

      const opt0Start = qDuration;
      const opt1Start = opt0Start + opt0Dur;
      const opt2Start = opt1Start + opt1Dur;
      const opt3Start = opt2Start + opt2Dur;
      const optionsEnd = opt3Start + opt3Dur;

      const timerCountdown = 5.0; // 5s timer
      const timerStart = optionsEnd;
      const timerEnd = timerStart + timerCountdown;

      const revealStart = timerEnd;
      const corrSoundLead = 0.35; // Chime rings and voice starts right away
      const corrSpeechStart = revealStart + corrSoundLead;
      const revealDuration = corrSoundLead + corrAudio.duration + 0.25; // Clean 0.25s buffer after speech finishes
      const contentDuration = revealStart + revealDuration;

      // 2nd question turant aaye just after option sahi batane ke
      const isLastQuestion = (qIdx === quizList.length - 1);
      const pauseAfter = isLastQuestion ? 0.35 : 0.0;
      const segmentDuration = contentDuration + pauseAfter;

      const segStartTime = currentTimeline;

      segments.push({
        index: qIdx,
        quizItem: qItem,
        startTime: segStartTime,
        duration: segmentDuration,
        contentDuration,
        pauseAfter,
        opt0Start,
        opt1Start,
        opt2Start,
        opt3Start,
        timerStart,
        timerCountdown,
        timerEnd,
        revealStart
      });

      // Schedule Audio Clips for this question segment
      audioPlacementList.push(
        { buffer: qAudio.buffer, startSec: segStartTime + 0.2 },
        { buffer: opt0Audio.buffer, startSec: segStartTime + opt0Start },
        { buffer: opt1Audio.buffer, startSec: segStartTime + opt1Start },
        { buffer: opt2Audio.buffer, startSec: segStartTime + opt2Start },
        { buffer: opt3Audio.buffer, startSec: segStartTime + opt3Start },
        { buffer: timerSoundBuf, startSec: segStartTime + timerStart, maxDurationSec: timerCountdown, volume: 0.85, fadeOutSec: 0.15 },
        { buffer: correctSoundBuf, startSec: segStartTime + revealStart, maxDurationSec: revealDuration, volume: 0.95, fadeOutSec: 0.1 },
        { buffer: corrAudio.buffer, startSec: segStartTime + corrSpeechStart }
      );

      currentTimeline += segmentDuration;
    }

    const totalDuration = currentTimeline;

    // Master Audio Buffer for entire compilation video
    const masterAudioBuffer = audioCtx.createBuffer(
      2,
      Math.ceil(totalDuration * audioCtx.sampleRate),
      audioCtx.sampleRate
    );

    function copyAudioToMaster(
      sourceBuf: AudioBuffer | null, 
      startSec: number, 
      maxDurationSec?: number, 
      volume: number = 1.0, 
      fadeOutSec: number = 0
    ) {
      if (!sourceBuf) return;
      const startSample = Math.round(startSec * audioCtx.sampleRate);
      const maxSamples = maxDurationSec ? Math.round(maxDurationSec * audioCtx.sampleRate) : sourceBuf.length;
      const numSamples = Math.min(sourceBuf.length, maxSamples);
      const fadeOutSamples = fadeOutSec > 0 ? Math.round(fadeOutSec * audioCtx.sampleRate) : 0;

      for (let channel = 0; channel < 2; channel++) {
        const sourceData = sourceBuf.getChannelData(Math.min(channel, sourceBuf.numberOfChannels - 1));
        const masterData = masterAudioBuffer.getChannelData(channel);
        for (let i = 0; i < numSamples; i++) {
          if (startSample + i < masterData.length) {
            let gain = volume;
            if (fadeOutSamples > 0 && i >= numSamples - fadeOutSamples) {
              const remaining = numSamples - i;
              gain = volume * (remaining / fadeOutSamples);
            }
            masterData[startSample + i] += sourceData[i] * gain;
          }
        }
      }
    }

    for (const item of audioPlacementList) {
      copyAudioToMaster(item.buffer, item.startSec, item.maxDurationSec, item.volume, item.fadeOutSec);
    }

    const wavBlob = audioBufferToWavBlob(masterAudioBuffer);

    // Multi-Resolution WebCodecs Encoding
    const fps = 30;
    const totalFrames = Math.round(totalDuration * fps);
    const videoW = currentDimensions.value.w;
    const videoH = currentDimensions.value.h;

    videoProgress.value = 22;
    currentVideoStatus.value = `Step 2/3: Encoding ${quizList.length} Questions (${Math.round(totalDuration)}s)...`;

    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: 'avc',
        width: videoW,
        height: videoH
      },
      fastStart: 'in-memory'
    });

    const videoEncoder = new (window as any).VideoEncoder({
      output: (chunk: any, meta: any) => muxer.addVideoChunk(chunk, meta),
      error: (e: any) => console.error('VideoEncoder error:', e)
    });

    await videoEncoder.configure({
      codec: 'avc1.420028',
      width: videoW,
      height: videoH,
      bitrate: videoW > 1080 || videoH > 1080 ? 6_000_000 : 4_000_000,
      framerate: fps
    });

    // Offscreen render canvas
    const offCanvas = document.createElement('canvas');
    offCanvas.width = videoW;
    offCanvas.height = videoH;
    const offCtx = offCanvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!offCtx) throw new Error('Offscreen canvas context failed');

    for (let f = 0; f < totalFrames; f++) {
      while (videoEncoder.encodeQueueSize > 2) {
        await new Promise((r) => setTimeout(r, 16));
      }

      const elapsed = f / fps;

      // Find current active segment for this timestamp
      let activeSeg = segments[segments.length - 1];
      for (let s = 0; s < segments.length; s++) {
        if (elapsed >= segments[s].startTime && elapsed < segments[s].startTime + segments[s].duration) {
          activeSeg = segments[s];
          break;
        }
      }

      const localElapsed = Math.max(0, elapsed - activeSeg.startTime);

      // 1. Question (Directly visible)
      const qAnimProgress = 1.0;

      // 2. Options are directly visible right from the start like Question
      const optsPanProgress = [1.0, 1.0, 1.0, 1.0];

      // 3. 5-second countdown timer
      let timerProgress = 0;
      let isTimerActive = false;
      if (localElapsed >= activeSeg.timerStart && localElapsed < activeSeg.timerEnd) {
        isTimerActive = true;
        timerProgress = (localElapsed - activeSeg.timerStart) / activeSeg.timerCountdown;
      }

      // 4. Correct Answer Reveal & Pulse
      let isRevealed = false;
      let pulseScale = 1.0;
      if (localElapsed >= activeSeg.revealStart) {
        isRevealed = true;
        const revElapsed = localElapsed - activeSeg.revealStart;
        if (revElapsed < 1.2) {
          pulseScale = 1.0 + 0.04 * Math.sin(revElapsed * Math.PI * 3);
        }
      }

      // Render exclusively to background offCanvas with current active question!
      renderCanvasToCtx(
        offCtx,
        offCanvas,
        qAnimProgress,
        optsPanProgress,
        timerProgress,
        isRevealed,
        isTimerActive,
        pulseScale,
        activeSeg.quizItem
      );

      const timestampMicroseconds = Math.round((f * 1_000_000) / fps);
      const videoFrame = new (window as any).VideoFrame(offCanvas, { timestamp: timestampMicroseconds });
      const isKeyFrame = f % 30 === 0;
      videoEncoder.encode(videoFrame, { keyFrame: isKeyFrame });
      videoFrame.close();

      videoProgress.value = Math.min(85, Math.round(22 + (f / totalFrames) * 63));
      if (f % 2 === 0) {
        await new Promise((r) => setTimeout(r, 8));
      }
    }

    await videoEncoder.flush();
    muxer.finalize();

    const videoArrayBuffer = muxer.target.buffer;

    videoProgress.value = 88;
    currentVideoStatus.value = 'Step 3/3: Merging HD Video & Audio Stream...';

    // Send as standard multipart FormData (100% reliable across all browsers & cloud servers)
    const formData = new FormData();
    formData.append('video', new Blob([videoArrayBuffer], { type: 'video/mp4' }), 'video.mp4');
    formData.append('audio', wavBlob, 'audio.wav');

    const mergeRes = await fetch('/api/merge-video-audio', {
      method: 'POST',
      body: formData
    });

    if (!mergeRes.ok) {
      throw new Error('Merge service failed');
    }

    const finalMp4Blob = await mergeRes.blob();
    generatedVideoUrl.value = URL.createObjectURL(finalMp4Blob);

    videoProgress.value = 100;
    currentVideoStatus.value = `${selectedRatio.value} Multi-Video Ready (${quizList.length} Qs)!`;
    isGeneratingVideo.value = false;
    playVideoModal.value = true;
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
  } catch (err: any) {
    console.error('Video error:', err);
    alert('Error generating video: ' + err.message);
    isGeneratingVideo.value = false;
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
  }
}

function downloadVideo() {
  if (!generatedVideoUrl.value) return;
  const a = document.createElement('a');
  a.href = generatedVideoUrl.value;
  a.download = `hindi-quiz-${selectedRatio.value}-${Date.now()}.mp4`;
  a.click();
}
</script>
