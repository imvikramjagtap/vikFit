import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type MealOption = {
  name: string
  calories: number
  protein: number
}

export type MealTime = 'Morning' | 'BeforeWorkout' | 'AfterWorkout' | 'Lunch' | 'MidEvening' | 'Dinner' | 'LateNight' | 'Snacks'

type DietState = {
  mealOptions: Record<MealTime, MealOption[]>
  selectedMeals: Record<string, Record<MealTime, MealOption>>
  weightData: Record<string, number>
}

const initialMealOptions: Record<MealTime, MealOption[]> = {
  Morning: [
    { name: "1 Glass Warm Water", calories: 0, protein: 0 },
  ],
  BeforeWorkout: [
    { name: "1/2 Scoop Whey Protein + 200 Ml Water + 1 Banana", calories: 120, protein: 7.1 },
    { name: "2 Banana + 4 Dates", calories: 260, protein: 3 },
  ],
  AfterWorkout: [
    { name: "60G Oats With Milk + 2 Boiled Egg Whites", calories: 214, protein: 16 },
    { name: "100G Boiled Potato + 1 Pinch Of Cinnamon Powder + 2 Boiled Egg Whites", calories: 111, protein: 10 },
    { name: "1 Scoop Whey Protein + 300 Ml Water", calories: 120, protein: 24 },
    { name: "1 Plate Poha + 2 Boiled Eggs", calories: 355, protein: 17 },
    { name: "2 Chapati + 2 Eggs Omelet", calories: 315, protein: 17 },
    { name: "2 Slice Brown Bread + 2 Tsp Peanut Butter Spread + 1 Sliced Banana + 1 Apple", calories: 415, protein: 10.6 },
    { name: "2 Boiled Eggs + 1 Apple + 1 Handful Dry Fruit + 1 Cup Milk", calories: 460, protein: 18.5 },
  ],
  Lunch: [
    { name: "2 Chapati + 100G Chicken With Gravy + 1 Cup Rice + 1 Cucumber", calories: 575, protein: 38.5 },
    { name: "100G Paneer Bhurji / 2 Eggs Bhurji + 2 Chapati + 1 Bowl Salad", calories: 595, protein: 36 },
    { name: "100G Rajma/Chole Bhaji + 1 Bhakri + 1 Bowl Salad (Cucumber, Tomato, Beetroot, Carrot)", calories: 300, protein: 11 },
  ],
  MidEvening: [
    { name: "2 Boiled Egg Whites + 1 Banana + 1 Handful Dry Fruit", calories: 274, protein: 11.1 },
    { name: "2 Slice Brown Bread + 50G Paneer Sandwich", calories: 290, protein: 16 },
  ],
  Dinner: [
    { name: "100G Chicken + 1 Bowl Salad + 50G Boiled Rice", calories: 300, protein: 32 },
    { name: "100G Soya Chunk Bhaji + 1 Chapati + 1 Bowl Salad", calories: 260, protein: 15 },
    { name: "2 Moong Dal / 2 Besan Chila / 2 Paneer Paratha + 50G Curd + 1 Cup Mint Chutney", calories: 370, protein: 19 },
  ],
  LateNight: [
    { name: "2 Tablets Of Nav Nirman With Water", calories: 0, protein: 0 },
  ],
  Snacks: [
    { name: "Makhana", calories: 450, protein: 9.5 }
  ]
};


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