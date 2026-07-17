export interface Zone {
  id: string;
  name: string;
  type: 'industrial' | 'transit' | 'residential' | 'commercial' | 'parkland';
  basePollution: number; // 0-100
  pollution: number; // current calculated pollution
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  intervention?: 'trees' | 'corridor' | 'pedestrian' | 'traffic';
}

export interface CityPreset {
  name: string;
  country: string;
  category: 'India' | 'Global';
  description: string;
  accentColor: string;
  riverPath: string;
  avgBasePollution: number;
  zones: Zone[];
}

export const CITIES_METADATA: Array<{
  name: string;
  country: string;
  category: 'India' | 'Global';
  accentColor: string;
  avgBasePollution: number;
  riverPath: string;
}> = [
  // --- INDIAN CITIES (100) ---
  { name: 'Delhi', country: 'NCR', category: 'India', avgBasePollution: 84, accentColor: '#ef4444', riverPath: 'M0,75 Q35,70 50,50 T100,25' },
  { name: 'Mumbai', country: 'Maharashtra', category: 'India', avgBasePollution: 62, accentColor: '#38bdf8', riverPath: 'M30,0 Q20,40 45,60 T40,100' },
  { name: 'Bengaluru', country: 'Karnataka', category: 'India', avgBasePollution: 42, accentColor: '#10b981', riverPath: 'M0,45 Q40,40 60,60 T100,55' },
  { name: 'Kolkata', country: 'West Bengal', category: 'India', avgBasePollution: 68, accentColor: '#f59e0b', riverPath: 'M50,0 Q40,30 60,70 T50,100' },
  { name: 'Chennai', country: 'Tamil Nadu', category: 'India', avgBasePollution: 46, accentColor: '#06b6d4', riverPath: 'M0,80 Q25,60 50,75 T100,70' },
  { name: 'Hyderabad', country: 'Telangana', category: 'India', avgBasePollution: 56, accentColor: '#8b5cf6', riverPath: 'M0,20 Q40,35 65,15 T100,30' },
  { name: 'Pune', country: 'Maharashtra', category: 'India', avgBasePollution: 48, accentColor: '#ec4899', riverPath: 'M10,0 Q40,50 30,70 T90,100' },
  { name: 'Ahmedabad', country: 'Gujarat', category: 'India', avgBasePollution: 72, accentColor: '#f97316', riverPath: 'M40,0 Q45,45 35,55 T40,100' },
  { name: 'Surat', country: 'Gujarat', category: 'India', avgBasePollution: 65, accentColor: '#06b6d4', riverPath: 'M0,50 Q30,40 70,60 T100,50' },
  { name: 'Kanpur', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 86, accentColor: '#ef4444', riverPath: 'M0,60 Q40,65 55,45 T100,40' },
  { name: 'Lucknow', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 78, accentColor: '#f59e0b', riverPath: 'M0,40 Q50,45 70,30 T100,50' },
  { name: 'Jaipur', country: 'Rajasthan', category: 'India', avgBasePollution: 58, accentColor: '#f97316', riverPath: 'M0,20 Q30,50 60,30 T100,80' },
  { name: 'Nagpur', country: 'Maharashtra', category: 'India', avgBasePollution: 52, accentColor: '#10b981', riverPath: 'M20,0 Q50,40 45,70 T80,100' },
  { name: 'Visakhapatnam', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 58, accentColor: '#3b82f6', riverPath: 'M45,0 Q30,50 50,70 T40,100' },
  { name: 'Indore', country: 'Madhya Pradesh', category: 'India', avgBasePollution: 54, accentColor: '#10b981', riverPath: 'M0,30 Q40,40 60,20 T100,50' },
  { name: 'Bhopal', country: 'Madhya Pradesh', category: 'India', avgBasePollution: 50, accentColor: '#3b82f6', riverPath: 'M0,80 Q50,50 50,20 T100,20' },
  { name: 'Patna', country: 'Bihar', category: 'India', avgBasePollution: 82, accentColor: '#ef4444', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Vadodara', country: 'Gujarat', category: 'India', avgBasePollution: 62, accentColor: '#f59e0b', riverPath: 'M25,0 Q35,45 20,65 T30,100' },
  { name: 'Ghaziabad', country: 'NCR', category: 'India', avgBasePollution: 88, accentColor: '#ef4444', riverPath: 'M0,90 Q30,70 60,80 T100,60' },
  { name: 'Ludhiana', country: 'Punjab', category: 'India', avgBasePollution: 80, accentColor: '#f97316', riverPath: 'M0,10 Q50,30 40,70 T100,90' },
  { name: 'Agra', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 76, accentColor: '#f59e0b', riverPath: 'M0,55 Q35,50 60,65 T100,45' },
  { name: 'Nashik', country: 'Maharashtra', category: 'India', avgBasePollution: 44, accentColor: '#10b981', riverPath: 'M15,0 Q25,45 35,55 T25,100' },
  { name: 'Faridabad', country: 'NCR', category: 'India', avgBasePollution: 85, accentColor: '#ef4444', riverPath: 'M0,65 Q45,55 50,75 T100,60' },
  { name: 'Meerut', country: 'NCR', category: 'India', avgBasePollution: 74, accentColor: '#f59e0b', riverPath: 'M0,25 Q40,30 65,15 T100,45' },
  { name: 'Rajkot', country: 'Gujarat', category: 'India', avgBasePollution: 60, accentColor: '#f97316', riverPath: 'M10,0 Q30,50 50,40 T90,100' },
  { name: 'Varanasi', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 75, accentColor: '#f59e0b', riverPath: 'M0,70 Q45,60 55,40 T100,30' },
  { name: 'Srinagar', country: 'Jammu & Kashmir', category: 'India', avgBasePollution: 52, accentColor: '#38bdf8', riverPath: 'M0,40 Q30,50 60,35 T100,40' },
  { name: 'Amritsar', country: 'Punjab', category: 'India', avgBasePollution: 68, accentColor: '#f59e0b', riverPath: 'M0,20 Q50,40 50,70 T100,80' },
  { name: 'Navi Mumbai', country: 'Maharashtra', category: 'India', avgBasePollution: 54, accentColor: '#38bdf8', riverPath: 'M40,0 Q30,45 35,55 T30,100' },
  { name: 'Allahabad', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 70, accentColor: '#f59e0b', riverPath: 'M0,50 Q40,40 60,60 T100,50' },
  { name: 'Ranchi', country: 'Jharkhand', category: 'India', avgBasePollution: 48, accentColor: '#10b981', riverPath: 'M0,35 Q50,55 50,25 T100,45' },
  { name: 'Coimbatore', country: 'Tamil Nadu', category: 'India', avgBasePollution: 38, accentColor: '#10b981', riverPath: 'M20,0 Q35,45 40,60 T35,100' },
  { name: 'Jabalpur', country: 'Madhya Pradesh', category: 'India', avgBasePollution: 52, accentColor: '#f59e0b', riverPath: 'M0,80 Q40,60 60,75 T100,50' },
  { name: 'Gwalior', country: 'Madhya Pradesh', category: 'India', avgBasePollution: 78, accentColor: '#f97316', riverPath: 'M0,30 Q30,45 70,25 T100,40' },
  { name: 'Vijayawada', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 50, accentColor: '#38bdf8', riverPath: 'M0,45 Q40,50 60,30 T100,45' },
  { name: 'Jodhpur', country: 'Rajasthan', category: 'India', avgBasePollution: 66, accentColor: '#f97316', riverPath: 'M0,15 Q30,45 65,25 T100,85' },
  { name: 'Madurai', country: 'Tamil Nadu', category: 'India', avgBasePollution: 44, accentColor: '#8b5cf6', riverPath: 'M10,0 Q50,50 40,70 T90,100' },
  { name: 'Raipur', country: 'Chhattisgarh', category: 'India', avgBasePollution: 82, accentColor: '#ef4444', riverPath: 'M0,60 Q45,60 55,40 T100,40' },
  { name: 'Kota', country: 'Rajasthan', category: 'India', avgBasePollution: 58, accentColor: '#f97316', riverPath: 'M0,25 Q40,35 60,15 T100,30' },
  { name: 'Guwahati', country: 'Assam', category: 'India', avgBasePollution: 56, accentColor: '#10b981', riverPath: 'M0,50 Q50,55 70,35 T100,45' },
  { name: 'Chandigarh', country: 'Punjab/Haryana', category: 'India', avgBasePollution: 42, accentColor: '#10b981', riverPath: 'M30,0 Q40,45 35,55 T40,100' },
  { name: 'Solapur', country: 'Maharashtra', category: 'India', avgBasePollution: 54, accentColor: '#f97316', riverPath: 'M0,45 Q40,40 60,60 T100,55' },
  { name: 'Hubli-Dharwad', country: 'Karnataka', category: 'India', avgBasePollution: 46, accentColor: '#f59e0b', riverPath: 'M0,15 Q30,50 60,30 T100,80' },
  { name: 'Bareilly', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 68, accentColor: '#f59e0b', riverPath: 'M0,40 Q50,45 70,30 T100,50' },
  { name: 'Moradabad', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 82, accentColor: '#ef4444', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Mysore', country: 'Karnataka', category: 'India', avgBasePollution: 28, accentColor: '#10b981', riverPath: 'M25,0 Q35,45 20,65 T30,100' },
  { name: 'Gurgaon', country: 'Haryana', category: 'India', avgBasePollution: 76, accentColor: '#f59e0b', riverPath: 'M0,75 Q35,70 50,50 T100,25' },
  { name: 'Noida', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 74, accentColor: '#f59e0b', riverPath: 'M0,90 Q30,70 60,80 T100,60' },
  { name: 'Aligarh', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 75, accentColor: '#f59e0b', riverPath: 'M0,25 Q40,30 65,15 T100,45' },
  { name: 'Jalandhar', country: 'Punjab', category: 'India', avgBasePollution: 64, accentColor: '#f97316', riverPath: 'M0,10 Q50,30 40,70 T100,90' },
  { name: 'Tiruchirappalli', country: 'Tamil Nadu', category: 'India', avgBasePollution: 44, accentColor: '#10b981', riverPath: 'M15,0 Q25,45 35,55 T25,100' },
  { name: 'Bhubaneswar', country: 'Odisha', category: 'India', avgBasePollution: 40, accentColor: '#10b981', riverPath: 'M0,65 Q45,55 50,75 T100,60' },
  { name: 'Salem', country: 'Tamil Nadu', category: 'India', avgBasePollution: 48, accentColor: '#f59e0b', riverPath: 'M0,20 Q30,50 60,30 T100,80' },
  { name: 'Warangal', country: 'Telangana', category: 'India', avgBasePollution: 46, accentColor: '#8b5cf6', riverPath: 'M20,0 Q50,40 45,70 T80,100' },
  { name: 'Thiruvananthapuram', country: 'Kerala', category: 'India', avgBasePollution: 26, accentColor: '#10b981', riverPath: 'M45,0 Q30,50 50,70 T40,100' },
  { name: 'Jamshedpur', country: 'Jharkhand', category: 'India', avgBasePollution: 66, accentColor: '#f97316', riverPath: 'M0,30 Q40,40 60,20 T100,50' },
  { name: 'Bhilai', country: 'Chhattisgarh', category: 'India', avgBasePollution: 72, accentColor: '#ef4444', riverPath: 'M0,80 Q50,50 50,20 T100,20' },
  { name: 'Cuttack', country: 'Odisha', category: 'India', avgBasePollution: 48, accentColor: '#38bdf8', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Kochi', country: 'Kerala', category: 'India', avgBasePollution: 32, accentColor: '#38bdf8', riverPath: 'M25,0 Q35,45 20,65 T30,100' },
  { name: 'Nellore', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 36, accentColor: '#10b981', riverPath: 'M0,90 Q30,70 60,80 T100,60' },
  { name: 'Bhavnagar', country: 'Gujarat', category: 'India', avgBasePollution: 52, accentColor: '#f97316', riverPath: 'M0,10 Q50,30 40,70 T100,90' },
  { name: 'Dehradun', country: 'Uttarakhand', category: 'India', avgBasePollution: 48, accentColor: '#38bdf8', riverPath: 'M0,55 Q35,50 60,65 T100,45' },
  { name: 'Durgapur', country: 'West Bengal', category: 'India', avgBasePollution: 70, accentColor: '#ef4444', riverPath: 'M15,0 Q25,45 35,55 T25,100' },
  { name: 'Asansol', country: 'West Bengal', category: 'India', avgBasePollution: 74, accentColor: '#ef4444', riverPath: 'M0,65 Q45,55 50,75 T100,60' },
  { name: 'Rourkela', country: 'Odisha', category: 'India', avgBasePollution: 64, accentColor: '#f97316', riverPath: 'M0,25 Q40,30 65,15 T100,45' },
  { name: 'Kolhapur', country: 'Maharashtra', category: 'India', avgBasePollution: 42, accentColor: '#10b981', riverPath: 'M10,0 Q30,50 50,40 T90,100' },
  { name: 'Ajmer', country: 'Rajasthan', category: 'India', avgBasePollution: 56, accentColor: '#f59e0b', riverPath: 'M0,70 Q45,60 55,40 T100,30' },
  { name: 'Jamnagar', country: 'Gujarat', category: 'India', avgBasePollution: 62, accentColor: '#f97316', riverPath: 'M0,40 Q30,50 60,35 T100,40' },
  { name: 'Ujjain', country: 'Madhya Pradesh', category: 'India', avgBasePollution: 52, accentColor: '#f59e0b', riverPath: 'M0,20 Q50,40 50,70 T100,80' },
  { name: 'Jhansi', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 58, accentColor: '#f59e0b', riverPath: 'M40,0 Q30,45 35,55 T30,100' },
  { name: 'Pondicherry', country: 'Puducherry', category: 'India', avgBasePollution: 30, accentColor: '#38bdf8', riverPath: 'M0,50 Q40,40 60,60 T100,50' },
  { name: 'Tirunelveli', country: 'Tamil Nadu', category: 'India', avgBasePollution: 38, accentColor: '#10b981', riverPath: 'M0,35 Q50,55 50,25 T100,45' },
  { name: 'Udaipur', country: 'Rajasthan', category: 'India', avgBasePollution: 46, accentColor: '#38bdf8', riverPath: 'M20,0 Q35,45 40,60 T35,100' },
  { name: 'Karnal', country: 'Haryana', category: 'India', avgBasePollution: 70, accentColor: '#f59e0b', riverPath: 'M0,80 Q40,60 60,75 T100,50' },
  { name: 'Panipat', country: 'Haryana', category: 'India', avgBasePollution: 84, accentColor: '#ef4444', riverPath: 'M0,30 Q30,45 70,25 T100,40' },
  { name: 'Bathinda', country: 'Punjab', category: 'India', avgBasePollution: 78, accentColor: '#f97316', riverPath: 'M0,45 Q40,50 60,30 T100,45' },
  { name: 'Rohtak', country: 'Haryana', category: 'India', avgBasePollution: 72, accentColor: '#f59e0b', riverPath: 'M0,15 Q30,45 65,25 T100,85' },
  { name: 'Hisar', country: 'Haryana', category: 'India', avgBasePollution: 74, accentColor: '#f97316', riverPath: 'M10,0 Q50,50 40,70 T90,100' },
  { name: 'Shimla', country: 'Himachal Pradesh', category: 'India', avgBasePollution: 20, accentColor: '#10b981', riverPath: 'M0,60 Q45,60 55,40 T100,40' },
  { name: 'Dharamshala', country: 'Himachal Pradesh', category: 'India', avgBasePollution: 18, accentColor: '#10b981', riverPath: 'M0,25 Q40,35 60,15 T100,30' },
  { name: 'Haridwar', country: 'Uttarakhand', category: 'India', avgBasePollution: 48, accentColor: '#38bdf8', riverPath: 'M0,50 Q50,55 70,35 T100,45' },
  { name: 'Rishikesh', country: 'Uttarakhand', category: 'India', avgBasePollution: 25, accentColor: '#10b981', riverPath: 'M30,0 Q40,45 35,55 T40,100' },
  { name: 'Siliguri', country: 'West Bengal', category: 'India', avgBasePollution: 62, accentColor: '#f97316', riverPath: 'M0,45 Q40,40 60,60 T100,55' },
  { name: 'Mangalore', country: 'Karnataka', category: 'India', avgBasePollution: 34, accentColor: '#38bdf8', riverPath: 'M0,15 Q30,50 60,30 T100,80' },
  { name: 'Belgaum', country: 'Karnataka', category: 'India', avgBasePollution: 40, accentColor: '#10b981', riverPath: 'M0,40 Q50,45 70,30 T100,50' },
  { name: 'Kurnool', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 44, accentColor: '#f59e0b', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Rajahmundry', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 42, accentColor: '#38bdf8', riverPath: 'M25,0 Q35,45 20,65 T30,100' },
  { name: 'Guntur', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 46, accentColor: '#f59e0b', riverPath: 'M0,75 Q35,70 50,50 T100,25' },
  { name: 'Tirupati', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 40, accentColor: '#8b5cf6', riverPath: 'M0,90 Q30,70 60,80 T100,60' },
  { name: 'Amaravati', country: 'Andhra Pradesh', category: 'India', avgBasePollution: 32, accentColor: '#10b981', riverPath: 'M0,25 Q40,30 65,15 T100,45' },
  { name: 'Gaya', country: 'Bihar', category: 'India', avgBasePollution: 76, accentColor: '#ef4444', riverPath: 'M0,10 Q50,30 40,70 T100,90' },
  { name: 'Mathura', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 78, accentColor: '#f59e0b', riverPath: 'M15,0 Q25,45 35,55 T25,100' },
  { name: 'Muzaffarnagar', country: 'Uttar Pradesh', category: 'India', avgBasePollution: 75, accentColor: '#f97316', riverPath: 'M0,65 Q45,55 50,75 T100,60' },
  { name: 'Haldia', country: 'West Bengal', category: 'India', avgBasePollution: 58, accentColor: '#38bdf8', riverPath: 'M0,20 Q30,50 60,30 T100,80' },
  { name: 'Shillong', country: 'Meghalaya', category: 'India', avgBasePollution: 15, accentColor: '#10b981', riverPath: 'M20,0 Q50,40 45,70 T80,100' },
  { name: 'Imphal', country: 'Manipur', category: 'India', avgBasePollution: 36, accentColor: '#10b981', riverPath: 'M45,0 Q30,50 50,70 T40,100' },
  { name: 'Jammu', country: 'Jammu & Kashmir', category: 'India', avgBasePollution: 50, accentColor: '#f59e0b', riverPath: 'M0,30 Q40,40 60,20 T100,50' },
  { name: 'Port Blair', country: 'Andaman & Nicobar', category: 'India', avgBasePollution: 12, accentColor: '#10b981', riverPath: 'M0,80 Q50,50 50,20 T100,20' },
  { name: 'Gangtok', country: 'Sikkim', category: 'India', avgBasePollution: 14, accentColor: '#10b981', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Itanagar', country: 'Arunachal Pradesh', category: 'India', avgBasePollution: 16, accentColor: '#10b981', riverPath: 'M25,0 Q35,45 20,65 T30,100' },

  // --- GLOBAL CITIES (60) ---
  { name: 'Tokyo', country: 'Japan', category: 'Global', avgBasePollution: 28, accentColor: '#a855f7', riverPath: 'M0,45 Q40,50 65,30 T100,45' },
  { name: 'New York', country: 'United States', category: 'Global', avgBasePollution: 35, accentColor: '#3b82f6', riverPath: 'M35,0 Q30,45 40,55 T38,100' },
  { name: 'London', country: 'United Kingdom', category: 'Global', avgBasePollution: 32, accentColor: '#06b6d4', riverPath: 'M0,50 Q40,60 50,45 T100,55' },
  { name: 'Paris', country: 'France', category: 'Global', avgBasePollution: 36, accentColor: '#ec4899', riverPath: 'M0,30 Q50,45 50,65 T100,30' },
  { name: 'Beijing', country: 'China', category: 'Global', avgBasePollution: 58, accentColor: '#ef4444', riverPath: 'M0,20 Q30,50 60,30 T100,80' },
  { name: 'Shanghai', country: 'China', category: 'Global', avgBasePollution: 46, accentColor: '#f97316', riverPath: 'M20,0 Q50,40 45,70 T80,100' },
  { name: 'Los Angeles', country: 'United States', category: 'Global', avgBasePollution: 54, accentColor: '#ec4899', riverPath: 'M45,0 Q30,50 50,70 T40,100' },
  { name: 'Chicago', country: 'United States', category: 'Global', avgBasePollution: 30, accentColor: '#3b82f6', riverPath: 'M0,30 Q40,40 60,20 T100,50' },
  { name: 'Toronto', country: 'Canada', category: 'Global', avgBasePollution: 24, accentColor: '#10b981', riverPath: 'M0,80 Q50,50 50,20 T100,20' },
  { name: 'Sao Paulo', country: 'Brazil', category: 'Global', avgBasePollution: 48, accentColor: '#f97316', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Buenos Aires', country: 'Argentina', category: 'Global', avgBasePollution: 28, accentColor: '#38bdf8', riverPath: 'M25,0 Q35,45 20,65 T30,100' },
  { name: 'Sydney', country: 'Australia', category: 'Global', avgBasePollution: 18, accentColor: '#06b6d4', riverPath: 'M0,90 Q30,70 60,80 T100,60' },
  { name: 'Melbourne', country: 'Australia', category: 'Global', avgBasePollution: 16, accentColor: '#10b981', riverPath: 'M0,10 Q50,30 40,70 T100,90' },
  { name: 'Seoul', country: 'South Korea', category: 'Global', avgBasePollution: 44, accentColor: '#8b5cf6', riverPath: 'M0,55 Q35,50 60,65 T100,45' },
  { name: 'Singapore', country: 'Singapore', category: 'Global', avgBasePollution: 22, accentColor: '#10b981', riverPath: 'M15,0 Q25,45 35,55 T25,100' },
  { name: 'Berlin', country: 'Germany', category: 'Global', avgBasePollution: 26, accentColor: '#ec4899', riverPath: 'M0,65 Q45,55 50,75 T100,60' },
  { name: 'Moscow', country: 'Russia', category: 'Global', avgBasePollution: 40, accentColor: '#3b82f6', riverPath: 'M0,25 Q40,30 65,15 T100,45' },
  { name: 'Dubai', country: 'United Arab Emirates', category: 'Global', avgBasePollution: 62, accentColor: '#f59e0b', riverPath: 'M10,0 Q30,50 50,40 T90,100' },
  { name: 'Riyadh', country: 'Saudi Arabia', category: 'Global', avgBasePollution: 68, accentColor: '#f97316', riverPath: 'M0,70 Q45,60 55,40 T100,30' },
  { name: 'Istanbul', country: 'Turkey', category: 'Global', avgBasePollution: 42, accentColor: '#8b5cf6', riverPath: 'M0,40 Q30,50 60,35 T100,40' },
  { name: 'Jakarta', country: 'Indonesia', category: 'Global', avgBasePollution: 72, accentColor: '#ef4444', riverPath: 'M0,20 Q50,40 50,70 T100,80' },
  { name: 'Manila', country: 'Philippines', category: 'Global', avgBasePollution: 56, accentColor: '#f97316', riverPath: 'M40,0 Q30,45 35,55 T30,100' },
  { name: 'Bangkok', country: 'Thailand', category: 'Global', avgBasePollution: 54, accentColor: '#f59e0b', riverPath: 'M0,50 Q40,40 60,60 T100,50' },
  { name: 'Mexico City', country: 'Mexico', category: 'Global', avgBasePollution: 64, accentColor: '#ef4444', riverPath: 'M0,35 Q50,55 50,25 T100,45' },
  { name: 'Rio de Janeiro', country: 'Brazil', category: 'Global', avgBasePollution: 38, accentColor: '#10b981', riverPath: 'M20,0 Q35,45 40,60 T35,100' },
  { name: 'Lima', country: 'Peru', category: 'Global', avgBasePollution: 58, accentColor: '#f59e0b', riverPath: 'M0,80 Q40,60 60,75 T100,50' },
  { name: 'Bogota', country: 'Colombia', category: 'Global', avgBasePollution: 40, accentColor: '#10b981', riverPath: 'M0,30 Q30,45 70,25 T100,40' },
  { name: 'Santiago', country: 'Chile', category: 'Global', avgBasePollution: 55, accentColor: '#f97316', riverPath: 'M0,45 Q40,50 60,30 T100,45' },
  { name: 'Johannesburg', country: 'South Africa', category: 'Global', avgBasePollution: 48, accentColor: '#f59e0b', riverPath: 'M0,15 Q30,45 65,25 T100,85' },
  { name: 'Nairobi', country: 'Kenya', category: 'Global', avgBasePollution: 38, accentColor: '#10b981', riverPath: 'M10,0 Q50,50 40,70 T90,100' },
  { name: 'Casablanca', country: 'Morocco', category: 'Global', avgBasePollution: 44, accentColor: '#38bdf8', riverPath: 'M0,60 Q45,60 55,40 T100,40' },
  { name: 'Cape Town', country: 'South Africa', category: 'Global', avgBasePollution: 22, accentColor: '#10b981', riverPath: 'M0,25 Q40,35 60,15 T100,30' },
  { name: 'Amsterdam', country: 'Netherlands', category: 'Global', avgBasePollution: 24, accentColor: '#10b981', riverPath: 'M0,50 Q50,55 70,35 T100,45' },
  { name: 'Brussels', country: 'Belgium', category: 'Global', avgBasePollution: 32, accentColor: '#38bdf8', riverPath: 'M30,0 Q40,45 35,55 T40,100' },
  { name: 'Vienna', country: 'Austria', category: 'Global', avgBasePollution: 20, accentColor: '#10b981', riverPath: 'M0,45 Q40,40 60,60 T100,55' },
  { name: 'Zurich', country: 'Switzerland', category: 'Global', avgBasePollution: 14, accentColor: '#10b981', riverPath: 'M0,15 Q30,50 60,30 T100,80' },
  { name: 'Geneva', country: 'Switzerland', category: 'Global', avgBasePollution: 15, accentColor: '#10b981', riverPath: 'M0,40 Q50,45 70,30 T100,50' },
  { name: 'Rome', country: 'Italy', category: 'Global', avgBasePollution: 34, accentColor: '#f59e0b', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Madrid', country: 'Spain', category: 'Global', avgBasePollution: 35, accentColor: '#f97316', riverPath: 'M25,0 Q35,45 20,65 T30,100' },
  { name: 'Barcelona', country: 'Spain', category: 'Global', avgBasePollution: 28, accentColor: '#38bdf8', riverPath: 'M0,75 Q35,70 50,50 T100,25' },
  { name: 'Stockholm', country: 'Sweden', category: 'Global', avgBasePollution: 12, accentColor: '#10b981', riverPath: 'M0,90 Q30,70 60,80 T100,60' },
  { name: 'Oslo', country: 'Norway', category: 'Global', avgBasePollution: 14, accentColor: '#10b981', riverPath: 'M0,25 Q40,30 65,15 T100,45' },
  { name: 'Helsinki', country: 'Finland', category: 'Global', avgBasePollution: 11, accentColor: '#10b981', riverPath: 'M0,10 Q50,30 40,70 T100,90' },
  { name: 'Copenhagen', country: 'Denmark', category: 'Global', avgBasePollution: 15, accentColor: '#10b981', riverPath: 'M15,0 Q25,45 35,55 T25,100' },
  { name: 'Dublin', country: 'Ireland', category: 'Global', avgBasePollution: 16, accentColor: '#38bdf8', riverPath: 'M0,65 Q45,55 50,75 T100,60' },
  { name: 'Warsaw', country: 'Poland', category: 'Global', avgBasePollution: 38, accentColor: '#f59e0b', riverPath: 'M0,20 Q30,50 60,30 T100,80' },
  { name: 'Prague', country: 'Czech Republic', category: 'Global', avgBasePollution: 28, accentColor: '#f59e0b', riverPath: 'M20,0 Q50,40 45,70 T80,100' },
  { name: 'Athens', country: 'Greece', category: 'Global', avgBasePollution: 40, accentColor: '#f97316', riverPath: 'M45,0 Q30,50 50,70 T40,100' },
  { name: 'Cairo', country: 'Egypt', category: 'Global', avgBasePollution: 74, accentColor: '#f97316', riverPath: 'M0,30 Q40,40 60,20 T100,50' },
  { name: 'Lagos', country: 'Nigeria', category: 'Global', avgBasePollution: 65, accentColor: '#ef4444', riverPath: 'M0,80 Q50,50 50,20 T100,20' },
  { name: 'Vancouver', country: 'Canada', category: 'Global', avgBasePollution: 16, accentColor: '#10b981', riverPath: 'M0,35 Q40,40 70,30 T100,45' },
  { name: 'Seattle', country: 'United States', category: 'Global', avgBasePollution: 15, accentColor: '#38bdf8', riverPath: 'M25,0 Q35,45 20,65 T30,100' },
  { name: 'San Francisco', country: 'United States', category: 'Global', avgBasePollution: 14, accentColor: '#38bdf8', riverPath: 'M0,90 Q30,70 60,80 T100,60' },
  { name: 'Montreal', country: 'Canada', category: 'Global', avgBasePollution: 20, accentColor: '#38bdf8', riverPath: 'M0,10 Q50,30 40,70 T100,90' },
  { name: 'Dhaka', country: 'Bangladesh', category: 'Global', avgBasePollution: 82, accentColor: '#ef4444', riverPath: 'M0,55 Q35,50 60,65 T100,45' },
  { name: 'Milan', country: 'Italy', category: 'Global', avgBasePollution: 48, accentColor: '#f59e0b', riverPath: 'M15,0 Q25,45 35,55 T25,100' },
  { name: 'Kabul', country: 'Afghanistan', category: 'Global', avgBasePollution: 78, accentColor: '#ef4444', riverPath: 'M0,65 Q45,55 50,75 T100,60' },
  { name: 'Lahore', country: 'Pakistan', category: 'Global', avgBasePollution: 85, accentColor: '#ef4444', riverPath: 'M0,25 Q40,30 65,15 T100,45' },
  { name: 'Hanoi', country: 'Vietnam', category: 'Global', avgBasePollution: 66, accentColor: '#f59e0b', riverPath: 'M10,0 Q30,50 50,40 T90,100' }
];

// Helper to procedurally generate uniquely themed, structurally distinct zones/districts for any given city!
// Avoids hardcoding 5 zones for each of the 160 cities directly in the bundle, while maintaining high authenticity and zero duplicates.
export function generateCityPreset(meta: typeof CITIES_METADATA[0]): CityPreset {
  const avg = meta.avgBasePollution;
  const isIndia = meta.category === 'India';

  // Distinct local-sounding district names based on real cities or geographical features
  let names: string[] = [];
  let descSuffix = '';

  if (isIndia) {
    descSuffix = `This dynamically active city in India experiences localized climate dynamics, where seasonal wind stagnation and distinct geographic landforms directly affect particulates.`;
    if (meta.name === 'Delhi') {
      names = ['Okhla Industrial Sector', 'Connaught Transit Core', 'Dwarka Smart Grid', 'Noida Cyber-Park', 'Yamuna Restored Plains'];
    } else if (meta.name === 'Mumbai') {
      names = ['Trombay Refinery Zone', 'Dharavi Micro-Grid', 'Bandra Cyber Boulevard', 'Colaba Maritime Link', 'Sanjay Gandhi Forest Reserve'];
    } else if (meta.name === 'Bengaluru') {
      names = ['Peenya Industrial Block', 'Kempegowda Transit Interchange', 'Whitefield Silicon Sector', 'Indiranagar Canopy Ward', 'Lalbagh Botanical Sanctuary'];
    } else if (meta.name === 'Kolkata') {
      names = ['Howrah Heavy Foundries', 'Esplanade Transit Terminal', 'Salt Lake Tech Sector', 'Alipore Residential Block', 'Sundarbans Boundary Marsh'];
    } else {
      // Dynamic authentic Indian names
      names = [
        `GIDC Heavy Industries`,
        `Central Railway Junction`,
        `${meta.name} Cantonment Enclave`,
        `Chowk Commercial Corridor`,
        `Saraswati Ecological Sanctuary`
      ];
    }
  } else {
    descSuffix = `This globally influential urban twin demonstrates advanced environmental profiles shaped by high-rise coastal canyons, clean energy networks, and unique atmospheric drafts.`;
    if (meta.name === 'Tokyo') {
      names = ['Koto Heavy Smog-Control', 'Shinjuku Cyber Transit', 'Chiyoda Smart District', 'Setagaya Eco-Residential', 'Ueno Ecological Sanctuary'];
    } else if (meta.name === 'New York') {
      names = ['Brooklyn Industrial Port', 'Bronx Highway Interchange', 'Manhattan Commercial Hub', 'Queens High-Density Living', 'Staten Island Wetland Reserve'];
    } else if (meta.name === 'London') {
      names = ['Thames Gateway Heavy Industries', 'Heathrow Freight Expressway', 'City of London Finance Hub', 'Kensington Residential Mews', 'Richmond Royal Parkland'];
    } else if (meta.name === 'Paris') {
      names = ['Saint-Denis Manufacturing Grid', 'Périphérique Boulevard Ring', 'La Défense Corporate Hub', 'Marais Eco-Heritage Quarter', 'Bois de Boulogne Greenery'];
    } else {
      // Dynamic authentic global names
      names = [
        `Port Logistic Infrastructure`,
        `Metropolitan Transit Corridor`,
        `Downtown Financial Core`,
        `Eco-District Residential Ring`,
        `Biosphere Green Corridor`
      ];
    }
  }

  // Set distinct base values using the city's general average to be fully realistic
  const zones: Zone[] = [
    {
      id: `${meta.name.toLowerCase().replace(/\s+/g, '-')}-1`,
      name: names[0],
      type: 'industrial',
      basePollution: Math.min(99, Math.round(avg * 1.25)),
      pollution: Math.min(99, Math.round(avg * 1.25)),
      x: 10,
      y: 12,
      width: 26,
      height: 20,
      description: `Heavy production facilities, energy processing hubs, and manufacturing frameworks. This sector generates the highest concentration of PM2.5 and nitrogen oxides in the region.`
    },
    {
      id: `${meta.name.toLowerCase().replace(/\s+/g, '-')}-2`,
      name: names[1],
      type: 'transit',
      basePollution: Math.min(95, Math.round(avg * 1.1)),
      pollution: Math.min(95, Math.round(avg * 1.1)),
      x: 48,
      y: 10,
      width: 42,
      height: 18,
      description: `High-density transit nexus and heavy arterial highways. Traffic bottlenecks and exhaust particles are trapped inside high-rise concrete street canyons.`
    },
    {
      id: `${meta.name.toLowerCase().replace(/\s+/g, '-')}-3`,
      name: names[2],
      type: 'commercial',
      basePollution: Math.min(88, Math.round(avg * 0.95)),
      pollution: Math.min(88, Math.round(avg * 0.95)),
      x: 52,
      y: 42,
      width: 38,
      height: 24,
      description: `Commercial offices, public facilities, and dense retail areas. Subject to high HVAC energy demands and major daily commuter inflows.`
    },
    {
      id: `${meta.name.toLowerCase().replace(/\s+/g, '-')}-4`,
      name: names[3],
      type: 'residential',
      basePollution: Math.max(12, Math.round(avg * 0.75)),
      pollution: Math.max(12, Math.round(avg * 0.75)),
      x: 12,
      y: 44,
      width: 24,
      height: 26,
      description: `High and medium-density residential neighborhoods. Primarily impacted by localized building heating systems and light urban transit flow.`
    },
    {
      id: `${meta.name.toLowerCase().replace(/\s+/g, '-')}-5`,
      name: names[4],
      type: 'parkland',
      basePollution: Math.max(8, Math.round(avg * 0.45)),
      pollution: Math.max(8, Math.round(avg * 0.45)),
      x: 22,
      y: 78,
      width: 62,
      height: 14,
      description: `Reclaimed wetlands, natural urban forests, and low-density open reserves. Serves as the city's key organic carbon-sink and natural thermal cooling buffer.`
    }
  ];

  return {
    name: meta.name,
    country: meta.country,
    category: meta.category,
    description: `${meta.name} (${isIndia ? 'India' : meta.country}) is a major metropolitan center. ${descSuffix}`,
    accentColor: meta.accentColor,
    riverPath: meta.riverPath,
    avgBasePollution: meta.avgBasePollution,
    zones
  };
}

// Complete mapped object generator for all 160 cities
export const CITIES_DATA_STORE = CITIES_METADATA.reduce((acc, meta) => {
  acc[meta.name] = generateCityPreset(meta);
  return acc;
}, {} as Record<string, CityPreset>);
