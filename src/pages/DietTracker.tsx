import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Label } from "../components/ui//label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Input } from "../components/ui/input"
import { PlusCircle, Trash2, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Moon, Sun } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useSwipeable } from 'react-swipeable'
import { toast } from "../hooks/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible"
import { useTheme } from '../components/ThemeProvider'
import { RootState } from '../store/store'
import { addCustomMeal, selectMeal, addCustomSelectedMeal, deleteMeal, addWeight, MealOption, MealTime } from '../store/dietSlice'
import { DatePickerWithPresets } from '../components/ui/datePicker'
import { format } from "date-fns"
import { DatePickerWithRange } from '@/components/ui/rangeDatePicker'

export default function EnhancedDietTracker() {
  const dispatch = useDispatch()
  const { mealOptions, selectedMeals, weightData } = useSelector((state: RootState) => state.diet)
  const [currentDay, setCurrentDay] = useState<string>(new Date().toISOString().split('T')[0])
  const [newMeal, setNewMeal] = useState<MealOption>({ name: '', calories: 0, protein: 0 })
  const [currentMealTime, setCurrentMealTime] = useState<MealTime>('Morning')
  const [graphData, setGraphData] = useState<{ date: string; calories: number; protein: number; weight: number }[]>([])
  const [graphPeriod, setGraphPeriod] = useState<'day' | 'week' | 'month' | null>('day')
  const [graphType, setGraphType] = useState<'line' | 'bar'>('line')
  const [currentWeight, setCurrentWeight] = useState<string>('')
  const [isCustomMealOpen, setIsCustomMealOpen] = useState(false)
  const [isAddToSelectedMeals, setIsAddToSelectedMeals] = useState(false)
  const [dateRange, setDateRange] = useState(undefined);
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    if (dateRange) {
      updateGraphData(dateRange);
    } else {
      updateGraphData(null);
    }
  }, [selectedMeals, weightData, graphPeriod, currentDay, dateRange]);

  const handleMealSelection = (mealTime: MealTime, selection: MealOption) => {
    dispatch(selectMeal({ date: currentDay, mealTime, meal: selection }))
  }

  const handleDeleteMeal = (mealTime: MealTime) => {
    dispatch(deleteMeal({ date: currentDay, mealTime }))
  }

  const handleAddCustomMeal = () => {
    if (newMeal.name && newMeal.calories >= 0 && newMeal.protein >= 0) {
      if (isAddToSelectedMeals) {
        dispatch(addCustomSelectedMeal({ date: currentDay, mealTime: currentMealTime, meal: newMeal }))
      } else {
        dispatch(addCustomMeal({ mealTime: currentMealTime, meal: newMeal }))
      }
      setNewMeal({ name: '', calories: 0, protein: 0 })
      setIsCustomMealOpen(false)
      setIsAddToSelectedMeals(false)
    } else {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid meal name, calories, and protein.",
        variant: "destructive",
      })
    }
  }

  const calculateTotals = (date: string) => {
    const meals: typeof mealOptions = selectedMeals[date] || {}
    return Object.values(meals).reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
      }),
      { calories: 0, protein: 0 }
    )
  }

  const updateGraphData = (daterange: object | null) => {
    let endDate = daterange?.to || new Date(currentDay);
    let startDate = daterange?.from || new Date(endDate);

    if (!dateRange) {
      console.log("called");
      if (graphPeriod === "week") {
        startDate.setDate(startDate.getDate() - 7);
      } else if (graphPeriod === "month") {
        startDate.setDate(startDate.getDate() - 30);
      }
    } else {
      setGraphPeriod(null)
    }

    const data = []
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const date = d.toISOString().split('T')[0]
      const totals = calculateTotals(date)
      data.push({ 
        date, 
        ...totals, 
        weight: weightData[date] || null 
      })
    }

    if (graphPeriod === 'day') {
      const dayData = Object.entries(selectedMeals[currentDay] || {}).map(([mealTime, meal]) => ({
        mealTime: mealTime.replace(/([A-Z])/g, ' $1').trim(),
        calories: meal.calories,
        protein: meal.protein
      }))
      setGraphData(dayData)
    } else {
      setGraphData(data)
    }
  }

  const changeDay = (offset: number) => {
    const newDate = new Date(currentDay)
    newDate.setDate(newDate.getDate() + offset)
    setCurrentDay(newDate.toISOString().split('T')[0])
  }

  const handleWeightSubmit = () => {
    const weight = parseFloat(currentWeight)
    if (!isNaN(weight) && weight > 0) {
      dispatch(addWeight({ date: currentDay, weight }))
      setCurrentWeight('')
    } else {
      toast({
        title: "Invalid Weight",
        description: "Please enter a valid weight.",
        variant: "destructive",
      })
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => changeDay(1),
    onSwipedRight: () => changeDay(-1),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  })

  const renderGraph = () => {
    const ChartComponent = graphType === 'line' ? LineChart : BarChart
    const DataComponent = graphType === 'line' ? Line : Bar

    return (
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={graphPeriod === 'day' ? 'mealTime' : 'date'} />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <DataComponent yAxisId="left" type="monotone" dataKey="calories" fill="#8884d8" stroke="#8884d8" name="Calories" />
          <DataComponent yAxisId="right" type="monotone" dataKey="protein" fill="#82ca9d" stroke="#82ca9d" name="Protein (g)" />
          {graphPeriod !== 'day' && (
            <DataComponent yAxisId="right" type="monotone" dataKey="weight" fill="#ffc658" stroke="#ffc658" name="Weight (kg)" />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">Diet Tracker</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className='flex flex-col gap-1 items-start w-full'>
            <Label htmlFor="date" className="text-lg font-semibold">Date</Label>
            <DatePickerWithPresets date={currentDay} setDate={setCurrentDay} />
          </div>
          <div>
            <Label htmlFor="weight" className="text-lg font-semibold">Weight (kg)</Label>
            <div className="flex mt-1">
              <Input
                type="number"
                id="weight"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="Enter weight"
                className="mr-2 w-full md:1/2"
              />
              <Button onClick={handleWeightSubmit}>Add Weight</Button>
            </div>
          </div>
          <div>
            <Label htmlFor="mealTime" className="text-lg font-semibold">Meal Time</Label>
            <Select onValueChange={(value) => setCurrentMealTime(value as MealTime)} value={currentMealTime}>
              <SelectTrigger id="mealTime">
                <SelectValue placeholder="Select meal time" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(mealOptions)?.map((mealTime) => (
                  <SelectItem key={mealTime} value={mealTime}>
                    {mealTime.replace(/([A-Z])/g, ' $1').trim()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="meal" className="text-lg font-semibold">Select Meal</Label>
            <Select
              onValueChange={(value) => handleMealSelection(currentMealTime, JSON.parse(value))}
              value={JSON.stringify(selectedMeals[currentDay]?.[currentMealTime] || '')}
            >
              <SelectTrigger id="meal">
                <SelectValue placeholder="Select a meal" />
              </SelectTrigger>
              <SelectContent className='max-w-xs sm:max-w-fit'>
                {mealOptions[currentMealTime]?.map((option, index) => (
                  <SelectItem key={index} value={JSON.stringify(option)}>
                    {option.name} (Calories: {option.calories}, Protein: {option.protein}g)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Collapsible open={isCustomMealOpen} onOpenChange={setIsCustomMealOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full">
                {isCustomMealOpen ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Hide Custom Meal
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Add Custom Meal
                  </>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              <Label htmlFor="customMealName">Custom Meal Name</Label>
              <Input
                id="customMealName"
                placeholder="Custom meal name"
                value={newMeal.name}
                onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              />
              <Label htmlFor="customMealCalories">Calories</Label>
              <Input
                id="customMealCalories"
                type="number"
                placeholder="Calories"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
              />
              <Label htmlFor="customMealProtein">Protein (g)</Label>
              <Input
                id="customMealProtein"
                type="number"
                placeholder="Protein (g)"
                value={newMeal.protein}
                onChange={(e) =>
                  setNewMeal({ ...newMeal, protein: Number(e.target.value) })
                }
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="addToSelectedMeals"
                  checked={isAddToSelectedMeals}
                  onChange={(e) => setIsAddToSelectedMeals(e.target.checked)}
                  className="form-checkbox h-4 w-4 my-2 text-primary"
                />
                <Label htmlFor="addToSelectedMeals">Add to Todays Meal only</Label>
              </div>
              <Button onClick={handleAddCustomMeal} className="w-full">
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Custom Meal
              </Button>
            </CollapsibleContent>
          </Collapsible>
        </div>
        <div className="mt-8 space-y-4" {...swipeHandlers}>
          <div className="flex items-center justify-between">
            <Button onClick={() => changeDay(-1)} variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-xl font-semibold">Meals for {format(currentDay, "PPP")}</h3>
            <Button onClick={() => changeDay(1)} variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          {Object.entries(selectedMeals[currentDay] || {}).map(([mealTime, meal]) => (
            <div key={mealTime} className="p-4 bg-secondary rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-medium text-lg">{mealTime.replace(/([A-Z])/g, ' $1').trim()}</h4>
                <p>{meal.name}</p>
                <p className="text-sm text-muted-foreground">Calories: {meal.calories}, Protein: {meal.protein}g</p>
              </div>
              <Button onClick={() => handleDeleteMeal(mealTime as MealTime)} variant="ghost" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <div className="p-4 bg-primary/20 rounded-lg">
            <h4 className="font-medium text-lg">Daily Totals</h4>
            <p>Total Calories: {calculateTotals(currentDay).calories}</p>
            <p>Total Protein: {calculateTotals(currentDay).protein}g</p>
            {weightData[currentDay] && <p>Weight: {weightData[currentDay]} kg</p>}
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <h3 className="text-xl font-semibold">Nutrition and Weight Graphs</h3>
          <DatePickerWithRange setDate={setDateRange} date={dateRange} />
          <div className="flex justify-center space-x-4">
            <Select onValueChange={(value) => {setGraphPeriod(value as 'day' | 'week' | 'month'), setDateRange(undefined)}} value={graphPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => setGraphType(value as 'line' | 'bar')} value={graphType}>
              <SelectTrigger>
                <SelectValue placeholder="Select graph type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Graph</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="h-[300px] w-full">
            {renderGraph()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}