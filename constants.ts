
export interface CityData {
  id: string;
  name: string;
  country: string;
  pollution: number; // 0-100 (lower is better)
  greenCoverage: number; // 0-100
  renewableEnergy: number; // 0-100
  policyScore: number; // 0-100
  lat: number; // SVG coordinates 0-100
  lng: number; // SVG coordinates 0-100
}

export const CITIES: CityData[] = [
  { id: 'c1', name: 'Singapore', country: 'Singapore', pollution: 12, greenCoverage: 94, renewableEnergy: 18, policyScore: 92, lat: 65, lng: 80 },
  { id: 'c2', name: 'New York', country: 'USA', pollution: 14, greenCoverage: 48, renewableEnergy: 28, policyScore: 72, lat: 40, lng: 25 },
  { id: 'c3', name: 'New Delhi', country: 'India', pollution: 73, greenCoverage: 18, renewableEnergy: 16, policyScore: 52, lat: 50, lng: 72 },
  { id: 'c4', name: 'Gurugram', country: 'India', pollution: 65, greenCoverage: 14, renewableEnergy: 11, policyScore: 58, lat: 51, lng: 71 },
  { id: 'c5', name: 'Noida', country: 'India', pollution: 68, greenCoverage: 19, renewableEnergy: 13, policyScore: 56, lat: 51, lng: 72 },
  { id: 'c6', name: 'Faridabad', country: 'India', pollution: 66, greenCoverage: 11, renewableEnergy: 9, policyScore: 48, lat: 52, lng: 72 },
  { id: 'c7', name: 'Patna', country: 'India', pollution: 62, greenCoverage: 9, renewableEnergy: 6, policyScore: 42, lat: 52, lng: 75 },
  { id: 'c8', name: 'Lucknow', country: 'India', pollution: 48, greenCoverage: 26, renewableEnergy: 12, policyScore: 55, lat: 52, lng: 73 },
  { id: 'c9', name: 'Ghaziabad', country: 'India', pollution: 70, greenCoverage: 16, renewableEnergy: 11, policyScore: 50, lat: 51, lng: 72 },
  { id: 'c10', name: 'Chandigarh', country: 'India', pollution: 23, greenCoverage: 82, renewableEnergy: 38, policyScore: 88, lat: 47, lng: 71 },
  { id: 'c11', name: 'Bhiwadi', country: 'India', pollution: 75, greenCoverage: 7, renewableEnergy: 4, policyScore: 38, lat: 51, lng: 70 },
  { id: 'c12', name: 'Bhutan', country: 'Bhutan', pollution: 8, greenCoverage: 97, renewableEnergy: 99, policyScore: 95, lat: 52, lng: 77 },
  { id: 'c13', name: 'HongKong', country: 'China', pollution: 19, greenCoverage: 42, renewableEnergy: 12, policyScore: 78, lat: 58, lng: 82 },
  { id: 'c14', name: 'Beijing', country: 'China', pollution: 33, greenCoverage: 28, renewableEnergy: 22, policyScore: 82, lat: 42, lng: 82 },
  { id: 'c15', name: 'Moscow', country: 'Russia', pollution: 15, greenCoverage: 52, renewableEnergy: 17, policyScore: 62, lat: 25, lng: 55 },
  { id: 'c16', name: 'Seoul', country: 'South Korea', pollution: 21, greenCoverage: 38, renewableEnergy: 23, policyScore: 85, lat: 45, lng: 85 },
  { id: 'c17', name: 'Paris', country: 'France', pollution: 14, greenCoverage: 43, renewableEnergy: 32, policyScore: 92, lat: 32, lng: 49 },
  { id: 'c18', name: 'Tokyo', country: 'Japan', pollution: 11, greenCoverage: 32, renewableEnergy: 27, policyScore: 94, lat: 48, lng: 88 },
  { id: 'c19', name: 'California', country: 'USA', pollution: 15, greenCoverage: 68, renewableEnergy: 78, policyScore: 97, lat: 42, lng: 12 },
  { id: 'c20', name: 'Seattle', country: 'USA', pollution: 9, greenCoverage: 75, renewableEnergy: 91, policyScore: 95, lat: 35, lng: 15 },
  { id: 'c21', name: 'Indore', country: 'India', pollution: 25, greenCoverage: 41, renewableEnergy: 36, policyScore: 77, lat: 55, lng: 70 },
  { id: 'c22', name: 'Vijaywada', country: 'India', pollution: 24, greenCoverage: 36, renewableEnergy: 31, policyScore: 67, lat: 58, lng: 73 },
  { id: 'c23', name: 'Chennai', country: 'India', pollution: 31, greenCoverage: 37, renewableEnergy: 42, policyScore: 75, lat: 62, lng: 73 },
  { id: 'c24', name: 'Mumbai', country: 'India', pollution: 49, greenCoverage: 26, renewableEnergy: 22, policyScore: 70, lat: 58, lng: 69 },
  { id: 'c25', name: 'Nagpur', country: 'India', pollution: 25, greenCoverage: 47, renewableEnergy: 32, policyScore: 73, lat: 56, lng: 72 },
  { id: 'c26', name: 'Hyderabad', country: 'India', pollution: 29, greenCoverage: 32, renewableEnergy: 27, policyScore: 72, lat: 57, lng: 72 },
  { id: 'c27', name: 'Pune', country: 'India', pollution: 26, greenCoverage: 36, renewableEnergy: 29, policyScore: 74, lat: 58, lng: 70 },
  { id: 'c28', name: 'Dehradun', country: 'India', pollution: 22, greenCoverage: 78, renewableEnergy: 47, policyScore: 75, lat: 49, lng: 72 },
  { id: 'c29', name: 'Jammu', country: 'India', pollution: 24, greenCoverage: 67, renewableEnergy: 52, policyScore: 62, lat: 46, lng: 70 },
  { id: 'c30', name: 'Rohtak', country: 'India', pollution: 47, greenCoverage: 22, renewableEnergy: 17, policyScore: 58, lat: 50, lng: 71 },
  { id: 'c31', name: 'Kashmir', country: 'India', pollution: 11, greenCoverage: 88, renewableEnergy: 62, policyScore: 68, lat: 45, lng: 71 },
  { id: 'c32', name: 'Shimla', country: 'India', pollution: 9, greenCoverage: 93, renewableEnergy: 63, policyScore: 78, lat: 47, lng: 72 },
  { id: 'c33', name: 'Jalandhar', country: 'India', pollution: 39, greenCoverage: 24, renewableEnergy: 14, policyScore: 57, lat: 48, lng: 70 },
  { id: 'c34', name: 'Guwahati', country: 'India', pollution: 38, greenCoverage: 72, renewableEnergy: 27, policyScore: 68, lat: 52, lng: 78 },
  { id: 'c35', name: 'Dhaka', country: 'Bangladesh', pollution: 55, greenCoverage: 14, renewableEnergy: 11, policyScore: 52, lat: 55, lng: 78 },
  { id: 'c36', name: 'Kathmandu', country: 'Nepal', pollution: 37, greenCoverage: 42, renewableEnergy: 32, policyScore: 58, lat: 52, lng: 76 },
  { id: 'c37', name: 'Gangtok', country: 'India', pollution: 9, greenCoverage: 94, renewableEnergy: 87, policyScore: 82, lat: 52, lng: 77 },
  { id: 'c38', name: 'Lahore', country: 'Pakistan', pollution: 82, greenCoverage: 11, renewableEnergy: 7, policyScore: 42, lat: 50, lng: 69 },
  { id: 'c39', name: 'Gandhinagar', country: 'India', pollution: 19, greenCoverage: 87, renewableEnergy: 52, policyScore: 90, lat: 55, lng: 68 },
  { id: 'c40', name: 'Pondicherry', country: 'India', pollution: 14, greenCoverage: 52, renewableEnergy: 42, policyScore: 78, lat: 63, lng: 73 },
  { id: 'c41', name: 'Udupi', country: 'India', pollution: 13, greenCoverage: 72, renewableEnergy: 47, policyScore: 80, lat: 61, lng: 70 },
  { id: 'c42', name: 'Shillong', country: 'India', pollution: 11, greenCoverage: 90, renewableEnergy: 57, policyScore: 75, lat: 53, lng: 79 },
  { id: 'c43', name: 'Siliguri', country: 'India', pollution: 24, greenCoverage: 62, renewableEnergy: 22, policyScore: 65, lat: 52, lng: 77 },
  { id: 'c44', name: 'Kabul', country: 'Afghanistan', pollution: 58, greenCoverage: 8, renewableEnergy: 4, policyScore: 28, lat: 48, lng: 65 },
  { id: 'c45', name: 'Karachi', country: 'Pakistan', pollution: 52, greenCoverage: 16, renewableEnergy: 13, policyScore: 50, lat: 55, lng: 65 },
  { id: 'c46', name: 'Wellington', country: 'New Zealand', pollution: 6, greenCoverage: 87, renewableEnergy: 97, policyScore: 99, lat: 85, lng: 95 },
  { id: 'c47', name: 'Amsterdam', country: 'Netherlands', pollution: 11, greenCoverage: 57, renewableEnergy: 72, policyScore: 94, lat: 31, lng: 47 },
  { id: 'c48', name: 'Auckland', country: 'New Zealand', pollution: 7, greenCoverage: 82, renewableEnergy: 92, policyScore: 97, lat: 82, lng: 94 },
  { id: 'c49', name: 'Adelaide', country: 'Australia', pollution: 8, greenCoverage: 67, renewableEnergy: 87, policyScore: 95, lat: 80, lng: 85 },
  { id: 'c50', name: 'Bangalore', country: 'India', pollution: 28, greenCoverage: 46, renewableEnergy: 31, policyScore: 80, lat: 61, lng: 72 },
  { id: 'c51', name: 'Mysuru', country: 'India', pollution: 15, greenCoverage: 77, renewableEnergy: 42, policyScore: 84, lat: 63, lng: 72 },
  { id: 'c52', name: 'Amravati', country: 'India', pollution: 23, greenCoverage: 57, renewableEnergy: 37, policyScore: 72, lat: 57, lng: 72 },
  { id: 'c53', name: 'Bhubaneshwar', country: 'India', pollution: 27, greenCoverage: 62, renewableEnergy: 27, policyScore: 74, lat: 57, lng: 75 },
  { id: 'c54', name: 'Ranchi', country: 'India', pollution: 31, greenCoverage: 52, renewableEnergy: 22, policyScore: 67, lat: 54, lng: 74 },
  { id: 'c55', name: 'Raipur', country: 'India', pollution: 39, greenCoverage: 47, renewableEnergy: 17, policyScore: 64, lat: 56, lng: 74 },
  { id: 'c56', name: 'Greater Noida', country: 'India', pollution: 65, greenCoverage: 23, renewableEnergy: 16, policyScore: 63, lat: 51, lng: 72 },
  { id: 'c57', name: 'Hutan', country: 'China', pollution: 45, greenCoverage: 27, renewableEnergy: 11, policyScore: 57, lat: 45, lng: 80 },
  { id: 'c58', name: 'Oslo', country: 'Norway', pollution: 7, greenCoverage: 87, renewableEnergy: 97, policyScore: 99, lat: 20, lng: 50 },
  { id: 'c59', name: 'Zurich', country: 'Switzerland', pollution: 7, greenCoverage: 77, renewableEnergy: 82, policyScore: 96, lat: 30, lng: 50 },
  { id: 'c60', name: 'Stockholm', country: 'Sweden', pollution: 6, greenCoverage: 82, renewableEnergy: 94, policyScore: 97, lat: 18, lng: 52 },
  { id: 'c61', name: 'Copenhagen', country: 'Denmark', pollution: 7, greenCoverage: 80, renewableEnergy: 92, policyScore: 98, lat: 25, lng: 48 },
  // Newly requested global & domestic cities
  { id: 'c62', name: 'Jind', country: 'India', pollution: 55, greenCoverage: 16, renewableEnergy: 10, policyScore: 52, lat: 49, lng: 71 },
  { id: 'c63', name: 'Ambala', country: 'India', pollution: 38, greenCoverage: 21, renewableEnergy: 12, policyScore: 55, lat: 48, lng: 71 },
  { id: 'c64', name: 'Hissar', country: 'India', pollution: 48, greenCoverage: 15, renewableEnergy: 14, policyScore: 52, lat: 49, lng: 70 },
  { id: 'c65', name: 'Sirsa', country: 'India', pollution: 37, greenCoverage: 18, renewableEnergy: 19, policyScore: 53, lat: 49, lng: 69 },
  { id: 'c66', name: 'Ladwa', country: 'India', pollution: 33, greenCoverage: 23, renewableEnergy: 11, policyScore: 50, lat: 48, lng: 72 },
  { id: 'c67', name: 'Kurukshetra', country: 'India', pollution: 38, greenCoverage: 25, renewableEnergy: 13, policyScore: 56, lat: 48, lng: 72 },
  { id: 'c68', name: 'Naraingarh', country: 'India', pollution: 28, greenCoverage: 31, renewableEnergy: 15, policyScore: 54, lat: 47, lng: 72 },
  { id: 'c69', name: 'Bhiwani', country: 'India', pollution: 52, greenCoverage: 12, renewableEnergy: 9, policyScore: 50, lat: 50, lng: 70 },
  { id: 'c70', name: 'Goa', country: 'India', pollution: 15, greenCoverage: 78, renewableEnergy: 45, policyScore: 82, lat: 63, lng: 69 },
  { id: 'c71', name: 'Daman', country: 'India', pollution: 27, greenCoverage: 34, renewableEnergy: 21, policyScore: 60, lat: 58, lng: 68 },
  { id: 'c72', name: 'Diu', country: 'India', pollution: 21, greenCoverage: 41, renewableEnergy: 33, policyScore: 64, lat: 57, lng: 67 },
  { id: 'c73', name: 'Srinagar', country: 'India', pollution: 14, greenCoverage: 82, renewableEnergy: 54, policyScore: 72, lat: 44, lng: 70 },
  { id: 'c74', name: 'Delhi', country: 'India', pollution: 73, greenCoverage: 21, renewableEnergy: 18, policyScore: 56, lat: 50, lng: 71 },
  { id: 'c75', name: 'Kharagpur', country: 'India', pollution: 33, greenCoverage: 39, renewableEnergy: 22, policyScore: 62, lat: 55, lng: 76 },
  { id: 'c76', name: 'Sydney', country: 'Australia', pollution: 8, greenCoverage: 69, renewableEnergy: 76, policyScore: 91, lat: 82, lng: 88 },
  { id: 'c77', name: 'Melbourne', country: 'Australia', pollution: 7, greenCoverage: 72, renewableEnergy: 81, policyScore: 93, lat: 84, lng: 87 },
  { id: 'c78', name: 'London', country: 'UK', pollution: 11, greenCoverage: 55, renewableEnergy: 59, policyScore: 88, lat: 28, lng: 44 },
  { id: 'c79', name: 'France', country: 'France', pollution: 13, greenCoverage: 64, renewableEnergy: 68, policyScore: 90, lat: 33, lng: 48 },
  { id: 'c80', name: 'Berlin', country: 'Germany', pollution: 10, greenCoverage: 61, renewableEnergy: 72, policyScore: 91, lat: 26, lng: 51 },
  { id: 'c81', name: 'Toronto', country: 'Canada', pollution: 8, greenCoverage: 68, renewableEnergy: 74, policyScore: 89, lat: 38, lng: 28 },
  { id: 'c82', name: 'Guntur', country: 'India', pollution: 31, greenCoverage: 29, renewableEnergy: 24, policyScore: 65, lat: 58, lng: 73 },
  { id: 'c83', name: 'Mangalagiri', country: 'India', pollution: 27, greenCoverage: 34, renewableEnergy: 28, policyScore: 67, lat: 58, lng: 73 },
  { id: 'c84', name: 'Ongole', country: 'India', pollution: 24, greenCoverage: 38, renewableEnergy: 32, policyScore: 68, lat: 59, lng: 72 },
  { id: 'c85', name: 'Nellore', country: 'India', pollution: 23, greenCoverage: 41, renewableEnergy: 36, policyScore: 70, lat: 60, lng: 72 },
  { id: 'c86', name: 'Vellore', country: 'India', pollution: 28, greenCoverage: 35, renewableEnergy: 28, policyScore: 72, lat: 62, lng: 72 },
  { id: 'c87', name: 'Madras', country: 'India', pollution: 31, greenCoverage: 36, renewableEnergy: 41, policyScore: 74, lat: 62, lng: 73 },
  { id: 'c88', name: 'Trichy', country: 'India', pollution: 24, greenCoverage: 43, renewableEnergy: 37, policyScore: 73, lat: 63, lng: 72 },
  { id: 'c89', name: 'Surathkal', country: 'India', pollution: 17, greenCoverage: 68, renewableEnergy: 49, policyScore: 79, lat: 61, lng: 70 },
  { id: 'c90', name: 'Rourkela', country: 'India', pollution: 42, greenCoverage: 44, renewableEnergy: 21, policyScore: 60, lat: 55, lng: 74 },
  { id: 'c91', name: 'Jaipur', country: 'India', pollution: 37, greenCoverage: 29, renewableEnergy: 38, policyScore: 74, lat: 52, lng: 69 },
  { id: 'c92', name: 'Salasar', country: 'India', pollution: 26, greenCoverage: 34, renewableEnergy: 45, policyScore: 70, lat: 51, lng: 68 },
  { id: 'c93', name: 'Cambridge', country: 'UK', pollution: 7, greenCoverage: 79, renewableEnergy: 83, policyScore: 94, lat: 27, lng: 45 },
  { id: 'c94', name: 'WashingtonDC', country: 'USA', pollution: 11, greenCoverage: 58, renewableEnergy: 49, policyScore: 85, lat: 41, lng: 26 },
  { id: 'c95', name: 'Cuba', country: 'Cuba', pollution: 15, greenCoverage: 72, renewableEnergy: 51, policyScore: 76, lat: 48, lng: 24 },
  { id: 'c96', name: 'Ireland', country: 'Ireland', pollution: 6, greenCoverage: 84, renewableEnergy: 89, policyScore: 96, lat: 25, lng: 40 },
  { id: 'c97', name: 'Ukraine', country: 'Ukraine', pollution: 19, greenCoverage: 49, renewableEnergy: 34, policyScore: 65, lat: 28, lng: 56 },
  { id: 'c98', name: 'Iran', country: 'Iran', pollution: 39, greenCoverage: 22, renewableEnergy: 15, policyScore: 48, lat: 42, lng: 61 },
  { id: 'c99', name: 'Iraq', country: 'Iraq', pollution: 48, greenCoverage: 14, renewableEnergy: 9, policyScore: 41, lat: 41, lng: 59 },
  { id: 'c100', name: 'Russia', country: 'Russia', pollution: 14, greenCoverage: 55, renewableEnergy: 20, policyScore: 60, lat: 24, lng: 57 },
  { id: 'c101', name: 'Indonesia', country: 'Indonesia', pollution: 37, greenCoverage: 64, renewableEnergy: 32, policyScore: 68, lat: 68, lng: 82 },
  { id: 'c102', name: 'Jamaica', country: 'Jamaica', pollution: 13, greenCoverage: 74, renewableEnergy: 48, policyScore: 78, lat: 50, lng: 23 },
  { id: 'c103', name: 'Nigeria', country: 'Nigeria', pollution: 45, greenCoverage: 38, renewableEnergy: 21, policyScore: 52, lat: 54, lng: 46 },
  { id: 'c104', name: 'SouthAfrica', country: 'South Africa', pollution: 24, greenCoverage: 41, renewableEnergy: 39, policyScore: 73, lat: 76, lng: 50 },
  { id: 'c105', name: 'Italy', country: 'Italy', pollution: 17, greenCoverage: 52, renewableEnergy: 59, policyScore: 86, lat: 35, lng: 50 },
  { id: 'c106', name: 'Brazil', country: 'Brazil', pollution: 16, greenCoverage: 78, renewableEnergy: 84, policyScore: 85, lat: 62, lng: 32 },
  { id: 'c107', name: 'NewZealand', country: 'New Zealand', pollution: 5, greenCoverage: 86, renewableEnergy: 95, policyScore: 98, lat: 84, lng: 94 },
  { id: 'c108', name: 'Dharampur', country: 'India', pollution: 18, greenCoverage: 81, renewableEnergy: 48, policyScore: 76, lat: 48, lng: 72 },
  { id: 'c109', name: 'Ladakh', country: 'India', pollution: 8, greenCoverage: 24, renewableEnergy: 92, policyScore: 85, lat: 44, lng: 73 },
  { id: 'c110', name: 'Leh', country: 'India', pollution: 9, greenCoverage: 21, renewableEnergy: 90, policyScore: 84, lat: 44, lng: 73 },
  { id: 'c111', name: 'Yamunanagar', country: 'India', pollution: 47, greenCoverage: 23, renewableEnergy: 16, policyScore: 58, lat: 48, lng: 72 },
  { id: 'c112', name: 'Hansi', country: 'India', pollution: 42, greenCoverage: 18, renewableEnergy: 12, policyScore: 54, lat: 49, lng: 71 },
  { id: 'c113', name: 'Vishakhapatnam', country: 'India', pollution: 27, greenCoverage: 46, renewableEnergy: 31, policyScore: 72, lat: 58, lng: 74 },
  { id: 'c114', name: 'Coimbatore', country: 'India', pollution: 19, greenCoverage: 53, renewableEnergy: 62, policyScore: 84, lat: 62, lng: 71 },
  { id: 'c115', name: 'Ooty', country: 'India', pollution: 7, greenCoverage: 89, renewableEnergy: 54, policyScore: 81, lat: 62, lng: 71 },
  { id: 'c116', name: 'Munnar', country: 'India', pollution: 6, greenCoverage: 92, renewableEnergy: 58, policyScore: 83, lat: 63, lng: 71 },
  { id: 'c117', name: 'Meghalaya', country: 'India', pollution: 8, greenCoverage: 94, renewableEnergy: 68, policyScore: 79, lat: 53, lng: 79 },
  { id: 'c118', name: 'Mawsynram', country: 'India', pollution: 5, greenCoverage: 98, renewableEnergy: 72, policyScore: 82, lat: 53, lng: 79 },
  { id: 'c119', name: 'Nagaland', country: 'India', pollution: 9, greenCoverage: 91, renewableEnergy: 54, policyScore: 76, lat: 53, lng: 80 },
  { id: 'c120', name: 'Kohinoor', country: 'India', pollution: 12, greenCoverage: 85, renewableEnergy: 49, policyScore: 73, lat: 53, lng: 80 },
  { id: 'c121', name: 'Agartala', country: 'India', pollution: 23, greenCoverage: 68, renewableEnergy: 29, policyScore: 70, lat: 54, lng: 78 },
  { id: 'c122', name: 'Aizawl', country: 'India', pollution: 9, greenCoverage: 88, renewableEnergy: 41, policyScore: 72, lat: 54, lng: 79 },
  { id: 'c123', name: 'Silchar', country: 'India', pollution: 19, greenCoverage: 71, renewableEnergy: 25, policyScore: 68, lat: 53, lng: 78 },
  { id: 'c124', name: 'Nepal', country: 'Nepal', pollution: 28, greenCoverage: 49, renewableEnergy: 44, policyScore: 61, lat: 51, lng: 75 },
  { id: 'c125', name: 'Bhilai', country: 'India', pollution: 37, greenCoverage: 34, renewableEnergy: 20, policyScore: 62, lat: 56, lng: 73 },
  { id: 'c126', name: 'Banglore', country: 'India', pollution: 28, greenCoverage: 46, renewableEnergy: 31, policyScore: 80, lat: 61, lng: 72 },
];

export const CUSTOM_CITY_SECTORS: Record<string, string[]> = {
  'New Delhi': [
    'Anand Vihar', 'Okhla Phase 3', 'Punjabi Bagh', 'Dwarka Sector 8',
    'Wazirpur Cluster', 'Connaught Place', 'RK Puram', 'Mandir Marg',
    'Shadipur', 'Narela Industrial', 'Siri Fort', 'IGI Airport T3',
    'Lodhi Road', 'Jahangirpuri', 'Bawana Sector 4', 'ITO Intersection'
  ],
  'Mumbai': [
    'Dharavi Recyclers', 'BKC Sector 4', 'Colaba Port Line', 'Wadala Terminal',
    'Chembur Refinery', 'Andheri East Hub', 'Borivali National', 'Worli Sea-Face',
    'Bandra West Kurla', 'Kurla Junction', 'Juhu Residential', 'Powai Lake Grid',
    'Mulund West Gate', 'Ghatkopar Belt', 'Vashi Creek', 'Thane Highway Grid'
  ],
  'Bengaluru': [
    'Whitefield Corridor', 'Peenya Smelters', 'Electronic City', 'Koramangala Ring',
    'Indiranagar 100ft', 'Outer Ring Road', 'Silk Board Cross', 'Hebbal Flyover',
    'Majestic Terminal', 'Jayanagar Park Grid', 'Yelahanka Satellite', 'HSR Layout Sector 1',
    'Banashankari Grid', 'Yeshwanthpur Yards', 'Marathahalli Spine', 'Bellandur Silt'
  ],
  'Banglore': [
    'Whitefield Corridor', 'Peenya Smelters', 'Electronic City', 'Koramangala Ring',
    'Indiranagar 100ft', 'Outer Ring Road', 'Silk Board Cross', 'Hebbal Flyover',
    'Majestic Terminal', 'Jayanagar Park Grid', 'Yelahanka Satellite', 'HSR Layout Sector 1',
    'Banashankari Grid', 'Yeshwanthpur Yards', 'Marathahalli Spine', 'Bellandur Silt'
  ],
  'Kolkata': [
    'Howrah Foundry Zone', 'Topsia Tannery Grid', 'Rajarhat Builders', 'Salt Lake Sector V',
    'New Town Sector 1', 'Park Street Dining', 'Ballygunge Estate', 'Victoria Monument',
    'Shyambazar Market', 'Behala Air strip', 'Jadavpur Science Grid', 'Alipore Estates',
    'Garia Southern Grid', 'Cossipore Gun shells', 'Dum Dum Airport', 'Bagbazaar Ghats'
  ],
  'Chennai': [
    'Ennore Power Stack C', 'Ambattur Casting', 'Manali Pipe 8', 'T-Nagar Bazaar',
    'Adyar Canopy Grid', 'Mylapore Temple Ring', 'Velachery Silt basin', 'Guindy Industrial',
    'Royapettah Spine', 'Anna Nagar West', 'Sholinganallur IT', 'Tambaram Junction',
    'Egmore Train Grid', 'Perambur Loco Works', 'Chromepet Tanneries', 'Saidapet River bank'
  ],
  'Madras': [
    'Ennore Power Stack C', 'Ambattur Casting', 'Manali Pipe 8', 'T-Nagar Bazaar',
    'Adyar Canopy Grid', 'Mylapore Temple Ring', 'Velachery Silt basin', 'Guindy Industrial',
    'Royapettah Spine', 'Anna Nagar West', 'Sholinganallur IT', 'Tambaram Junction',
    'Egmore Train Grid', 'Perambur Loco Works', 'Chromepet Tanneries', 'Saidapet River bank'
  ],
  'Gurugram': [
    'Cyber City Phase 2', 'Sector 29 Sector Hub', 'Golf Course Road Link', 'Sohna Road Commercial',
    'Sector 56 Metro Station', 'Udyog Vihar Phase V', 'DLF Phase 3 Corridor', 'MG Road Transit',
    'Sector 14 Residential', 'Sector 45 Extension', 'Ardee City Residences', 'Palam Vihar Grid',
    'Badshahpur Crossing', 'Sector 44 Tech Zone', 'Rajiv Chowk Junction', 'Manesar Highway Terminal'
  ],
  'Noida': [
    'Sector 62 IT Block', 'Sector 18 Commercial Hub', 'Sector 15 Residential', 'Sector 128 Expressway',
    'Greater Noida Link Road', 'Sector 50 Green Belt', 'Sector 137 Apartments', 'Sector 93 High-rise',
    'Sector 110 Commercial', 'Sector 76 Residential', 'Film City Studios', 'Sector 63 Industrial Zone',
    'Noida Expressway Junction', 'Sector 12 Residential Area', 'Sector 22 Market', 'Sector 143 Tech Park'
  ],
  'Chandigarh': [
    'Sector 17 Plaza', 'Sector 22 Market Zone', 'Sector 35 Dining Corridor', 'Sukhna Lake Green Belt',
    'Sector 9 Administrative Block', 'Sector 43 Bus Terminal', 'Sector 8 Residential', 'Sector 15 University Area',
    'Rock Garden Entrance', 'Sector 26 Industrial Phase 1', 'Sector 34 Exhibition Ground', 'Sector 21 Residences',
    'Sector 47 Residential', 'Sector 11 Hospital Area', 'Industrial Area Phase 2', 'Sector 19 Shopping Zone'
  ],
  'Hyderabad': [
    'HITEC City Cyber Towers', 'Gachibowli IT Corridor', 'Madhapur Tech Park', 'Jubilee Hills Ridge',
    'Banjara Hills Block 3', 'Begumpet Airport Zone', 'Secunderabad Junction', 'Charminar Heritage Area',
    'Kukatpally Residential', 'Ameerpet Learning Hub', 'Mehdipatnam Transit', 'Nampally Station Road',
    'Koti Commercial Market', 'Dilsukhnagar Junction', 'Miyapur Metro Station', 'Kondapur Tech Corridor'
  ],
  'Jaipur': [
    'Johari Bazaar Pink City', 'C-Scheme Business Hub', 'Malviya Nagar Commercial', 'Mansarovar Housing Board',
    'Vaishali Nagar Residences', 'Raja Park Dining Avenue', 'Sindhi Camp Bus Terminal', 'Amer Road Heritage Area',
    'Sanganer Industrial Cluster', 'Sitapura SEZ Industrial', 'Civil Lines VIP Zone', 'Gopalpura Bypass Crossing',
    'Jagatpura Railway Link', 'Bani Park Residential', 'Shastri Nagar Grid', 'Hawa Mahal Traffic Junction'
  ],
  'London': [
    'Westminster Palace Zone', 'Kensington Gardens', 'Chelsea Royal Hospital', 'Soho Entertainment Grid',
    'City of London Financial', 'Canary Wharf Business', 'Greenwich Observatory Line', 'Camden Town Lock',
    'Paddington Transit Station', 'Shoreditch High Street', 'Brixton Electric Avenue', 'Wembley Stadium Precinct',
    'Stratford Olympic Park', 'Richmond Green Reserve', 'Hyde Park Corner', 'Heathrow Airport Terminal 4'
  ],
  'New York': [
    'Manhattan Midtown Corridor', 'Brooklyn Heights Promenades', 'Queens Astoria residential', 'The Bronx Zoo Corridor',
    'Staten Island Ferry Terminal', 'Harlem 125th Street', 'SoHo Fashion District', 'Chinatown Market Area',
    'Central Park Conservatories', 'Times Square Neon Grid', 'Financial District Wall Street', 'Williamsburg Waterfront',
    'Flushing Meadows Park', 'DUMBO Waterfront Block', 'Long Island City IT hub', 'Upper East Side Estates'
  ],
  'Singapore': [
    'Marina Bay Sands Plaza', 'Orchard Road Shopping', 'Changi Airport Jewel Grid', 'Sentosa Island Gateway',
    'Jurong East Industrial', 'Woodlands Checkpoint Border', 'Tampines Hub Commercial', 'Little India Heritage',
    'Chinatown Food Street', 'Bugis Junction Transit', 'Bedok Housing Estates', 'Yishun Ring Road',
    'Ang Mo Kio Town Centre', 'Punggol Waterway Canal', 'Clementi Residential', 'Tuas Mega Port Industrial'
  ],
  'Sydney': [
    'Sydney CBD Pitt Street', 'Darling Harbour Gateway', 'Bondi Beach Pavilion', 'Manly Ferry Wharf',
    'Newtown King Street', 'Surry Hills Creative Hub', 'Parramatta Business Park', 'Chatswood Shopping Center',
    'Paddington Markets', 'The Rocks Historic Quarter', 'Redfern Railway Junction', 'Coogee Coastal Walk',
    'Glebe Point Road', 'Mosman Bay Residences', 'Pyrmont Star Precinct', 'Kings Cross Station'
  ],
  'Paris': [
    'Champs-Élysées Avenue', 'Le Marais Historic Block', 'Montmartre Sacré-Cœur', 'Latin Quarter University',
    'Eiffel Tower Champ de Mars', 'Bastille Traffic Circle', 'Saint-Germain Boulevard', 'Montparnasse Tower Zone',
    'Belleville Arts District', 'Pigalle Cabaret Strip', 'La Défense Corporate Hub', 'Canal Saint-Martin Locks',
    'Opéra Garnier District', 'Louvre Museum Plaza', 'Gare du Nord Freight Terminal', 'Père Lachaise Reserve'
  ],
  'Goa': [
    'Panaji City Center', 'Calangute Beach Strip', 'Baga Coastal Zone', 'Vasco da Gama Port',
    'Margao Market Junction', 'Candolim Beach Road', 'Mapusa Bazaar Area', 'Anjuna Flea Market',
    'Old Goa Church Complex', 'Ponda Industrial Area', 'Colva Coastal Grid', 'Porvorim Residential',
    'Dabolim Airport Link', 'Morjim Turtle Nesting', 'Mormugao Shipyard Area', 'Dona Paula Bay'
  ],
  'Jammu': [
    'Raghunath Temple Zone', 'Gandhi Nagar Market', 'Trikuta Nagar Residences', 'Bahu Fort Ridge',
    'Sidhra Transit bypass', 'Janipur Commercial', 'Channi Himmat Housing', 'Chowk Chabutra Market',
    'Sainik Colony Grid', 'Shastri Nagar Residential', 'Satwari Chowk Terminal', 'Canal Road Corridor',
    'Paloura Residential', 'Narwal Fruit Mandi', 'Talab Tillo Crossing', 'Kunjwani Highway Junction'
  ],
  'Kashmir': [
    'Dal Lake Boulevard', 'Lal Chowk Square', 'Shalimar Gardens Reserve', 'Nishat Bagh Foothills',
    'Hazratbal Mosque Zone', 'Sonwar Cantonment Area', 'Karan Nagar Commercial', 'Rajbagh Residential',
    'Zabarwan Range Green', 'Nowhatta Jamia Masjid', 'Gupkar Road Estates', 'Hyderpora Bypass Intersection',
    'Soura Medical Block', 'Barzulla Commercial Area', 'Srinagar Airport Corridor', 'Anantnag Town Gate'
  ],
  'Srinagar': [
    'Dal Lake Boulevard', 'Lal Chowk Square', 'Shalimar Gardens Reserve', 'Nishat Bagh Foothills',
    'Hazratbal Mosque Zone', 'Sonwar Cantonment Area', 'Karan Nagar Commercial', 'Rajbagh Residential',
    'Zabarwan Range Green', 'Nowhatta Jamia Masjid', 'Gupkar Road Estates', 'Hyderpora Bypass Intersection',
    'Soura Medical Block', 'Barzulla Commercial Area', 'Srinagar Airport Corridor', 'Bari Pora Colony'
  ],
  'Lucknow': [
    'Hazratganj Shopping Line', 'Aminabad Old Market', 'Gomti Nagar IT Park', 'Aliganj Residential Sector',
    'Indira Nagar Housing Block', 'Charbagh Railway Terminal', 'Chowk Chikankari Hub', 'Janki Puram Extension',
    'Mahanagar Commercial Circle', 'Gomti Riverfront Park', 'Amausi Airport Transit', 'Sanjay Gandhi PGIMS Grid',
    'Ashiyana Residential Area', 'Vikas Nagar Crossing', 'Chinhat Industrial Belt', 'Butler Palace VIP enclave'
  ],
  'Patna': [
    'Gandhi Maidan Area', 'Maurya Lok Shopping Complex', 'Boring Road Crossing', 'Kankarbagh Colony',
    'Patliputra Industrial Area', 'Bailey Road Corridor', 'Fraser Road Commercial', 'Rajendra Nagar Grid',
    'Danapur Cantonment', 'Phulwari Sharif Zone', 'Anisabad Residential', 'Patna Sahib Heritage',
    'Digha Ghat Riverfront', 'New Patliputra Colony', 'Ashiana Nagar', 'Shivala Road Crossing'
  ],
  'Dehradun': [
    'Rajpur Road Promenade', 'Paltan Bazaar Area', 'Clock Tower Square', 'Vasant Vihar Estates',
    'Dalanwala Residential', 'Clement Town Cantt', 'Sahastradhara Road Crossing', 'GMS Road Corridor',
    'Subhash Nagar Block', 'FRI Green Reserve', 'ISBT Terminal Corridor', 'Rishikesh Bypass Road',
    'Mussoorie Diversion Way', 'Jakhan High-rise Belt', 'Karanpur Market Area', 'Premnagar Tech Block'
  ],
  'Guwahati': [
    'Paltan Bazaar Hub', 'Ganeshguri Traffic Center', 'Guwahati University Camp', 'Fancy Bazaar Market',
    'Dispur Capital Complex', 'Khanapara Transit Gate', 'Kamakhya Temple Foothills', 'Uzanbazar Riverfront',
    'Beltola Residential', 'Sixmile Crossing Area', 'Narengi Industrial Siding', 'Panbazar Library Grid',
    'Borjhar Airport Corridor', 'Zoo Road Commercial', 'Chandmari Hillside', 'Adabari Bus Terminal'
  ],
  'Sihas': [
    'Sihas North Gate', 'Sihas Sector 4', 'Sihas Central Bazaar', 'Sihas Industrial Siding',
    'Sihas Green Valley', 'Sihas Town Center', 'Sihas South Crossing', 'Sihas Bypass Link',
    'Sihas West Ridge', 'Sihas East End', 'Sihas Civic Center', 'Sihas Extension Area',
    'Sihas Technical Block', 'Sihas High School Road', 'Sihas Railway Colony', 'Sihas Cargo Hub'
  ],
  'Naraingarh': [
    'Model Town', 'Saini Colony', 'Kila Area', 'Main Bazar', 'HUDA Sector 1',
    'New Grain Market', 'Bus Stand Area', 'Civil Hospital Road', 'Court Complex', 'Panjlasa Road',
    'Sadhaura Road', 'Raipur Rani Road', 'Aggarwal Colony', 'Police Station Road', 'Ward No. 5', 'Ward No. 12'
  ],
  'Ambala': [
    'Ambala Cantt', 'Ambala City', 'Sadar Bazar', 'Mahesh Nagar', 'Model Town',
    'Sector 9', 'Sector 7', 'Babyal', 'Cloth Market', 'Nicholson Road',
    'Vijay Nagar', 'Kacha Bazar', 'Police Lines', 'GT Road', 'Baldev Nagar', 'Jalbera Road'
  ],
  'Kurukshetra': [
    'Sector 3', 'Sector 5', 'Sector 7', 'Sector 8', 'Sector 13',
    'University Campus', 'Thanesar', 'Pipli Chowk', 'Birla Mandir Road', 'Jyotisar',
    'Mohan Nagar', 'Saini Colony', 'Kessel Mall Road', 'Jindal Park', 'Railway Road', 'DD Colony'
  ],
  'Ladwa': [
    'Indri Road', 'Babain Road', 'Main Bazar', 'Radha Swami Colony', 'Saini Colony',
    'New Grain Market', 'Aggarwal Colony', 'Ward No. 7', 'Ward No. 11', 'Bus Stand Road',
    'Kurukshetra Road', 'Sham Nagar', 'Model Town Ladwa', 'Bhadson Road', 'Mathana Road', 'Karamgarh Colony'
  ],
  'Jind': [
    'Urban Estate Sector 9', 'Patiala Chowk', 'Safidon Road', 'Gohana Road', 'Rani Talab',
    'Defence Colony', 'HUDA Sector 11', 'Scheme No. 19', 'Shiv Colony', 'Railway Junction Road',
    'Main Bazar', 'Vivek Nagar', 'Civil Lines', 'Rohtak Road Bypass', 'New Grain Market', 'DRDA Colony'
  ],
  'Hissar': [
    'Sector 13', 'Sector 14', 'Urban Estate', 'PLA Area', 'Model Town',
    'Auto Market', 'Red Square Market', 'Vidyut Nagar', 'Jindal Chowk', 'HAU Campus',
    'Civil Lines', 'Patel Nagar', 'Camp Chowk', 'Delhi Road', 'Tosham Road', 'Industrial Area'
  ],
  'Hisar': [
    'Sector 13', 'Sector 14', 'Urban Estate', 'PLA Area', 'Model Town',
    'Auto Market', 'Red Square Market', 'Vidyut Nagar', 'Jindal Chowk', 'HAU Campus',
    'Civil Lines', 'Patel Nagar', 'Camp Chowk', 'Delhi Road', 'Tosham Road', 'Industrial Area'
  ],
  'Sirsa': [
    'HUDA Sector 20', 'Begu Road', 'Barnala Road', 'Hisar Road', 'Rania Road',
    'Shiv Chowk', 'Sangwan Chowk', 'Model Town', 'Kirti Nagar', 'Janta Bhawan Road',
    'Court Complex', 'Nehru Park Area', 'Aggarwal Colony', 'Auto Market', 'Sanjay Nagar', 'Chhattargarh Patti'
  ],
  'Bhiwani': [
    'HUDA Sector 13', 'HUDA Sector 23', 'Devsar Chogath', 'Meham Road', 'Rohtak Gate',
    'Circular Road', 'Vikas Nagar', 'Hanuman Dhani', 'Saini Nagar', 'Birla Colony',
    'New Grain Market', 'Krishna Nagar', 'Clock Tower Area', 'Zoo Road', 'Halu Bazar', 'Naya Bazar'
  ],
  'Rohtak': [
    'Model Town', 'DLF Colony', 'Sector 1', 'Sector 2', 'Sector 3',
    'Sector 14', 'HUDA Complex', 'PGIMS Campus', 'Gohana Stand', 'Medical Mor',
    'Ashoka Chowk', 'Sonipat Road', 'Civil Lines', 'Sheila Bypass', 'Chhotu Ram Chowk', 'Power House Chowk'
  ],
  'Hansi': [
    'Asigarh Fort Area', 'Delhi Bypass Road', 'Jind Bypass', 'Model Town', 'Saini Mohalla',
    'Umra Gate', 'Barsi Gate', 'Krishna Nagar', 'New Grain Market', 'HUDA Sector 6',
    'Main Bazar', 'Tosham Road', 'Lal Sarak', 'Ram Nagar', 'Pala Ram Colony', 'Railway Station Road'
  ],
  'Yamunanagar': [
    'Model Town', 'Sector 17', 'Sector 18', 'Professor Colony', 'Gobind Puri',
    'Jagadhri', 'Yamuna Nagar Railway Station', 'Camp Area', 'Pyara Chowk', 'Nehru Park',
    'Sasauli', 'Industrial Area Phase 1', 'Radaur Road', 'New Hamida Colony', 'Gopal Nagar', 'Shanti Nagar'
  ],
  'Guntur': [
    'Broadipet', 'Arundelpet', 'Korrwapadu Road', 'Nagarjuna Nagar', 'Gorantla',
    'Nallapadu', 'Stambalagaruvu', 'Syamala Nagar', 'Lakshmipuram', 'Guntur Vari Thota',
    'Pattabhipuram', 'Inner Ring Road', 'Vidya Nagar', 'Amaravathi Road', 'NTR Marg', 'Chuttugunta'
  ],
  'Nellore': [
    'Harnathapuram', 'Dargamitta', 'Vedayapalem', 'Balaji Nagar', 'Pogathota',
    'Magunta Layout', 'Ramji Nagar', 'Nawabpet', 'Stonehousepet', 'AC Subba Reddy Stadium',
    'Nellore Bypass', 'Mypadu Road', 'Kovur Road', 'Mini Bypass Road', 'Ayyappa Temple Area', 'Childrens Park'
  ],
  'Vellore': [
    'Katpadi', 'Sathuvachari', 'Gandhi Nagar', 'VIT Campus Area', 'Bagayam',
    'Thottapalayam', 'Sainathapuram', 'Vellore Fort Area', 'Phase 1 HUDCO', 'Phase 2 HUDCO',
    'Shenbakkam', 'Konavattam', 'Allapuram', 'Thorapadi', 'Otteri', 'Chittoor Bus Stand'
  ],
  'Indore': [
    'Vijay Nagar', 'Palasia', 'Rajendra Nagar', 'Sukhliya', 'LIG Colony',
    'Bhawarkuan', 'Chappan Dukan Area', 'Sarafa Bazar', 'Anand Bazar', 'Manorama Ganj',
    'Khajrana', 'Mahalaxmi Nagar', 'Rajwada', 'Sanchanchal', 'Kanadia Road', 'AB Road'
  ],
  'Vijaywada': [
    'Benz Circle', 'Moghalrajpuram', 'Labbipet', 'Patamata', 'One Town',
    'Two Town', 'Governorpet', 'Gunadala', 'Bhavanipuram', 'Vidyadharapuram',
    'Satyanarayanapuram', 'Gundala hill', 'Suryaraopet', 'Srinagar Colony', 'Ajit Singh Nagar', 'Kanuru'
  ],
  'Vijayawada': [
    'Benz Circle', 'Moghalrajpuram', 'Labbipet', 'Patamata', 'One Town',
    'Two Town', 'Governorpet', 'Gunadala', 'Bhavanipuram', 'Vidyadharapuram',
    'Satyanarayanapuram', 'Gundala hill', 'Suryaraopet', 'Srinagar Colony', 'Ajit Singh Nagar', 'Kanuru'
  ],
  'Nagpur': [
    'Dharampeth', 'Sadat Bazar', 'Sitabuldi', 'Ramdaspeth', 'Manish Nagar',
    'Narendra Nagar', 'Pratap Nagar', 'Somalwada', 'Civil Lines', 'Mihan SEZ',
    'Kalamna Market', 'Trimurti Nagar', 'Wardhaman Nagar', 'Nari Road', 'Jaripatka', 'Kamptee Road'
  ],
  'Pune': [
    'Koregaon Park', 'Kalyani Nagar', 'Viman Nagar', 'Hinjewadi IT Phase 1', 'Hinjewadi IT Phase 2',
    'Kothrud', 'Baner', 'Aundh', 'Wakad', 'Hadapsar Magarpatta',
    'Shivajinagar', 'Swargate', 'Pimpri', 'Chinchwad', 'Katraj', 'Deccan Gymkhana'
  ],
  'Greater Noida': [
    'Alpha 1', 'Beta 2', 'Gamma 1', 'Delta 3', 'Omega 2',
    'Knowledge Park III', 'Techzone 4', 'CHI V Residences', 'PI I & II Blocks', 'Sigma II',
    'Surajpur Industrial', 'Ecotech III', 'Gautam Buddha University', 'Pari Chowk Grid', 'Sector 150 Link', 'Sector 144 Hub'
  ]
};

export const getSectorNamesForCity = (cityName: string): string[] => {
  const normalized = cityName.trim();
  const matchedKey = Object.keys(CUSTOM_CITY_SECTORS).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );
  if (matchedKey) {
    return CUSTOM_CITY_SECTORS[matchedKey];
  }

  // Find the country of the city to determine the most authentic local naming style
  const cityData = CITIES.find(c => c.name.toLowerCase() === normalized.toLowerCase());
  const country = cityData ? cityData.country : 'India';

  // Simple deterministic random seed generator based on the city name
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const getRand = () => {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };

  const indianPool = [
    'Sector 3', 'Sector 8', 'Sector 12', 'Sector 15', 'Sector 21', 
    'Sector 32', 'Sector 45', 'Civil Lines', 'Model Town', 'Shastri Nagar', 
    'Rajendra Nagar', 'Indira Nagar', 'Industrial Area Phase 1', 'Industrial Area Phase 2', 
    'Railway Colony', 'Subhash Chowk', 'Vijay Nagar', 'Sanjay Enclave', 
    'Gandhi Bazar', 'Defense Colony', 'Green Valley Grid', 'Tech Park Crossing', 
    'Expressway Corridor', 'Ring Road Bypass', 'Ambedkar Chowk', 'Nehru Colony', 
    'Adarsh Nagar', 'Patel Nagar', 'Commercial Hub Sector A', 'Residential Block C',
    'Civic Center Grid', 'New Cantt Road', 'Saraswati Vihar', 'Ganga Enclave', 
    'Krishna Nagar', 'South Extension', 'Hanuman Chowk', 'NH Highway Junction', 
    'Eco-Park Perimeter', 'Bus Stand Road'
  ];

  const globalPool = [
    'Downtown Core', 'Midtown Center', 'Uptown Residential', 'West End District',
    'Eastside Industrial', 'Waterfront Plaza', 'Financial District', 'Oak Ridge Parkway',
    'Maple Valley Boulevard', 'Airport Terminal Link', 'Harbor View Quay', 'Greenwich Meadows',
    'Technology Corridor', 'Central Park Sector', 'Riverwalk Promenade', 'High Street Crossing',
    'Kings Square', 'Southside Heights', 'North Ridge Sector', 'Industrial Park Lane',
    'Civic Square', 'Crescent Way', 'Bridge Street Bridge', 'Saint Marys Close',
    'Victoria Gardens', 'Regent Street Loop', 'Lakeside Terraces', 'Metro Transit Hub',
    'Pine Crest Boulevard', 'Forest Hills Green', 'Prospect Heights', 'Beacon Hill Sector',
    'Sunset Boulevard', 'Spring Gardens', 'Station Road Sector', 'Corporate Business Park'
  ];

  const pool = country === 'India' ? indianPool : globalPool;

  // Shuffle the pool deterministically using the seed
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(getRand() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  // Select the top 16 names and prefix them with the city name for complete personalization
  return shuffled.slice(0, 16).map((locationName) => `${cityName} ${locationName}`);
};

export const REALISTIC_CITY_AQI: Record<string, number> = {
  'Singapore': 36,
  'New York': 42,
  'New Delhi': 218,
  'Gurugram': 195,
  'Noida': 205,
  'Faridabad': 198,
  'Patna': 185,
  'Lucknow': 145,
  'Ghaziabad': 210,
  'Chandigarh': 68,
  'Bhiwadi': 225,
  'Bhutan': 24,
  'HongKong': 58,
  'Beijing': 98,
  'Moscow': 45,
  'Seoul': 62,
  'Paris': 42,
  'Tokyo': 32,
  'California': 45,
  'Seattle': 28,
  'Indore': 76,
  'Vijaywada': 72,
  'Chennai': 92,
  'Mumbai': 148,
  'Nagpur': 74,
  'Hyderabad': 88,
  'Pune': 78,
  'Dehradun': 65,
  'Jammu': 72,
  'Rohtak': 142,
  'Kashmir': 32,
  'Shimla': 28,
  'Jalandhar': 118,
  'Guwahati': 115,
  'Dhaka': 165,
  'Kathmandu': 112,
  'Gangtok': 26,
  'Lahore': 245,
  'Gandhinagar': 58,
  'Pondicherry': 42,
  'Udupi': 38,
  'Shillong': 32,
  'Siliguri': 72,
  'Kabul': 175,
  'Karachi': 155,
  'Wellington': 18,
  'Amsterdam': 32,
  'Auckland': 22,
  'Adelaide': 25,
  'Bangalore': 84,
  'Bengaluru': 84,
  'Banglore': 84,
  'Mysuru': 45,
  'Amravati': 68,
  'Bhubaneshwar': 82,
  'Ranchi': 92,
  'Raipur': 118,
  'Greater Noida': 195,
  'Hutan': 135,
  'Oslo': 20,
  'Zurich': 22,
  'Stockholm': 18,
  'Copenhagen': 21,
  'Jind': 165,
  'Ambala': 115,
  'Hissar': 145,
  'Sirsa': 112,
  'Ladwa': 98,
  'Kurukshetra': 115,
  'Naraingarh': 85,
  'Bhiwani': 155,
  'Goa': 45,
  'Daman': 82,
  'Diu': 62,
  'Srinagar': 42,
  'Delhi': 218,
  'Kharagpur': 98,
  'Sydney': 24,
  'Melbourne': 22,
  'London': 34,
  'France': 38,
  'Berlin': 30,
  'Toronto': 25,
  'Guntur': 94,
  'Mangalagiri': 82,
  'Ongole': 72,
  'Nellore': 68,
  'Vellore': 85,
  'Madras': 92,
  'Trichy': 72,
  'Surathkal': 52,
  'Rourkela': 125,
  'Jaipur': 112,
  'Salasar': 78,
  'Cambridge': 22,
  'WashingtonDC': 34,
  'Cuba': 45,
  'Ireland': 18,
  'Ukraine': 58,
  'Iran': 118,
  'Iraq': 145,
  'Russia': 42,
  'Indonesia': 112,
  'Jamaica': 38,
  'Nigeria': 135,
  'SouthAfrica': 72,
  'Italy': 52,
  'Brazil': 48,
  'NewZealand': 15,
  'Dharampur': 54,
  'Ladakh': 25,
  'Leh': 26,
  'Yamunanagar': 142,
  'Hansi': 125,
  'Vishakhapatnam': 82,
  'Coimbatore': 58,
  'Ooty': 22,
  'Munnar': 18,
  'Meghalaya': 24,
  'Mawsynram': 15,
  'Nagaland': 28,
  'Kohinoor': 35,
  'Agartala': 68,
  'Aizawl': 28,
  'Silchar': 58,
  'Nepal': 85,
  'Bhilai': 112
};

export const getRealisticAqi = (cityName: string): number => {
  const normalized = cityName.trim();
  const matchedKey = Object.keys(REALISTIC_CITY_AQI).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );
  if (matchedKey) {
    return REALISTIC_CITY_AQI[matchedKey];
  }
  
  const city = CITIES.find(c => c.name.toLowerCase() === normalized.toLowerCase());
  if (city) {
    return Math.round(city.pollution * 3);
  }
  return 85;
};

