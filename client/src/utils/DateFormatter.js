class DateFormatter {
  constructor() {
    this.banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    this.banglaMonths = [
      "বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন",
      "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"
    ];
    
    this.banglaWeekdays = [
      "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার",
      "বৃহস্পতিবার", "শুক্রবার", "শনিবার"
    ];

    this.gregorianMonths = [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ];

    // Bangla month start dates in Gregorian calendar
    this.banglaMonthStartDates = [
      { month: 3, date: 14 },  // 0: Boishakh starts 14th April
      { month: 4, date: 15 },  // 1: Jyoishtho starts 15th May 
      { month: 5, date: 15 },  // 2: Asharh starts 15th June
      { month: 6, date: 16 },  // 3: Shrabon starts 16th July
      { month: 7, date: 16 },  // 4: Bhadro starts 16th August
      { month: 8, date: 16 },  // 5: Ashwin starts 16th September
      { month: 9, date: 17 },  // 6: Kartik starts 17th October
      { month: 10, date: 16 }, // 7: Agrahayon starts 16th November
      { month: 11, date: 15 }, // 8: Poush starts 15th December
      { month: 0, date: 14 },  // 9: Magh starts 14th January
      { month: 1, date: 13 },  // 10: Falgun starts 13th February
      { month: 2, date: 14 }   // 11: Chaitra starts 14th March
    ];
  }

  // Convert English digits to Bangla
  toBanglaDigit(num) {
    return num.toString().split("").map(d => this.banglaDigits[parseInt(d)] || d).join("");
  }

  // Check if leap year
  isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }

  getBanglaDate(date) {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    
    // Determine Bangla year
    let banglaYear;
    if (month < 3 || (month === 3 && day < 14)) {
      banglaYear = year - 594;
    } else {
      banglaYear = year - 593;
    }
    
    // Find current Bangla month
    let banglaMonthIndex = -1;
    for (let i = 0; i < 12; i++) {
      const currentMonth = this.banglaMonthStartDates[i].month;
      const currentDate = this.banglaMonthStartDates[i].date;
      const nextIndex = (i + 1) % 12;
      const nextMonth = this.banglaMonthStartDates[nextIndex].month;
      const nextDate = this.banglaMonthStartDates[nextIndex].date;
      
      // Handle month transitions
      if (month === currentMonth && day >= currentDate) {
        banglaMonthIndex = i;
        break;
      } else if (month === nextMonth && day < nextDate) {
        // If we're in the next Gregorian month but before the next Bangla month starts
        banglaMonthIndex = i;
        break;
      } else if (currentMonth === 11 && nextMonth === 0 && 
                ((month === 11 && day >= currentDate) || (month === 0 && day < nextDate) || 
                 (month > 11 || month < 0))) {
        // Special case for Poush (December-January transition)
        banglaMonthIndex = 8;
        break;
      } else if (currentMonth === 0 && nextMonth === 1 && 
                ((month === 0 && day >= currentDate) || (month === 1 && day < nextDate))) {
        // Special case for Magh (January-February transition)
        banglaMonthIndex = 9;
        break;
      } else if (currentMonth === 1 && nextMonth === 2 && 
                ((month === 1 && day >= currentDate) || (month === 2 && day < nextDate))) {
        // Special case for Falgun (February-March transition)
        banglaMonthIndex = 10;
        break;
      } else if (currentMonth === 2 && nextMonth === 3 && 
                ((month === 2 && day >= currentDate) || (month === 3 && day < nextDate))) {
        // Special case for Chaitra (March-April transition)
        banglaMonthIndex = 11;
        break;
      }
    }
    
    // If no match found, default to current month conversion
    if (banglaMonthIndex === -1) {
      if (month >= 3 && month <= 11) {
        banglaMonthIndex = month - 3;
      } else {
        banglaMonthIndex = month + 9;
      }
    }
    
    // Calculate Bangla day
    let banglaDay;
    const startMonth = this.banglaMonthStartDates[banglaMonthIndex].month;
    const startDate = this.banglaMonthStartDates[banglaMonthIndex].date;
    
    if (month === startMonth) {
      // We're in the same Gregorian month where the Bangla month started
      banglaDay = day - startDate + 1;
    } else {
      // We're in a different month, calculate days since Bangla month started
      const daysInStartMonth = new Date(
        year, 
        startMonth === 11 ? 0 : startMonth + 1, 
        0
      ).getDate();
      banglaDay = (daysInStartMonth - startDate + 1) + day;
    }
    
    // Special case for Falgun in leap years (has 30 days instead of 29)
    if (banglaMonthIndex === 10 && this.isLeapYear(year) && banglaDay > 30) {
      banglaMonthIndex = 11;  // Move to Chaitra
      banglaDay = banglaDay - 30;
    }
    
    return {
      weekday: this.banglaWeekdays[date.getDay()],
      day: this.toBanglaDigit(banglaDay),
      month: this.banglaMonths[banglaMonthIndex],
      year: this.toBanglaDigit(banglaYear)
    };
  }

  getGregorianDateInBangla(date) {
    const day = this.toBanglaDigit(date.getDate());
    const month = this.gregorianMonths[date.getMonth()];
    const year = this.toBanglaDigit(date.getFullYear());
    
    return {
      day: day,
      month: month,
      year: year
    };
  }

  getFormattedDate(date) {
    const banglaDate = this.getBanglaDate(date);
    const gregDate = this.getGregorianDateInBangla(date);
    
    // Format: "বৃহস্পতিবার, ১ জ্যৈষ্ঠ ১৪৩২, ১৫ মে ২০২৫"
    return `${banglaDate.weekday}, ${banglaDate.day} ${banglaDate.month} ${banglaDate.year}, ${gregDate.day} ${gregDate.month} ${gregDate.year}`;
  }
}

export default DateFormatter;
