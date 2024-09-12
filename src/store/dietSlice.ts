import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type MealOption = {
  name: string
  calories: number
  protein: number
}

export type MealTime = 'morning' | 'beforeWorkout' | 'afterWorkout' | 'lunch' | 'midEvening' | 'dinner' | 'lateNight'

type DietState = {
  mealOptions: Record<MealTime, MealOption[]>
  selectedMeals: Record<string, Record<MealTime, MealOption>>
  weightData: Record<string, number>
}

const initialMealOptions: Record<MealTime, MealOption[]> = {
  morning: [
    { name: "1 glass warm water", calories: 0, protein: 0 },
  ],
  beforeWorkout: [
    { name: "1/2 scoop whey protein + 200 ml water + 1 banana", calories: 150, protein: 15 },
    { name: "2 banana + 4 dates", calories: 300, protein: 3 },
  ],
  afterWorkout: [
    { name: "60g oats with milk + 2 boiled egg whites", calories: 300, protein: 20 },
    { name: "100g boiled potato + 1 pinch of cinnamon powder + 2 boiled egg whites", calories: 200, protein: 15 },
    { name: "1 scoop whey protein + 300 ml water", calories: 120, protein: 25 },
    { name: "1 plate poha + 2 boiled eggs", calories: 350, protein: 18 },
    { name: "2 chapati + 2 eggs omelet", calories: 400, protein: 22 },
    { name: "2 slice brown bread + 2 TSP peanut butter spread + 1 sliced banana + 1 apple", calories: 450, protein: 15 },
    { name: "2 boiled eggs + 1 apple + 1 handful dry fruit + 1 cup milk", calories: 500, protein: 25 },
  ],
  lunch: [
    { name: "2 chapati + 100g chicken with gravy + 1 cup rice + 1 cucumber", calories: 600, protein: 40 },
    { name: "100g paneer bhurji / 2 eggs bhurji + 2 chapati + 1 bowl salad", calories: 550, protein: 30 },
    { name: "100g rajma/chole bhaji + 1 bhakri + 1 bowl salad (cucumber, tomato, beetroot, carrot)", calories: 450, protein: 20 },
  ],
  midEvening: [
    { name: "2 boiled egg whites + 1 banana + 1 handful dry fruit", calories: 300, protein: 15 },
    { name: "2 slice brown bread + 50g paneer sandwich", calories: 350, protein: 18 },
  ],
  dinner: [
    { name: "100g chicken + 1 bowl salad + 50g boiled rice", calories: 400, protein: 35 },
    { name: "100g soya chunk bhaji + 1 chapati + 1 bowl salad", calories: 350, protein: 30 },
    { name: "2 moong dal / 2 besan chila / 2 paneer paratha + 50g curd + 1 cup mint chutney", calories: 500, protein: 25 },
  ],
  lateNight: [
    { name: "2 tablets of nav nirman with water", calories: 0, protein: 0 },
  ],
}

const initialState: DietState = {
  mealOptions: initialMealOptions,
  selectedMeals: {},
  weightData: {},
}

const dietSlice = createSlice({
  name: 'diet',
  initialState,
  reducers: {
    addCustomMeal: (state, action: PayloadAction<{ mealTime: MealTime; meal: MealOption }>) => {
      const { mealTime, meal } = action.payload
      state.mealOptions[mealTime].push(meal)
    },
    selectMeal: (state, action: PayloadAction<{ date: string; mealTime: MealTime; meal: MealOption }>) => {
      const { date, mealTime, meal } = action.payload
      if (!state.selectedMeals[date]) {
        state.selectedMeals[date] = {} as Record<MealTime, MealOption>
      }
      state.selectedMeals[date][mealTime] = meal
    },
    addCustomSelectedMeal: (state, action: PayloadAction<{ date: string; mealTime: MealTime; meal: MealOption }>) => {
      const { date, mealTime, meal } = action.payload
      if (!state.selectedMeals[date]) {
        state.selectedMeals[date] = {} as Record<MealTime, MealOption>
      }
      state.selectedMeals[date][mealTime] = meal
    },
    deleteMeal: (state, action: PayloadAction<{ date: string; mealTime: MealTime }>) => {
      const { date, mealTime } = action.payload
      if (state.selectedMeals[date]) {
        delete state.selectedMeals[date][mealTime]
        if (Object.keys(state.selectedMeals[date]).length === 0) {
          delete state.selectedMeals[date]
        }
      }
    },
    addWeight: (state, action: PayloadAction<{ date: string; weight: number }>) => {
      const { date, weight } = action.payload
      state.weightData[date] = weight
    },
  },
})

export const { addCustomMeal, selectMeal, addCustomSelectedMeal, deleteMeal, addWeight } = dietSlice.actions

export default dietSlice.reducer