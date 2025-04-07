// utils/dateUtils.js
export const generateNextDays = (numDays = 30) => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      result.push(date.toISOString().split('T')[0]);
    }
    return result;
  };
  
  export const generatePreviousDays = (numDays = 30) => {
    const result = [];
    const today = new Date();
    for (let i = 0; i < numDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      result.push(date.toISOString().split('T')[0]);
    }
    return result;  
  }  