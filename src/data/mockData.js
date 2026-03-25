// Mock Data for Dashboard

const getImg = (id) => `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

export const dashboardFoodItems = [
  { id: 1, title: 'Grilled Salmon & Quinoa', category: 'Dinner', image: getImg('1485921325833-c519f76c4927'), calories: 450, time: '25 min', difficulty: 'Medium' },
  { id: 2, title: 'Avocado Toast with Egg', category: 'Breakfast', image: getImg('1525351484163-7529414344d8'), calories: 320, time: '15 min', difficulty: 'Easy' },
  { id: 3, title: 'Berry Smoothie Bowl', category: 'Breakfast', image: getImg('1496116218417-1a781b1c416c'), calories: 280, time: '10 min', difficulty: 'Easy' },
  { id: 4, title: 'Spicy Tofu Stir Fry', category: 'Vegan', image: getImg('1546069901-ba9599a7e63c'), calories: 380, time: '30 min', difficulty: 'Hard' },
  { id: 5, title: 'Chicken Caesar Salad', category: 'Lunch', image: getImg('1512621776951-a57141f2eefd'), calories: 410, time: '15 min', difficulty: 'Easy' },
  { id: 6, title: 'Beef & Broccoli Bowl', category: 'Dinner', image: getImg('1568901346375-23c9450c58cd'), calories: 520, time: '20 min', difficulty: 'Medium' },
  { id: 7, title: 'Vegan Buddha Bowl', category: 'Vegan', image: getImg('1490645935967-10de6ba17061'), calories: 400, time: '25 min', difficulty: 'Medium' },
  { id: 8, title: 'Greek Yogurt Parfait', category: 'Snack', image: getImg('1488477181946-6428a0291777'), calories: 210, time: '5 min', difficulty: 'Easy' },
  { id: 9, title: 'Turkey Wrap', category: 'Lunch', image: getImg('1509722747041-616f39b57569'), calories: 350, time: '10 min', difficulty: 'Easy' },
  { id: 10, title: 'Protein Pancakes', category: 'Breakfast', image: getImg('1528207776546-38d94b0f443e'), calories: 450, time: '20 min', difficulty: 'Medium' },
  { id: 11, title: 'Roasted Chickpea Wrap', category: 'Vegan', image: getImg('1529692236671-f1f6cf9683ba'), calories: 340, time: '15 min', difficulty: 'Easy' },
  { id: 12, title: 'Tuna Salad Sandwich', category: 'Lunch', image: getImg('1550507992-eb63ffee0847'), calories: 390, time: '10 min', difficulty: 'Easy' },
  { id: 13, title: 'Veggie Omelet', category: 'Breakfast', image: getImg('1510693206972-df098062cb71'), calories: 290, time: '12 min', difficulty: 'Medium' },
  { id: 14, title: 'Mushroom Risotto', category: 'Dinner', image: getImg('1476124369491-e7addf5db371'), calories: 550, time: '40 min', difficulty: 'Hard' },
  { id: 15, title: 'Apple Peanut Butter Bites', category: 'Snack', image: getImg('1568158814711-b839871d45d1'), calories: 150, time: '5 min', difficulty: 'Easy' },
  { id: 16, title: 'Chicken Fajitas', category: 'Dinner', image: getImg('1534352956036-cd81e27dd615'), calories: 480, time: '25 min', difficulty: 'Medium' },
  { id: 17, title: 'Chia Seed Pudding', category: 'Dessert', image: getImg('1556040220-4096d522378d'), calories: 220, time: '5 min', difficulty: 'Easy' },
  { id: 18, title: 'Lentil Soup', category: 'Vegan', image: getImg('1547592180-85f173990554'), calories: 310, time: '30 min', difficulty: 'Medium' },
  { id: 19, title: 'Shrimp Taco Salad', category: 'Lunch', image: getImg('1559410545-0adfbce2abac'), calories: 380, time: '15 min', difficulty: 'Medium' },
  { id: 20, title: 'Roasted Almonds & Walnuts', category: 'Snack', image: getImg('1599598425947-330026296906'), calories: 180, time: '0 min', difficulty: 'Easy' },
  { id: 21, title: 'Steak & Sweet Potato', category: 'Dinner', image: getImg('1600891964092-4316c288032e'), calories: 650, time: '30 min', difficulty: 'Hard' },
  { id: 22, title: 'Matcha Green Tea Latte', category: 'Breakfast', image: getImg('1515823662972-da6a2b4d3002'), calories: 120, time: '5 min', difficulty: 'Easy' },
  { id: 23, title: 'Zucchini Noodles Paneer', category: 'Dinner', image: getImg('1588166524941-3bf61a9c41db'), calories: 340, time: '20 min', difficulty: 'Medium' },
  { id: 24, title: 'Hummus & Pita Plate', category: 'Snack', image: getImg('1601314156637-23425f1b135c'), calories: 260, time: '10 min', difficulty: 'Easy' },
  { id: 25, title: 'Mango & Coconut Jelly', category: 'Dessert', image: getImg('1543362145-6679540c749b'), calories: 210, time: '15 min', difficulty: 'Medium' },
  { id: 26, title: 'Quinoa Stuffed Peppers', category: 'Vegan', image: getImg('1580227572767-f5dc81dfec3d'), calories: 380, time: '35 min', difficulty: 'Medium' },
  { id: 27, title: 'BLT Avocado Sandwich', category: 'Lunch', image: getImg('1509722747041-616f39b57569'), calories: 420, time: '10 min', difficulty: 'Easy' },
  { id: 28, title: 'Dark Chocolate Brownie', category: 'Dessert', image: getImg('1606313564200-e75d5e30476c'), calories: 350, time: '45 min', difficulty: 'Hard' },
  { id: 29, title: 'Oatmeal with Pecans', category: 'Breakfast', image: getImg('1517673132405-a56a62b18caf'), calories: 310, time: '10 min', difficulty: 'Easy' },
  { id: 30, title: 'Teriyaki Chicken Bowl', category: 'Lunch', image: getImg('1580476262798-bddd9f4b7369'), calories: 510, time: '20 min', difficulty: 'Medium' }
];

export const upcomingMealsData = [
  { initials: 'B', name: 'Avocado Egg Toast', time: '08:00 AM' },
  { initials: 'S', name: 'Almond Berry Smoothie', time: '11:00 AM' },
  { initials: 'L', name: 'Grilled Chicken Salad', time: '01:30 PM' },
  { initials: 'S', name: 'Protein Yogurt Bowl', time: '04:15 PM' },
  { initials: 'D', name: 'Baked Salmon Asparagus', time: '07:00 PM' },
];

export const genderOptions = [
  { value: 'Female', label: 'Female' },
  { value: 'Male', label: 'Male' },
  { value: 'Non-binary', label: 'Non-binary' },
  { value: 'Prefer not to say', label: 'Prefer not to say' }
];

export const goalOptions = [
  { value: 'Lose Weight', label: 'Lose Weight' },
  { value: 'Maintain Weight', label: 'Maintain Weight' },
  { value: 'Gain Muscle', label: 'Gain Muscle' },
  { value: 'Improve General Fitness', label: 'Improve General Fitness' }
];

export const activityOptions = [
  { value: 'Sedentary', label: 'Sedentary (Little or no exercise)' },
  { value: 'Lightly Active', label: 'Lightly Active (1-3 days/week)' },
  { value: 'Moderately Active', label: 'Moderately Active (3-5 days/week)' },
  { value: 'Very Active', label: 'Very Active (6-7 days/week)' },
  { value: 'Super Active', label: 'Super Active (Physical job/training)' }
];
