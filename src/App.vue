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

          <!-- 1. Topic / Type -->
          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-semibold text-slate-600">
                Enter Type
              </label>
            </div>
            <input 
              v-model="quiz.category"
              type="text" 
              placeholder="Enter Type Here"
              class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all"
            />
          </div> 

          <!-- 2. Question -->
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1.5">
             Enter Question
            </label>
            <textarea 
              v-model="quiz.question"
              rows="3" 
              placeholder="Enter Question Here"
              class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all resize-none"
            ></textarea>
          </div>

          <!-- 3. Options (1, 2, 3, 4) & Right Answer Selector -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-semibold text-slate-600">
                Enter Options
              </label>
              <span class="text-xs font-medium text-amber-600 select-none">Click letter to set correct</span>
            </div>

            <div 
              v-for="(opt, idx) in quiz.options" 
              :key="idx"
              @click="quiz.correctOption = idx + 1"
              class="flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer"
              :class="quiz.correctOption === idx + 1 ? 'bg-emerald-50/50 border-emerald-400 ring-1 ring-emerald-300' : 'bg-white border-slate-200 hover:border-slate-300'"
            >
              <!-- Left Letter Badge (A, B, C, D) with checkmark on selected -->
              <button
                type="button"
                @click.stop="quiz.correctOption = idx + 1"
                class="w-9 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all select-none border cursor-pointer"
                :class="quiz.correctOption === idx + 1 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-extrabold' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'"
              >
                <span v-if="quiz.correctOption === idx + 1" class="flex items-center gap-1 font-bold">
                  <span>✓</span><span>{{ ['A','B','C','D'][idx] }}</span>
                </span>
                <span v-else>{{ ['A','B','C','D'][idx] }}</span>
              </button>

              <!-- Option Text Input -->
              <input 
                v-model="quiz.options[idx]"
                type="text" 
                :placeholder="'Option ' + ['A','B','C','D'][idx]"
                @click.stop
                class="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 outline-none px-1"
              />

              <!-- Right-Side Text Button: 'Correct' when selected, 'Mark' when unselected -->
              <button 
                type="button"
                @click.stop="quiz.correctOption = idx + 1"
                class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 select-none cursor-pointer border active:scale-95"
                :class="quiz.correctOption === idx + 1 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs' 
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'"
                :title="'Mark Option ' + ['A','B','C','D'][idx] + ' as Correct'"
              >
                {{ quiz.correctOption === idx + 1 ? 'Correct' : 'Mark' }}
              </button>
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
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
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
          <!-- MOBILE TAB 1: Q/A (Type, Question, Options) -->
          <div v-show="mobileTab === 'qa'" class="space-y-4">
            <!-- Type -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Enter Type</label>
              <input 
                v-model="quiz.category"
                type="text" 
                placeholder="Enter Type Here"
                class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
            </div> 

            <!-- Question -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Enter Question</label>
              <textarea 
                v-model="quiz.question"
                rows="2" 
                placeholder="Enter Question Here"
                class="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none resize-none"
              ></textarea>
            </div>

            <!-- Options -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-semibold text-slate-600">Enter Options</label>
                <span class="text-[11px] font-medium text-amber-600 select-none">Click letter to set correct</span>
              </div>

              <div 
                v-for="(opt, idx) in quiz.options" 
                :key="'mob-' + idx"
                @click="quiz.correctOption = idx + 1"
                class="flex items-center gap-2 p-2 rounded-xl border transition-all cursor-pointer"
                :class="quiz.correctOption === idx + 1 ? 'bg-emerald-50/50 border-emerald-400 ring-1 ring-emerald-300' : 'bg-white border-slate-200'"
              >
                <!-- Left Letter Badge with checkmark on selected -->
                <button
                  type="button"
                  @click.stop="quiz.correctOption = idx + 1"
                  class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all select-none border cursor-pointer"
                  :class="quiz.correctOption === idx + 1 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-extrabold' 
                    : 'bg-white text-slate-700 border-slate-200'"
                >
                  <span v-if="quiz.correctOption === idx + 1" class="flex items-center gap-0.5">
                    <span>✓</span><span>{{ ['A','B','C','D'][idx] }}</span>
                  </span>
                  <span v-else>{{ ['A','B','C','D'][idx] }}</span>
                </button>

                <!-- Option text input -->
                <input 
                  v-model="quiz.options[idx]"
                  type="text" 
                  :placeholder="'Option ' + ['A','B','C','D'][idx]"
                  @click.stop
                  class="flex-1 bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 outline-none px-1"
                />

                <!-- Right-side button: 'Correct' when selected, 'Mark' when unselected -->
                <button 
                  type="button"
                  @click.stop="quiz.correctOption = idx + 1"
                  class="px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 select-none cursor-pointer border active:scale-95"
                  :class="quiz.correctOption === idx + 1 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'"
                  :title="'Mark Option ' + ['A','B','C','D'][idx] + ' as Correct'"
                >
                  {{ quiz.correctOption === idx + 1 ? 'Correct' : 'Mark' }}
                </button>
              </div>
            </div>
          </div>

          <!-- MOBILE TAB 2: SIZE (Single-slider-at-a-time selector) -->
          <div v-show="mobileTab === 'size'" class="space-y-3">
            <div class="flex items-center justify-between pb-1 border-b border-slate-100">
              <span class="text-xs font-bold text-slate-700 uppercase tracking-wider">Select Size To Adjust</span>
            </div>

            <!-- 4-Pill Size Target Selector -->
            <div class="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-center">
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
                <div class="grid grid-cols-2 gap-1.5">
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
                    @click="activeDragTarget = 'watermark'"
                    class="px-2 py-1.5 rounded-lg text-xs font-bold border transition-all text-center cursor-pointer"
                    :class="activeDragTarget === 'watermark' ? 'bg-amber-500 text-white border-amber-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'"
                    :disabled="!watermark.enabled"
                  >Watermark</button>
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
        <div class="w-full flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-700">Preview</span>
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
const activeSizeTarget = ref<'border' | 'type' | 'question' | 'option'>('type');

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

// Quiz Model
const quiz = reactive({
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

// Styling Model (With Type font size slider added!)
const style = reactive({
  fontFamily: "'Kalam', cursive",
  typeFontSize: 46,       // Independent Type Font Size
  questionFontSize: 50,
  optionFontSize: 36,
  borderWidth: 2
});

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
  optionsY: 0
});

const enableDrag = ref(false);
type DragTarget = 'type' | 'question' | 'options' | 'watermark';
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
  logoImg = new Image();
  logoImg.src = '/logo.png';

  await Promise.all([
    new Promise((resolve) => { logoImg!.onload = resolve; logoImg!.onerror = resolve; }),
    document.fonts.ready
  ]);

  renderCanvas(-1, 4, 0.0, false, false, 1.0);
});

// Watch inputs to re-render in real-time
watch(
  [quiz, style, offsets, watermark, selectedRatio],
  async () => {
    await nextTick();
    renderCanvas(-1, 4, 0.0, false, false, 1.0);
  },
  { deep: true }
);

function resetToExactSample() {
  quiz.category = 'सामान्य विज्ञान';
  quiz.question = 'वायुमंडलीय दाब मापने वाला यंत्र कौन-सा है?';
  quiz.options = [
    'बैरोमीटर',
    'थर्मामीटर',
    'स्पीडोमीटर',
    'कैलोरीमीटर'
  ];
  quiz.correctOption = 1;
  style.typeFontSize = 46;
  style.questionFontSize = 50;
  style.optionFontSize = 36;
  style.borderWidth = 4;
  resetPositions();
}

function resetPositions() {
  offsets.typeX = 0;
  offsets.typeY = 0;
  offsets.questionX = 0;
  offsets.questionY = 0;
  offsets.optionsX = 0;
  offsets.optionsY = 0;
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
    const testText = `${quiz.question}`;
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
  pulseScale: number = 1.0
) {
  const W = targetCanvas.width;
  const H = targetCanvas.height;

  // 1. Pure White Background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // 2. Outer Black Frame Border (Drawn only if borderWidth > 0)
  const bw = Math.max(0, style.borderWidth);
  if (bw > 0) {
    ctx.lineWidth = bw;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);
  }

  // 2.5 Optional Center Watermark Logo (Active ONLY when YES/enabled)
  if (watermark.enabled && logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    ctx.globalAlpha = Math.max(0.01, Math.min(1.0, watermark.opacity));
    const wmSize = watermark.size;
    const wmX = (W - wmSize) / 2 + watermark.offsetX;
    const wmY = (H - wmSize) / 2 + watermark.offsetY;
    ctx.drawImage(logoImg, wmX, wmY, wmSize, wmSize);
    ctx.restore();
  }

  // Scale references based on height & width
  const isReel = selectedRatio.value === '9:16';
  const isLandscape = selectedRatio.value === '16:9';

  // 3. Top-Left Category (Type Heading) - Independent Dragging Anywhere!
  const categoryText = (quiz.category || 'सामान्य विज्ञान').trim();
  const typeBaseX = 64 + offsets.typeX;
  const typeBaseY = (isReel ? 120 : isLandscape ? 40 : 55) + offsets.typeY;

  ctx.save();
  ctx.fillStyle = '#000000';
  ctx.font = `700 ${style.typeFontSize}px ${style.fontFamily}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(categoryText, typeBaseX, typeBaseY);
  ctx.restore();

  // 4. Top-Right Logo
  if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.save();
    const logoW = isLandscape ? 140 : 160;
    const logoH = logoW;
    const logoX = W - logoW - (isLandscape ? 40 : 55);
    const logoY = isReel ? 95 : isLandscape ? 25 : 32;
    ctx.drawImage(logoImg, logoX, logoY, logoW, logoH);
    ctx.restore();
  }

  // 5. Question Section (Directly visible, no animation or typewriter)
  const questionBaseX = W / 2 + offsets.questionX;
  const questionBaseY = (isReel ? 420 : isLandscape ? 180 : 220) + offsets.questionY;
  const questionMaxW = isLandscape ? 1600 : 920;

  const fullQuestion = quiz.question || 'प्रश्न यहाँ दिखाई देगा...';

  ctx.save();
  ctx.fillStyle = '#000000';
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

  // 7. Four Options with Canva Pan Animation (Slide in from Left →) & Rich Pulse
  const optW = isLandscape ? 1400 : 910;
  const optX = (W - optW) / 2 + offsets.optionsX;
  const optGap = isReel ? 28 : isLandscape ? 16 : 16;
  const optionsStartY = (isReel ? 780 : isLandscape ? 400 : 430) + offsets.optionsY;
  const letters = ['A', 'B', 'C', 'D'];

  ctx.font = `700 ${style.optionFontSize}px ${style.fontFamily}`;
  const maxTextAvailableWidth = optW - 190;

  const normalizedOpts = normalizeOptsProgress(optsProgress);

  let currentY = optionsStartY;

  for (let i = 0; i < 4; i++) {
    const panP = normalizedOpts[i] !== undefined ? normalizedOpts[i] : 1.0;
    const optionText = quiz.options[i] || `Option ${letters[i]}`;
    
    const optLines = wrapText(ctx, optionText, maxTextAvailableWidth);
    const lineH = style.optionFontSize * 1.25;
    
    const contentH = optLines.length * lineH;
    const optH = Math.max(isReel ? 88 : 76, contentH + 28);
    const optRadius = Math.min(38, optH / 2);

    const isCorrect = (quiz.correctOption === i + 1);
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

        ctx.fillStyle = '#dcfce7';
        roundRect(ctx, optX, currentY, optW, optH, optRadius);
        ctx.fill();

        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 4.5;
        roundRect(ctx, optX, currentY, optW, optH, optRadius);
        ctx.stroke();
      } else {
        const optBgColor = (watermark.enabled && watermark.transparentOptions) 
          ? 'rgba(255, 255, 255, 0.45)' 
          : '#ffffff';
        ctx.fillStyle = optBgColor;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        roundRect(ctx, optX, currentY, optW, optH, optRadius);
        ctx.fill();
        ctx.stroke();
      }

      // Left Badge (A, B, C, D)
      const badgeW = 145;
      const badgeH = 64;
      const badgeX = optX + 8;
      const badgeY = currentY + (optH - badgeH) / 2;

      ctx.fillStyle = isHighlighted ? '#15803d' : '#1f2937';
      roundRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
      ctx.fill();

      // Letter text
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letters[i], badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);

      // Render Option Text
      ctx.fillStyle = isHighlighted ? '#14532d' : '#000000';
      ctx.font = `700 ${style.optionFontSize}px ${style.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textCenterX = optX + 160 + maxTextAvailableWidth / 2;
      const startTextY = currentY + (optH - (optLines.length - 1) * lineH) / 2;

      for (let l = 0; l < optLines.length; l++) {
        ctx.fillText(optLines[l], textCenterX, startTextY + l * lineH);
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

// ----------------- TOP-CLASS ZERO-LAG VIDEO GENERATOR (MULTI-RATIO) -----------------
async function startBulletproofVideoGeneration() {
  if (isGeneratingVideo.value) return;
  isGeneratingVideo.value = true;
  videoProgress.value = 5;
  currentVideoStatus.value = `Step 1/3: Fetching Voice Clips for ${selectedRatio.value}...`;

  const canvas = previewCanvas.value;
  if (!canvas) {
    isGeneratingVideo.value = false;
    return;
  }

  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    
    const letters = ['A', 'B', 'C', 'D'];
    const letterNamesHindi = ['ए', 'बी', 'सी', 'डी'];
    const correctLetterHindi = letterNamesHindi[quiz.correctOption - 1];
    const correctOptionText = quiz.options[quiz.correctOption - 1];

    const questionSpeechText = `${quiz.question}`;
    const optTexts = [
      `ऑप्शन ए: ${quiz.options[0]}`,
      `ऑप्शन बी: ${quiz.options[1]}`,
      `ऑप्शन सी: ${quiz.options[2]}`,
      `ऑप्शन डी: ${quiz.options[3]}`
    ];
    const correctSpeechText = `सही उत्तर है: ऑप्शन ${correctLetterHindi}, ${correctOptionText}`;

    const [qAudio, opt0Audio, opt1Audio, opt2Audio, opt3Audio, corrAudio, timerSoundBuf, correctSoundBuf] = await Promise.all([
      fetchTtsAudioBuffer(questionSpeechText, audioCtx),
      fetchTtsAudioBuffer(optTexts[0], audioCtx),
      fetchTtsAudioBuffer(optTexts[1], audioCtx),
      fetchTtsAudioBuffer(optTexts[2], audioCtx),
      fetchTtsAudioBuffer(optTexts[3], audioCtx),
      fetchTtsAudioBuffer(correctSpeechText, audioCtx),
      fetchAudioFileBuffer('/timer-sound.wav', audioCtx),
      fetchAudioFileBuffer('/correct-answer-sound.wav', audioCtx)
    ]);

    videoProgress.value = 20;
    currentVideoStatus.value = `Step 2/3: Encoding ${currentDimensions.value.w}×${currentDimensions.value.h} Frames...`;

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
    const corrSoundLead = 1.25; // Correct answer chime plays first, then speech follows
    const corrSpeechStart = revealStart + corrSoundLead;
    const revealDuration = corrSoundLead + corrAudio.duration + 1.2;
    const totalDuration = revealStart + revealDuration;

    // Master Audio Buffer
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

    // 1. Question speech
    copyAudioToMaster(qAudio.buffer, 0.2);

    // 2. Options speech
    copyAudioToMaster(opt0Audio.buffer, opt0Start);
    copyAudioToMaster(opt1Audio.buffer, opt1Start);
    copyAudioToMaster(opt2Audio.buffer, opt2Start);
    copyAudioToMaster(opt3Audio.buffer, opt3Start);

    // 3. Timer sound (plays while timer counts down from 5s to 0s)
    copyAudioToMaster(timerSoundBuf, timerStart, timerCountdown, 0.85, 0.15);

    // 4. Correct answer sound effect (plays right when correct answer reveals)
    copyAudioToMaster(correctSoundBuf, revealStart, undefined, 0.95);

    // 5. Correct answer speech ("then vo bole")
    copyAudioToMaster(corrAudio.buffer, corrSpeechStart);

    const wavBlob = audioBufferToWavBlob(masterAudioBuffer);

    // Multi-Resolution WebCodecs Encoding
    const fps = 30;
    const totalFrames = Math.round(totalDuration * fps);
    const fullQLen = (quiz.question || '').length;
    const videoW = currentDimensions.value.w;
    const videoH = currentDimensions.value.h;

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

    // Offscreen render canvas to completely decouple from UI & keep main thread smooth
    const offCanvas = document.createElement('canvas');
    offCanvas.width = videoW;
    offCanvas.height = videoH;
    const offCtx = offCanvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!offCtx) throw new Error('Offscreen canvas context failed');

    for (let f = 0; f < totalFrames; f++) {
      // Gentle Hardware Throttle: Keep encode queue <= 2 so device RAM & CPU are always cool and free
      while (videoEncoder.encodeQueueSize > 2) {
        await new Promise((r) => setTimeout(r, 16));
      }

      const elapsed = f / fps;

      // 1. Question (Directly visible immediately, zero animation)
      const qAnimProgress = 1.0;

      // 2. Canva Pan Animation for Options (Slide in from Left → with ease-out cubic & fade-in)
      const panDuration = 0.45;
      const optStarts = [opt0Start, opt1Start, opt2Start, opt3Start];
      const optsPanProgress = optStarts.map((start) => {
        if (elapsed < start) return 0.0;
        return Math.min(1.0, (elapsed - start) / panDuration);
      });

      // 3. 5-second countdown timer
      let timerProgress = 0;
      let isTimerActive = false;
      if (elapsed >= timerStart && elapsed < timerEnd) {
        isTimerActive = true;
        timerProgress = (elapsed - timerStart) / timerCountdown;
      }

      // 4. Correct Answer Reveal & Rich Pulse
      let isRevealed = false;
      let pulseScale = 1.0;
      if (elapsed >= revealStart) {
        isRevealed = true;
        const revElapsed = elapsed - revealStart;
        if (revElapsed < 1.2) {
          pulseScale = 1.0 + 0.04 * Math.sin(revElapsed * Math.PI * 3);
        }
      }

      // Render exclusively to background offCanvas (Zero UI stutter, phone stays completely cool)
      renderCanvasToCtx(
        offCtx,
        offCanvas,
        qAnimProgress,
        optsPanProgress,
        timerProgress,
        isRevealed,
        isTimerActive,
        pulseScale
      );

      const timestampMicroseconds = Math.round((f * 1_000_000) / fps);
      const videoFrame = new (window as any).VideoFrame(offCanvas, { timestamp: timestampMicroseconds });
      const isKeyFrame = f % 30 === 0;
      videoEncoder.encode(videoFrame, { keyFrame: isKeyFrame });
      videoFrame.close();

      // Relax main thread: Give browser a breather every frame or two so phone never heats or lags
      videoProgress.value = Math.min(85, Math.round(20 + (f / totalFrames) * 65));
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
    currentVideoStatus.value = `${selectedRatio.value} Video Ready!`;
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
