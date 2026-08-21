const names = [ '2 Layer 8 inch Standard', '3 Layer 6 inch Standard', '2 Layer 6 inch Standard', '3 Layer 8 inch Standard', 'Custom Birthday Cake (8 Inch)', 'Custom Birthday Cake (6 Inch)', 'Vintage Heart (6 Inch)' ]; 

const sorted1 = [...names].sort((a,b) => a.localeCompare(b, undefined, {numeric:true})); 
console.log('Locale Compare Only:', sorted1); 

const sorted2 = [...names].sort((a,b) => { 
  const sizeA = parseInt(a.match(/(\d+)\s*(inch|")/i)?.[1] || '0', 10); 
  const sizeB = parseInt(b.match(/(\d+)\s*(inch|")/i)?.[1] || '0', 10); 
  if (sizeA !== sizeB && sizeA !== 0 && sizeB !== 0) return sizeA - sizeB; 
  return a.localeCompare(b, undefined, {numeric:true}); 
}); 
console.log('\nSize extraction first:', sorted2);
