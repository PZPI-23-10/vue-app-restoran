<template>
  <div class="date-picker" ref="datePicker">
    <div class="date-picker-input" @click="toggleCalendar">
      <span class="material-icons">calendar_today</span>
      <span>{{ formattedDate }}</span>
      <span class="material-icons arrow" :class="{ rotated: isOpen }">expand_more</span>
    </div>
    <div class="calendar-popup" v-if="isOpen">
      <div class="calendar-header">
        <button class="arrow-button" @click="prevMonth" :disabled="isPrevDisabled">
          <span class="material-icons">chevron_left</span>
        </button>
        <span class="month-year">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
        <button class="arrow-button" @click="nextMonth">
          <span class="material-icons">chevron_right</span>
        </button>
      </div>
      <div class="calendar-grid">
        <div class="calendar-weekday" v-for="day in weekdays" :key="day">{{ day }}</div>
        <div
          v-for="day in calendarDays"
          :key="day.date"
          class="calendar-day"
          :class="{
            'other-month': !day.isCurrentMonth,
            'selected': day.isSelected,
            'today': day.isToday,
            'disabled': day.isDisabled
          }"
          @click="!day.isDisabled && selectDate(day.date)"
        >
          {{ day.day }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePicker',
  data() {
    return {
      isOpen: false,
      selectedDate: new Date(),
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      weekdays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'],
      monthNames: [
        'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
        'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
      ]
    }
  },
  computed: {
    formattedDate() {
      const options = { day: 'numeric', month: 'long', year: 'numeric' }
      return this.selectedDate.toLocaleDateString('uk-UA', options)
    },
    isPrevDisabled() {
      const today = new Date()
      return this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth()
    },
    calendarDays() {
      const year = this.currentYear
      const month = this.currentMonth
      const today = new Date()
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)
      const prevMonthDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
      const nextMonthDays = 7 - (lastDay.getDay() === 0 ? 7 : lastDay.getDay())
      const days = []
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
        const date = new Date(year, month - 1, i)
        days.push({ day: i, date, isCurrentMonth: false, isSelected: false, isToday: false, isDisabled: true })
      }
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i)
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        const isDisabled = dateOnly < todayDateOnly
        days.push({
          day: i,
          date,
          isCurrentMonth: true,
          isSelected: date.toDateString() === this.selectedDate.toDateString(),
          isToday: date.toDateString() === today.toDateString(),
          isDisabled
        })
      }
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(year, month + 1, i)
        days.push({ day: i, date, isCurrentMonth: false, isSelected: false, isToday: false, isDisabled: false })
      }
      return days
    }
  },
  methods: {
    toggleCalendar() {
      this.isOpen = !this.isOpen
    },
    selectDate(date) {
      this.selectedDate = date
      this.isOpen = false
    },
    prevMonth() {
      if (this.isPrevDisabled) return
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
      } else {
        this.currentMonth--
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    handleClickOutside(event) {
      if (this.$refs.datePicker && !this.$refs.datePicker.contains(event.target)) {
        this.isOpen = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
.date-picker {
  position: relative;
  display: inline-block;
  height: 100%;
}
.date-picker-input {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 14px;
  gap: 6px;
  background-color: white;
  white-space: nowrap;
  cursor: pointer;
  border: none;
  border-radius: 0;
  height: 100%;
}
.arrow {
  font-size: 16px;
  transition: transform 0.3s ease;
  margin-left: 4px;
}
.arrow.rotated {
  transform: rotate(180deg);
}
.calendar-popup {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 5px;
  animation: fadeIn 0.2s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.month-year {
  font-size: 16px;
  font-weight: 500;
}
.arrow-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}
.arrow-button .material-icons {
  font-size: 20px;
  color: #333;
}
.arrow-button:not(:disabled):hover .material-icons {
  color: #00BCD4;
}
.arrow-button:disabled {
  cursor: default;
}
.arrow-button:disabled .material-icons {
  color: #aaa;
  cursor: default;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.calendar-weekday {
  text-align: center;
  font-weight: bold;
  font-size: 0.8em;
}
.calendar-day {
  text-align: center;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.2s;
}
.calendar-day:hover {
  background-color: #f0f0f0;
}
.calendar-day.other-month {
  color: #aaa;
}
.calendar-day.selected {
  background-color: #00BCD4;
  color: white;
}
.calendar-day.today {
  border: 1px solid #00BCD4;
}
.calendar-day.disabled {
  color: #ccc;
  pointer-events: none;
}
</style>