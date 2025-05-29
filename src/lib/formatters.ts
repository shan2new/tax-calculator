/**
 * Format number in Indian currency format (e.g., ₹7,50,000)
 */
export function formatCurrency(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

/**
 * Format number in Indian number system without currency symbol
 */
export function formatIndianNumber(num: number): string {
  return num.toLocaleString('en-IN');
}

/**
 * Parse Indian formatted number string to number
 */
export function parseIndianNumber(str: string): number {
  const cleanStr = str.replace(/,/g, '');
  return parseInt(cleanStr) || 0;
}

/**
 * Convert number to words in Indian format
 */
export function convertToWords(num: number): string {
  if (num === 0) return '💰 Zero rupees annually';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  let words = '💰 ';
  
  // Crores
  if (num >= 10000000) {
    const crores = Math.floor(num / 10000000);
    words += convertHundreds(crores) + ' Crore ';
    num %= 10000000;
  }
  
  // Lakhs
  if (num >= 100000) {
    const lakhs = Math.floor(num / 100000);
    words += convertHundreds(lakhs) + ' Lakh ';
    num %= 100000;
  }
  
  // Thousands
  if (num >= 1000) {
    const thousands = Math.floor(num / 1000);
    words += convertHundreds(thousands) + ' Thousand ';
    num %= 1000;
  }
  
  // Hundreds
  if (num > 0) {
    words += convertHundreds(num);
  }
  
  return words.trim() + ' rupees annually';
  
  function convertHundreds(n: number): string {
    let str = '';
    
    // Hundreds place
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    
    // Tens and ones place
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    
    // Teens
    if (n >= 10 && n < 20) {
      str += teens[n - 10] + ' ';
      n = 0;
    }
    
    // Ones
    if (n > 0) {
      str += ones[n] + ' ';
    }
    
    return str.trim();
  }
}

/**
 * Format percentage with 2 decimal places
 */
export function formatPercentage(percentage: number): string {
  return percentage.toFixed(2) + '%';
}

/**
 * Format number with proper abbreviations (K, L, Cr)
 */
export function formatNumberWithAbbreviation(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(1) + 'Cr';
  } else if (num >= 100000) {
    return (num / 100000).toFixed(1) + 'L';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Validate if a number is a valid income amount
 */
export function validateIncome(income: number): {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
} {
  if (income <= 0) {
    return {
      isValid: false,
      message: '⚠️ Please enter a valid income amount',
      type: 'error'
    };
  }
  
  if (income < 100000) {
    return {
      isValid: true,
      message: '⚠️ Below typical income range',
      type: 'warning'
    };
  }
  
  if (income >= 100000) {
    return {
      isValid: true,
      message: '✓ Valid income amount',
      type: 'success'
    };
  }
  
  return {
    isValid: true,
    message: '',
    type: 'success'
  };
}

/**
 * Validate months worked
 */
export function validateMonths(months: number): {
  isValid: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
} {
  if (months < 1 || months > 12) {
    return {
      isValid: false,
      message: '⚠️ Please enter months between 1 and 12',
      type: 'error'
    };
  }
  
  if (months === 12) {
    return {
      isValid: true,
      message: '✓ Full year income period',
      type: 'success'
    };
  }
  
  if (months >= 6) {
    return {
      isValid: true,
      message: '✓ Partial year income period',
      type: 'success'
    };
  }
  
  return {
    isValid: true,
    message: '⚠️ Short income period',
    type: 'warning'
  };
} 